"use client";

import { useEffect, useState } from "react";
import { readCookie, repairFbcCookie, writeFbcCookie } from "@/lib/meta/cookies";

// fbc = fb.<subdomainIndex>.<creationTime>.<fbclid>, optionally followed by an
// appendix (".<suffix>") when written by Meta's own libraries.
function fbcHasFbclid(fbc: string, fbclid: string): boolean {
  const clickPart = fbc.split(".").slice(3).join(".");
  return clickPart === fbclid || clickPart.startsWith(`${fbclid}.`);
}

export default function useFbIds() {
  const [fbIds, setFbIds] = useState<{ fbc?: string; fbp?: string }>({});

  useEffect(() => {
    repairFbcCookie();

    let fbc = readCookie("_fbc");
    const fbclid = new URLSearchParams(window.location.search).get("fbclid");

    // Meta: (re)write _fbc when it is missing OR when the URL carries a
    // different fbclid than the cookie (a new ad click).
    if (fbclid && (!fbc || !fbcHasFbclid(fbc, fbclid))) {
      fbc = writeFbcCookie(fbclid);
    }

    setFbIds({ fbc, fbp: readCookie("_fbp") });
  }, []);

  return fbIds;
}
