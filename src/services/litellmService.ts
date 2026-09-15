import { LiteLLMModel, LiteLLMConfig, LiteLLMTestResult } from '../types/litellm';

const STORAGE_KEY_KEY = 'suga_ai_litellm_api_key_v1';
const STORAGE_KEY_MODEL = 'suga_ai_litellm_active_model_v1';
const STORAGE_KEY_MODELS = 'suga_ai_litellm_cached_models_v1';

export const DEFAULT_LITELLM_BASE_URL = 'https://api.koboillm.com/v1';

export const CURATED_FALLBACK_MODELS: LiteLLMModel[] = [
  // Fast Models
  {
    id: 'nano-banana-2',
    displayName: 'Nano Banana 2',
    description: 'Ultra Fast Generation (~1.5s) • High Quality Drafts',
    category: 'fast',
    owned_by: 'koboillm-fast'
  },
  {
    id: 'flux-schnell',
    displayName: 'FLUX.1 Schnell',
    description: 'Black Forest Labs • 4-step ultra high speed visual generation',
    category: 'fast',
    owned_by: 'black-forest-labs'
  },
  {
    id: 'sdxl-turbo',
    displayName: 'SDXL Turbo',
    description: 'Real-time 1-step diffusion model for instant creativity',
    category: 'fast',
    owned_by: 'stabilityai'
  },
  {
    id: 'gpt-4o-mini',
    displayName: 'GPT-4o Mini',
    description: 'OpenAI fast compact multimodal model',
    category: 'fast',
    owned_by: 'openai'
  },
  // Image Generation Models
  {
    id: 'dall-e-3',
    displayName: 'DALL-E 3 Pro',
    description: 'OpenAI premium photorealistic visual model with text adherence',
    category: 'image',
    owned_by: 'openai'
  },
  {
    id: 'dall-e-2',
    displayName: 'DALL-E 2 Standard',
    description: 'OpenAI classic image generation model',
    category: 'image',
    owned_by: 'openai'
  },
  {
    id: 'flux-dev',
    displayName: 'FLUX.1 Dev',
    description: 'Flagship open-weight visual synthesis model for commercial work',
    category: 'image',
    owned_by: 'black-forest-labs'
  },
  {
    id: 'seedream-5-pro',
    displayName: 'Seedream 5.0 Pro',
    description: 'Cinematic lighting & commercial photorealism engine',
    category: 'image',
    owned_by: 'seedream'
  },
  {
    id: 'ideogram-v2',
    displayName: 'Ideogram 2.0',
    description: 'Superior typography, logo rendering & graphic composition',
    category: 'image',
    owned_by: 'ideogram'
  },
  {
    id: 'midjourney-v6',
    displayName: 'Midjourney v6.1 Proxy',
    description: 'Artistic composition, dramatic textures, and cinematic depth',
    category: 'image',
    owned_by: 'midjourney'
  },
  {
    id: 'stable-diffusion-3-medium',
    displayName: 'Stable Diffusion 3 Medium',
    description: 'Multimodal Diffusion Transformer architecture',
    category: 'image',
    owned_by: 'stabilityai'
  },
  // Multimodal & Text / Scriptwriting LLMs
  {
    id: 'gpt-4o',
    displayName: 'GPT-4o Flagship',
    description: 'Advanced vision & prompt storytelling intelligence',
    category: 'llm',
    owned_by: 'openai'
  },
  {
    id: 'claude-3-5-sonnet',
    displayName: 'Claude 3.5 Sonnet',
    description: 'Anthropic leading model for narrative nuance and creative scripts',
    category: 'llm',
    owned_by: 'anthropic'
  },
  {
    id: 'deepseek-chat',
    displayName: 'DeepSeek-V3',
    description: 'High performance open weights LLM for prompt expansion',
    category: 'llm',
    owned_by: 'deepseek'
  },
  {
    id: 'deepseek-r1',
    displayName: 'DeepSeek R1',
    description: 'State-of-the-art reasoning model for complex creative planning',
    category: 'llm',
    owned_by: 'deepseek'
  },
  {
    id: 'gemini-1.5-pro',
    displayName: 'Gemini 1.5 Pro (LiteLLM)',
    description: 'Google 2M context multimodal model routed through LiteLLM',
    category: 'llm',
    owned_by: 'google'
  },
  {
    id: 'gemini-2.0-flash',
    displayName: 'Gemini 2.0 Flash (LiteLLM)',
    description: 'Next-gen low latency multimodal generation via LiteLLM',
    category: 'llm',
    owned_by: 'google'
  },
  {
    id: 'llama-3.3-70b-instruct',
    displayName: 'Llama 3.3 70B',
    description: 'Meta open weights flagship instruction model',
    category: 'llm',
    owned_by: 'meta'
  },
  // Video Models
  {
    id: 'veo-3.1-fast',
    displayName: 'Veo 3.1 Fast (LiteLLM)',
    description: 'High speed cinematic video generation routed through LiteLLM',
    category: 'video',
    owned_by: 'google'
  },
  {
    id: 'veo-3.1-pro',
    displayName: 'Veo 3.1 Pro (LiteLLM)',
    description: 'Full fidelity cinematic video synthesis with natural lighting',
    category: 'video',
    owned_by: 'google'
  },
  {
    id: 'seedance-2.0-fast',
    displayName: 'Seedance 2.0 Fast',
    description: 'Dynamic camera motion and high frame consistency video',
    category: 'video',
    owned_by: 'seedance'
  }
];

class LiteLLMServiceManager {
  private baseUrl: string = DEFAULT_LITELLM_BASE_URL;
  private apiKey: string = '';
  private activeModelId: string = 'nano-banana-2';
  private models: LiteLLMModel[] = [...CURATED_FALLBACK_MODELS];
  private isConnected: boolean = false;
  private lastFetched: string | null = null;
  private listeners: Set<() => void> = new Set();
  private isFetching: boolean = false;

  constructor() {
    this.init();
  }

  private init() {
    // 1. Load API Key
    try {
      const savedKey = localStorage.getItem(STORAGE_KEY_KEY);
      if (savedKey) this.apiKey = savedKey;
    } catch {}

    // 2. Load Active Model
    try {
      const savedModel = localStorage.getItem(STORAGE_KEY_MODEL);
      if (savedModel) this.activeModelId = savedModel;
    } catch {}

    // 3. Load Cached Models
    try {
      const raw = localStorage.getItem(STORAGE_KEY_MODELS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.models = parsed;
        }
      }
    } catch {}

    // Auto-fetch if key is available or on initialization
    this.fetchModels(this.apiKey, false).catch(() => {});
  }

  public getBaseUrl(): string {
    return this.baseUrl;
  }

  public getApiKey(): string {
    return this.apiKey;
  }

  public setApiKey(key: string): void {
    this.apiKey = key.trim();
    try {
      localStorage.setItem(STORAGE_KEY_KEY, this.apiKey);
    } catch {}
    this.notify();
    // Sync to server
    fetch('/api/litellm/set-key', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey: this.apiKey })
    }).catch(() => {});
  }

  public getActiveModelId(): string {
    return this.activeModelId;
  }

  public setActiveModelId(modelId: string): void {
    this.activeModelId = modelId;
    try {
      localStorage.setItem(STORAGE_KEY_MODEL, modelId);
    } catch {}
    this.notify();
  }

  public getModels(): LiteLLMModel[] {
    return this.models;
  }

  public getIsConnected(): boolean {
    return this.isConnected;
  }

  public getLastFetched(): string | null {
    return this.lastFetched;
  }

  public getIsFetching(): boolean {
    return this.isFetching;
  }

  public getActiveModel(): LiteLLMModel | undefined {
    return this.models.find((m) => m.id === this.activeModelId);
  }

  private categorize(modelId: string): 'fast' | 'image' | 'llm' | 'vision' | 'video' {
    const m = modelId.toLowerCase();
    if (m.includes('banana') || m.includes('schnell') || m.includes('turbo') || m.includes('fast') || m.includes('mini')) {
      return 'fast';
    }
    if (m.includes('video') || m.includes('veo') || m.includes('seedance') || m.includes('kling') || m.includes('luma')) {
      return 'video';
    }
    if (m.includes('dall-e') || m.includes('flux') || m.includes('diffusion') || m.includes('sdxl') || m.includes('midjourney') || m.includes('seedream') || m.includes('ideogram') || m.includes('image')) {
      return 'image';
    }
    if (m.includes('vision') || m.includes('omni') || m.includes('4o')) {
      return 'vision';
    }
    return 'llm';
  }

  public async fetchModels(explicitKey?: string, force: boolean = true): Promise<{ success: boolean; models: LiteLLMModel[]; message: string }> {
    const key = explicitKey !== undefined ? explicitKey : this.apiKey;
    this.isFetching = true;
    this.notify();

    try {
      const url = `/api/litellm/models${key ? `?apiKey=${encodeURIComponent(key)}` : ''}`;
      const res = await fetch(url);
      const data = await res.json();

      this.isFetching = false;

      if (res.ok && data.success && Array.isArray(data.models) && data.models.length > 0) {
        // Map fetched models
        const mapped: LiteLLMModel[] = data.models.map((m: any) => {
          const cat = this.categorize(m.id);
          const disp = m.name || m.displayName || m.id
            .split(/[-_]/)
            .map((s: string) => s.charAt(0).toUpperCase() + s.slice(1))
            .join(' ');
          return {
            id: m.id,
            name: disp,
            displayName: disp,
            description: m.description || `LiteLLM Proxy Model (${m.owned_by || 'api.koboillm.com'})`,
            category: cat,
            isFast: cat === 'fast',
            provider: m.owned_by || 'LiteLLM',
            owned_by: m.owned_by || 'koboillm',
            isLiveFetched: true,
            created: m.created
          };
        });

        // Merge with existing unique curated items
        const idSet = new Set(mapped.map((x) => x.id));
        const merged = [...mapped];
        for (const fb of CURATED_FALLBACK_MODELS) {
          if (!idSet.has(fb.id)) {
            merged.push(fb);
          }
        }

        this.models = merged;
        this.isConnected = true;
        this.lastFetched = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        try {
          localStorage.setItem(STORAGE_KEY_MODELS, JSON.stringify(this.models));
        } catch {}

        this.notify();
        return {
          success: true,
          models: this.models,
          message: `Berhasil mengambil ${mapped.length} model aktif dari api.koboillm.com/v1!`
        };
      }

      // If server returned partial fallback or error
      if (data.models && Array.isArray(data.models)) {
        this.models = data.models;
      }
      this.isConnected = Boolean(data.isConnected);
      this.notify();

      return {
        success: Boolean(data.success),
        models: this.models,
        message: data.message || data.error || 'Daftar model siap dipilih.'
      };
    } catch (err: any) {
      this.isFetching = false;
      this.notify();
      return {
        success: false,
        models: this.models,
        message: err.message || 'Gagal terhubung ke proxy api.koboillm.com/v1'
      };
    }
  }

  public async testConnection(explicitKey?: string): Promise<LiteLLMTestResult> {
    const key = explicitKey !== undefined ? explicitKey : this.apiKey;
    try {
      const res = await fetch('/api/litellm/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: key })
      });
      const data = await res.json();
      if (data.success) {
        this.isConnected = true;
        if (data.models && Array.isArray(data.models)) {
          this.fetchModels(key, true).catch(() => {});
        }
      }
      this.notify();
      return data;
    } catch (err: any) {
      return {
        success: false,
        message: err.message || 'Gagal menghubungi server proxy api.koboillm.com/v1'
      };
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => {
      try {
        l();
      } catch (e) {
        console.error('LiteLLM listener error', e);
      }
    });
  }
}

export const litellmService = new LiteLLMServiceManager();
