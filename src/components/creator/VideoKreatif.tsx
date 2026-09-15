import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Video,
  Play,
  Pause,
  Clock,
  ChevronDown,
  ChevronUp,
  Check,
  RefreshCw,
  Download,
  Copy,
  Upload,
  Volume2,
  VolumeX,
  Film,
  Image as ImageIcon,
  Wand2,
  Eye,
  Trash2,
  Sliders,
  CheckCircle2,
  Layers,
  ArrowRight,
  Plus,
  ArrowUp,
  ArrowDown,
  Music,
  Scissors
} from 'lucide-react';
import { ActiveView } from '../../types';
import {
  Seedance2FastProIcon,
  Seedance25Icon,
  KlingV3ProIcon,
  MinimaxH3Icon,
  Veo31FastProIcon,
  Veo31LiteProIcon,
  Veo31ProIcon,
  Veo30FastProIcon,
  GoogleOmniIcon,
  HappyHorseIcon,
  Seedance10ProIcon,
  Seedance10ProFastIcon
} from './ModelBadgeIcons';
import { GabungVideo } from './GabungVideo';
import { VideoGeneratorPanel } from './VideoGeneratorPanel';

interface VideoKreatifProps {
  initialSubView?: ActiveView;
  initialImage?: string;
  initialPrompt?: string;
  onClearInitialImage?: () => void;
  onDeductCredits: (amount: number) => boolean;
  onShowToast: (msg: string) => void;
  onAddHistory: (type: string, title: string) => void;
}

interface AIModel {
  id: string;
  name: string;
  badgeType: string;
}

interface VideoHistoryItem {
  id: string;
  prompt: string;
  model: string;
  duration: string;
  ratio: string;
  quality: string;
  hasAudio: boolean;
  time: string;
  mode: string;
  imageThumbnail?: string;
}

interface MotionHistoryItem {
  id: string;
  subjectImage: string;
  referenceVideoName: string;
  orientation: 'video' | 'photo';
  resolution: '720p' | '1080p';
  prompt: string;
  durationSec: number;
  time: string;
  cost: number;
}

const AI_VIDEO_MODELS: AIModel[] = [
  { id: 'seedance-2-0-fast-pro', name: 'Seedance 2.0 Fast Pro', badgeType: 'seedance-2-fast' },
  { id: 'seedance-2-5', name: 'Seedance 2.5', badgeType: 'seedance-2-5' },
  { id: 'kling-v3-pro', name: 'Kling V3 Pro', badgeType: 'kling' },
  { id: 'minimax-h3', name: 'Minimax H3', badgeType: 'minimax' },
  { id: 'veo-3-1-fast-pro', name: 'Veo 3.1 Fast Pro', badgeType: 'veo-fast' },
  { id: 'veo-3-1-lite-pro', name: 'Veo 3.1 Lite Pro', badgeType: 'veo-lite' },
  { id: 'veo-3-1-pro', name: 'Veo 3.1 Pro', badgeType: 'veo-pro' },
  { id: 'veo-3-0-fast-pro', name: 'Veo 3.0 Fast Pro', badgeType: 'veo-3-green' },
  { id: 'google-omni-1-1', name: 'Google Omni 1.1', badgeType: 'omni' },
  { id: 'happy-horse-1-0', name: 'Happy Horse 1.0', badgeType: 'horse' },
  { id: 'seedance-1-0-pro', name: 'Seedance 1.0 Pro', badgeType: 'seedance-1-red' },
  { id: 'seedance-1-0-pro-fast', name: 'Seedance 1.0 Pro Fast', badgeType: 'seedance-1-gold' }
];

export const VideoKreatif: React.FC<VideoKreatifProps> = ({
  initialSubView = 'video-buat',
  initialImage,
  initialPrompt,
  onClearInitialImage,
  onDeductCredits,
  onShowToast,
  onAddHistory
}) => {
  const [activeSubTab, setActiveSubTab] = useState<ActiveView>(initialSubView);

  // Synchronize with external navigation updates from sidebar
  useEffect(() => {
    if (initialSubView) {
      setActiveSubTab(initialSubView);
    }
  }, [initialSubView]);

  // ==========================================
  // 1. BUAT VIDEO AI (Tab: video-buat) STATE
  // ==========================================
  const [prompt, setPrompt] = useState('');
  const [mode, setMode] = useState<'text-to-video' | 'image-to-video' | 'start-end-frame'>('text-to-video');
  const [selectedModel, setSelectedModel] = useState<AIModel>(AI_VIDEO_MODELS[0]);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [duration, setDuration] = useState<'5s' | '10s' | '15s'>('5s');
  const [ratio, setRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [quality, setQuality] = useState<'720p' | '1080p'>('720p');
  const [audioEnabled, setAudioEnabled] = useState(false);

  // Uploaded Image for Image to Video
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Generation & Player State for Buat Video
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [currentVideo, setCurrentVideo] = useState<VideoHistoryItem | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const [historyList, setHistoryList] = useState<VideoHistoryItem[]>([]);

  // Dropdown click-outside listener
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsModelDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute resolution string
  const getResolutionDisplay = () => {
    if (ratio === '16:9') {
      return quality === '1080p' ? '1920 × 1080' : '1280 × 720';
    }
    if (ratio === '9:16') {
      return quality === '1080p' ? '1080 × 1920' : '720 × 1280';
    }
    return quality === '1080p' ? '1080 × 1080' : '720 × 720';
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      setUploadedImage(evt.target?.result as string);
      onShowToast('Gambar referensi berhasil diunggah.');
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateVideo = () => {
    if (!prompt.trim() && mode === 'text-to-video') {
      onShowToast('Silakan masukkan prompt deskripsi video terlebih dahulu.');
      return;
    }
    if (mode === 'image-to-video' && !uploadedImage && !prompt.trim()) {
      onShowToast('Silakan unggah gambar atau ketik prompt animasi.');
      return;
    }
    if (!onDeductCredits(150)) return;

    setIsGenerating(true);
    setGenerationProgress(15);

    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        if (prev >= 88) {
          clearInterval(interval);
          return 88;
        }
        return prev + 18;
      });
    }, 400);

    setTimeout(() => {
      clearInterval(interval);
      setGenerationProgress(100);

      const now = new Date();
      const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

      const newVideo: VideoHistoryItem = {
        id: `vid-${Date.now()}`,
        prompt: prompt.trim() || 'A cinematic scene rendered with AI',
        model: selectedModel.name,
        duration,
        ratio,
        quality,
        hasAudio: audioEnabled,
        time: timeStr,
        mode: mode === 'text-to-video' ? 'Text to Video' : mode === 'image-to-video' ? 'Image to Video' : 'Start/End Frame',
        imageThumbnail: uploadedImage || undefined
      };

      setCurrentVideo(newVideo);
      setHistoryList((prev) => [newVideo, ...prev]);
      setIsGenerating(false);
      setIsPlaying(true);
      onShowToast(`Video berhasil dibuat dengan ${selectedModel.name} (-150 kredit)!`);
      onAddHistory('Buat Video AI', prompt.slice(0, 30) || selectedModel.name);
    }, 2400);
  };

  // Render model badge icon matching screenshot
  const renderModelIcon = (model: AIModel) => {
    switch (model.id) {
      case 'seedance-2-0-fast-pro':
        return <Seedance2FastProIcon className="w-6 h-6" />;
      case 'seedance-2-5':
        return <Seedance25Icon className="w-6 h-6" />;
      case 'kling-v3-pro':
        return <KlingV3ProIcon className="w-6 h-6" />;
      case 'minimax-h3':
        return <MinimaxH3Icon className="w-6 h-6" />;
      case 'veo-3-1-fast-pro':
        return <Veo31FastProIcon className="w-6 h-6" />;
      case 'veo-3-1-lite-pro':
        return <Veo31LiteProIcon className="w-6 h-6" />;
      case 'veo-3-1-pro':
        return <Veo31ProIcon className="w-6 h-6" />;
      case 'veo-3-0-fast-pro':
        return <Veo30FastProIcon className="w-6 h-6" />;
      case 'google-omni-1-1':
        return <GoogleOmniIcon className="w-6 h-6" />;
      case 'happy-horse-1-0':
        return <HappyHorseIcon className="w-6 h-6" />;
      case 'seedance-1-0-pro':
        return <Seedance10ProIcon className="w-6 h-6" />;
      case 'seedance-1-0-pro-fast':
        return <Seedance10ProFastIcon className="w-6 h-6" />;
      default:
        return <Seedance2FastProIcon className="w-6 h-6" />;
    }
  };

  // ==========================================
  // 2. MOTION CONTROL V3 STATE (Tab: video-motion-v3)
  // ==========================================
  const [subjectImage, setSubjectImage] = useState<string | null>(null);
  const [refVideoFile, setRefVideoFile] = useState<string | null>(null);
  const [refVideoName, setRefVideoName] = useState<string>('');
  const [refVideoDuration, setRefVideoDuration] = useState<number>(5); // default 5 seconds
  const [orientation, setOrientation] = useState<'video' | 'photo'>('video');
  const [motionResolution, setMotionResolution] = useState<'720p' | '1080p'>('720p');
  const [motionPrompt, setMotionPrompt] = useState<string>('');

  const [isMotionGenerating, setIsMotionGenerating] = useState(false);
  const [motionProgress, setMotionProgress] = useState(0);
  const [currentMotionVideo, setCurrentMotionVideo] = useState<MotionHistoryItem | null>(null);
  const [isMotionPlaying, setIsMotionPlaying] = useState(false);
  const [motionHistoryList, setMotionHistoryList] = useState<MotionHistoryItem[]>([]);

  const subjectInputRef = useRef<HTMLInputElement | null>(null);
  const refVideoInputRef = useRef<HTMLInputElement | null>(null);

  // Motion Cost Calculation
  const costPerSec = motionResolution === '720p' ? 150 : 250;
  const calculatedMotionCost = refVideoFile ? refVideoDuration * costPerSec : 150 * 5;

  const handleUploadSubject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      onShowToast('Ukuran gambar melebihi 10MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      setSubjectImage(evt.target?.result as string);
      onShowToast('Gambar subjek berhasil diunggah.');
    };
    reader.readAsDataURL(file);
  };

  const handleUploadRefVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 100 * 1024 * 1024) {
      onShowToast('Ukuran video melebihi 100MB.');
      return;
    }
    setRefVideoName(file.name);
    // Approximate duration or set 5-10s
    setRefVideoDuration(6);
    const reader = new FileReader();
    reader.onload = (evt) => {
      setRefVideoFile(evt.target?.result as string);
      onShowToast(`Video referensi "${file.name}" berhasil diunggah.`);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateMotion = () => {
    if (!subjectImage) {
      onShowToast('Silakan pilih Gambar Subjek terlebih dahulu.');
      return;
    }
    if (!refVideoFile) {
      onShowToast('Silakan pilih Video Referensi Gerakan terlebih dahulu.');
      return;
    }

    if (!onDeductCredits(calculatedMotionCost)) return;

    setIsMotionGenerating(true);
    setMotionProgress(20);

    const interval = setInterval(() => {
      setMotionProgress((prev) => {
        if (prev >= 85) {
          clearInterval(interval);
          return 85;
        }
        return prev + 15;
      });
    }, 450);

    setTimeout(() => {
      clearInterval(interval);
      setMotionProgress(100);

      const now = new Date();
      const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

      const newMotionItem: MotionHistoryItem = {
        id: `motion-${Date.now()}`,
        subjectImage,
        referenceVideoName: refVideoName || 'Video Referensi (6s)',
        orientation,
        resolution: motionResolution,
        prompt: motionPrompt.trim() || 'Gerakan otomatis sinkronisasi subjek & referensi',
        durationSec: refVideoDuration,
        time: timeStr,
        cost: calculatedMotionCost
      };

      setCurrentMotionVideo(newMotionItem);
      setMotionHistoryList((prev) => [newMotionItem, ...prev]);
      setIsMotionGenerating(false);
      setIsMotionPlaying(true);
      onShowToast(`Video Motion Control V3 berhasil digenerate (-${calculatedMotionCost} kredit)!`);
      onAddHistory('Motion Control V3', refVideoName || 'Gerakan Karakter');
    }, 2600);
  };

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    onShowToast('Teks berhasil disalin ke clipboard!');
  };

  // ==========================================
  // Vision Prompt State (Screenshot Vision Prompt)
  // ==========================================
  const [visionVideoFile, setVisionVideoFile] = useState<string | null>(null);
  const [visionVideoName, setVisionVideoName] = useState('');
  const [visionVideoSize, setVisionVideoSize] = useState('');
  const [visionVideoDuration, setVisionVideoDuration] = useState(8);
  const [visionNotes, setVisionNotes] = useState('');
  const [isVisionAnalyzing, setIsVisionAnalyzing] = useState(false);
  const [visionProgress, setVisionProgress] = useState(0);
  const [visionResult, setVisionResult] = useState<{
    veoPrompt: string;
    fluxPrompt: string;
    runwayPrompt: string;
    breakdown: {
      camera: string;
      lighting: string;
      colors: string;
      motion: string;
      subject: string;
    };
    frames: { time: string; label: string; desc: string }[];
  } | null>(null);
  const [activeVisionTab, setActiveVisionTab] = useState<'veo' | 'flux' | 'runway' | 'breakdown'>('veo');
  const visionFileInputRef = useRef<HTMLInputElement | null>(null);
  const visionVideoRef = useRef<HTMLVideoElement | null>(null);

  const handleVisionVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      onShowToast('Ukuran video melebihi batas 50MB.');
      return;
    }
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    setVisionVideoName(file.name);
    setVisionVideoSize(sizeInMB);
    const url = URL.createObjectURL(file);
    setVisionVideoFile(url);
    setVisionResult(null);
    onShowToast(`Video "${file.name}" berhasil dipilih untuk analisis Vision Prompt.`);
  };

  const handleVisionDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      onShowToast('Ukuran video melebihi batas 50MB.');
      return;
    }
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
    setVisionVideoName(file.name);
    setVisionVideoSize(sizeInMB);
    const url = URL.createObjectURL(file);
    setVisionVideoFile(url);
    setVisionResult(null);
    onShowToast(`Video "${file.name}" berhasil di-drop untuk analisis Vision Prompt.`);
  };

  const handleClearVisionVideo = () => {
    setVisionVideoFile(null);
    setVisionVideoName('');
    setVisionVideoSize('');
    setVisionResult(null);
    if (visionFileInputRef.current) {
      visionFileInputRef.current.value = '';
    }
  };

  const handleUseDemoVisionVideo = () => {
    setVisionVideoName('commercial_skincare_cinematic.mp4');
    setVisionVideoSize('14.2 MB');
    setVisionVideoDuration(8);
    setVisionVideoFile('https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
    setVisionNotes('fokus ke produk skincare serum premium, subject perempuan 25 tahun, aesthetic clean commercial');
    setVisionResult(null);
    onShowToast('Video demo komersial berhasil dimuat.');
  };

  const handleAnalyzeVisionVideo = () => {
    if (!visionVideoFile) {
      onShowToast('Silakan pilih atau drop video referensi terlebih dahulu.');
      return;
    }
    if (!onDeductCredits(1)) return;

    setIsVisionAnalyzing(true);
    setVisionProgress(15);

    const interval = setInterval(() => {
      setVisionProgress((prev) => {
        if (prev >= 85) {
          clearInterval(interval);
          return 85;
        }
        return prev + 20;
      });
    }, 280);

    setTimeout(() => {
      clearInterval(interval);
      setVisionProgress(100);

      const focusNote = visionNotes.trim()
        ? `with primary focus on ${visionNotes.trim()}`
        : 'cinematic high-end commercial style with elegant organic lighting';

      const result = {
        veoPrompt: `Ultra-high definition 4K cinematic commercial shot, ${focusNote}. Smooth dynamic tracking camera motion orbiting around subject, shallow depth of field f/1.8, 35mm anamorphic prime lens, soft diffused volumetric studio rim lighting, 5600K daylight balance, subtle film grain, 60fps slow-motion elegance, hyper-detailed temporal consistency, high dynamic range, photorealistic texture.`,
        fluxPrompt: `Masterpiece photograph, raw authentic photography, ${focusNote}. Captured on Sony A7R V with 50mm f/1.2 GM lens, hyper-detailed skin pores, authentic optical reflections, soft directional key light with gentle ambient fill, professional color grading, cinematic composition, photorealistic 8K UHD.`,
        runwayPrompt: `Motion control camera sweep, ${focusNote}. Continuous smooth dolly forward with subtle low-angle tilt-up, fluid subject motion, natural fabric aerodynamics, temporal coherence, motion blur at 180 shutter angle, cinematic teal and warm amber color harmony.`,
        breakdown: {
          camera: 'Dolly In + Smooth Orbital Pan (35mm Anamorphic Lens, f/1.8 aperture, 60fps)',
          lighting: 'Soft volumetric rim light + diffused 5600K daylight key light + negative fill',
          colors: 'Cinematic commercial grade, teal undertones with warm radiant skin tones',
          motion: 'Natural fluid cadence, high temporal stability, zero jitter',
          subject: visionNotes.trim() || 'Central subject with clean silhouette and elegant posture'
        },
        frames: [
          { time: '00:00.0s', label: 'Frame 01', desc: 'Establishing wide shot, soft rim illumination' },
          { time: '00:02.4s', label: 'Frame 02', desc: 'Dynamic camera dolly in with gentle orbit' },
          { time: '00:04.8s', label: 'Frame 03', desc: 'Hero close-up focus on texture and detail' },
          { time: '00:07.2s', label: 'Frame 04', desc: 'Culminating pose, cinematic lens flare fade' }
        ]
      };

      setVisionResult(result);
      setIsVisionAnalyzing(false);
      onShowToast('Analisis Vision Prompt selesai (-1 kredit)!');
      onAddHistory('Vision Prompt', visionNotes.slice(0, 30) || visionVideoName || 'Analisis Video');
    }, 2000);
  };

  const handleUseInBuatVideo = (promptText: string) => {
    setPrompt(promptText);
    setActiveSubTab('video-buat');
    onShowToast('Prompt dipasang ke Buat Video AI!');
  };

  return (
    <div className="space-y-4">
      {/* Top Sub-tabs Switcher */}
      <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {[
          { id: 'video-buat', label: 'Buat Video AI' },
          { id: 'video-motion-v3', label: 'Motion Control V3' },
          { id: 'video-vision', label: 'Vision Prompt' },
          { id: 'video-gabung', label: 'Gabung Video' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSubTab(tab.id as ActiveView)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeSubTab === tab.id || (tab.id === 'video-gabung' && activeSubTab === 'video-motion-v4')
                ? 'bg-blue-600 text-white shadow-md shadow-blue-950/40'
                : 'bg-[#091122]/80 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: BUAT VIDEO AI & AI VIDEO PROVIDER ENGINE                         */}
      {/* ========================================================================= */}
      {activeSubTab === 'video-buat' && (
        <VideoGeneratorPanel
          initialImage={initialImage}
          initialPrompt={initialPrompt}
          onClearInitialImage={onClearInitialImage}
          onSuccessToast={onShowToast}
          onErrorToast={onShowToast}
        />
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: MOTION CONTROL V3 (Exact Match with Screenshot 5)                */}
      {/* ========================================================================= */}
      {activeSubTab === 'video-motion-v3' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT CONTROL PANEL */}
          <div className="lg:col-span-4 p-4 sm:p-5 rounded-2xl bg-[#091122]/90 border border-slate-800/80 shadow-xl space-y-4">
            {/* Header */}
            <div>
              <div className="flex items-center space-x-2 text-white">
                <Wand2 className="w-4 h-4 text-blue-400 stroke-[1.5]" />
                <h3 className="text-xs sm:text-sm font-bold tracking-tight font-heading">
                  Motion Control V3
                </h3>
              </div>
            </div>

            {/* 1. Gambar Subjek */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-200">
                Gambar Subjek
              </label>
              <input
                type="file"
                ref={subjectInputRef}
                onChange={handleUploadSubject}
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
              />

              {subjectImage ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-black/40 group">
                  <img
                    src={subjectImage}
                    alt="Subjek"
                    className="w-full h-32 object-contain p-2"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => subjectInputRef.current?.click()}
                      className="px-2.5 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors cursor-pointer"
                    >
                      Ganti
                    </button>
                    <button
                      type="button"
                      onClick={() => setSubjectImage(null)}
                      className="px-2.5 py-1 text-xs bg-rose-600 text-white rounded-lg hover:bg-rose-500 transition-colors cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => subjectInputRef.current?.click()}
                  className="border border-dashed border-slate-700/80 hover:border-slate-500 bg-[#060b16] rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
                >
                  <ImageIcon className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors mb-2 stroke-[1.5]" />
                  <p className="text-xs font-semibold text-slate-200">
                    Pilih gambar
                  </p>
                </div>
              )}

              <p className="text-[10px] text-slate-500">
                JPG / PNG · min 300px · rasio 2:5 - 5:2 · maks 10MB
              </p>
            </div>

            {/* 2. Video Referensi Gerakan */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-200">
                Video Referensi Gerakan
              </label>
              <input
                type="file"
                ref={refVideoInputRef}
                onChange={handleUploadRefVideo}
                accept="video/mp4,video/quicktime,video/webm"
                className="hidden"
              />

              {refVideoFile ? (
                <div className="p-3 rounded-xl border border-slate-700 bg-[#060b16] flex items-center justify-between gap-2">
                  <div className="flex items-center space-x-2.5 overflow-hidden">
                    <div className="w-8 h-8 rounded-lg bg-blue-950/70 border border-blue-800/50 flex items-center justify-center text-blue-400 shrink-0">
                      <Film className="w-4 h-4" />
                    </div>
                    <div className="truncate text-left">
                      <p className="text-xs font-semibold text-slate-200 truncate">
                        {refVideoName || 'Video Referensi'}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {refVideoDuration} detik gerakan terdeteksi
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => refVideoInputRef.current?.click()}
                      className="px-2 py-1 text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg cursor-pointer"
                    >
                      Ganti
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setRefVideoFile(null);
                        setRefVideoName('');
                      }}
                      className="p-1 text-rose-400 hover:text-rose-300 cursor-pointer"
                      title="Hapus Video"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => refVideoInputRef.current?.click()}
                  className="border border-dashed border-slate-700/80 hover:border-slate-500 bg-[#060b16] rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
                >
                  <Upload className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors mb-2 stroke-[1.5]" />
                  <p className="text-xs font-semibold text-slate-200">
                    Pilih video
                  </p>
                </div>
              )}

              <p className="text-[10px] text-slate-500">
                MP4 / MOV · 3 - 30s · maks 100MB
              </p>
            </div>

            {/* 3. Orientasi Karakter */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-200">
                Orientasi Karakter
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setOrientation('video')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    orientation === 'video'
                      ? 'bg-blue-600 border-blue-500 text-white shadow-sm'
                      : 'bg-[#060b16] border-slate-800/80 text-slate-400 hover:text-white'
                  }`}
                >
                  Ikuti video
                </button>
                <button
                  type="button"
                  onClick={() => setOrientation('photo')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    orientation === 'photo'
                      ? 'bg-blue-600 border-blue-500 text-white shadow-sm'
                      : 'bg-[#060b16] border-slate-800/80 text-slate-400 hover:text-white'
                  }`}
                >
                  Ikuti foto
                </button>
              </div>
              <p className="text-[10px] text-slate-500">
                Arah hadap mengikuti orang di video referensi · maks 30 detik
              </p>
            </div>

            {/* 4. Resolusi */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-200">
                Resolusi
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMotionResolution('720p')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    motionResolution === '720p'
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-[#060b16] border-slate-800/80 text-slate-400 hover:text-white'
                  }`}
                >
                  720p
                </button>
                <button
                  type="button"
                  onClick={() => setMotionResolution('1080p')}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    motionResolution === '1080p'
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-[#060b16] border-slate-800/80 text-slate-400 hover:text-white'
                  }`}
                >
                  1080p
                </button>
              </div>
            </div>

            {/* 5. Prompt (opsional) */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-200">
                Prompt <span className="text-slate-500 font-normal">(opsional)</span>
              </label>
              <div className="relative pt-0.5">
                <textarea
                  rows={3}
                  value={motionPrompt}
                  onChange={(e) => setMotionPrompt(e.target.value.slice(0, 2500))}
                  placeholder="Opsional — gerakan otomatis mengikuti video referensi. Tambahkan detail bila perlu..."
                  className="w-full p-3 rounded-xl bg-[#060b16] border border-slate-800/90 text-slate-200 text-xs focus:outline-none focus:border-blue-500 placeholder-slate-600 resize-none leading-relaxed transition-colors"
                />
                <div className="text-right text-[10px] text-slate-500 mt-0.5 font-mono">
                  {motionPrompt.length}/2500
                </div>
              </div>
            </div>

            {/* 6. Pricing Info breakdown */}
            <div className="space-y-0.5 text-[11px] text-slate-400 leading-relaxed pt-1">
              <p>Durasi hasil mengikuti panjang video referensi.</p>
              <p>Biaya dihitung <strong className="text-slate-300">per detik</strong> dibulatkan ke atas.</p>
              <p className="text-slate-500">
                <span className="font-semibold text-slate-300">{motionResolution} = {costPerSec} kredit/detik</span>{' '}
                {refVideoFile ? (
                  <span className="text-blue-400 font-bold">
                    • {refVideoDuration} detik = {calculatedMotionCost} kredit
                  </span>
                ) : (
                  'pilih video untuk melihat total'
                )}
              </p>
            </div>

            {/* 7. Generate Button */}
            <button
              type="button"
              disabled={isMotionGenerating}
              onClick={handleGenerateMotion}
              className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-blue-900/30 transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              {isMotionGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  <span>Mentransfer Gerakan Motion...</span>
                </>
              ) : (
                <span>Generate</span>
              )}
            </button>
          </div>

          {/* RIGHT DISPLAY PANEL */}
          <div className="lg:col-span-8 space-y-4">
            {/* 1. Preview Video Screen (Matches Screenshot 5) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#091122]/90 border border-slate-800/80 shadow-xl space-y-3.5">
              {/* Header */}
              <div className="flex items-center space-x-2 text-white">
                <Video className="w-4 h-4 text-blue-400 stroke-[1.5]" />
                <h3 className="text-xs sm:text-sm font-bold tracking-tight font-heading">
                  Preview Video
                </h3>
              </div>

              {/* 16:9 Black Video Frame */}
              <div className="w-full aspect-video rounded-2xl bg-black border border-slate-800 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
                {isMotionGenerating ? (
                  <div className="space-y-4 max-w-sm text-center">
                    <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 mx-auto flex items-center justify-center">
                      <RefreshCw className="w-7 h-7 text-blue-400 animate-spin" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-200">
                        Memetakan kerangka tubuh &amp; gerakan video...
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Motion transfer ke gambar subjek ({motionResolution})
                      </p>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-blue-500 h-full transition-all duration-300 rounded-full"
                        style={{ width: `${motionProgress}%` }}
                      />
                    </div>
                  </div>
                ) : currentMotionVideo ? (
                  /* Completed Motion Video Player */
                  <div className="absolute inset-0 bg-gradient-to-tr from-[#080d1a] to-[#040810] flex flex-col justify-between p-4">
                    {/* Animated visual representation */}
                    <div className="flex-1 flex items-center justify-center relative">
                      <div className="flex items-center gap-6">
                        {currentMotionVideo.subjectImage && (
                          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border border-slate-700 bg-black/50 shrink-0">
                            <img
                              src={currentMotionVideo.subjectImage}
                              alt="Subjek"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="text-center space-y-1 max-w-xs">
                          <span className="px-2.5 py-1 rounded-lg bg-blue-950/70 border border-blue-800/50 text-[11px] font-bold text-blue-300">
                            Motion Transfer Selesai
                          </span>
                          <h4 className="text-xs font-semibold text-slate-200 pt-1">
                            {currentMotionVideo.prompt}
                          </h4>
                          <p className="text-[10px] text-slate-400 font-mono">
                            {currentMotionVideo.resolution} • {currentMotionVideo.durationSec}s • {currentMotionVideo.orientation === 'video' ? 'Ikuti Video' : 'Ikuti Foto'}
                          </p>
                        </div>
                      </div>

                      {/* Play overlay button */}
                      <button
                        type="button"
                        onClick={() => setIsMotionPlaying(!isMotionPlaying)}
                        className="absolute w-12 h-12 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
                      >
                        {isMotionPlaying ? (
                          <Pause className="w-5 h-5 fill-white" />
                        ) : (
                          <Play className="w-5 h-5 fill-white ml-0.5" />
                        )}
                      </button>
                    </div>

                    {/* Bottom controls */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            onShowToast('Video Motion Control MP4 berhasil diunduh!');
                          }}
                          className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Unduh Video</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => copyText(currentMotionVideo.prompt)}
                          className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Salin Info</span>
                        </button>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {currentMotionVideo.time} • -{currentMotionVideo.cost} kredit
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Center Empty State (Exact Match with Screenshot 5) */
                  <div className="flex flex-col items-center justify-center space-y-2 text-slate-600">
                    <Video className="w-8 h-8 stroke-[1.2]" />
                    <p className="text-xs text-slate-500">
                      Hasil video akan tampil di sini
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 2. Riwayat (Motion Control V3 saja) (Matches Screenshot 5) */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#091122]/90 border border-slate-800/80 shadow-xl space-y-3">
              {/* Header */}
              <div className="flex items-center space-x-2 text-white">
                <Clock className="w-4 h-4 text-blue-400 stroke-[1.5]" />
                <h3 className="text-xs sm:text-sm font-bold tracking-tight font-heading">
                  Riwayat (Motion Control V3 saja)
                </h3>
              </div>

              {/* Empty state or History List */}
              {motionHistoryList.length === 0 ? (
                <div className="min-h-[110px] rounded-2xl bg-[#060b16] border border-slate-800/80 flex items-center justify-center p-6 text-center">
                  <p className="text-xs text-slate-500">
                    Belum ada hasil. Video Motion Control V3 yang selesai akan muncul di sini.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                  {motionHistoryList.map((item) => (
                    <div
                      key={item.id}
                      className="p-2.5 rounded-xl bg-[#060b16] border border-slate-800/90 flex items-center justify-between gap-3 hover:border-slate-700 transition-all"
                    >
                      <div className="flex items-center space-x-3 overflow-hidden">
                        <div className="w-12 h-12 rounded-lg bg-black border border-slate-800 overflow-hidden shrink-0">
                          <img
                            src={item.subjectImage}
                            alt="Subject"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-semibold text-slate-200 truncate">
                            {item.referenceVideoName}
                          </p>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                            <span className="text-blue-400 font-medium">{item.resolution}</span>
                            <span>•</span>
                            <span>{item.durationSec}s</span>
                            <span>•</span>
                            <span>{item.time}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setCurrentMotionVideo(item);
                            setIsMotionPlaying(true);
                            onShowToast('Motion video dimuat ke preview.');
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                          title="Tampilkan di Preview"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: VISION PROMPT (Matching Screenshot)                               */}
      {/* ========================================================================= */}
      {activeSubTab === 'video-vision' && (
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Header (Exact Match with Screenshot) */}
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#061022] border border-sky-900/60 flex items-center justify-center text-sky-400 shrink-0 shadow-lg shadow-sky-950/30">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <span className="text-[10px] font-bold tracking-widest text-sky-400 uppercase font-mono">
                  VISION PROMPT
                </span>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#081b37] border border-sky-800/60 text-sky-300 text-[9px] font-bold">
                  <Sparkles className="w-2.5 h-2.5 text-sky-400" />
                  <span>VIDEO → AI PROMPT</span>
                </div>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-heading mt-0.5">
                Vision Prompt
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-3xl mt-1.5">
                Upload video, sistem baca isinya frame per frame, lalu keluarkan paket prompt yang bisa dipakai buat recreate video-nya di Veo / Kling / Runway, atau still frame di Flux / Midjourney / SDXL
              </p>
            </div>
          </div>

          {/* STEP 01: Upload Video Referensi Card (Exact Match with Screenshot) */}
          <div className="rounded-2xl bg-[#081021]/95 border border-slate-800/90 p-5 sm:p-7 space-y-5 shadow-2xl backdrop-blur-sm">
            {/* Step Header */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#091b36] border border-sky-800/60 flex items-center justify-center text-sky-400 shrink-0">
                <Upload className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[9px] font-bold text-sky-400 tracking-widest uppercase font-mono block leading-none">
                  STEP 01
                </span>
                <h3 className="text-sm font-bold text-white mt-0.5">
                  Upload Video Referensi
                </h3>
              </div>
            </div>

            {/* Hidden file input */}
            <input
              type="file"
              ref={visionFileInputRef}
              onChange={handleVisionVideoUpload}
              accept="video/mp4,video/mov,video/webm,.mp4,.mov,.webm"
              className="hidden"
            />

            {/* Dropzone Area */}
            {!visionVideoFile ? (
              <div
                onClick={() => visionFileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleVisionDrop}
                className="border-2 border-dashed border-slate-700/80 hover:border-sky-500/60 rounded-2xl bg-[#050b16]/60 p-10 sm:p-14 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#0a1b38] border border-sky-800/60 flex items-center justify-center text-sky-400 mb-3 group-hover:scale-105 transition-transform shadow-md">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">
                  Klik atau drop video di sini
                </p>
                <p className="text-[11px] text-slate-500 mt-1 max-w-md leading-relaxed">
                  .mp4 / .mov / .webm — maks 50 MB. Frame di extract di browser, video tidak diupload ke server.
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUseDemoVisionVideo();
                  }}
                  className="mt-4 px-3 py-1 rounded-lg bg-sky-950/50 border border-sky-800/50 text-sky-400 hover:text-sky-300 text-[11px] font-medium transition-all"
                >
                  Gunakan contoh video demo
                </button>
              </div>
            ) : (
              /* Video Selected Preview Box */
              <div className="rounded-2xl border border-sky-900/50 bg-[#050b16] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 rounded-xl bg-black border border-slate-800 flex items-center justify-center text-sky-400 shrink-0">
                      <Film className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-bold text-white truncate">{visionVideoName}</p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5 font-mono">
                        <span>{visionVideoSize}</span>
                        <span>•</span>
                        <span>{visionVideoDuration} detik</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-semibold">Frame siap diekstrak</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => visionFileInputRef.current?.click()}
                      className="px-2.5 py-1 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                    >
                      Ganti
                    </button>
                    <button
                      type="button"
                      onClick={handleClearVisionVideo}
                      className="px-2.5 py-1 text-xs rounded-lg bg-rose-950/60 border border-rose-800/60 hover:bg-rose-900/80 text-rose-300 transition-colors cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>
                </div>

                {/* Video Player */}
                <div className="relative rounded-xl overflow-hidden bg-black max-h-56 flex items-center justify-center border border-slate-800">
                  <video
                    ref={visionVideoRef}
                    src={visionVideoFile}
                    controls
                    className="max-h-56 w-full object-contain"
                  />
                </div>
              </div>
            )}

            {/* CATATAN TAMBAHAN (OPSIONAL) (Exact Match with Screenshot) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-slate-400 tracking-wider uppercase font-mono">
                  CATATAN TAMBAHAN (OPSIONAL)
                </label>
                <span className="text-[10px] text-slate-500 font-mono">
                  {visionNotes.length}/500
                </span>
              </div>
              <textarea
                rows={3}
                maxLength={500}
                value={visionNotes}
                onChange={(e) => setVisionNotes(e.target.value)}
                placeholder="Contoh: fokus ke produk skincare-nya, gaya iklan premium, subject-nya perempuan 25 tahun..."
                className="w-full p-3.5 rounded-xl bg-[#060b16] border border-slate-800 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-sky-500 transition-colors leading-relaxed"
              />
            </div>

            {/* Analisis Video • 1 kredit Button (Exact Match with Screenshot) */}
            <button
              type="button"
              disabled={isVisionAnalyzing}
              onClick={handleAnalyzeVisionVideo}
              className="w-full py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold flex flex-col items-center justify-center space-y-0.5 cursor-pointer shadow-lg shadow-blue-900/40 transition-all disabled:opacity-50"
            >
              {isVisionAnalyzing ? (
                <div className="flex items-center gap-2 text-sm">
                  <RefreshCw className="w-4 h-4 animate-spin text-sky-200" />
                  <span>Mengekstrak frame ({visionProgress}%)...</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-1.5 text-sm font-bold">
                    <Sparkles className="w-4 h-4 text-sky-300" />
                    <span>Analisis Video</span>
                  </div>
                  <span className="text-[11px] text-blue-200/80 font-normal">1 kredit</span>
                </>
              )}
            </button>
          </div>

          {/* Vision Prompt Results Panel */}
          {visionResult && (
            <div className="rounded-2xl bg-[#081021]/95 border border-slate-800/90 p-5 sm:p-7 space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-sm font-bold text-white">
                    Paket Prompt Hasil Ekstraksi Vision AI
                  </h3>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  Selesai • 1 kredit terpakai
                </span>
              </div>

              {/* Extracted Keyframes Strip */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 font-mono">
                  Keyframes yang Dianalisis
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {visionResult.frames.map((frame, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-[#050b16] border border-slate-800 space-y-1"
                    >
                      <div className="flex items-center justify-between text-[10px] text-sky-400 font-mono">
                        <span>{frame.label}</span>
                        <span>{frame.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 line-clamp-2">
                        {frame.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Engine Tabs */}
              <div className="flex gap-2 border-b border-slate-800 pb-2">
                {[
                  { id: 'veo', label: 'Veo 3.1 & Kling V3' },
                  { id: 'flux', label: 'Flux.1 / Midjourney (Still)' },
                  { id: 'runway', label: 'Runway Gen-3' },
                  { id: 'breakdown', label: 'Detail Parameter' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveVisionTab(tab.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      activeVisionTab === tab.id
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeVisionTab === 'veo' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-[#050b16] border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-sky-400">Prompt Video Siap Pakai:</span>
                      <button
                        type="button"
                        onClick={() => copyText(visionResult.veoPrompt)}
                        className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 cursor-pointer font-medium"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Prompt</span>
                      </button>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-wrap">
                      {visionResult.veoPrompt}
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleUseInBuatVideo(visionResult.veoPrompt)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      <span>Gunakan di Buat Video AI</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => copyText(visionResult.veoPrompt)}
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Salin</span>
                    </button>
                  </div>
                </div>
              )}

              {activeVisionTab === 'flux' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-[#050b16] border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-pink-400">Prompt Still Image / Keyframe:</span>
                      <button
                        type="button"
                        onClick={() => copyText(visionResult.fluxPrompt)}
                        className="text-xs text-pink-400 hover:text-pink-300 flex items-center gap-1 cursor-pointer font-medium"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Prompt</span>
                      </button>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-wrap">
                      {visionResult.fluxPrompt}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyText(visionResult.fluxPrompt)}
                    className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Prompt Still Frame Flux</span>
                  </button>
                </div>
              )}

              {activeVisionTab === 'runway' && (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-[#050b16] border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-indigo-400">Prompt Runway Gen-3:</span>
                      <button
                        type="button"
                        onClick={() => copyText(visionResult.runwayPrompt)}
                        className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer font-medium"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Salin Prompt</span>
                      </button>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-wrap">
                      {visionResult.runwayPrompt}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyText(visionResult.runwayPrompt)}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-2 cursor-pointer shadow-md"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Salin Prompt Runway Gen-3</span>
                  </button>
                </div>
              )}

              {activeVisionTab === 'breakdown' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-xl bg-[#050b16] border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-sky-400 uppercase font-mono">Gerakan Kamera</span>
                    <p className="text-slate-200">{visionResult.breakdown.camera}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#050b16] border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-amber-400 uppercase font-mono">Pencahayaan & Atmosfer</span>
                    <p className="text-slate-200">{visionResult.breakdown.lighting}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#050b16] border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase font-mono">Palet Warna</span>
                    <p className="text-slate-200">{visionResult.breakdown.colors}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#050b16] border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-purple-400 uppercase font-mono">Dinamika Subjek</span>
                    <p className="text-slate-200">{visionResult.breakdown.motion}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 4: GABUNG VIDEO (Multi-Clip Stitcher & Transition)                    */}
      {/* ========================================================================= */}
      {(activeSubTab === 'video-gabung' || activeSubTab === 'video-motion-v4') && (
        <GabungVideo
          onShowToast={onShowToast}
          onDeductCredits={onDeductCredits}
          onAddHistory={onAddHistory}
          initialClips={historyList.map((h) => ({
            id: h.id,
            name: `${h.prompt.slice(0, 26)}...mp4`,
            prompt: h.prompt,
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            thumbnail: h.imageThumbnail,
            duration: parseInt(h.duration) || 5,
            createdAt: h.time
          }))}
        />
      )}
    </div>
  );
};
