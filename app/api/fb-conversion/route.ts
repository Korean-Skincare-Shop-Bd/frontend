// Facebook Conversion API route (Next.js App Router)

import {
  compact, firstIp, normalizeCity, normalizeCountry, normalizeEmail,
  normalizeExternalId, normalizeName, normalizePhone, normalizeZip,
} from "@/lib/meta/normalize";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const {
      eventName,
      eventId,
      eventTime,
      customData = {},
      customerData = {},
    } = await request.json();
    const cookieStore = await cookies();

    const pixelId = process.env.NEXT_FB_PIXEL_ID;
    const accessToken = process.env.NEXT_FB_PIXEL_ACCESS_TOKEN;

    if (!pixelId || !accessToken) {
      return NextResponse.json(
        { error: "Facebook Pixel configuration missing" },
        { status: 500 }
      );
    }

    const fbUrl = `https://graph.facebook.com/v23.0/${pixelId}/events?access_token=${accessToken}`;

    let fbc = cookieStore.get("_fbc")?.value;
    if (!fbc) {
      const legacyFbclid = cookieStore.get("fbclid")?.value;
      if (legacyFbclid) fbc = `fb.1.${Date.now()}.${legacyFbclid}`;
    }
    const fbp = cookieStore.get("_fbp")?.value;
    const userData = compact({
      em: normalizeEmail(customerData.email),
      ph: normalizePhone(customerData.phone),
      fn: normalizeName(customerData.firstName),
      ln: normalizeName(customerData.lastName),
      ct: normalizeCity(customerData.city),
      zp: normalizeZip(customerData.zip),
      country: normalizeCountry(customerData.country ?? "BD"),
      external_id: normalizeExternalId(customerData.externalId ?? cookieStore.get("ks_external_id")?.value),
      fbc, fbp,
      client_ip_address: firstIp(request.headers.get("x-forwarded-for")),
      client_user_agent: request.headers.get("user-agent") ?? undefined,
    });

    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: eventTime,
          event_id: eventId,
          action_source: "website",
          user_data: userData,
          custom_data: customData,
          original_event_data: {
            event_name: eventName,
            event_time: eventTime,
          },
        },
      ],
    };
    if (process.env.NODE_ENV !== "production") console.log("[CAPI] payload", JSON.stringify(payload));
    const response = await fetch(fbUrl, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("[CAPI] Meta rejected event", { eventName, status: response.status, error: result?.error?.message, fbtrace_id: result?.error?.fbtrace_id });
      return NextResponse.json(
        { error: "Facebook API request failed", details: result },
        { status: response.status }
      );
    }

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("FB Conversion API Error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
