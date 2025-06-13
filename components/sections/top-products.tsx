"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingBag, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const products = [
  {
    id: 1,
    name: 'Golden Glow Serum',
    brand: 'Luxe Beauty',
    price: 89.99,
    originalPrice: 119.99,
    rating: 4.8,
    reviews: 324,
    image: 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=400',
    isNew: true,
    isBestseller: false
  },
  {
    id: 2,
    name: 'Radiant Foundation',
    brand: 'Pure Essence',
    price: 45.99,
    originalPrice: null,
    rating: 4.9,
    reviews: 567,
    image: 'https://images.pexels.com/photos/3762875/pexels-photo-3762875.jpeg?auto=compress&cs=tinysrgb&w=400',
    isNew: false,
    isBestseller: true
  },
  {
    id: 3,
    name: 'Luxury Eye Cream',
    brand: 'Royal Touch',
    price: 129.99,
    originalPrice: 159.99,
    rating: 4.7,
    reviews: 198,
    image: 'https://images.pexels.com/photos/3735654/pexels-photo-3735654.jpeg?auto=compress&cs=tinysrgb&w=400',
    isNew: false,
    isBestseller: false
  },
  {
    id: 4,
    name: 'Nourishing Lip Balm',
    brand: 'Golden Glow',
    price: 24.99,
    originalPrice: null,
    rating: 4.6,
    reviews: 432,
    image: 'https://images.pexels.com/photos/3823076/pexels-photo-3823076.jpeg?auto=compress&cs=tinysrgb&w=400',
    isNew: true,
    isBestseller: false
  }
];

export function TopProducts() {
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 golden-text">
            Trending Products
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our most popular and recently added beauty essentials, loved by customers worldwide.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              onMouseEnter={() => setHoveredProduct(product.id)}
              onMouseLeave={() => setHoveredProduct(null)}
              className="group"
            >
              <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  
                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.isNew && (
                      <Badge className="bg-primary text-white">New</Badge>
                    )}
                    {product.isBestseller && (
                      <Badge className="bg-red-500 text-white">Bestseller</Badge>
                    )}
                    {product.originalPrice && (
                      <Badge variant="destructive">
                        -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                      </Badge>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className={`absolute top-2 right-2 flex flex-col gap-2 transition-all duration-300 ${
                    hoveredProduct === product.id ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                  }`}>
                    <Button size="icon" variant="secondary" className="bg-white/90 hover:bg-white">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="secondary" className="bg-white/90 hover:bg-white">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Quick Add to Cart */}
                  <div className={`absolute bottom-2 left-2 right-2 transition-all duration-300 ${
                    hoveredProduct === product.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}>
                    <Button className="w-full golden-button">
                      <ShoppingBag className="mr-2 h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{product.brand}</p>
                    <h3 className="font-semibold line-clamp-2">
                      <Link href={`/products/${product.id}`} className="hover:text-primary transition-colors">
                        {product.name}
                      </Link>
                    </h3>
                    
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-3 w-3 ${
                              star <= Math.floor(product.rating)
                                ? 'fill-primary text-primary'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg golden-text">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" asChild>
            <Link href="/products">
              View All Products
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}