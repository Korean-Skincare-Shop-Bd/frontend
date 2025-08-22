"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useAdmin } from '@/contexts/AdminContext';
import { useReviews } from '@/hooks/use-reviews';
import {
  Search,
  Star,
  Eye,
  Edit,
  Trash2,
  Filter,
  Download,
  Calendar,
  User,
  Mail,
  Package,
  MessageCircle,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  CheckSquare,
  Square,
  MoreHorizontal,
  RefreshCw,
} from 'lucide-react';
import {
  Review,
  UpdateReviewParams,
} from '@/lib/api/review';

export function ReviewsManager() {
  const { token } = useAdmin();
  const { toast } = useToast();

  // Use the reviews hook
  const {
    reviews,
    loading,
    statistics,
    currentPage,
    pagination,
    filters,
    fetchReviews,
    fetchStatistics,
    updateReviewById,
    deleteReviewById,
    bulkDeleteReviewsByIds,
    updateFilters,
    clearFilters,
    setCurrentPage,
  } = useReviews(token);

  // Local state for UI
  const [selectedReviews, setSelectedReviews] = useState<Set<string>>(new Set());
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [viewingReview, setViewingReview] = useState<Review | null>(null);

  // Dialog states
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);

  // Initial data fetch
  useEffect(() => {
    if (token) {
      fetchReviews();
      fetchStatistics();
    }
  }, [token]);

  // Refetch when filters or page changes
  useEffect(() => {
    if (token) {
      fetchReviews();
    }
  }, [currentPage, filters]);

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    updateFilters({ [key]: value });
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('-');
    updateFilters({ 
      sortBy: sortBy as 'rating' | 'createdAt' | 'customerName', 
      sortOrder: sortOrder as 'asc' | 'desc' 
    });
  };

  // Handle review selection
  const handleReviewSelect = (reviewId: string, selected: boolean) => {
    const newSelection = new Set(selectedReviews);
    if (selected) {
      newSelection.add(reviewId);
    } else {
      newSelection.delete(reviewId);
    }
    setSelectedReviews(newSelection);
  };

  // Handle select all
  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedReviews(new Set(reviews.map(r => r.id)));
    } else {
      setSelectedReviews(new Set());
    }
  };

  // Handle edit review
  const handleEditReview = async (reviewData: UpdateReviewParams) => {
    if (!editingReview) return;

    const success = await updateReviewById(editingReview.id, reviewData);
    if (success) {
      setEditDialogOpen(false);
      setEditingReview(null);
    }
  };

  // Handle delete review
  const handleDeleteReview = async (reviewId: string) => {
    await deleteReviewById(reviewId);
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    const reviewIds = Array.from(selectedReviews);
    const success = await bulkDeleteReviewsByIds(reviewIds);
    if (success) {
      setSelectedReviews(new Set());
      setBulkDeleteDialogOpen(false);
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    fetchReviews();
    fetchStatistics();
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

  if (loading && reviews.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center py-12">
          <RefreshCw className="w-6 h-6 animate-spin" />
          <span className="ml-2">Loading reviews...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Reviews Management</h1>
          <p className="text-muted-foreground">
            Manage and moderate customer reviews
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Reviews</p>
                  <p className="text-2xl font-bold">{statistics.totalReviews}</p>
                </div>
                <MessageCircle className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Average Rating</p>
                  <p className="text-2xl font-bold">{statistics.averageRating.toFixed(1)}</p>
                </div>
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">{statistics.reviewsThisMonth}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Last Month</p>
                  <p className="text-2xl font-bold">{statistics.reviewsLastMonth}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search reviews..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Rating Filter */}
            <div className="space-y-2">
              <Label>Rating</Label>
              <Select
                value={filters.rating}
                onValueChange={(value) => handleFilterChange('rating', value === 'all' ? '' : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All ratings" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All ratings</SelectItem>
                  <SelectItem value="5">5 stars</SelectItem>
                  <SelectItem value="4">4 stars</SelectItem>
                  <SelectItem value="3">3 stars</SelectItem>
                  <SelectItem value="2">2 stars</SelectItem>
                  <SelectItem value="1">1 star</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Comment Filter */}
            <div className="space-y-2">
              <Label>Has Comment</Label>
              <Select
                value={filters.hasComment}
                onValueChange={(value) => handleFilterChange('hasComment', value === 'all' ? '' : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All reviews" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All reviews</SelectItem>
                  <SelectItem value="true">With comments</SelectItem>
                  <SelectItem value="false">Rating only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date From */}
            <div className="space-y-2">
              <Label>Date From</Label>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
              />
            </div>

            {/* Date To */}
            <div className="space-y-2">
              <Label>Date To</Label>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Sort */}
            <div className="flex items-center gap-2">
              <Label>Sort by:</Label>
              <Select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onValueChange={handleSortChange}
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt-desc">Newest first</SelectItem>
                  <SelectItem value="createdAt-asc">Oldest first</SelectItem>
                  <SelectItem value="rating-desc">Highest rating</SelectItem>
                  <SelectItem value="rating-asc">Lowest rating</SelectItem>
                  <SelectItem value="customerName-asc">Customer A-Z</SelectItem>
                  <SelectItem value="customerName-desc">Customer Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
              {selectedReviews.size > 0 && (
                <AlertDialog
                  open={bulkDeleteDialogOpen}
                  onOpenChange={setBulkDeleteDialogOpen}
                >
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Selected ({selectedReviews.size})
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Reviews</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete {selectedReviews.size} selected reviews?
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleBulkDelete}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            Reviews ({pagination.total})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No reviews found</h3>
              <p className="text-muted-foreground">
                {filters.search || (filters.rating && filters.rating !== 'all') || (filters.hasComment && filters.hasComment !== 'all') || filters.dateFrom || filters.dateTo
                  ? 'Try adjusting your filters to see more results.'
                  : 'No reviews have been submitted yet.'}
              </p>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedReviews.size === reviews.length && reviews.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Comment</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="w-24">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reviews.map((review) => (
                      <TableRow key={review.id}>
                        <TableCell>
                          <Checkbox
                            checked={selectedReviews.has(review.id)}
                            onCheckedChange={(checked) =>
                              handleReviewSelect(review.id, checked as boolean)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{review.customerName}</div>
                            <div className="text-sm text-muted-foreground">
                              {review.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-sm">
                            {review.productName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {formatStars(review.rating)}
                            <span className="ml-1 text-sm font-medium">
                              {review.rating}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs">
                            {review.comment ? (
                              <p className="text-sm truncate" title={review.comment}>
                                {review.comment}
                              </p>
                            ) : (
                              <span className="text-muted-foreground text-sm">
                                No comment
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setViewingReview(review);
                                setViewDialogOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              asChild
                            >
                              <Link href={`/admin/reviews/${review.id}`}>
                                <Package className="w-4 h-4" />
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingReview(review);
                                setEditDialogOpen(true);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Review</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this review?
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteReview(review.id)}
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {reviews.map((review) => (
                  <Card key={review.id} className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={selectedReviews.has(review.id)}
                            onCheckedChange={(checked) =>
                              handleReviewSelect(review.id, checked as boolean)
                            }
                          />
                          <div>
                            <div className="font-medium">{review.customerName}</div>
                            <div className="text-sm text-muted-foreground">
                              {review.email}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setViewingReview(review);
                              setViewDialogOpen(true);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                          >
                            <Link href={`/admin/reviews/${review.id}`}>
                              <Package className="w-4 h-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingReview(review);
                              setEditDialogOpen(true);
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div>
                        <div className="font-medium text-sm mb-1">{review.productName}</div>
                        <div className="flex items-center gap-1">
                          {formatStars(review.rating)}
                          <span className="ml-1 text-sm font-medium">{review.rating}</span>
                        </div>
                      </div>

                      {review.comment && (
                        <div>
                          <p className="text-sm">{review.comment}</p>
                        </div>
                      )}

                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Review</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete this review?
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteReview(review.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={!pagination.hasPrev || loading}
                  >
                    Previous
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          disabled={loading}
                          className="w-10"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={!pagination.hasNext || loading}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* View Review Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
          </DialogHeader>
          {viewingReview && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Customer</Label>
                  <p className="text-sm">{viewingReview.customerName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Email</Label>
                  <p className="text-sm">{viewingReview.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Product</Label>
                  <p className="text-sm">{viewingReview.productName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Date</Label>
                  <p className="text-sm">
                    {new Date(viewingReview.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium">Rating</Label>
                <div className="flex items-center gap-1 mt-1">
                  {formatStars(viewingReview.rating)}
                  <span className="ml-2 text-sm font-medium">
                    {viewingReview.rating} out of 5
                  </span>
                </div>
              </div>

              {viewingReview.comment && (
                <div>
                  <Label className="text-sm font-medium">Comment</Label>
                  <div className="mt-1 p-3 bg-muted rounded-md">
                    <p className="text-sm">{viewingReview.comment}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Review Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Review</DialogTitle>
            <DialogDescription>
              Update the review details below.
            </DialogDescription>
          </DialogHeader>
          {editingReview && <EditReviewForm review={editingReview} onSave={handleEditReview} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Edit Review Form Component
interface EditReviewFormProps {
  review: Review;
  onSave: (data: UpdateReviewParams) => void;
}

function EditReviewForm({ review, onSave }: EditReviewFormProps) {
  const [formData, setFormData] = useState({
    customerName: review.customerName,
    email: review.email,
    rating: review.rating,
    comment: review.comment,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="customerName">Customer Name</Label>
          <Input
            id="customerName"
            value={formData.customerName}
            onChange={(e) =>
              setFormData(prev => ({ ...prev, customerName: e.target.value }))
            }
            required
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData(prev => ({ ...prev, email: e.target.value }))
            }
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="rating">Rating</Label>
        <Select
          value={formData.rating.toString()}
          onValueChange={(value) =>
            setFormData(prev => ({ ...prev, rating: parseInt(value) }))
          }
        >
          <SelectTrigger>
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
      </div>

      <div>
        <Label htmlFor="comment">Comment</Label>
        <Textarea
          id="comment"
          value={formData.comment}
          onChange={(e) =>
            setFormData(prev => ({ ...prev, comment: e.target.value }))
          }
          rows={4}
          placeholder="Review comment..."
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit">Save Changes</Button>
      </div>
    </form>
  );
}
