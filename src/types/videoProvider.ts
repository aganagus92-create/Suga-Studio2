export type VideoProviderId =
  | 'seedance-2-0-fast-pro'
  | 'veo-3-1-fast-pro'
  | 'veo-3-1-lite-pro'
  | 'veo-3-1-pro'
  | 'veo-3-0-fast-pro'
  | 'google-omni-1-1'
  | 'happy-horse-1-0';

export type VideoProviderBadgeType =
  | 'seedance-2-fast'
  | 'veo-fast'
  | 'veo-lite'
  | 'veo-pro'
  | 'veo-3-green'
  | 'omni'
  | 'horse';

export type VideoAspectRatio = '16:9' | '9:16' | '1:1' | '4:5';

export type VideoQuality = 'Fast' | 'Balanced' | 'High' | 'Maximum';

export type VideoDuration = '3s' | '4s' | '5s' | '6s' | '8s' | '10s' | 'auto';
export type VideoDurationOption = VideoDuration;

export type MotionIntensity = 'Very Low' | 'Low' | 'Medium' | 'High' | 'Very High';
export type MotionIntensityType = MotionIntensity;

export type CameraMotion =
  | 'Static'
  | 'Slow Zoom In'
  | 'Slow Zoom Out'
  | 'Dolly In'
  | 'Dolly Out'
  | 'Pan Left'
  | 'Pan Right'
  | 'Tilt Up'
  | 'Tilt Down'
  | 'Orbit'
  | 'Tracking Shot'
  | 'Handheld'
  | 'Cinematic Push-In'
  | 'Cinematic Pull-Out';
export type CameraMotionType = CameraMotion;

export type VideoJobStatus = 'QUEUED' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export interface VideoGenerationOptions {
  image?: string; // Image URL or base64 data
  prompt: string;
  negativePrompt?: string;
  duration?: VideoDuration;
  aspectRatio?: VideoAspectRatio;
  resolution?: '720p' | '1080p' | '4k';
  fps?: 24 | 25 | 30 | 60;
  cameraMotion?: CameraMotion;
  motionIntensity?: MotionIntensity;
  quality?: VideoQuality;
  audio?: boolean;
  seed?: number;
}

export interface VideoJobResult {
  id: string;
  provider: VideoProviderId;
  model: string;
  status: VideoJobStatus;
  progress?: number;
  videoUrl?: string;
  thumbnailUrl?: string;
  duration?: string;
  width?: number;
  height?: number;
  fps?: number;
  prompt: string;
  negativePrompt?: string;
  cameraMotion?: CameraMotion;
  motionIntensity?: MotionIntensity;
  aspectRatio?: VideoAspectRatio;
  resolution?: string;
  audioEnabled?: boolean;
  createdAt: string;
  error?: string;
}

export interface VideoProviderCapability {
  supportsImageToVideo: boolean;
  supportsTextToVideo: boolean;
  supportsNegativePrompt: boolean;
  supportsCameraControl: boolean;
  supportsDuration: boolean;
  supportedDurations: VideoDuration[];
  supportsAspectRatio: boolean;
  supportedAspectRatios: VideoAspectRatio[];
  supportsFPS: boolean;
  supportedFPS: number[];
  supportsReferenceImage: boolean;
  supportsAudio: boolean;
  supportsSeed: boolean;
  supportsResolution: boolean;
  supportedResolutions: string[];
  maxDurationSec: number;
}

export interface AIVideoProviderConfig {
  providerId: VideoProviderId;
  modelId: string;
  displayName: string;
  description: string;
  label: string;
  badgeType: VideoProviderBadgeType;
  apiEndpoint: string;
  apiKeyEnvVar: string;
  apiKey?: string;
  isConnected: boolean;
  isEnabled: boolean;
  isDefault?: boolean;
  order: number;
  capabilities: VideoProviderCapability;
  specialties: string[];
  recommendedCategory?: 'fast' | 'cinematic' | 'lightweight' | 'creative' | 'high_quality';
  fallbackProviderId?: VideoProviderId;
}

export interface VideoProviderTestResult {
  success: boolean;
  message: string;
  latencyMs?: number;
  providerId: VideoProviderId;
}

export interface VideoGenerationError {
  code: 'NOT_CONFIGURED' | 'API_ERROR' | 'TIMEOUT' | 'INVALID_IMAGE' | 'RATE_LIMIT' | 'FALLBACK_FAILED';
  title: string;
  detail: string;
  providerId: VideoProviderId;
  providerName: string;
  modelId: string;
  canRetry: boolean;
  canFallback: boolean;
  requiresSettings: boolean;
}

export interface VideoPreset {
  id: string;
  name: string;
  desc: string;
  motionPromptSuffix: string;
  defaultCameraMotion: CameraMotion;
  defaultIntensity: MotionIntensity;
  iconName: string;
}
