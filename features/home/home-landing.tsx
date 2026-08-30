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

  const [activeTab, setActiveTab] = useState<'dashboard' | 'clients' | 'pipeline' | 'fees' | 'marketing'>('dashboard');
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#1D2128] text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans selection:bg-[#092c5c] selection:text-white">
      {/* ─── BACKGROUND LUXURY AMBIENT MESH ─── */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-gradient-to-b from-blue-500/8 via-indigo-500/5 to-transparent dark:from-blue-600/10 dark:via-emerald-600/5 dark:to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-emerald-500/5 dark:bg-emerald-600/5 rounded-full blur-3xl" />
        <div className="absolute top-2/3 -right-40 w-[500px] h-[500px] bg-purple-500/5 dark:bg-purple-600/5 rounded-full blur-3xl" />
      </div>

      {/* ─── HEADER / NAVIGATION BAR ─── */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-[#161A20]/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-all shadow-xs">
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
              {isVi ? 'Trải Nghiệm' : 'Live Preview'}
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
        <section className="pt-14 pb-20 md:pt-22 md:pb-28 text-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-white/90 dark:bg-slate-800/90 text-blue-700 dark:text-blue-300 border border-slate-200/90 dark:border-slate-700 shadow-xs mb-8">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>
              {isVi
                ? 'Nền Tảng Quản Lý Khách Hàng Khai Thuế Hiện Đại & Tinh Tế'
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
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
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

          {/* ─── LIVE INTERACTIVE SOFTWARE PREVIEW (BENTO WINDOW) ─── */}
          <div id="preview" className="mt-16 max-w-6xl mx-auto rounded-2xl p-2 sm:p-3 bg-gradient-to-b from-slate-200/80 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-800 dark:to-slate-900 shadow-2xl border border-slate-200/90 dark:border-slate-700">
            <div className="rounded-xl bg-white dark:bg-[#242A34] overflow-hidden border border-slate-200/90 dark:border-slate-700 text-left">
              {/* Window Navigation Header */}
              <div className="h-14 bg-slate-100/90 dark:bg-[#181C23] border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 hidden sm:inline-block text-xs font-mono text-slate-400">
                    app.crmemy.com/{activeTab}
                  </span>
                </div>

                {/* Interactive Demo Tab Bar */}
                <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-200/70 dark:bg-[#2A313D] text-xs font-bold">
                  {[
                    { id: 'dashboard', label: isVi ? '▦ Dashboard' : '▦ Dashboard' },
                    { id: 'clients', label: isVi ? '♙ Cá Nhân (1040)' : '♙ Clients (1040)' },
                    { id: 'pipeline', label: isVi ? '▣ Pipeline' : '▣ Pipeline' },
                    { id: 'fees', label: isVi ? '$ Thu Phí' : '$ Fees' },
                    { id: 'marketing', label: isVi ? '✉ Marketing Mail' : '✉ Marketing' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                        activeTab === tab.id
                          ? 'bg-white dark:bg-[#1D2128] text-slate-900 dark:text-white shadow-xs font-extrabold'
                          : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Tab Screen View */}
              <div className="p-6 md:p-8 space-y-6">
                {activeTab === 'dashboard' && (
                  <div className="space-y-6 animate-fadeIn">
                    {/* 4 KPIs */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1D2128] border border-slate-200/80 dark:border-slate-700">
                        <span className="text-xs font-bold text-slate-500">{isVi ? 'TỔNG KHÁCH HÀNG' : 'ACTIVE CLIENTS'}</span>
                        <div className="text-3xl font-black text-slate-900 dark:text-white mt-1">1,248</div>
                        <span className="text-xs text-emerald-600 font-bold">↗ +18.4% {isVi ? 'so với năm trước' : 'YoY Growth'}</span>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1D2128] border border-slate-200/80 dark:border-slate-700">
                        <span className="text-xs font-bold text-slate-500">{isVi ? 'ĐANG SOẠN HỒ SƠ' : 'IN PREPARATION'}</span>
                        <div className="text-3xl font-black text-blue-600 dark:text-blue-400 mt-1">42</div>
                        <span className="text-xs text-slate-500">12 {isVi ? 'chờ W-2 / 1099' : 'waiting documents'}</span>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1D2128] border border-slate-200/80 dark:border-slate-700">
                        <span className="text-xs font-bold text-slate-500">{isVi ? 'IRS CHẤP THUẬN' : 'IRS ACCEPTED'}</span>
                        <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">98.8%</div>
                        <span className="text-xs text-emerald-600 font-bold">✓ E-Filed 100% On-time</span>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1D2128] border border-slate-200/80 dark:border-slate-700">
                        <span className="text-xs font-bold text-slate-500">{isVi ? 'DOANH THU PHÍ' : 'TOTAL BILLED FEES'}</span>
                        <div className="text-3xl font-black text-purple-600 dark:text-purple-400 mt-1">$148,250</div>
                        <span className="text-xs text-rose-500 font-bold">{isVi ? 'Còn nợ: $8,420' : 'Balance due: $8,420'}</span>
                      </div>
                    </div>

                    {/* Pipeline Stage Interactive Bar */}
                    <div className="p-5 rounded-xl bg-slate-50 dark:bg-[#1D2128] border border-slate-200/80 dark:border-slate-700">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                          {isVi ? 'Tiến Độ Quy Trình Hồ Sơ Thuế (IRS Pipeline)' : 'Tax Return Progress Pipeline'}
                        </span>
                        <span className="text-xs text-blue-600 font-bold">{isVi ? 'Tự động đồng bộ' : 'Auto-synced'}</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center text-xs">
                        <div className="p-3 rounded-lg bg-amber-100/80 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300 font-bold">
                          1. {isVi ? 'Chờ Giấy Tờ' : 'Waiting Docs'} (12)
                        </div>
                        <div className="p-3 rounded-lg bg-blue-100/80 dark:bg-blue-950/60 border border-blue-300 dark:border-blue-800 text-blue-900 dark:text-blue-300 font-bold">
                          2. {isVi ? 'Đang Soạn' : 'In Prep'} (18)
                        </div>
                        <div className="p-3 rounded-lg bg-purple-100/80 dark:bg-purple-950/60 border border-purple-300 dark:border-purple-800 text-purple-900 dark:text-purple-300 font-bold">
                          3. {isVi ? 'Kiểm Tra QA' : 'Review'} (9)
                        </div>
                        <div className="p-3 rounded-lg bg-indigo-100/80 dark:bg-indigo-950/60 border border-indigo-300 dark:border-indigo-800 text-indigo-900 dark:text-indigo-300 font-bold">
                          4. {isVi ? 'Sẵn Sàng Nộp' : 'Ready to File'} (14)
                        </div>
                        <div className="p-3 rounded-lg bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 font-bold">
                          5. {isVi ? 'Đã Hoàn Tất' : 'Completed'} (1,195)
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'clients' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-base">
                          {isVi ? 'Danh Sách Khách Hàng Cá Nhân (Form 1040)' : 'Individual Client Directory (Form 1040)'}
                        </h4>
                        <p className="text-xs text-slate-500">{isVi ? 'Quản lý SSN, người phụ thuộc và công nợ phí' : 'Manage SSN, dependents, and balance due'}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                        {isVi ? '1,248 Hồ sơ' : '1,248 Clients'}
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-500 font-bold uppercase text-[11px]">
                            <th className="pb-3">{isVi ? 'TÊN KHÁCH HÀNG' : 'CLIENT NAME'}</th>
                            <th className="pb-3">{isVi ? 'MÃ TỜ KHAI' : 'FORM'}</th>
                            <th className="pb-3">{isVi ? 'NĂM THUẾ' : 'TAX YEAR'}</th>
                            <th className="pb-3">{isVi ? 'TRẠNG THÁI' : 'STATUS'}</th>
                            <th className="pb-3">{isVi ? 'NHÂN VIÊN' : 'STAFF'}</th>
                            <th className="pb-3 text-right">{isVi ? 'PHÍ / CÒN NỢ' : 'FEE / BALANCE'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60 font-medium">
                          <tr>
                            <td className="py-3">
                              <b>Minh Nguyen</b>
                              <small className="block text-slate-500">{isVi ? 'Độc thân' : 'Single'} • (714) 555-0184</small>
                            </td>
                            <td><span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold">1040</span></td>
                            <td><b>2025</b></td>
                            <td><span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 font-bold text-[11px]">{isVi ? 'Chờ Giấy Tờ' : 'Waiting Docs'}</span></td>
                            <td>Amy Tran</td>
                            <td className="text-right">
                              <b>$650</b>
                              <small className="block text-rose-500 font-bold">{isVi ? 'Còn nợ: $325' : 'Due: $325'}</small>
                            </td>
                          </tr>
                          <tr>
                            <td className="py-3">
                              <b>David & Lisa Harrison</b>
                              <small className="block text-slate-500">{isVi ? 'Vợ chồng khai chung (MFJ)' : 'Married Filing Jointly'}</small>
                            </td>
                            <td><span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-bold">1040</span></td>
                            <td><b>2025</b></td>
                            <td><span className="px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-300 font-bold text-[11px]">{isVi ? 'Đang Soạn Hồ Sơ' : 'In Preparation'}</span></td>
                            <td>Daniel Lee</td>
                            <td className="text-right">
                              <b>$850</b>
                              <small className="block text-emerald-600 font-bold">{isVi ? 'Đã thu đủ' : 'Paid in full'}</small>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {activeTab === 'pipeline' && (
                  <div className="space-y-4 animate-fadeIn">
                    <h4 className="font-bold text-slate-900 dark:text-white text-base">
                      {isVi ? 'Kiểm Soát Toàn Bộ 5 Giai Đoạn Khai Thuế IRS' : 'Comprehensive IRS Filing Workflow'}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {isVi
                        ? 'Tự động gửi thông báo cho khách hàng khi trạng thái hồ sơ chuyển sang giai đoạn mới.'
                        : 'Automatic email triggers notify clients whenever their tax file progresses to the next milestone.'}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1D2128] border border-slate-200 dark:border-slate-700">
                        <div className="text-xs font-bold text-blue-600 uppercase">Giai Đoạn 1 & 2</div>
                        <h5 className="font-bold text-slate-900 dark:text-white mt-1">Thu Thập & Soạn Thảo</h5>
                        <p className="text-xs text-slate-500 mt-1">Tải lên W-2, 1099, K-1 và tổng hợp thu nhập, giảm trừ thuế.</p>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1D2128] border border-slate-200 dark:border-slate-700">
                        <div className="text-xs font-bold text-purple-600 uppercase">Giai Đoạn 3 & 4</div>
                        <h5 className="font-bold text-slate-900 dark:text-white mt-1">Kiểm Tra QA & Ký Tên</h5>
                        <p className="text-xs text-slate-500 mt-1">Reviewer duyệt tính toán, gửi Form 8879 xin chữ ký điện tử.</p>
                      </div>
                      <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1D2128] border border-slate-200 dark:border-slate-700">
                        <div className="text-xs font-bold text-emerald-600 uppercase">Giai Đoạn 5</div>
                        <h5 className="font-bold text-slate-900 dark:text-white mt-1">Nộp IRS & Hoàn Tất</h5>
                        <p className="text-xs text-slate-500 mt-1">E-file lên IRS, lưu trữ biên nhận chấp thuận và tất toán hóa đơn.</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'fees' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-base">
                          {isVi ? 'Sổ Theo Dõi Thu Phí & Hóa Đơn (Fee Ledger)' : 'Fee Ledger & Receivables'}
                        </h4>
                        <p className="text-xs text-slate-500">{isVi ? 'Liên kết trực tiếp với từng tờ khai thuế' : 'Directly linked to individual tax return files'}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-slate-500 block">{isVi ? 'Tổng tiền đã thu' : 'Collected'}</span>
                        <b className="text-emerald-600 text-base font-extrabold">$139,830</b>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1D2128] border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center font-black">
                          $
                        </div>
                        <div>
                          <b className="text-xs font-bold text-slate-900 dark:text-white block">ABC Logistics LLC (Form 1065)</b>
                          <small className="text-slate-500">Phí: $2,400 • Đã trả: $1,200</small>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300">
                        {isVi ? 'Còn nợ $1,200 (Đã gửi hóa đơn)' : 'Due $1,200 (Invoice Sent)'}
                      </span>
                    </div>
                  </div>
                )}

                {activeTab === 'marketing' && (
                  <div className="space-y-4 animate-fadeIn">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-base">
                          {isVi ? 'Email Marketing & Gửi Thư Hàng Loạt' : 'Bulk Marketing & Reminder Campaigns'}
                        </h4>
                        <p className="text-xs text-slate-500">{isVi ? 'Nhắc nợ, nhắc bổ sung tài liệu W-2 qua Resend API' : 'Automated document & payment reminders via Resend API'}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                        ⚡ 72.8% Open Rate
                      </span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#1D2128] border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        Tiêu đề: <span className="font-mono text-blue-600 dark:text-blue-400">[Nhắc Nhở] Hoàn Tất Hồ Sơ Thuế 2025 - CRM EMY</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-400 italic">
                        &quot;Chào David & Lisa Harrison, văn phòng thuế đã sẵn sàng xử lý tờ khai của bạn. Vui lòng phản hồi bổ sung Form 1099 còn thiếu trước ngày 15/10...&quot;
                      </p>
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
