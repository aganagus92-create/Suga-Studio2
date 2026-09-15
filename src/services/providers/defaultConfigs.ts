import { AIProviderConfig, SmartRecommendation } from '../../types/provider';

export const DEFAULT_PROVIDERS: AIProviderConfig[] = [
  {
    providerId: 'seedream-5-pro',
    modelId: 'seedream-5.0-pro',
    displayName: 'Seedream 5.0 Pro',
    label: 'Best Quality • Photorealistic',
    description: 'Best Quality • Photorealistic',
    badgeType: 'seedream',
    apiEndpoint: 'https://api.seedream.ai/v1/images/generations',
    apiKeyEnvVar: 'SEEDREAM_API_KEY',
    isConnected: false,
    isEnabled: true,
    isDefault: true,
    order: 1,
    modelGroup: 'STANDARD',
    supportedSizes: ['1024×1024', '1440×2560', '2560×1440', '4096×4096'],
    supportedAspectRatios: ['1:1', '16:9', '9:16', '2:3', '3:4', '4:3'],
    qualitySettings: ['standard', 'hd', 'max'],
    specialties: ['Photorealistic', 'High Quality', 'Commercial Shots'],
    recommendedCategory: 'photorealistic',
    capabilities: {
      supportsPrompt: true,
      supportsNegativePrompt: false,
      supportsReferenceImages: true,
      supportsTextRendering: false,
      supportsHighQuality: true,
      photorealistic: true,
      creativeGeneration: true,
      typography: false,
      unsupportedFeaturesTooltip: {
        negativePrompt: 'Fitur negative prompt tidak didukung pada model Seedream 5.0 Pro.',
        textRendering: 'Fitur tipografi kompleks tidak dioptimasi pada model ini.'
      }
    }
  },
  {
    providerId: 'gpt-image-2-5-pro',
    modelId: 'gpt-image-2.5-pro',
    displayName: 'GPT Image 2.5 Pro',
    label: 'Newest OpenAI • Up to Max Quality',
    description: 'Newest OpenAI • Up to Max Quality',
    badgeType: 'openai-pro',
    apiEndpoint: 'https://api.openai.com/v1/images/generations',
    apiKeyEnvVar: 'OPENAI_API_KEY',
    isConnected: false,
    isEnabled: true,
    isDefault: false,
    order: 2,
    modelGroup: 'STANDARD',
    supportedSizes: ['1024×1024', '1024×1792', '1792×1024'],
    supportedAspectRatios: ['1:1', '16:9', '9:16'],
    qualitySettings: ['standard', 'hd', 'max'],
    specialties: ['Maximum Quality', 'Detailed Generation', 'Text Rendering'],
    recommendedCategory: 'max_quality',
    capabilities: {
      supportsPrompt: true,
      supportsNegativePrompt: false,
      supportsReferenceImages: true,
      supportsTextRendering: true,
      supportsHighQuality: true,
      photorealistic: true,
      creativeGeneration: true,
      typography: true,
      unsupportedFeaturesTooltip: {
        negativePrompt: 'OpenAI GPT Image menggunakan natural language prompt dibanding negative prompt.'
      }
    }
  },
  {
    providerId: 'gpt-image-2-5-extra',
    modelId: 'gpt-image-2.5-extra',
    displayName: 'GPT Image 2.5 Extra',
    label: 'Newest OpenAI • Alternate Engine',
    description: 'Newest OpenAI • Alternate Engine',
    badgeType: 'openai-extra',
    apiEndpoint: 'https://api.openai.com/v1/images/generations',
    apiKeyEnvVar: 'OPENAI_API_KEY',
    isConnected: false,
    isEnabled: true,
    isDefault: false,
    order: 3,
    modelGroup: 'STANDARD',
    supportedSizes: ['1024×1024', '1024×1792', '1792×1024'],
    supportedAspectRatios: ['1:1', '16:9', '9:16'],
    qualitySettings: ['standard', 'hd'],
    specialties: ['Alternate Engine', 'Creative Generation', 'Speed Optimized'],
    capabilities: {
      supportsPrompt: true,
      supportsNegativePrompt: false,
      supportsReferenceImages: false,
      supportsTextRendering: true,
      supportsHighQuality: true,
      photorealistic: false,
      creativeGeneration: true,
      typography: false,
      unsupportedFeaturesTooltip: {
        referenceImages: 'Fitur ini tidak tersedia pada model yang dipilih.',
        negativePrompt: 'Fitur ini tidak tersedia pada model yang dipilih.'
      }
    }
  },
  {
    providerId: 'gpt-image-2',
    modelId: 'gpt-image-2',
    displayName: 'GPT Image 2',
    label: 'Premium Creative • High Accuracy',
    description: 'Premium Creative • High Accuracy',
    badgeType: 'openai-2',
    apiEndpoint: 'https://api.openai.com/v1/images/generations',
    apiKeyEnvVar: 'OPENAI_API_KEY',
    isConnected: false,
    isEnabled: true,
    isDefault: false,
    order: 4,
    modelGroup: 'STANDARD',
    supportedSizes: ['1024×1024', '1024×1792', '1792×1024'],
    supportedAspectRatios: ['1:1', '16:9', '9:16'],
    qualitySettings: ['standard', 'hd'],
    specialties: ['Premium Creative', 'High Accuracy', 'Concept Art'],
    recommendedCategory: 'creative',
    capabilities: {
      supportsPrompt: true,
      supportsNegativePrompt: false,
      supportsReferenceImages: false,
      supportsTextRendering: false,
      supportsHighQuality: true,
      photorealistic: false,
      creativeGeneration: true,
      typography: false,
      unsupportedFeaturesTooltip: {
        referenceImages: 'Fitur ini tidak tersedia pada model yang dipilih.',
        negativePrompt: 'Fitur ini tidak tersedia pada model yang dipilih.'
      }
    }
  },
  {
    providerId: 'ideogram-4',
    modelId: 'ideogram-4.0',
    displayName: 'Ideogram 4.0',
    label: 'Typography & Poster • Text-to-Image',
    description: 'Typography & Poster • Text-to-Image',
    badgeType: 'ideogram',
    apiEndpoint: 'https://api.ideogram.ai/generate',
    apiKeyEnvVar: 'IDEOGRAM_API_KEY',
    isConnected: false,
    isEnabled: true,
    isDefault: false,
    order: 5,
    modelGroup: 'STANDARD',
    supportedSizes: ['1024×1024', '1280×720', '720×1280'],
    supportedAspectRatios: ['1:1', '16:9', '9:16', '3:4', '4:3'],
    qualitySettings: ['standard', 'hd'],
    specialties: ['Typography', 'Poster', 'Logo', 'Marketing Creative'],
    recommendedCategory: 'typography',
    capabilities: {
      supportsPrompt: true,
      supportsNegativePrompt: true,
      supportsReferenceImages: false,
      supportsTextRendering: true,
      supportsHighQuality: true,
      photorealistic: false,
      creativeGeneration: true,
      typography: true,
      unsupportedFeaturesTooltip: {
        referenceImages: 'Fitur ini tidak tersedia pada model yang dipilih.'
      }
    }
  },
  {
    providerId: 'nano-banana-2',
    modelId: 'nano-banana-2',
    displayName: 'Nano Banana 2',
    label: 'Fast Generation',
    description: 'Fast Generation • Ultralight Speed & Optimized Latency',
    badgeType: 'banana',
    apiEndpoint: 'https://api.banana.dev/v1/image/nano-2',
    apiKeyEnvVar: 'BANANA_API_KEY',
    isConnected: true,
    isEnabled: true,
    isDefault: false,
    order: 6,
    modelGroup: 'FAST',
    supportedSizes: ['1024×1024', '1792×1024', '1024×1792', '768×768'],
    supportedAspectRatios: ['1:1', '16:9', '9:16', '3:4', '4:3'],
    qualitySettings: ['standard'],
    specialties: ['Fast Generation', 'Ultra Low Latency', 'Quick Drafts', 'Social Media'],
    capabilities: {
      supportsPrompt: true,
      supportsNegativePrompt: true,
      supportsReferenceImages: true,
      supportsTextRendering: true,
      supportsHighQuality: false,
      photorealistic: true,
      creativeGeneration: true,
      typography: true
    }
  },
  {
    providerId: 'litellm',
    modelId: 'litellm-gateway',
    displayName: 'LiteLLM Gateway',
    label: 'api.koboillm.com/v1 • Dynamic Models Hub',
    description: 'LiteLLM Proxy • Akses seluruh model dari api.koboillm.com/v1 secara real-time',
    badgeType: 'litellm',
    apiEndpoint: 'https://api.koboillm.com/v1/images/generations',
    apiKeyEnvVar: 'KOBOILLM_API_KEY',
    isConnected: false,
    isEnabled: true,
    isDefault: false,
    order: 7,
    modelGroup: 'FAST',
    supportedSizes: ['1024×1024', '1792×1024', '1024×1792', '768×768'],
    supportedAspectRatios: ['1:1', '16:9', '9:16', '2:3', '3:4', '4:3'],
    qualitySettings: ['standard', 'hd', 'max'],
    specialties: ['LiteLLM Proxy', 'All Models Hub', 'api.koboillm.com', 'Fast & Multi-Engine'],
    capabilities: {
      supportsPrompt: true,
      supportsNegativePrompt: true,
      supportsReferenceImages: true,
      supportsTextRendering: true,
      supportsHighQuality: true,
      photorealistic: true,
      creativeGeneration: true,
      typography: true
    }
  }
];

export const SMART_RECOMMENDATIONS: SmartRecommendation[] = [
  {
    category: 'typography',
    title: 'Poster dengan Banyak Teks / Logo',
    description: 'Ideal untuk poster promosi, brosur, logo, dan infografis teks tajam',
    recommendedProviderId: 'ideogram-4',
    reason: 'Ideogram 4.0 adalah model terdepan dalam rendering tipografi teks yang akurat tanpa typo.'
  },
  {
    category: 'photorealistic',
    title: 'Foto Produk Photorealistic',
    description: 'Ideal untuk visual botol serum, skincare, makanan, dan potret sinematik',
    recommendedProviderId: 'seedream-5-pro',
    reason: 'Seedream 5.0 Pro dioptimalkan untuk pencahayaan studio komersial dan detail makro photorealistic.'
  },
  {
    category: 'max_quality',
    title: 'Kualitas Gambar Maksimum',
    description: 'Ideal untuk detail resolusi ultra tinggi dan naskah prompt yang kompleks',
    recommendedProviderId: 'gpt-image-2-5-pro',
    reason: 'GPT Image 2.5 Pro menawarkan pemahaman instruksi prompt terdalam dan ketajaman tekstur maksimal.'
  },
  {
    category: 'creative',
    title: 'Creative Image & Konsep Abstrak',
    description: 'Ideal untuk ilustrasi fantasi, anime modern, dan eksplorasi visual unik',
    recommendedProviderId: 'gpt-image-2',
    reason: 'GPT Image 2 memiliki akurasi artistik tinggi untuk gubahan visual kreatif dan estetik.'
  }
];
