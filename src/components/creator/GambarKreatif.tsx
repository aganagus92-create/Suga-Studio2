import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Upload,
  Image as ImageIcon,
  Copy,
  Download,
  X,
  CheckCircle2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Clock,
  Heart,
  Maximize2,
  Sliders,
  Eye,
  History,
  Bot,
  ImagePlus,
  Feather,
  Gem,
  BadgePercent,
  Flower2,
  Box,
  Building2,
  PartyPopper,
  Radio,
  Mic,
  BarChart3,
  BarChart2,
  GraduationCap,
  Shapes,
  PenTool,
  Cpu,
  Palette,
  Check,
  Wand2,
  LayoutGrid,
  Shirt,
  User,
  Scan,
  ScanLine,
  Film,
  Video
} from 'lucide-react';
import { ActiveView } from '../../types';
import { ModelSelector } from './ModelSelector';
import { GenerationErrorModal } from './GenerationErrorModal';
import { providerRegistry } from '../../services/providers/providerRegistry';
import { litellmService } from '../../services/litellmService';
import { AIProviderConfig, GenerationError } from '../../types/provider';
import {
  SeedreamIcon,
  OpenAIIconPro,
  OpenAIIconExtra,
  OpenAIIconSpiral,
  IdeogramIcon,
  BananaIcon,
  LiteLLMIcon,
  KoboiLLMIcon
} from './ModelBadgeIcons';

interface AIModel {
  id: string;
  name: string;
  desc: string;
  group: 'STANDARD' | 'FAST' | 'LEGACY';
  badgeType: 'seedream' | 'openai-pro' | 'openai-extra' | 'openai-2' | 'ideogram' | 'banana';
}

const AI_MODELS: AIModel[] = [
  {
    id: 'seedream-5-pro',
    name: 'Seedream 5.0 Pro',
    desc: 'Best Quality • Photorealistic',
    group: 'STANDARD',
    badgeType: 'seedream'
  },
  {
    id: 'gpt-image-2-5-pro',
    name: 'GPT Image 2.5 Pro',
    desc: 'Newest OpenAI • Up to Max Qual...',
    group: 'STANDARD',
    badgeType: 'openai-pro'
  },
  {
    id: 'gpt-image-2-5-extra',
    name: 'GPT Image 2.5 Extra',
    desc: 'Newest OpenAI • Alternate Engine',
    group: 'STANDARD',
    badgeType: 'openai-extra'
  },
  {
    id: 'gpt-image-2',
    name: 'GPT Image 2',
    desc: 'Premium Creative • High Accuracy',
    group: 'STANDARD',
    badgeType: 'openai-2'
  },
  {
    id: 'ideogram-4',
    name: 'Ideogram 4.0',
    desc: 'Typography & Poster • Text-to-Im...',
    group: 'STANDARD',
    badgeType: 'ideogram'
  },
  {
    id: 'nano-banana-2',
    name: 'Nano Banana 2',
    desc: 'Fast Generation',
    group: 'FAST',
    badgeType: 'banana'
  },
  {
    id: 'seedream-4-5',
    name: 'Seedream 4.5',
    desc: 'Balanced Quality',
    group: 'LEGACY',
    badgeType: 'seedream'
  },
  {
    id: 'seedream-4-0',
    name: 'Seedream 4.0',
    desc: 'Legacy Model',
    group: 'LEGACY',
    badgeType: 'seedream'
  }
];

interface GeneratedVisual {
  id: string;
  prompt: string;
  ratio: '9:16' | '1:1' | '16:9';
  size: string;
  model: string;
  time: string;
  dateTag: 'TODAY' | 'WEEK' | 'OLDER';
  isFavorite?: boolean;
  colorScheme: string;
  svgType: 'cosmetic' | 'portrait' | 'thumbnail' | 'anime' | 'custom';
  imageUrl?: string;
  providerId?: string;
}

interface GeneratedMascot {
  id: string;
  name: string;
  category: string;
  style: string;
  bg: string;
  desc: string;
  ratio: '1:1' | '9:16' | '16:9' | '2:3' | '3:4' | '4:3';
  prompt: string;
  time: string;
  isFavorite?: boolean;
}

interface BannerStyleOption {
  id: string;
  name: string;
  badgeBg: string;
  iconColor: string;
  iconType: 'feather' | 'gradient' | 'luxury' | 'promo' | 'pastel' | '3d' | 'corporate' | 'playful' | 'retro';
}

const BANNER_DESIGN_STYLES: BannerStyleOption[] = [
  {
    id: 'minimalis',
    name: 'Minimalis',
    badgeBg: 'bg-slate-800/80',
    iconColor: 'text-slate-300',
    iconType: 'feather'
  },
  {
    id: 'modern-gradient',
    name: 'Modern Gradient',
    badgeBg: 'bg-[#231230] border border-fuchsia-800/30',
    iconColor: 'text-fuchsia-400',
    iconType: 'gradient'
  },
  {
    id: 'elegan-luxury',
    name: 'Elegan / Luxury',
    badgeBg: 'bg-[#241c0a] border border-amber-800/30',
    iconColor: 'text-amber-400',
    iconType: 'luxury'
  },
  {
    id: 'bold-promo',
    name: 'Bold Promo / Diskon',
    badgeBg: 'bg-[#280e14] border border-rose-800/30',
    iconColor: 'text-rose-400',
    iconType: 'promo'
  },
  {
    id: 'korean-soft',
    name: 'Korean Soft / Pastel',
    badgeBg: 'bg-[#27101e] border border-pink-800/30',
    iconColor: 'text-pink-400',
    iconType: 'pastel'
  },
  {
    id: '3d-render',
    name: '3D Render',
    badgeBg: 'bg-[#0a232e] border border-cyan-800/30',
    iconColor: 'text-cyan-400',
    iconType: '3d'
  },
  {
    id: 'corporate-bisnis',
    name: 'Corporate / Bisnis',
    badgeBg: 'bg-[#0e1d38] border border-blue-800/30',
    iconColor: 'text-blue-400',
    iconType: 'corporate'
  },
  {
    id: 'playful-fun',
    name: 'Playful / Fun',
    badgeBg: 'bg-[#261f09] border border-yellow-800/30',
    iconColor: 'text-yellow-400',
    iconType: 'playful'
  },
  {
    id: 'vintage-retro',
    name: 'Vintage / Retro',
    badgeBg: 'bg-[#261609] border border-orange-800/30',
    iconColor: 'text-orange-400',
    iconType: 'retro'
  }
];

interface GeneratedBanner {
  id: string;
  image?: string;
  text: string;
  style: string;
  ratio: '1:1' | '9:16' | '16:9';
  time: string;
  cost: number;
  prompt: string;
  isFavorite?: boolean;
}

interface InfografisStyleOption {
  id: string;
  name: string;
  subtitle: string;
  badgeBg: string;
  iconColor: string;
  iconType: 'modern' | 'flat' | 'edukasi' | 'corporate' | 'minimalis' | 'data' | 'isometric' | 'sketch' | 'playful' | 'darktech';
}

const INFOGRAFIS_VISUAL_STYLES: InfografisStyleOption[] = [
  {
    id: 'modern-clean',
    name: 'Modern & Clean',
    subtitle: 'Rapi, ruang lega, tipografi tegas',
    badgeBg: 'bg-[#0e213b] border border-blue-800/30',
    iconColor: 'text-blue-400',
    iconType: 'modern'
  },
  {
    id: 'flat-design',
    name: 'Flat Design',
    subtitle: 'Ikon datar, warna solid, tanpa bayangan',
    badgeBg: 'bg-[#281b0e] border border-orange-800/30',
    iconColor: 'text-orange-400',
    iconType: 'flat'
  },
  {
    id: 'edukasi',
    name: 'Edukasi',
    subtitle: 'Mudah dipahami, ikon ilustratif, alur runut',
    badgeBg: 'bg-[#0d2627] border border-teal-800/30',
    iconColor: 'text-teal-400',
    iconType: 'edukasi'
  },
  {
    id: 'corporate',
    name: 'Corporate',
    subtitle: 'Formal, grid rapi, nuansa bisnis',
    badgeBg: 'bg-[#0d1d36] border border-blue-800/30',
    iconColor: 'text-blue-400',
    iconType: 'corporate'
  },
  {
    id: 'minimalis',
    name: 'Minimalis',
    subtitle: 'Sedikit elemen, fokus ke isi',
    badgeBg: 'bg-slate-800/80 border border-slate-700/30',
    iconColor: 'text-slate-300',
    iconType: 'minimalis'
  },
  {
    id: 'data-statistik',
    name: 'Data & Statistik',
    subtitle: 'Dominan chart, angka besar, tabel',
    badgeBg: 'bg-[#241334] border border-purple-800/30',
    iconColor: 'text-purple-400',
    iconType: 'data'
  },
  {
    id: 'isometrik-3d',
    name: 'Isometrik 3D',
    subtitle: 'Ilustrasi 3D isometrik, berdimensi',
    badgeBg: 'bg-[#0c2430] border border-cyan-800/30',
    iconColor: 'text-cyan-400',
    iconType: 'isometric'
  },
  {
    id: 'hand-drawn-sketsa',
    name: 'Hand-drawn / Sketsa',
    subtitle: 'Doodle, garis tangan, papan tulis',
    badgeBg: 'bg-[#26200a] border border-yellow-800/30',
    iconColor: 'text-yellow-400',
    iconType: 'sketch'
  },
  {
    id: 'playful-ceria',
    name: 'Playful / Ceria',
    subtitle: 'Warna cerah, bentuk membulat, energik',
    badgeBg: 'bg-[#291024] border border-pink-800/30',
    iconColor: 'text-pink-400',
    iconType: 'playful'
  },
  {
    id: 'dark-mode-tech',
    name: 'Dark Mode / Tech',
    subtitle: 'Latar gelap, aksen neon, futuristik',
    badgeBg: 'bg-[#132612] border border-lime-800/30',
    iconColor: 'text-lime-400',
    iconType: 'darktech'
  }
];

interface GeneratedInfografis {
  id: string;
  topic: string;
  refImage?: string;
  style: string;
  colorMode: 'Auto' | 'Manual';
  customPalette?: string;
  ratio: '1:1' | '9:16' | '16:9';
  quality: 'Low' | 'Medium';
  sizeTier: 'Small' | 'Medium' | 'Large';
  time: string;
  cost: number;
  prompt: string;
  isFavorite?: boolean;
}

const PODCAST_THEMES = [
  'Studio Profesional',
  'Cozy Home Studio',
  'Neon Gaming',
  'Dark Moody Cinematic',
  'Custom (tulis sendiri)'
];

interface GeneratedPodcastPhoto {
  id: string;
  characterImage?: string | null;
  theme: string;
  additionalPrompt?: string;
  ratio: '16:9' | '1:1' | '4:5' | '9:16' | '3:4' | '4:3';
  time: string;
  cost: number;
  prompt: string;
  isFavorite?: boolean;
}

const POV_STYLES = [
  'None',
  'Creative',
  'Cinematic',
  'Dynamic',
  'Fashion',
  'Portrait',
  'Stock Photo'
];

interface GeneratedPOVProduct {
  id: string;
  productImage?: string | null;
  additionalPrompt?: string;
  ratio: '9:16' | '2:3' | '1:1' | '16:9';
  style: string;
  resolution: string;
  time: string;
  cost: number;
  prompt: string;
  isFavorite?: boolean;
}

interface GeneratedTryOn {
  id: string;
  clothesImage?: string | null;
  personImage?: string | null;
  additionalPrompt?: string;
  ratio: '2:3' | '9:16' | '1:1' | '16:9';
  resolution: string;
  time: string;
  cost: number;
  prompt: string;
  isFavorite?: boolean;
}

interface ExtractedPrompt {
  id: string;
  image: string;
  prompt: string;
  detailedSubject?: string;
  style?: string;
  lighting?: string;
  composition?: string;
  tags?: string[];
  time: string;
  cost: number;
  isFavorite?: boolean;
}

interface GambarKreatifProps {
  initialSubView?: ActiveView;
  onDeductCredits: (amount: number) => boolean;
  onShowToast: (msg: string) => void;
  onAddHistory: (type: string, title: string) => void;
  onNavigateSettings?: () => void;
  onNavigateToVideo?: (image: string, prompt?: string) => void;
}

export const GambarKreatif: React.FC<GambarKreatifProps> = ({
  initialSubView = 'gambar-buat',
  onDeductCredits,
  onShowToast,
  onAddHistory,
  onNavigateSettings,
  onNavigateToVideo
}) => {
  const [activeTab, setActiveTab] = useState<ActiveView>(initialSubView);

  useEffect(() => {
    setActiveTab(initialSubView);
  }, [initialSubView]);

  // Provider System State
  const [activeProviderConfig, setActiveProviderConfig] = useState<AIProviderConfig>(
    providerRegistry.getActiveProvider().getConfig()
  );
  const [negativePrompt, setNegativePrompt] = useState('');
  const [errorModal, setErrorModal] = useState<GenerationError | null>(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      setActiveProviderConfig(providerRegistry.getActiveProvider().getConfig());
    };
    update();
    return providerRegistry.subscribe(update);
  }, []);

  // Buat Gambar State
  const [promptGambar, setPromptGambar] = useState('');
  const [selectedModel, setSelectedModel] = useState<AIModel>(AI_MODELS[0]);
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const [selectedRatio, setSelectedRatio] = useState<'9:16' | '1:1' | '16:9'>('16:9');
  const [selectedSizeTier, setSelectedSizeTier] = useState<'medium' | 'large'>('medium');
  const [imgCount, setImgCount] = useState<number>(1);
  const [refImages, setRefImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activePreview, setActivePreview] = useState<GeneratedVisual | null>(null);
  const [libraryFilter, setLibraryFilter] = useState<'semua' | 'favorit' | 'hari-ini' | 'minggu-ini'>('semua');
  const [isLibraryCollapsed, setIsLibraryCollapsed] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Library / Generated Items
  const [libraryItems, setLibraryItems] = useState<GeneratedVisual[]>([]);

  // Sub-features state (Mascot, etc.)
  const [mascotName, setMascotName] = useState('');
  const [mascotCategory, setMascotCategory] = useState('Hewan');
  const [mascotStyle, setMascotStyle] = useState('3D Pixar');
  const [mascotBg, setMascotBg] = useState('Solid');
  const [mascotDesc, setMascotDesc] = useState('');
  const [mascotRatio, setMascotRatio] = useState<'1:1' | '9:16' | '16:9' | '2:3' | '3:4' | '4:3'>('1:1');
  const [mascotCount, setMascotCount] = useState<number>(1);
  const [isGeneratingMascot, setIsGeneratingMascot] = useState(false);
  const [mascotResults, setMascotResults] = useState<GeneratedMascot[]>([]);
  const [activeMascot, setActiveMascot] = useState<GeneratedMascot | null>(null);
  const [generatedMascotPrompt, setGeneratedMascotPrompt] = useState<string | null>(null);

  // Buat Banner State
  const [bannerMainImage, setBannerMainImage] = useState<string | null>(null);
  const [selectedBannerStyle, setSelectedBannerStyle] = useState<string>('Minimalis');
  const [isBannerStyleOpen, setIsBannerStyleOpen] = useState(false);
  const [bannerText, setBannerText] = useState('');
  const [bannerRatio, setBannerRatio] = useState<'1:1' | '9:16' | '16:9'>('1:1');
  const [bannerCount, setBannerCount] = useState<number>(1);
  const [isGeneratingBanner, setIsGeneratingBanner] = useState(false);
  const [currentBanner, setCurrentBanner] = useState<GeneratedBanner | null>(null);
  const [bannerHistory, setBannerHistory] = useState<GeneratedBanner[]>([]);

  // Infografis State
  const [infoRefImage, setInfoRefImage] = useState<string | null>(null);
  const [infoTopic, setInfoTopic] = useState('');
  const [selectedInfoStyle, setSelectedInfoStyle] = useState<string>('Modern & Clean');
  const [isInfoStyleOpen, setIsInfoStyleOpen] = useState(false);
  const [infoColorMode, setInfoColorMode] = useState<'Auto' | 'Manual'>('Auto');
  const [infoManualPalette, setInfoManualPalette] = useState<string>('Biru Korporat');
  const [infoRatio, setInfoRatio] = useState<'1:1' | '9:16' | '16:9'>('1:1');
  const [infoQuality, setInfoQuality] = useState<'Low' | 'Medium'>('Medium');
  const [infoSizeTier, setInfoSizeTier] = useState<'Small' | 'Medium' | 'Large'>('Medium');
  const [infoCount, setInfoCount] = useState<number>(1);
  const [isGeneratingInfo, setIsGeneratingInfo] = useState(false);
  const [currentInfo, setCurrentInfo] = useState<GeneratedInfografis | null>(null);
  const [infoHistory, setInfoHistory] = useState<GeneratedInfografis[]>([]);

  // Studio Podcast State
  const [podcastCharImage, setPodcastCharImage] = useState<string | null>(null);
  const [podcastTheme, setPodcastTheme] = useState<string>('Studio Profesional');
  const [isPodcastThemeOpen, setIsPodcastThemeOpen] = useState(false);
  const [podcastCustomTheme, setPodcastCustomTheme] = useState('');
  const [podcastAdditionalPrompt, setPodcastAdditionalPrompt] = useState('');
  const [podcastRatio, setPodcastRatio] = useState<'16:9' | '1:1' | '4:5' | '9:16' | '3:4' | '4:3'>('16:9');
  const [podcastCount, setPodcastCount] = useState<number>(4);
  const [isGeneratingPodcast, setIsGeneratingPodcast] = useState(false);
  const [podcastResults, setPodcastResults] = useState<GeneratedPodcastPhoto[]>([]);
  const [activePodcastPhoto, setActivePodcastPhoto] = useState<GeneratedPodcastPhoto | null>(null);

  // POV Produk State
  const [povProductImage, setPovProductImage] = useState<string | null>(null);
  const [povPrompt, setPovPrompt] = useState<string>('');
  const [povRatio, setPovRatio] = useState<'9:16' | '2:3' | '1:1' | '16:9'>('9:16');
  const [povStyle, setPovStyle] = useState<string>('None');
  const [isPovStyleOpen, setIsPovStyleOpen] = useState<boolean>(false);
  const [isGeneratingPov, setIsGeneratingPov] = useState<boolean>(false);
  const [currentPovProduct, setCurrentPovProduct] = useState<GeneratedPOVProduct | null>(null);
  const [povHistory, setPovHistory] = useState<GeneratedPOVProduct[]>([]);

  // Virtual Try-On State
  const [tryOnClothesImage, setTryOnClothesImage] = useState<string | null>(null);
  const [tryOnPersonImage, setTryOnPersonImage] = useState<string | null>(null);
  const [tryOnPrompt, setTryOnPrompt] = useState<string>('');
  const [tryOnRatio, setTryOnRatio] = useState<'2:3' | '9:16' | '1:1' | '16:9'>('2:3');
  const [isGeneratingTryOn, setIsGeneratingTryOn] = useState<boolean>(false);
  const [currentTryOn, setCurrentTryOn] = useState<GeneratedTryOn | null>(null);
  const [tryOnHistory, setTryOnHistory] = useState<GeneratedTryOn[]>([]);

  // Extract Image State
  const [extractImage, setExtractImage] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);
  const [currentExtracted, setCurrentExtracted] = useState<ExtractedPrompt | null>(null);
  const [extractHistory, setExtractHistory] = useState<ExtractedPrompt[]>([]);

  const [subTitle, setSubTitle] = useState('');
  const [subDesc, setSubDesc] = useState('');
  const [subOutput, setSubOutput] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerFileInputRef = useRef<HTMLInputElement>(null);
  const bannerDropdownRef = useRef<HTMLDivElement>(null);
  const infoFileInputRef = useRef<HTMLInputElement>(null);
  const infoDropdownRef = useRef<HTMLDivElement>(null);
  const podcastFileInputRef = useRef<HTMLInputElement>(null);
  const podcastThemeDropdownRef = useRef<HTMLDivElement>(null);
  const povFileInputRef = useRef<HTMLInputElement>(null);
  const povStyleDropdownRef = useRef<HTMLDivElement>(null);
  const tryOnClothesFileInputRef = useRef<HTMLInputElement>(null);
  const tryOnPersonFileInputRef = useRef<HTMLInputElement>(null);
  const extractFileInputRef = useRef<HTMLInputElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsModelDropdownOpen(false);
      }
      if (bannerDropdownRef.current && !bannerDropdownRef.current.contains(event.target as Node)) {
        setIsBannerStyleOpen(false);
      }
      if (infoDropdownRef.current && !infoDropdownRef.current.contains(event.target as Node)) {
        setIsInfoStyleOpen(false);
      }
      if (podcastThemeDropdownRef.current && !podcastThemeDropdownRef.current.contains(event.target as Node)) {
        setIsPodcastThemeOpen(false);
      }
      if (povStyleDropdownRef.current && !povStyleDropdownRef.current.contains(event.target as Node)) {
        setIsPovStyleOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Size labels mapped to ratio
  const getSizeLabel = (ratio: '9:16' | '1:1' | '16:9', tier: 'medium' | 'large') => {
    if (ratio === '16:9') {
      return tier === 'medium' ? 'Medium 2560×1440' : 'Large 4096×2304';
    }
    if (ratio === '9:16') {
      return tier === 'medium' ? 'Medium 1440×2560' : 'Large 2304×4096';
    }
    return tier === 'medium' ? 'Medium 2048×2048' : 'Large 4096×4096';
  };

  // Upload image reference
  const handleUploadRef = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (refImages.length + files.length > 6) {
      onShowToast('Maksimal 6 gambar acuan.');
      return;
    }

    const readers: Promise<string>[] = (Array.from(files) as File[]).map((file: File) => {
      return new Promise((resolve) => {
        const r = new FileReader();
        r.onload = (evt) => resolve(evt.target?.result as string);
        r.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((newImgs) => {
      setRefImages((prev) => [...prev, ...newImgs].slice(0, 6));
      onShowToast(`${newImgs.length} gambar acuan ditambahkan!`);
    });
  };

  const handleRemoveRefImage = (index: number) => {
    setRefImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Render Model Badge Icon
  const renderModelBadge = (type: AIModel['badgeType']) => {
    switch (type) {
      case 'seedream':
        return <SeedreamIcon className="w-8 h-8" />;
      case 'openai-pro':
        return <OpenAIIconPro className="w-8 h-8" />;
      case 'openai-extra':
        return <OpenAIIconExtra className="w-8 h-8" />;
      case 'openai-2':
        return <OpenAIIconSpiral className="w-8 h-8" />;
      case 'ideogram':
        return <IdeogramIcon className="w-8 h-8" />;
      case 'banana':
        return <BananaIcon className="w-8 h-8" />;
      default:
        return <SeedreamIcon className="w-8 h-8" />;
    }
  };

  // Presets from screenshot
  const handleApplyPreset = (presetType: 'Poster Produk' | 'Foto Realistis' | 'Thumbnail YouTube' | 'Karakter Anime') => {
    let text = '';
    if (presetType === 'Poster Produk') {
      text = 'Commercial luxury skincare bottle on pristine marble pedestal with morning sunlight rays, splashing rose water essence, hyperrealistic, 8k resolution, cinematic commercial photography.';
    } else if (presetType === 'Foto Realistis') {
      text = 'Ultra-photorealistic portrait of a stylish young creator sitting in a warm sunlit cafe in Jakarta, holding coffee cup, shot on 85mm f/1.4 lens, natural golden hour lighting, cinematic bokeh.';
    } else if (presetType === 'Thumbnail YouTube') {
      text = 'High-CTR YouTube thumbnail visual, expressive creator looking shocked holding futuristic glowing gadget, vibrant neon cyan & magenta rim lighting, clean bold contrast, 8k.';
    } else if (presetType === 'Karakter Anime') {
      text = 'Vibrant modern anime hero character standing atop high-rise building at dusk, glowing cybernetic katana, detailed Makoto Shinkai aesthetic sky, masterpiece illustration.';
    }
    setPromptGambar(text);
    onShowToast(`Preset "${presetType}" diterapkan!`);
  };

  // Trigger Generation with Modular Provider Architecture
  const handleGenerate = async () => {
    if (!promptGambar.trim()) {
      onShowToast('Tulis deskripsi prompt terlebih dahulu.');
      return;
    }

    const cost = 5 * imgCount;
    if (!onDeductCredits(cost)) return;

    setIsGenerating(true);

    try {
      const { results, usedProvider, fallbackOccurred } = await providerRegistry.generateWithFallback(
        {
          prompt: promptGambar.trim(),
          negativePrompt: negativePrompt.trim() || undefined,
          aspectRatio: selectedRatio,
          numberOfImages: imgCount,
          referenceImages: refImages.length > 0 ? refImages : undefined,
          quality: 'standard'
        },
        (fallbackMsg) => {
          onShowToast(fallbackMsg);
        }
      );

      const now = new Date();
      const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

      // Determine visual style classification
      let svgType: GeneratedVisual['svgType'] = 'custom';
      const pLower = promptGambar.toLowerCase();
      if (pLower.includes('product') || pLower.includes('skincare') || pLower.includes('poster')) {
        svgType = 'cosmetic';
      } else if (pLower.includes('portrait') || pLower.includes('foto') || pLower.includes('creator')) {
        svgType = 'portrait';
      } else if (pLower.includes('thumbnail') || pLower.includes('youtube') || pLower.includes('neon')) {
        svgType = 'thumbnail';
      } else if (pLower.includes('anime') || pLower.includes('hero') || pLower.includes('cyber')) {
        svgType = 'anime';
      }

      const newOutputs: GeneratedVisual[] = results.map((item, idx) => ({
        id: item.id || `vis-${Date.now()}-${idx}`,
        prompt: item.prompt || promptGambar,
        ratio: selectedRatio,
        size: item.size || getSizeLabel(selectedRatio, selectedSizeTier),
        model:
          usedProvider.providerId === 'litellm'
            ? litellmService.getActiveModel()?.name || litellmService.getActiveModelId() || usedProvider.displayName
            : usedProvider.displayName,
        time: timeStr,
        dateTag: 'TODAY',
        colorScheme: ['#1e1b4b', '#0f172a', '#172554', '#1e293b'][idx % 4],
        svgType,
        imageUrl: item.imageUrl,
        providerId: usedProvider.providerId
      }));

      const modelDisplayName =
        usedProvider.providerId === 'litellm'
          ? litellmService.getActiveModel()?.name || usedProvider.displayName
          : usedProvider.displayName;

      setLibraryItems((prev) => [...newOutputs, ...prev]);
      setActivePreview(newOutputs[0]);
      setIsGenerating(false);
      onShowToast(
        fallbackOccurred
          ? `Visual sukses dirender via ${modelDisplayName} (Auto Fallback)!`
          : `Berhasil merender ${imgCount} visual via ${modelDisplayName} (-${cost} kredit)!`
      );
      onAddHistory('Gambar Kreatif', promptGambar.slice(0, 35) + '...');
    } catch (err: any) {
      // Refund credits on failure
      onDeductCredits(-cost);
      setIsGenerating(false);

      const structuredError: GenerationError = err?.code
        ? err
        : {
            code: 'API_ERROR',
            title: 'Gagal Menghasilkan Gambar',
            detail: err?.message || 'Terjadi gangguan saat memproses request ke provider AI.',
            providerId: activeProviderConfig.providerId,
            providerName: activeProviderConfig.displayName,
            modelId: activeProviderConfig.modelId,
            canRetry: true,
            canFallback: true,
            requiresSettings: false
          };

      setErrorModal(structuredError);
      setIsErrorModalOpen(true);
    }
  };

  // Toggle favorite
  const handleToggleFavorite = (id: string) => {
    setLibraryItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item))
    );
    if (activePreview?.id === id) {
      setActivePreview((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
    }
  };

  // Copy prompt
  const handleCopyPrompt = (text: string) => {
    navigator.clipboard.writeText(text);
    onShowToast('Prompt berhasil disalin!');
  };

  // Filter library items
  const filteredLibrary = libraryItems.filter((item) => {
    if (libraryFilter === 'favorit') return item.isFavorite;
    if (libraryFilter === 'hari-ini') return item.dateTag === 'TODAY';
    if (libraryFilter === 'minggu-ini') return item.dateTag === 'TODAY' || item.dateTag === 'WEEK';
    return true;
  });

  // Mascot Generator handler
  const handleGenerateMascot = () => {
    if (!mascotName.trim()) {
      onShowToast('Nama Maskot wajib diisi.');
      return;
    }
    const cost = 5 * mascotCount;
    if (!onDeductCredits(cost)) return;

    setIsGeneratingMascot(true);

    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

      const newMascots: GeneratedMascot[] = Array.from({ length: mascotCount }).map((_, idx) => {
        const fullPrompt = `Cute brand mascot character "${mascotName}", category: ${mascotCategory}, visual style: ${mascotStyle}, background: ${mascotBg}, details: ${mascotDesc || 'expressive, friendly, modern character design'}, aspect ratio: ${mascotRatio}, highly detailed 3D octane render, studio key lighting, vivid saturated colors, ray tracing, 8k resolution masterpiece.`;
        return {
          id: `mascot-${Date.now()}-${idx}`,
          name: mascotName,
          category: mascotCategory,
          style: mascotStyle,
          bg: mascotBg,
          desc: mascotDesc,
          ratio: mascotRatio,
          prompt: fullPrompt,
          time: timeStr
        };
      });

      setMascotResults((prev) => [...newMascots, ...prev]);
      setActiveMascot(newMascots[0]);
      setIsGeneratingMascot(false);
      onShowToast(`Berhasil merender ${mascotCount} maskot (-${cost} kredit)!`);
      onAddHistory('Buat Mascot', mascotName);
    }, 1200);
  };

  const handleToggleFavoriteMascot = (id: string) => {
    setMascotResults((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item))
    );
    if (activeMascot?.id === id) {
      setActiveMascot((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
    }
  };

  // Banner Style Icon Renderer
  const renderBannerStyleIcon = (type: string) => {
    switch (type) {
      case 'feather':
        return <Feather className="w-3.5 h-3.5" />;
      case 'gradient':
        return (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="12" r="5" stroke="#ec4899" />
            <circle cx="16" cy="12" r="5" stroke="#c084fc" />
          </svg>
        );
      case 'luxury':
        return <Gem className="w-3.5 h-3.5" />;
      case 'promo':
        return <BadgePercent className="w-3.5 h-3.5" />;
      case 'pastel':
        return <Flower2 className="w-3.5 h-3.5" />;
      case '3d':
        return <Box className="w-3.5 h-3.5" />;
      case 'corporate':
        return <Building2 className="w-3.5 h-3.5" />;
      case 'playful':
        return <PartyPopper className="w-3.5 h-3.5" />;
      case 'retro':
        return <Radio className="w-3.5 h-3.5" />;
      default:
        return <Sparkles className="w-3.5 h-3.5" />;
    }
  };

  // Banner Actions
  const handleUploadBannerMainImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      onShowToast('Ukuran gambar maksimal 10MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      setBannerMainImage(evt.target?.result as string);
      onShowToast('Gambar utama berhasil diunggah.');
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateBanner = () => {
    if (!bannerMainImage) {
      onShowToast('Silakan upload Gambar Utama terlebih dahulu.');
      return;
    }
    const cost = 2 * bannerCount;
    if (!onDeductCredits(cost)) return;

    setIsGeneratingBanner(true);

    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      const fullPrompt = `High conversion advertising banner in ${selectedBannerStyle} style, feature headline "${bannerText || 'PROMO SPESIAL'}", ratio ${bannerRatio}, commercial product placement, high dynamic range, crisp typography, clean vector accents, master marketing visual.`;

      const newBanner: GeneratedBanner = {
        id: `banner-${Date.now()}`,
        image: bannerMainImage,
        text: bannerText || 'DISKON 50% — Belanja Sekarang!',
        style: selectedBannerStyle,
        ratio: bannerRatio,
        time: timeStr,
        cost: cost,
        prompt: fullPrompt
      };

      setCurrentBanner(newBanner);
      setBannerHistory((prev) => [newBanner, ...prev]);
      setIsGeneratingBanner(false);
      onShowToast(`Banner berhasil dibuat (-${cost} kredit)!`);
      onAddHistory('Buat Banner', bannerText || selectedBannerStyle);
    }, 1200);
  };

  const handleToggleFavoriteBanner = (id: string) => {
    setBannerHistory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item))
    );
    if (currentBanner?.id === id) {
      setCurrentBanner((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
    }
  };

  // Infografis Style Icon Renderer
  const renderInfoStyleIcon = (type: string) => {
    switch (type) {
      case 'modern':
        return <LayoutGrid className="w-3.5 h-3.5" />;
      case 'flat':
        return <Shapes className="w-3.5 h-3.5" />;
      case 'edukasi':
        return <GraduationCap className="w-3.5 h-3.5" />;
      case 'corporate':
        return <Building2 className="w-3.5 h-3.5" />;
      case 'minimalis':
        return <Feather className="w-3.5 h-3.5" />;
      case 'data':
        return <BarChart3 className="w-3.5 h-3.5" />;
      case 'isometric':
        return <Box className="w-3.5 h-3.5" />;
      case 'sketch':
        return <PenTool className="w-3.5 h-3.5" />;
      case 'playful':
        return <PartyPopper className="w-3.5 h-3.5" />;
      case 'darktech':
        return <Cpu className="w-3.5 h-3.5" />;
      default:
        return <BarChart2 className="w-3.5 h-3.5" />;
    }
  };

  // Infografis Actions
  const handleUploadInfoRef = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      onShowToast('Ukuran gambar referensi maksimal 10MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      setInfoRefImage(evt.target?.result as string);
      onShowToast('Gambar referensi berhasil diunggah.');
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateInfografis = () => {
    if (!infoTopic.trim()) {
      onShowToast('Topik / Data wajib diisi.');
      return;
    }
    const cost = 26 * infoCount;
    if (!onDeductCredits(cost)) return;

    setIsGeneratingInfo(true);

    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      const fullPrompt = `Master informative infographic visual layout about "${infoTopic.slice(0, 80)}", visual style: ${selectedInfoStyle}, color scheme: ${infoColorMode === 'Auto' ? 'AI Optimized Dynamic Palette' : infoManualPalette}, ratio: ${infoRatio}, quality: ${infoQuality}, resolution tier: ${infoSizeTier}, structured data presentation, clear typography, informative charts, high readability, professional vector graphics.`;

      const newInfo: GeneratedInfografis = {
        id: `info-${Date.now()}`,
        topic: infoTopic,
        refImage: infoRefImage || undefined,
        style: selectedInfoStyle,
        colorMode: infoColorMode,
        customPalette: infoColorMode === 'Manual' ? infoManualPalette : undefined,
        ratio: infoRatio,
        quality: infoQuality,
        sizeTier: infoSizeTier,
        time: timeStr,
        cost: cost,
        prompt: fullPrompt
      };

      setCurrentInfo(newInfo);
      setInfoHistory((prev) => [newInfo, ...prev]);
      setIsGeneratingInfo(false);
      onShowToast(`Infografis berhasil digenerate (-${cost} kredit)!`);
      onAddHistory('Infografis', infoTopic.slice(0, 40));
    }, 1300);
  };

  const handleToggleFavoriteInfo = (id: string) => {
    setInfoHistory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item))
    );
    if (currentInfo?.id === id) {
      setCurrentInfo((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
    }
  };

  // Studio Podcast Actions
  const handleUploadPodcastChar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      onShowToast('Ukuran foto karakter maksimal 10MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      setPodcastCharImage(evt.target?.result as string);
      onShowToast('Foto karakter podcast berhasil diunggah.');
    };
    reader.readAsDataURL(file);
  };

  const handleGeneratePodcast = () => {
    if (!podcastCharImage) {
      onShowToast('Foto Karakter wajib diunggah.');
      return;
    }
    const cost = 2 * podcastCount;
    if (!onDeductCredits(cost)) return;

    setIsGeneratingPodcast(true);

    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      const activeThemeName =
        podcastTheme === 'Custom (tulis sendiri)' && podcastCustomTheme
          ? podcastCustomTheme
          : podcastTheme;

      const fullPrompt = `Ultra-photorealistic studio podcast photography, featuring character in authentic ${activeThemeName} setting, professional boom arm Shure SM7B broadcast microphone with shockmount and pop filter in front, sound-dampening acoustic panels, subtle neon backlight, studio headphone over ears, natural confident host expression, cinematic depth of field f/1.8, 85mm portrait lens, 8k resolution masterwork.${podcastAdditionalPrompt ? ` Additional details: ${podcastAdditionalPrompt}.` : ''}`;

      const newPhotos: GeneratedPodcastPhoto[] = Array.from({ length: podcastCount }).map((_, idx) => ({
        id: `podcast-${Date.now()}-${idx}`,
        characterImage: podcastCharImage,
        theme: activeThemeName,
        additionalPrompt: podcastAdditionalPrompt,
        ratio: podcastRatio,
        time: timeStr,
        cost: cost,
        prompt: fullPrompt
      }));

      setPodcastResults((prev) => [...newPhotos, ...prev]);
      setActivePodcastPhoto(newPhotos[0]);
      setIsGeneratingPodcast(false);
      onShowToast(`Berhasil merender ${podcastCount} foto podcast (-${cost} kredit)!`);
      onAddHistory('Studio Podcast', activeThemeName);
    }, 1300);
  };

  const handleToggleFavoritePodcast = (id: string) => {
    setPodcastResults((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item))
    );
    if (activePodcastPhoto?.id === id) {
      setActivePodcastPhoto((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
    }
  };

  // POV Produk Actions
  const getPovResolution = (r: '9:16' | '2:3' | '1:1' | '16:9') => {
    switch (r) {
      case '9:16':
        return '1440×2560';
      case '2:3':
        return '1440×2160';
      case '1:1':
        return '2048×2048';
      case '16:9':
        return '2560×1440';
      default:
        return '1440×2560';
    }
  };

  const handleUploadPovProduct = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      onShowToast('Ukuran foto produk maksimal 10MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      setPovProductImage(evt.target?.result as string);
      onShowToast('Foto produk POV berhasil diunggah.');
    };
    reader.readAsDataURL(file);
  };

  const handleGeneratePov = () => {
    if (!povProductImage && !povPrompt.trim()) {
      onShowToast('Silakan unggah foto produk atau isi prompt tambahan.');
      return;
    }
    const cost = 10;
    if (!onDeductCredits(cost)) return;

    setIsGeneratingPov(true);

    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      const res = getPovResolution(povRatio);

      const fullPrompt = `First-person point-of-view (POV) commercial product shot, ${povStyle !== 'None' ? `${povStyle} photography style, ` : ''}human hands holding and presenting the product from user perspective, pristine unboxing tabletop atmosphere, macro lens depth of field f/2.0, soft ambient commercial studio lighting, natural skin tones, clean aesthetic background, 8k resolution masterwork.${povPrompt ? ` Additional details: ${povPrompt}.` : ''}`;

      const newPovItem: GeneratedPOVProduct = {
        id: `pov-${Date.now()}`,
        productImage: povProductImage,
        additionalPrompt: povPrompt,
        ratio: povRatio,
        style: povStyle,
        resolution: res,
        time: timeStr,
        cost: cost,
        prompt: fullPrompt
      };

      setCurrentPovProduct(newPovItem);
      setPovHistory((prev) => [newPovItem, ...prev]);
      setIsGeneratingPov(false);
      onShowToast(`POV Produk berhasil dibuat (-${cost} kredit)!`);
      onAddHistory('POV Produk', povPrompt ? povPrompt.slice(0, 30) : `Style ${povStyle}`);
    }, 1300);
  };

  const handleToggleFavoritePov = (id: string) => {
    setPovHistory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item))
    );
    if (currentPovProduct?.id === id) {
      setCurrentPovProduct((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
    }
  };

  // Virtual Try-On Actions
  const getTryOnResolution = (r: '2:3' | '9:16' | '1:1' | '16:9') => {
    switch (r) {
      case '2:3':
        return '±848×1264';
      case '9:16':
        return '±848×1508';
      case '1:1':
        return '±1024×1024';
      case '16:9':
        return '±1508×848';
      default:
        return '±848×1264';
    }
  };

  const handleUploadClothes = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      onShowToast('Ukuran foto pakaian maksimal 10MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      setTryOnClothesImage(evt.target?.result as string);
      onShowToast('Foto pakaian berhasil diunggah.');
    };
    reader.readAsDataURL(file);
  };

  const handleUploadPerson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      onShowToast('Ukuran foto orang maksimal 10MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      setTryOnPersonImage(evt.target?.result as string);
      onShowToast('Foto orang berhasil diunggah.');
    };
    reader.readAsDataURL(file);
  };

  const handleGenerateTryOn = () => {
    if (!tryOnClothesImage && !tryOnPersonImage) {
      onShowToast('Silakan unggah foto pakaian dan foto orang.');
      return;
    }
    const cost = 5;
    if (!onDeductCredits(cost)) return;

    setIsGeneratingTryOn(true);

    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      const res = getTryOnResolution(tryOnRatio);

      const fullPrompt = `High-fashion virtual try-on photography, clothing garment fitted seamlessly onto person preserving natural pose, body proportions, fabric draping, authentic folds and wrinkles, photorealistic studio lighting, Hasselblad H6D-100c medium format camera aesthetic, 8k resolution masterwork.${tryOnPrompt ? ` Additional details: ${tryOnPrompt}.` : ''}`;

      const newTryOn: GeneratedTryOn = {
        id: `tryon-${Date.now()}`,
        clothesImage: tryOnClothesImage,
        personImage: tryOnPersonImage,
        additionalPrompt: tryOnPrompt,
        ratio: tryOnRatio,
        resolution: res,
        time: timeStr,
        cost: cost,
        prompt: fullPrompt
      };

      setCurrentTryOn(newTryOn);
      setTryOnHistory((prev) => [newTryOn, ...prev]);
      setIsGeneratingTryOn(false);
      onShowToast(`Virtual Try-On berhasil diproses (-${cost} kredit)!`);
      onAddHistory('Virtual Try-On', tryOnPrompt ? tryOnPrompt.slice(0, 30) : 'Fashion Try-On');
    }, 1300);
  };

  const handleToggleFavoriteTryOn = (id: string) => {
    setTryOnHistory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isFavorite: !item.isFavorite } : item))
    );
    if (currentTryOn?.id === id) {
      setCurrentTryOn((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
    }
  };

  // Extract Image Actions
  const handleUploadExtractImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 7 * 1024 * 1024) {
      onShowToast('Ukuran gambar maksimal 7MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (evt) => {
      setExtractImage(evt.target?.result as string);
      onShowToast('Gambar untuk ekstraksi berhasil diunggah.');
    };
    reader.readAsDataURL(file);
  };

  const handleExtractPrompt = () => {
    if (!extractImage) {
      onShowToast('Silakan upload gambar terlebih dahulu.');
      return;
    }
    const cost = 2;
    if (!onDeductCredits(cost)) return;

    setIsExtracting(true);

    setTimeout(() => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

      const extractedPromptText = `A stunning commercial studio photography, crisp focal clarity on main subject, intricate texture details, subtle rim lighting, soft diffuse shadows, balanced color palette with cinematic depth of field f/1.8, shot on Sony A7R V, clean modern composition, 8k resolution.`;

      const newExtracted: ExtractedPrompt = {
        id: `ext-${Date.now()}`,
        image: extractImage,
        prompt: extractedPromptText,
        detailedSubject: 'Fokus subjek utama dengan tekstur tajam dan kontras natural',
        style: 'Commercial Studio Aesthetic',
        lighting: 'Softbox Diffuse Key Light & Warm Accent Rim',
        composition: 'Center-balanced, 85mm lens, f/1.8 shallow DOF',
        tags: ['Studio', 'Photorealistic', '8K', 'Commercial', 'Sony A7R V'],
        time: timeStr,
        cost: cost
      };

      setCurrentExtracted(newExtracted);
      setExtractHistory((prev) => [newExtracted, ...prev]);
      setIsExtracting(false);
      onShowToast(`Prompt berhasil diekstrak (-${cost} kredit)!`);
      onAddHistory('Extract Image', 'Ekstraksi Prompt Gambar');
    }, 1200);
  };

  const handleUseInBuatGambar = (promptText: string) => {
    setPromptGambar(promptText);
    setActiveTab('gambar-buat');
    onShowToast('Prompt dipasang ke Buat Gambar!');
  };

  // Sub-feature generator handler
  const handleGenerateSubFeature = (featureName: string) => {
    if (!onDeductCredits(5)) return;
    const res = `SUGA AI ${featureName} Master Prompt:
Focus: "${subTitle || 'Brand Campaign'}"
Details: "${subDesc || 'High engagement, aesthetic balance, commercial grade'}"
Technical Specs: 8K Resolution, Cinema 4D Render, Color Grading Match, Aspect Ratio 16:9, Ultra Clean.`;
    setSubOutput(res);
    onShowToast(`${featureName} berhasil dihasilkan (-5 kredit)!`);
    onAddHistory(featureName, subTitle || featureName);
  };

  return (
    <div className="space-y-4">
      {/* Subnav Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 custom-scrollbar">
        {[
          { id: 'gambar-buat', label: 'Buat Gambar' },
          { id: 'gambar-mascot', label: 'Buat Mascot' },
          { id: 'gambar-banner', label: 'Buat Banner' },
          { id: 'gambar-infografis', label: 'Infografis' },
          { id: 'gambar-podcast', label: 'Studio Podcast' },
          { id: 'gambar-pov', label: 'POV Produk' },
          { id: 'gambar-tryon', label: 'Virtual Try-On' },
          { id: 'gambar-extract', label: 'Extract Image' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as ActiveView)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                : 'bg-[#090f1e] text-slate-400 hover:text-slate-200 border border-slate-800/80'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. BUAT GAMBAR TAB (Exact Match to User Screenshots) */}
      {activeTab === 'gambar-buat' && (
        <div className="flex flex-col lg:flex-row gap-5 items-start">
          {/* ================= LEFT CONTROLS PANEL ================= */}
          <div className="w-full lg:w-[380px] xl:w-[410px] shrink-0 space-y-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#091122]/90 border border-slate-800/80 space-y-4 shadow-xl">
              {/* Header */}
              <div className="flex items-center space-x-2 text-white">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <h2 className="text-xs sm:text-sm font-bold tracking-tight font-heading">
                  Gambar Kreatif — Buat Gambar
                </h2>
              </div>

              {/* Prompt Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-white">Prompt</label>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Jelaskan gambar yang ingin dibuat secara detail untuk hasil terbaik.
                </p>
                <div className="relative rounded-2xl bg-[#070d1a] border border-slate-800 focus-within:border-blue-500/80 transition-all p-3">
                  <textarea
                    rows={4}
                    value={promptGambar}
                    onChange={(e) => setPromptGambar(e.target.value)}
                    maxLength={10000}
                    placeholder="Deskripsikan gambar yang ingin kamu buat..."
                    className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-500 resize-none focus:outline-none leading-relaxed"
                  />
                  <div className="text-right pt-1">
                    <span className="text-[10px] text-slate-500 font-mono">
                      {promptGambar.length} / 10000
                    </span>
                  </div>
                </div>
              </div>

              {/* Image Reference */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200">Image Reference</span>
                  <span className="text-xs text-slate-500 font-mono">{refImages.length}/6</span>
                </div>

                {/* Upload Area */}
                {activeProviderConfig.capabilities.supportsReferenceImages ? (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-700/70 hover:border-blue-500/70 rounded-2xl p-4 text-center cursor-pointer transition-all bg-[#070d1a]/50 hover:bg-[#070d1a]"
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      multiple
                      accept="image/*"
                      onChange={handleUploadRef}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <Upload className="w-5 h-5 text-slate-400 mb-0.5" />
                      <p className="text-xs text-slate-300">
                        Unggah gambar acuan <span className="text-slate-400">(opsional, maks 6)</span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="border border-dashed border-slate-800 rounded-2xl p-3.5 text-center bg-[#070d1a]/40">
                    <p className="text-xs text-amber-300/90 font-medium">
                      Fitur acuan tidak didukung pada model <span className="font-bold">{activeProviderConfig.displayName}</span>
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Gunakan Seedream 5.0 Pro untuk menggunakan acuan gambar.
                    </p>
                  </div>
                )}

                {/* Pick from history link */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setShowHistoryModal(true)}
                    className="text-[11px] text-slate-400 hover:text-blue-400 flex items-center justify-center gap-1.5 mx-auto transition-colors cursor-pointer"
                  >
                    <History className="w-3.5 h-3.5" />
                    <span>atau pilih dari riwayat</span>
                  </button>
                </div>

                {/* Image Reference Thumbnails Grid */}
                {refImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {refImages.map((img, idx) => (
                      <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-700 h-16 bg-slate-900">
                        <img src={img} alt={`Ref ${idx + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveRefImage(idx);
                          }}
                          className="absolute top-1 right-1 p-1 rounded-full bg-black/70 hover:bg-rose-600 text-white transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* PENGATURAN LANJUTAN DIVIDER */}
              <div className="relative py-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-800" />
                </div>
                <div className="relative flex justify-start">
                  <span className="bg-[#091122] pr-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                    PENGATURAN LANJUTAN
                  </span>
                </div>
              </div>

              {/* Modular Model AI Selector */}
              <ModelSelector
                currentPrompt={promptGambar}
                onOpenSettings={onNavigateSettings}
              />

              {/* Negative Prompt (When supported by provider) */}
              {activeProviderConfig.capabilities.supportsNegativePrompt && (
                <div className="space-y-1.5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-200">
                      Negative Prompt
                    </label>
                    <span className="text-[10px] text-purple-400 font-semibold px-1.5 py-0.5 rounded bg-purple-950/60 border border-purple-500/30 font-mono">
                      Fitur Khusus {activeProviderConfig.displayName}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    placeholder="Contoh: blurry, low quality, deformed hands, extra text..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070d1a] border border-slate-700/80 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-xs text-white placeholder-slate-500 transition-all font-sans"
                  />
                </div>
              )}

              {/* Rasio */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-200">Rasio</label>
                <div className="flex items-center gap-2">
                  {(['9:16', '1:1', '16:9'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setSelectedRatio(r)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        selectedRatio === r
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                          : 'bg-[#070d1a] text-slate-400 border border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ukuran */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-200">Ukuran</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedSizeTier('medium')}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-medium transition-all truncate cursor-pointer ${
                      selectedSizeTier === 'medium'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                        : 'bg-[#070d1a] text-slate-400 border border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {getSizeLabel(selectedRatio, 'medium')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedSizeTier('large')}
                    className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-medium transition-all truncate cursor-pointer ${
                      selectedSizeTier === 'large'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                        : 'bg-[#070d1a] text-slate-400 border border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {getSizeLabel(selectedRatio, 'large')}
                  </button>
                </div>
              </div>

              {/* Jumlah Gambar */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-200">Jumlah Gambar</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setImgCount(n)}
                      className={`w-9 h-8 rounded-xl text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                        imgCount === n
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                          : 'bg-[#070d1a] text-slate-400 border border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Output Info */}
              <div className="pt-1">
                <p className="text-[11px] text-slate-400 font-mono">
                  5 × {imgCount} output
                </p>
              </div>

              {/* Generate Button */}
              <button
                type="button"
                disabled={isGenerating}
                onClick={handleGenerate}
                className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40 transition-all cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sedang Merender Visual...</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-4 h-4" />
                    <span>Generate • {5 * imgCount} kredit</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ================= RIGHT PREVIEW & GALLERY ================= */}
          <div className="flex-1 space-y-4 w-full">
            {/* Top Card: Preview Gambar */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#091122]/90 border border-slate-800/80 shadow-xl space-y-4">
              {/* Card Header */}
              <div className="flex items-center space-x-2 text-white">
                <Maximize2 className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs sm:text-sm font-bold tracking-tight font-heading">
                  Preview Gambar
                </h3>
              </div>

              {/* Preview Main Display */}
              {isGenerating ? (
                <div className="min-h-[340px] rounded-2xl bg-[#070d1a] border border-blue-500/30 flex flex-col items-center justify-center p-8 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 animate-pulse">
                    <RefreshCw className="w-7 h-7 animate-spin" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Merender Gambar AI...</h4>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Sedang memproses prompt dengan model <span className="text-blue-400 font-semibold">{activeProviderConfig.displayName}</span> pada resolusi {getSizeLabel(selectedRatio, selectedSizeTier)}.
                  </p>
                </div>
              ) : activePreview ? (
                /* High Fidelity Active Visual Preview */
                <div className="rounded-2xl bg-[#070d1a] border border-slate-800 overflow-hidden shadow-2xl space-y-3 p-4">
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                        {activePreview.model}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {activePreview.ratio} • {activePreview.size}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <button
                        type="button"
                        onClick={() => handleToggleFavorite(activePreview.id)}
                        className={`p-1.5 rounded-lg border text-xs cursor-pointer transition-colors ${
                          activePreview.isFavorite
                            ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                        }`}
                        title="Favoritkan"
                      >
                        <Heart className="w-3.5 h-3.5 fill-current" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCopyPrompt(activePreview.prompt)}
                        className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs cursor-pointer"
                        title="Salin Prompt"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (activePreview.imageUrl) {
                            const link = document.createElement('a');
                            link.href = activePreview.imageUrl;
                            link.download = `ai-image-${activePreview.id}.png`;
                            link.target = '_blank';
                            link.click();
                            onShowToast('Mengunduh visual...');
                          } else {
                            onShowToast('Visual HD siap diunduh!');
                          }
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Unduh HD</span>
                      </button>
                      {onNavigateToVideo && (
                        <button
                          type="button"
                          onClick={() => {
                            const img = activePreview.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';
                            onNavigateToVideo(img, activePreview.prompt);
                          }}
                          className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-indigo-950/40 transition-all"
                          title="Animasikan visual ini menjadi video AI (Seedance / Veo)"
                        >
                          <Film className="w-3.5 h-3.5" />
                          <span>Animasi Video</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Visual Render Container */}
                  <div
                    className={`relative rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center text-center p-4 transition-all ${
                      activePreview.ratio === '9:16'
                        ? 'min-h-[380px] max-w-sm mx-auto'
                        : activePreview.ratio === '1:1'
                        ? 'min-h-[340px] max-w-md mx-auto'
                        : 'min-h-[320px] w-full'
                    }`}
                    style={{
                      background: activePreview.imageUrl
                        ? '#030712'
                        : activePreview.svgType === 'cosmetic'
                        ? 'radial-gradient(circle at 50% 30%, #312e81 0%, #0f172a 70%, #020617 100%)'
                        : activePreview.svgType === 'portrait'
                        ? 'radial-gradient(circle at 60% 40%, #431407 0%, #1e1b4b 60%, #020617 100%)'
                        : activePreview.svgType === 'thumbnail'
                        ? 'radial-gradient(circle at 50% 50%, #064e3b 0%, #1e1b4b 50%, #030712 100%)'
                        : 'radial-gradient(circle at 50% 40%, #1e293b 0%, #0f172a 70%, #020617 100%)'
                    }}
                  >
                    {activePreview.imageUrl ? (
                      <div className="w-full flex items-center justify-center z-10">
                        <img
                          src={activePreview.imageUrl}
                          alt={activePreview.prompt}
                          className="w-full h-auto max-h-[520px] object-contain rounded-xl shadow-2xl border border-slate-800/80"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : (
                      /* Illustrated SVG Elements */
                      <div className="space-y-4 max-w-lg z-10">
                        <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 mx-auto flex items-center justify-center text-blue-300 shadow-2xl">
                          <Sparkles className="w-8 h-8 animate-pulse" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono tracking-widest uppercase text-blue-400 font-bold">
                            {activePreview.model}
                          </span>
                          <p className="text-xs text-slate-200 line-clamp-3 italic px-4 font-sans">
                            "{activePreview.prompt}"
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Ambient Glow */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
                  </div>
                </div>
              ) : (
                /* Empty / Initial State (Matches Screenshot 1) */
                <div className="min-h-[340px] rounded-2xl bg-[#070d1a] border border-slate-800/80 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-[#0e182e] border border-blue-600/30 flex items-center justify-center text-blue-400 mb-4 shadow-lg shadow-blue-950/40">
                    <ImageIcon className="w-7 h-7" />
                  </div>

                  <h4 className="text-sm sm:text-base font-bold text-white tracking-tight">
                    Mulai Buat Visual Anda
                  </h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed mt-2">
                    Tulis deskripsi atau unggah referensi untuk membuat gambar berkualitas tinggi.
                    Kamu bisa langsung generate lagi tanpa menunggu hasil sebelumnya selesai.
                  </p>

                  {/* Preset Buttons */}
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
                    <button
                      type="button"
                      onClick={() => handleApplyPreset('Poster Produk')}
                      className="px-3.5 py-1.5 rounded-xl bg-[#0a1428] border border-slate-800 text-slate-300 hover:text-white hover:border-blue-500 hover:bg-blue-600/10 text-xs font-medium transition-all cursor-pointer"
                    >
                      Poster Produk
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyPreset('Foto Realistis')}
                      className="px-3.5 py-1.5 rounded-xl bg-[#0a1428] border border-slate-800 text-slate-300 hover:text-white hover:border-blue-500 hover:bg-blue-600/10 text-xs font-medium transition-all cursor-pointer"
                    >
                      Foto Realistis
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyPreset('Thumbnail YouTube')}
                      className="px-3.5 py-1.5 rounded-xl bg-[#0a1428] border border-slate-800 text-slate-300 hover:text-white hover:border-blue-500 hover:bg-blue-600/10 text-xs font-medium transition-all cursor-pointer"
                    >
                      Thumbnail YouTube
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyPreset('Karakter Anime')}
                      className="px-3.5 py-1.5 rounded-xl bg-[#0a1428] border border-slate-800 text-slate-300 hover:text-white hover:border-blue-500 hover:bg-blue-600/10 text-xs font-medium transition-all cursor-pointer"
                    >
                      Karakter Anime
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Card: Hasil Saya */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#091122]/90 border border-slate-800/80 shadow-xl space-y-3.5">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-white">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <h3 className="text-xs sm:text-sm font-bold tracking-tight font-heading">
                    Hasil Saya ({libraryItems.length})
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsLibraryCollapsed(!isLibraryCollapsed)}
                  className="text-xs text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                >
                  {isLibraryCollapsed ? 'Tampilkan' : 'Sembunyikan'}
                </button>
              </div>

              {!isLibraryCollapsed && (
                <>
                  {/* Filter Pills */}
                  <div className="flex items-center gap-1.5">
                    {[
                      { id: 'semua', label: 'Semua' },
                      { id: 'favorit', label: 'Favorit' },
                      { id: 'hari-ini', label: 'Hari Ini' },
                      { id: 'minggu-ini', label: 'Minggu Ini' }
                    ].map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setLibraryFilter(f.id as any)}
                        className={`px-3 py-1 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                          libraryFilter === f.id
                            ? 'bg-blue-600 text-white shadow-sm'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {/* Empty or Grid State */}
                  {filteredLibrary.length === 0 ? (
                    <div className="py-12 rounded-xl bg-[#070d1a] border border-slate-800/80 text-center flex flex-col items-center justify-center space-y-2">
                      <Clock className="w-6 h-6 text-slate-600" />
                      <p className="text-xs text-slate-500">
                        Belum ada hasil. Generate gambar untuk mulai mengisi library kamu.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 pt-1">
                      {filteredLibrary.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setActivePreview(item)}
                          className={`p-3 rounded-xl bg-[#070d1a] border transition-all cursor-pointer group hover:border-blue-500/70 ${
                            activePreview?.id === item.id
                              ? 'border-blue-500 ring-1 ring-blue-500'
                              : 'border-slate-800'
                          }`}
                        >
                          <div
                            className="h-28 rounded-lg overflow-hidden relative flex items-center justify-center mb-2 bg-[#020617]"
                            style={{ background: item.imageUrl ? '#020617' : item.colorScheme }}
                          >
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.prompt}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="text-center p-2">
                                <ImageIcon className="w-6 h-6 text-blue-300 mx-auto mb-1 opacity-80" />
                                <span className="text-[9px] font-mono text-slate-300 px-2 line-clamp-1">
                                  {item.prompt}
                                </span>
                              </div>
                            )}
                            <div className="absolute top-1 right-1 flex gap-1">
                              {onNavigateToVideo && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const img = item.imageUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80';
                                    onNavigateToVideo(img, item.prompt);
                                  }}
                                  className="p-1 rounded bg-black/60 text-slate-300 hover:text-indigo-400 hover:bg-black/80 transition-colors"
                                  title="Animasikan Gambar ke Video AI"
                                >
                                  <Film className="w-3 h-3" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleFavorite(item.id);
                                }}
                                className="p-1 rounded bg-black/60 text-slate-300 hover:text-rose-400"
                              >
                                <Heart className={`w-3 h-3 ${item.isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                              </button>
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="font-bold text-blue-400 truncate">{item.model}</span>
                              <span className="text-slate-500 font-mono">{item.ratio}</span>
                            </div>
                            <p className="text-[11px] text-slate-300 line-clamp-2 leading-tight">
                              {item.prompt}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. BUAT MASCOT TAB */}
      {activeTab === 'gambar-mascot' && (
        <div className="flex flex-col lg:flex-row gap-5 items-start">
          {/* ================= LEFT CONTROLS (Buat Mascot) ================= */}
          <div className="w-full lg:w-[380px] xl:w-[410px] shrink-0 space-y-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#091122]/90 border border-slate-800/80 space-y-3.5 shadow-xl">
              {/* Header */}
              <div className="flex items-center space-x-2 text-white">
                <Bot className="w-4 h-4 text-blue-400" />
                <h2 className="text-xs sm:text-sm font-bold tracking-tight font-heading">
                  Gambar Kreatif — Buat Mascot
                </h2>
              </div>

              {/* Nama Maskot * */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-200">
                  Nama Maskot <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={mascotName}
                  onChange={(e) => setMascotName(e.target.value)}
                  placeholder="mis. Koko si Rubah"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070d1a] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500/80 transition-all"
                />
              </div>

              {/* Kategori Maskot */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-200">Kategori Maskot</label>
                <div className="relative">
                  <select
                    value={mascotCategory}
                    onChange={(e) => setMascotCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070d1a] border border-slate-800 text-xs text-white appearance-none cursor-pointer focus:outline-none focus:border-blue-500/80 transition-all pr-9"
                  >
                    <option value="Hewan">Hewan</option>
                    <option value="Robot">Robot</option>
                    <option value="Makanan">Makanan</option>
                    <option value="Monster">Monster</option>
                    <option value="Objek / Benda">Objek / Benda</option>
                    <option value="Manusia">Manusia</option>
                    <option value="Mitologi / Fantasi">Mitologi / Fantasi</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Vibes & Gaya Desain */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-200">Vibes & Gaya Desain</label>
                <div className="relative">
                  <select
                    value={mascotStyle}
                    onChange={(e) => setMascotStyle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070d1a] border border-slate-800 text-xs text-white appearance-none cursor-pointer focus:outline-none focus:border-blue-500/80 transition-all pr-9"
                  >
                    <option value="3D Pixar">3D Pixar</option>
                    <option value="Clay / Claymation">Clay / Claymation</option>
                    <option value="Anime Chibi">Anime Chibi</option>
                    <option value="Flat Vector Modern">Flat Vector Modern</option>
                    <option value="Retro Cartoon 90s">Retro Cartoon 90s</option>
                    <option value="3D Hyper-Realistic">3D Hyper-Realistic</option>
                    <option value="Cyberpunk Tech">Cyberpunk Tech</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Deskripsi (opsional) */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-200">
                  Deskripsi <span className="text-slate-500 font-normal">(opsional)</span>
                </label>
                <textarea
                  rows={3}
                  value={mascotDesc}
                  onChange={(e) => setMascotDesc(e.target.value)}
                  placeholder="Ciri khas, warna, ekspresi, atribut brand..."
                  className="w-full p-3 rounded-xl bg-[#070d1a] border border-slate-800 text-xs text-white placeholder-slate-500 resize-none focus:outline-none focus:border-blue-500/80 leading-relaxed transition-all"
                />
              </div>

              {/* Latar Belakang */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-200">Latar Belakang</label>
                <div className="relative">
                  <select
                    value={mascotBg}
                    onChange={(e) => setMascotBg(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070d1a] border border-slate-800 text-xs text-white appearance-none cursor-pointer focus:outline-none focus:border-blue-500/80 transition-all pr-9"
                  >
                    <option value="Solid">Solid</option>
                    <option value="Studio Lighting">Studio Lighting</option>
                    <option value="Transparan / PNG Cutout">Transparan / PNG Cutout</option>
                    <option value="Gradient Minimalis">Gradient Minimalis</option>
                    <option value="Outdoor / Alam">Outdoor / Alam</option>
                    <option value="Pemandangan Kota">Pemandangan Kota</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Aspect Ratio */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-200">Aspect Ratio</label>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {(['1:1', '9:16', '16:9', '2:3', '3:4', '4:3'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setMascotRatio(r)}
                      className={`py-1.5 px-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        mascotRatio === r
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                          : 'bg-[#070d1a] text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Jumlah Gambar */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-200">Jumlah Gambar</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setMascotCount(n)}
                      className={`w-9 h-8 rounded-xl text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                        mascotCount === n
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                          : 'bg-[#070d1a] text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Output Info */}
              <div className="pt-0.5">
                <p className="text-[11px] text-slate-400 font-mono">
                  5 × {mascotCount} output
                </p>
              </div>

              {/* Action Button */}
              <button
                type="button"
                disabled={isGeneratingMascot}
                onClick={handleGenerateMascot}
                className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40 transition-all cursor-pointer"
              >
                {isGeneratingMascot ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sedang Merancang Maskot...</span>
                  </>
                ) : (
                  <>
                    <Bot className="w-4 h-4" />
                    <span>Buat Mascot • {5 * mascotCount} kredit</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ================= RIGHT PREVIEW & RESULTS (Hasil Maskot) ================= */}
          <div className="flex-1 space-y-4 w-full">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#091122]/90 border border-slate-800/80 shadow-xl space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-white">
                  <Maximize2 className="w-4 h-4 text-blue-400" />
                  <h3 className="text-xs sm:text-sm font-bold tracking-tight font-heading">
                    Hasil Maskot
                  </h3>
                </div>
                {mascotResults.length > 0 && (
                  <span className="text-[11px] font-mono text-slate-400 bg-[#070d1a] border border-slate-800 px-2.5 py-0.5 rounded-lg">
                    {mascotResults.length} Tersedia
                  </span>
                )}
              </div>

              {/* Content */}
              {isGeneratingMascot ? (
                <div className="min-h-[380px] lg:min-h-[440px] rounded-2xl bg-[#070d1a] border border-slate-800/80 flex flex-col items-center justify-center p-8 text-center space-y-3">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-3xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 animate-pulse shadow-lg shadow-blue-950/40">
                      <Bot className="w-8 h-8 animate-bounce" />
                    </div>
                  </div>
                  <h4 className="text-sm font-bold text-white tracking-tight">
                    Sedang Merancang Karakter Maskot...
                  </h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    AI sedang mengolah bentuk karakter 3D, ekspresi wajah, dan pencahayaan studio sesuai preferensi Anda.
                  </p>
                </div>
              ) : activeMascot ? (
                <div className="space-y-4">
                  {/* Active Mascot Display */}
                  <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#0b162c] to-[#060b16] border border-slate-800/80 shadow-2xl flex flex-col items-center justify-center p-6 sm:p-10 min-h-[360px]">
                    {/* Top action bar */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-600/80 text-white backdrop-blur-md">
                          {activeMascot.style}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-medium bg-black/60 text-slate-300 backdrop-blur-md">
                          {activeMascot.category}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-black/60 text-slate-400 backdrop-blur-md">
                          {activeMascot.ratio}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleFavoriteMascot(activeMascot.id)}
                          className={`p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer ${
                            activeMascot.isFavorite
                              ? 'bg-rose-500/20 border border-rose-500/40 text-rose-400'
                              : 'bg-black/60 border border-slate-700/60 text-slate-300 hover:text-white hover:bg-black/80'
                          }`}
                          title="Favorit"
                        >
                          <Heart className={`w-3.5 h-3.5 ${activeMascot.isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopyPrompt(activeMascot.prompt)}
                          className="p-2 rounded-xl bg-black/60 border border-slate-700/60 text-slate-300 hover:text-white hover:bg-black/80 backdrop-blur-md transition-all cursor-pointer"
                          title="Salin Prompt"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onShowToast(`Mengunduh maskot ${activeMascot.name} (HD)...`)}
                          className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-900/40 backdrop-blur-md transition-all cursor-pointer"
                          title="Unduh HD"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Stylized Mascot Art Vector */}
                    <div className="w-44 h-44 sm:w-56 sm:h-56 relative flex items-center justify-center my-4">
                      {/* Ambient back glow */}
                      <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-3xl" />

                      <svg viewBox="0 0 200 200" className="w-full h-full relative drop-shadow-[0_15px_25px_rgba(0,0,0,0.6)]">
                        <defs>
                          <linearGradient id="mascotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#38bdf8" />
                            <stop offset="50%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#1d4ed8" />
                          </linearGradient>
                          <linearGradient id="eyeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#ffffff" />
                            <stop offset="100%" stopColor="#93c5fd" />
                          </linearGradient>
                          <filter id="softGlow">
                            <feGaussianBlur stdDeviation="3" result="glow" />
                            <feComposite in="SourceGraphic" in2="glow" operator="over" />
                          </filter>
                        </defs>

                        {/* Head */}
                        <rect x="35" y="45" width="130" height="110" rx="35" fill="url(#mascotGrad)" />

                        {/* Antennas / Ears */}
                        <path d="M70 45 L50 20" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" />
                        <circle cx="50" cy="20" r="8" fill="#60a5fa" />
                        <path d="M130 45 L150 20" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" />
                        <circle cx="150" cy="20" r="8" fill="#60a5fa" />

                        {/* Face Screen */}
                        <rect x="50" y="60" width="100" height="75" rx="22" fill="#0f172a" stroke="#1e293b" strokeWidth="3" />

                        {/* Eyes */}
                        <ellipse cx="78" cy="95" rx="14" ry="17" fill="url(#eyeGrad)" filter="url(#softGlow)" />
                        <circle cx="82" cy="90" r="5" fill="#0f172a" />
                        <circle cx="75" cy="88" r="2.5" fill="#ffffff" />

                        <ellipse cx="122" cy="95" rx="14" ry="17" fill="url(#eyeGrad)" filter="url(#softGlow)" />
                        <circle cx="126" cy="90" r="5" fill="#0f172a" />
                        <circle cx="119" cy="88" r="2.5" fill="#ffffff" />

                        {/* Cute Smile */}
                        <path d="M92 114 Q100 123 108 114" stroke="#60a5fa" strokeWidth="3.5" fill="none" strokeLinecap="round" />

                        {/* Cheeks */}
                        <circle cx="65" cy="110" r="6" fill="#f43f5e" opacity="0.6" />
                        <circle cx="135" cy="110" r="6" fill="#f43f5e" opacity="0.6" />
                      </svg>
                    </div>

                    {/* Bottom overlay info */}
                    <div className="text-center mt-2 space-y-1">
                      <h4 className="text-base font-bold text-white tracking-wide font-heading">
                        {activeMascot.name}
                      </h4>
                      <p className="text-xs text-slate-400 max-w-md line-clamp-1">
                        {activeMascot.desc || `${activeMascot.category} • ${activeMascot.style} • Latar ${activeMascot.bg}`}
                      </p>
                    </div>
                  </div>

                  {/* Prompt Box */}
                  <div className="p-3.5 rounded-xl bg-[#070d1a] border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Master Prompt AI
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyPrompt(activeMascot.prompt)}
                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Salin Prompt</span>
                      </button>
                    </div>
                    <p className="text-xs text-slate-300 font-mono leading-relaxed bg-[#050811] p-3 rounded-lg border border-slate-800/80">
                      {activeMascot.prompt}
                    </p>
                  </div>

                  {/* Gallery if multiple mascots */}
                  {mascotResults.length > 1 && (
                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <h5 className="text-xs font-bold text-slate-300">Variasi Maskot Lainnya</h5>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {mascotResults.map((m) => (
                          <div
                            key={m.id}
                            onClick={() => setActiveMascot(m)}
                            className={`p-2.5 rounded-xl border transition-all cursor-pointer text-left space-y-1.5 ${
                              activeMascot.id === m.id
                                ? 'bg-blue-900/20 border-blue-500'
                                : 'bg-[#070d1a] border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            <div className="w-full h-16 rounded-lg bg-[#0c162d] flex items-center justify-center text-blue-400">
                              <Bot className="w-7 h-7" />
                            </div>
                            <p className="text-xs font-bold text-white truncate">{m.name}</p>
                            <p className="text-[10px] text-slate-400 truncate">{m.style} • {m.ratio}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Empty / Initial State (Matches Screenshot exactly) */
                <div className="min-h-[380px] lg:min-h-[440px] rounded-2xl bg-[#070d1a] border border-slate-800/80 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-12 h-12 flex items-center justify-center text-slate-600 mb-2">
                    <Bot className="w-9 h-9" />
                  </div>

                  <h4 className="text-sm font-bold text-slate-300 tracking-tight">
                    Belum ada maskot
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Hasil generate akan muncul di sini
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. BUAT BANNER TAB (Exact Match to User Screenshots) */}
      {activeTab === 'gambar-banner' && (
        <div className="flex flex-col lg:flex-row gap-5 items-start">
          {/* ================= LEFT CONTROLS (Buat Banner) ================= */}
          <div className="w-full lg:w-[380px] xl:w-[410px] shrink-0 space-y-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-[#091122]/90 border border-slate-800/80 space-y-3.5 shadow-xl">
              {/* Header */}
              <div className="flex items-center space-x-2 text-white">
                <ImagePlus className="w-4 h-4 text-blue-400" />
                <h2 className="text-xs sm:text-sm font-bold tracking-tight font-heading">
                  Buat Banner
                </h2>
              </div>

              {/* Gambar Utama * */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-200">
                  Gambar Utama <span className="text-red-500">*</span>
                </label>
                <div
                  onClick={() => bannerFileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-800 hover:border-blue-500/80 rounded-2xl p-5 text-center cursor-pointer transition-all bg-[#070d1a] hover:bg-[#070d1a]/80 group relative overflow-hidden"
                >
                  <input
                    type="file"
                    ref={bannerFileInputRef}
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleUploadBannerMainImage}
                    className="hidden"
                  />
                  {bannerMainImage ? (
                    <div className="relative flex flex-col items-center">
                      <img
                        src={bannerMainImage}
                        alt="Preview Gambar Utama"
                        className="max-h-28 rounded-lg object-contain border border-slate-700 shadow-md"
                      />
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-[11px] text-blue-400 font-medium">Klik untuk ganti gambar</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setBannerMainImage(null);
                          }}
                          className="p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-1.5 py-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-slate-500 group-hover:text-blue-400 transition-colors">
                        <Upload className="w-5 h-5 stroke-[1.5]" />
                      </div>
                      <p className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors">
                        Klik untuk upload gambar
                      </p>
                      <p className="text-[10px] text-slate-500">
                        JPG, PNG, atau WEBP • maks 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Gaya Design (Custom Dropdown matching Screenshots 1, 2, 3) */}
              <div className="space-y-1 relative" ref={bannerDropdownRef}>
                <label className="block text-xs font-bold text-slate-200">Gaya Design</label>

                {/* Selector button */}
                <button
                  type="button"
                  onClick={() => setIsBannerStyleOpen((prev) => !prev)}
                  className={`w-full px-3 py-2 rounded-xl bg-[#070d1a] border text-xs text-white flex items-center justify-between cursor-pointer transition-all ${
                    isBannerStyleOpen
                      ? 'border-blue-500/90 shadow-sm shadow-blue-900/30'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {(() => {
                      const cur = BANNER_DESIGN_STYLES.find((s) => s.name === selectedBannerStyle) || BANNER_DESIGN_STYLES[0];
                      return (
                        <>
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${cur.badgeBg} ${cur.iconColor}`}>
                            {renderBannerStyleIcon(cur.iconType)}
                          </div>
                          <span className="font-semibold text-white text-xs sm:text-sm">{cur.name}</span>
                        </>
                      );
                    })()}
                  </div>
                  {isBannerStyleOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {/* Dropdown Options (Exact match to Screenshots 2 & 3) */}
                {isBannerStyleOpen && (
                  <div className="absolute top-[calc(100%+4px)] left-0 right-0 z-30 bg-[#091122] border border-slate-800 rounded-xl p-1 shadow-2xl space-y-0.5 max-h-64 overflow-y-auto custom-scrollbar backdrop-blur-md">
                    {BANNER_DESIGN_STYLES.map((st) => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => {
                          setSelectedBannerStyle(st.name);
                          setIsBannerStyleOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
                          selectedBannerStyle === st.name
                            ? 'bg-blue-600/20 text-blue-300 border border-blue-500/30'
                            : 'text-slate-200 hover:bg-slate-800/60'
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${st.badgeBg} ${st.iconColor}`}>
                          {renderBannerStyleIcon(st.iconType)}
                        </div>
                        <span className="text-[13px]">{st.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Teks Banner (opsional) */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-200">
                  Teks Banner <span className="text-slate-500 font-normal">(opsional)</span>
                </label>
                <textarea
                  rows={3}
                  value={bannerText}
                  onChange={(e) => setBannerText(e.target.value)}
                  placeholder="mis. DISKON 50% — Belanja Sekarang!"
                  className="w-full p-3 rounded-xl bg-[#070d1a] border border-slate-800 text-xs text-white placeholder-slate-500 resize-none focus:outline-none focus:border-blue-500/80 leading-relaxed transition-all"
                />
              </div>

              {/* Ratio */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-200">Ratio</label>
                <div className="flex items-center gap-1.5">
                  {(['1:1', '9:16', '16:9'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setBannerRatio(r)}
                      className={`py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        bannerRatio === r
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                          : 'bg-[#070d1a] text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Jumlah Foto */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-200">Jumlah Foto</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setBannerCount(n)}
                      className={`w-9 h-8 rounded-xl text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
                        bannerCount === n
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                          : 'bg-[#070d1a] text-slate-400 border border-slate-800 hover:bg-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Output Info */}
              <div className="pt-0.5">
                <p className="text-[11px] text-slate-400 font-mono">
                  2 × {bannerCount} output
                </p>
              </div>

              {/* Action Button */}
              <button
                type="button"
                disabled={isGeneratingBanner}
                onClick={handleGenerateBanner}
                className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-900/40 transition-all cursor-pointer"
              >
                {isGeneratingBanner ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sedang Merancang Banner...</span>
                  </>
                ) : (
                  <>
                    <ImagePlus className="w-4 h-4" />
                    <span>Buat Banner • ≈{2 * bannerCount} kredit</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ================= RIGHT PREVIEW & RESULTS ================= */}
          <div className="flex-1 space-y-4 w-full">
            {/* 1. HASIL BANNER PANEL */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#091122]/90 border border-slate-800/80 shadow-xl space-y-3.5">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-white">
                  <ImagePlus className="w-4 h-4 text-blue-400" />
                  <h3 className="text-xs sm:text-sm font-bold tracking-tight font-heading">
                    Hasil Banner
                  </h3>
                </div>
              </div>

              {/* Content Box */}
              {isGeneratingBanner ? (
                <div className="min-h-[220px] rounded-2xl bg-[#070d1a] border border-slate-800/80 flex flex-col items-center justify-center p-8 text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/30 flex items-center justify-center text-blue-400 animate-pulse">
                    <ImagePlus className="w-6 h-6 animate-bounce" />
                  </div>
                  <h4 className="text-sm font-bold text-white tracking-tight">
                    Sedang Membuat Desain Banner...
                  </h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                    AI sedang mengombinasikan visual utama, tipografi promosi, dan gaya {selectedBannerStyle}.
                  </p>
                </div>
              ) : currentBanner ? (
                <div className="space-y-3">
                  <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#0c162d] via-[#080e1d] to-[#040811] border border-slate-800 p-5 sm:p-6 shadow-2xl flex flex-col items-center justify-center">
                    {/* Top action bar */}
                    <div className="w-full flex items-center justify-between mb-4 z-10">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-600/80 text-white backdrop-blur-md">
                          {currentBanner.style}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-black/60 text-slate-400 backdrop-blur-md">
                          {currentBanner.ratio}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleFavoriteBanner(currentBanner.id)}
                          className={`p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer ${
                            currentBanner.isFavorite
                              ? 'bg-rose-500/20 border border-rose-500/40 text-rose-400'
                              : 'bg-black/60 border border-slate-700/60 text-slate-300 hover:text-white'
                          }`}
                          title="Favorit"
                        >
                          <Heart className={`w-3.5 h-3.5 ${currentBanner.isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopyPrompt(currentBanner.prompt)}
                          className="p-2 rounded-xl bg-black/60 border border-slate-700/60 text-slate-300 hover:text-white backdrop-blur-md transition-all cursor-pointer"
                          title="Salin Prompt"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onShowToast('Mengunduh banner resolusi tinggi...')}
                          className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-900/40 backdrop-blur-md transition-all cursor-pointer"
                          title="Unduh Banner HD"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Banner Graphic Canvas Preview */}
                    <div
                      className={`w-full max-w-lg rounded-xl overflow-hidden border border-slate-700/60 shadow-2xl relative flex flex-col justify-between p-6 ${
                        currentBanner.style === 'Modern Gradient'
                          ? 'bg-gradient-to-r from-fuchsia-900/70 via-purple-900/60 to-slate-900'
                          : currentBanner.style === 'Elegan / Luxury'
                          ? 'bg-gradient-to-br from-amber-950/80 via-slate-900 to-black border-amber-500/30'
                          : currentBanner.style === 'Bold Promo / Diskon'
                          ? 'bg-gradient-to-r from-rose-950/90 via-red-900/70 to-slate-900'
                          : currentBanner.style === 'Korean Soft / Pastel'
                          ? 'bg-gradient-to-r from-pink-950/70 via-purple-950/50 to-slate-900'
                          : currentBanner.style === '3D Render'
                          ? 'bg-gradient-to-br from-cyan-950/80 via-blue-950/60 to-slate-950'
                          : 'bg-gradient-to-br from-slate-900 via-[#0a1224] to-[#040812]'
                      }`}
                      style={{
                        aspectRatio: currentBanner.ratio === '16:9' ? '16/9' : currentBanner.ratio === '9:16' ? '9/16' : '1/1',
                        maxHeight: '380px'
                      }}
                    >
                      {/* Decorative Elements */}
                      <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

                      {/* Header in banner */}
                      <div className="flex items-center justify-between z-10">
                        <span className="px-3 py-1 rounded-full bg-white/10 text-white backdrop-blur-md font-bold text-[11px] tracking-wider uppercase border border-white/15">
                          {currentBanner.style}
                        </span>
                        <span className="text-[10px] text-white/70 font-mono">
                          HD READY • 4K
                        </span>
                      </div>

                      {/* Middle Visual / Product Image */}
                      <div className="my-auto py-3 flex items-center justify-center gap-4 z-10">
                        {currentBanner.image && (
                          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-black/40 border border-white/15 shadow-xl shrink-0">
                            <img
                              src={currentBanner.image}
                              alt="Product"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="text-left space-y-1 max-w-[240px]">
                          <p className="text-[11px] font-semibold text-blue-400 uppercase tracking-wide">
                            Penawaran Terbatas
                          </p>
                          <h4 className="text-base sm:text-lg font-black text-white font-heading leading-tight drop-shadow-md">
                            {currentBanner.text}
                          </h4>
                          <p className="text-[11px] text-slate-300 line-clamp-2">
                            Dapatkan visual campaign terbaik dengan AI studio otomatis.
                          </p>
                        </div>
                      </div>

                      {/* Footer CTA in banner */}
                      <div className="flex items-center justify-between z-10 pt-2 border-t border-white/10">
                        <span className="text-[10px] text-slate-300">
                          suga.ai / marketing-banner
                        </span>
                        <span className="px-3 py-1 rounded-lg bg-blue-600 text-white text-[11px] font-bold shadow-md shadow-blue-900/40">
                          Beli Sekarang &rarr;
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Empty State (Matches Screenshot 1 exactly) */
                <div className="min-h-[200px] rounded-2xl bg-[#070d1a] border border-slate-800/80 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-12 h-12 flex items-center justify-center text-slate-600 mb-2">
                    <ImagePlus className="w-8 h-8 stroke-[1.2]" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-300 tracking-tight">
                    Belum ada banner
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Hasil generate akan muncul di sini
                  </p>
                </div>
              )}
            </div>

            {/* 2. RIWAYAT BANNER PANEL */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#091122]/90 border border-slate-800/80 shadow-xl space-y-3.5">
              {/* Header */}
              <div className="flex items-center space-x-2 text-white">
                <Clock className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs sm:text-sm font-bold tracking-tight font-heading">
                  Riwayat Banner
                </h3>
              </div>

              {/* Content Box */}
              {bannerHistory.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {bannerHistory.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setCurrentBanner(item)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer text-left space-y-2 ${
                        currentBanner?.id === item.id
                          ? 'bg-blue-950/30 border-blue-500/70'
                          : 'bg-[#070d1a] border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-blue-400">{item.style}</span>
                        <span className="text-slate-500 font-mono">{item.time}</span>
                      </div>
                      <p className="text-xs font-semibold text-white truncate">{item.text}</p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>Ratio: {item.ratio}</span>
                        <span>{item.cost} kredit</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* Empty State (Matches Screenshot 1 exactly) */
                <div className="min-h-[190px] rounded-2xl bg-[#070d1a] border border-slate-800/80 flex flex-col items-center justify-center p-8 text-center">
                  <div className="w-12 h-12 flex items-center justify-center text-slate-600 mb-2">
                    <Clock className="w-8 h-8 stroke-[1.2]" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-300 tracking-tight">
                    Belum ada riwayat banner
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Banner yang kamu buat akan tersimpan di sini
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. BUAT INFOGRAFIS TAB (Matches user screenshots 1-4) */}
      {activeTab === 'gambar-infografis' && (() => {
        const activeInfoStyleObj =
          INFOGRAFIS_VISUAL_STYLES.find((s) => s.name === selectedInfoStyle) || INFOGRAFIS_VISUAL_STYLES[0];

        // Format points from topic
        const topicPoints = infoTopic
          ? infoTopic
              .split('\n')
              .map((line) => line.trim())
              .filter((line) => line.length > 0)
          : [
              '1. Tinggi kandungan Vitamin B6',
              '2. 487 mg Potasium per buah',
              '3. Menjaga energi & kesehatan otot',
              '4. Alami, kaya serat larut'
            ];

        return (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* LEFT CONTROL PANEL (Infografis) */}
            <div className="lg:col-span-4 p-4 sm:p-5 rounded-2xl bg-[#091122]/90 border border-slate-800/80 shadow-xl space-y-4">
              {/* Header */}
              <div className="flex items-center space-x-2 text-white">
                <BarChart3 className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs sm:text-sm font-bold tracking-tight font-heading">
                  Infografis
                </h3>
              </div>

              {/* Gambar Referensi (opsional) */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-400">
                  Gambar Referensi <span className="text-slate-500 font-normal">(opsional)</span>
                </label>
                <input
                  type="file"
                  ref={infoFileInputRef}
                  onChange={handleUploadInfoRef}
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                />
                {infoRefImage ? (
                  <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-black/40 group">
                    <img
                      src={infoRefImage}
                      alt="Referensi"
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => infoFileInputRef.current?.click()}
                        className="px-2.5 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
                      >
                        Ganti
                      </button>
                      <button
                        type="button"
                        onClick={() => setInfoRefImage(null)}
                        className="px-2.5 py-1 text-xs bg-rose-600 text-white rounded-lg hover:bg-rose-500 transition-colors"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => infoFileInputRef.current?.click()}
                    className="border border-dashed border-slate-700/80 hover:border-slate-500 bg-[#060b16] rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
                  >
                    <Upload className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors mb-2 stroke-[1.5]" />
                    <p className="text-xs font-semibold text-slate-300">
                      Klik untuk upload referensi
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Logo, produk, atau contoh layout • maks 10MB
                    </p>
                  </div>
                )}
              </div>

              {/* Topik / Data * */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300">
                  Topik / Data <span className="text-rose-500">*</span>
                </label>
                <div className="space-y-1">
                  <textarea
                    value={infoTopic}
                    onChange={(e) => setInfoTopic(e.target.value.slice(0, 2000))}
                    placeholder={`mis. 5 fakta menarik tentang pisang\n1. Tinggi vitamin B6\n2. 487 mg potasium per buah\n...`}
                    rows={4}
                    className="w-full bg-[#060b16] border border-slate-700/80 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none font-sans leading-relaxed"
                  />
                  <div className="flex items-center justify-between text-[10px] text-slate-500 px-0.5">
                    <span>Tulis poin/angka biar datanya akurat</span>
                    <span className="font-mono">{infoTopic.length}/2000</span>
                  </div>
                </div>
              </div>

              {/* Gaya Visual (Dropdown Selector) */}
              <div className="space-y-1.5 relative" ref={infoDropdownRef}>
                <label className="text-[11px] font-semibold text-slate-300">
                  Gaya Visual
                </label>
                <button
                  type="button"
                  onClick={() => setIsInfoStyleOpen(!isInfoStyleOpen)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl bg-[#060b16] border transition-all text-left cursor-pointer ${
                    isInfoStyleOpen
                      ? 'border-blue-500 ring-2 ring-blue-500/20'
                      : 'border-slate-700/80 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center min-w-0 pr-2">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${activeInfoStyleObj.badgeBg} ${activeInfoStyleObj.iconColor}`}
                    >
                      {renderInfoStyleIcon(activeInfoStyleObj.iconType)}
                    </div>
                    <div className="ml-2.5 min-w-0">
                      <p className="text-xs font-bold text-white tracking-tight">
                        {activeInfoStyleObj.name}
                      </p>
                      <p className="text-[10px] text-slate-400 truncate">
                        {activeInfoStyleObj.subtitle}
                      </p>
                    </div>
                  </div>
                  {isInfoStyleOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {/* Dropdown Menu Options (Screenshots 2 & 3) */}
                {isInfoStyleOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#0a1224] border border-slate-700/80 rounded-xl shadow-2xl z-50 py-1 max-h-[320px] overflow-y-auto custom-scrollbar">
                    {INFOGRAFIS_VISUAL_STYLES.map((style) => {
                      const isSelected = selectedInfoStyle === style.name;
                      return (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => {
                            setSelectedInfoStyle(style.name);
                            setIsInfoStyleOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 text-left transition-colors cursor-pointer ${
                            isSelected ? 'bg-blue-950/40 text-white' : 'hover:bg-slate-800/50 text-slate-200'
                          }`}
                        >
                          <div className="flex items-center min-w-0 pr-2">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${style.badgeBg} ${style.iconColor}`}
                            >
                              {renderInfoStyleIcon(style.iconType)}
                            </div>
                            <div className="ml-2.5 min-w-0">
                              <p className="text-xs font-semibold text-white tracking-tight">
                                {style.name}
                              </p>
                              <p className="text-[10px] text-slate-400 truncate">
                                {style.subtitle}
                              </p>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-blue-400 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Skema Warna */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300">
                  Skema Warna
                </label>
                <div className="grid grid-cols-2 gap-2 bg-[#060b16] p-1 rounded-xl border border-slate-700/80">
                  <button
                    type="button"
                    onClick={() => setInfoColorMode('Auto')}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      infoColorMode === 'Auto'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Auto</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setInfoColorMode('Manual')}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      infoColorMode === 'Manual'
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-900/30'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Manual</span>
                  </button>
                </div>
                {infoColorMode === 'Auto' ? (
                  <p className="text-[10px] text-slate-500 leading-normal">
                    AI memilih palet yang paling cocok dengan topik dan gaya visual.
                  </p>
                ) : (
                  <div className="grid grid-cols-3 gap-1.5 pt-1">
                    {['Biru Korporat', 'Emerald Fresh', 'Warm Sunset', 'Cyber Neon', 'Pastel Ceria', 'Monokrom'].map((palette) => (
                      <button
                        key={palette}
                        type="button"
                        onClick={() => setInfoManualPalette(palette)}
                        className={`text-[10px] py-1 px-1.5 rounded-lg border text-center transition-all truncate ${
                          infoManualPalette === palette
                            ? 'bg-blue-950/60 border-blue-500 text-blue-300 font-semibold'
                            : 'bg-[#060b16] border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {palette}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Ratio */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-400">
                  Ratio
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['1:1', '9:16', '16:9'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setInfoRatio(r)}
                      className={`py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                        infoRatio === r
                          ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-900/30'
                          : 'bg-[#060b16] border-slate-700/80 text-slate-400 hover:text-white hover:border-slate-600'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-400">
                  Quality
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Low', 'Medium'] as const).map((q) => (
                    <button
                      key={q}
                      type="button"
                      onClick={() => setInfoQuality(q)}
                      className={`py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                        infoQuality === q
                          ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-900/30'
                          : 'bg-[#060b16] border-slate-700/80 text-slate-400 hover:text-white hover:border-slate-600'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ukuran */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-400">
                  Ukuran
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Small', 'Medium', 'Large'] as const).map((u) => (
                    <button
                      key={u}
                      type="button"
                      onClick={() => setInfoSizeTier(u)}
                      className={`py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                        infoSizeTier === u
                          ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-900/30'
                          : 'bg-[#060b16] border-slate-700/80 text-slate-400 hover:text-white hover:border-slate-600'
                      }`}
                    >
                      {u}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500">
                  Sisi terpanjang ±{infoSizeTier === 'Small' ? '1024' : infoSizeTier === 'Medium' ? '2048' : '4096'} px.
                </p>
              </div>

              {/* Jumlah Foto */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-400">
                  Jumlah Foto
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setInfoCount(num)}
                      className={`py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                        infoCount === num
                          ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-900/30'
                          : 'bg-[#060b16] border-slate-700/80 text-slate-400 hover:text-white hover:border-slate-600'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Kalkulasi Output */}
              <p className="text-[11px] text-slate-400 font-mono">
                26 × {infoCount} output
              </p>

              {/* Tombol Generate Infografis */}
              <button
                type="button"
                onClick={handleGenerateInfografis}
                disabled={isGeneratingInfo}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-blue-900/30 transition-all flex items-center justify-center cursor-pointer"
              >
                {isGeneratingInfo ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    <span>Memproses Infografis...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    <span>Generate Infografis - {26 * infoCount} kredit</span>
                  </>
                )}
              </button>
            </div>

            {/* RIGHT DISPLAY PANELS (Hasil Infografis & Riwayat Infografis) */}
            <div className="lg:col-span-8 space-y-5">
              {/* 1. HASIL INFOGRAFIS PANEL */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#091122]/90 border border-slate-800/80 shadow-xl space-y-3.5">
                {/* Header */}
                <div className="flex items-center space-x-2 text-white">
                  <BarChart3 className="w-4 h-4 text-blue-400" />
                  <h3 className="text-xs sm:text-sm font-bold tracking-tight font-heading">
                    Hasil Infografis
                  </h3>
                </div>

                {/* Content Box */}
                {isGeneratingInfo ? (
                  <div className="min-h-[260px] rounded-2xl bg-[#070d1a] border border-slate-800/80 flex flex-col items-center justify-center p-8 text-center space-y-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
                        <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-200">
                        Merancang visual infografis terstruktur...
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Menata grid, diagram, tipografi dan palet warna
                      </p>
                    </div>
                  </div>
                ) : currentInfo ? (
                  <div className="space-y-4">
                    {/* Top Action Bar */}
                    <div className="p-3 rounded-xl bg-[#070d1a] border border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-blue-950/70 border border-blue-800/50 text-[11px] font-bold text-blue-300">
                          {currentInfo.style}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">
                          {currentInfo.ratio} • {currentInfo.sizeTier}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleToggleFavoriteInfo(currentInfo.id)}
                          className={`p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer ${
                            currentInfo.isFavorite
                              ? 'bg-rose-500/20 border border-rose-500/40 text-rose-400'
                              : 'bg-black/60 border border-slate-700/60 text-slate-300 hover:text-white'
                          }`}
                          title="Favorit"
                        >
                          <Heart className={`w-3.5 h-3.5 ${currentInfo.isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleCopyPrompt(currentInfo.prompt)}
                          className="p-2 rounded-xl bg-black/60 border border-slate-700/60 text-slate-300 hover:text-white backdrop-blur-md transition-all cursor-pointer"
                          title="Salin Prompt"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onShowToast('Mengunduh infografis resolusi tinggi...')}
                          className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-900/40 backdrop-blur-md transition-all cursor-pointer"
                          title="Unduh Infografis HD"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Infografis Graphic Canvas */}
                    <div
                      className={`w-full max-w-xl mx-auto rounded-2xl overflow-hidden border shadow-2xl relative p-6 flex flex-col justify-between ${
                        currentInfo.style === 'Modern & Clean'
                          ? 'bg-gradient-to-br from-[#0c1830] via-[#081020] to-[#040812] border-blue-800/40 text-white'
                          : currentInfo.style === 'Flat Design'
                          ? 'bg-gradient-to-br from-[#261608] via-[#1a0f05] to-[#0f0903] border-orange-800/40 text-white'
                          : currentInfo.style === 'Edukasi'
                          ? 'bg-gradient-to-br from-[#0a2324] via-[#061718] to-[#030d0d] border-teal-800/40 text-white'
                          : currentInfo.style === 'Corporate'
                          ? 'bg-gradient-to-br from-[#09172e] via-[#060f1e] to-[#03070f] border-blue-700/40 text-white'
                          : currentInfo.style === 'Data & Statistik'
                          ? 'bg-gradient-to-br from-[#1e0f2b] via-[#13091c] to-[#0a040f] border-purple-800/40 text-white'
                          : currentInfo.style === 'Isometrik 3D'
                          ? 'bg-gradient-to-br from-[#08202b] via-[#05141c] to-[#030b0f] border-cyan-800/40 text-white'
                          : currentInfo.style === 'Dark Mode / Tech'
                          ? 'bg-gradient-to-br from-[#0e1d0d] via-[#091308] to-[#030803] border-lime-800/40 text-white'
                          : currentInfo.style === 'Playful / Ceria'
                          ? 'bg-gradient-to-br from-[#2b0f24] via-[#1c0a18] to-[#0f050d] border-pink-800/40 text-white'
                          : currentInfo.style === 'Hand-drawn / Sketsa'
                          ? 'bg-gradient-to-br from-[#1c1706] via-[#120f04] to-[#0a0802] border-yellow-800/40 text-white'
                          : 'bg-gradient-to-br from-slate-900 via-slate-950 to-black border-slate-800 text-white'
                      }`}
                      style={{
                        aspectRatio:
                          currentInfo.ratio === '16:9' ? '16/9' : currentInfo.ratio === '9:16' ? '9/16' : '1/1',
                        minHeight: '380px'
                      }}
                    >
                      {/* Top Header Section */}
                      <div className="space-y-2 z-10">
                        <div className="flex items-center justify-between">
                          <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-bold tracking-wider uppercase border border-white/15">
                            {currentInfo.style}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {currentInfo.sizeTier.toUpperCase()} • 4K HD
                          </span>
                        </div>
                        <h4 className="text-base sm:text-xl font-black text-white tracking-tight font-heading leading-tight">
                          {currentInfo.topic.split('\n')[0] || 'Infografis Ringkasan Data'}
                        </h4>
                      </div>

                      {/* Middle Data Points & Layout */}
                      <div className="my-auto py-4 space-y-2.5 z-10">
                        {topicPoints.slice(0, 4).map((point, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-black/40 border border-white/10 backdrop-blur-md flex items-center gap-3 transition-all hover:border-white/20"
                          >
                            <div className="w-7 h-7 rounded-lg bg-blue-600/30 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-xs shrink-0">
                              {idx + 1}
                            </div>
                            <p className="text-xs font-semibold text-slate-200 leading-snug">
                              {point.replace(/^[0-9]+[.\-)]\s*/, '')}
                            </p>
                          </div>
                        ))}

                        {currentInfo.refImage && (
                          <div className="flex items-center gap-3 pt-2">
                            <div className="w-12 h-12 rounded-lg overflow-hidden border border-white/20 shrink-0">
                              <img src={currentInfo.refImage} alt="Ref" className="w-full h-full object-cover" />
                            </div>
                            <p className="text-[11px] text-slate-400">
                              Elemen referensi terintegrasi ke dalam skema infografis.
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Footer Stats & Brand */}
                      <div className="flex items-center justify-between z-10 pt-3 border-t border-white/10 text-[10px] text-slate-400">
                        <span>suga.ai / visual-infografis</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono font-bold">
                          {currentInfo.colorMode === 'Auto' ? 'AI PALETTE' : currentInfo.customPalette?.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Empty State (Matches Screenshot 1 & 4) */
                  <div className="min-h-[200px] rounded-2xl bg-[#070d1a] border border-slate-800/80 flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-12 h-12 flex items-center justify-center text-slate-600 mb-2">
                      <BarChart3 className="w-8 h-8 stroke-[1.2]" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-300 tracking-tight">
                      Belum ada infografis
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Isi topik / data lalu klik Generate Infografis
                    </p>
                  </div>
                )}
              </div>

              {/* 2. RIWAYAT INFOGRAFIS PANEL */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#091122]/90 border border-slate-800/80 shadow-xl space-y-3.5">
                {/* Header */}
                <div className="flex items-center space-x-2 text-white">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <h3 className="text-xs sm:text-sm font-bold tracking-tight font-heading">
                    Riwayat Infografis
                  </h3>
                </div>

                {/* Content Box */}
                {infoHistory.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {infoHistory.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setCurrentInfo(item)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer text-left space-y-2 ${
                          currentInfo?.id === item.id
                            ? 'bg-blue-950/30 border-blue-500/70'
                            : 'bg-[#070d1a] border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-blue-400">{item.style}</span>
                          <span className="text-slate-500 font-mono">{item.time}</span>
                        </div>
                        <p className="text-xs font-semibold text-white truncate">
                          {item.topic.split('\n')[0]}
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-slate-400">
                          <span>Ratio: {item.ratio} • {item.sizeTier}</span>
                          <span>{item.cost} kredit</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Empty State (Matches Screenshot 1 & 4) */
                  <div className="min-h-[190px] rounded-2xl bg-[#070d1a] border border-slate-800/80 flex flex-col items-center justify-center p-8 text-center">
                    <div className="w-12 h-12 flex items-center justify-center text-slate-600 mb-2">
                      <Clock className="w-8 h-8 stroke-[1.2]" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-300 tracking-tight">
                      Belum ada riwayat infografis
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Infografis yang kamu buat akan tersimpan di sini
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* 5. STUDIO PODCAST TAB (Matches user screenshots 1 & 2) */}
      {activeTab === 'gambar-podcast' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT CONTROL PANEL (Studio Podcast — Generator Foto) */}
          <div className="lg:col-span-4 p-4 sm:p-5 rounded-2xl bg-[#091122]/90 border border-slate-800/80 shadow-xl space-y-4">
            {/* Header */}
            <div>
              <div className="flex items-center space-x-2 text-white">
                <Mic className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs sm:text-sm font-bold tracking-tight font-heading">
                  Studio Podcast — Generator Foto
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Upload foto karakter, pilih tema, dan AI akan buat foto studio podcast-nya.
              </p>
            </div>

            {/* Foto Karakter * */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300">
                Foto Karakter <span className="text-rose-500">*</span>
              </label>
              <input
                type="file"
                ref={podcastFileInputRef}
                onChange={handleUploadPodcastChar}
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
              />
              {podcastCharImage ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-black/40 group">
                  <img
                    src={podcastCharImage}
                    alt="Karakter"
                    className="w-full h-36 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => podcastFileInputRef.current?.click()}
                      className="px-2.5 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors cursor-pointer"
                    >
                      Ganti
                    </button>
                    <button
                      type="button"
                      onClick={() => setPodcastCharImage(null)}
                      className="px-2.5 py-1 text-xs bg-rose-600 text-white rounded-lg hover:bg-rose-500 transition-colors cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => podcastFileInputRef.current?.click()}
                  className="border border-dashed border-slate-700/80 hover:border-slate-500 bg-[#060b16] rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
                >
                  <Upload className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors mb-2 stroke-[1.5]" />
                  <p className="text-xs font-semibold text-slate-300">
                    Klik atau drop foto di sini
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    JPG/PNG/WEBP • maks 10MB • min 512×512
                  </p>
                </div>
              )}
            </div>

            {/* Tema Suasana (Dropdown Selector) */}
            <div className="space-y-1.5 relative" ref={podcastThemeDropdownRef}>
              <label className="text-[11px] font-semibold text-slate-300">
                Tema Suasana
              </label>
              <button
                type="button"
                onClick={() => setIsPodcastThemeOpen(!isPodcastThemeOpen)}
                className={`w-full flex items-center justify-between p-3 rounded-xl bg-[#060b16] border transition-all text-left cursor-pointer ${
                  isPodcastThemeOpen
                    ? 'border-blue-500 ring-2 ring-blue-500/20'
                    : 'border-slate-700/80 hover:border-slate-600'
                }`}
              >
                <span className="text-xs font-semibold text-white">
                  {podcastTheme}
                </span>
                {isPodcastThemeOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {/* Dropdown Options Menu (Screenshot 2) */}
              {isPodcastThemeOpen && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#0a1224] border border-slate-700/80 rounded-xl shadow-2xl z-50 py-1 overflow-hidden">
                  {PODCAST_THEMES.map((theme) => {
                    const isSelected = podcastTheme === theme;
                    return (
                      <button
                        key={theme}
                        type="button"
                        onClick={() => {
                          setPodcastTheme(theme);
                          setIsPodcastThemeOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white font-semibold'
                            : 'hover:bg-slate-800/60 text-slate-200'
                        }`}
                      >
                        {theme}
                      </button>
                    );
                  })}
                </div>
              )}

              {podcastTheme === 'Custom (tulis sendiri)' && (
                <input
                  type="text"
                  value={podcastCustomTheme}
                  onChange={(e) => setPodcastCustomTheme(e.target.value)}
                  placeholder="Ketik tema studio impianmu (mis. Cyberpunk Loft, Vintage Vinyl...)"
                  className="w-full mt-2 bg-[#060b16] border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              )}
            </div>

            {/* Prompt Tambahan (opsional) */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400">
                Prompt Tambahan <span className="text-slate-500 font-normal">(opsional)</span>
              </label>
              <textarea
                value={podcastAdditionalPrompt}
                onChange={(e) => setPodcastAdditionalPrompt(e.target.value)}
                placeholder="contoh: pakai batik, mic emas, gaya entrepreneur Indonesia..."
                rows={3}
                className="w-full bg-[#060b16] border border-slate-700/80 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none font-sans leading-relaxed"
              />
            </div>

            {/* Rasio Gambar */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400">
                Rasio Gambar
              </label>
              <div className="grid grid-cols-6 gap-1.5">
                {(['16:9', '1:1', '4:5', '9:16', '3:4', '4:3'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setPodcastRatio(r)}
                    className={`py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      podcastRatio === r
                        ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-900/30'
                        : 'bg-[#060b16] border-slate-700/80 text-slate-400 hover:text-white hover:border-slate-600'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Jumlah Foto */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400">
                Jumlah Foto
              </label>
              <div className="space-y-1.5">
                <div className="grid grid-cols-6 gap-1.5">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setPodcastCount(num)}
                      className={`py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                        podcastCount === num
                          ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-900/30'
                          : 'bg-[#060b16] border-slate-700/80 text-slate-400 hover:text-white hover:border-slate-600'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-6 gap-1.5">
                  {[8, 10].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setPodcastCount(num)}
                      className={`py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                        podcastCount === num
                          ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-900/30'
                          : 'bg-[#060b16] border-slate-700/80 text-slate-400 hover:text-white hover:border-slate-600'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Kalkulasi Output */}
            <p className="text-[11px] text-slate-400 font-mono">
              2 × {podcastCount} output
            </p>

            {/* Tombol Buat Foto Podcast */}
            <button
              type="button"
              onClick={handleGeneratePodcast}
              disabled={isGeneratingPodcast}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-blue-900/30 transition-all flex items-center justify-center cursor-pointer"
            >
              {isGeneratingPodcast ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  <span>Memproses Foto Podcast...</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 mr-2" />
                  <span>Buat Foto Podcast • {2 * podcastCount} kredit</span>
                </>
              )}
            </button>
          </div>

          {/* RIGHT DISPLAY PANEL (Hasil Foto Podcast) */}
          <div className="lg:col-span-8 p-4 sm:p-5 rounded-2xl bg-[#091122]/90 border border-slate-800/80 shadow-xl space-y-3.5">
            {/* Header */}
            <div className="flex items-center space-x-2 text-white">
              <ImageIcon className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs sm:text-sm font-bold tracking-tight font-heading">
                Hasil Foto Podcast
              </h3>
            </div>

            {/* Content Box */}
            {isGeneratingPodcast ? (
              <div className="min-h-[300px] rounded-2xl bg-[#070d1a] border border-slate-800/80 flex flex-col items-center justify-center p-8 text-center space-y-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-200">
                    Menghasilkan foto studio podcast ultra-realistis...
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Mengintegrasikan karakter, mikrofon siaran profesional, dan pencahayaan studio
                  </p>
                </div>
              </div>
            ) : activePodcastPhoto ? (
              <div className="space-y-4">
                {/* Top Action Bar */}
                <div className="p-3 rounded-xl bg-[#070d1a] border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-950/70 border border-blue-800/50 text-[11px] font-bold text-blue-300">
                      {activePodcastPhoto.theme}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {activePodcastPhoto.ratio} • {activePodcastPhoto.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleToggleFavoritePodcast(activePodcastPhoto.id)}
                      className={`p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer ${
                        activePodcastPhoto.isFavorite
                          ? 'bg-rose-500/20 border border-rose-500/40 text-rose-400'
                          : 'bg-black/60 border border-slate-700/60 text-slate-300 hover:text-white'
                      }`}
                      title="Favorit"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          activePodcastPhoto.isFavorite ? 'fill-rose-500 text-rose-500' : ''
                        }`}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopyPrompt(activePodcastPhoto.prompt)}
                      className="p-2 rounded-xl bg-black/60 border border-slate-700/60 text-slate-300 hover:text-white backdrop-blur-md transition-all cursor-pointer"
                      title="Salin Prompt"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onShowToast('Mengunduh foto podcast resolusi tinggi...')}
                      className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-900/40 backdrop-blur-md transition-all cursor-pointer"
                      title="Unduh HD"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Podcast Graphic Canvas View */}
                <div
                  className={`w-full max-w-2xl mx-auto rounded-2xl overflow-hidden border shadow-2xl relative flex flex-col justify-between p-6 ${
                    activePodcastPhoto.theme === 'Neon Gaming'
                      ? 'bg-gradient-to-br from-[#120624] via-[#090b1c] to-[#04060f] border-fuchsia-800/40'
                      : activePodcastPhoto.theme === 'Dark Moody Cinematic'
                      ? 'bg-gradient-to-br from-[#0c0d12] via-[#06070a] to-[#020204] border-slate-700/40'
                      : activePodcastPhoto.theme === 'Cozy Home Studio'
                      ? 'bg-gradient-to-br from-[#1c1208] via-[#120b05] to-[#080503] border-amber-800/40'
                      : 'bg-gradient-to-br from-[#0b162c] via-[#070e1e] to-[#03060c] border-blue-800/40'
                  }`}
                  style={{
                    aspectRatio:
                      activePodcastPhoto.ratio === '16:9'
                        ? '16/9'
                        : activePodcastPhoto.ratio === '9:16'
                        ? '9/16'
                        : activePodcastPhoto.ratio === '4:5'
                        ? '4/5'
                        : activePodcastPhoto.ratio === '3:4'
                        ? '3/4'
                        : activePodcastPhoto.ratio === '4:3'
                        ? '4/3'
                        : '1/1',
                    maxHeight: '460px'
                  }}
                >
                  {/* Top Bar inside podcast photo */}
                  <div className="flex items-center justify-between z-10">
                    <span className="px-3 py-1 rounded-full bg-black/50 text-white backdrop-blur-md font-bold text-[11px] tracking-wider uppercase border border-white/15">
                      ON AIR • PODCAST
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-600/80 text-white font-mono text-[10px] font-bold animate-pulse">
                      REC ●
                    </span>
                  </div>

                  {/* Character & Studio Microphone Center */}
                  <div className="my-auto py-4 flex flex-col sm:flex-row items-center justify-center gap-6 z-10">
                    {/* Character Photo in Studio frame */}
                    {activePodcastPhoto.characterImage ? (
                      <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-2 border-blue-500/40 shadow-2xl bg-black/60 shrink-0">
                        <img
                          src={activePodcastPhoto.characterImage}
                          alt="Character"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-white font-semibold">
                          Host
                        </span>
                      </div>
                    ) : null}

                    {/* Studio Rig & Details */}
                    <div className="space-y-2 text-left max-w-[280px]">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/10 backdrop-blur-md border border-white/15 text-white text-[11px]">
                        <Mic className="w-3.5 h-3.5 text-blue-400" />
                        <span>Shure SM7B Broadcast Mic</span>
                      </div>
                      <h4 className="text-base sm:text-lg font-bold text-white leading-tight font-heading">
                        {activePodcastPhoto.theme}
                      </h4>
                      {activePodcastPhoto.additionalPrompt && (
                        <p className="text-xs text-slate-300 italic">
                          "{activePodcastPhoto.additionalPrompt}"
                        </p>
                      )}
                      <p className="text-[11px] text-slate-400">
                        Pencahayaan key-light 5600K dengan depth-of-field sinematik studio kedap suara.
                      </p>
                    </div>
                  </div>

                  {/* Bottom Studio Info */}
                  <div className="flex items-center justify-between z-10 pt-2 border-t border-white/10 text-[10px] text-slate-400">
                    <span>suga.ai / podcast-studio</span>
                    <span className="font-mono">8K UHD PHOTOREALISTIC</span>
                  </div>
                </div>

                {/* Thumbnails of generated variations if count > 1 */}
                {podcastResults.length > 1 && (
                  <div className="space-y-2 pt-2">
                    <p className="text-[11px] font-semibold text-slate-400">
                      Variasi Hasil ({podcastResults.length} foto)
                    </p>
                    <div className="flex gap-2.5 overflow-x-auto pb-2 custom-scrollbar">
                      {podcastResults.map((photo, idx) => (
                        <button
                          key={photo.id}
                          type="button"
                          onClick={() => setActivePodcastPhoto(photo)}
                          className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer relative ${
                            activePodcastPhoto.id === photo.id
                              ? 'border-blue-500 shadow-md shadow-blue-500/30'
                              : 'border-slate-800 opacity-70 hover:opacity-100'
                          }`}
                        >
                          {photo.characterImage ? (
                            <img
                              src={photo.characterImage}
                              alt={`Var ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                              <Mic className="w-5 h-5 text-slate-500" />
                            </div>
                          )}
                          <span className="absolute bottom-1 right-1 px-1 rounded bg-black/80 text-[9px] font-bold text-white">
                            #{idx + 1}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Empty State (Matches Screenshot 1 exactly) */
              <div className="min-h-[260px] rounded-2xl bg-[#070d1a] border border-slate-800/80 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-12 h-12 flex items-center justify-center text-slate-600 mb-2">
                  <Mic className="w-8 h-8 stroke-[1.2]" />
                </div>
                <h4 className="text-sm font-bold text-slate-300 tracking-tight">
                  Belum ada foto podcast
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Upload foto karakter dan pilih tema untuk memulai
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. POV PRODUK TAB (Matches user screenshots 1 & 2) */}
      {activeTab === 'gambar-pov' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT CONTROL PANEL (POV Produk — Foto Produk POV) */}
          <div className="lg:col-span-4 p-4 sm:p-5 rounded-2xl bg-[#091122]/90 border border-slate-800/80 shadow-xl space-y-4">
            {/* Header */}
            <div>
              <div className="flex items-center space-x-2 text-white">
                <Box className="w-4 h-4 text-blue-400 stroke-[1.5]" />
                <h3 className="text-xs sm:text-sm font-bold tracking-tight font-heading">
                  POV Produk — Foto Produk POV
                </h3>
              </div>
            </div>

            {/* Foto Produk / Referensi */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-300">
                Foto Produk / Referensi
              </label>
              <input
                type="file"
                ref={povFileInputRef}
                onChange={handleUploadPovProduct}
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
              />
              {povProductImage ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-black/40 group">
                  <img
                    src={povProductImage}
                    alt="Produk"
                    className="w-full h-32 object-contain p-2"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => povFileInputRef.current?.click()}
                      className="px-2.5 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors cursor-pointer"
                    >
                      Ganti
                    </button>
                    <button
                      type="button"
                      onClick={() => setPovProductImage(null)}
                      className="px-2.5 py-1 text-xs bg-rose-600 text-white rounded-lg hover:bg-rose-500 transition-colors cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => povFileInputRef.current?.click()}
                  className="border border-dashed border-slate-700/80 hover:border-slate-500 bg-[#060b16] rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
                >
                  <Upload className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors mb-2 stroke-[1.5]" />
                  <p className="text-xs font-semibold text-slate-300">
                    Unggah foto produk
                  </p>
                </div>
              )}
            </div>

            {/* Prompt Tambahan */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400">
                Prompt Tambahan
              </label>
              <div className="relative">
                <textarea
                  value={povPrompt}
                  onChange={(e) => setPovPrompt(e.target.value.slice(0, 5000))}
                  placeholder="Detail tambahan (opsional), mis. suasana, latar, warna..."
                  rows={3}
                  className="w-full bg-[#060b16] border border-slate-700/80 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none font-sans leading-relaxed"
                />
                <div className="text-right text-[10px] text-slate-500 font-mono mt-0.5">
                  {povPrompt.length} / 5000
                </div>
              </div>
            </div>

            {/* Rasio */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400">
                Rasio
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['9:16', '2:3', '1:1', '16:9'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setPovRatio(r)}
                    className={`py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      povRatio === r
                        ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-900/30'
                        : 'bg-[#060b16] border-slate-700/80 text-slate-400 hover:text-white hover:border-slate-600'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 font-mono mt-1">
                {getPovResolution(povRatio)}
              </p>
            </div>

            {/* Style (Custom Dropdown Selector) */}
            <div className="space-y-1.5 relative" ref={povStyleDropdownRef}>
              <label className="text-[11px] font-semibold text-slate-400">
                Style
              </label>
              <button
                type="button"
                onClick={() => setIsPovStyleOpen(!isPovStyleOpen)}
                className={`w-full flex items-center justify-between p-3 rounded-xl bg-[#060b16] border transition-all text-left cursor-pointer ${
                  isPovStyleOpen
                    ? 'border-blue-500 ring-2 ring-blue-500/20'
                    : 'border-slate-700/80 hover:border-slate-600'
                }`}
              >
                <span className="text-xs font-semibold text-white">
                  {povStyle}
                </span>
                {isPovStyleOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {/* Dropdown Options Menu (Matches Screenshot 2) */}
              {isPovStyleOpen && (
                <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#0a1224] border border-slate-700/80 rounded-xl shadow-2xl z-50 py-1 overflow-hidden">
                  {POV_STYLES.map((styleItem) => {
                    const isSelected = povStyle === styleItem;
                    return (
                      <button
                        key={styleItem}
                        type="button"
                        onClick={() => {
                          setPovStyle(styleItem);
                          setIsPovStyleOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2.5 text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white font-semibold'
                            : 'hover:bg-slate-800/60 text-slate-200'
                        }`}
                      >
                        {styleItem}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 1 generate text */}
            <p className="text-[11px] text-slate-400">
              1 generate
            </p>

            {/* Generate Button */}
            <button
              type="button"
              onClick={handleGeneratePov}
              disabled={isGeneratingPov}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-blue-900/30 transition-all flex items-center justify-center cursor-pointer"
            >
              {isGeneratingPov ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  <span>Memproses Foto POV...</span>
                </>
              ) : (
                <>
                  <Box className="w-4 h-4 mr-2 stroke-[1.5]" />
                  <span>Generate • ≈10 kredit</span>
                </>
              )}
            </button>
          </div>

          {/* RIGHT DISPLAY PANEL (Preview Gambar) */}
          <div className="lg:col-span-8 p-4 sm:p-5 rounded-2xl bg-[#091122]/90 border border-slate-800/80 shadow-xl space-y-3.5">
            {/* Header */}
            <div className="flex items-center space-x-2 text-white">
              <ImageIcon className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs sm:text-sm font-bold tracking-tight font-heading">
                Preview Gambar
              </h3>
            </div>

            {/* Content Box */}
            {isGeneratingPov ? (
              <div className="min-h-[300px] rounded-2xl bg-[#070d1a] border border-slate-800/80 flex flex-col items-center justify-center p-8 text-center space-y-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-200">
                    Merender Foto Produk Point-of-View (POV)...
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Mengkombinasikan perspektif tangan manusia alami, kedalaman makro, dan pencahayaan komersial
                  </p>
                </div>
              </div>
            ) : currentPovProduct ? (
              <div className="space-y-4">
                {/* Top Action Bar */}
                <div className="p-3 rounded-xl bg-[#070d1a] border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-950/70 border border-blue-800/50 text-[11px] font-bold text-blue-300">
                      Style: {currentPovProduct.style}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {currentPovProduct.ratio} ({currentPovProduct.resolution}) • {currentPovProduct.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleToggleFavoritePov(currentPovProduct.id)}
                      className={`p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer ${
                        currentPovProduct.isFavorite
                          ? 'bg-rose-500/20 border border-rose-500/40 text-rose-400'
                          : 'bg-black/60 border border-slate-700/60 text-slate-300 hover:text-white'
                      }`}
                      title="Favorit"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          currentPovProduct.isFavorite ? 'fill-rose-500 text-rose-500' : ''
                        }`}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopyPrompt(currentPovProduct.prompt)}
                      className="p-2 rounded-xl bg-black/60 border border-slate-700/60 text-slate-300 hover:text-white backdrop-blur-md transition-all cursor-pointer"
                      title="Salin Prompt"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onShowToast('Mengunduh foto POV resolusi tinggi...')}
                      className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-900/40 backdrop-blur-md transition-all cursor-pointer"
                      title="Unduh HD"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* POV Graphic Canvas View */}
                <div
                  className="w-full max-w-xl mx-auto rounded-2xl overflow-hidden border border-slate-700/70 shadow-2xl relative flex flex-col justify-between p-6 bg-gradient-to-b from-[#141b2d] via-[#0c1220] to-[#060912]"
                  style={{
                    aspectRatio:
                      currentPovProduct.ratio === '16:9'
                        ? '16/9'
                        : currentPovProduct.ratio === '9:16'
                        ? '9/16'
                        : currentPovProduct.ratio === '2:3'
                        ? '2/3'
                        : '1/1',
                    maxHeight: '480px'
                  }}
                >
                  {/* Top Bar inside POV photo */}
                  <div className="flex items-center justify-between z-10">
                    <span className="px-3 py-1 rounded-full bg-black/60 text-white backdrop-blur-md font-bold text-[11px] tracking-wider uppercase border border-white/15">
                      POV PERSPECTIVE • PRODUCT SHOT
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-600/80 text-white font-mono text-[10px] font-bold">
                      {currentPovProduct.resolution}
                    </span>
                  </div>

                  {/* Center Product & POV Hands Visual */}
                  <div className="my-auto py-4 flex flex-col items-center justify-center gap-3 z-10 text-center">
                    {currentPovProduct.productImage ? (
                      <div className="relative p-4 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-sm max-w-xs shadow-2xl">
                        <img
                          src={currentPovProduct.productImage}
                          alt="POV Product"
                          className="max-h-44 object-contain mx-auto filter drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)]"
                        />
                        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold whitespace-nowrap shadow">
                          POV Holding In Hand
                        </div>
                      </div>
                    ) : (
                      <div className="w-32 h-32 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex flex-col items-center justify-center p-4">
                        <Box className="w-12 h-12 text-blue-400 stroke-[1.5] mb-2" />
                        <span className="text-[10px] font-bold text-blue-300">POV Product Center</span>
                      </div>
                    )}

                    {currentPovProduct.additionalPrompt && (
                      <div className="max-w-md px-3.5 py-1.5 rounded-xl bg-black/50 border border-white/10 backdrop-blur-md text-slate-200 text-xs italic mt-2">
                        "{currentPovProduct.additionalPrompt}"
                      </div>
                    )}
                  </div>

                  {/* Bottom POV Info */}
                  <div className="flex items-center justify-between z-10 pt-2 border-t border-white/10 text-[10px] text-slate-400">
                    <span>suga.ai / pov-product-studio</span>
                    <span className="font-mono">F/2.0 MACRO DEPTH OF FIELD</span>
                  </div>
                </div>

                {/* History Gallery */}
                {povHistory.length > 1 && (
                  <div className="space-y-2 pt-2">
                    <p className="text-[11px] font-semibold text-slate-400">
                      Riwayat POV Produk ({povHistory.length})
                    </p>
                    <div className="flex gap-2.5 overflow-x-auto pb-2 custom-scrollbar">
                      {povHistory.map((item, idx) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setCurrentPovProduct(item)}
                          className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer relative bg-slate-900 ${
                            currentPovProduct.id === item.id
                              ? 'border-blue-500 shadow-md shadow-blue-500/30'
                              : 'border-slate-800 opacity-70 hover:opacity-100'
                          }`}
                        >
                          {item.productImage ? (
                            <img
                              src={item.productImage}
                              alt={`POV ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Box className="w-6 h-6 text-slate-500 stroke-[1.5]" />
                            </div>
                          )}
                          <span className="absolute bottom-1 right-1 px-1 rounded bg-black/80 text-[9px] font-bold text-white">
                            #{idx + 1}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Empty State (Matches Screenshot 1 exactly) */
              <div className="min-h-[260px] rounded-2xl bg-[#070d1a] border border-slate-800/80 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-12 h-12 flex items-center justify-center text-slate-600 mb-2">
                  <Box className="w-8 h-8 stroke-[1.2]" />
                </div>
                <h4 className="text-sm font-bold text-slate-300 tracking-tight">
                  Belum ada gambar
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Hasil generate akan muncul di sini
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 7. VIRTUAL TRY-ON TAB (Matches user screenshot) */}
      {activeTab === 'gambar-tryon' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT CONTROL PANEL (Virtual Try-On) */}
          <div className="lg:col-span-4 p-4 sm:p-5 rounded-2xl bg-[#091122]/90 border border-slate-800/80 shadow-xl space-y-4">
            {/* Header */}
            <div>
              <div className="flex items-center space-x-2 text-white">
                <Shirt className="w-4 h-4 text-blue-400 stroke-[1.5]" />
                <h3 className="text-xs sm:text-sm font-bold tracking-tight font-heading">
                  Virtual Try-On
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                Unggah foto pakaian dan foto orang. AI akan memakaikan pakaian tersebut ke orang dengan mempertahankan identitas &amp; pose.
              </p>
            </div>

            {/* Foto Pakaian */}
            <div className="space-y-1.5">
              <div className="flex items-center space-x-1.5 text-slate-300 text-[11px] font-semibold">
                <Shirt className="w-3.5 h-3.5 text-slate-400 stroke-[1.5]" />
                <span>Foto Pakaian</span>
              </div>
              <input
                type="file"
                ref={tryOnClothesFileInputRef}
                onChange={handleUploadClothes}
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
              />
              {tryOnClothesImage ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-black/40 group">
                  <img
                    src={tryOnClothesImage}
                    alt="Pakaian"
                    className="w-full h-28 object-contain p-2"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => tryOnClothesFileInputRef.current?.click()}
                      className="px-2.5 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors cursor-pointer"
                    >
                      Ganti
                    </button>
                    <button
                      type="button"
                      onClick={() => setTryOnClothesImage(null)}
                      className="px-2.5 py-1 text-xs bg-rose-600 text-white rounded-lg hover:bg-rose-500 transition-colors cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => tryOnClothesFileInputRef.current?.click()}
                  className="border border-dashed border-slate-700/80 hover:border-slate-500 bg-[#060b16] rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
                >
                  <Upload className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors mb-2 stroke-[1.5]" />
                  <p className="text-xs font-semibold text-slate-300">
                    Unggah foto pakaian
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Tampak depan, background putih
                  </p>
                </div>
              )}
            </div>

            {/* Foto Orang */}
            <div className="space-y-1.5">
              <div className="flex items-center space-x-1.5 text-slate-300 text-[11px] font-semibold">
                <User className="w-3.5 h-3.5 text-slate-400 stroke-[1.5]" />
                <span>Foto Orang</span>
              </div>
              <input
                type="file"
                ref={tryOnPersonFileInputRef}
                onChange={handleUploadPerson}
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
              />
              {tryOnPersonImage ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-black/40 group">
                  <img
                    src={tryOnPersonImage}
                    alt="Orang"
                    className="w-full h-28 object-contain p-2"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => tryOnPersonFileInputRef.current?.click()}
                      className="px-2.5 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors cursor-pointer"
                    >
                      Ganti
                    </button>
                    <button
                      type="button"
                      onClick={() => setTryOnPersonImage(null)}
                      className="px-2.5 py-1 text-xs bg-rose-600 text-white rounded-lg hover:bg-rose-500 transition-colors cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => tryOnPersonFileInputRef.current?.click()}
                  className="border border-dashed border-slate-700/80 hover:border-slate-500 bg-[#060b16] rounded-xl p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
                >
                  <Upload className="w-5 h-5 text-slate-400 group-hover:text-blue-400 transition-colors mb-2 stroke-[1.5]" />
                  <p className="text-xs font-semibold text-slate-300">
                    Unggah foto orang
                  </p>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Berdiri, full body, menghadap kamera
                  </p>
                </div>
              )}
            </div>

            {/* Prompt Tambahan (opsional) */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400">
                Prompt Tambahan (opsional)
              </label>
              <div className="relative">
                <textarea
                  value={tryOnPrompt}
                  onChange={(e) => setTryOnPrompt(e.target.value.slice(0, 5000))}
                  placeholder="mis. outdoor fashion photography, golden hour, luxury catalog"
                  rows={3}
                  className="w-full bg-[#060b16] border border-slate-700/80 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 resize-none font-sans leading-relaxed"
                />
                <div className="text-right text-[10px] text-slate-500 font-mono mt-0.5">
                  {tryOnPrompt.length} / 5000
                </div>
              </div>
            </div>

            {/* Rasio */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-slate-400">
                Rasio
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['2:3', '9:16', '1:1', '16:9'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setTryOnRatio(r)}
                    className={`py-1.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      tryOnRatio === r
                        ? 'bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-900/30'
                        : 'bg-[#060b16] border-slate-700/80 text-slate-400 hover:text-white hover:border-slate-600'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-slate-500 font-mono mt-1">
                {getTryOnResolution(tryOnRatio)}
              </p>
            </div>

            {/* 1 generate text */}
            <p className="text-[11px] text-slate-400">
              1 generate
            </p>

            {/* Generate Button */}
            <button
              type="button"
              onClick={handleGenerateTryOn}
              disabled={isGeneratingTryOn}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-blue-900/30 transition-all flex items-center justify-center cursor-pointer"
            >
              {isGeneratingTryOn ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  <span>Memproses Virtual Try-On...</span>
                </>
              ) : (
                <>
                  <Shirt className="w-4 h-4 mr-2 stroke-[1.5]" />
                  <span>Generate • ≈5 kredit</span>
                </>
              )}
            </button>
          </div>

          {/* RIGHT DISPLAY PANEL (Hasil Try-On) */}
          <div className="lg:col-span-8 p-4 sm:p-5 rounded-2xl bg-[#091122]/90 border border-slate-800/80 shadow-xl space-y-3.5">
            {/* Header */}
            <div className="flex items-center space-x-2 text-white">
              <ImageIcon className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs sm:text-sm font-bold tracking-tight font-heading">
                Hasil Try-On
              </h3>
            </div>

            {/* Content Box */}
            {isGeneratingTryOn ? (
              <div className="min-h-[300px] rounded-2xl bg-[#070d1a] border border-slate-800/80 flex flex-col items-center justify-center p-8 text-center space-y-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-200">
                    Memakaikan pakaian ke orang dengan AI...
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Mempertahankan identitas wajah, proporsi tubuh, lekukan kain, dan pose alami
                  </p>
                </div>
              </div>
            ) : currentTryOn ? (
              <div className="space-y-4">
                {/* Top Action Bar */}
                <div className="p-3 rounded-xl bg-[#070d1a] border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-950/70 border border-blue-800/50 text-[11px] font-bold text-blue-300">
                      Try-On Selesai
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {currentTryOn.ratio} ({currentTryOn.resolution}) • {currentTryOn.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleToggleFavoriteTryOn(currentTryOn.id)}
                      className={`p-2 rounded-xl backdrop-blur-md transition-all cursor-pointer ${
                        currentTryOn.isFavorite
                          ? 'bg-rose-500/20 border border-rose-500/40 text-rose-400'
                          : 'bg-black/60 border border-slate-700/60 text-slate-300 hover:text-white'
                      }`}
                      title="Favorit"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          currentTryOn.isFavorite ? 'fill-rose-500 text-rose-500' : ''
                        }`}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopyPrompt(currentTryOn.prompt)}
                      className="p-2 rounded-xl bg-black/60 border border-slate-700/60 text-slate-300 hover:text-white backdrop-blur-md transition-all cursor-pointer"
                      title="Salin Prompt"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onShowToast('Mengunduh foto Try-On resolusi tinggi...')}
                      className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-900/40 backdrop-blur-md transition-all cursor-pointer"
                      title="Unduh HD"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Try-On Canvas View */}
                <div
                  className="w-full max-w-lg mx-auto rounded-2xl overflow-hidden border border-slate-700/70 shadow-2xl relative flex flex-col justify-between p-6 bg-gradient-to-b from-[#111827] via-[#0b0f19] to-[#05070c]"
                  style={{
                    aspectRatio:
                      currentTryOn.ratio === '16:9'
                        ? '16/9'
                        : currentTryOn.ratio === '9:16'
                        ? '9/16'
                        : currentTryOn.ratio === '2:3'
                        ? '2/3'
                        : '1/1',
                    maxHeight: '480px'
                  }}
                >
                  {/* Top Bar inside try-on photo */}
                  <div className="flex items-center justify-between z-10">
                    <span className="px-3 py-1 rounded-full bg-black/60 text-white backdrop-blur-md font-bold text-[11px] tracking-wider uppercase border border-white/15">
                      VIRTUAL TRY-ON • FASHION LOOK
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-600/80 text-white font-mono text-[10px] font-bold">
                      {currentTryOn.resolution}
                    </span>
                  </div>

                  {/* Center Composited Person & Clothes Visual */}
                  <div className="my-auto py-4 flex items-center justify-center gap-4 z-10">
                    {/* Person fitted preview */}
                    {currentTryOn.personImage ? (
                      <div className="relative w-40 h-56 sm:w-48 sm:h-64 rounded-2xl overflow-hidden border-2 border-blue-500/40 shadow-2xl bg-black/60 shrink-0">
                        <img
                          src={currentTryOn.personImage}
                          alt="Person fitted"
                          className="w-full h-full object-cover"
                        />
                        {/* Clothes overlay badge / inset thumbnail */}
                        {currentTryOn.clothesImage && (
                          <div className="absolute bottom-2 right-2 w-12 h-12 rounded-lg bg-black/80 border border-white/20 overflow-hidden p-0.5 shadow-lg">
                            <img
                              src={currentTryOn.clothesImage}
                              alt="Garment"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] text-white font-semibold">
                          Fitted Model
                        </span>
                      </div>
                    ) : (
                      <div className="w-40 h-56 rounded-2xl bg-blue-950/40 border border-blue-500/30 flex flex-col items-center justify-center p-4">
                        <Shirt className="w-12 h-12 text-blue-400 stroke-[1.5] mb-2" />
                        <span className="text-[10px] font-bold text-blue-300">Virtual Fitted Outfit</span>
                      </div>
                    )}

                    {/* Details Box */}
                    <div className="space-y-2 text-left max-w-[200px]">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[10px] font-medium">
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span>Pose &amp; Identitas Terjaga</span>
                      </div>
                      <h4 className="text-sm font-bold text-white leading-tight font-heading">
                        Katalog Busana Terpasang
                      </h4>
                      {currentTryOn.additionalPrompt && (
                        <p className="text-xs text-slate-300 italic">
                          "{currentTryOn.additionalPrompt}"
                        </p>
                      )}
                      <p className="text-[10px] text-slate-400">
                        Tekstur kain, kerutan realistis, dan pencahayaan studio terintegrasi sempurna.
                      </p>
                    </div>
                  </div>

                  {/* Bottom Try-On Info */}
                  <div className="flex items-center justify-between z-10 pt-2 border-t border-white/10 text-[10px] text-slate-400">
                    <span>suga.ai / virtual-try-on</span>
                    <span className="font-mono">8K PHOTOREALISTIC LOOK</span>
                  </div>
                </div>

                {/* History Gallery */}
                {tryOnHistory.length > 1 && (
                  <div className="space-y-2 pt-2">
                    <p className="text-[11px] font-semibold text-slate-400">
                      Riwayat Try-On ({tryOnHistory.length})
                    </p>
                    <div className="flex gap-2.5 overflow-x-auto pb-2 custom-scrollbar">
                      {tryOnHistory.map((item, idx) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setCurrentTryOn(item)}
                          className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer relative bg-slate-900 ${
                            currentTryOn.id === item.id
                              ? 'border-blue-500 shadow-md shadow-blue-500/30'
                              : 'border-slate-800 opacity-70 hover:opacity-100'
                          }`}
                        >
                          {item.personImage || item.clothesImage ? (
                            <img
                              src={(item.personImage || item.clothesImage)!}
                              alt={`TryOn ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Shirt className="w-6 h-6 text-slate-500 stroke-[1.5]" />
                            </div>
                          )}
                          <span className="absolute bottom-1 right-1 px-1 rounded bg-black/80 text-[9px] font-bold text-white">
                            #{idx + 1}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Empty State (Matches Screenshot exactly) */
              <div className="min-h-[260px] rounded-2xl bg-[#070d1a] border border-slate-800/80 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-12 h-12 flex items-center justify-center text-slate-600 mb-2">
                  <Shirt className="w-8 h-8 stroke-[1.2]" />
                </div>
                <h4 className="text-sm font-bold text-slate-300 tracking-tight">
                  Belum ada hasil
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Hasil try-on akan muncul di sini
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 8. EXTRACT IMAGE TAB (Matches user screenshot) */}
      {activeTab === 'gambar-extract' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* LEFT CONTROL PANEL (Extract Image) */}
          <div className="lg:col-span-4 p-4 sm:p-5 rounded-2xl bg-[#091122]/90 border border-slate-800/80 shadow-xl space-y-4">
            {/* Header */}
            <div>
              <div className="flex items-center space-x-2 text-white">
                <Scan className="w-4 h-4 text-blue-400 stroke-[1.5]" />
                <h3 className="text-xs sm:text-sm font-bold tracking-tight font-heading">
                  Extract Image
                </h3>
              </div>
              <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed">
                Upload gambar untuk mengekstrak prompt deskriptif (image to prompt) yang bisa langsung dipakai di Buat Gambar.
              </p>
            </div>

            {/* Upload Area */}
            <div className="space-y-1.5">
              <input
                type="file"
                ref={extractFileInputRef}
                onChange={handleUploadExtractImage}
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
              />
              {extractImage ? (
                <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-black/40 group">
                  <img
                    src={extractImage}
                    alt="Upload to extract"
                    className="w-full h-44 object-contain p-2"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => extractFileInputRef.current?.click()}
                      className="px-2.5 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors cursor-pointer"
                    >
                      Ganti
                    </button>
                    <button
                      type="button"
                      onClick={() => setExtractImage(null)}
                      className="px-2.5 py-1 text-xs bg-rose-600 text-white rounded-lg hover:bg-rose-500 transition-colors cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => extractFileInputRef.current?.click()}
                  className="border border-dashed border-slate-700/80 hover:border-slate-500 bg-[#060b16] rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
                >
                  <Upload className="w-6 h-6 text-slate-400 group-hover:text-blue-400 transition-colors mb-2 stroke-[1.5]" />
                  <p className="text-xs font-semibold text-slate-200">
                    Upload Gambar
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Drag &amp; drop atau klik untuk memilih
                  </p>
                  <p className="text-[10px] text-slate-500 mt-1 font-mono">
                    JPEG, PNG, WebP — Maks 7MB
                  </p>
                </div>
              )}
            </div>

            {/* 1 ekstrak text */}
            <p className="text-[11px] text-slate-400">
              1 ekstrak
            </p>

            {/* Ekstrak Button */}
            <button
              type="button"
              onClick={handleExtractPrompt}
              disabled={isExtracting}
              className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-blue-900/30 transition-all flex items-center justify-center cursor-pointer"
            >
              {isExtracting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  <span>Mengekstrak Prompt...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2 stroke-[1.5]" />
                  <span>Ekstrak Prompt • 2 kredit</span>
                </>
              )}
            </button>
          </div>

          {/* RIGHT DISPLAY PANEL (Hasil Ekstraksi) */}
          <div className="lg:col-span-8 p-4 sm:p-5 rounded-2xl bg-[#091122]/90 border border-slate-800/80 shadow-xl space-y-3.5">
            {/* Header */}
            <div className="flex items-center space-x-2 text-white">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <h3 className="text-xs sm:text-sm font-bold tracking-tight font-heading">
                Hasil Ekstraksi
              </h3>
            </div>

            {/* Content Box */}
            {isExtracting ? (
              <div className="min-h-[300px] rounded-2xl bg-[#070d1a] border border-slate-800/80 flex flex-col items-center justify-center p-8 text-center space-y-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
                    <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-200">
                    Menganalisis dan mengekstrak prompt visual...
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Menguraikan subjek utama, gaya fotografi, pencahayaan, palet warna, dan sudut kamera
                  </p>
                </div>
              </div>
            ) : currentExtracted ? (
              <div className="space-y-4">
                {/* Top Action Bar */}
                <div className="p-3 rounded-xl bg-[#070d1a] border border-slate-800 flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-950/70 border border-blue-800/50 text-[11px] font-bold text-blue-300">
                      Prompt Berhasil Diekstrak
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      {currentExtracted.time} • -{currentExtracted.cost} kredit
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleUseInBuatGambar(currentExtracted.prompt)}
                      className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-900/40 flex items-center gap-1.5 cursor-pointer transition-all"
                      title="Pakai prompt ini langsung di tab Buat Gambar"
                    >
                      <Wand2 className="w-3.5 h-3.5" />
                      <span>Pakai di Buat Gambar</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopyPrompt(currentExtracted.prompt)}
                      className="p-2 rounded-xl bg-black/60 border border-slate-700/60 text-slate-300 hover:text-white backdrop-blur-md transition-all cursor-pointer"
                      title="Salin Prompt"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Prompt Breakdown Display */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#070d1a] border border-slate-800 space-y-4">
                  {/* Image & Main Prompt */}
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden border border-slate-700 bg-black/50 shrink-0">
                      <img
                        src={currentExtracted.image}
                        alt="Extracted Source"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">
                          Prompt Lengkap (Siap Generate)
                        </label>
                        <button
                          type="button"
                          onClick={() => handleCopyPrompt(currentExtracted.prompt)}
                          className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                          <Copy className="w-3 h-3" />
                          <span>Salin</span>
                        </button>
                      </div>
                      <div className="p-3 rounded-xl bg-black/50 border border-slate-800 font-mono text-xs text-slate-200 leading-relaxed select-all">
                        {currentExtracted.prompt}
                      </div>
                    </div>
                  </div>

                  {/* Detailed Analysis Breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-slate-800/80">
                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">
                        Subjek &amp; Fokus
                      </span>
                      <p className="text-xs text-slate-200">
                        {currentExtracted.detailedSubject}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">
                        Gaya Visual
                      </span>
                      <p className="text-xs text-slate-200">
                        {currentExtracted.style}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">
                        Pencahayaan
                      </span>
                      <p className="text-xs text-slate-200">
                        {currentExtracted.lighting}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-0.5">
                        Komposisi Kamera
                      </span>
                      <p className="text-xs text-slate-200">
                        {currentExtracted.composition}
                      </p>
                    </div>
                  </div>

                  {/* Tags */}
                  {currentExtracted.tags && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {currentExtracted.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-mono border border-slate-700/60"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* History Gallery */}
                {extractHistory.length > 1 && (
                  <div className="space-y-2 pt-2">
                    <p className="text-[11px] font-semibold text-slate-400">
                      Riwayat Ekstraksi ({extractHistory.length})
                    </p>
                    <div className="flex gap-2.5 overflow-x-auto pb-2 custom-scrollbar">
                      {extractHistory.map((item, idx) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setCurrentExtracted(item)}
                          className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer relative bg-slate-900 ${
                            currentExtracted.id === item.id
                              ? 'border-blue-500 shadow-md shadow-blue-500/30'
                              : 'border-slate-800 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img
                            src={item.image}
                            alt={`Extract ${idx + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <span className="absolute bottom-1 right-1 px-1 rounded bg-black/80 text-[9px] font-bold text-white">
                            #{idx + 1}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Empty State (Matches Screenshot exactly) */
              <div className="min-h-[260px] rounded-2xl bg-[#070d1a] border border-slate-800/80 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-12 h-12 flex items-center justify-center text-slate-600 mb-2">
                  <ScanLine className="w-8 h-8 stroke-[1.2]" />
                </div>
                <h4 className="text-sm font-bold text-slate-300 tracking-tight">
                  Belum ada hasil
                </h4>
                <p className="text-xs text-slate-500 mt-1">
                  Upload gambar lalu klik Ekstrak Prompt
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 9. SUB-FEATURES: Other subfeatures */}
      {activeTab !== 'gambar-buat' && activeTab !== 'gambar-mascot' && activeTab !== 'gambar-banner' && activeTab !== 'gambar-infografis' && activeTab !== 'gambar-podcast' && activeTab !== 'gambar-pov' && activeTab !== 'gambar-tryon' && activeTab !== 'gambar-extract' && (
        <div className="p-6 rounded-3xl bg-[#091122]/90 border border-slate-800 space-y-5 max-w-2xl mx-auto shadow-xl">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white font-heading capitalize">
              {activeTab.replace('gambar-', '').replace('-', ' ')} Studio
            </h3>
            <p className="text-xs text-slate-400">
              Modul kreatif khusus visual AI untuk campaign dan branding Anda
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Judul / Topik</label>
              <input
                type="text"
                value={subTitle}
                onChange={(e) => setSubTitle(e.target.value)}
                placeholder="Contoh: Diskon Kemerdekaan, Infografis Sejarah, Podcast Horor..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Detail Konten & Komposisi</label>
              <textarea
                rows={3}
                value={subDesc}
                onChange={(e) => setSubDesc(e.target.value)}
                placeholder="Keterangan teks, tata letak, warna aksen, gaya grafis..."
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
            </div>

            <button
              type="button"
              onClick={() => handleGenerateSubFeature(activeTab)}
              className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-lg cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Desain — 5 Kredit</span>
            </button>

            {subOutput && (
              <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-2 mt-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400">Spesifikasi Prompt Selesai:</span>
                  <button
                    type="button"
                    onClick={() => handleCopyPrompt(subOutput)}
                    className="text-xs text-blue-300 hover:text-white flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Salin</span>
                  </button>
                </div>
                <pre className="text-xs font-mono text-slate-200 bg-slate-900 p-3 rounded-xl whitespace-pre-wrap">
                  {subOutput}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* History Reference Selection Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0b1426] border border-slate-800 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h4 className="text-xs font-bold text-white">Pilih dari Riwayat & Sampel Acuan</h4>
              <button
                type="button"
                onClick={() => setShowHistoryModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Pilih visual acuan untuk menjaga konsistensi gaya, karakter, atau palet produk:
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { title: 'Serum Bottle Clean', color: 'from-pink-900 to-indigo-950' },
                { title: 'Indonesian Portrait', color: 'from-amber-900 to-slate-950' },
                { title: 'Neon Cyberpunk', color: 'from-cyan-900 to-purple-950' },
                { title: 'Minimalist Fashion', color: 'from-emerald-900 to-slate-950' }
              ].map((sample, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    if (refImages.length < 6) {
                      // Generate a sample data uri representation
                      const sampleSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect width="100" height="100" fill="%231e293b"/><circle cx="50" cy="50" r="30" fill="%233b82f6"/><text x="50" y="55" font-size="10" fill="white" text-anchor="middle">Ref ${idx + 1}</text></svg>`;
                      setRefImages((prev) => [...prev, sampleSvg]);
                      onShowToast(`Sampel "${sample.title}" ditambahkan ke acuan!`);
                    }
                    setShowHistoryModal(false);
                  }}
                  className={`p-3 rounded-xl bg-gradient-to-br ${sample.color} border border-slate-700/80 hover:border-blue-500 cursor-pointer transition-all text-center`}
                >
                  <ImageIcon className="w-6 h-6 text-white/80 mx-auto mb-1" />
                  <span className="text-[11px] font-bold text-white block">{sample.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Generation Error Modal */}
      <GenerationErrorModal
        isOpen={isErrorModalOpen}
        error={errorModal}
        onClose={() => setIsErrorModalOpen(false)}
        onRetry={handleGenerate}
        onOpenSettings={onNavigateSettings}
      />
    </div>
  );
};
