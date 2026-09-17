"use client";

import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminLogin, adminLogout, AdminLoginRequest, getCurrentAdmin } from "@/lib/api/admin";
import { clearLegacyAdminStorage } from "@/lib/api/adminFetch";

type Admin = { id: string; email: string; username: string };

interface AdminContextType {
  isAuthenticated: boolean;
  adminData: Admin | null;
  login: (credentials: AdminLoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);
const adminQueryKey = ["admin", "current"] as const;

export function AdminProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!mounted) return;
    clearLegacyAdminStorage();
    const handleUnauthorized = () => queryClient.setQueryData(adminQueryKey, null);
    window.addEventListener("admin:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("admin:unauthorized", handleUnauthorized);
  }, [mounted, queryClient]);

  const adminQuery = useQuery({
    queryKey: adminQueryKey,
    queryFn: async (): Promise<Admin | null> => {
      try {
        const admin = await getCurrentAdmin();
        return { id: admin.id, email: admin.email, username: admin.username };
      } catch {
        return null;
      }
    },
    enabled: mounted,
    staleTime: Infinity,
  });

  const loginMutation = useMutation({
    mutationFn: adminLogin,
    onSuccess: (admin) => {
      queryClient.setQueryData(adminQueryKey, admin);
      clearLegacyAdminStorage();
    },
  });

  const login = async (credentials: AdminLoginRequest) => {
    await loginMutation.mutateAsync(credentials);
  };
  const logout = async () => {
    await adminLogout().catch(() => undefined);
    queryClient.setQueryData(adminQueryKey, null);
    clearLegacyAdminStorage();
  };

  return (
    <AdminContext.Provider value={{
      isAuthenticated: Boolean(adminQuery.data),
      adminData: adminQuery.data ?? null,
      login,
      logout,
      loading: !mounted || adminQuery.isLoading,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used within an AdminProvider");
  return context;
}
