'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Crown,
  FileSpreadsheet,
  LogOut,
  Receipt,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  User,
  Users,
  UsersRound,
  Zap,
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
  const router = useRouter();
  const { user, profile, role, subscription, isLifetime, signOut } = useAuth();
  const { t } = useLanguage();
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

  // Preload all workspace tabs into browser memory on mount for instant 0ms transitions
  useEffect(() => {
    const routesToPreload = [
      '/dashboard',
      '/clients',
      '/businesses',
      '/tax-returns',
      '/fees',
      '/marketing',
      '/team',
      '/settings',
      '/checkout',
    ];
    routesToPreload.forEach((route) => {
      try {
        router.prefetch(route);
      } catch (e) {}
    });
  }, [router]);

  // Hide CRM layout on Auth, Admin, Public Landing, and Checkout pages
  const isAuthPage =
    pathname === '/' ||
    pathname === '/home' ||
    pathname === '/checkout' ||
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/forgot-password' ||
    pathname === '/reset-password' ||
    pathname === '/verify-email' ||
    pathname === '/account-blocked' ||
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
              prefetch={true}
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
              prefetch={true}
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
              prefetch={true}
              className={`mt-2 font-bold !text-amber-400 hover:!bg-amber-950/40 border border-amber-500/20 rounded-lg ${
                active('/admin') ? 'active !bg-amber-500/20' : ''
              }`}
            >
              <span>🛡️</span>
              {t('nav_admin_dashboard')}
            </Link>
          )}
        </nav>

        {/* ─── PRO WORKSPACE UPGRADE CARD (MINIMALIST SILICON-VALLEY SAAS STYLE) ─── */}
        <div className="mx-2.5 my-3 p-4 rounded-2xl bg-white dark:bg-[#1E232B] text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700/80 shadow-xs hover:border-slate-300 dark:hover:border-slate-600 transition-all flex flex-col justify-between min-h-[250px]">
          <div>
            {/* Header with Clean Badge */}
            <div className="flex items-center justify-between gap-2 mb-2.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 font-bold text-[10px] tracking-wider uppercase border border-blue-200/60 dark:border-blue-900/40">
                <Sparkles className="w-3 h-3 text-amber-500" />
                PRO UPGRADE
              </span>
              <span className="text-[10px] font-bold text-slate-400">All-in-one</span>
            </div>

            <h4 className="text-sm font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight mb-1">
              Unlock Pro Features
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug mb-3.5">
              Scale your tax practice with automated client workflows.
            </p>

            {/* Feature List with Clean Monochromatic Badges */}
            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-200 mb-4 font-normal">
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span className="leading-tight">Auto Marketing Email Suite</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span className="leading-tight">Unlimited Rate Conversions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span className="leading-tight">1-Click Excel / CSV Export</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-4 h-4 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </span>
                <span className="leading-tight">Fees & Payments Dashboard</span>
              </li>
            </ul>
          </div>

          {/* Action Button */}
          <Link href="/checkout" className="block w-full pt-1">
            <Button
              className="w-full h-9.5 bg-[#092c5c] hover:bg-[#072247] dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-xs gap-1.5 transition-all cursor-pointer"
            >
              <span>Upgrade to Pro</span>
              <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
            </Button>
          </Link>
        </div>

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
                  prefetch={true}
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-800 text-amber-300 font-semibold"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin Management</span>
                </Link>
              )}

              <Link
                href="/settings"
                prefetch={true}
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
          {/* ─── PRO WORKSPACE TOPBAR BANNER ─── */}
          <div className="flex-1 min-w-0 mr-2 sm:mr-4" id="topbar-ad-slot">
            <div className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-[#1E232B] border border-slate-200/90 dark:border-slate-700/80 overflow-hidden shadow-2xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#092c5c] text-white dark:bg-blue-600 font-black text-[10px] uppercase tracking-wider shadow-2xs">
                  <Crown className="w-3 h-3 text-amber-400" />
                  PRO
                </span>
                <p className="text-xs font-medium text-slate-700 dark:text-slate-200 truncate">
                  <strong className="font-extrabold text-slate-900 dark:text-white">Upgrade to Pro:</strong>{' '}
                  <span className="text-slate-600 dark:text-slate-400 hidden lg:inline">
                    Automated Marketing Mail • Unlimited Conversions • Excel Export • Fees & Payments Dashboard
                  </span>
                  <span className="text-slate-600 dark:text-slate-400 hidden md:inline lg:hidden">
                    Auto Email • Excel Export • Fees & Payments
                  </span>
                  <span className="text-slate-600 dark:text-slate-400 md:hidden">
                    Auto Mail • Excel • Fees
                  </span>
                </p>
              </div>

              <Link
                href="/checkout"
                className="shrink-0 inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#092c5c] hover:bg-[#072247] dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-bold text-[11px] shadow-xs hover:shadow-md transition-all whitespace-nowrap cursor-pointer"
              >
                <span>Upgrade Now</span>
                <ArrowRight className="w-3 h-3 text-amber-400" />
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0 ml-auto">
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
