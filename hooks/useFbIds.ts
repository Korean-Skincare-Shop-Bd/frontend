"use client";

import { useEffect, useState } from "react";

const readCookie = (name: string) => {
  const match = document.cookie.match(new RegExp(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`));
  return match ? decodeURIComponent(match[2]) : undefined;
};

export default function useFbIds() {
  const [fbIds, setFbIds] = useState<{ fbc?: string; fbp?: string }>({});

  useEffect(() => {
    if (typeof window === "undefined") return;

    let fbc = readCookie("_fbc");
    if (!fbc) {
      const fbclid = new URLSearchParams(window.location.search).get("fbclid");
      if (fbclid) {
        fbc = `fb.1.${Date.now()}.${fbclid}`;
        document.cookie = `_fbc=${encodeURIComponent(fbc)}; path=/; max-age=${60 * 60 * 24 * 90}; SameSite=Lax`;
      }
    }
    setFbIds({ fbc, fbp: readCookie("_fbp") });
  }, []);

  return fbIds;
}
