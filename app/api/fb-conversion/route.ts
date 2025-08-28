// Facebook Conversion API route (Next.js App Router)

import { hashSHA256 } from "@/lib/utils";
import { cookies } from "next/dist/server/request/cookies";
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

    const fbc = cookieStore.get("fbclid")?.value;
    const fbp = cookieStore.get("_fbp")?.value;

    const payload = {
      data: [
        {
          event_name: eventName,
          event_time: eventTime,
          event_id: eventId,
          action_source: "website",
          user_data: {
            ...customerData,
            fbc,
            fbp,
            country: [hashSHA256("BD")],
          },
          custom_data: customData,
          original_event_data: {
            event_name: eventName,
            event_time: eventTime,
          },
        },
      ],
    };
    console.log("Facebook Conversion API Payload:", JSON.stringify(payload));
    const response = await fetch(fbUrl, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Facebook API Error:", result);
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
