'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  CreditCard,
  Crown,
  Download,
  HelpCircle,
  Lock,
  Mail,
  QrCode,
  ShieldCheck,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth/auth-context';
import { useLanguage } from '@/lib/i18n/language-context';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, profile, isLifetime } = useAuth();
  const { t, language } = useLanguage();
  const isVi = language === 'vi';

  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly' | 'lifetime'>('yearly');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'zelle' | 'vietqr'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [billingName, setBillingName] = useState(profile?.full_name || 'Tax Office Manager');
  const [billingEmail, setBillingEmail] = useState(user?.email || 'office@crmemy.com');

  const plans = {
    monthly: {
      id: 'monthly',
      name: isVi ? 'Gói Tháng (Monthly Pro)' : 'Monthly Pro',
      price: '$19',
      numericPrice: 19,
      period: isVi ? '/tháng' : '/month',
      badge: null,
      desc: isVi ? 'Linh hoạt trả theo từng tháng, hủy bất cứ lúc nào.' : 'Flexible monthly billing, cancel anytime.',
      features: [
        isVi ? 'Hệ thống gửi Email Marketing tự động' : 'Automated Marketing Email Suite',
        isVi ? 'Không giới hạn tính toán & chuyển đổi tỷ giá' : 'Unlimited currency & tax rate conversions',
        isVi ? 'Xuất dữ liệu 1-Click sang Excel / CSV' : '1-Click Excel / CSV export',
        isVi ? 'Truy cập Dashboard Quản lý Doanh thu & Phí' : 'Full Fees & Payments Analytics Dashboard',
        isVi ? 'Hỗ trợ khai thuế Form 1040, 1065, 1120-S' : 'Forms 1040, 1065, 1120-S filing tracker',
      ],
    },
    yearly: {
      id: 'yearly',
      name: isVi ? 'Gói Năm (Annual Enterprise)' : 'Annual Enterprise',
      price: '$199',
      numericPrice: 199,
      period: isVi ? '/năm (Tiết kiệm $29)' : '/year (Save $29)',
      badge: isVi ? 'TIẾT KIỆM 15% • PHỔ BIẾN NHẤT' : 'SAVE 15% • MOST POPULAR',
      desc: isVi ? 'Lựa chọn tối ưu cho văn phòng dịch vụ thuế đang phát triển.' : 'Best value for growing accounting & tax offices.',
      features: [
        isVi ? 'Toàn bộ tính năng của gói Monthly Pro' : 'Everything included in Monthly Pro',
        isVi ? 'Hệ thống gửi Email Marketing tự động hàng loạt' : 'Bulk automated client marketing campaigns',
        isVi ? 'Không giới hạn hồ sơ khách hàng & doanh nghiệp' : 'Unlimited clients & corporate entities',
        isVi ? 'Ưu tiên xử lý đồng bộ dữ liệu đám mây' : 'Priority cloud database sync & backups',
        isVi ? 'Hỗ trợ kỹ thuật 24/7 trực tiếp' : 'Priority 24/7 technical onboarding & support',
      ],
    },
    lifetime: {
      id: 'lifetime',
      name: isVi ? 'Bản Quyền Trọn Đời (Lifetime License)' : 'Lifetime License',
      price: '$390',
      numericPrice: 390,
      period: isVi ? 'thanh toán một lần' : 'one-time payment',
      badge: isVi ? '👑 ĐẦU TƯ TỐT NHẤT' : '👑 BEST VALUE',
      desc: isVi ? 'Sở hữu vĩnh viễn, không bao giờ phải gia hạn thêm.' : 'Permanent unlimited access, zero recurring fees.',
      features: [
        isVi ? 'Sử dụng vĩnh viễn trọn đời (Never expires)' : 'Permanent lifetime access forever',
        isVi ? 'Cập nhật miễn phí tất cả tính năng mới sau này' : 'Free access to all future SaaS feature updates',
        isVi ? 'Cấp phép dùng trên cả Web App & Windows App' : 'Full dual license: Web App & Windows PC App',
        isVi ? 'Không giới hạn nhân viên và văn phòng' : 'Unlimited team staff & practice accounts',
        isVi ? 'Hỗ trợ VIP 1-1 từ đội ngũ phát triển' : 'VIP 1-on-1 dedicated engineer support',
      ],
    },
  };

  const activePlan = plans[selectedPlan];

  const handleCompletePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#151921] text-slate-900 dark:text-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Back navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isVi ? 'Quay lại Dashboard' : 'Back to Workspace'}</span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <Lock className="w-3.5 h-3.5" />
            <span>{isVi ? 'Bảo Mật SSL 256-bit' : '256-Bit SSL Encrypted Checkout'}</span>
          </div>
        </div>

        {/* Page Header */}
        <div className="text-center max-w-2xl mx-auto pt-2 pb-4">
          <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 text-xs font-black uppercase tracking-wider border border-blue-200 dark:border-blue-900/60 inline-flex items-center gap-1.5 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            {isVi ? 'Nâng Cấp Tài Khoản' : 'Workspace Upgrade'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            {isVi ? 'Chọn Gói & Kích Hoạt Tính Năng Pro' : 'Choose Your Plan & Upgrade Workspace'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2">
            {isVi
              ? 'Mở khóa toàn bộ Email Marketing, Không giới hạn chuyển đổi, Xuất file Excel và Bảng kiểm soát doanh thu.'
              : 'Unlock Automated Marketing Emails, Unlimited Conversions, 1-Click Excel Export, and Fees Dashboard.'}
          </p>
        </div>

        {/* Success Modal Notification */}
        {isSuccess ? (
          <div className="bg-white dark:bg-[#1E232B] rounded-3xl p-8 sm:p-12 border border-emerald-200 dark:border-emerald-800 shadow-2xl text-center max-w-xl mx-auto animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-5 shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-black uppercase tracking-wider">
              {isVi ? 'Thanh Toán Thành Công' : 'Upgrade Successful'}
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-3">
              {isVi ? 'Tài Khoản Đã Nâng Cấp Thành Công!' : 'Your Workspace is Now Pro!'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2">
              {isVi
                ? `Cảm ơn bạn! Bạn đã đăng ký thành công ${activePlan.name}. Mọi tính năng Pro cao cấp đã sẵn sàng trên tài khoản của bạn.`
                : `Thank you! You are now subscribed to ${activePlan.name}. All Pro automation tools are now active on your account.`}
            </p>

            <div className="mt-6 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">{isVi ? 'Gói Đăng Ký:' : 'Subscribed Tier:'}</span>
                <strong className="text-slate-900 dark:text-white">{activePlan.name}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{isVi ? 'Số Tiền Thanh Toán:' : 'Amount Paid:'}</span>
                <strong className="text-emerald-600 dark:text-emerald-400 font-black">{activePlan.price}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">{isVi ? 'Mã Giao Dịch:' : 'Invoice Ref:'}</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">INV-{Date.now().toString().slice(-6)}</span>
              </div>
            </div>

            <Button
              onClick={() => router.push('/dashboard')}
              className="w-full mt-6 h-12 bg-gradient-to-r from-[#092c5c] to-[#104380] hover:from-[#072247] hover:to-[#092c5c] text-white font-extrabold text-sm rounded-xl shadow-lg cursor-pointer gap-2"
            >
              <span>{isVi ? 'Vào Dashboard Sử Dụng Ngay' : 'Return to Workspace Dashboard'}</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* LEFT COLUMN: PLAN SELECTION (7 COLS) */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                1. {isVi ? 'Chọn Gói Nâng Cấp' : 'Select Subscription Tier'}
              </h3>

              <div className="space-y-3">
                {(['yearly', 'monthly', 'lifetime'] as const).map((key) => {
                  const p = plans[key];
                  const isSelected = selectedPlan === key;

                  return (
                    <div
                      key={key}
                      onClick={() => setSelectedPlan(key)}
                      className={`relative p-5 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                        isSelected
                          ? 'bg-white dark:bg-[#1E232B] border-blue-600 dark:border-blue-500 shadow-md ring-2 ring-blue-500/20'
                          : 'bg-white/70 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      {p.badge && (
                        <span className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-[10px] tracking-tight uppercase shadow-xs">
                          {p.badge}
                        </span>
                      )}

                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                              isSelected
                                ? 'border-blue-600 bg-blue-600 text-white'
                                : 'border-slate-300 dark:border-slate-600'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">
                                {p.name}
                              </h4>
                              {key === 'lifetime' && <Crown className="w-4 h-4 text-amber-500" />}
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{p.desc}</p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xl font-black text-slate-900 dark:text-white">{p.price}</span>
                          <span className="text-[11px] text-slate-500 block">{p.period}</span>
                        </div>
                      </div>

                      {/* Expanded Plan Features */}
                      {isSelected && (
                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-in fade-in duration-200">
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                            {isVi ? 'Bao Gồm Trong Gói:' : 'Included In This Plan:'}
                          </p>
                          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 dark:text-slate-300">
                            {p.features.map((f, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                <span className="text-[11px] leading-tight">{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Payment Method Selector */}
              <div className="pt-3">
                <h3 className="text-sm font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                  2. {isVi ? 'Phương Thức Thanh Toán' : 'Payment Method'}
                </h3>

                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition cursor-pointer text-xs font-bold ${
                      paymentMethod === 'card'
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 dark:border-blue-500 text-blue-900 dark:text-blue-200 shadow-xs'
                        : 'bg-white dark:bg-[#1E232B] border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Credit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('zelle')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition cursor-pointer text-xs font-bold ${
                      paymentMethod === 'zelle'
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 dark:border-blue-500 text-blue-900 dark:text-blue-200 shadow-xs'
                        : 'bg-white dark:bg-[#1E232B] border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Zap className="w-5 h-5 text-purple-600" />
                    <span>Zelle / ACH</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('vietqr')}
                    className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition cursor-pointer text-xs font-bold ${
                      paymentMethod === 'vietqr'
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 dark:border-blue-500 text-blue-900 dark:text-blue-200 shadow-xs'
                        : 'bg-white dark:bg-[#1E232B] border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-emerald-600" />
                    <span>VietQR Banking</span>
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: PAYMENT FORM & ORDER SUMMARY (5 COLS) */}
            <div className="lg:col-span-5 space-y-4">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                3. {isVi ? 'Thông Tin & Xác Nhận' : 'Review & Checkout'}
              </h3>

              <div className="bg-white dark:bg-[#1E232B] rounded-3xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-lg space-y-5 text-left">
                {/* Order Summary */}
                <div className="pb-4 border-b border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-slate-500">{isVi ? 'Gói đã chọn:' : 'Selected Tier:'}</span>
                    <strong className="text-sm font-black text-slate-900 dark:text-white">{activePlan.name}</strong>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs text-slate-500">{isVi ? 'Chu kỳ thanh toán:' : 'Billing cycle:'}</span>
                    <span className="text-xs font-medium text-slate-700 dark:text-slate-300 capitalize">{selectedPlan}</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-2 border-t border-dashed border-slate-200 dark:border-slate-700">
                    <span className="text-sm font-black text-slate-900 dark:text-white">{isVi ? 'Tổng thanh toán:' : 'Total Due Today:'}</span>
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{activePlan.price}</span>
                  </div>
                </div>

                {/* Dynamic Form based on payment method */}
                {paymentMethod === 'card' && (
                  <form onSubmit={handleCompletePayment} className="space-y-3.5">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase">
                        {isVi ? 'Tên Trên Thẻ' : 'Cardholder Name'}
                      </label>
                      <input
                        type="text"
                        required
                        value={billingName}
                        onChange={(e) => setBillingName(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800 text-xs font-semibold focus:outline-blue-600"
                        placeholder="e.g. John Doe"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-500 uppercase">
                        {isVi ? 'Số Thẻ (Credit / Debit)' : 'Card Number'}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          maxLength={19}
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full h-10 pl-3 pr-10 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800 text-xs font-mono font-semibold focus:outline-blue-600"
                          placeholder="4242 •••• •••• 4242"
                        />
                        <CreditCard className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-500 uppercase">
                          {isVi ? 'Hạn Thẻ' : 'Exp Date'}
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800 text-xs font-mono font-semibold focus:outline-blue-600"
                          placeholder="MM/YY"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-500 uppercase">CVC / CVV</label>
                        <input
                          type="password"
                          required
                          maxLength={4}
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full h-10 px-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-800 text-xs font-mono font-semibold focus:outline-blue-600"
                          placeholder="•••"
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full h-12 bg-gradient-to-r from-[#092c5c] via-[#104380] to-[#092c5c] hover:from-[#072247] hover:to-[#092c5c] text-white font-extrabold text-sm rounded-xl shadow-lg mt-3 gap-2 cursor-pointer"
                    >
                      {isProcessing ? (
                        <span>{isVi ? 'Đang Xử Lý Giao Dịch...' : 'Processing Payment...'}</span>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 text-amber-400" />
                          <span>{isVi ? `Thanh Toán ${activePlan.price} & Kích Hoạt` : `Pay ${activePlan.price} & Upgrade Now`}</span>
                        </>
                      )}
                    </Button>
                  </form>
                )}

                {paymentMethod === 'zelle' && (
                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/50 text-xs space-y-2">
                      <p className="font-extrabold text-purple-900 dark:text-purple-300">
                        {isVi ? 'Thông Tin Chuyển Khoản Zelle (US):' : 'Zelle Transfer Instructions:'}
                      </p>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">Zelle ID / Email:</span>
                        <strong className="font-mono text-purple-900 dark:text-purple-200 select-all">billing@businesssolutions.agency</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">{isVi ? 'Tên Người Nhận:' : 'Account Name:'}</span>
                        <strong className="text-slate-900 dark:text-white">EMLY TAX SERVICES LLC</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600 dark:text-slate-400">{isVi ? 'Nội Dung:' : 'Memo:'}</span>
                        <strong className="font-mono text-blue-600 select-all">{user?.email || 'CRM-PRO'}</strong>
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={handleCompletePayment}
                      disabled={isProcessing}
                      className="w-full h-12 bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-sm rounded-xl shadow-lg gap-2 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>{isVi ? 'Tôi Đã Chuyển Khoản Zelle' : 'I Have Completed Zelle Transfer'}</span>
                    </Button>
                  </div>
                )}

                {paymentMethod === 'vietqr' && (
                  <div className="space-y-3">
                    <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-xs space-y-2 text-center">
                      <p className="font-extrabold text-emerald-900 dark:text-emerald-300">
                        {isVi ? 'Quét Mã VietQR Chuyển Khoản Nhanh 24/7' : 'Scan VietQR to Pay (Instant 24/7)'}
                      </p>
                      <div className="w-40 h-40 mx-auto rounded-xl bg-white p-2 border border-slate-200 flex items-center justify-center shadow-xs">
                        <QrCode className="w-32 h-32 text-slate-800" />
                      </div>
                      <div className="text-left space-y-1 pt-1 text-[11px]">
                        <div className="flex justify-between">
                          <span className="text-slate-600">Ngân hàng:</span>
                          <strong className="text-slate-900 dark:text-white">Techcombank / Vietcombank</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-600">Quy đổi VND:</span>
                          <strong className="text-emerald-600 font-bold">~{(activePlan.numericPrice * 25400).toLocaleString('vi-VN')} đ</strong>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="button"
                      onClick={handleCompletePayment}
                      disabled={isProcessing}
                      className="w-full h-12 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-sm rounded-xl shadow-lg gap-2 cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>{isVi ? 'Xác Nhận Đã Thanh Toán' : 'Confirm Payment'}</span>
                    </Button>
                  </div>
                )}

                {/* Trust guarantee */}
                <div className="pt-2 text-center text-[11px] text-slate-400 space-y-1">
                  <p className="flex items-center justify-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{isVi ? 'Cam kết hoàn tiền trong 14 ngày nếu không hài lòng' : '14-Day 100% Money-Back Guarantee'}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
