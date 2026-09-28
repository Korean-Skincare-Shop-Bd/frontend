"use client";

import { useEffect, useState } from "react";
import { readCookie, repairFbcCookie, writeFbcCookie } from "@/lib/meta/cookies";

export default function useFbIds() {
  const [fbIds, setFbIds] = useState<{ fbc?: string; fbp?: string }>({});

  useEffect(() => {
    repairFbcCookie();

    let fbc = readCookie("_fbc");
    if (!fbc) {
      const fbclid = new URLSearchParams(window.location.search).get("fbclid");
      if (fbclid) fbc = writeFbcCookie(fbclid);
    }

    setFbIds({ fbc, fbp: readCookie("_fbp") });
  }, []);

  return fbIds;
}
