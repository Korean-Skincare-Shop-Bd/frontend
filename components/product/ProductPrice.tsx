interface ProductPriceProps {
  price: number;
  originalPrice: number | null;
}

export function ProductPrice({ price, originalPrice }: ProductPriceProps) {
  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <span className="font-bold text-sm sm:text-lg golden-text">
        ৳{price}
      </span>
      {originalPrice && Number(originalPrice) > Number(price) && (
        <span className="text-muted-foreground text-xs sm:text-sm line-through">
          ৳{originalPrice}
        </span>
      )}
    </div>
  );
}