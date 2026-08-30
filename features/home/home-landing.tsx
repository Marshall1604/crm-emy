'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  BarChart3,
  Bot,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Crown,
  DollarSign,
  FileCheck,
  FileSpreadsheet,
  Globe,
  HelpCircle,
  Layers,
  Lock,
  Mail,
  Megaphone,
  Moon,
  Percent,
  Play,
  Plus,
  Receipt,
  RotateCcw,
  Search,
  Send,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  TrendingUp,
  UserCheck,
  Users,
  UsersRound,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n/language-context';
import { useTheme } from '@/lib/theme/theme-context';
import { LanguageSwitcher } from '@/components/language-switcher';
import { ThemeSwitcher } from '@/components/theme-switcher';

export function HomeLanding() {
  const { language } = useLanguage();
  const { theme } = useTheme();
  const isVi = language === 'vi';

  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [pricingCycle, setPricingCycle] = useState<'monthly' | 'yearly'>('yearly');

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#1D2128] text-slate-900 dark:text-slate-100 transition-colors duration-200 selection:bg-blue-600 selection:text-white">
      {/* ─── NAVIGATION BAR ─── */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/85 dark:bg-[#161A20]/85 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo Brand */}
          <Link href="/home" className="flex items-center gap-3 group text-decoration-none">
            <div className="w-10 h-10 rounded-xl bg-[#092c5c] text-white flex items-center justify-center font-black text-xl shadow-md group-hover:scale-105 transition-transform">
              <span className="relative">
                E<i className="absolute -right-1 -bottom-1 text-[11px] not-italic text-emerald-400 font-bold">✓</i>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg leading-tight tracking-tight text-[#092c5c] dark:text-white">
                EMLY <span className="text-emerald-600 dark:text-emerald-400">CUSTOMER LIST</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
                {isVi ? 'Phần Mềm Quản Lý Khách Hàng Thuế' : 'Tax Practice Management SaaS'}
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {isVi ? 'Tính Năng' : 'Features'}
            </a>
            <a href="#pipeline" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {isVi ? 'Quy Trình Pipeline' : 'Tax Pipeline'}
            </a>
            <a href="#marketing" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {isVi ? 'Email Marketing' : 'Email Marketing'}
            </a>
            <a href="#pricing" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {isVi ? 'Bảng Giá' : 'Pricing'}
            </a>
            <a href="#faq" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {isVi ? 'Hỏi & Đáp' : 'FAQ'}
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            <LanguageSwitcher />

            <Link href="/login">
              <Button
                variant="ghost"
                className="hidden sm:inline-flex text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600"
              >
                {isVi ? 'Đăng Nhập' : 'Sign In'}
              </Button>
            </Link>

            <Link href="/register">
              <Button className="h-10 px-5 text-sm font-bold bg-[#092c5c] hover:bg-[#072247] text-white shadow-md hover:shadow-lg transition-all gap-1.5 cursor-pointer">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{isVi ? 'Dùng Thử Miễn Phí' : 'Start Free Trial'}</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* ─── HERO SECTION ─── */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-200 dark:border-slate-800">
        {/* Subtle Background Glow Elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-blue-500/10 dark:bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-emerald-500/10 dark:bg-emerald-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-xs mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>
              {isVi
                ? 'Giải Pháp CRM Đẳng Cấp Cho Văn Phòng Thuế & Kế Toán Tại Mỹ'
                : 'Next-Gen Tax Practice Management CRM For US Tax Offices'}
            </span>
          </div>

          {/* Main H1 Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
            {isVi ? (
              <>
                Tự Động Hóa Quản Lý Khách Hàng & <span className="text-blue-600 dark:text-blue-400">Hồ Sơ Thuế Chuyên Nghiệp</span>
              </>
            ) : (
              <>
                Streamline Tax Clients & <span className="text-blue-600 dark:text-blue-400">IRS Filing Workflows</span> In One Place
              </>
            )}
          </h1>

          {/* Subtitle Description */}
          <p className="mt-6 text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            {isVi
              ? 'Giải phóng 80% thời gian thủ công mùa thuế. Quản lý toàn diện người nộp thuế cá nhân Form 1040, doanh nghiệp 1120/1065, quy trình kiểm soát hồ sơ IRS, đối soát phí dịch vụ và gửi email marketing tự động hàng loạt.'
              : 'Save 80% of administrative overhead during tax season. End-to-end management for Individual 1040, Business 1120/1065, visual IRS progress pipeline, fee ledger tracking, and automated bulk email campaigns.'}
          </p>

          {/* Hero CTAs */}
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto">
              <Button
                className="w-full sm:w-auto h-14 px-8 text-base font-extrabold bg-[#092c5c] hover:bg-[#072247] text-white shadow-xl hover:shadow-2xl hover:-translate-y-0.5 transition-all gap-2 cursor-pointer"
              >
                <span>{isVi ? 'Bắt Đầu Dùng Thử 7 Ngày Miễn Phí' : 'Start 7-Day Free Trial'}</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>

            <a href="#pricing" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto h-14 px-8 text-base font-bold border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-100 shadow-sm cursor-pointer"
              >
                {isVi ? 'Xem Các Gói Bản Quyền' : 'View Pricing Plans'}
              </Button>
            </a>
          </div>

          {/* Guarantee Badges */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              {isVi ? 'Không cần thẻ tín dụng' : 'No credit card required'}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              {isVi ? 'Kích hoạt tài khoản tức thì 30s' : 'Instant 30-sec activation'}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              {isVi ? 'Bảo mật Supabase Row-Level Security' : 'Bank-grade database security'}
            </span>
          </div>

          {/* ── INTERACTIVE WORKSPACE PREVIEW MOCKUP ── */}
          <div className="mt-14 max-w-5xl mx-auto rounded-2xl p-2 sm:p-3 bg-gradient-to-b from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-900 shadow-2xl border border-slate-300 dark:border-slate-700">
            <div className="rounded-xl bg-white dark:bg-[#242A34] overflow-hidden border border-slate-200 dark:border-slate-700 text-left">
              {/* Window Header */}
              <div className="h-10 bg-slate-100 dark:bg-[#181C23] border-b border-slate-200 dark:border-slate-800 px-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500" />
                  <div className="w-3 h-3 rounded-full bg-amber-500" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="ml-2 text-xs font-mono text-slate-400">app.crmemy.com/dashboard</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  {isVi ? 'Đồng bộ trực tiếp (Live Sync)' : 'Live Database Sync'}
                </div>
              </div>

              {/* Mockup Dashboard Body */}
              <div className="p-6 space-y-6">
                {/* 4 Mini KPIs */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#1D2128] border border-slate-200 dark:border-slate-700">
                    <span className="text-[11px] font-bold text-slate-500">{isVi ? 'TỔNG KHÁCH HÀNG' : 'ACTIVE CLIENTS'}</span>
                    <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">1,248</div>
                    <span className="text-[10px] text-emerald-600 font-bold">↗ +18.4% YoY</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#1D2128] border border-slate-200 dark:border-slate-700">
                    <span className="text-[11px] font-bold text-slate-500">{isVi ? 'ĐANG SOẠN HỒ SƠ' : 'IN PREPARATION'}</span>
                    <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">42</div>
                    <span className="text-[10px] text-slate-500">12 {isVi ? 'chờ tài liệu W-2' : 'waiting W-2'}</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#1D2128] border border-slate-200 dark:border-slate-700">
                    <span className="text-[11px] font-bold text-slate-500">{isVi ? 'IRS CHẤP THUẬN' : 'IRS ACCEPTED'}</span>
                    <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">98.8%</div>
                    <span className="text-[10px] text-emerald-600 font-bold">✓ E-Filed 100%</span>
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#1D2128] border border-slate-200 dark:border-slate-700">
                    <span className="text-[11px] font-bold text-slate-500">{isVi ? 'TỔNG DOANH THU PHÍ' : 'TOTAL BILLED FEES'}</span>
                    <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">$148,250</div>
                    <span className="text-[10px] text-rose-500 font-bold">{isVi ? 'Còn nợ: $8,420' : 'Balance: $8,420'}</span>
                  </div>
                </div>

                {/* Pipeline Flow Demonstration */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1D2128] border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                      {isVi ? 'Quy Trình Xử Lý Hồ Sơ Thuế (IRS Pipeline)' : 'Tax Workflow Pipeline'}
                    </span>
                    <span className="text-[11px] text-blue-600 font-bold">5 {isVi ? 'Giai đoạn tự động' : 'Stages'}</span>
                  </div>
                  <div className="grid grid-cols-5 gap-2 text-center text-xs">
                    <div className="p-2 rounded bg-amber-100/70 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300 font-bold">
                      1. {isVi ? 'Chờ Giấy Tờ' : 'Waiting Docs'} (12)
                    </div>
                    <div className="p-2 rounded bg-blue-100/70 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-300 font-bold">
                      2. {isVi ? 'Đang Soạn' : 'In Prep'} (18)
                    </div>
                    <div className="p-2 rounded bg-purple-100/70 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-800 text-purple-900 dark:text-purple-300 font-bold">
                      3. {isVi ? 'Kiểm Tra QA' : 'Review'} (9)
                    </div>
                    <div className="p-2 rounded bg-indigo-100/70 dark:bg-indigo-950/60 border border-indigo-300 dark:border-indigo-800 text-indigo-900 dark:text-indigo-300 font-bold">
                      4. {isVi ? 'Sẵn Sàng Nộp' : 'Ready'} (14)
                    </div>
                    <div className="p-2 rounded bg-emerald-100/70 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 font-bold">
                      5. {isVi ? 'Đã Hoàn Tất' : 'Completed'} (1,195)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF & STATS BAR ─── */}
      <section className="py-12 bg-white dark:bg-[#161A20] border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
            <div className="pt-4 md:pt-0">
              <div className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white">100,000+</div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">
                {isVi ? 'Hồ Sơ Thuế Đã Xử Lý' : 'Tax Returns Processed'}
              </p>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-3xl md:text-4xl font-black text-emerald-600 dark:text-emerald-400">99.9%</div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">
                {isVi ? 'Đúng Hạn Nộp Hồ Sơ IRS' : 'On-Time IRS Filings'}
              </p>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-3xl md:text-4xl font-black text-amber-500">4.9 / 5.0</div>
              <div className="flex items-center justify-center gap-1 mt-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-0.5">
                {isVi ? 'Đánh Giá Từ 500+ Văn Phòng' : 'Rated by 500+ CPAs & EAs'}
              </p>
            </div>
            <div className="pt-4 md:pt-0">
              <div className="text-3xl md:text-4xl font-black text-blue-600 dark:text-blue-400">10x</div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">
                {isVi ? 'Tăng Tốc Độ Xử Lý Khách Hàng' : 'Faster Client Turnaround'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FULL FEATURES SHOWCASE SECTION ─── */}
      <section id="features" className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            {isVi ? 'TÍNH NĂNG TOÀN DIỆN' : 'COMPREHENSIVE CAPABILITIES'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-2 tracking-tight">
            {isVi
              ? 'Tất Cả Công Cụ Cần Thiết Cho Một Văn Phòng Khai Thuế Hiện Đại'
              : 'Everything Your Tax Practice Needs To Scale Effortlessly'}
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 mt-4">
            {isVi
              ? 'Được thiết kế chuyên sâu theo quy chuẩn khai thuế Hoa Kỳ, tối ưu hóa từ khâu tiếp nhận thông tin, phân công nhân viên, xử lý tờ khai đến lập hóa đơn và chăm sóc khách hàng.'
              : 'Built specifically around IRS tax preparation standards, from client intake and partner ownership breakdown to filing verification and automated client follow-ups.'}
          </p>
        </div>

        {/* 8 Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1: Individual 1040 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#242A34] border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5">
              <UsersRound className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {isVi ? '1. Khách Hàng Cá Nhân (Form 1040)' : '1. Individual Clients (1040)'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              {isVi
                ? 'Quản lý thông tin người nộp thuế, vợ/chồng, danh sách người phụ thuộc, SSN, ngày sinh, tình trạng hôn nhân (Single, MFJ, HOH) và lịch sử tờ khai qua các năm.'
                : 'Manage taxpayer, spouse, and dependents, SSNs, DOBs, filing statuses (Single, MFJ, MFS, HOH), and complete tax year histories.'}
            </p>
          </div>

          {/* Feature 2: Business Entities */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#242A34] border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {isVi ? '2. Khách Hàng Doanh Nghiệp' : '2. Business Entities & LLCs'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              {isVi
                ? 'Chuyên biệt cho Hợp danh 1065, S-Corp 1120-S, C-Corp 1120, Sole Proprietor Schedule C. Theo dõi EIN, DBA, cơ cấu thành viên góp vốn & tỷ lệ sở hữu %.'
                : 'Tailored for Partnerships (1065), S-Corps (1120-S), C-Corps (1120), and Schedule C. Track EIN, DBA, and unlimited partner ownership breakdown.'}
            </p>
          </div>

          {/* Feature 3: Visual Pipeline */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#242A34] border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-5">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {isVi ? '3. Quy Trình Hồ Sơ (IRS Pipeline)' : '3. Visual Tax Pipeline'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              {isVi
                ? 'Kiểm soát chặt chẽ 5 giai đoạn: Chờ giấy tờ W-2/1099 ➔ Đang soạn hồ sơ ➔ Kiểm tra QA ➔ Sẵn sàng nộp ➔ IRS chấp thuận hoàn tất.'
                : 'Track progress in 5 real-time stages: Waiting Documents, In Preparation, QA Review, Ready to File, and IRS Accepted.'}
            </p>
          </div>

          {/* Feature 4: Fees & Payments */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#242A34] border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5">
              <DollarSign className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {isVi ? '4. Sổ Thu Phí & Quản Lý Công Nợ' : '4. Fee Ledger & Invoicing'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              {isVi
                ? 'Tự động tính công nợ còn lại (Balance = Phí - Đã trả). Theo dõi trạng thái hóa đơn (Sent, Overdue, Paid), xuất báo cáo thu tiền chính xác.'
                : 'Automated balance due calculation, invoice status tracking (Sent, Overdue, Paid), and one-click financial export.'}
            </p>
          </div>

          {/* Feature 5: Bulk Email Engine */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#242A34] border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5">
              <Megaphone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {isVi ? '5. Email Marketing Hàng Loạt' : '5. Automated Marketing Mail'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              {isVi
                ? 'Gửi email hàng loạt theo phân khúc khách hàng (còn nợ phí, thiếu tài liệu W-2...). Tích hợp Resend API / SMTP, merge tag cá nhân hóa.'
                : 'Send targeted email broadcasts by audience segments (missing docs, balance due). Integrated with Resend API / SMTP and dynamic tags.'}
            </p>
          </div>

          {/* Feature 6: Team & RBAC Security */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#242A34] border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-5">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {isVi ? '6. Phân Quyền & Quản Lý Nhân Sự' : '6. Team Workload & RBAC'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              {isVi
                ? 'Phân bổ hồ sơ cho từng nhân viên (Preparer / Reviewer). Bảo mật cơ sở dữ liệu với Supabase Row Level Security, ngăn chặn rò rỉ dữ liệu.'
                : 'Assign return caseloads to staff. Granular role-based access control protected by Supabase Row-Level Security.'}
            </p>
          </div>

          {/* Feature 7: Bilingual Support */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#242A34] border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-5">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {isVi ? '7. Song Ngữ Tiếng Việt & Anh' : '7. 100% Bilingual VN & EN'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              {isVi
                ? 'Chuyển đổi 1 chạm giữa Tiếng Việt và Tiếng Anh trên toàn bộ các màn hình, bảng biểu, modal với các thuật ngữ thuế Mỹ chuẩn xác, dễ hiểu.'
                : 'Seamless 1-click toggle between Vietnamese and English across 100% of screens, modals, and tables with accurate tax terminology.'}
            </p>
          </div>

          {/* Feature 8: Dark Mode #1D2128 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#242A34] border border-slate-200 dark:border-slate-700 shadow-xs hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center mb-5">
              <Moon className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {isVi ? '8. Giao Diện Tối (#1D2128)' : '8. Ergonomic Dark Mode'}
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
              {isVi
                ? 'Tone màu tối xám than #1D2128 sang trọng, chống mỏi mắt khi làm việc ban đêm, các khối layout rõ ràng với độ tương phản chữ cao.'
                : 'Crafted with #1D2128 charcoal dark palette, perfect for late-night tax season work with crisp high-contrast readability.'}
            </p>
          </div>
        </div>
      </section>

      {/* ─── PRICING SECTION (LIỆT KÊ ĐẦY ĐỦ 4 GÓI TIỀN) ─── */}
      <section id="pricing" className="py-20 md:py-28 bg-slate-50/70 dark:bg-[#161A20] border-t border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              {isVi ? 'BẢNG GIÁ MINH BẠCH' : 'TRANSPARENT PRICING'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-2 tracking-tight">
              {isVi ? 'Chọn Gói Bản Quyền Phù Hợp Cho Văn Phòng Thuế Của Bạn' : 'Flexible Plans For Solo Tax Preparers & Large Practices'}
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400 mt-3">
              {isVi
                ? 'Bắt đầu với 7 ngày dùng thử miễn phí đầy đủ tính năng. Nâng cấp hoặc chuyển đổi gói bất kỳ lúc nào.'
                : 'Start with full-featured 7-day trial. Upgrade or change your license anytime with no lock-in contracts.'}
            </p>
          </div>

          {/* 4 Pricing Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {/* 1. 7-Day Free Trial */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#242A34] border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {isVi ? 'DÙNG THỬ' : 'TRIAL'}
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">7-Day Free Trial</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900 dark:text-white">$0</span>
                  <span className="text-xs font-semibold text-slate-500">/ 7 {isVi ? 'ngày' : 'days'}</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  {isVi ? 'Trải nghiệm toàn bộ tính năng CRM cao cấp mà không tốn phí.' : 'Test drive every feature with zero financial commitment.'}
                </p>

                <ul className="mt-6 space-y-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{isVi ? 'Đầy đủ 100% tính năng cao cấp' : 'All premium CRM features'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{isVi ? 'Quản lý khách cá nhân & công ty' : 'Individual & Business clients'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{isVi ? 'Không cần nhập thẻ tín dụng' : 'No credit card required'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{isVi ? 'Kích hoạt ngay trong 30 giây' : 'Instant account activation'}</span>
                  </li>
                </ul>
              </div>

              <Link href="/register" className="mt-8">
                <Button variant="outline" className="w-full h-11 text-xs font-bold border-slate-300 dark:border-slate-600 cursor-pointer">
                  {isVi ? 'Bắt Đầu Dùng Thử Ngay' : 'Get Started Free'}
                </Button>
              </Link>
            </div>

            {/* 2. Monthly Pro ($19/mo) */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#242A34] border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {isVi ? 'LINH HOẠT' : 'MONTHLY'}
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">Monthly Pro</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-slate-900 dark:text-white">$19</span>
                  <span className="text-xs font-semibold text-slate-500">/ {isVi ? 'tháng' : 'month'}</span>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  {isVi ? 'Thanh toán linh hoạt từng tháng, hủy bất kỳ lúc nào.' : 'Pay as you go month-to-month, cancel anytime.'}
                </p>

                <ul className="mt-6 space-y-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{isVi ? 'Không giới hạn hồ sơ khách hàng' : 'Unlimited client records'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{isVi ? 'Quy trình xử lý hồ sơ IRS Pipeline' : 'IRS return pipeline'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{isVi ? 'Email Marketing & Resend API' : 'Marketing bulk email sending'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{isVi ? 'Hỗ trợ kỹ thuật qua Email' : 'Standard email support'}</span>
                  </li>
                </ul>
              </div>

              <Link href="/register" className="mt-8">
                <Button className="w-full h-11 text-xs font-bold bg-[#092c5c] hover:bg-[#072247] text-white cursor-pointer">
                  {isVi ? 'Đăng Ký Gói Tháng' : 'Subscribe Monthly'}
                </Button>
              </Link>
            </div>

            {/* 3. Annual Enterprise ($199/yr) - BEST VALUE */}
            <div className="relative p-6 rounded-2xl bg-white dark:bg-[#242A34] border-2 border-blue-600 dark:border-blue-500 shadow-xl flex flex-col justify-between">
              {/* Most Popular Badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white shadow-md">
                ⭐ {isVi ? 'PHỔ BIẾN NHẤT — TIẾT KIỆM' : 'MOST POPULAR — SAVE 15%'}
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
                  {isVi ? 'TIẾT KIỆM NHẤT' : 'ANNUAL'}
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">Annual Enterprise</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-blue-600 dark:text-blue-400">$199</span>
                  <span className="text-xs font-semibold text-slate-500">/ {isVi ? 'năm' : 'year'}</span>
                </div>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-2">
                  {isVi ? 'Tiết kiệm $29/năm so với thanh toán hàng tháng.' : 'Save $29/year compared to monthly billing.'}
                </p>

                <ul className="mt-6 space-y-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{isVi ? 'Toàn bộ tính năng gói Pro' : 'Everything in Pro'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{isVi ? 'Phân quyền đa nhân viên (RBAC)' : 'Multi-staff team management'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{isVi ? 'Ưu tiên hỗ trợ kỹ thuật 24/7' : 'Priority 24/7 support'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{isVi ? 'Sao lưu dữ liệu tự động hàng ngày' : 'Daily automated backups'}</span>
                  </li>
                </ul>
              </div>

              <Link href="/register" className="mt-8">
                <Button className="w-full h-11 text-xs font-extrabold bg-blue-600 hover:bg-blue-700 text-white shadow-md cursor-pointer">
                  {isVi ? 'Đăng Ký Gói Năm (Tiết Kiệm)' : 'Choose Annual Plan'}
                </Button>
              </Link>
            </div>

            {/* 4. Lifetime License ($390 One-Time) */}
            <div className="relative p-6 rounded-2xl bg-gradient-to-b from-amber-500/10 to-transparent dark:from-amber-500/5 bg-white dark:bg-[#242A34] border-2 border-amber-400/80 dark:border-amber-500/60 shadow-lg flex flex-col justify-between">
              {/* Lifetime Exclusive Badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500 text-slate-950 shadow-md">
                👑 {isVi ? 'SỞ HỮU TRỌN ĐỜI' : 'LIFETIME ACCESS'}
              </div>

              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <Crown className="w-3.5 h-3.5" />
                  <span>{isVi ? '1 LẦN DUY NHẤT' : 'ONE-TIME'}</span>
                </div>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-1">Lifetime License</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-black text-amber-500">$390</span>
                  <span className="text-xs font-semibold text-slate-500">{isVi ? 'thanh toán 1 lần' : 'one-time'}</span>
                </div>
                <p className="text-xs text-amber-700 dark:text-amber-300 font-semibold mt-2">
                  {isVi ? 'Sở hữu vĩnh viễn, không bao giờ phải trả phí hàng tháng/năm.' : 'Pay once, own forever. Zero recurring monthly or yearly fees.'}
                </p>

                <ul className="mt-6 space-y-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{isVi ? 'Quyền truy cập vĩnh viễn không giới hạn' : 'Lifetime unlimited access'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{isVi ? 'Miễn phí mọi bản nâng cấp tương lai' : 'All future feature updates free'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{isVi ? 'Quyền Super Admin cao cấp nhất' : 'VIP Super Admin privileges'}</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{isVi ? 'Hỗ trợ VIP 1-1 riêng biệt' : 'Direct VIP 1-on-1 support'}</span>
                  </li>
                </ul>
              </div>

              <Link href="/register" className="mt-8">
                <Button className="w-full h-11 text-xs font-extrabold bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-md cursor-pointer">
                  {isVi ? 'Mua Bản Quyền Trọn Đời' : 'Claim Lifetime License'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS SECTION ─── */}
      <section className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            {isVi ? 'ĐÁNH GIÁ THỰC TẾ' : 'CLIENT REVIEWS'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-2 tracking-tight">
            {isVi ? 'Được Tin Dùng Bởi Các Văn Phòng Thuế Hàng Đầu' : 'Trusted by Leading Tax Professionals Across The US'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Review 1 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#242A34] border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                {isVi
                  ? '"Trước đây văn phòng tôi dùng Excel để theo dõi hơn 800 hồ sơ thuế cá nhân và doanh nghiệp, rất hay bị sót giấy tờ W-2 của khách. Từ khi dùng EMLY CUSTOMER LIST, tính năng Pipeline và Marketing Mail đã giúp chúng tôi tiết kiệm hơn 15 giờ mỗi tuần!"'
                  : '"We used to manage over 800 clients via spreadsheets, constantly losing track of missing 1099s. EMLY CUSTOMER LIST organized our entire filing queue and automated our client reminders flawlessly."'}
              </p>
            </div>
            <div className="mt-6 flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-bold flex items-center justify-center text-sm">
                AT
              </div>
              <div>
                <b className="text-sm text-slate-900 dark:text-white block">Amy Tran, EA</b>
                <small className="text-slate-500">Tax Practice Owner • Westminster, CA</small>
              </div>
            </div>
          </div>

          {/* Review 2 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#242A34] border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                {isVi
                  ? '"Gói Lifetime License $390 thực sự là món hời lớn nhất cho văn phòng tôi. Phần mềm hỗ trợ song ngữ Việt - Anh cực kỳ trực quan, các bạn nhân viên mới chỉ mất 15 phút là làm quen thành thạo."'
                  : '"The $390 Lifetime license is the best investment we made this year. Full bilingual English & Vietnamese support made onboarding our bilingual staff seamless."'}
              </p>
            </div>
            <div className="mt-6 flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 font-bold flex items-center justify-center text-sm">
                DL
              </div>
              <div>
                <b className="text-sm text-slate-900 dark:text-white block">Daniel Lee, CPA</b>
                <small className="text-slate-500">Managing Partner • Houston, TX</small>
              </div>
            </div>
          </div>

          {/* Review 3 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-[#242A34] border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1 text-amber-400 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 italic leading-relaxed">
                {isVi
                  ? '"Tính năng quản lý công nợ và sổ thu phí rất thông minh. Khách nào còn nợ tiền phí khai thuế được hiển thị màu đỏ rõ ràng, chỉ cần 1 click là gửi email nhắc nợ tự động."'
                  : '"The fee ledger and balance due alerts saved us thousands in unpaid preparation fees. One-click reminder emails get clients to pay their invoice on time."'}
              </p>
            </div>
            <div className="mt-6 flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
              <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 font-bold flex items-center justify-center text-sm">
                SK
              </div>
              <div>
                <b className="text-sm text-slate-900 dark:text-white block">Sarah Kim</b>
                <small className="text-slate-500">Senior Tax Preparer • Orlando, FL</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ SECTION ─── */}
      <section id="faq" className="py-20 md:py-28 bg-slate-50/70 dark:bg-[#161A20] border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              {isVi ? 'GIẢI ĐÁP THẮC MẮC' : 'FREQUENTLY ASKED QUESTIONS'}
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-2 tracking-tight">
              {isVi ? 'Các Câu Hỏi Thường Gặp' : 'Everything You Need to Know'}
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: isVi ? 'Gói dùng thử 7 ngày có bị giới hạn tính năng nào không?' : 'Are there any limitations during the 7-day free trial?',
                a: isVi
                  ? 'Hoàn toàn không. Bạn được trải nghiệm 100% tất cả tính năng cao cấp nhất: Quản lý khách hàng cá nhân & công ty không giới hạn, quy trình Pipeline, gửi email marketing và quản lý phân quyền nhân sự.'
                  : 'Zero limitations. You get full access to unlimited client management, business entity tracking, tax return pipelines, and automated email tools.',
              },
              {
                q: isVi ? 'Gói Lifetime License $390 có phải trả thêm chi phí nào sau này không?' : 'Are there any hidden or recurring fees with the $390 Lifetime License?',
                a: isVi
                  ? 'Không. Bạn chỉ thanh toán $390 một lần duy nhất để sở hữu bản quyền vĩnh viễn trọn đời, được miễn phí toàn bộ các tính năng mới và bản cập nhật trong tương lai.'
                  : 'No. The $390 Lifetime License is a one-time purchase with permanent access, free future updates, and no recurring monthly or annual bills.',
              },
              {
                q: isVi ? 'Dữ liệu thông tin khách hàng và số SSN của tôi có được bảo mật không?' : 'How secure is our client SSN and financial data?',
                a: isVi
                  ? 'EMLY CUSTOMER LIST được xây dựng trên nền tảng Supabase với cơ chế Row-Level Security (RLS) cấp ngân hàng. Mọi số SSN và thông tin nhạy cảm đều được mã hóa và phân quyền nghiêm ngặt.'
                  : 'Your database is secured by enterprise-grade Supabase Row-Level Security (RLS). Sensitive data and SSNs are protected with strict access control policies.',
              },
              {
                q: isVi ? 'Tôi có thể xuất dữ liệu khách hàng ra file Excel được không?' : 'Can I export my client data to Excel anytime?',
                a: isVi
                  ? 'Có. Bạn có thể xuất danh sách khách hàng cá nhân và doanh nghiệp ra file Excel (.xlsx) bất kỳ lúc nào chỉ với một cú nhấp chuột.'
                  : 'Yes, full 1-click Excel (.xlsx) export is available across both Individual and Business client directories.',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl bg-white dark:bg-[#242A34] border border-slate-200 dark:border-slate-700 overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-900 dark:text-white cursor-pointer"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                      activeFaq === idx ? 'rotate-180 text-blue-600' : ''
                    }`}
                  />
                </button>
                {activeFaq === idx && (
                  <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-700/60 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CALL TO ACTION BANNER ─── */}
      <section className="py-20 bg-gradient-to-br from-[#092c5c] to-[#0d4787] text-white text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md text-amber-400 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8" />
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
            {isVi ? 'Sẵn Sàng Nâng Tầm Văn Phòng Thuế Của Bạn?' : 'Ready to Elevate Your Tax Practice Today?'}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
            {isVi
              ? 'Tham gia cùng hơn 500+ văn phòng khai thuế đang tiết kiệm hàng trăm giờ làm việc mỗi mùa thuế với EMLY CUSTOMER LIST.'
              : 'Join over 500+ tax practices saving hundreds of hours each tax season with EMLY CUSTOMER LIST.'}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto">
              <Button
                className="w-full sm:w-auto h-14 px-9 text-base font-extrabold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-2xl hover:scale-105 transition-all gap-2 cursor-pointer"
              >
                <span>{isVi ? 'Bắt Đầu Dùng Thử Miễn Phí 7 Ngày' : 'Start Free 7-Day Trial Now'}</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </div>

          <p className="mt-4 text-xs text-blue-200">
            {isVi ? 'Không cần thẻ tín dụng • Hủy bất kỳ lúc nào' : 'No credit card required • Cancel anytime'}
          </p>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-12 bg-white dark:bg-[#161A20] border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#092c5c] text-white flex items-center justify-center font-bold text-sm">
              E✓
            </div>
            <div>
              <b className="text-slate-900 dark:text-white font-bold block text-sm">EMLY CUSTOMER LIST</b>
              <span>© {new Date().getFullYear()} EMLY TAX CRM. {isVi ? 'Bảo lưu mọi quyền.' : 'All rights reserved.'}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-semibold">
            <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400">
              {isVi ? 'Tính Năng' : 'Features'}
            </a>
            <a href="#pricing" className="hover:text-blue-600 dark:hover:text-blue-400">
              {isVi ? 'Bảng Giá' : 'Pricing'}
            </a>
            <Link href="/login" className="hover:text-blue-600 dark:hover:text-blue-400">
              {isVi ? 'Đăng Nhập' : 'Sign In'}
            </Link>
            <Link href="/register" className="hover:text-blue-600 dark:hover:text-blue-400">
              {isVi ? 'Đăng Ký' : 'Register'}
            </Link>
            <Link href="/terms" className="hover:text-blue-600 dark:hover:text-blue-400">
              {isVi ? 'Điều Khoản' : 'Terms'}
            </Link>
            <Link href="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400">
              {isVi ? 'Bảo Mật' : 'Privacy'}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
