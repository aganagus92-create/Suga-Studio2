import React, { useState, useEffect, useRef } from 'react';
import {
  Film,
  Upload,
  Sparkles,
  Play,
  Pause,
  Download,
  RotateCcw,
  Sliders,
  Camera,
  Layers,
  Clock,
  Zap,
  CheckCircle2,
  AlertCircle,
  Settings2,
  Trash2,
  Maximize2,
  Volume2,
  VolumeX,
  Copy,
  Check,
  ChevronRight,
  Info,
  Compass,
  ArrowRight
} from 'lucide-react';
import { VideoModelSelector } from './VideoModelSelector';
import { VideoProviderSettingsModal } from './VideoProviderSettingsModal';
import { videoProviderRegistry } from '../../services/videoProviders/videoProviderRegistry';
import { VIDEO_GENERATION_PRESETS } from '../../services/videoProviders/defaultVideoConfigs';
import {
  VideoJobResult,
  VideoPreset,
  CameraMotionType,
  MotionIntensityType,
  VideoAspectRatio,
  VideoDurationOption
} from '../../types/videoProvider';

interface VideoGeneratorPanelProps {
  initialImage?: string;
  initialPrompt?: string;
  onClearInitialImage?: () => void;
  onSuccessToast?: (msg: string) => void;
  onErrorToast?: (msg: string) => void;
}

export const VideoGeneratorPanel: React.FC<VideoGeneratorPanelProps> = ({
  initialImage,
  initialPrompt,
  onClearInitialImage,
  onSuccessToast,
  onErrorToast
}) => {
  const [, setTick] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Form states
  const [selectedImage, setSelectedImage] = useState<string | null>(initialImage || null);
  const [motionPrompt, setMotionPrompt] = useState<string>(initialPrompt || '');
  const [negativePrompt, setNegativePrompt] = useState<string>('');
  const [showNegative, setShowNegative] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string>('cinematic');
  const [cameraMotion, setCameraMotion] = useState<CameraMotionType>('Cinematic Push-In');
  const [motionIntensity, setMotionIntensity] = useState<MotionIntensityType>('Medium');
  const [aspectRatio, setAspectRatio] = useState<VideoAspectRatio>('16:9');
  const [duration, setDuration] = useState<VideoDurationOption>('5s');
  const [fps, setFps] = useState<number>(24);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [seed, setSeed] = useState<string>('');

  // Generation & job states
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentJob, setCurrentJob] = useState<VideoJobResult | null>(null);
  const [generatedVideos, setGeneratedVideos] = useState<VideoJobResult[]>([]);
  const [activeVideoIndex, setActiveVideoIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [fallbackBanner, setFallbackBanner] = useState<{ from: string; to: string; reason: string } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const pollTimerRef = useRef<any>(null);

  // Sync initial props
  useEffect(() => {
    if (initialImage) {
      setSelectedImage(initialImage);
    }
    if (initialPrompt) {
      setMotionPrompt(initialPrompt);
    }
  }, [initialImage, initialPrompt]);

  // Subscribe to registry changes
  useEffect(() => {
    const unsub = videoProviderRegistry.subscribe(() => setTick((t) => t + 1));
    return () => {
      unsub();
      if (pollTimerRef.current) clearInterval(pollTimerRef.current);
    };
  }, []);

  const activeProvider = videoProviderRegistry.getActiveProvider();
  const activeConfig = activeProvider.getConfig();
  const capabilities = activeConfig.capabilities;

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('creator_studio_video_history_v1');
      if (saved) {
        setGeneratedVideos(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveHistory = (videos: VideoJobResult[]) => {
    setGeneratedVideos(videos);
    try {
      localStorage.setItem('creator_studio_video_history_v1', JSON.stringify(videos.slice(0, 30)));
    } catch {
      // ignore
    }
  };

  // Image Upload handler
  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      onErrorToast?.('File harus berupa gambar (JPG, PNG, WEBP)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const b64 = loadEvt.target?.result as string;
      setSelectedImage(b64);
      onSuccessToast?.('Gambar berhasil dimuat untuk animasi video!');
    };
    reader.readAsDataURL(file);
  };

  // Preset Selection
  const applyPreset = (preset: VideoPreset) => {
    setSelectedPreset(preset.id);
    setCameraMotion(preset.defaultCameraMotion);
    setMotionIntensity(preset.defaultIntensity);

    // If prompt is empty or basic, append preset suffix
    if (!motionPrompt.trim()) {
      setMotionPrompt(preset.motionPromptSuffix);
    }
  };

  // Enhance prompt
  const handleEnhancePrompt = () => {
    const enhanced = videoProviderRegistry.enhanceMotionPrompt(motionPrompt);
    setMotionPrompt(enhanced);
    onSuccessToast?.('Motion prompt berhasil ditingkatkan secara sinematik!');
  };

  // Start Video Generation
  const handleGenerateVideo = async () => {
    if (!motionPrompt.trim() && !selectedImage) {
      onErrorToast?.('Silakan unggah gambar atau tulis prompt pergerakan video.');
      return;
    }

    setIsGenerating(true);
    setFallbackBanner(null);

    try {
      const initialResult = await videoProviderRegistry.generateVideoWithFallback(
        {
          prompt: motionPrompt.trim() || 'Cinematic subtle motion, natural physics, photorealistic lighting',
          negativePrompt: showNegative ? negativePrompt.trim() : undefined,
          image: selectedImage || undefined,
          cameraMotion,
          motionIntensity,
          duration,
          aspectRatio,
          fps,
          resolution: '1080p',
          audio: audioEnabled && capabilities.supportsAudio,
          seed: seed ? parseInt(seed) : undefined
        },
        (fromModel, toModel, reason) => {
          setFallbackBanner({ from: fromModel, to: toModel, reason });
        }
      );

      setCurrentJob(initialResult);

      // Start polling status
      const jobId = initialResult.id;
      let attempts = 0;

      if (pollTimerRef.current) clearInterval(pollTimerRef.current);

      pollTimerRef.current = setInterval(async () => {
        attempts++;
        try {
          const updated = await activeProvider.pollJobStatus(jobId);
          setCurrentJob(updated);

          if (updated.status === 'COMPLETED') {
            clearInterval(pollTimerRef.current);
            setIsGenerating(false);
            const nextList = [updated, ...generatedVideos];
            saveHistory(nextList);
            setActiveVideoIndex(0);
            onSuccessToast?.(`Video berhasil digenerate dengan ${updated.model}!`);
          } else if (updated.status === 'FAILED') {
            clearInterval(pollTimerRef.current);
            setIsGenerating(false);
            onErrorToast?.(updated.error || 'Generasi video gagal diproses.');
          }
        } catch {
          if (attempts > 30) {
            clearInterval(pollTimerRef.current);
            setIsGenerating(false);
          }
        }
      }, 1000);
    } catch (err: any) {
      setIsGenerating(false);
      const detail = err.detail || err.message || 'Gagal memulai render video.';
      onErrorToast?.(detail);
      if (err.requiresSettings) {
        setIsSettingsOpen(true);
      }
    }
  };

  const currentDisplayVideo = generatedVideos[activeVideoIndex] || null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Model Information & Quick Settings */}
      <div className="p-4 rounded-3xl bg-[#070e1c] border border-blue-600/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl shadow-blue-950/20">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-900/40 shrink-0">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white tracking-wide">
                AI Video Generator (Image-to-Video)
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300 font-mono border border-blue-500/30">
                PRO ENGINE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Ubah gambar statis jadi video sinematik dengan pergerakan kamera realistis & 7 provider video terkemuka.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsSettingsOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Settings2 className="w-3.5 h-3.5 text-blue-400" />
            <span>Pengaturan Provider</span>
          </button>
        </div>
      </div>

      {/* Fallback Notice Banner */}
      {fallbackBanner && (
        <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-500/30 flex items-start justify-between gap-3 text-xs text-amber-200 animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Auto Fallback Berhasil Dialihkan:</span> Provider{' '}
              <span className="text-amber-300 font-semibold">{fallbackBanner.from}</span> dialihkan ke{' '}
              <span className="text-white font-bold">{fallbackBanner.to}</span> karena kendala teknis:{' '}
              <span className="text-amber-300/80">{fallbackBanner.reason}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setFallbackBanner(null)}
            className="text-amber-400 hover:text-white cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Grid: Left Controls & Right Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Input controls (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* 1. Model Selector */}
          <div className="p-4 rounded-3xl bg-[#081122] border border-slate-800/90 shadow-lg">
            <VideoModelSelector
              currentPrompt={motionPrompt}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          </div>

          {/* 2. Image Input / Animate Image Workflow */}
          <div className="p-5 rounded-3xl bg-[#081122] border border-slate-800/90 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-blue-400" />
                Gambar Sumber (Image-to-Video)
              </label>
              {selectedImage && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedImage(null);
                    onClearInitialImage?.();
                  }}
                  className="text-[11px] text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  Hapus Gambar
                </button>
              )}
            </div>

            {selectedImage ? (
              <div className="relative rounded-2xl overflow-hidden border border-blue-500/40 group max-h-64 bg-black/60 flex items-center justify-center">
                <img
                  src={selectedImage}
                  alt="Source"
                  className="max-h-64 w-full object-contain rounded-2xl"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors cursor-pointer"
                  >
                    Ganti Gambar
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-8 rounded-2xl border-2 border-dashed border-slate-700 hover:border-blue-500/70 bg-[#060c18] hover:bg-[#091326] transition-all cursor-pointer text-center space-y-2 group"
              >
                <div className="w-10 h-10 rounded-full bg-blue-600/10 border border-blue-500/30 flex items-center justify-center mx-auto text-blue-400 group-hover:scale-110 transition-transform">
                  <Upload className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-200">
                    Klik atau seret gambar ke sini untuk dianimasikan
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Mendukung JPG, PNG, WEBP (Maksimal 15MB)
                  </p>
                </div>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageFile}
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* 3. Motion Prompt & Assistant */}
          <div className="p-5 rounded-3xl bg-[#081122] border border-slate-800/90 shadow-lg space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                Motion Prompt (Instruksi Pergerakan)
              </label>
              <button
                type="button"
                onClick={handleEnhancePrompt}
                className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors cursor-pointer"
                title="Perkaya prompt secara sinematik dengan AI"
              >
                <Sparkles className="w-3 h-3" />
                <span>✨ Tingkatkan Prompt</span>
              </button>
            </div>

            <textarea
              rows={3}
              value={motionPrompt}
              onChange={(e) => setMotionPrompt(e.target.value)}
              placeholder="Jelaskan pergerakan yang diinginkan (contoh: subjek menoleh ke kamera sambil tersenyum lembut, hembusan angin menggerakkan rambut, pencahayaan dramatis)..."
              className="w-full p-3.5 rounded-2xl bg-[#060c18] border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all leading-relaxed"
            />

            {/* Quick Suggestions */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {[
                'Cinematic slow push-in, natural breathing',
                '360 orbital rotation around subject',
                'Gentle wind blowing through hair',
                'Realistic eye blinking & subtle head tilt',
                'Hyper-lapse moving clouds & sunset light'
              ].map((sug, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setMotionPrompt(sug)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800/70 hover:bg-slate-700 text-[10px] text-slate-300 border border-slate-700/60 transition-colors cursor-pointer"
                >
                  {sug}
                </button>
              ))}
            </div>

            {/* Negative Prompt Toggle */}
            <div className="pt-2 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => setShowNegative(!showNegative)}
                className="text-[11px] text-slate-400 hover:text-slate-200 flex items-center gap-1 cursor-pointer"
              >
                <span>{showNegative ? '− Sembunyikan Negative Prompt' : '+ Tambah Negative Prompt'}</span>
              </button>
              {showNegative && (
                <input
                  type="text"
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  placeholder="Hal yang dihindari (contoh: jerky motion, blurry, distorted face, extra limbs, jitter)"
                  className="w-full mt-2 px-3 py-2 rounded-xl bg-[#060c18] border border-slate-800 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500"
                />
              )}
            </div>
          </div>

          {/* 4. Cinematic Presets */}
          <div className="p-5 rounded-3xl bg-[#081122] border border-slate-800/90 shadow-lg space-y-3">
            <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              Preset Gaya Video ({VIDEO_GENERATION_PRESETS.length})
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {VIDEO_GENERATION_PRESETS.map((p) => {
                const isSelected = selectedPreset === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => applyPreset(p)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-950/40'
                        : 'bg-[#060c18] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold truncate">{p.name}</div>
                      <div className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">{p.desc}</div>
                    </div>
                    <div className="text-[9px] font-mono text-blue-400 mt-2">
                      {p.defaultCameraMotion}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Camera Motion & Parameters */}
          <div className="p-5 rounded-3xl bg-[#081122] border border-slate-800/90 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-blue-400" />
                Parameter Kamera & Render
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Camera Motion */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300">
                  Pergerakan Kamera (Camera Motion)
                </label>
                <select
                  value={cameraMotion}
                  onChange={(e) => setCameraMotion(e.target.value as CameraMotionType)}
                  className="w-full p-2.5 rounded-xl bg-[#060c18] border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Static">Static (Kamera Diam)</option>
                  <option value="Pan Left">Pan Left (Geser Kiri)</option>
                  <option value="Pan Right">Pan Right (Geser Kanan)</option>
                  <option value="Tilt Up">Tilt Up (Arah Atas)</option>
                  <option value="Tilt Down">Tilt Down (Arah Bawah)</option>
                  <option value="Zoom In">Zoom In (Mendekat)</option>
                  <option value="Zoom Out">Zoom Out (Menjauh)</option>
                  <option value="Orbit">Orbit (Memutari Objek)</option>
                  <option value="Dolly In">Dolly In</option>
                  <option value="Dolly Out">Dolly Out</option>
                  <option value="Tracking Shot">Tracking Shot (Mengikuti Objek)</option>
                  <option value="Cinematic Push-In">Cinematic Push-In (Sinematik)</option>
                </select>
              </div>

              {/* Motion Intensity */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300">
                  Intensitas Gerakan
                </label>
                <select
                  value={motionIntensity}
                  onChange={(e) => setMotionIntensity(e.target.value as MotionIntensityType)}
                  className="w-full p-2.5 rounded-xl bg-[#060c18] border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Very Low">Sangat Halus (Subtle)</option>
                  <option value="Low">Rendah (Smooth)</option>
                  <option value="Medium">Sedang (Standard Cinematic)</option>
                  <option value="High">Tinggi (Dynamic)</option>
                  <option value="Very High">Sangat Dinamis (High Action)</option>
                </select>
              </div>

              {/* Aspect Ratio */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300">
                  Rasio Aspek
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['16:9', '9:16', '1:1', '4:5'] as VideoAspectRatio[]).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setAspectRatio(r)}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        aspectRatio === r
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-[#060c18] border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300">
                  Durasi Video
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['3s', '5s', '8s', '10s'] as VideoDurationOption[]).map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDuration(d)}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                        duration === d
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-[#060c18] border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Audio & FPS toggle */}
            <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="audioToggle"
                  checked={audioEnabled}
                  disabled={!capabilities.supportsAudio}
                  onChange={(e) => setAudioEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-900 border-slate-700 cursor-pointer disabled:opacity-40"
                />
                <label
                  htmlFor="audioToggle"
                  className={`text-xs ${
                    capabilities.supportsAudio ? 'text-slate-300 cursor-pointer' : 'text-slate-600'
                  }`}
                >
                  Generate Audio Sinematik (Didukung model {capabilities.supportsAudio ? 'Veo 3.1' : 'tertentu'})
                </label>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                <span>FPS:</span>
                <button
                  type="button"
                  onClick={() => setFps(fps === 24 ? 30 : fps === 30 ? 60 : 24)}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer"
                >
                  {fps} FPS
                </button>
              </div>
            </div>
          </div>

          {/* 6. Generate Action Button */}
          <button
            type="button"
            onClick={handleGenerateVideo}
            disabled={isGenerating}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm tracking-wide shadow-xl shadow-blue-900/40 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group hover:shadow-blue-500/20 active:scale-[0.99]"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Memproses Video dengan {activeConfig.displayName}...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-blue-200 group-hover:rotate-12 transition-transform" />
                <span>Generate AI Video Sekarang</span>
                <ArrowRight className="w-4 h-4 text-blue-200 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>

        {/* RIGHT COLUMN: Real-time Player & Generation History (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Active Player Card */}
          <div className="p-5 rounded-3xl bg-[#081122] border border-slate-800/90 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Film className="w-3.5 h-3.5 text-blue-400" />
                Pratinjau Video
              </h4>
              {currentDisplayVideo && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-900/60 text-blue-300 font-mono border border-blue-500/30">
                  {currentDisplayVideo.model} • {currentDisplayVideo.aspectRatio}
                </span>
              )}
            </div>

            {/* Video Viewport / Canvas */}
            <div className="relative rounded-2xl overflow-hidden bg-black/90 aspect-video flex items-center justify-center border border-slate-800 group">
              {isGenerating && currentJob ? (
                <div className="p-6 text-center space-y-4 max-w-xs animate-in fade-in">
                  <div className="relative w-16 h-16 mx-auto">
                    <div className="w-16 h-16 rounded-full border-4 border-blue-600/30 border-t-blue-500 animate-spin" />
                    <Film className="w-6 h-6 text-blue-400 absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white">
                      {currentJob.status === 'QUEUED' ? 'Antrean Render Video...' : 'Rendering Latent Frames...'}
                    </h5>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {activeConfig.displayName} • {currentJob.cameraMotion}
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full transition-all duration-500"
                      style={{ width: `${currentJob.progress}%` }}
                    />
                  </div>
                  <div className="text-[10px] font-mono text-blue-400">
                    {currentJob.progress}% Selesai
                  </div>
                </div>
              ) : currentDisplayVideo?.videoUrl ? (
                <>
                  <video
                    ref={videoRef}
                    src={currentDisplayVideo.videoUrl}
                    poster={currentDisplayVideo.thumbnailUrl}
                    loop
                    playsInline
                    muted={isMuted}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    className="w-full h-full object-contain rounded-2xl"
                  />

                  {/* Player Overlay Controls */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-black/60 text-white font-mono backdrop-blur-md">
                        {currentDisplayVideo.duration} • {currentDisplayVideo.fps} FPS
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setIsMuted(!isMuted)}
                          className="p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 backdrop-blur-md cursor-pointer"
                        >
                          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <button
                        type="button"
                        onClick={togglePlay}
                        className="w-12 h-12 rounded-full bg-blue-600/90 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 cursor-pointer backdrop-blur-md"
                      >
                        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs text-white">
                      <span className="truncate max-w-[200px] text-[11px] text-slate-300">
                        {currentDisplayVideo.prompt}
                      </span>
                      <a
                        href={currentDisplayVideo.videoUrl}
                        download={`ai-video-${currentDisplayVideo.id}.mp4`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-[11px] font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Unduh
                      </a>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center space-y-2">
                  <Film className="w-10 h-10 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">
                    Belum ada video yang di-render.
                  </p>
                  <p className="text-[11px] text-slate-600">
                    Pilih model AI, masukkan gambar & prompt untuk memulai render.
                  </p>
                </div>
              )}
            </div>

            {/* Video Details & Actions */}
            {currentDisplayVideo && (
              <div className="p-3.5 rounded-2xl bg-[#060c18] border border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <div className="text-slate-300 font-semibold truncate max-w-[240px]">
                    {currentDisplayVideo.prompt}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyPrompt(currentDisplayVideo.prompt)}
                    className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                  >
                    {copiedPrompt ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedPrompt ? 'Tersalin' : 'Salin Prompt'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                  <div className="p-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-400">
                    Kamera: <span className="text-white font-bold">{currentDisplayVideo.cameraMotion}</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-400">
                    Intensitas: <span className="text-white font-bold">{currentDisplayVideo.motionIntensity}</span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-400">
                    Rasio: <span className="text-white font-bold">{currentDisplayVideo.aspectRatio}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Video History Carousel / List */}
          <div className="p-5 rounded-3xl bg-[#081122] border border-slate-800/90 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                Riwayat Video ({generatedVideos.length})
              </h4>
              {generatedVideos.length > 0 && (
                <button
                  type="button"
                  onClick={() => saveHistory([])}
                  className="text-[10px] text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                >
                  Bersihkan
                </button>
              )}
            </div>

            {generatedVideos.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-4">
                Riwayat video yang Anda buat akan muncul di sini.
              </p>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                {generatedVideos.map((item, idx) => (
                  <div
                    key={item.id}
                    onClick={() => setActiveVideoIndex(idx)}
                    className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      activeVideoIndex === idx
                        ? 'bg-blue-600/15 border-blue-500/70 shadow-md shadow-blue-950/40'
                        : 'bg-[#060c18] border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className="w-12 h-9 rounded-lg bg-black shrink-0 overflow-hidden flex items-center justify-center border border-slate-800">
                        {item.thumbnailUrl ? (
                          <img
                            src={item.thumbnailUrl}
                            alt="Thumb"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Film className="w-4 h-4 text-slate-500" />
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-xs font-bold text-white truncate">
                          {item.prompt}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span className="text-blue-400 font-mono">{item.model}</span>
                          <span>•</span>
                          <span>{item.duration}</span>
                          <span>•</span>
                          <span>{item.createdAt}</span>
                        </div>
                      </div>
                    </div>

                    <a
                      href={item.videoUrl}
                      download={`video-${item.id}.mp4`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer shrink-0"
                      title="Unduh MP4"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Provider Settings Modal */}
      <VideoProviderSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSuccessToast={onSuccessToast}
      />
    </div>
  );
};
