import React, { useState } from 'react';
import {
  Download,
  UserPlus,
  Search,
  UserX,
  UserCheck,
  Trash2,
  X,
  PlusCircle,
  Edit,
  ArrowUpDown,
  Shield,
  KeyRound,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { User, UserRole, UserStatus } from '../../types';

interface AdminUsersProps {
  users?: User[];
  currentUser?: User | null;
  onAddUser?: (newUser: Omit<User, 'id' | 'created'>) => void;
  onEditUser?: (userId: string, updated: Partial<User>) => void;
  onToggleStatus?: (userId: string) => void;
  onDeleteUser?: (userId: string) => void;
  onUpdateCredits?: (userId: string, newCredits: number) => void;
  onExportCSV?: () => void;
}

type SortKey = 'date-desc' | 'date-asc' | 'name-asc' | 'name-desc' | 'credits-desc' | 'credits-asc';

export const AdminUsers: React.FC<AdminUsersProps> = ({
  users = [],
  currentUser = null,
  onAddUser,
  onEditUser,
  onToggleStatus,
  onDeleteUser,
  onUpdateCredits,
  onExportCSV
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<SortKey>('date-desc');

  // Add User Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('user123');
  const [newRole, setNewRole] = useState<UserRole>('PENGGUNA');
  const [newCredits, setNewCredits] = useState<number>(278);
  const [addError, setAddError] = useState('');

  // Edit User Modal State
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editRole, setEditRole] = useState<UserRole>('PENGGUNA');
  const [editStatus, setEditStatus] = useState<UserStatus>('ACTIVE');
  const [editCredits, setEditCredits] = useState<number>(0);
  const [editPassword, setEditPassword] = useState('');
  const [editError, setEditError] = useState('');

  // Delete Confirm Modal
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  // Quick Credit Edit Modal
  const [quickCreditUser, setQuickCreditUser] = useState<User | null>(null);
  const [quickCreditInput, setQuickCreditInput] = useState<number>(0);

  const safeUsers = Array.isArray(users) ? users : [];

  // Filter and Sort Logic
  const processedUsers = [...safeUsers]
    .filter((u) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.id.toLowerCase().includes(q);
      const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
      const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date-asc':
          return a.created.localeCompare(b.created);
        case 'date-desc':
          return b.created.localeCompare(a.created);
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'credits-desc':
          return b.credits - a.credits;
        case 'credits-asc':
          return a.credits - b.credits;
        default:
          return 0;
      }
    });

  // Handle Add Submit
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAddError('');
    if (!newName.trim() || !newEmail.trim()) {
      setAddError('Nama dan email wajib diisi.');
      return;
    }
    if (safeUsers.some((u) => u.email.toLowerCase() === newEmail.trim().toLowerCase())) {
      setAddError('Alamat email sudah terdaftar di sistem.');
      return;
    }

    onAddUser?.({
      name: newName.trim(),
      email: newEmail.trim(),
      role: newRole,
      credits: Number(newCredits) || 0,
      status: 'ACTIVE',
      password: newPassword.trim() || 'user123'
    });

    setIsAddModalOpen(false);
    setNewName('');
    setNewEmail('');
    setNewPassword('user123');
    setNewRole('PENGGUNA');
    setNewCredits(278);
  };

  // Open Edit User Modal
  const handleOpenEditUser = (u: User) => {
    setEditingUser(u);
    setEditName(u.name);
    setEditEmail(u.email);
    setEditRole(u.role);
    setEditStatus(u.status);
    setEditCredits(u.credits);
    setEditPassword('');
    setEditError('');
  };

  // Save Edit User
  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setEditError('');

    if (!editName.trim() || !editEmail.trim()) {
      setEditError('Nama dan email tidak boleh kosong.');
      return;
    }

    // Check duplicate email if changed
    const emailConflict = safeUsers.some(
      (u) => u.id !== editingUser.id && u.email.toLowerCase() === editEmail.trim().toLowerCase()
    );
    if (emailConflict) {
      setEditError('Alamat email ini sudah digunakan oleh pengguna lain.');
      return;
    }

    const updatedData: Partial<User> = {
      name: editName.trim(),
      email: editEmail.trim(),
      role: editRole,
      status: editStatus,
      credits: Number(editCredits) || 0
    };

    if (editPassword.trim()) {
      updatedData.password = editPassword.trim();
    }

    onEditUser?.(editingUser.id, updatedData);
    setEditingUser(null);
  };

  // Quick Credit Handlers
  const handleOpenQuickCredit = (u: User) => {
    setQuickCreditUser(u);
    setQuickCreditInput(u.credits);
  };

  const handleSaveQuickCredit = () => {
    if (quickCreditUser) {
      onUpdateCredits?.(quickCreditUser.id, quickCreditInput);
      setQuickCreditUser(null);
    }
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (deletingUser) {
      onDeleteUser?.(deletingUser.id);
      setDeletingUser(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4 shadow-xl">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-400" />
              <span>Manajemen Pengguna Sistem (User Directory)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Kelola seluruh akun, edit profil, atur role, status aktif, dan mutasi saldo kredit kreator
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onExportCSV}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor CSV</span>
            </button>
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 rounded-xl suga-gradient-btn text-white text-xs font-bold flex items-center space-x-1.5 shadow-lg cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Tambah Pengguna Baru</span>
            </button>
          </div>
        </div>

        {/* Filter, Search, and Sort Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative sm:col-span-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama, email, ID..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="ALL">Semua Peran (Role)</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="PENGGUNA">Pengguna (Kreator)</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-slate-200 focus:outline-none focus:border-purple-500 cursor-pointer"
          >
            <option value="ALL">Semua Status Akun</option>
            <option value="ACTIVE">Aktif (ACTIVE)</option>
            <option value="INACTIVE">Nonaktif (INACTIVE)</option>
          </select>

          {/* Sorting */}
          <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 rounded-xl px-2.5 py-1">
            <ArrowUpDown className="w-3.5 h-3.5 text-purple-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="w-full bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="date-desc">Tanggal: Terbaru</option>
              <option value="date-asc">Tanggal: Terlama</option>
              <option value="name-asc">Nama: A - Z</option>
              <option value="name-desc">Nama: Z - A</option>
              <option value="credits-desc">Kredit: Terbanyak</option>
              <option value="credits-asc">Kredit: Tersedikit</option>
            </select>
          </div>
        </div>

        {/* Total stats pill */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
          <span>
            Menampilkan <strong className="text-purple-300">{processedUsers.length}</strong> dari{' '}
            {safeUsers.length} total pengguna
          </span>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-pink-400 hover:text-pink-300 cursor-pointer underline"
            >
              Reset Pencarian
            </button>
          )}
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Pengguna</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Saldo Kredit</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Tanggal Dibuat</th>
                <th className="p-3.5 text-right">Aksi Kelola</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {processedUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">
                    Tidak ditemukan data pengguna yang cocok dengan kriteria pencarian atau filter.
                  </td>
                </tr>
              ) : (
                processedUsers.map((u) => {
                  const isCurrent = u.id === currentUser?.id || u.email === currentUser?.email;
                  return (
                    <tr key={u.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-white leading-snug flex items-center gap-1.5">
                              <span>{u.name}</span>
                              {isCurrent && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                  Anda
                                </span>
                              )}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            u.role === 'SUPER_ADMIN'
                              ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                              : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                          }`}
                        >
                          {u.role.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <button
                          type="button"
                          onClick={() => handleOpenQuickCredit(u)}
                          className="font-mono font-bold text-purple-300 hover:text-purple-200 hover:underline flex items-center gap-1 cursor-pointer"
                          title="Klik untuk ubah cepat saldo kredit"
                        >
                          <span>{u.credits.toLocaleString('id-ID')}</span>
                          <PlusCircle className="w-3 h-3 text-purple-400 opacity-70 hover:opacity-100" />
                        </button>
                      </td>
                      <td className="p-3.5">
                        <button
                          type="button"
                          onClick={() => onToggleStatus?.(u.id)}
                          className={`px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1 cursor-pointer transition-all ${
                            u.status === 'ACTIVE'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30'
                          }`}
                          title="Klik untuk toggle status aktif/nonaktif"
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              u.status === 'ACTIVE' ? 'bg-emerald-400' : 'bg-rose-400'
                            }`}
                          />
                          <span>{u.status === 'ACTIVE' ? 'Aktif' : 'Nonaktif'}</span>
                        </button>
                      </td>
                      <td className="p-3.5 text-slate-400 text-[10px] font-mono">{u.created}</td>
                      <td className="p-3.5 text-right space-x-1">
                        {/* Edit Full User */}
                        <button
                          type="button"
                          onClick={() => handleOpenEditUser(u)}
                          className="p-1.5 rounded-lg hover:bg-slate-700 text-purple-300 hover:text-white transition-colors cursor-pointer"
                          title="Edit Lengkap Pengguna"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Toggle Status Icon */}
                        <button
                          type="button"
                          onClick={() => onToggleStatus?.(u.id)}
                          className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                          title={u.status === 'ACTIVE' ? 'Nonaktifkan Pengguna' : 'Aktifkan Pengguna'}
                        >
                          {u.status === 'ACTIVE' ? (
                            <UserX className="w-4 h-4 text-amber-400" />
                          ) : (
                            <UserCheck className="w-4 h-4 text-emerald-400" />
                          )}
                        </button>

                        {/* Delete User */}
                        <button
                          type="button"
                          disabled={isCurrent}
                          onClick={() => setDeletingUser(u)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isCurrent
                              ? 'opacity-30 cursor-not-allowed'
                              : 'hover:bg-rose-950/40 text-rose-400 hover:text-rose-300 cursor-pointer'
                          }`}
                          title={isCurrent ? 'Tidak dapat menghapus akun sendiri' : 'Hapus Pengguna'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 1. ADD USER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-purple-400" />
              <span>Tambah Pengguna Baru</span>
            </h3>

            {addError && (
              <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-800/60 text-xs text-rose-300">
                {addError}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  placeholder="mis. Budi Pratama"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Alamat Email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                  placeholder="budi@suga.io"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Password Awal</label>
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="user123"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Role Akun</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="PENGGUNA">Pengguna (Kreator)</option>
                    <option value="SUPER_ADMIN">Super Admin (Akses Penuh)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Saldo Kredit Awal</label>
                  <input
                    type="number"
                    value={newCredits}
                    onChange={(e) => setNewCredits(Number(e.target.value))}
                    min={0}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl suga-gradient-btn text-white font-bold cursor-pointer shadow-lg"
                >
                  Simpan & Buat Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. EDIT FULL USER MODAL */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setEditingUser(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <Edit className="w-4 h-4 text-purple-400" />
              <span>Edit Data Pengguna</span>
            </h3>

            {editError && (
              <div className="p-2.5 rounded-xl bg-rose-950/60 border border-rose-800/60 text-xs text-rose-300">
                {editError}
              </div>
            )}

            <form onSubmit={handleSaveEditUser} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Alamat Email</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Role Akun</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="PENGGUNA">Pengguna</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Status Akun</label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as UserStatus)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="ACTIVE">Aktif (ACTIVE)</option>
                    <option value="INACTIVE">Nonaktif (INACTIVE)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Saldo Kredit</label>
                <input
                  type="number"
                  value={editCredits}
                  onChange={(e) => setEditCredits(Number(e.target.value))}
                  min={0}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  Reset Password (Opsional)
                </label>
                <input
                  type="text"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  placeholder="Kosongkan jika tidak ingin mengubah password"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl suga-gradient-btn text-white font-bold cursor-pointer shadow-lg"
                >
                  Simpan Perubahan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. QUICK EDIT CREDITS MODAL */}
      {quickCreditUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setQuickCreditUser(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-base font-bold text-white font-heading">Ubah Saldo Kredit</h3>
            <p className="text-xs text-slate-400">
              Pengguna: <strong className="text-purple-300">{quickCreditUser.name}</strong>
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Jumlah Kredit Baru</label>
                <input
                  type="number"
                  value={quickCreditInput}
                  onChange={(e) => setQuickCreditInput(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-purple-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setQuickCreditInput((prev) => prev + 500)}
                  className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  +500
                </button>
                <button
                  type="button"
                  onClick={() => setQuickCreditInput((prev) => prev + 1000)}
                  className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  +1.000
                </button>
                <button
                  type="button"
                  onClick={() => setQuickCreditInput((prev) => prev + 5000)}
                  className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
                >
                  +5.000
                </button>
              </div>
              <button
                type="button"
                onClick={handleSaveQuickCredit}
                className="w-full py-2.5 rounded-xl suga-gradient-btn text-white font-bold cursor-pointer"
              >
                Simpan Kredit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. DELETE CONFIRMATION MODAL */}
      {deletingUser && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white font-heading">Konfirmasi Hapus Pengguna</h3>
            <p className="text-xs text-slate-400">
              Apakah Anda yakin ingin menghapus pengguna <strong className="text-white">{deletingUser.name}</strong> ({deletingUser.email})? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="grid grid-cols-2 gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setDeletingUser(null)}
                className="py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-rose-600/30"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Ya, Hapus</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
