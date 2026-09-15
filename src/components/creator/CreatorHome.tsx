import React, { useState } from 'react';
import {
  Info,
  GraduationCap,
  ArrowRight,
  Zap,
  Crown,
  Check,
  Sparkles,
  Image as ImageIcon,
  Share2,
  Clapperboard,
  Mic2,
  Video,
  X
} from 'lucide-react';
import { ActiveView, TopupPlan, BannerConfig } from '../../types';
import { topupPlans as defaultTopupPlans, regularPlan } from '../../data/mockData';

interface CreatorHomeProps {
  onNavigate: (view: ActiveView) => void;
  credits: number;
  onOpenTopUp?: (plan?: TopupPlan) => void;
  bannerConfig?: BannerConfig;
  topupPlansList?: TopupPlan[];
}

export const CreatorHome: React.FC<CreatorHomeProps> = ({
  onNavigate,
  credits,
  onOpenTopUp,
  bannerConfig,
  topupPlansList
}) => {
  const [showSeedanceModal, setShowSeedanceModal] = useState(false);
  const activePlans = topupPlansList || defaultTopupPlans;

  const currentBanner: BannerConfig = bannerConfig || {
    badge: 'INFO',
    title: 'Halo Member SUGA',
    content: 'Kini telah hadir Seedance 2.0 Fast Pro / 2.5 , Kling, Minimax Unlimited Generate.',
    active: true
  };

  const handleSelectReguler = () => {
    const regulerPlanObj: TopupPlan = {
      id: regularPlan.id,
      name: `${regularPlan.name} (Sekali Bayar)`,
      credits: '1.000',
      bonus: '+1.000 bonus',
      price: regularPlan.price
    };
    if (onOpenTopUp) {
      onOpenTopUp(regulerPlanObj);
    } else {
      onNavigate('billing');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* 1. Page Header (Matches Image 1) */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Dashboard
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Pantau sisa kredit kamu.
        </p>
      </div>

      {/* 2. Banner INFO: Halo Member SUGA (Matches Image 1) */}
      {currentBanner.active && (
        <div className="p-3.5 sm:p-4 rounded-2xl bg-[#09152e] border border-blue-900/60 flex items-start sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
              <Info className="w-3.5 h-3.5" />
            </div>
            <div className="text-xs text-slate-200 leading-relaxed">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="px-1.5 py-0.5 rounded bg-blue-600 text-white font-bold text-[10px] tracking-wide uppercase">
                  {currentBanner.badge}
                </span>
                <span className="font-bold text-white">{currentBanner.title}</span>
              </div>
              <p className="text-slate-300">
                {currentBanner.content}{' '}
                <button
                  type="button"
                  onClick={() => setShowSeedanceModal(true)}
                  className="font-bold text-white underline hover:text-sky-300 cursor-pointer inline-block transition-colors"
                >
                  KLIK DISINI
                </button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Banner: Akses Materi Kelas (Matches Image 1) */}
      <div
        onClick={() => onNavigate('materi-kelas')}
        className="p-3.5 sm:p-4 rounded-2xl bg-[#0b1428] border border-slate-800/80 hover:border-slate-700 flex items-center justify-between cursor-pointer transition-all shadow-lg group"
      >
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-sky-950/80 border border-sky-800/40 text-sky-400 flex items-center justify-center shrink-0">
            <GraduationCap className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
              Akses Materi Kelas
            </h3>
            <p className="text-[11px] text-slate-400">
              Buka materi & rekaman untuk member kelas.
            </p>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
      </div>

      {/* 4. Two-Column Dashboard Grid: Sisa Kredit & Topup Kredit (Matches Image 1) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: Sisa Kredit Card */}
        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0b1329] border border-slate-800/90 flex flex-col justify-between space-y-6 shadow-xl">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-slate-200 font-semibold text-xs">
              <div className="w-6 h-6 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 fill-current" />
              </div>
              <span>Sisa Kredit</span>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {credits.toLocaleString('id-ID')}
                </span>
                <span className="text-sm font-medium text-slate-400">
                  / {credits.toLocaleString('id-ID')} kredit
                </span>
              </div>
            </div>

            {/* Bright blue progress bar */}
            <div className="space-y-1.5 pt-1">
              <div className="w-full h-2 rounded-full bg-slate-800/90 overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-500"
                  style={{ width: '100%' }}
                />
              </div>
              <p className="text-[11px] text-slate-400">Terpakai 0 kredit (0%)</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('riwayat')}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1.5 cursor-pointer transition-colors text-left pt-4 border-t border-slate-800/50"
          >
            <span>Lihat detail penggunaan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right Column: Topup Kredit List (Matches Image 1) */}
        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0b1329] border border-slate-800/90 space-y-3 shadow-xl">
          <div className="flex items-center gap-2 text-white font-bold text-xs">
            <span className="text-cyan-400 text-base font-black leading-none">+</span>
            <span>Topup Kredit</span>
          </div>

          <div className="space-y-2">
            {activePlans.map((plan) => (
              <div
                key={plan.id}
                className="p-2.5 sm:p-3 rounded-xl bg-[#070e20]/70 border border-slate-800/70 hover:border-slate-700 flex items-center justify-between gap-3 transition-all"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0 text-sm">
                    🪙
                  </div>
                  <div className="truncate">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-bold text-white">
                        {plan.credits} Kredit
                      </span>
                      {plan.bonus && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 font-semibold border border-blue-800/40">
                          {plan.bonus}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">
                      {plan.name}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs font-bold text-white font-mono">
                    Rp {plan.price.toLocaleString('id-ID')}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (onOpenTopUp) onOpenTopUp(plan);
                      else onNavigate('billing');
                    }}
                    className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold shadow-md transition-colors cursor-pointer"
                  >
                    Topup
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 5. Section: Pilih Paket (Matches Image 1) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-white">
                Pilih Paket
              </h3>
              <p className="text-[11px] text-slate-400">
                Bayar sekali, akses fitur premium selamanya.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('billing')}
            className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>Lihat semua</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Reguler Plan Card */}
          <div className="p-5 rounded-2xl bg-[#0b1329] border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 shadow-xl">
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-bold text-white">
                  {regularPlan.name}
                </h4>
                <p className="text-[11px] text-slate-400">
                  {regularPlan.subtitle}
                </p>
              </div>

              <div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-bold text-white">
                    Rp {regularPlan.price.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    · {regularPlan.period}
                  </span>
                </div>
              </div>

              <ul className="space-y-1.5 text-xs text-slate-300 pt-1">
                {regularPlan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="pt-1">
                <span className="inline-block text-[11px] font-semibold text-blue-300 bg-blue-900/40 border border-blue-800/40 px-2.5 py-0.5 rounded-md">
                  {regularPlan.bonusCredits}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSelectReguler}
              className="w-full py-2.5 rounded-xl border border-slate-700/80 hover:border-blue-500 bg-[#070e20] hover:bg-blue-600/10 text-white text-xs font-semibold transition-all cursor-pointer text-center"
            >
              Pilih Paket
            </button>
          </div>
        </div>
      </div>

      {/* 6. Quick Studio Access Tiles */}
      <div className="pt-4 border-t border-slate-800/70 space-y-3">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Studio AI & Generator
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={() => onNavigate('gambar-buat')}
            className="p-3.5 rounded-xl bg-[#0b1329] border border-slate-800/80 hover:border-pink-500/50 flex items-center gap-2.5 text-left transition-all group cursor-pointer shadow"
          >
            <div className="w-8 h-8 rounded-lg bg-pink-500/20 text-pink-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white group-hover:text-pink-300 transition-colors">
                Gambar Kreatif
              </p>
              <p className="text-[10px] text-slate-400">Seedream 5.0 & GPT</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('video-buat')}
            className="p-3.5 rounded-xl bg-[#0b1329] border border-slate-800/80 hover:border-blue-500/50 flex items-center gap-2.5 text-left transition-all group cursor-pointer shadow"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white group-hover:text-blue-300 transition-colors">
                Video Kreatif
              </p>
              <p className="text-[10px] text-slate-400">Seedance 2.5 & Kling</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('content-animasi')}
            className="p-3.5 rounded-xl bg-[#0b1329] border border-slate-800/80 hover:border-amber-500/50 flex items-center gap-2.5 text-left transition-all group cursor-pointer shadow"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Clapperboard className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                Studio Animasi
              </p>
              <p className="text-[10px] text-slate-400">50 Scene Storyboard</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('tts')}
            className="p-3.5 rounded-xl bg-[#0b1329] border border-slate-800/80 hover:border-indigo-500/50 flex items-center gap-2.5 text-left transition-all group cursor-pointer shadow"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
              <Mic2 className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-white group-hover:text-indigo-300 transition-colors">
                Text to Speech
              </p>
              <p className="text-[10px] text-slate-400">12 Karakter Suara ID</p>
            </div>
          </button>
        </div>
      </div>

      {/* Pop-up Modal for Seedance 2.0 Announcement */}
      {showSeedanceModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1329] border border-blue-800/70 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative text-slate-100 animate-in fade-in zoom-in-95">
            <button
              type="button"
              onClick={() => setShowSeedanceModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Seedance 2.0 Fast Pro / 2.5
                </h3>
                <p className="text-xs text-blue-400">
                  Kling & Minimax Unlimited Generator
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Kini seluruh generator video telah diperbarui ke mesin generasi terbaru:
              resolusi ultra-tajam, konsistensi fisik gerak tingkat tinggi, dan rendering sinematik real-time.
            </p>

            <div className="p-3 rounded-xl bg-[#080e20] border border-slate-800 text-xs space-y-1.5">
              <p className="text-slate-300 font-semibold">✨ Fitur Unggulan Baru:</p>
              <ul className="list-disc list-inside text-[11px] text-slate-400 space-y-1">
                <li>Seedance 2.0 Fast Pro: Render 5x lebih cepat</li>
                <li>Seedance 2.5 Sinematik: Gerak kamera 360° & drone pan</li>
                <li>Kling AI & Minimax: Realisme fisika kain & air</li>
              </ul>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowSeedanceModal(false);
                  onNavigate('video-buat');
                }}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer text-center"
              >
                Buka Video Kreatif
              </button>
              <button
                type="button"
                onClick={() => setShowSeedanceModal(false)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer"
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
