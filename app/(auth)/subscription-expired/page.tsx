'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertTriangle,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  Crown,
  HelpCircle,
  Lock,
  Mail,
  MessageSquare,
  Phone,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth/auth-context';

export default function SubscriptionExpiredPage() {
  const router = useRouter();
  const { user, subscription, refreshSession, signOut } = useAuth();
  const [checking, setChecking] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | 'lifetime'>('monthly');
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
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50/40 p-4 sm:p-8 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl space-y-8 my-auto">
        {/* Top Warning Banner */}
        <div className="text-center space-y-3 max-w-xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 shadow-sm mb-2">
            <Clock className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Your Subscription Has Expired
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Renew your subscription to continue managing your individual clients, business returns, and tax filings.
          </p>

          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold inline-flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>All your existing client data, documents & returns are safely preserved.</span>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Monthly Plan */}
          <div
            onClick={() => setSelectedPlan('monthly')}
            className={`rounded-2xl p-6 bg-white border-2 transition-all cursor-pointer flex flex-col justify-between ${
              selectedPlan === 'monthly'
                ? 'border-blue-600 shadow-lg ring-2 ring-blue-100'
                : 'border-slate-200 shadow-xs hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Monthly Pro</span>
                {selectedPlan === 'monthly' && (
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1 my-3">
                <span className="text-3xl font-extrabold text-slate-900">$19</span>
                <span className="text-xs text-slate-500 font-medium">/ month</span>
              </div>
              <p className="text-xs text-slate-600 mb-4">Flexible monthly billing, cancel anytime.</p>

              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Unlimited Clients & Businesses</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Form 1040, 1065, 1120-S returns</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Excel Exports & Reporting</span>
                </li>
              </ul>
            </div>

            <Button
              onClick={() => setIsSupportModalOpen(true)}
              className="w-full mt-6 h-10 text-xs font-bold bg-[#092c5c] hover:bg-[#072247] text-white"
            >
              Renew Monthly ($19)
            </Button>
          </div>

          {/* Yearly Plan (Popular) */}
          <div
            onClick={() => setSelectedPlan('yearly')}
            className={`rounded-2xl p-6 bg-white border-2 relative transition-all cursor-pointer flex flex-col justify-between ${
              selectedPlan === 'yearly'
                ? 'border-blue-600 shadow-xl ring-2 ring-blue-100'
                : 'border-slate-200 shadow-xs hover:border-slate-300'
            }`}
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-600 text-white text-[11px] font-extrabold tracking-wide uppercase">
              Save $29 / Year
            </div>

            <div>
              <div className="flex items-center justify-between mb-2 mt-1">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-900">Annual Enterprise</span>
                {selectedPlan === 'yearly' && (
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1 my-3">
                <span className="text-3xl font-extrabold text-slate-900">$199</span>
                <span className="text-xs text-slate-500 font-medium">/ year</span>
              </div>
              <p className="text-xs text-slate-600 mb-4">Best value for tax preparation offices.</p>

              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>All Monthly Pro features</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Save over 13% vs monthly</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Priority Support & E-file prep</span>
                </li>
              </ul>
            </div>

            <Button
              onClick={() => setIsSupportModalOpen(true)}
              className="w-full mt-6 h-10 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white"
            >
              Renew Yearly ($199)
            </Button>
          </div>

          {/* Lifetime License */}
          <div
            onClick={() => setSelectedPlan('lifetime')}
            className={`rounded-2xl p-6 bg-white border-2 transition-all cursor-pointer flex flex-col justify-between ${
              selectedPlan === 'lifetime'
                ? 'border-purple-600 shadow-lg ring-2 ring-purple-100'
                : 'border-slate-200 shadow-xs hover:border-slate-300'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5 text-amber-500" />
                  Lifetime License
                </span>
                {selectedPlan === 'lifetime' && (
                  <span className="w-5 h-5 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-1 my-3">
                <span className="text-3xl font-extrabold text-slate-900">$390</span>
                <span className="text-xs text-slate-500 font-medium">one-time</span>
              </div>
              <p className="text-xs text-slate-600 mb-4">Pay once, permanent access forever.</p>

              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Never expires</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>All future SaaS upgrades included</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>VIP 24/7 support channel</span>
                </li>
              </ul>
            </div>

            <Button
              onClick={() => setIsSupportModalOpen(true)}
              className="w-full mt-6 h-10 text-xs font-bold bg-purple-700 hover:bg-purple-800 text-white"
            >
              Get Lifetime ($390)
            </Button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="text-xs text-slate-600">
            Account: <b className="text-slate-900">{user?.email || 'Current User'}</b>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRecheckStatus}
              disabled={checking}
              className="text-xs font-semibold gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${checking ? 'animate-spin' : ''}`} />
              {checking ? 'Checking Status...' : 'Re-check Status'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSupportModalOpen(true)}
              className="text-xs font-semibold gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Contact Support
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut()}
              className="text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Manual Payment / Support Dialog */}
      {isSupportModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#0b1e33]/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#092c5c] flex items-center justify-center font-bold">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Subscription Renewal & Payment</h3>
                  <p className="text-xs text-slate-500">Multiple instant activation options</p>
                </div>
              </div>
              <button
                onClick={() => setIsSupportModalOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <p className="text-slate-600">
                To activate or extend your subscription immediately, you can pay via any of the supported methods below:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <b className="block text-slate-900 mb-0.5">Zelle / QuickPay</b>
                  <span className="font-mono text-[11px] text-blue-700">zelle@crmemy.com</span>
                  <small className="block text-slate-500 mt-1">Instant confirmation</small>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <b className="block text-slate-900 mb-0.5">Bank Transfer / Wire</b>
                  <span className="font-mono text-[11px] text-blue-700">Chase Bank · CRM Emy</span>
                  <small className="block text-slate-500 mt-1">Same day activation</small>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <b className="block text-slate-900 mb-0.5">USDT (TRC20 / ERC20)</b>
                  <span className="font-mono text-[10px] text-purple-700 break-all">TKy9...x891</span>
                  <small className="block text-slate-500 mt-1">Automated crypto verification</small>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <b className="block text-slate-900 mb-0.5">Cash / Check</b>
                  <span className="text-[11px] text-slate-700">Tax Office Front Desk</span>
                  <small className="block text-slate-500 mt-1">Receipt provided</small>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 text-blue-900 flex items-start gap-2 mt-3">
                <HelpCircle className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <span>
                  After sending payment, contact our admin via Hotline <b>(714) 555-0188</b> or Email <b>admin@crmemy.com</b> for instant account activation.
                </span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSupportModalOpen(false)}
                className="text-xs"
              >
                Close
              </Button>
              <Button
                size="sm"
                onClick={handleRecheckStatus}
                className="text-xs bg-[#092c5c] text-white hover:bg-[#072247]"
              >
                I Have Paid — Refresh Status
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
