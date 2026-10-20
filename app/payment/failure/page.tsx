"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RetryBkashButton } from "@/components/payment/RetryBkashButton";

function FailureContent() {
  const params = useSearchParams();
  const message = params.get("message") || "Your payment could not be completed.";
  const stillProcessing = params.get("pending") === "1";
  const Icon = stillProcessing ? Clock : AlertCircle;

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader className="items-center text-center">
        <Icon
          className={`h-12 w-12 ${stillProcessing ? "text-amber-500" : "text-destructive"}`}
        />
        <CardTitle data-testid="payment-failure-title">
          {stillProcessing ? "Confirming your payment" : "Payment failed"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <p data-testid="payment-failure-message" className="text-muted-foreground">
          {message}
        </p>
        {stillProcessing ? (
          <p className="text-sm text-muted-foreground">
            If money was deducted from your bKash account, your order will be
            confirmed shortly. Please do not pay again.
          </p>
        ) : (
          <RetryBkashButton />
        )}
        <Button asChild variant="outline" className="w-full">
          <Link href="/">Back to shop</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

export default function PaymentFailurePage() {
  return (
    <main className="container mx-auto px-4 py-16">
      <Suspense fallback={null}>
        <FailureContent />
      </Suspense>
    </main>
  );
}
