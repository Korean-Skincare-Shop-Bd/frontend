import { useQuery } from '@tanstack/react-query';
import { getProducts } from '@/lib/api/products';
import { queryKeys } from '@/lib/queryKeys';

async function fetchCategoryBrandIds(category: string): Promise<Set<string>> {
  const brandIds = new Set<string>();
  let page = 1;
  let hasNext = true;

  while (hasNext) {
    const response = await getProducts({ category, page, limit: 100 });
    response.products.forEach((product) => {
      if (product.brandId) brandIds.add(product.brandId);
      else if (product.brand?.id) brandIds.add(product.brand.id);
    });
    hasNext = response.hasNext;
    page += 1;
  }

  return brandIds;
}

// A category page should only offer brands represented by products in that category.
export function useCategoryBrandIds(category: string) {
  return useQuery({
    queryKey: queryKeys.categoryBrandIds(category),
    queryFn: () => fetchCategoryBrandIds(category),
    enabled: category !== 'all',
  });
}
