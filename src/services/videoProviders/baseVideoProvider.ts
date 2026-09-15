import {
  AIVideoProviderConfig,
  VideoGenerationOptions,
  VideoJobResult,
  VideoProviderTestResult
} from '../../types/videoProvider';

export abstract class BaseVideoProvider {
  protected config: AIVideoProviderConfig;

  constructor(config: AIVideoProviderConfig) {
    this.config = { ...config };
  }

  public getConfig(): AIVideoProviderConfig {
    return { ...this.config };
  }

  public updateConfig(updates: Partial<AIVideoProviderConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  public get providerId() {
    return this.config.providerId;
  }

  public get displayName() {
    return this.config.displayName;
  }

  public get isEnabled() {
    return this.config.isEnabled;
  }

  public get capabilities() {
    return this.config.capabilities;
  }

  public isConfigured(): boolean {
    return Boolean(this.config.apiKey && this.config.apiKey.trim().length > 0) || this.config.isConnected;
  }

  /**
   * Main video generation method
   */
  public abstract generateVideo(options: VideoGenerationOptions): Promise<VideoJobResult>;

  /**
   * Test connection to provider API
   */
  public abstract testConnection(): Promise<VideoProviderTestResult>;

  /**
   * Poll video job status for asynchronous completion
   */
  public abstract pollJobStatus(jobId: string): Promise<VideoJobResult>;
}
