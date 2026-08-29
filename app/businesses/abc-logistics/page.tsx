import type { Metadata } from 'next';
import { BusinessDetail } from '@/features/businesses/business-detail';

export const metadata: Metadata = {
  title: 'ABC Logistics LLC — CRM EMY',
  description: 'Business client record for ABC Logistics LLC.',
};

export default function BusinessClientPage(){return <BusinessDetail/>}
