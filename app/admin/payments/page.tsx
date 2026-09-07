'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { CreditCard, DollarSign, Download, Plus, ShieldCheck, Receipt } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminPaymentsPage() {
  const [usersList, setUsersList] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('crm_emy_saas_users_v2');
        if (saved) return JSON.parse(saved);
      } catch {}
    }
    return [];
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

  const transactions = useMemo(() => {
    return usersList
      .filter((u) => u.subscription && u.subscription.amount > 0)
      .map((u, idx) => ({
        id: `TXN-${1000 + idx}`,
        user: u.full_name || u.email.split('@')[0],
        plan:
          u.subscription.lifetime || u.subscription.plan === 'lifetime'
            ? 'Lifetime License'
            : u.subscription.plan === 'yearly'
            ? 'Annual Enterprise'
            : 'Monthly Pro',
        method: u.subscription.payment_provider ? u.subscription.payment_provider.toUpperCase() : 'MANUAL',
        amount: `$${u.subscription.amount}.00`,
        date: u.subscription.start_date
          ? new Date(u.subscription.start_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
          : 'Recently',
        status: 'Completed',
      }));
  }, [usersList]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">Payment Logs</span>
            <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              {transactions.length} Recorded {transactions.length === 1 ? 'Transaction' : 'Transactions'}
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Payments & Invoices
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Audit history of Stripe credit card transactions and manually recorded payments.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Recent Transactions</h3>
          <Button variant="outline" size="sm" className="text-xs font-semibold gap-1.5 border-slate-300">
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </Button>
        </div>

        <div className="overflow-x-auto">
          {transactions.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              <Receipt className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-600 text-sm">Chưa có giao dịch thanh toán</p>
              <p className="text-slate-400 mt-1">Khi khách hàng đăng ký hoặc nâng cấp gói trả phí, giao dịch sẽ tự động xuất hiện tại đây.</p>
              <Link href="/admin/users" className="inline-block mt-3 text-blue-600 font-bold hover:underline">
                → Quản lý tài khoản người dùng
              </Link>
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Transaction ID</th>
                  <th className="py-3.5 px-3">User</th>
                  <th className="py-3.5 px-3">Plan</th>
                  <th className="py-3.5 px-3">Method</th>
                  <th className="py-3.5 px-3">Date</th>
                  <th className="py-3.5 px-3">Status</th>
                  <th className="py-3.5 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">{t.id}</td>
                    <td className="py-3.5 px-3 font-semibold text-slate-800">{t.user}</td>
                    <td className="py-3.5 px-3 text-slate-600">{t.plan}</td>
                    <td className="py-3.5 px-3 font-medium">{t.method}</td>
                    <td className="py-3.5 px-3 text-slate-500">{t.date}</td>
                    <td className="py-3.5 px-3">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-extrabold text-slate-900 text-sm">{t.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
