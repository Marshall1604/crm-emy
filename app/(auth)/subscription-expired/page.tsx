'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  Check,
  CheckCircle,
  CheckCircle2,
  Clock,
  CreditCard,
  Crown,
  HelpCircle,
  Lock,
  LogOut,
  Mail,
  MessageSquare,
  Phone,
  RefreshCw,
  ShieldCheck,
  Sparkles,
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

export default function SubscriptionExpiredPage() {
  const router = useRouter();
  const { user, subscription, refreshSession, signOut } = useAuth();
  const [checking, setChecking] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | 'lifetime'>('yearly');
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  const handleRecheckStatus = async () => {
    setChecking(true);
    await refreshSession();
    setTimeout(() => {
      setChecking(false);
      router.push('/dashboard');
    }, 1200);
  };

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 p-4 sm:p-10 flex flex-col items-center justify-center">
      <div className="w-full max-w-6xl space-y-10 my-auto py-6">
        {/* 1. TOP HEADER SECTION */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          {/* Brand & Status Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold shadow-xs">
            <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
            <span>Subscription Status: Expired</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Your Subscription Has Expired
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mx-auto">
            Choose a plan below to renew your license and continue managing your individual clients, business tax returns, and filings.
          </p>

          {/* Safety Notice Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-bold shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>All your existing client data, documents & tax filings are safely preserved.</span>
          </div>
        </div>

        {/* 2. THREE LARGE, SPACIOUS PLAN CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CARD 1: Monthly Pro */}
          <div
            onClick={() => setSelectedPlan('monthly')}
            className={`rounded-3xl p-8 bg-white border-2 transition-all cursor-pointer flex flex-col justify-between hover:shadow-xl ${
              selectedPlan === 'monthly'
                ? 'border-blue-600 shadow-xl ring-4 ring-blue-50 relative'
                : 'border-slate-200 shadow-sm hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Monthly Pro
                </span>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    selectedPlan === 'monthly'
                      ? 'bg-blue-600 text-white'
                      : 'border-2 border-slate-300 text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              {/* Price */}
              <div className="my-6">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-5xl font-black text-slate-900 tracking-tight">$19</span>
                  <span className="text-sm text-slate-500 font-bold">/ month</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Flexible monthly billing, cancel anytime with 1 click.
                </p>
              </div>

              {/* Features List */}
              <ul className="space-y-3.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-semibold">Unlimited Individual & Business Clients</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Form 1040, 1065, 1120, 1120-S returns</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Marketing Mail & Bulk Client Campaigns</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Excel Exports & Revenue Invoicing</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Standard Email & Helpdesk Support</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <Button
                onClick={() => setIsSupportModalOpen(true)}
                className="w-full h-12 text-sm font-bold bg-[#092c5c] hover:bg-[#072247] text-white rounded-2xl shadow-sm cursor-pointer"
              >
                Renew Monthly ($19)
              </Button>
            </div>
          </div>

          {/* CARD 2: Annual Enterprise (Most Popular) */}
          <div
            onClick={() => setSelectedPlan('yearly')}
            className={`rounded-3xl p-8 bg-white border-2 relative transition-all cursor-pointer flex flex-col justify-between hover:shadow-2xl ${
              selectedPlan === 'yearly'
                ? 'border-blue-600 shadow-2xl ring-4 ring-blue-100'
                : 'border-slate-200 shadow-sm hover:border-slate-300'
            }`}
          >
            {/* Top Savings Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-blue-600 text-white text-xs font-black tracking-wider uppercase shadow-md flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Save $29 / Year (Best Value)
            </div>

            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mt-1">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-900">
                  Annual Enterprise
                </span>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    selectedPlan === 'yearly'
                      ? 'bg-blue-600 text-white'
                      : 'border-2 border-slate-300 text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              {/* Price */}
              <div className="my-6">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-5xl font-black text-slate-900 tracking-tight">$199</span>
                  <span className="text-sm text-slate-500 font-bold">/ year</span>
                </div>
                <p className="text-xs text-blue-700 font-semibold mt-2">
                  Best value for tax preparation offices & CPAs.
                </p>
              </div>

              {/* Features List */}
              <ul className="space-y-3.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-bold text-slate-900">All Monthly Pro Features Included</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="font-semibold text-blue-900">Save over 13% vs monthly billing</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Priority IRS E-file preparation workflow</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Multi-staff team management & roles</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Dedicated phone & live chat support</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <Button
                onClick={() => setIsSupportModalOpen(true)}
                className="w-full h-12 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-md cursor-pointer"
              >
                Renew Yearly ($199)
              </Button>
            </div>
          </div>

          {/* CARD 3: Lifetime License */}
          <div
            onClick={() => setSelectedPlan('lifetime')}
            className={`rounded-3xl p-8 bg-white border-2 transition-all cursor-pointer flex flex-col justify-between hover:shadow-xl ${
              selectedPlan === 'lifetime'
                ? 'border-purple-600 shadow-xl ring-4 ring-purple-50'
                : 'border-slate-200 shadow-sm hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-amber-500" />
                  Lifetime License
                </span>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    selectedPlan === 'lifetime'
                      ? 'bg-purple-600 text-white'
                      : 'border-2 border-slate-300 text-transparent'
                  }`}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              {/* Price */}
              <div className="my-6">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-5xl font-black text-slate-900 tracking-tight">$390</span>
                  <span className="text-sm text-slate-500 font-bold">one-time</span>
                </div>
                <p className="text-xs text-purple-700 font-semibold mt-2">
                  Pay once, permanent access forever without monthly fees.
                </p>
              </div>

              {/* Features List */}
              <ul className="space-y-3.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span className="font-bold text-slate-900">Never Expires (Permanent Access)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>All future CRM updates & features included</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>Unlimited staff accounts & tax seasons</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>Custom branding & office domain support</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                  <span>VIP 24/7 priority support channel</span>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <Button
                onClick={() => setIsSupportModalOpen(true)}
                className="w-full h-12 text-sm font-bold bg-purple-700 hover:bg-purple-800 text-white rounded-2xl shadow-sm cursor-pointer"
              >
                Get Lifetime ($390)
              </Button>
            </div>
          </div>
        </div>

        {/* 3. CLEAN BOTTOM FLOATING ACCOUNT CONTROL BAR */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2.5 text-xs">
            <span className="text-slate-500">Account:</span>
            <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
              {user?.email || 'www.junky3@yahoo.com'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRecheckStatus}
              disabled={checking}
              className="text-xs font-bold gap-1.5 h-10 px-4 border-slate-300 bg-white hover:bg-slate-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
              {checking ? 'Re-checking Status...' : 'Re-check Status'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSupportModalOpen(true)}
              className="text-xs font-bold gap-1.5 h-10 px-4 border-slate-300 bg-white hover:bg-slate-50 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
              Contact Support
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut()}
              className="text-xs font-bold text-rose-600 hover:bg-rose-50 h-10 px-4 gap-1.5 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* 4. PAYMENT & RENEWAL MODAL */}
      <Dialog open={isSupportModalOpen} onOpenChange={setIsSupportModalOpen}>
        <DialogContent className="max-w-lg p-6 sm:p-8 rounded-3xl bg-white space-y-6">
          <header className="flex items-center gap-3 pb-3 border-b border-slate-200">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-800 flex items-center justify-center shrink-0">
              <CreditCard className="w-6 h-6 text-[#092c5c]" />
            </div>
            <div>
              <DialogTitle className="text-lg font-black text-slate-900">
                Renew Subscription & License
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Selected Plan: <b className="text-blue-900 capitalize font-bold">{selectedPlan}</b> ({selectedPlan === 'lifetime' ? '$390' : selectedPlan === 'yearly' ? '$199' : '$19'})
              </DialogDescription>
            </div>
          </header>

          <div className="space-y-4 text-xs">
            <p className="text-slate-600 leading-relaxed">
              We accept multiple payment methods for your convenience. Once payment is confirmed, your account will be activated immediately:
            </p>

            {/* Payment Methods */}
            <div className="space-y-2.5">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <b className="text-slate-900 font-bold">1. Zelle / QuickPay (Instant Activation)</b>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Recommended
                  </span>
                </div>
                <div className="text-slate-600 font-mono text-xs">
                  Email: <b className="text-blue-700">billing@crmemy.com</b>
                </div>
                <div className="text-[11px] text-slate-500">
                  Memo: Your account email (<code>{user?.email || 'your-email@domain.com'}</code>)
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <b className="text-slate-900 font-bold block">2. Bank Wire / ACH Transfer</b>
                <div className="text-slate-600 text-[11px]">
                  Bank: <b>Chase Bank N.A.</b> · Account Name: <b>CRM EMY Tax Practice LLC</b>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <b className="text-slate-900 font-bold block">3. Office Front Desk (Cash / Check)</b>
                <div className="text-slate-600 text-[11px]">
                  Address: 12300 Westminster Ave, Garden Grove, CA 92843 · Hotline: (714) 555-0188
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <span className="text-xs text-slate-500">Support Hotline: (714) 555-0188</span>
            <Button
              onClick={() => setIsSupportModalOpen(false)}
              className="h-10 px-5 text-xs font-bold bg-[#092c5c] hover:bg-[#072247] text-white rounded-xl"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
