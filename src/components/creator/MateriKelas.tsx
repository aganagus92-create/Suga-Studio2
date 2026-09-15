import React, { useState } from 'react';
import { GraduationCap, PlayCircle, Lock, X, Video, BookOpen } from 'lucide-react';
import { tutorialModules } from '../../data/mockData';
import { TutorialModule } from '../../types';

interface MateriKelasProps {
  onShowToast: (msg: string) => void;
  modules?: TutorialModule[];
}

export const MateriKelas: React.FC<MateriKelasProps> = ({ onShowToast, modules }) => {
  const [selectedModule, setSelectedModule] = useState<TutorialModule | null>(null);
  const safeModules = Array.isArray(modules) && modules.length > 0 ? modules : tutorialModules;

  const handleOpenModule = (mod: TutorialModule) => {
    setSelectedModule(mod);
    onShowToast(`Membuka Modul #${mod.id}: ${mod.title}`);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white font-heading flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>Materi Kelas & Tutorial Video</span>
            </h3>
            <p className="text-xs text-slate-400">
              Pelajari trik prompt master, workflow Affiliate UGC, dan optimasi studio AI SUGA
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
            {safeModules.length} Modul Siap Tonton
          </span>
        </div>

        {/* Grid of Tutorial Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {safeModules.map((mod) => (
            <div
              key={mod.id}
              onClick={() => handleOpenModule(mod)}
              className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex flex-col justify-between space-y-3 group hover:border-purple-500/60 transition-all cursor-pointer shadow-lg"
            >
              {/* Thumbnail Container */}
              <div className="h-28 rounded-xl bg-gradient-to-tr from-purple-950 via-slate-900 to-slate-950 border border-slate-700 flex items-center justify-center relative overflow-hidden group-hover:border-purple-500/50 transition-colors">
                <PlayCircle className="w-9 h-9 text-white/80 group-hover:scale-110 group-hover:text-purple-300 transition-all" />
                <span className="absolute top-2 left-2 text-[9px] bg-rose-600 px-1.5 py-0.5 rounded font-bold text-white uppercase tracking-wider">
                  Video
                </span>
                <span className="absolute bottom-2 right-2 text-[9px] bg-black/70 backdrop-blur px-1.5 py-0.5 rounded text-slate-300 font-mono">
                  {mod.duration}
                </span>
              </div>

              <div>
                <span className="text-[9px] text-purple-400 font-bold uppercase tracking-wider block mb-1">
                  {mod.category} • {mod.views} views
                </span>
                <h4 className="text-[11px] font-bold text-slate-200 line-clamp-2 leading-tight group-hover:text-white transition-colors">
                  {mod.title}
                </h4>
              </div>

              <button
                type="button"
                className="w-full py-2 rounded-xl bg-rose-600/90 group-hover:bg-rose-500 text-white font-bold text-[10px] tracking-wider uppercase flex items-center justify-center space-x-1 shadow transition-colors cursor-pointer"
              >
                <Lock className="w-3 h-3" />
                <span>AKSES TOOLS SAKTI</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Tutorial Video / Content Modal */}
      {selectedModule && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b1120] border border-slate-800 rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative text-slate-100">
            <button
              type="button"
              onClick={() => setSelectedModule(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold text-purple-400 uppercase tracking-wider">
                Modul #{selectedModule.id} • {selectedModule.category}
              </span>
              <h3 className="text-base font-bold text-white leading-snug">{selectedModule.title}</h3>
            </div>

            {/* Video Player Mock */}
            <div className="h-64 rounded-2xl bg-black border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden group">
              <div className="w-14 h-14 rounded-full bg-purple-600/80 flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition-transform">
                <PlayCircle className="w-8 h-8" />
              </div>
              <p className="text-xs text-slate-300 mt-3 font-semibold">Memutar Video Tutorial HD</p>
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>00:00 / {selectedModule.duration}</span>
                <span>1080p 60fps</span>
              </div>
            </div>

            {/* Key Takeaways */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                <span>Poin Pembelajaran Inti:</span>
              </span>
              <ul className="list-disc list-inside space-y-1 text-slate-300">
                <li>Struktur prompt utama untuk engagement tinggi di media sosial.</li>
                <li>Teknik pencahayaan natural dan framing konsistensi model.</li>
                <li>Optimasi kredit untuk workflow harian tanpa boros.</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => setSelectedModule(null)}
              className="w-full py-3 rounded-xl suga-gradient-btn text-white text-xs font-bold cursor-pointer"
            >
              Tutup Pemutar Video
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
