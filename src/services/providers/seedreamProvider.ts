import { BaseImageProvider } from './baseProvider';
import {
  ImageGenerationOptions,
  InternalImageResult,
  ProviderTestResult,
  AIProviderConfig
} from '../../types/provider';

export class SeedreamProvider extends BaseImageProvider {
  constructor(config: AIProviderConfig) {
    super(config);
  }

  public async testConnection(): Promise<ProviderTestResult> {
    const startTime = Date.now();
    const apiKey = this.config.apiKey?.trim();

    if (!apiKey) {
      return {
        success: false,
        message: 'Kunci API belum diisi. Masukkan API key Seedream untuk menguji koneksi.',
        providerId: this.config.providerId
      };
    }

    try {
      // First try server proxy test if available
      const serverRes = await fetch('/api/providers/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId: this.config.providerId,
          apiKey: apiKey
        })
      }).catch(() => null);

      if (serverRes && serverRes.ok) {
        const data = await serverRes.json();
        return {
          success: data.success,
          message: data.message || (data.success ? 'Koneksi ke Seedream API berhasil terhubung!' : 'Koneksi gagal.'),
          latencyMs: Date.now() - startTime,
          providerId: this.config.providerId
        };
      }

      // Direct ping check to Seedream endpoint
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(this.config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: this.config.modelId,
          prompt: 'Connection test',
          n: 1,
          size: '512x512',
          test_only: true
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      const latencyMs = Date.now() - startTime;

      if (res.status === 401 || res.status === 403) {
        return {
          success: false,
          message: 'Otorisasi gagal: API Key Seedream tidak valid.',
          latencyMs,
          providerId: this.config.providerId
        };
      }

      if (res.ok || res.status === 400 || res.status === 422) {
        // HTTP 400 with auth accepted means API key is recognized
        return {
          success: true,
          message: `Koneksi berhasil terhubung ke Seedream 5.0 Pro! (Latency: ${latencyMs}ms)`,
          latencyMs,
          providerId: this.config.providerId
        };
      }

      return {
        success: false,
        message: `Koneksi gagal (Status HTTP ${res.status}). Server endpoint tidak merespons dengan benar.`,
        latencyMs,
        providerId: this.config.providerId
      };
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        return {
          success: false,
          message: 'Koneksi timeout: Server Seedream tidak merespons dalam 8 detik.',
          providerId: this.config.providerId
        };
      }
      return {
        success: false,
        message: err?.message || 'Gagal menghubungi server Seedream.',
        providerId: this.config.providerId
      };
    }
  }

  public async generate(options: ImageGenerationOptions): Promise<InternalImageResult[]> {
    if (!this.isConfigured()) {
      throw this.createNotConfiguredError();
    }

    const apiKey = this.config.apiKey?.trim();
    const resolution = this.getResolution(options.aspectRatio);

    try {
      // Check server proxy first
      const serverRes = await fetch('/api/providers/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId: this.config.providerId,
          modelId: this.config.modelId,
          apiKey,
          options
        })
      }).catch(() => null);

      if (serverRes) {
        if (!serverRes.ok) {
          const errData = await serverRes.json().catch(() => ({}));
          if (serverRes.status === 401) {
            throw this.createApiError('API Key Seedream tidak valid atau telah kedaluwarsa.', 'INVALID_KEY');
          }
          if (serverRes.status === 504 || errData.code === 'TIMEOUT') {
            throw this.createApiError('Server provider sedang mengalami gangguan atau timeout.', 'TIMEOUT');
          }
          throw this.createApiError(errData.detail || errData.error || 'Provider tidak dapat memproses permintaan.');
        }

        const data = await serverRes.json();
        if (data.results && Array.isArray(data.results)) {
          return data.results;
        }
      }

      // Direct call fallback if server proxy route is unavailable
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 35000);

      const requestBody: Record<string, any> = {
        model: this.config.modelId,
        prompt: options.prompt,
        n: options.numberOfImages || 1,
        size: `${resolution.width}x${resolution.height}`,
        quality: options.quality || 'standard'
      };

      if (options.referenceImages && options.referenceImages.length > 0) {
        requestBody.reference_images = options.referenceImages;
      }

      const response = await fetch(this.config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 401 || response.status === 403) {
          throw this.createApiError('API Key Seedream tidak valid atau otorisasi ditolak.', 'INVALID_KEY');
        }
        if (response.status === 429) {
          throw this.createApiError('Batas kuota request tercapai (Rate Limit exceeded). Silakan tunggu sebentar.', 'RATE_LIMIT');
        }
        throw this.createApiError(`Provider Seedream error (${response.status}): ${errorText.slice(0, 150)}`);
      }

      const responseData = await response.json();
      const images: any[] = responseData.data || responseData.images || [];

      if (!images || images.length === 0) {
        throw this.createApiError('Provider tidak mengembalikan data gambar yang valid.');
      }

      return images.map((item, idx) => ({
        id: `seedream-${Date.now()}-${idx}`,
        provider: this.config.providerId,
        model: this.config.modelId,
        imageUrl: item.url || (item.b64_json ? `data:image/png;base64,${item.b64_json}` : undefined),
        width: resolution.width,
        height: resolution.height,
        prompt: options.prompt,
        createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        status: 'completed',
        ratio: options.aspectRatio,
        size: resolution.sizeStr,
        cost: 5 * (options.numberOfImages || 1)
      }));
    } catch (err: any) {
      if (err.code) throw err; // Already a GenerationError
      if (err.name === 'AbortError') {
        throw this.createApiError('Server provider sedang mengalami gangguan atau timeout.', 'TIMEOUT');
      }
      throw this.createApiError(err.message || 'Provider tidak dapat memproses permintaan.');
    }
  }
}
