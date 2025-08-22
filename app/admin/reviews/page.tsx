import { AdminProvider } from '@/contexts/AdminContext';
import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ReviewsManager } from '@/components/admin/ReviewsManager';

export default function AdminReviewsPage() {
  return (
    <AdminProvider>
      <ProtectedAdminRoute>
        <AdminLayout>
          <ReviewsManager />
        </AdminLayout>
      </ProtectedAdminRoute>
    </AdminProvider>
  );
}
