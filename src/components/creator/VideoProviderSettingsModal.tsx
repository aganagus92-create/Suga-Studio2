import React, { useState, useEffect } from 'react';
import {
  X,
  Shield,
  Key,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  EyeOff,
  Film,
  Zap,
  Check,
  ExternalLink,
  Info
} from 'lucide-react';
import { VideoProviderId } from '../../types/videoProvider';
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

interface VideoProviderSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccessToast?: (msg: string) => void;
}

export const VideoProviderSettingsModal: React.FC<VideoProviderSettingsModalProps> = ({
  isOpen,
  onClose,
  onSuccessToast
}) => {
  const [, setTick] = useState(0);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, { success: boolean; message: string; latency?: number }>>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [inputKeys, setInputKeys] = useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = useState<'providers' | 'fallback'>('providers');

  useEffect(() => {
    const unsub = videoProviderRegistry.subscribe(() => setTick((t) => t + 1));
    return unsub;
  }, []);

  useEffect(() => {
    // Populate inputKeys from registered providers
    const initial: Record<string, string> = {};
    videoProviderRegistry.getAllProviders().forEach((p) => {
      initial[p.providerId] = p.getConfig().apiKey || '';
    });
    setInputKeys(initial);
  }, [isOpen]);

  if (!isOpen) return null;

  const providers = videoProviderRegistry.getAllProviders();
  const autoFallback = videoProviderRegistry.isAutoFallbackEnabled();

  const handleTestConnection = async (id: VideoProviderId) => {
    setTestingId(id);
    setTestResults((prev) => ({ ...prev, [id]: { success: false, message: 'Menguji koneksi...' } }));

    // Apply key first if typed
    if (inputKeys[id] !== undefined) {
      videoProviderRegistry.setCustomApiKey(id, inputKeys[id]);
    }

    try {
      const res = await videoProviderRegistry.testProviderConnection(id);
      setTestResults((prev) => ({
        ...prev,
        [id]: { success: res.success, message: res.message, latency: res.latencyMs }
      }));
      if (res.success && onSuccessToast) {
        onSuccessToast(`Koneksi ${res.providerId} berhasil!`);
      }
    } catch (err: any) {
      setTestResults((prev) => ({
        ...prev,
        [id]: { success: false, message: err.message || 'Koneksi gagal' }
      }));
    } finally {
      setTestingId(null);
    }
  };

  const handleSaveKey = (id: VideoProviderId) => {
    const key = inputKeys[id] || '';
    videoProviderRegistry.setCustomApiKey(id, key);
    if (onSuccessToast) {
      onSuccessToast(`API key untuk ${id} berhasil disimpan secara lokal!`);
    }
  };

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-[#091122] border border-blue-600/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#0b162c]/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Pengaturan AI Video Provider
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300 font-mono border border-blue-500/30">
                  Image-to-Video Engine
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Konfigurasi kredensial API & kebijakan fallback untuk 7 model video AI profesional.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-800/80 bg-[#070d1a] px-5 pt-3">
          <button
            type="button"
            onClick={() => setActiveTab('providers')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'providers'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            Daftar Provider & API Keys ({providers.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('fallback')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'fallback'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Auto Fallback & Kuota
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1 custom-scrollbar">
          {activeTab === 'providers' && (
            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-blue-950/30 border border-blue-500/20 text-xs text-blue-300 flex items-start gap-2.5">
                <Shield className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-white">Privasi Terjamin:</span> Semua kunci API Anda disimpan secara aman di backend container atau lokal browser Anda, tidak pernah dipublikasikan atau dibagikan ke pihak ketiga.
                </div>
              </div>

              <div className="space-y-3">
                {providers.map((prov) => {
                  const cfg = prov.getConfig();
                  const result = testResults[cfg.providerId];
                  const isTesting = testingId === cfg.providerId;
                  const isKeyVisible = Boolean(showKeys[cfg.providerId]);
                  const activeKey = inputKeys[cfg.providerId] ?? (cfg.apiKey || '');

                  return (
                    <div
                      key={cfg.providerId}
                      className="p-4 rounded-2xl bg-[#0c162b] border border-slate-800 hover:border-blue-500/40 transition-all space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          {renderBadge(cfg.badgeType)}
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-white">{cfg.displayName}</h4>
                              {cfg.isDefault && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-900/60 text-blue-300 font-mono border border-blue-500/30">
                                  DEFAULT
                                </span>
                              )}
                              <span className="text-[10px] text-slate-500 font-mono">
                                ({cfg.modelId})
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-400">{cfg.label}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleTestConnection(cfg.providerId)}
                            disabled={isTesting}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <RefreshCw className={`w-3 h-3 ${isTesting ? 'animate-spin' : ''}`} />
                            <span>{isTesting ? 'Menguji...' : 'Uji Koneksi'}</span>
                          </button>
                        </div>
                      </div>

                      {/* API Key Input */}
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <input
                            type={isKeyVisible ? 'text' : 'password'}
                            value={activeKey}
                            onChange={(e) =>
                              setInputKeys((prev) => ({
                                ...prev,
                                [cfg.providerId]: e.target.value
                              }))
                            }
                            placeholder={`Masukkan API key untuk ${cfg.displayName} (atau biarkan kosong jika ada di .env: ${cfg.apiKeyEnvVar})`}
                            className="w-full pl-3 pr-10 py-2 rounded-xl bg-[#060c18] border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowKeys((prev) => ({
                                ...prev,
                                [cfg.providerId]: !isKeyVisible
                              }))
                            }
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 cursor-pointer"
                          >
                            {isKeyVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleSaveKey(cfg.providerId)}
                          className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors cursor-pointer"
                        >
                          Simpan
                        </button>
                      </div>

                      {/* Test feedback */}
                      {result && (
                        <div
                          className={`p-2.5 rounded-xl text-xs flex items-center justify-between ${
                            result.success
                              ? 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-950/40 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {result.success ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                            )}
                            <span>{result.message}</span>
                          </div>
                          {result.latency && (
                            <span className="text-[10px] font-mono text-slate-400">
                              {result.latency}ms
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'fallback' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#0c162b] border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" />
                      Auto Fallback System
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Jika model video yang dipilih mengalami kegagalan/timeout, sistem secara otomatis beralih ke model alternatif yang kompatibel tanpa menghentikan proses creator.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={autoFallback}
                      onChange={(e) => videoProviderRegistry.setAutoFallbackEnabled(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="pt-2 border-t border-slate-800/80 space-y-2 text-xs">
                  <div className="text-slate-300 font-semibold">Alur Fallback Default:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400">
                    <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="text-blue-400 font-bold">Seedance 2.0 Fast</span> → Veo 3.1 Fast Pro
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="text-pink-400 font-bold">Veo 3.1 Fast Pro</span> → Veo 3.1 Lite Pro
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="text-red-400 font-bold">Veo 3.1 Pro</span> → Veo 3.1 Fast Pro
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800">
                      <span className="text-sky-400 font-bold">Google Omni 1.1</span> → Seedance 2.0 Fast
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/20 text-xs text-amber-300 space-y-1.5">
                <div className="font-semibold flex items-center gap-1.5 text-amber-200">
                  <Info className="w-4 h-4" />
                  Pemberitahuan Transparan:
                </div>
                <p className="text-[11px] leading-relaxed">
                  Setiap kali fallback terjadi, notifikasi pop-up akan memberitahu Anda nama model asal, model pengganti, dan alasan kegagalan secara transparan.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#070d1a] flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-colors cursor-pointer shadow-lg shadow-blue-900/30"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
