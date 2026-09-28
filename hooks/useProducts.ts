import {
  useQuery,
  useInfiniteQuery,
  type UseQueryOptions,
  type InfiniteData,
} from "@tanstack/react-query";
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

interface UseInfiniteProductsOptions {
  initialData?: ProductsResponse;
}

/**
 * Powers the /products infinite-scroll listing. `params` should not include
 * `page` — pagination is driven entirely by TanStack Query's pageParam.
 */
export function useInfiniteProducts(
  params: Omit<GetProductsParams, "page"> = {},
  options: UseInfiniteProductsOptions = {}
) {
  return useInfiniteQuery({
    queryKey: queryKeys.productsInfinite(params),
    queryFn: ({ pageParam }) => getProducts({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.page + 1 : undefined,
    initialData: options.initialData
      ? ({
          pages: [options.initialData],
          pageParams: [1],
        } as InfiniteData<ProductsResponse, number>)
      : undefined,
  });
}

/**
 * Powers the navbar search-as-you-type dropdown. `query` should already be
 * debounced by the caller; this hook only adds the `enabled` gate so we don't
 * fire a request for an empty/too-short term.
 */
export function useProductSuggestions(query: string) {
  const trimmed = query.trim();
  return useQuery({
    queryKey: queryKeys.productSuggestions(trimmed),
    queryFn: () =>
      getProducts({
        search: trimmed,
        limit: 6,
        includeImages: true,
        includeVariations: true,
      }),
    enabled: trimmed.length >= 2,
    staleTime: 60_000,
  });
}
