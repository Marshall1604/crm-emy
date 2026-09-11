'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n/language-context';
import { Crown, Sparkles, CheckCircle2, ArrowRight, ShieldCheck, MessageCircle, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProFeaturePaywallProps {
  featureNameVi: string;
  featureNameEn: string;
  featureDescriptionVi: string;
  featureDescriptionEn: string;
  icon?: React.ReactNode;
}

export function ProFeaturePaywall({
  featureNameVi,
  featureNameEn,
  featureDescriptionVi,
  featureDescriptionEn,
  icon,
}: ProFeaturePaywallProps) {
  const { language } = useLanguage();
  const isVi = language === 'vi';

  const whatsappUpgradeUrl = (planName: string) => {
    const text = isVi
      ? `Xin chào, tôi muốn nâng cấp tài khoản CRM EMLY lên gói ${planName} để mở khóa tính năng ${featureNameVi}. Vui lòng hướng dẫn tôi kích hoạt.`
      : `Hello, I would like to upgrade my CRM EMLY account to ${planName} to unlock ${featureNameEn}. Please guide me on activation.`;
    return `https://wa.me/84931233639?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center p-4 sm:p-6 bg-slate-950/35 dark:bg-slate-950/60 backdrop-blur-[6px] animate-in fade-in duration-300">
      <div className="max-w-xl w-full rounded-3xl bg-white/95 dark:bg-[#0E131F]/95 backdrop-blur-3xl border border-white/80 dark:border-slate-800 shadow-[0_25px_70px_rgba(0,0,0,0.3)] overflow-hidden text-center transform animate-in zoom-in-95 duration-300">
        {/* Top Banner Gradient */}
        <div className="bg-gradient-to-br from-[#092C5C] via-[#104380] to-[#0A1A33] p-6 sm:p-8 text-white relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-44 h-44 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            {/* Crown & Lock Icon */}
            <div className="relative mb-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-300 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-400/20">
                {icon || <Crown className="w-7 h-7 fill-slate-950" />}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-900 border-2 border-white dark:border-slate-900 flex items-center justify-center text-amber-400">
                <Lock className="w-3 h-3" />
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-extrabold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              {isVi ? 'TÍNH NĂNG ĐỘC QUYỀN PRO' : 'EXCLUSIVE PRO FEATURE'}
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {isVi ? `Mở Khóa ${featureNameVi}` : `Unlock ${featureNameEn}`}
            </h2>
            <p className="text-xs sm:text-sm text-blue-100/90 mt-1 max-w-md mx-auto leading-relaxed">
              {isVi ? featureDescriptionVi : featureDescriptionEn}
            </p>
          </div>
        </div>

        {/* Benefits & Actions */}
        <div className="p-6 sm:p-7 space-y-5 text-left">
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/60 p-4 border border-slate-200/80 dark:border-slate-800 space-y-2">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              {isVi ? 'Đặc quyền khi nâng cấp CRM EMLY PRO:' : 'Exclusive Pro Privileges:'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{isVi ? 'Toàn quyền dùng tính năng này' : 'Full access to this Pro tool'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{isVi ? 'Lưu trữ KHÔNG GIỚI HẠN khách hàng' : 'Unlimited client storage'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{isVi ? 'Siêu Trợ Lý Emly AI 50 bang' : 'Emly AI 50-State Tax Engine'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{isVi ? 'Hỗ trợ 24/7 qua WhatsApp' : 'Priority 24/7 WhatsApp Support'}</span>
              </div>
            </div>
          </div>

          {/* Pricing Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Annual Plan (Best Value) */}
            <div className="relative rounded-2xl p-4 bg-gradient-to-b from-blue-50/90 to-indigo-50/60 dark:from-blue-950/40 dark:to-indigo-950/20 border-2 border-blue-500 dark:border-blue-400 shadow-sm flex flex-col justify-between">
              <div className="absolute -top-3 right-3 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-[10px] tracking-wider uppercase shadow-xs">
                {isVi ? 'Tiết Kiệm 20%' : 'Save 20%'}
              </div>

              <div>
                <b className="text-sm font-extrabold text-blue-900 dark:text-blue-200">
                  {isVi ? 'Gói Pro Năm' : 'Pro Annual'}
                </b>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">$142</span>
                  <span className="text-xs text-slate-500 font-semibold">/ {isVi ? 'năm' : 'yr'}</span>
                </div>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">
                  ~ $11.8 / {isVi ? 'tháng' : 'mo'}
                </p>
              </div>

              <a
                href={whatsappUpgradeUrl('PRO NĂM ($142/Năm)')}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/25 transition-all text-center"
              >
                <span>{isVi ? 'Nâng Cấp Gói Năm' : 'Upgrade Annual'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Monthly Plan */}
            <div className="rounded-2xl p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between">
              <div>
                <b className="text-sm font-extrabold text-slate-900 dark:text-slate-100">
                  {isVi ? 'Gói Pro Tháng' : 'Pro Monthly'}
                </b>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-2xl font-black text-slate-900 dark:text-white">$14</span>
                  <span className="text-xs text-slate-500 font-semibold">/ {isVi ? 'tháng' : 'mo'}</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                  {isVi ? 'Linh hoạt gia hạn từng tháng' : 'Flexible month-to-month'}
                </p>
              </div>

              <a
                href={whatsappUpgradeUrl('PRO THÁNG ($14/Tháng)')}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all text-center"
              >
                <span>{isVi ? 'Nâng Cấp Gói Tháng' : 'Upgrade Monthly'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Quick WhatsApp Assistance */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              {isVi ? 'Kích hoạt ngay trong 5 phút' : 'Instant activation in 5 mins'}
            </span>
            <a
              href="https://wa.me/84931233639"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#25D366] font-bold hover:underline flex items-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp +84931233639
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
