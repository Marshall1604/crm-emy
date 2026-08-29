'use client';

import React, { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/theme/theme-context';
import { useLanguage } from '@/lib/i18n/language-context';

export function ThemeSwitcher({ className = '' }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-9 h-9 rounded-lg border border-slate-200 bg-white/80 dark:bg-slate-800/80 ${className}`} />
    );
  }

  const isDark = theme === 'dark';
  const label = isDark
    ? language === 'vi' ? 'Giao diện Tối' : 'Dark Mode'
    : language === 'vi' ? 'Giao diện Sáng' : 'Light Mode';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={label}
      aria-label={label}
      className={`relative inline-flex items-center justify-center w-9 h-9 rounded-lg border transition-all duration-200 cursor-pointer shadow-xs ${
        isDark
          ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-750 hover:border-slate-600 hover:text-amber-300'
          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900'
      } ${className}`}
    >
      {isDark ? (
        <Moon className="w-4 h-4 transition-transform duration-200 rotate-0 scale-100 text-amber-300" />
      ) : (
        <Sun className="w-4 h-4 transition-transform duration-200 rotate-0 scale-100 text-amber-500" />
      )}
    </button>
  );
}
