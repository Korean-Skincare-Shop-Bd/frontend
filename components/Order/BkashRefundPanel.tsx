"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AlertTriangle, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import {
  AdminBkashPayment,
  getAdminBkashPayment,
  refundBkashPayment,
} from "@/lib/api/bkash";

const money = (n: number) => `৳${n.toFixed(2)}`;

interface Props {
  orderId: string;
  /** Called after a refund so the orders list/dialog can refresh. */
  onRefunded?: (info: { fullyRefunded: boolean }) => void;
}

/**
 * bKash refund section for the admin order dialog.
 * Safeguards: explicit amount + reason, retype the order number, one-time
 * idempotency key per dialog, button locks while the request is in flight,
 * and a hard "do not retry" message if bKash gives no answer.
 */
export function BkashRefundPanel({ orderId, onRefunded }: Props) {
  const { toast } = useToast();
  const [payment, setPayment] = useState<AdminBkashPayment | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const [amountText, setAmountText] = useState("");
  const [reason, setReason] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [blockedMessage, setBlockedMessage] = useState<string | null>(null);
  const [idempotencyKey, setIdempotencyKey] = useState("");

  const load = useCallback(async () => {
    try {
      setLoadError(null);
      setPayment(await getAdminBkashPayment(orderId));
    } catch (e: any) {
      setPayment(null);
      setLoadError(e?.message || "Unable to load bKash payment");
    }
  }, [orderId]);

  useEffect(() => {
    load();
  }, [load]);

  const openDialog = () => {
    if (!payment) return;
    setAmountText(payment.refundable.toFixed(2));
    setReason("");
    setConfirmText("");
    setBlockedMessage(null);
    setIdempotencyKey(crypto.randomUUID()); // one key per dialog session
    setOpen(true);
  };

  const amount = Number(amountText);
  const amountValid = useMemo(
    () =>
      !!payment &&
      /^\d+(\.\d{1,2})?$/.test(amountText) &&
      amount > 0 &&
      amount <= payment.refundable + 0.001,
    [amountText, amount, payment]
  );
  const reasonValid = reason.trim().length >= 3;
  const confirmValid = !!payment && confirmText.trim() === payment.orderNumber;
  const canSubmit =
    amountValid && reasonValid && confirmValid && !submitting && !blockedMessage;

  const submit = async () => {
    if (!payment || !canSubmit) return;
    setSubmitting(true);
    try {
      const result = await refundBkashPayment({
        paymentID: payment.paymentID,
        amount,
        reason: reason.trim(),
        confirmOrderNumber: confirmText.trim(),
        idempotencyKey,
      });
      toast({
        title: "Refund completed",
        description: `${money(result.amount)} refunded via bKash (TrxID ${result.refundTrxID}).`,
      });
      setOpen(false);
      await load();
      onRefunded?.({ fullyRefunded: result.fullyRefunded });
    } catch (e: any) {
      if (e?.unknown) {
        // Outcome unknown: keep the dialog locked so nobody retries blindly.
        setBlockedMessage(e.message);
      } else {
        toast({
          title: "Refund failed",
          description: e?.message || "Refund failed",
          variant: "destructive",
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loadError) {
    return (
      <div>
        <h4 className="mb-2 font-medium text-sm">bKash Payment</h4>
        <p className="text-muted-foreground text-sm">{loadError}</p>
      </div>
    );
  }
  if (!payment) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading bKash payment...
      </div>
    );
  }

  const canRefund = payment.status === "PAID" && payment.refundable > 0;

  return (
    <div data-testid="bkash-refund-panel">
      <h4 className="mb-2 font-medium text-sm">bKash Payment &amp; Refund</h4>
      <div className="space-y-2 bg-muted p-3 rounded-lg text-sm">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{payment.status}</Badge>
          <span>Paid {money(payment.amount)}</span>
          <span>· Refunded {money(payment.refundedAmount)}</span>
          <span>· Refundable {money(payment.refundable)}</span>
        </div>
        <p className="text-muted-foreground text-xs break-all">
          TrxID: {payment.trxID ?? "-"} · Payment ID: {payment.paymentID}
        </p>
        {payment.refunds.length > 0 && (
          <ul className="space-y-1 pt-1 border-t text-xs">
            {payment.refunds.map((r, i) => (
              <li key={i}>
                {money(r.amount)} on {new Date(r.at).toLocaleString()} by {r.by ?? "admin"} -{" "}
                {r.reason} ({r.refundTrxID})
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-3">
        <Button
          size="sm"
          variant="outline"
          disabled={!canRefund}
          onClick={openDialog}
          data-testid="open-refund">
          <RotateCcw className="mr-2 w-4 h-4 text-orange-600" />
          Refund via bKash...
        </Button>
        {!canRefund && (
          <p className="mt-1 text-muted-foreground text-xs">
            {payment.status === "REFUNDED"
              ? "Fully refunded."
              : "Only paid bKash payments can be refunded."}
          </p>
        )}
      </div>

      <AlertDialog open={open} onOpenChange={(v) => !submitting && setOpen(v)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              Refund order {payment.orderNumber}
            </AlertDialogTitle>
            <AlertDialogDescription>
              This sends money back to the customer&apos;s bKash wallet and{" "}
              <strong>cannot be undone</strong>. Refundable now:{" "}
              <strong>{money(payment.refundable)}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {blockedMessage ? (
            <div
              role="alert"
              data-testid="refund-unknown"
              className="bg-destructive/10 p-3 rounded-md text-destructive text-sm">
              {blockedMessage}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-1">
                <Label htmlFor="refund-amount">Amount to refund (BDT)</Label>
                <div className="flex gap-2">
                  <Input
                    id="refund-amount"
                    inputMode="decimal"
                    value={amountText}
                    onChange={(e) => setAmountText(e.target.value)}
                    disabled={submitting}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={submitting}
                    onClick={() => setAmountText(payment.refundable.toFixed(2))}>
                    Full
                  </Button>
                </div>
                {!amountValid && (
                  <p className="text-destructive text-xs">
                    Enter an amount up to {money(payment.refundable)} (max 2 decimals).
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="refund-reason">Reason</Label>
                <Textarea
                  id="refund-reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  maxLength={250}
                  disabled={submitting}
                  placeholder="Why is this being refunded?"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="refund-confirm">
                  Type the order number <strong>{payment.orderNumber}</strong> to confirm
                </Label>
                <Input
                  id="refund-confirm"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  autoComplete="off"
                  disabled={submitting}
                />
              </div>

              {!canSubmit && !submitting && (
                <p className="text-xs text-muted-foreground" data-testid="refund-missing">
                  To enable the refund button:{" "}
                  {[
                    !amountValid && "enter a valid amount within the refundable balance",
                    !reasonValid && "enter a reason (at least 3 characters)",
                    !confirmValid && "type the order number exactly",
                  ]
                    .filter(Boolean)
                    .join("; ")}
                  .
                </p>
              )}
            </div>
          )}

          <AlertDialogFooter>
            <Button variant="outline" disabled={submitting} onClick={() => setOpen(false)}>
              {blockedMessage ? "Close" : "Cancel"}
            </Button>
            {!blockedMessage && (
              <Button
                variant="destructive"
                disabled={!canSubmit}
                onClick={submit}
                data-testid="confirm-refund">
                {submitting && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
                Refund {amountValid ? money(amount) : ""}
              </Button>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
