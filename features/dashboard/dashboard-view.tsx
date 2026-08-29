'use client';

import React, { useState, useMemo } from 'react';
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
  RefreshCw,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n/language-context';

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
    link: '/businesses',
    updated: 'Yesterday',
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
    link: '/businesses',
    updated: 'Aug 27, 2026',
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
  },
];

export function DashboardView() {
  const { t, language } = useLanguage();
  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  const statusLabels: Record<string, { en: string; vi: string }> = {
    'Waiting Documents': { en: 'Waiting Docs', vi: 'Chờ Giấy Tờ' },
    'In Preparation': { en: 'In Preparation', vi: 'Đang Soạn Hồ Sơ' },
    Review: { en: 'Review', vi: 'Đang Kiểm Tra' },
    'Ready to File': { en: 'Ready to File', vi: 'Sẵn Sàng Nộp' },
    Completed: { en: 'Completed', vi: 'Đã Hoàn Tất' },
    'E-Filed': { en: 'E-Filed', vi: 'Đã Nộp IRS' },
  };

  const getStatusText = (status: string) => {
    return language === 'vi' ? (statusLabels[status]?.vi || status) : (statusLabels[status]?.en || status);
  };

  const filteredReturns = useMemo(() => {
    return initialReturns.filter((item) => {
      const matchesSearch =
        search === '' ||
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.preparer.toLowerCase().includes(search.toLowerCase()) ||
        item.form.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = selectedStatus === 'ALL' || item.status === selectedStatus;
      const matchesType = selectedType === 'ALL' || item.type === selectedType;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [search, selectedStatus, selectedType]);

  const totalClients = 8;
  const inProgressReturns = initialReturns.filter((r) => r.status !== 'Completed').length;
  const completedReturns = initialReturns.filter((r) => r.status === 'Completed').length;
  const totalRevenue = initialReturns.reduce((sum, r) => sum + r.fee, 0);
  const totalBalance = initialReturns.reduce((sum, r) => sum + r.balance, 0);

  const statusCounts = {
    'Waiting Documents': initialReturns.filter((r) => r.status === 'Waiting Documents').length,
    'In Preparation': initialReturns.filter((r) => r.status === 'In Preparation').length,
    Review: initialReturns.filter((r) => r.status === 'Review').length,
    'Ready to File': initialReturns.filter((r) => r.status === 'Ready to File').length,
    Completed: initialReturns.filter((r) => r.status === 'Completed').length,
  };

  return (
    <main className="p-6 md:p-8 max-w-[1480px] mx-auto space-y-7">
      {/* 1. TOP HEADER & GREETING */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">{t('tax_crm_workspace')}</span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {t('live_sync_active')}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            {t('dashboard_title')}
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            {t('dashboard_subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/clients">
            <Button
              variant="outline"
              className="h-10 px-4 text-sm font-bold gap-2 border-slate-300 bg-white hover:bg-slate-50 hover:border-blue-400 text-slate-800 shadow-xs cursor-pointer"
            >
              <Users className="w-4 h-4 text-blue-700" />
              {t('btn_clients_list')}
            </Button>
          </Link>

          <Link href="/businesses">
            <Button
              variant="outline"
              className="h-10 px-4 text-sm font-bold gap-2 border-slate-300 bg-white hover:bg-slate-50 hover:border-blue-400 text-slate-800 shadow-xs cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-[#092c5c]" />
              {t('btn_business_list')}
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. EXECUTIVE METRIC KPI CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
        {/* Total Clients */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('kpi_active_clients')}</span>
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900">{totalClients}</div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-700">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{t('kpi_active_clients_sub')}</span>
            </div>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('kpi_in_progress_returns')}</span>
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900">{inProgressReturns}</div>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>{statusCounts['Waiting Documents']} {t('kpi_in_progress_sub')}</span>
            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('kpi_completed_filed')}</span>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900">{completedReturns}</div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-700">
              <Check className="w-3.5 h-3.5" />
              <span>{t('kpi_completed_filed_sub')}</span>
            </div>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{t('kpi_total_fees')}</span>
            <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-3xl font-extrabold text-slate-900">${totalRevenue.toLocaleString()}</div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-rose-600">
              <span>{t('kpi_unpaid_balance')} ${totalBalance.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WORKFLOW PIPELINE INTERACTIVE STATUS BAR */}
      <section className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">{t('pipeline_title')}</h2>
            <p className="text-xs text-slate-500">{t('pipeline_subtitle')}</p>
          </div>
          {selectedStatus !== 'ALL' && (
            <button
              onClick={() => setSelectedStatus('ALL')}
              className="text-xs font-semibold text-blue-700 hover:text-blue-900 cursor-pointer self-start sm:self-auto"
            >
              {language === 'vi' ? 'Bỏ lọc (Hiện tất cả)' : 'Clear filter (Show All)'}
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {/* Waiting Documents */}
          <button
            onClick={() => setSelectedStatus(selectedStatus === 'Waiting Documents' ? 'ALL' : 'Waiting Documents')}
            className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
              selectedStatus === 'Waiting Documents'
                ? 'bg-amber-100 border-amber-400 ring-2 ring-amber-400/30'
                : 'bg-amber-50/70 border-amber-200 hover:bg-amber-100/70'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-900">{t('stage_waiting_docs')}</span>
              <span className="px-2 py-0.5 rounded-md text-xs font-extrabold bg-amber-200/80 text-amber-900">
                {statusCounts['Waiting Documents']}
              </span>
            </div>
            <p className="text-[11px] text-amber-700/90 mt-1 font-medium">{t('stage_waiting_docs_desc')}</p>
          </button>

          {/* In Preparation */}
          <button
            onClick={() => setSelectedStatus(selectedStatus === 'In Preparation' ? 'ALL' : 'In Preparation')}
            className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
              selectedStatus === 'In Preparation'
                ? 'bg-blue-100 border-blue-400 ring-2 ring-blue-400/30'
                : 'bg-blue-50/70 border-blue-200 hover:bg-blue-100/70'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900">{t('stage_in_prep')}</span>
              <span className="px-2 py-0.5 rounded-md text-xs font-extrabold bg-blue-200/80 text-blue-900">
                {statusCounts['In Preparation']}
              </span>
            </div>
            <p className="text-[11px] text-blue-700/90 mt-1 font-medium">{t('stage_in_prep_desc')}</p>
          </button>

          {/* Review */}
          <button
            onClick={() => setSelectedStatus(selectedStatus === 'Review' ? 'ALL' : 'Review')}
            className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
              selectedStatus === 'Review'
                ? 'bg-purple-100 border-purple-400 ring-2 ring-purple-400/30'
                : 'bg-purple-50/70 border-purple-200 hover:bg-purple-100/70'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-purple-900">{t('stage_review')}</span>
              <span className="px-2 py-0.5 rounded-md text-xs font-extrabold bg-purple-200/80 text-purple-900">
                {statusCounts.Review}
              </span>
            </div>
            <p className="text-[11px] text-purple-700/90 mt-1 font-medium">{t('stage_review_desc')}</p>
          </button>

          {/* Ready to File */}
          <button
            onClick={() => setSelectedStatus(selectedStatus === 'Ready to File' ? 'ALL' : 'Ready to File')}
            className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
              selectedStatus === 'Ready to File'
                ? 'bg-indigo-100 border-indigo-400 ring-2 ring-indigo-400/30'
                : 'bg-indigo-50/70 border-indigo-200 hover:bg-indigo-100/70'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-900">{t('stage_ready_to_file')}</span>
              <span className="px-2 py-0.5 rounded-md text-xs font-extrabold bg-indigo-200/80 text-indigo-900">
                {statusCounts['Ready to File']}
              </span>
            </div>
            <p className="text-[11px] text-indigo-700/90 mt-1 font-medium">{t('stage_ready_to_file_desc')}</p>
          </button>

          {/* Completed */}
          <button
            onClick={() => setSelectedStatus(selectedStatus === 'Completed' ? 'ALL' : 'Completed')}
            className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
              selectedStatus === 'Completed'
                ? 'bg-emerald-100 border-emerald-400 ring-2 ring-emerald-400/30'
                : 'bg-emerald-50/70 border-emerald-200 hover:bg-emerald-100/70'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-900">{t('stage_completed')}</span>
              <span className="px-2 py-0.5 rounded-md text-xs font-extrabold bg-emerald-200/80 text-emerald-900">
                {statusCounts.Completed}
              </span>
            </div>
            <p className="text-[11px] text-emerald-700/90 mt-1 font-medium">{t('stage_completed_desc')}</p>
          </button>
        </div>
      </section>

      {/* 4. MAIN CONTENT: 2-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: ACTIVE ENGAGEMENTS TABLE (2 Cols) */}
        <section className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
          <header className="p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">{t('table_active_returns')}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                  {filteredReturns.length}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{t('table_subtitle')}</p>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder={t('search_placeholder')}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-9 pl-9 pr-3 rounded-lg border border-slate-300 text-xs w-44 sm:w-52 focus:outline-none focus:border-blue-500"
                />
              </div>

              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="h-9 px-2.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 bg-white cursor-pointer outline-none"
              >
                <option value="ALL">{t('filter_all_types')}</option>
                <option value="Individual">{t('filter_individuals')}</option>
                <option value="Business">{t('filter_businesses')}</option>
              </select>
            </div>
          </header>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">{t('th_client_business')}</th>
                  <th className="py-3 px-3">{t('th_return')}</th>
                  <th className="py-3 px-3">{t('th_tax_year')}</th>
                  <th className="py-3 px-3">{t('th_status')}</th>
                  <th className="py-3 px-3">{t('th_preparer')}</th>
                  <th className="py-3 px-4 text-right">{t('th_fee_balance')}</th>
                  <th className="py-3 px-3 text-center">{t('th_action')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filteredReturns.map((r, i) => (
                  <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <Link href={r.link} className="flex items-center gap-3 group">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                            r.type === 'Business'
                              ? 'bg-gradient-to-br from-navy to-blue-800 text-white'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {r.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-blue-700 text-[13.5px]">
                            {r.name}
                          </div>
                          <div className="text-xs text-slate-500 font-medium">{r.type === 'Business' ? (language === 'vi' ? 'Doanh nghiệp' : 'Business') : (language === 'vi' ? 'Cá nhân' : 'Individual')}</div>
                        </div>
                      </Link>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {r.form}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 font-semibold text-slate-800">{r.year}</td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                          r.status === 'Waiting Documents'
                            ? 'bg-amber-100 text-amber-800'
                            : r.status === 'In Preparation'
                            ? 'bg-blue-100 text-blue-800'
                            : r.status === 'Review'
                            ? 'bg-purple-100 text-purple-800'
                            : r.status === 'Ready to File'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            r.status === 'Waiting Documents'
                              ? 'bg-amber-600'
                              : r.status === 'In Preparation'
                              ? 'bg-blue-600'
                              : r.status === 'Review'
                              ? 'bg-purple-600'
                              : r.status === 'Ready to File'
                              ? 'bg-indigo-600'
                              : 'bg-emerald-600'
                          }`}
                        ></span>
                        {getStatusText(r.status)}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center justify-center border border-slate-200">
                          {r.preparerInitials}
                        </span>
                        <span className="text-xs font-medium text-slate-700">{r.preparer}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="font-bold text-slate-900 text-xs">${r.fee.toLocaleString()}</div>
                      {r.balance > 0 ? (
                        <div className="text-[11px] font-semibold text-rose-600">
                          {t('due_label')} ${r.balance.toLocaleString()}
                        </div>
                      ) : (
                        <div className="text-[11px] font-semibold text-emerald-600">{t('paid_in_full')}</div>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <Link href={r.link}>
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-blue-700 hover:text-blue-900">
                          {t('btn_view')} <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredReturns.length === 0 && (
              <div className="p-8 text-center text-slate-500">
                <Search className="w-8 h-8 mx-auto mb-2 text-slate-400" />
                <p className="text-sm font-semibold">{language === 'vi' ? 'Không tìm thấy hồ sơ phù hợp' : 'No returns match your filter'}</p>
                <p className="text-xs mt-1">{language === 'vi' ? 'Hãy thử thay đổi từ khóa hoặc bộ lọc.' : 'Try changing your search term or filter options.'}</p>
              </div>
            )}
          </div>

          <footer className="p-4 border-t border-slate-200 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
            <span>{language === 'vi' ? `Hiển thị ${filteredReturns.length} trên ${initialReturns.length} hồ sơ` : `Showing ${filteredReturns.length} of ${initialReturns.length} engagements`}</span>
            <Link href="/tax-returns" className="font-bold text-blue-700 hover:text-blue-900 flex items-center gap-1">
              {language === 'vi' ? 'Xem chi tiết tất cả tờ khai' : 'View all returns in detail'} <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </footer>
        </section>

        {/* RIGHT COLUMN: TAX DEADLINES & TEAM SUMMARY (1 Col) */}
        <div className="space-y-6">
          {/* DEADLINES CARD */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{t('deadlines_title')}</h3>
                  <p className="text-[11px] text-slate-500">{t('deadlines_subtitle')}</p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                {t('deadline_critical')}
              </span>
            </div>

            <div className="space-y-3">
              {/* Deadline 1 */}
              <div className="flex items-start gap-3 p-3 rounded-lg border border-rose-100 bg-rose-50/40">
                <div className="w-11 h-11 rounded-md bg-white border border-rose-200 flex flex-col items-center justify-center shrink-0 text-rose-700">
                  <span className="text-[10px] font-extrabold uppercase leading-none">Sep</span>
                  <span className="text-base font-extrabold leading-none mt-0.5">15</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900">{t('deadline_1_title')}</div>
                  <p className="text-[11px] text-slate-600 mt-0.5">{t('deadline_1_desc')}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold text-rose-700">
                    ⏳ 17 {t('days_remaining')}
                  </span>
                </div>
              </div>

              {/* Deadline 2 */}
              <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50/60">
                <div className="w-11 h-11 rounded-md bg-white border border-slate-300 flex flex-col items-center justify-center shrink-0 text-slate-700">
                  <span className="text-[10px] font-extrabold uppercase leading-none">Oct</span>
                  <span className="text-base font-extrabold leading-none mt-0.5">15</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-slate-900">{t('deadline_2_title')}</div>
                  <p className="text-[11px] text-slate-600 mt-0.5">{t('deadline_2_desc')}</p>
                  <span className="inline-block mt-1 text-[10px] font-semibold text-slate-500">
                    47 {t('days_remaining')}
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* PREPARER WORKLOAD */}
          <section className="bg-white rounded-xl border border-slate-200 shadow-xs p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{t('workload_title')}</h3>
                <p className="text-[11px] text-slate-500">{t('workload_subtitle')}</p>
              </div>
              <Link href="/team" className="text-xs font-semibold text-blue-700 hover:text-blue-900">
                {t('manage_team')}
              </Link>
            </div>

            <div className="space-y-3.5">
              {/* Amy Tran */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold flex items-center justify-center">
                      AT
                    </span>
                    <span className="text-slate-800 font-bold">Amy Tran</span>
                    <span className="text-[10px] text-slate-400">(Admin)</span>
                  </div>
                  <span className="text-slate-600">3 returns</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#092c5c] h-full rounded-full" style={{ width: '60%' }}></div>
                </div>
              </div>

              {/* Daniel Lee */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold flex items-center justify-center">
                      DL
                    </span>
                    <span className="text-slate-800 font-bold">Daniel Lee</span>
                    <span className="text-[10px] text-slate-400">(Preparer)</span>
                  </div>
                  <span className="text-slate-600">2 returns</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-purple-600 h-full rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>

              {/* Sarah Kim */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold flex items-center justify-center">
                      SK
                    </span>
                    <span className="text-slate-800 font-bold">Sarah Kim</span>
                    <span className="text-[10px] text-slate-400">(Reviewer)</span>
                  </div>
                  <span className="text-slate-600">2 returns</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: '40%' }}></div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
