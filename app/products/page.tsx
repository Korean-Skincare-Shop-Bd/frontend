import { Suspense } from "react";
import ProductsPageContent from "./ProductPageClient";
import { ProductsLoading } from "./ProductPageLoading";
import PageViewEvent from "@/components/PixelComponent/PageViewEvent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Korean Skincare Products | Premium K-Beauty | Korean Skincare Shop BD',
  description: 'Browse our complete collection of authentic Korean skincare and beauty products. Shop premium K-beauty essentials, serums, creams, masks, and more from trusted Korean brands.',
  keywords: ['Korean skincare products', 'K-beauty products', 'Korean cosmetics', 'skincare Bangladesh', 'Korean beauty products Bangladesh', 'serums', 'moisturizers', 'sheet masks'],
  openGraph: {
    title: 'Korean Skincare Products Collection',
    description: 'Discover premium Korean skincare and beauty products.',
    url: 'https://www.koreanskincareshopbd.com/products',
    type: 'website',
    images: [{ url: '/logo2.png', width: 1200, height: 630, alt: 'Korean Skincare Products' }],
  },
};

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsPageContent />
      <PageViewEvent />
    </Suspense>
  );
}
