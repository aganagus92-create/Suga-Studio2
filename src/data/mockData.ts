import { User, AuditLog, PermissionItem, SystemNotification, TopupPlan, TutorialModule, HistoryItem, BannerConfig } from '../types';

export const initialUsers: User[] = [
  {
    id: 'usr-1',
    name: 'Aganagus (Super Admin)',
    email: 'admin@suga.io',
    role: 'SUPER_ADMIN',
    credits: 9999,
    status: 'ACTIVE',
    created: '2026-01-10',
    password: 'admin'
  },
  {
    id: 'usr-2',
    name: 'Budi Santoso (Kreator Pro)',
    email: 'user@suga.io',
    role: 'PENGGUNA',
    credits: 278,
    status: 'ACTIVE',
    created: '2026-02-14',
    password: 'user'
  },
  {
    id: 'usr-3',
    name: 'Siti Rahmawati',
    email: 'siti@suga.io',
    role: 'PENGGUNA',
    credits: 1500,
    status: 'ACTIVE',
    created: '2026-03-01',
    password: 'user123'
  },
  {
    id: 'usr-4',
    name: 'Dewi Lestari',
    email: 'dewi@suga.io',
    role: 'PENGGUNA',
    credits: 0,
    status: 'INACTIVE',
    created: '2026-03-12',
    password: 'user123'
  }
];

export const initialBannerConfig: BannerConfig = {
  badge: 'INFO',
  title: 'Halo Member SUGA',
  content: 'Kini telah hadir Seedance 2.0 Fast Pro / 2.5 , Kling, Minimax Unlimited Generate.',
  active: true
};

export const initialPermissions: PermissionItem[] = [
  {
    id: 'perm-img',
    name: 'Generate Gambar & Poster',
    admin: true,
    user: true,
    desc: 'Akses ke model Seedream 5.0, GPT Image, Mascot, Banner, dan Infografis'
  },
  {
    id: 'perm-edit-img',
    name: 'Editing Gambar & Remove BG',
    admin: true,
    user: true,
    desc: 'Hapus background otomatis, object eraser, dan perbaikan visual'
  },
  {
    id: 'perm-video',
    name: 'Video Kreatif & Motion Studio',
    admin: true,
    user: true,
    desc: 'Motion V3, Motion V4, Video Vision, dan Penggabung Video AI'
  },
  {
    id: 'perm-anim',
    name: 'Studio Animasi 50 Scene',
    admin: true,
    user: true,
    desc: 'Membuat narasi TTS, prompt T2I, dan prompt I2V per scene otomatis'
  },
  {
    id: 'perm-affiliate',
    name: 'Studio Affiliate UGC',
    admin: true,
    user: true,
    desc: 'Buat 6-panel UGC prompt dengan foto produk & konsistensi model'
  },
  {
    id: 'perm-tts',
    name: 'Text to Speech (TTS Indonesia)',
    admin: true,
    user: true,
    desc: 'Akses karakter suara vokal alami bahasa Indonesia dan dubbing'
  },
  {
    id: 'perm-music',
    name: 'Music & BGM Synthesizer',
    admin: true,
    user: true,
    desc: 'Membuat melodi synthesizer dengan instrumen etnik Nusantara'
  },
  {
    id: 'perm-materi',
    name: 'Modul Materi Kelas AI',
    admin: true,
    user: true,
    desc: 'Menonton video tutorial, trik prompt, dan strategi affiliate'
  },
  {
    id: 'perm-referral',
    name: 'Program Referral & Komisi',
    admin: true,
    user: true,
    desc: 'Membagikan kode referral dan mendapatkan komisi kredit'
  },
  {
    id: 'perm-billing',
    name: 'Billing & Top Up Kredit',
    admin: true,
    user: true,
    desc: 'Akses pembelian kredit saldo via QRIS Pakasir instan'
  },
  {
    id: 'perm-users',
    name: 'Manajemen Pengguna Sistem',
    admin: true,
    user: false,
    desc: 'Menambah, mengedit data, role, status aktif, dan saldo kredit pengguna'
  },
  {
    id: 'perm-logs',
    name: 'Log Aktivitas & Audit Trail',
    admin: true,
    user: false,
    desc: 'Melihat seluruh transaksi, IP address, login, dan jejak aktivitas sistem'
  },
  {
    id: 'perm-content',
    name: 'Kelola Konten & Data Utama',
    admin: true,
    user: false,
    desc: 'Mengedit banner pengumuman, materi tutorial, dan paket harga kredit'
  },
  {
    id: 'perm-cfg',
    name: 'Konfigurasi Sistem Global',
    admin: true,
    user: false,
    desc: 'Mengubah nama portal, kredit pendaftaran, timeout, dan batas sistem'
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'log-1',
    time: '10:14:02',
    user: 'admin@suga.io',
    action: 'LOGIN_SUCCESS_SUPERADMIN',
    level: 'INFO',
    ip: '182.253.12.90'
  },
  {
    id: 'log-2',
    time: '10:15:20',
    user: 'admin@suga.io',
    action: 'UPDATE_SYSTEM_CONFIG',
    level: 'WARNING',
    ip: '182.253.12.90'
  },
  {
    id: 'log-3',
    time: '10:20:11',
    user: 'user@suga.io',
    action: 'GENERATE_IMAGE_SEEDREAM_5',
    level: 'INFO',
    ip: '36.88.204.11'
  },
  {
    id: 'log-4',
    time: '10:25:40',
    user: 'user@suga.io',
    action: 'AFFILIATE_UGC_GENERATE_6PANEL',
    level: 'INFO',
    ip: '36.88.204.11'
  },
  {
    id: 'log-5',
    time: '10:31:15',
    user: 'siti@suga.io',
    action: 'TOPUP_QRIS_PAKASIR_SUGA_PLUS',
    level: 'INFO',
    ip: '114.124.201.88'
  }
];

export const initialNotifications: SystemNotification[] = [
  {
    id: 'notif-1',
    title: 'Selamat Datang di SUGA AI!',
    desc: 'Portal studio AI dan panel Super Admin siap digunakan secara penuh.',
    time: 'Baru saja',
    unread: true
  },
  {
    id: 'notif-2',
    title: 'Bonus Harian Aktif',
    desc: 'Akun Anda telah dikreditkan bonus pembuatan visual harian.',
    time: '10 menit lalu',
    unread: true
  },
  {
    id: 'notif-3',
    title: 'Model Seedream 5.0 Dirilis',
    desc: 'Kualitas photorealism 8k sekarang tersedia di tab Buat Gambar.',
    time: '1 jam lalu',
    unread: false
  }
];

export interface SubscriptionPlan {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  period: string;
  features: string[];
  bonusCredits?: string;
  freeCredits?: string;
}

export const regularPlan: SubscriptionPlan = {
  id: 'plan-reguler',
  name: 'Reguler',
  subtitle: 'Buat yang baru mulai',
  price: 149999,
  period: 'sekali bayar',
  freeCredits: 'Free 1000 Credits',
  bonusCredits: '+ 1.000 kredit bonus',
  features: [
    'Free 1000 Credits',
    'Akses Gambar Kreatif',
    'Akses Video Kreatif',
    'Akses Create Content',
    'Text To Speech'
  ]
};

export const topupPlans: TopupPlan[] = [
  {
    id: 'plan-lite',
    name: 'SUGA Lite',
    credits: '1.000',
    price: 19999
  },
  {
    id: 'plan-plus',
    name: 'SUGA Plus',
    credits: '1.500',
    bonus: '+200 bonus',
    price: 34999
  },
  {
    id: 'plan-pro',
    name: 'SUGA Pro',
    credits: '2.900',
    bonus: '+500 bonus',
    price: 64999,
    popular: true
  },
  {
    id: 'plan-max',
    name: 'SUGA Max',
    credits: '5.000',
    bonus: '+700 bonus',
    price: 99999
  },
  {
    id: 'plan-ultra',
    name: 'SUGA Ultra',
    credits: '8.000',
    bonus: '+1.000 bonus',
    price: 149999
  },
  {
    id: 'plan-prime',
    name: 'SUGA Prime',
    credits: '12.000',
    bonus: '+1.500 bonus',
    price: 249999
  }
];

export const tutorialModules: TutorialModule[] = [
  {
    id: 1,
    title: 'PERKENALAN TENTANG SUGA.AI | MEMBER BARU WAJIB TONTON',
    duration: '08:45',
    category: 'Dasar',
    views: '14.2k'
  },
  {
    id: 2,
    title: 'SUGA VERSI TERBARU ALL IN ONE — FITUR & PROMPT ENGINE',
    duration: '12:30',
    category: 'Studio',
    views: '9.8k'
  },
  {
    id: 3,
    title: 'TUTORIAL BIKIN KONTEN 1X KLIK AJA DI SUGA STUDIO',
    duration: '06:15',
    category: 'Otomatis',
    views: '28.5k'
  },
  {
    id: 4,
    title: 'TUTORIAL BIKIN KONTEN MANUAL DI SUGA STUDIO',
    duration: '15:20',
    category: 'Pro Tips',
    views: '7.1k'
  },
  {
    id: 5,
    title: 'COCOK UNTUK AFFILIATE TUTORIAL TIRUIN FOTO ORANG LAIN',
    duration: '10:40',
    category: 'Affiliate',
    views: '33.9k'
  },
  {
    id: 6,
    title: 'EDUKASI MEDIA PEMBELAJARAN DLL VERSI BERDIALOG',
    duration: '11:15',
    category: 'Edukasi',
    views: '12.4k'
  },
  {
    id: 7,
    title: 'FAKTA UNIK, SEJARAH DLL VERSI NARATOR',
    duration: '09:50',
    category: 'Animasi',
    views: '19.8k'
  },
  {
    id: 8,
    title: 'TUTORIAL BIKIN KONTEN OBJEK BERBICARA',
    duration: '07:35',
    category: 'Kreatif',
    views: '15.3k'
  },
  {
    id: 9,
    title: 'IKLAN PROFESIONAL KOMERSIAL BRAND LOKAL',
    duration: '14:10',
    category: 'Brand',
    views: '11.6k'
  },
  {
    id: 10,
    title: 'TUTORIAL AFFILIATE VIRTUAL TRY-ON WAJAH SENDIRI',
    duration: '13:25',
    category: 'Affiliate',
    views: '41.2k'
  },
  {
    id: 11,
    title: 'STUDIO AFFILIATE VIRAL TIKTOK & SHOPEE VIDEO',
    duration: '16:05',
    category: 'Viral',
    views: '52.7k'
  },
  {
    id: 12,
    title: 'VIDEO ANIMASI FAKTA UNIK & MENARIK 50 SCENE',
    duration: '18:40',
    category: 'Animasi',
    views: '22.1k'
  },
  {
    id: 13,
    title: 'VIDEO ANIMASI PPDB / SPMB SEKOLAH DAN KAMPUS',
    duration: '10:15',
    category: 'Pendidikan',
    views: '8.4k'
  },
  {
    id: 14,
    title: 'ANIMASI ALL IN ONE TEMA (KONSEP SENDIRI)',
    duration: '21:30',
    category: 'Storyboard',
    views: '17.9k'
  },
  {
    id: 15,
    title: 'ANIMASI MEDIA PEMBELAJARAN INTERAKTIF GURU & DOSEN',
    duration: '14:50',
    category: 'Edukasi',
    views: '13.0k'
  }
];

export const initialHistory: HistoryItem[] = [
  {
    id: 'h-1',
    type: 'Gambar Kreatif',
    title: 'Poster Produk Skincare 3D — Glow Serum',
    date: 'Hari Ini, 10:20'
  },
  {
    id: 'h-2',
    type: 'Studio Affiliate',
    title: 'UGC 6-Panel Skintific Moisture Gel',
    date: 'Hari Ini, 09:45'
  },
  {
    id: 'h-3',
    type: 'Animasi Storyboard',
    title: 'Fakta Unik Komodo — 4 Scene Narasi',
    date: 'Kemarin, 16:30'
  },
  {
    id: 'h-4',
    type: 'Text to Speech',
    title: 'Suara Sulafat — Voiceover Promosi TikTok',
    date: 'Kemarin, 14:15'
  }
];
