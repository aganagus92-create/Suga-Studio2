import React from 'react';
import { History, Trash2, Clock, Sparkles } from 'lucide-react';
import { HistoryItem } from '../../types';

interface RiwayatGenerasiProps {
  history?: HistoryItem[];
  onClearHistory?: () => void;
  onShowToast?: (msg: string) => void;
}

export const RiwayatGenerasi: React.FC<RiwayatGenerasiProps> = ({
  history = [],
  onClearHistory = () => {},
  onShowToast = () => {}
}) => {
  const safeHistory = Array.isArray(history) ? history : [];

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <History className="w-4 h-4 text-slate-300" />
              <span>Riwayat Generasi Prompt & Konten</span>
            </h3>
            <p className="text-xs text-slate-400">
              Daftar seluruh kreasi gambar, naskah storyboard, dan audio yang telah Anda buat
            </p>
          </div>
          {safeHistory.length > 0 && (
            <button
              type="button"
              onClick={onClearHistory}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Bersihkan Riwayat</span>
            </button>
          )}
        </div>

        <div className="space-y-2.5">
          {safeHistory.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <History className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-xs">Belum ada riwayat pembuatan konten.</p>
            </div>
          ) : (
            safeHistory.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex items-center justify-between text-xs hover:bg-slate-800 transition-colors shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white block text-[13px]">{item.title}</span>
                    <span className="text-[11px] text-purple-400 font-mono">{item.type}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1.5 text-slate-400 font-mono text-[10px]">
                  <Clock className="w-3 h-3" />
                  <span>{item.date}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
