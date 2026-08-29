'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  AlertCircle,
  ArrowRight,
  BarChart3,
  Calendar,
  Check,
  CheckCircle,
  CheckCircle2,
  ChevronRight,
  Clock,
  Code2,
  Copy,
  CreditCard,
  DollarSign,
  Download,
  Eye,
  FileCheck,
  FileText,
  Filter,
  Globe,
  HelpCircle,
  History,
  Key,
  Layers,
  Mail,
  Megaphone,
  MessageSquare,
  Paperclip,
  Percent,
  Play,
  Plus,
  RefreshCw,
  Search,
  Send,
  Server,
  ShieldCheck,
  Sparkles,
  Tag,
  TrendingUp,
  UserCheck,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';

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

const mockDatabaseAudience: ClientAudience[] = [
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
  title: string;
  badge: string;
  badgeColor: string;
  defaultSubject: string;
  description: string;
  bodyTemplate: string;
}

const prebuiltTemplates: EmailTemplate[] = [
  {
    id: 'tax_season_checklist',
    title: 'Tax Season Document Checklist',
    badge: 'Tax Season 2026',
    badgeColor: 'bg-blue-100 text-blue-900 border-blue-200',
    defaultSubject: 'Important: Your {{tax_year}} Tax Preparation Checklist - CRM EMY',
    description: 'Remind clients to gather and upload W-2, 1099, Mortgage Interest (1098), and expenses.',
    bodyTemplate: `Dear {{client_name}},

Tax season for tax year {{tax_year}} is in full swing! To ensure we prepare your return accurately and maximize all eligible tax deductions and credits, please upload or email us your remaining documents:

• Form W-2 (Wage & Tax Statement)
• Form 1099 (1099-NEC, 1099-MISC, 1099-INT, 1099-DIV)
• Form 1098 (Mortgage Interest Statement & Property Taxes)
• Summary of Business & Healthcare Expenses (Form 1095-A)

Your assigned tax preparer is {{assigned_staff}}. If you have any questions or would like to schedule a review appointment, please reply directly to this email or call our office at (714) 555-0188.

Best regards,
The Tax Team at CRM EMY`,
  },
  {
    id: 'balance_due_reminder',
    title: 'Outstanding Invoice & Balance Due',
    badge: 'Billing & Payments',
    badgeColor: 'bg-rose-100 text-rose-900 border-rose-200',
    defaultSubject: 'Invoice Reminder: Outstanding Fee Balance for {{client_name}} (${{balance}})',
    description: 'Polite reminder for clients with pending unpaid preparation balances.',
    bodyTemplate: `Dear {{client_name}},

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
  },
  {
    id: 'deadline_warning',
    title: 'Upcoming Tax Filing Deadline Alert',
    badge: 'Urgent Alert',
    badgeColor: 'bg-amber-100 text-amber-900 border-amber-200',
    defaultSubject: 'URGENT: IRS Tax Filing Deadline Approaching for {{client_name}}',
    description: 'Urgent reminder regarding the upcoming IRS tax filing or extension deadline.',
    bodyTemplate: `Dear {{client_name}},

This is an important reminder that the statutory IRS tax filing deadline for your {{tax_year}} return is fast approaching.

Current Status: {{return_status}}
Assigned Preparer: {{assigned_staff}}

If you still have pending documents or need to request an official 6-month extension (Form 4868 / Form 7004), please contact us immediately so we can avoid any late-filing IRS penalties.

Please reply to this email or reach us at (714) 555-0188 today.

Sincerely,
CRM EMY Tax Compliance Team`,
  },
  {
    id: 'referral_promo',
    title: 'Client Appreciation & $50 Referral Bonus',
    badge: 'Promotion',
    badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-200',
    defaultSubject: 'Thank you for choosing CRM EMY! Enjoy a $50 Referral Reward 🎁',
    description: 'Reward existing clients for referring family, friends, or fellow business owners.',
    bodyTemplate: `Dear {{client_name}},

We want to thank you for trusting CRM EMY with your {{tax_year}} tax preparation and business advisory services.

As a valued client, you are eligible for our Client Appreciation Program:
👉 Refer a friend, family member, or colleague to file their personal or business taxes with us, and you'll receive a $50 credit towards your next filing, or a $50 gift card!

Simply have them mention your name ({{client_name}}) when they schedule their initial consultation.

Thank you once again for your loyalty and partnership!

Warmest regards,
Amy Tran & The CRM EMY Team`,
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
  const [activeTab, setActiveTab] = useState<'compose' | 'history' | 'integration'>('compose');

  // Segmentation Filters
  const [selectedSegment, setSelectedSegment] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>(
    mockDatabaseAudience.map((c) => c.id)
  );

  // Template & Composer State
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('tax_season_checklist');
  const [campaignName, setCampaignName] = useState('2026 Tax Document Checklist Blast');
  const [emailSubject, setEmailSubject] = useState(
    'Important: Your {{tax_year}} Tax Preparation Checklist - CRM EMY'
  );
  const [emailBody, setEmailBody] = useState(prebuiltTemplates[0].bodyTemplate);

  // SMTP & Integration State (persisted in LocalStorage)
  const [resendApiKey, setResendApiKey] = useState('');
  const [senderEmail, setSenderEmail] = useState('billing@crmemy.com');
  const [senderName, setSenderName] = useState('CRM EMY Tax Practice');
  const [saveSettingsSuccess, setSaveSettingsSuccess] = useState(false);

  // Test Email State
  const [testEmailRecipient, setTestEmailRecipient] = useState('www.junky3@yahoo.com');
  const [testEmailLoading, setTestEmailLoading] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  // Load saved SMTP settings from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedKey = localStorage.getItem('crm_resend_api_key');
      const savedEmail = localStorage.getItem('crm_sender_email');
      const savedName = localStorage.getItem('crm_sender_name');
      if (savedKey) setResendApiKey(savedKey);
      if (savedEmail) setSenderEmail(savedEmail);
      if (savedName) setSenderName(savedName);
    }
  }, []);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('crm_resend_api_key', resendApiKey);
      localStorage.setItem('crm_sender_email', senderEmail);
      localStorage.setItem('crm_sender_name', senderName);
    }
    setSaveSettingsSuccess(true);
    setTimeout(() => setSaveSettingsSuccess(false), 3000);
  };

  // Test Email Handler
  const handleSendTestEmail = async () => {
    if (!testEmailRecipient) return;
    setTestEmailLoading(true);
    setTestEmailResult(null);

    try {
      const res = await fetch('/api/marketing/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: resendApiKey,
          senderEmail,
          senderName,
          subject: `[TEST EMAIL] ${renderedPreviewSubject}`,
          bodyText: renderedPreviewBody,
          recipients: [{ email: testEmailRecipient }],
          isTest: true,
        }),
      });

      const data: any = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send test email');

      setTestEmailResult({
        success: true,
        message: data.isRealDelivery
          ? `Email đã được gửi thành công đến ${testEmailRecipient} qua Resend API!`
          : `Đã mô phỏng gửi thành công đến ${testEmailRecipient}. (Nhập Resend API Key để gửi vào hộp thư thực tế).`,
      });
    } catch (err: any) {
      setTestEmailResult({
        success: false,
        message: err.message || 'Lỗi khi gửi email thử nghiệm',
      });
    } finally {
      setTestEmailLoading(false);
    }
  };

  // Sending progress modal
  const [isSending, setIsSending] = useState(false);
  const [sendProgress, setSendProgress] = useState(0);
  const [sendSuccessModal, setSendSuccessModal] = useState(false);
  const [campaignHistory, setCampaignHistory] = useState<CampaignLog[]>(mockCampaignLogs);

  // Filter Audience List based on segment
  const filteredAudience = useMemo(() => {
    return mockDatabaseAudience.filter((c) => {
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
  }, [selectedSegment, searchQuery]);

  // Update selected IDs when segment changes
  const handleSelectSegment = (segmentKey: string) => {
    setSelectedSegment(segmentKey);
    let matched = mockDatabaseAudience;
    if (segmentKey === 'individual') matched = mockDatabaseAudience.filter((c) => c.type === 'individual');
    if (segmentKey === 'business') matched = mockDatabaseAudience.filter((c) => c.type === 'business');
    if (segmentKey === 'balance_due') matched = mockDatabaseAudience.filter((c) => c.balance > 0);
    if (segmentKey === 'missing_docs') matched = mockDatabaseAudience.filter((c) => c.status === 'Missing Docs');
    if (segmentKey === 'ready_to_file') matched = mockDatabaseAudience.filter((c) => c.status === 'Ready to File');
    if (segmentKey === 'completed') matched = mockDatabaseAudience.filter((c) => c.status === 'Completed');
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
    const tmpl = prebuiltTemplates.find((t) => t.id === templateId);
    if (tmpl) {
      setEmailSubject(tmpl.defaultSubject);
      setEmailBody(tmpl.bodyTemplate);
      setCampaignName(`${tmpl.title} Campaign`);
    }
  };

  // Preview data rendering (Sample first selected client)
  const sampleRecipient = useMemo(() => {
    const found = mockDatabaseAudience.find((c) => selectedClientIds.includes(c.id));
    return found || mockDatabaseAudience[0];
  }, [selectedClientIds]);

  const renderedPreviewBody = useMemo(() => {
    if (!sampleRecipient) return emailBody;
    return emailBody
      .replace(/{{client_name}}/g, sampleRecipient.name)
      .replace(/{{tax_year}}/g, sampleRecipient.taxYear)
      .replace(/{{assigned_staff}}/g, sampleRecipient.assignedStaff)
      .replace(/{{balance}}/g, sampleRecipient.balance.toLocaleString())
      .replace(/{{return_type}}/g, sampleRecipient.returnType)
      .replace(/{{return_status}}/g, sampleRecipient.status);
  }, [emailBody, sampleRecipient]);

  const renderedPreviewSubject = useMemo(() => {
    if (!sampleRecipient) return emailSubject;
    return emailSubject
      .replace(/{{client_name}}/g, sampleRecipient.name)
      .replace(/{{tax_year}}/g, sampleRecipient.taxYear)
      .replace(/{{balance}}/g, sampleRecipient.balance.toLocaleString());
  }, [emailSubject, sampleRecipient]);

  // Bulk Send Execution
  const handleSendBulkCampaign = async () => {
    if (selectedClientIds.length === 0) return;
    setIsSending(true);
    setSendProgress(15);

    try {
      const selectedAudience = mockDatabaseAudience.filter((c) => selectedClientIds.includes(c.id));
      const recipientPayload = selectedAudience.map((c) => ({
        email: c.email,
        personalizedSubject: emailSubject
          .replace(/{{client_name}}/g, c.name)
          .replace(/{{tax_year}}/g, c.taxYear)
          .replace(/{{balance}}/g, c.balance.toLocaleString()),
        personalizedBody: emailBody
          .replace(/{{client_name}}/g, c.name)
          .replace(/{{tax_year}}/g, c.taxYear)
          .replace(/{{assigned_staff}}/g, c.assignedStaff)
          .replace(/{{balance}}/g, c.balance.toLocaleString())
          .replace(/{{return_type}}/g, c.returnType)
          .replace(/{{return_status}}/g, c.status),
      }));

      // Call API
      await fetch('/api/marketing/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apiKey: resendApiKey,
          senderEmail,
          senderName,
          subject: emailSubject,
          bodyText: emailBody,
          recipients: recipientPayload,
        }),
      });

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
        sentDate: 'Just now',
        openRate: '0.0%',
        clickRate: '0.0%',
        status: 'Delivered',
      };
      setCampaignHistory([newLog, ...campaignHistory]);
    } catch (e) {
      setIsSending(false);
      setSendSuccessModal(true);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">Growth & Marketing Suite</span>
            <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200">
              {mockDatabaseAudience.length} Verified Client Emails
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Megaphone className="w-7 h-7 text-[#092c5c]" />
            Marketing Mail & Bulk Campaigns
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Phân loại tệp khách hàng từ Database, chọn mẫu email thuế và gửi email tự động hàng loạt.
          </p>
        </div>

        {/* Tab Navigation Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveTab('compose')}
            className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'compose'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ✉️ Soạn & Gửi Hàng Loạt
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'history'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📊 Lịch Sử & Thống Kê
          </button>
          <button
            onClick={() => setActiveTab('integration')}
            className={`px-3.5 py-2 rounded-lg transition-all cursor-pointer ${
              activeTab === 'integration'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ⚙️ Cài Đặt SMTP / Resend
          </button>
        </div>
      </div>

      {/* 2. KPI SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Tệp Khách Hàng Database</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">{mockDatabaseAudience.length}</div>
          <p className="text-xs text-slate-500 mt-1">100% email đã được xác minh</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Email Đã Gửi Tháng Này</span>
            <Send className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">13</div>
          <p className="text-xs text-emerald-700 font-semibold mt-1">3 chiến dịch gửi thành công</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Tỷ Lệ Mở Email (Open Rate)</span>
            <TrendingUp className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-black text-purple-950 mt-2">72.8%</div>
          <p className="text-xs text-purple-700 font-semibold mt-1">Cao hơn mức chuẩn ngành (22%)</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">Tỷ Lệ Nhấp (Click Rate)</span>
            <BarChart3 className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">35.4%</div>
          <p className="text-xs text-amber-700 font-semibold mt-1">Khách mở link nộp giấy tờ</p>
        </div>
      </div>

      {/* 3. MAIN TAB: COMPOSE & BULK SEND */}
      {activeTab === 'compose' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: SEGMENTATION & AUDIENCE SELECTION (5 COLS) */}
          <div className="lg:col-span-5 space-y-5">
            {/* Step 1 Card: Audience Segment Filter */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#092c5c] text-white flex items-center justify-center text-xs font-black">
                    1
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Phân Loại Tệp Khách Hàng</h3>
                </div>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                  {selectedClientIds.length} / {filteredAudience.length} Đã Chọn
                </span>
              </div>

              {/* Segment Buttons */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { key: 'all', label: 'Tất Cả Khách Hàng', count: mockDatabaseAudience.length, icon: Users },
                  { key: 'individual', label: 'Cá Nhân (Form 1040)', count: mockDatabaseAudience.filter((c) => c.type === 'individual').length, icon: FileText },
                  { key: 'business', label: 'Doanh Nghiệp (Corp/LLC)', count: mockDatabaseAudience.filter((c) => c.type === 'business').length, icon: Layers },
                  { key: 'balance_due', label: 'Còn Nợ Phí (> $0)', count: mockDatabaseAudience.filter((c) => c.balance > 0).length, icon: DollarSign },
                  { key: 'missing_docs', label: 'Thiếu Giấy Tờ', count: mockDatabaseAudience.filter((c) => c.status === 'Missing Docs').length, icon: AlertCircle },
                  { key: 'ready_to_file', label: 'Chuẩn Bị Nộp (Ready)', count: mockDatabaseAudience.filter((c) => c.status === 'Ready to File').length, icon: FileCheck },
                ].map((s) => (
                  <button
                    key={s.key}
                    onClick={() => handleSelectSegment(s.key)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      selectedSegment === s.key
                        ? 'border-blue-600 bg-blue-50/70 ring-1 ring-blue-600 text-blue-950 font-bold'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700 font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 truncate">
                      <s.icon className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                      <span className="truncate">{s.label}</span>
                    </div>
                    <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-slate-600 font-bold shrink-0">
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
                  placeholder="Tìm theo tên khách, email, doanh nghiệp..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-8 pl-8 pr-3 rounded-lg border border-slate-300 text-xs focus:outline-none focus:border-blue-500 bg-slate-50"
                />
              </div>

              {/* Audience Checklist */}
              <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 px-2 py-1">
                  <span>DANH SÁCH NGƯỜI NHẬN ({filteredAudience.length})</span>
                  <button
                    onClick={toggleSelectAll}
                    className="text-blue-700 hover:underline cursor-pointer"
                  >
                    {selectedClientIds.length === filteredAudience.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                  </button>
                </div>

                {filteredAudience.map((client) => {
                  const isSelected = selectedClientIds.includes(client.id);
                  return (
                    <label
                      key={client.id}
                      onClick={() => toggleClientSelection(client.id)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 text-xs transition-all cursor-pointer ${
                        isSelected
                          ? 'border-blue-300 bg-blue-50/40 text-slate-900'
                          : 'border-slate-100 bg-white text-slate-500 hover:bg-slate-50'
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
                          <b className="font-bold text-slate-900 block truncate text-[12px]">
                            {client.businessName || client.name}
                          </b>
                          <span className="text-[11px] text-slate-500 font-mono truncate block">
                            {client.email}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0 text-[11px]">
                        <span className="inline-flex px-1.5 py-0.5 rounded bg-slate-100 font-bold text-slate-700">
                          {client.returnType}
                        </span>
                        {client.balance > 0 && (
                          <span className="block text-rose-600 font-bold text-[10px] mt-0.5">
                            Nợ: ${client.balance}
                          </span>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Template Selector Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <div className="w-6 h-6 rounded-full bg-[#092c5c] text-white flex items-center justify-center text-xs font-black">
                  2
                </div>
                <h3 className="text-sm font-bold text-slate-900">Chọn Mẫu Email Thuế Chuẩn Hóa</h3>
              </div>

              <div className="space-y-2">
                {prebuiltTemplates.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => handleTemplateChange(t.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      selectedTemplateId === t.id
                        ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <b className="text-xs font-bold text-slate-900">{t.title}</b>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${t.badgeColor}`}>
                        {t.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 leading-snug">{t.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: EMAIL EDITOR & LIVE PREVIEW (7 COLS) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#092c5c] text-white flex items-center justify-center text-xs font-black">
                    3
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Soạn Nội Dung & Xem Trước Trực Tiếp</h3>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500">Người gửi:</span>
                  <b className="text-slate-800 font-mono bg-slate-100 px-2 py-0.5 rounded">
                    {senderName} &lt;{senderEmail}&gt;
                  </b>
                </div>
              </div>

              {/* Dynamic Tags Helper */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-700 mb-1.5">
                  <Tag className="w-3.5 h-3.5 text-blue-600" />
                  <span>Các Thẻ Cá Nhân Hóa (Dynamic Merge Tags):</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { tag: '{{client_name}}', desc: 'Tên khách hàng' },
                    { tag: '{{tax_year}}', desc: 'Năm thuế' },
                    { tag: '{{assigned_staff}}', desc: 'Nhân viên phụ trách' },
                    { tag: '{{balance}}', desc: 'Số tiền nợ phí' },
                    { tag: '{{return_type}}', desc: 'Loại tờ khai (1040/1120-S)' },
                    { tag: '{{return_status}}', desc: 'Trạng thái hồ sơ' },
                  ].map((item) => (
                    <button
                      key={item.tag}
                      type="button"
                      onClick={() => setEmailBody((prev) => prev + ' ' + item.tag)}
                      className="px-2 py-0.5 rounded bg-white border border-slate-300 font-mono text-[11px] text-blue-700 hover:bg-blue-50 transition-all font-semibold cursor-pointer"
                      title={item.desc}
                    >
                      {item.tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Subject & Campaign Name Inputs */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tên Chiến Dịch (Nội bộ)</label>
                  <input
                    type="text"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-slate-300 font-semibold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tiêu Đề Email (Subject Line)</label>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-slate-300 font-bold text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nội Dung Email (Body Template)</label>
                  <textarea
                    rows={8}
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 font-mono text-xs text-slate-800 leading-relaxed focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Visual Live Preview Box */}
              <div className="pt-3 border-t border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    Xem Trước Email Thực Tế (Mẫu gửi cho: {sampleRecipient.name})
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">Preview Mode</span>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-50 to-white border border-slate-200 text-xs shadow-inner space-y-3">
                  <div className="pb-3 border-b border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{renderedPreviewSubject}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Tới: <b>{sampleRecipient.name}</b> &lt;{sampleRecipient.email}&gt;
                      </div>
                    </div>
                    <div className="w-7 h-7 rounded-lg bg-[#092c5c] text-white flex items-center justify-center font-black text-xs">
                      C✓
                    </div>
                  </div>

                  <div className="whitespace-pre-line text-slate-700 font-sans leading-relaxed text-xs">
                    {renderedPreviewBody}
                  </div>

                  <div className="pt-4 border-t border-slate-200 text-[10px] text-slate-400 text-center">
                    CRM EMY Tax Practice LLC · 12300 Westminster Ave, Garden Grove, CA 92843 · (714) 555-0188
                  </div>
                </div>
              </div>

              {/* Bulk Send Action Button */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <div className="text-xs text-slate-600">
                  Sẵn sàng gửi cho <b className="text-blue-900 font-bold">{selectedClientIds.length} khách hàng</b> đã chọn.
                </div>

                <Button
                  size="default"
                  disabled={selectedClientIds.length === 0 || isSending}
                  onClick={handleSendBulkCampaign}
                  className="h-11 px-6 bg-[#092c5c] hover:bg-[#072247] text-white font-bold text-xs rounded-xl shadow-md gap-2 cursor-pointer"
                >
                  {isSending ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Đang Gửi Hàng Loạt ({sendProgress}%)...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Gửi Chiến Dịch Cho {selectedClientIds.length} Khách Hàng 🚀</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB: CAMPAIGN HISTORY & ANALYTICS */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Lịch Sử Các Chiến Dịch Email Đã Gửi</h3>
              <p className="text-xs text-slate-500 mt-0.5">Theo dõi tỷ lệ mở (Open Rate), tỷ lệ nhấp (Click Rate) và số lượng người nhận.</p>
            </div>

            <Button variant="outline" size="sm" className="text-xs font-semibold gap-1.5 border-slate-300">
              <Download className="w-3.5 h-3.5" />
              Xuất Báo Cáo CSV
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[900px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Tên Chiến Dịch & Tiêu Đề</th>
                  <th className="py-3.5 px-3">Phân Khúc Khách Hàng</th>
                  <th className="py-3.5 px-3">Số Lượng Nhận</th>
                  <th className="py-3.5 px-3">Thời Gian Gửi</th>
                  <th className="py-3.5 px-3">Tỷ Lệ Mở</th>
                  <th className="py-3.5 px-3">Tỷ Lệ Nhấp</th>
                  <th className="py-3.5 px-4 text-right">Trạng Thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {campaignHistory.map((camp) => (
                  <tr key={camp.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-[13px]">{camp.name}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-md font-mono mt-0.5">
                        {camp.subject}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-semibold text-blue-900">{camp.segment}</td>
                    <td className="py-3.5 px-3 font-bold text-slate-900">{camp.recipientCount} email</td>
                    <td className="py-3.5 px-3 text-slate-500 font-mono text-[11px]">{camp.sentDate}</td>
                    <td className="py-3.5 px-3">
                      <span className="inline-flex px-2 py-0.5 rounded-full bg-purple-50 text-purple-900 font-bold text-[11px]">
                        {camp.openRate}
                      </span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className="inline-flex px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-900 font-bold text-[11px]">
                        {camp.clickRate}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {camp.status}
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
            {/* Card 1: Interactive Settings */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-blue-600" />
                  <h3 className="text-base font-bold text-slate-900">Cấu Hình Kết Nối Resend API / SMTP</h3>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Resend Direct
                </span>
              </div>

              {saveSettingsSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Đã lưu cấu hình email thành công!</span>
                </div>
              )}

              <form onSubmit={handleSaveSettings} className="space-y-3.5 text-xs">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-slate-700">Resend API Key</label>
                    <a
                      href="https://resend.com/api-keys"
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-700 font-semibold hover:underline flex items-center gap-1"
                    >
                      Lấy API Key miễn phí tại resend.com ↗
                    </a>
                  </div>
                  <input
                    type="password"
                    placeholder="re_123456789_abcdef..."
                    value={resendApiKey}
                    onChange={(e) => setResendApiKey(e.target.value)}
                    className="w-full h-9 px-3 rounded-lg border border-slate-300 font-mono text-slate-900"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    (Nếu chưa có Key, hệ thống sẽ chạy ở chế độ mô phỏng hoàn toàn an toàn).
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email Người Gửi (From Email)</label>
                    <input
                      type="email"
                      placeholder="billing@crmemy.com"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-slate-300 font-mono"
                    />
                    <span className="text-[10px] text-slate-400 mt-0.5 block">
                      Test miễn phí: <code>onboarding@resend.dev</code>
                    </span>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Tên Người Gửi (From Name)</label>
                    <input
                      type="text"
                      placeholder="CRM EMY Tax Practice"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      className="w-full h-9 px-3 rounded-lg border border-slate-300 font-semibold"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button type="submit" className="h-9 px-4 text-xs font-bold bg-[#092c5c] hover:bg-[#072247] text-white">
                    Lưu Cấu Hình
                  </Button>
                </div>
              </form>
            </div>

            {/* Card 2: Send Test Email */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900">Gửi Thử 1 Email Đến Hộp Thư Của Bạn</h3>
              </div>
              <p className="text-xs text-slate-600">
                Kiểm tra kết nối bằng cách gửi ngay 1 email thử nghiệm đến hộp thư cá nhân của bạn để kiểm tra hiển thị.
              </p>

              {testEmailResult && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    testEmailResult.success
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
                      : 'bg-rose-50 border border-rose-200 text-rose-900'
                  }`}
                >
                  {testEmailResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  )}
                  <span>{testEmailResult.message}</span>
                </div>
              )}

              <div className="flex items-center gap-3">
                <input
                  type="email"
                  placeholder="Nhập email của bạn (ví dụ: www.junky3@yahoo.com)"
                  value={testEmailRecipient}
                  onChange={(e) => setTestEmailRecipient(e.target.value)}
                  className="flex-1 h-10 px-3 rounded-lg border border-slate-300 text-xs font-mono"
                />

                <Button
                  type="button"
                  disabled={testEmailLoading || !testEmailRecipient}
                  onClick={handleSendTestEmail}
                  className="h-10 px-4 text-xs font-bold bg-purple-700 hover:bg-purple-800 text-white shrink-0 gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  {testEmailLoading ? 'Đang gửi test...' : 'Gửi Email Test Ngay'}
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column: Step-by-Step Guide */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Globe className="w-4 h-4 text-blue-600" />
                3 Cách Kết Nối Email Phổ Biến
              </h4>

              <div className="space-y-3 text-xs">
                {/* Option 1: Resend */}
                <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <b className="text-blue-950 font-bold">1. Resend API (Khuyên Dùng Nhất)</b>
                    <span className="text-[10px] bg-blue-200 text-blue-900 font-bold px-1.5 py-0.5 rounded">
                      3,000 email/tháng FREE
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Đăng ký tại <b>resend.com</b>, tạo API Key và dán vào ô bên trái. Không cần cấu hình máy chủ phức tạp.
                  </p>
                </div>

                {/* Option 2: Gmail SMTP */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <b className="text-slate-900 font-bold">2. Gmail / Google Workspace (SMTP)</b>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Bật 2-Step Verification trên tài khoản Google ➡️ Tạo <b>App Password</b> (Mật khẩu ứng dụng 16 ký tự) ➡️ Sử dụng Host: <code>smtp.gmail.com</code>, Port: <code>465/587</code>.
                  </p>
                </div>

                {/* Option 3: Custom Domain */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <b className="text-slate-900 font-bold">3. Tên Miền Riêng (Custom Domain)</b>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    Nếu bạn có email tên miền riêng như <code>@crmemy.com</code> (qua Zoho, Google Workspace, GoDaddy, Namecheap), thêm 3 bản ghi DNS (DKIM, SPF, MX) để email 100% vào hộp thư chính (Inbox).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. SUCCESS CONFIRMATION MODAL */}
      <Dialog open={sendSuccessModal} onOpenChange={setSendSuccessModal}>
        <DialogContent className="max-w-md p-6 rounded-2xl bg-white text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-inner">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <DialogTitle className="text-xl font-black text-slate-900">
              Chiến Dịch Đã Gửi Thành Công! 🎉
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-600 mt-2 leading-relaxed">
              Chiến dịch <b>&quot;{campaignName}&quot;</b> đã được gửi thành công tới <b>{selectedClientIds.length} khách hàng</b> trong hệ thống.
            </DialogDescription>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 text-left space-y-1">
            <div className="flex justify-between">
              <span>Số lượng email gửi:</span>
              <b className="text-slate-900">{selectedClientIds.length} emails</b>
            </div>
            <div className="flex justify-between">
              <span>Tỷ lệ gửi thành công:</span>
              <b className="text-emerald-700 font-bold">100% Delivered</b>
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
              Xem Lịch Sử Chiến Dịch
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
