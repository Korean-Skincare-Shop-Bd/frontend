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

// Admin-specific interfaces and functions
export interface UpdateReviewParams {
  customerName?: string;
  email?: string;
  rating?: number;
  comment?: string;
}

export interface BulkDeleteParams {
  reviewIds: string[];
}

export interface SearchReviewsParams {
  searchTerm: string;
  limit?: number;
}

export interface SearchReviewsResponse {
  results: Review[];
  count: number;
  searchTerm: string;
}

// Admin functions requiring authentication
const getAuthHeaders = () => {
  const token = localStorage.getItem('adminToken');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

export const getReviewsAdmin = async (params: GetReviewsParams = {}): Promise<ReviewsResponse> => {
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
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to fetch reviews');
  }

  return response.json();
};

export const getReviewById = async (id: string, includeProduct: boolean = true): Promise<Review> => {
  const queryParams = new URLSearchParams();
  if (includeProduct) queryParams.append('includeProduct', 'true');

  const url = `${API_BASE_URL}/reviews/${id}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to fetch review');
  }

  return response.json();
};

export const updateReview = async (id: string, updateData: UpdateReviewParams): Promise<Review> => {
  const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(updateData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to update review');
  }

  return response.json();
};

export const deleteReview = async (id: string): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/reviews/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to delete review');
  }

  return response.json();
};

export const bulkDeleteReviews = async (reviewIds: string[]): Promise<{ message: string; deletedCount: number }> => {
  const response = await fetch(`${API_BASE_URL}/reviews/bulk-delete`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
    body: JSON.stringify({ reviewIds }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to delete reviews');
  }

  return response.json();
};

export const searchReviews = async (params: SearchReviewsParams): Promise<SearchReviewsResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append('searchTerm', params.searchTerm);
  if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());

  const url = `${API_BASE_URL}/reviews/search?${queryParams.toString()}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to search reviews');
  }

  return response.json();
};

export const getLatestReviews = async (limit: number = 10): Promise<Review[]> => {
  const queryParams = new URLSearchParams();
  queryParams.append('limit', limit.toString());

  const url = `${API_BASE_URL}/reviews/latest?${queryParams.toString()}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to fetch latest reviews');
  }

  return response.json();
};

export const getReviewsByRating = async (minRating: number = 1, maxRating: number = 5, limit: number = 100) => {
  const queryParams = new URLSearchParams();
  queryParams.append('minRating', minRating.toString());
  queryParams.append('maxRating', maxRating.toString());
  queryParams.append('limit', limit.toString());

  const url = `${API_BASE_URL}/reviews/by-rating?${queryParams.toString()}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to fetch reviews by rating');
  }

  return response.json();
};

export const getReviewsByCustomer = async (email: string, limit: number = 50) => {
  const queryParams = new URLSearchParams();
  queryParams.append('limit', limit.toString());

  const url = `${API_BASE_URL}/reviews/by-customer/${encodeURIComponent(email)}?${queryParams.toString()}`;
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to fetch customer reviews');
  }

  return response.json();
};