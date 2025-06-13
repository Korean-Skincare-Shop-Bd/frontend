import { AdminProvider } from '@/contexts/AdminContext';
import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { BannersManager } from '@/components/admin/BannersManager';

export default function AdminBannersPage() {
  return (
    <AdminProvider>
      <ProtectedAdminRoute>
        <AdminLayout>
          <BannersManager />
        </AdminLayout>
      </ProtectedAdminRoute>
    </AdminProvider>
  );
}