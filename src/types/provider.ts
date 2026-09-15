export type ProviderId =
  | 'seedream-5-pro'
  | 'gpt-image-2-5-pro'
  | 'gpt-image-2-5-extra'
  | 'gpt-image-2'
  | 'ideogram-4'
  | 'nano-banana-2'
  | 'litellm';

export type ProviderBadgeType =
  | 'seedream'
  | 'openai-pro'
  | 'openai-extra'
  | 'openai-2'
  | 'ideogram'
  | 'banana'
  | 'litellm'
  | 'koboillm';

export type AspectRatioType = '1:1' | '16:9' | '9:16' | '2:3' | '3:4' | '4:3';

export type QualityType = 'standard' | 'hd' | 'max';

export interface ImageGenerationOptions {
  prompt: string;
  negativePrompt?: string;
  aspectRatio: AspectRatioType;
  width?: number;
  height?: number;
  quality?: QualityType;
  numberOfImages: number;
  referenceImages?: string[];
}

export interface InternalImageResult {
  id: string;
  provider: string; // providerId
  model: string;    // modelId
  imageUrl?: string;
  width: number;
  height: number;
  prompt: string;
  createdAt: string;
  status: 'completed' | 'failed';
  ratio: AspectRatioType;
  size: string;
  cost?: number;
  error?: string;
}

export interface ProviderCapability {
  supportsPrompt: boolean;
  supportsNegativePrompt: boolean;
  supportsReferenceImages: boolean;
  supportsTextRendering: boolean;
  supportsHighQuality: boolean;
  photorealistic: boolean;
  creativeGeneration: boolean;
  typography: boolean;
  unsupportedFeaturesTooltip?: Record<string, string>;
}

export interface AIProviderConfig {
  providerId: ProviderId;
  modelId: string;
  displayName: string;
  description: string;
  label: string;
  badgeType: ProviderBadgeType;
  apiEndpoint: string;
  apiKeyEnvVar: string;
  apiKey?: string; // Optional user-saved key (masked in UI)
  isConnected: boolean;
  isEnabled: boolean;
  isDefault?: boolean;
  order: number;
  supportedSizes: string[];
  supportedAspectRatios: AspectRatioType[];
  qualitySettings: QualityType[];
  capabilities: ProviderCapability;
  specialties: string[];
  modelGroup?: 'FAST' | 'STANDARD' | 'LEGACY';
  recommendedCategory?: 'photorealistic' | 'max_quality' | 'creative' | 'typography';
}

export interface ProviderTestResult {
  success: boolean;
  message: string;
  latencyMs?: number;
  providerId: ProviderId;
}

export interface GenerationError {
  code: 'NOT_CONFIGURED' | 'API_ERROR' | 'TIMEOUT' | 'INVALID_KEY' | 'RATE_LIMIT' | 'FALLBACK_FAILED';
  title: string;
  detail: string;
  providerId: ProviderId;
  providerName: string;
  modelId: string;
  canRetry: boolean;
  canFallback: boolean;
  requiresSettings: boolean;
}

export interface SmartRecommendation {
  category: 'photorealistic' | 'max_quality' | 'creative' | 'typography';
  title: string;
  description: string;
  recommendedProviderId: ProviderId;
  reason: string;
}
