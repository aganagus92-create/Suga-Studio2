import {
  AIProviderConfig,
  ImageGenerationOptions,
  InternalImageResult,
  ProviderId,
  ProviderTestResult,
  SmartRecommendation,
  GenerationError
} from '../../types/provider';
import { DEFAULT_PROVIDERS, SMART_RECOMMENDATIONS } from './defaultConfigs';
import { BaseImageProvider } from './baseProvider';
import { SeedreamProvider } from './seedreamProvider';
import { GPTImageProvider } from './gptImageProvider';
import { IdeogramProvider } from './ideogramProvider';
import { BananaProvider } from './bananaProvider';
import { LiteLLMProvider } from './litellmProvider';

const STORAGE_KEY_CONFIGS = 'suga_ai_provider_configs_v1';
const STORAGE_KEY_FALLBACK = 'suga_ai_provider_fallback_v1';
const STORAGE_KEY_ACTIVE_ID = 'suga_ai_active_provider_id_v1';

type Listener = () => void;

class ProviderRegistryManager {
  private providers: Map<ProviderId, BaseImageProvider> = new Map();
  private autoFallbackEnabled: boolean = true;
  private activeProviderId: ProviderId = 'seedream-5-pro';
  private listeners: Set<Listener> = new Set();
  private isInitialized: boolean = false;

  constructor() {
    this.init();
  }

  private init() {
    if (this.isInitialized) return;

    // 1. Load saved configs from localStorage
    let savedConfigs: Record<string, Partial<AIProviderConfig>> = {};
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CONFIGS);
      if (raw) savedConfigs = JSON.parse(raw);
    } catch {
      // ignore
    }

    // 2. Load auto-fallback preference
    try {
      const savedFallback = localStorage.getItem(STORAGE_KEY_FALLBACK);
      if (savedFallback !== null) {
        this.autoFallbackEnabled = savedFallback === 'true';
      }
    } catch {
      // ignore
    }

    // 3. Load active provider preference
    try {
      const savedActive = localStorage.getItem(STORAGE_KEY_ACTIVE_ID) as ProviderId;
      if (savedActive && DEFAULT_PROVIDERS.some((p) => p.providerId === savedActive)) {
        this.activeProviderId = savedActive;
      }
    } catch {
      // ignore
    }

    // 4. Instantiate provider adapters
    for (const def of DEFAULT_PROVIDERS) {
      const saved = savedConfigs[def.providerId] || {};
      const mergedConfig: AIProviderConfig = {
        ...def,
        ...saved,
        capabilities: def.capabilities, // keep capability definitions strictly intact
        apiKey: saved.apiKey !== undefined ? saved.apiKey : def.apiKey,
        isConnected: Boolean(saved.isConnected || (saved.apiKey && saved.apiKey.trim().length > 0))
      };

      let instance: BaseImageProvider;
      if (def.providerId === 'seedream-5-pro') {
        instance = new SeedreamProvider(mergedConfig);
      } else if (def.providerId.startsWith('gpt-image-')) {
        instance = new GPTImageProvider(mergedConfig);
      } else if (def.providerId === 'nano-banana-2') {
        instance = new BananaProvider(mergedConfig);
      } else if (def.providerId === 'litellm') {
        instance = new LiteLLMProvider(mergedConfig);
      } else {
        instance = new IdeogramProvider(mergedConfig);
      }

      this.providers.set(def.providerId, instance);
    }

    this.isInitialized = true;

    // 5. Fetch server status asynchronously to check if env vars exist
    this.checkServerEnvStatus();
  }

  private async checkServerEnvStatus() {
    try {
      const res = await fetch('/api/providers/status');
      if (res.ok) {
        const data = await res.json();
        if (data.providers && Array.isArray(data.providers)) {
          for (const serverP of data.providers) {
            const inst = this.providers.get(serverP.providerId);
            if (inst) {
              const current = inst.getConfig();
              if (serverP.hasEnvKey && !current.isConnected) {
                inst.updateConfig({ isConnected: true });
              }
            }
          }
          this.notify();
        }
      }
    } catch {
      // Dev server or static SPA fallback
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  private persist() {
    try {
      const toSave: Record<string, Partial<AIProviderConfig>> = {};
      this.providers.forEach((instance, id) => {
        const c = instance.getConfig();
        toSave[id] = {
          apiKey: c.apiKey,
          isConnected: c.isConnected,
          isEnabled: c.isEnabled,
          order: c.order,
          isDefault: c.isDefault
        };
      });
      localStorage.setItem(STORAGE_KEY_CONFIGS, JSON.stringify(toSave));
      localStorage.setItem(STORAGE_KEY_FALLBACK, String(this.autoFallbackEnabled));
      localStorage.setItem(STORAGE_KEY_ACTIVE_ID, this.activeProviderId);
    } catch {
      // Storage error safeguard
    }
    this.notify();
  }

  public getProviders(): AIProviderConfig[] {
    return Array.from(this.providers.values())
      .map((p) => p.getConfig())
      .sort((a, b) => a.order - b.order);
  }

  public getEnabledProviders(): AIProviderConfig[] {
    return this.getProviders().filter((p) => p.isEnabled);
  }

  public getProvider(id: ProviderId): BaseImageProvider | undefined {
    return this.providers.get(id);
  }

  public getActiveProvider(): BaseImageProvider {
    const p = this.providers.get(this.activeProviderId);
    if (p && p.getConfig().isEnabled) return p;
    // Fallback to first enabled provider
    const firstEnabled = this.getEnabledProviders()[0];
    if (firstEnabled) {
      return this.providers.get(firstEnabled.providerId)!;
    }
    return this.providers.get('seedream-5-pro')!;
  }

  public getActiveProviderId(): ProviderId {
    return this.getActiveProvider().getConfig().providerId;
  }

  public setActiveProviderId(id: ProviderId): void {
    if (this.providers.has(id)) {
      this.activeProviderId = id;
      this.persist();
    }
  }

  public updateProviderConfig(id: ProviderId, partial: Partial<AIProviderConfig>): void {
    const inst = this.providers.get(id);
    if (inst) {
      inst.updateConfig(partial);
      this.persist();
    }
  }

  public setProviderApiKey(id: ProviderId, key: string): void {
    const inst = this.providers.get(id);
    if (inst) {
      const cleanKey = key.trim();
      inst.updateConfig({
        apiKey: cleanKey,
        isConnected: cleanKey.length > 0
      });
      this.persist();
    }
  }

  public async testProviderConnection(id: ProviderId): Promise<ProviderTestResult> {
    const inst = this.providers.get(id);
    if (!inst) {
      return {
        success: false,
        message: 'Provider tidak ditemukan.',
        providerId: id
      };
    }
    const result = await inst.testConnection();
    inst.updateConfig({ isConnected: result.success });
    this.persist();
    return result;
  }

  public isAutoFallbackEnabled(): boolean {
    return this.autoFallbackEnabled;
  }

  public setAutoFallbackEnabled(val: boolean): void {
    this.autoFallbackEnabled = val;
    this.persist();
  }

  public setDefaultProvider(id: ProviderId): void {
    this.providers.forEach((p, pId) => {
      p.updateConfig({ isDefault: pId === id });
    });
    this.setActiveProviderId(id);
  }

  public reorderProviders(orderedIds: ProviderId[]): void {
    orderedIds.forEach((id, idx) => {
      const p = this.providers.get(id);
      if (p) {
        p.updateConfig({ order: idx + 1 });
      }
    });
    this.persist();
  }

  public getRecommendations(): SmartRecommendation[] {
    return SMART_RECOMMENDATIONS;
  }

  public recommendModelForPrompt(prompt: string): ProviderId {
    const p = prompt.toLowerCase();
    if (p.includes('cepat') || p.includes('fast') || p.includes('kilat') || p.includes('banana') || p.includes('draft') || p.includes('quick')) {
      return 'nano-banana-2';
    }
    if (p.includes('poster') || p.includes('teks') || p.includes('text') || p.includes('tulisan') || p.includes('typography') || p.includes('logo') || p.includes('banner')) {
      return 'ideogram-4';
    }
    if (p.includes('foto') || p.includes('photo') || p.includes('realistis') || p.includes('photorealistic') || p.includes('skincare') || p.includes('serum') || p.includes('produk') || p.includes('commercial')) {
      return 'seedream-5-pro';
    }
    if (p.includes('max') || p.includes('kualitas') || p.includes('detail') || p.includes('8k') || p.includes('masterpiece') || p.includes('cinema')) {
      return 'gpt-image-2-5-pro';
    }
    if (p.includes('kreatif') || p.includes('creative') || p.includes('anime') || p.includes('ilustrasi') || p.includes('art') || p.includes('konsep')) {
      return 'gpt-image-2';
    }
    return 'seedream-5-pro';
  }

  /**
   * Main generation method supporting auto fallback
   */
  public async generateWithFallback(
    options: ImageGenerationOptions,
    onFallbackNotify?: (msg: string) => void
  ): Promise<{ results: InternalImageResult[]; usedProvider: AIProviderConfig; fallbackOccurred: boolean }> {
    const primary = this.getActiveProvider();
    const primaryConfig = primary.getConfig();

    // Check if primary is configured
    if (!primary.isConfigured()) {
      // If auto-fallback is ON, look for an alternate provider that IS configured
      if (this.autoFallbackEnabled) {
        const alternates = this.getEnabledProviders().filter(
          (p) => p.providerId !== primaryConfig.providerId && (Boolean(p.apiKey) || p.isConnected)
        );

        if (alternates.length > 0) {
          const alternate = this.providers.get(alternates[0].providerId)!;
          const altConfig = alternate.getConfig();
          onFallbackNotify?.(
            `Model utama (${primaryConfig.displayName}) belum dikonfigurasi. Menggunakan model alternatif: ${altConfig.displayName}`
          );
          const results = await alternate.generate(options);
          return { results, usedProvider: altConfig, fallbackOccurred: true };
        }
      }

      // No fallback possible, throw not configured error
      throw {
        code: 'NOT_CONFIGURED',
        title: 'Provider Belum Dikonfigurasi',
        detail: `API Key belum dikonfigurasi untuk ${primaryConfig.displayName}. Silakan lengkapi konfigurasi API Key di Pengaturan Provider.`,
        providerId: primaryConfig.providerId,
        providerName: primaryConfig.displayName,
        modelId: primaryConfig.modelId,
        canRetry: false,
        canFallback: true,
        requiresSettings: true
      } as GenerationError;
    }

    try {
      const results = await primary.generate(options);
      return { results, usedProvider: primaryConfig, fallbackOccurred: false };
    } catch (primaryErr: any) {
      if (!this.autoFallbackEnabled) {
        throw primaryErr;
      }

      // Auto Fallback is ON: Find next enabled & configured provider
      const fallbackCandidates = this.getEnabledProviders().filter(
        (p) => p.providerId !== primaryConfig.providerId && (Boolean(p.apiKey) || p.isConnected)
      );

      if (fallbackCandidates.length === 0) {
        throw primaryErr;
      }

      for (const candidate of fallbackCandidates) {
        const altProvider = this.providers.get(candidate.providerId);
        if (!altProvider) continue;

        try {
          onFallbackNotify?.(
            `Primary provider (${primaryConfig.displayName}) failed. Trying alternate model (${candidate.displayName})...`
          );
          const results = await altProvider.generate(options);
          return { results, usedProvider: candidate, fallbackOccurred: true };
        } catch (altErr) {
          console.warn(`Fallback candidate ${candidate.displayName} also failed:`, altErr);
          // continue loop to next candidate
        }
      }

      // All fallbacks failed
      throw {
        code: 'FALLBACK_FAILED',
        title: 'Generation Failed (Semua Provider Gagal)',
        detail: `Provider utama (${primaryConfig.displayName}) dan provider alternatif tidak dapat memproses permintaan saat ini. Silakan coba lagi atau periksa kunci API Anda.`,
        providerId: primaryConfig.providerId,
        providerName: primaryConfig.displayName,
        modelId: primaryConfig.modelId,
        canRetry: true,
        canFallback: false,
        requiresSettings: false
      } as GenerationError;
    }
  }
}

export const providerRegistry = new ProviderRegistryManager();
