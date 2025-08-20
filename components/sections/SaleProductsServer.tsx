import { getProducts } from '@/lib/api/products';
import { SaleProductsClient } from './SaleProductsClient';

export async function SaleProducts() {
  try {
    // Fetch sale products server-side
    const response = await getProducts({
      limit: 8,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      variationTags: 'SALE'
    });

    return <SaleProductsClient products={response.products} />;
  } catch (error) {
    console.error('Failed to fetch sale products:', error);
    return <SaleProductsClient products={[]} error="Failed to load sale products" />;
  }
}
