import { adminFetch, parseErrorMessage } from "./adminFetch";

// Types
export interface AdminLoginRequest {
    email: string;
    password: string;
}

export interface AdminLoginResponse {
    id: string;
    email: string;
    username: string;
    role?: string;
    isActive?: boolean;
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
    const response = await adminFetch(`/admins/login`, {
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

export const getCurrentAdmin = async (): Promise<AdminLoginResponse> => {
    const response = await adminFetch(`/admins/me`);

    if (!response.ok) {
        throw new Error('Failed to fetch current admin');
    }

    return response.json();
};

export const adminLogout = async (): Promise<void> => {
    await adminFetch(`/admins/logout`, { method: 'POST' });
};

// Admin management functions
export const getAdmins = async (): Promise<Admin[]> => {
    const response = await adminFetch(`/admins`);

    if (!response.ok) {
        throw new Error('Failed to fetch admins');
    }

    const result = await response.json();
    return result.admins;
};

export const getAdminById = async (adminId: string): Promise<Admin> => {
    const response = await adminFetch(`/admins/${adminId}`);

    if (!response.ok) {
        throw new Error('Failed to fetch admin');
    }

    const result = await response.json();
    return result.data;
};

export const createAdmin = async (adminData: CreateAdminRequest): Promise<CreateAdminResponse> => {
    const response = await adminFetch(`/admins`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminData),
    });

    if (!response.ok) {
        throw new Error(await parseErrorMessage(response, 'Failed to create admin'));
    }

    return response.json();
};

export const updateAdmin = async (adminId: string, adminData: UpdateAdminRequest): Promise<void> => {
    const response = await adminFetch(`/admins/${adminId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(adminData),
    });

    if (!response.ok) {
        throw new Error(await parseErrorMessage(response, 'Failed to update admin'));
    }
};

export const deleteAdmin = async (adminId: string): Promise<void> => {
    const response = await adminFetch(`/admins/${adminId}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error(await parseErrorMessage(response, 'Failed to delete admin'));
    }
};

export const getAdminStats = async (): Promise<AdminStats> => {
    const response = await adminFetch(`/admins/statistics/admin-summary`);

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
    adminId: string, 
    passwordData: ChangePasswordRequest
): Promise<void> => {
    const response = await adminFetch(`/admins/${adminId}/change-password`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(passwordData),
    });

    if (!response.ok) {
        throw new Error(await parseErrorMessage(response, 'Failed to change password'));
    }
};
