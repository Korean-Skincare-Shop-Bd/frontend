import { AdminProvider } from '@/contexts/AdminContext';
import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import EditProduct from '@/components/admin/EditProduct';

export const dynamic = 'force-dynamic'; // ⚠️ Critical fix

export default function AdminEditProductPage() {
  return (
    <AdminProvider>
      <ProtectedAdminRoute>
        <AdminLayout>
          <EditProduct />
        </AdminLayout>
      </ProtectedAdminRoute>
    </AdminProvider>
  );
}