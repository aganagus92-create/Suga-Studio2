import React, { useState } from 'react';
import { Menu, Bell, Sparkles, Check, Trash2 } from 'lucide-react';
import { User, SystemNotification, ActiveView } from '../types';

interface HeaderProps {
  title: string;
  subtitle: string;
  currentUser: User | null;
  credits: number;
  notifications?: SystemNotification[];
  onClearNotifications: () => void;
  onOpenTopUp: () => void;
  onToggleMobileSidebar: () => void;
  onNavigateSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  currentUser,
  credits,
  notifications = [],
  onClearNotifications,
  onOpenTopUp,
  onToggleMobileSidebar,
  onNavigateSettings
}) => {
  const [showNotifs, setShowNotifs] = useState(false);
  const safeNotifications = Array.isArray(notifications) ? notifications : [];
  const unreadCount = safeNotifications.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-30 bg-[#0B1120]/90 backdrop-blur-md border-b border-slate-800/90 px-4 sm:px-6 py-3 flex items-center justify-between">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center space-x-3">
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          className="md:hidden p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white transition-colors"
          aria-label="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-sm sm:text-base font-bold text-white flex items-center gap-2 font-heading">
            {title}
          </h1>
          <p className="text-[11px] text-slate-400 hidden sm:block">{subtitle}</p>
        </div>
      </div>

      {/* Right: Controls & Profile */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        
        {/* Notification Bell */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifs(!showNotifs)}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white relative transition-colors cursor-pointer"
            aria-label="Notifikasi"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
            )}
          </button>

          {showNotifs && (
            <div className="absolute right-0 mt-2 w-80 p-3.5 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 space-y-2.5 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white">Notifikasi Sistem</span>
                {safeNotifications.length > 0 && (
                  <button
                    type="button"
                    onClick={onClearNotifications}
                    className="text-[10px] text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3 h-3" />
                    <span>Tandai Dibaca</span>
                  </button>
                )}
              </div>

              <div className="space-y-1.5 max-h-60 overflow-y-auto custom-scrollbar">
                {safeNotifications.length === 0 ? (
                  <p className="text-center py-4 text-xs text-slate-500">Tidak ada notifikasi baru</p>
                ) : (
                  safeNotifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-xl border text-xs space-y-1 transition-colors ${
                        n.unread
                          ? 'bg-purple-950/30 border-purple-800/40 text-slate-200'
                          : 'bg-slate-800/50 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-[11px]">{n.title}</span>
                        <span className="text-[9px] text-slate-500">{n.time}</span>
                      </div>
                      <p className="text-[10px] text-slate-300 leading-snug">{n.desc}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Live Credit Indicator Button */}
        <button
          type="button"
          onClick={onOpenTopUp}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-purple-900/30 border border-purple-700/50 hover:border-purple-500 transition-all shadow-sm group cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-400 group-hover:rotate-12 transition-transform" />
          <span className="text-xs font-bold text-purple-200 font-mono">
            {credits.toLocaleString('id-ID')} Credits
          </span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-600 group-hover:bg-purple-500 text-white font-bold uppercase tracking-wider">
            + Top Up
          </span>
        </button>

        {/* User Info */}
        <div
          onClick={onNavigateSettings}
          className="flex items-center space-x-2 pl-2 border-l border-slate-800 cursor-pointer group"
          title="Pengaturan Akun"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 text-white flex items-center justify-center font-bold text-xs shadow-md group-hover:ring-2 group-hover:ring-purple-400 transition-all">
            {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="hidden lg:block text-left">
            <p className="text-xs font-bold text-slate-200 truncate max-w-[120px]">
              {currentUser?.name || 'Pengguna'}
            </p>
            <p className="text-[10px] text-pink-400 font-mono font-bold">
              {currentUser?.role === 'SUPER_ADMIN' ? 'SUPER ADMIN' : 'PENGGUNA'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
