import { ReviewDetailsView } from '@/components/admin/ReviewDetailsView';

interface ReviewDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminReviewDetailPage({ params }: ReviewDetailPageProps) {
  const { id } = await params;
  return <ReviewDetailsView reviewId={id} />;
}
