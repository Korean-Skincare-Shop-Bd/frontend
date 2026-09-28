"use client";

// Values written by this app are stored raw (never URL-encoded) so they
// byte-match what the Meta Pixel writes and what the server reads via
// next/headers, which does not decode either.
export function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${escaped}=([^;]*)`));
  return match?.[1] || undefined;
}

// "koreanskincareshopbd.com" for "www.koreanskincareshopbd.com".
// Undefined for localhost, IP addresses and single-label hosts, where a
// Domain attribute cannot be used.
export function registrableDomain(): string | undefined {
  if (typeof window === "undefined") return undefined;
  const host = window.location.hostname;
  if (host === "localhost" || /^[\d.]+$/.test(host) || host.includes(":")) return undefined;
  const labels = host.split(".");
  if (labels.length < 2) return undefined;
  return labels.slice(-2).join(".");
}

const FBC_MAX_AGE = 60 * 60 * 24 * 90; // 90 days = Meta's click attribution window
const secureAttr = () =>
  typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";

// Repairs an _fbc cookie left behind by the previous (buggy) version, which
// wrote a host-only cookie while declaring subdomainIndex 1.
//
// Deleting without a Domain attribute removes ONLY the host-only cookie — the
// Pixel's own .domain cookie is a different slot and is left untouched. The
// value is then rewritten on the registrable domain, where index 1 is correct.
//
// Idempotent: if the cookie is already the Pixel's domain-scoped one, the
// delete is a no-op and the rewrite writes back an identical value.
export function repairFbcCookie(): void {
  const existing = readCookie("_fbc");
  if (!existing) return;

  const parts = existing.split(".");
  if (parts.length < 4 || parts[0] !== "fb") return;

  const domain = registrableDomain();
  if (!domain) return; // localhost / IP: nothing to repair

  const creationTime = parts[2];
  const fbclid = parts.slice(3).join("."); // fbclid may itself contain dots
  const repaired = `fb.1.${creationTime}.${fbclid}`;

  document.cookie = "_fbc=; path=/; max-age=0";
  document.cookie = `_fbc=${repaired}; path=/; max-age=${FBC_MAX_AGE}; SameSite=Lax; domain=.${domain}${secureAttr()}`;
}

// Builds and stores _fbc from a fresh ?fbclid= in the URL. Only used when the
// Pixel has not already written the cookie (blocked, or not yet loaded).
//
// Prefers a domain-scoped cookie (subdomainIndex 1). Some hosts reject a
// Domain on a public suffix — *.vercel.app previews, for example — so the
// write is read back, and on failure a host-only cookie is written with the
// correct index for the full hostname.
export function writeFbcCookie(fbclid: string): string | undefined {
  const domain = registrableDomain();

  if (domain) {
    const value = `fb.1.${Date.now()}.${fbclid}`;
    document.cookie = `_fbc=${value}; path=/; max-age=${FBC_MAX_AGE}; SameSite=Lax; domain=.${domain}${secureAttr()}`;
    if (readCookie("_fbc") === value) return value;
  }

  const labels = window.location.hostname.split(".").filter(Boolean);
  const subdomainIndex = Math.max(labels.length - 1, 0);
  const value = `fb.${subdomainIndex}.${Date.now()}.${fbclid}`;
  document.cookie = `_fbc=${value}; path=/; max-age=${FBC_MAX_AGE}; SameSite=Lax${secureAttr()}`;
  return readCookie("_fbc");
}
