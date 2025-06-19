import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProductReviews } from './ProductReviews';
import { Product } from '@/lib/api/products';

interface ProductTabsProps {
  product: Product;
  onReviewSubmitted: () => void;
}

export function ProductTabs({ product, onReviewSubmitted }: ProductTabsProps) {
    const reviewCount = product.reviews.length;
  return (
    <Tabs defaultValue="description" className="mb-16">
      <TabsList className="grid grid-cols-4 w-full">
        <TabsTrigger value="description">Description</TabsTrigger>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="shipping">Shipping</TabsTrigger>
        <TabsTrigger value="reviews">Reviews ({reviewCount || 0})</TabsTrigger>
      </TabsList>
      
      <TabsContent value="description" className="mt-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 font-semibold">Product Description</h3>
            <p className="mb-6 text-muted-foreground">{product.description}</p>
            
            {product.tags && product.tags.length > 0 && (
              <>
                <h4 className="mb-3 font-semibold">Tags</h4>
                <div className="flex flex-wrap gap-2 mb-6">
                  {product.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="details" className="mt-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 font-semibold">Product Details</h3>
            <div className="space-y-4">
              <div className="gap-4 grid grid-cols-2">
                <div>
                  <p className="font-medium text-sm">Brand</p>
                  <p className="text-muted-foreground">{product.brand?.name}</p>
                </div>
                <div>
                  <p className="font-medium text-sm">Category</p>
                  <p className="text-muted-foreground">{product.category?.name}</p>
                </div>
                {product.variations[0]?.volume && (
                  <div>
                    <p className="font-medium text-sm">Volume</p>
                    <p className="text-muted-foreground">{product.variations[0].volume}</p>
                  </div>
                )}
                {product.variations[0]?.weightGrams && (
                  <div>
                    <p className="font-medium text-sm">Weight</p>
                    <p className="text-muted-foreground">{product.variations[0].weightGrams}g</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="shipping" className="mt-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="mb-4 font-semibold">Shipping Information</h3>
            <p className="mb-4 text-muted-foreground">
              We offer standard shipping on all orders, with delivery times varying by location.
            </p>
            <div className="space-y-4">
              <div>
                <h4 className="mb-2 font-medium">Delivery Time</h4>
                <p className="text-muted-foreground">
                  - Standard Shipping: 3-7 business days<br />
                  - Express Shipping: 1-3 business days (additional fee)
                </p>
              </div>
              <div>
                <h4 className="mb-2 font-medium">Return Policy</h4>
                <p className="text-muted-foreground">
                  Products can be returned within 30 days of delivery for a full refund.
                  Items must be unused and in their original packaging.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="reviews" className="mt-6">
        <ProductReviews 
          productId={product.id} 
          reviews={product.reviews} 
          onReviewSubmitted={onReviewSubmitted}
        />
      </TabsContent>
    </Tabs>
  );
}