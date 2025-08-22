import { useState } from 'react';
import { useToast } from './use-toast';
import {
  Review,
  ReviewsResponse,
  ReviewStatistics,
  GetReviewsParams,
  UpdateReviewParams,
  getReviewsAdmin,
  getReviewStatistics,
  updateReview,
  deleteReview,
  bulkDeleteReviews,
  searchReviews,
  getLatestReviews,
} from '@/lib/api/review';

interface ReviewFilters {
  search: string;
  rating: string;
  hasComment: string;
  dateFrom: string;
  dateTo: string;
  sortBy: 'rating' | 'createdAt' | 'customerName';
  sortOrder: 'asc' | 'desc';
}

export const useReviews = (token: string | null) => {
  const { toast } = useToast();
  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState<ReviewStatistics | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  const [filters, setFilters] = useState<ReviewFilters>({
    search: '',
    rating: 'all',
    hasComment: 'all',
    dateFrom: '',
    dateTo: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // Fetch reviews with current filters
  const fetchReviews = async (
    page?: number,
    customFilters?: Partial<ReviewFilters>
  ) => {
    if (!token) return;

    try {
      setLoading(true);
      
      const currentFilters = { ...filters, ...customFilters };
      const pageToFetch = page || currentPage;

      const params: GetReviewsParams = {
        page: pageToFetch,
        limit: pagination.limit,
        sortBy: currentFilters.sortBy,
        sortOrder: currentFilters.sortOrder,
      };

      if (currentFilters.search) params.search = currentFilters.search;
      if (currentFilters.rating && currentFilters.rating !== 'all') params.rating = parseInt(currentFilters.rating);
      if (currentFilters.hasComment && currentFilters.hasComment !== 'all') params.hasComment = currentFilters.hasComment === 'true';
      if (currentFilters.dateFrom) params.dateFrom = currentFilters.dateFrom;
      if (currentFilters.dateTo) params.dateTo = currentFilters.dateTo;

      const response: ReviewsResponse = await getReviewsAdmin(params);
      setReviews(response.reviews);
      setPagination(response.pagination);
      setCurrentPage(pageToFetch);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch reviews',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStatistics = async () => {
    if (!token) return;

    try {
      const stats = await getReviewStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Failed to fetch statistics:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch review statistics',
        variant: 'destructive',
      });
    }
  };

  // Update review
  const updateReviewById = async (id: string, updateData: UpdateReviewParams) => {
    if (!token) return false;

    try {
      await updateReview(id, updateData);
      toast({
        title: 'Success',
        description: 'Review updated successfully',
      });
      fetchReviews(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Failed to update review:', error);
      toast({
        title: 'Error',
        description: 'Failed to update review',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Delete single review
  const deleteReviewById = async (id: string) => {
    if (!token) return false;

    try {
      await deleteReview(id);
      toast({
        title: 'Success',
        description: 'Review deleted successfully',
      });
      fetchReviews(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Failed to delete review:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete review',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Bulk delete reviews
  const bulkDeleteReviewsByIds = async (reviewIds: string[]) => {
    if (!token) return false;

    try {
      await bulkDeleteReviews(reviewIds);
      toast({
        title: 'Success',
        description: `${reviewIds.length} reviews deleted successfully`,
      });
      fetchReviews(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Failed to delete reviews:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete reviews',
        variant: 'destructive',
      });
      return false;
    }
  };

  // Search reviews
  const searchReviewsWithTerm = async (searchTerm: string, limit: number = 20) => {
    if (!token) return [];

    try {
      const response = await searchReviews({ searchTerm, limit });
      return response.results;
    } catch (error) {
      console.error('Failed to search reviews:', error);
      toast({
        title: 'Error',
        description: 'Failed to search reviews',
        variant: 'destructive',
      });
      return [];
    }
  };

  // Get latest reviews
  const fetchLatestReviews = async (limit: number = 10) => {
    if (!token) return [];

    try {
      const latestReviews = await getLatestReviews(limit);
      return latestReviews;
    } catch (error) {
      console.error('Failed to fetch latest reviews:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch latest reviews',
        variant: 'destructive',
      });
      return [];
    }
  };

  // Update filters
  const updateFilters = (newFilters: Partial<ReviewFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      search: '',
      rating: 'all',
      hasComment: 'all',
      dateFrom: '',
      dateTo: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    setCurrentPage(1);
  };

  return {
    // State
    reviews,
    loading,
    statistics,
    currentPage,
    pagination,
    filters,
    
    // Actions
    fetchReviews,
    fetchStatistics,
    updateReviewById,
    deleteReviewById,
    bulkDeleteReviewsByIds,
    searchReviewsWithTerm,
    fetchLatestReviews,
    updateFilters,
    clearFilters,
    setCurrentPage,
  };
};
