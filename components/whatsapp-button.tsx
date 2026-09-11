'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/lib/i18n/language-context';
import { MessageCircle, X, ExternalLink, ShieldCheck, Sparkles, PhoneCall, AlertCircle, HelpCircle } from 'lucide-react';

export function WhatsAppButton() {
  const { language } = useLanguage();
  const isVi = language === 'vi';
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // WhatsApp international link: Country code Vietnam 84 + 931233639
  const phoneNumber = '84931233639';

  const getWhatsAppLink = (customText?: string) => {
    const text = customText || (isVi
      ? 'Xin chào, tôi cần hỗ trợ về phần mềm CRM EMLY.'
      : 'Hello, I need support regarding CRM EMLY.');
    return `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
  };

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Support Popup Card with Smooth Fast-to-Slow Deceleration Animation (ease-out) */}
      {isOpen && (
        <div
          ref={popupRef}
          role="dialog"
          aria-modal="true"
          aria-label={isVi ? 'Hỗ trợ khách hàng' : 'Customer Support'}
          className="mb-3 w-[340px] sm:w-[380px] max-w-[calc(100vw-2.5rem)] rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.18),0_4px_12px_rgba(37,211,102,0.12)] overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] transform origin-bottom-right animate-in fade-in zoom-in-90 slide-in-from-bottom-4"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#128C7E] to-[#25D366] p-4 text-white relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-black/15 text-white/90 hover:text-white transition-colors"
              aria-label="Đóng"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 shadow-inner">
                  <MessageCircle className="w-6 h-6 fill-white/20" />
                </div>
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white dark:border-slate-900 animate-pulse" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-white">
                    {isVi ? 'Hỗ Trợ Trực Tuyến' : 'Direct Support'}
                  </h3>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-white/25 text-white">
                    24/7
                  </span>
                </div>
                <p className="text-xs text-white/90 flex items-center gap-1">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-300" />
                  {isVi ? 'Sẵn sàng phản hồi ngay' : 'Ready to respond instantly'}
                </p>
              </div>
            </div>
          </div>

          {/* Body Content */}
          <div className="p-4 sm:p-5 space-y-4">
            {/* Main Message Banner */}
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/70 dark:border-emerald-800/60 rounded-xl p-3.5 flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#25D366]/15 text-[#128C7E] dark:text-[#25D366] shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                {isVi ? (
                  <>
                    Nếu Quý khách <span className="text-[#128C7E] dark:text-emerald-400 font-semibold">cần hỗ trợ</span> hoặc gặp bất kỳ sự cố / <span className="text-rose-600 dark:text-rose-400 font-semibold">ứng dụng bị lỗi</span>, hãy liên hệ trực tiếp cho tôi qua WhatsApp để được xử lý ngay lập tức!
                  </>
                ) : (
                  <>
                    If you <span className="text-[#128C7E] dark:text-emerald-400 font-semibold">need assistance</span> or encounter any <span className="text-rose-600 dark:text-rose-400 font-semibold">system issue/bug</span>, feel free to reach out to me directly on WhatsApp for immediate support!
                  </>
                )}
              </div>
            </div>

            {/* Quick Presets */}
            <div className="space-y-1.5">
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                {isVi ? 'Chọn nhanh nhu cầu hỗ trợ:' : 'Quick contact options:'}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <a
                  href={getWhatsAppLink(
                    isVi
                      ? 'Chào bạn, tôi cần báo lỗi / phản ánh sự cố trên hệ thống EMLY CRM.'
                      : 'Hello, I would like to report an issue/bug on EMLY CRM.'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-slate-50 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/40 border border-slate-200/80 hover:border-rose-200 dark:border-slate-700 dark:hover:border-rose-800/60 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:text-rose-700 dark:hover:text-rose-300 transition-all text-left group"
                >
                  <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="truncate">{isVi ? 'Báo lỗi hệ thống' : 'Report Bug'}</span>
                </a>

                <a
                  href={getWhatsAppLink(
                    isVi
                      ? 'Chào bạn, tôi cần tư vấn & hướng dẫn sử dụng phần mềm EMLY CRM.'
                      : 'Hello, I need guidance and help with using EMLY CRM.'
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg bg-slate-50 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/40 border border-slate-200/80 hover:border-emerald-200 dark:border-slate-700 dark:hover:border-emerald-800/60 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-300 transition-all text-left group"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="truncate">{isVi ? 'Tư vấn sử dụng' : 'User Guide'}</span>
                </a>
              </div>
            </div>

            {/* Primary Action Button - Opens WhatsApp Directly */}
            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#25D366] to-[#128C7E] hover:from-[#20bd5a] hover:to-[#0f7a6d] text-white font-semibold text-sm shadow-[0_4px_16px_rgba(37,211,102,0.35)] hover:shadow-[0_6px_22px_rgba(37,211,102,0.5)] flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group"
            >
              {/* WhatsApp SVG Icon */}
              <svg
                className="w-5 h-5 fill-current group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.21 8.21 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.5 11.66c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.47c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.78 2.72 4.3 3.81.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.3z" />
              </svg>
              <span>{isVi ? 'Chat WhatsApp Ngay' : 'Chat on WhatsApp Now'}</span>
              <ExternalLink className="w-4 h-4 opacity-80 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            {/* Footer note */}
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500 text-center pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>{isVi ? 'Hỗ trợ kỹ thuật & giải đáp miễn phí' : 'Free technical & customer support'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Trigger Button */}
      <div className="flex items-center group">
        {/* Tooltip on Hover (only when closed) */}
        {!isOpen && (
          <span className="hidden sm:inline-block mr-3 px-3 py-1.5 rounded-full bg-slate-900/90 text-white text-xs font-semibold shadow-lg backdrop-blur-md opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap">
            {isVi ? 'Hỗ trợ & Báo lỗi qua WhatsApp' : 'Support & Report Issues on WhatsApp'}
          </span>
        )}

        <button
          ref={buttonRef}
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-label={isOpen ? 'Đóng hỗ trợ' : 'Mở hỗ trợ WhatsApp'}
          className={`relative w-13 h-13 sm:w-14 sm:h-14 rounded-full text-white flex items-center justify-center shadow-[0_6px_22px_rgba(37,211,102,0.45)] hover:shadow-[0_8px_32px_rgba(37,211,102,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isOpen
              ? 'bg-slate-800 hover:bg-slate-900 shadow-slate-900/30 ring-4 ring-slate-200 dark:ring-slate-700'
              : 'bg-[#25D366] hover:bg-[#20bd5a]'
          }`}
        >
          {/* Subtle Pulse Ring (only when closed) */}
          {!isOpen && (
            <span
              className="absolute inset-0 rounded-full bg-[#25D366] opacity-30 animate-ping pointer-events-none"
              style={{ animationDuration: '2.5s' }}
            />
          )}

          {/* Toggle Icons with Rotation */}
          {isOpen ? (
            <X className="w-6 h-6 text-white transition-transform duration-300 rotate-0" />
          ) : (
            <svg
              className="w-6 h-6 sm:w-7 sm:h-7 fill-current relative z-10 transition-transform duration-300 group-hover:rotate-12"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.21 8.21 0 0 1 2.41 5.82c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm4.5 11.66c-.25-.12-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.38-1.72-.15-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.47c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.78 2.72 4.3 3.81.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.3z" />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}

