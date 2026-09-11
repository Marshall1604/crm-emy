'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
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
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SubscriptionsManager() {
  const [search, setSearch] = useState('');
  const [methodFilter, setMethodFilter] = useState('');
  const [usersList, setUsersList] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('crm_emy_saas_users_v2');
        if (saved) {
          const parsed = JSON.parse(saved);
          const filtered = parsed.filter(
            (u: any) =>
              ![
                'admin@crmemy.com',
                'daniel.lee@taxoffice.com',
                'sarah.kim@taxoffice.com',
                'michael.chen@abclogistics.com',
                'minh.nguyen@taxpayer.com',
              ].includes(u.email?.toLowerCase())
          );
          if (filtered && filtered.length > 0) return filtered;
        }
      } catch {}
    }
    return [
      {
        id: 'usr-admin-1',
        email: 'www.junky3@yahoo.com',
        full_name: 'Phan Hong (Super Admin)',
        status: 'active',
        subscription: {
          plan: 'lifetime',
          status: 'active',
          start_date: '2026-08-01T10:00:00Z',
          expire_date: null,
          lifetime: true,
          payment_provider: 'manual',
          amount: 0,
        },
      },
    ];
  });

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data: any = await res.json();
        if (data && data.users && data.users.length > 0) {
          setUsersList(data.users);
        }
      }
    } catch {}
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const subscriptions = useMemo(() => {
    return usersList
      .filter((u) => u.subscription)
      .map((u) => {
        const sub = u.subscription;
        const planName =
          sub.lifetime || sub.plan === 'lifetime'
            ? 'Pro Lifetime (Liên hệ WhatsApp)'
            : sub.plan === 'yearly'
            ? 'Pro Annual ($142/yr)'
            : sub.plan === 'monthly'
            ? 'Pro Monthly ($14/mo)'
            : 'Free Starter ($0)';

        const expireText =
          sub.lifetime || sub.plan === 'lifetime'
            ? 'Never (Lifetime)'
            : sub.expire_date
            ? new Date(sub.expire_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
            : 'N/A';

        const startDateText = sub.start_date
          ? new Date(sub.start_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
          : 'Recently';

        return {
          id: `sub-${u.id}`,
          user: u.full_name || u.email.split('@')[0],
          email: u.email,
          plan: planName,
          rawPlan: sub.plan,
          status: sub.status || 'active',
          start: startDateText,
          expire: expireText,
          provider: sub.payment_provider ? sub.payment_provider.toUpperCase() : 'MANUAL',
          amount: sub.amount ? `$${sub.amount}.00` : '$0.00',
        };
      })
      .filter((s) => {
        const matchesSearch =
          !search ||
          s.user.toLowerCase().includes(search.toLowerCase()) ||
          s.email.toLowerCase().includes(search.toLowerCase());
        const matchesMethod = !methodFilter || s.provider.toLowerCase() === methodFilter.toLowerCase();
        return matchesSearch && matchesMethod;
      });
  }, [usersList, search, methodFilter]);

  const monthlyCount = usersList.filter((u) => u.subscription?.plan === 'monthly' && u.subscription?.status === 'active').length;
  const yearlyCount = usersList.filter((u) => u.subscription?.plan === 'yearly' && u.subscription?.status === 'active').length;
  const lifetimeCount = usersList.filter((u) => u.subscription?.lifetime || u.subscription?.plan === 'lifetime').length;
  const trialCount = usersList.filter((u) => u.subscription?.plan === 'trial' || u.subscription?.status === 'trial').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">Billing & Licenses</span>
            <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-800 border border-purple-200">
              {subscriptions.length} Active {subscriptions.length === 1 ? 'License' : 'Licenses'}
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
          <div className="text-3xl font-black text-slate-900 mt-2">{monthlyCount}</div>
          <p className="text-xs text-slate-500 mt-1">$14/month per seat</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Yearly Subscribers</span>
          <div className="text-3xl font-black text-slate-900 mt-2">{yearlyCount}</div>
          <p className="text-xs text-blue-700 font-semibold mt-1">$142/year billed</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-purple-200 bg-purple-50/20 shadow-xs">
          <span className="text-xs font-bold text-purple-900 uppercase flex items-center gap-1">
            <Crown className="w-3.5 h-3.5 text-amber-500" />
            Lifetime Licenses
          </span>
          <div className="text-3xl font-black text-purple-950 mt-2">{lifetimeCount}</div>
          <p className="text-xs text-purple-700 font-semibold mt-1">Permanent root licenses</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">Active 7-Day Trials</span>
          <div className="text-3xl font-black text-slate-900 mt-2">{trialCount}</div>
          <p className="text-xs text-amber-700 font-semibold mt-1">New user signups</p>
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
              {subscriptions.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-900 text-[13px]">{s.user}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{s.email}</div>
                  </td>
                  <td className="py-3.5 px-3 font-bold text-slate-900">{s.plan}</td>
                  <td className="py-3.5 px-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                      {s.status}
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
