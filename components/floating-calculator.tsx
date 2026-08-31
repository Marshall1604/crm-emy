'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Calculator,
  X,
  Minus,
  RotateCcw,
  ArrowUpDown,
  Copy,
  Check,
  Percent,
  Delete,
  Settings2,
  History,
  Sparkles,
  DollarSign,
  GripHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type CalcMode = 'calculator' | 'currency';

export function FloatingCalculator() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<CalcMode>('currency');

  // Bubble Position State (Draggable)
  const [bubblePos, setBubblePos] = useState({ x: 0, y: 0 });
  const [isDraggingBubble, setIsDraggingBubble] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);

  // Window Position State (Draggable Window)
  const [windowPos, setWindowPos] = useState({ x: 0, y: 0 });
  const [isDraggingWindow, setIsDraggingWindow] = useState(false);
  const [windowDragStart, setWindowDragStart] = useState({ x: 0, y: 0 });

  // Calculator State
  const [displayValue, setDisplayValue] = useState('0');
  const [previousValue, setPreviousValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [historyList, setHistoryList] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [copied, setCopied] = useState(false);

  // Currency Converter State (USD <-> VND)
  const [currencySource, setCurrencySource] = useState<'VND' | 'USD'>('VND');
  const [exchangeRate, setExchangeRate] = useState<number>(25500); // 1 USD = 25,500 VND
  const [isEditingRate, setIsEditingRate] = useState(false);
  const [customRateInput, setCustomRateInput] = useState('25500');

  // Set default initial position on mount (right middle)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const initialBubbleX = Math.max(16, window.innerWidth - 76);
      const initialBubbleY = Math.max(100, Math.min(window.innerHeight - 180, window.innerHeight * 0.5));
      setBubblePos({ x: initialBubbleX, y: initialBubbleY });

      const initialWinX = Math.max(16, window.innerWidth - 380);
      const initialWinY = Math.max(80, window.innerHeight * 0.2);
      setWindowPos({ x: initialWinX, y: initialWinY });
    }
  }, []);

  // -------------------------------------------------------------
  // BUBBLE DRAG HANDLERS (Mouse & Touch)
  // -------------------------------------------------------------
  const handleBubblePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDraggingBubble(true);
    setHasMoved(false);
    setDragStart({
      x: e.clientX - bubblePos.x,
      y: e.clientY - bubblePos.y,
    });
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (isDraggingBubble) {
        const newX = Math.max(10, Math.min(window.innerWidth - 70, e.clientX - dragStart.x));
        const newY = Math.max(60, Math.min(window.innerHeight - 80, e.clientY - dragStart.y));
        if (Math.abs(newX - bubblePos.x) > 3 || Math.abs(newY - bubblePos.y) > 3) {
          setHasMoved(true);
        }
        setBubblePos({ x: newX, y: newY });
      }

      if (isDraggingWindow) {
        const newWinX = Math.max(10, Math.min(window.innerWidth - 360, e.clientX - windowDragStart.x));
        const newWinY = Math.max(20, Math.min(window.innerHeight - 520, e.clientY - windowDragStart.y));
        setWindowPos({ x: newWinX, y: newWinY });
      }
    };

    const handlePointerUp = () => {
      setIsDraggingBubble(false);
      setIsDraggingWindow(false);
    };

    if (isDraggingBubble || isDraggingWindow) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    }

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDraggingBubble, isDraggingWindow, dragStart, windowDragStart, bubblePos]);

  const handleBubbleClick = () => {
    if (!hasMoved) {
      // Auto-position window nicely next to bubble if not already open
      if (!isOpen && typeof window !== 'undefined') {
        const targetX = Math.max(16, Math.min(window.innerWidth - 380, bubblePos.x - 320));
        const targetY = Math.max(70, Math.min(window.innerHeight - 560, bubblePos.y - 120));
        setWindowPos({ x: targetX, y: targetY });
      }
      setIsOpen((prev) => !prev);
    }
  };

  // -------------------------------------------------------------
  // WINDOW HEADER DRAG HANDLER
  // -------------------------------------------------------------
  const handleWindowHeaderPointerDown = (e: React.PointerEvent) => {
    setIsDraggingWindow(true);
    setWindowDragStart({
      x: e.clientX - windowPos.x,
      y: e.clientY - windowPos.y,
    });
  };

  // -------------------------------------------------------------
  // CALCULATOR LOGIC
  // -------------------------------------------------------------
  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplayValue(digit);
      setWaitingForOperand(false);
    } else {
      if (displayValue === '0' && digit !== '.') {
        setDisplayValue(digit);
      } else {
        if (displayValue.replace(/,/g, '').length < 14) {
          setDisplayValue(displayValue + digit);
        }
      }
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplayValue('0.');
      setWaitingForOperand(false);
      return;
    }
    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  };

  const clearAll = () => {
    setDisplayValue('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const deleteLastChar = () => {
    if (waitingForOperand) return;
    if (displayValue.length > 1) {
      setDisplayValue(displayValue.slice(0, -1));
    } else {
      setDisplayValue('0');
    }
  };

  const toggleSign = () => {
    const current = parseFloat(displayValue);
    if (current !== 0) {
      setDisplayValue(String(current * -1));
    }
  };

  const inputPercent = () => {
    const current = parseFloat(displayValue);
    if (current !== 0) {
      setDisplayValue(String(current / 100));
    }
  };

  const applyQuickTaxRate = (percentage: number) => {
    const current = parseFloat(displayValue) || 0;
    const result = current * (1 + percentage / 100);
    const formatted = parseFloat(result.toFixed(4)).toString();
    setDisplayValue(formatted);
    setHistoryList((prev) => [`${formatNumber(displayValue)} + ${percentage}% Tax = ${formatNumber(formatted)}`, ...prev.slice(0, 9)]);
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(displayValue);

    if (previousValue == null) {
      setPreviousValue(displayValue);
    } else if (operation) {
      const currentValue = previousValue || '0';
      const result = calculate(parseFloat(currentValue), inputValue, operation);
      const resultString = parseFloat(result.toFixed(6)).toString();

      setDisplayValue(resultString);
      setPreviousValue(resultString);

      const logItem = `${formatNumber(currentValue)} ${operation} ${formatNumber(displayValue)} = ${formatNumber(resultString)}`;
      setHistoryList((prev) => [logItem, ...prev.slice(0, 9)]);
    }

    setWaitingForOperand(true);
    setOperation(nextOperator);
  };

  const calculate = (prev: number, current: number, op: string): number => {
    switch (op) {
      case '+': return prev + current;
      case '-': return prev - current;
      case '×': return prev * current;
      case '÷': return current !== 0 ? prev / current : 0;
      default: return current;
    }
  };

  const handleEquals = () => {
    const inputValue = parseFloat(displayValue);
    if (previousValue != null && operation) {
      const result = calculate(parseFloat(previousValue), inputValue, operation);
      const resultString = parseFloat(result.toFixed(6)).toString();

      const logItem = `${formatNumber(previousValue)} ${operation} ${formatNumber(displayValue)} = ${formatNumber(resultString)}`;
      setHistoryList((prev) => [logItem, ...prev.slice(0, 9)]);

      setDisplayValue(resultString);
      setPreviousValue(null);
      setOperation(null);
      setWaitingForOperand(true);
    }
  };

  // -------------------------------------------------------------
  // CURRENCY CONVERSION HELPERS
  // -------------------------------------------------------------
  const numericInput = parseFloat(displayValue) || 0;

  const convertedValue = currencySource === 'VND'
    ? (numericInput / exchangeRate)
    : (numericInput * exchangeRate);

  const swapCurrencies = () => {
    setCurrencySource((prev) => (prev === 'VND' ? 'USD' : 'VND'));
  };

  const formatNumber = (val: string | number, maxDecimals: number = 4) => {
    const num = typeof val === 'string' ? parseFloat(val) : val;
    if (isNaN(num)) return '0';
    return num.toLocaleString('en-US', {
      maximumFractionDigits: maxDecimals,
    });
  };

  const copyResult = () => {
    const target = mode === 'currency'
      ? `${formatNumber(convertedValue, 2)} ${currencySource === 'VND' ? 'USD' : 'VND'}`
      : displayValue;
    navigator.clipboard.writeText(target);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveCustomRate = () => {
    const parsed = parseFloat(customRateInput);
    if (parsed > 0) {
      setExchangeRate(parsed);
    }
    setIsEditingRate(false);
  };

  return (
    <>
      {/* ──────────────────────────────────────────────────────────
          1. FLOATING DRAGGABLE BUBBLE
      ────────────────────────────────────────────────────────── */}
      <div
        style={{
          transform: `translate3d(${bubblePos.x}px, ${bubblePos.y}px, 0)`,
          touchAction: 'none',
        }}
        onPointerDown={handleBubblePointerDown}
        onClick={handleBubbleClick}
        title="Kéo di chuyển hoặc Click để mở Máy Tính / Chuyển Đổi Tiền Tệ"
        className={`fixed top-0 left-0 z-[9998] select-none flex items-center justify-center cursor-grab active:cursor-grabbing transition-transform ${
          isDraggingBubble ? 'scale-105 opacity-90' : 'hover:scale-105'
        }`}
      >
        <div className="relative group">
          {/* Glowing ring */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-600 via-indigo-500 to-amber-500 opacity-70 blur-xs group-hover:opacity-100 transition duration-300 animate-pulse" />

          {/* Main Bubble Button */}
          <button
            type="button"
            className="relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-white text-slate-900 border-2 border-blue-500/80 shadow-2xl flex flex-col items-center justify-center p-0 transition-all hover:bg-slate-50 cursor-pointer"
          >
            <Calculator className="w-6 h-6 sm:w-6.5 sm:h-6.5 text-[#092c5c] group-hover:text-blue-600 transition-colors" />
            <span className="text-[9px] font-black text-blue-700 tracking-tighter uppercase mt-0.5">
              CALC
            </span>

            {/* Notification Badge */}
            <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-amber-500 text-white text-[9px] font-black flex items-center justify-center shadow-xs">
              $
            </span>
          </button>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          2. FLOATING CALCULATOR MODAL WINDOW (LIGHT THEME)
      ────────────────────────────────────────────────────────── */}
      {isOpen && (
        <div
          style={{
            transform: `translate3d(${windowPos.x}px, ${windowPos.y}px, 0)`,
          }}
          className="fixed top-0 left-0 z-[9999] w-[340px] sm:w-[360px] bg-white rounded-3xl border border-slate-200/90 shadow-2xl flex flex-col overflow-hidden text-slate-900 animate-in fade-in zoom-in-95 duration-150 select-none"
        >
          {/* --- Draggable Header Bar --- */}
          <div
            onPointerDown={handleWindowHeaderPointerDown}
            className="h-12 bg-gradient-to-r from-slate-50 via-slate-100 to-slate-50 border-b border-slate-200/80 px-3.5 flex items-center justify-between cursor-move"
          >
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#092c5c] text-white flex items-center justify-center shadow-xs">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-black text-slate-800 tracking-tight flex items-center gap-1">
                  CRM EMY Calculator
                  <Sparkles className="w-3 h-3 text-amber-500" />
                </h4>
                <p className="text-[10px] text-slate-400 font-medium leading-none">
                  Quick Tax & Currency Tool
                </p>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setShowHistory((prev) => !prev)}
                title="Lịch sử phép tính"
                className={`p-1.5 rounded-lg text-slate-500 hover:bg-slate-200/70 transition-colors cursor-pointer ${
                  showHistory ? 'bg-blue-100 text-blue-700' : ''
                }`}
              >
                <History className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Đóng máy tính"
                className="p-1.5 rounded-lg text-slate-400 hover:bg-rose-100 hover:text-rose-700 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* --- Tab Switcher: Standard Calc vs Currency Converter --- */}
          <div className="p-2 bg-slate-50 border-b border-slate-200/80 flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setMode('currency')}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'currency'
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              <span>Chuyển Đổi Tiền (USD ⇄ VND)</span>
            </button>

            <button
              type="button"
              onClick={() => setMode('calculator')}
              className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'calculator'
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Calculator className="w-3.5 h-3.5 text-blue-600" />
              <span>Máy Tính Thuế Cơ Bản</span>
            </button>
          </div>

          {/* --- History Drawer (if toggled) --- */}
          {showHistory && (
            <div className="bg-slate-50 border-b border-slate-200 p-3 max-h-32 overflow-y-auto space-y-1 text-xs">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 pb-1 border-b border-slate-200">
                <span>Nhật ký tính toán gần đây</span>
                {historyList.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setHistoryList([])}
                    className="text-rose-600 hover:underline cursor-pointer"
                  >
                    Xóa
                  </button>
                )}
              </div>
              {historyList.length === 0 ? (
                <p className="text-[11px] text-slate-400 italic py-1">Chưa có phép tính nào.</p>
              ) : (
                historyList.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      const match = item.match(/=\s*([\d,.-]+)$/);
                      if (match && match[1]) {
                        setDisplayValue(match[1].replace(/,/g, ''));
                      }
                    }}
                    className="p-1.5 rounded-md hover:bg-slate-200 text-slate-700 font-mono text-[11px] cursor-pointer flex items-center justify-between"
                  >
                    <span>{item}</span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ──────────────────────────────────────────────────────────
              DISPLAY AREA (BRIGHT, SLEEK, DUAL CURRENCY DISPLAY)
          ────────────────────────────────────────────────────────── */}
          <div className="bg-slate-900 text-white p-4 space-y-2 relative">
            {mode === 'currency' ? (
              <div className="space-y-2.5">
                {/* Source Input Row */}
                <div className="flex items-baseline justify-between gap-2 border-b border-slate-800 pb-2">
                  <div className="text-right flex-1 overflow-x-auto scrollbar-none font-mono text-2xl font-black tracking-tight text-white">
                    {formatNumber(displayValue)}
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-blue-600/30 text-blue-400 font-black text-xs shrink-0">
                    {currencySource}
                  </span>
                </div>

                {/* Swap Row */}
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <button
                    type="button"
                    onClick={swapCurrencies}
                    title="Đổi chiều tiền tệ"
                    className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-bold px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
                  >
                    <ArrowUpDown className="w-3 h-3" />
                    <span>Đổi chiều ({currencySource === 'VND' ? 'VND → USD' : 'USD → VND'})</span>
                  </button>

                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span className="text-slate-400">1 USD =</span>
                    {isEditingRate ? (
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          value={customRateInput}
                          onChange={(e) => setCustomRateInput(e.target.value)}
                          className="w-16 h-5 px-1 rounded bg-slate-800 border border-amber-400 text-[11px] font-mono text-white text-right"
                        />
                        <button
                          type="button"
                          onClick={saveCustomRate}
                          className="text-[10px] bg-emerald-600 px-1 py-0.5 rounded text-white font-bold"
                        >
                          Lưu
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setCustomRateInput(exchangeRate.toString());
                          setIsEditingRate(true);
                        }}
                        title="Bấm để chỉnh tỷ giá"
                        className="text-amber-400 font-bold underline hover:text-amber-300 flex items-center gap-0.5"
                      >
                        <span>{exchangeRate.toLocaleString()} đ</span>
                        <Settings2 className="w-2.5 h-2.5 ml-0.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Target Result Row */}
                <div className="flex items-baseline justify-between gap-2 pt-1">
                  <div className="text-right flex-1 overflow-x-auto scrollbar-none font-mono text-3xl font-black tracking-tight text-emerald-400">
                    {formatNumber(convertedValue, currencySource === 'VND' ? 2 : 0)}
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 font-black text-sm shrink-0">
                    {currencySource === 'VND' ? 'USD' : 'VND'}
                  </span>
                </div>
              </div>
            ) : (
              /* Standard Calculator Display */
              <div className="space-y-1">
                <div className="text-right text-xs font-mono text-slate-400 h-4">
                  {previousValue != null && operation ? `${formatNumber(previousValue)} ${operation}` : ''}
                </div>
                <div className="text-right overflow-x-auto scrollbar-none font-mono text-3xl font-black tracking-tight text-white">
                  {formatNumber(displayValue)}
                </div>
              </div>
            )}

            {/* Quick Copy Result Button */}
            <button
              type="button"
              onClick={copyResult}
              className="absolute top-2 left-2 p-1.5 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[10px] font-semibold flex items-center gap-1 transition cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Đã sao chép</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* ──────────────────────────────────────────────────────────
              QUICK TAX PRESETS BAR (+5%, +10%, +15%, +30%)
          ────────────────────────────────────────────────────────── */}
          <div className="bg-slate-100/90 px-3 py-1.5 border-b border-slate-200 flex items-center justify-between gap-1 text-[11px]">
            <span className="font-bold text-slate-500 text-[10px] uppercase tracking-wider">Cộng Thuế / Phí:</span>
            <div className="flex items-center gap-1">
              {[5, 10, 15, 20].map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => applyQuickTaxRate(rate)}
                  className="px-2 py-0.5 rounded-md bg-white border border-slate-200 font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition shadow-2xs cursor-pointer"
                >
                  +{rate}%
                </button>
              ))}
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────────
              KEYPAD (ELEGANT LIGHT & ORANGE OPERATORS)
          ────────────────────────────────────────────────────────── */}
          <div className="p-3 bg-slate-50 grid grid-cols-4 gap-2">
            {/* ROW 1 */}
            <button
              type="button"
              onClick={clearAll}
              className="h-11 rounded-2xl bg-slate-200/90 hover:bg-slate-300 text-slate-900 font-extrabold text-sm transition active:scale-95 shadow-2xs cursor-pointer"
            >
              AC
            </button>
            <button
              type="button"
              onClick={deleteLastChar}
              className="h-11 rounded-2xl bg-slate-200/90 hover:bg-slate-300 text-slate-900 font-extrabold text-sm transition active:scale-95 shadow-2xs flex items-center justify-center cursor-pointer"
            >
              <Delete className="w-4 h-4 text-slate-700" />
            </button>
            <button
              type="button"
              onClick={inputPercent}
              className="h-11 rounded-2xl bg-slate-200/90 hover:bg-slate-300 text-slate-900 font-extrabold text-sm transition active:scale-95 shadow-2xs cursor-pointer"
            >
              %
            </button>
            <button
              type="button"
              onClick={() => performOperation('÷')}
              className={`h-11 rounded-2xl font-black text-lg transition active:scale-95 shadow-2xs cursor-pointer ${
                operation === '÷' && waitingForOperand
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
              }`}
            >
              ÷
            </button>

            {/* ROW 2 */}
            <button
              type="button"
              onClick={() => inputDigit('7')}
              className="h-11 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-base border border-slate-200/60 shadow-2xs transition active:scale-95 cursor-pointer"
            >
              7
            </button>
            <button
              type="button"
              onClick={() => inputDigit('8')}
              className="h-11 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-base border border-slate-200/60 shadow-2xs transition active:scale-95 cursor-pointer"
            >
              8
            </button>
            <button
              type="button"
              onClick={() => inputDigit('9')}
              className="h-11 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-base border border-slate-200/60 shadow-2xs transition active:scale-95 cursor-pointer"
            >
              9
            </button>
            <button
              type="button"
              onClick={() => performOperation('×')}
              className={`h-11 rounded-2xl font-black text-lg transition active:scale-95 shadow-2xs cursor-pointer ${
                operation === '×' && waitingForOperand
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
              }`}
            >
              ×
            </button>

            {/* ROW 3 */}
            <button
              type="button"
              onClick={() => inputDigit('4')}
              className="h-11 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-base border border-slate-200/60 shadow-2xs transition active:scale-95 cursor-pointer"
            >
              4
            </button>
            <button
              type="button"
              onClick={() => inputDigit('5')}
              className="h-11 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-base border border-slate-200/60 shadow-2xs transition active:scale-95 cursor-pointer"
            >
              5
            </button>
            <button
              type="button"
              onClick={() => inputDigit('6')}
              className="h-11 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-base border border-slate-200/60 shadow-2xs transition active:scale-95 cursor-pointer"
            >
              6
            </button>
            <button
              type="button"
              onClick={() => performOperation('-')}
              className={`h-11 rounded-2xl font-black text-lg transition active:scale-95 shadow-2xs cursor-pointer ${
                operation === '-' && waitingForOperand
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
              }`}
            >
              -
            </button>

            {/* ROW 4 */}
            <button
              type="button"
              onClick={() => inputDigit('1')}
              className="h-11 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-base border border-slate-200/60 shadow-2xs transition active:scale-95 cursor-pointer"
            >
              1
            </button>
            <button
              type="button"
              onClick={() => inputDigit('2')}
              className="h-11 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-base border border-slate-200/60 shadow-2xs transition active:scale-95 cursor-pointer"
            >
              2
            </button>
            <button
              type="button"
              onClick={() => inputDigit('3')}
              className="h-11 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-base border border-slate-200/60 shadow-2xs transition active:scale-95 cursor-pointer"
            >
              3
            </button>
            <button
              type="button"
              onClick={() => performOperation('+')}
              className={`h-11 rounded-2xl font-black text-lg transition active:scale-95 shadow-2xs cursor-pointer ${
                operation === '+' && waitingForOperand
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-500 hover:bg-amber-600 text-white'
              }`}
            >
              +
            </button>

            {/* ROW 5 */}
            <button
              type="button"
              onClick={toggleSign}
              className="h-11 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-sm border border-slate-200/60 shadow-2xs transition active:scale-95 cursor-pointer"
            >
              ±
            </button>
            <button
              type="button"
              onClick={() => inputDigit('0')}
              className="h-11 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-base border border-slate-200/60 shadow-2xs transition active:scale-95 cursor-pointer"
            >
              0
            </button>
            <button
              type="button"
              onClick={inputDecimal}
              className="h-11 rounded-2xl bg-white hover:bg-slate-100 text-slate-800 font-bold text-base border border-slate-200/60 shadow-2xs transition active:scale-95 cursor-pointer"
            >
              .
            </button>
            <button
              type="button"
              onClick={handleEquals}
              className="h-11 rounded-2xl bg-[#092c5c] hover:bg-[#072247] text-white font-black text-xl transition active:scale-95 shadow-md cursor-pointer"
            >
              =
            </button>
          </div>
        </div>
      )}
    </>
  );
}
