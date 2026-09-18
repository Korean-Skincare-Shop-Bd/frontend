import { useQuery } from '@tanstack/react-query';
import { getBrands, Brand } from '@/lib/api/brands';
import { queryKeys } from '@/lib/queryKeys';

interface UseBrandsOptions {
  initialData?: Brand[];
}

interface UseBrandsResult {
  brands: Brand[];
  loading: boolean;
  error: string | null;
}

export function useBrands(
  limit: number = 100,
  options: UseBrandsOptions = {}
): UseBrandsResult {
  const query = useQuery({
    queryKey: queryKeys.brands(1, limit),
    queryFn: () => getBrands(1, limit),
    initialData: options.initialData?.length
      ? {
          message: '',
          data: {
            brands: options.initialData,
            pagination: {
              page: 1,
              limit,
              total: options.initialData.length,
              totalPages: 1,
              hasNext: false,
              hasPrev: false,
            },
          },
        }
      : undefined,
  });

  return {
    brands: query.data?.data.brands ?? [],
    loading: query.isLoading,
    error: query.error ? 'Failed to load brands' : null,
  };
}
