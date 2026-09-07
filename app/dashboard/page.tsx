'use client';

import dynamic from 'next/dynamic';

const DashboardView = dynamic(
  () => import('@/features/dashboard/dashboard-view').then((m) => m.DashboardView),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3.5">
          <div className="w-9 h-9 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-bold text-slate-500 tracking-wide">Đang khởi tạo Tax Practice Dashboard...</p>
        </div>
      </div>
    ),
  }
);

export default function Page() {
  return <DashboardView />;
}
