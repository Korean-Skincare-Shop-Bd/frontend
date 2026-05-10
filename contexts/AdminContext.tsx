"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  adminLogin,
  adminLogout,
  AdminLoginRequest,
  getCurrentAdmin,
} from "@/lib/api/admin";
import { clearLegacyAdminStorage } from "@/lib/api/adminFetch";

interface AdminContextType {
  isAuthenticated: boolean;
  adminData: any;
  login: (credentials: AdminLoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminData, setAdminData] = useState<{
    id: string;
    email: string;
    username: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    let active = true;

    clearLegacyAdminStorage();

    getCurrentAdmin()
      .then((admin) => {
        if (!active) return;
        setAdminData({
          id: admin.id,
          email: admin.email,
          username: admin.username,
        });
        setIsAuthenticated(true);
      })
      .catch(() => {
        if (!active) return;
        setAdminData(null);
        setIsAuthenticated(false);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    const handleUnauthorized = () => {
      setAdminData(null);
      setIsAuthenticated(false);
    };

    window.addEventListener("admin:unauthorized", handleUnauthorized);

    return () => {
      active = false;
      window.removeEventListener("admin:unauthorized", handleUnauthorized);
    };
  }, [mounted]);

  const login = async (credentials: AdminLoginRequest) => {
    try {
      const response = await adminLogin(credentials);

      if (response) {
        const { id, email, username } = response;

        setAdminData({
          id,
          email,
          username,
        });
        setIsAuthenticated(true);
        clearLegacyAdminStorage();
      }
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    await adminLogout().catch(() => undefined);
    setAdminData(null);
    setIsAuthenticated(false);
    clearLegacyAdminStorage();
  };

  return (
    <AdminContext.Provider
      value={{
        isAuthenticated,
        adminData,
        login,
        logout,
        loading,
      }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
