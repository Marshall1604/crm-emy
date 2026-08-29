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
import { EditBusinessModal, type BusinessData } from './edit-business-modal';

const tabs = ['Overview', 'Tax Returns', 'Partners', 'Documents', 'Tasks', 'Notes', 'Invoices', 'Activity'] as const;
type Tab = typeof tabs[number];

const defaultBusiness: BusinessData = {
  name: 'ABC Logistics LLC',
  dba: 'ABC Freight & Logistics',
  ein: '12-3456789',
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
  { icon: Plus, title: 'Client created', detail: 'ABC Logistics LLC was added to the workspace', actor: 'Amy Tran', time: 'Aug 12, 2026 · 9:14 AM', tone: 'blue' },
  { icon: Pencil, title: 'Business information edited', detail: 'Phone number and mailing address updated', actor: 'Amy Tran', time: 'Aug 18, 2026 · 2:32 PM', tone: 'violet' },
  { icon: Activity, title: 'Status changed', detail: 'New → Waiting Documents', actor: 'Daniel Lee', time: 'Aug 20, 2026 · 10:05 AM', tone: 'amber' },
  { icon: Upload, title: 'Document uploaded', detail: '2026_Partner_Statements.pdf', actor: 'Michael Chen', time: 'Aug 23, 2026 · 4:48 PM', tone: 'green' },
  { icon: NotebookPen, title: 'Note added', detail: 'Waiting for two remaining K-1 statements.', actor: 'Daniel Lee', time: 'Aug 25, 2026 · 11:20 AM', tone: 'violet' },
  { icon: CircleDollarSign, title: 'Preparation fee changed', detail: 'Fee updated from $2,250 to $2,400', actor: 'Amy Tran', time: 'Aug 28, 2026 · 8:41 AM', tone: 'green' },
];

const partners = [
  { name: 'Michael Chen', initials: 'MC', role: 'Managing Partner', ownership: '60%', email: 'michael@abclogistics.com', phone: '(415) 555-0182', ssn: '***-**-4812' },
  { name: 'Sofia Ramirez', initials: 'SR', role: 'Partner', ownership: '40%', email: 'sofia@abclogistics.com', phone: '(415) 555-0146', ssn: '***-**-7395' },
];

export function BusinessDetail() {
  const [business, setBusiness] = useState<BusinessData>(defaultBusiness);
  const [tab, setTab] = useState<Tab>('Overview');
  const [showEin, setShowEin] = useState(false);
  const [year, setYear] = useState('2026');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [eventList, setEventList] = useState(initialEvents);

  const returns = [
    { year: 2026, form: business.entityType === 'Partnership' ? '1065' : '1120-S', status: business.status, federal: `$${business.federalTax.toLocaleString()}`, state: `$${business.stateTax.toLocaleString()}`, fee: `$${business.fee.toLocaleString()}` },
    { year: 2025, form: '1065', status: 'Completed', federal: '$7,240', state: '$2,130', fee: '$2,250' },
    { year: 2024, form: '1065', status: 'Completed', federal: '$6,810', state: '$1,740', fee: '$2,100' },
  ];

  const handleSaveBusiness = (updated: BusinessData) => {
    setBusiness(updated);
    // Add activity log
    const now = new Date();
    const timeString = `${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`;
    setEventList([
      {
        icon: Pencil,
        title: 'Business information updated',
        detail: `Status: ${updated.status} · Fee: $${updated.fee.toLocaleString()} · Entity: ${updated.entityType}`,
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
          <span>C<i>✓</i></span>
          <b>CRM <em>EMY</em></b>
        </Link>
        <nav>
          <p>WORKSPACE</p>
          <Link href="/dashboard">▦ <span>Dashboard</span></Link>
          <Link href="/clients">♙ <span>Clients</span></Link>
          <Link className="selected" href="/businesses/abc-logistics">▣ <span>Businesses</span></Link>
          <Link href="/tax-returns">▤ <span>Tax Returns</span></Link>
          <Link href="/fees">$ <span>Fees</span></Link>
        </nav>
        <div className="detail-user">
          <span>AT</span>
          <div>
            <b>Amy Tran</b>
            <small>Administrator</small>
          </div>
        </div>
      </aside>

      <section className="detail-main">
        <header className="detail-topbar">
          <label>
            <Search size={15} />
            <input placeholder="Search clients, cases, EIN..." />
          </label>
          <div>
            <Button variant="outline" size="sm">
              <Plus size={14} /> New task
            </Button>
            <button className="avatar-button">AT</button>
          </div>
        </header>

        <div className="record-head">
          <div className="record-breadcrumb">
            <Link href="/businesses">Businesses</Link>
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
                  {business.status}
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
                Edit
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
              <span>EIN</span>
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
              <span>Entity Type</span>
              <b>{business.entityType}</b>
            </div>

            <label>
              <span>Current Tax Year</span>
              <select value={year} onChange={(e) => setYear(e.target.value)} className="cursor-pointer">
                <option>2026</option>
                <option>2025</option>
                <option>2024</option>
              </select>
              <ChevronDown size={12} />
            </label>

            <div>
              <span>Tax Return</span>
              <b>{business.entityType === 'Partnership' ? 'Form 1065' : business.entityType === 'S Corporation' ? 'Form 1120-S' : 'Form 1120'}</b>
            </div>

            <div>
              <span>Assigned Staff</span>
              <i className="staff-dot">{staffInitials}</i>
              <b>{business.assignedStaff}</b>
            </div>
          </div>
        </div>

        <nav className="record-tabs" aria-label="Business record sections">
          {tabs.map((item) => (
            <button
              key={item}
              className={tab === item ? 'active cursor-pointer' : 'cursor-pointer'}
              onClick={() => setTab(item)}
            >
              {item}
              {item === 'Documents' && <span>6</span>}
              {item === 'Tasks' && <span>3</span>}
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
}: {
  tab: Tab;
  year: string;
  business: BusinessData;
  returns: any[];
  events: any[];
  onOpenEdit: () => void;
  balance: number;
  percentCollected: number;
}) {
  if (tab === 'Tax Returns') return <TaxReturns returns={returns} onOpenEdit={onOpenEdit} />;
  if (tab === 'Partners') return <Partners onOpenEdit={onOpenEdit} />;
  if (tab === 'Activity') return <ActivityTab events={events} />;
  if (tab === 'Documents')
    return (
      <SimplePanel icon={<FolderOpen />} title="Documents" action="Upload document">
        <div className="doc-list">
          {['2026 Partner Statements.pdf', '2025 Federal Return.pdf', 'California Form 565.pdf', 'Operating Agreement.pdf'].map(
            (name, i) => (
              <div key={name}>
                <span className="file-icon"><FileText size={16} /></span>
                <div>
                  <b>{name}</b>
                  <small>{i ? 'PDF · 1.8 MB' : 'PDF · 842 KB'} · Updated Aug {23 - i}, 2026</small>
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
      <SimplePanel icon={<ClipboardCheck />} title="Open tasks" action="Add task">
        <div className="task-list">
          {['Collect remaining K-1 statements', 'Confirm California mailing address', 'Review 2026 estimated payments'].map(
            (task, i) => (
              <label key={task}>
                <input type="checkbox" />
                <span>
                  <b>{task}</b>
                  <small>Due Sep {4 + i * 2}, 2026 · {business.assignedStaff}</small>
                </span>
              </label>
            )
          )}
        </div>
      </SimplePanel>
    );
  if (tab === 'Notes')
    return (
      <SimplePanel icon={<NotebookPen />} title="Internal notes" action="Add note">
        <div className="note-card">
          <p>Waiting for two remaining K-1 statements. Client confirmed they expect both by September 4.</p>
          <span>{business.assignedStaff} · Aug 25, 2026 at 11:20 AM</span>
        </div>
      </SimplePanel>
    );
  if (tab === 'Invoices')
    return (
      <SimplePanel icon={<ReceiptText />} title="Invoices" action="Create invoice">
        <div className="invoice-row">
          <div>
            <b>INV-2026-0042</b>
            <span>2026 {business.entityType} Tax Preparation</span>
          </div>
          <strong>${business.fee.toLocaleString()}.00</strong>
          <span className="invoice-status">{balance === 0 ? 'Paid in Full' : 'Partially Paid'}</span>
          <small>Balance ${balance.toLocaleString()}.00</small>
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
}: {
  year: string;
  business: BusinessData;
  returns: any[];
  events: any[];
  onOpenEdit: () => void;
  balance: number;
  percentCollected: number;
}) {
  return (
    <>
      <section className="metric-row">
        <Metric title="Federal Tax" value={`$${business.federalTax.toLocaleString()}.00`} note={`${year} Form 1065`} icon={<ShieldCheck />} tone="blue" />
        <Metric title="State Tax" value={`$${business.stateTax.toLocaleString()}.00`} note="CA · AZ · NY" icon={<MapPin />} tone="violet" />
        <Metric title="Preparation Fee" value={`$${business.fee.toLocaleString()}.00`} note="Current engagement" icon={<ReceiptText />} tone="amber" />
        <Metric title="Amount Paid" value={`$${business.amountPaid.toLocaleString()}.00`} note={`${percentCollected}% collected`} icon={<Check />} tone="green" />
        <Metric title="Balance" value={`$${balance.toLocaleString()}.00`} note="Due Sep 15, 2026" icon={<CircleDollarSign />} tone="red" />
      </section>

      <div className="overview-grid">
        <section className="detail-panel">
          <PanelHeading title="Tax return history" sub="Multiple filing years for this business" action="View all" onAction={onOpenEdit} />
          <ReturnTable returns={returns} compact />
        </section>

        <section className="detail-panel contact-panel">
          <PanelHeading title="Business details" sub="Primary contact information" action="Edit" onAction={onOpenEdit} />
          <div className="contact-list">
            <Info icon={<Mail />} label="Email" value={business.email} />
            <Info icon={<Phone />} label="Phone" value={business.phone} />
            <Info icon={<MapPin />} label="Address" value={business.address} />
            <Info icon={<CalendarDays />} label="Client since" value="August 12, 2024" />
            <Info icon={<UserRound />} label="Primary contact" value={business.primaryContact} />
          </div>
        </section>
      </div>

      <section className="detail-panel mini-activity">
        <PanelHeading title="Recent activity" sub="Latest changes to this client" action="View activity" />
        <div>{events.slice(0, 4).map(EventRow)}</div>
      </section>
    </>
  );
}

function TaxReturns({ returns, onOpenEdit }: { returns: any[]; onOpenEdit: () => void }) {
  return (
    <section className="detail-panel">
      <PanelHeading title="Tax return history" sub="All filing years and return statuses" action="Add tax return" onAction={onOpenEdit} />
      <ReturnTable returns={returns} />
    </section>
  );
}

function ReturnTable({ returns, compact = false }: { returns: any[]; compact?: boolean }) {
  return (
    <div className="returns-table">
      <div className="return-head">
        <span>Tax year</span>
        <span>Return</span>
        <span>Status</span>
        <span>Federal tax</span>
        <span>State tax</span>
        <span>Fee</span>
        <span />
      </div>
      {returns.slice(0, compact ? 3 : returns.length).map((row) => (
        <div className="return-row" key={row.year}>
          <b>{row.year}</b>
          <span className="form-tag">Form {row.form}</span>
          <span className={`return-status ${row.status === 'Completed' ? 'completed' : 'waiting'}`}>
            <i />
            {row.status}
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

function Partners({ onOpenEdit }: { onOpenEdit: () => void }) {
  return (
    <section className="detail-panel">
      <PanelHeading title="Partners / Owners" sub="Ownership and contact information" action="Add partner" onAction={onOpenEdit} />
      <div className="partner-cards">
        {partners.map((partner) => (
          <article key={partner.name}>
            <header>
              <span>{partner.initials}</span>
              <div>
                <h3>{partner.name}</h3>
                <p>{partner.role}</p>
              </div>
              <Button variant="ghost" size="icon"><MoreHorizontal size={15} /></Button>
            </header>
            <div>
              <Info icon={<CircleDollarSign />} label="Ownership" value={partner.ownership} />
              <Info icon={<ShieldCheck />} label="SSN" value={partner.ssn} />
              <Info icon={<Mail />} label="Email" value={partner.email} />
              <Info icon={<Phone />} label="Phone" value={partner.phone} />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ActivityTab({ events }: { events: any[] }) {
  return (
    <section className="detail-panel">
      <PanelHeading title="Activity timeline" sub="Complete audit history for this business" action="Filter" />
      <div className="activity-timeline">{events.map(EventRow)}</div>
    </section>
  );
}

function EventRow(event: typeof initialEvents[number]) {
  const Icon = event.icon;
  return (
    <div className="event-row" key={event.title + event.time}>
      <span className={`event-icon ${event.tone}`}>
        <Icon size={14} />
      </span>
      <div>
        <b>{event.title}</b>
        <p>{event.detail}</p>
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
