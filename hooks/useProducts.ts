import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { getProducts, type GetProductsParams, type ProductsResponse } from "@/lib/api/products";
import { queryKeys } from "@/lib/queryKeys";

type UseProductsOptions = Omit<
  UseQueryOptions<ProductsResponse>,
  "queryKey" | "queryFn"
>;

export function useProducts(
  params: GetProductsParams = {},
  options: UseProductsOptions = {}
) {
  return useQuery({
    queryKey: queryKeys.products(params),
    queryFn: () => getProducts(params),
    ...options,
  });
}
