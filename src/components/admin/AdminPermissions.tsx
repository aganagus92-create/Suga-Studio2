import React, { useState, useEffect } from 'react';
import { Key, Save, Check, RefreshCw, Search, ShieldCheck, Lock, Unlock } from 'lucide-react';
import { PermissionItem } from '../../types';
import { initialPermissions } from '../../data/mockData';

interface AdminPermissionsProps {
  permissions?: PermissionItem[];
  onSavePermissions?: (updated: PermissionItem[]) => void;
  onShowToast?: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const AdminPermissions: React.FC<AdminPermissionsProps> = ({
  permissions = [],
  onSavePermissions,
  onShowToast
}) => {
  const [localPermissions, setLocalPermissions] = useState<PermissionItem[]>(
    Array.isArray(permissions) ? permissions : []
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (Array.isArray(permissions)) {
      setLocalPermissions(permissions);
    }
  }, [permissions]);

  const handleToggleUserPermission = (id: string) => {
    setLocalPermissions((prev) =>
      prev.map((item) => (item.id === id ? { ...item, user: !item.user } : item))
    );
    setHasChanges(true);
  };

  const handleSave = () => {
    onSavePermissions?.(localPermissions);
    setHasChanges(false);
    onShowToast?.('Matriks hak akses (RBAC) berhasil disimpan dan diterapkan ke seluruh pengguna!', 'success');
  };

  const handleResetDefaults = () => {
    setLocalPermissions(initialPermissions);
    setHasChanges(true);
    onShowToast?.('Matriks permission dikembalikan ke pengaturan awal (default).', 'info');
  };

  const filteredPermissions = localPermissions.filter((perm) => {
    const q = searchQuery.toLowerCase();
    return perm.name.toLowerCase().includes(q) || perm.desc.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4">
      <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-4 shadow-xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-400" />
              <span>Role & Permission Matrix (Kontrol Akses Pengguna)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Atur hak akses modular untuk peran Pengguna (Kreator). Super Admin selalu memiliki akses penuh tanpa batasan.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold border border-slate-700 flex items-center space-x-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </button>
            <button
              type="button"
              onClick={handleSave}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-lg transition-all cursor-pointer ${
                hasChanges
                  ? 'bg-purple-600 hover:bg-purple-500 text-white animate-pulse'
                  : 'suga-gradient-btn text-white'
              }`}
            >
              <Save className="w-3.5 h-3.5" />
              <span>{hasChanges ? 'Simpan Perubahan Matriks*' : 'Simpan Matriks'}</span>
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari izin fitur atau modul..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>
          <div className="text-xs text-slate-400">
            {hasChanges && (
              <span className="text-amber-400 font-semibold flex items-center gap-1">
                * Ada perubahan yang belum disimpan
              </span>
            )}
          </div>
        </div>

        {/* Matrix Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-800/80 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Fitur / Modul Sistem</th>
                <th className="p-3.5 text-center w-36">Super Admin</th>
                <th className="p-3.5 text-center w-36">Akses Pengguna</th>
                <th className="p-3.5">Keterangan & Lingkup Akses</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredPermissions.map((perm) => (
                <tr key={perm.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-3.5 font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <span className="text-white">{perm.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">({perm.id})</span>
                    </div>
                  </td>
                  <td className="p-3.5 text-center">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-bold border border-pink-500/30">
                      <ShieldCheck className="w-3 h-3" />
                      <span>Penuh (Bypass)</span>
                    </span>
                  </td>
                  <td className="p-3.5 text-center">
                    <button
                      type="button"
                      onClick={() => handleToggleUserPermission(perm.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                        perm.user
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                      }`}
                    >
                      {perm.user ? (
                        <>
                          <Unlock className="w-3 h-3 text-emerald-400" />
                          <span>Diizinkan</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3 h-3 text-rose-400" />
                          <span>Dibatasi</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="p-3.5 text-slate-400 text-[11px] leading-relaxed">{perm.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
