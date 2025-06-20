const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Product {
  id: string;
  name: string;
  description?: string;
  categoryId?: string;
  brandId?: string;
  baseImageUrl?: string;
  tags: string[];
  isPublished: boolean;
  expiryDate?: string;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
    description?: string;
  };
  brand?: {
    id: string;
    name: string;
    logoUrl?: string;
    description?: string;
  };
  variations: ProductVariation[];
  images: ProductImage[];
  maxPrice:number;
  minPrice:number;
  reviews:ProductReview[];
}
export interface ProductReview{
  id:string
  email:string
  customerName:string,
  rating:number
  comment:string
  createdAt:string
}

export interface ProductVariation {
  id: string;
  name?: string;
  price: number;
  salePrice?: number;
  discount?: number;
  volume?: string;
  stockQuantity: number;
  imageUrl?: string;
  attributes?: Record<string, any>;
  tags?: string[];
  weightGrams?: number;
  productId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  filename: string;
  originalName: string;
  imageUrl: string;
  altText?: string;
  isMainImage: boolean;
  productId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductRequest {
  name: string;
  price: number;
  salePrice?: number;
  stockQuantity?: number;
  volume?: string;
  weightGrams?: number;
  description?: string;
  categoryId?: string;
  brandId?: string;
  tags?: string;
  isPublished?: boolean;
  expiryDate?: string;
  image?: File;
  additionalImages?: File[];
}

export interface ProductsResponse {
  data: any;
  products: Product[];
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}

export interface GetProductsParams {
  page?: number;
  limit?: number;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  search?:string;
  sortBy?: 'price' | 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export const getProducts = async (params: GetProductsParams = {}): Promise<ProductsResponse> => {
  const {
    page = 1,
    limit = 20,
    category,
    brand,
    minPrice,
    maxPrice,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = params;

  const searchParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    sortBy,
    sortOrder
  });

  if (category) searchParams.append('category', category);
  if (brand) searchParams.append('brand', brand);
  if (minPrice !== undefined) searchParams.append('minPrice', minPrice.toString());
  if (maxPrice !== undefined) searchParams.append('maxPrice', maxPrice.toString());
  if (search!== undefined) searchParams.append('search', search);
  searchParams.append('includeVariations', 'true')

  const response = await fetch(`${API_BASE_URL}/products/public?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  return response.json();
};
export const deleteProduct = async (token: string, id: string): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Product not found');
    }
    if (response.status === 401) {
      throw new Error('Unauthorized');
    }
    throw new Error('Failed to delete product');
  }

  return await response.json();
};
export const createProduct = async (token: string, productData: CreateProductRequest): Promise<Product> => {
  const formData = new FormData();
  
  Object.entries(productData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (key === 'additionalImages' && Array.isArray(value)) {
        value.forEach((file) => formData.append('additionalImages', file));
      } else if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value.toString());
      }
    }
  });

  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to create product');
  }

  const result = await response.json();
  return result.data;
};
export const getProduct = async ( id: string): Promise<Product> => {
  const response = await fetch(`${API_BASE_URL}/products/public/${id}`, {
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Product not found');
    }
    if (response.status === 401) {
      throw new Error('Unauthorized');
    }
    throw new Error('Failed to fetch product');
  }

  const result = await response.json();
  return result
};

export const updateProduct = async (token: string, id: string, productData: UpdateProductRequest): Promise<Product> => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(productData),
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Product not found');
    }
    if (response.status === 401) {
      throw new Error('Unauthorized');
    }
    throw new Error('Failed to update product');
  }

  const result = await response.json();
  return result.data;
};

// Add these new interfaces
export interface CreateVariationRequest {
  price: number;
  salePrice?: number;
  stockQuantity: number;
  volume?: string;
  weightGrams?: number;
  color?: string;
  size?: string;
  isDefault?: boolean;
}

export interface UpdateVariationRequest {
  price?: number;
  salePrice?: number;
  stockQuantity?: number;
  volume?: string;
  weightGrams?: number;
  color?: string;
  size?: string;
  isDefault?: boolean;
}

export interface UpdateImageRequest {
  isPrimary?: boolean;
  altText?: string;
}

// Add these new API functions
export const createProductVariation = async (
  token: string, 
  productId: string, 
  variationData: CreateVariationRequest
): Promise<ProductVariation> => {
  const response = await fetch(`${API_BASE_URL}/products/${productId}/variations`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(variationData),
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Product not found');
    }
    if (response.status === 401) {
      throw new Error('Unauthorized');
    }
    throw new Error('Failed to create variation');
  }

  const result = await response.json();
  return result;
};

export const updateProductVariation = async (
  token: string, 
  productId: string, 
  variationId: string, 
  variationData: UpdateVariationRequest
): Promise<ProductVariation> => {
  const response = await fetch(`${API_BASE_URL}/products/${productId}/variations/${variationId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(variationData),
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Product or variation not found');
    }
    if (response.status === 401) {
      throw new Error('Unauthorized');
    }
    throw new Error('Failed to update variation');
  }

  const result = await response.json();
  return result;
};

export const deleteProductVariation = async (
  token: string, 
  productId: string, 
  variationId: string
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/products/${productId}/variations/${variationId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Product or variation not found');
    }
    if (response.status === 401) {
      throw new Error('Unauthorized');
    }
    throw new Error('Failed to delete variation');
  }
};

export const addProductImages = async (
  token: string, 
  productId: string, 
  images: File[], 
  isPrimary?: boolean
): Promise<ProductImage[]> => {
  const formData = new FormData();
  
  images.forEach((image) => {
    formData.append('image', image);
  });
  
  if (isPrimary !== undefined) {
    formData.append('isPrimary', String(isPrimary));
  }

  const response = await fetch(`${API_BASE_URL}/products/${productId}/images`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Product not found');
    }
    if (response.status === 401) {
      throw new Error('Unauthorized');
    }
    throw new Error('Failed to add images');
  }

  const result = await response.json();
  return result;
};

export const updateProductImage = async (
  token: string, 
  productId: string, 
  imageId: string, 
  imageData: UpdateImageRequest
): Promise<ProductImage> => {
  const response = await fetch(`${API_BASE_URL}/products/${productId}/images/${imageId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(imageData),
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Product or image not found');
    }
    if (response.status === 401) {
      throw new Error('Unauthorized');
    }
    throw new Error('Failed to update image');
  }

  const result = await response.json();
  return result;
};

export const deleteProductImage = async (
  token: string, 
  productId: string, 
  imageId: string
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/products/${productId}/images/${imageId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Product or image not found');
    }
    if (response.status === 401) {
      throw new Error('Unauthorized');
    }
    throw new Error('Failed to delete image');
  }
};

// Update the existing UpdateProductRequest interface
export interface UpdateProductRequest {
  name?: string;
  description?: string;
  categoryId?: string;
  brandId?: string;
  tags?: string[];
  isPublished?: boolean;
  expiryDate?: string;
  // Remove variations and images from here since they're handled separately
}