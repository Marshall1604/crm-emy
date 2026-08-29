import { TaxReturnDetail } from '@/features/tax-returns/tax-return-detail';

export default async function TaxReturnPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <TaxReturnDetail id={id} />;
}
