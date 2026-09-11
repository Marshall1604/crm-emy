'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  AlertCircle,
  BarChart3,
  Bookmark,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  CreditCard,
  DollarSign,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FileCheck,
  FileText,
  Globe,
  KeyRound,
  Layers,
  Lock,
  Megaphone,
  MousePointerClick,
  Plus,
  RefreshCw,
  Save,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Tag,
  Trash2,
  TrendingUp,
  User,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/lib/auth/auth-context';
import { useLanguage } from '@/lib/i18n/language-context';

interface ClientAudience {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: 'individual' | 'business';
  businessName?: string;
  returnType: string;
  status: 'Completed' | 'In Review' | 'Missing Docs' | 'Ready to File';
  balance: number;
  assignedStaff: string;
  taxYear: string;
}

const defaultSampleAudience: ClientAudience[] = [
  {
    id: 'c-1',
    name: 'David & Lisa Harrison',
    email: 'david.harrison@gmail.com',
    phone: '(714) 555-0199',
    type: 'individual',
    returnType: '1040 MFJ',
    status: 'Ready to File',
    balance: 650,
    assignedStaff: 'Daniel Lee',
    taxYear: '2025',
  },
  {
    id: 'c-2',
    name: 'Sarah Nguyen',
    email: 'sarah.nguyen@techconsult.io',
    phone: '(408) 555-0142',
    type: 'individual',
    returnType: '1040 Single',
    status: 'In Review',
    balance: 0,
    assignedStaff: 'Sarah Kim',
    taxYear: '2025',
  },
  {
    id: 'c-3',
    name: 'ABC Logistics Inc',
    email: 'contact@abclogistics.com',
    phone: '(415) 555-0182',
    type: 'business',
    businessName: 'ABC Logistics Inc',
    returnType: '1120-S Corporate',
    status: 'Missing Docs',
    balance: 1200,
    assignedStaff: 'Amy Tran',
    taxYear: '2025',
  },
  {
    id: 'c-4',
    name: 'Golden Lotus Nail & Spa LLC',
    email: 'info@goldenlotusspa.com',
    phone: '(714) 555-0163',
    type: 'business',
    businessName: 'Golden Lotus Nail & Spa LLC',
    returnType: '1065 Partnership',
    status: 'In Review',
    balance: 450,
    assignedStaff: 'Amy Tran',
    taxYear: '2025',
  },
  {
    id: 'c-5',
    name: 'Robert & Jennifer Taylor',
    email: 'robert.taylor@outlook.com',
    phone: '(212) 555-0177',
    type: 'individual',
    returnType: '1040 MFJ',
    status: 'Missing Docs',
    balance: 750,
    assignedStaff: 'Daniel Lee',
    taxYear: '2025',
  },
  {
    id: 'c-6',
    name: 'Dr. Kevin Pham MD',
    email: 'dr.kevin.pham@medicalcare.org',
    phone: '(619) 555-0111',
    type: 'business',
    businessName: 'Kevin Pham Medical Corp',
    returnType: '1120 Corporate',
    status: 'Completed',
    balance: 0,
    assignedStaff: 'Sarah Kim',
    taxYear: '2025',
  },
  {
    id: 'c-7',
    name: 'Emily Watson',
    email: 'emily.watson@designstudio.com',
    phone: '(310) 555-0138',
    type: 'individual',
    returnType: '1040 Single',
    status: 'Completed',
    balance: 0,
    assignedStaff: 'Amy Tran',
    taxYear: '2025',
  },
];

interface EmailTemplate {
  id: string;
  titleEn: string;
  titleVi: string;
  badgeEn: string;
  badgeVi: string;
  badgeColor: string;
  defaultSubjectEn: string;
  defaultSubjectVi: string;
  descriptionEn: string;
  descriptionVi: string;
  bodyTemplateEn: string;
  bodyTemplateVi: string;
  // Fallbacks for custom templates
  title?: string;
  badge?: string;
  defaultSubject?: string;
  description?: string;
  bodyTemplate?: string;
}

const prebuiltTemplates: EmailTemplate[] = [
  {
    id: 'tax_season_checklist',
    titleEn: 'Tax Season Document Checklist',
    titleVi: 'Danh Mục Giấy Tờ Mùa Thuế 2026',
    badgeEn: 'Tax Season 2026',
    badgeVi: 'Mùa Thuế 2026',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-200 dark:bg-blue-950/60 dark:text-blue-200 dark:border-blue-800',
    defaultSubjectEn: 'Important: Your {{tax_year}} Tax Preparation Checklist - CRM EMY',
    defaultSubjectVi: 'Quan Trọng: Danh Mục Giấy Tờ Cần Chuẩn Bị Mùa Thuế {{tax_year}} - CRM EMY',
    descriptionEn: 'Remind clients to gather and upload W-2, 1099, Mortgage Interest (1098), and expenses.',
    descriptionVi: 'Nhắc khách hàng chuẩn bị và tải lên W-2, 1099, Lãi vay mua nhà (1098) và chi phí.',
    bodyTemplateEn: `Dear {{client_name}},

Tax season for tax year {{tax_year}} is in full swing! To ensure we prepare your return accurately and maximize all eligible tax deductions and credits, please upload or email us your remaining documents:

• Form W-2 (Wage & Tax Statement)
• Form 1099 (1099-NEC, 1099-MISC, 1099-INT, 1099-DIV)
• Form 1098 (Mortgage Interest Statement & Property Taxes)
• Summary of Business & Healthcare Expenses (Form 1095-A)

Your assigned tax preparer is {{assigned_staff}}. If you have any questions or would like to schedule a review appointment, please reply directly to this email or call our office at (714) 555-0188.

Best regards,
The Tax Team at CRM EMY`,
    bodyTemplateVi: `Kính gửi {{client_name}},

Mùa khai thuế cho năm {{tax_year}} đã bắt đầu! Để đảm bảo hồ sơ thuế của quý khách được chuẩn bị chính xác và tối ưu hóa tối đa các khoản khấu trừ hợp lệ, vui lòng gửi hoặc tải lên các chứng từ còn thiếu:

• Mẫu W-2 (Bảng lương & Thuế thu nhập)
• Mẫu 1099 (1099-NEC, 1099-MISC, 1099-INT, 1099-DIV)
• Mẫu 1098 (Tiền lãi vay mua nhà & Thuế bất động sản)
• Tổng hợp chi phí kinh doanh & Bảo hiểm y tế (Form 1095-A)

Chuyên viên phụ trách hồ sơ của bạn là {{assigned_staff}}. Nếu có bất kỳ thắc mắc nào, vui lòng phản hồi trực tiếp qua email này hoặc liên hệ văn phòng qua số (714) 555-0188.

Trân trọng,
Đội ngũ Khai Thuế | CRM EMY`,
  },
  {
    id: 'balance_due_reminder',
    titleEn: 'Outstanding Invoice & Balance Due',
    titleVi: 'Nhắc Nhở Hóa Đơn & Phí Chưa Thanh Toán',
    badgeEn: 'Billing & Payments',
    badgeVi: 'Phí & Thanh Toán',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-200 dark:bg-rose-950/60 dark:text-rose-200 dark:border-rose-800',
    defaultSubjectEn: 'Invoice Reminder: Outstanding Fee Balance for {{client_name}} (${{balance}})',
    defaultSubjectVi: 'Thông Báo Hóa Đơn: Số Tiền Phí Còn Lại Của {{client_name}} (${{balance}})',
    descriptionEn: 'Polite reminder for clients with pending unpaid preparation balances.',
    descriptionVi: 'Nhắc nhở lịch sự các khách hàng còn nợ phí dịch vụ chuẩn bị hồ sơ thuế.',
    bodyTemplateEn: `Dear {{client_name}},

We hope you are having a wonderful week.

This is a friendly reminder that you have an outstanding fee balance of \${{balance}} for the preparation of your {{tax_year}} tax return ({{return_type}}).

We accept payment via:
• Zelle / QuickPay: billing@crmemy.com
• Bank Wire / ACH Transfer
• Credit / Debit Card (Online Portal)
• Cash / Check at front desk

Once your payment is received, your completed tax return package will be finalized and submitted for IRS e-file immediately.

Thank you for your prompt attention and business!

Warm regards,
Accounting & Billing Department | CRM EMY`,
    bodyTemplateVi: `Kính gửi {{client_name}},

Chúng tôi kính chúc quý khách một tuần làm việc hiệu quả và nhiều thuận lợi.

Đây là thông báo nhắc nhở thân thiện về khoản phí dịch vụ còn lại là \${{balance}} cho việc hoàn tất hồ sơ khai thuế năm {{tax_year}} ({{return_type}}).

Quý khách có thể thanh toán qua các phương thức:
• Zelle / QuickPay: billing@crmemy.com
• Chuyển khoản ngân hàng (Bank Wire / ACH)
• Thẻ tín dụng / Thẻ ghi nợ trực tuyến
• Tiền mặt / Chi phiếu (Check) tại quầy lễ tân

Sau khi nhận được thanh toán, hồ sơ hoàn chỉnh của quý khách sẽ được gửi e-file ngay lập tức lên IRS.

Xin chân thành cảm ơn quý khách!

Trân trọng,
Phòng Kế Toán & Thanh Toán | CRM EMY`,
  },
  {
    id: 'deadline_warning',
    titleEn: 'Upcoming Tax Filing Deadline Alert',
    titleVi: 'Cảnh Báo Hạn Chót Nộp Hồ Sơ Thuế',
    badgeEn: 'Urgent Alert',
    badgeVi: 'Cảnh Báo Khẩn',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-200 dark:bg-amber-950/60 dark:text-amber-200 dark:border-amber-800',
    defaultSubjectEn: 'URGENT: IRS Tax Filing Deadline Approaching for {{client_name}}',
    defaultSubjectVi: 'KHẨN CẤP: Sắp Đến Hạn Chót Nộp Hồ Sơ Thuế IRS Của {{client_name}}',
    descriptionEn: 'Urgent reminder regarding the upcoming IRS tax filing or extension deadline.',
    descriptionVi: 'Nhắc nhở khẩn cấp về hạn chót nộp tờ khai hoặc gia hạn với Sở Thuế IRS.',
    bodyTemplateEn: `Dear {{client_name}},

This is an important reminder that the statutory IRS tax filing deadline for your {{tax_year}} return is fast approaching.

Current Status: {{return_status}}
Assigned Preparer: {{assigned_staff}}

If you still have pending documents or need to request an official 6-month extension (Form 4868 / Form 7004), please contact us immediately so we can avoid any late-filing IRS penalties.

Please reply to this email or reach us at (714) 555-0188 today.

Sincerely,
CRM EMY Tax Compliance Team`,
    bodyTemplateVi: `Kính gửi {{client_name}},

Đây là thông báo quan trọng nhắc nhở rằng hạn chót nộp hồ sơ thuế năm {{tax_year}} theo luật định của IRS đang đến rất gần.

Trạng thái hiện tại: {{return_status}}
Chuyên viên phụ trách: {{assigned_staff}}

Nếu quý khách còn thiếu chứng từ hoặc cần yêu cầu xin gia hạn 6 tháng (Form 4868 / Form 7004), vui lòng liên hệ ngay với chúng tôi để tránh các khoản tiền phạt trễ hạn từ IRS.

Vui lòng phản hồi email này hoặc gọi số (714) 555-0188 hôm nay.

Trân trọng,
Đội Ngũ Tuân Thủ Thuế | CRM EMY`,
  },
  {
    id: 'referral_promo',
    titleEn: 'Client Appreciation & $50 Referral Bonus',
    titleVi: 'Tri Ân Khách Hàng & Thưởng Giới Thiệu $50',
    badgeEn: 'Promotion',
    badgeVi: 'Ưu Đãi / Tri Ân',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-800',
    defaultSubjectEn: 'Thank you for choosing CRM EMY! Enjoy a $50 Referral Reward 🎁',
    defaultSubjectVi: 'Cảm ơn quý khách đã đồng hành cùng CRM EMY! Nhận ngay phần thưởng $50 🎁',
    descriptionEn: 'Reward existing clients for referring family, friends, or fellow business owners.',
    descriptionVi: 'Tặng thưởng cho khách hàng thân thiết khi giới thiệu người thân, bạn bè hoặc đối tác.',
    bodyTemplateEn: `Dear {{client_name}},

We want to thank you for trusting CRM EMY with your {{tax_year}} tax preparation and business advisory services.

As a valued client, you are eligible for our Client Appreciation Program:
👉 Refer a friend, family member, or colleague to file their personal or business taxes with us, and you'll receive a $50 credit towards your next filing, or a $50 gift card!

Simply have them mention your name ({{client_name}}) when they schedule their initial consultation.

Thank you once again for your loyalty and partnership!

Warmest regards,
Amy Tran & The CRM EMY Team`,
    bodyTemplateVi: `Kính gửi {{client_name}},

Chúng tôi xin chân thành cảm ơn quý khách đã tin tưởng lựa chọn CRM EMY cho các dịch vụ khai thuế và tư vấn doanh nghiệp năm {{tax_year}}.

Là khách hàng thân thiết, quý khách đủ điều kiện tham gia Chương Trình Tri Ân:
👉 Giới thiệu bạn bè, người thân hoặc đối tác đến khai thuế cá nhân hoặc doanh nghiệp tại văn phòng chúng tôi, quý khách sẽ nhận ngay $50 khấu trừ cho lần khai thuế tiếp theo hoặc thẻ quà tặng $50!

Chỉ cần người được giới thiệu nhắc tên quý khách ({{client_name}}) khi đặt lịch hẹn.

Một lần nữa, xin cảm ơn sự gắn bó và đồng hành của quý khách!

Thân ái,
Amy Tran & Đội Ngũ CRM EMY`,
  },
];

interface CampaignLog {
  id: string;
  name: string;
  subject: string;
  segment: string;
  recipientCount: number;
  sentDate: string;
  openRate: string;
  clickRate: string;
  status: 'Delivered' | 'In Progress' | 'Scheduled';
}

const mockCampaignLogs: CampaignLog[] = [
  {
    id: 'cmp-01',
    name: '2026 Early Tax Season Kickoff',
    subject: 'Important: Your 2025 Tax Preparation Checklist - CRM EMY',
    segment: 'All Clients (7)',
    recipientCount: 7,
    sentDate: 'Feb 15, 2026 · 09:30 AM',
    openRate: '68.4%',
    clickRate: '28.1%',
    status: 'Delivered',
  },
  {
    id: 'cmp-02',
    name: 'Missing W-2 / 1099 Follow-up',
    subject: 'Action Required: Missing Tax Documents for 2025 Filing',
    segment: 'Missing Docs (2)',
    recipientCount: 2,
    sentDate: 'Feb 22, 2026 · 02:15 PM',
    openRate: '85.0%',
    clickRate: '50.0%',
    status: 'Delivered',
  },
  {
    id: 'cmp-03',
    name: 'Unpaid Fees Reminder - Batch 1',
    subject: 'Invoice Reminder: Outstanding Fee Balance',
    segment: 'Balance Due > $0 (4)',
    recipientCount: 4,
    sentDate: 'Feb 26, 2026 · 11:00 AM',
    openRate: '75.0%',
    clickRate: '42.5%',
    status: 'Delivered',
  },
];

export function MarketingView() {
  const { user } = useAuth();
  const { language } = useLanguage();
  const isVi = language === 'vi';

  const [activeTab, setActiveTab] = useState<'compose' | 'history' | 'integration'>('compose');

  // Load Audience dynamically from user's clients and businesses
  const [audienceList, setAudienceList] = useState<ClientAudience[]>(defaultSampleAudience);

  // Segmentation Filters
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>(() =>
    defaultSampleAudience.map((c) => c.id)
  );

  // Custom Saved Templates State
  const [customTemplates, setCustomTemplates] = useState<EmailTemplate[]>([]);
  const [isSaveTemplateModalOpen, setIsSaveTemplateModalOpen] = useState(false);
  const [newTemplateTitle, setNewTemplateTitle] = useState('');
  const [newTemplateBadge, setNewTemplateBadge] = useState(isVi ? 'Mẫu Cá Nhân' : 'Custom');
  const [newTemplateDesc, setNewTemplateDesc] = useState('');

  // Combined Templates List (Custom templates on top + Prebuilt)
  const allTemplates: EmailTemplate[] = useMemo(() => {
    return [...customTemplates, ...prebuiltTemplates];
  }, [customTemplates]);

  // Template & Composer State
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('tax_season_checklist');
  const [campaignName, setCampaignName] = useState(
    isVi ? 'Chiến Dịch Nhắc Nộp Hồ Sơ Thuế 2026' : '2026 Tax Document Checklist Blast'
  );
  const [emailSubject, setEmailSubject] = useState(
    isVi
      ? 'Quan Trọng: Danh Mục Giấy Tờ Cần Chuẩn Bị Mùa Thuế {{tax_year}} - CRM EMY'
      : 'Important: Your {{tax_year}} Tax Preparation Checklist - CRM EMY'
  );
  const [emailBody, setEmailBody] = useState(
    isVi ? prebuiltTemplates[0].bodyTemplateVi : prebuiltTemplates[0].bodyTemplateEn
  );

  // Campaign History State
  const [campaignHistory, setCampaignHistory] = useState<CampaignLog[]>(mockCampaignLogs);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const clientKey = user?.id ? `crm_emy_clients_${user.id}` : 'crm_emy_clients_list';
        const bizKey = user?.id ? `crm_emy_businesses_${user.id}` : 'crm_emy_businesses_list';
        const savedClientsStr = localStorage.getItem(clientKey);
        const savedBizStr = localStorage.getItem(bizKey);

        const clients = savedClientsStr ? JSON.parse(savedClientsStr) : [];
        const businesses = savedBizStr ? JSON.parse(savedBizStr) : [];

        const combined: ClientAudience[] = [
          ...clients.filter((c: any) => c && c.email).map((c: any) => ({
            id: `c-${c.id}`,
            name: c.name || (isVi ? 'Khách hàng' : 'Client'),
            email: c.email,
            phone: c.phone || '',
            type: 'individual' as const,
            returnType: c.returnType || '1040',
            status: (c.status === 'Missing Information' ? 'Missing Docs' : c.status || 'In Review') as ClientAudience['status'],
            balance: Number(c.balance || 0),
            assignedStaff: c.staff || 'Tax Preparer',
            taxYear: c.year || '2025',
          })),
          ...businesses.filter((b: any) => b && b.email).map((b: any) => ({
            id: `b-${b.id}`,
            name: b.name || (isVi ? 'Doanh nghiệp' : 'Business'),
            businessName: b.name,
            email: b.email,
            phone: b.phone || '',
            type: 'business' as const,
            returnType: b.returnType || '1065',
            status: (b.status === 'Missing Information' ? 'Missing Docs' : b.status || 'In Review') as ClientAudience['status'],
            balance: Number(b.balance || 0),
            assignedStaff: b.preparer || 'Tax Preparer',
            taxYear: b.year || '2025',
          })),
        ];

        if (combined.length > 0) {
          setAudienceList(combined);
          setSelectedClientIds(combined.map((c) => c.id));
        } else if (user) {
          setAudienceList([]);
          setSelectedClientIds([]);
        } else {
          setAudienceList(defaultSampleAudience);
          setSelectedClientIds(defaultSampleAudience.map((c) => c.id));
        }

        const campSaved = localStorage.getItem(`crm_emy_campaigns_${user?.id}`);
        if (campSaved) {
          setCampaignHistory(JSON.parse(campSaved));
        } else if (user) {
          setCampaignHistory([]);
        } else {
          setCampaignHistory(mockCampaignLogs);
        }
      } catch (e) {
        console.error('Error loading audience list:', e);
      }
    }
  }, [user, isVi]);

  // Email Provider & BYOK Configuration State
  const [mailProvider, setMailProvider] = useState<'gmail' | 'resend'>('gmail');
  const [gmailEmail, setGmailEmail] = useState('');
  const [gmailAppPassword, setGmailAppPassword] = useState('');
  const [showGmailPassword, setShowGmailPassword] = useState(false);

  const [apiKey, setApiKey] = useState('');
  const [fromEmail, setFromEmail] = useState('onboarding@resend.dev');
  const [fromName, setFromName] = useState('CRM EMY Tax Practice');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isConfigSaved, setIsConfigSaved] = useState(false);
  const [configSaveMessage, setConfigSaveMessage] = useState('');

  // Load Saved Configuration
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const keyPrefix = user ? `crm_emy_resend_${user.id}` : 'crm_emy_resend_default';
      const savedProvider = (localStorage.getItem(`${keyPrefix}_mail_provider`) ||
        localStorage.getItem('crm_emy_mail_provider') ||
        'gmail') as 'gmail' | 'resend';
      const savedGmailEmail =
        localStorage.getItem(`${keyPrefix}_gmail_email`) ||
        localStorage.getItem('crm_emy_gmail_email') ||
        '';
      const savedGmailPass =
        localStorage.getItem(`${keyPrefix}_gmail_app_password`) ||
        localStorage.getItem('crm_emy_gmail_app_password') ||
        '';
      const savedKey =
        localStorage.getItem(`${keyPrefix}_api_key`) ||
        localStorage.getItem('crm_emy_resend_api_key') ||
        '';
      const savedFromEmail =
        localStorage.getItem(`${keyPrefix}_from_email`) ||
        localStorage.getItem('crm_emy_resend_from_email') ||
        'onboarding@resend.dev';
      const savedFromName =
        localStorage.getItem(`${keyPrefix}_from_name`) ||
        localStorage.getItem('crm_emy_resend_from_name') ||
        'CRM EMY Tax Practice';

      setMailProvider(savedProvider);
      setGmailEmail(savedGmailEmail);
      setGmailAppPassword(savedGmailPass);
      setApiKey(savedKey);
      setFromEmail(savedFromEmail);
      setFromName(savedFromName);
    }
  }, [user]);

  const handleSaveConfig = () => {
    if (typeof window !== 'undefined') {
      const keyPrefix = user ? `crm_emy_resend_${user.id}` : 'crm_emy_resend_default';
      localStorage.setItem(`${keyPrefix}_mail_provider`, mailProvider);
      localStorage.setItem(`${keyPrefix}_gmail_email`, gmailEmail.trim());
      localStorage.setItem(`${keyPrefix}_gmail_app_password`, gmailAppPassword.trim());
      localStorage.setItem(`${keyPrefix}_api_key`, apiKey.trim());
      localStorage.setItem(`${keyPrefix}_from_email`, fromEmail.trim());
      localStorage.setItem(`${keyPrefix}_from_name`, fromName.trim());

      // Global fallbacks
      localStorage.setItem('crm_emy_mail_provider', mailProvider);
      localStorage.setItem('crm_emy_gmail_email', gmailEmail.trim());
      localStorage.setItem('crm_emy_gmail_app_password', gmailAppPassword.trim());
      localStorage.setItem('crm_emy_resend_api_key', apiKey.trim());
      localStorage.setItem('crm_emy_resend_from_email', fromEmail.trim());
      localStorage.setItem('crm_emy_resend_from_name', fromName.trim());

      setIsConfigSaved(true);
      setConfigSaveMessage(
        isVi
          ? mailProvider === 'gmail'
            ? 'Đã lưu cấu hình Gmail thành công! Bạn có thể gửi thử hoặc gửi chiến dịch thật ngay.'
            : 'Đã lưu cấu hình Resend API thành công!'
          : mailProvider === 'gmail'
            ? 'Gmail SMTP settings saved successfully! You can send test or real emails now.'
            : 'Resend API key saved successfully!'
      );
      setTimeout(() => setIsConfigSaved(false), 3500);
    }
  };

  const handleClearConfig = () => {
    if (typeof window !== 'undefined') {
      const keyPrefix = user ? `crm_emy_resend_${user.id}` : 'crm_emy_resend_default';
      localStorage.removeItem(`${keyPrefix}_mail_provider`);
      localStorage.removeItem(`${keyPrefix}_gmail_email`);
      localStorage.removeItem(`${keyPrefix}_gmail_app_password`);
      localStorage.removeItem(`${keyPrefix}_api_key`);
      localStorage.removeItem(`${keyPrefix}_from_email`);
      localStorage.removeItem(`${keyPrefix}_from_name`);
      localStorage.removeItem('crm_emy_mail_provider');
      localStorage.removeItem('crm_emy_gmail_email');
      localStorage.removeItem('crm_emy_gmail_app_password');
      localStorage.removeItem('crm_emy_resend_api_key');
      localStorage.removeItem('crm_emy_resend_from_email');
      localStorage.removeItem('crm_emy_resend_from_name');

      setGmailEmail('');
      setGmailAppPassword('');
      setApiKey('');
      setFromEmail('onboarding@resend.dev');
      setFromName('CRM EMY Tax Practice');
      setIsConfigSaved(true);
      setConfigSaveMessage(isVi ? 'Đã đặt lại cấu hình.' : 'Settings reset.');
      setTimeout(() => setIsConfigSaved(false), 3000);
    }
  };

  // Load Custom Templates from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const key = user ? `crm_emy_custom_templates_${user.id}` : 'crm_emy_custom_templates';
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          setCustomTemplates(JSON.parse(saved));
        } catch {}
      }
    }
  }, [user]);

  // Test Email State
  const [testEmailRecipient, setTestEmailRecipient] = useState('');
  const [testEmailLoading, setTestEmailLoading] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Sending progress modal
  const [isSending, setIsSending] = useState(false);
  const [sendProgress, setSendProgress] = useState(0);
  const [sendSuccessModal, setSendSuccessModal] = useState(false);

  // Filter Audience List based on segment
  const filteredAudience = useMemo(() => {
    return audienceList.filter((c) => {
      const matchesSearch =
        !searchQuery ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (c.businessName && c.businessName.toLowerCase().includes(searchQuery.toLowerCase()));

      let matchesSegment = true;
      if (selectedSegment === 'individual') matchesSegment = c.type === 'individual';
      if (selectedSegment === 'business') matchesSegment = c.type === 'business';
      if (selectedSegment === 'balance_due') matchesSegment = c.balance > 0;
      if (selectedSegment === 'missing_docs') matchesSegment = c.status === 'Missing Docs';
      if (selectedSegment === 'ready_to_file') matchesSegment = c.status === 'Ready to File';
      if (selectedSegment === 'completed') matchesSegment = c.status === 'Completed';

      return matchesSearch && matchesSegment;
    });
  }, [audienceList, selectedSegment, searchQuery]);

  // Update selected IDs when segment changes
  const handleSelectSegment = (segmentKey: string) => {
    setSelectedSegment(segmentKey);
    let matched = audienceList;
    if (segmentKey === 'individual') matched = audienceList.filter((c) => c.type === 'individual');
    if (segmentKey === 'business') matched = audienceList.filter((c) => c.type === 'business');
    if (segmentKey === 'balance_due') matched = audienceList.filter((c) => c.balance > 0);
    if (segmentKey === 'missing_docs') matched = audienceList.filter((c) => c.status === 'Missing Docs');
    if (segmentKey === 'ready_to_file') matched = audienceList.filter((c) => c.status === 'Ready to File');
    if (segmentKey === 'completed') matched = audienceList.filter((c) => c.status === 'Completed');
    setSelectedClientIds(matched.map((c) => c.id));
  };

  const toggleSelectAll = () => {
    if (selectedClientIds.length === filteredAudience.length) {
      setSelectedClientIds([]);
    } else {
      setSelectedClientIds(filteredAudience.map((c) => c.id));
    }
  };

  const toggleClientSelection = (id: string) => {
    setSelectedClientIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Switch Template
  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const tmpl = allTemplates.find((t) => t.id === templateId);
    if (tmpl) {
      const subj = isVi
        ? tmpl.defaultSubjectVi || tmpl.defaultSubject || tmpl.defaultSubjectEn
        : tmpl.defaultSubjectEn || tmpl.defaultSubject || tmpl.defaultSubjectVi;
      const body = isVi
        ? tmpl.bodyTemplateVi || tmpl.bodyTemplate || tmpl.bodyTemplateEn
        : tmpl.bodyTemplateEn || tmpl.bodyTemplate || tmpl.bodyTemplateVi;
      const title = isVi
        ? tmpl.titleVi || tmpl.title || tmpl.titleEn
        : tmpl.titleEn || tmpl.title || tmpl.titleVi;

      setEmailSubject(subj || '');
      setEmailBody(body || '');
      setCampaignName(isVi ? `${title} - Chiến dịch` : `${title} Campaign`);
    }
  };

  // Save current editor content as a new custom template
  const handleSaveNewTemplate = () => {
    if (!newTemplateTitle.trim() || !emailBody.trim()) {
      alert(isVi ? 'Vui lòng nhập tên mẫu và nội dung email.' : 'Please enter template title and email body.');
      return;
    }

    const newTmpl: EmailTemplate = {
      id: `custom_${Date.now()}`,
      titleEn: newTemplateTitle.trim(),
      titleVi: newTemplateTitle.trim(),
      title: newTemplateTitle.trim(),
      badgeEn: newTemplateBadge.trim() || 'Custom',
      badgeVi: newTemplateBadge.trim() || 'Mẫu Lưu',
      badge: newTemplateBadge.trim() || (isVi ? 'Mẫu Lưu' : 'Custom'),
      badgeColor:
        'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-200 dark:border-emerald-800',
      defaultSubjectEn: emailSubject.trim() || `Update from ${fromName}`,
      defaultSubjectVi: emailSubject.trim() || `Thông báo từ ${fromName}`,
      defaultSubject: emailSubject.trim(),
      descriptionEn: newTemplateDesc.trim() || 'Custom saved email template.',
      descriptionVi: newTemplateDesc.trim() || 'Mẫu email do bạn tự soạn và lưu lại.',
      description: newTemplateDesc.trim(),
      bodyTemplateEn: emailBody,
      bodyTemplateVi: emailBody,
      bodyTemplate: emailBody,
    };

    const updated = [newTmpl, ...customTemplates];
    setCustomTemplates(updated);
    if (typeof window !== 'undefined') {
      const key = user ? `crm_emy_custom_templates_${user.id}` : 'crm_emy_custom_templates';
      localStorage.setItem(key, JSON.stringify(updated));
    }

    setSelectedTemplateId(newTmpl.id);
    setIsSaveTemplateModalOpen(false);
    setNewTemplateTitle('');
    setNewTemplateDesc('');
  };

  // Active focused field for inserting tags ('body' | 'subject' | 'campaign')
  const [activeInputField, setActiveInputField] = useState<'campaign' | 'subject' | 'body'>('body');
  const [tagInsertNotice, setTagInsertNotice] = useState<string | null>(null);

  // Dynamic Tags Definitions
  const MERGE_TAGS = useMemo(
    () => [
      {
        tag: '{{client_name}}',
        label: isVi ? 'Tên Khách Hàng' : 'Client Name',
        example: isVi ? 'Nguyễn Văn A' : 'John Doe',
        icon: User,
        color:
          'bg-blue-50 text-blue-900 border-blue-300 hover:bg-blue-100 hover:border-blue-400 dark:bg-blue-950/50 dark:text-blue-200 dark:border-blue-800',
      },
      {
        tag: '{{tax_year}}',
        label: isVi ? 'Năm Thuế' : 'Tax Year',
        example: '2025 / 2026',
        icon: Calendar,
        color:
          'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100 hover:border-amber-400 dark:bg-amber-950/50 dark:text-amber-200 dark:border-amber-800',
      },
      {
        tag: '{{assigned_staff}}',
        label: isVi ? 'Nhân Viên Phụ Trách' : 'Assigned Staff',
        example: 'Daniel Lee / Amy Tran',
        icon: User,
        color:
          'bg-purple-50 text-purple-900 border-purple-300 hover:bg-purple-100 hover:border-purple-400 dark:bg-purple-950/50 dark:text-purple-200 dark:border-purple-800',
      },
      {
        tag: '{{balance}}',
        label: isVi ? 'Số Tiền Nợ Phí' : 'Fee Balance',
        example: '$650.00',
        icon: DollarSign,
        color:
          'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100 hover:border-emerald-400 dark:bg-emerald-950/50 dark:text-emerald-200 dark:border-emerald-800',
      },
      {
        tag: '{{return_type}}',
        label: isVi ? 'Loại Tờ Khai Thuế' : 'Tax Return Type',
        example: 'Form 1040, 1120-S...',
        icon: FileText,
        color:
          'bg-indigo-50 text-indigo-900 border-indigo-300 hover:bg-indigo-100 hover:border-indigo-400 dark:bg-indigo-950/50 dark:text-indigo-200 dark:border-indigo-800',
      },
      {
        tag: '{{return_status}}',
        label: isVi ? 'Trạng Thái Hồ Sơ' : 'Filing Status',
        example: isVi ? 'Thiếu giấy tờ, Chuẩn bị nộp...' : 'Missing Docs, Ready to File...',
        icon: Clock,
        color:
          'bg-rose-50 text-rose-900 border-rose-300 hover:bg-rose-100 hover:border-rose-400 dark:bg-rose-950/50 dark:text-rose-200 dark:border-rose-800',
      },
    ],
    [isVi]
  );

  // Insert Tag Handler
  const handleInsertTag = (tagCode: string, tagLabel: string) => {
    if (activeInputField === 'campaign') {
      setCampaignName((prev) => (prev ? `${prev} ${tagCode}` : tagCode));
      setTagInsertNotice(
        isVi ? `Đã chèn "${tagLabel}" vào Tên Chiến Dịch!` : `Inserted "${tagLabel}" into Campaign Name!`
      );
    } else if (activeInputField === 'subject') {
      setEmailSubject((prev) => (prev ? `${prev} ${tagCode}` : tagCode));
      setTagInsertNotice(
        isVi ? `Đã chèn "${tagLabel}" vào Tiêu Đề Email!` : `Inserted "${tagLabel}" into Subject Line!`
      );
    } else {
      setEmailBody((prev) => (prev ? `${prev} ${tagCode}` : tagCode));
      setTagInsertNotice(
        isVi ? `Đã chèn "${tagLabel}" vào Nội Dung Email!` : `Inserted "${tagLabel}" into Email Body!`
      );
    }

    setTimeout(() => {
      setTagInsertNotice(null);
    }, 2800);
  };

  const handleDeleteCustomTemplate = (e: React.MouseEvent, templateId: string) => {
    e.stopPropagation();
    if (confirm(isVi ? 'Bạn có chắc chắn muốn xóa mẫu email đã lưu này?' : 'Are you sure you want to delete this custom template?')) {
      const updated = customTemplates.filter((t) => t.id !== templateId);
      setCustomTemplates(updated);
      if (typeof window !== 'undefined') {
        const key = user ? `crm_emy_custom_templates_${user.id}` : 'crm_emy_custom_templates';
        localStorage.setItem(key, JSON.stringify(updated));
      }
      if (selectedTemplateId === templateId) {
        setSelectedTemplateId('tax_season_checklist');
      }
    }
  };

  // Preview data rendering (Sample first selected client or fallback)
  const sampleRecipient: ClientAudience = useMemo(() => {
    const found = audienceList.find((c) => selectedClientIds.includes(c.id));
    if (found) return found;
    if (audienceList.length > 0) return audienceList[0];
    return {
      id: 'preview-sample',
      name: isVi ? 'Nguyễn Văn A (Mẫu)' : 'John Doe (Sample)',
      email: 'client@example.com',
      phone: '(714) 555-0199',
      type: 'individual' as const,
      returnType: '1040 MFJ',
      status: 'Ready to File' as const,
      balance: 0,
      assignedStaff: 'Amy Tran',
      taxYear: '2025',
    };
  }, [audienceList, selectedClientIds, isVi]);

  const renderedPreviewBody = useMemo(() => {
    return emailBody
      .replace(/{{client_name}}/g, sampleRecipient.name || (isVi ? 'Quý Khách Hàng' : 'Valued Client'))
      .replace(/{{tax_year}}/g, sampleRecipient.taxYear || '2025')
      .replace(/{{assigned_staff}}/g, sampleRecipient.assignedStaff || (isVi ? 'Chuyên viên thuế' : 'Tax Preparer'))
      .replace(/{{balance}}/g, (sampleRecipient.balance || 0).toLocaleString())
      .replace(/{{return_type}}/g, sampleRecipient.returnType || '1040')
      .replace(/{{return_status}}/g, sampleRecipient.status || (isVi ? 'Đang xử lý' : 'In Review'));
  }, [emailBody, sampleRecipient, isVi]);

  const renderedPreviewSubject = useMemo(() => {
    return emailSubject
      .replace(/{{client_name}}/g, sampleRecipient.name || (isVi ? 'Quý Khách Hàng' : 'Valued Client'))
      .replace(/{{tax_year}}/g, sampleRecipient.taxYear || '2025')
      .replace(/{{balance}}/g, (sampleRecipient.balance || 0).toLocaleString());
  }, [emailSubject, sampleRecipient, isVi]);

  // Test Email Handler
  const handleSendTestEmail = async () => {
    if (!testEmailRecipient) return;
    setTestEmailLoading(true);
    setTestEmailResult(null);

    try {
      const payload: Record<string, unknown> = {
        subject: `[TEST EMAIL] ${renderedPreviewSubject}`,
        bodyText: renderedPreviewBody,
        recipients: [{ email: testEmailRecipient }],
        isTest: true,
        provider: mailProvider,
        fromName: fromName.trim() || undefined,
      };

      if (mailProvider === 'gmail') {
        if (!gmailEmail || !gmailAppPassword) {
          throw new Error(
            isVi
              ? 'Vui lòng nhập Địa chỉ Gmail và Mật khẩu ứng dụng 16 ký tự tại mục Cài Đặt SMTP/Resend trước khi gửi thử!'
              : 'Please enter your Gmail address and 16-character App Password in SMTP Settings before sending a test email!'
          );
        }
        payload.gmailEmail = gmailEmail.trim();
        payload.gmailAppPassword = gmailAppPassword.trim();
      } else {
        if (apiKey && apiKey.trim().length > 5) {
          payload.apiKey = apiKey.trim();
        }
        if (fromEmail) {
          payload.fromEmail = fromEmail.trim();
        }
      }

      const res = await fetch('/api/marketing/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as {
        success?: boolean;
        error?: string;
        message?: string;
        isRealDelivery?: boolean;
        isDemoSimulation?: boolean;
      };

      if (!res.ok) {
        throw new Error(
          data.error || (isVi ? 'Không thể kết nối máy chủ gửi mail.' : 'Failed to connect to email gateway server.')
        );
      }

      setTestEmailResult({
        success: true,
        message: data.message || (isVi ? `Đã gửi email thử nghiệm thành công tới ${testEmailRecipient}!` : `Test email delivered successfully to ${testEmailRecipient}!`),
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : (isVi ? 'Có lỗi xảy ra khi gửi email test' : 'An error occurred while sending test email');
      setTestEmailResult({
        success: false,
        message: msg,
      });
    } finally {
      setTestEmailLoading(false);
    }
  };

  // Send Bulk Email Handler
  const handleSendBulkCampaign = async () => {
    if (selectedClientIds.length === 0) {
      alert(isVi ? 'Vui lòng chọn ít nhất 1 khách hàng để gửi chiến dịch.' : 'Please select at least 1 client to launch campaign.');
      return;
    }

    if (!emailSubject.trim() || !emailBody.trim()) {
      alert(isVi ? 'Vui lòng nhập Tiêu đề và Nội dung email.' : 'Please enter Email Subject and Body.');
      return;
    }

    if (mailProvider === 'gmail' && (!gmailEmail || !gmailAppPassword)) {
      alert(
        isVi
          ? 'Vui lòng nhập Địa chỉ Gmail & Mật khẩu ứng dụng 16 ký tự tại mục Cài Đặt SMTP/Resend trước khi gửi hàng loạt!'
          : 'Please enter your Gmail & 16-character App Password in Settings before bulk sending!'
      );
      setActiveTab('integration');
      return;
    }

    const confirmMsg = isVi
      ? `Bạn có chắc chắn muốn gửi chiến dịch "${campaignName}" tới ${selectedClientIds.length} khách hàng qua ${mailProvider === 'gmail' ? `Gmail (${gmailEmail})` : 'Resend API'}?`
      : `Are you sure you want to dispatch campaign "${campaignName}" to ${selectedClientIds.length} clients via ${mailProvider === 'gmail' ? `Gmail (${gmailEmail})` : 'Resend API'}?`;

    if (!confirm(confirmMsg)) {
      return;
    }

    setIsSending(true);
    setSendProgress(15);

    try {
      const selectedClients = audienceList.filter((c) => selectedClientIds.includes(c.id));

      const recipientsData = selectedClients.map((client) => ({
        email: client.email,
        name: client.name,
        subject: emailSubject
          .replace(/{{client_name}}/g, client.name)
          .replace(/{{tax_year}}/g, client.taxYear || '2025')
          .replace(/{{balance}}/g, (client.balance || 0).toLocaleString()),
        bodyText: emailBody
          .replace(/{{client_name}}/g, client.name)
          .replace(/{{tax_year}}/g, client.taxYear || '2025')
          .replace(/{{assigned_staff}}/g, client.assignedStaff || 'Tax Preparer')
          .replace(/{{balance}}/g, (client.balance || 0).toLocaleString())
          .replace(/{{return_type}}/g, client.returnType || '1040')
          .replace(/{{return_status}}/g, client.status || 'Ready'),
      }));

      setSendProgress(45);

      const payload: Record<string, unknown> = {
        subject: emailSubject,
        bodyText: emailBody,
        recipients: recipientsData,
        isTest: false,
        provider: mailProvider,
        fromName: fromName.trim() || undefined,
      };

      if (mailProvider === 'gmail') {
        payload.gmailEmail = gmailEmail.trim();
        payload.gmailAppPassword = gmailAppPassword.trim();
      } else {
        if (apiKey && apiKey.trim().length > 5) {
          payload.apiKey = apiKey.trim();
        }
        if (fromEmail) {
          payload.fromEmail = fromEmail.trim();
        }
      }

      const res = await fetch('/api/marketing/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as { error?: string; isRealDelivery?: boolean; isDemoSimulation?: boolean };
      if (!res.ok) {
        throw new Error(data.error || (isVi ? 'Lỗi khi gửi email hàng loạt' : 'Error dispatching bulk emails'));
      }

      setSendProgress(100);
      setIsSending(false);
      setSendSuccessModal(true);

      // Add to campaign history
      const newLog: CampaignLog = {
        id: `cmp-0${campaignHistory.length + 1}`,
        name: campaignName,
        subject: emailSubject.replace(/{{tax_year}}/g, '2025'),
        segment: `${selectedSegment.replace('_', ' ').toUpperCase()} (${selectedClientIds.length})`,
        recipientCount: selectedClientIds.length,
        sentDate: isVi ? 'Vừa xong' : 'Just now',
        openRate: '0.0%',
        clickRate: '0.0%',
        status: 'Delivered',
      };
      const updatedHistory = [newLog, ...campaignHistory];
      setCampaignHistory(updatedHistory);
      if (typeof window !== 'undefined' && user) {
        try {
          localStorage.setItem(`crm_emy_campaigns_${user.id}`, JSON.stringify(updatedHistory));
        } catch {}
      }
    } catch (err: unknown) {
      setIsSending(false);
      const msg = err instanceof Error ? err.message : (isVi ? 'Có lỗi xảy ra khi gửi chiến dịch' : 'An error occurred while launching campaign');
      alert(msg);
    }
  };

  return (
    <div className="space-y-6 max-w-[1850px] w-full mx-auto p-4 sm:p-6 md:p-8 pb-12">
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-white/10">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Megaphone className="w-7 h-7 text-[#092c5c] dark:text-blue-400" />
            <span>{isVi ? 'Gửi Mail Marketing & Chiến Dịch Tự Động' : 'Marketing Mail & Bulk Campaigns'}</span>
            <span className="text-xs font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
              Beta
            </span>
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
            {isVi
              ? 'Phân loại tệp khách hàng từ Database, chọn mẫu email thuế và gửi email tự động hàng loạt.'
              : 'Segment client audience from Database, pick tax email templates, and dispatch automated bulk campaigns.'}
          </p>
        </div>

        {/* Tab Navigation Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold">
          <button
            onClick={() => setActiveTab('compose')}
            className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'compose'
                ? 'bg-white dark:bg-[#141923] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            ✉️ {isVi ? 'Soạn & Gửi Hàng Loạt' : 'Compose & Bulk Send'}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-white dark:bg-[#141923] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            📊 {isVi ? 'Lịch Sử & Thống Kê' : 'Campaign Logs & Stats'}
          </button>
          <button
            onClick={() => setActiveTab('integration')}
            className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'integration'
                ? 'bg-white dark:bg-[#141923] text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            ⚙️ {isVi ? 'Cài Đặt SMTP / Resend' : 'SMTP / Resend Settings'}
          </button>
        </div>
      </div>

      {/* 2. KPI SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#141923] p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">
              {isVi ? 'Tệp Khách Hàng Database' : 'Database Audience'}
            </span>
            <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">{audienceList.length}</div>
          <p className="text-xs text-slate-500 mt-1">
            {isVi ? '100% email đã được xác minh' : '100% verified client emails'}
          </p>
        </div>

        <div className="bg-white dark:bg-[#141923] p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">
              {isVi ? 'Email Đã Gửi Tháng Này' : 'Emails Sent This Month'}
            </span>
            <Send className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">
            {campaignHistory.reduce((s, c) => s + c.recipientCount, 0)}
          </div>
          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold mt-1">
            {campaignHistory.length} {isVi ? 'chiến dịch gửi thành công' : 'campaigns delivered'}
          </p>
        </div>

        <div className="bg-white dark:bg-[#141923] p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">
              {isVi ? 'Tỷ Lệ Mở Email (Open Rate)' : 'Avg Open Rate'}
            </span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-black text-purple-950 dark:text-purple-300 mt-2">
            {campaignHistory.length > 0 ? '72.8%' : '0.0%'}
          </div>
          <p className="text-xs text-purple-700 dark:text-purple-400 font-semibold mt-1">
            {campaignHistory.length > 0
              ? isVi ? 'Cao hơn mức chuẩn ngành (22%)' : 'Above industry benchmark (22%)'
              : isVi ? 'Chưa có dữ liệu chiến dịch' : 'No campaign data yet'}
          </p>
        </div>

        <div className="bg-white dark:bg-[#141923] p-5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">
              {isVi ? 'Tỷ Lệ Nhấp (Click Rate)' : 'Avg Click Rate'}
            </span>
            <BarChart3 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">
            {campaignHistory.length > 0 ? '35.4%' : '0.0%'}
          </div>
          <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold mt-1">
            {campaignHistory.length > 0
              ? isVi ? 'Khách mở link nộp giấy tờ' : 'Client engagement recorded'
              : isVi ? 'Chưa có lượt nhấp' : 'No clicks recorded'}
          </p>
        </div>
      </div>

      {/* 3. MAIN TAB: COMPOSE & BULK SEND */}
      {activeTab === 'compose' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: SEGMENTATION & AUDIENCE SELECTION (5 COLS) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Step 1 Card: Audience Segment Filter */}
            <div className="bg-white dark:bg-[#141923] rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#092c5c] text-white flex items-center justify-center text-xs font-black">
                    1
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {isVi ? 'Phân Loại Tệp Khách Hàng' : 'Audience Segmentation'}
                  </h3>
                </div>
                <span className="text-xs font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-900">
                  {selectedClientIds.length} / {filteredAudience.length} {isVi ? 'Đã Chọn' : 'Selected'}
                </span>
              </div>

              {/* Segment Buttons */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  {
                    key: 'all',
                    label: isVi ? 'Tất Cả Khách Hàng' : 'All Clients',
                    count: audienceList.length,
                    icon: Users,
                  },
                  {
                    key: 'individual',
                    label: isVi ? 'Cá Nhân (Form 1040)' : 'Individuals (1040)',
                    count: audienceList.filter((c) => c.type === 'individual').length,
                    icon: FileText,
                  },
                  {
                    key: 'business',
                    label: isVi ? 'Doanh Nghiệp (Corp/LLC)' : 'Businesses (Corp/LLC)',
                    count: audienceList.filter((c) => c.type === 'business').length,
                    icon: Layers,
                  },
                  {
                    key: 'balance_due',
                    label: isVi ? 'Còn Nợ Phí (> $0)' : 'Balance Due (> $0)',
                    count: audienceList.filter((c) => c.balance > 0).length,
                    icon: DollarSign,
                  },
                  {
                    key: 'missing_docs',
                    label: isVi ? 'Thiếu Giấy Tờ' : 'Missing Docs',
                    count: audienceList.filter((c) => c.status === 'Missing Docs').length,
                    icon: AlertCircle,
                  },
                  {
                    key: 'ready_to_file',
                    label: isVi ? 'Chuẩn Bị Nộp (Ready)' : 'Ready to File',
                    count: audienceList.filter((c) => c.status === 'Ready to File').length,
                    icon: FileCheck,
                  },
                ].map((s) => (
                  <button
                    key={s.key}
                    onClick={() => handleSelectSegment(s.key)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      selectedSegment === s.key
                        ? 'border-blue-600 bg-blue-50/70 dark:bg-blue-950/50 ring-1 ring-blue-600 text-blue-950 dark:text-blue-200 font-bold'
                        : 'border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <s.icon className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                      <span className="truncate">{s.label}</span>
                    </div>
                    <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 font-bold shrink-0">
                      {s.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Search within segment */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={isVi ? 'Tìm theo tên khách, email, doanh nghiệp...' : 'Search by client name, email, business...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-8 pl-8 pr-3 rounded-lg border border-slate-300 dark:border-white/10 text-xs focus:outline-none focus:border-blue-500 bg-slate-50 dark:bg-slate-900 dark:text-white"
                />
              </div>

              {/* Audience Checklist */}
              <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 px-2 py-1">
                  <span>
                    {isVi ? `DANH SÁCH NGƯỜI NHẬN (${filteredAudience.length})` : `RECIPIENT LIST (${filteredAudience.length})`}
                  </span>
                  {filteredAudience.length > 0 && (
                    <button
                      onClick={toggleSelectAll}
                      className="text-blue-700 dark:text-blue-400 hover:underline cursor-pointer"
                    >
                      {selectedClientIds.length === filteredAudience.length
                        ? isVi ? 'Bỏ chọn tất cả' : 'Deselect all'
                        : isVi ? 'Chọn tất cả' : 'Select all'}
                    </button>
                  )}
                </div>

                {filteredAudience.length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-white/10 text-center text-slate-400 text-xs">
                    {isVi ? 'Chưa có email khách hàng nào trong danh sách.' : 'No recipient emails found in this list.'}
                  </div>
                ) : (
                  filteredAudience.map((client) => {
                    const isSelected = selectedClientIds.includes(client.id);
                    return (
                      <label
                        key={client.id}
                        onClick={() => toggleClientSelection(client.id)}
                        className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'border-blue-300 dark:border-blue-800 bg-blue-50/40 dark:bg-blue-950/30 text-slate-900 dark:text-white'
                            : 'border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900/40 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            className="rounded text-blue-600 w-4 h-4 cursor-pointer"
                          />
                          <div className="truncate">
                            <b className="font-bold text-slate-900 dark:text-white block truncate text-[12px]">
                              {client.businessName || client.name}
                            </b>
                            <span className="text-[11px] text-slate-500 font-mono truncate block">
                              {client.email}
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0 text-[11px]">
                          <span className="inline-flex px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                            {client.returnType}
                          </span>
                          {client.balance > 0 && (
                            <span className="block text-rose-600 font-bold text-[10px] mt-0.5">
                              {isVi ? 'Nợ:' : 'Due:'} ${client.balance}
                            </span>
                          )}
                        </div>
                      </label>
                    );
                  })
                )}
              </div>
            </div>

            {/* Template Selector Card */}
            <div className="bg-white dark:bg-[#141923] rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs p-5 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#092c5c] text-white flex items-center justify-center text-xs font-black">
                    2
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {isVi ? `Chọn Mẫu Email (${allTemplates.length})` : `Choose Email Template (${allTemplates.length})`}
                  </h3>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setNewTemplateTitle(campaignName || (isVi ? 'Mẫu Email Mới' : 'New Email Template'));
                    setNewTemplateDesc('');
                    setIsSaveTemplateModalOpen(true);
                  }}
                  className="h-8 px-2.5 text-[11px] font-bold text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900 hover:bg-blue-50 dark:hover:bg-blue-950/40 gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Lưu Mẫu Mới' : 'Save As Template'}</span>
                </Button>
              </div>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {allTemplates.map((t) => {
                  const isCustom = t.id.startsWith('custom_');
                  const isSelected = selectedTemplateId === t.id;
                  const title = isVi ? (t.titleVi || t.title || t.titleEn) : (t.titleEn || t.title || t.titleVi);
                  const badge = isVi ? (t.badgeVi || t.badge || t.badgeEn) : (t.badgeEn || t.badge || t.badgeVi);
                  const description = isVi ? (t.descriptionVi || t.description || t.descriptionEn) : (t.descriptionEn || t.description || t.descriptionVi);

                  return (
                    <div
                      key={t.id}
                      onClick={() => handleTemplateChange(t.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer relative group ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/40 ring-1 ring-blue-600'
                          : 'border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-900/50'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {isCustom && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />}
                          <b className="text-xs font-bold text-slate-900 dark:text-white truncate">{title}</b>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${t.badgeColor}`}>
                            {badge}
                          </span>

                          {isCustom && (
                            <button
                              type="button"
                              onClick={(e) => handleDeleteCustomTemplate(e, t.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer"
                              title={isVi ? 'Xóa mẫu này' : 'Delete template'}
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug line-clamp-2">
                        {description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: EMAIL EDITOR & LIVE PREVIEW (7 COLS) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-white dark:bg-[#141923] rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#092c5c] text-white flex items-center justify-center text-xs font-black">
                    3
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {isVi ? 'Soạn Nội Dung & Xem Trước Trực Tiếp' : 'Compose Message & Live Preview'}
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setNewTemplateTitle(campaignName || (isVi ? 'Mẫu Email Mới' : 'New Template'));
                      setNewTemplateDesc('');
                      setIsSaveTemplateModalOpen(true);
                    }}
                    className="h-8 px-3 text-[11px] font-bold bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-800 gap-1.5 cursor-pointer rounded-lg"
                  >
                    <Bookmark className="w-3.5 h-3.5 text-amber-600" />
                    <span>{isVi ? 'Lưu Làm Mẫu Mới' : 'Save as Template'}</span>
                  </Button>
                </div>
              </div>

              {/* Dynamic Tags Helper - Compact & Clean */}
              <div className="p-3 bg-slate-50/90 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-white/10 space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200 text-xs pb-1.5 border-b border-slate-200/60 dark:border-white/5">
                  <MousePointerClick className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span>{isVi ? 'Thẻ Tự Động Điền' : 'Dynamic Auto-Fill Tags'}</span>
                </div>

                {/* Feedback Toast when inserting tag */}
                {tagInsertNotice && (
                  <div className="py-1 px-2.5 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 text-xs font-semibold flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{tagInsertNotice}</span>
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5">
                  {MERGE_TAGS.map((item) => {
                    const IconComp = item.icon;
                    return (
                      <button
                        key={item.tag}
                        type="button"
                        draggable={true}
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', item.tag);
                        }}
                        onClick={() => handleInsertTag(item.tag, item.label)}
                        className={`h-8 px-2.5 rounded-lg border text-xs font-semibold transition-all cursor-grab active:cursor-grabbing hover:shadow-xs hover:scale-[1.02] flex items-center gap-1.5 ${item.color}`}
                        title={isVi ? `Bấm để chèn hoặc Kéo thả vào ô soạn thảo. Điền tự động: ${item.example}` : `Click or Drag to insert. Auto-fills: ${item.example}`}
                      >
                        <IconComp className="w-3.5 h-3.5 shrink-0 opacity-80" />
                        <span>{item.label}</span>
                        <span className="text-[10px] font-normal opacity-60 bg-black/5 dark:bg-white/10 px-1 py-0.2 rounded ml-0.5">
                          +
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Subject & Campaign Name Inputs */}
              <div className="space-y-4 text-xs">
                {/* 1. Campaign Name */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <span>{isVi ? '1. Tên Chiến Dịch (Quản lý nội bộ)' : '1. Campaign Name (Internal Reference)'}</span>
                      {activeInputField === 'campaign' && (
                        <span className="text-[10px] bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-200 font-bold px-1.5 py-0.2 rounded">
                          {isVi ? '✏️ Đang soạn ở đây' : '✏️ Active Editing'}
                        </span>
                      )}
                    </label>
                  </div>
                  <input
                    type="text"
                    value={campaignName}
                    onFocus={() => setActiveInputField('campaign')}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const dropped = e.dataTransfer.getData('text/plain');
                      if (dropped) {
                        setCampaignName((prev) => (prev ? `${prev} ${dropped}` : dropped));
                      }
                    }}
                    onChange={(e) => setCampaignName(e.target.value)}
                    className={`w-full h-10 px-3.5 rounded-xl border font-semibold text-xs sm:text-sm text-slate-900 dark:text-white transition-all ${
                      activeInputField === 'campaign'
                        ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/20 dark:bg-slate-900'
                        : 'border-slate-300 dark:border-white/10 dark:bg-slate-900/60'
                    }`}
                    placeholder={isVi ? 'Ví dụ: Chiến Dịch Nhắc Nộp Hồ Sơ Thuế 2026...' : 'e.g. 2026 Tax Season Document Checklist Blast...'}
                  />
                </div>

                {/* 2. Email Subject Line */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <span>{isVi ? '2. Tiêu Đề Email (Khách hàng sẽ nhìn thấy)' : '2. Email Subject Line (Visible to recipients)'}</span>
                      <span className="text-rose-500">*</span>
                      {activeInputField === 'subject' && (
                        <span className="text-[10px] bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-200 font-bold px-1.5 py-0.2 rounded">
                          {isVi ? '✏️ Đang soạn ở đây' : '✏️ Active Editing'}
                        </span>
                      )}
                    </label>
                  </div>
                  <input
                    type="text"
                    value={emailSubject}
                    onFocus={() => setActiveInputField('subject')}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const dropped = e.dataTransfer.getData('text/plain');
                      if (dropped) {
                        setEmailSubject((prev) => (prev ? `${prev} ${dropped}` : dropped));
                      }
                    }}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className={`w-full h-10 px-3.5 rounded-xl border font-bold text-xs sm:text-sm text-slate-900 dark:text-white font-sans transition-all ${
                      activeInputField === 'subject'
                        ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/20 dark:bg-slate-900'
                        : 'border-slate-300 dark:border-white/10 dark:bg-slate-900/60'
                    }`}
                    placeholder={isVi ? 'Nhập tiêu đề thư...' : 'Enter email subject line...'}
                  />
                </div>

                {/* 3. Email Body */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                      <span>{isVi ? '3. Nội Dung Email (Soạn thảo văn bản)' : '3. Email Body (Rich Text / Plain Text)'}</span>
                      <span className="text-rose-500">*</span>
                      {activeInputField === 'body' && (
                        <span className="text-[10px] bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-200 font-bold px-1.5 py-0.2 rounded">
                          {isVi ? '✏️ Đang soạn ở đây' : '✏️ Active Editing'}
                        </span>
                      )}
                    </label>
                  </div>
                  <textarea
                    rows={9}
                    value={emailBody}
                    onFocus={() => setActiveInputField('body')}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const dropped = e.dataTransfer.getData('text/plain');
                      if (dropped) {
                        setEmailBody((prev) => (prev ? `${prev} ${dropped}` : dropped));
                      }
                    }}
                    onChange={(e) => setEmailBody(e.target.value)}
                    className={`w-full p-4 rounded-xl border font-sans text-xs sm:text-sm text-slate-800 dark:text-slate-100 leading-relaxed transition-all focus:outline-none ${
                      activeInputField === 'body'
                        ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/10 dark:bg-slate-900'
                        : 'border-slate-300 dark:border-white/10 dark:bg-slate-900/60'
                    }`}
                    placeholder={isVi ? 'Nhập nội dung thư của bạn ở đây. Có thể chèn tên, năm thuế, số tiền nợ...' : 'Type your email content here. You can insert merge tags for name, tax year, balance...'}
                  />
                </div>
              </div>

              {/* Visual Live Preview Box */}
              <div className="pt-3 border-t border-slate-200 dark:border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    {isVi
                      ? `Xem Trước Email Thực Tế (Mẫu gửi cho: ${sampleRecipient.name})`
                      : `Live Email Preview (Sample for: ${sampleRecipient.name})`}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">Preview Mode</span>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-[#141923] border border-slate-200 dark:border-white/10 text-xs shadow-inner space-y-3">
                  <div className="pb-3 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 dark:text-white text-sm">{renderedPreviewSubject}</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {isVi ? 'Tới:' : 'To:'} <b>{sampleRecipient.name}</b> &lt;{sampleRecipient.email}&gt;
                      </div>
                    </div>
                    <div className="w-7 h-7 rounded-lg bg-[#092c5c] text-white flex items-center justify-center font-black text-xs">
                      E✓
                    </div>
                  </div>

                  <div className="whitespace-pre-line text-slate-700 dark:text-slate-200 font-sans leading-relaxed text-xs">
                    {renderedPreviewBody}
                  </div>

                  <div className="pt-4 border-t border-slate-200 dark:border-white/10 text-[10px] text-slate-400 text-center">
                    CRM EMY Tax Practice LLC · 12300 Westminster Ave, Garden Grove, CA 92843 · (714) 555-0188
                  </div>
                </div>
              </div>

              {/* Action Buttons: Test Send & Bulk Send */}
              <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="text-xs text-slate-600 dark:text-slate-300">
                  {isVi
                    ? <>Sẵn sàng gửi cho <b className="text-blue-900 dark:text-blue-300 font-bold">{selectedClientIds.length} khách hàng</b> đã chọn.</>
                    : <>Ready to deliver to <b className="text-blue-900 dark:text-blue-300 font-bold">{selectedClientIds.length} selected recipients</b>.</>}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="default"
                    onClick={() => {
                      setTestEmailRecipient(user?.email || '');
                      setActiveTab('integration');
                    }}
                    className="h-11 px-4 text-xs font-bold border-slate-300 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-slate-800 gap-1.5 cursor-pointer rounded-xl"
                  >
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span>{isVi ? 'Gửi Email Thử Nghiệm' : 'Send Test Email'}</span>
                  </Button>

                  <Button
                    size="default"
                    disabled={selectedClientIds.length === 0 || isSending}
                    onClick={handleSendBulkCampaign}
                    className="h-11 px-6 bg-[#092c5c] hover:bg-[#072247] text-white font-bold text-xs rounded-xl shadow-md gap-2 cursor-pointer"
                  >
                    {isSending ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{isVi ? `Đang Gửi Hàng Loạt (${sendProgress}%)...` : `Dispatching (${sendProgress}%)...`}</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>
                          {isVi
                            ? `Gửi Chiến Dịch Cho ${selectedClientIds.length} Khách Hàng 🚀`
                            : `Launch Campaign (${selectedClientIds.length} Emails) 🚀`}
                        </span>
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB: CAMPAIGN HISTORY & ANALYTICS */}
      {activeTab === 'history' && (
        <div className="bg-white dark:bg-[#141923] rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {isVi ? 'Lịch Sử Các Chiến Dịch Email Đã Gửi' : 'Marketing Campaign Logs & Delivery History'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isVi
                  ? 'Theo dõi tỷ lệ mở (Open Rate), tỷ lệ nhấp (Click Rate) và số lượng người nhận.'
                  : 'Track sent bulk email campaigns, recipient counts, open rates, and engagement.'}
              </p>
            </div>

            <Button variant="outline" size="sm" className="text-xs font-semibold gap-1.5 border-slate-300 dark:border-white/10">
              <Download className="w-3.5 h-3.5" />
              {isVi ? 'Xuất Báo Cáo CSV' : 'Export CSV Report'}
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200 dark:border-white/10 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">{isVi ? 'Tên Chiến Dịch & Tiêu Đề' : 'Campaign & Subject'}</th>
                  <th className="py-3.5 px-3">{isVi ? 'Phân Khúc Khách Hàng' : 'Target Audience'}</th>
                  <th className="py-3.5 px-3">{isVi ? 'Số Lượng Nhận' : 'Recipients'}</th>
                  <th className="py-3.5 px-3">{isVi ? 'Thời Gian Gửi' : 'Date Sent'}</th>
                  <th className="py-3.5 px-3">{isVi ? 'Tỷ Lệ Mở' : 'Open Rate'}</th>
                  <th className="py-3.5 px-3">{isVi ? 'Tỷ Lệ Nhấp' : 'Click Rate'}</th>
                  <th className="py-3.5 px-4 text-right">{isVi ? 'Trạng Thái' : 'Status'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-300">
                {campaignHistory.map((camp) => (
                  <tr key={camp.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 dark:text-white text-[13px]">{camp.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5 truncate max-w-md">
                        {camp.subject}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-blue-900 dark:text-blue-300">{camp.segment}</td>
                    <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white">{camp.recipientCount} emails</td>
                    <td className="py-3.5 px-3 text-slate-500 font-mono text-[11px]">{camp.sentDate}</td>
                    <td className="py-3.5 px-3">
                      <span className="inline-flex px-2 py-0.5 rounded-full bg-purple-50 dark:bg-purple-950/50 text-purple-900 dark:text-purple-300 font-bold text-[11px]">
                        {camp.openRate}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="inline-flex px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-900 dark:text-emerald-300 font-bold text-[11px]">
                        {camp.clickRate}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {isVi
                          ? camp.status === 'Delivered' ? 'Đã Gửi' : camp.status === 'In Progress' ? 'Đang Gửi' : 'Đã Lên Lịch'
                          : camp.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. TAB: SMTP & SERVICE INTEGRATION GUIDE */}
      {activeTab === 'integration' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Interactive Configuration & Test Box */}
          <div className="lg:col-span-7 space-y-6">
            {/* Card 1: Provider Selection & Direct Configuration */}
            <div className="bg-white dark:bg-[#141923] rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#092c5c] dark:text-blue-400 flex items-center justify-center border border-blue-200 dark:border-blue-900">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {isVi ? 'Cấu Hình Cổng Gửi Email (BYOK)' : 'Email Gateway Configuration (BYOK)'}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {isVi ? 'Chọn phương thức gửi phù hợp với văn phòng của bạn' : 'Choose the best delivery gateway for your tax office'}
                    </p>
                  </div>
                </div>

                <div>
                  {(mailProvider === 'gmail' && gmailEmail && gmailAppPassword) ||
                  (mailProvider === 'resend' && apiKey && apiKey.trim().length > 5) ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      {isVi ? 'Đã Cấu Hình Sẵn Sàng' : 'Ready & Connected'}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      {isVi ? 'Chưa Cấu Hình' : 'Not Configured'}
                    </span>
                  )}
                </div>
              </div>

              {/* Provider Tabs Switcher */}
              <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setMailProvider('gmail')}
                  className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    mailProvider === 'gmail'
                      ? 'bg-white dark:bg-[#141923] text-blue-900 dark:text-blue-300 shadow-xs border border-slate-200 dark:border-white/10'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>📧 {isVi ? 'Dùng Trực Tiếp Gmail' : 'Gmail SMTP Direct'}</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold">
                    {isVi ? 'Dễ nhất' : 'Easiest'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setMailProvider('resend')}
                  className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                    mailProvider === 'resend'
                      ? 'bg-white dark:bg-[#141923] text-blue-900 dark:text-blue-300 shadow-xs border border-slate-200 dark:border-white/10'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span>⚡ {isVi ? 'Dùng Resend API' : 'Resend API Gateway'}</span>
                  <span className="text-[10px] bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-bold">
                    Domain
                  </span>
                </button>
              </div>

              {/* Feedback Alert if saved */}
              {isConfigSaved && (
                <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">{configSaveMessage}</span>
                </div>
              )}

              {/* FORM OPTION 1: GMAIL SMTP (EASIEST) */}
              {mailProvider === 'gmail' && (
                <div className="space-y-4 text-xs">
                  {/* Gmail Address */}
                  <div>
                    <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                      {isVi ? 'Địa chỉ Gmail của bạn (Sender Gmail)' : 'Sender Gmail Address'} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. yourname@gmail.com"
                      value={gmailEmail}
                      onChange={(e) => setGmailEmail(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-300 dark:border-white/10 dark:bg-slate-900/60 font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      {isVi ? 'Email này sẽ hiển thị là người gửi khi khách hàng nhận được email.' : 'This email will be displayed as the sender when clients receive emails.'}
                    </p>
                  </div>

                  {/* Gmail App Password */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-blue-600" />
                        <span>{isVi ? 'Mật khẩu ứng dụng Google (App Password 16 ký tự)' : '16-Character Google App Password'}</span>
                        <span className="text-rose-500">*</span>
                      </label>
                      <a
                        href="https://myaccount.google.com/apppasswords"
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 text-[11px]"
                      >
                        {isVi ? 'Lấy App Password tại Google' : 'Get Google App Password'} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <div className="relative">
                      <input
                        type={showGmailPassword ? 'text' : 'password'}
                        placeholder={isVi ? '16 ký tự (ví dụ: abcd efgh ijkl mnop)' : '16 letters (e.g. abcd efgh ijkl mnop)'}
                        value={gmailAppPassword}
                        onChange={(e) => setGmailAppPassword(e.target.value)}
                        className="w-full h-10 pl-3.5 pr-20 rounded-xl border border-slate-300 dark:border-white/10 dark:bg-slate-900/60 font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="absolute right-1.5 top-1.5 flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setShowGmailPassword(!showGmailPassword)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                          title={showGmailPassword ? 'Hide password' : 'Show password'}
                        >
                          {showGmailPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      {isVi ? (
                        <>⚠️ <b>Lưu ý:</b> Đây là <i>Mật khẩu ứng dụng (App Password 16 chữ cái)</i> được tạo từ Google, <b>không phải</b> mật khẩu đăng nhập Gmail thông thường.</>
                      ) : (
                        <>⚠️ <b>Note:</b> This is the <i>16-letter App Password</i> generated by Google Account, <b>not</b> your standard personal login password.</>
                      )}
                    </p>
                  </div>

                  {/* Sender Name */}
                  <div>
                    <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                      {isVi ? 'Tên Hiển Thị Người Gửi (From Name)' : 'Sender Display Name (From Name)'}
                    </label>
                    <input
                      type="text"
                      placeholder={isVi ? 'CRM EMY Tax Practice hoặc Tên của bạn' : 'CRM EMY Tax Practice or Your Name'}
                      value={fromName}
                      onChange={(e) => setFromName(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-300 dark:border-white/10 dark:bg-slate-900/60 font-semibold text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleClearConfig}
                      className="h-10 px-3.5 text-xs text-slate-600 dark:text-slate-300 border-slate-300 dark:border-white/10 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/30 gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{isVi ? 'Xóa / Đặt lại' : 'Reset Config'}</span>
                    </Button>

                    <Button
                      type="button"
                      size="default"
                      onClick={handleSaveConfig}
                      className="h-10 px-5 text-xs font-bold bg-[#092c5c] hover:bg-[#072247] text-white rounded-xl shadow-md gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isVi ? 'Lưu Cấu Hình Gmail' : 'Save Gmail Config'}</span>
                    </Button>
                  </div>
                </div>
              )}

              {/* FORM OPTION 2: RESEND API (CUSTOM DOMAIN) */}
              {mailProvider === 'resend' && (
                <div className="space-y-4 text-xs">
                  {/* Resend API Key */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-blue-600" />
                        <span>Resend API Key</span>
                        <span className="text-rose-500">*</span>
                      </label>
                      <a
                        href="https://resend.com/api-keys"
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 text-[11px]"
                      >
                        {isVi ? 'Lấy API Key tại Resend.com' : 'Get API Key at Resend.com'} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>

                    <div className="relative">
                      <input
                        type={showApiKey ? 'text' : 'password'}
                        placeholder="re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        className="w-full h-10 pl-3.5 pr-20 rounded-xl border border-slate-300 dark:border-white/10 dark:bg-slate-900/60 font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="absolute right-1.5 top-1.5 flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                          title={showApiKey ? 'Hide API Key' : 'Show API Key'}
                        >
                          {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Sender Email */}
                  <div>
                    <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                      {isVi ? 'Email Người Gửi (From Email)' : 'Sender Email (From Email)'}
                    </label>
                    <input
                      type="text"
                      placeholder="onboarding@resend.dev or contact@yourtaxfirm.com"
                      value={fromEmail}
                      onChange={(e) => setFromEmail(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-300 dark:border-white/10 dark:bg-slate-900/60 font-mono text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Sender Name */}
                  <div>
                    <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5">
                      {isVi ? 'Tên Hiển Thị Người Gửi (From Name)' : 'Sender Display Name (From Name)'}
                    </label>
                    <input
                      type="text"
                      placeholder="CRM EMY Tax Practice"
                      value={fromName}
                      onChange={(e) => setFromName(e.target.value)}
                      className="w-full h-10 px-3.5 rounded-xl border border-slate-300 dark:border-white/10 dark:bg-slate-900/60 font-semibold text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleClearConfig}
                      className="h-10 px-3.5 text-xs text-slate-600 dark:text-slate-300 border-slate-300 dark:border-white/10 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/30 gap-1.5 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>{isVi ? 'Xóa / Đặt lại' : 'Reset Config'}</span>
                    </Button>

                    <Button
                      type="button"
                      size="default"
                      onClick={handleSaveConfig}
                      className="h-10 px-5 text-xs font-bold bg-[#092c5c] hover:bg-[#072247] text-white rounded-xl shadow-md gap-2 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isVi ? 'Lưu Cấu Hình Resend' : 'Save Resend Config'}</span>
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Card 2: Send Test Email */}
            <div className="bg-white dark:bg-[#141923] rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs p-6 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-white/10">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isVi ? 'Gửi Thử 1 Email Kiểm Tra Kết Nối (Instant Test)' : 'Send 1 Instant Test Email'}
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {isVi
                  ? <>Kiểm tra xem hệ thống gửi qua <b>{mailProvider === 'gmail' ? 'Gmail SMTP' : 'Resend API'}</b> có hoạt động chính xác đến hòm thư người nhận hay không.</>
                  : <>Verify that your delivery gateway via <b>{mailProvider === 'gmail' ? 'Gmail SMTP' : 'Resend API'}</b> properly reaches recipient inboxes.</>}
              </p>

              {testEmailResult && (
                <div
                  className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
                    testEmailResult.success
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-900 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-200'
                      : 'bg-rose-50 border border-rose-200 text-rose-900 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-200'
                  }`}
                >
                  {testEmailResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <span className="font-semibold">{testEmailResult.message}</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <input
                  type="email"
                  placeholder={isVi ? 'Nhập email nhận thử (ví dụ: luuminhnhat.vn@gmail.com, yahoo, outlook...)' : 'Enter test recipient email (e.g. personal@gmail.com, outlook...)'}
                  value={testEmailRecipient}
                  onChange={(e) => setTestEmailRecipient(e.target.value)}
                  className="flex-1 h-10 px-3.5 rounded-xl border border-slate-300 dark:border-white/10 dark:bg-slate-900/60 text-xs font-mono text-slate-900 dark:text-white"
                />

                <Button
                  type="button"
                  disabled={testEmailLoading || !testEmailRecipient}
                  onClick={handleSendTestEmail}
                  className="h-10 px-5 text-xs font-bold bg-purple-700 hover:bg-purple-800 text-white shrink-0 gap-1.5 cursor-pointer rounded-xl shadow-sm"
                >
                  {testEmailLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>{isVi ? 'Đang gửi test...' : 'Sending test...'}</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>{isVi ? 'Gửi Email Test Ngay 🚀' : 'Send Test Now 🚀'}</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column: Step-by-Step Guide */}
          <div className="lg:col-span-5 space-y-4">
            {mailProvider === 'gmail' ? (
              <div className="bg-white dark:bg-[#141923] rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs p-5 space-y-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-600" />
                  {isVi ? 'Cách Lấy Mật Khẩu Ứng Dụng Gmail (20 Giây)' : 'How to Get Gmail App Password (20 Sec)'}
                </h4>

                <div className="space-y-3 text-xs">
                  {/* Step 1 */}
                  <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 space-y-1.5">
                    <b className="text-blue-950 dark:text-blue-200 font-bold">
                      {isVi ? '1. Bật Xác Minh 2 Bước (2-Step Verification)' : '1. Enable 2-Step Verification'}
                    </b>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                      {isVi
                        ? <>Đảm bảo tài khoản Google của bạn đã bật Xác minh 2 bước tại <a href="https://myaccount.google.com/security" target="_blank" rel="noreferrer" className="text-blue-700 dark:text-blue-400 font-bold underline">Google Security</a>.</>
                        : <>Ensure 2-Step Verification is active on your Google account at <a href="https://myaccount.google.com/security" target="_blank" rel="noreferrer" className="text-blue-700 dark:text-blue-400 font-bold underline">Google Security</a>.</>}
                    </p>
                  </div>

                  {/* Step 2 */}
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 space-y-1.5">
                    <b className="text-slate-900 dark:text-white font-bold">
                      {isVi ? '2. Tạo Mật Khẩu Ứng Dụng (App Password)' : '2. Generate App Password'}
                    </b>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                      {isVi ? (
                        <>Truy cập: <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer" className="text-blue-700 dark:text-blue-400 font-bold underline">myaccount.google.com/apppasswords</a> ➔ Nhập tên ứng dụng (ví dụ: <code>CRM EMY</code>) ➔ Bấm <b>Tạo (Create)</b>.</>
                      ) : (
                        <>Visit <a href="https://myaccount.google.com/apppasswords" target="_blank" rel="noreferrer" className="text-blue-700 dark:text-blue-400 font-bold underline">myaccount.google.com/apppasswords</a> ➔ Enter App name (e.g. <code>CRM EMY</code>) ➔ Click <b>Create</b>.</>
                      )}
                    </p>
                  </div>

                  {/* Step 3 */}
                  <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 space-y-1.5">
                    <b className="text-emerald-950 dark:text-emerald-200 font-bold">
                      {isVi ? '3. Copy 16 ký tự & Dán vào CRM' : '3. Copy 16 letters & Paste into CRM'}
                    </b>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                      {isVi ? (
                        <>Google sẽ hiển thị 16 ký tự màu vàng (ví dụ: <code>abcd efgh ijkl mnop</code>). Dán vào ô <b>App Password</b> bên trái và bấm <b>Lưu Cấu Hình Gmail</b>.</>
                      ) : (
                        <>Google presents 16 yellow characters (e.g. <code>abcd efgh ijkl mnop</code>). Paste it into the <b>App Password</b> field and click <b>Save Gmail Config</b>.</>
                      )}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                    ✨ <b>{isVi ? 'Ưu điểm tuyệt đối:' : 'Key Benefit:'}</b> {isVi ? 'Gửi trực tiếp từ Gmail chính chủ của bạn, gửi được cho bất kỳ ai (Yahoo, Gmail, Hotmail...), không cần tên miền riêng, không cần cài DNS.' : 'Deliver directly from your personal or office Gmail to any recipient (Yahoo, Gmail, Outlook...), with 0 DNS setup required.'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-[#141923] rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs p-5 space-y-4">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-600" />
                  {isVi ? 'Hướng Dẫn Cấu Hình Resend API' : 'Resend API Setup Guide'}
                </h4>

                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 space-y-1.5">
                    <b className="text-blue-950 dark:text-blue-200 font-bold">
                      {isVi ? '1. Đăng ký tài khoản Resend' : '1. Sign up on Resend'}
                    </b>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                      {isVi ? (
                        <>Truy cập <a href="https://resend.com/signup" target="_blank" rel="noreferrer" className="text-blue-700 dark:text-blue-400 font-bold underline">resend.com/signup</a> để nhận 3.000 email/tháng miễn phí.</>
                      ) : (
                        <>Visit <a href="https://resend.com/signup" target="_blank" rel="noreferrer" className="text-blue-700 dark:text-blue-400 font-bold underline">resend.com/signup</a> to get 3,000 free emails/month.</>
                      )}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900 space-y-1.5">
                    <b className="text-purple-950 dark:text-purple-200 font-bold">
                      {isVi ? '2. Xác thực tên miền riêng (Domains)' : '2. Verify Custom Domain (Optional)'}
                    </b>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                      {isVi ? (
                        <>Thêm domain vào <a href="https://resend.com/domains" target="_blank" rel="noreferrer" className="text-purple-700 dark:text-purple-400 font-bold underline">resend.com/domains</a> để gửi bằng email doanh nghiệp (ví dụ: <code>contact@emlytax.com</code>).</>
                      ) : (
                        <>Add your domain in <a href="https://resend.com/domains" target="_blank" rel="noreferrer" className="text-purple-700 dark:text-purple-400 font-bold underline">resend.com/domains</a> to deliver with your branded address (e.g. <code>contact@emlytax.com</code>).</>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. SUCCESS CONFIRMATION MODAL */}
      <Dialog open={sendSuccessModal} onOpenChange={setSendSuccessModal}>
        <DialogContent className="max-w-md p-6 rounded-2xl bg-white dark:bg-[#141923] text-center space-y-4 border border-slate-200 dark:border-white/10">
          <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <DialogTitle className="text-xl font-black text-slate-900 dark:text-white">
              {isVi ? 'Chiến Dịch Đã Gửi Thành Công! 🎉' : 'Campaign Dispatched Successfully! 🎉'}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              {isVi
                ? <>Chiến dịch <b>&quot;{campaignName}&quot;</b> đã được gửi thành công tới <b>{selectedClientIds.length} khách hàng</b> trong hệ thống.</>
                : <>Campaign <b>&quot;{campaignName}&quot;</b> has been delivered to <b>{selectedClientIds.length} selected recipients</b>.</>}
            </DialogDescription>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-white/10 text-xs text-slate-600 dark:text-slate-300 text-left space-y-1">
            <div className="flex justify-between">
              <span>{isVi ? 'Số lượng email gửi:' : 'Total emails delivered:'}</span>
              <b className="text-slate-900 dark:text-white">{selectedClientIds.length} emails</b>
            </div>
            <div className="flex justify-between">
              <span>{isVi ? 'Tỷ lệ gửi thành công:' : 'Delivery status:'}</span>
              <b className="text-emerald-700 dark:text-emerald-400 font-bold">100% Delivered</b>
            </div>
          </div>

          <div className="pt-2">
            <Button
              onClick={() => {
                setSendSuccessModal(false);
                setActiveTab('history');
              }}
              className="w-full h-10 bg-[#092c5c] hover:bg-[#072247] text-white font-bold text-xs rounded-xl"
            >
              {isVi ? 'Xem Lịch Sử Chiến Dịch' : 'View Campaign History'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* 7. SAVE CUSTOM TEMPLATE MODAL */}
      <Dialog open={isSaveTemplateModalOpen} onOpenChange={setIsSaveTemplateModalOpen}>
        <DialogContent className="max-w-md p-6 rounded-2xl bg-white dark:bg-[#141923] text-left space-y-4 border border-slate-200 dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center border border-amber-200 dark:border-amber-800">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
                {isVi ? 'Lưu Mẫu Email Soạn Sẵn' : 'Save New Custom Template'}
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
                {isVi
                  ? 'Lưu nội dung đang soạn thành mẫu riêng để tái sử dụng nhanh bất kỳ lúc nào.'
                  : 'Save your current draft as a reusable email template for future campaigns.'}
              </DialogDescription>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {/* Template Title */}
            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                {isVi ? 'Tên Mẫu Email' : 'Template Title'} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder={isVi ? 'Ví dụ: Thư nhắc nộp W-2 đợt 2, Chúc mừng sinh nhật...' : 'e.g. Second Reminder for W-2, Year-End Follow-up...'}
                value={newTemplateTitle}
                onChange={(e) => setNewTemplateTitle(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-slate-300 dark:border-white/10 dark:bg-slate-900 font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Template Tag / Badge */}
            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                {isVi ? 'Nhãn Danh Mục (Badge)' : 'Badge / Category Label'}
              </label>
              <input
                type="text"
                placeholder={isVi ? 'Ví dụ: Mùa thuế 2026, Nhắc nợ, Chăm sóc...' : 'e.g. Tax Season 2026, Billing, Follow-up...'}
                value={newTemplateBadge}
                onChange={(e) => setNewTemplateBadge(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-slate-300 dark:border-white/10 dark:bg-slate-900 font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Template Description */}
            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                {isVi ? 'Mô Tả Ngắn Gọn' : 'Short Description'}
              </label>
              <input
                type="text"
                placeholder={isVi ? 'Mô tả mục đích của mẫu email này...' : 'Brief summary of this email template...'}
                value={newTemplateDesc}
                onChange={(e) => setNewTemplateDesc(e.target.value)}
                className="w-full h-9 px-3 rounded-lg border border-slate-300 dark:border-white/10 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Current Body Snippet Preview */}
            <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-white/10 space-y-1">
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                {isVi ? 'Nội dung sẽ được lưu:' : 'Content to be saved:'}
              </div>
              <div className="font-bold text-slate-800 dark:text-slate-200 truncate">{emailSubject}</div>
              <div className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 font-mono whitespace-pre-line">
                {emailBody}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-white/10">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsSaveTemplateModalOpen(false)}
              className="h-9 px-3 text-xs"
            >
              {isVi ? 'Hủy' : 'Cancel'}
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSaveNewTemplate}
              className="h-9 px-4 text-xs font-bold bg-[#092c5c] hover:bg-[#072247] text-white rounded-lg shadow-sm gap-1.5 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isVi ? 'Lưu Mẫu Email 💾' : 'Save Template 💾'}</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
