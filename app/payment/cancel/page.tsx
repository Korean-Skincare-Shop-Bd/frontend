"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RetryBkashButton } from "@/components/payment/RetryBkashButton";

export default function PaymentCancelPage() {
  return (
    <main className="container mx-auto px-4 py-16">
      <Card className="mx-auto max-w-md">
        <CardHeader className="items-center text-center">
          <XCircle className="h-12 w-12 text-muted-foreground" />
          <CardTitle data-testid="payment-cancel-title">Payment cancelled</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-muted-foreground">
            You cancelled the bKash payment. Your order is saved and nothing was charged.
          </p>
          <RetryBkashButton />
          <Button asChild variant="outline" className="w-full">
            <Link href="/">Back to shop</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
