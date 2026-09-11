'use client';

import React from 'react';
import { Check, CheckCircle2, Crown, Layers, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminPlansPage() {
  const plans = [
    {
      id: 'free',
      name: 'Free Starter',
      price: '$0',
      interval: 'Free Forever',
      badge: 'Bản Miễn Phí',
      features: [
        'Up to 20 client records',
        'Form 1040 & Corporate 1120/1065',
        'IRS return workflow tracker',
        'Basic fee & invoice billing',
        '1-click Excel/CSV export',
      ],
      activeUsers: 1,
    },
    {
      id: 'monthly',
      name: 'Pro Monthly',
      price: '$14',
      interval: 'per month',
      badge: 'Gói Tháng',
      features: [
        'UNLIMITED client & business records',
        'Emly AI 50-State Tax Knowledge',
        'AI-powered client reports',
        'Insurance Services Pro module',
        'Marketing Mail bulk campaigns',
        'Continuous feature updates',
      ],
      activeUsers: 2,
    },
    {
      id: 'yearly',
      name: 'Pro Annual (Best Value)',
      price: '$142',
      interval: 'per year (Save 20% ~ $11.8/mo)',
      badge: 'Gói Năm (Khuyên Dùng)',
      features: [
        'Everything in Pro Monthly included',
        'Save 20% compared to monthly plan',
        'UNLIMITED client & business storage',
        'Emly AI 50-State Tax Engine',
        'Priority 24/7 WhatsApp & VIP support',
      ],
      activeUsers: 1,
    },
    {
      id: 'lifetime',
      name: 'Pro Lifetime License',
      price: 'Liên hệ WhatsApp',
      interval: 'Bản quyền vĩnh viễn',
      badge: 'Bản Quyền Trọn Đời',
      features: [
        'Permanent lifetime unlimited access',
        'Never expires • 0 recurring fee',
        'All future Pro upgrades & AI included',
        'VIP direct dedicated support',
      ],
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
