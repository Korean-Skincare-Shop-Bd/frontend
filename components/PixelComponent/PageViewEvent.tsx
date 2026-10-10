"use client";

import { generateEventId } from "@/lib/utils";
import useFbIds from "@/hooks/useFbIds";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function PageViewEvent({
  eventName = "PageView",
}: {
  eventName?: string;
}) {
  const pathname = usePathname();
  useFbIds();

  useEffect(() => {
    const eventID = generateEventId();
    // Browser pixel only: each server-side CAPI call is a Vercel function
    // invocation. Conversion events (AddToCart, InitiateCheckout, Purchase)
    // still go through CAPI.
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", eventName, {}, { eventID });
    }
  }, [eventName, pathname]);

  return null;
}
