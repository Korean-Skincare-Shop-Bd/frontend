"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const reviews = [
  {
    id: 1,
    name: 'Sarah Johnson',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100',
    rating: 5,
    comment: 'Absolutely love the Golden Glow Serum! My skin has never looked better. The results are visible within just a few days.',
    product: 'Golden Glow Serum',
    date: '2024-01-15'
  },
  {
    id: 2,
    name: 'Emily Chen',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100',
    rating: 5,
    comment: 'The customer service is exceptional and the product quality is outstanding. I highly recommend Golden Beauty to everyone!',
    product: 'Radiant Foundation',
    date: '2024-01-12'
  },
  {
    id: 3,
    name: 'Maria Rodriguez',
    avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=100',
    rating: 5,
    comment: 'Fast shipping, great packaging, and the products exceeded my expectations. Will definitely order again!',
    product: 'Luxury Eye Cream',
    date: '2024-01-10'
  },
  {
    id: 4,
    name: 'Jessica Taylor',
    avatar: 'https://images.pexels.com/photos/1680172/pexels-photo-1680172.jpeg?auto=compress&cs=tinysrgb&w=100',
    rating: 5,
    comment: 'Amazing quality and the results speak for themselves. My skin feels so much smoother and looks radiant.',
    product: 'Nourishing Lip Balm',
    date: '2024-01-08'
  }
];

export function ReviewsSection() {
  const [currentReview, setCurrentReview] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="bg-gradient-to-br from-primary-50 dark:from-gray-800 to-orange-50 dark:to-gray-900 py-16">
      <div className="mx-auto px-4 container">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-bold text-3xl md:text-4xl golden-text">
            What Our Customers Say
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground text-lg">
            Don't just take our word for it. Here's what our satisfied customers have to say about their experience.
          </p>
        </div>

        <div className="mx-auto max-w-4xl">
          <div className="relative h-80 md:h-64">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentReview}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0"
              >
                <Card className="border-primary-200 h-full glass-effect">
                  <CardContent className="flex flex-col justify-center p-8 h-full">
                    <div className="mb-6 text-center">
                      <Quote className="mx-auto mb-4 w-8 h-8 text-primary-400" />
                      <p className="text-gray-700 dark:text-gray-300 text-lg md:text-xl italic leading-relaxed">
                        "{reviews[currentReview].comment}"
                      </p>
                    </div>
                    
                    <div className="flex md:flex-row flex-col justify-center items-center gap-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={reviews[currentReview].avatar} />
                          <AvatarFallback>
                            {reviews[currentReview].name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="md:text-left text-center">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {reviews[currentReview].name}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            {reviews[currentReview].product}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="fill-primary w-5 h-5 text-primary"
                          />
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {reviews.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentReview(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentReview ? 'bg-primary-400' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="gap-8 grid grid-cols-1 md:grid-cols-3 mt-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="mb-2 font-bold text-3xl md:text-4xl golden-text">5,000+</div>
            <p className="text-muted-foreground">Happy Customers</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="mb-2 font-bold text-3xl md:text-4xl golden-text">4.9</div>
            <p className="text-muted-foreground">Average Rating</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="mb-2 font-bold text-3xl md:text-4xl golden-text">98%</div>
            <p className="text-muted-foreground">Satisfaction Rate</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}