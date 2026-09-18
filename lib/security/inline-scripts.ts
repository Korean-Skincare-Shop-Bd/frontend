// Fixed inline <script> bodies embedded in the root layout's <head>.
//
// These are rendered into HTML that gets statically cached (ISR) for pages
// like /products/[slug], so their CSP allowance can't rely on a per-request
// nonce (that would require the whole app to render dynamically via
// next/headers, see app/layout.tsx history). Instead middleware.ts hashes
// these exact strings and allow-lists them via CSP `script-src 'sha256-...'`.
// Keep the content here in sync with what layout.tsx renders — importing
// from this file in both places guarantees the hash always matches.

export function getFbPixelScript(pixelId: string): string {
  return `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${pixelId}');
            `;
}

export const GA_CONFIG_SCRIPT = `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-NPTTRXW8L1');
            `;
