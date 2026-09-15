export interface LiteLLMModel {
  id: string;
  name?: string;
  displayName?: string;
  object?: string;
  created?: number;
  owned_by?: string;
  provider?: string;
  description?: string;
  category?: 'fast' | 'image' | 'llm' | 'vision' | 'video';
  isFast?: boolean;
  group?: string;
  latency?: string;
  isLiveFetched?: boolean;
}

export interface LiteLLMConfig {
  baseUrl: string;
  apiKey?: string;
  isConnected: boolean;
  selectedModelId: string;
  totalModels: number;
  lastFetched?: string;
  error?: string;
}

export interface LiteLLMTestResult {
  success: boolean;
  message: string;
  latencyMs?: number;
  modelCount?: number;
  models?: LiteLLMModel[];
}
