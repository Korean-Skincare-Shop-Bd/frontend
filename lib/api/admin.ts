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

export interface CreateAdminRequest {
    email: string;
    username: string;
    password: string;
}

export interface CreateAdminResponse {
    success: boolean;
    data: {
        id: string;
        email: string;
        username: string;
    };
}

export interface UpdateAdminRequest {
    username?: string;
    email?: string;
    role?: string;
    isActive?: boolean;
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
    return result.admins;
};

export const getAdminById = async (token: string, adminId: string): Promise<Admin> => {
    const response = await fetch(`${API_BASE_URL}/admins/${adminId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch admin');
    }

    const result = await response.json();
    return result.data;
};

export const createAdmin = async (token: string, adminData: CreateAdminRequest): Promise<CreateAdminResponse> => {
    const response = await fetch(`${API_BASE_URL}/admins`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create admin');
    }

    return response.json();
};

export const updateAdmin = async (token: string, adminId: string, adminData: UpdateAdminRequest): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/admins/${adminId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update admin');
    }
};

export const deleteAdmin = async (token: string, adminId: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/admins/${adminId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete admin');
    }
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

// Add this interface to your existing types
export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

// Add this function to your existing API functions
export const changeAdminPassword = async (
    token: string, 
    adminId: string, 
    passwordData: ChangePasswordRequest
): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/admins/${adminId}/change-password`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to change password');
    }
};