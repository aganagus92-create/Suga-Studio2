import React, { useState, useEffect } from 'react';
import {
  KeyRound,
  CheckCircle2,
  XCircle,
  AlertCircle,
  RefreshCw,
  Save,
  Trash2,
  Sliders,
  ShieldCheck,
  Sparkles,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Eye,
  EyeOff,
  Server,
  Zap,
  Info,
  Check
} from 'lucide-react';
import { AIProviderConfig, ProviderId, ProviderTestResult } from '../../types/provider';
import { providerRegistry } from '../../services/providers/providerRegistry';
import { ModelProviderBadge } from '../creator/ModelSelector';
import { SMART_RECOMMENDATIONS } from '../../services/providers/defaultConfigs';

interface ProviderManagerProps {
  onShowToast?: (message: string, type?: 'success' | 'error' | 'info') => void;
  isAdminMode?: boolean;
}

export const ProviderManager: React.FC<ProviderManagerProps> = ({
  onShowToast,
  isAdminMode = false
}) => {
  const [providers, setProviders] = useState<AIProviderConfig[]>([]);
  const [activeProviderId, setActiveProviderId] = useState<ProviderId>('seedream-5-pro');
  const [autoFallback, setAutoFallback] = useState<boolean>(true);
  const [keyInputs, setKeyInputs] = useState<Record<string, string>>({});
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [testingStatus, setTestingStatus] = useState<Record<string, boolean>>({});
  const [testResults, setTestResults] = useState<Record<string, ProviderTestResult | null>>({});
  const [saveSuccess, setSaveSuccess] = useState<Record<string, boolean>>({});

  const reloadData = () => {
    const list = providerRegistry.getProviders();
    setProviders(list);
    setActiveProviderId(providerRegistry.getActiveProviderId());
    setAutoFallback(providerRegistry.isAutoFallbackEnabled());

    const initialKeys: Record<string, string> = {};
    list.forEach((p) => {
      initialKeys[p.providerId] = p.apiKey || '';
    });
    setKeyInputs(initialKeys);
  };

  useEffect(() => {
    reloadData();
    const unsub = providerRegistry.subscribe(reloadData);
    return () => unsub();
  }, []);

  const handleKeyChange = (providerId: ProviderId, value: string) => {
    setKeyInputs((prev) => ({ ...prev, [providerId]: value }));
  };

  const handleToggleShowKey = (providerId: ProviderId) => {
    setShowKeys((prev) => ({ ...prev, [providerId]: !prev[providerId] }));
  };

  const handleSaveKey = (provider: AIProviderConfig) => {
    const key = keyInputs[provider.providerId] || '';
    providerRegistry.setProviderApiKey(provider.providerId, key);

    setSaveSuccess((prev) => ({ ...prev, [provider.providerId]: true }));
    setTimeout(() => {
      setSaveSuccess((prev) => ({ ...prev, [provider.providerId]: false }));
    }, 2500);

    onShowToast?.(
      key.trim().length > 0
        ? `Kunci API ${provider.displayName} berhasil disimpan.`
        : `Kunci API ${provider.displayName} dihapus.`,
      'success'
    );
  };

  const handleTestConnection = async (provider: AIProviderConfig) => {
    // Temporarily save current input if user typed one
    const currentInput = keyInputs[provider.providerId] || '';
    if (currentInput.trim()) {
      providerRegistry.setProviderApiKey(provider.providerId, currentInput);
    }

    setTestingStatus((prev) => ({ ...prev, [provider.providerId]: true }));
    setTestResults((prev) => ({ ...prev, [provider.providerId]: null }));

    try {
      const result = await providerRegistry.testProviderConnection(provider.providerId);
      setTestResults((prev) => ({ ...prev, [provider.providerId]: result }));

      if (result.success) {
        onShowToast?.(result.message, 'success');
      } else {
        onShowToast?.(result.message, 'error');
      }
    } catch (err: any) {
      const errorResult: ProviderTestResult = {
        success: false,
        message: err?.message || 'Gagal menghubungi server.',
        providerId: provider.providerId
      };
      setTestResults((prev) => ({ ...prev, [provider.providerId]: errorResult }));
      onShowToast?.(errorResult.message, 'error');
    } finally {
      setTestingStatus((prev) => ({ ...prev, [provider.providerId]: false }));
    }
  };

  const handleToggleEnable = (providerId: ProviderId, currentVal: boolean) => {
    providerRegistry.updateProviderConfig(providerId, { isEnabled: !currentVal });
    onShowToast?.(`Status model berhasil diperbarui.`, 'info');
  };

  const handleSetDefault = (providerId: ProviderId) => {
    providerRegistry.setDefaultProvider(providerId);
    onShowToast?.(`Model default diubah menjadi ${providerRegistry.getActiveProvider().getConfig().displayName}.`, 'success');
  };

  const handleMoveOrder = (idx: number, direction: 'up' | 'down') => {
    const list = [...providers];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;

    const temp = list[idx];
    list[idx] = list[targetIdx];
    list[targetIdx] = temp;

    providerRegistry.reorderProviders(list.map((p) => p.providerId));
    onShowToast?.('Urutan provider berhasil diperbarui.', 'info');
  };

  const handleClearKey = (providerId: ProviderId) => {
    setKeyInputs((prev) => ({ ...prev, [providerId]: '' }));
    providerRegistry.setProviderApiKey(providerId, '');
    setTestResults((prev) => ({ ...prev, [providerId]: null }));
    onShowToast?.('Kunci API dihapus.', 'info');
  };

  const handleToggleFallback = () => {
    const next = !autoFallback;
    setAutoFallback(next);
    providerRegistry.setAutoFallbackEnabled(next);
    onShowToast?.(`Auto Fallback ${next ? 'diaktifkan' : 'dinonaktifkan'}.`, 'info');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#0a1428] via-[#0b162d] to-[#070d1a] border border-blue-500/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Sliders className="w-4 h-4" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight font-heading">
              {isAdminMode ? 'Provider Manager (Admin & Developer)' : 'AI Provider Settings'}
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">
              MODULAR SERVICE
            </span>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Kelola konfigurasi API resmi untuk Seedream 5.0 Pro, GPT Image, Ideogram 4.0, serta Fast Model Nano Banana 2.
            Aplikasi ini terhubung langsung ke official API endpoint masing-masing provider dan menjamin integritas data gambar.
          </p>
        </div>

        {/* Global Auto-Fallback Toggle Card */}
        <div className="p-3 rounded-xl bg-[#070d1a]/80 border border-slate-800 flex items-center gap-3 shrink-0">
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-white">
              <ShieldCheck className={`w-3.5 h-3.5 ${autoFallback ? 'text-emerald-400' : 'text-slate-500'}`} />
              <span>Auto Fallback</span>
            </div>
            <p className="text-[10px] text-slate-400">
              {autoFallback ? 'Ganti model otomatis jika gagal' : 'Hanya gunakan model aktif'}
            </p>
          </div>

          <button
            type="button"
            onClick={handleToggleFallback}
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
              autoFallback ? 'bg-blue-600' : 'bg-slate-700'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                autoFallback ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Security & Configuration Notice */}
      <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 flex items-start gap-3 text-xs text-blue-200">
        <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-white">Prinsip Keamanan & Integritas API:</p>
          <p className="text-slate-300 leading-relaxed">
            Kunci API Anda tidak pernah dibagikan atau dipalsukan. Jika suatu model belum memiliki API Key (status <strong>Not Connected</strong>), generator akan menampilkan pemberitahuan konfigurasi dan tidak akan melakukan permintaan dummy.
            Anda juga dapat mendefinisikan environment variable server seperti <code className="text-blue-300 font-mono bg-blue-950/80 px-1 py-0.5 rounded">SEEDREAM_API_KEY</code>, <code className="text-blue-300 font-mono bg-blue-950/80 px-1 py-0.5 rounded">OPENAI_API_KEY</code>, atau <code className="text-blue-300 font-mono bg-blue-950/80 px-1 py-0.5 rounded">IDEOGRAM_API_KEY</code>.
          </p>
        </div>
      </div>

      {/* Provider List Cards */}
      <div className="space-y-4">
        {providers.map((provider, index) => {
          const isSelectedDefault = provider.providerId === activeProviderId;
          const isTesting = testingStatus[provider.providerId] || false;
          const testResult = testResults[provider.providerId];
          const hasSaved = saveSuccess[provider.providerId] || false;
          const isShowKey = showKeys[provider.providerId] || false;
          const currentKeyVal = keyInputs[provider.providerId] || '';

          return (
            <div
              key={provider.providerId}
              className={`p-5 rounded-2xl bg-[#091122]/90 border transition-all shadow-lg ${
                isSelectedDefault
                  ? 'border-blue-500/60 ring-1 ring-blue-500/20'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                {/* Left: Badge, Name, Model ID, Status */}
                <div className="flex items-center gap-3.5">
                  <ModelProviderBadge badgeType={provider.badgeType} className="w-12 h-12" />

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-white tracking-tight">
                        {provider.displayName}
                      </h3>

                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                        {provider.modelId}
                      </span>

                      {/* Connection status badge */}
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          provider.isConnected
                            ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/30'
                            : 'bg-slate-900 text-slate-400 border-slate-700'
                        }`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            provider.isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                          }`}
                        />
                        <span>{provider.isConnected ? 'Connected' : 'Not Connected'}</span>
                      </span>

                      {isSelectedDefault && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-600/20 text-blue-300 border border-blue-500/40">
                          DEFAULT MODEL
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-400">
                      {provider.description} &bull; Env: <span className="font-mono text-slate-300">{provider.apiKeyEnvVar}</span>
                    </p>
                  </div>
                </div>

                {/* Right: Actions (Set Default, Enable Toggle, Move Order) */}
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  {!isSelectedDefault && (
                    <button
                      type="button"
                      onClick={() => handleSetDefault(provider.providerId)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
                    >
                      Jadikan Default
                    </button>
                  )}

                  {/* Enable / Disable Checkbox */}
                  <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#060c18] border border-slate-800 text-xs text-slate-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={provider.isEnabled}
                      onChange={() => handleToggleEnable(provider.providerId, provider.isEnabled)}
                      className="rounded border-slate-700 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                    />
                    <span>Aktif</span>
                  </label>

                  {/* Move Up/Down Order */}
                  <div className="flex items-center gap-0.5 bg-[#060c18] border border-slate-800 rounded-xl p-0.5">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveOrder(index, 'up')}
                      className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                      title="Pindahkan ke atas"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === providers.length - 1}
                      onClick={() => handleMoveOrder(index, 'down')}
                      className="p-1 rounded text-slate-400 hover:text-white disabled:opacity-30 cursor-pointer"
                      title="Pindahkan ke bawah"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* API Key Configuration Form */}
              <div className="pt-4 space-y-3">
                <label className="block text-xs font-semibold text-slate-300">
                  Kunci API (Secret API Key)
                </label>

                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <KeyRound className="w-4 h-4" />
                    </div>

                    <input
                      type={isShowKey ? 'text' : 'password'}
                      value={currentKeyVal}
                      onChange={(e) => handleKeyChange(provider.providerId, e.target.value)}
                      placeholder={`Masukkan API key resmi untuk ${provider.displayName} (misal sk-...)`}
                      className="w-full pl-9 pr-10 py-2 rounded-xl bg-[#060c18] border border-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-xs text-white placeholder-slate-500 transition-all font-mono"
                    />

                    <button
                      type="button"
                      onClick={() => handleToggleShowKey(provider.providerId)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white cursor-pointer"
                      title={isShowKey ? 'Sembunyikan Kunci' : 'Tampilkan Kunci'}
                    >
                      {isShowKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Buttons: Test Connection, Save, Delete */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      disabled={isTesting}
                      onClick={() => handleTestConnection(provider)}
                      className="px-3.5 py-2 rounded-xl bg-[#0c162b] hover:bg-blue-900/30 border border-blue-500/30 text-blue-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin text-blue-400' : ''}`} />
                      <span>{isTesting ? 'Menguji...' : 'TEST CONNECTION'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSaveKey(provider)}
                      className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all cursor-pointer"
                    >
                      {hasSaved ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>TERSIMPAN</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-3.5 h-3.5" />
                          <span>SAVE</span>
                        </>
                      )}
                    </button>

                    {currentKeyVal && (
                      <button
                        type="button"
                        onClick={() => handleClearKey(provider.providerId)}
                        className="p-2 rounded-xl bg-slate-800/80 hover:bg-red-950/50 border border-slate-700 hover:border-red-500/40 text-slate-400 hover:text-red-300 transition-colors cursor-pointer"
                        title="Hapus Kunci"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Test Result Feedback Display */}
                {testResult && (
                  <div
                    className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs animate-in fade-in duration-150 ${
                      testResult.success
                        ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                        : 'bg-red-950/30 border-red-500/40 text-red-200'
                    }`}
                  >
                    {testResult.success ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    )}
                    <div className="min-w-0">
                      <p className="font-semibold">
                        {testResult.success ? 'Koneksi Berhasil!' : 'Koneksi Gagal'}
                        {testResult.latencyMs !== undefined && ` (${testResult.latencyMs}ms)`}
                      </p>
                      <p className="text-[11px] opacity-90 mt-0.5">{testResult.message}</p>
                    </div>
                  </div>
                )}

                {/* Capabilities & Specialties Pills */}
                <div className="flex items-center gap-1.5 flex-wrap pt-1 text-[11px] text-slate-400">
                  <span className="font-medium text-slate-400">Kemampuan:</span>
                  {provider.specialties.map((spec) => (
                    <span
                      key={spec}
                      className="px-2 py-0.5 rounded-md bg-slate-800/80 border border-slate-700/60 text-slate-300"
                    >
                      {spec}
                    </span>
                  ))}
                  {provider.capabilities.supportsNegativePrompt && (
                    <span className="px-2 py-0.5 rounded-md bg-purple-950/60 border border-purple-500/30 text-purple-300 font-medium">
                      Negative Prompt Support
                    </span>
                  )}
                  {provider.capabilities.supportsReferenceImages && (
                    <span className="px-2 py-0.5 rounded-md bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-medium">
                      Reference Image Support
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Smart Recommendation Rules Showcase */}
      <div className="p-5 rounded-2xl bg-[#091122]/90 border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-white">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold tracking-tight font-heading">
            Aturan Smart Model Recommendation ("Rekomendasi AI")
          </h3>
        </div>
        <p className="text-xs text-slate-400">
          Sistem secara cerdas merekomendasikan provider yang paling optimal berdasarkan instruksi prompt dan jenis pekerjaan kreatif Anda:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {SMART_RECOMMENDATIONS.map((rec) => (
            <div
              key={rec.category}
              className="p-3.5 rounded-xl bg-[#060c18] border border-slate-800 space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">{rec.title}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {providers.find((p) => p.providerId === rec.recommendedProviderId)?.displayName}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">{rec.description}</p>
              <p className="text-[10px] text-slate-500 italic">&ldquo;{rec.reason}&rdquo;</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
