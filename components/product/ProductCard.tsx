import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Product } from '@/lib/api/products';
import { ProductBadges } from './ProductBadges';
import { ProductPrice } from './ProductPrice';
import { ProductQuickActions } from './ProductQuickActions';

interface ProductCardProps {
  product: Product;
  mainImage: string;
  isNew: boolean;
  onSale: boolean;
  hovered: boolean;
  price: number;
  originalPrice: number | null;
  onAddToCart: (e: React.MouseEvent) => void;
  addingToCart: boolean;
  onQuickView: () => void;
}

export function ProductCard({ 
  product, 
  mainImage, 
  isNew, 
  onSale, 
  hovered,
  price,
  originalPrice,
  onAddToCart,
  addingToCart,
  onQuickView,
}: ProductCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl border-0 overflow-hidden group-hover:scale-105 transition-all duration-300">
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/products/${product.id}`}>
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300 cursor-pointer"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = '/placeholder-product.png';
            }}
          />
        </Link>
        <ProductBadges 
          product={product} 
          isNew={isNew} 
          onSale={onSale} 
          originalPrice={originalPrice} 
          price={price} 
        />
        <ProductQuickActions 
          product={product}
          hovered={hovered}
          onAddToCart={onAddToCart}
          addingToCart={addingToCart}
          onQuickView={onQuickView}
        />
      </div>
      <CardContent className="p-2 sm:p-4">
        <div className="space-y-1 sm:space-y-2">
          <p className="text-muted-foreground text-xs sm:text-sm truncate">{product.brand?.name}</p>
          <h3 className="font-semibold text-sm sm:text-base line-clamp-2">
            <Link href={`/products/${product.id}`} className="hover:text-primary transition-colors">
              {product.name}
            </Link>
          </h3>
          {/* Category */}
          <p className="text-muted-foreground text-xs truncate">
            {product.category?.name}
          </p>
          <ProductPrice price={price} originalPrice={originalPrice} />
          {/* Stock Status */}
          {product.variations.length > 0 && (
            <div className="text-xs">
              {product.variations[0].stockQuantity > 0
                ? <span className="text-green-600">In Stock</span>
                : <span className="text-red-600">Out of Stock</span>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}