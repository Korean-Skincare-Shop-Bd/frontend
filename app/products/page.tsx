import { Suspense } from "react";
import { permanentRedirect } from "next/navigation";
import ProductsPageContent from "./ProductPageClient";
import { ProductsLoading } from "./ProductPageLoading";
import type { Metadata } from "next";
import { getProducts } from "@/lib/api/products";
import { getBrands } from "@/lib/api/brands";
import { getCategories } from "@/lib/api/categories";
import { BASE_URL } from "@/lib/utils";
import { serializeJsonLd } from "@/lib/json-ld";

interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const getSearchParam = (
  params: Record<string, string | string[] | undefined>,
  name: string
) => {
  const value = params[name];
  return Array.isArray(value) ? value[0] || "" : value || "";
};

export async function generateMetadata({
  searchParams,
}: ProductsPageProps): Promise<Metadata> {
  const params = await searchParams;
  const search = getSearchParam(params, "search").trim();
  // Note: ?category= redirects permanently to /products/category/[slug] in the page
  // component below, so this route only ever renders without a category filter.
  const brand = getSearchParam(params, "brand");
  const minPrice = getSearchParam(params, "min_price");
  const maxPrice = getSearchParam(params, "max_price");
  const variationTags = getSearchParam(params, "variation_tags");
  const page = Math.max(1, parseInt(String(params.page || "1")) || 1);

  // Only the base listing and single-facet brand filter are stable, link-worthy
  // pages. Search, price range and tag filters are user-specific and shouldn't be
  // indexed as separate URLs (duplicate-content / crawl-budget risk).
  const hasNoiseParams = Boolean(search || minPrice || maxPrice || variationTags);

  const brandsResult = await getBrands(1, 100).catch(() => null);
  const brands = brandsResult?.data.brands ?? [];
  const brandName = brands.find((item) => item.id === brand || item.slug === brand)?.name;

  const variationTagWords: Record<string, string> = { NEW: "New", HOT: "Hot", SALE: "Sale" };
  const variationTagWord = variationTagWords[variationTags.toUpperCase()];
  const collectionName = [variationTagWord, brandName].filter(Boolean).join(" ");

  const title = search
    ? `Search Results for \"${search}\"${brandName ? ` in ${brandName}` : ""}`
    : collectionName
      ? `${collectionName} Products`
      : "Korean Skincare Products";
  const description = search
    ? `Browse Korean skincare search results for ${search}${brandName ? ` in ${brandName}` : ""}.`
    : collectionName
      ? `Browse our ${collectionName.toLowerCase()} from authentic Korean skincare and beauty brands.`
      : "Browse our complete collection of authentic Korean skincare and beauty products. Shop premium K-beauty essentials, serums, creams, masks, and more from trusted Korean brands.";

  const canonicalParams = new URLSearchParams();
  if (brand) canonicalParams.set("brand", brand);
  if (page > 1) canonicalParams.set("page", String(page));
  const canonicalQuery = canonicalParams.toString();
  const canonical = `/products${canonicalQuery ? `?${canonicalQuery}` : ""}`;

  return {
    title,
    description,
    keywords: [title, "Korean skincare products", "K-beauty products", "skincare Bangladesh"],
    alternates: { canonical },
    robots: hasNoiseParams ? { index: false, follow: true } : undefined,
    openGraph: {
      title,
      description,
      url: "https://www.koreanskincareshopbd.com/products",
      type: "website",
      images: [{ url: "/logo2.png", width: 1200, height: 630, alt: "Korean Skincare Products" }],
    },
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;

  // Category is now a path segment (/products/category/[slug]) so it's the single
  // canonical URL for a category. Old ?category= links redirect there permanently,
  // carrying over any other filters, instead of duplicating the content at two URLs.
  const legacyCategory = getSearchParam(params, "category");
  if (legacyCategory) {
    const redirectParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (key === "category" || value === undefined) return;
      const v = Array.isArray(value) ? value[0] : value;
      if (v) redirectParams.set(key, v);
    });
    const query = redirectParams.toString();
    permanentRedirect(`/products/category/${legacyCategory}${query ? `?${query}` : ""}`);
  }

  const page = Math.max(1, parseInt(String(params.page || '1')) || 1);
  const perPage = Math.max(1, parseInt(String(params.per_page || '48')) || 48);
  const search = getSearchParam(params, 'search');
  const brand = getSearchParam(params, 'brand');
  const variationTagsParam = params.variation_tags;
  const variationTags = Array.isArray(variationTagsParam)
    ? variationTagsParam[0]
    : String(variationTagsParam || '');
  const minPrice = getSearchParam(params, 'min_price');
  const maxPrice = getSearchParam(params, 'max_price');

  const [productsResult, brandsResult, categoriesResult] = await Promise.allSettled([
    getProducts({
      page,
      limit: perPage,
      search: search || undefined,
      brand: brand || undefined,
      variationTags: variationTags || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    }),
    getBrands(1, 100),
    getCategories(1, 100),
  ]);

  const productsData = productsResult.status === 'fulfilled' ? productsResult.value : null;
  const initialProducts = productsData?.products ?? [];
  const initialPagination = productsData
    ? {
        page: productsData.page,
        limit: productsData.limit,
        total: productsData.total,
        totalPages: productsData.totalPages,
        hasNext: productsData.hasNext,
        hasPrev: productsData.hasPrev,
      }
    : { page: 1, limit: perPage, total: 0, totalPages: 0, hasNext: false, hasPrev: false };
  const initialBrands = brandsResult.status === 'fulfilled' ? brandsResult.value.data.brands : [];
  const initialCategories = categoriesResult.status === 'fulfilled' ? categoriesResult.value.categories : [];

  const collectionSchema = initialProducts.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Korean Skincare Products",
        description:
          "Browse our complete collection of authentic Korean skincare and beauty products.",
        url: `${BASE_URL}/products`,
        mainEntity: {
          "@type": "ItemList",
          itemListElement: initialProducts.map(
            (
              p: { id: string; slug?: string; name: string; baseImageUrl?: string },
              idx: number
            ) => ({
              "@type": "ListItem",
              position: idx + 1,
              name: p.name,
              url: `${BASE_URL}/products/${p.slug || p.id}`,
              image: p.baseImageUrl || undefined,
            })
          ),
        },
      }
    : null;

  return (
    <>
      {collectionSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(collectionSchema) }}
        />
      )}
      <Suspense fallback={<ProductsLoading />}>
        <ProductsPageContent
          initialProducts={initialProducts}
          initialBrands={initialBrands}
          initialCategories={initialCategories}
          initialPagination={initialPagination}
        />
      </Suspense>
    </>
  );
}
