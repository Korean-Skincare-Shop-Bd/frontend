import { useQuery } from '@tanstack/react-query';
import { getBrands, Brand } from '@/lib/api/brands';
import { queryKeys } from '@/lib/queryKeys';

interface UseBrandsResult {
  brands: Brand[];
  loading: boolean;
  error: string | null;
}

export function useBrands(limit: number = 100): UseBrandsResult {
  const query = useQuery({
    queryKey: queryKeys.brands(1, limit),
    queryFn: () => getBrands(1, limit),
  });

  return {
    brands: query.data?.data.brands ?? [],
    loading: query.isLoading,
    error: query.error ? 'Failed to load brands' : null,
  };
}
