'use client';

import React, { useState, useMemo } from 'react';
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
import { CreateBusinessModal } from '@/features/businesses/create-business-modal';

interface BusinessItem {
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
    link: '/businesses/abc-logistics',
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
    link: '/businesses/abc-logistics',
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
    link: '/businesses/abc-logistics',
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
    link: '/businesses/abc-logistics',
  },
];

export function BusinessesList() {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [entityFilter, setEntityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [preparerFilter, setPreparerFilter] = useState('');

  const filtered = useMemo(() => {
    return initialBusinesses.filter((b) => {
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
  }, [search, yearFilter, entityFilter, statusFilter, preparerFilter]);

  const resetFilters = () => {
    setSearch('');
    setYearFilter('');
    setEntityFilter('');
    setStatusFilter('');
    setPreparerFilter('');
  };

  const totalBusinesses = initialBusinesses.length;
  const inPrepCount = initialBusinesses.filter((b) => b.status === 'In Preparation').length;
  const waitingCount = initialBusinesses.filter((b) => b.status === 'Waiting Documents').length;
  const totalBilled = initialBusinesses.reduce((s, b) => s + b.fee, 0);

  return (
    <main className="p-6 md:p-8 max-w-[1480px] mx-auto space-y-6">
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">Tax Office Practice</span>
            <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              {totalBusinesses} Registered Entities
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Business Clients
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Manage corporate and partnership tax returns, entity records, and assignments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/clients">
            <Button variant="outline" className="h-10 text-sm font-semibold gap-1.5 border-slate-300 hover:bg-slate-50">
              <UsersRound className="w-4 h-4 text-slate-600" />
              Clients List
            </Button>
          </Link>
          <Button
            onClick={() => setModalOpen(true)}
            className="h-10 text-sm font-bold gap-2 bg-[#092c5c] hover:bg-[#072247] text-white shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Business
          </Button>
        </div>
      </div>

      {/* 2. STATS ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Entities</span>
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-3">{totalBusinesses}</div>
          <p className="text-xs text-slate-500 font-medium mt-1">Corporations & Partnerships</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">In Preparation</span>
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-3">{inPrepCount}</div>
          <p className="text-xs text-slate-500 font-medium mt-1">Active engagement workflows</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Waiting Documents</span>
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-3">{waitingCount}</div>
          <p className="text-xs text-amber-700 font-semibold mt-1">Pending K-1s / Financials</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Billed Fees</span>
            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-3">${totalBilled.toLocaleString()}</div>
          <p className="text-xs text-emerald-700 font-semibold mt-1">Corporate engagements</p>
        </div>
      </div>

      {/* 3. FILTER BAR */}
      <section className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search business name, EIN, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-blue-500 bg-slate-50/50"
          />
        </div>

        <select
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
          className="h-10 px-3 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 bg-white cursor-pointer outline-none"
        >
          <option value="">All Tax Years</option>
          <option value="2026">2026</option>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
        </select>

        <select
          value={entityFilter}
          onChange={(e) => setEntityFilter(e.target.value)}
          className="h-10 px-3 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 bg-white cursor-pointer outline-none"
        >
          <option value="">All Entity Types</option>
          <option value="Partnership">Partnership</option>
          <option value="S Corporation">S Corporation</option>
          <option value="C Corporation">C Corporation</option>
          <option value="Sole Proprietor">Sole Proprietor</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 bg-white cursor-pointer outline-none"
        >
          <option value="">All Statuses</option>
          <option value="Waiting Documents">Waiting Documents</option>
          <option value="In Preparation">In Preparation</option>
          <option value="Ready to File">Ready to File</option>
          <option value="Completed">Completed</option>
        </select>

        <select
          value={preparerFilter}
          onChange={(e) => setPreparerFilter(e.target.value)}
          className="h-10 px-3 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 bg-white cursor-pointer outline-none"
        >
          <option value="">All Preparers</option>
          <option value="Amy Tran">Amy Tran</option>
          <option value="Daniel Lee">Daniel Lee</option>
          <option value="Sarah Kim">Sarah Kim</option>
        </select>

        <Button variant="ghost" size="sm" onClick={resetFilters} className="h-10 text-slate-600 gap-1.5">
          <RotateCcw className="w-3.5 h-3.5" />
          Reset
        </Button>
      </section>

      {/* 4. BUSINESS TABLE CARD */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <header className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900">Registered Businesses</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                {filtered.length}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">Click any business to open their engagement dashboard</p>
          </div>

          <Button variant="outline" size="sm" className="h-9 text-xs font-semibold gap-1.5">
            <Download className="w-3.5 h-3.5" />
            Export Excel
          </Button>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Business Name & DBA</th>
                <th className="py-3.5 px-3">EIN</th>
                <th className="py-3.5 px-3">Entity / Form</th>
                <th className="py-3.5 px-3">Tax Year</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Assigned Staff</th>
                <th className="py-3.5 px-4 text-right">Fee / Balance</th>
                <th className="py-3.5 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-4 px-4">
                    <Link href={b.link} className="flex items-center gap-3 group">
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
                    <div className="font-semibold text-slate-800 text-xs">{b.entityType}</div>
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
                      {b.status}
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

                  <td className="py-4 px-4 text-right">
                    <div className="font-bold text-slate-900 text-xs">${b.fee.toLocaleString()}</div>
                    {b.balance > 0 ? (
                      <div className="text-[11px] font-semibold text-rose-600">
                        Due: ${b.balance.toLocaleString()}
                      </div>
                    ) : (
                      <div className="text-[11px] font-semibold text-emerald-600">Paid</div>
                    )}
                  </td>

                  <td className="py-4 px-3 text-center">
                    <Link href={b.link}>
                      <Button variant="ghost" size="sm" className="h-8 text-xs font-bold text-blue-700 hover:text-blue-900">
                        Open
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="p-8 text-center text-slate-500">
              <Building2 className="w-8 h-8 mx-auto mb-2 text-slate-400" />
              <p className="text-sm font-semibold">No businesses match your filter</p>
              <p className="text-xs mt-1">Try resetting or changing your search term.</p>
            </div>
          )}
        </div>
      </section>

      {/* 5. CREATE BUSINESS MODAL */}
      <CreateBusinessModal open={modalOpen} onOpenChange={setModalOpen} />
    </main>
  );
}
