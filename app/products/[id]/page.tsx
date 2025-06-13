"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Star, Heart, ShoppingBag, Minus, Plus, Share2, ArrowLeft, Truck, Shield, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

// Mock product data - replace with actual API call
const product = {
  id: 1,
  name: 'Golden Glow Serum',
  brand: 'Luxe Beauty',
  price: 89.99,
  originalPrice: 119.99,
  rating: 4.8,
  reviews: 324,
  images: [
    'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=800',
    'https://images.pexels.com/photos/3735654/pexels-photo-3735654.jpeg?auto=compress&cs=tinysrgb&w=800',
  ],
  category: 'skincare',
  isNew: true,
  isBestseller: false,
  inStock: true,
  stockCount: 15,
  description: 'Transform your skin with our premium Golden Glow Serum. This luxurious formula combines powerful antioxidants with nourishing botanicals to reveal your most radiant complexion.',
  features: [
    'Vitamin C & E for antioxidant protection',
    'Hyaluronic acid for deep hydration',
    'Natural botanicals for gentle care',
    'Suitable for all skin types',
    'Cruelty-free and vegan'
  ],
  ingredients: 'Aqua, Sodium Ascorbyl Phosphate, Hyaluronic Acid, Glycerin, Niacinamide, Panthenol, Tocopheryl Acetate, Aloe Barbadensis Leaf Extract, Chamomilla Recutita Flower Extract',
  howToUse: 'Apply 2-3 drops to clean skin morning and evening. Gently pat into skin until absorbed. Follow with moisturizer and SPF during the day.',
  variants: [
    { id: 1, name: '30ml', price: 89.99, originalPrice: 119.99 },
    { id: 2, name: '50ml', price: 129.99, originalPrice: 159.99 },
    { id: 3, name: '100ml', price: 199.99, originalPrice: 249.99 }
  ]
};

const reviews = [
  {
    id: 1,
    name: 'Sarah Johnson',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    rating: 5,
    comment: 'Absolutely love this serum! My skin has never looked better. The results are visible within just a few days.',
    date: '2024-01-15',
    verified: true
  },
  {
    id: 2,
    name: 'Emily Chen',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    rating: 5,
    comment: 'Great product! The texture is perfect and it absorbs quickly. Highly recommend!',
    date: '2024-01-12',
    verified: true
  },
  {
    id: 3,
    name: 'Maria Rodriguez',
    avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=100',
    rating: 4,
    comment: 'Good serum, noticed improvement in skin texture. Will purchase again.',
    date: '2024-01-10',
    verified: false
  }
];

const relatedProducts = [
  {
    id: 2,
    name: 'Hydrating Face Mask',
    brand: 'Luxe Beauty',
    price: 35.99,
    image: 'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=300',
    rating: 4.5
  },
  {
    id: 3,
    name: 'Vitamin C Cleanser',
    brand: 'Luxe Beauty',
    price: 28.99,
    image: 'https://images.pexels.com/photos/3735654/pexels-photo-3735654.jpeg?auto=compress&cs=tinysrgb&w=300',
    rating: 4.7
  },
  {
    id: 4,
    name: 'Night Repair Cream',
    brand: 'Luxe Beauty',
    price: 65.99,
    image: 'https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=300',
    rating: 4.6
  }
];

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const currentVariant = product.variants[selectedVariant];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary">Products</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        {/* Back Button */}
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/products">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Products
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={product.images[selectedImage]}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {product.isNew && (
                <Badge className="absolute top-4 left-4 bg-primary text-white">New</Badge>
              )}
              {product.originalPrice && (
                <Badge className="absolute top-4 right-4" variant="destructive">
                  -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                </Badge>
              )}
            </div>
            
            <div className="flex gap-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index ? 'border-primary' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-5 w-5 ${
                        star <= Math.floor(product.rating)
                          ? 'fill-primary text-primary'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold golden-text">
                  ${currentVariant.price}
                </span>
                {currentVariant.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    ${currentVariant.originalPrice}
                  </span>
                )}
              </div>

              <p className="text-muted-foreground mb-6">{product.description}</p>
            </div>

            {/* Variants */}
            <div>
              <h3 className="font-semibold mb-3">Size</h3>
              <div className="flex gap-2">
                {product.variants.map((variant, index) => (
                  <Button
                    key={variant.id}
                    variant={selectedVariant === index ? 'default' : 'outline'}
                    onClick={() => setSelectedVariant(index)}
                    className="min-w-[80px]"
                  >
                    {variant.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <h3 className="font-semibold mb-3">Quantity</h3>
              <div className="flex items-center gap-3">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 min-w-[60px] text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity(Math.min(product.stockCount, quantity + 1))}
                    disabled={quantity >= product.stockCount}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.stockCount} in stock
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <Button className="flex-1 golden-button" size="lg">
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={isWishlisted ? 'text-red-500 border-red-500' : ''}
                >
                  <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
              
              <Button variant="outline" className="w-full" size="lg">
                Buy Now
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t">
              <div className="text-center">
                <Truck className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Free Shipping</p>
                <p className="text-xs text-muted-foreground">On orders over $50</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Secure Payment</p>
                <p className="text-xs text-muted-foreground">100% protected</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-6 w-6 mx-auto mb-2 text-primary" />
                <p className="text-sm font-medium">Easy Returns</p>
                <p className="text-xs text-muted-foreground">30-day policy</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="mb-16">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="ingredients">Ingredients</TabsTrigger>
            <TabsTrigger value="how-to-use">How to Use</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({product.reviews})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Product Description</h3>
                <p className="text-muted-foreground mb-6">{product.description}</p>
                
                <h4 className="font-semibold mb-3">Key Features</h4>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="ingredients" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Ingredients</h3>
                <p className="text-muted-foreground leading-relaxed">{product.ingredients}</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="how-to-use" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">How to Use</h3>
                <p className="text-muted-foreground leading-relaxed">{product.howToUse}</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <div className="space-y-6">
              {reviews.map((review) => (
                <Card key={review.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar>
                        <AvatarImage src={review.avatar} />
                        <AvatarFallback>{review.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{review.name}</h4>
                          {review.verified && (
                            <Badge variant="secondary" className="text-xs">Verified Purchase</Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.rating
                                    ? 'fill-primary text-primary'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">{review.date}</span>
                        </div>
                        
                        <p className="text-muted-foreground">{review.comment}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        <div>
          <h2 className="text-2xl font-bold mb-8">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <motion.div
                key={relatedProduct.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-square">
                    <Image
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm text-muted-foreground mb-1">{relatedProduct.brand}</p>
                    <h3 className="font-semibold mb-2 line-clamp-2">
                      <Link href={`/products/${relatedProduct.id}`} className="hover:text-primary transition-colors">
                        {relatedProduct.name}
                      </Link>
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="font-bold golden-text">${relatedProduct.price}</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-primary text-primary" />
                        <span className="text-sm">{relatedProduct.rating}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}