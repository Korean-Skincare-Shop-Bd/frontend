const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Banner {
  id: string;
  imageUrl: string;
  linkUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBannerRequest {
  image: File;
  linkUrl?: string;
  isActive?: boolean;
}

export interface BannersResponse {
    banners: Banner[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNext: boolean;
        hasPrev: boolean;
    };
}

export const getBanners = async (token: string): Promise<BannersResponse> => {
    const response = await fetch(`${API_BASE_URL}/banners`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch banners');
    }

    return response.json();
};

export const createBanner = async (token: string, bannerData: CreateBannerRequest): Promise<Banner> => {
  const formData = new FormData();
  
  Object.entries(bannerData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value.toString());
      }
    }
  });

  const response = await fetch(`${API_BASE_URL}/banners`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to create banner');
  }

  return response.json();
};

export const updateBanner = async (token: string, id: string, bannerData: Partial<CreateBannerRequest>): Promise<Banner> => {
  const formData = new FormData();
  
  Object.entries(bannerData).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value.toString());
      }
    }
  });

  const response = await fetch(`${API_BASE_URL}/banners/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to update banner');
  }

  return response.json();
};

export const deleteBanner = async (token: string, id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/banners/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete banner');
  }
};
export const getActiveBanners = async (): Promise<Banner[]> => {
    const response = await fetch(`${API_BASE_URL}/banners/active`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to fetch active banners');
    }

    const data = await response.json();
    return data.banners;
};