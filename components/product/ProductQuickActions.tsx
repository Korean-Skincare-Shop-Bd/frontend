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
      <div className={`absolute top-1 sm:top-2 right-1 sm:right-2 transition-all duration-300 ${hovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}`}>
        <Button
          size="icon"
          variant="secondary"
          className="bg-gray-800 hover:bg-black w-7 h-7 sm:w-10 sm:h-10"
          onClick={onQuickView}
        >
          <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
        </Button>
      </div>
      <div className={`absolute bottom-1 sm:bottom-2 left-1 sm:left-2 right-1 sm:right-2 transition-all duration-300 ${hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <Button
          className="w-full golden-button text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2 h-7 sm:h-9"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onAddToCart(e);
          }}
          disabled={addingToCart}
        >
          {addingToCart ? (
            <>
              <Loader2 className="mr-1 sm:mr-2 w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
              <span className="hidden sm:inline">Adding...</span>
              <span className="sm:hidden">Add...</span>
            </>
          ) : (
            <>
              <ShoppingBag className="mr-1 sm:mr-2 w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Add to Cart</span>
              <span className="sm:hidden">Add</span>
            </>
          )}
        </Button>
      </div>
    </>
  );
}