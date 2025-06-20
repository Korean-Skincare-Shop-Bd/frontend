import { AdminProvider } from '@/contexts/AdminContext';
import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ManualOrderForm } from '@/components/admin/ManuualOrder';

export default function AdminOrdersPage() {
  return (
    <AdminProvider>
      <ProtectedAdminRoute>
        <AdminLayout>
          <ManualOrderForm/>
        </AdminLayout>
      </ProtectedAdminRoute>
    </AdminProvider>
  );
}