import { AdminProvider } from '@/contexts/AdminContext';
import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { BrandsManager } from '@/components/admin/BrandManager';

export default function AdminBrandsPage() {
  return (
    <AdminProvider>
      <ProtectedAdminRoute>
        <AdminLayout>
          <BrandsManager />
        </AdminLayout>
      </ProtectedAdminRoute>
    </AdminProvider>
  );
}