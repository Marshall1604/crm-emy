'use client';

import React from 'react';
import Link from 'next/link';
import {
  Building2,
  CircleDollarSign,
  FileText,
  Plus,
  Settings2,
  UserCog,
  UsersRound,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n/language-context';

const data = {
  dashboard: {
    titleEn: 'Business Returns Dashboard',
    titleVi: 'Bảng Điều Khiển Hồ Sơ Doanh Nghiệp',
    descEn: 'Monitor client returns, workflow status, and assignments.',
    descVi: 'Theo dõi tiến độ khai thuế, trạng thái hồ sơ và phân công nhân sự.',
    actionEn: 'New Business',
    actionVi: 'Thêm Doanh Nghiệp',
    icon: Building2,
  },
  clients: {
    titleEn: 'Individual Clients',
    titleVi: 'Khách Hàng Cá Nhân',
    descEn: 'All individual client relationships in your tax office.',
    descVi: 'Toàn bộ danh sách hồ sơ khách hàng cá nhân (Form 1040).',
    actionEn: 'Add Client',
    actionVi: 'Thêm Khách Hàng',
    icon: UsersRound,
  },
  businesses: {
    titleEn: 'Business Clients',
    titleVi: 'Khách Hàng Doanh Nghiệp',
    descEn: 'Business entities and active tax engagements.',
    descVi: 'Danh sách pháp nhân kinh doanh (LLC, S-Corp, C-Corp, Partnership).',
    actionEn: 'New Business',
    actionVi: 'Thêm Doanh Nghiệp',
    icon: Building2,
  },
  'tax-returns': {
    titleEn: 'Tax Returns',
    titleVi: 'Hồ Sơ Khai Thuế',
    descEn: 'Track returns by tax year and workflow status.',
    descVi: 'Quản lý toàn bộ tờ khai thuế theo năm và tiến độ xử lý.',
    actionEn: 'Add Return',
    actionVi: 'Tạo Hồ Sơ Mới',
    icon: FileText,
  },
  fees: {
    titleEn: 'Fees & Payments',
    titleVi: 'Phí Dịch Vụ & Thanh Toán',
    descEn: 'Preparation fees, payments, and outstanding balances.',
    descVi: 'Theo dõi doanh thu, phí chuẩn bị hồ sơ và các khoản còn nợ.',
    actionEn: 'Create Invoice',
    actionVi: 'Tạo Hóa Đơn',
    icon: CircleDollarSign,
  },
  team: {
    titleEn: 'Staff & Team',
    titleVi: 'Đội Ngũ Nhân Viên',
    descEn: 'Staff access, assignments, and administrative roles.',
    descVi: 'Quản lý quyền hạn nhân viên, phân bổ hồ sơ và vai trò.',
    actionEn: 'Invite Staff',
    actionVi: 'Mời Nhân Viên',
    icon: UserCog,
  },
  settings: {
    titleEn: 'Office Settings',
    titleVi: 'Cài Đặt Văn Phòng',
    descEn: 'Configure your tax office workspace and preferences.',
    descVi: 'Tùy chỉnh thông tin văn phòng thuế và các thiết lập hệ thống.',
    actionEn: 'Save Changes',
    actionVi: 'Lưu Thay Đổi',
    icon: Settings2,
  },
} as const;

export type RouteKind = keyof typeof data;

const businesses = [
  ['ABC Logistics LLC', '1065', '2025', 'In Preparation'],
  ['XYZ Technology Inc', '1120-S', '2025', 'Waiting Documents'],
  ['Luxury Nails Studio LLC', '1065', '2025', 'Review'],
];

export function RoutePage({ kind }: { kind: RouteKind }) {
  const { language } = useLanguage();
  const page = data[kind];
  const Icon = page.icon;

  const title = language === 'vi' ? page.titleVi : page.titleEn;
  const desc = language === 'vi' ? page.descVi : page.descEn;
  const action = language === 'vi' ? page.actionVi : page.actionEn;

  return (
    <main className="route-page">
      <header className="route-page-head">
        <div>
          <span>
            <Icon size={19} />
          </span>
          <div>
            <p>{language === 'vi' ? 'QUẢN LÝ THUẾ' : 'TAX CRM'}</p>
            <h1>{title}</h1>
            <small>{desc}</small>
          </div>
        </div>
        <Button disabled aria-disabled="true">
          <Plus size={14} />
          {action}
        </Button>
      </header>
      {kind === 'dashboard' ? (
        <DashboardBody language={language} />
      ) : kind === 'settings' ? (
        <SettingsBody language={language} />
      ) : (
        <ListBody kind={kind} language={language} />
      )}
    </main>
  );
}

function DashboardBody({ language }: { language: string }) {
  const records = [
    ...businesses,
    ['Minh Nguyen', '1040', '2025', 'Ready to File'],
    ['Olivia Johnson', '1040', '2025', 'Completed'],
  ] as const;

  const metrics = [
    [language === 'vi' ? 'Tổng khách hàng' : 'Clients', new Set(records.map((row) => row[0])).size],
    [language === 'vi' ? 'Hồ sơ công ty' : 'Business Returns', businesses.length],
    [language === 'vi' ? 'Chờ giấy tờ' : 'Waiting Documents', records.filter((row) => row[3] === 'Waiting Documents').length],
    [language === 'vi' ? 'Đang soạn' : 'In Preparation', records.filter((row) => row[3] === 'In Preparation').length],
    [language === 'vi' ? 'Sẵn sàng nộp' : 'Ready to File', records.filter((row) => row[3] === 'Ready to File').length],
    [language === 'vi' ? 'Đã hoàn tất' : 'Completed', records.filter((row) => row[3] === 'Completed').length],
  ] as const;

  return (
    <>
      <section className="route-kpis">
        {metrics.map((row) => (
          <article key={row[0]}>
            <span>{row[0]}</span>
            <b>{row[1]}</b>
          </article>
        ))}
      </section>
      <ListBody kind="tax-returns" language={language} />
    </>
  );
}

function ListBody({ kind, language }: { kind: RouteKind; language: string }) {
  if (kind === 'team')
    return (
      <section className="route-card">
        <div className="route-rows">
          {[
            ['Amy Tran', language === 'vi' ? 'Chủ văn phòng / Admin' : 'Owner', language === 'vi' ? 'Đang hoạt động' : 'Active'],
            ['Daniel Lee', language === 'vi' ? 'Nhân viên thuế' : 'Preparer', language === 'vi' ? 'Đang hoạt động' : 'Active'],
            ['Sarah Kim', language === 'vi' ? 'Nhân viên kiểm tra (Reviewer)' : 'Reviewer', language === 'vi' ? 'Đang hoạt động' : 'Active'],
          ].map((row) => (
            <div key={row[0]}>
              <b>{row[0]}</b>
              <span>{row[1]}</span>
              <em>{row[2]}</em>
            </div>
          ))}
        </div>
      </section>
    );

  if (kind === 'fees')
    return (
      <section className="route-card">
        <div className="route-rows">
          {businesses.map((row, i) => (
            <div key={row[0]}>
              <b>{row[0]}</b>
              <span>{language === 'vi' ? 'Phí' : 'Fee'} ${(2400 + i * 350).toLocaleString()}</span>
              <em>{i === 2 ? (language === 'vi' ? 'Đã thanh toán đủ' : 'Paid') : (language === 'vi' ? 'Còn nợ' : 'Outstanding')}</em>
            </div>
          ))}
        </div>
      </section>
    );

  const statusMap: Record<string, string> = {
    'In Preparation': language === 'vi' ? 'Đang Soạn Hồ Sơ' : 'In Preparation',
    'Waiting Documents': language === 'vi' ? 'Chờ Giấy Tờ' : 'Waiting Documents',
    'Review': language === 'vi' ? 'Đang Kiểm Tra' : 'Review',
  };

  return (
    <section className="route-card">
      <header>
        <b>
          {kind === 'clients'
            ? language === 'vi' ? 'Danh sách khách hàng' : 'Client accounts'
            : kind === 'businesses'
            ? language === 'vi' ? 'Doanh nghiệp đang hoạt động' : 'Active businesses'
            : language === 'vi' ? 'Hồ sơ khai thuế' : 'Business returns'}
        </b>
        <span>{businesses.length} {language === 'vi' ? 'hồ sơ' : 'records'}</span>
      </header>
      <div className="route-table">
        <div>
          <b>{language === 'vi' ? 'DOANH NGHIỆP' : 'BUSINESS'}</b>
          <b>{language === 'vi' ? 'LOẠI HÌNH' : 'ENTITY'}</b>
          <b>{language === 'vi' ? 'NĂM THUẾ' : 'YEAR'}</b>
          <b>{language === 'vi' ? 'TRẠNG THÁI' : 'STATUS'}</b>
        </div>
        {businesses.map((row, i) => (
          <Link href={i === 0 ? '/businesses/abc-logistics' : '/businesses'} key={row[0]}>
            <b>{row[0]}</b>
            <span>{row[1]}</span>
            <span>{row[2]}</span>
            <em>{statusMap[row[3]] || row[3]}</em>
          </Link>
        ))}
      </div>
    </section>
  );
}

function SettingsBody({ language }: { language: string }) {
  return (
    <section className="route-card route-settings">
      <label>
        {language === 'vi' ? 'Tên Văn Phòng' : 'Office Name'}
        <input defaultValue="EMLY CUSTOMER LIST" />
      </label>
      <label>
        {language === 'vi' ? 'Năm Thuế Mặc Định' : 'Default Tax Year'}
        <select defaultValue="2026">
          <option>2026</option>
          <option>2025</option>
        </select>
      </label>
      <label>
        {language === 'vi' ? 'Email Văn Phòng' : 'Office Email'}
        <input defaultValue="office@crmemy.com" />
      </label>
      <label>
        {language === 'vi' ? 'Múi Giờ' : 'Time Zone'}
        <select>
          <option>{language === 'vi' ? 'Giờ Thái Bình Dương (Pacific Time)' : 'Pacific Time'}</option>
          <option>{language === 'vi' ? 'Giờ Miền Trung (Central Time)' : 'Central Time'}</option>
          <option>{language === 'vi' ? 'Giờ Miền Đông (Eastern Time)' : 'Eastern Time'}</option>
        </select>
      </label>
    </section>
  );
}
