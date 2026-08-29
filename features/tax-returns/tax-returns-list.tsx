'use client';

import React from 'react';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ChevronDown, Plus, RotateCcw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n/language-context';

const returns = [
  { id: 'tr-minh-2025', name: 'Minh Nguyen', kind: 'Individual', initials: 'MN', year: '2025', returnType: '1040', entity: 'Individual', federal: 4850, state: 920, status: 'Waiting Documents', preparer: 'Amy Tran', fee: 650, balance: 325, updated: 'Aug 29, 2026' },
  { id: 'tr-abc-2025', name: 'ABC Logistics LLC', kind: 'Business', initials: 'AL', year: '2025', returnType: '1065', entity: 'Partnership', federal: 18200, state: 3750, status: 'In Preparation', preparer: 'Daniel Lee', fee: 2400, balance: 1200, updated: 'Aug 29, 2026' },
  { id: 'tr-olivia-2025', name: 'Olivia Johnson', kind: 'Individual', initials: 'OJ', year: '2025', returnType: '1040', entity: 'Individual', federal: 3200, state: 640, status: 'Review', preparer: 'Daniel Lee', fee: 875, balance: 0, updated: 'Aug 28, 2026' },
  { id: 'tr-xyz-2025', name: 'XYZ Technology Inc', kind: 'Business', initials: 'XT', year: '2025', returnType: '1120-S', entity: 'S Corporation', federal: 26800, state: 5400, status: 'Waiting Documents', preparer: 'Sarah Kim', fee: 3100, balance: 1550, updated: 'Aug 27, 2026' },
  { id: 'tr-nails-2025', name: 'Luxury Nails Studio LLC', kind: 'Business', initials: 'LN', year: '2025', returnType: 'Schedule C', entity: 'Sole Proprietor', federal: 12400, state: 2210, status: 'Completed', preparer: 'Amy Tran', fee: 1450, balance: 0, updated: 'Aug 24, 2026' },
  { id: 'tr-acme-2024', name: 'ACME Holdings Corp', kind: 'Business', initials: 'AH', year: '2024', returnType: '1120', entity: 'C Corporation', federal: 34600, state: 7800, status: 'Accepted', preparer: 'Sarah Kim', fee: 4200, balance: 0, updated: 'Aug 20, 2026' },
];

const returnTypes = ['1040', '1065', '1120-S', '1120', 'Schedule C', 'Other'];
const statuses = ['New', 'Waiting Documents', 'Documents Received', 'In Preparation', 'Missing Information', 'Review', 'Signature Pending', 'Ready to File', 'E-Filed', 'Accepted', 'Rejected', 'Extension Filed', 'Completed'];

const statusMapVi: Record<string, string> = {
  'New': 'Mới Tạo',
  'Waiting Documents': 'Chờ Giấy Tờ',
  'Documents Received': 'Đã Nhận Giấy Tờ',
  'In Preparation': 'Đang Soạn Hồ Sơ',
  'Missing Information': 'Thiếu Thông Tin',
  'Review': 'Đang Kiểm Tra',
  'Signature Pending': 'Chờ Ký Tên',
  'Ready to File': 'Sẵn Sàng Nộp',
  'E-Filed': 'Đã Nộp IRS',
  'Accepted': 'IRS Chấp Nhận',
  'Rejected': 'IRS Từ Chối',
  'Extension Filed': 'Đã Xin Gia Hạn',
  'Completed': 'Đã Hoàn Tất',
};

export function TaxReturnsList() {
  const { language } = useLanguage();
  const [search, setSearch] = useState('');
  const [year, setYear] = useState('');
  const [kind, setKind] = useState('');
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [preparer, setPreparer] = useState('');

  const filtered = useMemo(
    () =>
      returns.filter(
        (r) =>
          (!search || r.name.toLowerCase().includes(search.toLowerCase())) &&
          (!year || r.year === year) &&
          (!kind || r.kind === kind) &&
          (!type || r.returnType === type) &&
          (!status || r.status === status) &&
          (!preparer || r.preparer === preparer)
      ),
    [search, year, kind, type, status, preparer]
  );

  const reset = () => {
    setSearch('');
    setYear('');
    setKind('');
    setType('');
    setStatus('');
    setPreparer('');
  };

  const getStatusLabel = (st: string) => (language === 'vi' ? statusMapVi[st] || st : st);

  return (
    <main className="returns-page">
      <header className="returns-head">
        <div>
          <p>{language === 'vi' ? 'QUẢN LÝ THUẾ' : 'TAX CRM'}</p>
          <h1>{language === 'vi' ? 'Hồ Sơ Khai Thuế' : 'Tax Returns'}</h1>
          <span>
            {language === 'vi'
              ? 'Quản lý toàn bộ tờ khai thuế cá nhân và doanh nghiệp qua các năm tính thuế.'
              : 'Manage individual and business tax engagements across every tax year.'}
          </span>
        </div>
        <Button className="cursor-pointer">
          <Plus size={14} />
          {language === 'vi' ? 'Tạo Tờ Khai' : 'Add Return'}
        </Button>
      </header>
      <section className="returns-filters">
        <label className="returns-search">
          <Search size={14} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'vi' ? 'Tìm kiếm khách hàng hoặc công ty...' : 'Search client or business...'}
          />
        </label>
        <Filter label={language === 'vi' ? 'Năm thuế' : 'Tax Year'} value={year} setValue={setYear} options={['2026', '2025', '2024']} />
        <Filter label={language === 'vi' ? 'Phân loại' : 'Client Type'} value={kind} setValue={setKind} options={['Individual', 'Business']} optionsVi={['Cá nhân', 'Doanh nghiệp']} />
        <Filter label={language === 'vi' ? 'Mẫu tờ khai' : 'Return Type'} value={type} setValue={setType} options={returnTypes} />
        <Filter label={language === 'vi' ? 'Trạng thái' : 'Status'} value={status} setValue={setStatus} options={statuses} optionsVi={statuses.map(s => statusMapVi[s] || s)} />
        <Filter label={language === 'vi' ? 'Nhân viên phụ trách' : 'Assigned Preparer'} value={preparer} setValue={setPreparer} options={['Amy Tran', 'Daniel Lee', 'Sarah Kim']} />
        <Button variant="ghost" size="sm" onClick={reset} className="cursor-pointer">
          <RotateCcw size={13} />
          {language === 'vi' ? 'Đặt lại' : 'Reset'}
        </Button>
      </section>
      <section className="returns-list-card">
        <header>
          <div>
            <b>{language === 'vi' ? 'Danh Sách Hồ Sơ' : 'Return Engagements'}</b>
            <span>{filtered.length} {language === 'vi' ? 'hồ sơ' : 'returns'}</span>
          </div>
          <Button variant="outline" size="sm" className="cursor-pointer">
            {language === 'vi' ? 'Xuất File' : 'Export'}
          </Button>
        </header>
        <div className="returns-table-wrap">
          <table className="engagement-table">
            <thead>
              <tr>
                <th>{language === 'vi' ? 'KHÁCH HÀNG / DOANH NGHIỆP' : 'CLIENT / BUSINESS'}</th>
                <th>{language === 'vi' ? 'NĂM THUẾ' : 'TAX YEAR'}</th>
                <th>{language === 'vi' ? 'MẪU TỜ KHAI' : 'RETURN TYPE'}</th>
                <th>{language === 'vi' ? 'LOẠI HÌNH' : 'ENTITY TYPE'}</th>
                <th>{language === 'vi' ? 'THUẾ LIÊN BANG / TIỂU BANG' : 'FEDERAL / STATE'}</th>
                <th>{language === 'vi' ? 'TRẠNG THÁI' : 'STATUS'}</th>
                <th>{language === 'vi' ? 'NHÂN VIÊN PHỤ TRÁCH' : 'ASSIGNED PREPARER'}</th>
                <th>{language === 'vi' ? 'PHÍ DỊCH VỤ' : 'FEE'}</th>
                <th>{language === 'vi' ? 'CÒN NỢ' : 'BALANCE'}</th>
                <th>{language === 'vi' ? 'CẬP NHẬT' : 'LAST UPDATED'}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.id}>
                  <td>
                    <Link href={`/tax-returns/${r.id}`}>
                      <span className={`return-avatar client-tone-${i % 5}`}>{r.initials}</span>
                      <div>
                        <b>{r.name}</b>
                        <small>{r.kind === 'Individual' ? (language === 'vi' ? 'Cá nhân' : 'Individual') : (language === 'vi' ? 'Doanh nghiệp' : 'Business')}</small>
                      </div>
                    </Link>
                  </td>
                  <td>
                    <b>{r.year}</b>
                  </td>
                  <td>
                    <span className="client-return">{r.returnType}</span>
                  </td>
                  <td>{r.entity}</td>
                  <td>
                    <div className="tax-amount-pair">
                      <b>${r.federal.toLocaleString()}</b>
                      <small>${r.state.toLocaleString()} {language === 'vi' ? 'tiểu bang' : 'state'}</small>
                    </div>
                  </td>
                  <td>
                    <span className={`tax-status ${r.status.toLowerCase().replaceAll(' ', '-')}`}>
                      <i />
                      {getStatusLabel(r.status)}
                    </span>
                  </td>
                  <td>
                    <span className="staff-mini">{r.preparer.split(' ').map((n) => n[0]).join('')}</span>
                    {r.preparer}
                  </td>
                  <td>
                    <b>${r.fee.toLocaleString()}</b>
                  </td>
                  <td className={r.balance ? 'return-balance' : 'return-paid'}>
                    {r.balance ? `$${r.balance.toLocaleString()}` : language === 'vi' ? 'Đã thu đủ' : '$0'}
                  </td>
                  <td>{r.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length && (
            <div className="returns-empty">
              <Search size={22} />
              <b>{language === 'vi' ? 'Không tìm thấy hồ sơ nào' : 'No tax returns found'}</b>
              <p>{language === 'vi' ? 'Thử thay đổi hoặc đặt lại bộ lọc tìm kiếm.' : 'Try changing or resetting your filters.'}</p>
            </div>
          )}
        </div>
      </section>
    </main>
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
    <label className="return-filter">
      <span>{label}</span>
      <select value={value} onChange={(e) => setValue(e.target.value)}>
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
