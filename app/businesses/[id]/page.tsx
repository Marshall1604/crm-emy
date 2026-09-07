import { BusinessDetail } from '@/features/businesses/business-detail';

export default async function BusinessDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BusinessDetail id={id} />;
}
