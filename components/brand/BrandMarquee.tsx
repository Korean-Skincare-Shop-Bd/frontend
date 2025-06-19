"use client";

import { motion } from 'framer-motion';
import { BrandCard } from './BrandCard';
import { Brand } from '@/lib/api/brands';

interface BrandMarqueeProps {
  brands: Brand[];
}

export function BrandMarquee({ brands }: BrandMarqueeProps) {
  if (brands.length === 0) {
    return null;
  }

  return (
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
          <BrandCard 
            key={`${brand.id}-${index}`}
            id={brand.id}
            name={brand.name}
            logoUrl={brand.logoUrl ?? null}
          />
        ))}
      </motion.div>
    </div>
  );
}