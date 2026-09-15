import React, { useState } from 'react';
import { Users, UserCheck, ShieldAlert, Cpu, TrendingUp, Sparkles, Activity, FileCode2, Key } from 'lucide-react';
import { User, AuditLog } from '../../types';

interface AdminDashboardProps {
  users?: User[];
  auditLogs?: AuditLog[];
  onNavigateUsers?: () => void;
  onNavigateLogs?: () => void;
  onNavigateContent?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  users = [],
  auditLogs = [],
  onNavigateUsers = () => {},
  onNavigateLogs = () => {},
  onNavigateContent = () => {}
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'2026' | '2025'>('2026');

  const safeUsers = Array.isArray(users) ? users : [];
  const safeLogs = Array.isArray(auditLogs) ? auditLogs : [];

  const totalUsers = safeUsers.length;
  const activeUsers = safeUsers.filter((u) => u.status === 'ACTIVE').length;
  const totalLogs = safeLogs.length;

  const chartData = [
    { month: 'Jan', val: 12 },
    { month: 'Feb', val: 19 },
    { month: 'Mar', val: 28 },
    { month: 'Apr', val: 35 },
    { month: 'Mei', val: 52 },
    { month: 'Jun', val: 68 }
  ];

  const maxVal = Math.max(...chartData.map((d) => d.val));

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={onNavigateUsers}
          className="p-5 rounded-3xl bg-slate-900/80 border border-purple-800/40 hover:border-purple-600 transition-all cursor-pointer space-y-2 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-purple-400 tracking-wider">Total Pengguna</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-white font-heading">{totalUsers}</h3>
          <p className="text-[10px] text-slate-400">Akun terdaftar di sistem</p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/80 border border-emerald-800/40 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Pengguna Aktif</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-white font-heading">{activeUsers}</h3>
          <p className="text-[10px] text-slate-400">Status operasional ACTIVE</p>
        </div>

        <div
          onClick={onNavigateLogs}
          className="p-5 rounded-3xl bg-slate-900/80 border border-sky-800/40 hover:border-sky-600 transition-all cursor-pointer space-y-2 shadow-lg"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">Audit Logs Hari Ini</span>
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-3xl font-black text-white font-heading">{totalLogs}</h3>
          <p className="text-[10px] text-slate-400">Entri log tercatat</p>
        </div>

        <div className="p-5 rounded-3xl bg-slate-900/80 border border-pink-800/40 space-y-2 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-pink-400 tracking-wider">Status Server</span>
            <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-300 flex items-center justify-center">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-3xl font-black text-emerald-400 font-heading">ONLINE</h3>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          </div>
          <p className="text-[10px] text-slate-400 font-mono">Latensi 24ms • Uptime 99.98%</p>
        </div>
      </div>

      {/* Quick Action Hub for Super Admin */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={onNavigateUsers}
          className="p-4 rounded-2xl bg-purple-950/40 border border-purple-800/40 hover:border-purple-600 transition-all flex items-center gap-3 text-left group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-600/30 text-purple-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white group-hover:text-purple-300 transition-colors">Kelola Pengguna</h4>
            <p className="text-[11px] text-slate-400">Tambah, edit, status, dan role</p>
          </div>
        </button>

        <button
          type="button"
          onClick={onNavigateContent}
          className="p-4 rounded-2xl bg-pink-950/40 border border-pink-800/40 hover:border-pink-600 transition-all flex items-center gap-3 text-left group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-pink-600/30 text-pink-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <FileCode2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white group-hover:text-pink-300 transition-colors">Kelola Konten & Data</h4>
            <p className="text-[11px] text-slate-400">Banner Home, tutorial, dan paket</p>
          </div>
        </button>

        <button
          type="button"
          onClick={onNavigateLogs}
          className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 hover:border-emerald-600 transition-all flex items-center gap-3 text-left group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-600/30 text-emerald-300 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition-colors">Log Aktivitas Sistem</h4>
            <p className="text-[11px] text-slate-400">Jejak audit dan aktivitas user</p>
          </div>
        </button>
      </div>

      {/* SVG Interactive Growth Chart */}
      <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-5 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="space-y-0.5">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-pink-400" />
              <span>Pertumbuhan Generasi AI Suga Studio (Ribuan Generasi)</span>
            </h4>
            <p className="text-[11px] text-slate-400">Total volume prompt visual, video, TTS, dan naskah yang berhasil diproses</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setSelectedPeriod('2026')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedPeriod === '2026' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              2026
            </button>
            <button
              type="button"
              onClick={() => setSelectedPeriod('2025')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedPeriod === '2025' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
              }`}
            >
              2025
            </button>
          </div>
        </div>

        {/* Bar & Line Visualizer */}
        <div className="pt-2">
          <div className="h-56 flex items-end justify-between gap-3 sm:gap-6 px-2">
            {chartData.map((d, i) => {
              const heightPercent = Math.round((d.val / maxVal) * 100);
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-2 group relative">
                  {/* Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 px-2 py-1 rounded-md bg-slate-800 text-purple-300 text-[10px] font-mono font-bold shadow-lg pointer-events-none whitespace-nowrap">
                    {d.val}k generasi
                  </div>

                  <div className="w-full bg-slate-800/80 rounded-xl overflow-hidden h-44 flex items-end p-1">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full rounded-lg bg-gradient-to-t from-purple-700 via-violet-600 to-pink-500 group-hover:from-purple-600 group-hover:to-pink-400 transition-all duration-300 shadow-md shadow-purple-900/30"
                    />
                  </div>
                  <span className="text-xs font-semibold text-slate-400 group-hover:text-white transition-colors">
                    {d.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent System Activity Stream */}
      <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Aktivitas Sistem Terkini (Real-Time Feed)</span>
          </h4>
          <button
            type="button"
            onClick={onNavigateLogs}
            className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
          >
            Lihat Semua Log →
          </button>
        </div>

        <div className="space-y-2">
          {safeLogs.slice(0, 4).map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-2xl bg-slate-800/50 border border-slate-800/80 flex items-center justify-between text-xs hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <div>
                  <span className="font-bold text-white">{log.user}</span>
                  <span className="text-slate-400 ml-2 font-mono text-[11px]">{log.action}</span>
                </div>
              </div>
              <div className="flex items-center space-x-3 text-slate-400 font-mono text-[10px]">
                <span>IP: {log.ip}</span>
                <span>{log.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
