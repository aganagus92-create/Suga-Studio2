import React, { useState, useRef } from 'react';
import {
  Music,
  Play,
  Square,
  Download,
  RefreshCw,
  X,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Clock,
  Volume2,
  Trash2
} from 'lucide-react';
import {
  audioBufferToWavBlob,
  triggerAudioDownload,
  renderMusicAudioTrack
} from '../../utils/audioExporter';

interface MusicGeneratorProps {
  onDeductCredits: (amount: number) => boolean;
  onShowToast: (msg: string) => void;
  onAddHistory: (type: string, title: string) => void;
}

interface MusicHistoryItem {
  id: string;
  title: string;
  genre: string;
  duration: string;
  date: string;
  bpm: number;
}

export const MusicGenerator: React.FC<MusicGeneratorProps> = ({
  onDeductCredits,
  onShowToast,
  onAddHistory
}) => {
  // Panjang & kapabilitas
  const [selectedDuration, setSelectedDuration] = useState<'30s_inst' | '30s_vocal' | '3m_vocal'>('3m_vocal');

  // Form states
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('Cinematic / Sinematik');
  const [moods, setMoods] = useState<string[]>(['Semangat']);
  const [instruments, setInstruments] = useState<string[]>(['Kendang']);
  const [tempo, setTempo] = useState('Sedang (~100 BPM)');
  const [vocal, setVocal] = useState('Instrumental (tanpa vokal)');
  const [showAdvanced, setShowAdvanced] = useState(true);

  // Generation & Playback
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{
    id: string;
    title: string;
    genre: string;
    duration: string;
    bpm: number;
    spec: string;
  } | null>(null);

  const [history, setHistory] = useState<MusicHistoryItem[]>([
    {
      id: 'm-init-1',
      title: 'Cinematic Nusantara Epic Morning',
      genre: 'Cinematic / Sinematik',
      duration: '~3 menit',
      date: '10:15 Hari ini',
      bpm: 110
    },
    {
      id: 'm-init-2',
      title: 'Lofi Chill Gamelan Rain',
      genre: 'Gamelan',
      duration: '~30 detik',
      date: 'Kemarin',
      bpm: 85
    }
  ]);

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Credit calculation
  const creditCost = selectedDuration === '30s_inst' ? 1 : selectedDuration === '30s_vocal' ? 2 : 6;
  const durationLabel = selectedDuration === '3m_vocal' ? '~3 menit' : '~30 detik';

  // Available Moods
  const availableMoods = [
    'Tenang',
    'Sedih / Melankolis',
    'Romantis',
    'Epic',
    'Nostalgik',
    'Ceria / Playful',
    'Tegang / Suspense',
    'Misterius',
    'Percaya Diri',
    'Semangat'
  ];

  // Available Instruments
  const availableInstruments = [
    'Piano',
    'Gitar Akustik',
    'Gitar Elektrik',
    'Drum',
    'Bass',
    'Synthesizer',
    'Strings',
    'Saxophone',
    'Trumpet',
    'Suling',
    'Perkusi',
    'Choir / Paduan Suara',
    'Organ',
    'Ukulele',
    'Harpa',
    'Suling Bambu',
    'Angklung',
    'Saron',
    'Bonang',
    'Kendang'
  ];

  const handleAddMood = (selected: string) => {
    if (selected && selected !== '+ tambah mood') {
      if (moods.length >= 3) {
        onShowToast('Maksimal 3 mood.');
        return;
      }
      if (!moods.includes(selected)) {
        setMoods([...moods, selected]);
      }
    }
  };

  const handleRemoveMood = (m: string) => {
    setMoods(moods.filter((item) => item !== m));
  };

  const handleAddInstrument = (inst: string) => {
    if (inst && inst !== '+ tambah instrumen') {
      if (instruments.length >= 4) {
        onShowToast('Maksimal 4 instrumen.');
        return;
      }
      if (!instruments.includes(inst)) {
        setInstruments([...instruments, inst]);
      }
    }
  };

  const handleRemoveInstrument = (inst: string) => {
    setInstruments(instruments.filter((item) => item !== inst));
  };

  // Play rich synthesized music loop in real time
  const playSynthesizerMelody = async (bpmValue: number, trackGenre: string = genre) => {
    stopMelody();

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;
      setIsPlaying(true);

      const buffer = await renderMusicAudioTrack(trackGenre, bpmValue, 12, instruments);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(ctx.destination);
      source.start();

      source.onended = () => {
        setIsPlaying(false);
      };
    } catch {
      setIsPlaying(false);
    }
  };

  const stopMelody = () => {
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {
        // ignore
      }
      audioCtxRef.current = null;
    }
    setIsPlaying(false);
  };

  const handleGenerate = () => {
    if (!onDeductCredits(creditCost)) return;

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);

      const bpmMatch = tempo.match(/(\d+)\s*BPM/);
      const bpm = bpmMatch ? parseInt(bpmMatch[1], 10) : 100;
      const title = description.trim() ? description.slice(0, 35) : `${genre} ${moods.join(' ')}`;

      const newResult = {
        id: Date.now().toString(),
        title: title,
        genre: genre,
        duration: durationLabel,
        bpm: bpm,
        spec: `Genre: ${genre}\nMood: ${moods.join(', ') || 'Natural'}\nInstrumen: ${instruments.join(', ') || 'Full Mix'}\nTempo: ${tempo}\nVokal: ${vocal}\nKualitas: 48kHz Stereo Mastered`
      };

      setGeneratedResult(newResult);
      setHistory((prev) => [
        {
          id: newResult.id,
          title: newResult.title,
          genre: newResult.genre,
          duration: newResult.duration,
          date: 'Baru saja',
          bpm: newResult.bpm
        },
        ...prev.slice(0, 11)
      ]);

      onShowToast(`Musik berhasil di-generate! (-${creditCost} kredit)`);
      onAddHistory('Music Generator', `${genre} — ${title}`);

      playSynthesizerMelody(bpm, genre);
    }, 1500);
  };

  // Real Audio File Download
  const handleDownloadMusic = async (trackTitle: string, trackGenre: string, bpmVal: number) => {
    try {
      setIsDownloading(true);
      onShowToast('Menyiapkan file audio musik MP3/WAV...');

      // Render 16-second loop
      const buffer = await renderMusicAudioTrack(trackGenre, bpmVal, 16, instruments);
      const wavBlob = audioBufferToWavBlob(buffer);
      const safeName = trackTitle.trim().replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase();
      const filename = `suga-music-${safeName || 'track'}-${Date.now()}.wav`;

      triggerAudioDownload(wavBlob, filename);
      setIsDownloading(false);
      onShowToast(`File ${filename} berhasil diunduh!`);
    } catch {
      setIsDownloading(false);
      onShowToast('Gagal memproses download musik.');
    }
  };

  const handleUsePromptExample = (text: string, gen: string) => {
    setDescription(text);
    setGenre(gen);
    onShowToast(`Template musik "${gen}" dipilih!`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
      {/* Left Column: Music Creation Form */}
      <div className="lg:col-span-6 xl:col-span-7 space-y-5">
        <div>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">🎵</span>
              <h2 className="text-lg font-bold text-white tracking-wide font-heading">Buat Musik BGM</h2>
            </div>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() =>
                  handleUsePromptExample('Musik megah sinematik orkestra untuk intro film petualangan Nusantara', 'Cinematic / Sinematik')
                }
                className="text-[10px] px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
              >
                Cinematic
              </button>
              <button
                type="button"
                onClick={() =>
                  handleUsePromptExample('Musik santai tabuhan gamelan Jawa berpadu lofi beats saat hujan', 'Gamelan')
                }
                className="text-[10px] px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
              >
                Gamelan
              </button>
              <button
                type="button"
                onClick={() =>
                  handleUsePromptExample('Irama dangdut koplo modern kendang rampak berenergi tinggi untuk joget TikTok', 'Koplo')
                }
                className="text-[10px] px-2 py-1 rounded bg-slate-800 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
              >
                Koplo
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Generate klip musik dari deskripsi teks. Pilih panjang sesuai kebutuhan — 30 detik untuk BGM cepat, atau sampai 3 menit untuk lagu penuh dengan vokal.
          </p>
        </div>

        {/* Panjang & kapabilitas */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300">Panjang & kapabilitas</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Card 1 */}
            <button
              type="button"
              onClick={() => setSelectedDuration('30s_inst')}
              className={`p-3 rounded-xl text-left transition-all cursor-pointer border ${
                selectedDuration === '30s_inst'
                  ? 'bg-[#1e1b4b] border-indigo-500 shadow-md shadow-indigo-950/40'
                  : 'bg-[#0f172a] border-[#1e293b] hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-bold text-white mb-1">~30 detik</div>
              <div className="text-[11px] text-slate-400 mb-2">Instrumental saja</div>
              <div className="text-[11px] font-semibold text-indigo-400">1 kredit</div>
            </button>

            {/* Card 2 */}
            <button
              type="button"
              onClick={() => setSelectedDuration('30s_vocal')}
              className={`p-3 rounded-xl text-left transition-all cursor-pointer border ${
                selectedDuration === '30s_vocal'
                  ? 'bg-[#1e1b4b] border-indigo-500 shadow-md shadow-indigo-950/40'
                  : 'bg-[#0f172a] border-[#1e293b] hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-bold text-white mb-1">~30 detik</div>
              <div className="text-[11px] text-slate-400 mb-2">Bisa dengan vokal · 2× biaya</div>
              <div className="text-[11px] font-semibold text-indigo-400">2 kredit</div>
            </button>

            {/* Card 3 */}
            <button
              type="button"
              onClick={() => setSelectedDuration('3m_vocal')}
              className={`p-3 rounded-xl text-left transition-all cursor-pointer border ${
                selectedDuration === '3m_vocal'
                  ? 'bg-[#1e1b4b] border-indigo-500 shadow-md shadow-indigo-950/40'
                  : 'bg-[#0f172a] border-[#1e293b] hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-bold text-white mb-1">~3 menit</div>
              <div className="text-[11px] text-slate-400 mb-2">Bisa dengan vokal · 6× biaya</div>
              <div className="text-[11px] font-semibold text-indigo-400">6 kredit</div>
            </button>
          </div>
        </div>

        {/* Deskripsi (opsional) */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300">
            Deskripsi (opsional)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Contoh: musik latar semangat untuk buka toko pagi hari..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f172a] border border-[#1e293b] focus:border-blue-500 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Accordion: Opsi Lanjutan */}
        <div className="border border-[#1e293b] rounded-2xl bg-[#091122] overflow-hidden">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full px-4 py-3 flex items-center justify-between text-xs font-bold text-slate-200 hover:bg-slate-800/40 transition-colors cursor-pointer"
          >
            <span>Opsi Lanjutan</span>
            {showAdvanced ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </button>

          {showAdvanced && (
            <div className="p-4 pt-2 border-t border-[#1e293b] space-y-4">
              {/* Row 1: Genre & Vokal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Genre */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">Genre</label>
                  <div className="relative">
                    <select
                      value={genre}
                      onChange={(e) => setGenre(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0f172a] border border-[#1e293b] focus:border-blue-500 text-xs text-slate-200 focus:outline-none appearance-none cursor-pointer pr-8"
                    >
                      <option value="Cinematic / Sinematik">Cinematic / Sinematik</option>
                      <option value="Ambient">Ambient</option>
                      <option value="Hip-Hop">Hip-Hop</option>
                      <option value="K-Pop">K-Pop</option>
                      <option value="J-Pop">J-Pop</option>
                      <option value="Bossa Nova">Bossa Nova</option>
                      <option value="Reggae">Reggae</option>
                      <option value="Trap">Trap</option>
                      <option value="Synthwave / Retro">Synthwave / Retro</option>
                      <option value="Gospel">Gospel</option>
                      <option value="Dangdut">Dangdut</option>
                      <option value="Koplo">Koplo</option>
                      <option value="Pop Indonesia">Pop Indonesia</option>
                      <option value="Gamelan">Gamelan</option>
                      <option value="Keroncong">Keroncong</option>
                      <option value="Jaipongan / Sunda">Jaipongan / Sunda</option>
                      <option value="Lagu Daerah">Lagu Daerah</option>
                      <option value="Gamelan Bali">Gamelan Bali</option>
                      <option value="Dangdut Modern / EDM">Dangdut Modern / EDM</option>
                      <option value="Rock Indonesia">Rock Indonesia</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Vokal */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">Vokal</label>
                  <div className="relative">
                    <select
                      value={vocal}
                      onChange={(e) => setVocal(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-[#0f172a] border border-[#1e293b] focus:border-blue-500 text-xs text-slate-200 focus:outline-none appearance-none cursor-pointer pr-8"
                    >
                      <option value="Instrumental (tanpa vokal)">Instrumental (tanpa vokal)</option>
                      <option value="Male — smooth">Male — smooth</option>
                      <option value="Male — powerful">Male — powerful</option>
                      <option value="Male — gravelly">Male — gravelly</option>
                      <option value="Female — sweet">Female — sweet</option>
                      <option value="Female — soulful">Female — soulful</option>
                      <option value="Female — soprano">Female — soprano</option>
                      <option value="Duet (male + female)">Duet (male + female)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
                      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 2: Mood & Instrumen Chips */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Mood Multi-Select */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Mood (Maks. 3)
                  </label>
                  <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-[#0f172a] border border-[#1e293b] min-h-[42px] items-center">
                    {moods.map((m) => (
                      <span
                        key={m}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-blue-900/50 text-blue-200 text-[11px] font-medium border border-blue-800/60"
                      >
                        {m}
                        <button
                          type="button"
                          onClick={() => handleRemoveMood(m)}
                          className="hover:text-rose-400 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {moods.length < 3 && (
                      <select
                        onChange={(e) => {
                          handleAddMood(e.target.value);
                          e.target.value = '+ tambah mood';
                        }}
                        defaultValue="+ tambah mood"
                        className="bg-transparent text-[11px] text-slate-400 focus:outline-none cursor-pointer border-none py-1"
                      >
                        <option value="+ tambah mood" disabled>
                          + tambah mood
                        </option>
                        {availableMoods
                          .filter((am) => !moods.includes(am))
                          .map((am) => (
                            <option key={am} value={am} className="bg-slate-900 text-slate-200">
                              {am}
                            </option>
                          ))}
                      </select>
                    )}
                  </div>
                </div>

                {/* Instrumen Multi-Select */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Instrumen utama (Maks. 4)
                  </label>
                  <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-[#0f172a] border border-[#1e293b] min-h-[42px] items-center">
                    {instruments.map((inst) => (
                      <span
                        key={inst}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-purple-900/50 text-purple-200 text-[11px] font-medium border border-purple-800/60"
                      >
                        {inst}
                        <button
                          type="button"
                          onClick={() => handleRemoveInstrument(inst)}
                          className="hover:text-rose-400 cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    {instruments.length < 4 && (
                      <select
                        onChange={(e) => {
                          handleAddInstrument(e.target.value);
                          e.target.value = '+ tambah instrumen';
                        }}
                        defaultValue="+ tambah instrumen"
                        className="bg-transparent text-[11px] text-slate-400 focus:outline-none cursor-pointer border-none py-1"
                      >
                        <option value="+ tambah instrumen" disabled>
                          + tambah instrumen
                        </option>
                        {availableInstruments
                          .filter((ai) => !instruments.includes(ai))
                          .map((ai) => (
                            <option key={ai} value={ai} className="bg-slate-900 text-slate-200">
                              {ai}
                            </option>
                          ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>

              {/* Row 3: Tempo Buttons */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">Tempo</label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Sangat Lambat (~60 BPM)',
                    'Lambat (~80 BPM)',
                    'Sedang (~100 BPM)',
                    'Upbeat (~120 BPM)',
                    'Cepat (~140 BPM)',
                    'Sangat Cepat (~160 BPM)'
                  ].map((t) => {
                    const isSelected = tempo === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTempo(t)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-900/40 border border-blue-500'
                            : 'bg-[#0f172a] border border-[#1e293b] text-slate-300 hover:border-slate-700 hover:text-white'
                        }`}
                      >
                        {t}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Generate Button */}
        <div>
          <button
            type="button"
            disabled={isGenerating}
            onClick={handleGenerate}
            className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.99] disabled:opacity-50 text-white text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shadow-blue-950/50 transition-all cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Meracik Musik AI...</span>
              </>
            ) : (
              <>
                <Music className="w-4 h-4" />
                <span>Generate Musik · {creditCost} kredit</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Column: Hasil & Riwayat */}
      <div className="lg:col-span-6 xl:col-span-5 space-y-5">
        {/* Panel 1: Hasil */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300">Hasil Audio Musik</h3>
            {isPlaying && (
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Sedang Memutar Audio
              </span>
            )}
          </div>

          <div className="min-h-[200px] rounded-2xl bg-[#0b1329] border border-[#1e293b] p-5 flex flex-col justify-center items-center">
            {!generatedResult ? (
              <div className="text-center py-8 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center mx-auto text-slate-400 text-lg">
                  🎵
                </div>
                <p className="text-xs font-semibold text-slate-300">Belum ada hasil.</p>
                <p className="text-[11px] text-slate-500">
                  Klip musik yang digenerate akan muncul di sini.
                </p>
              </div>
            ) : (
              <div className="w-full space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div>
                    <h4 className="text-xs font-bold text-slate-100">{generatedResult.title}</h4>
                    <p className="text-[10px] text-slate-400">
                      {generatedResult.genre} · {generatedResult.duration} · {generatedResult.bpm} BPM
                    </p>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-800/60 text-[10px] text-emerald-400 font-mono">
                    Ready
                  </span>
                </div>

                <div className="p-3 bg-[#0f172a] rounded-xl border border-[#1e293b] space-y-2.5">
                  <div className="flex items-center justify-center gap-1 h-10 bg-slate-950/60 rounded p-1">
                    {[16, 28, 40, 24, 32, 48, 20, 36, 44, 28, 16, 32, 40, 24, 36, 48, 20, 28, 40, 32].map(
                      (val, idx) => (
                        <div
                          key={idx}
                          className={`w-1 rounded-full transition-all duration-300 ${
                            isPlaying ? 'bg-indigo-500 animate-pulse' : 'bg-slate-700'
                          }`}
                          style={{
                            height: isPlaying ? `${Math.max(8, (val * ((idx % 3) + 1)) / 3)}px` : '6px',
                            animationDelay: `${idx * 40}ms`
                          }}
                        />
                      )
                    )}
                  </div>

                  <div className="text-[10px] text-slate-400 whitespace-pre-line font-mono bg-slate-900/60 p-2 rounded">
                    {generatedResult.spec}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    {isPlaying ? (
                      <button
                        type="button"
                        onClick={stopMelody}
                        className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                      >
                        <Square className="w-3.5 h-3.5" />
                        <span>Stop</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => playSynthesizerMelody(generatedResult.bpm, generatedResult.genre)}
                        className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Putar Musik</span>
                      </button>
                    )}

                    <button
                      type="button"
                      disabled={isDownloading}
                      onClick={() =>
                        handleDownloadMusic(
                          generatedResult.title,
                          generatedResult.genre,
                          generatedResult.bpm
                        )
                      }
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 cursor-pointer"
                    >
                      {isDownloading ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : (
                        <Download className="w-3 h-3" />
                      )}
                      <span>Download WAV</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Panel 2: Riwayat */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Riwayat ({history.length})</span>
            </h3>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onShowToast('Riwayat musik diperbarui.');
                }}
                className="text-[11px] text-slate-400 hover:text-slate-200 cursor-pointer flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Refresh</span>
              </button>
              {history.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setHistory([]);
                    onShowToast('Riwayat musik dibersihkan.');
                  }}
                  className="text-[11px] text-slate-500 hover:text-rose-400 cursor-pointer"
                >
                  Bersihkan
                </button>
              )}
            </div>
          </div>

          <div className="min-h-[140px] rounded-2xl bg-[#0b1329] border border-[#1e293b] p-4 flex flex-col justify-center items-center">
            {history.length === 0 ? (
              <div className="text-center py-4 space-y-1">
                <Clock className="w-7 h-7 text-slate-600 mx-auto mb-1.5" />
                <p className="text-xs font-medium text-slate-400">Belum ada klip yang tersimpan.</p>
                <p className="text-[10px] text-slate-500">
                  Riwayat menampilkan hingga 12 klip terakhir.
                </p>
              </div>
            ) : (
              <div className="w-full space-y-2">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl bg-[#0f172a] border border-[#1e293b] flex items-center justify-between text-xs hover:border-slate-700 transition-colors"
                  >
                    <div className="max-w-[60%] space-y-0.5">
                      <p className="font-semibold text-slate-200 truncate">{item.title}</p>
                      <p className="text-[10px] text-slate-500">
                        {item.genre} · {item.duration} · {item.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => playSynthesizerMelody(item.bpm, item.genre)}
                        className="p-1.5 rounded-lg bg-blue-900/50 hover:bg-blue-800 text-blue-300 cursor-pointer"
                        title="Putar"
                      >
                        <Play className="w-3 h-3 fill-current" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadMusic(item.title, item.genre, item.bpm)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                        title="Download"
                      >
                        <Download className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
