"use client";

import { useEffect, useState } from "react";

export default function useFbIds() {
  const [fbIds, setFbIds] = useState<{ fbclid?: string; fbp?: string }>({});

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1️⃣ Get fbclid from URL
    const urlParams = new URLSearchParams(window.location.search);
    let fbclid = urlParams.get("fbclid") || undefined;

    // Optional: store fbclid in cookie for persistence
    if (fbclid) {
      document.cookie = `fbclid=${fbclid}; path=/; max-age=${60 * 60 * 24 * 7}`;
    } else {
      // Try reading from cookie if URL param missing
      const match = document.cookie.match(/(^|;) *fbclid=([^;]+)/);
      fbclid = match ? match[2] : undefined;
    }

    // 2️⃣ Get fbp from cookie (set by Pixel automatically)
    const fbpMatch = document.cookie.match(/(^|;) *_fbp=([^;]+)/);
    const fbp = fbpMatch ? fbpMatch[2] : undefined;

    setFbIds({ fbclid, fbp });
  }, []);

  return fbIds;
}
