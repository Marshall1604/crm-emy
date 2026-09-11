export type AiProvider = 'kira' | 'dual';

export interface AiModelOption {
  id: string;
  name: string;
  provider: 'kira';
  description: string;
  badge?: string;
  isFree?: boolean;
}

export const AVAILABLE_MODELS: AiModelOption[] = [
  {
    id: 'kira-3.5-pro',
    name: 'Emly Tax',
    provider: 'kira',
    description: 'Mô hình Flagship thông minh, suy luận logic cao cho tính toán thuế IRS & báo cáo',
    badge: 'Chuyên Sâu',
    isFree: false,
  },
  {
    id: 'kira-mini-1.0',
    name: 'Emly Tax Fast',
    provider: 'kira',
    description: 'Mô hình phản hồi siêu tốc, đàm thoại và soạn thảo văn bản nhanh chóng',
    badge: 'Siêu Tốc (Free)',
    isFree: true,
  },
  {
    id: 'qwen3.8-flash-free',
    name: 'Emly Tax Standard',
    provider: 'kira',
    description: 'Hỗ trợ đa ngôn ngữ, xử lý câu hỏi thuế IRS và soạn thảo email khách hàng mượt mà',
    badge: 'Miễn Phí',
    isFree: true,
  },
  {
    id: 'deepseek-v4-pro',
    name: 'Emly Tax Pro',
    provider: 'kira',
    description: 'Khả năng phân tích chuyên sâu cho các bài toán khấu trừ và hồ sơ thuế phức tạp',
    badge: 'Chuyên Sâu',
    isFree: false,
  },
];

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  provider?: string;
  model?: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
  selectedModel: string;
}

export interface TaxPromptTemplate {
  id: string;
  titleVi: string;
  titleEn: string;
  category: 'irs_code' | 'client_email' | 'form_guidance' | 'deductions';
  promptVi: string;
  promptEn: string;
  icon: string;
}

export const SAMPLE_TAX_PROMPTS: TaxPromptTemplate[] = [
  {
    id: 'p-1',
    titleVi: 'Khấu trừ Section 179 & Bonus Depreciation',
    titleEn: 'Section 179 & Bonus Depreciation Rule',
    category: 'deductions',
    icon: '💼',
    promptVi: 'Hãy tóm tắt quy định mới nhất về khấu trừ tài sản theo Section 179 và tỷ lệ Bonus Depreciation cho năm tính thuế 2025/2026. Cho ví dụ cụ thể đối với doanh nghiệp mua xe tải phục vụ kinh doanh.',
    promptEn: 'Please explain Section 179 deduction limits and current Bonus Depreciation percentages for Tax Year 2025/2026, with a practical vehicle purchase example for a business.',
  },
  {
    id: 'p-2',
    titleVi: 'Mẫu Email nhắc nộp chứng từ W-2 & 1099',
    titleEn: 'Draft Client W-2 / 1099 Request Email',
    category: 'client_email',
    icon: '✉️',
    promptVi: 'Soạn giúp tôi một bức email lịch sự, ngắn gọn và chuyên nghiệp gửi cho khách hàng khai thuế cá nhân, nhắc họ chuẩn bị và gửi gấp Form W-2, 1099-NEC, 1098 tiền lãi ngân hàng trước hạn chót.',
    promptEn: 'Draft a polite, concise, and professional client reminder email requesting W-2, 1099-NEC, and 1098 Mortgage statements before the upcoming tax deadline.',
  },
  {
    id: 'p-3',
    titleVi: 'Phân biệt W-2 vs 1099 (Independent Contractor)',
    titleEn: 'W-2 vs 1099 Independent Contractor Test',
    category: 'irs_code',
    icon: '⚖️',
    promptVi: 'Hướng dẫn các tiêu chuẩn 3 yếu tố của IRS (Behavioral, Financial, Relationship) để xác định người lao động là nhân viên W-2 hay nhà thầu phụ 1099-NEC nhằm tránh bị kiểm toán.',
    promptEn: 'Explain the 3-part IRS common law rules (Behavioral, Financial, Relationship) to determine if a worker is a W-2 employee or 1099-NEC independent contractor.',
  },
  {
    id: 'p-4',
    titleVi: 'Giải thích Form 1040 Schedule C & Lãi Lỗ',
    titleEn: 'Form 1040 Schedule C Profit/Loss Guide',
    category: 'form_guidance',
    icon: '📊',
    promptVi: 'Giải thích cách điền các khoản chi phí hợp lệ trên Form 1040 Schedule C cho chủ tiệm Nails / Tiệm cắt tóc / Thợ độc lập (Home office, Supplies, Mileage, Utilities).',
    promptEn: 'Explain how to report deductible business expenses on Form 1040 Schedule C for self-employed individuals (Home Office, Supplies, Standard Mileage, Utilities).',
  },
  {
    id: 'p-5',
    titleVi: 'Hạn chót thuế IRS & Mẫu gia hạn Form 4868 / 7004',
    titleEn: 'IRS Filing Deadlines & Extension Rules',
    category: 'irs_code',
    icon: '📅',
    promptVi: 'Tóm tắt các mốc hạn chót nộp thuế cho cá nhân (Form 1040), công ty S-Corp (Form 1120-S), Hợp danh (Form 1065) và quy định nộp đơn xin gia hạn Form 4868 và Form 7004.',
    promptEn: 'Summarize key tax filing deadlines for Individual (1040), S-Corp (1120-S), Partnership (1065) and extension rules under Form 4868 & Form 7004.',
  },
];
