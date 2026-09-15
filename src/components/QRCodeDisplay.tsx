import React from 'react';

interface QRCodeDisplayProps {
  size?: number;
  className?: string;
  onDownload?: () => void;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  size = 200,
  className = '',
  onDownload
}) => {
  const qrSvgString = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160" fill="black"><rect width="160" height="160" fill="white"/><rect x="10" y="10" width="40" height="40" fill="none" stroke="black" stroke-width="8"/><rect x="22" y="22" width="16" height="16" fill="black"/><rect x="110" y="10" width="40" height="40" fill="none" stroke="black" stroke-width="8"/><rect x="122" y="22" width="16" height="16" fill="black"/><rect x="10" y="110" width="40" height="40" fill="none" stroke="black" stroke-width="8"/><rect x="22" y="122" width="16" height="16" fill="black"/><rect x="60" y="20" width="8" height="8"/><rect x="76" y="20" width="8" height="8"/><rect x="68" y="28" width="8" height="8"/><rect x="84" y="28" width="8" height="8"/><rect x="60" y="36" width="8" height="8"/><rect x="76" y="36" width="8" height="8"/><rect x="20" y="60" width="8" height="8"/><rect x="36" y="60" width="8" height="8"/><rect x="28" y="68" width="8" height="8"/><rect x="44" y="68" width="8" height="8"/><rect x="60" y="60" width="8" height="8"/><rect x="76" y="60" width="8" height="8"/><rect x="92" y="60" width="8" height="8"/><rect x="108" y="60" width="8" height="8"/><rect x="124" y="60" width="8" height="8"/><rect x="140" y="60" width="8" height="8"/><rect x="68" y="68" width="8" height="8"/><rect x="84" y="68" width="8" height="8"/><rect x="100" y="68" width="8" height="8"/><rect x="116" y="68" width="8" height="8"/><rect x="132" y="68" width="8" height="8"/><rect x="60" y="76" width="8" height="8"/><rect x="76" y="76" width="8" height="8"/><rect x="92" y="76" width="8" height="8"/><rect x="108" y="76" width="8" height="8"/><rect x="124" y="76" width="8" height="8"/><rect x="68" y="84" width="8" height="8"/><rect x="84" y="84" width="8" height="8"/><rect x="100" y="84" width="8" height="8"/><rect x="116" y="84" width="8" height="8"/><rect x="132" y="84" width="8" height="8"/><rect x="60" y="92" width="8" height="8"/><rect x="76" y="92" width="8" height="8"/><rect x="92" y="92" width="8" height="8"/><rect x="108" y="92" width="8" height="8"/><rect x="124" y="92" width="8" height="8"/><rect x="60" y="110" width="8" height="8"/><rect x="76" y="110" width="8" height="8"/><rect x="92" y="110" width="8" height="8"/><rect x="108" y="110" width="8" height="8"/><rect x="124" y="110" width="8" height="8"/><rect x="68" y="118" width="8" height="8"/><rect x="84" y="118" width="8" height="8"/><rect x="100" y="118" width="8" height="8"/><rect x="116" y="118" width="8" height="8"/><rect x="132" y="118" width="8" height="8"/><rect x="60" y="126" width="8" height="8"/><rect x="76" y="126" width="8" height="8"/><rect x="92" y="126" width="8" height="8"/><rect x="108" y="126" width="8" height="8"/><rect x="124" y="126" width="8" height="8"/><rect x="68" y="134" width="8" height="8"/><rect x="84" y="134" width="8" height="8"/><rect x="100" y="134" width="8" height="8"/><rect x="116" y="134" width="8" height="8"/><rect x="132" y="134" width="8" height="8"/><rect x="60" y="142" width="8" height="8"/><rect x="76" y="142" width="8" height="8"/><rect x="92" y="142" width="8" height="8"/><rect x="108" y="142" width="8" height="8"/><rect x="124" y="142" width="8" height="8"/></svg>`;

  const handleDownloadQR = () => {
    if (onDownload) {
      onDownload();
      return;
    }
    const a = document.createElement('a');
    a.href = qrSvgString;
    a.download = 'QRIS-SUGA-Payment.svg';
    a.click();
  };

  return (
    <div
      onClick={handleDownloadQR}
      className={`inline-block cursor-pointer p-2 bg-white rounded-xl shadow-md select-none transition-transform hover:scale-[1.01] ${className}`}
      title="Klik untuk mendownload QR"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 160 160"
        className="w-full h-full block"
      >
        {/* Background */}
        <rect width="160" height="160" fill="#ffffff" />

        {/* Top-Left Position Square */}
        <rect x="10" y="10" width="42" height="42" fill="none" stroke="#000000" strokeWidth="6" rx="2" />
        <rect x="22" y="22" width="18" height="18" fill="#000000" rx="2" />

        {/* Top-Right Position Square */}
        <rect x="108" y="10" width="42" height="42" fill="none" stroke="#000000" strokeWidth="6" rx="2" />
        <rect x="120" y="22" width="18" height="18" fill="#000000" rx="2" />

        {/* Bottom-Left Position Square */}
        <rect x="10" y="108" width="42" height="42" fill="none" stroke="#000000" strokeWidth="6" rx="2" />
        <rect x="22" y="120" width="18" height="18" fill="#000000" rx="2" />

        {/* Timing Lines */}
        <rect x="58" y="28" width="6" height="6" fill="#000000" />
        <rect x="70" y="28" width="6" height="6" fill="#000000" />
        <rect x="82" y="28" width="6" height="6" fill="#000000" />
        <rect x="94" y="28" width="6" height="6" fill="#000000" />
        <rect x="28" y="58" width="6" height="6" fill="#000000" />
        <rect x="28" y="70" width="6" height="6" fill="#000000" />
        <rect x="28" y="82" width="6" height="6" fill="#000000" />
        <rect x="28" y="94" width="6" height="6" fill="#000000" />

        {/* Alignment Square */}
        <rect x="114" y="114" width="26" height="26" fill="none" stroke="#000000" strokeWidth="5" />
        <rect x="123" y="123" width="8" height="8" fill="#000000" />

        {/* Matrix Payload Pattern Blocks */}
        <rect x="58" y="14" width="6" height="6" fill="#000000" />
        <rect x="70" y="14" width="6" height="6" fill="#000000" />
        <rect x="88" y="14" width="6" height="6" fill="#000000" />
        <rect x="94" y="20" width="6" height="6" fill="#000000" />
        <rect x="64" y="40" width="6" height="6" fill="#000000" />
        <rect x="76" y="40" width="6" height="6" fill="#000000" />
        <rect x="88" y="40" width="6" height="6" fill="#000000" />

        <rect x="14" y="60" width="6" height="6" fill="#000000" />
        <rect x="42" y="60" width="6" height="6" fill="#000000" />
        <rect x="58" y="58" width="6" height="6" fill="#000000" />
        <rect x="68" y="58" width="6" height="6" fill="#000000" />
        <rect x="80" y="58" width="6" height="6" fill="#000000" />
        <rect x="92" y="58" width="6" height="6" fill="#000000" />
        <rect x="104" y="58" width="6" height="6" fill="#000000" />
        <rect x="120" y="58" width="6" height="6" fill="#000000" />
        <rect x="136" y="58" width="6" height="6" fill="#000000" />

        <rect x="20" y="72" width="6" height="6" fill="#000000" />
        <rect x="44" y="72" width="6" height="6" fill="#000000" />
        <rect x="60" y="70" width="6" height="6" fill="#000000" />
        <rect x="74" y="70" width="6" height="6" fill="#000000" />
        <rect x="86" y="70" width="6" height="6" fill="#000000" />
        <rect x="98" y="70" width="6" height="6" fill="#000000" />
        <rect x="110" y="70" width="6" height="6" fill="#000000" />
        <rect x="126" y="70" width="6" height="6" fill="#000000" />
        <rect x="142" y="70" width="6" height="6" fill="#000000" />

        <rect x="14" y="86" width="6" height="6" fill="#000000" />
        <rect x="36" y="86" width="6" height="6" fill="#000000" />
        <rect x="54" y="84" width="6" height="6" fill="#000000" />
        <rect x="66" y="84" width="6" height="6" fill="#000000" />
        <rect x="78" y="84" width="6" height="6" fill="#000000" />
        <rect x="90" y="84" width="6" height="6" fill="#000000" />
        <rect x="102" y="84" width="6" height="6" fill="#000000" />
        <rect x="118" y="84" width="6" height="6" fill="#000000" />
        <rect x="134" y="84" width="6" height="6" fill="#000000" />

        <rect x="58" y="96" width="6" height="6" fill="#000000" />
        <rect x="70" y="96" width="6" height="6" fill="#000000" />
        <rect x="82" y="96" width="6" height="6" fill="#000000" />
        <rect x="94" y="96" width="6" height="6" fill="#000000" />
        <rect x="106" y="96" width="6" height="6" fill="#000000" />
        <rect x="122" y="96" width="6" height="6" fill="#000000" />
        <rect x="138" y="96" width="6" height="6" fill="#000000" />

        <rect x="58" y="110" width="6" height="6" fill="#000000" />
        <rect x="74" y="110" width="6" height="6" fill="#000000" />
        <rect x="88" y="110" width="6" height="6" fill="#000000" />
        <rect x="98" y="110" width="6" height="6" fill="#000000" />

        <rect x="62" y="124" width="6" height="6" fill="#000000" />
        <rect x="76" y="124" width="6" height="6" fill="#000000" />
        <rect x="88" y="124" width="6" height="6" fill="#000000" />
        <rect x="100" y="124" width="6" height="6" fill="#000000" />

        <rect x="58" y="138" width="6" height="6" fill="#000000" />
        <rect x="70" y="138" width="6" height="6" fill="#000000" />
        <rect x="84" y="138" width="6" height="6" fill="#000000" />
        <rect x="96" y="138" width="6" height="6" fill="#000000" />
      </svg>
    </div>
  );
};
