'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Ban,
  Calendar,
  Check,
  CheckCircle,
  CheckCircle2,
  Clock,
  CreditCard,
  Crown,
  DollarSign,
  Download,
  Edit,
  Key,
  Lock,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  UserCheck,
  UserCog,
  UserPlus,
  Users,
  UserX,
  X,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/lib/auth/auth-context';

export interface AdminUserRecord {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  status: 'active' | 'blocked' | 'suspended';
  created_at: string;
  last_sign_in_at: string | null;
  primaryRole: 'super_admin' | 'admin' | 'staff' | 'user';
  roles: string[];
  subscription: {
    id?: string;
    plan: 'trial' | 'monthly' | 'yearly' | 'lifetime';
    status: 'active' | 'expired' | 'cancelled' | 'past_due' | 'trial';
    start_date: string;
    expire_date: string | null;
    lifetime: boolean;
    payment_provider: string;
    amount: number;
  } | null;
}

const mockDefaultUsers: AdminUserRecord[] = [
  {
    id: 'usr-1',
    email: 'admin@crmemy.com',
    full_name: 'Amy Tran',
    phone: '(714) 555-0188',
    avatar_url: null,
    status: 'active',
    created_at: '2026-08-01T10:00:00Z',
    last_sign_in_at: '2026-08-29T18:00:00Z',
    primaryRole: 'super_admin',
    roles: ['super_admin'],
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
  {
    id: 'usr-2',
    email: 'daniel.lee@taxoffice.com',
    full_name: 'Daniel Lee',
    phone: '(415) 555-0199',
    avatar_url: null,
    status: 'active',
    created_at: '2026-08-10T11:30:00Z',
    last_sign_in_at: '2026-08-29T17:15:00Z',
    primaryRole: 'staff',
    roles: ['staff'],
    subscription: {
      plan: 'yearly',
      status: 'active',
      start_date: '2026-08-10T11:30:00Z',
      expire_date: '2027-08-10T11:30:00Z',
      lifetime: false,
      payment_provider: 'stripe',
      amount: 490,
    },
  },
  {
    id: 'usr-3',
    email: 'sarah.kim@taxoffice.com',
    full_name: 'Sarah Kim',
    phone: '(212) 555-0133',
    avatar_url: null,
    status: 'active',
    created_at: '2026-08-15T09:00:00Z',
    last_sign_in_at: '2026-08-28T14:20:00Z',
    primaryRole: 'admin',
    roles: ['admin'],
    subscription: {
      plan: 'monthly',
      status: 'active',
      start_date: '2026-08-15T09:00:00Z',
      expire_date: '2026-09-15T09:00:00Z',
      lifetime: false,
      payment_provider: 'zelle',
      amount: 49,
    },
  },
  {
    id: 'usr-4',
    email: 'michael.chen@abclogistics.com',
    full_name: 'Michael Chen',
    phone: '(415) 555-0182',
    avatar_url: null,
    status: 'active',
    created_at: '2026-08-20T14:40:00Z',
    last_sign_in_at: '2026-08-27T10:10:00Z',
    primaryRole: 'user',
    roles: ['user'],
    subscription: {
      plan: 'monthly',
      status: 'active',
      start_date: '2026-08-20T14:40:00Z',
      expire_date: '2026-09-20T14:40:00Z',
      lifetime: false,
      payment_provider: 'stripe',
      amount: 49,
    },
  },
  {
    id: 'usr-5',
    email: 'minh.nguyen@taxpayer.com',
    full_name: 'Minh Nguyen',
    phone: '(714) 555-0184',
    avatar_url: null,
    status: 'active',
    created_at: '2026-08-26T08:15:00Z',
    last_sign_in_at: '2026-08-29T12:00:00Z',
    primaryRole: 'user',
    roles: ['user'],
    subscription: {
      plan: 'trial',
      status: 'trial',
      start_date: '2026-08-26T08:15:00Z',
      expire_date: '2026-09-02T08:15:00Z',
      lifetime: false,
      payment_provider: 'manual',
      amount: 0,
    },
  },
  {
    id: 'usr-6',
    email: 'spammer.blocked@suspicious.com',
    full_name: 'Suspicious Account',
    phone: '(000) 000-0000',
    avatar_url: null,
    status: 'blocked',
    created_at: '2026-08-18T05:00:00Z',
    last_sign_in_at: '2026-08-18T05:10:00Z',
    primaryRole: 'user',
    roles: ['user'],
    subscription: {
      plan: 'trial',
      status: 'expired',
      start_date: '2026-08-18T05:00:00Z',
      expire_date: '2026-08-19T05:00:00Z',
      lifetime: false,
      payment_provider: 'manual',
      amount: 0,
    },
  },
];

export function UsersManager() {
  const { role: currentAdminRole } = useAuth();
  const isSuperAdmin = currentAdminRole === 'super_admin';

  const [users, setUsers] = useState<AdminUserRecord[]>(mockDefaultUsers);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Modals state
  const [selectedUser, setSelectedUser] = useState<AdminUserRecord | null>(null);
  const [actionModal, setActionModal] = useState<{
    type: 'role' | 'subscription' | 'status' | 'delete' | 'details' | null;
    user: AdminUserRecord | null;
  }>({ type: null, user: null });

  // Mutation form states
  const [newRole, setNewRole] = useState<'super_admin' | 'admin' | 'staff' | 'user'>('user');
  const [daysToAdd, setDaysToAdd] = useState<number>(30);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | 'lifetime'>('monthly');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'zelle' | 'cash' | 'bank_transfer' | 'usdt'>('zelle');
  const [paymentAmount, setPaymentAmount] = useState<number>(49);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data: any = await res.json();
        if (data && data.users && data.users.length > 0) {
          setUsers(data.users);
        }
      }
    } catch (err) {
      console.warn('API error, using cached users state:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        !search ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        (u.full_name && u.full_name.toLowerCase().includes(search.toLowerCase())) ||
        (u.phone && u.phone.includes(search));

      const matchesStatus = !statusFilter || u.status === statusFilter;

      const matchesPlan =
        !planFilter ||
        (planFilter === 'lifetime' && u.subscription?.lifetime) ||
        (planFilter === 'expired' && u.subscription?.status === 'expired') ||
        u.subscription?.plan === planFilter;

      const matchesRole = !roleFilter || u.primaryRole === roleFilter;

      return matchesSearch && matchesStatus && matchesPlan && matchesRole;
    });
  }, [users, search, statusFilter, planFilter, roleFilter]);

  const handleUpdateStatus = async (user: AdminUserRecord, newStatus: 'active' | 'blocked' | 'suspended') => {
    setErrorMessage(null);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_status',
          targetUserId: user.id,
          payload: { status: newStatus },
        }),
      });

      if (!res.ok) {
        const err: any = await res.json();
        throw new Error(err.error || 'Failed to update status');
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
      );
      setSuccessMessage(`Account status for ${user.email} updated to "${newStatus}".`);
      setActionModal({ type: null, user: null });
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  const handleChangeRole = async () => {
    if (!actionModal.user) return;
    setErrorMessage(null);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'change_role',
          targetUserId: actionModal.user.id,
          payload: { newRole },
        }),
      });

      if (!res.ok) {
        const err: any = await res.json();
        throw new Error(err.error || 'Failed to change role');
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.id === actionModal.user?.id
            ? { ...u, primaryRole: newRole, roles: [newRole] }
            : u
        )
      );
      setSuccessMessage(`Role for ${actionModal.user.email} changed to "${newRole}".`);
      setActionModal({ type: null, user: null });
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  const handleExtendSubscription = async (mode: 'days' | 'lifetime') => {
    if (!actionModal.user) return;
    setErrorMessage(null);
    try {
      const res = await fetch('/api/admin/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: actionModal.user.id,
          action: mode === 'lifetime' ? 'convert_lifetime' : 'extend',
          plan: selectedPlan,
          daysToAdd: mode === 'lifetime' ? null : daysToAdd,
          paymentProvider: paymentMethod,
          amount: paymentAmount,
        }),
      });

      if (!res.ok) {
        const err: any = await res.json();
        throw new Error(err.error || 'Failed to extend subscription');
      }

      const result: any = await res.json();

      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === actionModal.user?.id) {
            return {
              ...u,
              subscription: {
                ...(u.subscription || {
                  start_date: new Date().toISOString(),
                  amount: 0,
                  payment_provider: 'manual',
                }),
                plan: mode === 'lifetime' ? 'lifetime' : selectedPlan,
                status: 'active',
                lifetime: mode === 'lifetime',
                expire_date: mode === 'lifetime' ? null : result.newExpireDate,
                amount: paymentAmount,
                payment_provider: paymentMethod,
              },
            };
          }
          return u;
        })
      );

      setSuccessMessage(
        mode === 'lifetime'
          ? `User ${actionModal.user.email} converted to Lifetime License!`
          : `Subscription extended by ${daysToAdd} days for ${actionModal.user.email}.`
      );
      setActionModal({ type: null, user: null });
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  const handleDeleteUser = async () => {
    if (!actionModal.user) return;
    setErrorMessage(null);
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_user',
          targetUserId: actionModal.user.id,
        }),
      });

      if (!res.ok) {
        const err: any = await res.json();
        throw new Error(err.error || 'Failed to delete user');
      }

      setUsers((prev) => prev.filter((u) => u.id !== actionModal.user?.id));
      setSuccessMessage(`User ${actionModal.user.email} was permanently deleted.`);
      setActionModal({ type: null, user: null });
    } catch (err: any) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">SaaS Administration</span>
            <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
              {users.length} Total Users
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            User Accounts & Licenses
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Manage roles, subscription lifecycles, account statuses (Active / Blocked / Suspended), and permissions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchUsers}
            disabled={loading}
            className="text-xs font-semibold gap-1.5 border-slate-300 bg-white"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage(null)} className="text-rose-700 hover:text-rose-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. FILTER & SEARCH BAR */}
      <section className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-blue-500 bg-slate-50/50"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-10 px-3 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 bg-white cursor-pointer"
        >
          <option value="">All Account Statuses</option>
          <option value="active">Active Accounts</option>
          <option value="blocked">Blocked Accounts</option>
          <option value="suspended">Suspended Accounts</option>
        </select>

        <select
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          className="h-10 px-3 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 bg-white cursor-pointer"
        >
          <option value="">All Subscription Plans</option>
          <option value="monthly">Monthly Pro ($49)</option>
          <option value="yearly">Annual Enterprise ($490)</option>
          <option value="lifetime">Lifetime License</option>
          <option value="trial">7-Day Trial</option>
          <option value="expired">Expired Subscriptions</option>
        </select>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="h-10 px-3 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 bg-white cursor-pointer"
        >
          <option value="">All User Roles</option>
          <option value="super_admin">Super Admin</option>
          <option value="admin">Administrator</option>
          <option value="staff">Staff / Preparer</option>
          <option value="user">Standard User</option>
        </select>

        {(search || statusFilter || planFilter || roleFilter) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSearch('');
              setStatusFilter('');
              setPlanFilter('');
              setRoleFilter('');
            }}
            className="h-10 text-xs text-slate-600 gap-1"
          >
            <X className="w-3.5 h-3.5" />
            Reset Filters
          </Button>
        )}
      </section>

      {/* 3. USERS DATA TABLE */}
      <section className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">User Directory</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
              {filteredUsers.length} Users
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[1000px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">User / Contact</th>
                <th className="py-3.5 px-3">Role</th>
                <th className="py-3.5 px-3">Plan / Subscription</th>
                <th className="py-3.5 px-3">Subscription Status</th>
                <th className="py-3.5 px-3">Expiration Date</th>
                <th className="py-3.5 px-3">Account Status</th>
                <th className="py-3.5 px-3">Created / Registered</th>
                <th className="py-3.5 px-4 text-right">Admin Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredUsers.map((u) => {
                const sub = u.subscription;
                const isLifetime = sub?.lifetime || sub?.plan === 'lifetime';
                const isExpired =
                  !isLifetime &&
                  (sub?.status === 'expired' ||
                    (sub?.expire_date && new Date(sub.expire_date) <= new Date()));

                const isTargetSuperAdmin = u.primaryRole === 'super_admin';

                return (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* User */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-800 font-extrabold text-xs flex items-center justify-center border border-blue-200 shrink-0">
                          {u.full_name ? u.full_name.slice(0, 2).toUpperCase() : u.email.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-[13px]">{u.full_name || 'No Name'}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{u.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold ${
                          u.primaryRole === 'super_admin'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : u.primaryRole === 'admin'
                            ? 'bg-blue-100 text-blue-900 border border-blue-300'
                            : u.primaryRole === 'staff'
                            ? 'bg-purple-100 text-purple-900 border border-purple-300'
                            : 'bg-slate-100 text-slate-800 border border-slate-200'
                        }`}
                      >
                        {u.primaryRole === 'super_admin' && <Crown className="w-3 h-3 text-amber-700" />}
                        {u.primaryRole.replace('_', ' ').toUpperCase()}
                      </span>
                    </td>

                    {/* Plan */}
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex px-2.5 py-1 rounded-md text-[11px] font-bold ${
                          isLifetime
                            ? 'bg-purple-100 text-purple-900 font-black'
                            : sub?.plan === 'yearly'
                            ? 'bg-blue-100 text-blue-900'
                            : sub?.plan === 'monthly'
                            ? 'bg-emerald-100 text-emerald-900'
                            : 'bg-amber-100 text-amber-900'
                        }`}
                      >
                        {isLifetime ? 'Lifetime' : sub?.plan?.toUpperCase() || 'TRIAL'}
                      </span>
                    </td>

                    {/* Sub Status */}
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isExpired
                            ? 'bg-rose-100 text-rose-800'
                            : sub?.status === 'active' || isLifetime
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            isExpired ? 'bg-rose-600' : 'bg-emerald-600'
                          }`}
                        ></span>
                        {isExpired ? 'EXPIRED' : sub?.status?.toUpperCase() || 'ACTIVE'}
                      </span>
                    </td>

                    {/* Expiration */}
                    <td className="py-3.5 px-3 font-medium">
                      {isLifetime ? (
                        <span className="text-purple-700 font-bold">Never (Lifetime)</span>
                      ) : sub?.expire_date ? (
                        <span className={isExpired ? 'text-rose-600 font-bold' : 'text-slate-700'}>
                          {new Date(sub.expire_date).toLocaleDateString()}
                        </span>
                      ) : (
                        <span className="text-slate-400">N/A</span>
                      )}
                    </td>

                    {/* Account Status */}
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          u.status === 'blocked'
                            ? 'bg-rose-100 text-rose-800'
                            : u.status === 'suspended'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            u.status === 'blocked'
                              ? 'bg-rose-600'
                              : u.status === 'suspended'
                              ? 'bg-amber-600'
                              : 'bg-emerald-600'
                          }`}
                        ></span>
                        {u.status.toUpperCase()}
                      </span>
                    </td>

                    {/* Created */}
                    <td className="py-3.5 px-3 text-slate-500 font-mono text-[11px]">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>

                    {/* Actions Menu */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Quick Extend Subscription Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedPlan(
                              u.subscription?.plan === 'yearly'
                                ? 'yearly'
                                : u.subscription?.plan === 'lifetime'
                                ? 'lifetime'
                                : 'monthly'
                            );
                            setActionModal({ type: 'subscription', user: u });
                          }}
                          className="h-7 px-2 text-[11px] font-bold gap-1 border-blue-300 text-blue-700 hover:bg-blue-50"
                        >
                          <Zap className="w-3 h-3 text-blue-600" />
                          License
                        </Button>

                        {/* Change Role Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setNewRole(u.primaryRole);
                            setActionModal({ type: 'role', user: u });
                          }}
                          disabled={isTargetSuperAdmin && !isSuperAdmin}
                          className="h-7 px-2 text-[11px] font-semibold gap-1 border-slate-300 hover:bg-slate-50"
                        >
                          <UserCog className="w-3 h-3 text-slate-600" />
                          Role
                        </Button>

                        {/* Block/Unblock toggle */}
                        {u.status === 'blocked' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateStatus(u, 'active')}
                            className="h-7 px-2 text-[11px] font-bold text-emerald-700 border-emerald-300 hover:bg-emerald-50"
                          >
                            <UserCheck className="w-3 h-3" />
                            Unblock
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUpdateStatus(u, 'blocked')}
                            disabled={isTargetSuperAdmin}
                            className="h-7 px-2 text-[11px] font-bold text-rose-700 border-rose-300 hover:bg-rose-50"
                          >
                            <Ban className="w-3 h-3" />
                            Block
                          </Button>
                        )}

                        {/* Delete User */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActionModal({ type: 'delete', user: u })}
                          disabled={isTargetSuperAdmin}
                          className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. MODALS */}

      {/* A. Subscription / License Management Modal */}
      <Dialog
        open={actionModal.type === 'subscription'}
        onOpenChange={(open) => {
          if (!open) setActionModal({ type: null, user: null });
        }}
      >
        <DialogContent className="max-w-lg p-6 rounded-2xl bg-white space-y-5">
          <header className="flex items-center gap-3 pb-3 border-b border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900">
                Manage Subscription & License
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                User: <b className="text-slate-800">{actionModal.user?.email}</b>
              </DialogDescription>
            </div>
          </header>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Quick Add Duration</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: '+7 Days (Trial)', days: 7 },
                  { label: '+30 Days (1 Mo)', days: 30 },
                  { label: '+90 Days (3 Mo)', days: 90 },
                  { label: '+1 Year', days: 365 },
                ].map((item) => (
                  <button
                    key={item.days}
                    type="button"
                    onClick={() => setDaysToAdd(item.days)}
                    className={`py-2 px-2 rounded-lg border text-center font-bold cursor-pointer transition-all ${
                      daysToAdd === item.days
                        ? 'bg-[#092c5c] text-white border-[#092c5c]'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Plan Type</label>
                <select
                  value={selectedPlan}
                  onChange={(e: any) => setSelectedPlan(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="monthly">Monthly Pro ($49)</option>
                  <option value="yearly">Annual Enterprise ($490)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e: any) => setPaymentMethod(e.target.value)}
                  className="w-full h-9 px-2.5 rounded-lg border border-slate-300 bg-white"
                >
                  <option value="zelle">Zelle / QuickPay</option>
                  <option value="cash">Cash / Office Front Desk</option>
                  <option value="bank_transfer">Bank Transfer / Wire</option>
                  <option value="usdt">USDT (Crypto)</option>
                  <option value="stripe">Stripe Online</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Amount Paid ($)</label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value) || 0)}
                className="w-full h-9 px-3 rounded-lg border border-slate-300 text-sm font-semibold"
              />
            </div>

            {/* Lifetime Converter Option */}
            <div className="p-3.5 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-between">
              <div>
                <b className="text-purple-950 font-bold block flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5 text-amber-500" />
                  Grant Lifetime License
                </b>
                <span className="text-[11px] text-purple-700">Account will never expire</span>
              </div>
              <Button
                type="button"
                size="sm"
                onClick={() => handleExtendSubscription('lifetime')}
                className="h-8 text-xs font-bold bg-purple-700 hover:bg-purple-800 text-white"
              >
                Convert to Lifetime
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActionModal({ type: null, user: null })}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => handleExtendSubscription('days')}
              className="text-xs font-bold bg-[#092c5c] hover:bg-[#072247] text-white"
            >
              Apply +{daysToAdd} Days Subscription
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* B. Change Role Modal */}
      <Dialog
        open={actionModal.type === 'role'}
        onOpenChange={(open) => {
          if (!open) setActionModal({ type: null, user: null });
        }}
      >
        <DialogContent className="max-w-md p-6 rounded-2xl bg-white space-y-5">
          <header className="flex items-center gap-3 pb-3 border-b border-slate-200">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <UserCog className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900">
                Change User Role
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                User: <b className="text-slate-800">{actionModal.user?.email}</b>
              </DialogDescription>
            </div>
          </header>

          <div className="space-y-3 text-xs">
            <label className="block font-bold text-slate-700 mb-1">Select Assigned Role</label>
            <div className="space-y-2">
              {[
                { id: 'user', name: 'User (Standard Taxpayer)', desc: 'Can access own client and return files.' },
                { id: 'staff', name: 'Staff (Tax Preparer)', desc: 'Can manage client workflows and prepare returns.' },
                { id: 'admin', name: 'Admin (Administrator)', desc: 'Can manage all workspace users and subscriptions.' },
                ...(isSuperAdmin
                  ? [{ id: 'super_admin', name: 'Super Admin (Root Master)', desc: 'Full unlimited system access.' }]
                  : []),
              ].map((r: any) => (
                <label
                  key={r.id}
                  onClick={() => setNewRole(r.id)}
                  className={`p-3 rounded-xl border flex items-start gap-3 cursor-pointer transition-all ${
                    newRole === r.id
                      ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="role-select"
                    checked={newRole === r.id}
                    onChange={() => setNewRole(r.id)}
                    className="mt-0.5"
                  />
                  <div>
                    <b className="text-slate-900 block font-bold">{r.name}</b>
                    <span className="text-[11px] text-slate-500">{r.desc}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActionModal({ type: null, user: null })}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleChangeRole}
              className="text-xs font-bold bg-[#092c5c] hover:bg-[#072247] text-white"
            >
              Save New Role
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* C. Delete Confirmation Modal */}
      <Dialog
        open={actionModal.type === 'delete'}
        onOpenChange={(open) => {
          if (!open) setActionModal({ type: null, user: null });
        }}
      >
        <DialogContent className="max-w-md p-6 rounded-2xl bg-white text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <div>
            <DialogTitle className="text-lg font-bold text-slate-900">
              Permanently Delete User?
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500 mt-1">
              Are you sure you want to delete <b className="text-slate-800">{actionModal.user?.email}</b>? This action will remove all their auth credentials and associated subscription records.
            </DialogDescription>
          </div>

          <div className="flex items-center justify-center gap-3 pt-3 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActionModal({ type: null, user: null })}
              className="text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleDeleteUser}
              className="text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white"
            >
              Confirm Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
