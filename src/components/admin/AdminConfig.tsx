import React, { useState } from 'react';
import { Sliders, Save, CheckCircle2 } from 'lucide-react';

interface AdminConfigProps {
  onSaveConfig?: (portalName: string, defaultCredits: number, sessionTimeout: number) => void;
}

export const AdminConfig: React.FC<AdminConfigProps> = ({
  onSaveConfig = (_portalName: string, _defaultCredits: number, _sessionTimeout: number) => {}
}) => {
  const [portalName, setPortalName] = useState('SUGA GENERATOR');
  const [defaultCredits, setDefaultCredits] = useState(278);
  const [sessionTimeout, setSessionTimeout] = useState(60);
  const [allowRegistration, setAllowRegistration] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(portalName, defaultCredits, sessionTimeout);
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-5 shadow-xl">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
            <Sliders className="w-4 h-4 text-slate-300" />
            <span>Konfigurasi Sistem Global</span>
          </h3>
          <p className="text-xs text-slate-400">
            Parameter operasional Suga AI Engine & Super Admin Studio
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-bold mb-1">Nama Studio Portal</label>
            <input
              type="text"
              value={portalName}
              onChange={(e) => setPortalName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Kredit Default Pengguna Baru</label>
              <input
                type="number"
                value={defaultCredits}
                onChange={(e) => setDefaultCredits(Number(e.target.value))}
                min={0}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-bold mb-1">Session Timeout (Menit)</label>
              <input
                type="number"
                value={sessionTimeout}
                onChange={(e) => setSessionTimeout(Number(e.target.value))}
                min={5}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/80 flex items-center justify-between">
            <div>
              <span className="font-bold text-white block">Izinkan Registrasi Pengguna Mandiri</span>
              <span className="text-[11px] text-slate-400">
                Jika dinonaktifkan, hanya Super Admin yang dapat menambahkan akun baru.
              </span>
            </div>
            <input
              type="checkbox"
              checked={allowRegistration}
              onChange={(e) => setAllowRegistration(e.target.checked)}
              className="accent-purple-600 w-4 h-4 cursor-pointer"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl suga-gradient-btn text-white font-bold flex items-center justify-center space-x-2 shadow-lg cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Konfigurasi Sistem</span>
          </button>
        </form>
      </div>
    </div>
  );
};
