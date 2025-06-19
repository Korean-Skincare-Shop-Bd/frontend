"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getProduct, getProducts, Product } from '@/lib/api/products';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductInfo } from '@/components/product/ProductInfo';
import { ProductTabs } from '@/components/product/ProductTabs';
import { RelatedProducts } from '@/components/product/RelatedProduct';
import { ProductLoadingState } from '@/components/product/ProductLoadingState';
import { ProductErrorState } from '@/components/product/ProductErrorState';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0)
  // const [reviewCount, setReviewCount] = useState<number>(0)

  const fetchProductData = async () => {
    try {
      setLoading(true);
      const productData = await getProduct(params.id);
      setProduct(productData);
      if (productData.reviews && productData.reviews.length > 0) {
        const total = productData.reviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0);
        setAverageRating(total / productData.reviews.length);
      } else {
        setAverageRating(0);
      }
      
      // Fetch related products based on category and brand
      // Fetch related products by category
      const relatedByCategory = await getProducts({
        limit: 3,
        category: productData.category?.id,
      });

      // Fetch related products by brand
      const relatedByBrand = await getProducts({
        limit: 3,
        brand: productData.brand?.id,
      });

      // Combine and deduplicate products
      const relatedProductsData = {
        products: [
          ...relatedByCategory.products,
          ...relatedByBrand.products,
        ].filter(
          (product, index, self) =>
        self.findIndex(p => p.id === product.id) === index
        ),
      };
      
      // Filter out the current product
      const filteredRelatedProducts = relatedProductsData.products.filter(
        (p: Product) => p.id !== productData.id
      );
      
      setRelatedProducts(filteredRelatedProducts);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, [params.id]);

  if (loading) {
    return <ProductLoadingState />;
  }

  if (error || !product) {
    return <ProductErrorState error={error || "Failed to load product"} />;
  }

  // Prepare gallery images
  const galleryImages = [product.baseImageUrl, ...product.images.map(img => img.imageUrl)].filter((img): img is string => typeof img === 'string');

  // Check if product has a sale price
  const currentVariation = product.variations[0];
  const isOnSale = !!(currentVariation.salePrice && Number(currentVariation.salePrice) < Number(currentVariation.price));
  const discountPercentage = isOnSale
    ? Math.round((1 - (Number(currentVariation.salePrice) / Number(currentVariation.price))) * 100)
    : 0;

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <div className="mx-auto px-4 py-8 container">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-muted-foreground text-sm">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary">Products</Link>
          <span>/</span>
          <Link href={`/categories/${product.category?.id}`} className="hover:text-primary">
            {product.category?.name}
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        {/* Back Button */}
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/products">
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back to Products
          </Link>
        </Button>

        <div className="gap-12 grid grid-cols-1 lg:grid-cols-2 mb-16">
          {/* Product Images */}
          <ProductGallery 
            images={galleryImages}
            name={product.name}
            isOnSale={isOnSale}
            discountPercentage={discountPercentage}
            isNew={new Date(product.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)}
          />

          {/* Product Info */}
          <ProductInfo
            product={product}
            name={product.name}
            description={product.description ?? ""}
            brandName={product.brand?.name ?? ""}
            brandLogo={product.brand?.logoUrl}
            averageRating={averageRating}
            reviewCount={product.reviews.length}
            tags={product.tags}
            variations={product.variations}
          />
        </div>

        {/* Product Details Tabs */}
        <ProductTabs 
          product={product}
          onReviewSubmitted={fetchProductData}
        />

        {/* Related Products */}
        <RelatedProducts products={relatedProducts} />
      </div>
    </div>
  );
}