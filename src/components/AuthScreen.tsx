import React, { useState } from 'react';
import { ShieldAlert, User as UserIcon, LogIn, Sparkles } from 'lucide-react';
import { User, UserRole } from '../types';

interface AuthScreenProps {
  onLogin: (user: User) => void;
  users: User[];
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, users }) => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleQuickLogin = (role: UserRole) => {
    const targetEmail = role === 'SUPER_ADMIN' ? 'admin@suga.io' : 'user@suga.io';
    setEmail(targetEmail);
    setPassword('Demo1234!');
    performLogin(targetEmail);
  };

  const performLogin = (inputEmail: string) => {
    setErrorMsg('');
    const trimmed = inputEmail.trim().toLowerCase();
    let found = users.find((u) => u.email.toLowerCase() === trimmed);

    if (!found) {
      // Auto register demo user if not in list
      found = {
        id: 'usr-' + Date.now(),
        name: trimmed.split('@')[0],
        email: trimmed,
        role: trimmed.includes('admin') ? 'SUPER_ADMIN' : 'PENGGUNA',
        credits: 278,
        status: 'ACTIVE',
        created: 'Hari ini'
      };
    }

    if (found.status === 'INACTIVE') {
      setErrorMsg('Akun ini sedang dinonaktifkan oleh administrator sistem.');
      return;
    }

    if (password && found.password && found.password !== password && password !== 'Demo1234!') {
      setErrorMsg('Kata sandi yang Anda masukkan salah. Password default: admin123 / user123');
      return;
    }

    onLogin(found);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Alamat email wajib diisi.');
      return;
    }
    performLogin(email);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-[#060913] via-[#0b1120] to-[#120a21]">
      <div className="max-w-md w-full p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 via-violet-600 to-pink-500 p-0.5 mx-auto shadow-lg shadow-purple-600/30 flex items-center justify-center">
            <div className="w-full h-full bg-[#0b1120] rounded-[14px] flex items-center justify-center">
              <span className="font-black text-2xl text-pink-400">S</span>
            </div>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-wide text-white font-heading">
            SUGA GENERATOR
          </h2>
          <p className="text-xs text-slate-400">Portal AI Creative Studio & Sistem Manajemen Akses</p>
        </div>

        {/* Quick Demo Login Buttons */}
        <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/80 space-y-2.5">
          <div className="flex items-center justify-center gap-1 text-[11px] font-bold text-slate-300 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
            <span>Akses Cepat 1-Klik Demo</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('SUPER_ADMIN')}
              className="p-2.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-700/60 text-left transition-all group cursor-pointer"
            >
              <div className="flex items-center space-x-1.5 text-purple-300 text-xs font-bold">
                <ShieldAlert className="w-3.5 h-3.5 text-pink-400" />
                <span>SUPER ADMIN</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono truncate">admin@suga.io</p>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('PENGGUNA')}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-600 text-left transition-all group cursor-pointer"
            >
              <div className="flex items-center space-x-1.5 text-sky-300 text-xs font-bold">
                <UserIcon className="w-3.5 h-3.5 text-sky-400" />
                <span>PENGGUNA</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono truncate">user@suga.io</p>
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/60 text-xs text-rose-300">
            {errorMsg}
          </div>
        )}

        {/* Form Login */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Email Pengguna</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="nama@email.com"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Kata Sandi</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl suga-gradient-btn text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-lg cursor-pointer"
          >
            <LogIn className="w-4 h-4" />
            <span>Masuk ke Dashboard</span>
          </button>
        </form>

        <div className="text-center pt-1 text-[11px] text-slate-400">
          Akun Demo: <span className="font-mono text-purple-300">admin@suga.io</span> /{' '}
          <span className="font-mono text-sky-300">user@suga.io</span>
        </div>
      </div>
    </div>
  );
};
