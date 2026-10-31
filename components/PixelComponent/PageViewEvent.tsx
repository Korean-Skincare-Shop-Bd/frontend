"use client";

import { generateEventId } from "@/lib/utils";
import useFbIds from "@/hooks/useFbIds";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { track } from "@/lib/tracking";

export default function PageViewEvent() {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);
  useFbIds();

  useEffect(() => {
    // Guard against double-invocation (React strict mode) so one navigation = one page_view.
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    // Browser-only (no CAPI call) to save function invocations.
    track({ event: "page_view", eventId: generateEventId() });
  }, [pathname]);

  return null;
}
