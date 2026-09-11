'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  Plus,
  Trash2,
  Copy,
  Check,
  RotateCcw,
  MessageSquare,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/lib/i18n/language-context';
import { useAuth } from '@/lib/auth/auth-context';
import {
  AVAILABLE_MODELS,
  ChatMessage,
  ChatSession,
} from './ai-types';
import { buildClientSideCrmContext, type CrmDataSummary } from './crm-context-builder';
import { ProFeaturePaywall } from '@/components/pro-feature-paywall';

export function EmlyAiView() {
  const { language } = useLanguage();
  const { user, profile, role, subscription } = useAuth();
  const isVi = language === 'vi';

  const isPro =
    subscription?.plan === 'monthly' ||
    subscription?.plan === 'yearly' ||
    subscription?.plan === 'lifetime' ||
    role === 'super_admin' ||
    role === 'admin';

  // Model & State
  const [selectedModel, setSelectedModel] = useState<string>('kira-3.5-pro');
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('default-session');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [crmSummary, setCrmSummary] = useState<CrmDataSummary | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history & live CRM context snapshot
  const loadHistoryAndCrmData = () => {
    if (typeof window !== 'undefined') {
      // Build CRM Context snapshot
      const summary = buildClientSideCrmContext(user?.id);
      setCrmSummary(summary);

      const userPrefix = user ? `crm_emy_ai_${user.id}` : 'crm_emy_ai_guest';
      const savedSessions = localStorage.getItem(`${userPrefix}_sessions`);
      if (savedSessions) {
        try {
          const parsed = JSON.parse(savedSessions) as ChatSession[];
          if (parsed && parsed.length > 0) {
            setSessions(parsed);
            setCurrentSessionId(parsed[0].id);
            setMessages(parsed[0].messages);
            return;
          }
        } catch {}
      }

      // Default initial session
      const initSession: ChatSession = {
        id: 'session-1',
        title: isVi ? 'Cuộc trò chuyện mới' : 'New Tax Consultation',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        selectedModel: 'kira-3.5-pro',
      };
      setSessions([initSession]);
      setCurrentSessionId(initSession.id);
      setMessages([]);
    }
  };

  useEffect(() => {
    loadHistoryAndCrmData();
  }, [user]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Save messages to session
  const saveCurrentMessages = (newMessages: ChatMessage[]) => {
    setMessages(newMessages);
    setSessions((prev) => {
      const updated = prev.map((s) => {
        if (s.id === currentSessionId) {
          let title = s.title;
          if (title.includes('mới') || title.includes('New Tax')) {
            const firstUserMsg = newMessages.find((m) => m.role === 'user');
            if (firstUserMsg) {
              title = firstUserMsg.content.slice(0, 32) + '...';
            }
          }
          return {
            ...s,
            title,
            messages: newMessages,
            updatedAt: new Date().toISOString(),
          };
        }
        return s;
      });

      if (typeof window !== 'undefined') {
        const userPrefix = user ? `crm_emy_ai_${user.id}` : 'crm_emy_ai_guest';
        localStorage.setItem(`${userPrefix}_sessions`, JSON.stringify(updated));
      }
      return updated;
    });
  };

  const handleCreateNewSession = () => {
    const newSession: ChatSession = {
      id: `session-${Date.now()}`,
      title: isVi ? `Phiên tư vấn #${sessions.length + 1}` : `Consultation #${sessions.length + 1}`,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      selectedModel,
    };
    const updated = [newSession, ...sessions];
    setSessions(updated);
    setCurrentSessionId(newSession.id);
    setMessages([]);

    if (typeof window !== 'undefined') {
      const userPrefix = user ? `crm_emy_ai_${user.id}` : 'crm_emy_ai_guest';
      localStorage.setItem(`${userPrefix}_sessions`, JSON.stringify(updated));
    }
  };

  const handleSelectSession = (id: string) => {
    const s = sessions.find((item) => item.id === id);
    if (s) {
      setCurrentSessionId(s.id);
      setMessages(s.messages);
    }
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = sessions.filter((s) => s.id !== id);
    if (filtered.length === 0) {
      const defaultS: ChatSession = {
        id: `session-${Date.now()}`,
        title: isVi ? 'Cuộc trò chuyện mới' : 'New Tax Consultation',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        selectedModel,
      };
      setSessions([defaultS]);
      setCurrentSessionId(defaultS.id);
      setMessages([]);
    } else {
      setSessions(filtered);
      if (currentSessionId === id) {
        setCurrentSessionId(filtered[0].id);
        setMessages(filtered[0].messages);
      }
    }

    if (typeof window !== 'undefined') {
      const userPrefix = user ? `crm_emy_ai_${user.id}` : 'crm_emy_ai_guest';
      localStorage.setItem(`${userPrefix}_sessions`, JSON.stringify(filtered));
    }
  };

  const handleClearHistory = () => {
    if (confirm(isVi ? 'Bạn có chắc chắn muốn xóa toàn bộ lịch sử trò chuyện?' : 'Are you sure you want to clear all chat history?')) {
      const initSession: ChatSession = {
        id: `session-${Date.now()}`,
        title: isVi ? 'Cuộc trò chuyện mới' : 'New Tax Consultation',
        messages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        selectedModel,
      };
      setSessions([initSession]);
      setCurrentSessionId(initSession.id);
      setMessages([]);
      if (typeof window !== 'undefined') {
        const userPrefix = user ? `crm_emy_ai_${user.id}` : 'crm_emy_ai_guest';
        localStorage.removeItem(`${userPrefix}_sessions`);
      }
    }
  };

  // Handle Send Message
  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputPrompt;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newMessagesList = [...messages, userMessage];
    saveCurrentMessages(newMessagesList);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const activeUserName = profile?.full_name || user?.user_metadata?.full_name || '';

      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: selectedModel,
          userName: activeUserName,
          crmContext: crmSummary?.contextMarkdown || '',
          messages: newMessagesList.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = (await res.json()) as {
        error?: string;
        content?: string;
        model?: string;
      };

      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to get AI response');
      }

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: data.content || '',
        provider: 'kira',
        model: data.model || selectedModel,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      saveCurrentMessages([...newMessagesList, assistantMessage]);
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Error communicating with AI';
      const errorAssistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: `⚠️ **Lỗi / Error:** ${errMsg}\n\n*Gợi ý:* Vui lòng thử lại với mô hình **Emly Tax Fast (Free)** hoặc kiểm tra kết nối mạng.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      saveCurrentMessages([...newMessagesList, errorAssistantMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(id);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-[1850px] w-full mx-auto p-4 sm:p-6 md:p-8 pb-12 animate-in fade-in duration-300 relative min-h-[85vh]">
      {/* Pro Soft Paywall Overlay */}
      {!isPro && (
        <ProFeaturePaywall
          featureNameVi="Siêu Trợ Lý Emly AI (Thuế & Luật Mỹ 50 Bang)"
          featureNameEn="Emly AI Tax & Law Super Assistant"
          featureDescriptionVi="Trí tuệ nhân tạo chuyên sâu tra cứu luật thuế IRS, Form 1040/1120/1065, bảo hiểm ACA/Medicare và tự động phân tích báo cáo doanh thu khách hàng."
          featureDescriptionEn="AI engine specialized in US IRS Tax Code, 50-State Regulations, Form 1040/1120/1065, and real-time CRM practice intelligence."
          icon={<Sparkles className="w-7 h-7 text-slate-950 fill-amber-300" />}
        />
      )}

      {/* ─── 1. TOP HEADER & DIRECT INTEGRATION BANNER ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-black tracking-wider text-slate-400 dark:text-slate-500 uppercase">
              {isVi ? 'Trợ Lý Trí Tuệ Nhân Tạo' : 'Tax Practice AI Workspace'}
            </span>
            <span className="text-[11px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Pro
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#092C5C] to-blue-600 flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <span>Emly AI</span>
            <span className="text-sm font-semibold text-slate-400 dark:text-slate-500 font-sans">
              (Emly Intelligent Engine)
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            {isVi
              ? 'Trợ lý thông minh kết nối trực tiếp dữ liệu Khách hàng, Doanh nghiệp & Dashboard CRM – Sẵn sàng phân tích, tra cứu và soạn email.'
              : 'Direct US tax code & accounting AI assistant connected to live CRM clients, businesses & dashboard data.'}
          </p>
        </div>

        {/* Status indicator & Direct Engine Badge */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* CRM Live Sync Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold shadow-2xs">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span>
              {isVi
                ? `CRM Live Data: ${crmSummary?.totalClients || 0} Khách, ${crmSummary?.totalBusinesses || 0} Doanh nghiệp`
                : `CRM Data: ${crmSummary?.totalClients || 0} Clients, ${crmSummary?.totalBusinesses || 0} Businesses`}
            </span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-bold shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{isVi ? 'Emly AI: Sẵn sàng' : 'Emly AI: Online'}</span>
          </div>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClearHistory}
            className="h-9 px-3 text-xs font-bold text-slate-500 hover:text-rose-600 rounded-xl gap-1.5 cursor-pointer"
            title={isVi ? 'Xóa toàn bộ lịch sử chat' : 'Clear all chat sessions'}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{isVi ? 'Làm mới' : 'Reset'}</span>
          </Button>
        </div>
      </div>

      {/* ─── 2. MAIN WORKSPACE GRID ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ─── LEFT SIDEBAR: SESSIONS (3 cols) ─── */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* New Chat Button */}
          <Button
            type="button"
            onClick={handleCreateNewSession}
            className="w-full h-11 text-xs font-bold gap-2 rounded-[20px] bg-white dark:bg-[#141923] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-white border border-slate-200/90 dark:border-white/10 shadow-2xs transition-all cursor-pointer justify-start px-4"
          >
            <div className="w-6 h-6 rounded-lg bg-[#092C5C] text-white flex items-center justify-center">
              <Plus className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold">{isVi ? 'Tạo Phiên Tư Vấn Mới' : '+ New Tax Chat Session'}</span>
          </Button>

          {/* Session History List */}
          <div className="bg-white dark:bg-[#141923] rounded-[24px] p-5 border border-slate-200/80 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/10">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-500" />
                <span>{isVi ? 'Lịch Sử Đoạn Chat' : 'Chat History'}</span>
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
                {sessions.length}
              </span>
            </div>

            <div className="space-y-1.5 max-h-[560px] overflow-y-auto pr-1">
              {sessions.map((s) => {
                const isActive = s.id === currentSessionId;
                return (
                  <div
                    key={s.id}
                    onClick={() => handleSelectSession(s.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                      isActive
                        ? 'bg-[#092C5C] text-white shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                      <span className="truncate">{s.title}</span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleDeleteSession(s.id, e)}
                      className={`p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity ${
                        isActive ? 'hover:bg-white/20 text-white' : 'hover:bg-slate-200 text-slate-400 hover:text-rose-600'
                      }`}
                      title={isVi ? 'Xóa phiên chat' : 'Delete chat'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─── RIGHT CHAT AREA (9 cols) ─── */}
        <div className="lg:col-span-9 bg-white dark:bg-[#141923] rounded-[28px] border border-slate-200/80 dark:border-white/10 shadow-[0_6px_24px_rgba(0,0,0,0.02)] flex flex-col min-h-[720px] max-h-[860px] overflow-hidden">
          
          {/* Chat Top Bar: Model Selector */}
          <div className="px-6 py-3.5 border-b border-slate-200/80 dark:border-white/10 bg-slate-50/80 dark:bg-slate-900/40 flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-black text-slate-500 uppercase">{isVi ? 'Mô hình AI:' : 'AI Model:'}</span>
              
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="h-9 px-3.5 rounded-xl border border-slate-300 dark:border-white/10 dark:bg-slate-900 font-bold text-slate-800 dark:text-slate-200 text-xs focus:ring-2 focus:ring-[#092C5C] focus:outline-none cursor-pointer shadow-2xs"
              >
                {AVAILABLE_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>{isVi ? 'Đã liên kết dữ liệu CRM nội bộ' : 'CRM Data Context Active'}</span>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 max-w-xl mx-auto space-y-5 text-slate-500">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#092C5C] to-blue-600 flex items-center justify-center text-white shadow-md">
                  <Sparkles className="w-8 h-8 text-amber-300" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">
                    {isVi ? 'Emly AI - Đã Đồng Bộ Dữ Liệu CRM' : 'Emly AI - Synced with CRM'}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {isVi
                      ? 'AI đã nắm toàn bộ hồ sơ khách hàng, doanh nghiệp, công nợ và số liệu dashboard. Bạn có thể tra cứu nhanh hoặc yêu cầu soạn email bên dưới.'
                      : 'AI has full visibility into your CRM clients, businesses, balances, and dashboard metrics.'}
                  </p>
                </div>

                {/* Quick Interactive Prompt Chips */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full text-left">
                  <button
                    type="button"
                    onClick={() => {
                      const text = isVi
                        ? 'Tổng hợp tình hình khai thuế trên Dashboard: có bao nhiêu hồ sơ, bao nhiêu người còn nợ tiền phí và những ai đang chờ nộp chứng từ?'
                        : 'Summarize Dashboard status: total returns, outstanding balances, and who is waiting for documents?';
                      setInputPrompt(text);
                      handleSendMessage(text);
                    }}
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/60 dark:bg-slate-900/60 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-white/5 transition-all text-left cursor-pointer group"
                  >
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#092C5C] dark:group-hover:text-blue-400 flex items-center gap-1.5">
                      <span>📊</span>
                      <span>{isVi ? 'Tổng hợp Dashboard & Công nợ' : 'Dashboard & Balance Summary'}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {isVi ? 'Xem số liệu tổng quan về hồ sơ thuế và các khoản phí chưa thu.' : 'Overview of all returns and unpaid client fees.'}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const text = isVi
                        ? 'Kiểm tra hồ sơ của khách hàng Minh Nguyen: đang làm Form gì, ai phụ trách, còn nợ bao nhiêu và đang thiếu giấy tờ gì?'
                        : 'Check client Minh Nguyen: form type, preparer, balance, and missing documents?';
                      setInputPrompt(text);
                      handleSendMessage(text);
                    }}
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/60 dark:bg-slate-900/60 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-white/5 transition-all text-left cursor-pointer group"
                  >
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#092C5C] dark:group-hover:text-blue-400 flex items-center gap-1.5">
                      <span>🔍</span>
                      <span>{isVi ? 'Tra cứu hồ sơ khách hàng Minh Nguyen' : 'Lookup Client Minh Nguyen'}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {isVi ? 'Xem chi tiết form thuế, chứng từ thiếu và số tiền nợ của Minh Nguyen.' : 'View form type, missing docs and fee balance.'}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const text = isVi
                        ? 'Soạn một email ngắn gọn và lịch sự gửi đích danh cho khách hàng Minh Nguyen để nhắc nộp bổ sung chứng từ Form W-2 và 1099-INT.'
                        : 'Draft a polite reminder email to Minh Nguyen requesting missing W-2 and 1099-INT documents.';
                      setInputPrompt(text);
                      handleSendMessage(text);
                    }}
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/60 dark:bg-slate-900/60 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-white/5 transition-all text-left cursor-pointer group"
                  >
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#092C5C] dark:group-hover:text-blue-400 flex items-center gap-1.5">
                      <span>✉️</span>
                      <span>{isVi ? 'Soạn email nhắc nộp W-2 & 1099' : 'Draft Document Reminder Email'}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {isVi ? 'Tự động chèn thông tin email và tên khách hàng từ dữ liệu CRM.' : 'Auto-fill client details from CRM data.'}
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const text = isVi
                        ? 'Liệt kê danh sách tất cả các doanh nghiệp đang có trên CRM, loại hình công ty, Form thuế và tiến độ hiện tại.'
                        : 'List all businesses on CRM with their entity type, tax forms, and progress.';
                      setInputPrompt(text);
                      handleSendMessage(text);
                    }}
                    className="p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/60 dark:bg-slate-900/60 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-white/5 transition-all text-left cursor-pointer group"
                  >
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-[#092C5C] dark:group-hover:text-blue-400 flex items-center gap-1.5">
                      <span>🏢</span>
                      <span>{isVi ? 'Báo cáo tiến độ các Doanh nghiệp' : 'Business Returns Status'}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                      {isVi ? 'Tra cứu các công ty LLC, S-Corp (1120-S), Hợp danh (1065).' : 'Check status of LLCs, S-Corps, and Partnerships.'}
                    </p>
                  </button>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3.5 ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {msg.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#092C5C] to-blue-700 text-white flex items-center justify-center shrink-0 shadow-xs text-xs font-black">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                    </div>
                  )}

                  <div className={`max-w-[85%] space-y-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    
                    {/* Role / Model Tag */}
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-bold px-1">
                      <span>{msg.role === 'user' ? (isVi ? 'Bạn' : 'You') : 'Emly AI'}</span>
                      {msg.model && (
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-500 font-semibold">
                          {AVAILABLE_MODELS.find((m) => m.id === msg.model)?.name || 'Emly Tax'}
                        </span>
                      )}
                      <span>·</span>
                      <span>{msg.timestamp}</span>
                    </div>

                    {/* Standard Message Bubble */}
                    <div
                      className={`p-4.5 sm:p-5 rounded-[22px] text-sm sm:text-[14.5px] leading-relaxed tracking-normal ${
                        msg.role === 'user'
                          ? 'bg-[#092C5C] text-white shadow-xs rounded-tr-sm'
                          : 'bg-slate-100/90 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-white/5 shadow-2xs rounded-tl-sm'
                      }`}
                    >
                      <div className="whitespace-pre-wrap font-sans leading-relaxed">{msg.content}</div>

                      {msg.role === 'assistant' && (
                        <div className="pt-2.5 mt-2.5 border-t border-slate-200/60 dark:border-white/10 flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleCopyText(msg.id, msg.content)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/60 transition-colors cursor-pointer"
                            title={isVi ? 'Sao chép câu trả lời' : 'Copy answer'}
                          >
                            {copiedMsgId === msg.id ? (
                              <Check className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <Copy className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center shrink-0 text-xs font-bold">
                      {profile?.full_name
                        ? profile.full_name.slice(0, 2).toUpperCase()
                        : user?.email
                        ? user.email.slice(0, 2).toUpperCase()
                        : 'ME'}
                    </div>
                  )}
                </div>
              ))
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex items-center gap-3 text-sm text-slate-500 font-bold p-2">
                <div className="w-8 h-8 rounded-xl bg-[#092C5C] text-white flex items-center justify-center animate-spin">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="animate-pulse">{isVi ? 'Emly AI đang phân tích và soạn câu trả lời...' : 'Emly AI is generating response...'}</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Bottom Chat Input Bar */}
          <div className="p-4 sm:p-5 border-t border-slate-200/80 dark:border-white/10 bg-slate-50/60 dark:bg-slate-900/60">
            <div className="relative flex items-end gap-2 bg-white dark:bg-slate-900 rounded-[22px] border border-slate-300 dark:border-white/10 p-2.5 focus-within:ring-2 focus-within:ring-[#092C5C] shadow-xs">
              <textarea
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={
                  isVi
                    ? 'Nhập câu hỏi về luật thuế IRS, Form 1040/1120-S hoặc yêu cầu tra cứu khách hàng (Nhấn Enter để gửi)...'
                    : 'Ask any tax questions or request client email draft (Press Enter to send)...'
                }
                rows={2}
                className="flex-1 bg-transparent border-none outline-none resize-none text-sm text-slate-900 dark:text-white p-2 max-h-36 leading-relaxed"
              />

              <Button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputPrompt.trim()}
                className="h-10 px-4.5 rounded-xl bg-[#092C5C] hover:bg-[#10427D] text-white font-bold text-sm gap-1.5 shadow-xs cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
                <span>{isVi ? 'Gửi' : 'Send'}</span>
              </Button>
            </div>

            <div className="flex items-center justify-between mt-2 px-2 text-[11px] text-slate-400">
              <span>{isVi ? 'Nhấn Shift + Enter để xuống dòng' : 'Shift + Enter for new line'}</span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isVi ? 'Emly Tax AI Engine' : 'Powered by Emly Tax AI Engine'}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

