import React, { useState } from 'react';
import {
  Search,
  Download,
  Trash2,
  Activity,
  UserCheck,
  Filter,
  ArrowUpDown,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { AuditLog, User } from '../../types';

interface AdminLogsProps {
  auditLogs?: AuditLog[];
  users?: User[];
  onClearLogs?: () => void;
  onExportTXT?: () => void;
}

export const AdminLogs: React.FC<AdminLogsProps> = ({
  auditLogs = [],
  users = [],
  onClearLogs = () => {},
  onExportTXT = () => {}
}) => {
  const [activeTab, setActiveTab] = useState<'system' | 'user-activity'>('system');
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('ALL');
  const [selectedUserFilter, setSelectedUserFilter] = useState<string>('ALL');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const safeLogs = Array.isArray(auditLogs) ? auditLogs : [];

  // Filter logs
  const filteredLogs = safeLogs
    .filter((log) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        log.action.toLowerCase().includes(q) ||
        log.user.toLowerCase().includes(q) ||
        log.ip.includes(q);

      const matchesLevel = levelFilter === 'ALL' || log.level === levelFilter;
      const matchesUser =
        selectedUserFilter === 'ALL' ||
        log.user.toLowerCase() === selectedUserFilter.toLowerCase();

      return matchesSearch && matchesLevel && matchesUser;
    })
    .sort((a, b) => {
      if (sortOrder === 'newest') {
        return b.time.localeCompare(a.time);
      }
      return a.time.localeCompare(b.time);
    });

  // Unique users found in logs or users list
  const allUserEmails = Array.from(
    new Set([
      ...users.map((u) => u.email),
      ...safeLogs.map((l) => l.user)
    ])
  );

  return (
    <div className="space-y-4">
      <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4 shadow-xl">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Log & Aktivitas Sistem (Audit Trail)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Pantau rekam jejak aktivitas sistem global dan audit riwayat interaksi pengguna secara real-time
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onExportTXT}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor TXT</span>
            </button>
            <button
              type="button"
              onClick={onClearLogs}
              className="px-3.5 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 hover:text-rose-200 text-xs font-bold border border-rose-800/40 flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Bersihkan Log</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={() => {
              setActiveTab('system');
              setSelectedUserFilter('ALL');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'system'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Semua Log Aktivitas Sistem ({safeLogs.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('user-activity')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'user-activity'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Daftar Aktivitas Pengguna Spesifik</span>
          </button>
        </div>

        {/* Filter and Search Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative sm:col-span-2">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari aksi, user email, atau IP address..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* User Filter (shown prominent in user-activity or available in all) */}
          <select
            value={selectedUserFilter}
            onChange={(e) => setSelectedUserFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="ALL">Semua Akun Pengguna</option>
            {allUserEmails.map((email) => (
              <option key={email} value={email}>
                {email}
              </option>
            ))}
          </select>

          {/* Level Filter or Sort */}
          <div className="flex gap-2">
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-1/2 px-2.5 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="ALL">Semua Level</option>
              <option value="INFO">INFO</option>
              <option value="WARNING">WARNING</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
              className="w-1/2 px-2.5 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="newest">Waktu Terbaru</option>
              <option value="oldest">Waktu Terlama</option>
            </select>
          </div>
        </div>

        {/* User Activity Summary Card if viewing specific user */}
        {activeTab === 'user-activity' && selectedUserFilter !== 'ALL' && (
          <div className="p-3.5 rounded-2xl bg-purple-950/30 border border-purple-800/50 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-600/30 text-purple-300 flex items-center justify-center font-bold">
                {selectedUserFilter.charAt(0).toUpperCase()}
              </div>
              <div>
                <span className="font-bold text-white block">Riwayat Aktivitas: {selectedUserFilter}</span>
                <span className="text-[11px] text-slate-400">
                  Total tercatat {filteredLogs.length} aktivitas dalam sesi server ini.
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setSelectedUserFilter('ALL')}
              className="text-pink-400 hover:text-pink-300 font-bold text-[11px]"
            >
              Tampilkan Semua User
            </button>
          </div>
        )}

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Waktu Eksekusi</th>
                <th className="p-3.5">Identitas Pengguna</th>
                <th className="p-3.5">Aksi Sistem / Interaksi</th>
                <th className="p-3.5">Tingkat (Level)</th>
                <th className="p-3.5">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400">
                    Tidak ada catatan aktivitas yang cocok dengan filter yang dipilih.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3.5 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                      {log.time}
                    </td>
                    <td className="p-3.5 font-bold text-white">
                      <button
                        type="button"
                        onClick={() => setSelectedUserFilter(log.user)}
                        className="hover:text-purple-300 hover:underline text-left cursor-pointer"
                        title="Filter hanya aktivitas user ini"
                      >
                        {log.user}
                      </button>
                    </td>
                    <td className="p-3.5 font-mono text-purple-300 text-[11px]">{log.action}</td>
                    <td className="p-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          log.level === 'WARNING'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : log.level === 'CRITICAL'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                        }`}
                      >
                        {log.level}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-400 text-[11px]">{log.ip}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
