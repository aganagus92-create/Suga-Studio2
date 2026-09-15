import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, Copy, Check, User } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'agus' | 'user';
  text: string;
  time: string;
}

interface AgusAsistenProps {
  onDeductCredits?: (amount: number) => boolean;
  onShowToast?: (msg: string) => void;
  onAddHistory?: (type: string, title: string) => void;
  onCopy?: (text: string, label: string) => void;
}

export const AgusAsisten: React.FC<AgusAsistenProps> = ({
  onShowToast,
  onAddHistory,
  onCopy
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'agus',
      text: 'Halo! Saya **Agus Asisten** dari SUGA AI. Saya siap membantu merancang ide prompt visual, alur video TikTok Affiliate, hingga strategi storytelling animasi. Ada proyek apa yang ingin kita buat hari ini?',
      time: '10:00'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'Formula prompt poster skincare mewah',
    'Ide video TikTok affiliate produk fashion',
    'Tips lighting cinematic di Seedream 5.0',
    'Rekomendasi suara TTS untuk video horor'
  ];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    if (onCopy) {
      onCopy(text, 'Jawaban Agus');
    } else if (onShowToast) {
      onShowToast('Prompt / jawaban disalin ke clipboard!');
    }
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSend = (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: 'm-' + Date.now(),
      sender: 'user',
      text,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputVal('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = '';
      const lower = text.toLowerCase();

      if (lower.includes('skincare') || lower.includes('poster')) {
        botResponse = `Untuk **Poster Skincare Mewah**, coba pakai formula prompt ini di Seedream 5.0:

\`\`\`text
Luxury cosmetic serum glass bottle standing on smooth wet marble stone, soft water ripples reflecting golden hour sunlight, subtle floating botanical jasmine leaves, minimalist high-end editorial commercial, crisp 8k, Hasselblad H6D-100c medium format.
\`\`\`

💡 **Tips Agus:** Aktifkan Aspect Ratio 4:5 atau 9:16 untuk kebutuhan feed Instagram dan TikTok.`;
      } else if (lower.includes('tiktok') || lower.includes('affiliate') || lower.includes('fashion')) {
        botResponse = `Berikut konsep video **TikTok Affiliate Fashion** berdurasi 30 detik:

1. **Detik 0-3 (Hook):** "Tolong jangan beli celana kulot ini kalau kalian nggak mau ditanyain terus beli di mana!"
2. **Detik 4-15 (Problem & Solution):** Sorot jahitan rapi, bahan jatuh anti-kusut, dan tes ketahanan saat ditarik.
3. **Detik 16-25 (Social Proof):** Tunjukkan perbandingan OOTD saat kuliah vs hangout santai.
4. **Detik 26-30 (Call to Action):** "Lagi ada diskon 40% khusus hari ini, checkout langsung di keranjang kuning kiri bawah!"`;
      } else if (lower.includes('lighting') || lower.includes('cinematic') || lower.includes('seedream')) {
        botResponse = `3 Kunci Lighting Cinematic di Seedream 5.0:
1. **Key Lighting:** Tambahkan keyword \`volumetric god rays\` atau \`rim lighting on subject shoulders\` untuk memisahkan objek dari background.
2. **Color Palette:** Gunakan \`teal and warm amber grade\` atau \`moody cinematic color tone\`.
3. **Optics:** Sertakan \`anamorphic lens flare, shallow depth of field f/1.8, creamy bokeh\`.`;
      } else if (lower.includes('tts') || lower.includes('suara') || lower.includes('horor')) {
        botResponse = `Untuk **Konten Horor / Misteri**:
- **Pilihan Suara:** Gunakan suara **Kore** (berat, berwibawa) atau **Charon** (dingin, informatif).
- **Kecepatan:** Pilih **0.75×** untuk memberikan efek suspensi lambat dan mencekam.
- **Trik Teks:** Gunakan tanda elipsis (...) untuk memberikan jeda hening sebelum kejutan narasi.`;
      } else {
        botResponse = `Pertanyaan yang bagus tentang "${text}"! 

Rekomendasi dari saya:
1. **Visual:** Anda bisa memanfaatkan modul **Gambar Kreatif** dengan prompt bergaya *8k cinematic photorealistic*.
2. **Audio:** Gunakan **Text to Speech (Indonesia)** dengan gaya naratif hangat untuk voice-over yang memikat.
3. **BGM:** Padukan dengan musik dari **Music Generator** pada tempo sedang (~100 BPM) agar audiens tetap fokus.

Ada detail spesifik lain yang ingin kamu kembangkan?`;
      }

      const botMsg: ChatMessage = {
        id: 'm-' + (Date.now() + 1),
        sender: 'agus',
        text: botResponse,
        time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
      onAddHistory?.('Konsultasi Asisten', text.slice(0, 30));
    }, 1000);
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-900/70 border border-slate-800 flex flex-col h-[76vh] max-w-4xl mx-auto shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-white font-heading">Agus Asisten AI</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 font-mono font-semibold">
                Online
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Prompt Consultant, Copywriter & Storytelling Specialist</p>
          </div>
        </div>
        <div className="flex items-center space-x-1 text-xs text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-mono text-[11px]">Free Prompt Advisor</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1 custom-scrollbar">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start space-x-2.5 ${m.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                m.sender === 'user' ? 'bg-purple-600 text-white' : 'bg-sky-600 text-white'
              }`}
            >
              {m.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-purple-600/90 text-white rounded-tr-none'
                  : 'bg-slate-800/90 text-slate-200 border border-slate-700/70 rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-line font-sans space-y-2">{m.text}</div>

              <div
                className={`mt-2.5 pt-2 border-t border-slate-700/50 flex items-center justify-between text-[10px] ${
                  m.sender === 'user' ? 'text-purple-200' : 'text-slate-400'
                }`}
              >
                <span>{m.time}</span>
                {m.sender === 'agus' && (
                  <button
                    type="button"
                    onClick={() => handleCopyText(m.text, m.id)}
                    className="flex items-center space-x-1 text-sky-400 hover:text-sky-300 font-medium transition-colors cursor-pointer"
                  >
                    {copiedId === m.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Salin</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center space-x-2 text-slate-400 text-xs pl-10">
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-bounce [animation-delay:0.2s]" />
            <span className="w-2 h-2 rounded-full bg-sky-400 animate-bounce [animation-delay:0.4s]" />
            <span className="text-[11px] text-slate-500 font-mono">Agus sedang meracik ide prompt...</span>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested quick prompt chips */}
      <div className="py-2 flex gap-1.5 overflow-x-auto custom-scrollbar shrink-0">
        {quickPrompts.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => handleSend(q)}
            className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[10px] whitespace-nowrap border border-slate-700 transition-colors cursor-pointer"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="pt-2 border-t border-slate-800 flex items-center space-x-2 shrink-0">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder="Tanyakan apa saja kepada Agus Asisten (misal: 'Bikinin prompt foto burger viral')..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 transition-all"
        />
        <button
          type="button"
          onClick={() => handleSend()}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center space-x-1.5 shadow-lg cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Kirim</span>
        </button>
      </div>
    </div>
  );
};
