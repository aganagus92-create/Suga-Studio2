import React from 'react';
import { Gift, Copy, Check, Users, DollarSign } from 'lucide-react';

interface ProgramReferralProps {
  onShowToast: (msg: string) => void;
}

export const ProgramReferral: React.FC<ProgramReferralProps> = ({ onShowToast }) => {
  const referralLink = 'https://suga.ai/register?ref=SUGA46C3';
  const referralCode = 'SUGA46C3';

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    onShowToast(`${label} berhasil disalin ke clipboard!`);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6 shadow-xl">
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-heading">Program Referral SUGA Creator</h3>
            <p className="text-xs text-slate-400">
              Ajak sesama kreator bergabung dan dapatkan komisi 5% kredit gratis dari setiap pembelian paket mereka
            </p>
          </div>
        </div>

        {/* Link box */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-inner">
          <div className="w-full truncate text-xs font-mono text-purple-300 select-all">
            {referralLink}
          </div>
          <button
            type="button"
            onClick={() => handleCopy(referralLink, 'Link Referral')}
            className="px-5 py-2.5 rounded-xl suga-gradient-btn text-white text-xs font-bold shrink-0 flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Salin Link</span>
          </button>
        </div>

        {/* Code Box */}
        <div className="flex items-center space-x-3 text-xs">
          <span className="text-slate-400">Atau bagikan kode referral langsung:</span>
          <span className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-white font-mono font-bold border border-slate-700 tracking-wider">
            {referralCode}
          </span>
          <button
            type="button"
            onClick={() => handleCopy(referralCode, 'Kode Referral')}
            className="text-purple-400 hover:text-purple-300 font-semibold cursor-pointer underline"
          >
            Salin Kode
          </button>
        </div>

        {/* 3 Step Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1.5 text-xs">
            <span className="w-6 h-6 rounded-full bg-purple-600/30 text-purple-300 font-bold flex items-center justify-center text-[10px]">
              1
            </span>
            <p className="font-bold text-white">Bagikan Link</p>
            <p className="text-slate-400 text-[11px]">Kirimkan link atau kode referral ke teman / komunitas Anda.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1.5 text-xs">
            <span className="w-6 h-6 rounded-full bg-purple-600/30 text-purple-300 font-bold flex items-center justify-center text-[10px]">
              2
            </span>
            <p className="font-bold text-white">Teman Daftar</p>
            <p className="text-slate-400 text-[11px]">Teman Anda mendaftar dan mencoba fitur studio AI kami.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-1.5 text-xs">
            <span className="w-6 h-6 rounded-full bg-purple-600/30 text-purple-300 font-bold flex items-center justify-center text-[10px]">
              3
            </span>
            <p className="font-bold text-white">Raih Komisi</p>
            <p className="text-slate-400 text-[11px]">Dapatkan bonus kredit instan 5% dari setiap transaksi topup mereka.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
