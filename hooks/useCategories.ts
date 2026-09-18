import { useQuery } from '@tanstack/react-query';
import { getCategories, Category } from '@/lib/api/categories';
import { queryKeys } from '@/lib/queryKeys';

interface UseCategoriesOptions {
  initialData?: Category[];
}

interface UseCategoriesResult {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

export function useCategories(
  limit: number = 100,
  options: UseCategoriesOptions = {}
): UseCategoriesResult {
  const query = useQuery({
    queryKey: queryKeys.categories(1, limit),
    queryFn: () => getCategories(1, limit),
    initialData: options.initialData?.length
      ? {
          categories: options.initialData,
          pagination: {
            page: 1,
            limit,
            total: options.initialData.length,
            totalPages: 1,
            hasNext: false,
            hasPrev: false,
          },
        }
      : undefined,
  });

  return {
    categories: query.data?.categories ?? [],
    loading: query.isLoading,
    error: query.error ? 'Failed to load categories' : null,
  };
}
