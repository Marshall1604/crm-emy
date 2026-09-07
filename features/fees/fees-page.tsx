'use client';

import React, { useMemo, useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Banknote,
  ChevronDown,
  CircleCheckBig,
  CircleDollarSign,
  ReceiptText,
  RotateCcw,
  WalletCards,
  UsersRound,
  Building2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n/language-context';
import { useAuth } from '@/lib/auth/auth-context';

type PaymentStatus = 'Unpaid' | 'Partial' | 'Paid';
type FeeRecord = {
  taxReturnId: string;
  clientRecord: string;
  name: string;
  clientType: 'Individual' | 'Business';
  year: string;
  returnType: string;
  totalFee: number;
  amountPaid: number;
  invoiceStatus: 'Not Sent' | 'Sent' | 'Overdue' | 'Paid';
};

const defaultSampleFeeRecords: FeeRecord[] = [
  { taxReturnId: 'tr-minh-2025', clientRecord: '/clients/minh-nguyen', name: 'Minh Nguyen', clientType: 'Individual', year: '2025', returnType: '1040', totalFee: 650, amountPaid: 325, invoiceStatus: 'Sent' },
  { taxReturnId: 'tr-abc-2025', clientRecord: '/businesses/abc-logistics', name: 'ABC Logistics LLC', clientType: 'Business', year: '2025', returnType: '1065', totalFee: 2400, amountPaid: 1200, invoiceStatus: 'Sent' },
  { taxReturnId: 'tr-olivia-2025', clientRecord: '/clients/olivia-johnson', name: 'Olivia Johnson', clientType: 'Individual', year: '2025', returnType: '1040', totalFee: 875, amountPaid: 875, invoiceStatus: 'Paid' },
  { taxReturnId: 'tr-xyz-2025', clientRecord: '/businesses/xyz-tech', name: 'XYZ Technology Inc', clientType: 'Business', year: '2025', returnType: '1120-S', totalFee: 3100, amountPaid: 1550, invoiceStatus: 'Overdue' },
  { taxReturnId: 'tr-nails-2025', clientRecord: '/businesses/luxury-nails', name: 'Luxury Nails Studio LLC', clientType: 'Business', year: '2025', returnType: 'Schedule C', totalFee: 1450, amountPaid: 1450, invoiceStatus: 'Paid' },
  { taxReturnId: 'tr-acme-2024', clientRecord: '/businesses/acme-holdings', name: 'ACME Holdings Corp', clientType: 'Business', year: '2024', returnType: '1120', totalFee: 4200, amountPaid: 0, invoiceStatus: 'Not Sent' },
];

const balanceOf = (record: FeeRecord) => Math.max(0, record.totalFee - record.amountPaid);
const paymentStatusOf = (record: FeeRecord): PaymentStatus =>
  record.amountPaid <= 0 ? 'Unpaid' : balanceOf(record) <= 0 ? 'Paid' : 'Partial';
const money = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

export function FeesPage() {
  const { user, role } = useAuth();
  const { language } = useLanguage();
  const [year, setYear] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');

  const isAdmin = role === 'super_admin' || role === 'admin';

  const [feeRecords, setFeeRecords] = useState<FeeRecord[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const clientKey = user?.id ? `crm_emy_clients_${user.id}` : 'crm_emy_clients_list';
        const bizKey = user?.id ? `crm_emy_businesses_${user.id}` : 'crm_emy_businesses_list';
        const savedClients = localStorage.getItem(clientKey);
        const savedBiz = localStorage.getItem(bizKey);

        const clients = savedClients ? JSON.parse(savedClients) : [];
        const businesses = savedBiz ? JSON.parse(savedBiz) : [];

        const combined: FeeRecord[] = [
          ...businesses.map((b: any) => ({
            taxReturnId: `tr-${b.id}`,
            clientRecord: `/businesses/${b.id}`,
            name: b.name,
            clientType: 'Business' as const,
            year: b.year || '2025',
            returnType: b.returnType || 'Form 1065',
            totalFee: Number(b.fee || 0),
            amountPaid: Number(b.fee || 0) - Number(b.balance || 0),
            invoiceStatus: (Number(b.balance || 0) === 0 ? 'Paid' : 'Sent') as FeeRecord['invoiceStatus'],
          })),
          ...clients.map((c: any) => ({
            taxReturnId: `tr-${c.id}`,
            clientRecord: `/clients/${c.id}`,
            name: c.name,
            clientType: 'Individual' as const,
            year: c.year || '2025',
            returnType: c.returnType || 'Form 1040',
            totalFee: Number(c.fee || 0),
            amountPaid: Number(c.amountPaid || 0),
            invoiceStatus: (Number(c.balance || 0) === 0 ? 'Paid' : 'Sent') as FeeRecord['invoiceStatus'],
          })),
        ];

        if (combined.length > 0) return combined;
        if (user) return [];
      } catch (e) {}
    }
    return user ? [] : defaultSampleFeeRecords;
  });

  const filtered = useMemo(
    () =>
      feeRecords.filter(
        (record) =>
          (!year || record.year === year) &&
          (!status || paymentStatusOf(record) === status) &&
          (!type || record.clientType === type)
      ),
    [feeRecords, year, status, type]
  );

  const totals = useMemo(
    () =>
      filtered.reduce(
        (sum, record) => ({
          fees: sum.fees + record.totalFee,
          paid: sum.paid + record.amountPaid,
          balance: sum.balance + balanceOf(record),
          paidCount: sum.paidCount + (paymentStatusOf(record) === 'Paid' ? 1 : 0),
        }),
        { fees: 0, paid: 0, balance: 0, paidCount: 0 }
      ),
    [filtered]
  );

  const reset = () => {
    setYear('');
    setStatus('');
    setType('');
  };

  if (!isAdmin) {
    return (
      <main className="route-page p-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-xs mt-8">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <span className="text-2xl font-black">🔒</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">
            {language === 'vi' ? 'Giới Hạn Quyền Truy Cập Biểu Phí' : 'Access Restricted'}
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
            {language === 'vi'
              ? 'Trang quản lý doanh thu, biểu phí và công nợ chỉ dành riêng cho Quản Trị Viên / Chủ Văn Phòng (Admin). Tài khoản nhân viên khai thuế không có quyền truy cập.'
              : 'Billing, revenue, and fee analytics are restricted to Practice Admins. Staff and preparer accounts cannot access this section.'}
          </p>
          <Link href="/dashboard">
            <Button className="bg-[#092c5c] text-white hover:bg-[#072247] px-6">
              {language === 'vi' ? 'Quay Lại Bàn Làm Việc (Dashboard)' : 'Back to Dashboard'}
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="route-page">
      <div className="route-page-head">
        <div>
          <span>$</span>
          <div>
            <p>{language === 'vi' ? 'QUẢN LÝ TÀI CHÍNH' : 'FINANCE & BILLING'}</p>
            <h1>{language === 'vi' ? 'Phí Dịch Vụ & Thanh Toán' : 'Fees & Payments'}</h1>
            <small>
              {language === 'vi'
                ? 'Theo dõi biểu phí khai thuế, công nợ và tiến độ thu phí theo hồ sơ.'
                : 'Monitor filing fees, outstanding balances, and invoice collection status.'}
            </small>
          </div>
        </div>
      </div>

      <section className="route-kpis">
        <article>
          <span>{language === 'vi' ? 'TỔNG DOANH THU' : 'TOTAL BILLED'}</span>
          <b className="text-slate-900">{money(totals.fees)}</b>
        </article>
        <article>
          <span>{language === 'vi' ? 'ĐÃ THU TIỀN' : 'TOTAL COLLECTED'}</span>
          <b className="text-emerald-600">{money(totals.paid)}</b>
        </article>
        <article>
          <span>{language === 'vi' ? 'CÔNG NỢ CÒN LẠI' : 'OUTSTANDING BALANCE'}</span>
          <b className="text-rose-600">{money(totals.balance)}</b>
        </article>
        <article>
          <span>{language === 'vi' ? 'HỒ SƠ ĐÃ XONG TIỀN' : 'FULLY PAID RETURNS'}</span>
          <b>
            {totals.paidCount}/{filtered.length}
          </b>
        </article>
      </section>

      <section className="route-card">
        <header>
          <b>{language === 'vi' ? 'Bộ Lọc Hồ Sơ & Biểu Phí' : 'Fee Filter & Search'}</b>
          <span>
            {language === 'vi'
              ? `${filtered.length} bản ghi phù hợp`
              : `${filtered.length} matching engagement records`}
          </span>
        </header>
        <div className="p-4 grid grid-cols-1 md:grid-cols-4 gap-3">
          <label className="text-xs font-bold text-slate-600 flex flex-col gap-1">
            {language === 'vi' ? 'Năm thuế:' : 'Tax year:'}
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="h-9 px-2 rounded border border-slate-300 text-xs bg-white"
            >
              <option value="">{language === 'vi' ? 'Tất cả các năm' : 'All years'}</option>
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </label>

          <label className="text-xs font-bold text-slate-600 flex flex-col gap-1">
            {language === 'vi' ? 'Trạng thái thu phí:' : 'Payment status:'}
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="h-9 px-2 rounded border border-slate-300 text-xs bg-white"
            >
              <option value="">{language === 'vi' ? 'Tất cả trạng thái' : 'All payment statuses'}</option>
              <option value="Paid">{language === 'vi' ? 'Đã thanh toán đủ' : 'Paid in full'}</option>
              <option value="Partial">{language === 'vi' ? 'Đã thu một phần' : 'Partial'}</option>
              <option value="Unpaid">{language === 'vi' ? 'Chưa thanh toán' : 'Unpaid'}</option>
            </select>
          </label>

          <label className="text-xs font-bold text-slate-600 flex flex-col gap-1">
            {language === 'vi' ? 'Đối tượng khách hàng:' : 'Client category:'}
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="h-9 px-2 rounded border border-slate-300 text-xs bg-white"
            >
              <option value="">{language === 'vi' ? 'Tất cả khách hàng' : 'All clients'}</option>
              <option value="Individual">{language === 'vi' ? 'Cá nhân (1040)' : 'Individual'}</option>
              <option value="Business">{language === 'vi' ? 'Doanh nghiệp (1065, 1120)' : 'Business'}</option>
            </select>
          </label>

          <div className="flex items-end">
            <Button
              type="button"
              variant="outline"
              onClick={reset}
              className="w-full h-9 text-xs font-bold gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === 'vi' ? 'Đặt lại' : 'Reset'}</span>
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="py-16 px-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <CircleDollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">
                {language === 'vi' ? 'Chưa có bản ghi phí dịch vụ nào' : 'No fee records found'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                {language === 'vi'
                  ? 'Bắt đầu thêm khách hàng hoặc doanh nghiệp để theo dõi tiến độ thu phí tự động.'
                  : 'Add individual or business clients to start tracking invoices and fee collections.'}
              </p>
              <div className="flex items-center justify-center gap-2">
                <Link href="/clients">
                  <Button size="sm" className="h-8 text-xs font-bold bg-[#092c5c] text-white rounded-lg">
                    {language === 'vi' ? '+ Thêm Khách Hàng' : '+ Add Client'}
                  </Button>
                </Link>
                <Link href="/businesses">
                  <Button size="sm" variant="outline" className="h-8 text-xs font-bold rounded-lg">
                    {language === 'vi' ? '+ Thêm Doanh Nghiệp' : '+ Add Business'}
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="route-table">
              <div>
                <span>{language === 'vi' ? 'Khách Hàng / Hồ Sơ' : 'Client & Engagement'}</span>
                <span>{language === 'vi' ? 'Tờ Khai' : 'Return Form'}</span>
                <span>{language === 'vi' ? 'Tổng Phí' : 'Fee'}</span>
                <span>{language === 'vi' ? 'Trạng Thái Thu Phí' : 'Status & Balance'}</span>
              </div>
              {filtered.map((item) => (
                <Link key={item.taxReturnId} href={item.clientRecord}>
                  <b>
                    {item.name} · {item.year}
                  </b>
                  <span>{item.returnType}</span>
                  <span>{money(item.totalFee)}</span>
                  <em>
                    {paymentStatusOf(item) === 'Paid'
                      ? language === 'vi'
                        ? 'Đã thu đủ'
                        : 'Paid in full'
                      : language === 'vi'
                      ? `Còn nợ ${money(balanceOf(item))}`
                      : `Due ${money(balanceOf(item))}`}
                  </em>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
