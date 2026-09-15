import React, { useState } from 'react';
import {
  Upload,
  User,
  LayoutGrid,
  Copy,
  Download,
  Sparkles,
  CheckCircle2,
  Volume2,
  Film,
  Camera
} from 'lucide-react';

interface StudioAffiliateProps {
  onDeductCredits: (amount: number) => boolean;
  onShowToast: (msg: string) => void;
  onAddHistory: (type: string, title: string) => void;
}

interface AffiliatePanel {
  panelNumber: number;
  objective: string;
  t2iPrompt: string;
  i2vPrompt: string;
  audioScript: string;
}

export const StudioAffiliate: React.FC<StudioAffiliateProps> = ({
  onDeductCredits,
  onShowToast,
  onAddHistory
}) => {
  // Photos
  const [productImg, setProductImg] = useState<string | null>(null);
  const [productFileName, setProductFileName] = useState('');
  const [modelImg, setModelImg] = useState<string | null>(null);
  const [modelFileName, setModelFileName] = useState('');

  // Fields
  const [productName, setProductName] = useState('Serum Retinol Barrier Skintific');
  const [vibe, setVibe] = useState('aesthetic');
  const [storyboardCount, setStoryboardCount] = useState<number>(3);
  const [duration, setDuration] = useState('15 Detik');
  const [audioFormat, setAudioFormat] = useState('Dialog');
  const [productDetails, setProductDetails] = useState(
    'Botol kaca pink pastel, pump rose gold, formula cairan kental bening dengan partikel emas halus.'
  );

  const [generatedPanels, setGeneratedPanels] = useState<AffiliatePanel[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Upload handlers
  const handleProductUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProductFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      setProductImg(evt.target?.result as string);
      onShowToast('Foto produk utama berhasil dipilih!');
    };
    reader.readAsDataURL(file);
  };

  const handleModelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setModelFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      setModelImg(evt.target?.result as string);
      onShowToast('Foto model terkunci untuk konsistensi wajah!');
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = () => {
    if (!productName.trim()) {
      onShowToast('Harap masukkan nama produk.');
      return;
    }
    if (!onDeductCredits(5)) return;

    setIsGenerating(true);
    setTimeout(() => {
      const panelObjectives = [
        "Panel 1 (3s Hook): Dramatic macro close-up of the product held by the talent model with genuine amazed expression, looking directly into camera lens.",
        "Panel 2 (Tekstur & Swatch): Macro shot of rich serum texture glistening under soft sunlight, showing velvet absorption on back of the hand.",
        "Panel 3 (Problem-Solving): Split comparison aesthetic highlighting radiant glowing complexion versus dry skin, natural bedroom morning window light.",
        "Panel 4 (Aplikasi Nyata): Talent model applying two drops onto cheek, smiling naturally, skin looks dewy, radiant, clean girl aesthetic.",
        "Panel 5 (Product Showcase): Product proudly posed on an aesthetic minimalist travertine stone podium with delicate floral shadows and water ripples.",
        "Panel 6 (CTA Keranjang Kuning): Talent model pointing happily toward the bottom corner with encouraging friendly smile: 'Langsung checkout di keranjang kuning!'"
      ];

      const count = Math.min(Math.max(Number(storyboardCount) || 1, 1), 6);
      const panels: AffiliatePanel[] = [];

      for (let i = 1; i <= count; i++) {
        let voice = '';
        if (audioFormat === 'ASMR') {
          voice = `[Audio ASMR]: Suara lembut klik pembuka botol [click sound], tetesan serum pipet kental [squish], helaan napas rileks, whisper: '${productName}, so satisfying...'`;
        } else if (audioFormat === 'Dialog') {
          voice = `[Dialog Model Talent]: 'Kalian wajib banget cobain ${productName} ini! Beneran bikin kulit glowing tanpa lengket sama sekali. Cek keranjang kuning sekarang ya mumpung lagi promo!'`;
        } else if (audioFormat === 'Look Fusion') {
          voice = `[Audio Fusion]: Transisi musik beat-drop dinamis, sound effect swoosh lembut saat tekstur meresap, diakhiri voiceover: '${productName} — your new daily holy grail.'`;
        } else {
          voice = `[SUGA AMAZING Mode]: Audio energi tinggi viral TikTok, hook persuasif: 'Stop scrolling! Ini alasan kenapa ${productName} viral di mana-mana! Checkout sebelum kehabisan slot diskon!'`;
        }

        panels.push({
          panelNumber: i,
          objective: panelObjectives[(i - 1) % panelObjectives.length],
          t2iPrompt: `High quality commercial UGC photo for ${productName}, aesthetic vibe: ${vibe}, key details: ${productDetails}. ${
            modelImg
              ? 'Featuring talent model consistent facial structure, happy expressive eyes, authentic lifestyle bedroom ambiance.'
              : 'Clean aesthetic lifestyle vanity table setup with sunlight reflection.'
          } 8k resolution, cinematic commercial grade lighting, photorealistic, sharp focus.`,
          i2vPrompt: `Smooth camera dolly-in motion, talent model hand gently showcasing ${productName}, natural light reflection on bottle, organic movement, cinematic 60fps, 4k commercial render.`,
          audioScript: voice
        });
      }

      setGeneratedPanels(panels);
      setIsGenerating(false);
      onShowToast(`Master Prompts ${count} Storyboard berhasil digenerate (-5 kredit)!`);
      onAddHistory('Studio Affiliate', `${productName} (${count} Storyboard)`);
    }, 900);
  };

  const copyAllAffiliate = () => {
    if (!generatedPanels) return;
    let full = `=== MASTER PROMPTS STUDIO AFFILIATE UGC ===\nProduk: ${productName}\nVibe: ${vibe}\nDurasi: ${duration}\nAudio: ${audioFormat}\n\n`;
    generatedPanels.forEach((p) => {
      full += `--- PANEL ${p.panelNumber} ---\nObjektif: ${p.objective}\n\n[Prompt Gambar T2I]:\n${p.t2iPrompt}\n\n[Prompt Video I2V]:\n${p.i2vPrompt}\n\n[Naskah Suara]:\n${p.audioScript}\n\n`;
    });
    navigator.clipboard.writeText(full);
    onShowToast('Seluruh Master Prompts Affiliate disalin ke clipboard!');
  };

  const downloadAffiliateTXT = () => {
    if (!generatedPanels) return;
    let full = `=== MASTER PROMPTS STUDIO AFFILIATE UGC ===\nProduk: ${productName}\nVibe: ${vibe}\nDurasi: ${duration}\nAudio: ${audioFormat}\nTotal Storyboard: ${generatedPanels.length}\n\n`;
    generatedPanels.forEach((p) => {
      full += `--- PANEL ${p.panelNumber} ---\nObjektif: ${p.objective}\n\n[Prompt Gambar T2I]:\n${p.t2iPrompt}\n\n[Prompt Video I2V]:\n${p.i2vPrompt}\n\n[Naskah Suara]:\n${p.audioScript}\n\n`;
    });
    const blob = new Blob([full], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Affiliate_Master_${productName.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    onShowToast('File TXT Master Prompts berhasil diunduh!');
  };

  return (
    <div className="space-y-6">
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0b1120]/90 border border-slate-800/90 shadow-2xl space-y-6 max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h3 className="text-xl sm:text-2xl font-black text-white tracking-wider uppercase font-heading">
            STUDIO AFFILIATE UGC
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Foto produk jadi storyboard UGC: prompt gambar 6 panel dan prompt video per scene.
            <br className="hidden sm:inline" />
            Tambahkan foto model agar wajah dan karakternya konsisten di semua scene video TikTok & Shopee.
          </p>
        </div>

        {/* 2 Upload Areas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 pt-2">
          {/* Product Photo Upload */}
          <div
            onClick={() => document.getElementById('aff-prod-upload')?.click()}
            className="border-2 border-dashed border-slate-700/80 hover:border-blue-500/80 bg-[#070c18]/60 hover:bg-[#070c18]/90 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[160px] group"
          >
            <input
              type="file"
              id="aff-prod-upload"
              accept="image/*"
              onChange={handleProductUpload}
              className="hidden"
            />
            {productImg ? (
              <div className="w-full flex items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={productImg}
                    alt="Produk"
                    className="w-14 h-14 object-cover rounded-xl border border-slate-700 shadow-md"
                  />
                  <div className="text-left">
                    <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Produk Terpilih</span>
                    </span>
                    <p className="text-[10px] text-slate-400 truncate max-w-[150px]">{productFileName}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setProductImg(null);
                  }}
                  className="text-xs text-rose-400 hover:text-rose-300 font-semibold p-1"
                >
                  Ganti
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-200 flex items-center gap-1">
                  <span>Foto Produk</span>
                  <span className="text-rose-400 font-bold">*</span>
                </p>
                <p className="text-[11px] text-slate-500">Gambar produk utama (Wajib)</p>
              </div>
            )}
          </div>

          {/* Model Photo Upload */}
          <div
            onClick={() => document.getElementById('aff-model-upload')?.click()}
            className="border-2 border-dashed border-slate-700/80 hover:border-blue-500/80 bg-[#070c18]/60 hover:bg-[#070c18]/90 rounded-2xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[160px] group"
          >
            <input
              type="file"
              id="aff-model-upload"
              accept="image/*"
              onChange={handleModelUpload}
              className="hidden"
            />
            {modelImg ? (
              <div className="w-full flex items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={modelImg}
                    alt="Model"
                    className="w-14 h-14 object-cover rounded-xl border border-slate-700 shadow-md"
                  />
                  <div className="text-left">
                    <span className="text-xs font-bold text-sky-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Model Wajah Terkunci</span>
                    </span>
                    <p className="text-[10px] text-slate-400 truncate max-w-[150px]">{modelFileName}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setModelImg(null);
                  }}
                  className="text-xs text-rose-400 hover:text-rose-300 font-semibold p-1"
                >
                  Ganti
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <User className="w-5 h-5" />
                </div>
                <p className="text-xs font-bold text-slate-200">Foto Model Wajah</p>
                <p className="text-[11px] text-slate-500">Wajah Konsisten (Opsional)</p>
              </div>
            )}
          </div>
        </div>

        {/* Product Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Tipe & Nama Produk</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Contoh: Skincare Serum Skintific..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#070c18] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Aesthetic / Vibe</label>
            <select
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#070c18] border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="aesthetic">aesthetic (Estetik Lembut)</option>
              <option value="coquette">coquette (Feminim Manis)</option>
              <option value="elegant">elegant (Elegan Mewah)</option>
              <option value="minimalist">minimalist (Minimalis Bersih)</option>
              <option value="clean girl">clean girl (Natural Glowing)</option>
              <option value="luxury">luxury (Glamour High-End)</option>
              <option value="sporty">sporty (Aktif Bertenaga)</option>
              <option value="feminine">feminine (Pastel Hangat)</option>
              <option value="cozy">cozy (Nyaman Homey)</option>
              <option value="modern">modern (Kontemporer)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Jumlah Storyboard Panel</label>
            <select
              value={storyboardCount}
              onChange={(e) => setStoryboardCount(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl bg-[#070c18] border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value={1}>1 Panel (Single Hook)</option>
              <option value={2}>2 Panel (Hook + Demo)</option>
              <option value={3}>3 Panel (Hook + Solution + CTA)</option>
              <option value={4}>4 Panel (Full Funnel)</option>
              <option value={5}>5 Panel (Deep Showcase)</option>
              <option value={6}>6 Panel (Master 6-Panel TikTok)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">Durasi Video Ideal</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[#070c18] border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="8 Detik">8 Detik (Fast Hook)</option>
              <option value="10 Detik">10 Detik (Story Reel)</option>
              <option value="12 Detik">12 Detik (Demo Shot)</option>
              <option value="15 Detik">15 Detik (Golden Standard TikTok)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">Format Output Suara</label>
          <select
            value={audioFormat}
            onChange={(e) => setAudioFormat(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-[#070c18] border border-slate-800 text-xs text-white focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="Dialog">Dialog (Percakapan Rekomendasi Teman)</option>
            <option value="ASMR">ASMR (Satisfying Sound & Whisper)</option>
            <option value="Look Fusion">Look Fusion (Music Beat + Voice Tag)</option>
            <option value="SUGA AMAZING">SUGA AMAZING (Energi Tinggi Viral TikTok)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">Warna Produk & Detail Kunci</label>
          <textarea
            rows={3}
            value={productDetails}
            onChange={(e) => setProductDetails(e.target.value)}
            placeholder="Contoh: Botol kaca pink pastel, tutup silver, ada logo minimalis. Formula serum bening lembut."
            className="w-full p-3.5 rounded-xl bg-[#070c18] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all leading-relaxed"
          />
        </div>

        <button
          type="button"
          disabled={isGenerating}
          onClick={handleGenerate}
          className="w-full py-3.5 rounded-xl bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-bold flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
        >
          <LayoutGrid className="w-4 h-4" />
          <span>Generate Master Prompts Studio Affiliate — 5 Kredit</span>
        </button>
      </div>

      {/* Output Master Panels */}
      {generatedPanels && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0b1120]/90 border border-slate-800 space-y-5 max-w-4xl mx-auto shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2 font-heading">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>Master Prompts Studio Affiliate UGC</span>
              </h4>
              <p className="text-[11px] text-slate-400">
                {productName} • {generatedPanels.length} Panel Storyboard ({duration}) • Vibe: {vibe}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={copyAllAffiliate}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Salin Semua</span>
              </button>
              <button
                type="button"
                onClick={downloadAffiliateTXT}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer shadow-md"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh .TXT</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {generatedPanels.map((panel) => (
              <div
                key={panel.panelNumber}
                className="p-4 sm:p-5 rounded-2xl bg-[#070c18] border border-slate-800 space-y-3.5 text-xs shadow-lg"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <span className="font-bold text-sm text-blue-400 font-heading">
                    Storyboard Panel {panel.panelNumber} dari {generatedPanels.length}
                  </span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono">
                    {vibe} • {duration}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="font-bold text-sky-400 block mb-1 flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5" />
                      <span>Objektif & Alur Panel:</span>
                    </span>
                    <p className="p-3 rounded-xl bg-slate-900 text-slate-300 leading-relaxed font-sans">
                      {panel.objective}
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-emerald-400 block mb-1 flex items-center gap-1.5">
                      <Camera className="w-3.5 h-3.5" />
                      <span>Prompt Gambar (Text-to-Image / T2I):</span>
                    </span>
                    <p className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono leading-relaxed">
                      {panel.t2iPrompt}
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-purple-400 block mb-1 flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5" />
                      <span>Prompt Video (Image-to-Video / I2V):</span>
                    </span>
                    <p className="p-3 rounded-xl bg-slate-900 text-slate-200 font-mono leading-relaxed">
                      {panel.i2vPrompt}
                    </p>
                  </div>

                  <div>
                    <span className="font-bold text-pink-400 block mb-1 flex items-center gap-1.5">
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Naskah Suara ({audioFormat}):</span>
                    </span>
                    <p className="p-3 rounded-xl bg-slate-900 text-slate-200 font-sans leading-relaxed">
                      {panel.audioScript}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
