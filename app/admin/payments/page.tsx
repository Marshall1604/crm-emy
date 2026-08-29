'use client';

import React from 'react';
import { CreditCard, DollarSign, Download, Plus, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminPaymentsPage() {
  const transactions = [
    { id: 'TXN-902', user: 'Daniel Lee', plan: 'Annual Enterprise', method: 'Stripe', amount: '$490.00', date: 'Aug 10, 2026', status: 'Completed' },
    { id: 'TXN-901', user: 'Sarah Kim', plan: 'Monthly Pro', method: 'Zelle', amount: '$49.00', date: 'Aug 15, 2026', status: 'Completed' },
    { id: 'TXN-900', user: 'Michael Chen', plan: 'Monthly Pro', method: 'Bank Transfer', amount: '$49.00', date: 'Aug 20, 2026', status: 'Completed' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">Payment Logs</span>
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
        </div>
      </div>
    </div>
  );
}
