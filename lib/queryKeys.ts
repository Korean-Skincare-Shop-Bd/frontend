import type { GetProductsParams } from "@/lib/api/products";
import type { GetReviewsParams } from "@/lib/api/review";

export const queryKeys = {
  brands: (page = 1, limit = 50) => ["brands", { page, limit }] as const,
  categories: (page = 1, limit = 20) => ["categories", { page, limit }] as const,
  categoryBrandIds: (category: string) => ["categoryBrandIds", category] as const,
  products: (params: GetProductsParams = {}) => ["products", params] as const,
  productsInfinite: (params: GetProductsParams = {}) => ["products", "infinite", params] as const,
  product: (id: string) => ["products", id] as const,
  productSuggestions: (query: string) => ["products", "suggestions", query] as const,
  reviews: (params: GetReviewsParams = {}) => ["reviews", params] as const,
  review: (id: string) => ["reviews", "detail", id] as const,
  reviewStatistics: ["reviews", "statistics"] as const,
  cart: ["cart"] as const,
  orders: (params: Record<string, unknown>) => ["orders", params] as const,
};
