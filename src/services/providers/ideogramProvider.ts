import { BaseImageProvider } from './baseProvider';
import {
  ImageGenerationOptions,
  InternalImageResult,
  ProviderTestResult,
  AIProviderConfig
} from '../../types/provider';

export class IdeogramProvider extends BaseImageProvider {
  constructor(config: AIProviderConfig) {
    super(config);
  }

  public async testConnection(): Promise<ProviderTestResult> {
    const startTime = Date.now();
    const apiKey = this.config.apiKey?.trim();

    if (!apiKey) {
      return {
        success: false,
        message: 'Kunci API belum diisi. Masukkan Ideogram API key untuk menguji koneksi.',
        providerId: this.config.providerId
      };
    }

    try {
      // First check server proxy test
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
          message: data.message || (data.success ? 'Koneksi ke Ideogram API berhasil terhubung!' : 'Koneksi gagal.'),
          latencyMs: Date.now() - startTime,
          providerId: this.config.providerId
        };
      }

      // Direct Ideogram API verification (/manage/api/user or ping)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await fetch('https://api.ideogram.ai/manage/api/user', {
        method: 'GET',
        headers: {
          'Api-Key': apiKey
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const latencyMs = Date.now() - startTime;

      if (res.status === 401 || res.status === 403) {
        return {
          success: false,
          message: 'Otorisasi gagal: API Key Ideogram tidak valid.',
          latencyMs,
          providerId: this.config.providerId
        };
      }

      if (res.ok) {
        return {
          success: true,
          message: `Koneksi berhasil terhubung ke Ideogram 4.0! (Latency: ${latencyMs}ms)`,
          latencyMs,
          providerId: this.config.providerId
        };
      }

      return {
        success: false,
        message: `Koneksi gagal (Status HTTP ${res.status}).`,
        latencyMs,
        providerId: this.config.providerId
      };
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        return {
          success: false,
          message: 'Koneksi timeout: Server Ideogram tidak merespons dalam 8 detik.',
          providerId: this.config.providerId
        };
      }
      return {
        success: false,
        message: err?.message || 'Gagal menghubungi server Ideogram.',
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
            throw this.createApiError('Ideogram API Key tidak valid atau telah kedaluwarsa.', 'INVALID_KEY');
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

      // Map aspect ratio for Ideogram
      let ideogramRatio = 'ASPECT_1_1';
      if (options.aspectRatio === '16:9') ideogramRatio = 'ASPECT_16_9';
      if (options.aspectRatio === '9:16') ideogramRatio = 'ASPECT_9_16';
      if (options.aspectRatio === '3:4') ideogramRatio = 'ASPECT_3_4';
      if (options.aspectRatio === '4:3') ideogramRatio = 'ASPECT_4_3';

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 40000);

      const requestPayload: Record<string, any> = {
        image_request: {
          prompt: options.prompt,
          aspect_ratio: ideogramRatio,
          model: 'V_2', // Ideogram V2 / 4.0 engine
          magic_prompt_option: 'AUTO'
        }
      };

      if (options.negativePrompt && options.negativePrompt.trim()) {
        requestPayload.image_request.negative_prompt = options.negativePrompt.trim();
      }

      const response = await fetch(this.config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': apiKey || ''
        },
        body: JSON.stringify(requestPayload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 401 || response.status === 403) {
          throw this.createApiError('API Key Ideogram tidak valid.', 'INVALID_KEY');
        }
        if (response.status === 429) {
          throw this.createApiError('Limit request Ideogram tercapai.', 'RATE_LIMIT');
        }
        throw this.createApiError(`Ideogram API error (${response.status}): ${errorText.slice(0, 150)}`);
      }

      const responseData = await response.json();
      const images: any[] = responseData.data || responseData.images || [];

      if (!images || images.length === 0) {
        throw this.createApiError('Provider tidak mengembalikan data gambar yang valid.');
      }

      return images.map((item, idx) => ({
        id: `ideogram-${Date.now()}-${idx}`,
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
      if (err.code) throw err;
      if (err.name === 'AbortError') {
        throw this.createApiError('Server provider sedang mengalami gangguan atau timeout.', 'TIMEOUT');
      }
      throw this.createApiError(err.message || 'Provider tidak dapat memproses permintaan.');
    }
  }
}
