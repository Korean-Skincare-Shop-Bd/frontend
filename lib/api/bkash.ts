import { adminFetch } from "./adminFetch";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const BKASH_ENABLED = process.env.NEXT_PUBLIC_BKASH_ENABLED === "true";

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
    body: JSON.stringify(order),
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
