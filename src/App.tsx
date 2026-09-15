import React, { useState } from 'react';
import {
  ActiveView,
  User,
  TopupPlan,
  HistoryItem,
  SystemNotification,
  AuditLog,
  PermissionItem,
  BannerConfig,
  TutorialModule
} from './types';
import {
  initialUsers,
  initialNotifications,
  initialAuditLogs,
  initialPermissions,
  initialBannerConfig,
  topupPlans as initialTopupPlans,
  tutorialModules as initialTutorialModules
} from './data/mockData';

// Layout & Core Components
import { AuthScreen } from './components/AuthScreen';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Toast } from './components/Toast';
import { Forbidden403 } from './components/Forbidden403';
import { PermissionRestricted } from './components/PermissionRestricted';
import { SafeLogoutModal } from './components/SafeLogoutModal';
import { PakasirModal } from './components/PakasirModal';

// Admin Views
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminUsers } from './components/admin/AdminUsers';
import { AdminPermissions } from './components/admin/AdminPermissions';
import { AdminLogs } from './components/admin/AdminLogs';
import { AdminReports } from './components/admin/AdminReports';
import { AdminConfig } from './components/admin/AdminConfig';
import { AdminContent } from './components/admin/AdminContent';
import { ProviderManager } from './components/admin/ProviderManager';

// Creator Views
import { CreatorHome } from './components/creator/CreatorHome';
import { AgusAsisten } from './components/creator/AgusAsisten';
import { GambarKreatif } from './components/creator/GambarKreatif';
import { ImageEditing } from './components/creator/ImageEditing';
import { VideoKreatif } from './components/creator/VideoKreatif';
import { CreateContent } from './components/creator/CreateContent';
import { StudioAffiliate } from './components/creator/StudioAffiliate';
import { MusicGenerator } from './components/creator/MusicGenerator';
import { TextToSpeech } from './components/creator/TextToSpeech';
import { MateriKelas } from './components/creator/MateriKelas';
import { RiwayatGenerasi } from './components/creator/RiwayatGenerasi';
import { BillingCredits } from './components/creator/BillingCredits';
import { ProgramReferral } from './components/creator/ProgramReferral';
import { SettingsView } from './components/creator/SettingsView';

export default function App() {
  // App Global State
  const [usersList, setUsersList] = useState<User[]>(initialUsers);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);
  const [permissions, setPermissions] = useState<PermissionItem[]>(initialPermissions);
  const [bannerConfig, setBannerConfig] = useState<BannerConfig>(initialBannerConfig);
  const [topupPlansList, setTopupPlansList] = useState<TopupPlan[]>(initialTopupPlans);
  const [tutorialModulesList, setTutorialModulesList] = useState<TutorialModule[]>(initialTutorialModules);

  // Default to the Super Admin user so user can test full capabilities immediately
  const [currentUser, setCurrentUser] = useState<User | null>(initialUsers[0]);
  const [currentView, setCurrentView] = useState<ActiveView>('creator-home');
  const [credits, setCredits] = useState<number>(currentUser?.credits ?? 278);
  const [currentTheme, setCurrentTheme] = useState<string>(''); // Default Obsidian Night
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);

  // Notifications State
  const [notifications, setNotifications] = useState<SystemNotification[]>(initialNotifications);

  // Modals State
  const [isPakasirOpen, setIsPakasirOpen] = useState<boolean>(false);
  const [selectedPlan, setSelectedPlan] = useState<TopupPlan | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);
  const [animateVideoData, setAnimateVideoData] = useState<{ image: string; prompt?: string } | null>(null);

  // Toast Notification State
  const [toast, setToast] = useState<{ show: boolean; message: string; type?: 'info' | 'success' | 'error' }>({
    show: false,
    message: ''
  });

  // History State
  const [history, setHistory] = useState<HistoryItem[]>([
    {
      id: 'h-1',
      type: 'Gambar Kreatif',
      title: 'Commercial aesthetic product shot of serum bottle',
      date: '10:30 Hari ini'
    },
    {
      id: 'h-2',
      type: 'Studio Affiliate',
      title: 'Serum Retinol Barrier Skintific (6 Panel)',
      date: '09:15 Hari ini'
    },
    {
      id: 'h-3',
      type: 'Animasi Storyboard',
      title: 'SPMB SMK ISLAM AN-NUURU TIRTOYUDO',
      date: 'Kemarin'
    }
  ]);

  // Toast helper
  const showToast = (message: string, type: 'info' | 'success' | 'error' = 'info') => {
    setToast({ show: true, message, type });
  };

  // Credit Deduction handler
  const handleDeductCredits = (amount: number): boolean => {
    if (credits < amount) {
      showToast(`Kredit Anda tidak mencukupi (${credits} tersisa). Diperlukan ${amount} kredit. Silakan topup.`, 'error');
      setSelectedPlan(topupPlansList[2] || initialTopupPlans[2]);
      setIsPakasirOpen(true);
      return false;
    }
    const updated = credits - amount;
    setCredits(updated);
    if (currentUser) {
      const updatedUser = { ...currentUser, credits: updated };
      setCurrentUser(updatedUser);
      setUsersList((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
    }
    return true;
  };

  // History Logger
  const handleAddHistory = (type: string, title: string) => {
    const newItem: HistoryItem = {
      id: 'h-' + Date.now(),
      type,
      title,
      date: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' Hari ini'
    };
    setHistory((prev) => [newItem, ...prev]);
  };

  // Topup plan selection
  const handleSelectPlan = (plan: TopupPlan) => {
    setSelectedPlan(plan);
    setIsPakasirOpen(true);
  };

  // Payment Success Handler
  const handleTopupSuccess = (gainedCredits: number) => {
    const newBal = credits + gainedCredits;
    setCredits(newBal);
    if (currentUser) {
      const updatedUser = { ...currentUser, credits: newBal };
      setCurrentUser(updatedUser);
      setUsersList((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));
    }
    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        time: new Date().toLocaleTimeString('id-ID'),
        user: currentUser?.email || 'user@suga.io',
        action: `TOPUP_SUCCESS_${gainedCredits}_CREDITS`,
        level: 'INFO',
        ip: '182.253.12.90'
      },
      ...prev
    ]);
    showToast(`Topup berhasil! +${gainedCredits} kredit ditambahkan ke akun Anda.`, 'success');
  };

  // Login handler
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setCredits(user.credits);
    setCurrentView(user.role === 'SUPER_ADMIN' ? 'admin-dashboard' : 'creator-home');
    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        time: new Date().toLocaleTimeString('id-ID'),
        user: user.email,
        action: `LOGIN_SUCCESS_ROLE_${user.role}`,
        level: 'INFO',
        ip: '182.253.12.90'
      },
      ...prev
    ]);
    showToast(`Selamat datang, ${user.name}! Masuk sebagai ${user.role}.`, 'success');
  };

  // Logout safe confirmation handler
  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    if (currentUser) {
      setAuditLogs((prev) => [
        {
          id: `log-${Date.now()}`,
          time: new Date().toLocaleTimeString('id-ID'),
          user: currentUser.email,
          action: 'LOGOUT_SAFE_SESSION',
          level: 'INFO',
          ip: '182.253.12.90'
        },
        ...prev
      ]);
    }
    setCurrentUser(null);
    showToast('Sesi akun Anda telah ditutup secara aman.', 'info');
  };

  // Clear notifications
  const handleClearNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    showToast('Semua notifikasi telah ditandai dibaca.', 'info');
  };

  // Clear history
  const handleClearHistory = () => {
    setHistory([]);
    showToast('Riwayat generasi dibersihkan.', 'info');
  };

  // Admin User Handlers
  const handleAddUser = (newUser: Omit<User, 'id' | 'created'>) => {
    const createdUser: User = {
      ...newUser,
      id: `usr-${Date.now()}`,
      created: new Date().toISOString().split('T')[0]
    };
    setUsersList((prev) => [createdUser, ...prev]);
    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        time: new Date().toLocaleTimeString('id-ID'),
        user: currentUser?.email || 'admin@suga.io',
        action: `CREATE_USER_${newUser.email}`,
        level: 'INFO',
        ip: '182.253.12.90'
      },
      ...prev
    ]);
    showToast(`Pengguna baru ${newUser.name} berhasil ditambahkan!`, 'success');
  };

  const handleEditUser = (userId: string, updatedData: Partial<User>) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const updated = { ...u, ...updatedData };
          if (currentUser && currentUser.id === userId) {
            setCurrentUser(updated);
            if (updated.credits !== undefined) setCredits(updated.credits);
          }
          return updated;
        }
        return u;
      })
    );
    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        time: new Date().toLocaleTimeString('id-ID'),
        user: currentUser?.email || 'admin@suga.io',
        action: `EDIT_USER_${userId}`,
        level: 'INFO',
        ip: '182.253.12.90'
      },
      ...prev
    ]);
    showToast('Data pengguna berhasil diperbarui!', 'success');
  };

  const handleToggleUserStatus = (userId: string) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          const nextStatus = u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
          showToast(`Status ${u.name} diubah menjadi ${nextStatus}`, 'info');
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const handleDeleteUser = (userId: string) => {
    setUsersList((prev) => prev.filter((u) => u.id !== userId));
    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        time: new Date().toLocaleTimeString('id-ID'),
        user: currentUser?.email || 'admin@suga.io',
        action: `DELETE_USER_${userId}`,
        level: 'WARN',
        ip: '182.253.12.90'
      },
      ...prev
    ]);
    showToast('Pengguna berhasil dihapus dari sistem.', 'info');
  };

  const handleUpdateUserCredits = (userId: string, newCredits: number) => {
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          if (currentUser && currentUser.id === userId) {
            setCredits(newCredits);
            setCurrentUser({ ...currentUser, credits: newCredits });
          }
          return { ...u, credits: newCredits };
        }
        return u;
      })
    );
    showToast('Saldo kredit pengguna berhasil diperbarui.', 'success');
  };

  const handleExportUsersCSV = () => {
    const headers = 'ID,Nama,Email,Role,Kredit,Status,Tanggal Dibuat\n';
    const rows = (usersList || [])
      .map((u) => `"${u.id}","${u.name}","${u.email}","${u.role}",${u.credits},"${u.status}","${u.created}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Suga_Users_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Data pengguna berhasil diekspor ke CSV!', 'success');
  };

  // Permission Handlers
  const handleSavePermissions = (updated: PermissionItem[]) => {
    setPermissions(updated);
    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        time: new Date().toLocaleTimeString('id-ID'),
        user: currentUser?.email || 'admin@suga.io',
        action: 'UPDATE_RBAC_PERMISSIONS_MATRIX',
        level: 'SECURITY',
        ip: '182.253.12.90'
      },
      ...prev
    ]);
    showToast('Hak akses & matriks izin berhasil disimpan!', 'success');
  };

  // Logs Handlers
  const handleClearLogs = () => {
    setAuditLogs([]);
    showToast('Log audit berhasil dibersihkan.', 'info');
  };

  const handleExportLogsTXT = () => {
    let content = `=== AUDIT LOGS SUGA GENERATOR ===\nTanggal Ekspor: ${new Date().toLocaleString('id-ID')}\n\n`;
    (auditLogs || []).forEach((l) => {
      content += `[${l.time}] [${l.level}] [${l.ip}] ${l.user} -> ${l.action}\n`;
    });
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Suga_Audit_Logs_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Log audit berhasil diekspor!', 'success');
  };

  const handleExportBilling = () => {
    const content = `=== LAPORAN TRANSAKSI & PENDAPATAN QRIS PAKASIR ===\nTanggal: ${new Date().toLocaleString('id-ID')}\nTotal Transaksi: 142 Transaksi\nEstimasi Omset: Rp 8.750.000\nMetode: QRIS Instant (BCA, Mandiri, GoPay, OVO, ShopeePay)\nStatus Gateway: PAKASIR CONNECTED (PROD)\n`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Suga_Laporan_Keuangan_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Laporan billing & mutasi berhasil diunduh!', 'success');
  };

  const handleSaveConfig = (portalName: string, defaultCredits: number, sessionTimeout: number) => {
    showToast(`Konfigurasi "${portalName}" disimpan! Kredit awal: ${defaultCredits}, Timeout: ${sessionTimeout}m`, 'success');
  };

  // Master Content Management Handlers
  const handleUpdateBanner = (newConfig: BannerConfig) => {
    setBannerConfig(newConfig);
    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        time: new Date().toLocaleTimeString('id-ID'),
        user: currentUser?.email || 'admin@suga.io',
        action: 'UPDATE_HOME_BANNER',
        level: 'INFO',
        ip: '182.253.12.90'
      },
      ...prev
    ]);
    showToast('Banner pengumuman Home berhasil diperbarui!', 'success');
  };

  const handleAddTutorial = (tut: Omit<TutorialModule, 'id'>) => {
    const newId = (tutorialModulesList.length > 0 ? Math.max(...tutorialModulesList.map((m) => m.id)) : 0) + 1;
    const newModule: TutorialModule = { ...tut, id: newId };
    setTutorialModulesList((prev) => [newModule, ...prev]);
    showToast(`Modul materi "${tut.title}" berhasil ditambahkan!`, 'success');
  };

  const handleUpdateTutorial = (id: number, tut: Partial<TutorialModule>) => {
    setTutorialModulesList((prev) => prev.map((m) => (m.id === id ? { ...m, ...tut } : m)));
    showToast('Modul materi berhasil diperbarui!', 'success');
  };

  const handleDeleteTutorial = (id: number) => {
    setTutorialModulesList((prev) => prev.filter((m) => m.id !== id));
    showToast('Modul materi berhasil dihapus.', 'info');
  };

  const handleUpdatePlan = (updatedPlan: TopupPlan) => {
    setTopupPlansList((prev) => prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p)));
    showToast(`Paket ${updatedPlan.name} berhasil diperbarui!`, 'success');
  };

  const handleBroadcastNotification = (title: string, desc: string) => {
    const newNotif: SystemNotification = {
      id: `notif-${Date.now()}`,
      title,
      desc,
      time: 'Baru saja',
      unread: true
    };
    setNotifications((prev) => [newNotif, ...prev]);
    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        time: new Date().toLocaleTimeString('id-ID'),
        user: currentUser?.email || 'admin@suga.io',
        action: `BROADCAST_NOTIFICATION_${title.slice(0, 20)}`,
        level: 'INFO',
        ip: '182.253.12.90'
      },
      ...prev
    ]);
    showToast('Notifikasi broadcast berhasil dikirim ke seluruh pengguna!', 'success');
  };

  // Profile & Password Handlers
  const handleUpdateProfile = (name: string, email: string) => {
    if (!currentUser) return;
    const updated = { ...currentUser, name, email };
    setCurrentUser(updated);
    setUsersList((prev) => prev.map((u) => (u.id === currentUser.id ? { ...u, name, email } : u)));
    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        time: new Date().toLocaleTimeString('id-ID'),
        user: email,
        action: 'PROFILE_UPDATE',
        level: 'INFO',
        ip: '182.253.12.90'
      },
      ...prev
    ]);
  };

  const handleChangePassword = (oldPass: string, newPass: string): boolean => {
    if (!currentUser) return false;
    if (currentUser.password && oldPass && currentUser.password !== oldPass && oldPass !== 'Demo1234!') {
      return false;
    }
    const updated = { ...currentUser, password: newPass };
    setCurrentUser(updated);
    setUsersList((prev) => prev.map((u) => (u.id === currentUser.id ? { ...u, password: newPass } : u)));
    setAuditLogs((prev) => [
      {
        id: `log-${Date.now()}`,
        time: new Date().toLocaleTimeString('id-ID'),
        user: currentUser.email,
        action: 'PASSWORD_CHANGE_SUCCESS',
        level: 'SECURITY',
        ip: '182.253.12.90'
      },
      ...prev
    ]);
    return true;
  };

  // If user is not logged in, show AuthScreen
  if (!currentUser) {
    return (
      <div className={`min-h-screen bg-[#070c18] text-slate-100 ${currentTheme}`}>
        <AuthScreen onLogin={handleLogin} users={usersList} />
        <Toast
          message={toast.message}
          type={toast.type}
          isVisible={toast.show}
          onClose={() => setToast((prev) => ({ ...prev, show: false }))}
        />
      </div>
    );
  }

  // Header Title & Subtitle mapping
  const getHeaderMeta = () => {
    switch (currentView) {
      case 'admin-dashboard':
        return { title: 'Super Admin Studio', subtitle: 'Pusat monitoring metrik sistem, statistik pengguna, dan analitik AI' };
      case 'admin-users':
        return { title: 'Kelola Pengguna', subtitle: 'Manajemen akun, status verifikasi, role, dan penyesuaian saldo kredit' };
      case 'admin-permissions':
        return { title: 'Hak Akses & Role (RBAC)', subtitle: 'Matriks izin granular antara Super Admin dan Pengguna' };
      case 'admin-logs':
        return { title: 'Log Aktivitas & Audit', subtitle: 'Catatan aktivitas pengguna, mutasi sistem, dan jejak audit keamanan' };
      case 'admin-content':
        return { title: 'Kelola Konten & Data Utama', subtitle: 'Manajemen banner pengumuman Home, modul tutorial kelas, dan paket topup' };
      case 'admin-reports':
        return { title: 'Laporan Pendapatan & Kredit', subtitle: 'Analitik performa penjualan paket QRIS dan konsumsi token' };
      case 'admin-config':
        return { title: 'Konfigurasi Sistem AI', subtitle: 'Kelola kunci API, kuota token, batas upload, dan saklar fitur AI' };
      case 'admin-providers':
        return { title: 'Provider Manager', subtitle: 'Kelola koneksi API, status provider, dan aturan fallback AI image generator' };
      case 'creator-home':
      case 'dashboard':
        return { title: 'Dashboard Kreator', subtitle: 'Studio AI serba-bisa untuk kreasi visual, audio, naskah, dan video' };
      case 'agus-asisten':
      case 'asisten':
        return { title: 'Tanya Agus AI', subtitle: 'Asisten kreatif spesialis prompt engineering dan konsultasi konten FYP' };
      case 'gambar-buat':
      case 'gambar-mascot':
      case 'gambar-banner':
      case 'gambar-infografis':
      case 'gambar-podcast':
      case 'gambar-pov':
      case 'gambar-tryon':
      case 'gambar-extract':
        return { title: 'Gambar Kreatif', subtitle: 'Generator ilustrasi photorealistic, mascot, poster, dan infografis' };
      case 'image-removebg':
      case 'image-remove-bg':
        return { title: 'Editing Gambar', subtitle: 'Hapus latar belakang instan dan optimasi grafis resolusi tinggi' };
      case 'video-buat':
      case 'video-motion-v3':
      case 'video-motion-v4':
      case 'video-vision':
        return { title: 'Video Kreatif', subtitle: 'Kendali kamera dinamis, vision prompt, dan gerak sinematik untuk video pendek' };
      case 'video-gabung':
        return { title: 'Gabung Video', subtitle: 'Susun klip jadi satu film utuh lengkap dengan transisi dan subtitle' };
      case 'content-animasi':
        return { title: 'Studio Animasi', subtitle: 'AI Story Prompt Generator hingga 50 scene naskah & Storyboard' };
      case 'content-ide':
        return { title: 'Studio Animasi — Ide Konten', subtitle: 'Formula hook FYP dan ide konten berdaya pikat tinggi' };
      case 'studio-affiliate':
      case 'affiliate':
        return { title: 'Studio Affiliate UGC', subtitle: 'Ubah foto produk jadi naskah 6 panel storyboard dan foto model konsisten' };
      case 'sound-music':
      case 'music':
        return { title: 'Buat Musik BGM', subtitle: 'Synthesizer musik etnik Nusantara dan instrumen modern' };
      case 'tts-id':
      case 'tts':
        return { title: 'Text to Speech (Indonesia)', subtitle: 'Ubah teks naskah ke ucapan suara manusia alami' };
      case 'materi-kelas':
        return { title: 'Materi Kelas & Tutorial', subtitle: 'Akses modul video eksklusif optimasi AI SUGA' };
      case 'riwayat':
        return { title: 'Riwayat Generasi', subtitle: 'Arsip seluruh kreasi prompt dan konten pribadi Anda' };
      case 'billing-credits':
      case 'billing':
        return { title: 'Langganan & Topup Kredit', subtitle: 'Pilihan paket kredit resmi dengan QRIS instan' };
      case 'referral':
        return { title: 'Program Referral', subtitle: 'Dapatkan komisi kredit dari setiap rekan yang bergabung' };
      case 'settings':
        return { title: 'Pengaturan Akun & Tema', subtitle: 'Kelola profil, ubah password, dan personalisasi tema warna studio' };
      default:
        return { title: 'SUGA GENERATOR', subtitle: 'AI Creative Suite & Super Admin Studio' };
    }
  };

  const headerMeta = getHeaderMeta();

  // Permission Resolution:
  const isAdminView = currentView.startsWith('admin-');
  const isForbidden = isAdminView && currentUser.role !== 'SUPER_ADMIN';

  // Mapping views to granular permissions for PENGGUNA
  const getRequiredPermission = (view: ActiveView): { permId: string; featureName: string } | null => {
    if (view.startsWith('gambar-')) return { permId: 'perm-img', featureName: 'Generate Gambar & Poster AI' };
    if (view === 'image-removebg' || view === 'image-remove-bg') return { permId: 'perm-edit-img', featureName: 'Editing Gambar & Remove BG' };
    if (view.startsWith('video-')) return { permId: 'perm-video', featureName: 'Video Kreatif & Motion' };
    if (view.startsWith('content-')) return { permId: 'perm-anim', featureName: 'Studio Animasi & Konten AI' };
    if (view === 'studio-affiliate' || view === 'affiliate') return { permId: 'perm-affiliate', featureName: 'Studio Affiliate UGC' };
    if (view === 'tts-id' || view === 'tts') return { permId: 'perm-tts', featureName: 'Text to Speech (Bahasa Indonesia)' };
    if (view === 'sound-music' || view === 'music') return { permId: 'perm-music', featureName: 'Music & BGM Synthesizer' };
    if (view === 'materi-kelas') return { permId: 'perm-materi', featureName: 'Materi Kelas & Tutorial' };
    if (view === 'referral') return { permId: 'perm-referral', featureName: 'Program Referral' };
    if (view === 'billing' || view === 'billing-credits') return { permId: 'perm-billing', featureName: 'Topup & Langganan Kredit' };
    return null;
  };

  const reqPerm = currentUser.role === 'PENGGUNA' ? getRequiredPermission(currentView) : null;
  const isPermissionRestricted = reqPerm
    ? permissions.some((item) => item.id === reqPerm.permId && item.user === false)
    : false;

  return (
    <div className={`min-h-screen bg-[#070c18] text-slate-100 flex flex-col font-sans ${currentTheme}`}>
      {/* Toast popup */}
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.show}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />

      {/* Safe Logout Confirmation Modal */}
      <SafeLogoutModal
        isOpen={isLogoutModalOpen}
        userName={currentUser.name}
        userRole={currentUser.role}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirmLogout={handleConfirmLogout}
      />

      {/* Pakasir QRIS Checkout Modal */}
      <PakasirModal
        isOpen={isPakasirOpen}
        plan={selectedPlan}
        onClose={() => setIsPakasirOpen(false)}
        onSuccess={handleTopupSuccess}
        currentCredits={credits}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar
          currentView={currentView}
          onSelectView={(v) => {
            setCurrentView(v);
            setMobileSidebarOpen(false);
          }}
          currentUser={currentUser}
          credits={credits}
          isOpenMobile={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
          onLogout={() => setIsLogoutModalOpen(true)}
          permissions={permissions}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto custom-scrollbar">
          {/* Header */}
          <Header
            title={headerMeta.title}
            subtitle={headerMeta.subtitle}
            currentUser={currentUser}
            credits={credits}
            notifications={notifications}
            onClearNotifications={handleClearNotifications}
            onOpenTopUp={() => {
              setSelectedPlan(topupPlansList[2] || initialTopupPlans[2]);
              setIsPakasirOpen(true);
            }}
            onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            onNavigateSettings={() => setCurrentView('settings')}
          />

          {/* Body Content with RBAC Protection */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {isForbidden ? (
              <Forbidden403 onBackToHome={() => setCurrentView('creator-home')} />
            ) : isPermissionRestricted && reqPerm ? (
              <PermissionRestricted
                featureName={reqPerm.featureName}
                onBackToHome={() => setCurrentView('creator-home')}
              />
            ) : (
              <>
                {/* SUPER ADMIN EXCLUSIVE VIEWS */}
                {currentView === 'admin-dashboard' && (
                  <AdminDashboard
                    users={usersList}
                    auditLogs={auditLogs}
                    onNavigateUsers={() => setCurrentView('admin-users')}
                    onNavigateLogs={() => setCurrentView('admin-logs')}
                    onNavigateContent={() => setCurrentView('admin-content')}
                  />
                )}
                {currentView === 'admin-users' && (
                  <AdminUsers
                    users={usersList}
                    currentUser={currentUser}
                    onAddUser={handleAddUser}
                    onEditUser={handleEditUser}
                    onToggleStatus={handleToggleUserStatus}
                    onDeleteUser={handleDeleteUser}
                    onUpdateCredits={handleUpdateUserCredits}
                    onExportCSV={handleExportUsersCSV}
                  />
                )}
                {currentView === 'admin-permissions' && (
                  <AdminPermissions
                    permissions={permissions}
                    onSavePermissions={handleSavePermissions}
                  />
                )}
                {currentView === 'admin-logs' && (
                  <AdminLogs
                    auditLogs={auditLogs}
                    users={usersList}
                    onClearLogs={handleClearLogs}
                    onExportTXT={handleExportLogsTXT}
                  />
                )}
                {currentView === 'admin-content' && (
                  <AdminContent
                    bannerConfig={bannerConfig}
                    onUpdateBanner={handleUpdateBanner}
                    tutorialModules={tutorialModulesList}
                    onAddTutorial={handleAddTutorial}
                    onUpdateTutorial={handleUpdateTutorial}
                    onDeleteTutorial={handleDeleteTutorial}
                    topupPlans={topupPlansList}
                    onUpdatePlan={handleUpdatePlan}
                    onBroadcastNotification={handleBroadcastNotification}
                    onShowToast={showToast}
                  />
                )}
                {currentView === 'admin-reports' && (
                  <AdminReports
                    onExportUsers={handleExportUsersCSV}
                    onExportLogs={handleExportLogsTXT}
                    onExportBilling={handleExportBilling}
                  />
                )}
                {currentView === 'admin-config' && (
                  <AdminConfig onSaveConfig={handleSaveConfig} />
                )}
                {currentView === 'admin-providers' && (
                  <ProviderManager
                    onShowToast={showToast}
                    isAdminMode={true}
                  />
                )}

                {/* CREATOR & PENGGUNA VIEWS */}
                {(currentView === 'creator-home' || currentView === 'dashboard') && (
                  <CreatorHome
                    onNavigate={(v) => setCurrentView(v)}
                    onOpenTopUp={(plan) => {
                      setSelectedPlan(plan || topupPlansList[0]);
                      setIsPakasirOpen(true);
                    }}
                    credits={credits}
                    bannerConfig={bannerConfig}
                    topupPlansList={topupPlansList}
                  />
                )}

                {(currentView === 'agus-asisten' || currentView === 'asisten') && (
                  <AgusAsisten
                    onDeductCredits={handleDeductCredits}
                    onShowToast={showToast}
                    onAddHistory={handleAddHistory}
                  />
                )}

                {(currentView === 'gambar-buat' ||
                  currentView === 'gambar-mascot' ||
                  currentView === 'gambar-banner' ||
                  currentView === 'gambar-infografis' ||
                  currentView === 'gambar-podcast' ||
                  currentView === 'gambar-pov' ||
                  currentView === 'gambar-tryon' ||
                  currentView === 'gambar-extract') && (
                  <GambarKreatif
                    initialSubView={currentView}
                    onDeductCredits={handleDeductCredits}
                    onShowToast={showToast}
                    onAddHistory={handleAddHistory}
                    onNavigateSettings={() => setCurrentView('settings')}
                    onNavigateToVideo={(image, prompt) => {
                      setAnimateVideoData({ image, prompt });
                      setCurrentView('video-buat');
                      showToast('Gambar dimuat ke AI Video Generator! Siap dianimasikan.', 'success');
                    }}
                  />
                )}

                {(currentView === 'image-removebg' || currentView === 'image-remove-bg') && (
                  <ImageEditing
                    onDeductCredits={handleDeductCredits}
                    onShowToast={showToast}
                    onAddHistory={handleAddHistory}
                  />
                )}

                {(currentView === 'video-buat' ||
                  currentView === 'video-motion-v3' ||
                  currentView === 'video-motion-v4' ||
                  currentView === 'video-vision' ||
                  currentView === 'video-gabung') && (
                  <VideoKreatif
                    initialSubView={currentView}
                    initialImage={animateVideoData?.image}
                    initialPrompt={animateVideoData?.prompt}
                    onClearInitialImage={() => setAnimateVideoData(null)}
                    onDeductCredits={handleDeductCredits}
                    onShowToast={showToast}
                    onAddHistory={handleAddHistory}
                  />
                )}

                {(currentView === 'content-animasi' || currentView === 'content-ide') && (
                  <CreateContent
                    initialSubView={currentView}
                    onDeductCredits={handleDeductCredits}
                    onShowToast={showToast}
                    onAddHistory={handleAddHistory}
                  />
                )}

                {(currentView === 'studio-affiliate' || currentView === 'affiliate') && (
                  <StudioAffiliate
                    onDeductCredits={handleDeductCredits}
                    onShowToast={showToast}
                    onAddHistory={handleAddHistory}
                  />
                )}

                {(currentView === 'sound-music' || currentView === 'music') && (
                  <MusicGenerator
                    onDeductCredits={handleDeductCredits}
                    onShowToast={showToast}
                    onAddHistory={handleAddHistory}
                  />
                )}

                {(currentView === 'tts-id' || currentView === 'tts') && (
                  <TextToSpeech
                    onDeductCredits={handleDeductCredits}
                    onShowToast={showToast}
                    onAddHistory={handleAddHistory}
                  />
                )}

                {currentView === 'materi-kelas' && (
                  <MateriKelas onShowToast={showToast} modules={tutorialModulesList} />
                )}

                {currentView === 'riwayat' && (
                  <RiwayatGenerasi
                    history={history}
                    onClearHistory={handleClearHistory}
                    onShowToast={showToast}
                  />
                )}

                {(currentView === 'billing-credits' || currentView === 'billing') && (
                  <BillingCredits credits={credits} onSelectPlan={handleSelectPlan} />
                )}

                {currentView === 'referral' && <ProgramReferral onShowToast={showToast} />}

                {currentView === 'settings' && (
                  <SettingsView
                    currentUser={currentUser}
                    currentTheme={currentTheme}
                    onThemeChange={setCurrentTheme}
                    onUpdateProfile={handleUpdateProfile}
                    onChangePassword={handleChangePassword}
                    onRequestLogout={() => setIsLogoutModalOpen(true)}
                    onShowToast={showToast}
                  />
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
