"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getProducts, Product } from '@/lib/api/products';
import { useAdmin } from '@/contexts/AdminContext';

export function TopProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAdmin();

  useEffect(() => {
    const fetchProducts = async () => {
      if (!token) return;
      
      try {
        setLoading(true);
        const response = await getProducts({page: 1, limit:5});
        setProducts(response.data.slice(0, 3)); // Get top 3 products
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [token]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 animate-pulse">
                <div className="bg-gray-200 rounded-lg w-12 h-12"></div>
                <div className="flex-1 space-y-2">
                  <div className="bg-gray-200 rounded w-3/4 h-4"></div>
                  <div className="bg-gray-200 rounded w-1/2 h-3"></div>
                </div>
                <div className="bg-gray-200 rounded w-16 h-4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product, index) => (
            <div key={product.id} className="flex items-center gap-4">
              <div className="relative bg-gray-100 rounded-lg w-12 h-12 overflow-hidden">
                {product.baseImageUrl ? (
                  <img
                    src={product.baseImageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex justify-center items-center bg-gradient-to-br from-gray-200 to-gray-300 w-full h-full">
                    <span className="text-gray-500 text-xs">No Image</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{product.name}</p>
                <p className="text-muted-foreground text-sm">
                  {product.variations?.length || 0} variations
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">
                  ${Number(product.variations?.[0]?.price ?? 0).toFixed(2)}
                </p>
                <p className="text-muted-foreground text-sm">#{index + 1}</p>
              </div>
            </div>
          ))}
          
          {products.length === 0 && (
            <div className="py-8 text-muted-foreground text-center">
              No products available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}