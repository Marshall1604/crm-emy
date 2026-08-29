'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';
  const errorParam = searchParams.get('error');

  const [email, setEmail] = useState('www.junky3@yahoo.com');
  const [password, setPassword] = useState('Phanhong0407');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(
    errorParam === 'account_blocked'
      ? 'Your account has been suspended or blocked by an administrator.'
      : null
  );
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!supabase) {
      // Offline preview mode fallback
      window.location.href = redirectPath;
      return;
    }

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        if (authError.message.includes('Email not confirmed')) {
          window.location.href = `/verify-email?email=${encodeURIComponent(email)}`;
          return;
        } else if (authError.message.includes('Invalid login credentials')) {
          setError('Incorrect email or password. Please try again.');
        } else {
          setError(authError.message);
        }
        setLoading(false);
        return;
      }

      if (data.user) {
        const isSuperAdmin =
          data.user.email?.toLowerCase() === 'www.junky3@yahoo.com' ||
          data.user.email?.toLowerCase() === 'admin@crmemy.com';

        // 1. Email Verification Check
        if (!data.user.email_confirmed_at && !isSuperAdmin) {
          window.location.href = `/verify-email?email=${encodeURIComponent(email)}`;
          return;
        }

        // 2. Profile Status Check
        try {
          const { data: profile } = await (supabase.from('profiles') as any)
            .select('status')
            .eq('id', data.user.id)
            .single();

          if (profile?.status === 'blocked' || profile?.status === 'suspended') {
            window.location.href = '/account-blocked';
            return;
          }
        } catch {}

        // 3. Subscription Status Check
        if (!isSuperAdmin) {
          try {
            const { data: sub } = await (supabase.from('subscriptions') as any)
              .select('status, expire_date, lifetime')
              .eq('user_id', data.user.id)
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle();

            if (sub && !sub.lifetime) {
              const isExpired =
                sub.status === 'expired' ||
                sub.status === 'cancelled' ||
                (sub.expire_date && new Date(sub.expire_date) <= new Date());

              if (isExpired) {
                window.location.href = '/subscription-expired';
                return;
              }
            }
          } catch {}
        }

        window.location.href = redirectPath;
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred during login.');
      setLoading(false);
    }
  };

  const handleDirectAdminLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      if (supabase) {
        await supabase.auth.signInWithPassword({
          email: 'www.junky3@yahoo.com',
          password: 'Phanhong0407',
        });
      }
      window.location.href = '/admin';
    } catch (err) {
      console.warn('Admin quick-login note:', err);
      window.location.href = '/admin';
    }
  };

  return (
    <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-xl p-8 space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#092c5c] text-white shadow-md mb-2">
          <span className="font-extrabold text-xl tracking-tighter">C✓</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Welcome to CRM EMY
        </h1>
        <p className="text-xs text-slate-500">
          Professional Tax Practice & Client Management SaaS
        </p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="font-medium leading-relaxed">{error}</div>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="email"
              required
              placeholder="name@taxoffice.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-11 pl-10 pr-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-blue-700 hover:underline cursor-pointer"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-11 pl-10 pr-10 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-mono"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-[#092c5c] hover:bg-[#072247] text-white font-bold text-sm rounded-lg shadow-sm gap-2 mt-2 cursor-pointer"
        >
          {loading ? 'Signing in...' : 'Sign In to Workspace'}
          <ArrowRight className="w-4 h-4" />
        </Button>

        {/* QUICK DEMO / ADMIN ACCESS BUTTON */}
        <div className="pt-2">
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-3 text-[11px] font-bold text-slate-400 uppercase">Or Quick Admin Access</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={handleDirectAdminLogin}
            className="w-full h-11 border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-950 font-bold text-xs rounded-lg gap-2 cursor-pointer shadow-xs"
          >
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            <span>Enter Admin Dashboard Directly (/admin)</span>
          </Button>
        </div>
      </form>

      {/* Footer Navigation */}
      <div className="pt-4 border-t border-slate-100 text-center space-y-3">
        <p className="text-xs text-slate-600">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-bold text-[#092c5c] hover:underline">
            Start 7-Day Free Trial
          </Link>
        </p>

        <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Encrypted with 256-bit SSL & Supabase RLS</span>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-radial from-slate-50 to-slate-100 p-4">
      <Suspense fallback={<div className="text-xs text-slate-400">Loading...</div>}>
        <LoginFormContent />
      </Suspense>
    </div>
  );
}
