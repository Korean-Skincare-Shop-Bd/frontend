"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/api/products';
import { useProducts } from '@/hooks/useProducts';
import { QuickViewModal } from '../ui/quick-view-modal';
import { useToast } from '@/hooks/use-toast';
import { addToEnhancedCart } from '@/lib/api/cart';
import { ProductsSection } from '../product/ProductSections';
import { PAGINATION_LIMIT } from '@/constants/constants';

export function TopProducts() {
  const { data, isLoading: loading, isError } = useProducts({ limit: 8, sortBy: 'createdAt', sortOrder: 'desc' });
  const products = data?.products ?? [];
  const error = isError ? 'Failed to load products' : null;
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAddToCart = async (product: Product, variationId?: string) => {
    try {
      setAddingToCart(product.id);
      
      const selectedVariation = variationId 
        ? product.variations.find(v => v.id === variationId)
        : product.variations[0];

      if (!selectedVariation) {
        toast({
          title: "Error",
          description: "No product variation available",
          variant: "destructive",
        });
        return;
      }

      await addToEnhancedCart({
        productId: product.id,
        quantity: 1,
        variantId: selectedVariation.id
      });
      window.dispatchEvent(new Event('cartUpdated'));

      toast({
        title: "Added to Cart! 🛒",
        description: `${product.name} added to your cart`,
      });
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    } finally {
      setAddingToCart(null);
    }
  };

  // Helper function to get the main image
  const getMainImage = (product: Product): string => {
    const mainImage = product.images?.find(img => img.isMainImage);
    return mainImage?.imageUrl || product.baseImageUrl || '/placeholder-product.png';
  };

  // Helper function to get product price
  const getProductPrice = (product: Product) => {
    if (product.variations.length === 0) return { price: 0, originalPrice: null };

    const variation = product.variations[0]; // Get first variation
    return {
      price: Number(variation.salePrice) || Number(variation.price),
      originalPrice: variation.salePrice ? Number(variation.price) : null
    };
  };

  // Helper function to check if product is new (created within last 30 days)
  const isNewProduct = (createdAt: string): boolean => {
    const productDate = new Date(createdAt);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return productDate > thirtyDaysAgo;
  };

  // Helper function to check if product is on sale
  const isOnSale = (product: Product): boolean => {
    return product.variations.some(variation => variation.salePrice && Number(variation.salePrice) < Number(variation.price));
  };

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setIsQuickViewOpen(false);
    setQuickViewProduct(null);
  };

  if (loading) {
    return (
      <section className="bg-white dark:bg-gray-900 py-16">
        <div className="mx-auto px-4 container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-bold text-3xl md:text-4xl golden-text">
              New Products
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
              Loading our latest beauty essentials...
            </p>
          </div>
          <div className="flex justify-center items-center h-40">
            <div className="border-primary-600 border-b-2 rounded-full w-8 h-8 animate-spin"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error || products.length === 0) {
    return (
      <section className="bg-white dark:bg-gray-900 py-16">
        <div className="mx-auto px-4 container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-bold text-3xl md:text-4xl golden-text">
              New Products
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
              {error || 'No products available at the moment.'}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="bg-white dark:bg-gray-900 py-16">
        <div className="mx-auto px-4 container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-bold text-3xl md:text-4xl golden-text">
              New Products
            </h2>
            {/* <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
              Discover our most popular and recently added beauty essentials, loved by customers worldwide.
            </p> */}
          </div>

          <ProductsSection
            products={products.slice(0, 4)}
            hoveredProduct={hoveredProduct}
            setHoveredProduct={setHoveredProduct}
            handleAddToCart={handleAddToCart}
            addingToCart={addingToCart}
            handleQuickView={handleQuickView}
            getProductPrice={getProductPrice}
            getMainImage={getMainImage}
            isNewProduct={isNewProduct}
            isOnSale={isOnSale}
          />

          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" asChild>
              <Link href={`/products?variation_tags=NEW&page=1&per_page=${PAGINATION_LIMIT}`}>
                View All New Products
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={closeQuickView}
      />
    </>
  );
}
