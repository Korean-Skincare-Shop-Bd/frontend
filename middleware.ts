import { NextResponse, type NextRequest } from "next/server";

function contentSecurityPolicy(nonce: string) {
  const isDevelopment = process.env.NODE_ENV !== "production";

  return [
    "default-src 'self'",
    // Next.js development uses inline bootstrap code and eval for Fast Refresh.
    // Keep these relaxations development-only; production remains nonce-based.
    `script-src 'self'${isDevelopment ? " 'unsafe-inline' 'unsafe-eval'" : ` 'nonce-${nonce}'`} https://connect.facebook.net https://www.googletagmanager.com`,
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

export function middleware(request: NextRequest) {
  const nonce = crypto.randomUUID().replaceAll("-", "");
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", contentSecurityPolicy(nonce));
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
