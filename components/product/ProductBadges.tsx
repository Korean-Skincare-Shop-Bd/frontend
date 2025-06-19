import { Badge } from '@/components/ui/badge';
import { Product } from '@/lib/api/products';

interface ProductBadgesProps {
  product: Product;
  isNew: boolean;
  onSale: boolean;
  originalPrice: number | null;
  price: number;
}

export function ProductBadges({ 
  product, 
  isNew, 
  onSale, 
  originalPrice, 
  price 
}: ProductBadgesProps) {
  return (
    <div className="top-2 left-2 absolute flex flex-col gap-1">
      {isNew && <Badge className="bg-primary text-white">New</Badge>}
      {product.tags?.includes('HOT') && <Badge className="bg-red-500 text-white">Hot</Badge>}
      {product.tags?.includes('BESTSELLER') && <Badge className="bg-red-500 text-white">Bestseller</Badge>}
      {onSale && originalPrice && (
        <Badge variant="destructive">-{Math.round((1 - Number(price) / Number(originalPrice)) * 100)}%</Badge>
      )}
    </div>
  );
}