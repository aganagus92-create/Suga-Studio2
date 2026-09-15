import {
  AIProviderConfig,
  ImageGenerationOptions,
  InternalImageResult,
  ProviderCapability,
  ProviderTestResult,
  GenerationError
} from '../../types/provider';

export abstract class BaseImageProvider {
  protected config: AIProviderConfig;

  constructor(config: AIProviderConfig) {
    this.config = config;
  }

  public getConfig(): AIProviderConfig {
    return { ...this.config };
  }

  public updateConfig(partial: Partial<AIProviderConfig>): void {
    this.config = { ...this.config, ...partial };
  }

  public getCapabilities(): ProviderCapability {
    return this.config.capabilities;
  }

  public isConfigured(): boolean {
    return Boolean(this.config.apiKey && this.config.apiKey.trim().length > 0) || this.config.isConnected;
  }

  public abstract generate(options: ImageGenerationOptions): Promise<InternalImageResult[]>;

  public abstract testConnection(): Promise<ProviderTestResult>;

  protected createNotConfiguredError(): GenerationError {
    return {
      code: 'NOT_CONFIGURED',
      title: 'Provider Belum Dikonfigurasi',
      detail: `API Key belum dikonfigurasi untuk provider ${this.config.displayName}. Silakan masukkan kunci API Anda di Pengaturan Provider.`,
      providerId: this.config.providerId,
      providerName: this.config.displayName,
      modelId: this.config.modelId,
      canRetry: false,
      canFallback: true,
      requiresSettings: true
    };
  }

  protected createApiError(detail: string, code: GenerationError['code'] = 'API_ERROR'): GenerationError {
    return {
      code,
      title: code === 'TIMEOUT' ? 'Server Timeout' : 'Generation Failed',
      detail: detail || 'Provider tidak dapat memproses permintaan.',
      providerId: this.config.providerId,
      providerName: this.config.displayName,
      modelId: this.config.modelId,
      canRetry: true,
      canFallback: true,
      requiresSettings: code === 'INVALID_KEY'
    };
  }

  protected getResolution(ratio: string): { width: number; height: number; sizeStr: string } {
    switch (ratio) {
      case '16:9':
        return { width: 1792, height: 1024, sizeStr: '1792×1024' };
      case '9:16':
        return { width: 1024, height: 1792, sizeStr: '1024×1792' };
      case '2:3':
        return { width: 1024, height: 1536, sizeStr: '1024×1536' };
      case '3:4':
        return { width: 1024, height: 1365, sizeStr: '1024×1365' };
      case '4:3':
        return { width: 1365, height: 1024, sizeStr: '1365×1024' };
      case '1:1':
      default:
        return { width: 1024, height: 1024, sizeStr: '1024×1024' };
    }
  }
}
