"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getActiveBanners, type Banner } from "@/lib/api/banners";

// Fallback banners in case API fails or no active banners
const fallbackBanners = [
  {
    id: "fallback-1",
    title: "Discover Your Natural Glow",
    subtitle: "Premium skincare essentials for radiant skin",
    imageUrl:
      "https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=1200",
    cta: "Shop Skincare",
    linkUrl: "/products?category=skincare",
  },
  {
    id: "fallback-2",
    title: "Luxury Makeup Collection",
    subtitle: "Professional quality cosmetics for every occasion",
    imageUrl:
      "https://images.pexels.com/photos/2113994/pexels-photo-2113994.jpeg?auto=compress&cs=tinysrgb&w=1200",
    cta: "Explore Makeup",
    linkUrl: "/products?category=makeup",
  },
  {
    id: "fallback-3",
    title: "Signature Fragrances",
    subtitle: "Captivating scents that define your presence",
    imageUrl:
      "https://images.pexels.com/photos/1961795/pexels-photo-1961795.jpeg?auto=compress&cs=tinysrgb&w=1200",
    cta: "Discover Scents",
    linkUrl: "/products?category=fragrances",
  },
];

interface ProcessedBanner {
  id: string;
  imageUrl: string;
  cta: string;
  linkUrl: string;
}

export function HeroSection() {
  const [banners, setBanners] = useState<ProcessedBanner[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const activeBanners = await getActiveBanners();
        console.log(activeBanners);

        if (activeBanners.length > 0) {
          console.log(1);
          // Process API banners - add default title, subtitle, and CTA if not provided
          const processedBanners: ProcessedBanner[] = activeBanners.map(
            (banner, index) => ({
              id: banner.id,
              // title: `Discover Our Latest Collection`, // Default title
              // subtitle: `Premium beauty products that enhance your natural glow`, // Default subtitle
              imageUrl: banner.imageUrl,
              cta: "Shop Now", // Default CTA
              linkUrl: banner.linkUrl || "/products", // Default link
            })
          );

          setBanners(processedBanners);
        } else {
          // Use fallback banners if no active banners
          setBanners(fallbackBanners);
        }
      } catch (error) {
        console.error("Failed to fetch active banners:", error);
        // Use fallback banners on error
        setBanners(fallbackBanners);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [banners.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  if (loading) {
    return (
      <section className="relative bg-gray-200 dark:bg-gray-800 w-full aspect-[3/2] overflow-hidden animate-pulse">
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="text-center">
            <div className="bg-gray-300 dark:bg-gray-700 mx-auto mb-4 rounded w-48 h-8"></div>
            <div className="bg-gray-300 dark:bg-gray-700 mx-auto mb-8 rounded w-64 h-6"></div>
            <div className="bg-gray-300 dark:bg-gray-700 mx-auto rounded w-32 h-12"></div>
          </div>
        </div>
      </section>
    );
  }

  if (banners.length === 0) {
    return (
      <section className="relative bg-gradient-to-br from-primary-100 dark:from-gray-800 to-primary-200 dark:to-gray-900 w-full aspect-[3/2] overflow-hidden">
        <div className="absolute inset-0 flex justify-center items-center">
          <div className="mx-auto px-4 text-center container">
            <h1 className="mb-4 font-bold text-2xl md:text-3xl lg:text-4xl leading-tight golden-text">
              Welcome to KOREAN SKINCARE SHOP BD
            </h1>
            <p className="mb-8 text-muted-foreground text-sm md:text-base lg:text-lg">
              Discover premium beauty products for your natural glow
            </p>
          </div>
        </div>
        <div className="absolute bottom-4 right-4 z-10">
          <Button
            asChild
            size="sm"
            className="px-4 py-2 h-auto text-sm golden-button">
            <Link href="/products">
              <ShoppingBag className="mr-1 w-4 h-4" />
              Shop Now
            </Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full aspect-[3/2] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0">
          <div className="relative h-full">
            <Link href={banners[currentSlide].linkUrl} className="block h-full">
              <Image
                src={banners[currentSlide].imageUrl}
                alt={banners[currentSlide].cta || "Banner image"}
                fill
                className="object-cover cursor-pointer"
                priority
              />
            </Link>

            <div className="absolute bottom-4 right-4 z-10">
              <Button
                asChild
                size="sm"
                className="px-4 py-2 h-auto text-sm golden-button">
                <Link href={banners[currentSlide].linkUrl}>
                  <ShoppingBag className="mr-1 w-4 h-4" />
                  {banners[currentSlide].cta}
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows - Only show if more than 1 banner */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="top-1/2 left-4 z-10 absolute bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors -translate-y-1/2">
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="top-1/2 right-4 z-10 absolute bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors -translate-y-1/2">
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </>
      )}

      {/* Dots Indicator - Only show if more than 1 banner */}
      {banners.length > 1 && (
        <div className="bottom-8 left-1/2 z-10 absolute flex space-x-2 -translate-x-1/2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? "bg-primary-400" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
