import { AdminProvider } from '@/contexts/AdminContext';
import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminProvider>
      <ProtectedAdminRoute>
        <AdminLayout>
          {children}
        </AdminLayout>
      </ProtectedAdminRoute>
    </AdminProvider>
  );
}
