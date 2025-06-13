import { AdminProvider } from '@/contexts/AdminContext';
import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { CustomersManager } from '@/components/admin/CustomersManager';

export default function AdminCustomersPage() {
  return (
    <AdminProvider>
      <ProtectedAdminRoute>
        <AdminLayout>
          <CustomersManager />
        </AdminLayout>
      </ProtectedAdminRoute>
    </AdminProvider>
  );
}