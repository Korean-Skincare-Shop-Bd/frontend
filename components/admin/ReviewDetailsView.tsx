"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useAdmin } from '@/contexts/AdminContext';
import {
  ArrowLeft,
  Star,
  Edit,
  Trash2,
  Save,
  X,
  Calendar,
  User,
  Mail,
  Package,
  MessageCircle,
  RefreshCw,
  Eye,
} from 'lucide-react';
import {
  getReviewById,
  updateReview,
  deleteReview,
  Review,
  UpdateReviewParams,
} from '@/lib/api/review';

interface ReviewDetailsViewProps {
  reviewId: string;
}

export function ReviewDetailsView({ reviewId }: ReviewDetailsViewProps) {
  const { token } = useAdmin();
  const { toast } = useToast();
  const router = useRouter();

  // State
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form state for editing
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    rating: 1,
    comment: '',
  });

  // Fetch review details
  const fetchReview = async () => {
    if (!token || !reviewId) return;

    try {
      setLoading(true);
      const reviewData = await getReviewById(reviewId, true);
      setReview(reviewData);
      setFormData({
        customerName: reviewData.customerName,
        email: reviewData.email,
        rating: reviewData.rating,
        comment: reviewData.comment,
      });
    } catch (error) {
      console.error('Failed to fetch review:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch review details',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchReview();
  }, [token, reviewId]);

  // Handle save
  const handleSave = async () => {
    if (!review) return;

    try {
      setSaving(true);
      const updateData: UpdateReviewParams = formData;
      await updateReview(review.id, updateData);
      
      toast({
        title: 'Success',
        description: 'Review updated successfully',
      });
      
      setEditing(false);
      fetchReview(); // Refresh data
    } catch (error) {
      console.error('Failed to update review:', error);
      toast({
        title: 'Error',
        description: 'Failed to update review',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    if (!review) return;

    try {
      await deleteReview(review.id);
      toast({
        title: 'Success',
        description: 'Review deleted successfully',
      });
      router.push('/admin/reviews');
    } catch (error) {
      console.error('Failed to delete review:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete review',
        variant: 'destructive',
      });
    }
  };

  // Cancel editing
  const handleCancel = () => {
    if (review) {
      setFormData({
        customerName: review.customerName,
        email: review.email,
        rating: review.rating,
        comment: review.comment,
      });
    }
    setEditing(false);
  };

  // Format rating stars
  const formatStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span className="ml-2">Loading review...</span>
        </div>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/admin/reviews')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Reviews
          </Button>
        </div>

        <div className="text-center py-12">
          <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Review not found</h3>
          <p className="text-muted-foreground">
            The review you're looking for doesn't exist or has been deleted.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/admin/reviews')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Reviews
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Review Details</h1>
            <p className="text-muted-foreground">
              Review for {review.productName}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {!editing ? (
            <>
              <Button
                variant="outline"
                onClick={() => setEditing(true)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Review</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this review? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={saving}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              
              <Button
                onClick={handleSave}
                disabled={saving}
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Review Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Customer Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="customerName">Customer Name</Label>
              {editing ? (
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, customerName: e.target.value }))
                  }
                  disabled={saving}
                />
              ) : (
                <p className="text-sm font-medium">{review.customerName}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              {editing ? (
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, email: e.target.value }))
                  }
                  disabled={saving}
                />
              ) : (
                <p className="text-sm">{review.email}</p>
              )}
            </div>

            <div>
              <Label>Review Date</Label>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                {new Date(review.createdAt).toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Product Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Product Name</Label>
              <p className="text-sm font-medium">{review.productName}</p>
            </div>

            <div>
              <Label>Product ID</Label>
              <p className="text-sm text-muted-foreground font-mono">
                {review.productId}
              </p>
            </div>

            <div>
              <Label>Rating</Label>
              {editing ? (
                <Select
                  value={formData.rating.toString()}
                  onValueChange={(value) =>
                    setFormData(prev => ({ ...prev, rating: parseInt(value) }))
                  }
                  disabled={saving}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 star</SelectItem>
                    <SelectItem value="2">2 stars</SelectItem>
                    <SelectItem value="3">3 stars</SelectItem>
                    <SelectItem value="4">4 stars</SelectItem>
                    <SelectItem value="5">5 stars</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {formatStars(review.rating)}
                  </div>
                  <span className="text-sm font-medium">
                    {review.rating} out of 5
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Review Comment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            Review Comment
          </CardTitle>
        </CardHeader>
        <CardContent>
          {editing ? (
            <div>
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                value={formData.comment}
                onChange={(e) =>
                  setFormData(prev => ({ ...prev, comment: e.target.value }))
                }
                disabled={saving}
                rows={6}
                placeholder="Review comment..."
                className="mt-2"
              />
            </div>
          ) : (
            <div>
              {review.comment ? (
                <div className="p-4 bg-muted rounded-md">
                  <p className="text-sm whitespace-pre-wrap">{review.comment}</p>
                </div>
              ) : (
                <div className="p-4 bg-muted rounded-md text-center">
                  <p className="text-sm text-muted-foreground">
                    No comment provided with this review
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
