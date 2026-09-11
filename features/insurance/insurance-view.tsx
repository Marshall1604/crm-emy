'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Plus,
  Search,
  Download,
  Clock,
  Sparkles,
  DollarSign,
  User,
  Phone,
  Calendar,
  MapPin,
  Building2,
  FileText,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  UsersRound,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n/language-context';
import { useAuth } from '@/lib/auth/auth-context';
import { useStaffList } from '@/features/team/member-store';
import {
  InsuranceClient,
  InsuranceStatus,
  InsuranceType,
  calculateAge,
  formatInsuranceStatus,
  formatInsuranceType,
} from './insurance-types';
import { CreateInsuranceModal } from './create-insurance-modal';
import { EditInsuranceModal } from './edit-insurance-modal';
import { ProFeaturePaywall } from '@/components/pro-feature-paywall';

export function InsuranceServicesView() {
  const { language } = useLanguage();
  const { user, role, subscription } = useAuth();
  const { staffNames } = useStaffList();

  const isPro =
    subscription?.plan === 'monthly' ||
    subscription?.plan === 'yearly' ||
    subscription?.plan === 'lifetime' ||
    role === 'super_admin' ||
    role === 'admin';

  const [clients, setClients] = useState<InsuranceClient[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [staffFilter, setStaffFilter] = useState<string>('all');

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedClientForEdit, setSelectedClientForEdit] = useState<InsuranceClient | null>(null);

  // Load clients from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const key = user?.id ? `crm_emy_insurance_${user.id}` : 'crm_emy_insurance_list';
        const saved = localStorage.getItem(key);
        if (saved) {
          setClients(JSON.parse(saved));
        } else {
          setClients([]);
        }
      } catch (e) {
        console.error('Error loading insurance clients:', e);
      }
    }
  }, [user]);

  // Persist clients to localStorage
  const saveClients = (newClients: InsuranceClient[]) => {
    setClients(newClients);
    if (typeof window !== 'undefined') {
      try {
        const key = user?.id ? `crm_emy_insurance_${user.id}` : 'crm_emy_insurance_list';
        localStorage.setItem(key, JSON.stringify(newClients));
      } catch (e) {
        console.error('Error saving insurance clients:', e);
      }
    }
  };

  const handleAddClient = (newClient: InsuranceClient) => {
    const updated = [newClient, ...clients];
    saveClients(updated);
  };

  const handleUpdateClient = (updatedClient: InsuranceClient) => {
    const updated = clients.map((c) => (c.id === updatedClient.id ? updatedClient : c));
    saveClients(updated);
  };

  const handleDeleteClient = (id: string) => {
    const updated = clients.filter((c) => c.id !== id);
    saveClients(updated);
  };

  // Filter & Search Logic
  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.fullName.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q) ||
        (c.carrier && c.carrier.toLowerCase().includes(q)) ||
        (c.planName && c.planName.toLowerCase().includes(q)) ||
        (c.zipCode && c.zipCode.includes(q)) ||
        (c.state && c.state.toLowerCase().includes(q));

      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      const matchesType = typeFilter === 'all' || c.insuranceType === typeFilter;
      const matchesStaff = staffFilter === 'all' || c.assignedStaff === staffFilter;

      return matchesSearch && matchesStatus && matchesType && matchesStaff;
    });
  }, [clients, searchQuery, statusFilter, typeFilter, staffFilter]);

  // KPI Calculations
  const totalCount = clients.length;
  const inConsultationCount = clients.filter((c) => c.status === 'Đang tư vấn').length;
  const inActiveServiceCount = clients.filter((c) => c.status === 'Đang phục vụ').length;
  const followUpDueCount = clients.filter((c) => {
    if (!c.nextFollowUpDate) return false;
    const target = new Date(c.nextFollowUpDate);
    const today = new Date();
    // Due within 30 days or overdue
    const diffDays = (target.getTime() - today.getTime()) / (1000 * 3600 * 24);
    return diffDays <= 30;
  }).length;

  // Export CSV
  const handleExportCSV = () => {
    if (clients.length === 0) {
      alert('Chưa có dữ liệu để xuất Excel/CSV.');
      return;
    }
    const headers = [
      'Mã Hồ Sơ',
      'Họ và Tên',
      'Số Điện Thoại',
      'Ngày Sinh',
      'Bang',
      'ZIP Code',
      'Trạng Thái',
      'Nhân Viên Phụ Trách',
      'Hãng Bảo Hiểm',
      'Loại Bảo Hiểm',
      'Tên Gói',
      'Ngày Hiệu Lực',
      'Ngày Liên Hệ Tiếp Theo',
      'Ghi Chú',
    ];
    const rows = filteredClients.map((c) => [
      `"${c.id}"`,
      `"${c.fullName}"`,
      `"${c.phone}"`,
      `"${c.dob || ''}"`,
      `"${c.state || ''}"`,
      `"${c.zipCode || ''}"`,
      `"${c.status}"`,
      `"${c.assignedStaff}"`,
      `"${c.carrier || ''}"`,
      `"${c.insuranceType || ''}"`,
      `"${c.planName || ''}"`,
      `"${c.effectiveDate || ''}"`,
      `"${c.nextFollowUpDate || ''}"`,
      `"${(c.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Insurance_Clients_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: InsuranceStatus) => {
    switch (status) {
      case 'Mới':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Đang tư vấn':
        return 'bg-amber-50 text-amber-850 border-amber-300';
      case 'Đang phục vụ':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Ngừng chăm sóc':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 max-w-[1850px] w-full mx-auto p-4 sm:p-6 md:p-8 pb-12 relative min-h-[85vh]">
      {/* Pro Soft Paywall Overlay */}
      {!isPro && (
        <ProFeaturePaywall
          featureNameVi="Phân Hệ Quản Lý Bảo Hiểm (Insurance Services)"
          featureNameEn="Insurance Services Pro Module"
          featureDescriptionVi="Quản lý khách hàng bảo hiểm Medicare, ACA (Obamacare), Life Policy, theo dõi tái tục và lịch hẹn chăm sóc chuyên nghiệp."
          featureDescriptionEn="Manage Medicare, ACA (Obamacare), and Life Policy client portfolios with automated renewal tracking."
          icon={<Shield className="w-7 h-7 text-slate-950 fill-amber-300" />}
        />
      )}

      {/* 1. HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">
              {language === 'vi' ? 'Dịch Vụ & Sản Phẩm Mở Rộng' : 'Extended Office Services'}
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
              <Sparkles className="w-3 h-3 text-blue-600" />
              {language === 'vi' ? 'Dịch Vụ Bảo Hiểm' : 'Insurance Module'}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Shield className="w-7 h-7 text-[#092c5c]" />
            <span>Insurance Services</span>
            <span className="text-xs font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
              Pro
            </span>
          </h1>

          <p className="text-sm text-slate-600 mt-1">
            {language === 'vi'
              ? 'Quản lý thông tin khách hàng, gói bảo hiểm Medicare/ACA/Life, hãng bảo hiểm và lịch nhắc chăm sóc định kỳ.'
              : 'Manage customer identity, Medicare/ACA/Life policy details, carriers, and follow-up schedules.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportCSV}
            className="text-xs font-bold border-slate-300 gap-1.5 bg-white shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            {language === 'vi' ? 'Xuất Excel / CSV' : 'Export Excel / CSV'}
          </Button>

          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-[#092c5c] hover:bg-[#072247] text-white font-bold text-xs gap-1.5 shadow-sm px-4 h-9 rounded-xl cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {language === 'vi' ? 'Thêm Hồ Sơ Khách Hàng' : '+ Add Client'}
          </Button>
        </div>
      </div>

      {/* 2. KPI SUMMARY METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">
              {language === 'vi' ? 'Tổng Hồ Sơ Bảo Hiểm' : 'TOTAL CLIENTS'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <UsersRound className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">{totalCount}</div>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'vi' ? 'Tổng số khách hàng trong hệ thống' : 'Total clients registered'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">
              {language === 'vi' ? 'Đang Tư Vấn' : 'IN CONSULTATION'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">{inConsultationCount}</div>
          <p className="text-xs text-amber-700 font-semibold mt-1">
            {language === 'vi' ? 'Khách hàng đang trong quá trình tư vấn' : 'Prospects currently in review'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">
              {language === 'vi' ? 'Đang Phục Vụ' : 'ACTIVE SERVICE'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">{inActiveServiceCount}</div>
          <p className="text-xs text-emerald-700 font-semibold mt-1">
            {language === 'vi' ? 'Hợp đồng đang có hiệu lực' : 'Active covered policyholders'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase">
              {language === 'vi' ? 'Cần Chăm Sóc / Tái Tục' : 'FOLLOW-UP DUE'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 mt-2">{followUpDueCount}</div>
          <p className="text-xs text-rose-700 font-semibold mt-1">
            {language === 'vi' ? 'Lịch hẹn liên hệ trong 30 ngày' : 'Outreach scheduled within 30 days'}
          </p>
        </div>
      </div>

      {/* 3. FILTER & SEARCH CONTROLS */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={
              language === 'vi'
                ? 'Tìm theo tên, điện thoại, hãng bảo hiểm, tên gói, ZIP code...'
                : 'Search by client name, phone, carrier, plan, ZIP...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-9 pr-4 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-500 bg-slate-50/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-800 focus:outline-none focus:border-blue-500"
          >
            <option value="all">{language === 'vi' ? 'Tất cả trạng thái' : 'All Statuses'}</option>
            <option value="Mới">{language === 'vi' ? 'Mới' : 'New'}</option>
            <option value="Đang tư vấn">{language === 'vi' ? 'Đang tư vấn' : 'In Consultation'}</option>
            <option value="Đang phục vụ">{language === 'vi' ? 'Đang phục vụ' : 'Active Service'}</option>
            <option value="Ngừng chăm sóc">{language === 'vi' ? 'Ngừng chăm sóc' : 'Inactive / Paused'}</option>
          </select>

          {/* Policy Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium bg-white text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="all">{language === 'vi' ? 'Tất cả loại bảo hiểm' : 'All Insurance Types'}</option>
            <option value="Medicare Advantage">Medicare Advantage</option>
            <option value="Original Medicare">Original Medicare</option>
            <option value="Medigap">Medigap</option>
            <option value="Part D">Part D</option>
            <option value="ACA (Obamacare)">ACA (Obamacare)</option>
            <option value="Life Insurance">Life Insurance</option>
            <option value="Khác">{language === 'vi' ? 'Khác' : 'Other'}</option>
          </select>

          {/* Staff Filter */}
          <select
            value={staffFilter}
            onChange={(e) => setStaffFilter(e.target.value)}
            className="h-10 px-3 rounded-xl border border-slate-200 text-xs font-medium bg-white text-slate-700 focus:outline-none focus:border-blue-500"
          >
            <option value="all">{language === 'vi' ? 'Tất cả nhân viên' : 'All Staff'}</option>
            {staffNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. MAIN TABLE LIST */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900">
              {language === 'vi' ? 'Danh Sách Hồ Sơ Khách Hàng Bảo Hiểm' : 'Insurance Client Records'}
            </h3>
            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              {language === 'vi' ? `${filteredClients.length} hồ sơ` : `${filteredClients.length} records`}
            </span>
          </div>
        </div>

        {filteredClients.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-700 mx-auto flex items-center justify-center border border-blue-100 shadow-inner">
              <Shield className="w-8 h-8 text-[#092c5c]" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-base font-black text-slate-900">
                {searchQuery || statusFilter !== 'all' || typeFilter !== 'all' || staffFilter !== 'all'
                  ? language === 'vi'
                    ? 'Không tìm thấy hồ sơ phù hợp'
                    : 'No matching client records found'
                  : language === 'vi'
                  ? 'Chưa có hồ sơ khách hàng bảo hiểm nào'
                  : 'No insurance clients added yet'}
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                {searchQuery || statusFilter !== 'all' || typeFilter !== 'all' || staffFilter !== 'all'
                  ? language === 'vi'
                    ? 'Vui lòng thử tìm kiếm bằng từ khóa khác hoặc xóa bộ lọc.'
                    : 'Please try searching with different keywords or clear filters.'
                  : language === 'vi'
                  ? 'Bắt đầu quản lý khách hàng bảo hiểm bằng cách thêm hồ sơ đầu tiên với đầy đủ 12 trường thông tin.'
                  : 'Start managing insurance clients by adding the first client profile with all 12 fields.'}
              </p>
            </div>

            <div className="pt-2">
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-[#092c5c] hover:bg-[#072247] text-white font-bold text-xs gap-1.5 shadow-sm px-5 h-10 rounded-xl cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                {language === 'vi' ? 'Thêm Hồ Sơ Đầu Tiên' : 'Add First Client'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">{language === 'vi' ? 'Họ và Tên / Ngày Sinh' : 'Full Name / DOB'}</th>
                  <th className="py-3.5 px-3">{language === 'vi' ? 'Điện Thoại / Bang' : 'Phone / State'}</th>
                  <th className="py-3.5 px-3">{language === 'vi' ? 'Trạng Thái' : 'Status'}</th>
                  <th className="py-3.5 px-3">{language === 'vi' ? 'Nhân Viên Phụ Trách' : 'Assigned Staff'}</th>
                  <th className="py-3.5 px-3">{language === 'vi' ? 'Hãng / Loại Bảo Hiểm' : 'Carrier / Type'}</th>
                  <th className="py-3.5 px-3">{language === 'vi' ? 'Tên Gói / Hiệu Lực' : 'Plan Name / Effective'}</th>
                  <th className="py-3.5 px-3">{language === 'vi' ? 'Liên Hệ Tiếp Theo' : 'Next Follow-up'}</th>
                  <th className="py-3.5 px-4 text-right">{language === 'vi' ? 'Thao Tác' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredClients.map((client) => {
                  const age = calculateAge(client.dob);
                  return (
                    <tr
                      key={client.id}
                      onClick={() => setSelectedClientForEdit(client)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    >
                      {/* 1. Họ và tên + Ngày sinh (DOB + Tuổi) */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 text-[13px]">
                          {client.fullName}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5 font-mono">
                          {client.dob ? (
                            <span>
                              {client.dob} {age !== null && `(${age} ${language === 'vi' ? 'tuổi' : 'yrs'})`}
                            </span>
                          ) : (
                            <span className="text-slate-400">{language === 'vi' ? 'Chưa có DOB' : 'No DOB'}</span>
                          )}
                        </div>
                      </td>

                      {/* 2. Điện thoại + Bang, ZIP Code */}
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-slate-900 font-mono text-[12px]">
                          {client.phone || '—'}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {client.state ? `${client.state}` : ''}
                          {client.zipCode ? ` · ${client.zipCode}` : ''}
                        </div>
                      </td>

                      {/* 3. Trạng thái */}
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-bold border ${getStatusBadge(
                            client.status as InsuranceStatus
                          )}`}
                        >
                          {formatInsuranceStatus(client.status, language)}
                        </span>
                      </td>

                      {/* 4. Nhân viên phụ trách */}
                      <td className="py-3.5 px-3 font-semibold text-slate-900">
                        {client.assignedStaff}
                      </td>

                      {/* 5. Hãng bảo hiểm + Loại bảo hiểm */}
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900 text-[12px]">
                          {client.carrier || (language === 'vi' ? 'Chưa cập nhật hãng' : 'No carrier')}
                        </div>
                        <div className="text-[11px] text-blue-700 font-medium mt-0.5">
                          {client.insuranceType ? formatInsuranceType(client.insuranceType, language) : '—'}
                        </div>
                      </td>

                      {/* 6. Tên gói + Ngày hiệu lực */}
                      <td className="py-3.5 px-3 max-w-[200px]">
                        <div className="font-medium text-slate-800 truncate text-[12px]" title={client.planName}>
                          {client.planName || '—'}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5 font-mono">
                          {client.effectiveDate
                            ? `${language === 'vi' ? 'HL' : 'Eff'}: ${client.effectiveDate}`
                            : language === 'vi'
                            ? 'Chưa có ngày HL'
                            : 'No eff. date'}
                        </div>
                      </td>

                      {/* 7. Ngày liên hệ tiếp theo + Ghi chú */}
                      <td className="py-3.5 px-3">
                        {client.nextFollowUpDate ? (
                          <div className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>{client.nextFollowUpDate}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">{language === 'vi' ? 'Chưa hẹn' : 'Not scheduled'}</span>
                        )}
                        {client.notes && (
                          <p className="text-[11px] text-slate-500 truncate max-w-[180px] mt-0.5" title={client.notes}>
                            📝 {client.notes}
                          </p>
                        )}
                      </td>

                      {/* 8. Thao tác */}
                      <td className="py-3.5 px-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedClientForEdit(client);
                          }}
                          className="h-8 px-2.5 text-xs text-blue-700 hover:text-blue-900 hover:bg-blue-50 rounded-lg cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5 mr-1" />
                          {language === 'vi' ? 'Sửa' : 'Edit'}
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      <CreateInsuranceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleAddClient}
      />

      {/* Edit Modal */}
      <EditInsuranceModal
        client={selectedClientForEdit}
        isOpen={!!selectedClientForEdit}
        onClose={() => setSelectedClientForEdit(null)}
        onUpdate={handleUpdateClient}
        onDelete={handleDeleteClient}
      />
    </div>
  );
}

