import { Metadata } from 'next';
import { HomeLanding } from '@/features/home/home-landing';

export const metadata: Metadata = {
  title: 'CRM EMLY — Phần Mềm Quản Lý Khách Hàng Văn Phòng Thuế Tại Mỹ | Tax Practice CRM',
  description:
    'Phần mềm CRM chuyên biệt cho văn phòng khai thuế tại Hoa Kỳ: Quản lý người nộp thuế cá nhân Form 1040, công ty 1120/1065, theo dõi tiến độ nộp hồ sơ IRS, quản lý biểu phí & công nợ, gửi email marketing hàng loạt. Dùng thử 7 ngày miễn phí!',
  keywords: [
    'CRM thuế',
    'phần mềm quản lý văn phòng thuế',
    'tax practice management software',
    'tax office CRM',
    'quản lý khách hàng khai thuế Form 1040',
    'Form 1120-S',
    'Form 1065',
    'IRS tax workflow pipeline',
    'marketing mail văn phòng thuế',
    'CRM EMLY',
  ],
  authors: [{ name: 'CRM EMLY Team' }],
  creator: 'CRM EMLY',
  publisher: 'CRM EMLY',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    alternateLocale: 'en_US',
    url: 'https://businesssolutions.agency',
    siteName: 'CRM EMLY',
    title: 'CRM EMLY — Giải Pháp CRM Quản Lý Thuế Hàng Đầu Cho Văn Phòng Kế Toán & Khai Thuế Mỹ',
    description:
      'Nền tảng CRM toàn diện: Quản lý khách hàng cá nhân & doanh nghiệp, quy trình IRS Pipeline, quản lý phí & hóa đơn, email marketing tự động. Đăng ký dùng thử 7 ngày miễn phí ngay!',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'SoftwareApplication',
      name: 'CRM EMLY',
      operatingSystem: 'Web Browser, Cloud SaaS',
      applicationCategory: 'BusinessApplication, FinancialApplication, CRM',
      offers: [
        {
          '@type': 'Offer',
          name: 'Free Starter',
          price: '0',
          priceCurrency: 'USD',
        },
        {
          '@type': 'Offer',
          name: 'Pro Monthly',
          price: '14',
          priceCurrency: 'USD',
        },
        {
          '@type': 'Offer',
          name: 'Pro Annual',
          price: '142',
          priceCurrency: 'USD',
        },
        {
          '@type': 'Offer',
          name: 'Lifetime License',
          price: '0',
          priceCurrency: 'USD',
        },
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '520',
      },
    },
  ],
};

export default function RootPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeLanding />
    </>
  );
}
