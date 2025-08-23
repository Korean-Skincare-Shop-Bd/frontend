import { Button } from '@/components/ui/button';
import { Eye, ShoppingBag, Loader2 } from 'lucide-react';
import { Product } from '@/lib/api/products';

interface ProductQuickActionsProps {
  product: Product;
  hovered: boolean;
  onAddToCart: (e: React.MouseEvent) => void;
  addingToCart: boolean;
  onQuickView: () => void;
}

export function ProductQuickActions({ 
  product, 
  hovered, 
  onAddToCart, 
  addingToCart, 
  onQuickView
}: ProductQuickActionsProps) {
  return (
    <>
      <div className={`absolute top-2 right-2 transition-all duration-300 ${hovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
        <Button
          size="icon"
          variant="secondary"
          className="bg-gray-800 hover:bg-black"
          onClick={onQuickView}
        >
          <Eye className="w-4 h-4" />
        </Button>
      </div>
      {/* <div className={`absolute bottom-2 left-2 right-2 transition-all duration-300 ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <Button
          className="w-full golden-button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('ProductQuickActions: Add to cart clicked for product:', product.id);
            console.log('ProductQuickActions: Full product.variations array:', product.variations);
            console.log('ProductQuickActions: First variation:', product.variations?.[0]);
            console.log('ProductQuickActions: First variation ID:', product.variations?.[0]?.id);
            onAddToCart(e);
          }}
          disabled={addingToCart}
        >
          {addingToCart ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <ShoppingBag className="mr-2 w-4 h-4" />
              Add to Cart
            </>
          )}
        </Button>
      </div> */}
    </>
  );
}