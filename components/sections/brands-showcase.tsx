"use client";

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

const brands = [
  { id: 1, name: 'Luxe Beauty', logo: 'https://images.pexels.com/photos/1040427/pexels-photo-1040427.jpeg?auto=compress&cs=tinysrgb&w=200', href: '/products?brand=luxe-beauty' },
  { id: 2, name: 'Golden Glow', logo: 'https://images.pexels.com/photos/1040427/pexels-photo-1040427.jpeg?auto=compress&cs=tinysrgb&w=200', href: '/products?brand=golden-glow' },
  { id: 3, name: 'Pure Essence', logo: 'https://images.pexels.com/photos/1040427/pexels-photo-1040427.jpeg?auto=compress&cs=tinysrgb&w=200', href: '/products?brand=pure-essence' },
  { id: 4, name: 'Royal Touch', logo: 'https://images.pexels.com/photos/1040427/pexels-photo-1040427.jpeg?auto=compress&cs=tinysrgb&w=200', href: '/products?brand=royal-touch' },
  { id: 5, name: 'Radiant Beauty', logo: 'https://images.pexels.com/photos/1040427/pexels-photo-1040427.jpeg?auto=compress&cs=tinysrgb&w=200', href: '/products?brand=radiant-beauty' },
  { id: 6, name: 'Elegant Skin', logo: 'https://images.pexels.com/photos/1040427/pexels-photo-1040427.jpeg?auto=compress&cs=tinysrgb&w=200', href: '/products?brand=elegant-skin' },
  { id: 7, name: 'Divine Care', logo: 'https://images.pexels.com/photos/1040427/pexels-photo-1040427.jpeg?auto=compress&cs=tinysrgb&w=200', href: '/products?brand=divine-care' },
  { id: 8, name: 'Luxury Line', logo: 'https://images.pexels.com/photos/1040427/pexels-photo-1040427.jpeg?auto=compress&cs=tinysrgb&w=200', href: '/products?brand=luxury-line' },
];

export function BrandsShowcase() {
  return (
    <section className="py-16 bg-gradient-to-br from-primary-50 to-orange-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 golden-text">
            Trusted by Premium Brands
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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
                href={brand.href}
                className="flex-shrink-0 group"
              >
                <div className="w-32 h-32 md:w-40 md:h-40 relative rounded-xl overflow-hidden bg-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-100 to-orange-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative z-10 p-4 h-full flex flex-col items-center justify-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 relative mb-2">
                      <Image
                        src={brand.logo}
                        alt={brand.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                    <p className="text-sm md:text-base font-semibold text-center text-gray-800 group-hover:text-primary-600 transition-colors">
                      {brand.name}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </motion.div>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/brands"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium"
          >
            View All Brands
            <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}