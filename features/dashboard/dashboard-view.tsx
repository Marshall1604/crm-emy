'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  Building2,
  FileSpreadsheet,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  Plus,
  Search,
  Filter,
  Calendar,
  ChevronRight,
  Check,
  Briefcase,
  Layers,
  Sparkles,
  Phone,
  Mail,
  FolderOpen,
  LayoutGrid,
  Table as TableIcon,
  Shield,
  Send,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n/language-context';
import { useAuth } from '@/lib/auth/auth-context';
import { useMemberStore } from '@/features/team/member-store';

interface DashboardReturn {
  id: string;
  name: string;
  type: 'Individual' | 'Business';
  form: string;
  year: string;
  status: 'Waiting Documents' | 'In Preparation' | 'Review' | 'Ready to File' | 'E-Filed' | 'Completed';
  preparer: string;
  preparerInitials: string;
  fee: number;
  balance: number;
  link: string;
  updated: string;
  email?: string;
  phone?: string;
}

const initialReturns: DashboardReturn[] = [
  {
    id: 'tr-1',
    name: 'ABC Logistics LLC',
    type: 'Business',
    form: 'Form 1065',
    year: '2025',
    status: 'In Preparation',
    preparer: 'Daniel Lee',
    preparerInitials: 'DL',
    fee: 2400,
    balance: 1200,
    link: '/businesses/abc-logistics',
    updated: 'Today, 10:15 AM',
    email: 'contact@abclogistics.com',
    phone: '(408) 555-0192',
  },
  {
    id: 'tr-2',
    name: 'Minh Nguyen',
    type: 'Individual',
    form: 'Form 1040',
    year: '2025',
    status: 'Waiting Documents',
    preparer: 'Amy Tran',
    preparerInitials: 'AT',
    fee: 650,
    balance: 325,
    link: '/clients/minh-nguyen',
    updated: 'Today, 9:30 AM',
    email: 'minh.nguyen@gmail.com',
    phone: '(714) 889-2311',
  },
  {
    id: 'tr-3',
    name: 'XYZ Technology Inc',
    type: 'Business',
    form: 'Form 1120-S',
    year: '2025',
    status: 'Waiting Documents',
    preparer: 'Sarah Kim',
    preparerInitials: 'SK',
    fee: 3100,
    balance: 1550,
    link: '/businesses/xyz-tech',
    updated: 'Yesterday',
    email: 'ops@xyztech.io',
    phone: '(650) 412-8876',
  },
  {
    id: 'tr-4',
    name: 'Olivia Johnson',
    type: 'Individual',
    form: 'Form 1040',
    year: '2025',
    status: 'Review',
    preparer: 'Daniel Lee',
    preparerInitials: 'DL',
    fee: 875,
    balance: 0,
    link: '/clients/olivia-johnson',
    updated: 'Aug 28, 2026',
    email: 'olivia.j@outlook.com',
    phone: '(415) 782-9012',
  },
  {
    id: 'tr-5',
    name: 'Luxury Nails Studio LLC',
    type: 'Business',
    form: 'Form 1065',
    year: '2025',
    status: 'Ready to File',
    preparer: 'Amy Tran',
    preparerInitials: 'AT',
    fee: 1450,
    balance: 0,
    link: '/businesses/luxury-nails',
    updated: 'Aug 27, 2026',
    email: 'info@luxurynails.com',
    phone: '(714) 223-9901',
  },
  {
    id: 'tr-6',
    name: 'Kevin & Mai Tran',
    type: 'Individual',
    form: 'Form 1040',
    year: '2025',
    status: 'Completed',
    preparer: 'Amy Tran',
    preparerInitials: 'AT',
    fee: 920,
    balance: 0,
    link: '/clients/kevin-mai-tran',
    updated: 'Aug 25, 2026',
    email: 'kevin.tran@gmail.com',
    phone: '(714) 634-1190',
  },
  {
    id: 'tr-7',
    name: 'ACME Holdings Corp',
    type: 'Business',
    form: 'Form 1120',
    year: '2024',
    status: 'Completed',
    preparer: 'Sarah Kim',
    preparerInitials: 'SK',
    fee: 4200,
    balance: 0,
    link: '/businesses',
    updated: 'Aug 20, 2026',
    email: 'tax@acmeholdings.com',
    phone: '(408) 723-5511',
  },
];

function safeInitials(name?: string | null): string {
  if (!name || typeof name !== 'string') return '??';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '??';
  if (parts.length === 1) return (parts[0][0] || '?').toUpperCase();
  return ((parts[0][0] || '') + (parts[parts.length - 1][0] || '')).toUpperCase();
}

function safeNumber(val: any): number {
  const num = Number(val);
  return isNaN(num) ? 0 : num;
}

function formatCurrency(val: any): string {
  return safeNumber(val).toLocaleString('en-US');
}

export function DashboardView() {
  const { user, role } = useAuth();
  const { t, language } = useLanguage();
  const isVi = language === 'vi';

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');

  const isAdmin = role === 'super_admin' || role === 'admin';

  const [activeReturns, setActiveReturns] = useState<DashboardReturn[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const clientKey = user?.id ? `crm_emy_clients_${user.id}` : 'crm_emy_clients_list';
        const bizKey = user?.id ? `crm_emy_businesses_${user.id}` : 'crm_emy_businesses_list';
        const savedClientsStr = localStorage.getItem(clientKey);
        const savedBizStr = localStorage.getItem(bizKey);

        const clients = savedClientsStr ? JSON.parse(savedClientsStr) : [];
        const businesses = savedBizStr ? JSON.parse(savedBizStr) : [];

        const combined: DashboardReturn[] = [
          ...(Array.isArray(businesses) ? businesses : []).map((b: any) => ({
            id: `biz-${b?.id || Math.random().toString()}`,
            name: String(b?.name || 'Unnamed Business'),
            type: 'Business' as const,
            form: String(b?.returnType || 'Form 1065'),
            year: String(b?.year || '2025'),
            status: (b?.status || 'Waiting Documents') as DashboardReturn['status'],
            preparer: String(b?.preparer || 'Amy Tran'),
            preparerInitials: safeInitials(b?.preparer || 'Amy Tran'),
            fee: safeNumber(b?.fee),
            balance: safeNumber(b?.balance),
            link: `/businesses/${b?.id || ''}`,
            updated: String(b?.updated || 'Recently'),
            email: b?.email || 'biz@taxpractice.com',
            phone: b?.phone || '(408) 555-0100',
          })),
          ...(Array.isArray(clients) ? clients : []).map((c: any) => ({
            id: `cl-${c?.id || Math.random().toString()}`,
            name: String(c?.name || 'Unnamed Client'),
            type: 'Individual' as const,
            form: String(c?.returnType || 'Form 1040'),
            year: String(c?.year || '2025'),
            status: (c?.status || 'Waiting Documents') as DashboardReturn['status'],
            preparer: String(c?.staff || 'Amy Tran'),
            preparerInitials: safeInitials(c?.staff || 'Amy Tran'),
            fee: safeNumber(c?.fee),
            balance: safeNumber(c?.balance),
            link: `/clients/${c?.id || ''}`,
            updated: String(c?.updated || 'Recently'),
            email: c?.email || 'client@taxpractice.com',
            phone: c?.phone || '(714) 555-0199',
          })),
        ];

        if (combined.length > 0) return combined;
        if (user) return [];
      } catch (e) {}
    }
    return user ? [] : initialReturns;
  });

  const [totalClientsCount, setTotalClientsCount] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      try {
        const clientKey = user?.id ? `crm_emy_clients_${user.id}` : 'crm_emy_clients_list';
        const saved = localStorage.getItem(clientKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          return Array.isArray(parsed) ? parsed.length : 0;
        }
      } catch (e) {}
    }
    return user ? 0 : 8;
  });

  const [totalBizCount, setTotalBizCount] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      try {
        const bizKey = user?.id ? `crm_emy_businesses_${user.id}` : 'crm_emy_businesses_list';
        const saved = localStorage.getItem(bizKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          return Array.isArray(parsed) ? parsed.length : 0;
        }
      } catch (e) {}
    }
    return user ? 0 : 5;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const clientKey = user?.id ? `crm_emy_clients_${user.id}` : 'crm_emy_clients_list';
        const bizKey = user?.id ? `crm_emy_businesses_${user.id}` : 'crm_emy_businesses_list';
        const savedClientsStr = localStorage.getItem(clientKey);
        const savedBizStr = localStorage.getItem(bizKey);

        const clients = savedClientsStr ? JSON.parse(savedClientsStr) : [];
        const businesses = savedBizStr ? JSON.parse(savedBizStr) : [];

        const cLen = Array.isArray(clients) ? clients.length : 0;
        const bLen = Array.isArray(businesses) ? businesses.length : 0;

        setTotalClientsCount(user ? cLen : (cLen || 8));
        setTotalBizCount(user ? bLen : (bLen || 5));

        const combined: DashboardReturn[] = [
          ...(Array.isArray(businesses) ? businesses : []).map((b: any) => ({
            id: `biz-${b?.id || Math.random().toString()}`,
            name: String(b?.name || 'Unnamed Business'),
            type: 'Business' as const,
            form: String(b?.returnType || 'Form 1065'),
            year: String(b?.year || '2025'),
            status: (b?.status || 'Waiting Documents') as DashboardReturn['status'],
            preparer: String(b?.preparer || 'Amy Tran'),
            preparerInitials: safeInitials(b?.preparer || 'Amy Tran'),
            fee: safeNumber(b?.fee),
            balance: safeNumber(b?.balance),
            link: `/businesses/${b?.id || ''}`,
            updated: String(b?.updated || 'Recently'),
            email: b?.email || 'biz@taxpractice.com',
            phone: b?.phone || '(408) 555-0100',
          })),
          ...(Array.isArray(clients) ? clients : []).map((c: any) => ({
            id: `cl-${c?.id || Math.random().toString()}`,
            name: String(c?.name || 'Unnamed Client'),
            type: 'Individual' as const,
            form: String(c?.returnType || 'Form 1040'),
            year: String(c?.year || '2025'),
            status: (c?.status || 'Waiting Documents') as DashboardReturn['status'],
            preparer: String(c?.staff || 'Amy Tran'),
            preparerInitials: safeInitials(c?.staff || 'Amy Tran'),
            fee: safeNumber(c?.fee),
            balance: safeNumber(c?.balance),
            link: `/clients/${c?.id || ''}`,
            updated: String(c?.updated || 'Recently'),
            email: c?.email || 'client@taxpractice.com',
            phone: c?.phone || '(714) 555-0199',
          })),
        ];

        if (combined.length > 0) {
          setActiveReturns(combined);
        } else if (user) {
          setActiveReturns([]);
        } else {
          setActiveReturns(initialReturns);
        }
      } catch (e) {}
    }
  }, [user]);

  const statusLabels: Record<string, { en: string; vi: string }> = {
    'Waiting Documents': { en: 'Waiting Docs', vi: 'Chờ Giấy Tờ' },
    'In Preparation': { en: 'In Preparation', vi: 'Đang Soạn Hồ Sơ' },
    Review: { en: 'Review & QA', vi: 'Đang Kiểm Tra' },
    'Ready to File': { en: 'Ready to File', vi: 'Sẵn Sàng Nộp' },
    Completed: { en: 'Completed', vi: 'Đã Hoàn Tất' },
    'E-Filed': { en: 'E-Filed IRS', vi: 'Đã Nộp IRS' },
  };

  const getStatusText = (status: string) => {
    return isVi ? (statusLabels[status]?.vi || status) : (statusLabels[status]?.en || status);
  };

  const filteredReturns = useMemo(() => {
    const q = (search || '').toLowerCase().trim();
    return (activeReturns || []).filter((item) => {
      if (!item) return false;
      const itemName = String(item.name || '').toLowerCase();
      const itemPrep = String(item.preparer || '').toLowerCase();
      const itemForm = String(item.form || '').toLowerCase();

      const matchesSearch =
        q === '' ||
        itemName.includes(q) ||
        itemPrep.includes(q) ||
        itemForm.includes(q);

      const matchesStatus = selectedStatus === 'ALL' || item.status === selectedStatus;
      const matchesType = selectedType === 'ALL' || item.type === selectedType;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [activeReturns, search, selectedStatus, selectedType]);

  const totalClients = totalClientsCount + totalBizCount;
  const inProgressReturns = (activeReturns || []).filter((r) => r?.status !== 'Completed').length;
  const completedReturns = (activeReturns || []).filter((r) => r?.status === 'Completed').length;
  const totalRevenue = (activeReturns || []).reduce((sum, r) => sum + safeNumber(r?.fee), 0);
  const totalBalance = (activeReturns || []).reduce((sum, r) => sum + safeNumber(r?.balance), 0);

  const statusCounts = {
    'Waiting Documents': (activeReturns || []).filter((r) => r?.status === 'Waiting Documents').length,
    'In Preparation': (activeReturns || []).filter((r) => r?.status === 'In Preparation').length,
    Review: (activeReturns || []).filter((r) => r?.status === 'Review').length,
    'Ready to File': (activeReturns || []).filter((r) => r?.status === 'Ready to File').length,
    Completed: (activeReturns || []).filter((r) => r?.status === 'Completed').length,
  };

  const { members } = useMemberStore();

  const preparerWorkload = useMemo(() => {
    if (!members || !Array.isArray(members) || members.length === 0) return [];
    const totalActive = (activeReturns || []).length;

    return members
      .filter((m) => m && m.status === 'Active')
      .map((m, idx) => {
        const memName = String(m?.name || '').toLowerCase();
        const memInitials = String(m?.initials || '');

        const count = (activeReturns || []).filter((r) => {
          if (!r || !r.preparer) return false;
          const prepLower = String(r.preparer).toLowerCase();
          return (
            (memName && (prepLower.includes(memName) || memName.includes(prepLower))) ||
            (memInitials && r.preparerInitials === memInitials)
          );
        }).length;

        const percentage = totalActive > 0 ? Math.round((count / totalActive) * 100) : 0;

        return {
          id: m.id || String(idx),
          name: m.name || 'Member',
          role: m.role || 'Preparer',
          initials: safeInitials(m.name || m.initials || 'M'),
          count,
          percentage,
        };
      });
  }, [members, activeReturns]);

  // Clean Quick Action Buttons
  const quickActions = [
    {
      id: 'qa-1040',
      title: isVi ? 'Hồ Sơ 1040' : '1040 Individual',
      subtitle: isVi ? 'Cá nhân' : 'Personal',
      href: '/clients',
      icon: Users,
      highlight: true,
    },
    {
      id: 'qa-1065',
      title: isVi ? 'Doanh Nghiệp' : 'Business Returns',
      subtitle: isVi ? '1065 & 1120-S' : '1065 / 1120-S',
      href: '/businesses',
      icon: Building2,
      highlight: false,
    },
    {
      id: 'qa-returns',
      title: isVi ? 'Tờ Khai Thuế' : 'Tax Returns',
      subtitle: isVi ? 'Soạn & Nộp' : 'Prep & File',
      href: '/tax-returns',
      icon: FileSpreadsheet,
      highlight: false,
    },
    {
      id: 'qa-invoices',
      title: isVi ? 'Hóa Đơn' : 'Invoices',
      subtitle: isVi ? 'Thu phí dịch vụ' : 'Billing & Fees',
      href: '/invoices',
      icon: DollarSign,
      highlight: false,
    },
    {
      id: 'qa-marketing',
      title: isVi ? 'Gửi Email' : 'Email Campaigns',
      subtitle: isVi ? 'Tiếp thị' : 'Marketing',
      href: '/marketing',
      icon: Send,
      highlight: false,
    },
    {
      id: 'qa-insurance',
      title: isVi ? 'Bảo Hiểm' : 'Insurance',
      subtitle: isVi ? 'Chính sách' : 'Coverage',
      href: '/insurance',
      icon: Shield,
      highlight: false,
    },
    {
      id: 'qa-docs',
      title: isVi ? 'Tài Liệu' : 'Documents',
      subtitle: isVi ? 'W-2, 1099, K-1' : 'Uploads',
      href: '/clients',
      icon: FolderOpen,
      highlight: false,
    },
    {
      id: 'qa-team',
      title: isVi ? 'Đội Ngũ' : 'Team Hub',
      subtitle: isVi ? 'Phân bổ' : 'Assignments',
      href: '/team',
      icon: Briefcase,
      highlight: false,
    },
  ];

  return (
    <main className="p-4 sm:p-6 md:p-8 max-w-[1850px] w-full mx-auto space-y-6 animate-in fade-in duration-300 text-slate-800 dark:text-slate-100">
      
      {/* ─── 1. TOP HEADER & QUICK STAT BAR ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[11px] font-black tracking-wider text-slate-400 dark:text-slate-500 uppercase">
              {t('tax_crm_workspace')}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {t('live_sync_active')}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
              ⚡ {isVi ? 'Mùa Thuế 2025/2026' : 'Tax Season 2025/2026'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {t('dashboard_title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
            {t('dashboard_subtitle')}
          </p>
        </div>

        {/* Action Button Group */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <Link href="/clients">
            <Button
              variant="outline"
              className="h-10 px-4 text-xs font-bold gap-2 rounded-[20px] border border-slate-200 dark:border-slate-750 bg-white dark:bg-[#181F2B] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-2xs transition-all cursor-pointer"
            >
              <Users className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              {t('btn_clients_list')}
            </Button>
          </Link>

          <Link href="/businesses">
            <Button
              variant="outline"
              className="h-10 px-4 text-xs font-bold gap-2 rounded-[20px] border border-slate-200 dark:border-slate-750 bg-white dark:bg-[#181F2B] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-2xs transition-all cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              {t('btn_business_list')}
            </Button>
          </Link>
        </div>
      </div>

      {/* ─── 2. TOP EXECUTIVE 4 SQUIRCLE KPI METRIC CARDS ─── */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Active Clients */}
        <div className="bg-white dark:bg-[#141923] rounded-[26px] p-5 border border-slate-200/80 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {t('kpi_active_clients')}
            </span>
            <div className="w-9 h-9 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
              <Users className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{totalClients}</div>
            <div className="flex items-center justify-between gap-1.5 mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +18.4%
              </span>
              <span>1040: {totalClientsCount} • Biz: {totalBizCount}</span>
            </div>
          </div>
        </div>

        {/* KPI 2: In Preparation */}
        <div className="bg-white dark:bg-[#141923] rounded-[26px] p-5 border border-slate-200/80 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {t('kpi_in_progress_returns')}
            </span>
            <div className="w-9 h-9 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Clock className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{inProgressReturns}</div>
            <div className="flex items-center justify-between gap-1.5 mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="text-amber-600 dark:text-amber-400 font-semibold">
                {statusCounts['Waiting Documents']} {t('kpi_in_progress_sub')}
              </span>
              <span>QA: {statusCounts.Review}</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Completed & E-Filed */}
        <div className="bg-white dark:bg-[#141923] rounded-[26px] p-5 border border-slate-200/80 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              {t('kpi_completed_filed')}
            </span>
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4.5 h-4.5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{completedReturns}</div>
            <div className="flex items-center justify-between gap-1.5 mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 text-[11px]">
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {t('kpi_completed_filed_sub')}
              </span>
              <span className="font-bold text-slate-500 dark:text-slate-400">99.4% IRS</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Financial Fees & Receivables */}
        {isAdmin ? (
          <div className="bg-white dark:bg-[#141923] rounded-[26px] p-5 border border-slate-200/80 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {t('kpi_total_fees')}
              </span>
              <div className="w-9 h-9 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                <DollarSign className="w-4.5 h-4.5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                ${formatCurrency(totalRevenue)}
              </div>
              <div className="flex items-center justify-between gap-1.5 mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 text-[11px]">
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                  ${formatCurrency(Math.max(0, totalRevenue - totalBalance))} {isVi ? 'Đã thu' : 'Paid'}
                </span>
                <span className="text-rose-600 dark:text-rose-400 font-semibold">
                  {t('due_label')} ${formatCurrency(totalBalance)}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#141923] rounded-[26px] p-5 border border-slate-200/80 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                {isVi ? 'HỒ SƠ CẦN XỬ LÝ' : 'PENDING ACTIONS'}
              </span>
              <div className="w-9 h-9 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center">
                <Briefcase className="w-4.5 h-4.5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {statusCounts['Waiting Documents'] + statusCounts['Review']}
              </div>
              <div className="mt-2.5 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400">
                <span>{isVi ? 'Đang đợi tài liệu & kiểm tra QA' : 'Waiting docs & in QA review'}</span>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ─── 3. MAIN WORKSPACE: SQUIRCLE 2-COLUMN STRUCTURE ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ── LEFT PANE: QUICK ACTIONS & TEAM HUB (4 COLS) ── */}
        <section className="lg:col-span-4 space-y-5">
          
          {/* Quick Action Tiles */}
          <div className="bg-white dark:bg-[#141923] rounded-[28px] p-5.5 border border-slate-200/80 dark:border-white/10 shadow-[0_6px_24px_rgba(0,0,0,0.02)]">
            <div className="mb-4">
              <h2 className="text-base font-black text-slate-900 dark:text-white tracking-tight">
                {isVi ? 'Tác Vụ Nhanh' : 'Quick Actions'}
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5">
                {isVi ? 'Truy cập nhanh các nghiệp vụ khai thuế' : 'Fast shortcuts for tax workflow'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => {
                const IconComponent = action.icon;
                return (
                  <Link
                    key={action.id}
                    href={action.href}
                    className={`group flex flex-col items-center justify-center text-center p-3.5 rounded-[22px] border transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-md cursor-pointer ${
                      action.highlight
                        ? 'bg-slate-50 dark:bg-[#181F2B] border-slate-300 dark:border-slate-700'
                        : 'bg-white dark:bg-[#141923] border-slate-200/70 dark:border-slate-800 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center mb-2 group-hover:bg-[#092C5C] group-hover:text-white transition-colors shadow-2xs">
                      <IconComponent className="w-4.5 h-4.5" />
                    </div>
                    <span className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                      {action.title}
                    </span>
                    <span className="text-[10.5px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium">
                      {action.subtitle}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* IRS Status Pill Banner */}
            <div className="mt-4 p-3.5 rounded-[20px] bg-slate-50 dark:bg-[#181F2B] border border-slate-200/70 dark:border-slate-800 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 font-black shadow-2xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-xs font-black text-slate-900 dark:text-white">
                  {isVi ? 'IRS E-File Đang Mở' : 'IRS E-File Active'}
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                  {isVi ? 'Hệ thống tự động đồng bộ trạng thái trực tiếp.' : 'Direct XML transmission online.'}
                </p>
              </div>
            </div>
          </div>

          {/* Preparer Workload */}
          <div className="bg-white dark:bg-[#141923] rounded-[28px] p-5.5 border border-slate-200/80 dark:border-white/10 shadow-[0_6px_24px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white">{t('workload_title')}</h3>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">{t('workload_subtitle')}</p>
              </div>
              <Link href="/team" className="text-xs font-bold text-[#092C5C] dark:text-blue-400 hover:underline">
                {t('manage_team')}
              </Link>
            </div>

            {preparerWorkload.length === 0 || (activeReturns || []).length === 0 ? (
              <div className="text-center py-4 text-slate-400 text-xs">
                <Users className="w-6 h-6 text-slate-300 dark:text-slate-600 mx-auto mb-1.5" />
                <p className="font-bold text-slate-600 dark:text-slate-400 text-xs">
                  {isVi ? 'Chưa có phân công hồ sơ' : 'No staff return assignments'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {preparerWorkload.map((item) => (
                  <div key={item.id} className="p-3 rounded-[18px] bg-slate-50/70 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6.5 h-6.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-[10px] font-black flex items-center justify-center">
                          {item.initials}
                        </span>
                        <div>
                          <span className="text-slate-900 dark:text-white font-bold leading-tight block">{item.name}</span>
                          <span className="text-[10px] text-slate-400">{item.role}</span>
                        </div>
                      </div>
                      <span className="text-slate-700 dark:text-slate-300 font-bold text-xs">
                        {item.count} {isVi ? 'hồ sơ' : 'returns'}
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#092C5C] dark:bg-blue-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${Math.max(item.percentage, item.count > 0 ? 15 : 0)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </section>

        {/* ── RIGHT PANE: WORKFLOW PIPELINE & ACTIVE ENGAGEMENTS (8 COLS) ── */}
        <div className="lg:col-span-8 space-y-5">
          
          {/* ── 3A. UNIFIED WORKFLOW PIPELINE & DEADLINE BAR ── */}
          <section className="bg-white dark:bg-[#141923] rounded-[28px] p-5.5 border border-slate-200/80 dark:border-white/10 shadow-[0_6px_24px_rgba(0,0,0,0.02)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div>
                <h2 className="text-base font-black text-slate-900 dark:text-white">{t('pipeline_title')}</h2>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{t('pipeline_subtitle')}</p>
              </div>
              
              {/* Deadlines compact pill */}
              <div className="flex items-center gap-2 flex-wrap">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[14px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  <span>Sep 15: 1065 / 1120-S (17d)</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[14px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>Oct 15: 1040 Ext (47d)</span>
                </div>
                {selectedStatus !== 'ALL' && (
                  <button
                    onClick={() => setSelectedStatus('ALL')}
                    className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    ✕ {isVi ? 'Hiện tất cả' : 'Show all'}
                  </button>
                )}
              </div>
            </div>

            {/* Clean Segmented Pipeline Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 pt-1">
              {[
                { key: 'Waiting Documents', label: t('stage_waiting_docs'), count: statusCounts['Waiting Documents'] },
                { key: 'In Preparation', label: t('stage_in_prep'), count: statusCounts['In Preparation'] },
                { key: 'Review', label: t('stage_review'), count: statusCounts.Review },
                { key: 'Ready to File', label: t('stage_ready_to_file'), count: statusCounts['Ready to File'] },
                { key: 'Completed', label: t('stage_completed'), count: statusCounts.Completed },
              ].map((stage) => {
                const isActive = selectedStatus === stage.key;
                return (
                  <button
                    key={stage.key}
                    onClick={() => setSelectedStatus(isActive ? 'ALL' : stage.key)}
                    className={`p-3 rounded-[18px] border text-left transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-[#092C5C] text-white border-[#092C5C] shadow-xs scale-102'
                        : 'bg-slate-50 dark:bg-[#181F2B] border-slate-200/80 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-slate-700 dark:text-slate-300'}`}>
                        {stage.label}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10.5px] font-black ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                      }`}>
                        {stage.count}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* ── 3B. ACTIVE ENGAGEMENTS LIST / CARDS (STREAMLINED & UNIFIED) ── */}
          <section className="bg-white dark:bg-[#141923] rounded-[28px] border border-slate-200/80 dark:border-white/10 shadow-[0_6px_24px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
            
            {/* Header with Search, Filter & View Switcher */}
            <header className="p-5 border-b border-slate-200/70 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <h2 className="text-base font-black text-slate-900 dark:text-white">
                  {isVi ? 'Hồ Sơ Đang Thực Hiện' : 'Your Engagements'}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {filteredReturns.length}
                </span>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder={t('search_placeholder')}
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="h-9 pl-9 pr-3 rounded-[14px] border border-slate-200 dark:border-slate-750 text-xs w-36 sm:w-44 bg-slate-50 dark:bg-[#181E29] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </div>

                {/* Filter Type */}
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="h-9 px-3 rounded-[14px] border border-slate-200 dark:border-slate-750 text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-[#181E29] cursor-pointer outline-none"
                >
                  <option value="ALL">{t('filter_all_types')}</option>
                  <option value="Individual">{t('filter_individuals')}</option>
                  <option value="Business">{t('filter_businesses')}</option>
                </select>

                {/* View Switcher */}
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-[14px]">
                  <button
                    onClick={() => setViewMode('cards')}
                    title="Card View"
                    className={`p-1.5 rounded-[10px] text-xs font-bold transition-all cursor-pointer ${
                      viewMode === 'cards'
                        ? 'bg-white dark:bg-[#141923] text-[#092C5C] dark:text-blue-400 shadow-2xs'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    title="Table View"
                    className={`p-1.5 rounded-[10px] text-xs font-bold transition-all cursor-pointer ${
                      viewMode === 'table'
                        ? 'bg-white dark:bg-[#141923] text-[#092C5C] dark:text-blue-400 shadow-2xs'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    <TableIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </header>

            {/* ── CLEAN SQUIRCLE CARDS VIEW ── */}
            {viewMode === 'cards' && (
              <div className="p-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredReturns.map((r, i) => (
                    <div
                      key={r.id || `ret-card-${i}`}
                      className="bg-white dark:bg-[#181F2B] rounded-[24px] p-4.5 border border-slate-200/80 dark:border-slate-800 shadow-2xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between"
                    >
                      {/* Top: Preparer & Form */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-7.5 h-7.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-black flex items-center justify-center shadow-2xs">
                            {r.preparerInitials || 'AT'}
                          </span>
                          <div>
                            <span className="text-xs font-black text-slate-800 dark:text-slate-200 leading-tight block">
                              {r.preparer || 'Amy Tran'}
                            </span>
                            <span className="text-[10px] text-slate-400">{r.updated || 'Today'}</span>
                          </div>
                        </div>

                        <span className="inline-flex px-2.5 py-0.5 rounded-[10px] text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {r.form || 'Form 1040'}
                        </span>
                      </div>

                      {/* Middle: Name & Status */}
                      <div className="my-2">
                        <Link href={r.link || '#'} className="block hover:text-[#092C5C] dark:hover:text-blue-400 transition-colors">
                          <h3 className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-snug">
                            {r.name}
                          </h3>
                        </Link>
                        <span className="text-xs text-slate-400 font-medium">
                          {r.type === 'Business' ? (isVi ? 'Doanh nghiệp' : 'Business') : (isVi ? 'Cá nhân' : 'Individual')} • {r.year}
                        </span>
                      </div>

                      {/* Status Tag */}
                      <div className="my-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            r.status === 'Waiting Documents' ? 'bg-amber-500' :
                            r.status === 'In Preparation' ? 'bg-blue-500' :
                            r.status === 'Review' ? 'bg-purple-500' :
                            r.status === 'Ready to File' ? 'bg-teal-500' : 'bg-emerald-500'
                          }`}></span>
                          {getStatusText(r.status || 'Waiting Documents')}
                        </span>
                      </div>

                      {/* Bottom Fee & Quick Action */}
                      <div className="mt-2.5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                        {isAdmin ? (
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white">${formatCurrency(r.fee)}</span>
                            {safeNumber(r.balance) > 0 ? (
                              <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 ml-1">
                                (Nợ: ${formatCurrency(r.balance)})
                              </span>
                            ) : (
                              <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 ml-1">
                                (Đã thu)
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400 text-xs">Đang hoạt động</span>
                        )}

                        <div className="flex items-center gap-1.5">
                          <a
                            href={`mailto:${r.email || 'client@taxpractice.com'}`}
                            title="Email"
                            className="w-7.5 h-7.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 transition-colors shadow-2xs"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </a>
                          <Link
                            href={r.link || '#'}
                            title="Chi tiết"
                            className="w-7.5 h-7.5 rounded-xl bg-[#092C5C] text-white flex items-center justify-center hover:bg-[#10427D] transition-colors shadow-2xs"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── TABLE VIEW ── */}
            {viewMode === 'table' && (
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse min-w-[650px]">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-900/60 border-b border-slate-200/70 dark:border-slate-800 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">{t('th_client_business')}</th>
                      <th className="py-3 px-3">{t('th_return')}</th>
                      <th className="py-3 px-3">{t('th_tax_year')}</th>
                      <th className="py-3 px-3">{t('th_status')}</th>
                      <th className="py-3 px-3">{t('th_preparer')}</th>
                      {isAdmin && <th className="py-3 px-4 text-right">{t('th_fee_balance')}</th>}
                      <th className="py-3 px-3 text-center">{t('th_action')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-300">
                    {filteredReturns.map((r, i) => (
                      <tr key={r.id || `ret-${i}`} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <Link href={r.link || '#'} className="font-bold text-slate-900 dark:text-white hover:text-blue-600 block">
                            {r.name || 'Unnamed'}
                          </Link>
                        </td>

                        <td className="py-3.5 px-3">
                          <span className="inline-flex px-2 py-0.5 rounded text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {r.form || '1040'}
                          </span>
                        </td>

                        <td className="py-3.5 px-3 font-semibold text-slate-700 dark:text-slate-300">{r.year || '2025'}</td>

                        <td className="py-3.5 px-3">
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              r.status === 'Waiting Documents' ? 'bg-amber-500' :
                              r.status === 'In Preparation' ? 'bg-blue-500' :
                              r.status === 'Review' ? 'bg-purple-500' :
                              r.status === 'Ready to File' ? 'bg-teal-500' : 'bg-emerald-500'
                            }`}></span>
                            {getStatusText(r.status || 'Waiting Documents')}
                          </span>
                        </td>

                        <td className="py-3.5 px-3">
                          <span className="text-xs text-slate-600 dark:text-slate-400">{r.preparer || 'Amy Tran'}</span>
                        </td>

                        {isAdmin && (
                          <td className="py-3.5 px-4 text-right font-bold text-slate-900 dark:text-white">
                            ${formatCurrency(r.fee)}
                          </td>
                        )}

                        <td className="py-3.5 px-3 text-center">
                          <Link href={r.link || '#'}>
                            <Button variant="ghost" size="sm" className="h-8 px-2.5 text-xs font-bold text-[#092C5C] dark:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                              {t('btn_view')} <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {filteredReturns.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-xs">
                <Search className="w-6 h-6 mx-auto mb-1.5 text-slate-300" />
                <p className="font-bold text-slate-700 dark:text-slate-300">
                  {isVi ? 'Không tìm thấy hồ sơ phù hợp' : 'No returns match your filter'}
                </p>
              </div>
            )}

            <footer className="p-4 border-t border-slate-200/70 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
              <span>
                {isVi ? `Hiển thị ${filteredReturns.length} trên ${(activeReturns || []).length} hồ sơ` : `Showing ${filteredReturns.length} of ${(activeReturns || []).length} engagements`}
              </span>
              <Link href="/tax-returns" className="font-bold text-[#092C5C] dark:text-blue-400 hover:underline flex items-center gap-1">
                {isVi ? 'Xem tất cả tờ khai' : 'View all returns'} <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </footer>
          </section>

        </div>
      </div>
    </main>
  );
}
