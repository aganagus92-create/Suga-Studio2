import React, { useState } from 'react';
import {
  Settings,
  Palette,
  Shield,
  Bell,
  User,
  Check,
  KeyRound,
  LogOut,
  ShieldAlert,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  Server
} from 'lucide-react';
import { User as UserType } from '../../types';
import { ProviderManager } from '../admin/ProviderManager';

interface SettingsViewProps {
  currentUser: UserType;
  currentTheme: string;
  onThemeChange: (theme: string) => void;
  onUpdateProfile?: (name: string, email: string) => void;
  onChangePassword?: (oldPass: string, newPass: string) => boolean;
  onRequestLogout?: () => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentUser,
  currentTheme,
  onThemeChange,
  onUpdateProfile,
  onChangePassword,
  onRequestLogout,
  onShowToast
}) => {
  const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';

  // Profile state
  const [activeTab, setActiveTab] = useState<'profile' | 'providers' | 'themes'>('profile');
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Password state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  const themes = [
    {
      id: '',
      name: 'Obsidian Night (Default)',
      desc: 'Nuansa gelap pekat biru malam studio AI',
      color: 'bg-[#070c18] border-purple-500'
    },
    {
      id: 'theme-samudra',
      name: 'Samudra Deep Blue',
      desc: 'Palet biru safir laut dalam yang jernih',
      color: 'bg-sky-950 border-sky-400'
    },
    {
      id: 'theme-emerald',
      name: 'Emerald Forest',
      desc: 'Sentuhan hijau zamrud modern nan elegan',
      color: 'bg-emerald-950 border-emerald-400'
    },
    {
      id: 'theme-merahputih',
      name: 'Merah Putih Nusantara',
      desc: 'Aksen merah kobar patriotik kebanggaan Indonesia',
      color: 'bg-rose-950 border-rose-400'
    }
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      onShowToast('Nama dan email wajib diisi.', 'error');
      return;
    }
    onUpdateProfile?.(name.trim(), email.trim());
    onShowToast('Profil dan preferensi berhasil diperbarui!', 'success');
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!newPassword || !confirmPassword) {
      setPasswordError('Password baru dan konfirmasi wajib diisi.');
      return;
    }

    if (newPassword.length < 4) {
      setPasswordError('Password minimal harus memiliki 4 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Konfirmasi password tidak cocok dengan password baru.');
      return;
    }

    const ok = onChangePassword ? onChangePassword(oldPassword, newPassword) : true;
    if (ok) {
      setPasswordSuccess('Password berhasil diubah secara aman!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      onShowToast('Password akun Anda berhasil diperbarui!', 'success');
    } else {
      setPasswordError('Password lama yang Anda masukkan tidak sesuai.');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Role Banner */}
      <div
        className={`p-5 rounded-3xl border shadow-xl flex items-center justify-between gap-4 ${
          isSuperAdmin
            ? 'bg-pink-950/30 border-pink-500/40 text-pink-200'
            : 'bg-sky-950/30 border-sky-500/40 text-sky-200'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold shadow-lg ${
              isSuperAdmin ? 'bg-pink-600 text-white' : 'bg-sky-600 text-white'
            }`}
          >
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white">
                {isSuperAdmin ? 'Peran: SUPER ADMIN' : 'Peran: PENGGUNA (KREATOR)'}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-white/10">
                {isSuperAdmin ? 'Akses Penuh Seluruh Sistem' : 'Akses Berbasis Izin (RBAC)'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {isSuperAdmin
                ? 'Super Admin memiliki hak mengelola seluruh pengguna, konfigurasi, master data, dan log audit.'
                : 'Pengguna dapat menggunakan fitur utama yang telah diizinkan oleh Super Admin.'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onRequestLogout}
          className="px-3.5 py-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shrink-0 cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout Aman</span>
        </button>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#091122] border border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <User className="w-3.5 h-3.5" />
          <span>Profil & Akun</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('providers')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'providers'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Server className="w-3.5 h-3.5" />
          <span>AI Provider Settings</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">
            API Keys
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('themes')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            activeTab === 'themes'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Tema & Tampilan</span>
        </button>
      </div>

      {/* AI Provider Settings Tab */}
      {activeTab === 'providers' && (
        <ProviderManager onShowToast={onShowToast} isAdminMode={isSuperAdmin} />
      )}

      {/* Profile & Password Tabs */}
      {activeTab === 'profile' && (
        <>
          {/* Account Settings */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-5 shadow-xl">
        <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <User className="w-4 h-4 text-blue-400" />
              <span>Profil Pengguna & Identitas</span>
            </h3>
            <p className="text-xs text-slate-400">
              {isSuperAdmin ? 'Kelola profil administrator sistem' : 'Kelola profil dan akun pribadi Anda'}
            </p>
          </div>
          <div className="font-mono text-xs text-purple-300 font-bold bg-purple-500/10 px-3 py-1 rounded-xl border border-purple-500/20">
            {currentUser.credits.toLocaleString('id-ID')} Credits
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">Nama Lengkap</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">Email Terdaftar</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
            <div className="space-y-0.5">
              <span className="font-bold text-slate-200 block">Notifikasi Sistem & Pembaruan</span>
              <p className="text-[11px] text-slate-400">Terima notifikasi siaran pengumuman dan mutasi kredit</p>
            </div>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl suga-gradient-btn text-white font-bold text-xs shadow-md cursor-pointer"
          >
            Simpan Perubahan Profil
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-5 shadow-xl">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-emerald-400" />
            <span>Ubah Password Akun</span>
          </h3>
          <p className="text-xs text-slate-400">
            Perbarui password secara berkala untuk menjaga keamanan akun dan proteksi data
          </p>
        </div>

        {passwordError && (
          <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{passwordError}</span>
          </div>
        )}

        {passwordSuccess && (
          <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{passwordSuccess}</span>
          </div>
        )}

        <form onSubmit={handleChangePasswordSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1.5">Password Saat Ini</label>
            <div className="relative">
              <input
                type={showOldPass ? 'text' : 'password'}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Masukkan password lama..."
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowOldPass(!showOldPass)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
              >
                {showOldPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1.5">Password Baru</label>
              <div className="relative">
                <input
                  type={showNewPass ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimal 4 karakter..."
                  className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPass(!showNewPass)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
                >
                  {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1.5">Konfirmasi Password Baru</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi password baru..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
          >
            Simpan Password Baru
          </button>
        </form>
      </div>
      </>
      )}

      {/* Theme Selector Tab */}
      {activeTab === 'themes' && (
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-5 shadow-xl">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
            <Palette className="w-4 h-4 text-purple-400" />
            <span>Tema Antarmuka Aplikasi (Theme Studio)</span>
          </h3>
          <p className="text-xs text-slate-400">Pilih palet warna atmosfer favorit untuk ruang kerja kreatif Anda</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {themes.map((t) => (
            <div
              key={t.id}
              onClick={() => {
                onThemeChange(t.id);
                onShowToast(`Tema diubah ke ${t.name}!`, 'info');
              }}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                currentTheme === t.id
                  ? 'border-purple-500 bg-purple-950/30 ring-1 ring-purple-500/50'
                  : 'border-slate-800 bg-slate-800/40 hover:border-slate-700'
              }`}
            >
              <div className="space-y-1">
                <span className="text-xs font-bold text-white block">{t.name}</span>
                <p className="text-[11px] text-slate-400">{t.desc}</p>
              </div>
              <div
                className={`w-6 h-6 rounded-full border-2 ${t.color} flex items-center justify-center shrink-0 ml-3`}
              >
                {currentTheme === t.id && <Check className="w-3.5 h-3.5 text-white" />}
              </div>
            </div>
          ))}
        </div>
      </div>
      )}

      {/* Safe Logout Card */}
      <div className="p-6 rounded-3xl bg-rose-950/20 border border-rose-900/40 flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-rose-300 flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            <span>Logout Sesi dengan Aman</span>
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Akhiri sesi Anda sekarang secara aman dan bersihkan data kredensial lokal.
          </p>
        </div>
        <button
          type="button"
          onClick={() => onRequestLogout?.()}
          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
        >
          Logout Sekarang
        </button>
      </div>
    </div>
  );
};
