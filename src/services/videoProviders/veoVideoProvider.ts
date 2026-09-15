import { BaseVideoProvider } from './baseVideoProvider';
import {
  AIVideoProviderConfig,
  VideoGenerationOptions,
  VideoJobResult,
  VideoProviderTestResult
} from '../../types/videoProvider';

export class VeoVideoProvider extends BaseVideoProvider {
  constructor(config: AIVideoProviderConfig) {
    super(config);
  }

  public async generateVideo(options: VideoGenerationOptions): Promise<VideoJobResult> {
    try {
      const response = await fetch('/api/video-providers/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId: this.config.providerId,
          modelId: this.config.modelId,
          apiKey: this.config.apiKey,
          options
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw {
          code: errorData.error || 'API_ERROR',
          title: `Gagal Generate Video (${this.config.displayName})`,
          detail: errorData.detail || errorData.message || 'Terjadi kesalahan saat memanggil API Google Veo Video.',
          providerId: this.config.providerId,
          providerName: this.config.displayName,
          modelId: this.config.modelId,
          canRetry: true,
          canFallback: true,
          requiresSettings: errorData.error === 'NOT_CONFIGURED'
        };
      }

      const data = await response.json();
      return data.job;
    } catch (err: any) {
      if (err.code) throw err;
      throw {
        code: 'API_ERROR',
        title: `Koneksi Terputus (${this.config.displayName})`,
        detail: err.message || 'Tidak dapat terhubung ke server backend proxy.',
        providerId: this.config.providerId,
        providerName: this.config.displayName,
        modelId: this.config.modelId,
        canRetry: true,
        canFallback: true,
        requiresSettings: false
      };
    }
  }

  public async pollJobStatus(jobId: string): Promise<VideoJobResult> {
    const response = await fetch(`/api/video-providers/job/${jobId}`);
    if (!response.ok) {
      throw new Error(`Gagal membaca status render job ${jobId}`);
    }
    const data = await response.json();
    return data.job;
  }

  public async testConnection(): Promise<VideoProviderTestResult> {
    const startTime = Date.now();
    try {
      const response = await fetch('/api/video-providers/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId: this.config.providerId,
          apiKey: this.config.apiKey
        })
      });

      const latencyMs = Date.now() - startTime;
      const data = await response.json();

      if (!response.ok || !data.success) {
        this.updateConfig({ isConnected: false });
        return {
          success: false,
          message: data.message || `Koneksi ke server ${this.config.displayName} gagal.`,
          latencyMs,
          providerId: this.config.providerId
        };
      }

      this.updateConfig({ isConnected: true });
      return {
        success: true,
        message: data.message || `Koneksi ke ${this.config.displayName} aktif!`,
        latencyMs: data.latencyMs || latencyMs,
        providerId: this.config.providerId
      };
    } catch (err: any) {
      this.updateConfig({ isConnected: false });
      return {
        success: false,
        message: err.message || 'Gagal menghubungi server.',
        latencyMs: Date.now() - startTime,
        providerId: this.config.providerId
      };
    }
  }
}
