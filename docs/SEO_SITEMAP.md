# SEO & Sitemap Configuration

This project uses `next-sitemap` to automatically generate XML sitemaps for better SEO and Google search visibility.

## Files Generated

- `public/sitemap.xml` - Main sitemap index
- `public/sitemap-0.xml` - Contains all static and dynamic URLs
- `public/robots.txt` - Search engine crawler instructions

## Configuration

The sitemap configuration is in `next-sitemap.config.js` and includes:

### Static Pages (High Priority)
- `/` - Homepage (Priority: 1.0, Daily updates)
- `/products` - Products listing (Priority: 1.0, Daily updates)
- `/about` - About page (Priority: 0.8, Weekly updates)
- `/contact` - Contact page (Priority: 0.8, Weekly updates)
- `/cart` - Shopping cart (Priority: 0.7, Daily updates)

### Support Pages (Medium Priority)
- `/shipping` - Shipping info (Priority: 0.6, Monthly updates)
- `/support` - Support page (Priority: 0.6, Weekly updates)
- `/privacy` - Privacy policy (Priority: 0.5, Monthly updates)
- `/terms` - Terms of service (Priority: 0.5, Monthly updates)

### Dynamic Pages
- `/products/[id]` - Individual product pages (Priority: 0.9, Weekly updates)
- Future: Category pages can be added when implemented

### Excluded Pages
- `/admin/*` - Admin dashboard (private)
- `/api/*` - API routes (not user-facing)
- `/checkout` - Checkout process (private)

## How It Works

1. **Build Time Generation**: Sitemap is generated during `pnpm build` via the `postbuild` script
2. **Dynamic Content**: Fetches product data from `https://api.koreanskincareshopbd.com/products`
3. **SEO Optimization**: Different priorities and update frequencies for different page types

## Manual Regeneration

To regenerate the sitemap without a full build:

```bash
pnpm run postbuild
```

## Validation

Use the validation script to check if all sitemap URLs are accessible:

```bash
node scripts/validate-sitemap.js
```

## Google Search Console Setup

1. Submit your sitemap to Google Search Console: `https://www.koreanskincareshopbd.com/sitemap.xml`
2. Monitor indexing status and fix any issues
3. The robots.txt file automatically references the sitemap

## Important Notes

- The sitemap is automatically generated on every build
- Product pages are fetched dynamically from your API
- Update the API endpoint in `next-sitemap.config.js` if it changes
- Add new static pages to the `staticPages` array in the config file

## SEO Best Practices Implemented

✅ Proper XML sitemap structure  
✅ Search engine friendly robots.txt  
✅ Page priority hierarchy  
✅ Appropriate update frequencies  
✅ Clean URLs without query parameters  
✅ Excluded private/admin pages  
✅ Dynamic product page inclusion  
✅ Last modification timestamps  

This configuration will help your Korean Skincare Shop website get properly indexed by Google and other search engines.
