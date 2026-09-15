import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Check,
  Sparkles,
  Settings,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Sliders,
  Zap,
  RefreshCw,
  Search,
  Globe,
  KeyRound,
  ExternalLink,
  X,
  Radio,
  Clock,
  Layers
} from 'lucide-react';
import { AIProviderConfig, ProviderId, ProviderBadgeType } from '../../types/provider';
import { providerRegistry } from '../../services/providers/providerRegistry';
import { litellmService } from '../../services/litellmService';
import { LiteLLMModel } from '../../types/litellm';
import {
  SeedreamIcon,
  OpenAIIconPro,
  OpenAIIconExtra,
  OpenAIIconSpiral,
  IdeogramIcon,
  BananaIcon,
  LiteLLMIcon,
  KoboiLLMIcon
} from './ModelBadgeIcons';

interface ModelSelectorProps {
  currentPrompt?: string;
  onOpenSettings?: () => void;
  className?: string;
}

export const ModelProviderBadge: React.FC<{
  badgeType: ProviderBadgeType;
  className?: string;
}> = ({ badgeType, className = 'w-10 h-10' }) => {
  switch (badgeType) {
    case 'seedream':
      return (
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-950/80 to-blue-900/60 p-0.5 border border-cyan-400/40 shadow-md shadow-cyan-950/30 flex items-center justify-center">
            <SeedreamIcon className="w-8 h-8 !rounded-full overflow-hidden" />
          </div>
        </div>
      );
    case 'openai-pro':
      return (
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-950/80 to-purple-900/60 p-0.5 border border-pink-400/40 shadow-md shadow-pink-950/30 flex items-center justify-center">
            <OpenAIIconPro className="w-8 h-8 !rounded-full overflow-hidden" />
          </div>
        </div>
      );
    case 'openai-extra':
      return (
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-950/80 to-teal-900/60 p-0.5 border border-cyan-400/40 shadow-md shadow-cyan-950/30 flex items-center justify-center">
            <OpenAIIconExtra className="w-8 h-8 !rounded-full overflow-hidden" />
          </div>
        </div>
      );
    case 'openai-2':
      return (
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-950/80 to-emerald-900/60 p-0.5 border border-amber-400/40 shadow-md shadow-amber-950/30 flex items-center justify-center">
            <OpenAIIconSpiral className="w-8 h-8 !rounded-full overflow-hidden" />
          </div>
        </div>
      );
    case 'ideogram':
      return (
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-900 to-black p-0.5 border border-slate-500/50 shadow-md shadow-black/50 flex items-center justify-center">
            <IdeogramIcon className="w-8 h-8 !rounded-full overflow-hidden" />
          </div>
        </div>
      );
    case 'banana':
      return (
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-950 via-yellow-950/80 to-amber-900/60 p-0.5 border border-amber-400/60 shadow-md shadow-amber-950/50 flex items-center justify-center">
            <BananaIcon className="w-8 h-8 !rounded-full overflow-hidden" />
          </div>
        </div>
      );
    case 'litellm':
      return (
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-950 via-sky-900/70 to-blue-950 p-0.5 border border-cyan-400/60 shadow-md shadow-cyan-950/50 flex items-center justify-center">
            <LiteLLMIcon className="w-8 h-8 !rounded-full overflow-hidden" />
          </div>
        </div>
      );
    case 'koboillm':
      return (
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-950 via-indigo-900/70 to-fuchsia-950 p-0.5 border border-purple-400/60 shadow-md shadow-purple-950/50 flex items-center justify-center">
            <KoboiLLMIcon className="w-8 h-8 !rounded-full overflow-hidden" />
          </div>
        </div>
      );
    default:
      return (
        <div className="w-10 h-10 rounded-full bg-blue-950 border border-blue-500 flex items-center justify-center text-blue-300">
          <Sparkles className="w-5 h-5" />
        </div>
      );
  }
};

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  currentPrompt = '',
  onOpenSettings,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [providers, setProviders] = useState<AIProviderConfig[]>([]);
  const [activeProvider, setActiveProvider] = useState<AIProviderConfig | null>(null);
  const [autoFallback, setAutoFallback] = useState<boolean>(true);
  const [smartRecommendationId, setSmartRecommendationId] = useState<ProviderId | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<'ALL' | 'FAST' | 'LITELLM' | 'STANDARD'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // LiteLLM Dynamic Models State
  const [liteLLMModels, setLiteLLMModels] = useState<LiteLLMModel[]>([]);
  const [isFetchingLiteLLM, setIsFetchingLiteLLM] = useState(false);
  const [activeLiteLLMModelId, setActiveLiteLLMModelId] = useState<string>('nano-banana-2');
  const [liteLLMStatusMsg, setLiteLLMStatusMsg] = useState<string | null>(null);

  // Quick Key Management Popover
  const [showKeyDialog, setShowKeyDialog] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState(litellmService.getApiKey() || '');
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [keyTestFeedback, setKeyTestFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // 1. Sync with provider registry
  useEffect(() => {
    const update = () => {
      const all = providerRegistry.getEnabledProviders();
      setProviders(all);
      const active = providerRegistry.getActiveProvider().getConfig();
      setActiveProvider(active);
      setAutoFallback(providerRegistry.isAutoFallbackEnabled());
    };

    update();
    const unsubscribe = providerRegistry.subscribe(update);
    return () => unsubscribe();
  }, []);

  // 2. Sync with LiteLLM service & fetch models from api.koboillm.com/v1
  useEffect(() => {
    const updateLiteLLM = () => {
      setLiteLLMModels(litellmService.getModels());
      setIsFetchingLiteLLM(litellmService.getIsFetching());
      setActiveLiteLLMModelId(litellmService.getActiveModelId());
    };

    updateLiteLLM();
    const unsubLiteLLM = litellmService.subscribe(updateLiteLLM);

    // Initial fetch from base URL
    litellmService.fetchModels().then((res) => {
      if (res && res.models) {
        setLiteLLMStatusMsg(`✓ ${res.models.length} model aktif dari api.koboillm.com/v1`);
      }
    });

    return () => unsubLiteLLM();
  }, []);

  // 3. Compute smart recommendation whenever prompt changes
  useEffect(() => {
    if (currentPrompt && currentPrompt.trim().length > 3) {
      const recId = providerRegistry.recommendModelForPrompt(currentPrompt);
      setSmartRecommendationId(recId);
    } else {
      setSmartRecommendationId(null);
    }
  }, [currentPrompt]);

  // 4. Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowKeyDialog(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleSelectProvider = (providerId: ProviderId) => {
    providerRegistry.setActiveProviderId(providerId);
    setIsOpen(false);
  };

  const handleSelectLiteLLMModel = (model: LiteLLMModel) => {
    litellmService.setActiveModelId(model.id);
    providerRegistry.setActiveProviderId('litellm');
    setIsOpen(false);
  };

  const handleFetchAllModels = async (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsFetchingLiteLLM(true);
    setLiteLLMStatusMsg('Mengambil model dari api.koboillm.com/v1...');
    try {
      const res = await litellmService.fetchModels(undefined, true);
      const count = res.models ? res.models.length : 0;
      setLiteLLMStatusMsg(`✓ Sukses! ${count} model aktif dimuat dari api.koboillm.com/v1`);
      setTimeout(() => setLiteLLMStatusMsg(null), 4000);
    } catch (err: any) {
      setLiteLLMStatusMsg(`Gagal memuat: ${err?.message || 'Periksa koneksi/kunci API'}`);
    } finally {
      setIsFetchingLiteLLM(false);
    }
  };

  const handleSaveApiKey = async () => {
    const trimmed = apiKeyInput.trim();
    litellmService.setApiKey(trimmed);
    providerRegistry.setProviderApiKey('litellm', trimmed);

    setIsTestingKey(true);
    setKeyTestFeedback(null);

    const testRes = await litellmService.testConnection(trimmed);
    setIsTestingKey(false);
    setKeyTestFeedback({
      success: testRes.success,
      message: testRes.message
    });

    if (testRes.success) {
      await litellmService.fetchModels(trimmed, true);
      setTimeout(() => setShowKeyDialog(false), 1800);
    }
  };

  const handleToggleFallback = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextVal = !autoFallback;
    setAutoFallback(nextVal);
    providerRegistry.setAutoFallbackEnabled(nextVal);
  };

  if (!activeProvider) return null;

  // Active Model Display Calculations
  const isLiteLLMActive = activeProvider.providerId === 'litellm';
  const activeLiteModelObj = isLiteLLMActive ? litellmService.getActiveModel() : null;

  const displayTitle = isLiteLLMActive
    ? activeLiteModelObj?.name || activeLiteLLMModelId || 'LiteLLM Model'
    : activeProvider.displayName;

  const displaySubtitle = isLiteLLMActive
    ? `api.koboillm.com/v1 • ${activeLiteModelObj?.provider || 'LiteLLM Proxy'}`
    : activeProvider.label;

  const isFastActive =
    activeProvider.modelGroup === 'FAST' ||
    activeProvider.providerId === 'nano-banana-2' ||
    (isLiteLLMActive && (activeLiteModelObj?.isFast || activeLiteModelObj?.group === 'FAST'));

  // Filtering Models
  const query = searchQuery.toLowerCase().trim();

  // Fast models combine Nano Banana 2 + any fast LiteLLM models
  const fastStandardProviders = providers.filter((p) => p.modelGroup === 'FAST' || p.providerId === 'nano-banana-2');
  const fastLiteModels = liteLLMModels.filter((m) => m.isFast || m.group === 'FAST' || m.id.includes('banana') || m.id.includes('fast') || m.id.includes('schnell') || m.id.includes('turbo'));

  const standardProviders = providers.filter((p) => p.modelGroup !== 'FAST' && p.providerId !== 'nano-banana-2' && p.providerId !== 'litellm');

  const filteredLiteLLMModels = liteLLMModels.filter((m) => {
    if (!query) return true;
    return (
      m.name.toLowerCase().includes(query) ||
      m.id.toLowerCase().includes(query) ||
      m.provider.toLowerCase().includes(query) ||
      (m.description && m.description.toLowerCase().includes(query))
    );
  });

  const filteredStandardProviders = standardProviders.filter((p) => {
    if (!query) return true;
    return (
      p.displayName.toLowerCase().includes(query) ||
      p.providerId.toLowerCase().includes(query) ||
      p.label.toLowerCase().includes(query)
    );
  });

  const filteredFastProviders = fastStandardProviders.filter((p) => {
    if (!query) return true;
    return (
      p.displayName.toLowerCase().includes(query) ||
      p.providerId.toLowerCase().includes(query) ||
      p.label.toLowerCase().includes(query)
    );
  });

  return (
    <div className={`relative w-full ${className}`} id="model-selector-container" ref={dropdownRef}>
      {/* Selector Label & Quick Fallback Bar */}
      <div className="flex items-center justify-between mb-1.5 px-0.5">
        <label className="text-[11px] font-bold tracking-wider text-slate-300 uppercase flex items-center gap-1.5">
          <span>Model AI</span>
          {isFastActive ? (
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-bold flex items-center gap-0.5">
              <Zap className="w-2.5 h-2.5 fill-current" />
              FAST
            </span>
          ) : (
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-mono font-normal">
              PRO
            </span>
          )}
          {isLiteLLMActive && (
            <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono font-bold flex items-center gap-0.5">
              <Globe className="w-2.5 h-2.5 text-cyan-400" />
              api.koboillm.com
            </span>
          )}
        </label>

        {/* Auto Fallback Quick Indicator */}
        <button
          type="button"
          id="toggle-auto-fallback-button"
          onClick={handleToggleFallback}
          className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border transition-all cursor-pointer ${
            autoFallback
              ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30 hover:border-emerald-500/50'
              : 'bg-slate-900 text-slate-400 border-slate-700 hover:text-slate-300'
          }`}
          title="Auto Fallback: Otomatis mengalihkan ke model alternatif jika provider utama mengalami kegagalan."
        >
          <ShieldCheck className={`w-3 h-3 ${autoFallback ? 'text-emerald-400' : 'text-slate-500'}`} />
          <span>Auto Fallback: {autoFallback ? 'ON' : 'OFF'}</span>
        </button>
      </div>

      {/* Trigger Button */}
      <button
        type="button"
        id="model-ai-trigger-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={`w-full min-h-[58px] p-2.5 sm:p-3 rounded-2xl bg-[#070d1a] border transition-all text-left flex items-center justify-between gap-3 shadow-lg cursor-pointer ${
          isOpen
            ? isFastActive
              ? 'border-amber-400 ring-2 ring-amber-400/20 shadow-amber-950/40'
              : 'border-blue-500 ring-2 ring-blue-500/20 shadow-blue-950/40'
            : isFastActive
            ? 'border-amber-500/40 hover:border-amber-400 hover:bg-[#120f07]'
            : 'border-blue-500/30 hover:border-blue-400 hover:bg-[#091122]'
        }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          {/* Circular Provider Badge */}
          <ModelProviderBadge
            badgeType={isLiteLLMActive ? 'litellm' : activeProvider.badgeType}
            className="w-10 h-10"
          />

          {/* Text Container */}
          <div className="min-w-0 flex flex-col justify-center">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-bold text-white tracking-tight truncate">
                {displayTitle}
              </span>

              {/* Fast Tag on Active Model */}
              {isFastActive && (
                <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                  <Zap className="w-2.5 h-2.5 fill-current" />
                  <span>FAST GEN</span>
                </span>
              )}

              {/* LiteLLM Hub Tag */}
              {isLiteLLMActive && (
                <span className="inline-flex items-center gap-1 text-[9px] font-medium px-1.5 py-0.2 rounded-full bg-cyan-950/70 text-cyan-300 border border-cyan-500/40 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span>LiteLLM Hub</span>
                </span>
              )}

              {/* Status Indicator */}
              <span
                className={`inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.2 rounded-full border ${
                  activeProvider.isConnected || isLiteLLMActive
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-950/60 text-amber-300 border-amber-500/30'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    activeProvider.isConnected || isLiteLLMActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                  }`}
                />
                <span className="hidden xs:inline">
                  {activeProvider.isConnected || isLiteLLMActive ? 'Connected' : 'Perlu Kunci'}
                </span>
              </span>

              {/* Recommended Badge */}
              {!isLiteLLMActive && smartRecommendationId === activeProvider.providerId && (
                <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/40">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>RECOMMENDED</span>
                </span>
              )}
            </div>

            {/* Subtitle / Description */}
            <span className="text-xs text-slate-400 truncate mt-0.5 font-normal">
              {displaySubtitle}
            </span>
          </div>
        </div>

        {/* Right Arrow / Chevron */}
        <div className="flex items-center gap-1.5 pl-2 shrink-0">
          <div
            className={`w-7 h-7 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-slate-300 transition-transform duration-200 ${
              isOpen
                ? isFastActive
                  ? 'rotate-180 text-amber-400 border-amber-400/50'
                  : 'rotate-180 text-blue-400 border-blue-500/50'
                : ''
            }`}
          >
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </button>

      {/* Dropdown Menu Overlay */}
      {isOpen && (
        <div
          role="listbox"
          id="model-selector-dropdown-menu"
          className="absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl bg-[#070d1a] border border-blue-500/40 shadow-2xl shadow-blue-950/80 backdrop-blur-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
        >
          {/* LITELLM GATEWAY STATUS & REFRESH HUB BANNER */}
          <div className="p-3 bg-gradient-to-r from-[#07132a] via-[#091b3b] to-[#0d1633] border-b border-cyan-500/30">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-300 shrink-0">
                  <Globe className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white tracking-wide">
                      api.koboillm.com/v1
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                      LiteLLM
                    </span>
                  </div>
                  <p className="text-[10px] text-cyan-200/70 truncate">
                    Endpoint LiteLLM aktif • Memuat seluruh model terdaftar
                  </p>
                </div>
              </div>

              {/* Action Buttons: Fetch Models & Set Key */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  id="fetch-litellm-models-button"
                  onClick={handleFetchAllModels}
                  disabled={isFetchingLiteLLM}
                  className="px-2.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-cyan-200 text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  title="Ambil / perbarui seluruh daftar model dari api.koboillm.com/v1"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isFetchingLiteLLM ? 'animate-spin text-cyan-300' : ''}`} />
                  <span className="hidden sm:inline">
                    {isFetchingLiteLLM ? 'Memuat...' : 'Ambil Semua Model'}
                  </span>
                  <span className="sm:hidden">Sync</span>
                </button>

                <button
                  type="button"
                  id="open-key-config-button"
                  onClick={() => setShowKeyDialog(!showKeyDialog)}
                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                    showKeyDialog
                      ? 'bg-cyan-500 text-slate-950 border-cyan-300'
                      : 'bg-slate-900/80 text-cyan-300 border-cyan-500/30 hover:bg-cyan-900/40'
                  }`}
                  title="Atur Virtual Key LiteLLM (sk-...)"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Live Fetch Notification */}
            {liteLLMStatusMsg && (
              <div className="mt-2 text-[10px] px-2 py-1 rounded bg-cyan-950/90 border border-cyan-500/30 text-cyan-200 flex items-center gap-1.5 animate-in fade-in">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                <span>{liteLLMStatusMsg}</span>
              </div>
            )}

            {/* Quick Virtual Key Inline Popover */}
            {showKeyDialog && (
              <div className="mt-2.5 p-2.5 rounded-xl bg-[#040813] border border-cyan-500/40 text-xs text-slate-200 animate-in fade-in">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-cyan-300 text-[11px] flex items-center gap-1">
                    <KeyRound className="w-3 h-3 text-cyan-400" />
                    Virtual Key LiteLLM (sk-...)
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowKeyDialog(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex gap-1.5">
                  <input
                    type="password"
                    id="litellm-api-key-input"
                    value={apiKeyInput}
                    onChange={(e) => setApiKeyInput(e.target.value)}
                    placeholder="sk-..."
                    className="flex-1 px-2 py-1 rounded bg-slate-900 border border-slate-700 text-white text-xs font-mono focus:border-cyan-400 outline-none"
                  />
                  <button
                    type="button"
                    id="save-litellm-key-button"
                    onClick={handleSaveApiKey}
                    disabled={isTestingKey}
                    className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-[11px] font-semibold cursor-pointer disabled:opacity-50"
                  >
                    {isTestingKey ? 'Menguji...' : 'Simpan & Tes'}
                  </button>
                </div>
                {keyTestFeedback && (
                  <p
                    className={`text-[10px] mt-1.5 font-medium ${
                      keyTestFeedback.success ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {keyTestFeedback.message}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Search Bar */}
          <div className="px-3 py-2 bg-[#060b17] border-b border-slate-800 flex items-center gap-2">
            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <input
              type="text"
              id="model-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari model (misal: banana, flux, gpt, dall-e, claude, veo, sdxl)..."
              className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-slate-400 hover:text-white text-xs"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Category Filter Tabs */}
          <div className="px-3 py-2 bg-[#060b17] border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
            <button
              type="button"
              id="filter-category-all"
              onClick={() => setSelectedCategory('ALL')}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all cursor-pointer shrink-0 ${
                selectedCategory === 'ALL'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              Semua ({providers.length + liteLLMModels.length})
            </button>
            <button
              type="button"
              id="filter-category-fast"
              onClick={() => setSelectedCategory('FAST')}
              className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
                selectedCategory === 'FAST'
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-sm shadow-amber-500/30'
                  : 'bg-amber-950/30 text-amber-300 hover:bg-amber-900/30 border border-amber-500/30'
              }`}
            >
              <Zap className="w-3 h-3 fill-current" />
              <span>Fast Models ({fastStandardProviders.length + fastLiteModels.length})</span>
            </button>
            <button
              type="button"
              id="filter-category-litellm"
              onClick={() => setSelectedCategory('LITELLM')}
              className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer shrink-0 ${
                selectedCategory === 'LITELLM'
                  ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-500/30'
                  : 'bg-cyan-950/30 text-cyan-300 hover:bg-cyan-900/30 border border-cyan-500/30'
              }`}
            >
              <Globe className="w-3 h-3 text-cyan-400" />
              <span>api.koboillm.com ({liteLLMModels.length})</span>
            </button>
            <button
              type="button"
              id="filter-category-standard"
              onClick={() => setSelectedCategory('STANDARD')}
              className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg transition-all cursor-pointer shrink-0 ${
                selectedCategory === 'STANDARD'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              Standard ({standardProviders.length})
            </button>
          </div>

          {/* Model List Items */}
          <div className="p-2 max-h-[380px] overflow-y-auto custom-scrollbar space-y-2">
            {/* LITELLM MODELS SECTION (When LITELLM tab is chosen or in ALL mode) */}
            {(selectedCategory === 'LITELLM' || (selectedCategory === 'ALL' && filteredLiteLLMModels.length > 0)) && (
              <div className="space-y-1.5" id="litellm-models-list-section">
                <div className="px-2 pt-1 pb-1 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-cyan-400 tracking-wide uppercase">
                    <Globe className="w-3.5 h-3.5 text-cyan-400" />
                    <span>LiteLLM Hub (api.koboillm.com/v1)</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono font-normal">
                      {filteredLiteLLMModels.length} Model
                    </span>
                  </div>
                  <span className="text-[10px] text-cyan-400/80 font-mono">Live Proxy</span>
                </div>

                {filteredLiteLLMModels.map((model) => {
                  const isSelected = isLiteLLMActive && activeLiteLLMModelId === model.id;
                  const isFast = model.isFast || model.group === 'FAST' || model.id.includes('banana') || model.id.includes('fast');

                  return (
                    <button
                      key={`litellm-${model.id}`}
                      type="button"
                      id={`model-option-${model.id}`}
                      onClick={() => handleSelectLiteLLMModel(model)}
                      className={`w-full min-h-[60px] p-2.5 sm:p-3 rounded-xl transition-all text-left flex items-center justify-between gap-3 cursor-pointer group ${
                        isSelected
                          ? isFast
                            ? 'bg-amber-950/40 border border-amber-400/80 shadow-md shadow-amber-950/40'
                            : 'bg-cyan-950/50 border border-cyan-400/70 shadow-md shadow-cyan-950/40'
                          : 'bg-[#080f1e] hover:bg-[#0c1830] border border-slate-800/80 hover:border-cyan-500/40'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Dynamic Badge */}
                        <div className="relative shrink-0">
                          <div
                            className={`w-10 h-10 rounded-full p-0.5 border flex items-center justify-center shadow-md ${
                              isFast
                                ? 'bg-gradient-to-tr from-amber-950 to-yellow-900 border-amber-400/60'
                                : 'bg-gradient-to-tr from-cyan-950 via-sky-900 to-blue-950 border-cyan-400/60'
                            }`}
                          >
                            {isFast ? (
                              <BananaIcon className="w-8 h-8 !rounded-full overflow-hidden" />
                            ) : (
                              <LiteLLMIcon className="w-8 h-8 !rounded-full overflow-hidden" />
                            )}
                          </div>
                        </div>

                        {/* Model Info */}
                        <div className="min-w-0 flex flex-col justify-center">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-sm font-bold tracking-tight ${
                                isSelected
                                  ? isFast
                                    ? 'text-amber-200'
                                    : 'text-cyan-200'
                                  : 'text-white group-hover:text-cyan-100'
                              }`}
                            >
                              {model.name}
                            </span>

                            {/* Fast Tag */}
                            {isFast && (
                              <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                                <Zap className="w-2.5 h-2.5 fill-current" />
                                <span>FAST</span>
                              </span>
                            )}

                            {/* Category Tag */}
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-slate-800 border border-slate-700 text-slate-300 uppercase font-mono">
                              {model.category || 'Visual'}
                            </span>

                            {/* Speed / Latency Tag */}
                            {model.latency && (
                              <span className="text-[9px] text-slate-400 font-mono flex items-center gap-0.5">
                                <Clock className="w-2.5 h-2.5 text-slate-500" />
                                <span>{model.latency}</span>
                              </span>
                            )}
                          </div>

                          {/* ID & Description */}
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-cyan-300/80 font-mono truncate">
                              {model.id}
                            </span>
                            {model.description && (
                              <span className="text-xs text-slate-400 truncate hidden sm:inline">
                                • {model.description}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Checkmark */}
                      <div className="shrink-0 flex items-center">
                        {isSelected ? (
                          <div
                            className={`w-6 h-6 rounded-full border flex items-center justify-center text-white shadow-md ${
                              isFast
                                ? 'bg-amber-500 border-amber-300 shadow-amber-500/40 text-slate-950 font-bold'
                                : 'bg-cyan-600 border-cyan-300 shadow-cyan-600/40'
                            }`}
                          >
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full border border-slate-700/60 group-hover:border-slate-500 flex items-center justify-center opacity-0 group-hover:opacity-60 transition-opacity">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* FAST MODELS SECTION (When FAST tab is chosen) */}
            {selectedCategory === 'FAST' && (
              <div className="space-y-1.5">
                <div className="px-2 pt-1 pb-1 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400 tracking-wide uppercase">
                    <Zap className="w-3.5 h-3.5 fill-amber-400/30 text-amber-400" />
                    <span>Fast Models (Nano Banana 2 & Fast LiteLLM)</span>
                  </div>
                  <span className="text-[10px] text-amber-300/70 font-mono">Ultra Latency</span>
                </div>

                {filteredFastProviders.map((provider) => {
                  const isSelected = !isLiteLLMActive && provider.providerId === activeProvider.providerId;
                  return (
                    <button
                      key={provider.providerId}
                      type="button"
                      onClick={() => handleSelectProvider(provider.providerId)}
                      className={`w-full min-h-[60px] p-2.5 sm:p-3 rounded-xl transition-all text-left flex items-center justify-between gap-3 cursor-pointer group ${
                        isSelected
                          ? 'bg-amber-950/40 border border-amber-400/70 shadow-md shadow-amber-950/30'
                          : 'bg-[#120d04] hover:bg-[#1a1407] border border-amber-500/20 hover:border-amber-400/40'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <ModelProviderBadge badgeType={provider.badgeType} className="w-10 h-10" />
                        <div className="min-w-0 flex flex-col justify-center">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-amber-100 group-hover:text-amber-300">
                              {provider.displayName}
                            </span>
                            <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
                              <Zap className="w-2.5 h-2.5 fill-current" />
                              <span>FAST</span>
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 truncate mt-0.5">
                            {provider.label}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center">
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-amber-500 border border-amber-300 flex items-center justify-center text-slate-950 font-bold shadow-md">
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* STANDARD MODELS SECTION */}
            {(selectedCategory === 'ALL' || selectedCategory === 'STANDARD') && filteredStandardProviders.length > 0 && (
              <div className="space-y-1.5">
                <div
                  className={`px-2 pt-2 pb-1 flex items-center justify-between ${
                    selectedCategory === 'ALL' ? 'border-t border-slate-800/80 mt-2 pt-2' : ''
                  }`}
                >
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-400 tracking-wide uppercase">
                    <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                    <span>Standard Models</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 font-mono font-normal">
                      High Quality & Photorealistic
                    </span>
                  </div>
                </div>

                {filteredStandardProviders.map((provider) => {
                  const isSelected = !isLiteLLMActive && provider.providerId === activeProvider.providerId;
                  const isRecommended = smartRecommendationId === provider.providerId;

                  return (
                    <button
                      key={provider.providerId}
                      type="button"
                      onClick={() => handleSelectProvider(provider.providerId)}
                      className={`w-full min-h-[60px] p-2.5 sm:p-3 rounded-xl transition-all text-left flex items-center justify-between gap-3 cursor-pointer group ${
                        isSelected
                          ? 'bg-blue-950/50 border border-blue-500/60 shadow-md shadow-blue-950/30'
                          : 'bg-[#080e1c] hover:bg-[#0c162b] border border-transparent hover:border-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <ModelProviderBadge badgeType={provider.badgeType} className="w-10 h-10" />
                        <div className="min-w-0 flex flex-col justify-center">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-bold text-white group-hover:text-blue-100">
                              {provider.displayName}
                            </span>
                            {isRecommended && (
                              <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                                <Sparkles className="w-2.5 h-2.5" />
                                <span>RECOMMENDED</span>
                              </span>
                            )}
                            <span
                              className={`text-[9px] px-1.5 py-0.2 rounded-full border ${
                                provider.isConnected
                                  ? 'bg-emerald-950/50 text-emerald-400 border-emerald-500/30'
                                  : 'bg-slate-900 text-slate-400 border-slate-700'
                              }`}
                            >
                              {provider.isConnected ? 'Connected' : 'Perlu Kunci'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 truncate mt-0.5 group-hover:text-slate-300">
                            {provider.label}
                          </p>
                        </div>
                      </div>
                      <div className="shrink-0 flex items-center">
                        {isSelected && (
                          <div className="w-6 h-6 rounded-full bg-blue-600 border border-blue-400 flex items-center justify-center text-white shadow-md">
                            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Empty Search Result */}
            {query && filteredLiteLLMModels.length === 0 && filteredStandardProviders.length === 0 && (
              <div className="p-6 text-center text-slate-400">
                <AlertCircle className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                <p className="text-xs">Tidak ada model yang cocok dengan kata kunci "{query}"</p>
                <button
                  type="button"
                  onClick={handleFetchAllModels}
                  className="mt-2 text-xs text-cyan-400 hover:underline"
                >
                  Ambil ulang model dari api.koboillm.com/v1
                </button>
              </div>
            )}
          </div>

          {/* Dropdown Footer */}
          <div className="p-3 bg-[#091122]/90 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400 font-medium">Gateway:</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 font-mono">
                api.koboillm.com/v1
              </span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 border border-slate-700 text-slate-300">
                LiteLLM Native
              </span>
            </div>

            {onOpenSettings && (
              <button
                type="button"
                id="open-settings-from-dropdown"
                onClick={() => {
                  setIsOpen(false);
                  onOpenSettings();
                }}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer"
              >
                <span>Pengaturan API Key</span>
                <span aria-hidden="true">&rarr;</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Unsupported Feature Notice (if active lacks reference images) */}
      {activeProvider && !isLiteLLMActive && !activeProvider.capabilities.supportsReferenceImages && (
        <div className="mt-1.5 px-2 py-1 rounded-lg bg-slate-900/60 border border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <HelpCircle className="w-3 h-3 text-amber-400 shrink-0" />
            <span>Referensi gambar dinonaktifkan untuk {activeProvider.displayName}.</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">Text-to-Image</span>
        </div>
      )}
    </div>
  );
};
