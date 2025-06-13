import { AdminProvider } from '@/contexts/AdminContext';
import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { CreateProductForm } from '@/components/admin/CreateProductForm';

export default function CreateProductPage() {
  return (
    <AdminProvider>
      <ProtectedAdminRoute>
        <AdminLayout>
          <CreateProductForm />
        </AdminLayout>
      </ProtectedAdminRoute>
    </AdminProvider>
  );
}