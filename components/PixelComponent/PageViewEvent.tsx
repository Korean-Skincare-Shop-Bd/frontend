"use client";

import { generateEventId } from "@/lib/utils";
import { sendCapiEvent } from "@/lib/meta/track";
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
    sendCapiEvent({ eventName, eventId: eventID });
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", eventName, {}, { eventID });
    }
  }, [eventName, pathname]);

  return null;
}
