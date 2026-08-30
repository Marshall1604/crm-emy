import { Metadata } from 'next';
import { HomeLanding } from '@/features/home/home-landing';

export const metadata: Metadata = {
  title: 'EMLY CUSTOMER LIST — Phần Mềm Quản Lý Khách Hàng Văn Phòng Thuế Tại Mỹ | Tax Practice CRM',
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
    'EMLY CUSTOMER LIST',
  ],
  authors: [{ name: 'EMLY CUSTOMER LIST Team' }],
  creator: 'EMLY CUSTOMER LIST',
  publisher: 'EMLY CUSTOMER LIST',
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
    siteName: 'EMLY CUSTOMER LIST',
    title: 'EMLY CUSTOMER LIST — Giải Pháp CRM Quản Lý Thuế Hàng Đầu Cho Văn Phòng Kế Toán & Khai Thuế Mỹ',
    description:
      'Nền tảng CRM toàn diện: Quản lý khách hàng cá nhân & doanh nghiệp, quy trình IRS Pipeline, quản lý phí & hóa đơn, email marketing tự động. Đăng ký dùng thử 7 ngày miễn phí ngay!',
    images: [
      {
        url: 'https://app.crmemy.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'EMLY CUSTOMER LIST - Tax Practice Management CRM',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EMLY CUSTOMER LIST — Tax Practice Management CRM',
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
      name: 'EMLY CUSTOMER LIST',
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
          price: '19',
          priceCurrency: 'USD',
          description: 'Month-to-month tax CRM subscription',
        },
        {
          '@type': 'Offer',
          name: 'Annual Enterprise',
          price: '199',
          priceCurrency: 'USD',
          description: 'Annual tax CRM subscription saving $29/year',
        },
        {
          '@type': 'Offer',
          name: 'Lifetime License',
          price: '390',
          priceCurrency: 'USD',
          description: 'One-time payment lifetime permanent access',
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
      name: 'EMLY CUSTOMER LIST',
      url: 'https://app.crmemy.com/home',
      logo: 'https://app.crmemy.com/logo.png',
      sameAs: [],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Gói dùng thử 7 ngày có bị giới hạn tính năng nào không?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Hoàn toàn không. Bạn được trải nghiệm 100% tất cả tính năng cao cấp nhất: Quản lý khách hàng cá nhân & công ty không giới hạn, quy trình Pipeline, gửi email marketing và quản lý phân quyền nhân sự.',
          },
        },
        {
          '@type': 'Question',
          name: 'Gói Lifetime License $390 có phải trả thêm chi phí nào sau này không?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Không. Bạn chỉ thanh toán $390 một lần duy nhất để sở hữu bản quyền vĩnh viễn trọn đời, được miễn phí toàn bộ các tính năng mới và bản cập nhật trong tương lai.',
          },
        },
        {
          '@type': 'Question',
          name: 'Dữ liệu thông tin khách hàng và số SSN của tôi có được bảo mật không?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'EMLY CUSTOMER LIST được xây dựng trên nền tảng Supabase với cơ chế Row-Level Security (RLS) cấp ngân hàng. Mọi số SSN và thông tin nhạy cảm đều được mã hóa và phân quyền nghiêm ngặt.',
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
