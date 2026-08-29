'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Building2,
  Crown,
  FileSpreadsheet,
  LogOut,
  Receipt,
  Search,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  UsersRound,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';
import { useLanguage } from '@/lib/i18n/language-context';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { Button } from '@/components/ui/button';

const workspace = [
  ['Dashboard', '/dashboard', '▦'],
  ['Clients', '/clients', '♙'],
  ['Businesses', '/businesses', '▣'],
  ['Tax Returns', '/tax-returns', '▤'],
  ['Fees', '/fees', '$'],
  ['Marketing Mail', '/marketing', '✉'],
] as const;

const manage = [
  ['Team', '/team', '♚'],
  ['Settings', '/settings', '⚙'],
] as const;

export function CrmShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, profile, role, subscription, isLifetime, signOut } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Hide CRM layout on Auth and Admin pages
  const isAuthPage =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/verify-email' ||
    pathname === '/subscription-expired' ||
    pathname === '/unauthorized' ||
    pathname.startsWith('/auth/');

  const isAdminPage = pathname.startsWith('/admin');

  if (isAuthPage || isAdminPage) {
    return <>{children}</>;
  }

  const active = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Amy Tran';
  const displayEmail = user?.email || profile?.email || 'admin@crmemy.com';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const isAdmin = role === 'super_admin' || role === 'admin';

  const planLabel = isLifetime
    ? 'Lifetime License'
    : subscription?.plan === 'yearly'
    ? 'Annual Pro'
    : subscription?.plan === 'monthly'
    ? 'Monthly Pro'
    : '7-Day Trial';

  const { t } = useLanguage();

  return (
    <div className="route-shell">
      <aside className="route-sidebar">
        <Link className="route-brand" href="/dashboard">
          <span>E<i>✓</i></span>
          <b>EMLY <em>CUSTOMER LIST</em></b>
        </Link>

        {/* WORKSPACE SECTION */}
        <nav>
          <p>{t('nav_workspace')}</p>
          {[
            [t('nav_dashboard'), '/dashboard', '▦'],
            [t('nav_clients'), '/clients', '♙'],
            [t('nav_businesses'), '/businesses', '▣'],
            [t('nav_tax_returns'), '/tax-returns', '▤'],
            [t('nav_fees'), '/fees', '$'],
            [t('nav_marketing_mail'), '/marketing', '✉'],
          ].map(([label, href, icon]) => (
            <Link
              key={href}
              href={href}
              className={active(href) ? 'active' : ''}
              aria-current={active(href) ? 'page' : undefined}
            >
              <span>{icon}</span>
              {label}
            </Link>
          ))}
        </nav>

        {/* MANAGE SECTION */}
        <nav className="route-manage">
          <p>{t('nav_manage')}</p>
          {[
            [t('nav_team'), '/team', '♚'],
            [t('nav_settings'), '/settings', '⚙'],
          ].map(([label, href, icon]) => (
            <Link
              key={href}
              href={href}
              className={active(href) ? 'active' : ''}
              aria-current={active(href) ? 'page' : undefined}
            >
              <span>{icon}</span>
              {label}
            </Link>
          ))}

          {/* ADMIN PORTAL LINK FOR ADMINS */}
          {isAdmin && (
            <Link
              href="/admin"
              className={`mt-2 font-bold !text-amber-400 hover:!bg-amber-950/40 border border-amber-500/20 rounded-lg ${
                active('/admin') ? 'active !bg-amber-500/20' : ''
              }`}
            >
              <span>🛡️</span>
              {t('nav_admin_dashboard')}
            </Link>
          )}
        </nav>

        {/* USER PROFILE & SUBSCRIPTION FOOTER */}
        <div className="route-user relative" ref={userMenuRef}>
          <button
            type="button"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2.5 w-full text-left bg-transparent border-0 p-0 cursor-pointer"
          >
            <span>{initials}</span>
            <div className="min-w-0 flex-1">
              <b className="truncate block">{displayName}</b>
              <div className="flex items-center gap-1">
                <small className="capitalize">{role.replace('_', ' ')}</small>
                <span className="text-[10px] text-emerald-400 font-bold">· {planLabel}</span>
              </div>
            </div>
            <span className="text-slate-400 text-xs px-1">•••</span>
          </button>

          {/* User Action Menu Dropdown */}
          {isUserMenuOpen && (
            <div className="absolute left-2 right-2 bottom-14 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 text-xs space-y-1 text-slate-200">
              <div className="px-3 py-2 border-b border-slate-800">
                <p className="font-bold text-white truncate">{displayName}</p>
                <p className="text-[11px] text-slate-400 truncate">{displayEmail}</p>
                <div className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-950/80 text-blue-300 text-[10px] font-bold border border-blue-800">
                  <Crown className="w-3 h-3 text-amber-400" />
                  {planLabel}
                </div>
              </div>

              {isAdmin && (
                <Link
                  href="/admin"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 text-amber-300 font-semibold"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Management</span>
                </Link>
              )}

              <Link
                href="/settings"
                onClick={() => setIsUserMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>Account Settings</span>
              </Link>

              <button
                type="button"
                onClick={() => signOut()}
                className="flex items-center gap-2 w-full px-3 py-2 rounded-lg hover:bg-rose-950/60 text-rose-400 font-bold border-0 bg-transparent cursor-pointer text-left"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      <section className="route-content">
        <header className="route-topbar">
          <label>
            <Search size={15} />
            <input placeholder="Search clients, returns, EIN..." />
            <kbd>⌘ K</kbd>
          </label>
          <div className="flex items-center gap-2.5">
            <ThemeSwitcher />
            <LanguageSwitcher />

            {isAdmin && (
              <Link href="/admin">
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 transition-colors">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                  {t('admin_panel')}
                </span>
              </Link>
            )}

            <button type="button" className="avatar-button" onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
              {initials}
            </button>
          </div>
        </header>

        {children}
      </section>
    </div>
  );
}
