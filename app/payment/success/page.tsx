"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BkashPaymentStatus,
  clearPendingBkashOrder,
  getBkashPaymentStatus,
  takePendingBkashPurchase,
} from "@/lib/api/bkash";
import { rememberContact } from "@/lib/meta/identity";
import { track } from "@/lib/tracking";
import { clearCart } from "@/lib/api/cart";

const POLL_MS = 3000;
const MAX_POLLS = 5;

function SuccessContent() {
  const params = useSearchParams();
  const router = useRouter();
  const paymentID = params.get("paymentID");
  const [payment, setPayment] = useState<BkashPaymentStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!paymentID) {
      router.replace("/payment/failure?message=Invalid%20payment%20response");
      return;
    }

    let cancelled = false;
    let attempts = 0;

    // The URL is not proof of payment: ask the backend what it recorded.
    const load = async () => {
      try {
        const status = await getBkashPaymentStatus(paymentID);
        if (cancelled) return;
        if (status.status === "PAID" || status.status === "REFUNDED") {
          setPayment(status);
          // Payment confirmed: only now count the sale in GTM/Meta/GA4. The
          // stored purchase is handed out once, so a refresh cannot repeat it.
          if (status.status === "PAID") {
            const purchase = takePendingBkashPurchase();
            if (purchase) {
              rememberContact(purchase.user);
              track({ event: "purchase", ...purchase });
            }
          }
          clearPendingBkashOrder();
          await clearCart();
        } else if (status.status === "PENDING" && ++attempts < MAX_POLLS) {
          setTimeout(load, POLL_MS);
        } else {
          const message = encodeURIComponent(
            status.errorMessage || "We could not confirm your payment."
          );
          router.replace(
            `/payment/failure?paymentID=${encodeURIComponent(paymentID)}&message=${message}${
              status.status === "PENDING" ? "&pending=1" : ""
            }`
          );
        }
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Unable to load payment status");
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [paymentID, router]);

  if (error) {
    return <p className="text-center text-destructive">{error}</p>;
  }
  if (!payment) {
    return (
      <div className="flex items-center justify-center gap-2 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" /> Confirming your payment...
      </div>
    );
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader className="items-center text-center">
        <CheckCircle className="h-12 w-12 text-green-600" />
        <CardTitle data-testid="payment-success-title">Payment successful</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-center">
        <p>
          Order <strong data-testid="payment-order-number">{payment.orderNumber}</strong> is confirmed.
        </p>
        <p className="text-sm text-muted-foreground">
          Amount: ৳{payment.amount.toLocaleString()} · bKash TrxID:{" "}
          <span data-testid="payment-trx-id">{payment.trxID}</span>
        </p>
        <Button asChild className="w-full">
          <Link href="/">Continue shopping</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function PaymentSuccessPage() {
  return (
    <main className="container mx-auto px-4 py-16">
      <Suspense fallback={null}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
