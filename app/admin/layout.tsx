'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  Crown,
  DollarSign,
  History,
  LayoutDashboard,
  Layers,
  LogOut,
  Settings,
  ShieldCheck,
  UserCog,
  Users,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { Button } from '@/components/ui/button';

const adminNav = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard },
  { label: 'Plans', href: '/admin/plans', icon: Layers },
  { label: 'Payments', href: '/admin/payments', icon: DollarSign },
  { label: 'Roles & Permissions', href: '/admin/roles', icon: UserCog },
  { label: 'Activity Logs', href: '/admin/logs', icon: History },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, profile, role, signOut } = useAuth();

  const isActive = (href: string) =>
    pathname === href || (href !== '/admin' && pathname.startsWith(href));

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Admin';
  const displayEmail = user?.email || profile?.email || 'admin@crmemy.com';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* ADMIN SIDEBAR */}
      <aside className="w-full md:w-64 bg-[#07192e] text-slate-200 border-r border-slate-800 shrink-0 flex flex-col justify-between">
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-2.5 text-decoration-none">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-extrabold text-sm flex items-center justify-center shadow-sm">
                🛡️
              </div>
              <div>
                <b className="text-white text-sm font-extrabold tracking-tight block">
                  CRM EMY <span className="text-amber-400 font-black">ADMIN</span>
                </b>
                <span className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase block">
                  Root Control Center
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {adminNav.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-amber-500 text-slate-950 font-extrabold shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-slate-950' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile & Back to CRM */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-all border border-slate-700"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to CRM Workspace</span>
          </Link>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-extrabold text-xs flex items-center justify-center border border-amber-500/30 shrink-0">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{displayName}</p>
                <span className="inline-block text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                  {role.replace('_', ' ')}
                </span>
              </div>
            </div>

            <button
              onClick={() => signOut()}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ADMIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">
              Administration Area
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            <span className="text-xs font-bold text-slate-800">
              {adminNav.find((i) => isActive(i.href))?.label || 'Dashboard'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="text-xs font-bold gap-1.5 border-slate-300">
                <ArrowLeft className="w-3.5 h-3.5" />
                Live CRM App
              </Button>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 max-w-[1500px] w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}
