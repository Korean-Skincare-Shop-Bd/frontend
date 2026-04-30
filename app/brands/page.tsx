import { Suspense } from 'react';
import BrandsPageContent from './BrandsPageClient';
import { BrandsLoading } from './BrandsPageLoading';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Premium Korean Beauty Brands | Korean Skincare Shop BD',
  description: 'Explore top Korean skincare and beauty brands available in Bangladesh. Shop authentic products from leading K-beauty brands like COSRX, Purito, Isntree, and more.',
  keywords: ['Korean brands', 'K-beauty brands', 'skincare brands', 'COSRX', 'Korean beauty brands Bangladesh'],
  openGraph: {
    title: 'Korean Beauty Brands',
    description: 'Discover top Korean skincare and beauty brands.',
    url: 'https://www.koreanskincareshopbd.com/brands',
    type: 'website',
    images: [{ url: '/logo2.png', width: 1200, height: 630, alt: 'Korean Beauty Brands' }],
  },
};

export default function BrandsPage() {
  return (
    <Suspense fallback={<BrandsLoading />}>
      <BrandsPageContent />
    </Suspense>
  );
}
