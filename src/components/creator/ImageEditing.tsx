import React, { useState, useRef, useEffect } from 'react';
import {
  Eraser,
  Upload,
  Download,
  RefreshCw,
  CheckCircle2,
  Image as ImageIcon,
  Copy,
  Trash2,
  Eye,
  Columns,
  Layers,
  Sparkles
} from 'lucide-react';

interface ImageEditingProps {
  onDeductCredits: (amount: number) => boolean;
  onShowToast: (msg: string) => void;
  onAddHistory: (type: string, title: string) => void;
}

interface ProcessedImageItem {
  id: string;
  originalSrc: string;
  processedSrc: string;
  fileName: string;
  time: string;
  fileSize: string;
}

export const ImageEditing: React.FC<ImageEditingProps> = ({
  onDeductCredits,
  onShowToast,
  onAddHistory
}) => {
  const [srcImg, setSrcImg] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [fileSizeStr, setFileSizeStr] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasProcessed, setHasProcessed] = useState(false);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  
  // Customization on result
  const [bgChoice, setBgChoice] = useState<'transparent' | 'white' | 'black' | 'gray' | 'blue' | 'custom'>('transparent');
  const [customBgColor, setCustomBgColor] = useState('#3b82f6');
  const [viewMode, setViewMode] = useState<'cutout' | 'compare'>('cutout');
  const [historyList, setHistoryList] = useState<ProcessedImageItem[]>([]);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hiddenImgRef = useRef<HTMLImageElement | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      onShowToast('Ukuran file melebihi 10 MB.');
      return;
    }

    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    setFileSizeStr(`${sizeMb} MB`);
    setFileName(file.name);
    setHasProcessed(false);
    setProcessedUrl(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      setSrcImg(evt.target?.result as string);
      onShowToast('Foto berhasil dimuat. Siap diproses.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveBg = () => {
    if (!srcImg) {
      onShowToast('Silakan unggah foto terlebih dahulu.');
      return;
    }
    if (!onDeductCredits(1)) return;

    setIsProcessing(true);

    setTimeout(() => {
      try {
        const img = hiddenImgRef.current;
        if (!img) {
          setIsProcessing(false);
          return;
        }

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setIsProcessing(false);
          return;
        }

        const width = img.naturalWidth || 600;
        const height = img.naturalHeight || 600;
        canvas.width = width;
        canvas.height = height;

        // Draw image
        ctx.drawImage(img, 0, 0, width, height);
        const imgData = ctx.getImageData(0, 0, width, height);
        const data = imgData.data;

        // Smart edge background sampler: sample 4 corners
        const cornerSamples = [
          [0, 0],
          [width - 1, 0],
          [0, height - 1],
          [width - 1, height - 1]
        ];

        const bgColors: { r: number; g: number; b: number }[] = [];
        cornerSamples.forEach(([cx, cy]) => {
          const idx = (cy * width + cx) * 4;
          bgColors.push({
            r: data[idx],
            g: data[idx + 1],
            b: data[idx + 2]
          });
        });

        // Compute average background color from corners
        const avgR = bgColors.reduce((acc, c) => acc + c.r, 0) / bgColors.length;
        const avgG = bgColors.reduce((acc, c) => acc + c.g, 0) / bgColors.length;
        const avgB = bgColors.reduce((acc, c) => acc + c.b, 0) / bgColors.length;

        // Check if background is mostly light/white or dark/black
        const isWhiteBg = avgR > 220 && avgG > 220 && avgB > 220;
        const isDarkBg = avgR < 40 && avgG < 40 && avgB < 40;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Euclidean color distance to corner background
          let minDist = 999999;
          for (const bg of bgColors) {
            const d = Math.sqrt(
              (r - bg.r) ** 2 +
              (g - bg.g) ** 2 +
              (b - bg.b) ** 2
            );
            if (d < minDist) minDist = d;
          }

          if (isWhiteBg) {
            // White / bright studio background threshold
            const lightness = 0.299 * r + 0.587 * g + 0.114 * b;
            if (minDist < 65 || lightness > 235) {
              data[i + 3] = 0;
            } else if (minDist < 85 || lightness > 220) {
              // Smooth feather edges
              data[i + 3] = Math.max(0, Math.min(255, Math.floor(((minDist - 65) / 20) * 255)));
            }
          } else if (isDarkBg) {
            const lightness = 0.299 * r + 0.587 * g + 0.114 * b;
            if (minDist < 60 || lightness < 25) {
              data[i + 3] = 0;
            } else if (minDist < 80) {
              data[i + 3] = Math.max(0, Math.min(255, Math.floor(((minDist - 60) / 20) * 255)));
            }
          } else {
            // General solid color studio backdrops
            if (minDist < 60) {
              data[i + 3] = 0;
            } else if (minDist < 80) {
              data[i + 3] = Math.max(0, Math.min(255, Math.floor(((minDist - 60) / 20) * 255)));
            }
          }
        }

        ctx.putImageData(imgData, 0, 0);
        const resultPng = canvas.toDataURL('image/png');

        setProcessedUrl(resultPng);
        setHasProcessed(true);
        setIsProcessing(false);

        const now = new Date();
        const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        const newItem: ProcessedImageItem = {
          id: `cutout-${Date.now()}`,
          originalSrc: srcImg,
          processedSrc: resultPng,
          fileName: fileName || 'Foto Objek',
          time: timeStr,
          fileSize: fileSizeStr || '1.2 MB'
        };

        setHistoryList((prev) => [newItem, ...prev]);
        onShowToast('Background berhasil dihapus transparan (-1 kredit)!');
        onAddHistory('Remove Background', fileName || 'Foto Objek');
      } catch (err) {
        setIsProcessing(false);
        onShowToast('Terjadi kendala saat memproses gambar.');
      }
    }, 700);
  };

  const handleDownloadCutout = () => {
    if (!processedUrl) return;

    if (bgChoice === 'transparent') {
      const link = document.createElement('a');
      link.download = `Suga_Cutout_Transparent_${Date.now()}.png`;
      link.href = processedUrl;
      link.click();
      onShowToast('PNG Transparan resolusi tinggi berhasil diunduh!');
    } else {
      // Composite onto chosen background color
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        if (!ctx) return;

        // Fill background
        let fillColor = '#ffffff';
        if (bgChoice === 'black') fillColor = '#000000';
        else if (bgChoice === 'gray') fillColor = '#e2e8f0';
        else if (bgChoice === 'blue') fillColor = '#2563eb';
        else if (bgChoice === 'custom') fillColor = customBgColor;

        ctx.fillStyle = fillColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        const link = document.createElement('a');
        link.download = `Suga_Cutout_${bgChoice}_${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        onShowToast(`Gambar dengan background ${bgChoice} berhasil diunduh!`);
      };
      img.src = processedUrl;
    }
  };

  const getBackgroundColorStyle = () => {
    switch (bgChoice) {
      case 'white':
        return { backgroundColor: '#ffffff' };
      case 'black':
        return { backgroundColor: '#000000' };
      case 'gray':
        return { backgroundColor: '#e2e8f0' };
      case 'blue':
        return { backgroundColor: '#2563eb' };
      case 'custom':
        return { backgroundColor: customBgColor };
      case 'transparent':
      default:
        return {
          backgroundImage:
            'linear-gradient(45deg, #1e293b 25%, transparent 25%), linear-gradient(-45deg, #1e293b 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1e293b 75%), linear-gradient(-45deg, transparent 75%, #1e293b 75%)',
          backgroundSize: '16px 16px',
          backgroundPosition: '0 0, 0 8px, 8px -8px, -8px 0px',
          backgroundColor: '#091122'
        };
    }
  };

  return (
    <div className="space-y-4">
      {/* Hidden image element to measure natural dimensions */}
      {srcImg && (
        <img
          ref={hiddenImgRef}
          src={srcImg}
          alt="hidden source"
          className="hidden"
          onLoad={() => {}}
        />
      )}

      {/* Main 2-Column Grid (Matches user screenshot) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* LEFT CONTROL PANEL */}
        <div className="lg:col-span-4 p-4 sm:p-5 rounded-2xl bg-[#091122]/90 border border-slate-800/80 shadow-xl space-y-4">
          {/* Header */}
          <div>
            <div className="flex items-center space-x-2 text-white">
              <Eraser className="w-4 h-4 text-cyan-400 stroke-[1.5]" />
              <h3 className="text-xs sm:text-sm font-bold tracking-tight font-heading">
                Image Editing — Remove Background
              </h3>
            </div>
          </div>

          {/* Label Foto & Dropzone */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-slate-400">
              Foto
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
            />

            {srcImg ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-black/40 group">
                <img
                  src={srcImg}
                  alt="Foto Terpilih"
                  className="w-full h-36 object-contain p-2"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-2.5 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors cursor-pointer"
                  >
                    Ganti
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSrcImg(null);
                      setProcessedUrl(null);
                      setHasProcessed(false);
                      setFileName('');
                    }}
                    className="px-2.5 py-1 text-xs bg-rose-600 text-white rounded-lg hover:bg-rose-500 transition-colors cursor-pointer"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border border-dashed border-slate-700/80 hover:border-slate-500 bg-[#060b16] rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
              >
                <Upload className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors mb-2 stroke-[1.5]" />
                <p className="text-xs font-semibold text-slate-200">
                  Unggah foto
                </p>
              </div>
            )}

            {/* Subtext description below dropzone */}
            <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
              JPG, PNG, atau WEBP - maks 10 MB. Proses dilakukan di browser kamu — foto tidak dikirim ke server.
            </p>
          </div>

          {/* 1 generate text */}
          <p className="text-[11px] text-slate-400">
            1 generate
          </p>

          {/* Button: Hapus Background • 1 kredit */}
          <button
            type="button"
            onClick={handleRemoveBg}
            disabled={isProcessing || !srcImg}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs shadow-lg shadow-blue-900/30 transition-all flex items-center justify-center cursor-pointer"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                <span>Memproses Hapus Background...</span>
              </>
            ) : (
              <>
                <Eraser className="w-4 h-4 mr-2 stroke-[1.5]" />
                <span>Hapus Background • 1 kredit</span>
              </>
            )}
          </button>
        </div>

        {/* RIGHT DISPLAY PANEL (Preview Hasil) */}
        <div className="lg:col-span-8 p-4 sm:p-5 rounded-2xl bg-[#091122]/90 border border-slate-800/80 shadow-xl space-y-3.5">
          {/* Header */}
          <div className="flex items-center space-x-2 text-white">
            <ImageIcon className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs sm:text-sm font-bold tracking-tight font-heading">
              Preview Hasil
            </h3>
          </div>

          {/* Content Area */}
          {isProcessing ? (
            <div className="min-h-[300px] rounded-2xl bg-[#070d1a] border border-slate-800/80 flex flex-col items-center justify-center p-8 text-center space-y-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-2xl bg-cyan-600/10 border border-cyan-500/20 flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 text-cyan-400 animate-spin" />
                </div>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-200">
                  Menghapus latar belakang secara instan...
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Mendeteksi tepi subjek dan memotong background menjadi transparan
                </p>
              </div>
            </div>
          ) : hasProcessed && processedUrl ? (
            <div className="space-y-4">
              {/* Top Action Bar */}
              <div className="p-3 rounded-xl bg-[#070d1a] border border-slate-800 flex flex-wrap items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-950/70 border border-emerald-800/50 text-[11px] font-bold text-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Background Terhapus
                  </span>
                  {fileName && (
                    <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                      {fileName}
                    </span>
                  )}
                </div>

                {/* View switcher & Actions */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setViewMode(viewMode === 'cutout' ? 'compare' : 'cutout')}
                    className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition-colors flex items-center gap-1 cursor-pointer ${
                      viewMode === 'compare'
                        ? 'bg-slate-700 border-slate-600 text-white'
                        : 'bg-black/60 border-slate-700/60 text-slate-300 hover:text-white'
                    }`}
                    title="Bandingkan dengan foto asli"
                  >
                    <Columns className="w-3.5 h-3.5" />
                    <span>{viewMode === 'compare' ? 'Tutup Perbandingan' : 'Bandingkan'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleDownloadCutout}
                    className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-900/40 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh HD</span>
                  </button>
                </div>
              </div>

              {/* Background Color Customizer Strip */}
              <div className="p-3 rounded-xl bg-[#070d1a] border border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-medium text-[11px]">Pilih Background:</span>
                  <div className="flex items-center gap-1.5">
                    {/* Transparent */}
                    <button
                      type="button"
                      onClick={() => setBgChoice('transparent')}
                      className={`px-2 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer ${
                        bgChoice === 'transparent'
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-black/40 border-slate-700 text-slate-400 hover:text-white'
                      }`}
                    >
                      Transparan
                    </button>
                    {/* White */}
                    <button
                      type="button"
                      onClick={() => setBgChoice('white')}
                      className={`w-6 h-6 rounded-md bg-white border cursor-pointer transition-all ${
                        bgChoice === 'white' ? 'ring-2 ring-blue-500 border-transparent' : 'border-slate-600'
                      }`}
                      title="Background Putih"
                    />
                    {/* Black */}
                    <button
                      type="button"
                      onClick={() => setBgChoice('black')}
                      className={`w-6 h-6 rounded-md bg-black border cursor-pointer transition-all ${
                        bgChoice === 'black' ? 'ring-2 ring-blue-500 border-transparent' : 'border-slate-600'
                      }`}
                      title="Background Hitam"
                    />
                    {/* Gray */}
                    <button
                      type="button"
                      onClick={() => setBgChoice('gray')}
                      className={`w-6 h-6 rounded-md bg-slate-300 border cursor-pointer transition-all ${
                        bgChoice === 'gray' ? 'ring-2 ring-blue-500 border-transparent' : 'border-slate-600'
                      }`}
                      title="Background Abu-abu"
                    />
                    {/* Blue */}
                    <button
                      type="button"
                      onClick={() => setBgChoice('blue')}
                      className={`w-6 h-6 rounded-md bg-blue-600 border cursor-pointer transition-all ${
                        bgChoice === 'blue' ? 'ring-2 ring-blue-500 border-transparent' : 'border-slate-600'
                      }`}
                      title="Background Biru"
                    />
                    {/* Custom Picker */}
                    <input
                      type="color"
                      value={customBgColor}
                      onChange={(e) => {
                        setCustomBgColor(e.target.value);
                        setBgChoice('custom');
                      }}
                      className="w-6 h-6 rounded-md bg-transparent cursor-pointer border-0 p-0"
                      title="Warna Khusus"
                    />
                  </div>
                </div>

                <span className="text-[10px] text-slate-500">
                  Format: PNG 24-bit Lossless
                </span>
              </div>

              {/* Visual Display */}
              {viewMode === 'compare' && srcImg ? (
                /* Side-by-side comparison */
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-black/60 border border-slate-800 p-3 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-400 block">Sebelum (Asli)</span>
                    <div className="h-64 rounded-xl overflow-hidden bg-black/40 flex items-center justify-center p-2">
                      <img
                        src={srcImg}
                        alt="Original"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  </div>

                  <div className="rounded-2xl bg-black/60 border border-slate-800 p-3 space-y-1.5">
                    <span className="text-[11px] font-bold text-cyan-400 block">Sesudah (Cutout)</span>
                    <div
                      className="h-64 rounded-xl overflow-hidden flex items-center justify-center p-2 border border-slate-700/60"
                      style={getBackgroundColorStyle()}
                    >
                      <img
                        src={processedUrl}
                        alt="Processed Cutout"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* Single Cutout View with chosen background */
                <div
                  className="w-full h-80 rounded-2xl overflow-hidden flex items-center justify-center p-4 border border-slate-800 shadow-2xl relative"
                  style={getBackgroundColorStyle()}
                >
                  <img
                    src={processedUrl}
                    alt="Processed Cutout"
                    className="max-h-full max-w-full object-contain drop-shadow-md"
                  />
                  <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md bg-black/60 backdrop-blur-md text-[10px] text-slate-300 font-mono">
                    Mode: {bgChoice}
                  </div>
                </div>
              )}

              {/* History list */}
              {historyList.length > 1 && (
                <div className="space-y-2 pt-2">
                  <p className="text-[11px] font-semibold text-slate-400">
                    Riwayat Pemotongan ({historyList.length})
                  </p>
                  <div className="flex gap-2.5 overflow-x-auto pb-2 custom-scrollbar">
                    {historyList.map((item, idx) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setProcessedUrl(item.processedSrc);
                          setSrcImg(item.originalSrc);
                          setFileName(item.fileName);
                          setHasProcessed(true);
                        }}
                        className={`w-20 h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer relative bg-slate-900 ${
                          processedUrl === item.processedSrc
                            ? 'border-cyan-500 shadow-md shadow-cyan-500/30'
                            : 'border-slate-800 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={item.processedSrc}
                          alt={`Cutout ${idx + 1}`}
                          className="w-full h-full object-contain p-1"
                        />
                        <span className="absolute bottom-1 right-1 px-1 rounded bg-black/80 text-[9px] font-bold text-white">
                          #{idx + 1}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Empty State (Matches Screenshot exactly) */
            <div className="min-h-[260px] rounded-2xl bg-[#070d1a] border border-slate-800/80 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-12 h-12 flex items-center justify-center text-slate-600 mb-2">
                <Eraser className="w-8 h-8 stroke-[1.2]" />
              </div>
              <h4 className="text-sm font-bold text-slate-300 tracking-tight">
                Belum ada hasil
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Unggah foto, lalu tekan Hapus Background.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
