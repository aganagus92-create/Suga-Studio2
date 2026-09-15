import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'error' | 'info';
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success' }) => {
  if (!message) return null;

  return (
    <div
      id="app-toast"
      className="fixed bottom-5 right-5 z-50 px-4 py-3 rounded-2xl bg-slate-900/95 text-white text-xs font-semibold border border-purple-500/40 shadow-2xl shadow-purple-950/50 flex items-center space-x-2.5 backdrop-blur-md animate-bounce-short transition-all"
    >
      {type === 'error' ? (
        <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
      ) : (
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
      )}
      <span className="text-slate-200">{message}</span>
    </div>
  );
};
