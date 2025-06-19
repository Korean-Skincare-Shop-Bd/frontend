import { useEffect, useState } from 'react';
import { getBrands, Brand } from '@/lib/api/brands';

interface UseBrandsResult {
  brands: Brand[];
  loading: boolean;
  error: string | null;
}

export function useBrands(limit: number = 100): UseBrandsResult {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const response = await getBrands(1, limit);
        setBrands(response.data.brands);
      } catch (err) {
        console.error('Failed to fetch brands:', err);
        setError('Failed to load brands');
        // Fallback to empty array if API fails
        setBrands([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, [limit]);

  return { brands, loading, error };
}