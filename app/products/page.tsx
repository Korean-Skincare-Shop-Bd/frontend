import { Suspense } from "react";
import ProductsPageContent from "./ProductPageClient";
import { ProductsLoading } from "./ProductPageLoading";
import PageViewEvent from "@/components/PixelComponent/PageViewEvent";

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsPageContent />
      <PageViewEvent />
    </Suspense>
  );
}
