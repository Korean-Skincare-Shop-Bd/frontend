import { useQuery } from "@tanstack/react-query";
import { getProducts, type GetProductsParams } from "@/lib/api/products";
import { queryKeys } from "@/lib/queryKeys";

export function useProducts(params: GetProductsParams = {}) {
  return useQuery({
    queryKey: queryKeys.products(params),
    queryFn: () => getProducts(params),
  });
}
