import { AdminProvider } from '@/contexts/AdminContext';
import { ProtectedAdminRoute } from '@/components/admin/ProtectedAdminRoute';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ReviewDetailsView } from '@/components/admin/ReviewDetailsView';

interface ReviewDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminReviewDetailPage({ params }: ReviewDetailPageProps) {
  const resolvedParams = await params;
  
  return (
    <AdminProvider>
      <ProtectedAdminRoute>
        <AdminLayout>
          <ReviewDetailsView reviewId={resolvedParams.id} />
        </AdminLayout>
      </ProtectedAdminRoute>
    </AdminProvider>
  );
}
