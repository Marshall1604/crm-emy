'use client';
import * as XLSX from 'xlsx';

import Link from 'next/link';
import { useMemo, useState, useEffect, useRef } from 'react';
import {
  AlertTriangle,
  Building2,
  Check,
  CheckCircle2,
  CheckSquare,
  ChevronDown,
  Clock,
  DollarSign,
  Download,
  ExternalLink,
  FileSpreadsheet,
  FileText,
  MoreHorizontal,
  Plus,
  RotateCcw,
  Search,
  Square,
  Trash2,
  TrendingUp,
  UsersRound,
  X,
} from 'lucide-react';
import {
  fetchClientsFromSupabase,
  saveClientToSupabase,
  deleteClientFromSupabase,
} from '@/lib/supabase/sync-service';
import { isSupabaseConfigured } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n/language-context';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { CreateClientModal, type ClientRecord } from './create-client-modal';

const defaultSampleClients: ClientRecord[] = [
  {
    id: 'minh-nguyen',
    name: 'Minh Nguyen',        initials: 'MN',   updated: 'Aug 29, 2026',
    firstName: 'Minh',          lastName: 'Nguyen', middleName: '',
    ssn: '714-55-1234',         dob: '1985-03-14',  filingStatus: 'single',
    phone: '(714) 555-0184',    email: 'minh.nguyen@example.com',
    address: '123 Bolsa Ave',   city: 'Westminster', state: 'CA', zip: '92683',
    spouseFirstName: '', spouseLastName: '', spouseSsn: '', spouseDob: '',
    year: '2026', returnType: '1040', status: 'Waiting Documents', staff: 'Amy Tran',
    federalTax: 3200, fee: 650, amountPaid: 325, balance: 325,
    stateTaxes: [{ state: 'CA', amount: 980 }],
    dependents: [],
    notes: 'Awaiting W-2 and 1099-INT from client.',
  },
  {
    id: 'olivia-johnson',
    name: 'Olivia Johnson',     initials: 'OJ',   updated: 'Aug 28, 2026',
    firstName: 'Olivia',        lastName: 'Johnson', middleName: 'R',
    ssn: '415-22-5678',         dob: '1979-07-22',   filingStatus: 'head_of_household',
    phone: '(415) 555-0128',    email: 'olivia.j@example.com',
    address: '456 Market St',   city: 'San Francisco', state: 'CA', zip: '94102',
    spouseFirstName: '', spouseLastName: '', spouseSsn: '', spouseDob: '',
    year: '2025', returnType: '1040', status: 'Review', staff: 'Daniel Lee',
    federalTax: 5100, fee: 875, amountPaid: 875, balance: 0,
    stateTaxes: [{ state: 'CA', amount: 1540 }],
    dependents: [
      { fullName: 'Emma Johnson', ssn: '415-22-0001', dob: '2010-05-12', relationship: 'Child', phone: '', address: '' },
    ],
    notes: '',
  },
  {
    id: 'kevin-mai-tran',
    name: 'Kevin & Mai Tran',   initials: 'KT',   updated: 'Aug 27, 2026',
    firstName: 'Kevin',         lastName: 'Tran',  middleName: '',
    ssn: '408-33-9012',         dob: '1981-11-05',  filingStatus: 'married_jointly',
    phone: '(408) 555-0192',    email: 'ktran@example.com',
    address: '789 El Camino Real', city: 'Sunnyvale', state: 'CA', zip: '94087',
    spouseFirstName: 'Mai', spouseLastName: 'Tran', spouseSsn: '408-33-9013', spouseDob: '1983-04-18',
    year: '2026', returnType: '1040', status: 'In Preparation', staff: 'Sarah Kim',
    federalTax: 7800, fee: 720, amountPaid: 500, balance: 220,
    stateTaxes: [{ state: 'CA', amount: 2100 }],
    dependents: [
      { fullName: 'Tommy Tran',  ssn: '408-33-0001', dob: '2015-08-20', relationship: 'Child', phone: '', address: '' },
      { fullName: 'Lily Tran',   ssn: '408-33-0002', dob: '2018-03-11', relationship: 'Child', phone: '', address: '' },
    ],
    notes: 'Both spouses have W-2. Kevin has side income from consulting.',
  },
  {
    id: 'michael-brown',
    name: 'Michael Brown',      initials: 'MB',   updated: 'Aug 26, 2026',
    firstName: 'Michael',       lastName: 'Brown', middleName: 'T',
    ssn: '212-44-3456',         dob: '1990-09-30',  filingStatus: 'single',
    phone: '(212) 555-0166',    email: 'michael.b@example.com',
    address: '321 Park Ave',    city: 'New York', state: 'NY', zip: '10016',
    spouseFirstName: '', spouseLastName: '', spouseSsn: '', spouseDob: '',
    year: '2026', returnType: '1040-NR', status: 'New', staff: 'Amy Tran',
    federalTax: 0, fee: 950, amountPaid: 0, balance: 950,
    stateTaxes: [{ state: 'NY', amount: 0 }],
    dependents: [],
    notes: 'Nonresident alien on F-1 visa.',
  },
  {
    id: 'sophia-garcia',
    name: 'Sophia Garcia',      initials: 'SG',   updated: 'Aug 25, 2026',
    firstName: 'Sophia',        lastName: 'Garcia', middleName: 'L',
    ssn: '305-66-7890',         dob: '1987-12-03',  filingStatus: 'single',
    phone: '(305) 555-0144',    email: 'sophia.g@example.com',
    address: '888 Brickell Ave', city: 'Miami', state: 'FL', zip: '33131',
    spouseFirstName: '', spouseLastName: '', spouseSsn: '', spouseDob: '',
    year: '2025', returnType: '1040', status: 'Completed', staff: 'Sarah Kim',
    federalTax: 4400, fee: 600, amountPaid: 600, balance: 0,
    stateTaxes: [],
    dependents: [],
    notes: 'Return accepted by IRS on Aug 25.',
  },
];

const returnTypes = ['1040', '1040-SR', '1040-NR', 'Schedule C'];
const statuses = [
  'New',
  'Waiting Documents',
  'Documents Received',
  'In Preparation',
  'Missing Information',
  'Review',
  'Signature Pending',
  'Ready to File',
  'E-Filed',
  'Accepted',
  'Completed',
];

const LOCAL_STORAGE_KEY = 'crm_emy_clients_list';

export function ClientsList() {
  const [clientList, setClientList] = useState<ClientRecord[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch (err) {
        console.error('Failed to load clients from localStorage:', err);
      }
    }
    return defaultSampleClients;
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [year, setYear] = useState('');
  const [returnTypeFilter, setReturnTypeFilter] = useState('');
  const [status, setStatus] = useState('');
  const [staff, setStaff] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<{ mode: 'single' | 'batch'; client?: ClientRecord } | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    let isMounted = true;
    async function loadFromSupabase() {
      if (isSupabaseConfigured) {
        try {
          const remoteClients = await fetchClientsFromSupabase();
          if (isMounted && remoteClients && remoteClients.length > 0) {
            setClientList(remoteClients);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(remoteClients));
          }
        } catch (err) {
          console.warn('Could not sync with Supabase, using local data:', err);
        }
      }
    }
    loadFromSupabase();
    return () => {
      isMounted = false;
    };
  }, []);

  const saveClients = (newList: ClientRecord[]) => {
    setClientList(newList);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newList));
    }
  };

  const filtered = useMemo(
    () =>
      clientList.filter(
        (c) =>
          (!search ||
            c.name.toLowerCase().includes(search.toLowerCase()) ||
            c.email.toLowerCase().includes(search.toLowerCase()) ||
            c.phone.includes(search) ||
            (c.ssn && c.ssn.includes(search))) &&
          (!year || c.year === year) &&
          (!returnTypeFilter || c.returnType === returnTypeFilter) &&
          (!status || c.status === status) &&
          (!staff || c.staff === staff)
      ),
    [clientList, search, year, returnTypeFilter, status, staff]
  );

  const reset = () => {
    setSearch('');
    setYear('');
    setReturnTypeFilter('');
    setStatus('');
    setStaff('');
  };

  const handleClientCreated = async (newClient: ClientRecord) => {
    const updated = [newClient, ...clientList];
    saveClients(updated);
    if (isSupabaseConfigured) {
      try {
        await saveClientToSupabase(newClient);
      } catch (err) {
        console.error('Failed to sync new client to Supabase:', err);
      }
    }
  };

  const restoreDefaultSample = () => {
    saveClients(defaultSampleClients);
    setSelectedIds(new Set());
  };

  const toggleSelectAll = () => {
    const filteredIds = filtered.map((c) => c.id);
    const allSelected = filteredIds.length > 0 && filteredIds.every((id) => selectedIds.has(id));
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredIds));
    }
  };

  const toggleSelectOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const openDeleteSingle = (client: ClientRecord) => {
    setActiveMenuId(null);
    setDeleteTarget({ mode: 'single', client });
  };

  const openDeleteBatch = () => {
    setDeleteTarget({ mode: 'batch' });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    if (deleteTarget.mode === 'single' && deleteTarget.client) {
      const targetId = deleteTarget.client.id;
      const updated = clientList.filter((c) => c.id !== targetId);
      saveClients(updated);
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(targetId);
        return next;
      });
      if (isSupabaseConfigured) {
        try {
          await deleteClientFromSupabase(targetId);
        } catch (err) {
          console.error('Failed to delete from Supabase:', err);
        }
      }
    } else if (deleteTarget.mode === 'batch') {
      const idsToDelete = Array.from(selectedIds);
      const updated = clientList.filter((c) => !selectedIds.has(c.id));
      saveClients(updated);
      setSelectedIds(new Set());
      if (isSupabaseConfigured) {
        for (const id of idsToDelete) {
          try {
            await deleteClientFromSupabase(id);
          } catch (err) {
            console.error('Failed to delete from Supabase:', err);
          }
        }
      }
    }

    setDeleteTarget(null);
  };

  const allFilteredSelected = filtered.length > 0 && filtered.every((c) => selectedIds.has(c.id));
  const someFilteredSelected = filtered.some((c) => selectedIds.has(c.id)) && !allFilteredSelected;

  const exportToExcel = () => {
    const dataToExport = selectedIds.size > 0 ? filtered.filter((c) => selectedIds.has(c.id)) : filtered;
    if (dataToExport.length === 0) return;

    const rows = dataToExport.map((c) => ({
      'Client ID': c.id,
      'Full Name': c.name,
      'Phone': c.phone,
      'Email': c.email,
      'SSN/ITIN': c.ssn,
      'Date of Birth': c.dob,
      'Filing Status': c.filingStatus,
      'Address': `${c.address}, ${c.city}, ${c.state} ${c.zip}`,
      'Tax Year': c.year,
      'Return Type': c.returnType,
      'Status': c.status,
      'Assigned Staff': c.staff,
      'Federal Tax ($)': c.federalTax,
      'Preparation Fee ($)': c.fee,
      'Amount Paid ($)': c.amountPaid,
      'Balance Due ($)': c.balance,
      'Last Updated': c.updated,
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Clients');
    const date = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `CRM-EMY-Clients-${date}.xlsx`);
  };

  const { language } = useLanguage();
  const totalClients = clientList.length;
  const inPrepCount = clientList.filter((c) => c.status === 'In Preparation').length;
  const waitingCount = clientList.filter((c) => c.status === 'Waiting Documents').length;
  const totalBilled = clientList.reduce((s, c) => s + c.fee, 0);

  const statusDisplayMapVi: Record<string, string> = {
    'Waiting Documents': 'Chờ Giấy Tờ',
    'In Preparation': 'Đang Soạn Hồ Sơ',
    'Review': 'Đang Kiểm Tra',
    'Ready to File': 'Sẵn Sàng Nộp',
    'Completed': 'Đã Hoàn Tất',
    'New': 'Mới Tạo',
    'Missing Information': 'Thiếu Thông Tin',
  };

  const getStatusLabel = (st: string) => {
    if (language === 'vi') return statusDisplayMapVi[st] || st;
    return st;
  };

  const filingStatusMapVi: Record<string, string> = {
    'single': 'Độc thân',
    'married_jointly': 'Vợ chồng khai chung',
    'married_separately': 'Vợ chồng khai riêng',
    'head_of_household': 'Chủ hộ gia đình',
    'qualifying_surviving_spouse': 'Góa phụ có người phụ thuộc',
  };

  const getFilingStatusLabel = (fs: string) => {
    if (language === 'vi') return filingStatusMapVi[fs] || fs.replace('_', ' ');
    return fs.replace('_', ' ');
  };

  return (
    <main className="p-6 md:p-8 max-w-[1480px] mx-auto space-y-6">
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">{language === 'vi' ? 'Văn Phòng Khai Thuế' : 'Tax Office Practice'}</span>
            <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              {totalClients} {language === 'vi' ? 'Khách Hàng Đã Đăng Ký' : 'Registered Taxpayers'}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            {language === 'vi' ? 'Khách Hàng Cá Nhân' : 'Individual Clients'}
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            {language === 'vi' ? 'Quản lý người nộp thuế cá nhân, hồ sơ khai thuế hàng năm (Form 1040) và tiến độ xử lý.' : 'Manage individual taxpayers, annual return engagements, and filing records.'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/businesses">
            <Button
              variant="outline"
              className="h-10 px-4 text-sm font-bold gap-2 border-slate-300 bg-white hover:bg-slate-50 hover:border-blue-400 text-slate-800 shadow-xs cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-[#092c5c]" />
              {language === 'vi' ? 'Danh Sách Doanh Nghiệp' : 'Business List'}
            </Button>
          </Link>

          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="h-10 text-sm font-bold gap-2 bg-[#092c5c] hover:bg-[#072247] text-white shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            {language === 'vi' ? 'Thêm Khách Hàng' : 'Add Client'}
          </Button>
        </div>
      </div>

      {/* 2. STATS ROW (4 KPI CARDS) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{language === 'vi' ? 'TỔNG KHÁCH HÀNG' : 'Total Clients'}</span>
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <UsersRound className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-3">{totalClients}</div>
          <p className="text-xs text-slate-500 font-medium mt-1">{language === 'vi' ? 'Người nộp thuế cá nhân' : 'Individual Taxpayers'}</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{language === 'vi' ? 'ĐANG SOẠN HỒ SƠ' : 'In Preparation'}</span>
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-3">{inPrepCount}</div>
          <p className="text-xs text-slate-500 font-medium mt-1">{language === 'vi' ? 'Hồ sơ đang xử lý' : 'Active return workflows'}</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{language === 'vi' ? 'CHỜ BỔ SUNG GIẤY TỜ' : 'Waiting Documents'}</span>
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-3">{waitingCount}</div>
          <p className="text-xs text-amber-700 font-semibold mt-1">{language === 'vi' ? 'Đang chờ W-2 / 1099' : 'Pending W-2s / 1099s'}</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">{language === 'vi' ? 'TỔNG PHÍ ĐÃ LẬP HÓA ĐƠN' : 'Total Billed Fees'}</span>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-3">${totalBilled.toLocaleString()}</div>
          <p className="text-xs text-emerald-700 font-semibold mt-1">{language === 'vi' ? 'Hồ sơ thuế cá nhân' : 'Individual tax returns'}</p>
        </div>
      </div>

      {/* 3. FILTER BAR */}
      <section className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder={language === 'vi' ? 'Tìm kiếm tên khách, điện thoại, email, SSN...' : 'Search client name, phone, email, SSN...'}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-blue-500 bg-slate-50/50"
          />
        </div>

        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="h-10 px-3 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 bg-white cursor-pointer outline-none"
        >
          <option value="">{language === 'vi' ? 'Tất cả năm thuế' : 'All Tax Years'}</option>
          <option value="2026">2026</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
        </select>

        <select
          value={returnTypeFilter}
          onChange={(e) => setReturnTypeFilter(e.target.value)}
          className="h-10 px-3 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 bg-white cursor-pointer outline-none"
        >
          <option value="">{language === 'vi' ? 'Tất cả loại tờ khai' : 'All Return Types'}</option>
          {returnTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-10 px-3 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 bg-white cursor-pointer outline-none"
        >
          <option value="">{language === 'vi' ? 'Tất cả trạng thái' : 'All Statuses'}</option>
          {statuses.map((s) => (
            <option key={s} value={s}>
              {getStatusLabel(s)}
            </option>
          ))}
        </select>

        <select
          value={staff}
          onChange={(e) => setStaff(e.target.value)}
          className="h-10 px-3 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 bg-white cursor-pointer outline-none"
        >
          <option value="">{language === 'vi' ? 'Tất cả nhân viên' : 'All Preparers'}</option>
          <option value="Amy Tran">Amy Tran</option>
          <option value="Daniel Lee">Daniel Lee</option>
          <option value="Sarah Kim">Sarah Kim</option>
        </select>

        <Button variant="ghost" size="sm" onClick={reset} className="h-10 text-slate-600 gap-1.5 cursor-pointer">
          <RotateCcw className="w-3.5 h-3.5" />
          {language === 'vi' ? 'Đặt lại' : 'Reset'}
        </Button>
      </section>

      {/* 4. CLIENTS TABLE CARD */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {selectedIds.size > 0 ? (
          <div className="h-12 px-5 bg-rose-50/80 border-b border-rose-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-rose-900">
                {language === 'vi' ? `Đã chọn ${selectedIds.size} trên tổng số ${clientList.length} khách hàng` : `Selected ${selectedIds.size} of ${clientList.length} clients`}
              </span>
              <button
                type="button"
                onClick={() => setSelectedIds(new Set())}
                className="px-2 py-1 rounded bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
              >
                <X className="w-3 h-3" />
                {language === 'vi' ? 'Bỏ chọn' : 'Deselect'}
              </button>
            </div>

            <Button
              variant="destructive"
              size="sm"
              onClick={openDeleteBatch}
              className="h-8 px-3 text-xs font-bold gap-1.5 bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {language === 'vi' ? `Xóa (${selectedIds.size}) mục đã chọn` : `Delete (${selectedIds.size}) Selected`}
            </Button>
          </div>
        ) : (
          <header className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">{language === 'vi' ? 'Danh Sách Khách Hàng Cá Nhân' : 'Individual Tax Clients'}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                  {filtered.length}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{language === 'vi' ? 'Nhấp vào khách hàng để xem chi tiết lịch sử và hồ sơ' : 'Click any client to open their return history and records'}</p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={exportToExcel}
              disabled={filtered.length === 0}
              className="h-9 text-xs font-semibold gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              {language === 'vi' ? 'Xuất Excel' : 'Export Excel'}
            </Button>
          </header>
        )}

        <div className="overflow-x-auto" ref={menuRef}>
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-3 w-10 text-center">
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    className="p-1 rounded hover:bg-slate-200/50 cursor-pointer inline-flex items-center justify-center text-slate-500"
                    title={allFilteredSelected ? 'Deselect all' : 'Select all'}
                    aria-label="Select all rows"
                  >
                    {allFilteredSelected ? (
                      <CheckSquare className="w-4 h-4 text-[#092c5c]" />
                    ) : someFilteredSelected ? (
                      <Square className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Square className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                </th>
                <th className="py-3.5 px-3">{language === 'vi' ? 'TÊN KHÁCH HÀNG' : 'CLIENT NAME'}</th>
                <th className="py-3.5 px-3">{language === 'vi' ? 'LIÊN HỆ' : 'CONTACT'}</th>
                <th className="py-3.5 px-3">{language === 'vi' ? 'NĂM THUẾ' : 'TAX YEAR'}</th>
                <th className="py-3.5 px-3">{language === 'vi' ? 'MẪU TỜ KHAI' : 'RETURN TYPE'}</th>
                <th className="py-3.5 px-3">{language === 'vi' ? 'TRẠNG THÁI' : 'STATUS'}</th>
                <th className="py-3.5 px-3">{language === 'vi' ? 'NHÂN VIÊN PHỤ TRÁCH' : 'ASSIGNED STAFF'}</th>
                <th className="py-3.5 px-4 text-right">{language === 'vi' ? 'PHÍ / CÒN NỢ' : 'FEE / BALANCE'}</th>
                <th className="py-3.5 px-3 text-center w-12">{language === 'vi' ? 'THAO TÁC' : 'ACTIONS'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {filtered.map((c) => {
                const isSelected = selectedIds.has(c.id);
                const isMenuOpen = activeMenuId === c.id;

                return (
                  <tr
                    key={c.id}
                    className={`transition-colors ${isSelected ? 'bg-slate-50/90' : 'hover:bg-slate-50/70'}`}
                  >
                    <td className="py-3.5 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => toggleSelectOne(c.id)}
                        className="p-1 rounded hover:bg-slate-200/50 cursor-pointer inline-flex items-center justify-center"
                        aria-label={`Select ${c.name}`}
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-[#092c5c]" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300" />
                        )}
                      </button>
                    </td>

                    <td className="py-3.5 px-3">
                      <Link href={`/clients/${c.id}`} className="flex items-center gap-3 group">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-800 font-extrabold text-xs flex items-center justify-center shrink-0 border border-blue-100">
                          {c.initials}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 group-hover:text-blue-700 text-[13.5px]">
                            {c.name}
                          </div>
                          <div className="text-[11px] text-slate-500">{getFilingStatusLabel(c.filingStatus)}</div>
                        </div>
                      </Link>
                    </td>

                    <td className="py-3.5 px-3">
                      <div className="text-xs font-semibold text-slate-800">{c.phone}</div>
                      <div className="text-[11px] text-slate-500">{c.email}</div>
                    </td>

                    <td className="py-3.5 px-3 font-bold text-slate-900">{c.year}</td>

                    <td className="py-3.5 px-3">
                      <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {c.returnType}
                      </span>
                    </td>

                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                          c.status === 'Waiting Documents' || c.status === 'Missing Information'
                            ? 'bg-amber-100 text-amber-800'
                            : c.status === 'In Preparation'
                            ? 'bg-blue-100 text-blue-800'
                            : c.status === 'Review'
                            ? 'bg-purple-100 text-purple-800'
                            : c.status === 'Ready to File'
                            ? 'bg-indigo-100 text-indigo-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            c.status === 'Waiting Documents' || c.status === 'Missing Information'
                              ? 'bg-amber-600'
                              : c.status === 'In Preparation'
                              ? 'bg-blue-600'
                              : c.status === 'Review'
                              ? 'bg-purple-600'
                              : c.status === 'Ready to File'
                              ? 'bg-indigo-600'
                              : 'bg-emerald-600'
                          }`}
                        ></span>
                        {getStatusLabel(c.status)}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 font-medium text-slate-700">{c.staff}</td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="font-bold text-slate-900 text-xs">${c.fee.toLocaleString()}</div>
                      {c.balance > 0 ? (
                        <div className="text-[11px] font-semibold text-rose-600">
                          {language === 'vi' ? 'Còn nợ:' : 'Due:'} ${c.balance.toLocaleString()}
                        </div>
                      ) : (
                        <div className="text-[11px] font-semibold text-emerald-600">{language === 'vi' ? 'Đã thu đủ' : 'Paid in full'}</div>
                      )}
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <div className="relative inline-block">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setActiveMenuId(isMenuOpen ? null : c.id)}
                          className="h-8 w-8 text-slate-500 hover:text-slate-900 cursor-pointer"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>

                        {isMenuOpen && (
                          <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-lg shadow-lg py-1 z-30 text-xs">
                            <Link
                              href={`/clients/${c.id}`}
                              className="w-full px-3 py-1.5 text-left text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                              onClick={() => setActiveMenuId(null)}
                            >
                              <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
                              {language === 'vi' ? 'Mở hồ sơ' : 'Open Record'}
                            </Link>
                            <button
                              type="button"
                              onClick={() => openDeleteSingle(c)}
                              className="w-full px-3 py-1.5 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2 cursor-pointer font-semibold"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              {language === 'vi' ? 'Xóa khách này' : 'Delete'}
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {!filtered.length && (
            <div className="p-10 text-center text-slate-500">
              <div className="w-12 h-12 rounded-xl bg-slate-100 inline-flex items-center justify-center mb-3 text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">{language === 'vi' ? 'Không tìm thấy khách hàng' : 'No clients found'}</h3>
              <p className="text-xs text-slate-500 mb-4">
                {clientList.length === 0
                  ? 'No clients currently exist. Click "+ Add Client" to create your first client record.'
                  : 'Try changing or resetting your filters.'}
              </p>
              {clientList.length === 0 && (
                <Button
                  size="sm"
                  onClick={() => setIsAddModalOpen(true)}
                  className="gap-1.5 text-xs bg-[#092c5c] text-white hover:bg-[#072247]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Client
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Add Client Modal */}
      <CreateClientModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onClientCreated={handleClientCreated}
      />

      {/* Delete Confirmation Modal */}
      <Dialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <DialogContent className="max-w-md p-6 rounded-2xl bg-white">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <DialogTitle className="text-lg font-bold text-slate-900">
              {deleteTarget?.mode === 'single'
                ? `Delete ${deleteTarget.client?.name}?`
                : `Delete ${selectedIds.size} clients?`}
            </DialogTitle>

            <DialogDescription className="text-xs text-slate-500 max-w-xs">
              {deleteTarget?.mode === 'single'
                ? 'This client and their associated tax records will be permanently removed.'
                : 'All selected clients and their associated tax records will be permanently deleted.'}
            </DialogDescription>

            <div className="flex items-center gap-3 w-full justify-end mt-4 pt-2 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteTarget(null)}
                className="h-9 px-4 text-xs font-semibold"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={confirmDelete}
                className="h-9 px-4 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white"
              >
                Confirm Delete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
