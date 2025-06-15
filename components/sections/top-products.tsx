"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingBag, Eye, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getProducts, Product } from '@/lib/api/products';
import { QuickViewModal } from '../ui/quick-view-modal';
import { useToast } from '@/hooks/use-toast';
import { addToEnhancedCart } from '@/lib/api/cart';

export function TopProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        // Fetch latest products (sorted by createdAt desc by default)
        const response = await getProducts({
          limit: 8, // Get 8 latest products
          sortBy: 'createdAt',
          sortOrder: 'desc'
        });
        setProducts(response.products);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
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

    await addToEnhancedCart('', {
      productId: product.id,
      quantity: 1,
      variationId: selectedVariation.id
    });

    toast({
      title: "Success",
      description: `${product.name} added to cart`,
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
      price: variation.salePrice || variation.price,
      originalPrice: variation.salePrice ? variation.price : null
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
    return product.variations.some(variation => variation.salePrice && variation.salePrice < variation.price);
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
              Trending Products
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
              Trending Products
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
              Trending Products
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
              Discover our most popular and recently added beauty essentials, loved by customers worldwide.
            </p>
          </div>

          <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 4).map((product, index) => {
              const { price, originalPrice } = getProductPrice(product);
              const mainImageUrl = getMainImage(product);
              const isNew = isNewProduct(product.createdAt);
              const onSale = isOnSale(product);

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  className="group"
                >
                  <Card className="shadow-lg hover:shadow-xl border-0 overflow-hidden group-hover:scale-105 transition-all duration-300">
                    <div className="relative aspect-square overflow-hidden">
                      <Link href={`/products/${product.id}`}>
                        <Image
                          src={mainImageUrl}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300 cursor-pointer"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder-product.png';
                          }}
                        />
                      </Link>

                      {/* Badges */}
                      <div className="top-2 left-2 absolute flex flex-col gap-1">
                        {isNew && (
                          <Badge className="bg-primary text-white">New</Badge>
                        )}
                        {product.tags.includes('HOT') && (
                          <Badge className="bg-red-500 text-white">Hot</Badge>
                        )}
                        {product.tags.includes('BESTSELLER') && (
                          <Badge className="bg-red-500 text-white">Bestseller</Badge>
                        )}
                        {onSale && originalPrice && (
                          <Badge variant="destructive">
                            -{Math.round((1 - price / originalPrice) * 100)}%
                          </Badge>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className={`absolute top-2 right-2 transition-all duration-300 ${hoveredProduct === product.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                        }`}>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="bg-gray-800 hover:bg-black"
                          onClick={() => handleQuickView(product)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Quick Add to Cart */}
                      <div className={`absolute bottom-2 left-2 right-2 transition-all duration-300 ${hoveredProduct === product.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                        }`}>
                        <Button
                          className="w-full golden-button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                          disabled={addingToCart === product.id}
                        >
                          {addingToCart === product.id ? (
                            <>
                              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                              Adding...
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="mr-2 w-4 h-4" />
                              Add to Cart
                            </>
                          )}
                        </Button>
                      </div>
                    </div>

                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <p className="text-muted-foreground text-sm">{product.brand?.name}</p>
                        <h3 className="font-semibold line-clamp-2">
                          <Link href={`/products/${product.id}`} className="hover:text-primary transition-colors">
                            {product.name}
                          </Link>
                        </h3>

                        {/* Category */}
                        <p className="text-muted-foreground text-xs">
                          {product.category?.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg golden-text">
                            ৳{price}
                          </span>
                          {originalPrice && originalPrice > price && (
                            <span className="text-muted-foreground text-sm line-through">
                              ৳{originalPrice}
                            </span>
                          )}
                        </div>

                        {/* Stock Status */}
                        {product.variations.length > 0 && (
                          <div className="text-xs">
                            {product.variations[0].stockQuantity > 0 ? (
                              <span className="text-green-600">In Stock</span>
                            ) : (
                              <span className="text-red-600">Out of Stock</span>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" asChild>
              <Link href="/products">
                View All Products
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