import { AdminProvider } from '@/contexts/AdminContext';
import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ReviewDetailsView } from '@/components/admin/ReviewDetailsView';

interface ReviewDetailPageProps {
  params: {
    id: string;
  };
}

export default function AdminReviewDetailPage({ params }: ReviewDetailPageProps) {
  return (
    <AdminProvider>
      <ProtectedAdminRoute>
        <AdminLayout>
          <ReviewDetailsView reviewId={params.id} />
        </AdminLayout>
      </ProtectedAdminRoute>
    </AdminProvider>
  );
}
