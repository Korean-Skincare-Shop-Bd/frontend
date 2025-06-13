import { AdminProvider } from '@/contexts/AdminContext';
import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { OrdersManager } from '@/components/admin/OrdersManager';

export default function AdminOrdersPage() {
  return (
    <AdminProvider>
      <ProtectedAdminRoute>
        <AdminLayout>
          <OrdersManager />
        </AdminLayout>
      </ProtectedAdminRoute>
    </AdminProvider>
  );
}