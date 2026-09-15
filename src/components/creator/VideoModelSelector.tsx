import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Check,
  Sparkles,
  Settings2,
  ShieldCheck,
  Film,
  Zap
} from 'lucide-react';
import { VideoProviderId, AIVideoProviderConfig } from '../../types/videoProvider';
import { videoProviderRegistry } from '../../services/videoProviders/videoProviderRegistry';
import {
  Seedance2FastProIcon,
  Veo31FastProIcon,
  Veo31LiteProIcon,
  Veo31ProIcon,
  Veo30FastProIcon,
  GoogleOmniIcon,
  HappyHorseIcon
} from './ModelBadgeIcons';

interface VideoModelSelectorProps {
  currentPrompt?: string;
  onOpenSettings?: () => void;
  className?: string;
}

export const VideoModelSelector: React.FC<VideoModelSelectorProps> = ({
  currentPrompt = '',
  onOpenSettings,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [, setTick] = useState(0);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const unsub = videoProviderRegistry.subscribe(() => setTick((t) => t + 1));
    return unsub;
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeProvider = videoProviderRegistry.getActiveProvider();
  const activeConfig = activeProvider.getConfig();
  const allProviders = videoProviderRegistry.getAllProviders();

  const renderBadge = (badgeType: string) => {
    switch (badgeType) {
      case 'seedance-2-fast':
        return <Seedance2FastProIcon className="w-8 h-8 rounded-full overflow-hidden shrink-0 shadow-md" />;
      case 'veo-fast':
        return <Veo31FastProIcon className="w-8 h-8 rounded-full overflow-hidden shrink-0 shadow-md" />;
      case 'veo-lite':
        return <Veo31LiteProIcon className="w-8 h-8 rounded-full overflow-hidden shrink-0 shadow-md" />;
      case 'veo-pro':
        return <Veo31ProIcon className="w-8 h-8 rounded-full overflow-hidden shrink-0 shadow-md" />;
      case 'veo-3-green':
        return <Veo30FastProIcon className="w-8 h-8 rounded-full overflow-hidden shrink-0 shadow-md" />;
      case 'omni':
        return <GoogleOmniIcon className="w-8 h-8 rounded-full overflow-hidden shrink-0 shadow-md" />;
      case 'horse':
        return <HappyHorseIcon className="w-8 h-8 rounded-full overflow-hidden shrink-0 shadow-md" />;
      default:
        return <Seedance2FastProIcon className="w-8 h-8 rounded-full overflow-hidden shrink-0 shadow-md" />;
    }
  };

  // Smart Recommendation Helper
  const getRecommendationReason = (config: AIVideoProviderConfig): string | null => {
    const lower = currentPrompt.toLowerCase();
    if (!lower) return null;
    if ((lower.includes('cepat') || lower.includes('fast') || lower.includes('action')) && config.providerId === 'seedance-2-0-fast-pro') {
      return 'Rekomendasi Cepat: Fast & Cinematic';
    }
    if ((lower.includes('film') || lower.includes('cinematic') || lower.includes('4k') || lower.includes('premium')) && config.providerId === 'veo-3-1-pro') {
      return 'Rekomendasi Sinematik: Kualitas Premium';
    }
    if ((lower.includes('draft') || lower.includes('preview') || lower.includes('ringan')) && config.providerId === 'veo-3-1-lite-pro') {
      return 'Rekomendasi Efisien: Ringan & Cepat';
    }
    if ((lower.includes('kreatif') || lower.includes('motion') || lower.includes('artistik')) && config.providerId === 'happy-horse-1-0') {
      return 'Rekomendasi Kreatif: Dynamic Motion';
    }
    return null;
  };

  return (
    <div className={`space-y-1.5 relative ${className}`} ref={dropdownRef}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider">
          Model AI Video
        </label>
        {onOpenSettings && (
          <button
            type="button"
            onClick={onOpenSettings}
            className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors cursor-pointer"
            title="Kelola Kredensial AI Video Provider"
          >
            <Settings2 className="w-3 h-3" />
            <span>Kelola Provider</span>
          </button>
        )}
      </div>

      {/* Selected Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-2.5 rounded-2xl bg-[#091122] border-2 border-blue-600/90 hover:border-blue-500 text-left flex items-center justify-between transition-all cursor-pointer shadow-lg shadow-blue-950/30 group hover:shadow-blue-500/10"
      >
        <div className="flex items-center space-x-3 overflow-hidden">
          {renderBadge(activeConfig.badgeType)}
          <div className="overflow-hidden">
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-bold text-white leading-tight truncate">
                {activeConfig.displayName}
              </h4>
              {activeConfig.isDefault && (
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-900/60 text-blue-300 font-mono border border-blue-500/30">
                  DEFAULT
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 leading-tight mt-0.5 truncate">
              {activeConfig.label || activeConfig.description}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1.5 pl-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Ready" />
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
          )}
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 rounded-2xl bg-[#0a1324] border border-blue-600/50 shadow-2xl p-2 space-y-1 max-h-96 overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-1 duration-150 backdrop-blur-md">
          <div className="px-2 py-1.5 border-b border-slate-800 flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-blue-400" />
              MODEL AI VIDEO
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              {allProviders.length} MODEL TERSEDIA
            </span>
          </div>

          <div className="space-y-1 pt-1">
            {allProviders.map((prov) => {
              const cfg = prov.getConfig();
              const isSelected = cfg.providerId === activeConfig.providerId;
              const recommendation = getRecommendationReason(cfg);

              return (
                <button
                  key={cfg.providerId}
                  type="button"
                  onClick={() => {
                    videoProviderRegistry.setActiveProvider(cfg.providerId);
                    setIsOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer group ${
                    isSelected
                      ? 'bg-blue-600/20 border border-blue-500/60 shadow-md shadow-blue-950/50'
                      : 'hover:bg-slate-800/80 border border-transparent hover:border-slate-700/60'
                  }`}
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    {renderBadge(cfg.badgeType)}
                    <div className="overflow-hidden">
                      <div className="flex items-center gap-1.5">
                        <h5 className="text-xs font-bold text-white truncate group-hover:text-blue-300 transition-colors">
                          {cfg.displayName}
                        </h5>
                        {recommendation && (
                          <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 flex items-center gap-0.5">
                            <Sparkles className="w-2.5 h-2.5" />
                            {recommendation}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {cfg.label}
                      </p>

                      {/* Capabilities chips */}
                      <div className="flex items-center gap-1.5 mt-1">
                        {cfg.capabilities.supportsCameraControl && (
                          <span className="text-[9px] text-blue-300 font-mono">
                            • Camera Control
                          </span>
                        )}
                        {cfg.capabilities.supportsAudio && (
                          <span className="text-[9px] text-pink-300 font-mono">
                            • Audio
                          </span>
                        )}
                        <span className="text-[9px] text-slate-500 font-mono">
                          • {cfg.capabilities.maxDurationSec}s Max
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 pl-2 flex items-center gap-1.5">
                    {isSelected ? (
                      <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white shadow-sm">
                        <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-700 group-hover:border-slate-500" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer note */}
          <div className="pt-2 px-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              Auto Fallback Aktif
            </span>
            <span className="text-slate-500 font-mono">
              Temporal Coherence Engine
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
