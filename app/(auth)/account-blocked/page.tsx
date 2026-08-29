'use client';

import React from 'react';
import Link from 'next/link';
import { Ban, LogOut, Mail, Phone, ShieldAlert } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';

export default function AccountBlockedPage() {
  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-radial from-rose-50 via-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-rose-200 shadow-xl p-8 space-y-6 text-center">
        {/* Blocked Icon */}
        <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 mx-auto flex items-center justify-center shadow-inner">
          <Ban className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300">
            Account Status: Blocked
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Account Suspended / Blocked
          </h1>
          <p className="text-xs text-slate-600 leading-relaxed">
            Your access to CRM Emy has been suspended or blocked by a system administrator. If you believe this is an error, please contact our support team.
          </p>
        </div>

        {/* Contact Info Box */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-left space-y-2.5">
          <b className="text-slate-800 block text-center font-bold pb-1 border-b border-slate-200">
            Contact Support & Admin
          </b>
          <div className="flex items-center gap-2 text-slate-600">
            <Mail className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="font-mono">support@crmemy.com</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Phone className="w-4 h-4 text-slate-400 shrink-0" />
            <span>(714) 555-0188</span>
          </div>
        </div>

        <div className="pt-2">
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="w-full h-11 border-slate-300 text-slate-700 font-bold text-xs rounded-lg gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out & Return to Login
          </Button>
        </div>
      </div>
    </div>
  );
}
