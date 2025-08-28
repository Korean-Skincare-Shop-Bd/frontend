"use client";

import useFbIds from "@/hooks/useFbIds";
import { generateEventId } from "@/lib/utils";
import { useEffect } from "react";

export default function PageViewEvent({
  eventName = "PageView",
}: {
  eventName?: string;
}) {
  const eventID = generateEventId();
  const { fbclid, fbp } = useFbIds();

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", eventName, {
        eventID: eventID,
        fbc: fbclid,
        fbp: fbp,
      });
    }
  }, [eventID, fbclid, fbp]);

  return null;
}
