'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft, CheckCircle, Mail, RefreshCw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || 'your email';

  return (
    <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-8 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-800 mx-auto flex items-center justify-center border border-blue-200">
        <Mail className="w-8 h-8 text-blue-700" />
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Verify Your Email
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          We sent a verification link to <br />
          <b className="text-slate-900 font-bold">{email}</b>
        </p>
      </div>

      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs text-slate-600 space-y-2">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Next Steps:</span>
        </div>
        <p>1. Open the email message from <b>CRM EMY Tax Practice</b>.</p>
        <p>2. Click <b>Confirm Your Account</b> to activate your profile.</p>
        <p>3. Return here and sign in to your workspace.</p>
      </div>

      <div className="space-y-3 pt-2">
        <Link href="/login" className="w-full block">
          <Button className="w-full h-11 bg-[#092c5c] hover:bg-[#072247] text-white font-bold text-sm rounded-lg shadow-sm cursor-pointer">
            Proceed to Sign In
          </Button>
        </Link>

        <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to login</span>
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50/40 flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-sm font-semibold text-slate-600">Loading...</div>}>
        <VerifyEmailContent />
      </Suspense>
    </main>
  );
}
