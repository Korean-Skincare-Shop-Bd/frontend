import { adminFetch } from "./adminFetch";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Category {
    id: string;
    name: string;
    slug?: string;
    description?: string;
    metaTitle?: string;
    metaDescription?: string;
    parentId?: string;
    imageUrl?: string;
    isActive?: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateCategoryRequest {
    name: string;
    description?: string;
    slug?: string;
    metaTitle?: string;
    metaDescription?: string;
    parentId?: string;
    image?: File;
}

export interface CategoriesResponse {
    categories: Category[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export const getCategories = async (page = 1, limit: number = 20): Promise<CategoriesResponse> => {
    const params = new URLSearchParams({ page: page.toString() });
    if (limit !== undefined) {
        params.append('limit', limit.toString());
    }
    const response = await fetch(`${API_BASE_URL}/categories?${params.toString()}`,
        { next: { revalidate: 300 } }
    );

    if (!response.ok) {
        throw new Error('Failed to fetch categories');
    }

    return response.json();
};

export const createCategory = async (categoryData: CreateCategoryRequest): Promise<Category> => {
    const response = await adminFetch(`/categories`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const message =
            errorData?.errors?.[0]?.message ||
            errorData?.message ||
            'Failed to create category';
        throw new Error(message);
    }

    const result = await response.json();
    return result.data;
};

export const updateCategory = async (id: string, categoryData: Partial<CreateCategoryRequest>): Promise<Category> => {
    const formData = new FormData();

    Object.entries(categoryData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
            if (value instanceof File) {
                formData.append(key, value);
            } else {
                formData.append(key, value.toString());
            }
        }
    });

    const response = await adminFetch(`/categories/${id}`, {
        method: 'PUT',
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const message =
            errorData?.errors?.[0]?.message ||
            errorData?.message ||
            'Failed to update category';
        throw new Error(message);
    }

    const result = await response.json();
    return result.data;
};

export const deleteCategory = async (id: string): Promise<void> => {
    const response = await adminFetch(`/categories/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Failed to delete category');
    }
};
