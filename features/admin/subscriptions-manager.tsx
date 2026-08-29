'use client';

import React, { useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  Crown,
  DollarSign,
  Download,
  Filter,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SubscriptionsManager() {
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('');

  const sampleSubscriptions = [
    {
      id: 'sub-01',
      user: 'Amy Tran',
      email: 'admin@crmemy.com',
      plan: 'Lifetime License',
      status: 'active',
      start: 'Aug 01, 2026',
      expire: 'Never (Lifetime)',
      provider: 'manual',
      amount: '$0.00',
    },
    {
      id: 'sub-02',
      user: 'Daniel Lee',
      email: 'daniel.lee@taxoffice.com',
      plan: 'Annual Enterprise',
      status: 'active',
      start: 'Aug 10, 2026',
      expire: 'Aug 10, 2027',
      provider: 'Stripe',
      amount: '$490.00',
    },
    {
      id: 'sub-03',
      user: 'Sarah Kim',
      email: 'sarah.kim@taxoffice.com',
      plan: 'Monthly Pro',
      status: 'active',
      start: 'Aug 15, 2026',
      expire: 'Sep 15, 2026',
      provider: 'Zelle',
      amount: '$49.00',
    },
    {
      id: 'sub-04',
      user: 'Michael Chen',
      email: 'michael.chen@abclogistics.com',
      plan: 'Monthly Pro',
      status: 'active',
      start: 'Aug 20, 2026',
      expire: 'Sep 20, 2026',
      provider: 'Bank Wire',
      amount: '$49.00',
    },
    {
      id: 'sub-05',
      user: 'Minh Nguyen',
      email: 'minh.nguyen@taxpayer.com',
      plan: '7-Day Free Trial',
      status: 'trial',
      start: 'Aug 26, 2026',
      expire: 'Sep 02, 2026',
      provider: 'Free Trial',
      amount: '$0.00',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">Billing & Licenses</span>
            <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200">
              5 Active Licenses
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Subscription & Payment Management
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Log and manage manual payments (Zelle, Cash, Bank Transfer, USDT) and Stripe auto-renewals.
          </p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Monthly Subscribers</span>
          <div className="text-3xl font-black text-slate-900 mt-2">2</div>
          <p className="text-xs text-slate-500 mt-1">$49/month per seat</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Yearly Subscribers</span>
          <div className="text-3xl font-black text-slate-900 mt-2">1</div>
          <p className="text-xs text-blue-700 font-semibold mt-1">$490/year billed</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-purple-200 bg-purple-50/20 shadow-xs">
          <span className="text-xs font-bold text-purple-900 uppercase flex items-center gap-1">
            <Crown className="w-3.5 h-3.5 text-amber-500" />
            Lifetime Licenses
          </span>
          <div className="text-3xl font-black text-purple-950 mt-2">1</div>
          <p className="text-xs text-purple-700 font-semibold mt-1">Permanent unlimited seats</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Active 7-Day Trials</span>
          <div className="text-3xl font-black text-slate-900 mt-2">1</div>
          <p className="text-xs text-amber-700 font-semibold mt-1">Expiring in 4 days</p>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Active Subscriptions & Licenses</h3>
          <Button variant="outline" size="sm" className="text-xs font-semibold gap-1.5 border-slate-300">
            <Download className="w-3.5 h-3.5" />
            Export Revenue CSV
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-3">Plan</th>
                <th className="py-3.5 px-3">Status</th>
                <th className="py-3.5 px-3">Start Date</th>
                <th className="py-3.5 px-3">Expiration Date</th>
                <th className="py-3.5 px-3">Payment Method</th>
                <th className="py-3.5 px-4 text-right">Amount Billed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {sampleSubscriptions.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 text-[13px]">{s.user}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{s.email}</div>
                  </td>
                  <td className="py-3.5 px-3 font-bold text-slate-900">{s.plan}</td>
                  <td className="py-3.5 px-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      ACTIVE
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-slate-600">{s.start}</td>
                  <td className="py-3.5 px-3">
                    <span className={s.plan === 'Lifetime License' ? 'text-purple-700 font-bold' : 'text-slate-800 font-medium'}>
                      {s.expire}
                    </span>
                  </td>
                  <td className="py-3.5 px-3">
                    <span className="inline-flex px-2 py-0.5 rounded bg-slate-100 font-bold text-slate-700 text-[11px]">
                      {s.provider}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-extrabold text-slate-900 text-sm">{s.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
