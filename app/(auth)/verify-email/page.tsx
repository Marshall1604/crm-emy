'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  CheckCircle2,
  Mail,
  RefreshCw,
  Send,
  ShieldCheck,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || 'your email';

  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);

  const handleResend = async () => {
    if (!email || email === 'your email') {
      setResendError('Email address not found. Please try registering again.');
      return;
    }

    setResendError(null);
    setResending(true);

    try {
      if (supabase) {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) {
          setResendError(error.message);
          setResending(false);
          return;
        }
      }

      setResendSuccess(true);
      setResending(false);
    } catch (err: any) {
      setResendError(err.message || 'Failed to resend confirmation email.');
      setResending(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-8 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-800 mx-auto flex items-center justify-center border border-blue-200">
        <Mail className="w-8 h-8 text-blue-700" />
      </div>

      <div className="space-y-2">
        <div className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
          Email Verification Required
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Verify Your Email Address
        </h1>
        <p className="text-xs text-slate-600 leading-relaxed">
          We have sent a secure confirmation link to <br />
          <b className="text-slate-900 font-bold font-mono text-sm">{email}</b>
        </p>
      </div>

      {resendSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Verification email resent successfully! Check your inbox.</span>
        </div>
      )}

      {resendError && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{resendError}</span>
        </div>
      )}

      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left text-xs text-slate-600 space-y-2">
        <div className="flex items-center gap-2 font-bold text-slate-800">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Next Steps:</span>
        </div>
        <p>1. Check your email inbox (and Spam/Junk folder).</p>
        <p>2. Click <b>Confirm Your Account</b> inside the email.</p>
        <p>3. Return here and sign in to access your CRM workspace.</p>
      </div>

      <div className="space-y-3 pt-2">
        <Link href="/login" className="w-full block">
          <Button className="w-full h-11 bg-[#092c5c] hover:bg-[#072247] text-white font-bold text-sm rounded-lg shadow-sm cursor-pointer">
            Proceed to Sign In
          </Button>
        </Link>

        <Button
          type="button"
          variant="outline"
          disabled={resending}
          onClick={handleResend}
          className="w-full h-10 border-slate-300 font-bold text-xs rounded-lg gap-2 text-slate-700 hover:bg-slate-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
          {resending ? 'Resending...' : 'Resend Verification Email'}
        </Button>

        <div className="pt-2">
          <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to login</span>
          </Link>
        </div>
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
