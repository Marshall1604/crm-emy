'use client';
import * as XLSX from 'xlsx';

import Link from 'next/link';
import { useMemo, useState, useEffect, useRef } from 'react';
import {
  AlertTriangle,
  CheckSquare,
  ChevronDown,
  Download,
  ExternalLink,
  MoreHorizontal,
  Plus,
  RotateCcw,
  Search,
  Square,
  Trash2,
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
import { Input } from '@/components/ui/input';
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
    name: 'Sophia Garcia',      initials: 'SG',   updated: 'Aug 24, 2026',
    firstName: 'Sophia',        lastName: 'Garcia', middleName: '',
    ssn: '602-55-7890',         dob: '1975-12-01',   filingStatus: 'married_separately',
    phone: '(602) 555-0141',    email: 'sophia.g@example.com',
    address: '654 Desert Rd',   city: 'Phoenix', state: 'AZ', zip: '85001',
    spouseFirstName: 'Carlos', spouseLastName: 'Garcia', spouseSsn: '602-55-7891', spouseDob: '1973-06-15',
    year: '2025', returnType: '1040', status: 'Completed', staff: 'Daniel Lee',
    federalTax: 4200, fee: 600, amountPaid: 600, balance: 0,
    stateTaxes: [{ state: 'AZ', amount: 630 }],
    dependents: [],
    notes: 'Filing separately per client request. All docs received.',
  },
];

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
  'Rejected',
  'Extension Filed',
  'Completed',
];

export function ClientsList() {
  const [clientList, setClientList] = useState<ClientRecord[]>(defaultSampleClients);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [year, setYear] = useState('');
  const [status, setStatus] = useState('');
  const [staff, setStaff] = useState('');

  // Dropdown action menu state
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Selected IDs for batch operations
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'single' | 'batch';
    client?: ClientRecord;
    count?: number;
  } | null>(null);

  // Close action dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = useMemo(
    () =>
      clientList.filter(
        (c) =>
          (!search || c.name.toLowerCase().includes(search.toLowerCase())) &&
          (!year || c.year === year) &&
          (!status || c.status === status) &&
          (!staff || c.staff === staff)
      ),
    [clientList, search, year, status, staff]
  );

  const allFilteredSelected =
    filtered.length > 0 && filtered.every((c) => selectedIds.has(c.id));
  const someFilteredSelected =
    filtered.some((c) => selectedIds.has(c.id)) && !allFilteredSelected;

  const toggleSelectAll = () => {
    if (allFilteredSelected) {
      const next = new Set(selectedIds);
      filtered.forEach((c) => next.delete(c.id));
      setSelectedIds(next);
    } else {
      const next = new Set(selectedIds);
      filtered.forEach((c) => next.add(c.id));
      setSelectedIds(next);
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

  const reset = () => {
    setSearch('');
    setYear('');
    setStatus('');
    setStaff('');
  };

  // Load from Supabase on mount if configured
  useEffect(() => {
    async function loadSupabaseData() {
      if (!isSupabaseConfigured) return;
      const remoteClients = await fetchClientsFromSupabase();
      if (remoteClients && remoteClients.length > 0) {
        setClientList(remoteClients);
      }
    }
    loadSupabaseData();
  }, []);

  const handleClientCreated = (newClient: ClientRecord) => {
    setClientList((prev) => [newClient, ...prev]);
    if (isSupabaseConfigured) {
      saveClientToSupabase(newClient);
    }
  };

  const openDeleteSingle = (client: ClientRecord) => {
    setActiveMenuId(null);
    setDeleteTarget({ type: 'single', client });
  };

  const openDeleteBatch = () => {
    setDeleteTarget({ type: 'batch', count: selectedIds.size });
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'single' && deleteTarget.client) {
      const targetId = deleteTarget.client.id;
      setClientList((prev) => prev.filter((c) => c.id !== targetId));
      if (isSupabaseConfigured) {
        deleteClientFromSupabase(targetId);
      }
      setSelectedIds((prev) => {
        const next = new Set(prev);
        next.delete(targetId);
        return next;
      });
    } else if (deleteTarget.type === 'batch') {
      const toDelete = Array.from(selectedIds);
      setClientList((prev) => prev.filter((c) => !selectedIds.has(c.id)));
      if (isSupabaseConfigured) {
        toDelete.forEach((id) => deleteClientFromSupabase(id));
      }
      setSelectedIds(new Set());
    }

    setDeleteTarget(null);
  };

  const restoreDefaultSample = () => {
    setClientList(defaultSampleClients);
    setSelectedIds(new Set());
  };

  const exportToExcel = () => {
    const filingStatusLabel: Record<string, string> = {
      single: 'Single',
      married_jointly: 'Married Filing Jointly',
      married_separately: 'Married Filing Separately',
      head_of_household: 'Head of Household',
      qualifying_surviving_spouse: 'Qualifying Surviving Spouse',
    };

    const rows = filtered.map((c) => {
      // Flatten stateTaxes into up to 5 columns
      const stateCols: Record<string, string | number> = {};
      (c.stateTaxes ?? []).forEach((st, i) => {
        stateCols[`State Tax ${i + 1} - State`]  = st.state;
        stateCols[`State Tax ${i + 1} - Amount`] = st.amount;
      });

      return {
        // ── Identity ──────────────────────────────
        'Full Name':            c.name,
        'First Name':           c.firstName,
        'Middle Name':          c.middleName || '',
        'Last Name':            c.lastName,
        'SSN':                  c.ssn,
        'Date of Birth':        c.dob,
        'Filing Status':        filingStatusLabel[c.filingStatus] ?? c.filingStatus,

        // ── Contact ───────────────────────────────
        'Phone':                c.phone,
        'Email':                c.email,

        // ── Address ───────────────────────────────
        'Street Address':       c.address,
        'City':                 c.city,
        'State':                c.state,
        'ZIP Code':             c.zip,

        // ── Spouse ────────────────────────────────
        'Spouse First Name':    c.spouseFirstName || '',
        'Spouse Last Name':     c.spouseLastName  || '',
        'Spouse SSN':           c.spouseSsn       || '',
        'Spouse Date of Birth': c.spouseDob       || '',

        // ── Tax Case ──────────────────────────────
        'Tax Year':             c.year,
        'Return Type':          c.returnType,
        'Workflow Status':      c.status,
        'Assigned Staff':       c.staff,

        // ── Financials ────────────────────────────
        'Federal Tax ($)':      c.federalTax ?? 0,
        'Preparation Fee ($)':  c.fee,
        'Amount Paid ($)':      c.amountPaid ?? 0,
        'Balance Due ($)':      c.balance,

        // ── State Taxes (dynamic) ─────────────────
        ...stateCols,

        // ── Notes ─────────────────────────────────
        'Internal Notes':       c.notes || '',

        // ── Meta ──────────────────────────────────
        'Last Updated':         c.updated,
      };
    });

    const ws = XLSX.utils.json_to_sheet(rows);

    // Auto column widths
    const allKeys = rows.length > 0 ? Object.keys(rows[0]) : [];
    ws['!cols'] = allKeys.map((key) => ({
      wch: Math.max(key.length, ...rows.map((r) => String(r[key as keyof typeof r] ?? '').length)) + 2,
    }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Clients');

    const date = new Date().toISOString().slice(0, 10);
    XLSX.writeFile(wb, `CRM-EMY-Clients-${date}.xlsx`);
  };


  return (
    <main className="clients-page">
      <header className="clients-head">
        <div>
          <span>
            <UsersRound size={19} />
          </span>
          <div>
            <p>TAX CRM</p>
            <h1>Clients</h1>
            <small>Manage individual taxpayers and their annual returns.</small>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {clientList.length < defaultSampleClients.length && (
            <Button variant="outline" onClick={restoreDefaultSample} title="Restore default sample clients">
              <RotateCcw size={13} />
              Restore Samples
            </Button>
          )}
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus size={14} />
            Add Client
          </Button>
        </div>
      </header>

      <section className="clients-filter">
        <label className="clients-search">
          <Search size={14} />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name..."
          />
        </label>
        <Select label="Tax Year" value={year} setValue={setYear} options={['2026', '2025', '2024']} />
        <Select label="Status" value={status} setValue={setStatus} options={statuses} />
        <Select
          label="Assigned Staff"
          value={staff}
          setValue={setStaff}
          options={['Amy Tran', 'Daniel Lee', 'Sarah Kim']}
        />
        <Button variant="ghost" size="sm" onClick={reset}>
          <RotateCcw size={13} />
          Reset
        </Button>
      </section>

      <section className="clients-table-card">
        {selectedIds.size > 0 ? (
          <div
            style={{
              height: '46px',
              padding: '0 16px',
              backgroundColor: '#fff5f5',
              borderBottom: '1px solid #fed7aa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span
                style={{
                  color: '#991b1b',
                  fontWeight: 600,
                  fontSize: '11px',
                  letterSpacing: '0.2px',
                }}
              >
                Selected <b style={{ color: '#b91c1c' }}>{selectedIds.size}</b> of {clientList.length} clients
              </span>
              <button
                type="button"
                onClick={() => setSelectedIds(new Set())}
                style={{
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  color: '#64748b',
                  fontSize: '10px',
                  fontWeight: 600,
                  borderRadius: '4px',
                  padding: '3px 8px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  lineHeight: 1,
                }}
              >
                <X size={11} />
                Deselect
              </button>
            </div>

            <Button
              variant="destructive"
              size="sm"
              onClick={openDeleteBatch}
              style={{
                backgroundColor: '#dc2626',
                color: '#ffffff',
                height: '30px',
                padding: '0 12px',
                fontSize: '11px',
                fontWeight: 600,
                borderRadius: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <Trash2 size={12} />
              Delete ({selectedIds.size}) Selected
            </Button>
          </div>
        ) : (
          <header>
            <div>
              <b>Individual Tax Clients</b>
              <span>{filtered.length} clients</span>
            </div>
            <Button variant="outline" size="sm" onClick={exportToExcel} disabled={filtered.length === 0}>
              <Download size={13} /> Export
            </Button>
          </header>
        )}

        <div className="clients-table-wrap" ref={menuRef}>
          <table>
            <thead>
              <tr>
                <th style={{ width: '36px', paddingLeft: '14px', paddingRight: '6px', textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={toggleSelectAll}
                    style={{
                      border: 0,
                      background: 'none',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: allFilteredSelected ? '#092c5c' : someFilteredSelected ? '#2563eb' : '#94a3b8',
                      padding: 0,
                    }}
                    title={allFilteredSelected ? 'Deselect all' : 'Select all'}
                    aria-label="Select all rows"
                  >
                    {allFilteredSelected ? <CheckSquare size={15} /> : <Square size={15} />}
                  </button>
                </th>
                <th>CLIENT NAME</th>
                <th>PHONE</th>
                <th>EMAIL</th>
                <th>TAX YEAR</th>
                <th>RETURN TYPE</th>
                <th>STATUS</th>
                <th>ASSIGNED STAFF</th>
                <th>PREPARATION FEE</th>
                <th>BALANCE</th>
                <th>LAST UPDATED</th>
                <th style={{ width: '48px', textAlign: 'center' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => {
                const isSelected = selectedIds.has(c.id);
                const isMenuOpen = activeMenuId === c.id;

                return (
                  <tr
                    key={c.id}
                    style={{
                      backgroundColor: isSelected ? '#f8fafc' : undefined,
                      transition: 'background-color 0.15s ease',
                    }}
                  >
                    <td style={{ width: '36px', paddingLeft: '14px', paddingRight: '6px', textAlign: 'center' }}>
                      <button
                        type="button"
                        onClick={() => toggleSelectOne(c.id)}
                        style={{
                          border: 0,
                          background: 'none',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isSelected ? '#092c5c' : '#cbd5e1',
                          padding: 0,
                        }}
                        aria-label={`Select ${c.name}`}
                      >
                        {isSelected ? <CheckSquare size={15} /> : <Square size={15} />}
                      </button>
                    </td>
                    <td>
                      <Link
                        href={`/clients/${c.id}`}
                        style={{
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                        }}
                      >
                        <b
                          style={{
                            fontSize: '11px',
                            fontWeight: 650,
                            color: '#172033',
                          }}
                        >
                          {c.name}
                        </b>
                      </Link>
                    </td>
                    <td>{c.phone}</td>
                    <td>{c.email}</td>
                    <td>
                      <b>{c.year}</b>
                    </td>
                    <td>
                      <span className="client-return">{c.returnType}</span>
                    </td>
                    <td>
                      <span className={`tax-status ${c.status.toLowerCase().replaceAll(' ', '-')}`}>
                        <i />
                        {c.status}
                      </span>
                    </td>
                    <td>
                      <span className="staff-mini">
                        {c.staff
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </span>
                      {c.staff}
                    </td>
                    <td>
                      <b>${c.fee.toLocaleString()}</b>
                    </td>
                    <td className={c.balance ? 'client-balance' : ''}>
                      ${c.balance.toLocaleString()}
                    </td>
                    <td>{c.updated}</td>
                    <td style={{ position: 'relative', textAlign: 'center' }}>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(isMenuOpen ? null : c.id);
                        }}
                        aria-label="Row actions"
                        style={{
                          backgroundColor: isMenuOpen ? '#f1f5f9' : undefined,
                        }}
                      >
                        <MoreHorizontal size={15} />
                      </Button>

                      {/* Dropdown Action Menu */}
                      {isMenuOpen && (
                        <div
                          style={{
                            position: 'absolute',
                            right: '12px',
                            top: '42px',
                            zIndex: 50,
                            minWidth: '160px',
                            backgroundColor: '#ffffff',
                            borderRadius: '8px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
                            padding: '4px',
                            textAlign: 'left',
                          }}
                        >
                          <Link
                            href={`/clients/${c.id}`}
                            onClick={() => setActiveMenuId(null)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              padding: '8px 12px',
                              fontSize: '12px',
                              color: '#334155',
                              textDecoration: 'none',
                              borderRadius: '6px',
                              fontWeight: 500,
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                          >
                            <ExternalLink size={14} color="#64748b" />
                            <span>View Details</span>
                          </Link>

                          <div style={{ height: '1px', backgroundColor: '#f1f5f9', margin: '4px 0' }} />

                          <button
                            type="button"
                            onClick={() => openDeleteSingle(c)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              width: '100%',
                              padding: '8px 12px',
                              fontSize: '12px',
                              color: '#e11d48',
                              border: 0,
                              background: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontWeight: 600,
                              textAlign: 'left',
                            }}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fff1f2')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                          >
                            <Trash2 size={14} color="#e11d48" />
                            <span>Delete Client</span>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {!filtered.length && (
            <div className="clients-empty" style={{ padding: '48px 24px', textAlign: 'center' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: '#f1f5f9',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px',
                  color: '#64748b',
                }}
              >
                <Search size={24} />
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px', color: '#1e293b' }}>
                No clients found
              </h3>
              <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 16px' }}>
                {clientList.length === 0
                  ? 'All clients have been deleted. You can add new clients or restore sample data.'
                  : 'Try changing or resetting your filters.'}
              </p>
              {clientList.length === 0 && (
                <Button variant="outline" size="sm" onClick={restoreDefaultSample}>
                  <RotateCcw size={13} />
                  Restore Sample Clients
                </Button>
              )}
            </div>
          )}
        </div>
      </section>

      <p className="preview-note">
        Preview records are shown because this project is not connected to a Supabase project yet.
      </p>

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
        <DialogContent
          className="max-w-md"
          style={{
            maxWidth: '440px',
            padding: '24px',
            borderRadius: '16px',
            backgroundColor: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                backgroundColor: '#ffe4e6',
                display: 'grid',
                placeItems: 'center',
                color: '#e11d48',
                flexShrink: 0,
              }}
            >
              <AlertTriangle size={20} />
            </div>
            <div>
              <DialogTitle style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>
                {deleteTarget?.type === 'single'
                  ? 'Delete Client Record?'
                  : `Delete ${deleteTarget?.count} Clients?`}
              </DialogTitle>
              <DialogDescription style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                {deleteTarget?.type === 'single' ? (
                  <>
                    Are you sure you want to delete client{' '}
                    <strong style={{ color: '#0f172a' }}>{deleteTarget.client?.name}</strong>? All associated
                    tax filings, payment history, and contact records will be permanently removed.
                  </>
                ) : (
                  <>
                    Are you sure you want to delete the{' '}
                    <strong style={{ color: '#0f172a' }}>{deleteTarget?.count} selected clients</strong>? This
                    action will remove all selected individual tax accounts.
                  </>
                )}
              </DialogDescription>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              marginTop: '24px',
              paddingTop: '16px',
              borderTop: '1px solid #f1f5f9',
            }}
          >
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              style={{ fontSize: '13px', height: '38px', borderRadius: '8px' }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={confirmDelete}
              style={{
                backgroundColor: '#e11d48',
                color: '#ffffff',
                border: 0,
                fontSize: '13px',
                height: '38px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 600,
              }}
            >
              <Trash2 size={14} />
              {deleteTarget?.type === 'single' ? 'Delete Client' : `Delete (${deleteTarget?.count}) Clients`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function Select({
  label,
  value,
  setValue,
  options,
}: {
  label: string;
  value: string;
  setValue: (v: string) => void;
  options: string[] | readonly string[];
}) {
  return (
    <label className="clients-select">
      <span>{label}</span>
      <select value={value} onChange={(e) => setValue(e.target.value)}>
        <option value="">All</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown size={12} />
    </label>
  );
}
