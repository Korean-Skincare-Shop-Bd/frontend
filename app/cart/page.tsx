"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Heart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { getEnhancedCart, updateCartItem, removeCartItem } from '@/lib/api/cart';
import { getProduct, Product, ProductVariation } from '@/lib/api/products';

interface CartItemWithProduct {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product?: Product;
  variation?: ProductVariation;
  loading?: boolean;
}

export default function CartPage() {
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [promoCode, setPromoCode] = useState('');
  const { toast } = useToast();

  // Fetch cart data and product details
  useEffect(() => {
    const fetchCartData = async () => {
      try {
        setLoading(true);
        
        // Get cart items
        const cartResponse = await getEnhancedCart();
        const cartItems = cartResponse.data.items;

        // Convert cart items to our interface
        const cartItemsWithProduct: CartItemWithProduct[] = cartItems.map(item => ({
          id: item.productId, // Using productId as ID for now
          productId: item.productId,
          quantity: item.quantity,
          price: item.price,
          loading: true
        }));

        setItems(cartItemsWithProduct);

        // Fetch product details for each item
        const updatedItems = await Promise.all(
          cartItemsWithProduct.map(async (item) => {
            try {
              const product = await getProduct(item.productId);
              
              // Find the appropriate variation based on price or use first variation
              const variation = product.variations.find(v => 
                v.price === item.price || v.salePrice === item.price
              ) || product.variations[0];

              return {
                ...item,
                product,
                variation,
                loading: false
              };
            } catch (error) {
              console.error(`Failed to fetch product ${item.productId}:`, error);
              return {
                ...item,
                loading: false
              };
            }
          })
        );

        setItems(updatedItems);
      } catch (error) {
        console.error('Failed to fetch cart:', error);
        toast({
          title: "Error",
          description: "Failed to load cart items",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
  }, [toast]);

  const updateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      await removeItem(itemId);
      return;
    }

    try {
      // Update item in state optimistically
      setItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );

      // Update on server
      await updateCartItem('', itemId, { quantity: newQuantity }); // Add token when available
      
      toast({
        title: "Success",
        description: "Cart updated successfully",
      });
    } catch (error) {
      console.error('Failed to update cart item:', error);
      
      // Revert optimistic update
      setItems(prevItems => 
        prevItems.map(item => 
          item.id === itemId ? { ...item, quantity: item.quantity } : item
        )
      );
      
      toast({
        title: "Error",
        description: "Failed to update cart item",
        variant: "destructive",
      });
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      // Remove item from state optimistically
      const itemToRemove = items.find(item => item.id === itemId);
      setItems(prevItems => prevItems.filter(item => item.id !== itemId));

      // Remove from server
      await removeCartItem('', itemId); // Add token when available
      
      toast({
        title: "Success",
        description: "Item removed from cart",
      });
    } catch (error) {
      console.error('Failed to remove cart item:', error);
      
      // Revert optimistic update if needed
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive",
      });
    }
  };

  // Calculate totals
  const subtotal = items.reduce((sum, item) => {
    const currentPrice = item.variation?.salePrice || item.variation?.price || item.price;
    return sum + (currentPrice * item.quantity);
  }, 0);

  const savings = items.reduce((sum, item) => {
    if (item.variation?.price && item.variation?.salePrice) {
      return sum + ((item.variation.price - item.variation.salePrice) * item.quantity);
    }
    return sum;
  }, 0);

  const shipping = subtotal > 50 ? 0 : 9.99;
  const tax = subtotal * 0.08; // 8% tax
  const total = subtotal + shipping + tax;

  if (loading) {
    return (
      <div className="flex justify-center items-center bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 w-8 h-8 animate-spin" />
          <p>Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
        <div className="mx-auto px-4 py-16 container">
          <div className="text-center">
            <ShoppingBag className="mx-auto mb-6 w-24 h-24 text-muted-foreground" />
            <h1 className="mb-4 font-bold text-3xl">Your cart is empty</h1>
            <p className="mb-8 text-muted-foreground">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button asChild className="golden-button">
              <Link href="/products">
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="mx-auto px-4 py-8 container">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" asChild>
            <Link href="/products">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Continue Shopping
            </Link>
          </Button>
          <div>
            <h1 className="font-bold text-3xl">Shopping Cart</h1>
            <p className="text-muted-foreground">{items.length} items in your cart</p>
          </div>
        </div>

        <div className="gap-8 grid grid-cols-1 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="space-y-4 lg:col-span-2">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="p-6">
                    {item.loading ? (
                      <div className="flex justify-center items-center h-24">
                        <Loader2 className="w-6 h-6 animate-spin" />
                      </div>
                    ) : (
                      <div className="flex gap-6">
                        <div className="relative flex-shrink-0 w-24 h-24">
                          <Image
                            src={
                              item.variation?.imageUrl || 
                              item.product?.baseImageUrl || 
                              item.product?.images?.[0]?.imageUrl ||
                              '/placeholder.jpg'
                            }
                            alt={item.product?.name || 'Product'}
                            fill
                            className="rounded-lg object-cover"
                          />
                        </div>
                        
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="text-muted-foreground text-sm">
                                {item.product?.brand?.name}
                              </p>
                              <h3 className="font-semibold">
                                {item.product?.name || 'Unknown Product'}
                              </h3>
                              {item.variation?.volume && (
                                <p className="text-muted-foreground text-sm">
                                  Size: {item.variation.volume}
                                </p>
                              )}
                            </div>
                            
                            <div className="flex gap-2">
                              <Button size="icon" variant="ghost">
                                <Heart className="w-4 h-4" />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="ghost"
                                onClick={() => removeItem(item.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <span className="font-bold golden-text">
                                ${(item.variation?.salePrice || item.variation?.price || item.price).toFixed(2)}
                              </span>
                              {item.variation?.price && item.variation?.salePrice && item.variation.price > item.variation.salePrice && (
                                <span className="text-muted-foreground text-sm line-through">
                                  ${item.variation.price.toFixed(2)}
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-center border rounded-lg">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8"
                              >
                                <Minus className="w-3 h-3" />
                              </Button>
                              <span className="px-3 py-1 min-w-[40px] text-sm text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8"
                                disabled={item.variation?.stockQuantity ? item.quantity >= item.variation.stockQuantity : false}
                              >
                                <Plus className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                          
                          {item.variation?.stockQuantity && item.variation.stockQuantity <= 5 && (
                            <p className="text-orange-600 text-sm">
                              Only {item.variation.stockQuantity} left in stock
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="top-8 sticky">
              <CardContent className="p-6">
                <h2 className="mb-6 font-semibold text-xl">Order Summary</h2>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {savings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Savings</span>
                      <span>-${savings.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="golden-text">${total.toFixed(2)}</span>
                  </div>
                </div>

                {shipping > 0 && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 mt-4 p-3 rounded-lg">
                    <p className="text-blue-600 dark:text-blue-400 text-sm">
                      Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                    </p>
                  </div>
                )}

                {/* Promo Code */}
                <div className="space-y-3 mt-6">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <Button variant="outline">Apply</Button>
                  </div>
                </div>

                {/* Checkout Button */}
                <Button className="mt-6 w-full golden-button" size="lg">
                  Proceed to Checkout
                </Button>

                {/* Security Info */}
                <div className="mt-4 text-center">
                  <p className="text-muted-foreground text-xs">
                    Secure checkout with SSL encryption
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}