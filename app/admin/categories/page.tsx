import { AdminProvider } from '@/contexts/AdminContext';
import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { CategoriesManager } from '@/components/admin/CategoryManager';

export default function AdminCategoriesPage() {
  return (
    <AdminProvider>
      <ProtectedAdminRoute>
        <AdminLayout>
          <CategoriesManager />
        </AdminLayout>
      </ProtectedAdminRoute>
    </AdminProvider>
  );
}