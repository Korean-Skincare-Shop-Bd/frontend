import { motion } from 'framer-motion';
import { Product } from '@/lib/api/products';
import { ProductCard } from './ProductCard';

interface ProductsSectionProps {
  products: Product[];
  hoveredProduct: string | null;
  setHoveredProduct: (id: string | null) => void;
  handleAddToCart: (product: Product, variationId?: string) => Promise<void>;
  addingToCart: string | null;
  handleQuickView: (product: Product) => void;
  getProductPrice: (product: Product) => { price: number; originalPrice: number | null };
  getMainImage: (product: Product) => string;
  isNewProduct: (createdAt: string) => boolean;
  isOnSale: (product: Product) => boolean;
}

export function ProductsSection({
  products,
  hoveredProduct,
  setHoveredProduct,
  handleAddToCart,
  addingToCart,
  handleQuickView,
  getProductPrice,
  getMainImage,
  isNewProduct,
  isOnSale,
}: ProductsSectionProps) {
  return (
    <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product, index) => {
        const { price, originalPrice } = getProductPrice(product);
        const mainImageUrl = getMainImage(product);
        const isNew = isNewProduct(product.createdAt);
        const onSale = isOnSale(product);

        return (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            onMouseEnter={() => setHoveredProduct(product.id)}
            onMouseLeave={() => setHoveredProduct(null)}
            className="group"
          >
            <ProductCard
              product={product}
              mainImage={mainImageUrl}
              isNew={isNew}
              onSale={onSale}
              hovered={hoveredProduct === product.id}
              onAddToCart={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddToCart(product);
              }}
              addingToCart={addingToCart === product.id}
              onQuickView={() => handleQuickView(product)}
              price={price}
              originalPrice={originalPrice}
            />
          </motion.div>
        );
      })}
    </div>
  );
}