"use client";

import { useState } from 'react';
import { Product } from '@/lib/api/products';
import { useToast } from '@/hooks/use-toast';
import { addToEnhancedCart } from '@/lib/api/cart';
import { ProductsSection } from './ProductSections';
import { QuickViewModal } from '../ui/quick-view-modal';
// import { getMainImage, getProductPrice, isNewProduct, isOnSale } from '@/lib/utils/product-utils';
// If you haven't created the product-utils.ts file yet, you can inline those functions

interface RelatedProductsProps {
    products: Product[];
    title?: string;
}

export function RelatedProducts({ products, title = "Related Products" }: RelatedProductsProps) {
    const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
    const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
    const [addingToCart, setAddingToCart] = useState<string | null>(null);
    const { toast } = useToast();

    // Helper functions (if not imported from utils)
    const getMainImage = (product: Product): string => {
        const mainImage = product.images?.find(img => img.isMainImage);
        return mainImage?.imageUrl || product.baseImageUrl || '/placeholder-product.png';
    };

    const getProductPrice = (product: Product) => {
        if (product.variations.length === 0) return { price: 0, originalPrice: null };
        const variation = product.variations[0];
        return {
            price: variation.salePrice || variation.price,
            originalPrice: variation.salePrice ? variation.price : null
        };
    };

    const isNewProduct = (createdAt: string): boolean => {
        const productDate = new Date(createdAt);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return productDate > thirtyDaysAgo;
    };

    const isOnSale = (product: Product): boolean => {
        return product.variations.some(variation =>
            variation.salePrice && Number(variation.salePrice) < Number(variation.price)
        );
    };

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

    const handleQuickView = (product: Product) => {
        setQuickViewProduct(product);
        setIsQuickViewOpen(true);
    };

    const closeQuickView = () => {
        setIsQuickViewOpen(false);
        setQuickViewProduct(null);
    };

    if (products.length === 0) {
        return (
            <div>
                <h2 className="mb-8 font-bold text-2xl">{title}</h2>
                <div className="py-12 border rounded-lg text-center">
                    <p className="text-muted-foreground">No related products found</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div>
                <h2 className="mb-8 font-bold text-2xl">{title}</h2>

                <ProductsSection
                    products={products}
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
            </div>

            <QuickViewModal
                product={quickViewProduct}
                isOpen={isQuickViewOpen}
                onClose={closeQuickView}
            />
        </>
    );
}