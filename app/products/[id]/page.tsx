import { ProductDetailPageClient } from "./ProductPageClient";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  // You can now use resolvedParams.id as the product id

  // The rest of your logic can be adapted to use resolvedParams.id
  // For demonstration, here's how you might fetch product data server-side:

  // If you want to keep the client-side fetching and state, you can wrap your previous component:
  return <ProductDetailPageClient id={resolvedParams.id} />;
}

