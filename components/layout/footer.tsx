import Link from 'next/link';
import { Crown, Facebook, Instagram, Twitter, Youtube, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-golden-gradient">
                <Crown className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold text-xl golden-text">Golden Beauty</span>
            </div>
            <p className="text-gray-400">
              Discover premium beauty products with our curated collection of skincare, makeup, and wellness items.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-primary">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-primary">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-primary">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-primary">
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <nav className="space-y-2">
              <Link href="/about" className="block text-gray-400 hover:text-primary transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="block text-gray-400 hover:text-primary transition-colors">
                Contact
              </Link>
              <Link href="/shipping" className="block text-gray-400 hover:text-primary transition-colors">
                Shipping Info
              </Link>
              <Link href="/returns" className="block text-gray-400 hover:text-primary transition-colors">
                Returns
              </Link>
              <Link href="/faq" className="block text-gray-400 hover:text-primary transition-colors">
                FAQ
              </Link>
            </nav>
          </div>

          {/* Categories */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Categories</h3>
            <nav className="space-y-2">
              <Link href="/products?category=skincare" className="block text-gray-400 hover:text-primary transition-colors">
                Skincare
              </Link>
              <Link href="/products?category=makeup" className="block text-gray-400 hover:text-primary transition-colors">
                Makeup
              </Link>
              <Link href="/products?category=fragrances" className="block text-gray-400 hover:text-primary transition-colors">
                Fragrances
              </Link>
              <Link href="/products?category=haircare" className="block text-gray-400 hover:text-primary transition-colors">
                Hair Care
              </Link>
            </nav>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Stay Updated</h3>
            <p className="text-gray-400">
              Subscribe to our newsletter for exclusive offers and beauty tips.
            </p>
            <form className="space-y-2">
              <Input 
                type="email" 
                placeholder="Enter your email"
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
              />
              <Button className="w-full golden-button">
                <Mail className="mr-2 h-4 w-4" />
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Golden Beauty. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-gray-400 hover:text-primary text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-primary text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}