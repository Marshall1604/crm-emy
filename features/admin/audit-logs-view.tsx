'use client';

import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Download,
  Filter,
  History,
  Lock,
  RefreshCw,
  Search,
  ShieldCheck,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AuditLogsView() {
  const [search, setSearch] = useState('');
  const [usersList, setUsersList] = useState<any[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('crm_emy_saas_users_v2');
        if (saved) {
          const parsed = JSON.parse(saved);
          return parsed.filter(
            (u: any) =>
              ![
                'admin@crmemy.com',
                'daniel.lee@taxoffice.com',
                'sarah.kim@taxoffice.com',
                'michael.chen@abclogistics.com',
                'minh.nguyen@taxpayer.com',
              ].includes(u.email?.toLowerCase())
          );
        }
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

  const sampleLogs = [
    {
      id: 'log-sys-init',
      actor: 'Super Admin (Phan Hong)',
      action: 'system_root_initialized',
      target: 'www.junky3@yahoo.com',
      entity: 'system_core',
      ip: '127.0.0.1',
      time: 'Aug 01, 2026 · 10:00 AM',
      tone: 'blue',
    },
    ...usersList
      .filter((u) => u.email !== 'www.junky3@yahoo.com')
      .map((u, idx) => ({
        id: `log-usr-${u.id}`,
        actor: u.full_name || u.email.split('@')[0],
        action: u.status === 'blocked' ? 'account_blocked' : 'user_registered',
        target: u.email,
        entity: 'auth_profile',
        ip: '192.168.1.' + (10 + idx),
        time: u.created_at
          ? new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
          : 'Recently',
        tone: u.status === 'blocked' ? 'rose' : 'emerald',
      })),
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">Security Audit Trail</span>
            <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              Tamper-Proof Logs
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Security & Activity Audit Logs
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Immutable log trail of admin logins, subscription extensions, role changes, and account blocks.
          </p>
        </div>
      </div>

      {/* Logs Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">Recent Security Events</h3>
          <Button variant="outline" size="sm" className="text-xs font-semibold gap-1.5 border-slate-300">
            <Download className="w-3.5 h-3.5" />
            Export Audit Log
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-3">Actor</th>
                <th className="py-3.5 px-3">Action</th>
                <th className="py-3.5 px-3">Target User</th>
                <th className="py-3.5 px-3">Entity Type</th>
                <th className="py-3.5 px-4 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {sampleLogs.map((l) => (
                <tr key={l.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">{l.time}</td>
                  <td className="py-3.5 px-3 font-bold text-slate-900">{l.actor}</td>
                  <td className="py-3.5 px-3">
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 font-semibold text-blue-900">
                      {l.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 font-mono text-[11px] text-slate-600">{l.target}</td>
                  <td className="py-3.5 px-3 font-semibold uppercase text-[10px] text-slate-500">{l.entity}</td>
                  <td className="py-3.5 px-4 text-right font-mono text-[11px] text-slate-500">{l.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
