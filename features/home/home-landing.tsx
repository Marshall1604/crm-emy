'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  DollarSign,
  Download,
  FileCheck,
  FileSpreadsheet,
  Globe,
  HardDrive,
  HelpCircle,
  Laptop,
  Layers,
  Lock,
  Mail,
  Megaphone,
  Monitor,
  Moon,
  Plus,
  Receipt,
  RotateCcw,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  UserCheck,
  Users,
  UsersRound,
  X,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n/language-context';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeSwitcher } from '@/components/theme-switcher';

export function HomeLanding() {
  const { language } = useLanguage();
  const isVi = language === 'vi';

  // Demo interactive state
  const [activeTab, setActiveTab] = useState<'dashboard' | 'clients' | 'businesses' | 'pipeline' | 'fees' | 'marketing'>('dashboard');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  // Pricing toggle state (Tạm ẩn - Đổi thành true để hiển thị lại sau khi hoàn thiện)
  const showPricingSection = false;
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F15] text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans selection:bg-[#092C5C] selection:text-white overflow-x-hidden relative">
      
      {/* ─── BACKGROUND AMBIENT GLOW MESH (LUXURY FINTECH FROSTED GLOW) ─── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] sm:w-[1100px] h-[400px] sm:h-[650px] bg-gradient-to-b from-blue-600/15 via-indigo-500/10 to-transparent dark:from-blue-600/20 dark:via-emerald-500/10 dark:to-transparent rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute top-1/4 -left-40 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-emerald-500/10 dark:bg-emerald-500/10 rounded-full blur-3xl animate-float-slow" />
        <div className="absolute top-2/3 -right-40 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl animate-float-reverse" />
        <div className="absolute bottom-10 left-1/4 w-[450px] h-[450px] bg-indigo-500/8 dark:bg-purple-600/8 rounded-full blur-3xl animate-pulse-glow" />
      </div>

      {/* ─── FLOATING LUXURY FROSTED GLASS NAVIGATION BAR ─── */}
      <div className="sticky top-0 z-50 pt-3 pb-2 px-3 sm:px-6 max-w-7xl mx-auto">
        <header className="backdrop-blur-3xl bg-white/80 dark:bg-[#12161F]/80 border border-white/80 dark:border-white/10 rounded-2xl sm:rounded-full px-4 sm:px-6 py-2.5 sm:py-3 transition-all shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] flex items-center justify-between gap-3">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-[#092C5C] via-[#10427D] to-[#0A264A] text-white flex items-center justify-center font-black text-base sm:text-lg shadow-[0_4px_12px_rgba(9,44,92,0.3)] group-hover:scale-105 transition-all duration-300 border border-blue-400/30">
              <span className="relative">
                E<i className="absolute -right-1 -bottom-0.5 text-[9px] sm:text-[11px] not-italic text-emerald-400 font-extrabold">✓</i>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-base sm:text-lg leading-none tracking-tight text-[#092C5C] dark:text-white flex items-center gap-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                EMLY <span className="px-1.5 py-0.5 rounded-md text-[9px] sm:text-[10px] font-black bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-2xs">CRM</span>
              </span>
              <span className="hidden sm:block text-[9px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase mt-0.5">
                {isVi ? 'Phần Mềm Quản Lý Thuế Hoa Kỳ' : 'US Tax Practice CRM'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2 text-xs font-bold text-slate-600 dark:text-slate-300">
            <a href="#features" className="px-3.5 py-1.5 rounded-full hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200">
              {isVi ? 'Tính Năng' : 'Features'}
            </a>
            <a href="#preview" className="px-3.5 py-1.5 rounded-full hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200">
              {isVi ? 'Trải Nghiệm Live' : 'Live Demo'}
            </a>
            {showPricingSection && (
              <a href="#pricing" className="px-3.5 py-1.5 rounded-full hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200">
                {isVi ? 'Bảng Giá' : 'Pricing'}
              </a>
            )}
            <a href="#testimonials" className="px-3.5 py-1.5 rounded-full hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200">
              {isVi ? 'Đánh Giá' : 'Reviews'}
            </a>
            <a href="#faq" className="px-3.5 py-1.5 rounded-full hover:bg-slate-100/80 dark:hover:bg-slate-800/80 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200">
              {isVi ? 'Hỏi & Đáp' : 'FAQ'}
            </a>
          </nav>

          {/* Right Action Group */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <ThemeSwitcher />
            <LanguageSwitcher />

            <Link href="/login" className="hidden sm:inline-block">
              <Button
                variant="ghost"
                className="text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 cursor-pointer h-8 sm:h-9 px-3.5 rounded-full transition-all"
              >
                {isVi ? 'Đăng Nhập' : 'Sign In'}
              </Button>
            </Link>

            <Link href="/register">
              <Button className="h-8 sm:h-9 px-3.5 sm:px-4 text-xs font-black bg-gradient-to-r from-[#092C5C] via-[#10427D] to-[#092C5C] hover:opacity-95 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 gap-1.5 rounded-full cursor-pointer shimmer-btn">
                <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                <span className="whitespace-nowrap">{isVi ? 'Dùng Thử Miễn Phí' : 'Start Free Trial'}</span>
              </Button>
            </Link>
          </div>
        </header>
      </div>

      <main className="relative z-10">

        {/* ══════════════════════════════════════════════════════════
            1. HERO SECTION (ELEGANT SAAS ARCHITECTURE & HIGH CONVERSION)
        ══════════════════════════════════════════════════════════ */}
        <section className="pt-8 pb-10 sm:pt-14 sm:pb-16 md:pt-16 md:pb-20 text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          {/* Eyebrow Live Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-white/80 dark:bg-[#151B24]/80 text-slate-800 dark:text-slate-200 border border-blue-200/80 dark:border-blue-900/50 shadow-sm mb-6 sm:mb-8 backdrop-blur-xl hover:scale-105 transition-transform duration-300">
            <span className="flex h-2 w-2 relative shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="tracking-wide text-[11px] sm:text-xs">
              {isVi
                ? 'Nền Tảng Quản Lý Thuế Cho Văn Phòng Kế Toán Hoa Kỳ • Mùa Thuế 2025/2026'
                : 'The #1 Tax Practice Management CRM For US Accounting Offices • Season 2025/2026'}
            </span>
          </div>

          {/* Main H1 Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[64px] font-black text-slate-900 dark:text-white tracking-tight leading-[1.14] max-w-4xl mx-auto">
            {isVi ? (
              <>
                Tự Động Hóa Quản Lý Khách Hàng &{' '}
                <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-teal-500 dark:from-blue-400 dark:via-indigo-300 dark:to-teal-400 bg-clip-text text-transparent">
                  Hồ Sơ Khai Thuế Hoa Kỳ
                </span>
              </>
            ) : (
              <>
                Effortlessly Streamline Tax Clients &{' '}
                <span className="bg-gradient-to-r from-blue-700 via-indigo-600 to-teal-500 dark:from-blue-400 dark:via-indigo-300 dark:to-teal-400 bg-clip-text text-transparent">
                  IRS Filing Pipeline
                </span>
              </>
            )}
          </h1>

          {/* Refined Subtitle */}
          <p className="mt-5 sm:mt-6 text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal px-2">
            {isVi
              ? 'Giải phóng 15+ giờ mỗi tuần cho kế toán & chuyên viên thuế. Kiểm soát trọn gói Form 1040 cá nhân, doanh nghiệp 1120/1065, tiến độ IRS thời gian thực, công nợ biểu phí và email nhắc hạn tự động.'
              : 'End-to-end management for Individual 1040s, Corporate 1120/1065 entities, visual IRS progress pipeline, fee ledger tracking, and automated client email campaigns.'}
          </p>

          {/* Primary Action Buttons */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full max-w-md sm:max-w-none mx-auto">
            <Link href="/register" className="w-full sm:w-auto">
              <Button
                className="w-full sm:w-auto h-12 sm:h-13 px-8 sm:px-9 text-sm sm:text-base font-black bg-gradient-to-r from-[#092C5C] via-[#0F3D78] to-[#092C5C] hover:shadow-[0_10px_30px_rgba(9,44,92,0.35)] text-white shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 gap-2.5 rounded-full cursor-pointer shimmer-btn"
              >
                <span>{isVi ? 'Dùng Thử 7 Ngày Miễn Phí' : 'Start 7-Day Free Trial'}</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </Button>
            </Link>

            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDownloadModalOpen(true)}
              className="w-full sm:w-auto h-12 sm:h-13 px-7 sm:px-8 text-sm sm:text-base font-bold border border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-[#151B24]/80 hover:bg-slate-100/90 dark:hover:bg-slate-800 text-slate-900 dark:text-white shadow-sm hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-200 gap-2.5 rounded-full cursor-pointer backdrop-blur-xl"
            >
              <Download className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{isVi ? 'Tải Cho Máy Tính (PC .exe)' : 'Download PC App (.exe)'}</span>
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              {isVi ? 'Không cần thẻ tín dụng' : 'No credit card required'}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              {isVi ? 'Kích hoạt ngay 30 giây' : 'Instant 30-second setup'}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              {isVi ? 'Bảo mật chuẩn Supabase RLS' : 'Bank-grade encrypted security'}
            </span>
          </div>

          {/* Sleek Metrics Ribbon (Frosted Glass with Dividers) */}
          <div className="mt-10 sm:mt-14 max-w-4xl mx-auto rounded-3xl bg-white/70 dark:bg-[#141923]/70 border border-white/80 dark:border-white/10 shadow-[0_8px_32px_0_rgba(9,44,92,0.05)] backdrop-blur-2xl grid grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/60 dark:divide-slate-800/60 p-2 sm:p-3">
            <div className="text-center p-4">
              <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">500+</div>
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mt-0.5">
                {isVi ? 'Văn Phòng Thuế Tin Dùng' : 'Active Tax Offices'}
              </div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">99.4%</div>
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mt-0.5">
                {isVi ? 'Hồ Sơ IRS Chấp Thuận' : 'IRS Acceptance Rate'}
              </div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">15+ Giờ</div>
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mt-0.5">
                {isVi ? 'Tiết Kiệm Mỗi Tuần' : 'Hours Saved Weekly'}
              </div>
            </div>
            <div className="text-center p-4">
              <div className="text-2xl sm:text-3xl font-black text-amber-500">4.9 ★</div>
              <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase mt-0.5">
                {isVi ? 'Đánh Giá Từ CPA & EA' : 'Rated by CPAs & EAs'}
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════
              2. IMMERSIVE INTERACTIVE LIVE SOFTWARE DEMO PREVIEW (HERO PIECE)
          ══════════════════════════════════════════════════════════ */}
          <div id="preview" className="mt-14 sm:mt-18 w-full max-w-7xl mx-auto relative">
            
            {/* Ambient Shadow Light Behind Software Mockup */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent blur-3xl -z-10 rounded-3xl pointer-events-none" />

            {/* Floating Micro-Badges (Desktop Only) */}
            <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-[#1A202A]/90 backdrop-blur-xl border border-emerald-300/80 dark:border-emerald-700/60 shadow-lg text-xs font-black text-emerald-800 dark:text-emerald-300 absolute -top-4 -left-3 z-20 animate-float-slow">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-radar" />
              <span>{isVi ? '🛡️ IRS Direct: 99.8% Chấp Thuận' : '🛡️ IRS Direct: 99.8% Accepted'}</span>
            </div>

            <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-[#1A202A]/90 backdrop-blur-xl border border-blue-300/80 dark:border-blue-700/60 shadow-lg text-xs font-black text-blue-800 dark:text-blue-300 absolute -top-4 -right-3 z-20 animate-float-reverse">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
              <span>{isVi ? '⚡ Tự Động Đối Soát Công Nợ' : '⚡ Automated Fee Tracking'}</span>
            </div>

            {/* Main Software Mockup Container */}
            <div className="rounded-3xl p-2 sm:p-3.5 bg-gradient-to-b from-slate-200/90 via-slate-100/70 to-slate-200/90 dark:from-slate-700/70 dark:via-slate-800/70 dark:to-slate-900/80 shadow-[0_20px_60px_-15px_rgba(9,44,92,0.15)] border border-slate-300/80 dark:border-slate-700/80 transition-all duration-300">
              <div className="rounded-2xl bg-white dark:bg-[#151A22] overflow-hidden border border-slate-200/90 dark:border-slate-800 text-left shadow-inner">
                
                {/* Window Header (macOS inspired) */}
                <div className="h-12 sm:h-13 bg-slate-100/90 dark:bg-[#11151D] border-b border-slate-200 dark:border-slate-800 px-3 sm:px-5 flex items-center justify-between gap-3 overflow-x-auto">
                  <div className="flex items-center gap-2.5 shrink-0">
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-rose-500/80 hover:opacity-100 transition-opacity cursor-pointer" />
                      <div className="w-3 h-3 rounded-full bg-amber-500/80 hover:opacity-100 transition-opacity cursor-pointer" />
                      <div className="w-3 h-3 rounded-full bg-emerald-500/80 hover:opacity-100 transition-opacity cursor-pointer" />
                    </div>
                    <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#1A202A] border border-slate-200 dark:border-slate-700/80 text-[11px] font-mono text-slate-500 dark:text-slate-400">
                      <Lock className="w-3 h-3 text-emerald-500" />
                      <span>https://app.crmemy.com/{activeTab}</span>
                    </div>
                  </div>

                  {/* Interactive Demo Tab Switcher */}
                  <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-200/70 dark:bg-[#202733] text-xs font-bold overflow-x-auto scroll-smooth shrink-0">
                    {[
                      { id: 'dashboard', label: isVi ? '▦ Dashboard' : '▦ Dashboard' },
                      { id: 'clients', label: isVi ? '👤 Form 1040' : '👤 Form 1040' },
                      { id: 'businesses', label: isVi ? '🏢 Doanh Nghiệp' : '🏢 Entities' },
                      { id: 'pipeline', label: isVi ? '▣ IRS Pipeline' : '▣ IRS Pipeline' },
                      { id: 'fees', label: isVi ? '💵 Thu Phí' : '💵 Fee Ledger' },
                      { id: 'marketing', label: isVi ? '✉ Marketing Mail' : '✉ Marketing Mail' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-3 py-1.5 rounded-lg transition-all duration-200 whitespace-nowrap cursor-pointer ${
                          activeTab === tab.id
                            ? 'bg-white dark:bg-[#151A22] text-blue-700 dark:text-blue-400 shadow-xs font-black'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic Tab Body */}
                <div className="p-4 sm:p-6 md:p-8 space-y-6">
                  
                  {/* ── TAB 1: DASHBOARD OVERVIEW ── */}
                  {activeTab === 'dashboard' && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#141820] border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                          <span>{isVi ? 'KHÁCH HÀNG' : 'ACTIVE CLIENTS'}</span>
                          <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold text-xs">👤</span>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">1,248</div>
                        <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-emerald-600 font-bold">
                          <span>↗ +18.4%</span>
                          <span className="text-slate-400 font-normal">Form 1040: 980 | Biz: 268</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#141820] border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                          <span>{isVi ? 'ĐANG SOẠN THẢO' : 'IN PREPARATION'}</span>
                          <span className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold text-xs">⏳</span>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 mt-2">42</div>
                        <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-amber-600 font-bold">
                          <span>12 {isVi ? 'chờ W-2/1099' : 'waiting docs'}</span>
                          <span className="text-slate-400 font-normal">QA Review: 9</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#141820] border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                          <span>{isVi ? 'IRS CHẤP THUẬN' : 'IRS ACCEPTED'}</span>
                          <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold text-xs">✓</span>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2">99.4%</div>
                        <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-emerald-600 font-bold">
                          <span>✓ 1,195 {isVi ? 'hoàn tất' : 'completed'}</span>
                          <span className="text-slate-400 font-normal">0 Rejected</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#141820] border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                          <span>{isVi ? 'TỔNG DOANH THU' : 'TOTAL REVENUE'}</span>
                          <span className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold text-xs">$</span>
                        </div>
                        <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 mt-2">$148,250</div>
                        <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400">
                          <span className="text-emerald-600 font-bold">${isVi ? 'Đã thu: 139k' : 'Collected: 139k'}</span>
                          <span className="text-rose-500 font-bold">${isVi ? 'Nợ: 8.4k' : 'Due: 8.4k'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Pipeline & Deadlines Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                      <div className="lg:col-span-2 p-5 rounded-xl bg-slate-50 dark:bg-[#141820] border border-slate-200 dark:border-slate-800">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                            {isVi ? 'Tiến Độ Quy Trình Khai Thuế (IRS Pipeline)' : 'Tax Return Progress Pipeline'}
                          </h4>
                          <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                            ● {isVi ? 'Trực tiếp' : 'Live Sync'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                            <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 block">Bước 1</span>
                            <b className="text-amber-950 dark:text-amber-200 block text-xs mt-0.5">{isVi ? 'Chờ Giấy Tờ' : 'Waiting Docs'}</b>
                            <span className="mt-1.5 inline-block px-2 py-0.5 rounded-full text-xs font-black bg-amber-200 dark:bg-amber-900 text-amber-900 dark:text-amber-100">12</span>
                          </div>
                          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                            <span className="text-[10px] uppercase font-bold text-blue-700 dark:text-blue-400 block">Bước 2</span>
                            <b className="text-blue-950 dark:text-blue-200 block text-xs mt-0.5">{isVi ? 'Đang Soạn' : 'In Prep'}</b>
                            <span className="mt-1.5 inline-block px-2 py-0.5 rounded-full text-xs font-black bg-blue-200 dark:bg-blue-900 text-blue-900 dark:text-blue-100">18</span>
                          </div>
                          <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
                            <span className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-400 block">Bước 3</span>
                            <b className="text-purple-950 dark:text-purple-200 block text-xs mt-0.5">{isVi ? 'Kiểm Tra QA' : 'QA Review'}</b>
                            <span className="mt-1.5 inline-block px-2 py-0.5 rounded-full text-xs font-black bg-purple-200 dark:bg-purple-900 text-purple-900 dark:text-purple-100">9</span>
                          </div>
                          <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
                            <span className="text-[10px] uppercase font-bold text-indigo-700 dark:text-indigo-400 block">Bước 4</span>
                            <b className="text-indigo-950 dark:text-indigo-200 block text-xs mt-0.5">{isVi ? 'Sẵn Sàng Nộp' : 'Ready to File'}</b>
                            <span className="mt-1.5 inline-block px-2 py-0.5 rounded-full text-xs font-black bg-indigo-200 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-100">14</span>
                          </div>
                          <div className="col-span-2 sm:col-span-1 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                            <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 block">Bước 5</span>
                            <b className="text-emerald-950 dark:text-emerald-200 block text-xs mt-0.5">{isVi ? 'Đã Hoàn Tất' : 'Completed'}</b>
                            <span className="mt-1.5 inline-block px-2 py-0.5 rounded-full text-xs font-black bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100">1,195</span>
                          </div>
                        </div>
                      </div>

                      {/* Urgent Deadlines */}
                      <div className="p-5 rounded-xl bg-slate-50 dark:bg-[#141820] border border-slate-200 dark:border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-rose-500" />
                            <span>{isVi ? 'Hạn Chót IRS Sắp Tới' : 'Urgent Deadlines'}</span>
                          </h4>
                          <span className="text-xs font-bold text-rose-600">3 {isVi ? 'Hồ sơ' : 'Files'}</span>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 flex items-center justify-between">
                            <div>
                              <b className="text-rose-950 dark:text-rose-200 block text-xs">Form 1040 Extension Due</b>
                              <span className="text-slate-500 text-[10px]">David & Lisa Harrison</span>
                            </div>
                            <span className="font-mono font-bold text-rose-600 bg-white dark:bg-rose-950 px-2 py-0.5 rounded text-xs">Oct 15</span>
                          </div>
                          <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 flex items-center justify-between">
                            <div>
                              <b className="text-amber-950 dark:text-amber-200 block text-xs">Form 1065 Partnership</b>
                              <span className="text-slate-500 text-[10px]">XYZ Tech Partners LLC</span>
                            </div>
                            <span className="font-mono font-bold text-amber-600 bg-white dark:bg-amber-950 px-2 py-0.5 rounded text-xs">Sep 15</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── TAB 2: CLIENTS FORM 1040 ── */}
                {activeTab === 'clients' && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                          {isVi ? 'Danh Sách Khách Hàng Cá Nhân (Form 1040)' : 'Individual Taxpayer Directory (Form 1040)'}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {isVi ? 'Quản lý SSN, người phụ thuộc, tình trạng kết hôn và công nợ phí' : 'Track SSN, spouse, dependents, filing status & balance due'}
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-lg text-xs font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        980 {isVi ? 'Hồ sơ 1040' : 'Returns'}
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs min-w-[650px]">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 font-bold uppercase text-[11px]">
                            <th className="pb-3">{isVi ? 'TÊN KHÁCH / SSN' : 'CLIENT / SSN'}</th>
                            <th className="pb-3">{isVi ? 'TÌNH TRẠNG' : 'STATUS'}</th>
                            <th className="pb-3">{isVi ? 'PHỤ THUỘC' : 'DEPENDENTS'}</th>
                            <th className="pb-3">{isVi ? 'NĂM THUẾ' : 'TAX YEAR'}</th>
                            <th className="pb-3">{isVi ? 'TIẾN ĐỘ' : 'STAGE'}</th>
                            <th className="pb-3 text-right">{isVi ? 'PHÍ / CÒN NỢ' : 'FEE / DUE'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-700 dark:text-slate-300">
                          <tr>
                            <td className="py-3">
                              <b className="text-slate-900 dark:text-white block text-xs">Minh Nguyen</b>
                              <small className="text-slate-500 font-mono text-[10px]">SSN: ***-**-1234 • (714) 555-0184</small>
                            </td>
                            <td><span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold text-[10px]">{isVi ? 'Độc Thân' : 'Single'}</span></td>
                            <td>0</td>
                            <td><b>2025</b></td>
                            <td><span className="px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-[10px]">{isVi ? 'Chờ Giấy Tờ' : 'Waiting Docs'}</span></td>
                            <td className="text-right">
                              <b>$650</b>
                              <small className="block text-rose-500 font-bold text-[10px]">{isVi ? 'Nợ: $325' : 'Due: $325'}</small>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3">
                              <b className="text-slate-900 dark:text-white block text-xs">Olivia Johnson</b>
                              <small className="text-slate-500 font-mono text-[10px]">SSN: ***-**-5678 • (415) 555-0128</small>
                            </td>
                            <td><span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-bold text-[10px]">{isVi ? 'Chủ Hộ' : 'HOH'}</span></td>
                            <td>1 con</td>
                            <td><b>2025</b></td>
                            <td><span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-bold text-[10px]">{isVi ? 'Kiểm Tra QA' : 'QA Review'}</span></td>
                            <td className="text-right">
                              <b>$875</b>
                              <small className="block text-emerald-600 font-bold text-[10px]">{isVi ? 'Đã thu đủ' : 'Paid in full'}</small>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3">
                              <b className="text-slate-900 dark:text-white block text-xs">Kevin & Mai Tran</b>
                              <small className="text-slate-500 font-mono text-[10px]">SSN: ***-**-9012 • (832) 555-0199</small>
                            </td>
                            <td><span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 font-bold text-[10px]">{isVi ? 'Hôn Phối MFJ' : 'MFJ'}</span></td>
                            <td>2 con</td>
                            <td><b>2025</b></td>
                            <td><span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold text-[10px]">{isVi ? 'Đã Hoàn Tất' : 'Completed'}</span></td>
                            <td className="text-right">
                              <b>$920</b>
                              <small className="block text-emerald-600 font-bold text-[10px]">{isVi ? 'Đã thu đủ' : 'Paid in full'}</small>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ── TAB 3: BUSINESSES ── */}
                {activeTab === 'businesses' && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                          {isVi ? 'Quản Lý Khách Hàng Doanh Nghiệp (LLC, S-Corp, C-Corp)' : 'Corporate Entities Directory (Form 1120, 1065)'}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {isVi ? 'Theo dõi mã số thuế EIN, cổ đông K-1, kỳ hạn tiểu bang và biểu phí' : 'Track EIN, K-1 shareholders, state annual reports & service fees'}
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                        268 {isVi ? 'Doanh Nghiệp' : 'Entities'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#141820] border border-slate-200 dark:border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <b className="text-slate-900 dark:text-white text-sm">ABC Logistics LLC</b>
                            <p className="text-[11px] text-slate-500 font-mono">EIN: 84-1234567 • Form 1065</p>
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">In Prep</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-[11px] pt-2 border-t border-slate-200 dark:border-slate-800">
                          <div><span className="text-slate-500">Cổ đông:</span> <b className="block">3 K-1s</b></div>
                          <div><span className="text-slate-500">Tiểu bang:</span> <b className="block">California</b></div>
                          <div><span className="text-slate-500">Phí dịch vụ:</span> <b className="block text-emerald-600">$2,400</b></div>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#141820] border border-slate-200 dark:border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <b className="text-slate-900 dark:text-white text-sm">Luxury Nails Studio Inc</b>
                            <p className="text-[11px] text-slate-500 font-mono">EIN: 95-7654321 • Form 1120-S</p>
                          </div>
                          <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">Ready to File</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-[11px] pt-2 border-t border-slate-200 dark:border-slate-800">
                          <div><span className="text-slate-500">Cổ đông:</span> <b className="block">2 Owners</b></div>
                          <div><span className="text-slate-500">Tiểu bang:</span> <b className="block">Texas</b></div>
                          <div><span className="text-slate-500">Phí dịch vụ:</span> <b className="block text-emerald-600">$1,450</b></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── TAB 4: WORKFLOW PIPELINE ── */}
                {activeTab === 'pipeline' && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                      {isVi ? 'Bảng Kéo Thả Tiến Độ Khai Thuế Trực Quan' : 'Visual IRS Engagement Kanban Pipeline'}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-3.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 space-y-2.5">
                        <div className="flex justify-between items-center text-xs font-bold text-amber-900 dark:text-amber-200">
                          <span>Chờ Giấy Tờ (12)</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white dark:bg-[#1E2430] border border-slate-200 dark:border-slate-700 shadow-2xs">
                          <b className="text-xs block text-slate-900 dark:text-white">Minh Nguyen (1040)</b>
                          <span className="text-[10px] text-amber-600 font-medium">Thiếu 1099-NEC & Bank Stmt</span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 space-y-2.5">
                        <div className="flex justify-between items-center text-xs font-bold text-blue-900 dark:text-blue-200">
                          <span>Đang Soạn Thảo (18)</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white dark:bg-[#1E2430] border border-slate-200 dark:border-slate-700 shadow-2xs">
                          <b className="text-xs block text-slate-900 dark:text-white">ABC Logistics LLC (1065)</b>
                          <span className="text-[10px] text-blue-600 font-medium">Amy Tran đang nhập bảng cân đối</span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 space-y-2.5">
                        <div className="flex justify-between items-center text-xs font-bold text-emerald-900 dark:text-emerald-200">
                          <span>IRS Đã Chấp Thuận (1,195)</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white dark:bg-[#1E2430] border border-slate-200 dark:border-slate-700 shadow-2xs">
                          <b className="text-xs block text-slate-900 dark:text-white">Kevin & Mai Tran (1040)</b>
                          <span className="text-[10px] text-emerald-600 font-medium">IRS E-File Accepted ✓</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── TAB 5: FEES & INVOICES ── */}
                {activeTab === 'fees' && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                      {isVi ? 'Quản Lý Biểu Phí & Công Nợ Khách Hàng' : 'Fee Ledger & Receivables Tracking'}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#141820] border border-slate-200 dark:border-slate-800">
                        <span className="text-xs text-slate-500 font-bold block">Tổng Phí Đã Lập Hóa Đơn</span>
                        <b className="text-2xl font-black text-slate-900 dark:text-white mt-1 block">$148,250</b>
                      </div>
                      <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900">
                        <span className="text-xs text-emerald-800 dark:text-emerald-300 font-bold block">Đã Thu Xong (Paid)</span>
                        <b className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">$139,850</b>
                      </div>
                      <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900">
                        <span className="text-xs text-rose-800 dark:text-rose-300 font-bold block">Còn Nợ Cần Thu (Due)</span>
                        <b className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-1 block">$8,400</b>
                      </div>
                    </div>
                  </div>
                )}

                {/* ── TAB 6: MARKETING MAIL ── */}
                {activeTab === 'marketing' && (
                  <div className="space-y-4 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                          {isVi ? 'Gửi Email Nhắc Hạn & Marketing Tự Động Hàng Loạt' : 'Automated Bulk Tax Client Marketing Campaigns'}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {isVi ? 'Soạn 1 lần, gửi tự động tới 1,000+ khách hàng kèm số tiền còn nợ riêng biệt' : 'Send 1-click personalized tax deadline notices to 1,000+ clients'}
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-900">Beta</span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#141820] border border-slate-200 dark:border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold">Mẫu: Nhắc nộp tài liệu Form 1040 trước 15/10</span>
                        <span className="text-emerald-600 font-bold">980 Người Nhận Sẵn Sàng</span>
                      </div>
                      <div className="p-3 rounded-lg bg-white dark:bg-[#1E2430] border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 font-mono">
                        Xin chào {'{{name}}'}, văn phòng xin nhắc anh/chị bổ sung hồ sơ thuế 2025 trước ngày 15/10. Số tiền phí còn lại: ${'{{balance}}'}.
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

        {/* ══════════════════════════════════════════════════════════
            3. BENTO GRID FEATURE SHOWCASE (LUXURY FINTECH FROSTED CARDS)
        ══════════════════════════════════════════════════════════ */}
        <section id="features" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 px-3.5 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-400/10 border border-blue-500/20">
              {isVi ? 'TÍNH NĂNG ĐỘT PHÁ' : 'CORE INNOVATIONS'}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight mt-3">
              {isVi ? 'Thiết Kế Chuyên Biệt Cho Văn Phòng Thuế Mỹ' : 'Built Specifically For US Tax Practices'}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal">
              {isVi
                ? 'Loại bỏ hoàn toàn file Excel rời rạc, thất lạc giấy tờ và nhầm lẫn công nợ vào mùa cao điểm.'
                : 'Eliminate messy spreadsheets, lost documents, and fee confusion during peak tax season.'}
            </p>
          </div>

          {/* Bento Grid with Frosted Glass Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Bento 1: Large Span 2 Cols - IRS Pipeline */}
            <div className="md:col-span-2 p-7 sm:p-9 rounded-3xl bg-white/70 dark:bg-[#141923]/70 backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-[0_8px_32px_0_rgba(9,44,92,0.05)] hover:shadow-2xl hover:border-blue-400/60 hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-blue-100/90 dark:bg-blue-950/90 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold mb-5 shadow-xs group-hover:scale-105 transition-transform duration-300 border border-blue-200/50 dark:border-blue-800/50">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {isVi ? 'Theo Dõi Quy Trình IRS Pipeline 5 Giai Đoạn Thời Gian Thực' : 'Real-Time 5-Stage IRS Progress Pipeline'}
                </h3>
                <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isVi
                    ? 'Nắm rõ từng hồ sơ đang ở bước nào: Chờ tài liệu, đang soạn thảo, kiểm tra QA, đã ký hay đã được IRS chấp thuận. Không bao giờ bỏ lỡ deadline 15/9 hay 15/10.'
                    : 'Always know the exact status of every taxpayer engagement: Waiting docs, In preparation, QA review, Ready to file, or IRS Accepted.'}
                </p>
              </div>
              <div className="mt-6 pt-5 border-t border-slate-200/60 dark:border-slate-800/60 grid grid-cols-3 gap-2.5 text-center text-xs font-bold">
                <div className="p-3 rounded-2xl bg-white/80 dark:bg-[#10141C]/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800 group-hover:border-blue-400/40 transition-colors">Form 1040 Individual</div>
                <div className="p-3 rounded-2xl bg-white/80 dark:bg-[#10141C]/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800 group-hover:border-blue-400/40 transition-colors">Form 1120/1120-S Corporate</div>
                <div className="p-3 rounded-2xl bg-white/80 dark:bg-[#10141C]/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800 group-hover:border-blue-400/40 transition-colors">Form 1065 Partnership</div>
              </div>
            </div>

            {/* Bento 2: Song Ngữ Anh - Việt */}
            <div className="p-7 sm:p-9 rounded-3xl bg-white/70 dark:bg-[#141923]/70 backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-[0_8px_32px_0_rgba(9,44,92,0.05)] hover:shadow-2xl hover:border-emerald-400/60 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-emerald-100/90 dark:bg-emerald-950/90 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold mb-5 shadow-xs group-hover:scale-105 transition-transform duration-300 border border-emerald-200/50 dark:border-emerald-800/50">
                  <Globe className="w-6 h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {isVi ? '100% Song Ngữ Anh - Việt' : 'Bilingual English & Vietnamese'}
                </h3>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isVi
                    ? 'Chuyển đổi 1-click giữa tiếng Anh chuẩn IRS và tiếng Việt thân thiện, phù hợp hoàn hảo cho nhân sự và khách hàng cộng đồng người Việt tại Mỹ.'
                    : 'Seamless 1-click toggle between standard IRS English and Vietnamese for seamless practice operation.'}
                </p>
              </div>
              <div className="mt-6 inline-flex items-center gap-2 text-xs font-black text-emerald-700 dark:text-emerald-400 p-2.5 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/50 backdrop-blur-md border border-emerald-200/40 dark:border-emerald-800/40 w-fit">
                <span>🇺🇸 English</span> ⇄ <span>🇻🇳 Tiếng Việt</span>
              </div>
            </div>

            {/* Bento 3: Email Marketing */}
            <div className="p-7 sm:p-9 rounded-3xl bg-white/70 dark:bg-[#141923]/70 backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-[0_8px_32px_0_rgba(9,44,92,0.05)] hover:shadow-2xl hover:border-purple-400/60 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-purple-100/90 dark:bg-purple-950/90 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold mb-5 shadow-xs group-hover:scale-105 transition-transform duration-300 border border-purple-200/50 dark:border-purple-800/50">
                  <Megaphone className="w-6 h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {isVi ? 'Email Marketing & Nhắc Hạn Tự Động' : 'Automated Email Reminders'}
                </h3>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isVi
                    ? 'Gửi thông báo mùa thuế, nhắc bổ sung W-2/1099 và link nộp hồ sơ tới hàng ngàn khách chỉ với 1 lần bấm.'
                    : 'Send seasonal reminders and document requests to thousands of taxpayers in one click.'}
                </p>
              </div>
              <div className="mt-6 text-xs font-bold text-purple-700 dark:text-purple-400 p-2.5 rounded-2xl bg-purple-50/80 dark:bg-purple-950/50 backdrop-blur-md border border-purple-200/40 dark:border-purple-800/40 w-fit">
                ✓ Gửi hàng loạt kèm số dư nợ riêng biệt
              </div>
            </div>

            {/* Bento 4: Large Span 2 Cols - Dual Platform Cloud & PC App */}
            <div className="md:col-span-2 p-7 sm:p-9 rounded-3xl bg-white/70 dark:bg-[#141923]/70 backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-[0_8px_32px_0_rgba(9,44,92,0.05)] hover:shadow-2xl hover:border-amber-400/60 hover:-translate-y-1.5 transition-all duration-300 relative overflow-hidden flex flex-col justify-between group">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-amber-100/90 dark:bg-amber-950/90 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold mb-5 shadow-xs group-hover:scale-105 transition-transform duration-300 border border-amber-200/50 dark:border-amber-800/50">
                  <Laptop className="w-6 h-6" />
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {isVi ? 'Chạy Đồng Thời Trình Duyệt Web & Ứng Dụng Máy Tính PC' : 'Run On Cloud Web & Standalone PC Desktop App'}
                </h3>
                <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isVi
                    ? 'Linh hoạt làm việc mọi lúc mọi nơi trên trình duyệt, hoặc cài đặt ứng dụng PC độc lập chạy siêu tốc, bảo mật tuyệt đối và tự động đồng bộ thời gian thực.'
                    : 'Access anywhere via secure web browser, or install the lightning-fast PC application with real-time cloud database sync.'}
                </p>
              </div>
              <div className="mt-6 pt-5 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center gap-3 text-xs font-bold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1.5 p-2.5 rounded-2xl bg-white/80 dark:bg-[#10141C]/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800"><Monitor className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Windows 10/11</span>
                <span className="flex items-center gap-1.5 p-2.5 rounded-2xl bg-white/80 dark:bg-[#10141C]/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800"><Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Web SaaS</span>
                <span className="flex items-center gap-1.5 p-2.5 rounded-2xl bg-white/80 dark:bg-[#10141C]/80 backdrop-blur-md border border-slate-200/70 dark:border-slate-800"><Lock className="w-4 h-4 text-purple-600 dark:text-purple-400" /> Supabase RLS Encrypted</span>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            3B. WORKFLOW TRANSFORMATION: OLD WAY VS EMLY CRM
        ══════════════════════════════════════════════════════════ */}
        <section className="py-12 sm:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-white/60 dark:bg-[#131720]/60 backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-[0_8px_32px_0_rgba(9,44,92,0.05)]">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 px-3.5 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-400/10 border border-emerald-500/20">
                {isVi ? 'HIỆU QUẢ VƯỢT TRỘI' : 'WORKFLOW EVOLUTION'}
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-3">
                {isVi ? 'Tại Sao Nên Chuyển Từ Excel Sang EMLY CRM?' : 'Why Transition from Spreadsheets to EMLY CRM?'}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
              
              {/* Old Way Card */}
              <div className="p-6 sm:p-7 rounded-2xl bg-rose-50/40 dark:bg-rose-950/20 border border-rose-200/60 dark:border-rose-900/40 space-y-4">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-black text-sm">
                  <span className="w-6 h-6 rounded-full bg-rose-100 dark:bg-rose-950 flex items-center justify-center text-xs">✕</span>
                  <span>{isVi ? 'Quản Lý Thủ Công / File Excel Rời Rạc' : 'Traditional Spreadsheet Chaos'}</span>
                </div>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                    <span>{isVi ? 'Hồ sơ nằm rải rác trên nhiều file Excel, dễ bị ghi đè dữ liệu hoặc mất file.' : 'Client data scattered across spreadsheets with risk of file corruption.'}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                    <span>{isVi ? 'Không biết chính xác tình trạng E-file IRS của từng khách nếu không mở từng tờ khai.' : 'No instant visibility over IRS e-file acceptance stages.'}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                    <span>{isVi ? 'Dễ bỏ sót hạn chót Form 1040/1065 Extension (15/9, 15/10).' : 'Missed extension deadlines due to manual calendar tracking.'}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-500 font-bold shrink-0 mt-0.5">•</span>
                    <span>{isVi ? 'Soạn email và đối soát công nợ từng người tốn 3-4 tiếng mỗi ngày.' : 'Manual email drafting and fee reconciliation taking hours every day.'}</span>
                  </li>
                </ul>
              </div>

              {/* EMLY CRM Way Card */}
              <div className="p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-blue-50/80 to-emerald-50/50 dark:from-[#132035]/80 dark:to-[#102425]/50 border-2 border-emerald-400/50 dark:border-emerald-500/40 space-y-4 shadow-sm relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-black text-sm">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-xs">✓</span>
                    <span>{isVi ? 'Vận Hành Chuyên Nghiệp Với EMLY CRM' : 'Optimized With EMLY CRM'}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-white shadow-2xs">
                    PRO
                  </span>
                </div>
                <ul className="space-y-3 text-xs sm:text-sm text-slate-800 dark:text-slate-200 font-medium">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>{isVi ? 'Kiểm soát tập trung 100% hồ sơ Form 1040, 1120, 1065 trên đám mây & PC App.' : 'All Individual 1040 & Corporate returns unified on Cloud & PC.'}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>{isVi ? 'IRS Pipeline 5 bước kéo thả trực quan, kiểm soát trạng thái E-File trong 1 giây.' : 'Visual 5-stage drag-and-drop IRS Kanban pipeline for instant tracking.'}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>{isVi ? 'Tự động đếm ngược & cảnh báo hạn chót IRS cấp bách, không bao giờ trễ hạn.' : 'Automated countdown & alerts for urgent IRS filing deadlines.'}</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>{isVi ? 'Gửi email hàng loạt nhắc bổ sung W-2 và số nợ riêng biệt chỉ với 1 click.' : '1-Click personalized bulk email campaigns with dynamic balance due.'}</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Security Trust Badges Bar */}
            <div className="mt-8 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3 rounded-xl bg-white/70 dark:bg-[#10141C]/70 border border-slate-200/60 dark:border-slate-800">
                <ShieldCheck className="w-5 h-5 text-blue-600 dark:text-blue-400 mx-auto mb-1" />
                <b className="text-xs text-slate-900 dark:text-white block">Supabase RLS</b>
                <span className="text-[10px] text-slate-500">{isVi ? 'Phân quyền cấp hàng' : 'Row-Level Security'}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/70 dark:bg-[#10141C]/70 border border-slate-200/60 dark:border-slate-800">
                <Lock className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
                <b className="text-xs text-slate-900 dark:text-white block">256-Bit SSL</b>
                <span className="text-[10px] text-slate-500">{isVi ? 'Mã hóa chuẩn ngân hàng' : 'Bank-Grade Encryption'}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/70 dark:bg-[#10141C]/70 border border-slate-200/60 dark:border-slate-800">
                <HardDrive className="w-5 h-5 text-purple-600 dark:text-purple-400 mx-auto mb-1" />
                <b className="text-xs text-slate-900 dark:text-white block">Cloud Real-time</b>
                <span className="text-[10px] text-slate-500">{isVi ? 'Tự động sao lưu liên tục' : 'Auto Backup & Sync'}</span>
              </div>
              <div className="p-3 rounded-xl bg-white/70 dark:bg-[#10141C]/70 border border-slate-200/60 dark:border-slate-800">
                <FileCheck className="w-5 h-5 text-amber-600 dark:text-amber-400 mx-auto mb-1" />
                <b className="text-xs text-slate-900 dark:text-white block">IRS Ready</b>
                <span className="text-[10px] text-slate-500">{isVi ? 'Mùa thuế 2025/2026' : 'Tax Season 2025/2026'}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            4. VERIFIED CLIENT TESTIMONIALS (FROSTED GLASS ELEGANCE)
        ══════════════════════════════════════════════════════════ */}
        <section id="testimonials" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 px-3.5 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-400/10 border border-blue-500/20">
              {isVi ? 'ĐÁNH GIÁ THỰC TẾ' : 'VERIFIED TESTIMONIALS'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-3">
              {isVi ? 'Được Tin Dùng Bởi Các Văn Phòng Thuế Tại Mỹ' : 'Trusted by Leading US Tax Practices'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Testimonial 1 */}
            <div className="p-7 sm:p-8 rounded-3xl bg-white/70 dark:bg-[#141923]/70 backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-[0_8px_32px_0_rgba(9,44,92,0.05)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "{isVi
                    ? 'Mùa thuế trước văn phòng tôi xử lý hơn 1,200 bộ hồ sơ bằng Excel rất dễ nhầm. Chuyển sang EMLY CRM, nhân viên kiểm soát trạng thái E-file của từng khách trong tích tắc. Rất đáng giá!'
                    : 'Last season we handled 1,200+ returns on Excel which was chaotic. Moving to EMLY CRM gave us instant visibility over every IRS E-file status.'}"
                </p>
              </div>
              <div className="mt-6 pt-5 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-black flex items-center justify-center text-sm shadow-xs">
                  AT
                </div>
                <div>
                  <b className="text-sm font-bold text-slate-900 dark:text-white block">Amy Tran, EA</b>
                  <span className="text-xs text-slate-500">Little Saigon • Westminster, CA</span>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="p-7 sm:p-8 rounded-3xl bg-white/70 dark:bg-[#141923]/70 backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-[0_8px_32px_0_rgba(9,44,92,0.05)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "{isVi
                    ? 'Tính năng Email Marketing nhắc khách gửi W-2 và nộp lệ phí cứu cánh thực sự. Khách tự động nhận email có số dư nợ chính xác của họ nên tỷ lệ thanh toán đạt gần 98%.'
                    : 'The automated bulk email reminder with dynamic balance due amounts is a lifesaver. Our collection rate increased to 98%.'}"
                </p>
              </div>
              <div className="mt-6 pt-5 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-black flex items-center justify-center text-sm shadow-xs">
                  DL
                </div>
                <div>
                  <b className="text-sm font-bold text-slate-900 dark:text-white block">Daniel Lee, CPA</b>
                  <span className="text-xs text-slate-500">Bellaire Blvd • Houston, TX</span>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="p-7 sm:p-8 rounded-3xl bg-white/70 dark:bg-[#141923]/70 backdrop-blur-2xl border border-white/80 dark:border-white/10 shadow-[0_8px_32px_0_rgba(9,44,92,0.05)] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "{isVi
                    ? 'Giao diện song ngữ Anh - Việt rất thông minh. Tôi thích việc có thể vừa mở trên trình duyệt khi ở nhà, vừa mở bản PC app siêu mượt tại văn phòng.'
                    : 'The bilingual interface is incredibly thoughtful. I love being able to access via web at home and use the fast PC app at the office.'}"
                </p>
              </div>
              <div className="mt-6 pt-5 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-black flex items-center justify-center text-sm shadow-xs">
                  SK
                </div>
                <div>
                  <b className="text-sm font-bold text-slate-900 dark:text-white block">Sarah Kim, Tax Preparer</b>
                  <span className="text-xs text-slate-500">International District • Seattle, WA</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            5. FREQUENTLY ASKED QUESTIONS (FROSTED GLASS ACCORDION)
        ══════════════════════════════════════════════════════════ */}
        <section id="faq" className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-blue-600 dark:text-blue-400 px-3.5 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-400/10 border border-blue-500/20">
              {isVi ? 'GIẢI ĐÁP THẮC MẮC' : 'FREQUENTLY ASKED QUESTIONS'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mt-3">
              {isVi ? 'Câu Hỏi Thường Gặp Về EMLY CRM' : 'Common Questions & Answers'}
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: isVi ? 'Dữ liệu khách hàng và số SSN có được bảo mật không?' : 'How is client SSN and tax data secured?',
                a: isVi
                  ? 'Tuyệt đối an toàn. Hệ thống sử dụng cơ sở dữ liệu Supabase Enterprise với cơ chế Row-Level Security (RLS) mã hóa nhiều tầng. Chỉ có tài khoản của bạn mới có quyền truy cập dữ liệu của văn phòng bạn.'
                  : 'Bank-grade security with multi-layer encryption and Supabase Enterprise Row-Level Security (RLS). Only authorized practice staff can access your client records.',
              },
              {
                q: isVi ? 'Tôi có thể xuất danh sách khách hàng ra file Excel được không?' : 'Can I export my clients and business lists to Excel/CSV?',
                a: isVi
                  ? 'Có! Cả mục Khách hàng cá nhân Form 1040 và Doanh nghiệp đều có sẵn nút bấm Xuất Excel / CSV 1-click để bạn lưu trữ hoặc in ấn bất cứ lúc nào.'
                  : 'Yes! Full 1-click Excel and CSV export capabilities are available across both Individual 1040 and Corporate Entities directories.',
              },
              {
                q: isVi ? 'Tôi có thể dùng trên nhiều máy tính và phân quyền cho nhân viên không?' : 'Can multiple staff members use the software simultaneously?',
                a: isVi
                  ? 'Hoàn toàn được. Bạn có thể thêm nhân viên, phân công hồ sơ cho từng người phụ trách (Tax Preparer, Reviewer, Staff) và kiểm soát quyền hạn trong mục Quản lý Nhóm.'
                  : 'Yes. You can add team members, assign returns to specific preparers or reviewers, and manage permissions seamlessly.',
              },
              {
                q: isVi ? 'Bản cài đặt cho máy tính (.exe) khác gì bản web?' : 'What is the difference between Web SaaS and the PC App (.exe)?',
                a: isVi
                  ? 'Cả hai bản đều đồng bộ dữ liệu với nhau thời gian thực. Bản PC App cho máy tính mở độc lập nhanh hơn, không phụ thuộc vào tab trình duyệt.'
                  : 'Both versions sync in real-time. The standalone PC application opens instantly as a dedicated desktop tool without browser clutter.',
              },
            ].map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white/70 dark:bg-[#141923]/70 backdrop-blur-2xl border border-white/80 dark:border-white/10 overflow-hidden shadow-[0_4px_20px_0_rgba(9,44,92,0.03)] transition-all hover:border-blue-400/50"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-slate-900 dark:text-white cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${activeFaq === idx ? 'rotate-180 text-blue-600 dark:text-blue-400' : ''}`} />
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-200/50 dark:border-slate-800/50 pt-4 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════════════════════════
            6. FINAL CONVERSION CTA BANNER (LUXURY FROSTED FINTECH)
        ══════════════════════════════════════════════════════════ */}
        <section className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="p-8 sm:p-14 rounded-3xl bg-gradient-to-r from-[#092C5C]/95 via-[#104380]/95 to-[#092C5C]/95 backdrop-blur-3xl text-white shadow-2xl relative overflow-hidden border border-blue-400/30">
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight max-w-3xl mx-auto relative z-10">
              {isVi ? 'Sẵn Sàng Cho Một Mùa Thuế Thảnh Thơi & Đạt Hiệu Suất Cao?' : 'Ready For A Stress-Free & High-Efficiency Tax Season?'}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-blue-200 max-w-2xl mx-auto relative z-10">
              {isVi ? 'Đăng ký trải nghiệm 7 ngày miễn phí ngay hôm nay. Thiết lập chỉ 30 giây.' : 'Join 500+ top US tax practices. Setup takes less than 30 seconds.'}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Link href="/register">
                <Button className="h-12 sm:h-13 px-9 text-sm sm:text-base font-extrabold bg-emerald-500 hover:bg-emerald-600 hover:scale-105 active:scale-95 text-white shadow-xl rounded-full cursor-pointer shimmer-btn transition-all duration-200">
                  {isVi ? 'Bắt Đầu Dùng Thử Miễn Phí' : 'Start Free 7-Day Trial'}
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" className="h-12 sm:h-13 px-8 text-sm sm:text-base font-extrabold border border-white/40 bg-white/10 hover:bg-white/20 hover:scale-105 active:scale-95 text-white rounded-full cursor-pointer backdrop-blur-md transition-all duration-200">
                  {isVi ? 'Khám Phá Workspace' : 'Open Workspace'}
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ─── FOOTER (FROSTED GLASS) ─── */}
      <footer className="bg-white/60 dark:bg-[#0A0D12]/60 backdrop-blur-2xl border-t border-white/60 dark:border-white/10 py-10 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-white">EMLY CUSTOMER LIST</span>
            <span>• © 2026 All Rights Reserved.</span>
          </div>
          <div className="flex items-center gap-6 font-semibold">
            <Link href="/dashboard" className="hover:text-blue-600 transition-colors">Dashboard</Link>
            <Link href="/login" className="hover:text-blue-600 transition-colors">{isVi ? 'Đăng Nhập' : 'Sign In'}</Link>
            <Link href="/register" className="hover:text-blue-600 transition-colors">{isVi ? 'Đăng Ký' : 'Register'}</Link>
            <a href="https://wa.me/84931233639" target="_blank" rel="noopener noreferrer" className="text-emerald-600 font-bold hover:underline">
              WhatsApp Support
            </a>
          </div>
        </div>
      </footer>

      {/* ─── PC DOWNLOAD MODAL (FROSTED GLASS) ─── */}
      {isDownloadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white/90 dark:bg-[#161C26]/90 backdrop-blur-3xl rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-white/80 dark:border-white/10 shadow-2xl relative space-y-5">
            <button
              type="button"
              onClick={() => setIsDownloadModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center border border-blue-200/50">
                <Laptop className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {isVi ? 'Tải Ứng Dụng Máy Tính PC' : 'Download EMLY PC Application'}
                </h3>
                <p className="text-xs text-slate-500">Windows 10 / 11 64-bit • Standalone App</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {isVi
                ? 'Ứng dụng PC giúp bạn mở phần mềm ngay lập tức trên máy tính bàn hoặc laptop tại văn phòng mà không cần mở trình duyệt web. Dữ liệu được đồng bộ liên tục với tài khoản đám mây.'
                : 'Install the standalone high-speed desktop application for Windows. Automatically syncs with your cloud database.'}
            </p>

            <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-[#10141C]/80 backdrop-blur-md border border-slate-200/60 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Phiên bản:</span>
                <b className="text-slate-900 dark:text-white">v1.1.6 Stable</b>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Dung lượng:</span>
                <b className="text-slate-900 dark:text-white">~12.4 MB</b>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link href="/register" className="flex-1" onClick={() => setIsDownloadModalOpen(false)}>
                <Button className="w-full h-12 rounded-full font-black bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shimmer-btn transition-all">
                  {isVi ? 'Đăng Ký & Nhận Link Tải' : 'Register & Get Download'}
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => setIsDownloadModalOpen(false)}
                className="h-12 rounded-full font-bold border-slate-300 dark:border-slate-700 cursor-pointer"
              >
                {isVi ? 'Đóng' : 'Close'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
