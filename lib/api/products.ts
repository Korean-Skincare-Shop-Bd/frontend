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
  url: string;
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

export const getProducts = async (token: string, page = 1, limit = 10): Promise<{ data: Product[]; total: number }> => {
  const response = await fetch(`${API_BASE_URL}/products?page=${page}&limit=${limit}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }

  return response.json();
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