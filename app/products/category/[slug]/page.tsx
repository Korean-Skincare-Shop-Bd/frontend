import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductsPageContent from "../../ProductPageClient";
import { ProductsLoading } from "../../ProductPageLoading";
import { getProducts } from "@/lib/api/products";
import { getBrands } from "@/lib/api/brands";
import { getCategories } from "@/lib/api/categories";
import { BASE_URL } from "@/lib/utils";
import { serializeJsonLd } from "@/lib/json-ld";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const getSearchParam = (
  params: Record<string, string | string[] | undefined>,
  name: string
) => {
  const value = params[name];
  return Array.isArray(value) ? value[0] || "" : value || "";
};

async function findCategory(slug: string) {
  const result = await getCategories(1, 100).catch(() => null);
  if (!result) return null;
  return result.categories.find((c) => c.slug === slug || c.id === slug) ?? null;
}

export async function generateMetadata({
  params,
  searchParams,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const sp = await searchParams;

  const category = await findCategory(slug);
  if (!category) {
    return { title: "Category Not Found", robots: { index: false, follow: false } };
  }

  const brand = getSearchParam(sp, "brand");
  const search = getSearchParam(sp, "search").trim();
  const minPrice = getSearchParam(sp, "min_price");
  const maxPrice = getSearchParam(sp, "max_price");
  const variationTags = getSearchParam(sp, "variation_tags");
  const page = Math.max(1, parseInt(String(sp.page || "1")) || 1);
  const hasNoiseParams = Boolean(search || minPrice || maxPrice || variationTags);

  // A category+brand combo is only worth indexing as its own page if it actually
  // has products — otherwise it collapses back to the plain category canonical.
  let brandName: string | undefined;
  let brandHasProducts = false;
  if (brand) {
    const [brandsResult, comboResult] = await Promise.allSettled([
      getBrands(1, 100),
      getProducts({ category: category.slug || category.id, brand, limit: 1 }),
    ]);
    if (brandsResult.status === "fulfilled") {
      brandName = brandsResult.value.data.brands.find(
        (b) => b.id === brand || b.slug === brand
      )?.name;
    }
    brandHasProducts = comboResult.status === "fulfilled" && comboResult.value.total > 0;
  }

  const canIndexBrand = Boolean(brand && brandName && brandHasProducts);

  const variationTagWords: Record<string, string> = { NEW: "New", HOT: "Hot", SALE: "Sale" };
  const variationTagWord = variationTagWords[variationTags.toUpperCase()];
  const collectionName = [variationTagWord, canIndexBrand ? brandName : undefined, category.name]
    .filter(Boolean)
    .join(" ");

  const title = search
    ? `Search Results for "${search}" in ${category.name}`
    : `${collectionName} Products`;
  const description = search
    ? `Browse ${category.name} search results for ${search}.`
    : variationTagWord || canIndexBrand
      ? `Browse our ${collectionName.toLowerCase()} - authentic Korean skincare and beauty products.`
      : category.description ||
        `Browse our collection of ${category.name} - authentic Korean skincare and beauty products.`;

  const canonicalParams = new URLSearchParams();
  if (canIndexBrand) canonicalParams.set("brand", brand);
  if (page > 1) canonicalParams.set("page", String(page));
  const canonicalQuery = canonicalParams.toString();
  const canonical = `/products/category/${slug}${canonicalQuery ? `?${canonicalQuery}` : ""}`;

  const shouldNoIndex = hasNoiseParams || (Boolean(brand) && !canIndexBrand);

  return {
    title,
    description,
    keywords: [title, category.name, "Korean skincare products", "K-beauty products"],
    alternates: { canonical },
    robots: shouldNoIndex ? { index: false, follow: true } : undefined,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}${canonical}`,
      type: "website",
      images: category.imageUrl
        ? [{ url: category.imageUrl, width: 1200, height: 630, alt: category.name }]
        : [{ url: "/logo2.png", width: 1200, height: 630, alt: category.name }],
    },
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const sp = await searchParams;

  const category = await findCategory(slug);
  if (!category) {
    notFound();
  }

  const page = Math.max(1, parseInt(String(sp.page || "1")) || 1);
  const perPage = Math.max(1, parseInt(String(sp.per_page || "48")) || 48);
  const search = getSearchParam(sp, "search");
  const brand = getSearchParam(sp, "brand");
  const minPrice = getSearchParam(sp, "min_price");
  const maxPrice = getSearchParam(sp, "max_price");
  const variationTagsParam = sp.variation_tags;
  const variationTags = Array.isArray(variationTagsParam)
    ? variationTagsParam[0]
    : String(variationTagsParam || "");

  const [productsResult, brandsResult, categoriesResult] = await Promise.allSettled([
    getProducts({
      page,
      limit: perPage,
      search: search || undefined,
      category: category.slug || category.id,
      brand: brand || undefined,
      variationTags: variationTags || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      sortBy: "createdAt",
      sortOrder: "desc",
    }),
    getBrands(1, 100),
    getCategories(1, 100),
  ]);

  const productsData = productsResult.status === "fulfilled" ? productsResult.value : null;
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
  const initialBrands = brandsResult.status === "fulfilled" ? brandsResult.value.data.brands : [];
  const initialCategories =
    categoriesResult.status === "fulfilled" ? categoriesResult.value.categories : [];

  const collectionSchema = initialProducts.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: `${category.name} Products`,
        description: category.description || `Browse our collection of ${category.name}.`,
        url: `${BASE_URL}/products/category/${slug}`,
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

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
      { "@type": "ListItem", position: 2, name: "Products", item: `${BASE_URL}/products` },
      { "@type": "ListItem", position: 3, name: category.name },
    ],
  };

  return (
    <>
      {collectionSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(collectionSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema) }}
      />
      <Suspense fallback={<ProductsLoading />}>
        <ProductsPageContent
          initialProducts={initialProducts}
          initialBrands={initialBrands}
          initialCategories={initialCategories}
          initialPagination={initialPagination}
          basePath={`/products/category/${slug}`}
          lockedCategory={{ id: category.id, slug: category.slug, name: category.name }}
        />
      </Suspense>
    </>
  );
}
