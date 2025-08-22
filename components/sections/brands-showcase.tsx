"use client";

import { SectionHeading } from '../brand/SectionHeading';
import { LoadingSpinner } from '../brand/LoadingSpinner';
import { BrandMarquee } from '../brand/BrandMarquee';
import { useBrands } from '@/hooks/useBrands';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

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
        <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-4 mb-8">
          <SectionHeading 
            title="Brands"
            // description="Discover our curated selection of luxury beauty brands, each chosen for their quality and innovation."
          />
          <Button asChild className="golden-button self-start sm:self-auto">
            <Link href="/brands">
              View All Brands
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
        <BrandMarquee brands={brands} />
      </div>
    </section>
  );
}