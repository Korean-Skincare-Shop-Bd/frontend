"use client";

import { useState } from 'react';
import { ProductTabs } from './ProductTabs';
import { Product, getProduct } from '@/lib/api/products';

interface ProductTabsWrapperProps {
  initialProduct: Product;
}

export function ProductTabsWrapper({ initialProduct }: ProductTabsWrapperProps) {
  const [product, setProduct] = useState<Product>(initialProduct);

  const handleReviewSubmitted = async () => {
    try {
      // Refetch the product data to get updated reviews
      const updatedProduct = await getProduct(product.id);
      setProduct(updatedProduct);
    } catch (error) {
      console.error('Failed to refresh product data after review submission:', error);
    }
  };

  return (
    <ProductTabs 
      product={product} 
      onReviewSubmitted={handleReviewSubmitted} 
    />
  );
}
