import { useState } from 'react';
import { Star } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { createReview } from '@/lib/api/review';

interface ProductReviewFormProps {
  productId: string;
  onReviewSubmitted: () => void;
}

export function ProductReviewForm({ productId, onReviewSubmitted }: ProductReviewFormProps) {
  const [reviewEmail, setReviewEmail] = useState('');
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewDescription, setReviewDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmitReview = async () => {
    if (!reviewEmail || !reviewName || !reviewDescription || !reviewRating) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      await createReview({
        productId,
        email: reviewEmail,
        rating: reviewRating,
        customerName: reviewName,
        comment: reviewDescription
      });

      toast({
        title: "Success",
        description: "Your review has been submitted",
      });

      // Reset form fields
      setReviewEmail('');
      setReviewName('');
      setReviewRating(5);
      setReviewDescription('');
      
      // Notify parent component
      onReviewSubmitted();
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to submit review",
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block mb-1 font-medium text-sm">Email</label>
        <Input
          type="email"
          value={reviewEmail}
          onChange={(e) => setReviewEmail(e.target.value)}
          placeholder="Your email"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium text-sm">Name</label>
        <Input
          type="text"
          value={reviewName}
          onChange={(e) => setReviewName(e.target.value)}
          placeholder="Your name"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium text-sm">Rating</label>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setReviewRating(star)}
              className="focus:outline-none"
            >
              <Star
                className={`h-6 w-6 ${
                  star <= reviewRating
                    ? 'fill-primary text-primary'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="block mb-1 font-medium text-sm">Review</label>
        <Textarea
          value={reviewDescription}
          onChange={(e) => setReviewDescription(e.target.value)}
          placeholder="Share your experience with this product"
          rows={4}
        />
      </div>
      <Button 
        onClick={handleSubmitReview} 
        disabled={submitting}
        className="w-full"
      >
        {submitting ? 'Submitting...' : 'Submit Review'}
      </Button>
    </div>
  );
}