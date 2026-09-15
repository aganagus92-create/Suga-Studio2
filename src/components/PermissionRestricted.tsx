import React from 'react';
import { Lock, ArrowLeft, ShieldAlert, Sparkles } from 'lucide-react';

interface PermissionRestrictedProps {
  featureName?: string;
  onBackToHome: () => void;
}

export const PermissionRestricted: React.FC<PermissionRestrictedProps> = ({
  featureName = 'Fitur Ini',
  onBackToHome
}) => {
  return (
    <div className="min-h-[500px] flex items-center justify-center p-4">
      <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900/80 border border-slate-800 text-center space-y-5 shadow-2xl backdrop-blur-xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mx-auto flex items-center justify-center shadow-lg">
          <Lock className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
            Izin Akses Dibatasi
          </span>
          <h2 className="text-xl font-bold text-white font-heading">
            Akses ke {featureName} Belum Diizinkan
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Super Administrator sistem telah mengatur hak akses (permission) untuk peran{' '}
            <strong className="text-slate-200">Pengguna</strong> pada modul ini. Silakan hubungi Super Admin untuk mengaktifkan izin modul Anda.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-300 flex items-center gap-2.5 text-left">
          <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            Sistem menjalankan proteksi Role-Based Access Control (RBAC) granular secara ketat.
          </span>
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onBackToHome}
            className="w-full py-3 rounded-xl suga-gradient-btn text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-lg cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Dashboard Kreator</span>
          </button>
        </div>
      </div>
    </div>
  );
};
