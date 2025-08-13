"use client";

import { HeroSection } from '@/components/sections/hero-section';
import { BrandsShowcase } from '@/components/sections/brands-showcase';
import { TopProducts } from '@/components/sections/top-products';
import { ReviewsSection } from '@/components/sections/reviews-section';
import { SaleProducts } from '@/components/sections/SaleProducts';
import { HOTProducts } from '@/components/sections/HotProduts';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <TopProducts />
      <BrandsShowcase />
      <SaleProducts/>
      <HOTProducts/>
      <ReviewsSection />
    </div>
  );
}