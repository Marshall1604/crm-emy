'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2,
  Plus,
  Search,
  RotateCcw,
  Download,
  MoreHorizontal,
  ChevronDown,
  UsersRound,
  FileText,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n/language-context';
import { useAuth } from '@/lib/auth/auth-context';
import { useStaffList } from '@/features/team/member-store';
import { CreateBusinessModal } from '@/features/businesses/create-business-modal';

export interface BusinessItem {
  id: string;
  name: string;
  dba?: string;
  ein: string;
  entityType: string;
  returnType: string;
  year: string;
  status: string;
  preparer: string;
  fee: number;
  balance: number;
  phone: string;
  email: string;
  updated: string;
  link: string;
}

const initialBusinesses: BusinessItem[] = [
  {
    id: 'abc-logistics',
    name: 'ABC Logistics LLC',
    dba: 'ABC Freight & Logistics',
    ein: '12-3456789',
    entityType: 'Partnership',
    returnType: 'Form 1065',
    year: '2025',
    status: 'In Preparation',
    preparer: 'Daniel Lee',
    fee: 2400,
    balance: 1200,
    phone: '(415) 555-0138',
    email: 'office@abclogistics.com',
    updated: 'Today, 10:15 AM',
    link: '/businesses/abc-logistics',
  },
  {
    id: 'xyz-tech',
    name: 'XYZ Technology Inc',
    dba: 'XYZ Tech Solutions',
    ein: '94-8273619',
    entityType: 'S Corporation',
    returnType: 'Form 1120-S',
    year: '2025',
    status: 'Waiting Documents',
    preparer: 'Sarah Kim',
    fee: 3100,
    balance: 1550,
    phone: '(408) 555-0199',
    email: 'finance@xyztech.io',
    updated: 'Yesterday',
    link: '/businesses/xyz-tech',
  },
  {
    id: 'luxury-nails',
    name: 'Luxury Nails Studio LLC',
    dba: 'Luxury Nails & Spa',
    ein: '81-9283741',
    entityType: 'Sole Proprietor',
    returnType: 'Schedule C',
    year: '2025',
    status: 'Ready to File',
    preparer: 'Amy Tran',
    fee: 1450,
    balance: 0,
    phone: '(714) 555-0177',
    email: 'luxurynails@example.com',
    updated: 'Aug 27, 2026',
    link: '/businesses/luxury-nails',
  },
  {
    id: 'acme-holdings',
    name: 'ACME Holdings Corp',
    dba: 'ACME Ventures',
    ein: '33-8928172',
    entityType: 'C Corporation',
    returnType: 'Form 1120',
    year: '2024',
    status: 'Completed',
    preparer: 'Sarah Kim',
    fee: 4200,
    balance: 0,
    phone: '(212) 555-0144',
    email: 'acme.tax@example.com',
    updated: 'Aug 20, 2026',
    link: '/businesses/acme-holdings',
  },
  {
    id: 'golden-bakery',
    name: 'Golden State Bakery Inc',
    dba: 'Golden Bakery SF',
    ein: '68-1928374',
    entityType: 'S Corporation',
    returnType: 'Form 1120-S',
    year: '2025',
    status: 'In Preparation',
    preparer: 'Amy Tran',
    fee: 2100,
    balance: 0,
    phone: '(415) 555-0162',
    email: 'info@goldenbakery.com',
    updated: 'Aug 18, 2026',
    link: '/businesses/golden-bakery',
  },
];

export function BusinessesList() {
  const { user, role } = useAuth();
  const { staffNames } = useStaffList();
  const isAdmin = role === 'super_admin' || role === 'admin';
  const { language } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [preparerFilter, setPreparerFilter] = useState('');

  const [businessList, setBusinessList] = useState<BusinessItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const key = user?.id ? `crm_emy_businesses_${user.id}` : 'crm_emy_businesses_list';
        const saved = localStorage.getItem(key);
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (e) {}
    }
    return user ? [] : initialBusinesses;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const key = user?.id ? `crm_emy_businesses_${user.id}` : 'crm_emy_businesses_list';
        const saved = localStorage.getItem(key);
        if (saved) {
          setBusinessList(JSON.parse(saved));
        } else if (user) {
          setBusinessList([]);
        } else {
          setBusinessList(initialBusinesses);
        }
      } catch (e) {}
    }
  }, [user]);

  const handleCreateBusiness = (newBiz: BusinessItem) => {
    const updated = [newBiz, ...businessList];
    setBusinessList(updated);
    if (typeof window !== 'undefined') {
      const key = user?.id ? `crm_emy_businesses_${user.id}` : 'crm_emy_businesses_list';
      localStorage.setItem(key, JSON.stringify(updated));
    }
  };

  const filtered = useMemo(() => {
    return businessList.filter((b) => {
      const matchSearch =
        !search ||
        b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.ein.includes(search) ||
        b.email.toLowerCase().includes(search.toLowerCase());
      const matchYear = !yearFilter || b.year === yearFilter;
      const matchEntity = !entityFilter || b.entityType === entityFilter;
      const matchStatus = !statusFilter || b.status === statusFilter;
      const matchPreparer = !preparerFilter || b.preparer === preparerFilter;
      return matchSearch && matchYear && matchEntity && matchStatus && matchPreparer;
    });
  }, [businessList, search, yearFilter, entityFilter, statusFilter, preparerFilter]);

  const resetFilters = () => {
    setSearch('');
    setYearFilter('');
    setEntityFilter('');
    setStatusFilter('');
    setPreparerFilter('');
  };

  const totalBusinesses = businessList.length;
  const inPrepCount = businessList.filter((b) => b.status === 'In Preparation').length;
  const waitingCount = businessList.filter((b) => b.status === 'Waiting Documents').length;
  const totalBilled = businessList.reduce((s, b) => s + b.fee, 0);

  const statusDisplayMapVi: Record<string, string> = {
    'Waiting Documents': 'Chờ Giấy Tờ',
    'In Preparation': 'Đang Soạn Hồ Sơ',
    'Review': 'Đang Kiểm Tra',
    'Ready to File': 'Sẵn Sàng Nộp',
    'Completed': 'Đã Hoàn Tất',
  };

  const getStatusLabel = (st: string) => {
    if (language === 'vi') return statusDisplayMapVi[st] || st;
    return st;
  };

  const entityTypeMapVi: Record<string, string> = {
    'Partnership': 'Hợp danh (Partnership)',
    'S Corporation': 'Công ty S-Corp',
    'C Corporation': 'Công ty C-Corp',
    'Sole Proprietor': 'Hộ kinh doanh cá thể',
  };

  const getEntityLabel = (et: string) => {
    if (language === 'vi') return entityTypeMapVi[et] || et;
    return et;
  };

  return (
    <main className="p-6 md:p-8 max-w-[1480px] mx-auto space-y-6">
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">{language === 'vi' ? 'Văn Phòng Khai Thuế' : 'Tax Office Practice'}</span>
            <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              {totalBusinesses} {language === 'vi' ? 'Pháp Nhân Đã Đăng Ký' : 'Registered Entities'}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            {language === 'vi' ? 'Khách Hàng Doanh Nghiệp' : 'Business Clients'}
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            {language === 'vi'
              ? 'Quản lý hồ sơ thuế công ty, doanh nghiệp hợp danh (1065, 1120, 1120-S) và phân bổ nhân sự.'
              : 'Manage corporate and partnership tax returns, entity records, and assignments.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/clients">
            <Button variant="outline" className="h-10 text-sm font-semibold gap-1.5 border-slate-300 hover:bg-slate-50 cursor-pointer">
              <UsersRound className="w-4 h-4 text-slate-600" />
              {language === 'vi' ? 'Danh Sách Cá Nhân' : 'Clients List'}
            </Button>
          </Link>
          <Button
            onClick={() => setModalOpen(true)}
            className="h-10 px-4 bg-[#092c5c] hover:bg-[#072247] text-white font-bold text-sm rounded-lg shadow-xs flex items-center gap-2 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'vi' ? 'Thêm Doanh Nghiệp Mới' : 'New Business Client'}</span>
          </Button>
        </div>
      </div>

      {/* 2. KPI SUMMARY CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <article className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{language === 'vi' ? 'Tổng Số Doanh Nghiệp' : 'Total Businesses'}</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{totalBusinesses}</div>
            <div className="text-xs text-slate-500 mt-1">{language === 'vi' ? 'Pháp nhân trong hệ thống' : 'Active tax entities'}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
        </article>

        <article className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{language === 'vi' ? 'Đang Soạn Hồ Sơ' : 'In Preparation'}</span>
            <div className="text-2xl font-black text-blue-700 mt-1">{inPrepCount}</div>
            <div className="text-xs text-blue-600 mt-1">{language === 'vi' ? 'Đang tiến hành khai thuế' : 'Returns in progress'}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </article>

        <article className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{language === 'vi' ? 'Chờ Bổ Sung Giấy Tờ' : 'Waiting Documents'}</span>
            <div className="text-2xl font-black text-amber-700 mt-1">{waitingCount}</div>
            <div className="text-xs text-amber-600 mt-1">{language === 'vi' ? 'Cần khách gửi K-1, P&L' : 'Missing K-1, P&L statements'}</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </article>

        {isAdmin ? (
          <article className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{language === 'vi' ? 'Tổng Phí Khai Thuế' : 'Total Billed Fees'}</span>
              <div className="text-2xl font-black text-emerald-700 mt-1">${totalBilled.toLocaleString()}</div>
              <div className="text-xs text-emerald-600 mt-1">{language === 'vi' ? 'Doanh thu dịch vụ doanh nghiệp' : 'Commercial preparation fees'}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
          </article>
        ) : (
          <article className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{language === 'vi' ? 'Hồ Sơ Đã Hoàn Tất' : 'Completed Returns'}</span>
              <div className="text-2xl font-black text-emerald-700 mt-1">{businessList.filter((b) => b.status === 'Completed').length}</div>
              <div className="text-xs text-emerald-600 mt-1">{language === 'vi' ? 'Doanh nghiệp đã nộp thuế xong' : 'Successfully completed filings'}</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </article>
        )}
      </section>

      {/* 3. FILTERS & SEARCH */}
      <section className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={language === 'vi' ? 'Tìm theo tên công ty, EIN, email...' : 'Search by business name, EIN, email...'}
              className="w-full h-10 pl-10 pr-4 rounded-lg border border-slate-300 bg-slate-50/50 text-sm focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-600"
            >
              <option value="">{language === 'vi' ? 'Tất cả năm thuế' : 'All Tax Years'}</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>

            <select
              value={entityFilter}
              onChange={(e) => setEntityFilter(e.target.value)}
              className="h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-600"
            >
              <option value="">{language === 'vi' ? 'Tất cả loại hình' : 'All Entity Types'}</option>
              <option value="Partnership">Partnership (1065)</option>
              <option value="S Corporation">S Corporation (1120-S)</option>
              <option value="C Corporation">C Corporation (1120)</option>
              <option value="Sole Proprietor">Sole Proprietor (Sched C)</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-600"
            >
              <option value="">{language === 'vi' ? 'Tất cả trạng thái' : 'All Statuses'}</option>
              <option value="Waiting Documents">{language === 'vi' ? 'Chờ Giấy Tờ' : 'Waiting Documents'}</option>
              <option value="In Preparation">{language === 'vi' ? 'Đang Soạn Hồ Sơ' : 'In Preparation'}</option>
              <option value="Ready to File">{language === 'vi' ? 'Sẵn Sàng Nộp' : 'Ready to File'}</option>
              <option value="Completed">{language === 'vi' ? 'Đã Hoàn Tất' : 'Completed'}</option>
            </select>

            <select
              value={preparerFilter}
              onChange={(e) => setPreparerFilter(e.target.value)}
              className="h-10 px-3 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-700 focus:outline-none focus:border-blue-600"
            >
              <option value="">{language === 'vi' ? 'Tất cả nhân viên' : 'All Preparers'}</option>
              {staffNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {(search || yearFilter || entityFilter || statusFilter || preparerFilter) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-10 text-xs font-semibold text-slate-500 hover:text-slate-800 gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === 'vi' ? 'Đặt lại' : 'Reset'}</span>
            </Button>
          )}
        </div>
      </section>

      {/* 4. BUSINESS TABLE CARD */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <header className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">{language === 'vi' ? 'Danh Sách Doanh Nghiệp Đăng Ký' : 'Registered Businesses'}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                {filtered.length}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{language === 'vi' ? 'Nhấp vào công ty để mở trang quản lý chi tiết hồ sơ' : 'Click any business to open their engagement dashboard'}</p>
          </div>

          <Button variant="outline" size="sm" className="h-9 text-xs font-semibold gap-1.5 cursor-pointer">
            <Download className="w-3.5 h-3.5" />
            {language === 'vi' ? 'Xuất Excel' : 'Export Excel'}
          </Button>
        </header>

        {filtered.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <Building2 className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              {language === 'vi' ? 'Chưa có doanh nghiệp nào' : 'No businesses yet'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              {language === 'vi'
                ? 'Bắt đầu quản lý hồ sơ thuế công ty, doanh nghiệp hợp danh (1065, 1120, 1120-S).'
                : 'Get started by adding your first corporate or partnership tax client.'}
            </p>
            <Button
              onClick={() => setModalOpen(true)}
              className="h-9 px-4 bg-[#092c5c] text-white font-bold text-xs rounded-xl shadow-xs gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{language === 'vi' ? 'Thêm Doanh Nghiệp Đầu Tiên' : 'Add First Business'}</span>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">{language === 'vi' ? 'TÊN DOANH NGHIỆP & DBA' : 'BUSINESS NAME & DBA'}</th>
                  <th className="py-3.5 px-3">{language === 'vi' ? 'MÃ SỐ EIN' : 'EIN'}</th>
                  <th className="py-3.5 px-3">{language === 'vi' ? 'LOẠI HÌNH / TỜ KHAI' : 'ENTITY / FORM'}</th>
                  <th className="py-3.5 px-3">{language === 'vi' ? 'NĂM THUẾ' : 'TAX YEAR'}</th>
                  <th className="py-3.5 px-3">{language === 'vi' ? 'TRẠNG THÁI' : 'STATUS'}</th>
                  <th className="py-3.5 px-3">{language === 'vi' ? 'NHÂN VIÊN PHỤ TRÁCH' : 'ASSIGNED STAFF'}</th>
                  {isAdmin && <th className="py-3.5 px-4 text-right">{language === 'vi' ? 'PHÍ / CÒN NỢ' : 'FEE / BALANCE'}</th>}
                  <th className="py-3.5 px-3 text-center">{language === 'vi' ? 'THAO TÁC' : 'ACTION'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 px-4">
                      <Link href={`/businesses/${b.id}`} className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#092c5c] to-blue-800 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                          {b.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-blue-700 text-[14px]">
                            {b.name}
                          </div>
                          {b.dba && <div className="text-xs text-slate-500">{b.dba}</div>}
                        </div>
                      </Link>
                    </td>

                    <td className="py-4 px-3 font-mono text-xs text-slate-600 font-semibold">{b.ein}</td>

                    <td className="py-4 px-3">
                      <div className="font-semibold text-slate-800 text-xs">{getEntityLabel(b.entityType)}</div>
                      <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {b.returnType}
                      </span>
                    </td>

                    <td className="py-4 px-3 font-bold text-slate-900">{b.year}</td>

                    <td className="py-4 px-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                          b.status === 'Waiting Documents'
                            ? 'bg-amber-100 text-amber-800'
                            : b.status === 'In Preparation'
                            ? 'bg-blue-100 text-blue-800'
                            : b.status === 'Ready to File'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            b.status === 'Waiting Documents'
                              ? 'bg-amber-600'
                              : b.status === 'In Preparation'
                              ? 'bg-blue-600'
                              : b.status === 'Ready to File'
                              ? 'bg-indigo-600'
                              : 'bg-emerald-600'
                          }`}
                        ></span>
                        {getStatusLabel(b.status)}
                      </span>
                    </td>

                    <td className="py-4 px-3">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold flex items-center justify-center border border-slate-200">
                          {b.preparer
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </span>
                        <span className="text-xs font-medium text-slate-700">{b.preparer}</span>
                      </div>
                    </td>

                    {isAdmin && (
                      <td className="py-4 px-4 text-right">
                        <div className="font-bold text-slate-900 text-xs">${b.fee.toLocaleString()}</div>
                        {b.balance > 0 ? (
                          <div className="text-[11px] font-semibold text-rose-600">
                            {language === 'vi' ? 'Còn nợ:' : 'Due:'} ${b.balance.toLocaleString()}
                          </div>
                        ) : (
                          <div className="text-[11px] font-semibold text-emerald-600">{language === 'vi' ? 'Đã thanh toán đủ' : 'Paid'}</div>
                        )}
                      </td>
                    )}

                    <td className="py-4 px-3 text-center">
                      <Link href={`/businesses/${b.id}`}>
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:bg-blue-50 cursor-pointer">
                          {language === 'vi' ? 'Chi Tiết →' : 'View →'}
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* CREATE BUSINESS MODAL */}
      <CreateBusinessModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onBusinessCreated={handleCreateBusiness}
      />
    </main>
  );
}
