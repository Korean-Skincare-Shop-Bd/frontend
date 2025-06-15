import { AdminProvider } from '@/contexts/AdminContext';
import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import ProductDetails from '@/components/admin/ProductDetails';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export default function AdminProductDetailsPage() {
  return (
    <AdminProvider>
      <ProtectedAdminRoute>
        <AdminLayout>
          <ProductDetails />
        </AdminLayout>
      </ProtectedAdminRoute>
    </AdminProvider>
  );
}