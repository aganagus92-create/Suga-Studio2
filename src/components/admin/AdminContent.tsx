import React, { useState } from 'react';
import {
  FileCode2,
  Megaphone,
  GraduationCap,
  CreditCard,
  BellRing,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Save,
  Eye
} from 'lucide-react';
import { BannerConfig, TutorialModule, TopupPlan } from '../../types';

interface AdminContentProps {
  bannerConfig: BannerConfig;
  onUpdateBanner: (newConfig: BannerConfig) => void;
  tutorialModules: TutorialModule[];
  onAddTutorial: (module: Omit<TutorialModule, 'id'>) => void;
  onUpdateTutorial: (id: number, module: Partial<TutorialModule>) => void;
  onDeleteTutorial: (id: number) => void;
  topupPlans: TopupPlan[];
  onUpdateTopupPlan: (planId: string, updated: Partial<TopupPlan>) => void;
  onBroadcastNotification: (title: string, desc: string) => void;
  onShowToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const AdminContent: React.FC<AdminContentProps> = ({
  bannerConfig,
  onUpdateBanner,
  tutorialModules,
  onAddTutorial,
  onUpdateTutorial,
  onDeleteTutorial,
  topupPlans,
  onUpdateTopupPlan,
  onBroadcastNotification,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'banner' | 'tutorial' | 'plans' | 'broadcast'>('banner');

  // Banner State
  const [bannerBadge, setBannerBadge] = useState(bannerConfig.badge);
  const [bannerTitle, setBannerTitle] = useState(bannerConfig.title);
  const [bannerContent, setBannerContent] = useState(bannerConfig.content);
  const [bannerActive, setBannerActive] = useState(bannerConfig.active);

  // Tutorial State
  const [isAddTutorialOpen, setIsAddTutorialOpen] = useState(false);
  const [editingTutorialId, setEditingTutorialId] = useState<number | null>(null);
  const [tutorialTitle, setTutorialTitle] = useState('');
  const [tutorialCategory, setTutorialCategory] = useState('Dasar');
  const [tutorialDuration, setTutorialDuration] = useState('10:00');
  const [tutorialViews, setTutorialViews] = useState('1.5k');

  // Plan Edit State
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<number>(0);
  const [editCredits, setEditCredits] = useState<string>('');
  const [editBonus, setEditBonus] = useState<string>('');
  const [editPopular, setEditPopular] = useState<boolean>(false);

  // Broadcast Notification State
  const [notifTitle, setNotifTitle] = useState('');
  const [notifDesc, setNotifDesc] = useState('');

  // Handle Save Banner
  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateBanner({
      badge: bannerBadge,
      title: bannerTitle,
      content: bannerContent,
      active: bannerActive
    });
    onShowToast('Banner pengumuman utama berhasil diperbarui!', 'success');
  };

  // Handle Save Tutorial
  const handleSaveTutorial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutorialTitle.trim()) return;

    if (editingTutorialId !== null) {
      onUpdateTutorial(editingTutorialId, {
        title: tutorialTitle.trim(),
        category: tutorialCategory,
        duration: tutorialDuration,
        views: tutorialViews
      });
      onShowToast('Materi kelas berhasil diperbarui!', 'success');
    } else {
      onAddTutorial({
        title: tutorialTitle.trim(),
        category: tutorialCategory,
        duration: tutorialDuration,
        views: tutorialViews
      });
      onShowToast('Modul materi baru berhasil ditambahkan!', 'success');
    }

    setIsAddTutorialOpen(false);
    setEditingTutorialId(null);
    setTutorialTitle('');
  };

  const handleOpenEditTutorial = (t: TutorialModule) => {
    setEditingTutorialId(t.id);
    setTutorialTitle(t.title);
    setTutorialCategory(t.category);
    setTutorialDuration(t.duration);
    setTutorialViews(t.views);
    setIsAddTutorialOpen(true);
  };

  // Handle Plan Edit
  const handleOpenEditPlan = (p: TopupPlan) => {
    setEditingPlanId(p.id);
    setEditPrice(p.price);
    setEditCredits(p.credits);
    setEditBonus(p.bonus || '');
    setEditPopular(!!p.popular);
  };

  const handleSavePlan = (planId: string) => {
    onUpdateTopupPlan(planId, {
      price: editPrice,
      credits: editCredits,
      bonus: editBonus || undefined,
      popular: editPopular
    });
    setEditingPlanId(null);
    onShowToast('Paket top-up kredit berhasil diperbarui!', 'success');
  };

  // Handle Broadcast Notification
  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifDesc.trim()) {
      onShowToast('Judul dan pesan notifikasi wajib diisi.', 'error');
      return;
    }
    onBroadcastNotification(notifTitle.trim(), notifDesc.trim());
    setNotifTitle('');
    setNotifDesc('');
    onShowToast('Notifikasi berhasil disiarkan ke seluruh akun pengguna!', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4 shadow-xl">
        <div className="border-b border-slate-800 pb-4">
          <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
            <FileCode2 className="w-5 h-5 text-purple-400" />
            <span>Kelola Konten & Data Utama (Master Data)</span>
          </h3>
          <p className="text-xs text-slate-400">
            Atur konten publik, banner promosi, modul materi kelas, paket billing, dan siaran notifikasi sistem
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="button"
            onClick={() => setActiveTab('banner')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'banner'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Megaphone className="w-3.5 h-3.5" />
            <span>Banner Pengumuman</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tutorial')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'tutorial'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Materi Kelas ({tutorialModules.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('plans')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'plans'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Paket Kredit ({topupPlans.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('broadcast')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer ${
              activeTab === 'broadcast'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <BellRing className="w-3.5 h-3.5" />
            <span>Siaran Notifikasi</span>
          </button>
        </div>
      </div>

      {/* TAB 1: BANNER PENGUMUMAN */}
      {activeTab === 'banner' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4 shadow-xl">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Megaphone className="w-4 h-4 text-pink-400" />
              <span>Pengaturan Banner Utama Dashboard Pengguna</span>
            </h4>
            <p className="text-xs text-slate-400">
              Banner ini tampil di bagian teratas dashboard seluruh member kreator.
            </p>

            <form onSubmit={handleSaveBanner} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="block text-slate-300 font-bold mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={bannerBadge}
                    onChange={(e) => setBannerBadge(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-300 font-bold mb-1">Judul Pengumuman</label>
                  <input
                    type="text"
                    value={bannerTitle}
                    onChange={(e) => setBannerTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Konten / Isi Pesan Pengumuman</label>
                <textarea
                  rows={3}
                  value={bannerContent}
                  onChange={(e) => setBannerContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 flex items-center justify-between">
                <div>
                  <span className="font-bold text-white block">Tampilkan Banner di Dashboard</span>
                  <span className="text-[11px] text-slate-400">Aktifkan untuk menampilkan banner info kepada pengguna</span>
                </div>
                <input
                  type="checkbox"
                  checked={bannerActive}
                  onChange={(e) => setBannerActive(e.target.checked)}
                  className="accent-purple-600 w-4 h-4 cursor-pointer"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl suga-gradient-btn text-white font-bold flex items-center justify-center space-x-2 shadow-md cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan Banner</span>
              </button>
            </form>
          </div>

          {/* Live Preview */}
          <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-purple-400" />
                  <span>Pratinjau Langsung (Live Preview)</span>
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${bannerActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
                  {bannerActive ? 'Status: Aktif' : 'Status: Disembunyikan'}
                </span>
              </div>

              {bannerActive ? (
                <div className="p-3.5 sm:p-4 rounded-2xl bg-[#09152e] border border-blue-900/60 flex items-start justify-between gap-3 shadow-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center shrink-0 mt-0.5">
                      <Megaphone className="w-3 h-3" />
                    </div>
                    <div className="text-xs space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 rounded bg-blue-600 text-white font-bold text-[10px] uppercase">
                          {bannerBadge}
                        </span>
                        <span className="font-bold text-white">{bannerTitle}</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-relaxed">{bannerContent}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-8 border border-dashed border-slate-800 rounded-2xl text-center text-xs text-slate-500">
                  Banner saat ini dinonaktifkan dan tidak akan ditampilkan di layar Pengguna.
                </div>
              )}
            </div>
            <p className="text-[10px] text-slate-500 text-center">
              Perubahan pada banner langsung tersinkronisasi ke sesi pengguna aktif.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: MATERI KELAS */}
      {activeTab === 'tutorial' && (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-sky-400" />
                  <span>Daftar Modul Materi Kelas Kreator</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Kelola video tutorial, panduan prompt, dan modul belajar yang dapat diakses pengguna
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingTutorialId(null);
                  setTutorialTitle('');
                  setTutorialCategory('Dasar');
                  setTutorialDuration('10:00');
                  setTutorialViews('1.0k');
                  setIsAddTutorialOpen(true);
                }}
                className="px-4 py-2 rounded-xl suga-gradient-btn text-white text-xs font-bold flex items-center space-x-1.5 shadow-md cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Modul Kelas</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800/80 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">#</th>
                    <th className="p-3.5">Judul Modul Materi</th>
                    <th className="p-3.5">Kategori</th>
                    <th className="p-3.5">Durasi</th>
                    <th className="p-3.5">Total Dilihat</th>
                    <th className="p-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {tutorialModules.map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5 font-mono text-slate-500">{idx + 1}</td>
                      <td className="p-3.5 font-bold text-white max-w-xs">{item.title}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-bold">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-300 font-mono">{item.duration}</td>
                      <td className="p-3.5 text-slate-400 font-mono">{item.views}</td>
                      <td className="p-3.5 text-right space-x-1">
                        <button
                          type="button"
                          onClick={() => handleOpenEditTutorial(item)}
                          className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-300 transition-colors"
                          title="Edit Modul"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-purple-400" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteTutorial(item.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-950/40 text-rose-400 transition-colors"
                          title="Hapus Modul"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PAKET KREDIT & HARGA */}
      {activeTab === 'plans' && (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4 shadow-xl">
            <div className="border-b border-slate-800 pb-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span>Manajemen Harga & Paket Top-Up Kredit</span>
              </h4>
              <p className="text-xs text-slate-400">
                Ubah nominal harga IDR, kuota kredit, bonus, dan status rekomendasi untuk tiap paket
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {topupPlans.map((plan) => {
                const isEditing = editingPlanId === plan.id;
                return (
                  <div
                    key={plan.id}
                    className={`p-5 rounded-2xl border transition-all space-y-3 ${
                      plan.popular
                        ? 'border-purple-500/80 bg-purple-950/20'
                        : 'border-slate-800 bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="font-bold text-white text-sm block">{plan.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{plan.id}</span>
                      </div>
                      {plan.popular && (
                        <span className="px-2 py-0.5 rounded-full bg-pink-600 text-white text-[9px] font-bold uppercase">
                          Terpopuler
                        </span>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="space-y-2 text-xs">
                        <div>
                          <label className="text-[10px] text-slate-400 font-bold block">Harga (Rp)</label>
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(Number(e.target.value))}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 font-bold block">Kredit</label>
                          <input
                            type="text"
                            value={editCredits}
                            onChange={(e) => setEditCredits(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 font-bold block">Bonus Text</label>
                          <input
                            type="text"
                            value={editBonus}
                            onChange={(e) => setEditBonus(e.target.value)}
                            placeholder="mis. +500 bonus"
                            className="w-full px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs"
                          />
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-slate-300">Tandai Populer:</span>
                          <input
                            type="checkbox"
                            checked={editPopular}
                            onChange={(e) => setEditPopular(e.target.checked)}
                            className="accent-purple-600"
                          />
                        </div>
                        <div className="flex gap-2 pt-2">
                          <button
                            type="button"
                            onClick={() => handleSavePlan(plan.id)}
                            className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                          >
                            Simpan
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingPlanId(null)}
                            className="px-3 py-1.5 rounded-lg bg-slate-700 text-slate-300 text-xs"
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-1">
                          <div className="text-xl font-black text-white font-mono">
                            Rp {plan.price.toLocaleString('id-ID')}
                          </div>
                          <div className="text-xs text-purple-300 font-bold font-mono">
                            {plan.credits} Credits
                            {plan.bonus && (
                              <span className="text-pink-400 ml-1.5">({plan.bonus})</span>
                            )}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleOpenEditPlan(plan)}
                          className="w-full py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Edit2 className="w-3 h-3 text-purple-400" />
                          <span>Edit Paket Ini</span>
                        </button>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: SIARAN NOTIFIKASI */}
      {activeTab === 'broadcast' && (
        <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4 shadow-xl max-w-2xl">
          <div className="border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <BellRing className="w-4 h-4 text-pink-400" />
              <span>Kirim Siaran Notifikasi Sistem (Broadcast Notification)</span>
            </h4>
            <p className="text-xs text-slate-400">
              Kirimkan pemberitahuan penting langsung ke lonceng notifikasi seluruh pengguna secara serentak
            </p>
          </div>

          <form onSubmit={handleSendBroadcast} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Judul Notifikasi</label>
              <input
                type="text"
                value={notifTitle}
                onChange={(e) => setNotifTitle(e.target.value)}
                placeholder="mis. Pemeliharaan Sistem Dijadwalkan / Bonus 500 Kredit Gratis!"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Isi Pesan Notifikasi</label>
              <textarea
                rows={3}
                value={notifDesc}
                onChange={(e) => setNotifDesc(e.target.value)}
                placeholder="Tulis rincian pesan notifikasi yang akan dibaca oleh pengguna..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl suga-gradient-btn text-white font-bold flex items-center justify-center space-x-2 shadow-lg cursor-pointer"
            >
              <BellRing className="w-4 h-4" />
              <span>Siarkan Notifikasi ke Semua Pengguna</span>
            </button>
          </form>
        </div>
      )}

      {/* Add / Edit Tutorial Modal */}
      {isAddTutorialOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setIsAddTutorialOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <h4 className="text-base font-bold text-white font-heading">
              {editingTutorialId !== null ? 'Edit Modul Materi' : 'Tambah Modul Materi Baru'}
            </h4>

            <form onSubmit={handleSaveTutorial} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Judul Modul Materi</label>
                <input
                  type="text"
                  value={tutorialTitle}
                  onChange={(e) => setTutorialTitle(e.target.value)}
                  required
                  placeholder="mis. CARA BIKIN KONTEN AFFILIATE VIRAL 2026"
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Kategori</label>
                  <input
                    type="text"
                    value={tutorialCategory}
                    onChange={(e) => setTutorialCategory(e.target.value)}
                    placeholder="Dasar"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Durasi</label>
                  <input
                    type="text"
                    value={tutorialDuration}
                    onChange={(e) => setTutorialDuration(e.target.value)}
                    placeholder="12:30"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Views</label>
                  <input
                    type="text"
                    value={tutorialViews}
                    onChange={(e) => setTutorialViews(e.target.value)}
                    placeholder="15.2k"
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl suga-gradient-btn text-white font-bold cursor-pointer shadow-md"
                >
                  {editingTutorialId !== null ? 'Simpan Perubahan Modul' : 'Tambahkan Modul'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
