import { Suspense } from 'react';
import BrandsPageContent from './BrandsPageClient';
import { BrandsLoading } from './BrandsPageLoading';

export default function BrandsPage() {
  return (
    <Suspense fallback={<BrandsLoading />}>
      <BrandsPageContent />
    </Suspense>
  );
}
