'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Lock, Save, ShieldCheck } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
          SaaS System Settings
        </h1>
        <p className="text-sm text-slate-600 mt-0.5">
          Configure security policies, email verification requirements, and payment providers.
        </p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        {/* Security Settings */}
        <div>
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            Security & Authentication
          </h3>
          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-blue-600 w-4 h-4" />
              <div>
                <b className="text-slate-800 block">Require Email Verification</b>
                <span className="text-slate-500">Users must confirm email before accessing workspace features.</span>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded text-blue-600 w-4 h-4" />
              <div>
                <b className="text-slate-800 block">Enforce Row Level Security (RLS)</b>
                <span className="text-slate-500">Strictly isolate data rows in PostgreSQL by user_id.</span>
              </div>
            </label>
          </div>
        </div>

        {/* Free Trial Config */}
        <div className="pt-4 border-t border-slate-200">
          <h3 className="text-sm font-bold text-slate-900 mb-3">Trial Settings</h3>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Default Trial Duration</label>
              <input
                type="number"
                defaultValue={7}
                className="w-full h-9 px-3 rounded-lg border border-slate-300"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Trial Plan Name</label>
              <input
                type="text"
                defaultValue="7-Day Free Trial"
                className="w-full h-9 px-3 rounded-lg border border-slate-300"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 flex justify-end">
          <Button className="h-9 px-4 text-xs font-bold gap-1.5 bg-[#092c5c] hover:bg-[#072247] text-white">
            <Save className="w-3.5 h-3.5" />
            Save Configurations
          </Button>
        </div>
      </div>
    </div>
  );
}
