import { AdminProvider } from '@/contexts/AdminContext';
import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ProductsManager } from '@/components/admin/ProductManager';

export default function AdminProductsPage() {
  return (
    <AdminProvider>
      <ProtectedAdminRoute>
        <AdminLayout>
          <ProductsManager />
        </AdminLayout>
      </ProtectedAdminRoute>
    </AdminProvider>
  );
}