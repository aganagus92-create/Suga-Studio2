import React, { useState } from 'react';
import {
  Volume2,
  Play,
  Square,
  Download,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  RotateCcw,
  VolumeX,
  History,
  Clock,
  Trash2
} from 'lucide-react';
import {
  audioBufferToWavBlob,
  triggerAudioDownload,
  renderSpeechAudioTrack
} from '../../utils/audioExporter';

interface TextToSpeechProps {
  onDeductCredits: (amount: number) => boolean;
  onShowToast: (msg: string) => void;
  onAddHistory: (type: string, title: string) => void;
}

interface AudioResult {
  id: string;
  text: string;
  voice: string;
  style: string;
  speed: string;
  timestamp: string;
  durationSec?: number;
}

export const TextToSpeech: React.FC<TextToSpeechProps> = ({
  onDeductCredits,
  onShowToast,
  onAddHistory
}) => {
  const [text, setText] = useState('');
  const [gayaKonten, setGayaKonten] = useState('Natural / Percakapan — Paling mirip manusia');
  const [suara, setSuara] = useState('Sulafat — hangat');
  const [kecepatan, setKecepatan] = useState('1×');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [audioResult, setAudioResult] = useState<AudioResult | null>(null);
  const [ttsHistory, setTtsHistory] = useState<AudioResult[]>([]);
  const [isPreviewingVoice, setIsPreviewingVoice] = useState(false);

  const speedMultiplier = {
    '0.75×': 0.75,
    '1×': 1.0,
    '1.25×': 1.25,
    '1.5×': 1.5
  }[kecepatan] || 1.0;

  // Speak speech synthesis
  const speakAudio = (textToSpeak: string, selectedVoice: string, speedRate: number) => {
    if (!('speechSynthesis' in window)) {
      onShowToast('Browser ini tidak mendukung speech synthesis.');
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'id-ID';
    utterance.rate = speedRate;

    // Pitch variation based on character
    if (
      selectedVoice.includes('Leda') ||
      selectedVoice.includes('Puck') ||
      selectedVoice.includes('Aoede') ||
      selectedVoice.includes('muda')
    ) {
      utterance.pitch = 1.25;
    } else if (
      selectedVoice.includes('Kore') ||
      selectedVoice.includes('Orus') ||
      selectedVoice.includes('Fenrir') ||
      selectedVoice.includes('tegas')
    ) {
      utterance.pitch = 0.85;
    } else {
      utterance.pitch = 1.0;
    }

    const voices = window.speechSynthesis.getVoices();
    const indonesianVoice = voices.find(
      (v) => v.lang.includes('id') || v.lang.includes('ID') || v.name.toLowerCase().includes('indonesia')
    );
    if (indonesianVoice) {
      utterance.voice = indonesianVoice;
    }

    setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPreviewingVoice(false);
    onShowToast('Pemutaran suara dihentikan.');
  };

  // Quick Voice Preview test
  const handlePreviewVoice = () => {
    if (isPreviewingVoice || isPlaying) {
      handleStop();
      return;
    }
    setIsPreviewingVoice(true);
    const sampleText = `Halo! Ini adalah contoh suara ${suara.split('—')[0].trim()} dengan gaya ${gayaKonten.split('—')[0].trim()}.`;
    speakAudio(sampleText, suara, speedMultiplier);
    setTimeout(() => {
      setIsPreviewingVoice(false);
    }, 3500);
  };

  // Sample prompt insert
  const handleUseSample = () => {
    const samples = [
      'Kulit kusam gara-gara sering lembur? Jangan khawatir! Ini dia serum ceramide barrier yang bikin glowing dalam 7 hari. Cek keranjang kuning sekarang!',
      'Tahukah kalian bahwa di dasar Palung Mariana terdapat organisme unik yang bisa memancarkan cahaya sendiri tanpa sinar matahari sama sekali?',
      'Selamat pagi rekan creator! Jangan lupa konsistensi posting konten tiap jam 7 malam untuk memaksimalkan peluang masuk FYP TikTok.'
    ];
    const picked = samples[Math.floor(Math.random() * samples.length)];
    setText(picked);
    onShowToast('Contoh naskah berhasil dimasukkan!');
  };

  const handleGenerate = () => {
    if (!text.trim()) {
      onShowToast('Ketik teks bahasa Indonesia yang ingin diubah menjadi suara...');
      return;
    }

    if (!onDeductCredits(10)) return;

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);

      const newResult: AudioResult = {
        id: Date.now().toString(),
        text: text,
        voice: suara,
        style: gayaKonten,
        speed: kecepatan,
        timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        durationSec: Math.max(3, Math.round(text.length / 15))
      };

      setAudioResult(newResult);
      setTtsHistory((prev) => [newResult, ...prev.slice(0, 7)]);
      onShowToast('Audio suara berhasil di-generate! (-10 kredit)');
      onAddHistory('Text to Speech', `${suara.split('—')[0]} — ${text.slice(0, 30)}...`);

      // Automatically speak when generated
      speakAudio(text, suara, speedMultiplier);
    }, 1200);
  };

  // Real Audio Download handler
  const handleDownloadAudio = async (item: AudioResult) => {
    try {
      setIsDownloading(true);
      onShowToast('Menyiapkan file audio MP3/WAV...');

      // Render audio buffer
      const buffer = await renderSpeechAudioTrack(item.text, item.voice, speedMultiplier);
      const wavBlob = audioBufferToWavBlob(buffer);
      const voiceClean = item.voice.split('—')[0].trim().replace(/\s+/g, '-').toLowerCase();
      const filename = `suga-tts-${voiceClean}-${Date.now()}.wav`;

      triggerAudioDownload(wavBlob, filename);
      setIsDownloading(false);
      onShowToast(`File ${filename} berhasil diunduh!`);
    } catch {
      setIsDownloading(false);
      onShowToast('Gagal memproses download audio.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
      {/* Left Column: Form Settings */}
      <div className="lg:col-span-6 xl:col-span-5 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎙️</span>
            <h2 className="text-lg font-bold text-white tracking-wide font-heading">
              Text to Speech (Indonesia)
            </h2>
          </div>
          <button
            type="button"
            onClick={handleUseSample}
            className="text-[11px] px-2.5 py-1 rounded-lg bg-blue-950/60 border border-blue-800/60 text-blue-300 hover:text-white hover:bg-blue-900/60 transition-colors cursor-pointer flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3" />
            <span>Contoh Teks</span>
          </button>
        </div>

        {/* Input Text */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-300">
              Teks (Bahasa Indonesia)
            </label>
            {text && (
              <button
                type="button"
                onClick={() => setText('')}
                className="text-[10px] text-slate-500 hover:text-slate-300 cursor-pointer"
              >
                Hapus
              </button>
            )}
          </div>
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 3000))}
              placeholder="Ketik teks bahasa Indonesia yang ingin diubah menjadi suara..."
              rows={6}
              className="w-full p-3.5 pb-7 rounded-2xl bg-[#0f172a] border border-[#1e293b] focus:border-blue-500 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none transition-colors resize-y leading-relaxed"
            />
            <div className="absolute right-3.5 bottom-2.5 text-[11px] text-slate-500 font-mono">
              {text.length} / 3000
            </div>
          </div>
        </div>

        {/* Gaya Konten */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300">Gaya Konten</label>
          <div className="relative">
            <select
              value={gayaKonten}
              onChange={(e) => setGayaKonten(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f172a] border border-[#1e293b] focus:border-blue-500 text-xs sm:text-sm text-slate-200 focus:outline-none appearance-none cursor-pointer pr-10"
            >
              <option value="Natural / Percakapan — Paling mirip manusia">
                Natural / Percakapan — Paling mirip manusia
              </option>
              <option value="Berita — Jelas & profesional">Berita — Jelas & profesional</option>
              <option value="Affiliate / Promosi — Energik & persuasif">
                Affiliate / Promosi — Energik & persuasif
              </option>
              <option value="Naratif / Dongeng — Hangat & tenang">
                Naratif / Dongeng — Hangat & tenang
              </option>
              <option value="Edukasi / Tutorial — Berwibawa & tegas">
                Edukasi / Tutorial — Berwibawa & tegas
              </option>
              <option value="Santai / Obrolan — Halus & seimbang">
                Santai / Obrolan — Halus & seimbang
              </option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Suara & Pratinjau Suara */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-300">Pilihan Suara</label>
            <button
              type="button"
              onClick={handlePreviewVoice}
              className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium cursor-pointer"
            >
              {isPreviewingVoice ? (
                <>
                  <Square className="w-3 h-3 text-rose-400" />
                  <span className="text-rose-400">Stop Tes</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3 h-3" />
                  <span>Tes Suara Ini</span>
                </>
              )}
            </button>
          </div>
          <div className="relative">
            <select
              value={suara}
              onChange={(e) => setSuara(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#0f172a] border border-[#1e293b] focus:border-blue-500 text-xs sm:text-sm text-slate-200 focus:outline-none appearance-none cursor-pointer pr-10"
            >
              <option value="Ikuti Gaya (otomatis)">Ikuti Gaya (otomatis)</option>

              <optgroup label="Hangat & Ramah" className="bg-slate-900 text-slate-400 font-semibold">
                <option value="Sulafat — hangat" className="text-slate-100">
                  Sulafat — hangat (Pria / Ramah)
                </option>
                <option value="Achird — ramah" className="text-slate-100">
                  Achird — ramah (Pria / Bersahabat)
                </option>
                <option value="Leda — muda, ceria" className="text-slate-100">
                  Leda — muda, ceria (Wanita / Fresh)
                </option>
                <option value="Vindemiatrix — lembut" className="text-slate-100">
                  Vindemiatrix — lembut (Wanita / Kalem)
                </option>
              </optgroup>

              <optgroup label="Tegas & Jelas" className="bg-slate-900 text-slate-400 font-semibold">
                <option value="Kore — tegas" className="text-slate-100">
                  Kore — tegas (Pria / Berwibawa)
                </option>
                <option value="Orus — mantap" className="text-slate-100">
                  Orus — mantap (Pria / Berita)
                </option>
                <option value="Charon — informatif" className="text-slate-100">
                  Charon — informatif (Pria / Narator)
                </option>
                <option value="Iapetus — jernih" className="text-slate-100">
                  Iapetus — jernih (Pria / Presenter)
                </option>
              </optgroup>

              <optgroup label="Ceria & Energik" className="bg-slate-900 text-slate-400 font-semibold">
                <option value="Puck — energik" className="text-slate-100">
                  Puck — energik (Remaja / TikTok)
                </option>
                <option value="Fenrir — bersemangat" className="text-slate-100">
                  Fenrir — bersemangat (Pria / Hype)
                </option>
                <option value="Aoede — santai" className="text-slate-100">
                  Aoede — santai (Wanita / Podcast)
                </option>
                <option value="Callirrhoe — easy-going" className="text-slate-100">
                  Callirrhoe — easy-going (Wanita / Kasual)
                </option>
              </optgroup>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-slate-400">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Kecepatan */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300">Kecepatan Bicara</label>
          <div className="flex items-center gap-2">
            {(['0.75×', '1×', '1.25×', '1.5×'] as const).map((spd) => {
              const isSelected = kecepatan === spd;
              return (
                <button
                  key={spd}
                  type="button"
                  onClick={() => setKecepatan(spd)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-900/40 border border-blue-500'
                      : 'bg-[#0f172a] border border-[#1e293b] text-slate-300 hover:border-slate-700 hover:text-white'
                  }`}
                >
                  {spd}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tips natural */}
        <p className="text-[11px] text-slate-400 leading-relaxed bg-[#0b1329] p-3 rounded-xl border border-slate-800/80">
          💡 <span className="font-semibold text-slate-300">Tips Natural:</span> Gunakan tanda baca
          wajar (koma, titik, tanda tanya) untuk mengatur intonasi dan jeda napas yang alami.
        </p>

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
                <span>Memproses Suara AI...</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4" />
                <span>Generate Suara · 10 kredit</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Column: Hasil Audio & Riwayat */}
      <div className="lg:col-span-6 xl:col-span-7 space-y-4">
        <h3 className="text-sm font-bold text-slate-200">Hasil Audio</h3>

        <div className="min-h-[300px] rounded-2xl bg-[#0b1329] border border-[#1e293b] p-6 flex flex-col justify-center items-center">
          {!audioResult ? (
            <div className="text-center space-y-2 py-12">
              <div className="w-12 h-12 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center mx-auto text-slate-400 text-xl">
                🎙️
              </div>
              <p className="text-sm font-semibold text-slate-300">Belum ada audio</p>
              <p className="text-xs text-slate-500">Hasil generate akan muncul di sini</p>
            </div>
          ) : (
            <div className="w-full space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-bold text-slate-200">
                    Klip Suara Tergenerate ({audioResult.voice.split('—')[0]})
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">{audioResult.timestamp}</span>
              </div>

              {/* Sound Wave Animation / Player */}
              <div className="p-4 rounded-xl bg-[#0f172a] border border-[#1e293b] space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Gaya: {audioResult.style.split('—')[0]}</span>
                  <span>Kecepatan: {audioResult.speed}</span>
                </div>

                {/* Animated Waveform Bars */}
                <div className="flex items-center justify-center gap-1.5 h-14 bg-slate-950/60 rounded-lg p-2 overflow-hidden">
                  {[24, 48, 30, 56, 42, 60, 36, 52, 28, 64, 40, 58, 32, 50, 26, 44, 62, 38, 48, 30].map(
                    (height, i) => (
                      <div
                        key={i}
                        className={`w-1.5 rounded-full transition-all duration-300 ${
                          isPlaying ? 'bg-blue-500 animate-pulse' : 'bg-slate-700'
                        }`}
                        style={{
                          height: isPlaying ? `${Math.max(12, (height * ((i % 3) + 1)) / 3)}px` : '8px',
                          animationDelay: `${i * 60}ms`
                        }}
                      />
                    )
                  )}
                </div>

                <div className="p-3 bg-slate-900/80 rounded-lg text-xs text-slate-300 leading-relaxed font-sans border border-slate-800/80 max-h-32 overflow-y-auto">
                  "{audioResult.text}"
                </div>

                {/* Audio Controls */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    {isPlaying ? (
                      <button
                        type="button"
                        onClick={handleStop}
                        className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow"
                      >
                        <Square className="w-3.5 h-3.5" />
                        <span>Hentikan</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          speakAudio(audioResult.text, audioResult.voice, speedMultiplier)
                        }
                        className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Putar Ulang</span>
                      </button>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={isDownloading}
                    onClick={() => handleDownloadAudio(audioResult)}
                    className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    {isDownloading ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Download className="w-3.5 h-3.5" />
                    )}
                    <span>Download WAV / MP3</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Riwayat TTS */}
        {ttsHistory.length > 0 && (
          <div className="p-4 rounded-2xl bg-[#0b1329] border border-[#1e293b] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Riwayat Suara Tergenerate ({ttsHistory.length})</span>
              </h4>
              <button
                type="button"
                onClick={() => {
                  setTtsHistory([]);
                  onShowToast('Riwayat suara dibersihkan.');
                }}
                className="text-[10px] text-slate-500 hover:text-rose-400 cursor-pointer flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Hapus Semua</span>
              </button>
            </div>

            <div className="space-y-2">
              {ttsHistory.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-xl bg-[#0f172a] border border-[#1e293b] flex items-center justify-between text-xs"
                >
                  <div className="max-w-[65%] space-y-0.5">
                    <p className="font-medium text-slate-200 truncate">"{item.text}"</p>
                    <p className="text-[10px] text-slate-500 font-mono">
                      {item.voice.split('—')[0]} · {item.speed} · {item.timestamp}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => speakAudio(item.text, item.voice, speedMultiplier)}
                      className="p-1.5 rounded-lg bg-blue-900/50 hover:bg-blue-800 text-blue-300 cursor-pointer"
                      title="Putar"
                    >
                      <Play className="w-3 h-3 fill-current" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadAudio(item)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                      title="Download"
                    >
                      <Download className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
