import React from 'react';
import { Download, FileText, Shield, CreditCard, CheckCircle2 } from 'lucide-react';

interface AdminReportsProps {
  onExportUsers?: () => void;
  onExportLogs?: () => void;
  onExportBilling?: () => void;
}

export const AdminReports: React.FC<AdminReportsProps> = ({
  onExportUsers = () => {},
  onExportLogs = () => {},
  onExportBilling = () => {}
}) => {
  return (
    <div className="space-y-4">
      <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-5 shadow-xl">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
            <FileText className="w-4 h-4 text-sky-400" />
            <span>Laporan & Ekspor Data Sistem</span>
          </h3>
          <p className="text-xs text-slate-400">
            Unduh rekapitulasi data pengguna, audit keamanan server, dan mutasi top-up kredit
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Users Report */}
          <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white">Laporan Pengguna Lengkap</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Rekap seluruh akun, saldo kredit, status keaktifan, dan tanggal registrasi format CSV.
              </p>
            </div>
            <button
              type="button"
              onClick={onExportUsers}
              className="w-full py-2.5 rounded-xl suga-gradient-btn text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-md cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh CSV Pengguna</span>
            </button>
          </div>

          {/* Audit Logs */}
          <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white">Audit Log Keamanan</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Rekaman jejak aktivitas server, perubahan izin, otentikasi login, dan IP address.
              </p>
            </div>
            <button
              type="button"
              onClick={onExportLogs}
              className="w-full py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh TXT Audit</span>
            </button>
          </div>

          {/* Billing Mutations */}
          <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center">
                <CreditCard className="w-4 h-4" />
              </div>
              <h4 className="text-xs font-bold text-white">Laporan Mutasi Billing</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Riwayat transaksi QRIS Pakasir pengguna yang terverifikasi dan riwayat kredit masuk.
              </p>
            </div>
            <button
              type="button"
              onClick={onExportBilling}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh CSV Billing</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
