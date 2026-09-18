# SEO & Sitemap Configuration

This project uses Next.js's built-in `MetadataRoute.Sitemap` API — `app/sitemap.ts` and `app/robots.ts` — to generate `/sitemap.xml` and `/robots.txt` dynamically at request time (revalidated hourly). There is no separate build step or generated file to keep in sync.

## Files

- `app/sitemap.ts` — serves `/sitemap.xml`. Includes static pages, every product (`/products/[slug]`), every category (`/products/category/[slug]`), and brand-filtered listing pages (`/products?brand=[slug]`).
- `app/robots.ts` — serves `/robots.txt`.

## URL structure

- `/products` — base listing, canonical to itself (or to `?brand=` when a brand filter is applied).
- `/products/category/[slug]` — category landing page. Accepts `?brand=` as a query param; the combined page self-canonicalizes only when that category+brand combination actually has products, otherwise it canonicalizes back to the plain category page and is marked `noindex`.
- `/products?search=`, `?min_price=`, `?max_price=`, `?variation_tags=` — user-specific refinements, always marked `noindex, follow`. Not included in the sitemap.
- `/products/[slug]` — product detail page. Legacy CUID-based URLs (`/products/<cuid>`) permanently redirect (308) to the slug URL.

## Updating

Add new static pages directly to the `STATIC_PAGES` array in `app/sitemap.ts`. Category and product entries are fetched live from the API on each sitemap request, so nothing needs regenerating manually.
