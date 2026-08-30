'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  AlertCircle,
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
  Eye,
  FileCheck,
  FileSpreadsheet,
  FileText,
  Filter,
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
  Tag,
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

  const [activeTab, setActiveTab] = useState<'dashboard' | 'clients' | 'businesses' | 'pipeline' | 'fees' | 'marketing'>('dashboard');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#1D2128] text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans selection:bg-[#092c5c] selection:text-white">
      {/* ─── BACKGROUND LUXURY AMBIENT MESH ─── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1100px] h-[650px] bg-gradient-to-b from-blue-500/10 via-indigo-500/5 to-transparent dark:from-blue-600/15 dark:via-emerald-600/5 dark:to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-[600px] h-[600px] bg-emerald-500/5 dark:bg-emerald-600/5 rounded-full blur-3xl" />
        <div className="absolute top-2/3 -right-40 w-[600px] h-[600px] bg-purple-500/5 dark:bg-purple-600/5 rounded-full blur-3xl" />
      </div>

      {/* ─── HEADER / NAVIGATION BAR ─── */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/85 dark:bg-[#161A20]/85 border-b border-slate-200/80 dark:border-slate-800/80 transition-all shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-3 group text-decoration-none">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#092c5c] to-[#11498b] text-white flex items-center justify-center font-black text-xl shadow-md group-hover:scale-105 transition-transform">
              <span className="relative">
                E<i className="absolute -right-1 -bottom-1 text-[11px] not-italic text-emerald-400 font-bold">✓</i>
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-black text-lg leading-tight tracking-tight text-[#092c5c] dark:text-white flex items-center gap-1.5">
                EMLY <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">CUSTOMER LIST</span>
              </span>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
                {isVi ? 'Phần Mềm Quản Lý Khách Hàng Thuế' : 'Tax Practice Management CRM'}
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {isVi ? 'Tính Năng' : 'Features'}
            </a>
            <a href="#preview" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              {isVi ? 'Trải Nghiệm Trực Tiếp' : 'Live Preview'}
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
                className="hidden sm:inline-flex text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 cursor-pointer"
              >
                {isVi ? 'Đăng Nhập' : 'Sign In'}
              </Button>
            </Link>

            <Link href="/register">
              <Button className="h-10 px-5 text-sm font-extrabold bg-gradient-to-r from-[#092c5c] to-[#12427c] hover:from-[#072247] hover:to-[#092c5c] text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all gap-1.5 cursor-pointer">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '4s' }} />
                <span>{isVi ? 'Dùng Thử Miễn Phí' : 'Start Free Trial'}</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* ─── HERO SECTION ─── */}
        <section className="pt-14 pb-14 md:pt-20 md:pb-20 text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-white/90 dark:bg-slate-800/90 text-blue-700 dark:text-blue-300 border border-slate-200/90 dark:border-slate-700 shadow-xs mb-8">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>
              {isVi
                ? 'Nền Tảng Quản Lý Khách Hàng Khai Thuế Hiện Đại & Chuyên Nghiệp'
                : 'Modern Tax Practice Management CRM For US Accounting Offices'}
            </span>
          </div>

          {/* Main H1 Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] max-w-5xl mx-auto">
            {isVi ? (
              <>
                Tự Động Hóa Quản Lý Khách Hàng &{' '}
                <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-teal-500 bg-clip-text text-transparent">
                  Hồ Sơ Thuế Hoa Kỳ
                </span>
              </>
            ) : (
              <>
                Effortlessly Streamline Tax Clients &{' '}
                <span className="bg-gradient-to-r from-blue-700 via-blue-600 to-teal-500 bg-clip-text text-transparent">
                  IRS Filing Pipeline
                </span>
              </>
            )}
          </h1>

          {/* Subtitle */}
          <p className="mt-7 text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            {isVi
              ? 'Giải phóng áp lực mùa thuế cao điểm. Quản lý toàn diện hồ sơ cá nhân Form 1040, công ty 1120/1065, kiểm soát tiến độ e-file IRS, đối soát phí dịch vụ và gửi email marketing tự động.'
              : 'End-to-end management for Individual 1040s, Corporate 1120/1065 entities, visual IRS progress pipeline, fee ledger tracking, and automated client email campaigns.'}
          </p>

          {/* Hero CTAs */}
          <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="w-full sm:w-auto">
              <Button
                className="w-full sm:w-auto h-14 px-9 text-base font-extrabold bg-gradient-to-r from-[#092c5c] via-[#104380] to-[#092c5c] hover:shadow-[0_10px_30px_rgba(9,44,92,0.3)] text-white shadow-xl hover:-translate-y-0.5 transition-all gap-2.5 cursor-pointer"
              >
                <span>{isVi ? 'Bắt Đầu Dùng Thử 7 Ngày Miễn Phí' : 'Start 7-Day Free Trial'}</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>

            <a href="#features" className="w-full sm:w-auto">
              <Button
                variant="outline"
                className="w-full sm:w-auto h-14 px-8 text-base font-bold border-slate-300 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-slate-100 shadow-sm hover:border-slate-400 transition-all cursor-pointer"
              >
                {isVi ? 'Khám Phá Tính Năng' : 'Explore Features'}
              </Button>
            </a>
          </div>

          {/* Guarantee Badges */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-7 text-xs font-semibold text-slate-500 dark:text-slate-400">
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

          {/* ─── EXPANDED & IMMERSIVE LIVE INTERACTIVE SOFTWARE PREVIEW ─── */}
          <div id="preview" className="mt-14 w-full max-w-7xl mx-auto rounded-2xl p-2.5 sm:p-4 bg-gradient-to-b from-slate-200/90 via-slate-100/70 to-slate-200/90 dark:from-slate-700 dark:via-slate-800 dark:to-slate-900 shadow-2xl border border-slate-300/80 dark:border-slate-700">
            <div className="rounded-xl bg-white dark:bg-[#242A34] overflow-hidden border border-slate-200 dark:border-slate-700 text-left shadow-inner">
              
              {/* Window Navigation Header */}
              <div className="h-14 bg-slate-100 dark:bg-[#181C23] border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3.5 h-3.5 rounded-full bg-rose-500" />
                    <div className="w-3.5 h-3.5 rounded-full bg-amber-500" />
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-500" />
                  </div>
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-md bg-white dark:bg-[#1D2128] border border-slate-200 dark:border-slate-700 text-xs font-mono text-slate-500 dark:text-slate-400 shadow-xs">
                    <Lock className="w-3 h-3 text-emerald-500" />
                    <span>https://app.crmemy.com/{activeTab}</span>
                  </div>
                </div>

                {/* Interactive Demo Tab Bar (6 Tabs) */}
                <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-200/80 dark:bg-[#2A313D] text-xs font-bold overflow-x-auto max-w-full">
                  {[
                    { id: 'dashboard', label: isVi ? '▦ Tổng Quan' : '▦ Dashboard' },
                    { id: 'clients', label: isVi ? '👤 Cá Nhân (1040)' : '👤 Form 1040' },
                    { id: 'businesses', label: isVi ? '🏢 Doanh Nghiệp' : '🏢 Entities' },
                    { id: 'pipeline', label: isVi ? '▣ Pipeline IRS' : '▣ Pipeline' },
                    { id: 'fees', label: isVi ? '💵 Thu Phí & Nợ' : '💵 Fee Ledger' },
                    { id: 'marketing', label: isVi ? '✉ Marketing Mail' : '✉ Marketing' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-3 py-1.5 rounded-md transition-all whitespace-nowrap cursor-pointer ${
                        activeTab === tab.id
                          ? 'bg-white dark:bg-[#1D2128] text-blue-700 dark:text-blue-400 shadow-xs font-black'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Tab Screen View */}
              <div className="p-5 sm:p-8 space-y-6">

                {/* ─── TAB 1: FULL DASHBOARD ─── */}
                {activeTab === 'dashboard' && (
                  <div className="space-y-6 animate-fadeIn">
                    {/* Top Stats 4 Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1D2128] border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                          <span>{isVi ? 'TỔNG KHÁCH HÀNG' : 'ACTIVE CLIENTS'}</span>
                          <span className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 flex items-center justify-center font-bold">👤</span>
                        </div>
                        <div className="text-3xl font-black text-slate-900 dark:text-white mt-2">1,248</div>
                        <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                          <span className="text-emerald-600 font-bold">↗ +18.4% {isVi ? 'năm nay' : 'YoY'}</span>
                          <span className="text-slate-400 font-mono">1040: 980 | Biz: 268</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1D2128] border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                          <span>{isVi ? 'ĐANG SOẠN HỒ SƠ' : 'IN PREPARATION'}</span>
                          <span className="w-7 h-7 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center font-bold">⏳</span>
                        </div>
                        <div className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-2">42</div>
                        <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                          <span className="text-amber-600 dark:text-amber-400 font-bold">12 {isVi ? 'chờ W-2 / 1099' : 'waiting W-2'}</span>
                          <span className="text-slate-400 font-mono">QA Review: 9</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1D2128] border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                          <span>{isVi ? 'TỶ LỆ IRS CHẤP THUẬN' : 'IRS ACCEPTANCE'}</span>
                          <span className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-bold">✓</span>
                        </div>
                        <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2">99.4%</div>
                        <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                          <span className="text-emerald-600 font-bold">✓ 1,195 {isVi ? 'đã hoàn tất' : 'completed'}</span>
                          <span className="text-slate-400 font-mono">0 Rejected</span>
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1D2128] border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between text-xs text-slate-500 font-bold">
                          <span>{isVi ? 'DOANH THU & CÔNG NỢ' : 'TOTAL REVENUE'}</span>
                          <span className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 flex items-center justify-center font-bold">$</span>
                        </div>
                        <div className="text-3xl font-black text-purple-600 dark:text-purple-400 mt-2">$148,250</div>
                        <div className="flex items-center justify-between text-xs mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-800">
                          <span className="text-emerald-600 font-bold">{isVi ? 'Đã thu:' : 'Paid:'} $139,830</span>
                          <span className="text-rose-500 font-bold">{isVi ? 'Nợ:' : 'Due:'} $8,420</span>
                        </div>
                      </div>
                    </div>

                    {/* Middle Section: Pipeline & Urgent Deadlines */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* 5-Stage IRS Pipeline Visual (2 cols) */}
                      <div className="lg:col-span-2 p-5 rounded-xl bg-slate-50 dark:bg-[#1D2128] border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                              {isVi ? 'Tiến Độ Quy Trình Hồ Sơ Thuế (IRS Workflow Pipeline)' : 'Tax Return Progress Pipeline'}
                            </h4>
                            <p className="text-xs text-slate-500">{isVi ? 'Theo dõi thời gian thực 5 giai đoạn xử lý tờ khai' : 'Real-time 5-stage return tracking'}</p>
                          </div>
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                            ● {isVi ? 'Đang hoạt động' : 'Live Sync'}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-xs">
                          <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                            <span className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400 block">Giai đoạn 1</span>
                            <b className="text-amber-950 dark:text-amber-200 block mt-1">{isVi ? 'Chờ Giấy Tờ' : 'Waiting Docs'}</b>
                            <span className="mt-2 inline-block px-2 py-0.5 rounded-full text-xs font-black bg-amber-200/80 dark:bg-amber-900 text-amber-900 dark:text-amber-100">12</span>
                          </div>
                          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800">
                            <span className="text-[10px] uppercase font-bold text-blue-700 dark:text-blue-400 block">Giai đoạn 2</span>
                            <b className="text-blue-950 dark:text-blue-200 block mt-1">{isVi ? 'Đang Soạn' : 'In Prep'}</b>
                            <span className="mt-2 inline-block px-2 py-0.5 rounded-full text-xs font-black bg-blue-200/80 dark:bg-blue-900 text-blue-900 dark:text-blue-100">18</span>
                          </div>
                          <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800">
                            <span className="text-[10px] uppercase font-bold text-purple-700 dark:text-purple-400 block">Giai đoạn 3</span>
                            <b className="text-purple-950 dark:text-purple-200 block mt-1">{isVi ? 'Kiểm Tra QA' : 'QA Review'}</b>
                            <span className="mt-2 inline-block px-2 py-0.5 rounded-full text-xs font-black bg-purple-200/80 dark:bg-purple-900 text-purple-900 dark:text-purple-100">9</span>
                          </div>
                          <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800">
                            <span className="text-[10px] uppercase font-bold text-indigo-700 dark:text-indigo-400 block">Giai đoạn 4</span>
                            <b className="text-indigo-950 dark:text-indigo-200 block mt-1">{isVi ? 'Sẵn Sàng Nộp' : 'Ready to File'}</b>
                            <span className="mt-2 inline-block px-2 py-0.5 rounded-full text-xs font-black bg-indigo-200/80 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-100">14</span>
                          </div>
                          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                            <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 block">Giai đoạn 5</span>
                            <b className="text-emerald-950 dark:text-emerald-200 block mt-1">{isVi ? 'Đã Hoàn Tất' : 'Completed'}</b>
                            <span className="mt-2 inline-block px-2 py-0.5 rounded-full text-xs font-black bg-emerald-200/80 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-100">1,195</span>
                          </div>
                        </div>

                        {/* Recent Activity Mini List */}
                        <div className="mt-4 pt-3 border-t border-slate-200/70 dark:border-slate-800 space-y-2 text-xs">
                          <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                            <span className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              <b>Minh Nguyen (Form 1040)</b>: IRS đã chấp thuận hồ sơ (E-file Accepted).
                            </span>
                            <span className="text-slate-400 text-[11px]">10 phút trước</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                            <span className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-blue-500" />
                              <b>ABC Logistics LLC (Form 1065)</b>: Đã cập nhật 2 thành viên góp vốn K-1.
                            </span>
                            <span className="text-slate-400 text-[11px]">32 phút trước</span>
                          </div>
                        </div>
                      </div>

                      {/* Urgent Deadlines & Workload (1 col) */}
                      <div className="p-5 rounded-xl bg-slate-50 dark:bg-[#1D2128] border border-slate-200 dark:border-slate-700 space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-rose-500" />
                            <span>{isVi ? 'Hạn Chót Sắp Đến (IRS Deadlines)' : 'Upcoming Deadlines'}</span>
                          </h4>
                          <span className="text-xs font-bold text-rose-600">3 {isVi ? 'Hồ sơ' : 'Files'}</span>
                        </div>

                        <div className="space-y-2.5 text-xs">
                          <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 flex items-center justify-between">
                            <div>
                              <b className="text-rose-950 dark:text-rose-200 block">Form 1040 Extension Due</b>
                              <span className="text-slate-500 text-[11px]">David & Lisa Harrison</span>
                            </div>
                            <span className="font-mono font-bold text-rose-600 bg-white dark:bg-rose-950 px-2 py-0.5 rounded text-[11px]">Oct 15</span>
                          </div>

                          <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 flex items-center justify-between">
                            <div>
                              <b className="text-amber-950 dark:text-amber-200 block">Form 1065 Partnership</b>
                              <span className="text-slate-500 text-[11px]">XYZ Tech Partners</span>
                            </div>
                            <span className="font-mono font-bold text-amber-600 bg-white dark:bg-amber-950 px-2 py-0.5 rounded text-[11px]">Sep 15</span>
                          </div>

                          <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 flex items-center justify-between">
                            <div>
                              <b className="text-blue-950 dark:text-blue-200 block">Form 1120-S S-Corp</b>
                              <span className="text-slate-500 text-[11px]">Luxury Nails Studio</span>
                            </div>
                            <span className="font-mono font-bold text-blue-600 bg-white dark:bg-blue-950 px-2 py-0.5 rounded text-[11px]">Sep 15</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── TAB 2: INDIVIDUAL FORM 1040 ─── */}
                {activeTab === 'clients' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-700">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-base">
                          {isVi ? 'Quản Lý Khách Hàng Cá Nhân (Form 1040)' : 'Individual Taxpayer Directory (Form 1040)'}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {isVi ? 'Kiểm soát SSN, vợ/chồng, người phụ thuộc, tình trạng hôn nhân và số dư nợ phí' : 'Track SSN, spouse, dependents, filing status & balance due'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-lg text-xs font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          980 {isVi ? 'Hồ sơ 1040' : 'Returns'}
                        </span>
                        <Button size="sm" className="h-8 text-xs font-bold bg-[#092c5c] text-white">
                          + {isVi ? 'Thêm Khách Mới' : 'Add Client'}
                        </Button>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 font-bold uppercase text-[11px]">
                            <th className="pb-3">{isVi ? 'TÊN KHÁCH HÀNG / SSN' : 'CLIENT / SSN'}</th>
                            <th className="pb-3">{isVi ? 'TÌNH TRẠNG HÔN NHÂN' : 'FILING STATUS'}</th>
                            <th className="pb-3">{isVi ? 'NGƯỜI PHỤ THUỘC' : 'DEPENDENTS'}</th>
                            <th className="pb-3">{isVi ? 'NĂM THUẾ' : 'TAX YEAR'}</th>
                            <th className="pb-3">{isVi ? 'TRẠNG THÁI PIPELINE' : 'STAGE'}</th>
                            <th className="pb-3">{isVi ? 'NHÂN VIÊN' : 'PREPARER'}</th>
                            <th className="pb-3 text-right">{isVi ? 'PHÍ / CÔNG NỢ' : 'FEE / BALANCE'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 font-medium">
                          <tr>
                            <td className="py-3">
                              <b className="text-slate-900 dark:text-white block">Minh Nguyen</b>
                              <small className="text-slate-500 font-mono">SSN: ***-**-1234 • (714) 555-0184</small>
                            </td>
                            <td><span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold">{isVi ? 'Độc Thân (Single)' : 'Single'}</span></td>
                            <td><span className="font-semibold text-slate-600 dark:text-slate-400">0</span></td>
                            <td><b>2025</b></td>
                            <td><span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 font-bold text-[11px]">{isVi ? 'Chờ Giấy Tờ' : 'Waiting Docs'}</span></td>
                            <td>Amy Tran</td>
                            <td className="text-right">
                              <b>$650</b>
                              <small className="block text-rose-500 font-bold">{isVi ? 'Còn nợ: $325' : 'Due: $325'}</small>
                            </td>
                          </tr>

                          <tr>
                            <td className="py-3">
                              <b className="text-slate-900 dark:text-white block">Olivia Johnson</b>
                              <small className="text-slate-500 font-mono">SSN: ***-**-5678 • (415) 555-0128</small>
                            </td>
                            <td><span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-bold">{isVi ? 'Chủ Hộ (HOH)' : 'Head of Household'}</span></td>
                            <td><span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 font-bold">1 con (Emma)</span></td>
                            <td><b>2025</b></td>
                            <td><span className="px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 font-bold text-[11px]">{isVi ? 'Kiểm Tra QA' : 'QA Review'}</span></td>
                            <td>Daniel Lee</td>
                            <td className="text-right">
                              <b>$875</b>
                              <small className="block text-emerald-600 font-bold">{isVi ? 'Đã thu đủ' : 'Paid in Full'}</small>
                            </td>
                          </tr>

                          <tr>
                            <td className="py-3">
                              <b className="text-slate-900 dark:text-white block">Kevin & Mai Tran</b>
                              <small className="text-slate-500 font-mono">SSN: ***-**-9012 • (408) 555-9012</small>
                            </td>
                            <td><span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold">{isVi ? 'Khai Chung (MFJ)' : 'Married Jointly'}</span></td>
                            <td><span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-600 font-bold">2 con (Lucas, Chloe)</span></td>
                            <td><b>2025</b></td>
                            <td><span className="px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 font-bold text-[11px]">{isVi ? 'IRS Chấp Thuận' : 'IRS Accepted'}</span></td>
                            <td>Amy Tran</td>
                            <td className="text-right">
                              <b>$950</b>
                              <small className="block text-emerald-600 font-bold">{isVi ? 'Đã thu đủ' : 'Paid in Full'}</small>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ─── TAB 3: BUSINESS ENTITIES ─── */}
                {activeTab === 'businesses' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-700">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-base">
                          {isVi ? 'Khách Hàng Doanh Nghiệp (LLC, S-Corp 1120-S, Partnership 1065)' : 'Corporate & Business Entities Directory'}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {isVi ? 'Theo dõi cơ cấu thành viên góp vốn (Partnership K-1), EIN, địa chỉ và 8 tab dữ liệu chi tiết' : 'EIN, K-1 partner breakdown, entity ownership & filing records'}
                        </p>
                      </div>
                      <span className="px-3 py-1 rounded-lg text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        268 {isVi ? 'Doanh nghiệp' : 'Entities'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Biz 1 */}
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1D2128] border border-slate-200 dark:border-slate-700 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                              Form 1065 (Partnership)
                            </span>
                            <h5 className="font-bold text-slate-900 dark:text-white text-sm mt-1">ABC Logistics LLC</h5>
                          </div>
                          <span className="text-xs font-bold text-slate-500 font-mono">CA</span>
                        </div>
                        <div className="text-xs text-slate-500 space-y-1">
                          <div>EIN: <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">**-***5678</span></div>
                          <div>Thành viên: <span className="font-semibold text-slate-800 dark:text-slate-200">Kevin Tran (60%), Linda Vo (40%)</span></div>
                          <div>Phí dịch vụ: <b className="text-slate-900 dark:text-white">$2,400</b> (Còn nợ: <span className="text-rose-500 font-bold">$1,200</span>)</div>
                        </div>
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-blue-600">
                          <span>8 Tabs Hồ Sơ Chi Tiết</span>
                          <span>Xem ➔</span>
                        </div>
                      </div>

                      {/* Biz 2 */}
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1D2128] border border-slate-200 dark:border-slate-700 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                              Form 1120-S (S-Corp)
                            </span>
                            <h5 className="font-bold text-slate-900 dark:text-white text-sm mt-1">XYZ Tech Solutions Inc</h5>
                          </div>
                          <span className="text-xs font-bold text-slate-500 font-mono">TX</span>
                        </div>
                        <div className="text-xs text-slate-500 space-y-1">
                          <div>EIN: <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">**-***1234</span></div>
                          <div>Cổ đông: <span className="font-semibold text-slate-800 dark:text-slate-200">Daniel Lee (100%)</span></div>
                          <div>Phí dịch vụ: <b className="text-slate-900 dark:text-white">$3,200</b> (Đã thu đủ: <span className="text-emerald-600 font-bold">$3,200</span>)</div>
                        </div>
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-blue-600">
                          <span>8 Tabs Hồ Sơ Chi Tiết</span>
                          <span>Xem ➔</span>
                        </div>
                      </div>

                      {/* Biz 3 */}
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1D2128] border border-slate-200 dark:border-slate-700 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">
                              Schedule C (Sole Prop)
                            </span>
                            <h5 className="font-bold text-slate-900 dark:text-white text-sm mt-1">Luxury Nails Studio</h5>
                          </div>
                          <span className="text-xs font-bold text-slate-500 font-mono">FL</span>
                        </div>
                        <div className="text-xs text-slate-500 space-y-1">
                          <div>DBA: <span className="font-semibold text-slate-800 dark:text-slate-200">Luxury Nails & Spa</span></div>
                          <div>Chủ sở hữu: <span className="font-semibold text-slate-800 dark:text-slate-200">Sarah Kim (100%)</span></div>
                          <div>Phí dịch vụ: <b className="text-slate-900 dark:text-white">$1,850</b> (Đã thu đủ)</div>
                        </div>
                        <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs font-bold text-blue-600">
                          <span>8 Tabs Hồ Sơ Chi Tiết</span>
                          <span>Xem ➔</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── TAB 4: KANBAN PIPELINE ─── */}
                {activeTab === 'pipeline' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-base">
                          {isVi ? 'Bảng Điều Khiển Quy Trình Hồ Sơ (IRS Kanban Pipeline)' : 'Visual IRS Tax Return Pipeline'}
                        </h4>
                        <p className="text-xs text-slate-500">{isVi ? 'Kéo thả và chuyển trạng thái hồ sơ theo thời gian thực' : 'Real-time drag and drop filing workflow'}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                      {/* Col 1 */}
                      <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-[#1D2128] border border-slate-200 dark:border-slate-700 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-amber-700 dark:text-amber-400">
                          <span>1. {isVi ? 'Chờ Giấy Tờ' : 'Waiting Docs'}</span>
                          <span className="w-5 h-5 rounded-full bg-amber-200 dark:bg-amber-900 flex items-center justify-center text-[10px]">12</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white dark:bg-[#242A34] border border-slate-200 dark:border-slate-700 shadow-xs space-y-1">
                          <b className="text-xs text-slate-900 dark:text-white block">Minh Nguyen</b>
                          <small className="text-[11px] text-slate-500 block">Form 1040 • Chờ 1099-INT</small>
                          <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950 px-1.5 py-0.5 rounded block w-fit">Amy Tran</span>
                        </div>
                      </div>

                      {/* Col 2 */}
                      <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-[#1D2128] border border-slate-200 dark:border-slate-700 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-blue-700 dark:text-blue-400">
                          <span>2. {isVi ? 'Đang Soạn' : 'In Prep'}</span>
                          <span className="w-5 h-5 rounded-full bg-blue-200 dark:bg-blue-900 flex items-center justify-center text-[10px]">18</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white dark:bg-[#242A34] border border-slate-200 dark:border-slate-700 shadow-xs space-y-1">
                          <b className="text-xs text-slate-900 dark:text-white block">David Harrison</b>
                          <small className="text-[11px] text-slate-500 block">Form 1040 • Nhập W-2</small>
                          <span className="text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-1.5 py-0.5 rounded block w-fit">Daniel Lee</span>
                        </div>
                      </div>

                      {/* Col 3 */}
                      <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-[#1D2128] border border-slate-200 dark:border-slate-700 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-purple-700 dark:text-purple-400">
                          <span>3. {isVi ? 'Kiểm Tra QA' : 'QA Review'}</span>
                          <span className="w-5 h-5 rounded-full bg-purple-200 dark:bg-purple-900 flex items-center justify-center text-[10px]">9</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white dark:bg-[#242A34] border border-slate-200 dark:border-slate-700 shadow-xs space-y-1">
                          <b className="text-xs text-slate-900 dark:text-white block">Olivia Johnson</b>
                          <small className="text-[11px] text-slate-500 block">Form 1040 • Duyệt Giảm Trừ</small>
                          <span className="text-[10px] font-bold text-purple-600 bg-purple-50 dark:bg-purple-950 px-1.5 py-0.5 rounded block w-fit">Amy Tran</span>
                        </div>
                      </div>

                      {/* Col 4 */}
                      <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-[#1D2128] border border-slate-200 dark:border-slate-700 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-indigo-700 dark:text-indigo-400">
                          <span>4. {isVi ? 'Sẵn Sàng Nộp' : 'Ready to File'}</span>
                          <span className="w-5 h-5 rounded-full bg-indigo-200 dark:bg-indigo-900 flex items-center justify-center text-[10px]">14</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white dark:bg-[#242A34] border border-slate-200 dark:border-slate-700 shadow-xs space-y-1">
                          <b className="text-xs text-slate-900 dark:text-white block">ABC Logistics</b>
                          <small className="text-[11px] text-slate-500 block">Form 1065 • Đã Ký 8879</small>
                          <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950 px-1.5 py-0.5 rounded block w-fit">E-File Queue</span>
                        </div>
                      </div>

                      {/* Col 5 */}
                      <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-[#1D2128] border border-slate-200 dark:border-slate-700 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-400">
                          <span>5. {isVi ? 'Đã Hoàn Tất' : 'Completed'}</span>
                          <span className="w-5 h-5 rounded-full bg-emerald-200 dark:bg-emerald-900 flex items-center justify-center text-[10px]">1,195</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-white dark:bg-[#242A34] border border-slate-200 dark:border-slate-700 shadow-xs space-y-1">
                          <b className="text-xs text-slate-900 dark:text-white block">Kevin & Mai Tran</b>
                          <small className="text-[11px] text-slate-500 block">IRS Accepted ✓</small>
                          <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 rounded block w-fit">Archived</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── TAB 5: FEE LEDGER ─── */}
                {activeTab === 'fees' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-700">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-base">
                          {isVi ? 'Sổ Theo Dõi Thu Phí & Hóa Đơn (Fee Ledger)' : 'Fee Ledger & Receivables Management'}
                        </h4>
                        <p className="text-xs text-slate-500">{isVi ? 'Tự động tính toán công nợ và trạng thái thanh toán' : 'Automated balance due & payment tracking'}</p>
                      </div>
                      <div className="flex items-center gap-4 text-right">
                        <div>
                          <span className="text-[11px] text-slate-500 block">{isVi ? 'Đã Thu' : 'Collected'}</span>
                          <b className="text-emerald-600 text-sm font-extrabold">$139,830</b>
                        </div>
                        <div>
                          <span className="text-[11px] text-slate-500 block">{isVi ? 'Còn Nợ' : 'Balance Due'}</span>
                          <b className="text-rose-500 text-sm font-extrabold">$8,420</b>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#1D2128] border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center">$</span>
                          <div>
                            <b className="text-slate-900 dark:text-white block">ABC Logistics LLC (Form 1065)</b>
                            <span className="text-slate-500 text-[11px]">Hóa đơn #INV-2025-084 • Đã trả $1,200</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-slate-900 dark:text-white">Tổng phí: $2,400</span>
                          <span className="px-2.5 py-1 rounded-full font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300">
                            {isVi ? 'Còn nợ $1,200 (Đã gửi hóa đơn)' : 'Due $1,200 (Invoice Sent)'}
                          </span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#1D2128] border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold flex items-center justify-center">$</span>
                          <div>
                            <b className="text-slate-900 dark:text-white block">Minh Nguyen (Form 1040)</b>
                            <span className="text-slate-500 text-[11px]">Hóa đơn #INV-2025-091 • Đã trả $325</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-slate-900 dark:text-white">Tổng phí: $650</span>
                          <span className="px-2.5 py-1 rounded-full font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300">
                            {isVi ? 'Còn nợ $325 (Quá hạn 15 ngày)' : 'Due $325 (Overdue 15d)'}
                          </span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#1D2128] border border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 text-xs">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center">✓</span>
                          <div>
                            <b className="text-slate-900 dark:text-white block">XYZ Tech Solutions Inc (Form 1120-S)</b>
                            <span className="text-slate-500 text-[11px]">Hóa đơn #INV-2025-072 • Đã trả $3,200</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-slate-900 dark:text-white">Tổng phí: $3,200</span>
                          <span className="px-2.5 py-1 rounded-full font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300">
                            {isVi ? 'Đã Thanh Toán Đủ' : 'Paid in Full'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── TAB 6: MARKETING MAIL ─── */}
                {activeTab === 'marketing' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-700">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-base">
                          {isVi ? 'Email Marketing & Gửi Thư Hàng Loạt Tự Động' : 'Bulk Marketing & Automated Reminder Campaigns'}
                        </h4>
                        <p className="text-xs text-slate-500">{isVi ? 'Tích hợp Resend API / SMTP, cá nhân hóa theo từng khách hàng' : 'Resend API integration with dynamic mail tags'}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                        ⚡ 74.2% Open Rate • 48.6% Click Rate
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1D2128] border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
                      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-200/80 dark:border-slate-800">
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {isVi ? 'Mẫu Email Đang Chọn:' : 'Selected Template:'} <b className="text-blue-600">[Nhắc Nhở Bổ Sung Giấy Tờ Thuế 2025]</b>
                        </span>
                        <span className="text-slate-500">Người nhận: <b>12 Khách hàng đang ở giai đoạn 1</b></span>
                      </div>

                      <div className="p-3.5 rounded-lg bg-white dark:bg-[#242A34] border border-slate-200 dark:border-slate-700 font-sans space-y-2">
                        <div className="text-slate-500 font-mono text-[11px]">
                          To: &lt;minh.nguyen@example.com&gt; | Subject: [CRM EMY] Nhắc nhở hoàn tất hồ sơ khai thuế Form 1040
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 italic leading-relaxed">
                          &quot;Chào <b>Minh Nguyen</b>, văn phòng thuế đã tiếp nhận thông tin của bạn cho năm thuế 2025. Hiện tại hồ sơ của bạn đang thiếu <b>Form 1099-INT</b>. Vui lòng gửi bổ sung tài liệu để chúng tôi kịp nộp trước hạn chót...&quot;
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <div className="flex gap-2">
                          <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[11px] font-mono">&#123;&#123;client_name&#125;&#125;</span>
                          <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[11px] font-mono">&#123;&#123;tax_year&#125;&#125;</span>
                          <span className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[11px] font-mono">&#123;&#123;balance_due&#125;&#125;</span>
                        </div>
                        <Button size="sm" className="h-8 text-xs font-bold bg-[#092c5c] text-white">
                          <Send className="w-3.5 h-3.5 mr-1" /> {isVi ? 'Gửi Chiến Dịch Ngay' : 'Send Campaign'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ─── 8 CORE FEATURES SHOWCASE SECTION ─── */}
        <section id="features" className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              {isVi ? 'TÍNH NĂNG TOÀN DIỆN' : 'POWERFUL FEATURES'}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mt-2 tracking-tight">
              {isVi
                ? 'Tất Cả Công Cụ Cần Thiết Cho Một Văn Phòng Khai Thuế Hiện Đại'
                : 'Everything Your Tax Practice Needs To Scale Effortlessly'}
            </h2>
            <p className="text-base text-slate-600 dark:text-slate-400 mt-4 leading-relaxed">
              {isVi
                ? 'Được thiết kế chuyên sâu theo quy chuẩn khai thuế Hoa Kỳ, tối ưu hóa từ khâu tiếp nhận thông tin, phân công nhân viên, xử lý tờ khai đến lập hóa đơn và chăm sóc khách hàng.'
                : 'Built specifically around IRS tax preparation standards, from client intake and partner ownership breakdown to filing verification and automated client follow-ups.'}
            </p>
          </div>

          {/* 8 Features Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1: Individual 1040 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#242A34] border border-slate-200/80 dark:border-slate-700 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5">
                <UsersRound className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {isVi ? '1. Khách Hàng Cá Nhân (Form 1040)' : '1. Individual Clients (1040)'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed">
                {isVi
                  ? 'Quản lý thông tin người nộp thuế, vợ/chồng, danh sách người phụ thuộc, SSN, ngày sinh, tình trạng hôn nhân (Single, MFJ, HOH) và lịch sử tờ khai qua các năm.'
                  : 'Manage taxpayer, spouse, and dependents, SSNs, DOBs, filing statuses (Single, MFJ, MFS, HOH), and complete tax year histories.'}
              </p>
            </div>

            {/* Feature 2: Business Entities */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#242A34] border border-slate-200/80 dark:border-slate-700 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {isVi ? '2. Khách Hàng Doanh Nghiệp' : '2. Business Entities & LLCs'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed">
                {isVi
                  ? 'Chuyên biệt cho Hợp danh 1065, S-Corp 1120-S, C-Corp 1120, Sole Proprietor Schedule C. Theo dõi EIN, DBA, cơ cấu thành viên góp vốn & tỷ lệ sở hữu %.'
                  : 'Tailored for Partnerships (1065), S-Corps (1120-S), C-Corps (1120), and Schedule C. Track EIN, DBA, and unlimited partner ownership breakdown.'}
              </p>
            </div>

            {/* Feature 3: Visual Pipeline */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#242A34] border border-slate-200/80 dark:border-slate-700 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-5">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {isVi ? '3. Quy Trình Hồ Sơ (IRS Pipeline)' : '3. Visual Tax Pipeline'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed">
                {isVi
                  ? 'Kiểm soát chặt chẽ 5 giai đoạn: Chờ giấy tờ W-2/1099 ➔ Đang soạn hồ sơ ➔ Kiểm tra QA ➔ Sẵn sàng nộp ➔ IRS chấp thuận hoàn tất.'
                  : 'Track progress in 5 real-time stages: Waiting Documents, In Preparation, QA Review, Ready to File, and IRS Accepted.'}
              </p>
            </div>

            {/* Feature 4: Fees & Payments */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#242A34] border border-slate-200/80 dark:border-slate-700 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5">
                <DollarSign className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {isVi ? '4. Sổ Thu Phí & Quản Lý Công Nợ' : '4. Fee Ledger & Invoicing'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed">
                {isVi
                  ? 'Tự động tính công nợ còn lại (Balance = Phí - Đã trả). Theo dõi trạng thái hóa đơn (Sent, Overdue, Paid), xuất báo cáo thu tiền chính xác.'
                  : 'Automated balance due calculation, invoice status tracking (Sent, Overdue, Paid), and one-click financial export.'}
              </p>
            </div>

            {/* Feature 5: Bulk Email Engine */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#242A34] border border-slate-200/80 dark:border-slate-700 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-5">
                <Megaphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {isVi ? '5. Email Marketing Hàng Loạt' : '5. Automated Marketing Mail'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed">
                {isVi
                  ? 'Gửi email hàng loạt theo phân khúc khách hàng (còn nợ phí, thiếu tài liệu W-2...). Tích hợp Resend API / SMTP, merge tag cá nhân hóa.'
                  : 'Send targeted email broadcasts by audience segments (missing docs, balance due). Integrated with Resend API / SMTP and dynamic tags.'}
              </p>
            </div>

            {/* Feature 6: Team & RBAC Security */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#242A34] border border-slate-200/80 dark:border-slate-700 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {isVi ? '6. Phân Quyền & Quản Lý Nhân Sự' : '6. Team Workload & RBAC'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed">
                {isVi
                  ? 'Phân bổ hồ sơ cho từng nhân viên (Preparer / Reviewer). Bảo mật cơ sở dữ liệu với Supabase Row Level Security, ngăn chặn rò rỉ dữ liệu.'
                  : 'Assign return caseloads to staff. Granular role-based access control protected by Supabase Row-Level Security.'}
              </p>
            </div>

            {/* Feature 7: Bilingual Support */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#242A34] border border-slate-200/80 dark:border-slate-700 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-5">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {isVi ? '7. Song Ngữ Tiếng Việt & Anh' : '7. 100% Bilingual VN & EN'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed">
                {isVi
                  ? 'Chuyển đổi 1 chạm giữa Tiếng Việt và Tiếng Anh trên toàn bộ các màn hình, bảng biểu, modal với các thuật ngữ thuế Mỹ chuẩn xác, dễ hiểu.'
                  : 'Seamless 1-click toggle between Vietnamese and English across 100% of screens, modals, and tables with accurate tax terminology.'}
              </p>
            </div>

            {/* Feature 8: Dark Mode #1D2128 */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#242A34] border border-slate-200/80 dark:border-slate-700 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center mb-5">
                <Moon className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {isVi ? '8. Giao Diện Tối (#1D2128)' : '8. Ergonomic Dark Mode'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2.5 leading-relaxed">
                {isVi
                  ? 'Tone màu tối xám than #1D2128 sang trọng, chống mỏi mắt khi làm việc ban đêm, các khối layout rõ ràng với độ tương phản chữ cao.'
                  : 'Crafted with #1D2128 charcoal dark palette, perfect for late-night tax season work with crisp high-contrast readability.'}
              </p>
            </div>
          </div>
        </section>

        {/* ─── FAQ SECTION ─── */}
        <section id="faq" className="py-20 md:py-28 bg-slate-100/60 dark:bg-[#161A20] border-t border-slate-200 dark:border-slate-800">
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
                  className="rounded-xl bg-white dark:bg-[#242A34] border border-slate-200/80 dark:border-slate-700 overflow-hidden shadow-xs hover:border-slate-300 transition-colors"
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
                    <div className="px-5 pb-5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-700/60 pt-3.5">
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FINAL CTA BANNER ─── */}
        <section className="py-20 bg-gradient-to-br from-[#092c5c] via-[#0b3874] to-[#092c5c] text-white text-center relative overflow-hidden">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md text-amber-400 flex items-center justify-center mx-auto mb-6 shadow-inner">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              {isVi ? 'Sẵn Sàng Nâng Tầm Văn Phòng Thuế Của Bạn?' : 'Ready to Elevate Your Tax Practice Today?'}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-blue-100 max-w-2xl mx-auto leading-relaxed">
              {isVi
                ? 'Đăng ký trải nghiệm ngay hôm nay để tối ưu hóa quy trình quản lý khách hàng và hồ sơ khai thuế.'
                : 'Sign up today to streamline your tax preparation client workflows.'}
            </p>

            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="w-full sm:w-auto">
                <Button
                  className="w-full sm:w-auto h-14 px-10 text-base font-extrabold bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-2xl hover:scale-105 transition-all gap-2.5 cursor-pointer"
                >
                  <span>{isVi ? 'Bắt Đầu Dùng Thử Miễn Phí 7 Ngày' : 'Start Free 7-Day Trial Now'}</span>
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>

            <p className="mt-4 text-xs text-blue-200">
              {isVi ? 'Không cần thẻ tín dụng • Kích hoạt tức thì trong 30 giây' : 'No credit card required • Instant 30-sec activation'}
            </p>
          </div>
        </section>
      </main>

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
            <a href="#preview" className="hover:text-blue-600 dark:hover:text-blue-400">
              {isVi ? 'Trải Nghiệm' : 'Live Preview'}
            </a>
            <a href="#faq" className="hover:text-blue-600 dark:hover:text-blue-400">
              {isVi ? 'Hỏi & Đáp' : 'FAQ'}
            </a>
            <Link href="/login" className="hover:text-blue-600 dark:hover:text-blue-400">
              {isVi ? 'Đăng Nhập' : 'Sign In'}
            </Link>
            <Link href="/register" className="hover:text-blue-600 dark:hover:text-blue-400">
              {isVi ? 'Đăng Ký' : 'Register'}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
