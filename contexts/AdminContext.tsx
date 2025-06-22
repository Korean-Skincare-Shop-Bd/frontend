"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { adminLogin, AdminLoginRequest } from '@/lib/api/admin';

interface AdminContextType {
  isAuthenticated: boolean;
  adminData: any;
  token: string | null;
  login: (credentials: AdminLoginRequest) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// 7 days in milliseconds
const TOKEN_EXPIRATION_DAYS = 7;
const TOKEN_EXPIRATION_MS = TOKEN_EXPIRATION_DAYS * 24 * 60 * 60 * 1000;

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminData, setAdminData] = useState<{ id: string; email: string; username: string } | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    const savedAdminData = localStorage.getItem('admin_data');
    const savedTimestamp = localStorage.getItem('admin_token_timestamp');
    
    if (savedToken && savedAdminData && savedTimestamp) {
      const timestamp = parseInt(savedTimestamp, 10);
      const currentTime = new Date().getTime();
      
      // Check if token is expired
      if (currentTime - timestamp < TOKEN_EXPIRATION_MS) {
        setToken(savedToken);
        setAdminData(JSON.parse(savedAdminData));
        setIsAuthenticated(true);
      } else {
        // Token expired, clear storage
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_data');
        localStorage.removeItem('admin_token_timestamp');
      }
    }
    
    setLoading(false);
  }, []);

  const login = async (credentials: AdminLoginRequest) => {
    try {
      const response = await adminLogin(credentials);
      console.log('Login response:', response);
      
      if (response) {
        const { token: authToken, id, email, username } = response;
        console.log('Login successful:', response);

        setToken(authToken);
        setAdminData({
          id,
          email,
          username,
        });
        setIsAuthenticated(true);
        
        const currentTime = new Date().getTime();
        
        localStorage.setItem('admin_token', authToken);
        localStorage.setItem('admin_data', JSON.stringify({ id, email, username }));
        localStorage.setItem('admin_token_timestamp', currentTime.toString());
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setAdminData(null);
    setIsAuthenticated(false);
    
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_data');
    localStorage.removeItem('admin_token_timestamp');
  };

  return (
    <AdminContext.Provider value={{
      isAuthenticated,
      adminData,
      token,
      login,
      logout,
      loading
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}