import React from 'react';

export const SeedreamIcon: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <div className={`${className} rounded-xl bg-gradient-to-b from-[#0e1628] to-[#080d19] border border-cyan-500/30 flex items-center justify-center p-1.5 shadow-sm shadow-cyan-950/40 shrink-0`}>
    <div className="flex items-center justify-center gap-[2.5px] h-full w-full">
      <span className="w-[3px] h-3 bg-gradient-to-t from-purple-500 to-cyan-400 rounded-full animate-pulse" />
      <span className="w-[3px] h-5 bg-gradient-to-t from-pink-500 to-cyan-300 rounded-full" />
      <span className="w-[3px] h-6 bg-gradient-to-t from-cyan-400 to-teal-300 rounded-full" />
      <span className="w-[3px] h-4 bg-gradient-to-t from-purple-500 to-pink-400 rounded-full" />
      <span className="w-[3px] h-2.5 bg-gradient-to-t from-indigo-500 to-cyan-400 rounded-full" />
    </div>
  </div>
);

export const OpenAIIconPro: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <div className={`${className} rounded-xl bg-gradient-to-b from-[#141b2d] to-[#0a101d] border border-pink-500/30 flex items-center justify-center p-1.5 shadow-sm shrink-0`}>
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <defs>
        <linearGradient id="openai-grad-pro" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ec4899" />
          <stop offset="50%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="9" stroke="url(#openai-grad-pro)" strokeWidth="1.8" strokeDasharray="3 2" />
      <path
        d="M12 4v4m0 8v4m-8-8h4m8 0h4m-3.5-5.5l-2.8 2.8m-5.4 5.4l-2.8 2.8m0-11l2.8 2.8m5.4 5.4l2.8 2.8"
        stroke="url(#openai-grad-pro)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="2.2" fill="#38bdf8" />
    </svg>
  </div>
);

export const OpenAIIconExtra: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <div className={`${className} rounded-xl bg-gradient-to-b from-[#141b2d] to-[#0a101d] border border-cyan-500/30 flex items-center justify-center p-1.5 shadow-sm shrink-0`}>
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <defs>
        <linearGradient id="openai-grad-extra" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="8" stroke="url(#openai-grad-extra)" strokeWidth="2" />
      <path
        d="M12 6v12M6 12h12M7.5 7.5l9 9M7.5 16.5l9-9"
        stroke="url(#openai-grad-extra)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

export const OpenAIIconSpiral: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <div className={`${className} rounded-xl bg-gradient-to-b from-[#141b2d] to-[#0a101d] border border-amber-500/30 flex items-center justify-center p-1.5 shadow-sm shrink-0`}>
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <defs>
        <linearGradient id="openai-spiral" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="35%" stopColor="#10b981" />
          <stop offset="70%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      <path
        d="M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10A10 10 0 0 1 2 12 10 10 0 0 1 12 2zm0 4a6 6 0 1 0 6 6"
        stroke="url(#openai-spiral)"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="12" cy="12" r="2.5" fill="url(#openai-spiral)" />
    </svg>
  </div>
);

export const IdeogramIcon: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <div className={`${className} rounded-xl bg-black border border-slate-700 flex items-center justify-center p-1.5 shadow-sm shrink-0`}>
    <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor">
      <circle cx="12" cy="12" r="9" strokeWidth="1.8" />
      <path d="M8 8h8M8 12h8M8 16h8" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    </svg>
  </div>
);

export const BananaIcon: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <div className={`${className} rounded-xl bg-gradient-to-b from-[#241a06] via-[#1a1306] to-[#0c0a07] border border-amber-400/40 flex flex-col items-center justify-center p-1 shadow-sm shrink-0 relative overflow-hidden`}>
    <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/15 via-transparent to-yellow-300/10 pointer-events-none" />
    <span className="text-base select-none leading-none scale-105">🍌</span>
    <span className="text-[6.5px] font-black text-amber-400 tracking-tight uppercase leading-none mt-0.5 font-mono">FAST</span>
  </div>
);

// Video Kreatif Models
export const Seedance2FastProIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <div className={`${className} rounded-lg bg-[#060c1c] border border-sky-500/40 flex flex-col items-center justify-center p-1 shadow-sm shrink-0 relative overflow-hidden`}>
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <defs>
        <linearGradient id="seedance-blue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="50%" stopColor="#2563eb" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
      <path
        d="M17 5c-3-2-8-1-10 2s0 6 3 7 5 3 4 5-3 2-6 1m7-15l-1 2m-8 12l-1 2"
        stroke="url(#seedance-blue)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
    <span className="text-[6px] font-bold text-sky-400 tracking-tighter scale-90 -mt-0.5">2.0</span>
  </div>
);

export const Seedance25Icon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <div className={`${className} rounded-lg bg-[#071326] border border-cyan-500/40 flex items-center justify-center p-1 shadow-sm shrink-0 relative overflow-hidden`}>
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <defs>
        <linearGradient id="seedance-25" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22d3ee" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
      </defs>
      <rect x="4" y="5" width="4" height="14" rx="1.5" fill="url(#seedance-25)" />
      <rect x="11" y="9" width="4" height="10" rx="1.5" fill="#38bdf8" />
      <path d="M18 4l2 3-2 3" stroke="#67e8f9" strokeWidth="2" strokeLinecap="round" />
    </svg>
  </div>
);

export const KlingV3ProIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <div className={`${className} rounded-lg bg-black border border-emerald-500/40 flex items-center justify-center p-1 shadow-sm shrink-0 relative overflow-hidden`}>
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <defs>
        <linearGradient id="kling-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="33%" stopColor="#06b6d4" />
          <stop offset="66%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      <circle cx="12" cy="12" r="7.5" stroke="url(#kling-grad)" strokeWidth="2.8" strokeDasharray="32 8" />
      <circle cx="12" cy="12" r="3" fill="#22d3ee" />
    </svg>
  </div>
);

export const MinimaxH3Icon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <div className={`${className} rounded-lg bg-white border border-rose-200 flex items-center justify-center p-1 shadow-sm shrink-0`}>
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <path
        d="M4 14V10M8 17V7M12 19V5M16 17V7M20 14V10"
        stroke="#f43f5e"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  </div>
);

export const Veo31FastProIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <div className={`${className} rounded-lg bg-gradient-to-b from-[#180924] to-[#0d0417] border border-pink-500/50 flex flex-col items-center justify-center p-0.5 shadow-sm shrink-0 relative overflow-hidden`}>
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
      <defs>
        <linearGradient id="veo-fast-pro" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f43f5e" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <path d="M5 6l7 12 7-12" stroke="url(#veo-fast-pro)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <polygon points="11,8 15,10 11,12" fill="#ec4899" />
    </svg>
    <span className="text-[5.5px] font-extrabold text-pink-400 tracking-tighter uppercase leading-none">FAST PRO</span>
  </div>
);

export const Veo31LiteProIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <div className={`${className} rounded-lg bg-gradient-to-b from-[#1a1405] to-[#0c0a02] border border-amber-500/50 flex flex-col items-center justify-center p-0.5 shadow-sm shrink-0 relative overflow-hidden`}>
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
      <path d="M5 6l7 12 7-12" stroke="#f59e0b" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <span className="text-[5.5px] font-extrabold text-amber-300 tracking-tighter uppercase leading-none">LITE</span>
  </div>
);

export const Veo31ProIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <div className={`${className} rounded-lg bg-gradient-to-b from-[#1f0709] to-[#0f0305] border border-red-500/50 flex flex-col items-center justify-center p-0.5 shadow-sm shrink-0 relative overflow-hidden`}>
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
      <path d="M5 6l7 12 7-12" stroke="#ef4444" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <span className="text-[5.5px] font-extrabold text-red-400 tracking-tighter uppercase leading-none">3.1 PRO</span>
  </div>
);

export const Veo30FastProIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <div className={`${className} rounded-lg bg-gradient-to-b from-[#051a0f] to-[#020d07] border border-emerald-500/50 flex flex-col items-center justify-center p-0.5 shadow-sm shrink-0 relative overflow-hidden`}>
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
      <path d="M5 6l7 12 7-12" stroke="#10b981" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <span className="text-[5.5px] font-extrabold text-emerald-400 tracking-tighter uppercase leading-none">3.0 PRO</span>
  </div>
);

export const GoogleOmniIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <div className={`${className} rounded-lg bg-gradient-to-b from-[#05152b] to-[#020b17] border border-cyan-500/50 flex flex-col items-center justify-center p-0.5 shadow-sm shrink-0 relative overflow-hidden`}>
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
      <circle cx="12" cy="12" r="7" stroke="#38bdf8" strokeWidth="1.8" />
      <path d="M13 7l-3 5h4l-2 5" stroke="#67e8f9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    <span className="text-[5.5px] font-extrabold text-sky-300 tracking-tighter uppercase leading-none">OMNI</span>
  </div>
);

export const HappyHorseIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <div className={`${className} rounded-lg bg-gradient-to-b from-[#1e2430] to-[#0f121a] border border-slate-500/50 flex items-center justify-center p-1 shadow-sm shrink-0 relative overflow-hidden`}>
    <span className="text-sm select-none">🐎</span>
  </div>
);

export const Seedance10ProIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <div className={`${className} rounded-lg bg-gradient-to-b from-[#210909] to-[#120404] border border-rose-500/40 flex flex-col items-center justify-center p-0.5 shadow-sm shrink-0 relative overflow-hidden`}>
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
      <path
        d="M17 5c-3-2-8-1-10 2s0 6 3 7 5 3 4 5-3 2-6 1"
        stroke="#f43f5e"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
    <span className="text-[5.5px] font-extrabold text-rose-400 tracking-tighter uppercase leading-none">1.0 PRO</span>
  </div>
);

export const Seedance10ProFastIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <div className={`${className} rounded-lg bg-gradient-to-b from-[#241705] to-[#120a02] border border-amber-500/40 flex flex-col items-center justify-center p-0.5 shadow-sm shrink-0 relative overflow-hidden`}>
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
      <path
        d="M17 5c-3-2-8-1-10 2s0 6 3 7 5 3 4 5-3 2-6 1"
        stroke="#f59e0b"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
    <span className="text-[5.5px] font-extrabold text-amber-400 tracking-tighter uppercase leading-none">FAST</span>
  </div>
);

export const LiteLLMIcon: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <div className={`${className} rounded-xl bg-gradient-to-b from-[#141b2d] to-[#0a101d] border border-cyan-500/40 flex items-center justify-center p-1.5 shadow-sm shrink-0 relative overflow-hidden`}>
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <path
        d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
        stroke="#38bdf8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
    <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
  </div>
);

export const KoboiLLMIcon: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <div className={`${className} rounded-xl bg-gradient-to-b from-[#1c132b] to-[#0c0817] border border-purple-500/40 flex items-center justify-center p-1.5 shadow-sm shrink-0 relative overflow-hidden`}>
    <span className="text-sm select-none">🤠</span>
    <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-cyan-400" />
  </div>
);


