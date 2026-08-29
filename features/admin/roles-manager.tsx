'use client';

import React from 'react';
import {
  Check,
  CheckCircle2,
  Crown,
  Lock,
  Minus,
  ShieldCheck,
  UserCog,
  Users,
  X,
} from 'lucide-react';

const permissionsList = [
  { id: 'users.view', name: 'View Users & Profiles', category: 'Users', superAdmin: true, admin: true, staff: false, user: false },
  { id: 'users.create', name: 'Create Users Manually', category: 'Users', superAdmin: true, admin: true, staff: false, user: false },
  { id: 'users.edit', name: 'Edit Profiles & Account Status', category: 'Users', superAdmin: true, admin: true, staff: false, user: false },
  { id: 'users.delete', name: 'Delete User Accounts', category: 'Users', superAdmin: true, admin: false, staff: false, user: false },

  { id: 'subscriptions.view', name: 'View Subscriptions & Billing', category: 'Subscriptions', superAdmin: true, admin: true, staff: true, user: false },
  { id: 'subscriptions.create', name: 'Grant Licenses Manually', category: 'Subscriptions', superAdmin: true, admin: true, staff: false, user: false },
  { id: 'subscriptions.edit', name: 'Extend & Adjust Dates', category: 'Subscriptions', superAdmin: true, admin: true, staff: false, user: false },
  { id: 'subscriptions.cancel', name: 'Cancel Active Subscriptions', category: 'Subscriptions', superAdmin: true, admin: true, staff: false, user: false },

  { id: 'clients.view', name: 'View Client Records', category: 'Clients', superAdmin: true, admin: true, staff: true, user: true },
  { id: 'clients.create', name: 'Add Individual / Business Clients', category: 'Clients', superAdmin: true, admin: true, staff: true, user: true },
  { id: 'clients.edit', name: 'Edit Client Returns & Docs', category: 'Clients', superAdmin: true, admin: true, staff: true, user: true },
  { id: 'clients.delete', name: 'Delete Client Records', category: 'Clients', superAdmin: true, admin: true, staff: false, user: false },

  { id: 'payments.manage', name: 'Log Manual Payments', category: 'Payments', superAdmin: true, admin: true, staff: false, user: false },
  { id: 'roles.manage', name: 'Assign Roles & Matrix', category: 'Roles', superAdmin: true, admin: false, staff: false, user: false },
  { id: 'logs.view', name: 'Inspect Security Audit Logs', category: 'Logs', superAdmin: true, admin: true, staff: false, user: false },
];

export function RolesManager() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">Access Control</span>
            <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
              4 Roles Defined
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            Roles & Permissions Matrix
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Role hierarchy and granular permission enforcement across API and PostgreSQL RLS.
          </p>
        </div>
      </div>

      {/* Role Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-amber-300 bg-amber-50/20 shadow-xs">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <Crown className="w-4 h-4 text-amber-600" />
            <span>Super Admin</span>
          </div>
          <p className="text-xs text-slate-600 mt-2">Root administrator with full unrestricted system control.</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-xs">
          <div className="flex items-center gap-2 text-blue-900 font-bold text-sm">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Admin</span>
          </div>
          <p className="text-xs text-slate-600 mt-2">Operations manager with user and subscription editing power.</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-purple-200 shadow-xs">
          <div className="flex items-center gap-2 text-purple-900 font-bold text-sm">
            <UserCog className="w-4 h-4 text-purple-600" />
            <span>Staff</span>
          </div>
          <p className="text-xs text-slate-600 mt-2">Tax preparers who manage client returns and document workflows.</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
            <Users className="w-4 h-4 text-slate-600" />
            <span>User</span>
          </div>
          <p className="text-xs text-slate-600 mt-2">Standard client with access strictly isolated to their own records.</p>
        </div>
      </div>

      {/* Permissions Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <h3 className="text-base font-bold text-slate-900">System Permissions Matrix</h3>
          <p className="text-xs text-slate-500 mt-0.5">Permissions are verified via server middleware and security definer functions</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">Permission Key</th>
                <th className="py-3.5 px-3">Description</th>
                <th className="py-3.5 px-3 text-center text-amber-800">Super Admin</th>
                <th className="py-3.5 px-3 text-center text-blue-800">Admin</th>
                <th className="py-3.5 px-3 text-center text-purple-800">Staff</th>
                <th className="py-3.5 px-4 text-center text-slate-800">User</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {permissionsList.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{p.id}</td>
                  <td className="py-3 px-3 text-slate-600">{p.name}</td>
                  <td className="py-3 px-3 text-center">
                    <CheckCircle2 className="w-4 h-4 text-amber-600 mx-auto" />
                  </td>
                  <td className="py-3 px-3 text-center">
                    {p.admin ? (
                      <CheckCircle2 className="w-4 h-4 text-blue-600 mx-auto" />
                    ) : (
                      <Minus className="w-4 h-4 text-slate-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-3 text-center">
                    {p.staff ? (
                      <CheckCircle2 className="w-4 h-4 text-purple-600 mx-auto" />
                    ) : (
                      <Minus className="w-4 h-4 text-slate-300 mx-auto" />
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {p.user ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                    ) : (
                      <Minus className="w-4 h-4 text-slate-300 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
