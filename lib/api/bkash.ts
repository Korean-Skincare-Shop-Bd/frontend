import { adminFetch } from "./adminFetch";
import type { TrackItem, TrackUser } from "@/lib/tracking";
import { getMetaIdentifiers } from "@/lib/meta/identity";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const PENDING_KEY = "bkash_pending_order";

export interface BkashPendingOrder {
  orderId: string;
  sessionId: string;
}

export interface BkashPaymentStatus {
  paymentID: string;
  status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  amount: number;
  trxID: string | null;
  orderNumber: string;
  errorMessage: string | null;
}

const PURCHASE_KEY = "bkash_pending_purchase";

export interface BkashPendingPurchase {
  eventId: string;
  transactionId: string;
  value: number;
  shipping: number;
  items: TrackItem[];
  user: TrackUser;
}

/**
 * The browser Purchase event for a bKash order may only fire once the payment
 * is confirmed, but the customer leaves the site to pay. Keep the details here
 * until they come back to /payment/success.
 */
export function savePendingBkashPurchase(purchase: BkashPendingPurchase) {
  try {
    sessionStorage.setItem(PURCHASE_KEY, JSON.stringify(purchase));
  } catch {
    /* storage unavailable: the server-side Purchase still counts the sale */
  }
}

/** Returns the stored purchase for this order exactly once, then forgets it. */
export function takePendingBkashPurchase(orderId?: string): BkashPendingPurchase | null {
  try {
    const raw = sessionStorage.getItem(PURCHASE_KEY);
    if (!raw) return null;
    const purchase = JSON.parse(raw) as BkashPendingPurchase;
    if (orderId && purchase.transactionId !== orderId) return null;
    sessionStorage.removeItem(PURCHASE_KEY);
    return purchase;
  } catch {
    return null;
  }
}

/** Remember the order so the failure page can offer "try again". */
export function savePendingBkashOrder(order: BkashPendingOrder) {
  try {
    sessionStorage.setItem(PENDING_KEY, JSON.stringify(order));
  } catch {
    /* storage unavailable: retry just won't be offered */
  }
}

export function loadPendingBkashOrder(): BkashPendingOrder | null {
  try {
    const raw = sessionStorage.getItem(PENDING_KEY);
    return raw ? (JSON.parse(raw) as BkashPendingOrder) : null;
  } catch {
    return null;
  }
}

export function clearPendingBkashOrder() {
  try {
    sessionStorage.removeItem(PENDING_KEY);
  } catch {
    /* ignore */
  }
}

/** Ask the backend to create the bKash payment. The amount is priced server-side. */
export async function createBkashPayment(
  order: BkashPendingOrder
): Promise<{ paymentID: string; bkashURL: string }> {
  const response = await fetch(`${API_BASE_URL}/bkash/create-payment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    // The Meta identifiers let the backend attribute the Purchase it sends
    // once the payment is confirmed (the callback has no access to the cookies).
    body: JSON.stringify({ ...order, meta: getMetaIdentifiers() }),
  });
  const body = await response.json().catch(() => null);
  if (!response.ok || !body?.success) {
    throw new Error(body?.message || "Unable to start bKash payment");
  }
  return body.data;
}

export async function getBkashPaymentStatus(
  paymentID: string
): Promise<BkashPaymentStatus> {
  const response = await fetch(
    `${API_BASE_URL}/bkash/status/${encodeURIComponent(paymentID)}`,
    { cache: "no-store" }
  );
  const body = await response.json().catch(() => null);
  if (!response.ok || !body?.success) {
    throw new Error(body?.message || "Unable to load payment status");
  }
  return body.data;
}

export interface AdminBkashPayment {
  paymentID: string;
  orderNumber: string;
  status: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  trxID: string | null;
  amount: number;
  refundedAmount: number;
  refundable: number;
  refunds: {
    at: string;
    amount: number;
    reason: string;
    refundTrxID: string | null;
    by: string | null;
  }[];
}

export async function getAdminBkashPayment(orderId: string): Promise<AdminBkashPayment> {
  const response = await adminFetch(`/bkash/admin/orders/${encodeURIComponent(orderId)}/payment`);
  const body = await response.json().catch(() => null);
  if (!response.ok || !body?.success) {
    throw new Error(body?.message || "Unable to load bKash payment");
  }
  return body.data;
}

export interface RefundRequest {
  paymentID: string;
  amount: number;
  reason: string;
  confirmOrderNumber: string;
  idempotencyKey: string;
}

/** Error carrying `unknown: true` when bKash gave no answer (do NOT retry). */
export class RefundOutcomeUnknownError extends Error {
  unknown = true;
}

export async function refundBkashPayment(
  request: RefundRequest
): Promise<{ refundTrxID: string; amount: number; fullyRefunded: boolean }> {
  const response = await adminFetch(`/bkash/refund`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });
  const body = await response.json().catch(() => null);
  if (body?.unknown) throw new RefundOutcomeUnknownError(body.message);
  if (!response.ok || !body?.success) {
    const detail = body?.errors?.[0]?.message;
    throw new Error(body?.message || detail || "Refund failed");
  }
  return body.data;
}
