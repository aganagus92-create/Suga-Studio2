export type UserRole = 'SUPER_ADMIN' | 'PENGGUNA';

export type UserStatus = 'ACTIVE' | 'INACTIVE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  credits: number;
  status: UserStatus;
  created: string;
  password?: string;
  avatar?: string;
}

export interface BannerConfig {
  badge: string;
  title: string;
  content: string;
  active: boolean;
}

export interface AuditLog {
  id: string;
  time: string;
  user: string;
  action: string;
  level: 'INFO' | 'WARNING' | 'CRITICAL';
  ip: string;
}

export interface PermissionItem {
  id: string;
  name: string;
  admin: boolean;
  user: boolean;
  desc: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
}

export interface TopupPlan {
  id: string;
  name: string;
  credits: string;
  bonus?: string;
  price: number;
  popular?: boolean;
}

export interface TutorialModule {
  id: number;
  title: string;
  duration: string;
  category: string;
  views: string;
}

export interface HistoryItem {
  id: string;
  type: string;
  title: string;
  date: string;
  preview?: string;
}

export type ActiveTheme = 'samudra' | 'emerald' | 'merahputih';

export type ActiveView =
  | 'dashboard'
  | 'creator-home'
  | 'asisten'
  | 'agus-asisten'
  | 'labs'
  | 'unlimited'
  | 'gambar-buat'
  | 'gambar-mascot'
  | 'gambar-banner'
  | 'gambar-infografis'
  | 'gambar-podcast'
  | 'gambar-pov'
  | 'gambar-tryon'
  | 'gambar-extract'
  | 'image-remove-bg'
  | 'image-removebg'
  | 'video-buat'
  | 'video-motion-v3'
  | 'video-motion-v4'
  | 'video-vision'
  | 'video-gabung'
  | 'content-animasi'
  | 'content-ide'
  | 'affiliate'
  | 'studio-affiliate'
  | 'music'
  | 'sound-music'
  | 'tts'
  | 'tts-id'
  | 'materi-kelas'
  | 'riwayat'
  | 'billing'
  | 'billing-credits'
  | 'referral'
  | 'settings'
  | 'admin-dashboard'
  | 'admin-users'
  | 'admin-permissions'
  | 'admin-logs'
  | 'admin-reports'
  | 'admin-config'
  | 'admin-content'
  | 'admin-providers'
  | '403';
