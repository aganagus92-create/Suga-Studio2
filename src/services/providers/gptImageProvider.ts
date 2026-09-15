import { BaseImageProvider } from './baseProvider';
import {
  ImageGenerationOptions,
  InternalImageResult,
  ProviderTestResult,
  AIProviderConfig
} from '../../types/provider';

export class GPTImageProvider extends BaseImageProvider {
  constructor(config: AIProviderConfig) {
    super(config);
  }

  public async testConnection(): Promise<ProviderTestResult> {
    const startTime = Date.now();
    const apiKey = this.config.apiKey?.trim();

    if (!apiKey) {
      return {
        success: false,
        message: 'Kunci API belum diisi. Masukkan OpenAI API key untuk menguji koneksi.',
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
          message: data.message || (data.success ? `Koneksi ke ${this.config.displayName} berhasil terhubung!` : 'Koneksi gagal.'),
          latencyMs: Date.now() - startTime,
          providerId: this.config.providerId
        };
      }

      // Direct OpenAI API validation (/v1/models)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await fetch('https://api.openai.com/v1/models', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${apiKey}`
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      const latencyMs = Date.now() - startTime;

      if (res.status === 401) {
        return {
          success: false,
          message: 'Otorisasi gagal: OpenAI API Key tidak valid.',
          latencyMs,
          providerId: this.config.providerId
        };
      }

      if (res.ok) {
        return {
          success: true,
          message: `Koneksi berhasil terhubung ke ${this.config.displayName}! (Latency: ${latencyMs}ms)`,
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
          message: 'Koneksi timeout: Server OpenAI tidak merespons dalam 8 detik.',
          providerId: this.config.providerId
        };
      }
      return {
        success: false,
        message: err?.message || 'Gagal menghubungi server OpenAI.',
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
            throw this.createApiError('OpenAI API Key tidak valid atau telah kedaluwarsa.', 'INVALID_KEY');
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

      // Map aspect ratio to standard OpenAI sizes
      let sizeStr = '1024x1024';
      if (options.aspectRatio === '16:9') sizeStr = '1792x1024';
      if (options.aspectRatio === '9:16') sizeStr = '1024x1792';

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 40000);

      // Model mapping for OpenAI standard API
      const openAiModel = this.config.modelId === 'gpt-image-2' ? 'dall-e-2' : 'dall-e-3';

      const response = await fetch(this.config.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: openAiModel,
          prompt: options.prompt,
          n: openAiModel === 'dall-e-3' ? 1 : Math.min(options.numberOfImages || 1, 4),
          size: sizeStr,
          quality: options.quality === 'max' ? 'hd' : 'standard',
          response_format: 'url'
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errMsg = errorData?.error?.message || response.statusText;

        if (response.status === 401) {
          throw this.createApiError('API Key OpenAI tidak valid.', 'INVALID_KEY');
        }
        if (response.status === 429) {
          throw this.createApiError('Batas limit OpenAI tercapai (Rate Limit / Quota Exceeded).', 'RATE_LIMIT');
        }
        throw this.createApiError(`OpenAI API error (${response.status}): ${errMsg}`);
      }

      const responseData = await response.json();
      const images: any[] = responseData.data || [];

      if (!images || images.length === 0) {
        throw this.createApiError('Provider tidak mengembalikan data gambar yang valid.');
      }

      return images.map((item, idx) => ({
        id: `openai-${Date.now()}-${idx}`,
        provider: this.config.providerId,
        model: this.config.modelId,
        imageUrl: item.url || (item.b64_json ? `data:image/png;base64,${item.b64_json}` : undefined),
        width: resolution.width,
        height: resolution.height,
        prompt: item.revised_prompt || options.prompt,
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
