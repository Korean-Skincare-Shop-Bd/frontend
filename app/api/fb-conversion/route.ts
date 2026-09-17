import {
  compact, firstIp, normalizeCity, normalizeCountry, normalizeEmail,
  normalizeExternalId, normalizeName, normalizePhone, normalizeZip,
} from "@/lib/meta/normalize";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const ALLOWED_EVENTS = new Set(["PageView", "ViewContent", "Search", "AddToCart", "InitiateCheckout", "Purchase"]);
const MAX_REQUESTS_PER_MINUTE = 30;
const requestCounts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(key: string) {
  const now = Date.now();
  const current = requestCounts.get(key);
  if (!current || current.resetAt <= now) {
    requestCounts.set(key, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  current.count += 1;
  return current.count > MAX_REQUESTS_PER_MINUTE;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasSafeEventData(value: unknown, depth = 0): boolean {
  if (depth > 4) return false;
  if (value === null || typeof value === "boolean" || typeof value === "number") return true;
  if (typeof value === "string") return value.length <= 500;
  if (Array.isArray(value)) return value.length <= 25 && value.every((item) => hasSafeEventData(item, depth + 1));
  return isPlainObject(value)
    && Object.keys(value).length <= 30
    && Object.entries(value).every(([key, item]) => key.length <= 80 && hasSafeEventData(item, depth + 1));
}

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

export async function POST(request: NextRequest) {
  try {
    const clientIp = firstIp(request.headers.get("x-forwarded-for")) ?? "unknown";
    if (isRateLimited(clientIp)) return NextResponse.json({ error: "Too many requests" }, { status: 429 });

    const body: unknown = await request.json();
    if (!isPlainObject(body)) return NextResponse.json({ error: "Invalid event payload" }, { status: 400 });
    const { eventName, eventId, eventTime, customData = {}, customerData = {} } = body;
    const nowInSeconds = Math.floor(Date.now() / 1000);
    if (
      typeof eventName !== "string" || !ALLOWED_EVENTS.has(eventName) ||
      typeof eventId !== "string" || eventId.length < 8 || eventId.length > 128 ||
      typeof eventTime !== "number" || !Number.isInteger(eventTime) || Math.abs(nowInSeconds - eventTime) > 86_400 ||
      !hasSafeEventData(customData) || !isPlainObject(customerData) || !hasSafeEventData(customerData)
    ) return NextResponse.json({ error: "Invalid event payload" }, { status: 400 });

    const cookieStore = await cookies();
    const pixelId = process.env.NEXT_FB_PIXEL_ID;
    const accessToken = process.env.NEXT_FB_PIXEL_ACCESS_TOKEN;
    if (!pixelId || !accessToken) {
      console.error("Facebook Pixel configuration missing");
      return NextResponse.json({ error: "Tracking is unavailable" }, { status: 503 });
    }

    let fbc = cookieStore.get("_fbc")?.value;
    if (!fbc) {
      const legacyFbclid = cookieStore.get("fbclid")?.value;
      if (legacyFbclid) fbc = `fb.1.${Date.now()}.${legacyFbclid}`;
    }
    const userData = compact({
      em: normalizeEmail(optionalString(customerData.email)), ph: normalizePhone(optionalString(customerData.phone)),
      fn: normalizeName(optionalString(customerData.firstName)), ln: normalizeName(optionalString(customerData.lastName)),
      ct: normalizeCity(optionalString(customerData.city)), zp: normalizeZip(optionalString(customerData.zip)),
      country: normalizeCountry(optionalString(customerData.country) ?? "BD"),
      external_id: normalizeExternalId(optionalString(customerData.externalId) ?? cookieStore.get("ks_external_id")?.value),
      fbc, fbp: cookieStore.get("_fbp")?.value, client_ip_address: clientIp,
      client_user_agent: request.headers.get("user-agent") ?? undefined,
    });

    const response = await fetch(`https://graph.facebook.com/v23.0/${pixelId}/events?access_token=${accessToken}`, {
      method: "POST",
      body: JSON.stringify({ data: [{ event_name: eventName, event_time: eventTime, event_id: eventId, action_source: "website", user_data: userData, custom_data: customData, original_event_data: { event_name: eventName, event_time: eventTime } }] }),
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) {
      console.error("Meta rejected event", { eventName, status: response.status });
      return NextResponse.json({ error: "Tracking request failed" }, { status: 502 });
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid event payload" }, { status: 400 });
  }
}
