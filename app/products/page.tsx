import { Suspense } from "react";
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
  const category = getSearchParam(params, "category");
  const brand = getSearchParam(params, "brand");

  const [brandsResult, categoriesResult] = await Promise.allSettled([
    getBrands(1, 100),
    getCategories(1, 100),
  ]);
  const brands = brandsResult.status === "fulfilled" ? brandsResult.value.data.brands : [];
  const categories = categoriesResult.status === "fulfilled" ? categoriesResult.value.categories : [];
  const brandName = brands.find((item) => item.id === brand || item.slug === brand)?.name;
  const categoryName = categories.find((item) => item.id === category || item.slug === category)?.name;

  const collectionName = [brandName, categoryName].filter(Boolean).join(" ");
  const title = search
    ? `Search Results for \"${search}\"${collectionName ? ` in ${collectionName}` : ""}`
    : collectionName
      ? `${collectionName} Products`
      : "Korean Skincare Products";
  const description = search
    ? `Browse Korean skincare search results for ${search}${collectionName ? ` in ${collectionName}` : ""}.`
    : collectionName
      ? `Browse authentic Korean skincare products from ${collectionName}.`
      : "Browse our complete collection of authentic Korean skincare and beauty products. Shop premium K-beauty essentials, serums, creams, masks, and more from trusted Korean brands.";

  return {
    title,
    description,
    keywords: [title, "Korean skincare products", "K-beauty products", "skincare Bangladesh"],
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

  const page = Math.max(1, parseInt(String(params.page || '1')) || 1);
  const perPage = Math.max(1, parseInt(String(params.per_page || '48')) || 48);
  const search = getSearchParam(params, 'search');
  const category = getSearchParam(params, 'category');
  const brand = getSearchParam(params, 'brand');
  const variationTagsParam = params.variationTags;
  const variationTags = Array.isArray(variationTagsParam)
    ? variationTagsParam[0]
    : String(variationTagsParam || '');

  const [productsResult, brandsResult, categoriesResult] = await Promise.allSettled([
    getProducts({
      page,
      limit: perPage,
      search: search || undefined,
      category: category || undefined,
      brand: brand || undefined,
      variationTags: variationTags || undefined,
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
