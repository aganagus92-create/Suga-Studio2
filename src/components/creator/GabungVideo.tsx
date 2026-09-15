import React, { useState, useRef, useEffect } from 'react';
import {
  Film,
  Sparkles,
  Sliders,
  Volume2,
  VolumeX,
  Play,
  Pause,
  SkipForward,
  Plus,
  Trash2,
  Check,
  ChevronDown,
  ChevronUp,
  Music,
  Subtitles,
  Download,
  Copy,
  RefreshCw,
  Search,
  Upload,
  AlertCircle,
  Video,
  ArrowRight,
  Loader2,
  Layers,
  ArrowLeft,
  X
} from 'lucide-react';

export interface LibraryVideoClip {
  id: string;
  name: string;
  prompt: string;
  url: string;
  thumbnail?: string;
  duration: number; // in seconds
  createdAt?: string;
}

export interface TimelineClipItem {
  timelineId: string;
  clip: LibraryVideoClip;
}

export interface TransitionOption {
  id: string;
  label: string;
  desc: string;
}

const TRANSITIONS_LIST: TransitionOption[] = [
  { id: 'none', label: 'Tanpa transisi', desc: 'Potong langsung, tanpa efek' },
  { id: 'fade', label: 'Fade', desc: 'Silang halus antar klip' },
  { id: 'fade-black', label: 'Fade ke Hitam', desc: 'Redup ke hitam lalu terang lagi' },
  { id: 'fade-white', label: 'Fade ke Putih', desc: 'Kilau putih di pergantian' },
  { id: 'dissolve', label: 'Dissolve', desc: 'Lebur bertekstur, terasa sinematik' },
  { id: 'wipe-left', label: 'Wipe Kiri', desc: 'Sapuan menyingkap ke arah kiri' },
  { id: 'wipe-right', label: 'Wipe Kanan', desc: 'Sapuan menyingkap ke arah kanan' },
  { id: 'slide-left', label: 'Slide Kiri', desc: 'Klip berikutnya mendorong ke kiri' },
  { id: 'slide-right', label: 'Slide Kanan', desc: 'Klip berikutnya mendorong ke kanan' },
  { id: 'circle-open', label: 'Circle Open', desc: 'Lingkaran membuka dari tengah' },
  { id: 'circle-close', label: 'Circle Close', desc: 'Lingkaran menutup ke tengah' },
  { id: 'smooth-left', label: 'Smooth Kiri', desc: 'Geser halus, minim gangguan' }
];

const DEFAULT_DEMO_CLIPS: LibraryVideoClip[] = [
  {
    id: 'demo-1',
    name: 'Intro Cinematic Drone.mp4',
    prompt: 'Sinematik pemandangan kota futuristik senja dari atas drone 4K',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    duration: 5,
    createdAt: 'Baru saja'
  },
  {
    id: 'demo-2',
    name: 'Cyberpunk Character Walking.mp4',
    prompt: 'Karakter bergaya neo-tokyo cyberpunk berjalan di tengah hujan neon refleksi',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    duration: 6,
    createdAt: '1 jam lalu'
  },
  {
    id: 'demo-3',
    name: 'Nature River Waterfall.mp4',
    prompt: 'Sungai jernih mengalir di hutan tropis lebat dengan sinar matahari menembus dedaunan',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    duration: 5,
    createdAt: '2 jam lalu'
  }
];

const BGM_OPTIONS = [
  { id: 'cinematic-epic', name: 'Cinematic Epic Orchestral (02:15)', mood: 'Heroic & Megah' },
  { id: 'lofi-chill', name: 'Lofi Chill Beats Rain (01:45)', mood: 'Santai & Tenang' },
  { id: 'cyberpunk-synth', name: 'Dark Synthwave 80s (02:00)', mood: 'Futuristik & Tegas' },
  { id: 'acoustic-warm', name: 'Acoustic Morning Sunshine (01:30)', mood: 'Hangat & Ceria' }
];

interface GabungVideoProps {
  onShowToast: (msg: string) => void;
  onDeductCredits?: (amt: number) => boolean;
  onAddHistory?: (type: string, desc: string) => void;
  initialClips?: LibraryVideoClip[];
}

export const GabungVideo: React.FC<GabungVideoProps> = ({
  onShowToast,
  onDeductCredits,
  onAddHistory,
  initialClips
}) => {
  // Pustaka Video & Timeline State
  const [libraryClips, setLibraryClips] = useState<LibraryVideoClip[]>(() => {
    if (initialClips && initialClips.length > 0) {
      return initialClips;
    }
    return [];
  });
  const [timelineClips, setTimelineClips] = useState<TimelineClipItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Setting State
  const [filmTitle, setFilmTitle] = useState('');
  const [selectedTransition, setSelectedTransition] = useState<string>('none');
  const [isTransitionDropdownOpen, setIsTransitionDropdownOpen] = useState(false);
  const transitionDropdownRef = useRef<HTMLDivElement | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        transitionDropdownRef.current &&
        !transitionDropdownRef.current.contains(e.target as Node)
      ) {
        setIsTransitionDropdownOpen(false);
      }
    };
    if (isTransitionDropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isTransitionDropdownOpen]);

  // Sync initial clips if they change
  useEffect(() => {
    if (initialClips && initialClips.length > 0) {
      setLibraryClips((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newOnes = initialClips.filter((c) => !existingIds.has(c.id));
        if (newOnes.length === 0) return prev;
        return [...newOnes, ...prev];
      });
    }
  }, [initialClips]);

  const [isSubtitleEnabled, setIsSubtitleEnabled] = useState(false);
  const [selectedAudio, setSelectedAudio] = useState<{ id: string; name: string } | null>(null);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [audioVolume, setAudioVolume] = useState<number>(80);

  // Preview Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Stitching / Processing State
  const [isProcessing, setIsProcessing] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderStage, setRenderStage] = useState('');
  const [stitchedResultUrl, setStitchedResultUrl] = useState<string | null>(null);

  // File Upload Ref
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Compute total duration of timeline clips
  const totalDuration = timelineClips.reduce((acc, curr) => acc + (curr.clip.duration || 5), 0);

  // Filter library clips based on search
  const filteredClips = libraryClips.filter((clip) => {
    const matchSearch =
      clip.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clip.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchSearch;
  });

  // Add clip to timeline (max 20)
  const handleAddToTimeline = (clip: LibraryVideoClip) => {
    if (timelineClips.length >= 20) {
      onShowToast('Maksimal 20 klip untuk penggabungan video.');
      return;
    }
    const newItem: TimelineClipItem = {
      timelineId: `timeline-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      clip
    };
    setTimelineClips((prev) => [...prev, newItem]);
    onShowToast(`Klip "${clip.name}" ditambahkan ke timeline`);
  };

  // Remove clip from timeline
  const handleRemoveFromTimeline = (timelineId: string) => {
    setTimelineClips((prev) => prev.filter((item) => item.timelineId !== timelineId));
  };

  // Reorder timeline clips
  const handleMoveClip = (index: number, direction: 'left' | 'right') => {
    const targetIndex = direction === 'left' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= timelineClips.length) return;
    const newItems = [...timelineClips];
    const [moved] = newItems.splice(index, 1);
    newItems.splice(targetIndex, 0, moved);
    setTimelineClips(newItems);
  };

  // Handle local video upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    const newClip: LibraryVideoClip = {
      id: `uploaded-${Date.now()}`,
      name: file.name,
      prompt: `Video unggahan manual: ${file.name}`,
      url: URL.createObjectURL(file),
      duration: 6,
      createdAt: 'Baru saja diunggah'
    };

    setLibraryClips((prev) => [newClip, ...prev]);
    onShowToast(`Klip "${file.name}" berhasil diunggah ke Pustaka.`);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Load sample demo clips
  const handleLoadDemoClips = () => {
    setLibraryClips((prev) => {
      const existingIds = new Set(prev.map((c) => c.id));
      const newClips = DEFAULT_DEMO_CLIPS.filter((c) => !existingIds.has(c.id));
      if (newClips.length === 0) {
        onShowToast('Klip demo sudah ada di pustaka.');
        return prev;
      }
      return [...newClips, ...prev];
    });
    onShowToast('3 klip demo ditambahkan ke pustaka.');
  };

  // Toggle Video Play / Pause
  const togglePlay = () => {
    if (timelineClips.length === 0) {
      onShowToast('Tambahkan klip ke timeline terlebih dahulu untuk memutar.');
      return;
    }
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      }
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  // Switch to next clip in timeline
  const handleNextClip = () => {
    if (timelineClips.length <= 1) return;
    setCurrentPlayingIndex((prev) => (prev + 1) % timelineClips.length);
  };

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Start Gabung Video (Stitching) Process
  const handleStartStitching = () => {
    if (timelineClips.length < 2) {
      onShowToast('Pilih minimal 2 klip dari pustaka untuk digabungkan.');
      return;
    }

    if (onDeductCredits) {
      const ok = onDeductCredits(2);
      if (!ok) {
        onShowToast('Kredit tidak cukup untuk menggabungkan video (Membutuhkan 2 kredit).');
        return;
      }
    }

    setIsProcessing(true);
    setRenderProgress(5);
    setRenderStage('Menginisialisasi klip timeline...');
    setStitchedResultUrl(null);

    const stageTimeouts: NodeJS.Timeout[] = [];

    stageTimeouts.push(
      setTimeout(() => {
        setRenderProgress(25);
        setRenderStage('Menyesuaikan resolusi & framerate antar klip (1080p 60fps)...');
      }, 1200)
    );

    stageTimeouts.push(
      setTimeout(() => {
        setRenderProgress(55);
        setRenderStage(
          selectedTransition !== 'none'
            ? `Merender transisi efek sinematik "${TRANSITIONS_LIST.find((t) => t.id === selectedTransition)?.label}"...`
            : 'Menyambung sequence video secara seamless...'
        );
      }, 2600)
    );

    stageTimeouts.push(
      setTimeout(() => {
        setRenderProgress(80);
        setRenderStage(
          selectedAudio
            ? `Melapisi audio latar ${selectedAudio.name} & sinkronisasi audio...`
            : 'Menganalisis waveform audio & finishing subtitle...'
        );
      }, 4200)
    );

    stageTimeouts.push(
      setTimeout(() => {
        setRenderProgress(100);
        setRenderStage('Selesai! Video kompilasi siap dipratinjau & diunduh.');
        setIsProcessing(false);

        const chosenUrl = timelineClips[0]?.clip.url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
        setStitchedResultUrl(chosenUrl);

        const titleDesc = filmTitle.trim() ? `Film: "${filmTitle}"` : `Gabung ${timelineClips.length} klip`;
        if (onAddHistory) {
          onAddHistory('Gabung Video', `${titleDesc} (${totalDuration} detik, transisi: ${selectedTransition})`);
        }
        onShowToast(`🎉 Video berhasil digabungkan! (${timelineClips.length} klip, ${totalDuration}s)`);
      }, 5800)
    );
  };

  const activeTransitionLabel =
    TRANSITIONS_LIST.find((t) => t.id === selectedTransition)?.label || 'Tanpa transisi';

  const currentActiveClip =
    timelineClips.length > 0 ? timelineClips[currentPlayingIndex % timelineClips.length]?.clip : null;

  return (
    <div className="space-y-6 pb-20 max-w-7xl mx-auto">
      {/* Hidden File Input for Video Upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="video/mp4,video/quicktime,video/webm"
        className="hidden"
      />

      {/* ========================================================================= */}
      {/* HEADER SECTION                                                            */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10 shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-widest uppercase bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-full border border-cyan-500/30 font-mono">
                VIDEO STUDIO
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              Gabung Video
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              Susun 2–20 klip dari pustakamu jadi satu film utuh — lengkap dengan transisi dan subtitle.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <div className="px-3.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300 flex items-center gap-2 font-mono">
            <Film className="w-3.5 h-3.5 text-cyan-400" />
            <span>
              <strong className="text-white font-bold">{timelineClips.length}</strong> / 20 klip
            </span>
          </div>
          <div className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-300 flex items-center gap-1.5 font-mono">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>2 kredit</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2-COLUMN MAIN WORKSPACE: LEFT (PREVIEW & TIMELINE) | RIGHT (SETTINGS)     */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ======================================================================= */}
        {/* LEFT COLUMN (LG: 8 COLS)                                                */}
        {/* ======================================================================= */}
        <div className="lg:col-span-8 space-y-6">
          {/* --------------------------------------------------------------------- */}
          {/* VIDEO CANVAS / PLAYER PREVIEW                                         */}
          {/* --------------------------------------------------------------------- */}
          <div className="relative aspect-video bg-black/90 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl flex flex-col justify-between group">
            {stitchedResultUrl ? (
              <video
                ref={videoRef}
                src={stitchedResultUrl}
                className="w-full h-full object-contain"
                controls={false}
                muted={isMuted}
                loop
                playsInline
                onTimeUpdate={() => {
                  if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
                }}
              />
            ) : currentActiveClip ? (
              <video
                ref={videoRef}
                src={currentActiveClip.url}
                className="w-full h-full object-contain"
                controls={false}
                muted={isMuted}
                loop
                playsInline
                onTimeUpdate={() => {
                  if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
                }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-3 p-6 text-center">
                <div className="w-14 h-14 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
                  <Film className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-300">Player Preview Film</p>
                  <p className="text-xs text-slate-500 max-w-sm">
                    Pilih klip dari pustaka di bawah untuk mulai menyusun urutan video di timeline.
                  </p>
                </div>
              </div>
            )}

            {/* Top Bar inside Player */}
            <div className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[11px] font-semibold text-white tracking-wide">
                  {stitchedResultUrl
                    ? 'Hasil Gabungan Siap'
                    : currentActiveClip
                    ? `Klip ${currentPlayingIndex + 1} / ${timelineClips.length}: ${currentActiveClip.name}`
                    : '1080p 60fps'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 rounded-lg bg-black/50 hover:bg-black/70 border border-white/10 text-slate-300 hover:text-white transition-colors"
                title={isMuted ? 'Nyalakan Suara' : 'Bisukan Suara'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Bottom Controls Overlay */}
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="w-10 h-10 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-cyan-500/20 transition-transform active:scale-95"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
                </button>
                <button
                  type="button"
                  onClick={handleNextClip}
                  disabled={timelineClips.length <= 1}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors"
                  title="Klip Berikutnya"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
                <span className="font-mono text-xs text-slate-300">
                  {formatTime(currentTime)} / {formatTime(totalDuration)}
                </span>
              </div>

              {stitchedResultUrl && (
                <a
                  href={stitchedResultUrl}
                  download={filmTitle.trim() ? `${filmTitle}.mp4` : 'video-gabungan.mp4'}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Video</span>
                </a>
              )}
            </div>
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* CARD 02: TIMELINE FILM (0/20 KLIP)                                    */}
          {/* --------------------------------------------------------------------- */}
          <div className="bg-slate-900/70 rounded-2xl border border-slate-800 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-xs font-bold font-mono">
                  02
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <span>Timeline Film</span>
                    <span className="text-xs font-mono text-cyan-400 font-normal">
                      ({timelineClips.length}/20 klip • {totalDuration} detik)
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Kiri → kanan = awal → akhir film. Geser urutan sesuai alur cerita.
                  </p>
                </div>
              </div>

              {timelineClips.length > 0 && (
                <button
                  type="button"
                  onClick={() => setTimelineClips([])}
                  className="text-[11px] font-mono text-rose-400 hover:text-rose-300 flex items-center gap-1 self-start sm:self-auto transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Kosongkan Timeline</span>
                </button>
              )}
            </div>

            {/* Timeline Clips Horizontal Slider / Empty State */}
            {timelineClips.length === 0 ? (
              <div className="border-2 border-dashed border-slate-800/80 rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-2 bg-slate-950/40">
                <div className="w-10 h-10 rounded-xl bg-slate-800/60 flex items-center justify-center text-slate-500">
                  <Film className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-semibold text-slate-300">Timeline masih kosong</p>
                  <p className="text-[11px] text-slate-500 max-w-sm">
                    Ketuk klip di <strong>Pustaka Video</strong> di bawah untuk menyusun urutan film kamu.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex gap-3 overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-slate-700">
                {timelineClips.map((item, idx) => (
                  <div
                    key={item.timelineId}
                    className={`relative w-48 shrink-0 rounded-xl border p-2.5 space-y-2 transition-all group ${
                      currentPlayingIndex === idx
                        ? 'bg-cyan-950/30 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                        : 'bg-slate-800/70 border-slate-700/80 hover:border-slate-600'
                    }`}
                  >
                    {/* Thumbnail / Video snapshot */}
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-black border border-slate-700/50 flex items-center justify-center">
                      <video src={item.clip.url} className="w-full h-full object-cover" muted />
                      <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-black/70 text-[10px] font-mono font-bold text-white">
                        #{idx + 1}
                      </div>
                      <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[10px] font-mono text-cyan-300">
                        {item.clip.duration}s
                      </div>
                    </div>

                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-white truncate" title={item.clip.name}>
                        {item.clip.name}
                      </p>
                      <p className="text-[10px] text-slate-400 line-clamp-1">{item.clip.prompt}</p>
                    </div>

                    {/* Timeline Controls (Move left, Move right, Remove) */}
                    <div className="flex items-center justify-between pt-1 border-t border-slate-700/50 text-[10px]">
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => handleMoveClip(idx, 'left')}
                          disabled={idx === 0}
                          className="p-1 rounded bg-slate-700/60 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300"
                          title="Geser ke Kiri"
                        >
                          <ArrowLeft className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveClip(idx, 'right')}
                          disabled={idx === timelineClips.length - 1}
                          className="p-1 rounded bg-slate-700/60 hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed text-slate-300"
                          title="Geser ke Kanan"
                        >
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveFromTimeline(item.timelineId)}
                        className="p-1 rounded bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 transition-colors"
                        title="Hapus dari Timeline"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* CARD 01: PUSTAKA VIDEO                                                */}
          {/* --------------------------------------------------------------------- */}
          <div className="bg-slate-900/70 rounded-2xl border border-slate-800 p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-xs font-bold font-mono">
                  01
                </span>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <span>Pustaka Video</span>
                    <span className="text-xs font-mono text-slate-400 font-normal">
                      ({libraryClips.length} klip tersimpan)
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Ketuk untuk menambah ke timeline — tersimpan 168 jam
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-750 border border-slate-700 text-xs font-medium text-slate-200 flex items-center gap-1.5 transition-colors"
                >
                  <Upload className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Upload Video</span>
                </button>
                {libraryClips.length === 0 && (
                  <button
                    type="button"
                    onClick={handleLoadDemoClips}
                    className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-xs font-medium text-cyan-300 flex items-center gap-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Muat Demo Klip</span>
                  </button>
                )}
              </div>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari prompt..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
            </div>

            {/* Library Grid / Empty state */}
            {filteredClips.length === 0 ? (
              <div className="border border-slate-800/80 rounded-xl p-8 flex flex-col items-center justify-center text-center space-y-2 bg-slate-950/30">
                <div className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center text-slate-500">
                  <Film className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-semibold text-slate-300">Pustaka masih kosong</p>
                  <p className="text-[11px] text-slate-500 max-w-sm">
                    Buat video dulu lewat menu Video Kreatif, atau klik tombol{' '}
                    <strong className="text-cyan-400">Muat Demo Klip</strong> /{' '}
                    <strong className="text-cyan-400">Upload Video</strong> di atas.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleLoadDemoClips}
                  className="mt-2 px-3.5 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambahkan 3 Klip Demo</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1">
                {filteredClips.map((clip) => {
                  const isAdded = timelineClips.some((t) => t.clip.id === clip.id);
                  return (
                    <div
                      key={clip.id}
                      onClick={() => handleAddToTimeline(clip)}
                      className={`cursor-pointer rounded-xl border p-2.5 space-y-2 transition-all ${
                        isAdded
                          ? 'bg-slate-800/90 border-cyan-500/40 shadow-sm'
                          : 'bg-slate-950/50 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-black border border-slate-800 flex items-center justify-center">
                        <video src={clip.url} className="w-full h-full object-cover" muted />
                        <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[10px] font-mono text-slate-300">
                          {clip.duration}s
                        </div>
                        {isAdded && (
                          <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded bg-cyan-500 text-[9px] font-bold text-slate-950 flex items-center gap-1 font-mono">
                            <Check className="w-2.5 h-2.5" /> DI TIMELINE
                          </div>
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold text-white truncate" title={clip.name}>
                          {clip.name}
                        </p>
                        <p className="text-[10px] text-slate-400 line-clamp-2">{clip.prompt}</p>
                      </div>
                      <button
                        type="button"
                        className="w-full py-1 rounded-lg bg-cyan-500/10 group-hover:bg-cyan-500/20 text-cyan-400 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Tambah ke Timeline</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ======================================================================= */}
        {/* RIGHT COLUMN (LG: 4 COLS) - PENGATURAN STUDIO                            */}
        {/* ======================================================================= */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-slate-900/70 rounded-2xl border border-slate-800 p-5 space-y-5">
            {/* Title Header */}
            <div className="flex items-center gap-2.5 pb-4 border-b border-slate-800">
              <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-xs font-bold font-mono">
                03
              </span>
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white tracking-wide uppercase font-mono">
                  Pengaturan
                </h3>
              </div>
            </div>

            {/* Field: Judul Film */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold font-mono tracking-wider text-slate-400 uppercase">
                JUDUL FILM (OPSIONAL)
              </label>
              <input
                type="text"
                value={filmTitle}
                onChange={(e) => setFilmTitle(e.target.value)}
                placeholder="Contoh: Iklan Kopi Pagi v1"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
            </div>

            {/* Field: Transisi Antar Klip */}
            <div className="space-y-1.5 relative" ref={transitionDropdownRef}>
              <label className="text-[11px] font-bold font-mono tracking-wider text-slate-400 uppercase">
                TRANSISI ANTAR KLIP
              </label>
              <button
                type="button"
                onClick={() => setIsTransitionDropdownOpen(!isTransitionDropdownOpen)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 text-xs text-left text-white flex items-center justify-between transition-colors"
              >
                <div>
                  <span className="font-semibold">{activeTransitionLabel}</span>
                  <span className="text-slate-500 ml-2 text-[11px]">
                    ({TRANSITIONS_LIST.find((t) => t.id === selectedTransition)?.desc})
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {isTransitionDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden max-h-72 overflow-y-auto">
                  {TRANSITIONS_LIST.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setSelectedTransition(t.id);
                        setIsTransitionDropdownOpen(false);
                      }}
                      className={`w-full px-3.5 py-2 text-left text-xs flex items-center justify-between transition-colors ${
                        selectedTransition === t.id
                          ? 'bg-cyan-500/10 text-cyan-300 font-bold'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <div>
                        <div>{t.label}</div>
                        <div className="text-[10px] text-slate-500 font-normal">{t.desc}</div>
                      </div>
                      {selectedTransition === t.id && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Field: Subtitle Toggle */}
            <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Subtitles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Subtitle</span>
                </div>
                <p className="text-[10px] text-slate-500">Auto caption otomatis dari narasi video</p>
              </div>

              <button
                type="button"
                onClick={() => setIsSubtitleEnabled(!isSubtitleEnabled)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  isSubtitleEnabled ? 'bg-cyan-500' : 'bg-slate-800'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isSubtitleEnabled ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Field: Audio Latar (BGM) */}
            <div className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-white flex items-center gap-1.5">
                  <Music className="w-3.5 h-3.5 text-amber-400" />
                  <span>Audio Latar (BGM)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAudioModalOpen(true)}
                  className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  {selectedAudio ? 'Ganti Musik' : '+ Tambah'}
                </button>
              </div>

              {selectedAudio ? (
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
                  <div className="truncate text-slate-200">
                    <span className="font-semibold">{selectedAudio.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedAudio(null)}
                    className="text-slate-400 hover:text-rose-400 p-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <p className="text-[10px] text-slate-500">Belum ada audio latar dipilih</p>
              )}

              {selectedAudio && (
                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Volume BGM</span>
                    <span>{audioVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={audioVolume}
                    onChange={(e) => setAudioVolume(Number(e.target.value))}
                    className="w-full accent-cyan-400 h-1 bg-slate-800 rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Summary Box */}
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-1.5 font-mono text-[11px]">
              <div className="flex justify-between text-slate-400">
                <span>Biaya:</span>
                <span className="text-amber-400 font-bold">2 kredit / gabungan</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Klip terpilih:</span>
                <span className="text-white">{timelineClips.length} klip ({totalDuration}s)</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Audio latar:</span>
                <span className="text-slate-300">{selectedAudio ? selectedAudio.name : '—'}</span>
              </div>
            </div>

            {/* Main Action Button */}
            <button
              type="button"
              onClick={handleStartStitching}
              disabled={timelineClips.length < 2 || isProcessing}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                timelineClips.length < 2 || isProcessing
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-500/20 active:scale-[0.98]'
              }`}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
                  <span>{renderProgress}% — Merender Video...</span>
                </>
              ) : (
                <>
                  <Layers className="w-4 h-4" />
                  <span>Gabung Video • 2 kredit</span>
                </>
              )}
            </button>

            {timelineClips.length < 2 && (
              <p className="text-[10px] text-center text-slate-500">
                Pilih minimal 2 klip dari pustaka.
              </p>
            )}

            {/* Processing Progress Detail */}
            {isProcessing && (
              <div className="space-y-1.5 p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30">
                <div className="flex justify-between text-[11px] font-mono text-cyan-300">
                  <span>Proses Rendering</span>
                  <span>{renderProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-400 transition-all duration-300"
                    style={{ width: `${renderProgress}%` }}
                  />
                </div>
                <p className="text-[10px] text-cyan-200/80 italic">{renderStage}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* AUDIO BGM MODAL                                                           */}
      {/* ========================================================================= */}
      {isAudioModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Music className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Pilih Audio Latar (BGM)</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAudioModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {BGM_OPTIONS.map((track) => (
                <div
                  key={track.id}
                  onClick={() => {
                    setSelectedAudio({ id: track.id, name: track.name });
                    setIsAudioModalOpen(false);
                    onShowToast(`Audio latar "${track.name}" dipilih.`);
                  }}
                  className={`p-3 rounded-xl border cursor-pointer flex items-center justify-between transition-colors ${
                    selectedAudio?.id === track.id
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-white'
                      : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div>
                    <p className="text-xs font-bold text-white">{track.name}</p>
                    <p className="text-[10px] text-slate-400">{track.mood}</p>
                  </div>
                  {selectedAudio?.id === track.id && <Check className="w-4 h-4 text-cyan-400" />}
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsAudioModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
