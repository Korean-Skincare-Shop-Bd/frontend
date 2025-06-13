const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Types
export interface AdminLoginRequest {
    email: string;
    password: string;
}

export interface AdminLoginResponse {
    
        token: string;

        id: string;
        email: string;
        username: string;
}

export interface Admin {
    id: string;
    email: string;
    username: string;
    role?: string;
    isActive?: boolean;
    createdAt?: string;
}

export interface AdminStats {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalCustomers: number;
    revenueChange: string;
    ordersChange: string;
    productsChange: string;
    customersChange: string;
}

// Auth functions
export const adminLogin = async (credentials: AdminLoginRequest): Promise<AdminLoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/admins/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        throw new Error('Login failed');
    }

    return response.json();
};

// Admin management functions
export const getAdmins = async (token: string): Promise<Admin[]> => {
    const response = await fetch(`${API_BASE_URL}/admins`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch admins');
    }

    const result = await response.json();
    return result.data;
};

export const getAdminStats = async (token: string): Promise<AdminStats> => {
    const response = await fetch(`${API_BASE_URL}/admins/statistics/admin-summary`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch admin stats');
    }

    return response.json();
};