'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Activity,
  AlertTriangle,
  Ban,
  CheckCircle2,
  Clock,
  Copy,
  Download,
  Globe,
  HardDrive,
  Laptop,
  Monitor,
  RefreshCw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Trash2,
  Unlock,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { RegisteredDevice } from '@/lib/telemetry/device-store';

export function DevicesManager() {
  const [devices, setDevices] = useState<RegisteredDevice[]>([]);
  const [stats, setStats] = useState({
    totalDevices: 0,
    onlineDesktop: 0,
    onlineWeb: 0,
    revokedCount: 0,
  });
  const [search, setSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchDevices = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search) query.set('search', search);
      if (platformFilter !== 'all') query.set('platform', platformFilter);
      if (statusFilter !== 'all') query.set('status', statusFilter);

      const res = await fetch(`/api/admin/devices?${query.toString()}`);
      if (res.ok) {
        const data = (await res.json()) as any;
        setDevices(data?.devices || []);
        setStats(
          data?.stats || {
            totalDevices: 0,
            onlineDesktop: 0,
            onlineWeb: 0,
            revokedCount: 0,
          }
        );
      }
    } catch (err) {
      console.error('Failed to load device telemetry:', err);
    } finally {
      setLoading(false);
    }
  }, [search, platformFilter, statusFilter]);

  useEffect(() => {
    fetchDevices();
    const interval = setInterval(fetchDevices, 15000); // Polling every 15s
    return () => clearInterval(interval);
  }, [fetchDevices]);

  const handleDeviceAction = async (deviceId: string, action: 'revoke' | 'unrevoke' | 'delete') => {
    setActionLoading(deviceId);
    try {
      const res = await fetch('/api/admin/devices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, deviceId }),
      });
      if (res.ok) {
        await fetchDevices();
      }
    } catch (err) {
      console.error('Device action failed:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const copyDeviceId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold mb-2">
            <Laptop className="w-3.5 h-3.5 text-blue-600" />
            <span>Telemetry & Machine Surveillance</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Active Devices & Windows PC Telemetry
          </h1>
          <p className="text-xs text-slate-600 mt-1">
            Giám sát thời gian thực các máy tính cài đặt bản Desktop .exe và phiên Web SaaS đang kết nối hệ thống CRM EMLY.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchDevices()}
            disabled={loading}
            className="text-xs font-bold gap-1.5 h-10 px-4 border-slate-300 bg-white hover:bg-slate-50 cursor-pointer shadow-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-blue-600' : ''}`} />
            {loading ? 'Đang cập nhật...' : 'Làm mới Telemetry'}
          </Button>
        </div>
      </div>

      {/* 2. KPI METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Devices */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tổng Thiết Bị Đã Đăng Ký
            </span>
            <div className="text-3xl font-black text-slate-900 mt-1.5">{stats.totalDevices}</div>
            <span className="text-[11px] text-slate-500 font-semibold">Tất cả máy tính & trình duyệt</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
            <Monitor className="w-6 h-6" />
          </div>
        </div>

        {/* Windows .exe Apps Online */}
        <div className="bg-white p-5 rounded-2xl border border-blue-200 bg-blue-50/20 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Máy Tính .EXE Online
            </span>
            <div className="text-3xl font-black text-blue-950 mt-1.5">{stats.onlineDesktop}</div>
            <span className="text-[11px] text-blue-700 font-semibold">Bản cài đặt Windows Desktop</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <Laptop className="w-6 h-6" />
          </div>
        </div>

        {/* Web SaaS Online */}
        <div className="bg-white p-5 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Web SaaS Sessions
            </span>
            <div className="text-3xl font-black text-emerald-950 mt-1.5">{stats.onlineWeb}</div>
            <span className="text-[11px] text-emerald-700 font-semibold">Trình duyệt Web Browser</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <Globe className="w-6 h-6" />
          </div>
        </div>

        {/* Revoked / Blocked Machines */}
        <div className="bg-white p-5 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-rose-900 uppercase tracking-wider">
              Máy Bị Ngắt Kết Nối
            </span>
            <div className="text-3xl font-black text-rose-950 mt-1.5">{stats.revokedCount}</div>
            <span className="text-[11px] text-rose-700 font-semibold">Đã khóa truy cập từ xa</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
            <Ban className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 3. FILTER BAR */}
      <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Tìm theo email, tên máy tính, IP, Hardware UUID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Platform Filter */}
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="h-10 px-3 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white cursor-pointer"
          >
            <option value="all">Tất cả nền tảng</option>
            <option value="desktop_exe">🖥️ Windows App (.exe)</option>
            <option value="web_browser">🌐 Web Browser (SaaS)</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 bg-white cursor-pointer"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="online">🟢 Đang Online</option>
            <option value="idle">🟡 Tạm nghỉ (Idle)</option>
            <option value="offline">⚪ Đã Offline</option>
          </select>
        </div>
      </div>

      {/* 4. DEVICES TELEMETRY TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Tài Khoản Sử Dụng</th>
                <th className="py-3.5 px-3">Loại Ứng Dụng</th>
                <th className="py-3.5 px-3">Thông Tin Máy & Hệ Điều Hành</th>
                <th className="py-3.5 px-3">Địa Chỉ IP & Vị Trí</th>
                <th className="py-3.5 px-3">Hoạt Động Gần Nhất</th>
                <th className="py-3.5 px-3">Trạng Thái</th>
                <th className="py-3.5 px-4 text-right">Quản Trị Từ Xa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {devices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                    Không tìm thấy thiết bị hoặc máy tính nào khớp với bộ lọc.
                  </td>
                </tr>
              ) : (
                devices.map((device) => {
                  const isExe = device.platform === 'desktop_exe';
                  const isOnline = device.status === 'online' && !device.isRevoked;

                  return (
                    <tr
                      key={device.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        device.isRevoked ? 'bg-rose-50/30' : ''
                      }`}
                    >
                      {/* User Column */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900">{device.userName}</div>
                        <div className="text-slate-500 font-mono text-[11px]">{device.userEmail}</div>
                        <div className="flex items-center gap-1 mt-1">
                          <span className="text-[10px] text-slate-400 font-mono">
                            UUID: {device.deviceId.slice(0, 16)}...
                          </span>
                          <button
                            type="button"
                            onClick={() => copyDeviceId(device.deviceId)}
                            className="text-slate-400 hover:text-slate-700 cursor-pointer"
                            title="Copy Device ID"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          {copiedId === device.deviceId && (
                            <span className="text-[10px] text-emerald-600 font-bold">Copied!</span>
                          )}
                        </div>
                      </td>

                      {/* App Platform */}
                      <td className="py-3.5 px-3">
                        {isExe ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-900 border border-blue-200 font-extrabold text-[11px]">
                            <Laptop className="w-3.5 h-3.5 text-blue-600" />
                            Windows .EXE
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-200 font-extrabold text-[11px]">
                            <Globe className="w-3.5 h-3.5 text-emerald-600" />
                            Web SaaS
                          </span>
                        )}
                        <div className="text-[10px] text-slate-400 mt-1 font-semibold">
                          {device.appVersion}
                        </div>
                      </td>

                      {/* Machine & OS Specs */}
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-900 flex items-center gap-1">
                          <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                          {device.deviceName}
                        </div>
                        <div className="text-slate-500 text-[11px] mt-0.5">{device.os}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          Res: {device.screenResolution} · {device.timeZone.split('/')[1] || device.timeZone}
                        </div>
                      </td>

                      {/* IP & Location */}
                      <td className="py-3.5 px-3">
                        <div className="font-mono font-bold text-blue-700">{device.ipAddress}</div>
                        <div className="text-[11px] text-slate-500">{device.location}</div>
                      </td>

                      {/* Last Active */}
                      <td className="py-3.5 px-3 font-mono text-[11px] text-slate-600">
                        <div className="flex items-center gap-1 font-semibold">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {new Date(device.lastActive).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                          })}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(device.lastActive).toLocaleDateString()}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-3">
                        {device.isRevoked ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            <Ban className="w-3 h-3" />
                            Revoked
                          </span>
                        ) : isOnline ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                            Online
                          </span>
                        ) : device.status === 'idle' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
                            Idle
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                            Offline
                          </span>
                        )}
                      </td>

                      {/* Remote Action Controls */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {device.isRevoked ? (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={actionLoading === device.deviceId}
                              onClick={() => handleDeviceAction(device.deviceId, 'unrevoke')}
                              className="h-7 px-2.5 text-[11px] font-bold text-emerald-700 border-emerald-300 hover:bg-emerald-50 cursor-pointer"
                            >
                              <Unlock className="w-3 h-3 mr-1" />
                              Mở khóa
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={actionLoading === device.deviceId}
                              onClick={() => handleDeviceAction(device.deviceId, 'revoke')}
                              className="h-7 px-2.5 text-[11px] font-bold text-rose-700 border-rose-300 hover:bg-rose-50 cursor-pointer"
                            >
                              <Ban className="w-3 h-3 mr-1" />
                              Ngắt máy
                            </Button>
                          )}

                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={actionLoading === device.deviceId}
                            onClick={() => handleDeviceAction(device.deviceId, 'delete')}
                            className="h-7 w-7 p-0 text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                            title="Xóa máy khỏi danh sách"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
