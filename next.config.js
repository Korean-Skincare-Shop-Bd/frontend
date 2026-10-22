/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

function contentSecurityPolicy() {
  const isDevelopment = process.env.NODE_ENV !== "production";

  // Keep the app statically optimizable. A request nonce requires headers()
  // in the root layout, which turns ISR pages into dynamic renders. Next.js
  // App Router emits inline Flight payloads, so static/ISR output needs the
  // inline script allowance here.
  const scriptSrc = ["'self'", "'unsafe-inline'"];
  if (isDevelopment) {
    // Next.js development uses inline bootstrap code and eval for Fast Refresh.
    // Keep this relaxation development-only; production stays hash-based.
    scriptSrc.push("'unsafe-inline'", "'unsafe-eval'");
  }
  scriptSrc.push(
    "https://connect.facebook.net",
    "https://www.googletagmanager.com"
  );

  return [
    "default-src 'self'",
    `script-src ${scriptSrc.join(" ")}`,
    "style-src 'self' 'unsafe-inline'",
    // blob: is required for client-side file previews (e.g. admin image upload forms)
    // rendered via URL.createObjectURL() before the file is uploaded.
    "img-src 'self' data: blob: https:",
    `connect-src 'self' https:${isDevelopment ? " http://localhost:8000" : ""}`,
    "font-src 'self' data:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    ...(isDevelopment ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");
}


const securityHeaders = () => [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy() },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  ...(process.env.NODE_ENV === 'production'
    ? [{ key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }]
    : []),
];

const nextConfig = {
  // Static headers replace middleware.ts so pages/RSC requests no longer
  // trigger a middleware invocation each.
  async headers() {
    return [{ source: '/((?!api|_next/static|_next/image).*)', headers: securityHeaders() }];
  },
  // output: 'export',
  images: {
    // Product images are already served (and cached) via CloudFront, so let
    // Vercel skip its own resize/optimize pass instead of burning function
    // CPU re-optimizing images that are already optimized.
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: 'https', hostname: 'di52x3c4ntpb8.cloudfront.net' },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

module.exports = withBundleAnalyzer(nextConfig);

// Enables Cloudflare bindings (R2, env) during `next dev`.
if (process.env.NODE_ENV !== 'production') {
  import('@opennextjs/cloudflare').then((m) => m.initOpenNextCloudflareForDev()).catch(() => {});
}
