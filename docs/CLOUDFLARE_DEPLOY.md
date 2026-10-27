# Deploying to Cloudflare Workers (OpenNext)

Replaces Vercel hosting. Config: `wrangler.jsonc`, `open-next.config.ts`, `public/_headers`.

## One-time setup
1. Free Cloudflare account, then `pnpm wrangler login`.
2. Dashboard > R2 > enable, create bucket `korean-next-cache` (ISR cache).
3. Secrets: `pnpm wrangler secret put WEBHOOK_SECRET`, `NEXT_FB_PIXEL_ID`, `NEXT_FB_PIXEL_ACCESS_TOKEN`.
4. Keep the Worker Dashboard's production environment aligned with `wrangler.jsonc`: add `BKASH_ENABLED=true` under Settings > Variables and Secrets if it is missing. The self-reference service binding must use the `production` environment.
5. Non-secret vars (`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SITE_URL`, `API_URL`) belong in `wrangler.jsonc` `vars` and `.env.production` (`NEXT_PUBLIC_*` are inlined at build time). `BKASH_ENABLED` is a runtime var read per request by the checkout layout, so changing it in the dashboard needs no rebuild.
6. `pnpm run deploy`, then test the `*.workers.dev` URL.
7. Add custom domain (Workers > Settings > Domains); point backend webhook (`/api/webhooks/products`) at it; add origin to backend CORS.
8. Dashboard: WAF rate-limit rule for `/api/fb-conversion`, enable Bot Fight Mode, cache rule for `/sitemap.xml` and `/fb-catalog.xml`.

## Commands
- `pnpm preview` local workerd preview; `pnpm run deploy` build + deploy.

## Free-tier watch list
100k Worker requests/day, 10 ms CPU/request (error 1102), 3 MB compressed bundle. Static assets are free. Check with `pnpm wrangler tail`. Fallback: Workers Paid ($5/mo).
