import { Metadata } from 'next';
import { HomeLanding } from '@/features/home/home-landing';

export const metadata: Metadata = {
  title: 'CRM EMLY — Phần Mềm Quản Lý Khách Hàng Văn Phòng Thuế Tại Mỹ | Tax Practice CRM',
  description:
    'Phần mềm CRM chuyên biệt cho văn phòng khai thuế tại Hoa Kỳ: Quản lý người nộp thuế cá nhân Form 1040, công ty 1120/1065, theo dõi tiến độ nộp hồ sơ IRS, quản lý biểu phí & công nợ, gửi email marketing hàng loạt. Đăng ký sử dụng miễn phí ngay!',
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
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    alternateLocale: 'en_US',
    url: 'https://app.crmemy.com/home',
    siteName: 'CRM EMLY',
    title: 'CRM EMLY — Giải Pháp CRM Quản Lý Thuế Hàng Đầu Cho Văn Phòng Kế Toán & Khai Thuế Mỹ',
    description:
      'Nền tảng CRM toàn diện: Quản lý khách hàng cá nhân & doanh nghiệp, quy trình IRS Pipeline, quản lý phí & hóa đơn, email marketing tự động. Đăng ký sử dụng miễn phí ngay!',
    images: [
      {
        url: 'https://app.crmemy.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'CRM EMLY - Tax Practice Management CRM',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CRM EMLY — Tax Practice Management CRM',
    description:
      'Chuyên biệt cho văn phòng khai thuế tại Mỹ. Quản lý khách hàng, quy trình IRS, hóa đơn và email tự động.',
    images: ['https://app.crmemy.com/og-image.png'],
  },
  alternates: {
    canonical: 'https://app.crmemy.com/home',
  },
};

// JSON-LD Structured Data Schema for Google SEO Rich Snippets
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
          name: '7-Day Free Trial',
          price: '0',
          priceCurrency: 'USD',
          description: 'Full feature 7-day trial for tax offices',
        },
        {
          '@type': 'Offer',
          name: 'Monthly Pro',
          price: '14',
          priceCurrency: 'USD',
          description: 'Month-to-month tax CRM subscription',
        },
        {
          '@type': 'Offer',
          name: 'Annual Enterprise',
          price: '142',
          priceCurrency: 'USD',
          description: 'Annual tax CRM subscription saving 20%/year',
        },
        {
          '@type': 'Offer',
          name: 'Lifetime License',
          price: '0',
          priceCurrency: 'USD',
          description: 'Lifetime permanent access, contact via WhatsApp',
        },
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '520',
      },
      description:
        'Cloud CRM and practice management software designed for US tax preparers, CPAs, and Enrolled Agents managing Individual Form 1040 and Business Form 1120/1065 clients.',
    },
    {
      '@type': 'Organization',
      name: 'CRM EMLY',
      url: 'https://app.crmemy.com/home',
      logo: 'https://app.crmemy.com/logo.png',
      sameAs: [],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Bản Miễn Phí có bị giới hạn thời gian sử dụng không?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Hoàn toàn không. Bạn có thể sử dụng bản Miễn Phí vĩnh viễn trọn đời mà không bị tính bất kỳ chi phí nào.',
          },
        },
        {
          '@type': 'Question',
          name: 'Làm thế nào để đăng ký Gói Bản Quyền Vĩnh Viễn (Lifetime License)?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Quý khách vui lòng liên hệ trực tiếp qua WhatsApp (+84931233639) để nhận báo giá ưu đãi độc quyền và kích hoạt bản quyền vĩnh viễn trọn đời.',
          },
        },
        {
          '@type': 'Question',
          name: 'Dữ liệu thông tin khách hàng và số SSN của tôi có được bảo mật không?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'CRM EMLY được xây dựng trên nền tảng Supabase với cơ chế Row-Level Security (RLS) cấp ngân hàng. Mọi số SSN và thông tin nhạy cảm đều được mã hóa và phân quyền nghiêm ngặt.',
          },
        },
      ],
    },
  ],
};

export default function HomePage() {
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
