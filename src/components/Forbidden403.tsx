import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';

interface Forbidden403Props {
  onBackToHome: () => void;
}

export const Forbidden403: React.FC<Forbidden403Props> = ({ onBackToHome }) => {
  return (
    <section className="py-20 text-center space-y-4 max-w-md mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto shadow-lg shadow-rose-950/30">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-black text-white font-heading">403 — Akses Ditolak</h2>
      <p className="text-xs text-slate-400 leading-relaxed">
        Halaman ini dilindungi dan hanya dapat diakses oleh pemegang peran{' '}
        <strong className="text-pink-400 font-mono">SUPER ADMIN</strong>. Akun Anda saat ini terdaftar sebagai Pengguna biasa.
      </p>
      <button
        type="button"
        onClick={onBackToHome}
        className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl suga-gradient-btn text-white text-xs font-bold cursor-pointer shadow-lg"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Dashboard Kreator</span>
      </button>
    </section>
  );
};
