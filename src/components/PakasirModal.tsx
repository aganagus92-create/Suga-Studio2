import React, { useState, useEffect } from 'react';
import {
  X,
  Zap,
  Check,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  CreditCard
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { TopupPlan } from '../types';
import { topupPlans } from '../data/mockData';
import { QRCodeDisplay } from './QRCodeDisplay';

interface PakasirModalProps {
  plan: TopupPlan | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (creditsGained: number) => void;
  currentCredits?: number;
}

type StepType = 'billing' | 'checkout' | 'pakasir';

interface PaymentMethod {
  id: string;
  name: string;
  category: string;
}

const paymentMethods: PaymentMethod[] = [
  { id: 'qris', name: 'QRIS', category: 'QRIS' },
  { id: 'bni', name: 'BNI Virtual Account', category: 'VA' },
  { id: 'bri', name: 'BRI Virtual Account', category: 'VA' },
  { id: 'cimb', name: 'CIMB Niaga VA', category: 'VA' },
  { id: 'permata', name: 'Permata VA', category: 'VA' },
  { id: 'maybank', name: 'Maybank VA', category: 'VA' },
  { id: 'bnc', name: 'BNC VA', category: 'VA' },
  { id: 'atm_bersama', name: 'ATM Bersama VA', category: 'VA' }
];

export const PakasirModal: React.FC<PakasirModalProps> = ({
  plan: initialPlan,
  isOpen,
  onClose,
  onSuccess,
  currentCredits = 238
}) => {
  const [selectedPlan, setSelectedPlan] = useState<TopupPlan>(
    initialPlan || topupPlans[0]
  );
  const [selectedMethod, setSelectedMethod] = useState<string>('qris');
  const [currentStep, setCurrentStep] = useState<StepType>('checkout');
  const [orderId, setOrderId] = useState<string>('SUGACMTY1Z3IRSA9GP8');
  const [transId, setTransId] = useState<string>('thi7z9iq');
  const [timeLeft, setTimeLeft] = useState<number>(3592); // 59m 52s

  useEffect(() => {
    if (initialPlan) {
      setSelectedPlan(initialPlan);
      // If user specifically clicked a "Topup" button on a package, open checkout directly (Image 3)
      setCurrentStep('checkout');
    } else {
      setSelectedPlan(topupPlans[0]);
      setCurrentStep('billing');
    }
  }, [initialPlan, isOpen]);

  useEffect(() => {
    if (isOpen) {
      const randOrder =
        'SUGACMTY' +
        Math.floor(1000 + Math.random() * 9000) +
        'IRSA' +
        Math.floor(10 + Math.random() * 90) +
        'GP8';
      const randTrans = Math.random().toString(36).substring(2, 10);
      setOrderId(randOrder);
      setTransId(randTrans);
      setTimeLeft(59 * 60 + 52);
    }
  }, [isOpen]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const adminFee = 450;
  const totalAmount = selectedPlan.price + adminFee;

  const creditValue =
    parseInt(selectedPlan.credits.replace(/\D/g, ''), 10) || 1000;
  const bonusVal = selectedPlan.bonus
    ? parseInt(selectedPlan.bonus.replace(/\D/g, ''), 10) || 0
    : 0;
  const totalCreditsToAdd = creditValue + bonusVal;

  const handleFinishPayment = () => {
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });
    onSuccess(totalCreditsToAdd);
    onClose();
  };

  // Format Expiry Date (1 hour from now)
  const expiryDate = new Date(Date.now() + 60 * 60 * 1000);
  const expiryFormatted = `${expiryDate.getFullYear()}-${(expiryDate.getMonth() + 1).toString().padStart(2, '0')}-${expiryDate.getDate().toString().padStart(2, '0')} ${expiryDate.getHours().toString().padStart(2, '0')}:${expiryDate.getMinutes().toString().padStart(2, '0')}`;

  return (
    <div
      id="modal-suga-billing-overlay"
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
    >
      <div className="relative w-full max-w-3xl my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Close Button on corner */}
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-3 -right-3 z-20 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 shadow-lg cursor-pointer transition-colors"
          title="Tutup"
        >
          <X className="w-4 h-4" />
        </button>

        {/* STEP 1: BILLING (Matches Image 2) */}
        {currentStep === 'billing' && (
          <div className="bg-[#0b1329] border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-5 text-slate-100 shadow-2xl">
            {/* Header */}
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                Billing
              </h2>
              <p className="text-xs text-slate-400">
                Top-up kredit untuk memakai fitur AI.
              </p>
            </div>

            {/* Sisa Kredit Box */}
            <div className="p-4 rounded-2xl bg-[#080e1f] border border-slate-800/90 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <div>
                <p className="text-[11px] text-slate-400">Sisa kredit kamu</p>
                <p className="text-base sm:text-lg font-bold text-white">
                  {currentCredits.toLocaleString('id-ID')} kredit
                </p>
              </div>
            </div>

            {/* 6 Packages 3x2 Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {topupPlans.map((plan) => {
                const isSelected = selectedPlan.id === plan.id;
                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all relative flex flex-col justify-between space-y-3 ${
                      isSelected
                        ? 'bg-[#0e1b3d] border-blue-500 ring-2 ring-blue-500/40 shadow-lg'
                        : 'bg-[#080e20] border-slate-800/90 hover:border-slate-700'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}

                    <div>
                      <p className="text-xs font-semibold text-slate-300">
                        {plan.name}
                      </p>
                      <div className="flex items-baseline gap-1.5 mt-2">
                        <span className="text-xl sm:text-2xl font-extrabold text-white">
                          {plan.credits}
                        </span>
                        <span className="text-xs text-slate-400">kredit</span>
                      </div>
                      {plan.bonus && (
                        <p className="text-[10px] text-blue-400 font-bold mt-0.5">
                          {plan.bonus}
                        </p>
                      )}
                    </div>

                    <p className="text-sm font-bold text-slate-200 font-mono">
                      Rp {plan.price.toLocaleString('id-ID')}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Payment Methods */}
            <div className="space-y-2.5 pt-2">
              <h4 className="text-xs font-bold text-slate-300">
                Metode Pembayaran
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {paymentMethods.map((m) => {
                  const isSelected = selectedMethod === m.id;
                  return (
                    <button
                      type="button"
                      key={m.id}
                      onClick={() => setSelectedMethod(m.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#0f1d3f] border-blue-500 text-white shadow'
                          : 'bg-[#070d1d] border-slate-800/80 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-xs font-semibold leading-tight block">
                        {m.name}
                      </span>
                      <span className="text-[9px] text-slate-400 mt-1 block uppercase">
                        {m.category}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Total bayar & Checkout Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-slate-800/80">
              <div>
                <p className="text-[11px] text-slate-400">Total bayar</p>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg sm:text-xl font-black text-white font-mono">
                    Rp {selectedPlan.price.toLocaleString('id-ID')}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    + biaya admin di checkout
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCurrentStep('checkout')}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>Bayar Sekarang</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SELESAIKAN PEMBAYARAN (Matches Image 3) */}
        {currentStep === 'checkout' && (
          <div className="bg-[#0b1329] border border-slate-800 rounded-3xl p-5 sm:p-7 space-y-4 text-slate-100 shadow-2xl">
            {/* Header with back button */}
            <div className="flex items-center gap-2 pb-1">
              <button
                type="button"
                onClick={() => setCurrentStep('billing')}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Billing</span>
              </button>
            </div>

            {/* Two Column Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              {/* Left Column: Selesaikan Pembayaran QRIS */}
              <div className="lg:col-span-7 p-5 rounded-2xl bg-[#080e20] border border-slate-800/90 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white">
                      Selesaikan Pembayaran
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      QRIS - Order {orderId}
                    </p>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                    Menunggu
                  </span>
                </div>

                {/* QR Code Container */}
                <div className="p-4 rounded-2xl bg-white flex flex-col items-center justify-center text-center shadow-md">
                  <QRCodeDisplay size={200} />
                </div>

                <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                  Scan QR di atas dengan aplikasi e-wallet / m-banking yang
                  mendukung QRIS (GoPay, OVO, DANA, ShopeePay, dll).
                </p>

                {/* Pakasir External Link Button */}
                <button
                  type="button"
                  onClick={() => setCurrentStep('pakasir')}
                  className="w-full py-2.5 px-3 rounded-xl border border-slate-700/80 bg-[#0c1630] hover:bg-slate-800 text-slate-200 hover:text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow"
                >
                  <span>Buka halaman pembayaran Pakasir</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Right Column: Ringkasan & Batas Waktu */}
              <div className="lg:col-span-5 space-y-3">
                {/* Ringkasan Box */}
                <div className="p-4 rounded-2xl bg-[#080e20] border border-slate-800/90 space-y-2.5 text-xs shadow-xl">
                  <h4 className="text-xs font-bold text-white mb-2">Ringkasan</h4>
                  <div className="flex justify-between text-slate-400">
                    <span>Paket</span>
                    <span className="text-white font-medium">
                      {selectedPlan.name}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Kredit</span>
                    <span className="text-white font-bold flex items-center gap-1">
                      <Zap className="w-3 h-3 text-blue-400 fill-current" />
                      <span>{selectedPlan.credits}</span>
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Harga</span>
                    <span className="text-white font-medium font-mono">
                      Rp {selectedPlan.price.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Biaya admin</span>
                    <span className="text-white font-medium font-mono">
                      Rp {adminFee.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="border-t border-slate-800/90 pt-2 flex justify-between font-bold text-sm">
                    <span className="text-white">Total</span>
                    <span className="text-white font-mono">
                      Rp {totalAmount.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Batas Waktu & Verification Box */}
                <div className="p-4 rounded-2xl bg-[#080e20] border border-slate-800/90 space-y-3 text-xs shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Batas waktu</span>
                    <span className="flex items-center gap-1 font-bold text-amber-400 font-mono text-sm">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{timeFormatted}</span>
                    </span>
                  </div>

                  <div className="space-y-2 text-[11px] text-slate-400 pt-1">
                    <div className="flex items-start gap-2">
                      <Loader2 className="w-3.5 h-3.5 text-blue-400 animate-spin shrink-0 mt-0.5" />
                      <span>
                        Menunggu pembayaran... kredit otomatis masuk setelah
                        lunas.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                      <span>Pembayaran diverifikasi langsung ke Pakasir.</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-2 rounded-xl border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white text-xs font-semibold transition-colors cursor-pointer text-center mt-2"
                  >
                    Batalkan Pesanan
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: HALAMAN PEMBAYARAN PAKASIR (Matches Image 4) */}
        {currentStep === 'pakasir' && (
          <div className="bg-white text-slate-900 rounded-2xl overflow-hidden shadow-2xl max-w-lg mx-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-3 border-b border-slate-200 text-center font-bold text-base text-slate-800">
              sugaproject
            </div>

            <div className="p-6 space-y-4">
              <h3 className="text-sm font-semibold text-slate-800">
                Halaman Pembayaran
              </h3>

              {/* Table of Order Details */}
              <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                <div className="grid grid-cols-12 border-b border-slate-200">
                  <div className="col-span-5 p-2.5 bg-slate-50 font-medium text-slate-600 border-r border-slate-200">
                    ID Transaksi
                  </div>
                  <div className="col-span-7 p-2.5 font-bold text-slate-900 font-mono">
                    {transId}
                  </div>
                </div>

                <div className="grid grid-cols-12 border-b border-slate-200">
                  <div className="col-span-5 p-2.5 bg-slate-50 font-medium text-slate-600 border-r border-slate-200">
                    Order Id
                  </div>
                  <div className="col-span-7 p-2.5 font-mono text-slate-700 text-[11px] truncate">
                    {orderId}
                  </div>
                </div>

                <div className="grid grid-cols-12 border-b border-slate-200">
                  <div className="col-span-5 p-2.5 bg-slate-50 font-medium text-slate-600 border-r border-slate-200">
                    Nominal
                  </div>
                  <div className="col-span-7 p-2.5 font-semibold text-slate-800 font-mono">
                    Rp {selectedPlan.price.toLocaleString('id-ID')}
                  </div>
                </div>

                <div className="grid grid-cols-12 border-b border-slate-200">
                  <div className="col-span-5 p-2.5 bg-slate-50 font-medium text-slate-600 border-r border-slate-200">
                    Metode
                  </div>
                  <div className="col-span-7 p-2.5 uppercase font-medium text-slate-700">
                    {selectedMethod}
                  </div>
                </div>

                <div className="grid grid-cols-12 border-b border-slate-200">
                  <div className="col-span-5 p-2.5 bg-slate-50 font-medium text-slate-600 border-r border-slate-200">
                    Biaya Admin
                  </div>
                  <div className="col-span-7 p-2.5 font-medium text-slate-700 font-mono">
                    Rp {adminFee.toLocaleString('id-ID')}
                  </div>
                </div>

                <div className="grid grid-cols-12 bg-slate-50">
                  <div className="col-span-5 p-2.5 font-bold text-slate-900 border-r border-slate-200">
                    Total Bayar
                  </div>
                  <div className="col-span-7 p-2.5 font-bold text-slate-900 font-mono">
                    Rp {totalAmount.toLocaleString('id-ID')}
                  </div>
                </div>
              </div>

              {/* QR Container matching Image 4 */}
              <div className="p-4 border border-slate-200 rounded-xl flex flex-col items-center justify-center text-center space-y-2 bg-white">
                <QRCodeDisplay size={220} />
                <p className="text-[11px] text-slate-500">
                  Klik kode QR untuk mendownload
                </p>
                <p className="text-xs font-semibold text-rose-600">
                  Bayar sebelum {expiryFormatted}
                </p>
              </div>

              {/* Action: Saya Sudah Transfer */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleFinishPayment}
                  className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer text-center"
                >
                  Saya Sudah Transfer
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep('checkout')}
                  className="w-full py-1.5 text-xs text-slate-500 hover:text-slate-700 text-center transition-colors cursor-pointer"
                >
                  Kembali ke Ringkasan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
