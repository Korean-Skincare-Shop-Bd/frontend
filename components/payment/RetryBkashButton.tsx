"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  BkashPendingOrder,
  createBkashPayment,
  loadPendingBkashOrder,
} from "@/lib/api/bkash";

/** Re-creates the bKash payment for the order the customer just placed. */
export function RetryBkashButton() {
  const [pending, setPending] = useState<BkashPendingOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPending(loadPendingBkashOrder());
  }, []);

  if (!pending) return null;

  const retry = async () => {
    setLoading(true);
    setError(null);
    try {
      const payment = await createBkashPayment(pending);
      window.location.href = payment.bkashURL;
    } catch (e: any) {
      setError(e?.message || "Unable to start bKash payment");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Button onClick={retry} disabled={loading} className="w-full">
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Try bKash payment again
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
