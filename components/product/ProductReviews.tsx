import { ProductReview } from '@/lib/api/products';
import { Star } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { ProductReviewForm } from './ProductReviewForm';

interface ProductReviewsProps {
  productId: string;
  reviews: ProductReview[];
  onReviewSubmitted: () => void;
}

export function ProductReviews({ productId, reviews, onReviewSubmitted }: ProductReviewsProps) {
  return (
    <div className="space-y-8">
      <Card className="mb-6">
        <CardContent className="p-6">
          <h3 className="mb-4 font-semibold">Write a Review</h3>
          <ProductReviewForm 
            productId={productId} 
            onReviewSubmitted={onReviewSubmitted} 
          />
        </CardContent>
      </Card>
      
      {reviews && reviews.length > 0 ? (
        <div className="space-y-6">
          <h3 className="font-semibold text-lg">Customer Reviews</h3>
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarFallback>{review.email.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold">{review.customerName}</h4>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className='text-sm'>{review.email}</h2>
                    </div>
                    
                    
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? 'fill-primary text-primary'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>                      <span className="text-muted-foreground text-sm">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <p className="text-muted-foreground">{review.comment}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-8 text-center">
          <p className="mb-4 text-muted-foreground">No reviews yet. Be the first to review this product!</p>
        </div>
      )}
    </div>
  );
}