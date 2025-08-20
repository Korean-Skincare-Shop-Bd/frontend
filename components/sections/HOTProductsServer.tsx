import { getProducts } from '@/lib/api/products';
import { HOTProductsClient } from './HOTProductsClient';

export async function HOTProducts() {
  try {
    // Fetch hot products server-side
    const response = await getProducts({
      limit: 8,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      variationTags: 'HOT'
    });

    return <HOTProductsClient products={response.products} />;
  } catch (error) {
    console.error('Failed to fetch hot products:', error);
    return <HOTProductsClient products={[]} error="Failed to load hot products" />;
  }
}
