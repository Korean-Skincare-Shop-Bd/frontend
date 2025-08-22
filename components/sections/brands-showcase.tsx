"use client";

import { SectionHeading } from '../brand/SectionHeading';
import { LoadingSpinner } from '../brand/LoadingSpinner';
import { BrandMarquee } from '../brand/BrandMarquee';
import { useBrands } from '@/hooks/useBrands';

export function BrandsShowcase() {
  const { brands, loading, error } = useBrands(100);

  // Show loading state
  if (loading) {
    return (
      <section className="bg-gradient-to-br from-primary-50 dark:from-gray-900 to-orange-50 dark:to-gray-800 py-16">
        <div className="mx-auto px-4 container">
          <SectionHeading 
            title="Trusted by Premium Brands"
            description="Loading our curated selection of luxury beauty brands..."
          />
          <div className="flex justify-center items-center h-40">
            <LoadingSpinner size="lg" />
          </div>
        </div>
      </section>
    );
  }

  // Don't render if no brands available
  if (brands.length === 0) {
    return null;
  }

  return (
    <section className="bg-gradient-to-br from-primary-50 dark:from-gray-900 to-orange-50 dark:to-gray-800 py-16">
      <div className="mx-auto px-4 container">
        <SectionHeading 
          title="Brands"
          // description="Discover our curated selection of luxury beauty brands, each chosen for their quality and innovation."
        />
        <BrandMarquee brands={brands} />
      </div>
    </section>
  );
}