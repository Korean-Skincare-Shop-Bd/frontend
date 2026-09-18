import { NextResponse, type NextRequest } from "next/server";
import { getFbPixelScript, GA_CONFIG_SCRIPT } from "@/lib/security/inline-scripts";

async function sha256Base64(value: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(value)
  );
  return btoa(String.fromCharCode(...Array.from(new Uint8Array(digest))));
}

// Hashes of the two fixed inline <script> bodies rendered by app/layout.tsx.
// Computed once per warm isolate and reused, since the content never
// changes at runtime.
let inlineScriptHashesPromise: Promise<[string, string]> | null = null;
function getInlineScriptHashes(): Promise<[string, string]> {
  if (!inlineScriptHashesPromise) {
    inlineScriptHashesPromise = Promise.all([
      sha256Base64(getFbPixelScript(process.env.NEXT_FB_PIXEL_ID ?? "")),
      sha256Base64(GA_CONFIG_SCRIPT),
    ]);
  }
  return inlineScriptHashesPromise;
}

async function contentSecurityPolicy() {
  const isDevelopment = process.env.NODE_ENV !== "production";

  const scriptSrc = ["'self'"];
  if (isDevelopment) {
    // Next.js development uses inline bootstrap code and eval for Fast Refresh.
    // Keep this relaxation development-only; production stays hash-based.
    scriptSrc.push("'unsafe-inline'", "'unsafe-eval'");
  } else {
    const [fbHash, gaHash] = await getInlineScriptHashes();
    scriptSrc.push(`'sha256-${fbHash}'`, `'sha256-${gaHash}'`);
  }
  scriptSrc.push(
    "https://connect.facebook.net",
    "https://www.googletagmanager.com"
  );

  return [
    "default-src 'self'",
    `script-src ${scriptSrc.join(" ")}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    `connect-src 'self' https:${isDevelopment ? " http://localhost:8000" : ""}`,
    "font-src 'self' data:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(isDevelopment ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set("Content-Security-Policy", await contentSecurityPolicy());
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  if (process.env.NODE_ENV === "production") {
    response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  }
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.xml|.*\\.txt|.*\\.(?:svg|png|jpg|jpeg|webp|gif|ico|css|js|woff|woff2|ttf)$).*)",
  ],
};
