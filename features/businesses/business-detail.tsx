'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  CalendarDays,
  Check,
  ChevronDown,
  CircleDollarSign,
  ClipboardCheck,
  Download,
  Eye,
  EyeOff,
  FileText,
  FolderOpen,
  Mail,
  MapPin,
  MoreHorizontal,
  NotebookPen,
  Pencil,
  Phone,
  Plus,
  ReceiptText,
  Search,
  ShieldCheck,
  Upload,
  UserRound,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n/language-context';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { EditBusinessModal, type BusinessData } from './edit-business-modal';

const defaultBusiness: BusinessData = {
  name: 'ABC Logistics LLC',
  dba: 'ABC Freight & Logistics',
  ein: '**-***6789',
  entityType: 'Partnership',
  status: 'Waiting Documents',
  assignedStaff: 'Daniel Lee',
  email: 'office@abclogistics.com',
  phone: '(415) 555-0138',
  address: '680 Harbor Way, Oakland, CA 94607',
  primaryContact: 'Michael Chen',
  federalTax: 4850,
  stateTax: 1900,
  fee: 2400,
  amountPaid: 1200,
};

const initialEvents = [
  { icon: Plus, title: 'Client created', titleVi: 'Khách hàng được tạo mới', detail: 'ABC Logistics LLC was added to the workspace', detailVi: 'ABC Logistics LLC đã được thêm vào không gian làm việc', actor: 'Amy Tran', time: 'Aug 12, 2026 · 9:14 AM', tone: 'blue' },
  { icon: Pencil, title: 'Business information edited', titleVi: 'Cập nhật thông tin công ty', detail: 'Phone number and mailing address updated', detailVi: 'Đã cập nhật số điện thoại và địa chỉ nhận thư', actor: 'Amy Tran', time: 'Aug 18, 2026 · 2:32 PM', tone: 'violet' },
  { icon: Activity, title: 'Status changed', titleVi: 'Thay đổi trạng thái hồ sơ', detail: 'New → Waiting Documents', detailVi: 'Mới tạo → Chờ Giấy Tờ', actor: 'Daniel Lee', time: 'Aug 20, 2026 · 10:05 AM', tone: 'amber' },
  { icon: Upload, title: 'Document uploaded', titleVi: 'Tải lên tài liệu', detail: '2026_Partner_Statements.pdf', detailVi: '2026_Partner_Statements.pdf', actor: 'Michael Chen', time: 'Aug 23, 2026 · 4:48 PM', tone: 'green' },
  { icon: NotebookPen, title: 'Note added', titleVi: 'Thêm ghi chú nội bộ', detail: 'Waiting for two remaining K-1 statements.', detailVi: 'Đang đợi thêm 2 bảng kê K-1 của các thành viên.', actor: 'Daniel Lee', time: 'Aug 25, 2026 · 11:20 AM', tone: 'violet' },
  { icon: CircleDollarSign, title: 'Preparation fee changed', titleVi: 'Điều chỉnh phí dịch vụ', detail: 'Fee updated from $2,250 to $2,400', detailVi: 'Phí dịch vụ cập nhật từ $2,250 lên $2,400', actor: 'Amy Tran', time: 'Aug 28, 2026 · 8:41 AM', tone: 'green' },
];

const partners = [
  { name: 'Michael Chen', initials: 'MC', role: 'Managing Partner', roleVi: 'Thành viên điều hành (Managing Partner)', ownership: '60%', email: 'michael@abclogistics.com', phone: '(415) 555-0182', ssn: '***-**-4812' },
  { name: 'Sofia Ramirez', initials: 'SR', role: 'Partner', roleVi: 'Thành viên góp vốn (Partner)', ownership: '40%', email: 'sofia@abclogistics.com', phone: '(415) 555-0146', ssn: '***-**-7395' },
];

export function BusinessDetail() {
  const { t, language } = useLanguage();
  const [business, setBusiness] = useState<BusinessData>(defaultBusiness);
  const [tab, setTab] = useState<string>('Overview');
  const [showEin, setShowEin] = useState(false);
  const [year, setYear] = useState('2026');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [eventList, setEventList] = useState(initialEvents);

  const tabs = [
    { id: 'Overview', label: t('tab_overview') },
    { id: 'Tax Returns', label: t('tab_tax_returns') },
    { id: 'Partners', label: t('tab_partners') },
    { id: 'Documents', label: t('tab_documents'), count: 6 },
    { id: 'Tasks', label: t('tab_tasks'), count: 3 },
    { id: 'Notes', label: t('tab_notes') },
    { id: 'Invoices', label: t('tab_invoices') },
    { id: 'Activity', label: t('tab_activity') },
  ];

  const statusLabels: Record<string, { en: string; vi: string }> = {
    'Waiting Documents': { en: 'Waiting Documents', vi: 'Chờ Giấy Tờ' },
    'In Preparation': { en: 'In Preparation', vi: 'Đang Soạn Hồ Sơ' },
    Review: { en: 'Review', vi: 'Đang Kiểm Tra' },
    'Ready to File': { en: 'Ready to File', vi: 'Sẵn Sàng Nộp' },
    Completed: { en: 'Completed', vi: 'Đã Hoàn Tất' },
    'E-Filed': { en: 'E-Filed', vi: 'Đã Nộp IRS' },
  };

  const getStatusText = (status: string) => {
    return language === 'vi' ? (statusLabels[status]?.vi || status) : (statusLabels[status]?.en || status);
  };

  const returns = [
    { year: 2026, form: business.entityType === 'Partnership' ? '1065' : '1120-S', status: business.status, federal: `$${business.federalTax.toLocaleString()}`, state: `$${business.stateTax.toLocaleString()}`, fee: `$${business.fee.toLocaleString()}` },
    { year: 2025, form: '1065', status: 'Completed', federal: '$7,240', state: '$2,130', fee: '$2,250' },
    { year: 2024, form: '1065', status: 'Completed', federal: '$6,810', state: '$1,740', fee: '$2,100' },
  ];

  const handleSaveBusiness = (updated: BusinessData) => {
    setBusiness(updated);
    const now = new Date();
    const timeString = `${now.toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · ${now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`;
    setEventList([
      {
        icon: Pencil,
        title: 'Business information updated',
        titleVi: 'Thông tin công ty đã được cập nhật',
        detail: `Status: ${updated.status} · Fee: $${updated.fee.toLocaleString()} · Entity: ${updated.entityType}`,
        detailVi: `Trạng thái: ${getStatusText(updated.status)} · Phí: $${updated.fee.toLocaleString()} · Loại hình: ${updated.entityType}`,
        actor: 'Amy Tran',
        time: timeString,
        tone: 'violet',
      },
      ...eventList,
    ]);
  };

  const balance = Math.max(0, business.fee - business.amountPaid);
  const percentCollected = business.fee > 0 ? Math.round((business.amountPaid / business.fee) * 100) : 100;

  const staffInitials = business.assignedStaff
    .split(' ')
    .map((n) => n[0])
    .join('');

  return (
    <main className="detail-shell">
      <aside className="detail-sidebar">
        <Link href="/dashboard" className="detail-brand">
          <span>E<i>✓</i></span>
          <b>EMLY <em>CUSTOMER LIST</em></b>
        </Link>
        <nav>
          <p>{t('nav_workspace')}</p>
          <Link href="/dashboard">▦ <span>{t('nav_dashboard')}</span></Link>
          <Link href="/clients">♙ <span>{t('nav_clients')}</span></Link>
          <Link className="selected" href="/businesses/abc-logistics">▣ <span>{t('nav_businesses')}</span></Link>
          <Link href="/tax-returns">▤ <span>{t('nav_tax_returns')}</span></Link>
          <Link href="/fees">$ <span>{t('nav_fees')}</span></Link>
          <Link href="/marketing">✉ <span>{t('nav_marketing_mail')}</span></Link>
        </nav>
        <div className="detail-user">
          <span>AT</span>
          <div>
            <b>Amy Tran</b>
            <small>{t('admin')}</small>
          </div>
        </div>
      </aside>

      <section className="detail-main">
        <header className="detail-topbar">
          <label>
            <Search size={15} />
            <input placeholder={t('search_placeholder')} />
          </label>
          <div className="flex items-center gap-2.5">
            <ThemeSwitcher />
            <LanguageSwitcher />

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
              className="text-xs font-bold gap-1 border-slate-300 bg-white"
            >
              <Plus size={14} /> {t('new_task')}
            </Button>
            <button className="avatar-button">AT</button>
          </div>
        </header>

        <div className="record-head">
          <div className="record-breadcrumb">
            <Link href="/businesses">{t('nav_businesses')}</Link>
            <span>/</span>
            <b>{business.name}</b>
          </div>

          <div className="record-title-row">
            <div className="business-avatar">{business.name.slice(0, 2).toUpperCase()}</div>
            <div className="record-identity">
              <div>
                <h1>{business.name}</h1>
                <span
                  className={`record-status ${
                    business.status === 'Waiting Documents'
                      ? 'waiting'
                      : business.status === 'Completed'
                      ? 'completed'
                      : 'in-prep'
                  }`}
                >
                  {getStatusText(business.status)}
                </span>
              </div>
              {business.dba && <p>DBA: {business.dba}</p>}
            </div>

            {/* ACTIVE EDIT BUTTONS */}
            <div className="record-actions">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditModalOpen(true)}
                className="gap-1.5 font-bold text-slate-800 hover:bg-slate-50 border-slate-300 cursor-pointer"
              >
                <Pencil size={14} className="text-blue-700" />
                {t('btn_edit')}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsEditModalOpen(true)}
                className="hover:bg-slate-50 border-slate-300 cursor-pointer"
              >
                <MoreHorizontal size={16} />
              </Button>
            </div>
          </div>

          <div className="record-meta">
            <div>
              <span>{t('meta_ein')}</span>
              <b>{showEin ? business.ein : `**-***${business.ein.slice(-4)}`}</b>
              <button
                onClick={() => setShowEin((v) => !v)}
                aria-label={showEin ? 'Hide EIN' : 'Show EIN'}
                className="cursor-pointer"
              >
                {showEin ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>

            <div>
              <span>{t('meta_entity_type')}</span>
              <b>{business.entityType}</b>
            </div>

            <label>
              <span>{t('meta_current_year')}</span>
              <select value={year} onChange={(e) => setYear(e.target.value)} className="cursor-pointer">
                <option>2026</option>
                <option>2025</option>
                <option>2024</option>
              </select>
              <ChevronDown size={12} />
            </label>

            <div>
              <span>{t('meta_tax_return')}</span>
              <b>{business.entityType === 'Partnership' ? 'Form 1065' : business.entityType === 'S Corporation' ? 'Form 1120-S' : 'Form 1120'}</b>
            </div>

            <div>
              <span>{t('meta_assigned_staff')}</span>
              <i className="staff-dot">{staffInitials}</i>
              <b>{business.assignedStaff}</b>
            </div>
          </div>
        </div>

        <nav className="record-tabs" aria-label="Business record sections">
          {tabs.map((item) => (
            <button
              key={item.id}
              className={tab === item.id ? 'active cursor-pointer' : 'cursor-pointer'}
              onClick={() => setTab(item.id)}
            >
              {item.label}
              {item.count && <span>{item.count}</span>}
            </button>
          ))}
        </nav>

        <div className="detail-content">
          <TabContent
            tab={tab}
            year={year}
            business={business}
            returns={returns}
            events={eventList}
            onOpenEdit={() => setIsEditModalOpen(true)}
            balance={balance}
            percentCollected={percentCollected}
            language={language}
            t={t}
            getStatusText={getStatusText}
          />
        </div>
      </section>

      {/* EDIT BUSINESS MODAL */}
      <EditBusinessModal
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        initialData={business}
        onSave={handleSaveBusiness}
      />
    </main>
  );
}

function TabContent({
  tab,
  year,
  business,
  returns,
  events,
  onOpenEdit,
  balance,
  percentCollected,
  language,
  t,
  getStatusText,
}: {
  tab: string;
  year: string;
  business: BusinessData;
  returns: any[];
  events: any[];
  onOpenEdit: () => void;
  balance: number;
  percentCollected: number;
  language: string;
  t: any;
  getStatusText: (status: string) => string;
}) {
  if (tab === 'Tax Returns') return <TaxReturns returns={returns} onOpenEdit={onOpenEdit} t={t} getStatusText={getStatusText} />;
  if (tab === 'Partners') return <Partners onOpenEdit={onOpenEdit} language={language} t={t} />;
  if (tab === 'Activity') return <ActivityTab events={events} language={language} t={t} />;
  if (tab === 'Documents')
    return (
      <SimplePanel icon={<FolderOpen />} title={t('tab_documents')} action={language === 'vi' ? 'Tải lên tài liệu' : 'Upload document'}>
        <div className="doc-list">
          {['2026 Partner Statements.pdf', '2025 Federal Return.pdf', 'California Form 565.pdf', 'Operating Agreement.pdf'].map(
            (name, i) => (
              <div key={name}>
                <span className="file-icon"><FileText size={16} /></span>
                <div>
                  <b>{name}</b>
                  <small>{i ? 'PDF · 1.8 MB' : 'PDF · 842 KB'} · {language === 'vi' ? `Cập nhật ngày ${23 - i} Tháng 8, 2026` : `Updated Aug ${23 - i}, 2026`}</small>
                </div>
                <Button variant="ghost" size="icon"><Download size={15} /></Button>
              </div>
            )
          )}
        </div>
      </SimplePanel>
    );
  if (tab === 'Tasks')
    return (
      <SimplePanel icon={<ClipboardCheck />} title={t('tab_tasks')} action={language === 'vi' ? 'Thêm đầu việc' : 'Add task'}>
        <div className="task-list">
          {[
            { en: 'Collect remaining K-1 statements', vi: 'Thu thập đủ bảng kê K-1 của các thành viên' },
            { en: 'Confirm California mailing address', vi: 'Xác nhận lại địa chỉ nhận thư tại California' },
            { en: 'Review 2026 estimated payments', vi: 'Kiểm tra các khoản thuế tạm nộp ước tính 2026' }
          ].map(
            (task, i) => (
              <label key={task.en}>
                <input type="checkbox" />
                <span>
                  <b>{language === 'vi' ? task.vi : task.en}</b>
                  <small>{language === 'vi' ? `Hạn: ${4 + i * 2}/09/2026` : `Due Sep ${4 + i * 2}, 2026`} · {business.assignedStaff}</small>
                </span>
              </label>
            )
          )}
        </div>
      </SimplePanel>
    );
  if (tab === 'Notes')
    return (
      <SimplePanel icon={<NotebookPen />} title={t('tab_notes')} action={language === 'vi' ? 'Thêm ghi chú' : 'Add note'}>
        <div className="note-card">
          <p>{language === 'vi' ? 'Đang đợi thêm 2 bản kê K-1. Khách hàng cam kết sẽ gửi trước ngày 04/09.' : 'Waiting for two remaining K-1 statements. Client confirmed they expect both by September 4.'}</p>
          <span>{business.assignedStaff} · {language === 'vi' ? '25 Tháng 8, 2026 lúc 11:20 SA' : 'Aug 25, 2026 at 11:20 AM'}</span>
        </div>
      </SimplePanel>
    );
  if (tab === 'Invoices')
    return (
      <SimplePanel icon={<ReceiptText />} title={t('tab_invoices')} action={language === 'vi' ? 'Tạo hóa đơn mới' : 'Create invoice'}>
        <div className="invoice-row">
          <div>
            <b>INV-2026-0042</b>
            <span>2026 {business.entityType} {language === 'vi' ? 'Phí dịch vụ khai thuế' : 'Tax Preparation'}</span>
          </div>
          <strong>${business.fee.toLocaleString()}.00</strong>
          <span className="invoice-status">{balance === 0 ? (language === 'vi' ? 'Đã thu đủ 100%' : 'Paid in Full') : (language === 'vi' ? 'Đã thu một phần' : 'Partially Paid')}</span>
          <small>{language === 'vi' ? 'Số tiền còn nợ:' : 'Balance'} ${balance.toLocaleString()}.00</small>
        </div>
      </SimplePanel>
    );
  return (
    <Overview
      year={year}
      business={business}
      returns={returns}
      events={events}
      onOpenEdit={onOpenEdit}
      balance={balance}
      percentCollected={percentCollected}
      language={language}
      t={t}
      getStatusText={getStatusText}
    />
  );
}

function Overview({
  year,
  business,
  returns,
  events,
  onOpenEdit,
  balance,
  percentCollected,
  language,
  t,
  getStatusText,
}: {
  year: string;
  business: BusinessData;
  returns: any[];
  events: any[];
  onOpenEdit: () => void;
  balance: number;
  percentCollected: number;
  language: string;
  t: any;
  getStatusText: (status: string) => string;
}) {
  return (
    <>
      <section className="metric-row">
        <Metric title={t('metric_federal_tax')} value={`$${business.federalTax.toLocaleString()}.00`} note={`${year} Form 1065`} icon={<ShieldCheck />} tone="blue" />
        <Metric title={t('metric_state_tax')} value={`$${business.stateTax.toLocaleString()}.00`} note="CA · AZ · NY" icon={<MapPin />} tone="violet" />
        <Metric title={t('metric_prep_fee')} value={`$${business.fee.toLocaleString()}.00`} note={t('metric_current_eng')} icon={<ReceiptText />} tone="amber" />
        <Metric title={t('metric_amount_paid')} value={`$${business.amountPaid.toLocaleString()}.00`} note={`${percentCollected}% ${t('metric_collected')}`} icon={<Check />} tone="green" />
        <Metric title={t('metric_balance')} value={`$${balance.toLocaleString()}.00`} note={t('metric_due_date')} icon={<CircleDollarSign />} tone="red" />
      </section>

      <div className="overview-grid">
        <section className="detail-panel">
          <PanelHeading title={t('history_title')} sub={t('history_sub')} action={t('view_all')} onAction={onOpenEdit} />
          <ReturnTable returns={returns} compact t={t} getStatusText={getStatusText} />
        </section>

        <section className="detail-panel contact-panel">
          <PanelHeading title={t('details_title')} sub={t('details_sub')} action={t('btn_edit')} onAction={onOpenEdit} />
          <div className="contact-list">
            <Info icon={<Mail />} label={t('lbl_email')} value={business.email} />
            <Info icon={<Phone />} label={t('lbl_phone')} value={business.phone} />
            <Info icon={<MapPin />} label={t('lbl_address')} value={business.address} />
            <Info icon={<CalendarDays />} label={t('lbl_client_since')} value={language === 'vi' ? '12 Tháng 8, 2024' : 'August 12, 2024'} />
            <Info icon={<UserRound />} label={t('lbl_primary_contact')} value={business.primaryContact} />
          </div>
        </section>
      </div>

      <section className="detail-panel mini-activity">
        <PanelHeading title={t('activity_title')} sub={t('activity_sub')} action={t('view_all')} />
        <div>{events.slice(0, 4).map((e) => EventRow(e, language))}</div>
      </section>
    </>
  );
}

function TaxReturns({ returns, onOpenEdit, t, getStatusText }: { returns: any[]; onOpenEdit: () => void; t: any; getStatusText: (status: string) => string }) {
  return (
    <section className="detail-panel">
      <PanelHeading title={t('history_title')} sub={t('history_sub')} action={t('btn_add_return')} onAction={onOpenEdit} />
      <ReturnTable returns={returns} t={t} getStatusText={getStatusText} />
    </section>
  );
}

function ReturnTable({ returns, compact = false, t, getStatusText }: { returns: any[]; compact?: boolean; t: any; getStatusText: (status: string) => string }) {
  return (
    <div className="returns-table">
      <div className="return-head">
        <span>{t('th_tax_year')}</span>
        <span>{t('th_return')}</span>
        <span>{t('th_status')}</span>
        <span>{t('th_federal')}</span>
        <span>{t('th_state')}</span>
        <span>{t('th_fee')}</span>
        <span />
      </div>
      {returns.slice(0, compact ? 3 : returns.length).map((row) => (
        <div className="return-row" key={row.year}>
          <b>{row.year}</b>
          <span className="form-tag">Form {row.form}</span>
          <span className={`return-status ${row.status === 'Completed' ? 'completed' : 'waiting'}`}>
            <i />
            {getStatusText(row.status)}
          </span>
          <span>{row.federal}</span>
          <span>{row.state}</span>
          <b>{row.fee}</b>
          <Button variant="ghost" size="icon"><MoreHorizontal size={15} /></Button>
        </div>
      ))}
    </div>
  );
}

function Partners({ onOpenEdit, language, t }: { onOpenEdit: () => void; language: string; t: any }) {
  return (
    <section className="detail-panel">
      <PanelHeading title={t('tab_partners')} sub={language === 'vi' ? 'Tỷ lệ sở hữu và thông tin liên hệ các thành viên' : 'Ownership and contact information'} action={language === 'vi' ? 'Thêm thành viên' : 'Add partner'} onAction={onOpenEdit} />
      <div className="partner-cards">
        {partners.map((partner) => (
          <article key={partner.name}>
            <header>
              <span>{partner.initials}</span>
              <div>
                <h3>{partner.name}</h3>
                <p>{language === 'vi' ? partner.roleVi : partner.role}</p>
              </div>
              <Button variant="ghost" size="icon"><MoreHorizontal size={15} /></Button>
            </header>
            <div>
              <Info icon={<CircleDollarSign />} label={language === 'vi' ? 'Tỷ lệ sở hữu' : 'Ownership'} value={partner.ownership} />
              <Info icon={<ShieldCheck />} label="SSN" value={partner.ssn} />
              <Info icon={<Mail />} label={t('lbl_email')} value={partner.email} />
              <Info icon={<Phone />} label={t('lbl_phone')} value={partner.phone} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ActivityTab({ events, language, t }: { events: any[]; language: string; t: any }) {
  return (
    <section className="detail-panel">
      <PanelHeading title={t('tab_activity')} sub={t('activity_sub')} action={language === 'vi' ? 'Lọc' : 'Filter'} />
      <div className="activity-timeline">{events.map((e) => EventRow(e, language))}</div>
    </section>
  );
}

function EventRow(event: typeof initialEvents[number], language: string) {
  const Icon = event.icon;
  return (
    <div className="event-row" key={event.title + event.time}>
      <span className={`event-icon ${event.tone}`}>
        <Icon size={14} />
      </span>
      <div>
        <b>{language === 'vi' ? event.titleVi : event.title}</b>
        <p>{language === 'vi' ? event.detailVi : event.detail}</p>
        <small>{event.actor} · {event.time}</small>
      </div>
    </div>
  );
}

function Metric({
  title,
  value,
  note,
  icon,
  tone,
}: {
  title: string;
  value: string;
  note: string;
  icon: React.ReactNode;
  tone: string;
}) {
  return (
    <article className="detail-metric">
      <span className={tone}>{icon}</span>
      <p>{title}</p>
      <h2>{value}</h2>
      <small>{note}</small>
    </article>
  );
}

function PanelHeading({
  title,
  sub,
  action,
  onAction,
}: {
  title: string;
  sub: string;
  action: string;
  onAction?: () => void;
}) {
  return (
    <header className="detail-panel-head">
      <div>
        <h2>{title}</h2>
        <p>{sub}</p>
      </div>
      <Button variant="ghost" size="sm" onClick={onAction} className="cursor-pointer">
        {action}
        <span>→</span>
      </Button>
    </header>
  );
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="info-row">
      <span>{icon}</span>
      <div>
        <small>{label}</small>
        <b>{value}</b>
      </div>
    </div>
  );
}

function SimplePanel({
  icon,
  title,
  action,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  action: string;
  children: React.ReactNode;
}) {
  return (
    <section className="detail-panel simple-panel">
      <div className="simple-title">
        <span>{icon}</span>
        <h2>{title}</h2>
        <Button size="sm"><Plus size={14} />{action}</Button>
      </div>
      {children}
    </section>
  );
}
