import React from 'react';
import {
  AlertTriangle,
  KeyRound,
  RefreshCw,
  Sliders,
  Settings,
  X,
  ShieldAlert,
  ExternalLink
} from 'lucide-react';
import { GenerationError } from '../../types/provider';

interface GenerationErrorModalProps {
  error: GenerationError | null;
  isOpen: boolean;
  onClose: () => void;
  onRetry?: () => void;
  onChangeModel?: () => void;
  onOpenSettings?: () => void;
}

export const GenerationErrorModal: React.FC<GenerationErrorModalProps> = ({
  error,
  isOpen,
  onClose,
  onRetry,
  onChangeModel,
  onOpenSettings
}) => {
  if (!isOpen || !error) return null;

  const isNotConfigured = error.code === 'NOT_CONFIGURED';
  const isInvalidKey = error.code === 'INVALID_KEY';
  const isTimeout = error.code === 'TIMEOUT';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md rounded-2xl bg-[#080e1d] border border-red-500/30 p-6 shadow-2xl shadow-red-950/40 text-slate-100">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon & Title */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
              isNotConfigured || isInvalidKey
                ? 'bg-amber-950/40 border-amber-500/40 text-amber-400'
                : 'bg-red-950/40 border-red-500/40 text-red-400'
            }`}
          >
            {isNotConfigured || isInvalidKey ? (
              <KeyRound className="w-6 h-6" />
            ) : isTimeout ? (
              <ShieldAlert className="w-6 h-6" />
            ) : (
              <AlertTriangle className="w-6 h-6" />
            )}
          </div>

          <div className="min-w-0 pr-6">
            <h3 className="text-base font-bold text-white tracking-tight font-heading">
              {error.title || (isNotConfigured ? 'API Key Belum Dikonfigurasi' : 'Generation Failed')}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Provider: <span className="text-slate-200 font-semibold">{error.providerName}</span> ({error.modelId})
            </p>
          </div>
        </div>

        {/* Detail Message Box */}
        <div className="p-3.5 rounded-xl bg-[#0c162b] border border-slate-800 text-xs text-slate-300 leading-relaxed mb-6 space-y-2">
          <p>{error.detail}</p>
          {isNotConfigured && (
            <p className="text-[11px] text-amber-300/90 font-medium">
              Aplikasi ini menggunakan integrasi resmi dan tidak menggunakan hasil gambar tiruan atau API palsu. Anda perlu memasukkan API Key resmi untuk melakukan render.
            </p>
          )}
          {isTimeout && (
            <p className="text-[11px] text-slate-400">
              Server provider sedang mengalami gangguan atau beban tinggi. Anda dapat mencoba lagi atau beralih ke model lain.
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          {error.requiresSettings ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenSettings?.();
              }}
              className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              <Settings className="w-4 h-4" />
              <span>OPEN PROVIDER SETTINGS</span>
            </button>
          ) : (
            <>
              {error.canRetry && onRetry && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onRetry();
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>TRY AGAIN</span>
                </button>
              )}

              {onChangeModel && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onChangeModel();
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Sliders className="w-4 h-4" />
                  <span>CHANGE MODEL</span>
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
