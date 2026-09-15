import {
  AIVideoProviderConfig,
  VideoGenerationOptions,
  VideoJobResult,
  VideoProviderId,
  VideoProviderTestResult
} from '../../types/videoProvider';
import { BaseVideoProvider } from './baseVideoProvider';
import { DEFAULT_VIDEO_PROVIDER_CONFIGS } from './defaultVideoConfigs';
import { SeedanceVideoProvider } from './seedanceVideoProvider';
import { VeoVideoProvider } from './veoVideoProvider';
import { GoogleOmniVideoProvider } from './googleOmniVideoProvider';
import { HappyHorseVideoProvider } from './happyHorseVideoProvider';

const VIDEO_STORAGE_KEY_CONFIGS = 'creator_studio_video_provider_configs_v1';
const VIDEO_STORAGE_KEY_ACTIVE = 'creator_studio_active_video_provider_v1';
const VIDEO_STORAGE_KEY_FALLBACK = 'creator_studio_video_auto_fallback_v1';

class VideoProviderRegistryManager {
  private providers: Map<VideoProviderId, BaseVideoProvider> = new Map();
  private activeProviderId: VideoProviderId = 'seedance-2-0-fast-pro';
  private autoFallbackEnabled: boolean = true;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.initProviders();
  }

  private initProviders() {
    let storedConfigs: AIVideoProviderConfig[] = [];
    try {
      const raw = localStorage.getItem(VIDEO_STORAGE_KEY_CONFIGS);
      if (raw) storedConfigs = JSON.parse(raw);
    } catch {
      // ignore
    }

    try {
      const rawFallback = localStorage.getItem(VIDEO_STORAGE_KEY_FALLBACK);
      if (rawFallback !== null) this.autoFallbackEnabled = JSON.parse(rawFallback);
    } catch {
      // ignore
    }

    // Merge default with stored configs
    const configsMap = new Map<VideoProviderId, AIVideoProviderConfig>();
    DEFAULT_VIDEO_PROVIDER_CONFIGS.forEach((cfg) => configsMap.set(cfg.providerId, { ...cfg }));
    storedConfigs.forEach((stored) => {
      if (configsMap.has(stored.providerId)) {
        const merged = { ...configsMap.get(stored.providerId)!, ...stored };
        configsMap.set(stored.providerId, merged);
      }
    });

    // Instantiate adapters
    configsMap.forEach((cfg) => {
      let adapter: BaseVideoProvider;
      if (cfg.providerId === 'seedance-2-0-fast-pro') {
        adapter = new SeedanceVideoProvider(cfg);
      } else if (cfg.providerId.startsWith('veo-')) {
        adapter = new VeoVideoProvider(cfg);
      } else if (cfg.providerId === 'google-omni-1-1') {
        adapter = new GoogleOmniVideoProvider(cfg);
      } else if (cfg.providerId === 'happy-horse-1-0') {
        adapter = new HappyHorseVideoProvider(cfg);
      } else {
        adapter = new SeedanceVideoProvider(cfg);
      }
      this.providers.set(cfg.providerId, adapter);
    });

    // Active provider
    try {
      const storedActive = localStorage.getItem(VIDEO_STORAGE_KEY_ACTIVE);
      if (storedActive && this.providers.has(storedActive as VideoProviderId)) {
        this.activeProviderId = storedActive as VideoProviderId;
      }
    } catch {
      // ignore
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((fn) => fn());
    this.persist();
  }

  private persist() {
    try {
      const configs = Array.from(this.providers.values()).map((p) => p.getConfig());
      localStorage.setItem(VIDEO_STORAGE_KEY_CONFIGS, JSON.stringify(configs));
      localStorage.setItem(VIDEO_STORAGE_KEY_ACTIVE, this.activeProviderId);
      localStorage.setItem(VIDEO_STORAGE_KEY_FALLBACK, JSON.stringify(this.autoFallbackEnabled));
    } catch {
      // ignore
    }
  }

  public getAllProviders(): BaseVideoProvider[] {
    return Array.from(this.providers.values()).sort(
      (a, b) => a.getConfig().order - b.getConfig().order
    );
  }

  public getProvider(id: VideoProviderId): BaseVideoProvider | undefined {
    return this.providers.get(id);
  }

  public getActiveProvider(): BaseVideoProvider {
    const p = this.providers.get(this.activeProviderId);
    if (p && p.isEnabled) return p;
    // Fallback to first enabled
    for (const prov of this.providers.values()) {
      if (prov.isEnabled) {
        this.activeProviderId = prov.providerId;
        return prov;
      }
    }
    return this.providers.values().next().value;
  }

  public setActiveProvider(id: VideoProviderId): void {
    if (this.providers.has(id)) {
      this.activeProviderId = id;
      this.notify();
    }
  }

  public isAutoFallbackEnabled(): boolean {
    return this.autoFallbackEnabled;
  }

  public setAutoFallbackEnabled(enabled: boolean): void {
    this.autoFallbackEnabled = enabled;
    this.notify();
  }

  public updateProviderConfig(id: VideoProviderId, updates: Partial<AIVideoProviderConfig>): void {
    const p = this.providers.get(id);
    if (p) {
      p.updateConfig(updates);
      this.notify();
    }
  }

  public setCustomApiKey(id: VideoProviderId, apiKey: string): void {
    this.updateProviderConfig(id, { apiKey: apiKey.trim(), isConnected: Boolean(apiKey.trim()) });
  }

  public async testProviderConnection(id: VideoProviderId): Promise<VideoProviderTestResult> {
    const p = this.providers.get(id);
    if (!p) {
      return { success: false, message: 'Provider video tidak ditemukan', providerId: id };
    }
    const result = await p.testConnection();
    this.notify();
    return result;
  }

  /**
   * Generates video with auto-fallback support
   */
  public async generateVideoWithFallback(
    options: VideoGenerationOptions,
    onFallbackNotice?: (fromModel: string, toModel: string, reason: string) => void
  ): Promise<VideoJobResult> {
    const primary = this.getActiveProvider();

    try {
      return await primary.generateVideo(options);
    } catch (primaryErr: any) {
      if (!this.autoFallbackEnabled) {
        throw primaryErr;
      }

      // Check configured fallback or choose secondary
      const fallbackId = primary.getConfig().fallbackProviderId;
      let fallbackProvider = fallbackId ? this.providers.get(fallbackId) : undefined;

      if (!fallbackProvider || !fallbackProvider.isEnabled) {
        // Find next enabled provider
        for (const p of this.providers.values()) {
          if (p.providerId !== primary.providerId && p.isEnabled) {
            fallbackProvider = p;
            break;
          }
        }
      }

      if (!fallbackProvider) {
        throw primaryErr;
      }

      // Notify caller about fallback
      if (onFallbackNotice) {
        onFallbackNotice(
          primary.displayName,
          fallbackProvider.displayName,
          primaryErr.detail || primaryErr.message || 'Primary provider error'
        );
      }

      try {
        return await fallbackProvider.generateVideo(options);
      } catch (fallbackErr: any) {
        throw {
          code: 'FALLBACK_FAILED',
          title: 'Semua Provider Video Gagal Diproses',
          detail: `Provider utama (${primary.displayName}) dan alternatif (${fallbackProvider.displayName}) mengalami kendala: ${fallbackErr.detail || fallbackErr.message}`,
          providerId: primary.providerId,
          providerName: primary.displayName,
          modelId: primary.getConfig().modelId,
          canRetry: true,
          canFallback: false,
          requiresSettings: true
        };
      }
    }
  }

  /**
   * Enhances motion prompt for cinematic realism and temporal consistency
   */
  public enhanceMotionPrompt(originalPrompt: string): string {
    const clean = originalPrompt.trim();
    if (!clean) {
      return 'Cinematic slow push-in toward the subject, natural subtle motion, gentle ambient movement, high temporal consistency, soft volumetric lighting.';
    }

    const lower = clean.toLowerCase();

    // Contextual motion enhancement
    if (lower.includes('jalan') || lower.includes('walk') || lower.includes('langkah')) {
      return `Cinematic realistic shot of ${clean}, natural smooth forward stride, subtle cloth aerodynamics, gentle rhythmic footsteps, smooth tracking camera movement, realistic physics, consistent facial features and lighting.`;
    }

    if (lower.includes('orang') || lower.includes('wajah') || lower.includes('face') || lower.includes('portrait') || lower.includes('tatap') || lower.includes('senyum')) {
      return `Subject ${clean}, subtle natural facial expressions, gentle blinking and lifelike eye focus, soft hair swaying in atmospheric breeze, realistic breathing motion, cinematic 35mm lens depth of field, natural golden-hour lighting.`;
    }

    if (lower.includes('mobil') || lower.includes('car') || lower.includes('kendaraan') || lower.includes('drive')) {
      return `High-speed cinematic tracking shot of ${clean}, asphalt reflections, dynamic camera dolly beside vehicle, realistic motion blur at 24fps, cinematic anamorphic flares, hyper-detailed automotive texture.`;
    }

    if (lower.includes('produk') || lower.includes('botol') || lower.includes('product') || lower.includes('skincare')) {
      return `High-end commercial showcase of ${clean}, smooth 360-degree orbital camera rotation, luxury volumetric rim lighting, crisp optical reflections, micro-droplets on surface, studio grade photorealism.`;
    }

    if (lower.includes('alam') || lower.includes('nature') || lower.includes('hutan') || lower.includes('laut') || lower.includes('pantai') || lower.includes('gunung')) {
      return `Breathtaking sweeping drone glide over ${clean}, gentle organic wind rippling across landscape, slow majestic clouds drifting, atmospheric depth haze, cinematic nature documentary grade.`;
    }

    return `Cinematic photorealistic shot of ${clean}, natural subtle motion, smooth camera push-in toward subject, high temporal stability, soft cinematic lighting, zero jitter, authentic physical cadence.`;
  }
}

export const videoProviderRegistry = new VideoProviderRegistryManager();
