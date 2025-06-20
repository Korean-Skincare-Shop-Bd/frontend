import { Suspense } from 'react';
import ProductsPageContent from './ProductPageClient';
import { ProductsLoading } from './ProductPageLoading';

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsPageContent />
    </Suspense>
  );
}