import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Key,
  Activity,
  FileText,
  Sliders,
  FileCode2,
  Lock,
  Home,
  Bot,
  FlaskConical,
  Infinity as InfinityIcon,
  Image as ImageIcon,
  Scissors,
  Sparkles,
  Clapperboard,
  Share2,
  Music,
  Mic2,
  GraduationCap,
  History,
  CreditCard,
  Gift,
  Settings,
  LogOut,
  ChevronDown,
  ChevronUp,
  X,
  ShieldCheck,
  Server
} from 'lucide-react';
import { ActiveView, User, PermissionItem } from '../types';

interface SidebarProps {
  currentView: ActiveView;
  onSelectView: (view: ActiveView) => void;
  currentUser: User | null;
  credits: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onLogout: () => void;
  permissions?: PermissionItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  currentUser,
  credits,
  isOpenMobile,
  onCloseMobile,
  onLogout,
  permissions = []
}) => {
  // Dropdown menus open state
  const [openGambar, setOpenGambar] = useState(false);
  const [openEditing, setOpenEditing] = useState(false);
  const [openVideo, setOpenVideo] = useState(false);
  const [openContent, setOpenContent] = useState(true);

  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';

  const isFeatureLocked = (permId: string) => {
    if (isSuperAdmin) return false;
    if (!permissions || permissions.length === 0) return false;
    const p = permissions.find((item) => item.id === permId);
    return p ? p.user === false : false;
  };

  const handleNav = (view: ActiveView) => {
    onSelectView(view);
    onCloseMobile();
  };

  const isActive = (view: ActiveView) => currentView === view;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        id="main-sidebar"
        className={`w-64 bg-[#0B1120] border-r border-slate-800/90 flex flex-col justify-between shrink-0 fixed md:sticky top-0 h-screen z-40 transition-transform duration-300 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="overflow-y-auto max-h-[calc(100vh-60px)] custom-scrollbar">
          
          {/* Brand Header */}
          <div
            onClick={() => handleNav(isSuperAdmin ? 'admin-dashboard' : 'dashboard')}
            className="p-4 border-b border-slate-800/90 flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-violet-600 to-pink-500 p-0.5 shadow-md flex items-center justify-center">
                <div className="w-full h-full bg-[#0B1120] rounded-[10px] flex items-center justify-center">
                  <span className="font-black text-sm text-pink-400">S</span>
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="font-black text-base tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-300 to-white font-heading">
                    SUGA
                  </span>
                  <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-purple-600 text-white">
                    {isSuperAdmin ? 'SUPER ADMIN' : 'PRO'}
                  </span>
                </div>
                <p className="text-[9px] tracking-widest text-slate-400 font-medium uppercase">
                  AI Creative Suite
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onCloseMobile();
              }}
              className="md:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="p-3 space-y-1 text-[13px] font-medium text-slate-200">
            
            {/* SUPER ADMIN EXCLUSIVE AREA */}
            {isSuperAdmin && (
              <div className="space-y-1 pb-2.5 mb-2.5 border-b border-purple-900/40">
                <div className="px-3 pt-1 text-[10px] font-black uppercase tracking-wider text-pink-400 flex items-center justify-between">
                  <span>Super Admin Area</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-pink-400" />
                </div>

                <button
                  type="button"
                  onClick={() => handleNav('admin-dashboard')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl transition-all ${
                    isActive('admin-dashboard')
                      ? 'bg-[#111A2E] ring-1 ring-white/10 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-pink-500/20 border border-pink-500/30 text-pink-400 flex items-center justify-center shrink-0">
                    <LayoutDashboard className="w-4 h-4" />
                  </div>
                  <span>Dashboard Admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNav('admin-users')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl transition-all ${
                    isActive('admin-users')
                      ? 'bg-[#111A2E] ring-1 ring-white/10 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <span>Kelola Pengguna</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNav('admin-permissions')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl transition-all ${
                    isActive('admin-permissions')
                      ? 'bg-[#111A2E] ring-1 ring-white/10 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
                    <Key className="w-4 h-4" />
                  </div>
                  <span>Role & Permission</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNav('admin-logs')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl transition-all ${
                    isActive('admin-logs')
                      ? 'bg-[#111A2E] ring-1 ring-white/10 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                    <Activity className="w-4 h-4" />
                  </div>
                  <span>Log Aktivitas Sistem</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNav('admin-reports')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl transition-all ${
                    isActive('admin-reports')
                      ? 'bg-[#111A2E] ring-1 ring-white/10 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-sky-500/20 border border-sky-500/30 text-sky-400 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <span>Laporan & Ekspor</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNav('admin-content')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl transition-all ${
                    isActive('admin-content')
                      ? 'bg-[#111A2E] ring-1 ring-white/10 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-300 flex items-center justify-center shrink-0">
                    <FileCode2 className="w-4 h-4" />
                  </div>
                  <span>Kelola Konten & Data</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNav('admin-config')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl transition-all ${
                    isActive('admin-config')
                      ? 'bg-[#111A2E] ring-1 ring-white/10 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-slate-700/50 border border-slate-600/40 text-slate-300 flex items-center justify-center shrink-0">
                    <Sliders className="w-4 h-4" />
                  </div>
                  <span>Konfigurasi Sistem</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNav('admin-providers')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl transition-all ${
                    isActive('admin-providers')
                      ? 'bg-[#111A2E] ring-1 ring-white/10 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
                    <Server className="w-4 h-4" />
                  </div>
                  <span>Kelola AI Provider</span>
                </button>
              </div>
            )}

            {/* WORKSPACE UTAMA DENGAN VIBRANT SQUIRCLE BADGES */}
            <div className="px-3 pt-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Workspace Utama
            </div>

            {/* 1. Home */}
            <button
              type="button"
              onClick={() => handleNav('dashboard')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl transition-all group ${
                isActive('dashboard')
                  ? 'bg-[#111A2E] ring-1 ring-white/10 text-white shadow-lg'
                  : 'text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-[#2563EB] shadow-md shadow-blue-600/30 flex items-center justify-center shrink-0 text-white group-hover:scale-105 transition-transform">
                <Home className="w-4 h-4" />
              </div>
              <span>Home</span>
            </button>

            {/* 2. Agus Asisten */}
            <button
              type="button"
              onClick={() => handleNav('asisten')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all group ${
                isActive('asisten')
                  ? 'bg-[#111A2E] ring-1 ring-white/10 text-white shadow-lg'
                  : 'text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-[#0EA5E9] shadow-md shadow-sky-500/30 flex items-center justify-center shrink-0 text-white group-hover:scale-105 transition-transform">
                  <Bot className="w-4 h-4" />
                </div>
                <span>Agus Asisten</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-bold border border-sky-500/30">
                AI
              </span>
            </button>

            {/* 3. Labs Generate */}
            <button
              type="button"
              onClick={() => handleNav('gambar-buat')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl transition-all group ${
                isActive('gambar-buat')
                  ? 'bg-[#111A2E] ring-1 ring-white/10 text-white shadow-lg'
                  : 'text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-[#F59E0B] shadow-md shadow-amber-500/30 flex items-center justify-center shrink-0 text-white group-hover:scale-105 transition-transform">
                <FlaskConical className="w-4 h-4" />
              </div>
              <span>Labs Generate</span>
            </button>

            {/* 4. Unlimited Generate */}
            <button
              type="button"
              onClick={() => handleNav('billing')}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-200 hover:bg-slate-800/60 transition-all group"
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-[#8B5CF6] shadow-md shadow-purple-500/30 flex items-center justify-center shrink-0 text-white group-hover:scale-105 transition-transform">
                  <InfinityIcon className="w-4 h-4" />
                </div>
                <span>Unlimited Generate</span>
              </div>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold">
                PRO
              </span>
            </button>

            {/* 5. Gambar Kreatif Dropdown */}
            <div className="space-y-0.5 pt-0.5">
              <button
                type="button"
                onClick={() => setOpenGambar(!openGambar)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-200 hover:bg-slate-800/60 transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-[#EC4899] shadow-md shadow-pink-500/30 flex items-center justify-center shrink-0 text-white group-hover:scale-105 transition-transform">
                    <ImageIcon className="w-4 h-4" />
                  </div>
                  <span>Gambar Kreatif</span>
                </div>
                {openGambar ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {openGambar && (
                <div className="pl-12 pr-2 space-y-0.5 py-1 text-xs">
                  <button
                    type="button"
                    onClick={() => handleNav('gambar-buat')}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg block transition-colors ${
                      isActive('gambar-buat')
                        ? 'text-white bg-slate-800 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    Buat Gambar
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNav('gambar-mascot')}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg block transition-colors ${
                      isActive('gambar-mascot')
                        ? 'text-white bg-slate-800 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    Buat Mascot
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNav('gambar-banner')}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg block transition-colors ${
                      isActive('gambar-banner')
                        ? 'text-white bg-slate-800 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    Buat Banner
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNav('gambar-infografis')}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg block transition-colors ${
                      isActive('gambar-infografis')
                        ? 'text-white bg-slate-800 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    Infografis
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNav('gambar-podcast')}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg block transition-colors ${
                      isActive('gambar-podcast')
                        ? 'text-white bg-slate-800 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    Studio Podcast
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNav('gambar-pov')}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg block transition-colors ${
                      isActive('gambar-pov')
                        ? 'text-white bg-slate-800 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    POV Produk
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNav('gambar-tryon')}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg block transition-colors ${
                      isActive('gambar-tryon')
                        ? 'text-white bg-slate-800 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    Virtual Try On
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNav('gambar-extract')}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg block transition-colors ${
                      isActive('gambar-extract')
                        ? 'text-white bg-slate-800 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    Extract Image
                  </button>
                </div>
              )}
            </div>

            {/* 6. Image Editing Dropdown */}
            <div className="space-y-0.5">
              <button
                type="button"
                onClick={() => setOpenEditing(!openEditing)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-200 hover:bg-slate-800/60 transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-[#06B6D4] shadow-md shadow-cyan-500/30 flex items-center justify-center shrink-0 text-white group-hover:scale-105 transition-transform">
                    <Scissors className="w-4 h-4" />
                  </div>
                  <span>Image Editing</span>
                </div>
                {openEditing ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {openEditing && (
                <div className="pl-12 pr-2 space-y-0.5 py-1 text-xs">
                  <button
                    type="button"
                    onClick={() => handleNav('image-remove-bg')}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg block transition-colors ${
                      isActive('image-remove-bg')
                        ? 'text-white bg-slate-800 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    Remove Background
                  </button>
                </div>
              )}
            </div>

            {/* 7. Video Kreatif Dropdown */}
            <div className="space-y-0.5">
              <button
                type="button"
                onClick={() => setOpenVideo(!openVideo)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-slate-200 hover:bg-slate-800/60 transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-[#6366F1] shadow-md shadow-indigo-600/30 flex items-center justify-center shrink-0 text-white group-hover:scale-105 transition-transform">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span>Video Kreatif</span>
                </div>
                {openVideo ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {openVideo && (
                <div className="pl-12 pr-2 space-y-0.5 py-1 text-xs">
                  <button
                    type="button"
                    onClick={() => handleNav('video-buat')}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg block transition-colors ${
                      isActive('video-buat')
                        ? 'text-white bg-slate-800 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    Buat Video AI
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNav('video-motion-v3')}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg block transition-colors ${
                      isActive('video-motion-v3')
                        ? 'text-white bg-slate-800 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    Motion Control V3
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNav('video-vision')}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg block transition-colors ${
                      isActive('video-vision')
                        ? 'text-white bg-slate-800 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    Vision Prompt
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNav('video-gabung')}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg block transition-colors ${
                      isActive('video-gabung') || isActive('video-motion-v4')
                        ? 'text-white bg-slate-800 font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    Gabung Video
                  </button>
                </div>
              )}
            </div>

            {/* 8. Studio Animasi Dropdown */}
            <div className="space-y-0.5">
              <button
                type="button"
                onClick={() => setOpenContent(!openContent)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all group ${
                  isActive('content-animasi') || isActive('content-ide')
                    ? 'text-white bg-[#111A2E] ring-1 ring-white/10'
                    : 'text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-[#F59E0B] shadow-md shadow-amber-500/30 flex items-center justify-center shrink-0 text-white group-hover:scale-105 transition-transform">
                    <Clapperboard className="w-4 h-4" />
                  </div>
                  <span>Studio Animasi</span>
                </div>
                {openContent ? (
                  <ChevronUp className="w-4 h-4 text-slate-300" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-300" />
                )}
              </button>

              {openContent && (
                <div className="pl-12 pr-2 space-y-0.5 py-1 text-xs">
                  <button
                    type="button"
                    onClick={() => handleNav('content-animasi')}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg block transition-colors ${
                      isActive('content-animasi')
                        ? 'text-purple-300 font-semibold bg-purple-950/40 border border-purple-800/50'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    Animasi Storyboard
                  </button>
                  <button
                    type="button"
                    onClick={() => handleNav('content-ide')}
                    className={`w-full text-left py-1.5 px-2.5 rounded-lg block transition-colors ${
                      isActive('content-ide')
                        ? 'text-purple-300 font-semibold bg-purple-950/40 border border-purple-800/50'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    Studio Animasi
                  </button>
                </div>
              )}
            </div>

            {/* 9. Studio Affiliate */}
            <button
              type="button"
              onClick={() => handleNav('affiliate')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl transition-all group ${
                isActive('affiliate')
                  ? 'bg-[#111A2E] ring-1 ring-white/10 text-white shadow-lg'
                  : 'text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-600 shadow-md shadow-emerald-600/30 flex items-center justify-center shrink-0 text-white group-hover:scale-105 transition-transform">
                <Share2 className="w-4 h-4" />
              </div>
              <span>Studio Affiliate</span>
            </button>

            {/* 10. Music Generator */}
            <button
              type="button"
              onClick={() => handleNav('music')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl transition-all group ${
                isActive('music')
                  ? 'bg-[#111A2E] ring-1 ring-white/10 text-white shadow-lg'
                  : 'text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-pink-600 shadow-md shadow-pink-600/30 flex items-center justify-center shrink-0 text-white group-hover:scale-105 transition-transform">
                <Music className="w-4 h-4" />
              </div>
              <span>Music Generator</span>
            </button>

            {/* 11. Text to Speech */}
            <button
              type="button"
              onClick={() => handleNav('tts')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl transition-all group ${
                isActive('tts')
                  ? 'bg-[#111A2E] ring-1 ring-white/10 text-white shadow-lg'
                  : 'text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-600 shadow-md shadow-indigo-600/30 flex items-center justify-center shrink-0 text-white group-hover:scale-105 transition-transform">
                <Mic2 className="w-4 h-4" />
              </div>
              <span>Text to Speech</span>
            </button>

            {/* 12. Materi Kelas */}
            <button
              type="button"
              onClick={() => handleNav('materi-kelas')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl transition-all group ${
                isActive('materi-kelas')
                  ? 'bg-[#111A2E] ring-1 ring-white/10 text-white shadow-lg'
                  : 'text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-amber-600 shadow-md shadow-amber-600/30 flex items-center justify-center shrink-0 text-white group-hover:scale-105 transition-transform">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span>Materi Kelas</span>
            </button>

            {/* 13. Riwayat Generasi */}
            <button
              type="button"
              onClick={() => handleNav('riwayat')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl transition-all group ${
                isActive('riwayat')
                  ? 'bg-[#111A2E] ring-1 ring-white/10 text-white shadow-lg'
                  : 'text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-slate-700 shadow-md shadow-slate-700/30 flex items-center justify-center shrink-0 text-white group-hover:scale-105 transition-transform">
                <History className="w-4 h-4" />
              </div>
              <span>Riwayat Generasi</span>
            </button>

            {/* BILLING & AKUN */}
            <div className="pt-2.5 pb-1 px-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
              Billing & Akun
            </div>

            <button
              type="button"
              onClick={() => handleNav('billing')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all group ${
                isActive('billing')
                  ? 'bg-[#111A2E] ring-1 ring-white/10 text-white shadow-lg'
                  : 'text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-sky-600 shadow-md shadow-sky-600/30 flex items-center justify-center shrink-0 text-white group-hover:scale-105 transition-transform">
                  <CreditCard className="w-4 h-4" />
                </div>
                <span>Credits</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-mono font-bold">
                {credits.toLocaleString('id-ID')}
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleNav('referral')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl transition-all group ${
                isActive('referral')
                  ? 'bg-[#111A2E] ring-1 ring-white/10 text-white shadow-lg'
                  : 'text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-purple-600 shadow-md shadow-purple-600/30 flex items-center justify-center shrink-0 text-white group-hover:scale-105 transition-transform">
                <Gift className="w-4 h-4" />
              </div>
              <span>Program Referral</span>
            </button>

            <button
              type="button"
              onClick={() => handleNav('settings')}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl transition-all group ${
                isActive('settings')
                  ? 'bg-[#111A2E] ring-1 ring-white/10 text-white shadow-lg'
                  : 'text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 shadow-md flex items-center justify-center shrink-0 text-slate-300 group-hover:scale-105 transition-transform">
                <Settings className="w-4 h-4" />
              </div>
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800/90 bg-slate-900/50 flex items-center justify-between text-[11px] text-slate-400">
          <span>Suga Engine v1.0</span>
          <button
            type="button"
            onClick={onLogout}
            className="text-rose-400 hover:text-rose-300 flex items-center space-x-1 font-bold cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};
