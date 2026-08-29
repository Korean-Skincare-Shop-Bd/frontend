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

  const duplicatedBrands = [...brands, ...brands];

  const brandCards = duplicatedBrands.map((brand, index) => (
    <BrandCard
      key={`${brand.id}-${index}`}
      id={brand.id}
      name={brand.name}
      logoUrl={brand.logoUrl ?? null}
    />
  ));

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{
            duration: 240,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="flex w-max gap-4 md:gap-16"
        >
          {brandCards}
        </motion.div>
      </div>
    </div>
  );
}