"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getBrands, Brand } from '@/lib/api/brands';

export function BrandsShowcase() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const response = await getBrands(1, 100); // Fetch first 20 brands
        setBrands(response.data.brands);
        console.log(response.data.brands)
      } catch (err) {
        console.error('Failed to fetch brands:', err);
        setError('Failed to load brands');
        // Fallback to static data if API fails
        setBrands([])
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  // Show loading state
  if (loading) {
    return (
      <section className="bg-gradient-to-br from-primary-50 dark:from-gray-900 to-orange-50 dark:to-gray-800 py-16">
        <div className="mx-auto px-4 container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 font-bold text-3xl md:text-4xl golden-text">
              Trusted by Premium Brands
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
              Loading our curated selection of luxury beauty brands...
            </p>
          </div>
          <div className="flex justify-center items-center h-40">
            <div className="border-primary-600 border-b-2 rounded-full w-8 h-8 animate-spin"></div>
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
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-bold text-3xl md:text-4xl golden-text">
            Trusted by Premium Brands
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
            Discover our curated selection of luxury beauty brands, each chosen for their quality and innovation.
          </p>
        </div>

        <div className="relative overflow-hidden">
          <motion.div
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="flex space-x-8 md:space-x-16"
          >
            {/* Duplicate brands for seamless loop */}
            {[...brands, ...brands].map((brand, index) => (
              <Link
                key={`${brand.id}-${index}`}
                href={`/products?brand=${encodeURIComponent(brand.name.toLowerCase().replace(/\s+/g, '-'))}`}
                className="group flex-shrink-0"
              >
                <div className="relative bg-white shadow-lg group-hover:shadow-xl rounded-xl w-32 md:w-40 h-32 md:h-40 overflow-hidden group-hover:scale-105 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-orange-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="z-10 relative flex flex-col justify-center items-center p-4 h-full">
                    <div className="relative mb-2 w-16 md:w-20 h-16 md:h-20">
                      <Image
                        src={brand.logoUrl || '/placeholder-brand-logo.png'}
                        alt={brand.name}
                        fill
                        className="rounded-lg object-cover"
                        onError={(e) => {
                          // Fallback to placeholder if image fails to load
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-brand-logo.png';
                        }}
                      />
                    </div>
                    <p className="font-semibold text-gray-800 group-hover:text-primary-600 text-sm md:text-base text-center transition-colors">
                      {brand.name}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </motion.div>
        </div>

        
      </div>
    </section>
  );
}