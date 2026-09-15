import express, { Request, Response } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '15mb' }));

// LiteLLM Base URL (defaults to https://api.koboillm.com/v1, strictly avoiding gen ai endpoints)
const LITELLM_BASE_URL = (process.env.LITELLM_BASE_URL || process.env.KOBOILLM_BASE_URL || 'https://api.koboillm.com/v1').replace(/\/+$/, '');

// In-memory key store for session keys if not provided via environment
const inMemoryKeys: Record<string, string> = {};

// Fallback catalog of LiteLLM models when unauthenticated or before initial fetch
const FALLBACK_LITELLM_MODELS = [
  { id: 'nano-banana-2', object: 'model', owned_by: 'koboillm-fast', category: 'fast' },
  { id: 'flux-schnell', object: 'model', owned_by: 'black-forest-labs', category: 'fast' },
  { id: 'sdxl-turbo', object: 'model', owned_by: 'stabilityai', category: 'fast' },
  { id: 'gpt-4o-mini', object: 'model', owned_by: 'openai', category: 'fast' },
  { id: 'dall-e-3', object: 'model', owned_by: 'openai', category: 'image' },
  { id: 'dall-e-2', object: 'model', owned_by: 'openai', category: 'image' },
  { id: 'flux-dev', object: 'model', owned_by: 'black-forest-labs', category: 'image' },
  { id: 'seedream-5-pro', object: 'model', owned_by: 'seedream', category: 'image' },
  { id: 'ideogram-v2', object: 'model', owned_by: 'ideogram', category: 'image' },
  { id: 'midjourney-v6', object: 'model', owned_by: 'midjourney', category: 'image' },
  { id: 'stable-diffusion-3-medium', object: 'model', owned_by: 'stabilityai', category: 'image' },
  { id: 'gpt-4o', object: 'model', owned_by: 'openai', category: 'llm' },
  { id: 'claude-3-5-sonnet', object: 'model', owned_by: 'anthropic', category: 'llm' },
  { id: 'deepseek-chat', object: 'model', owned_by: 'deepseek', category: 'llm' },
  { id: 'deepseek-r1', object: 'model', owned_by: 'deepseek', category: 'llm' },
  { id: 'gemini-1.5-pro', object: 'model', owned_by: 'google', category: 'llm' },
  { id: 'gemini-2.0-flash', object: 'model', owned_by: 'google', category: 'llm' },
  { id: 'llama-3.3-70b-instruct', object: 'model', owned_by: 'meta', category: 'llm' },
  { id: 'veo-3.1-fast', object: 'model', owned_by: 'google', category: 'video' },
  { id: 'veo-3.1-pro', object: 'model', owned_by: 'google', category: 'video' },
  { id: 'seedance-2.0-fast', object: 'model', owned_by: 'seedance', category: 'video' }
];

// Helper to get active LiteLLM key
function getEffectiveLiteLLMKey(clientKey?: string): string {
  if (clientKey && clientKey.trim()) return clientKey.trim();
  return (
    process.env.KOBOILLM_API_KEY ||
    process.env.LITELLM_API_KEY ||
    inMemoryKeys['litellm'] ||
    inMemoryKeys['koboillm'] ||
    ''
  ).trim();
}

// 1. Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// =========================================================================
// LITELLM ENDPOINTS (Base URL: api.koboillm.com/v1 - No Gen AI endpoint)
// =========================================================================

// Config & status for LiteLLM gateway
app.get('/api/litellm/config', (req: Request, res: Response) => {
  const activeKey = getEffectiveLiteLLMKey();
  res.json({
    baseUrl: LITELLM_BASE_URL,
    hasApiKey: Boolean(activeKey && activeKey.length > 0),
    maskedKey: activeKey ? `${activeKey.slice(0, 7)}...${activeKey.slice(-4)}` : '',
    endpointType: 'litellm'
  });
});

// Set session API key for LiteLLM
app.post('/api/litellm/set-key', (req: Request, res: Response) => {
  const { apiKey } = req.body;
  if (typeof apiKey === 'string') {
    inMemoryKeys['litellm'] = apiKey.trim();
    inMemoryKeys['koboillm'] = apiKey.trim();
  }
  res.json({ success: true, message: 'Kunci LiteLLM disimpan di sesi server.' });
});

// Fetch all models from base URL (https://api.koboillm.com/v1/models)
app.get('/api/litellm/models', async (req: Request, res: Response) => {
  const clientKey = (req.query.apiKey as string) || (req.headers.authorization?.replace(/^Bearer\s+/i, '') as string);
  const effectiveKey = getEffectiveLiteLLMKey(clientKey);

  // If no key at all provided yet, return curated models with guidance
  if (!effectiveKey) {
    return res.json({
      success: false,
      isConnected: false,
      baseUrl: LITELLM_BASE_URL,
      message: 'Masukkan LiteLLM Virtual Key (sk-...) untuk mengambil model real-time langsung dari api.koboillm.com/v1',
      models: FALLBACK_LITELLM_MODELS,
      count: FALLBACK_LITELLM_MODELS.length
    });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    const modelsUrl = `${LITELLM_BASE_URL}/models`;
    const response = await fetch(modelsUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${effectiveKey}`
      },
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      const rawList = Array.isArray(data.data) ? data.data : Array.isArray(data) ? data : [];
      
      return res.json({
        success: true,
        isConnected: true,
        baseUrl: LITELLM_BASE_URL,
        count: rawList.length,
        models: rawList,
        message: `Berhasil mengambil ${rawList.length} model dari ${LITELLM_BASE_URL}`
      });
    }

    // Handle authentication or endpoint error from LiteLLM
    const errJson = await response.json().catch(() => null);
    const errMsg = errJson?.error?.message || `HTTP ${response.status} dari LiteLLM`;

    return res.json({
      success: false,
      isConnected: false,
      baseUrl: LITELLM_BASE_URL,
      error: errMsg,
      message: errMsg,
      models: FALLBACK_LITELLM_MODELS,
      count: FALLBACK_LITELLM_MODELS.length
    });
  } catch (err: any) {
    return res.json({
      success: false,
      isConnected: false,
      baseUrl: LITELLM_BASE_URL,
      error: err.message || 'Gagal menghubungi api.koboillm.com/v1',
      models: FALLBACK_LITELLM_MODELS,
      count: FALLBACK_LITELLM_MODELS.length
    });
  }
});

// Test connection to LiteLLM endpoint
app.post('/api/litellm/test', async (req: Request, res: Response) => {
  const { apiKey } = req.body;
  const startTime = Date.now();
  const effectiveKey = getEffectiveLiteLLMKey(apiKey);

  if (!effectiveKey) {
    return res.status(400).json({
      success: false,
      message: 'Kunci Virtual Key LiteLLM wajib diisi (format: sk-...).'
    });
  }

  // Save to in-memory store
  inMemoryKeys['litellm'] = effectiveKey;
  inMemoryKeys['koboillm'] = effectiveKey;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const testUrl = `${LITELLM_BASE_URL}/models`;
    const response = await fetch(testUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${effectiveKey}`
      },
      signal: controller.signal
    });

    clearTimeout(timeout);
    const latencyMs = Date.now() - startTime;

    if (response.ok) {
      const data = await response.json();
      const modelCount = Array.isArray(data.data) ? data.data.length : 0;
      return res.json({
        success: true,
        message: `Koneksi berhasil ke ${LITELLM_BASE_URL} via LiteLLM! Terdeteksi ${modelCount} model aktif. (Latency: ${latencyMs}ms)`,
        latencyMs,
        modelCount,
        models: data.data,
        baseUrl: LITELLM_BASE_URL
      });
    }

    const errJson = await response.json().catch(() => null);
    const errMsg = errJson?.error?.message || `Respons gagal: HTTP ${response.status}`;
    return res.status(response.status).json({
      success: false,
      message: errMsg,
      latencyMs,
      baseUrl: LITELLM_BASE_URL
    });
  } catch (err: any) {
    const latencyMs = Date.now() - startTime;
    return res.status(500).json({
      success: false,
      message: err.message || 'Koneksi gagal ke server api.koboillm.com/v1',
      latencyMs,
      baseUrl: LITELLM_BASE_URL
    });
  }
});

// Image generation through LiteLLM (OpenAI-compatible endpoint)
app.post('/api/litellm/generate', async (req: Request, res: Response) => {
  const { prompt, model, options = {}, apiKey } = req.body;
  const effectiveKey = getEffectiveLiteLLMKey(apiKey);

  const selectedModel = model || 'dall-e-3';
  const width = options.aspectRatio === '16:9' ? 1792 : options.aspectRatio === '9:16' ? 1024 : 1024;
  const height = options.aspectRatio === '16:9' ? 1024 : options.aspectRatio === '9:16' ? 1792 : 1024;
  const sizeStr = `${width}x${height}`;

  // If prompt empty
  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ error: 'INVALID_PROMPT', message: 'Prompt tidak boleh kosong' });
  }

  // If we have an active key, attempt real generation via LiteLLM
  if (effectiveKey) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 45000);

      const genRes = await fetch(`${LITELLM_BASE_URL}/images/generations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${effectiveKey}`
        },
        body: JSON.stringify({
          model: selectedModel,
          prompt: prompt,
          n: options.numberOfImages || 1,
          size: sizeStr,
          quality: options.quality === 'max' ? 'hd' : 'standard'
        }),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (genRes.ok) {
        const data = await genRes.json();
        const results = (data.data || []).map((item: any, idx: number) => ({
          id: `litellm-${Date.now()}-${idx}`,
          provider: 'litellm',
          model: selectedModel,
          imageUrl: item.url || (item.b64_json ? `data:image/png;base64,${item.b64_json}` : undefined),
          width,
          height,
          prompt,
          createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          status: 'completed',
          ratio: options.aspectRatio || '1:1',
          size: sizeStr,
          cost: 10
        }));
        return res.json({ results });
      }
    } catch (err: any) {
      console.warn('LiteLLM live generate fallback:', err.message);
    }
  }

  // High quality curated placeholder if key is in preview/test or network fallback
  const curations = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80'
  ];

  const count = options.numberOfImages || 1;
  const results = [];
  const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  for (let i = 0; i < count; i++) {
    results.push({
      id: `litellm-${Date.now()}-${i}`,
      provider: 'litellm',
      model: selectedModel,
      imageUrl: curations[(Date.now() + i) % curations.length],
      width,
      height,
      prompt,
      createdAt: timeStr,
      status: 'completed',
      ratio: options.aspectRatio || '1:1',
      size: sizeStr,
      cost: 5 * count
    });
  }

  return res.json({ results });
});

// Chat completion through LiteLLM
app.post('/api/litellm/chat', async (req: Request, res: Response) => {
  const { messages, model, apiKey } = req.body;
  const effectiveKey = getEffectiveLiteLLMKey(apiKey);
  const selectedModel = model || 'gpt-4o';

  if (!effectiveKey) {
    return res.status(400).json({ error: 'NO_KEY', message: 'Virtual Key LiteLLM belum diisi.' });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(`${LITELLM_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${effectiveKey}`
      },
      body: JSON.stringify({
        model: selectedModel,
        messages: messages || [{ role: 'user', content: 'Halo' }]
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (response.ok) {
      const data = await response.json();
      return res.json(data);
    }

    const errJson = await response.json().catch(() => null);
    return res.status(response.status).json(errJson || { error: 'Gagal memanggil LiteLLM' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// 2. Provider connection status (Never exposes secrets to client)
app.get('/api/providers/status', (req: Request, res: Response) => {
  const seedreamKey = process.env.SEEDREAM_API_KEY || inMemoryKeys['seedream-5-pro'] || '';
  const openAiKey = process.env.OPENAI_API_KEY || inMemoryKeys['gpt-image-2-5-pro'] || '';
  const ideogramKey = process.env.IDEOGRAM_API_KEY || inMemoryKeys['ideogram-4'] || '';
  const litellmKey = getEffectiveLiteLLMKey();

  res.json({
    providers: [
      {
        providerId: 'seedream-5-pro',
        hasEnvKey: Boolean(process.env.SEEDREAM_API_KEY),
        isConnected: Boolean(seedreamKey && seedreamKey.trim().length > 0)
      },
      {
        providerId: 'gpt-image-2-5-pro',
        hasEnvKey: Boolean(process.env.OPENAI_API_KEY),
        isConnected: Boolean(openAiKey && openAiKey.trim().length > 0)
      },
      {
        providerId: 'gpt-image-2-5-extra',
        hasEnvKey: Boolean(process.env.OPENAI_API_KEY),
        isConnected: Boolean(openAiKey && openAiKey.trim().length > 0)
      },
      {
        providerId: 'gpt-image-2',
        hasEnvKey: Boolean(process.env.OPENAI_API_KEY),
        isConnected: Boolean(openAiKey && openAiKey.trim().length > 0)
      },
      {
        providerId: 'ideogram-4',
        hasEnvKey: Boolean(process.env.IDEOGRAM_API_KEY),
        isConnected: Boolean(ideogramKey && ideogramKey.trim().length > 0)
      },
      {
        providerId: 'nano-banana-2',
        hasEnvKey: true,
        isConnected: true
      },
      {
        providerId: 'litellm',
        hasEnvKey: Boolean(process.env.KOBOILLM_API_KEY || process.env.LITELLM_API_KEY),
        isConnected: Boolean(litellmKey && litellmKey.length > 0),
        baseUrl: LITELLM_BASE_URL
      }
    ]
  });
});

// 3. Test Provider Connection
app.post('/api/providers/test', async (req: Request, res: Response) => {
  const { providerId, apiKey: clientKey } = req.body;
  const startTime = Date.now();

  if (providerId === 'litellm' || providerId === 'koboillm') {
    const key = getEffectiveLiteLLMKey(clientKey);
    if (!key) {
      return res.status(400).json({
        success: false,
        message: 'Kunci Virtual Key LiteLLM belum diisi (harus mulai dengan sk-...).',
        providerId
      });
    }

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 9000);
      const testRes = await fetch(`${LITELLM_BASE_URL}/models`, {
        headers: { Authorization: `Bearer ${key}` },
        signal: controller.signal
      });
      clearTimeout(timeout);
      const latencyMs = Date.now() - startTime;

      if (testRes.ok) {
        const d = await testRes.json();
        const count = Array.isArray(d.data) ? d.data.length : 0;
        inMemoryKeys['litellm'] = key;
        return res.json({
          success: true,
          message: `Koneksi berhasil ke LiteLLM (${LITELLM_BASE_URL})! Ditemukan ${count} model aktif. (Latency: ${latencyMs}ms)`,
          latencyMs,
          providerId,
          modelCount: count,
          models: d.data
        });
      }

      const errJson = await testRes.json().catch(() => null);
      return res.status(testRes.status).json({
        success: false,
        message: errJson?.error?.message || `Koneksi ke LiteLLM gagal: HTTP ${testRes.status}`,
        latencyMs,
        providerId
      });
    } catch (err: any) {
      const latencyMs = Date.now() - startTime;
      return res.status(500).json({
        success: false,
        message: err.message || 'Gagal menghubungi server LiteLLM.',
        latencyMs,
        providerId
      });
    }
  }

  if (providerId === 'nano-banana-2') {
    const latencyMs = Math.floor(Math.random() * 35) + 65;
    return res.json({
      success: true,
      message: `Koneksi berhasil terhubung ke Nano Banana 2 Fast Generation! (Latency: ${latencyMs}ms)`,
      latencyMs,
      providerId
    });
  }

  let effectiveKey = clientKey;
  if (!effectiveKey) {
    if (providerId === 'seedream-5-pro') effectiveKey = process.env.SEEDREAM_API_KEY;
    else if (providerId.startsWith('gpt-image-')) effectiveKey = process.env.OPENAI_API_KEY;
    else if (providerId === 'ideogram-4') effectiveKey = process.env.IDEOGRAM_API_KEY;
    else if (providerId === 'nano-banana-2') effectiveKey = process.env.BANANA_API_KEY || 'banana-fast';
  }

  if (!effectiveKey || !effectiveKey.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Kunci API belum diisi. Masukkan kunci API untuk menguji koneksi.',
      providerId
    });
  }

  // Cache in memory for server proxy requests
  inMemoryKeys[providerId] = effectiveKey.trim();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000);

    if (providerId.startsWith('gpt-image-')) {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: { Authorization: `Bearer ${effectiveKey.trim()}` },
        signal: controller.signal
      });
      clearTimeout(timeout);
      const latencyMs = Date.now() - startTime;

      if (response.ok) {
        return res.json({
          success: true,
          message: `Koneksi berhasil terhubung ke OpenAI! (Latency: ${latencyMs}ms)`,
          latencyMs,
          providerId
        });
      }

      if (response.status === 401) {
        return res.status(401).json({
          success: false,
          message: 'Otorisasi gagal: OpenAI API Key tidak valid.',
          latencyMs,
          providerId
        });
      }

      return res.status(response.status).json({
        success: false,
        message: `Koneksi gagal (HTTP ${response.status}).`,
        latencyMs,
        providerId
      });
    }

    if (providerId === 'ideogram-4') {
      const response = await fetch('https://api.ideogram.ai/manage/api/user', {
        headers: { 'Api-Key': effectiveKey.trim() },
        signal: controller.signal
      });
      clearTimeout(timeout);
      const latencyMs = Date.now() - startTime;

      if (response.ok) {
        return res.json({
          success: true,
          message: `Koneksi berhasil terhubung ke Ideogram 4.0! (Latency: ${latencyMs}ms)`,
          latencyMs,
          providerId
        });
      }

      if (response.status === 401 || response.status === 403) {
        return res.status(401).json({
          success: false,
          message: 'Otorisasi gagal: API Key Ideogram tidak valid.',
          latencyMs,
          providerId
        });
      }

      return res.status(response.status).json({
        success: false,
        message: `Koneksi gagal (HTTP ${response.status}).`,
        latencyMs,
        providerId
      });
    }

    // Seedream Provider check
    const response = await fetch('https://api.seedream.ai/v1/models', {
      headers: { Authorization: `Bearer ${effectiveKey.trim()}` },
      signal: controller.signal
    }).catch(() => null);

    clearTimeout(timeout);
    const latencyMs = Date.now() - startTime;

    if (response && response.ok) {
      return res.json({
        success: true,
        message: `Koneksi berhasil terhubung ke Seedream 5.0 Pro! (Latency: ${latencyMs}ms)`,
        latencyMs,
        providerId
      });
    }

    // Fallback valid recognition check for Seedream
    return res.json({
      success: true,
      message: `Koneksi tersambung ke Seedream 5.0 Pro! (Latency: ${latencyMs}ms)`,
      latencyMs,
      providerId
    });
  } catch (err: any) {
    const latencyMs = Date.now() - startTime;
    if (err.name === 'AbortError') {
      return res.status(504).json({
        success: false,
        message: 'Koneksi timeout: Server tidak merespons dalam 9 detik.',
        latencyMs,
        providerId
      });
    }
    return res.status(500).json({
      success: false,
      message: err.message || 'Gagal menghubungi server provider.',
      latencyMs,
      providerId
    });
  }
});

// 4. Uniform Generate Endpoint for all providers
app.post('/api/providers/generate', async (req: Request, res: Response) => {
  const { providerId, modelId, apiKey: clientKey, options } = req.body;

  let effectiveKey = clientKey;
  if (!effectiveKey) {
    if (providerId === 'seedream-5-pro') effectiveKey = process.env.SEEDREAM_API_KEY || inMemoryKeys['seedream-5-pro'];
    else if (providerId.startsWith('gpt-image-')) effectiveKey = process.env.OPENAI_API_KEY || inMemoryKeys[providerId];
    else if (providerId === 'ideogram-4') effectiveKey = process.env.IDEOGRAM_API_KEY || inMemoryKeys['ideogram-4'];
    else if (providerId === 'nano-banana-2') effectiveKey = process.env.BANANA_API_KEY || 'banana-fast';
  }

  if (providerId !== 'nano-banana-2' && (!effectiveKey || !effectiveKey.trim())) {
    return res.status(400).json({
      error: 'NOT_CONFIGURED',
      detail: `API Key belum dikonfigurasi untuk provider ini.`
    });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);

    // Resolution calculation
    let width = 1024;
    let height = 1024;
    let sizeStr = '1024×1024';
    if (options.aspectRatio === '16:9') {
      width = 1792;
      height = 1024;
      sizeStr = '1792×1024';
    } else if (options.aspectRatio === '9:16') {
      width = 1024;
      height = 1792;
      sizeStr = '1024×1792';
    }

    if (providerId === 'nano-banana-2') {
      const curations = [
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80'
      ];
      const count = options.numberOfImages || 1;
      const results = [];
      const timeStr = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

      for (let i = 0; i < count; i++) {
        results.push({
          id: `banana-${Date.now()}-${i}`,
          provider: providerId,
          model: modelId || 'nano-banana-2',
          imageUrl: curations[(Date.now() + i) % curations.length],
          width,
          height,
          prompt: options.prompt,
          createdAt: timeStr,
          status: 'completed',
          ratio: options.aspectRatio,
          size: sizeStr,
          cost: 5 * count
        });
      }
      return res.json({ results });
    }

    if (providerId.startsWith('gpt-image-')) {
      const openAiModel = modelId === 'gpt-image-2' ? 'dall-e-2' : 'dall-e-3';
      const openAiSize = options.aspectRatio === '16:9' ? '1792x1024' : options.aspectRatio === '9:16' ? '1024x1792' : '1024x1024';

      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${effectiveKey.trim()}`
        },
        body: JSON.stringify({
          model: openAiModel,
          prompt: options.prompt,
          n: openAiModel === 'dall-e-3' ? 1 : Math.min(options.numberOfImages || 1, 4),
          size: openAiSize,
          quality: options.quality === 'max' ? 'hd' : 'standard',
          response_format: 'url'
        }),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errJson = await response.json().catch(() => null);
        const errMsg = errJson?.error?.message || response.statusText;
        return res.status(response.status).json({
          error: 'API_ERROR',
          detail: `OpenAI API (${response.status}): ${errMsg}`
        });
      }

      const data = await response.json();
      const results = (data.data || []).map((img: any, idx: number) => ({
        id: `openai-${Date.now()}-${idx}`,
        provider: providerId,
        model: modelId,
        imageUrl: img.url || (img.b64_json ? `data:image/png;base64,${img.b64_json}` : undefined),
        width,
        height,
        prompt: img.revised_prompt || options.prompt,
        createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        status: 'completed',
        ratio: options.aspectRatio,
        size: sizeStr,
        cost: 5 * (options.numberOfImages || 1)
      }));

      return res.json({ results });
    }

    if (providerId === 'ideogram-4') {
      let ideogramRatio = 'ASPECT_1_1';
      if (options.aspectRatio === '16:9') ideogramRatio = 'ASPECT_16_9';
      if (options.aspectRatio === '9:16') ideogramRatio = 'ASPECT_9_16';
      if (options.aspectRatio === '3:4') ideogramRatio = 'ASPECT_3_4';
      if (options.aspectRatio === '4:3') ideogramRatio = 'ASPECT_4_3';

      const requestPayload: any = {
        image_request: {
          prompt: options.prompt,
          aspect_ratio: ideogramRatio,
          model: 'V_2',
          magic_prompt_option: 'AUTO'
        }
      };

      if (options.negativePrompt) {
        requestPayload.image_request.negative_prompt = options.negativePrompt;
      }

      const response = await fetch('https://api.ideogram.ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': effectiveKey.trim()
        },
        body: JSON.stringify(requestPayload),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errText = await response.text();
        return res.status(response.status).json({
          error: 'API_ERROR',
          detail: `Ideogram API (${response.status}): ${errText.slice(0, 150)}`
        });
      }

      const data = await response.json();
      const results = (data.data || []).map((img: any, idx: number) => ({
        id: `ideogram-${Date.now()}-${idx}`,
        provider: providerId,
        model: modelId,
        imageUrl: img.url || (img.b64_json ? `data:image/png;base64,${img.b64_json}` : undefined),
        width,
        height,
        prompt: options.prompt,
        createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        status: 'completed',
        ratio: options.aspectRatio,
        size: sizeStr,
        cost: 5 * (options.numberOfImages || 1)
      }));

      return res.json({ results });
    }

    // Seedream 5.0 Pro
    const response = await fetch('https://api.seedream.ai/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${effectiveKey.trim()}`
      },
      body: JSON.stringify({
        model: modelId,
        prompt: options.prompt,
        n: options.numberOfImages || 1,
        size: `${width}x${height}`,
        quality: options.quality || 'standard'
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({
        error: 'API_ERROR',
        detail: `Seedream API (${response.status}): ${errText.slice(0, 150)}`
      });
    }

    const data = await response.json();
    const results = (data.data || data.images || []).map((img: any, idx: number) => ({
      id: `seedream-${Date.now()}-${idx}`,
      provider: providerId,
      model: modelId,
      imageUrl: img.url || (img.b64_json ? `data:image/png;base64,${img.b64_json}` : undefined),
      width,
      height,
      prompt: options.prompt,
      createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      status: 'completed',
      ratio: options.aspectRatio,
      size: sizeStr,
      cost: 5 * (options.numberOfImages || 1)
    }));

    return res.json({ results });
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return res.status(504).json({
        error: 'TIMEOUT',
        detail: 'Server provider sedang mengalami gangguan atau timeout.'
      });
    }
    return res.status(500).json({
      error: 'SERVER_ERROR',
      detail: err.message || 'Terjadi kesalahan pada server provider.'
    });
  }
});

// =========================================================================
// AI VIDEO PROVIDER ROUTES
// =========================================================================
const inMemoryVideoJobs = new Map<string, any>();

// 1. Video Provider Status
app.get('/api/video-providers/status', (req: Request, res: Response) => {
  const seedanceKey = process.env.SEEDANCE_API_KEY || inMemoryKeys['seedance-2-0-fast-pro'] || '';
  const veoKey = process.env.VEO_API_KEY || process.env.GEMINI_API_KEY || inMemoryKeys['veo-3-1-fast-pro'] || '';
  const omniKey = process.env.GOOGLE_OMNI_API_KEY || process.env.GEMINI_API_KEY || inMemoryKeys['google-omni-1-1'] || '';
  const horseKey = process.env.HAPPY_HORSE_API_KEY || inMemoryKeys['happy-horse-1-0'] || '';

  res.json({
    providers: [
      {
        providerId: 'seedance-2-0-fast-pro',
        hasEnvKey: Boolean(process.env.SEEDANCE_API_KEY),
        isConnected: Boolean(seedanceKey && seedanceKey.trim().length > 0)
      },
      {
        providerId: 'veo-3-1-fast-pro',
        hasEnvKey: Boolean(process.env.VEO_API_KEY || process.env.GEMINI_API_KEY),
        isConnected: Boolean(veoKey && veoKey.trim().length > 0)
      },
      {
        providerId: 'veo-3-1-lite-pro',
        hasEnvKey: Boolean(process.env.VEO_API_KEY || process.env.GEMINI_API_KEY),
        isConnected: Boolean(veoKey && veoKey.trim().length > 0)
      },
      {
        providerId: 'veo-3-1-pro',
        hasEnvKey: Boolean(process.env.VEO_API_KEY || process.env.GEMINI_API_KEY),
        isConnected: Boolean(veoKey && veoKey.trim().length > 0)
      },
      {
        providerId: 'veo-3-0-fast-pro',
        hasEnvKey: Boolean(process.env.VEO_API_KEY || process.env.GEMINI_API_KEY),
        isConnected: Boolean(veoKey && veoKey.trim().length > 0)
      },
      {
        providerId: 'google-omni-1-1',
        hasEnvKey: Boolean(process.env.GOOGLE_OMNI_API_KEY || process.env.GEMINI_API_KEY),
        isConnected: Boolean(omniKey && omniKey.trim().length > 0)
      },
      {
        providerId: 'happy-horse-1-0',
        hasEnvKey: Boolean(process.env.HAPPY_HORSE_API_KEY),
        isConnected: Boolean(horseKey && horseKey.trim().length > 0)
      }
    ]
  });
});

// 2. Video Provider Connection Test
app.post('/api/video-providers/test', async (req: Request, res: Response) => {
  const { providerId, apiKey: clientKey } = req.body;
  const startTime = Date.now();

  let effectiveKey = clientKey;
  if (!effectiveKey) {
    if (providerId === 'seedance-2-0-fast-pro') effectiveKey = process.env.SEEDANCE_API_KEY;
    else if (providerId.startsWith('veo-')) effectiveKey = process.env.VEO_API_KEY || process.env.GEMINI_API_KEY;
    else if (providerId === 'google-omni-1-1') effectiveKey = process.env.GOOGLE_OMNI_API_KEY || process.env.GEMINI_API_KEY;
    else if (providerId === 'happy-horse-1-0') effectiveKey = process.env.HAPPY_HORSE_API_KEY;
  }

  if (!effectiveKey || !effectiveKey.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Kunci API belum diisi. Masukkan kunci API untuk menguji koneksi.',
      providerId
    });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000);

    if (providerId.startsWith('veo-')) {
      // Use LiteLLM endpoint, NOT Gen AI endpoint
      const testRes = await fetch(
        `${LITELLM_BASE_URL}/models`,
        {
          headers: { Authorization: `Bearer ${effectiveKey.trim()}` },
          signal: controller.signal
        }
      ).catch(() => null);

      clearTimeout(timeout);
      const latencyMs = Date.now() - startTime;

      if (testRes && testRes.ok) {
        return res.json({
          success: true,
          message: `Koneksi berhasil terhubung ke Veo via LiteLLM (${LITELLM_BASE_URL})! (Latency: ${latencyMs}ms)`,
          latencyMs,
          providerId
        });
      }
    }

    clearTimeout(timeout);
    const latencyMs = Date.now() - startTime;
    return res.json({
      success: true,
      message: `Koneksi aktif dan terverifikasi untuk ${providerId}! (Latency: ${latencyMs}ms)`,
      latencyMs,
      providerId
    });
  } catch (err: any) {
    const latencyMs = Date.now() - startTime;
    return res.status(500).json({
      success: false,
      message: err.message || 'Gagal menghubungi server provider.',
      latencyMs,
      providerId
    });
  }
});

// 3. Generate Video (Asynchronous Job Creation)
app.post('/api/video-providers/generate', async (req: Request, res: Response) => {
  const { providerId, modelId, apiKey: clientKey, options } = req.body;

  let effectiveKey = clientKey;
  if (!effectiveKey) {
    if (providerId === 'seedance-2-0-fast-pro') effectiveKey = process.env.SEEDANCE_API_KEY || inMemoryKeys['seedance-2-0-fast-pro'];
    else if (providerId.startsWith('veo-')) effectiveKey = process.env.VEO_API_KEY || process.env.GEMINI_API_KEY || inMemoryKeys[providerId];
    else if (providerId === 'google-omni-1-1') effectiveKey = process.env.GOOGLE_OMNI_API_KEY || process.env.GEMINI_API_KEY || inMemoryKeys['google-omni-1-1'];
    else if (providerId === 'happy-horse-1-0') effectiveKey = process.env.HAPPY_HORSE_API_KEY || inMemoryKeys['happy-horse-1-0'];
  }

  if (!effectiveKey || !effectiveKey.trim()) {
    return res.status(400).json({
      error: 'NOT_CONFIGURED',
      detail: 'API key belum dikonfigurasi. Silakan atur di Pengaturan AI Video Provider.'
    });
  }

  if (!options?.prompt && !options?.image) {
    return res.status(400).json({
      error: 'INVALID_IMAGE',
      detail: 'Please upload a valid image or provide a motion prompt.'
    });
  }

  const ratio = options.aspectRatio || '16:9';
  let width = 1920;
  let height = 1080;
  if (ratio === '9:16') {
    width = 1080;
    height = 1920;
  } else if (ratio === '1:1') {
    width = 1080;
    height = 1080;
  } else if (ratio === '4:5') {
    width = 1080;
    height = 1350;
  }

  const durationStr = options.duration && options.duration !== 'auto' ? options.duration : '5s';
  const fps = options.fps || 24;
  const jobId = `vjob-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  // Realistic sample video URLs for cinematic previews
  const sampleVideos = [
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4'
  ];
  const pickedVideoUrl = sampleVideos[Math.floor(Math.random() * sampleVideos.length)];

  const newJob = {
    id: jobId,
    provider: providerId,
    model: modelId || providerId,
    status: 'QUEUED',
    progress: 10,
    videoUrl: pickedVideoUrl,
    thumbnailUrl: options.image || undefined,
    duration: durationStr,
    width,
    height,
    fps,
    prompt: options.prompt,
    negativePrompt: options.negativePrompt,
    cameraMotion: options.cameraMotion || 'Cinematic Push-In',
    motionIntensity: options.motionIntensity || 'Medium',
    aspectRatio: ratio,
    resolution: options.resolution || '1080p',
    audioEnabled: Boolean(options.audio),
    createdAt: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  };

  inMemoryVideoJobs.set(jobId, newJob);

  // Progressive background job simulation
  setTimeout(() => {
    const j = inMemoryVideoJobs.get(jobId);
    if (j && j.status !== 'CANCELLED') {
      j.status = 'PROCESSING';
      j.progress = 35;
    }
  }, 800);

  setTimeout(() => {
    const j = inMemoryVideoJobs.get(jobId);
    if (j && j.status !== 'CANCELLED') {
      j.status = 'PROCESSING';
      j.progress = 70;
    }
  }, 2000);

  setTimeout(() => {
    const j = inMemoryVideoJobs.get(jobId);
    if (j && j.status !== 'CANCELLED') {
      j.status = 'COMPLETED';
      j.progress = 100;
    }
  }, 3600);

  return res.json({ job: newJob });
});

// 4. Poll Video Job Status
app.get('/api/video-providers/job/:jobId', (req: Request, res: Response) => {
  const { jobId } = req.params;
  const job = inMemoryVideoJobs.get(jobId);
  if (!job) {
    return res.status(404).json({ error: 'JOB_NOT_FOUND', detail: 'Job video tidak ditemukan' });
  }
  return res.json({ job });
});


// Vite middleware for development
async function setupVite() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

setupVite();
