'use client';

import React from 'react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  Banknote,
  ChevronDown,
  CircleCheckBig,
  CircleDollarSign,
  ReceiptText,
  RotateCcw,
  WalletCards,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n/language-context';

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

const feeRecords: FeeRecord[] = [
  { taxReturnId: 'tr-minh-2025', clientRecord: '/clients/minh-nguyen', name: 'Minh Nguyen', clientType: 'Individual', year: '2025', returnType: '1040', totalFee: 650, amountPaid: 325, invoiceStatus: 'Sent' },
  { taxReturnId: 'tr-abc-2025', clientRecord: '/businesses/abc-logistics', name: 'ABC Logistics LLC', clientType: 'Business', year: '2025', returnType: '1065', totalFee: 2400, amountPaid: 1200, invoiceStatus: 'Sent' },
  { taxReturnId: 'tr-olivia-2025', clientRecord: '/clients/olivia-johnson', name: 'Olivia Johnson', clientType: 'Individual', year: '2025', returnType: '1040', totalFee: 875, amountPaid: 875, invoiceStatus: 'Paid' },
  { taxReturnId: 'tr-xyz-2025', clientRecord: '/businesses', name: 'XYZ Technology Inc', clientType: 'Business', year: '2025', returnType: '1120-S', totalFee: 3100, amountPaid: 1550, invoiceStatus: 'Overdue' },
  { taxReturnId: 'tr-nails-2025', clientRecord: '/businesses', name: 'Luxury Nails Studio LLC', clientType: 'Business', year: '2025', returnType: 'Schedule C', totalFee: 1450, amountPaid: 1450, invoiceStatus: 'Paid' },
  { taxReturnId: 'tr-acme-2024', clientRecord: '/businesses', name: 'ACME Holdings Corp', clientType: 'Business', year: '2024', returnType: '1120', totalFee: 4200, amountPaid: 0, invoiceStatus: 'Not Sent' },
];

const balanceOf = (record: FeeRecord) => Math.max(0, record.totalFee - record.amountPaid);
const paymentStatusOf = (record: FeeRecord): PaymentStatus =>
  record.amountPaid <= 0 ? 'Unpaid' : balanceOf(record) <= 0 ? 'Paid' : 'Partial';
const money = (value: number) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

export function FeesPage() {
  const { language } = useLanguage();
  const [year, setYear] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');

  const filtered = useMemo(
    () =>
      feeRecords.filter(
        (record) =>
          (!year || record.year === year) &&
          (!status || paymentStatusOf(record) === status) &&
          (!type || record.clientType === type)
      ),
    [year, status, type]
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

  const paymentMapVi: Record<string, string> = {
    'Unpaid': 'Chưa thanh toán',
    'Partial': 'Thanh toán một phần',
    'Paid': 'Đã thanh toán đủ',
  };

  const invoiceMapVi: Record<string, string> = {
    'Not Sent': 'Chưa gửi hóa đơn',
    'Sent': 'Đã gửi hóa đơn',
    'Overdue': 'Quá hạn thanh toán',
    'Paid': 'Đã thanh toán',
  };

  return (
    <main className="fees-page">
      <header className="fees-head">
        <div>
          <p>{language === 'vi' ? 'QUẢN LÝ TÀI CHÍNH' : 'TAX CRM'}</p>
          <h1>{language === 'vi' ? 'Phí Dịch Vụ & Thanh Toán' : 'Fees & Payments'}</h1>
          <span>
            {language === 'vi'
              ? 'Theo dõi doanh thu phí chuẩn bị hồ sơ thuế, các khoản đã thu và số dư còn nợ.'
              : 'Track preparation fees and collections by tax return engagement.'}
          </span>
        </div>
        <Button className="cursor-pointer">
          <ReceiptText size={14} />
          {language === 'vi' ? 'Tạo Hóa Đơn' : 'Create Invoice'}
        </Button>
      </header>

      <section className="fees-kpis">
        <FeeCard
          label={language === 'vi' ? 'Tổng Phí Khai Thuế' : 'Total Fees'}
          value={money(totals.fees)}
          note={`${filtered.length} ${language === 'vi' ? 'hồ sơ hợp đồng' : 'engagements'}`}
          icon={<CircleDollarSign />}
          tone="navy"
        />
        <FeeCard
          label={language === 'vi' ? 'Số Tiền Đã Thu' : 'Amount Collected'}
          value={money(totals.paid)}
          note={language === 'vi' ? 'Đã ghi nhận thanh toán' : 'Recorded payments'}
          icon={<Banknote />}
          tone="green"
        />
        <FeeCard
          label={language === 'vi' ? 'Số Tiền Còn Nợ' : 'Outstanding Balance'}
          value={money(totals.balance)}
          note={language === 'vi' ? 'Cần thu hồi' : 'Remaining to collect'}
          icon={<WalletCards />}
          tone="amber"
        />
        <FeeCard
          label={language === 'vi' ? 'Hồ Sơ Đã Thu Đủ' : 'Paid In Full Count'}
          value={String(totals.paidCount)}
          note={language === 'vi' ? 'Đã tất toán 100%' : 'Engagements fully paid'}
          icon={<CircleCheckBig />}
          tone="violet"
        />
      </section>

      <section className="fee-filters">
        <div>
          <b>{language === 'vi' ? 'Bộ Lọc' : 'Filters'}</b>
          <span>{filtered.length} {language === 'vi' ? 'kết quả' : 'records'}</span>
        </div>
        <Filter label={language === 'vi' ? 'Năm thuế' : 'Tax Year'} value={year} setValue={setYear} options={['2026', '2025', '2024']} />
        <Filter label={language === 'vi' ? 'Trạng thái thu tiền' : 'Payment Status'} value={status} setValue={setStatus} options={['Unpaid', 'Partial', 'Paid']} optionsVi={['Chưa trả', 'Trả một phần', 'Đã trả đủ']} />
        <Filter label={language === 'vi' ? 'Loại khách hàng' : 'Client Type'} value={type} setValue={setType} options={['Individual', 'Business']} optionsVi={['Cá nhân', 'Doanh nghiệp']} />
        <Button variant="ghost" size="sm" onClick={reset} className="cursor-pointer">
          <RotateCcw size={13} />
          {language === 'vi' ? 'Đặt lại' : 'Reset'}
        </Button>
      </section>

      <section className="fees-table-card">
        <header>
          <div>
            <b>{language === 'vi' ? 'Sổ Theo Dõi Thu Phí' : 'Fee Ledger'}</b>
            <span>{language === 'vi' ? 'Biểu phí được đồng bộ tự động từ các hồ sơ khai thuế' : 'Fees are linked to existing tax return records'}</span>
          </div>
          <Button variant="outline" size="sm" className="cursor-pointer">
            {language === 'vi' ? 'Xuất File' : 'Export'}
          </Button>
        </header>
        <div className="fees-table-wrap">
          <table className="fees-table">
            <thead>
              <tr>
                <th>{language === 'vi' ? 'KHÁCH HÀNG / CÔNG TY' : 'CLIENT / BUSINESS'}</th>
                <th>{language === 'vi' ? 'NĂM THUẾ' : 'TAX YEAR'}</th>
                <th>{language === 'vi' ? 'MẪU TỜ KHAI' : 'RETURN TYPE'}</th>
                <th>{language === 'vi' ? 'TỔNG PHÍ' : 'TOTAL FEE'}</th>
                <th>{language === 'vi' ? 'ĐÃ THU' : 'AMOUNT PAID'}</th>
                <th>{language === 'vi' ? 'CÒN NỢ' : 'BALANCE'}</th>
                <th>{language === 'vi' ? 'TRẠNG THÁI THU' : 'PAYMENT STATUS'}</th>
                <th>{language === 'vi' ? 'HÓA ĐƠN' : 'INVOICE STATUS'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((record, i) => {
                const balance = balanceOf(record);
                const payment = paymentStatusOf(record);
                return (
                  <tr key={record.taxReturnId}>
                    <td>
                      <Link href={`/tax-returns/${record.taxReturnId}`}>
                        <span className={`fee-avatar client-tone-${i % 5}`}>
                          {record.name
                            .split(' ')
                            .map((part) => part[0])
                            .slice(0, 2)
                            .join('')}
                        </span>
                        <div>
                          <b>{record.name}</b>
                          <small>
                            {record.clientType === 'Individual' ? (language === 'vi' ? 'Cá nhân' : 'Individual') : (language === 'vi' ? 'Doanh nghiệp' : 'Business')} · {record.taxReturnId}
                          </small>
                        </div>
                      </Link>
                    </td>
                    <td>
                      <b>{record.year}</b>
                    </td>
                    <td>
                      <span className="client-return">{record.returnType}</span>
                    </td>
                    <td>
                      <b>{money(record.totalFee)}</b>
                    </td>
                    <td className="fee-collected">{money(record.amountPaid)}</td>
                    <td className={balance ? 'fee-due' : 'fee-zero'}>{money(balance)}</td>
                    <td>
                      <span className={`payment-pill ${payment.toLowerCase()}`}>
                        <i />
                        {language === 'vi' ? paymentMapVi[payment] || payment : payment}
                      </span>
                    </td>
                    <td>
                      <span className={`invoice-pill ${record.invoiceStatus.toLowerCase().replace(' ', '-')}`}>
                        {language === 'vi' ? invoiceMapVi[record.invoiceStatus] || record.invoiceStatus : record.invoiceStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!filtered.length && (
            <div className="fees-empty">
              <ReceiptText size={22} />
              <b>{language === 'vi' ? 'Không tìm thấy dữ liệu thu phí' : 'No fee records found'}</b>
              <p>{language === 'vi' ? 'Thử thay đổi bộ lọc tìm kiếm.' : 'Try changing or resetting your filters.'}</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function FeeCard({
  label,
  value,
  note,
  icon,
  tone,
}: {
  label: string;
  value: string;
  note: string;
  icon: React.ReactNode;
  tone: string;
}) {
  return (
    <article className="fee-kpi">
      <span className={`fee-kpi-icon ${tone}`}>{icon}</span>
      <p>{label}</p>
      <b>{value}</b>
      <small>{note}</small>
    </article>
  );
}

function Filter({
  label,
  value,
  setValue,
  options,
  optionsVi,
}: {
  label: string;
  value: string;
  setValue: (value: string) => void;
  options: string[];
  optionsVi?: string[];
}) {
  return (
    <label className="fee-filter">
      <span>{label}</span>
      <select value={value} onChange={(event) => setValue(event.target.value)}>
        <option value="">-- Tất cả / All --</option>
        {options.map((option, idx) => (
          <option key={option} value={option}>
            {optionsVi ? optionsVi[idx] : option}
          </option>
        ))}
      </select>
      <ChevronDown size={12} />
    </label>
  );
}
