import { getProducts } from '@/lib/api/products';
import { TopProductsClient } from './TopProductsClient';

export async function TopProducts() {
  try {
    // Fetch products server-side
    const response = await getProducts({
      limit: 8,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });

    return <TopProductsClient products={response.products} />;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return <TopProductsClient products={[]} error="Failed to load products" />;
  }
}
