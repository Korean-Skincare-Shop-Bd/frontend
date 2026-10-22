# Deploying to Cloudflare Workers (OpenNext)

Replaces Vercel hosting. Config: `wrangler.jsonc`, `open-next.config.ts`, `public/_headers`.

## One-time setup
1. Free Cloudflare account, then `pnpm wrangler login`.
2. Dashboard > R2 > enable, create bucket `korean-next-cache` (ISR cache).
3. Secrets: `pnpm wrangler secret put WEBHOOK_SECRET`, `NEXT_FB_PIXEL_ID`, `NEXT_FB_PIXEL_ACCESS_TOKEN`.
4. Non-secret vars (`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SITE_URL`, `API_URL`) in `wrangler.jsonc` `vars`, and also in `.env.production` (NEXT_PUBLIC_* are inlined at build time).
5. `pnpm run deploy`, then test the `*.workers.dev` URL.
6. Add custom domain (Workers > Settings > Domains); point backend webhook (`/api/webhooks/products`) at it; add origin to backend CORS.
7. Dashboard: WAF rate-limit rule for `/api/fb-conversion`, enable Bot Fight Mode, cache rule for `/sitemap.xml` and `/fb-catalog.xml`.

## Commands
- `pnpm preview` local workerd preview; `pnpm run deploy` build + deploy.

## Free-tier watch list
100k Worker requests/day, 10 ms CPU/request (error 1102), 3 MB compressed bundle. Static assets are free. Check with `pnpm wrangler tail`. Fallback: Workers Paid ($5/mo).
