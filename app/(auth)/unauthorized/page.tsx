'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Lock, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-rose-50/40 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center border border-rose-200">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
            Error 403 · Access Denied
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Unauthorized Access
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            You do not have administrative privileges to access this dashboard or feature.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 text-left space-y-1.5">
          <p className="font-semibold text-slate-800">Required Permissions:</p>
          <p>• Role: <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">super_admin</code> or <code className="bg-slate-200 px-1 py-0.5 rounded text-[11px]">admin</code></p>
          <p>• If you believe this is an error, please contact your workspace administrator.</p>
        </div>

        <Link href="/dashboard" className="block w-full">
          <Button className="w-full h-11 bg-[#092c5c] hover:bg-[#072247] text-white font-bold text-sm rounded-lg shadow-sm gap-2 cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
            Return to Dashboard
          </Button>
        </Link>
      </div>
    </main>
  );
}
