'use client';

import React from 'react';
import { Check, CheckCircle2, Crown, Layers, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminPlansPage() {
  const plans = [
    {
      id: 'trial',
      name: '7-Day Free Trial',
      price: '$0',
      interval: '7 days',
      features: ['All CRM features included', 'Auto-assigned upon registration', 'Expires after 7 days'],
      activeUsers: 1,
    },
    {
      id: 'monthly',
      name: 'Monthly Pro',
      price: '$49',
      interval: 'per month',
      features: ['Unlimited clients and business returns', 'Form 1040, 1065, 1120-S support', 'Excel exports & reporting', 'Standard support'],
      activeUsers: 2,
    },
    {
      id: 'yearly',
      name: 'Annual Enterprise',
      price: '$490',
      interval: 'per year (Save $98)',
      features: ['All Pro features', '2 Months free included', 'Priority IRS e-file prep', 'Dedicated onboarding'],
      activeUsers: 1,
    },
    {
      id: 'lifetime',
      name: 'Lifetime License',
      price: '$999',
      interval: 'one-time payment',
      features: ['Permanent unlimited access', 'Never expires', 'All future SaaS upgrades included', 'VIP dedicated support'],
      activeUsers: 1,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold tracking-wider text-slate-500 uppercase">Subscription Plans</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            SaaS Plans & Pricing
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Configure subscription tiers, price points, and license parameters.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {plans.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500 uppercase">{p.name}</span>
                {p.id === 'lifetime' && <Crown className="w-4 h-4 text-amber-500" />}
              </div>
              <div className="flex items-baseline gap-1 my-3">
                <span className="text-3xl font-black text-slate-900">{p.price}</span>
                <span className="text-xs text-slate-500 font-medium">{p.interval}</span>
              </div>

              <ul className="space-y-2 text-xs text-slate-600 mt-4">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">Active Subscribers:</span>
              <span className="text-xs font-bold text-slate-900">{p.activeUsers}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
