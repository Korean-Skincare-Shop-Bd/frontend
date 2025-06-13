"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const banners = [
  {
    id: 1,
    title: "Discover Your Natural Glow",
    subtitle: "Premium skincare essentials for radiant skin",
    image: "https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=1200",
    cta: "Shop Skincare",
    href: "/products?category=skincare"
  },
  {
    id: 2,
    title: "Luxury Makeup Collection",
    subtitle: "Professional quality cosmetics for every occasion",
    image: "https://images.pexels.com/photos/2113994/pexels-photo-2113994.jpeg?auto=compress&cs=tinysrgb&w=1200",
    cta: "Explore Makeup",
    href: "/products?category=makeup"
  },
  {
    id: 3,
    title: "Signature Fragrances",
    subtitle: "Captivating scents that define your presence",
    image: "https://images.pexels.com/photos/1961795/pexels-photo-1961795.jpeg?auto=compress&cs=tinysrgb&w=1200",
    cta: "Discover Scents",
    href: "/products?category=fragrances"
  }
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <section className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <div className="relative h-full">
            <Image
              src={banners[currentSlide].image}
              alt={banners[currentSlide].title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/40" />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="container mx-auto px-4 text-center text-white">
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="max-w-4xl mx-auto"
                >
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
                    {banners[currentSlide].title}
                  </h1>
                  <p className="text-lg md:text-xl lg:text-2xl mb-8 text-gray-200">
                    {banners[currentSlide].subtitle}
                  </p>
                  <Button 
                    asChild 
                    size="lg" 
                    className="golden-button text-lg px-8 py-6 h-auto"
                  >
                    <Link href={banners[currentSlide].href}>
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      {banners[currentSlide].cta}
                    </Link>
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
      >
        <ChevronLeft className="h-6 w-6 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
      >
        <ChevronRight className="h-6 w-6 text-white" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentSlide ? 'bg-primary-400' : 'bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-10 hidden lg:block"
      >
        <Card className="glass-effect border-white/20">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-4 w-4 fill-primary-400 text-primary-400" />
              ))}
            </div>
            <p className="text-sm font-medium">5,000+ Happy Customers</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-32 left-10 hidden lg:block"
      >
        <Card className="glass-effect border-white/20">
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold golden-text">50+</p>
            <p className="text-sm font-medium">Premium Brands</p>
          </CardContent>
        </Card>
      </motion.div>
    </section>
  );
}