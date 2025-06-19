const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface CreateReviewParams {
  productId: string;
  customerName: string;
  email: string;
  rating: number;
  comment: string;
}

export interface GetReviewsParams {
  page?: number;
  limit?: number;
  productId?: string;
  search?: string;
  rating?: number;
  hasComment?: boolean;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'rating' | 'createdAt' | 'customerName';
  sortOrder?: 'asc' | 'desc';
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  email: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewsResponse {
  reviews: Review[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  statistics: {
    averageRating: number;
    totalReviews: number;
    ratingDistribution: {
      [key: string]: number;
    };
  };
}

export const createReview = async (reviewData: CreateReviewParams): Promise<any> => {
  const response = await fetch(`${API_BASE_URL}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(reviewData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to submit review');
  }

  return response.json();
};

export const getReviews = async (params: GetReviewsParams = {}): Promise<ReviewsResponse> => {
  const queryParams = new URLSearchParams();
  
  // Add parameters to query string if they exist
  if (params.page !== undefined) queryParams.append('page', params.page.toString());
  if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
  if (params.productId) queryParams.append('productId', params.productId);
  if (params.search) queryParams.append('search', params.search);
  if (params.rating !== undefined) queryParams.append('rating', params.rating.toString());
  if (params.hasComment !== undefined) queryParams.append('hasComment', params.hasComment.toString());
  if (params.dateFrom) queryParams.append('dateFrom', params.dateFrom);
  if (params.dateTo) queryParams.append('dateTo', params.dateTo);
  if (params.sortBy) queryParams.append('sortBy', params.sortBy);
  if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

  const url = `${API_BASE_URL}/reviews${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to fetch reviews');
  }

  return response.json();
};
export interface ReviewStatistics {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    [key: string]: number;
  };
  reviewsThisMonth: number;
  reviewsLastMonth: number;
}
export const getReviewStatistics = async (): Promise<ReviewStatistics> => {
  const response = await fetch(`${API_BASE_URL}/reviews/statistics`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to fetch review statistics');
  }

  return response.json();
};