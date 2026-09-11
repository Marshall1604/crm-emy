'use client';

import React from 'react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n/language-context';
import { Sparkles, Crown, CheckCircle2, Zap, MessageCircle, X, ShieldCheck, ArrowRight } from 'lucide-react';

interface UpgradeProModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentCount?: number;
}

export function UpgradeProModal({ open, onOpenChange, currentCount = 20 }: UpgradeProModalProps) {
  const { language } = useLanguage();
  const isVi = language === 'vi';

  const whatsappUpgradeUrl = (planName: string) => {
    const text = isVi
      ? `Xin chào, tôi muốn nâng cấp tài khoản CRM EMLY lên gói ${planName}. Vui lòng hướng dẫn tôi kích hoạt.`
      : `Hello, I would like to upgrade my CRM EMLY account to ${planName}. Please guide me on activation.`;
    return `https://wa.me/84931233639?text=${encodeURIComponent(text)}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 overflow-hidden bg-white dark:bg-[#0E131F] border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-[0_25px_70px_rgba(0,0,0,0.25)]">
        {/* Luxury Pro Header */}
        <div className="relative bg-gradient-to-br from-[#092C5C] via-[#104380] to-[#0A1A33] p-6 sm:p-7 text-white overflow-hidden">
          <div className="absolute -top-12 -right-12 w-44 h-44 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-300 text-slate-950 flex items-center justify-center shadow-lg shadow-amber-400/20 shrink-0">
              <Crown className="w-6 h-6 fill-slate-950" />
            </div>

            <div className="space-y-1 pr-6">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[11px] font-extrabold uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-amber-300" />
                {isVi ? 'Hạn Mức Gói Miễn Phí' : 'Free Tier Limit'}
              </div>

              <DialogTitle className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
                {isVi ? 'Mở Khóa Lưu Trữ Không Giới Hạn' : 'Unlock Unlimited Clients & Pro Features'}
              </DialogTitle>
              <DialogDescription className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
                {isVi ? (
                  <>
                    Bạn đã đạt hạn mức tối đa <strong className="text-amber-300 font-bold">{currentCount} khách hàng</strong> của gói Miễn Phí. Hãy nâng cấp lên <strong className="text-white font-bold">CRM EMLY PRO</strong> để tiếp tục thêm khách hàng không giới hạn!
                  </>
                ) : (
                  <>
                    You have reached the free limit of <strong className="text-amber-300 font-bold">{currentCount} clients</strong>. Upgrade to <strong className="text-white font-bold">CRM EMLY PRO</strong> for unlimited records and AI superpowers!
                  </>
                )}
              </DialogDescription>
            </div>
          </div>
        </div>

        {/* Benefits List */}
        <div className="p-6 space-y-5">
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-900/60 p-4 border border-slate-200/80 dark:border-slate-800 space-y-2.5">
            <p className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              {isVi ? 'Quyền lợi độc quyền khi nâng cấp Pro:' : 'Exclusive Pro Benefits:'}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{isVi ? 'Lưu trữ KHÔNG GIỚI HẠN khách hàng' : 'Unlimited client records'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{isVi ? 'Emly AI - Trí tuệ thuế 50 bang' : 'Emly AI 50-State Tax Knowledge'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{isVi ? 'Báo cáo & Phân tích thông minh bằng AI' : 'AI-Powered Client Reports'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{isVi ? 'Module Bảo Hiểm & Marketing Mail' : 'Insurance Services & Marketing'}</span>
              </div>
              <div className="flex items-center gap-2 sm:col-span-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{isVi ? 'Hỗ trợ ưu tiên 24/7 & Cập nhật tính năng liên tục' : 'Priority 24/7 Support & Continuous Updates'}</span>
              </div>
            </div>
          </div>

          {/* 2 Plan Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Annual Plan (Best Value) */}
            <div className="relative rounded-2xl p-4 bg-gradient-to-b from-blue-50/80 to-indigo-50/50 dark:from-blue-950/40 dark:to-indigo-950/20 border-2 border-blue-500 dark:border-blue-400 shadow-sm flex flex-col justify-between">
              <div className="absolute -top-3 right-3 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-black text-[10px] tracking-wider uppercase shadow-xs">
                {isVi ? 'Tiết Kiệm 20%' : 'Save 20%'}
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <b className="text-sm font-extrabold text-blue-900 dark:text-blue-200">
                    {isVi ? 'Gói Pro Năm' : 'Pro Annual'}
                  </b>
                </div>
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
                className="mt-4 w-full py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/25 transition-all"
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
                className="mt-4 w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
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
              {isVi ? 'Kích hoạt ngay lập tức qua WhatsApp' : 'Instant activation via WhatsApp'}
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
      </DialogContent>
    </Dialog>
  );
}
