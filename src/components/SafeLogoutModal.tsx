import React from 'react';
import { LogOut, ShieldCheck, X } from 'lucide-react';
import { User } from '../types';

interface SafeLogoutModalProps {
  isOpen: boolean;
  user: User | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const SafeLogoutModal: React.FC<SafeLogoutModalProps> = ({
  isOpen,
  user,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  return (
    <div
      id="modal-safe-logout"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 space-y-5 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-400 mx-auto flex items-center justify-center shadow-lg">
            <LogOut className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white font-heading">
            Konfirmasi Logout Aman
          </h3>
          <p className="text-xs text-slate-400">
            Apakah Anda yakin ingin mengakhiri sesi kerja sebagai{' '}
            <span className="font-semibold text-white">{user?.name}</span>?
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 space-y-1.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Peran Akun:</span>
            <span
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                isSuperAdmin
                  ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                  : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
              }`}
            >
              {isSuperAdmin ? 'SUPER ADMIN' : 'PENGGUNA'}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Status Keamanan:</span>
            <span className="text-emerald-400 flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3 h-3" /> Terenkripsi
            </span>
          </div>
          <p className="text-[10px] text-slate-400 pt-1 leading-snug">
            Sesi dan token lokal akan dibersihkan secara aman sebelum kembali ke halaman login.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer shadow-lg shadow-rose-600/30"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Ya, Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};
