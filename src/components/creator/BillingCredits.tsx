import React, { useState } from 'react';
import { CreditCard, Zap, Check } from 'lucide-react';
import { topupPlans } from '../../data/mockData';
import { TopupPlan } from '../../types';

interface BillingCreditsProps {
  credits: number;
  onSelectPlan: (plan: TopupPlan) => void;
}

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

export const BillingCredits: React.FC<BillingCreditsProps> = ({
  credits,
  onSelectPlan
}) => {
  const [selectedPlan, setSelectedPlan] = useState<TopupPlan>(topupPlans[0]);
  const [selectedMethod, setSelectedMethod] = useState<string>('qris');

  const handlePayNow = () => {
    onSelectPlan(selectedPlan);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header (Matches Image 2) */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Billing
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Top-up kredit untuk memakai fitur AI.
        </p>
      </div>

      {/* Sisa Kredit Box (Matches Image 2) */}
      <div className="p-4 rounded-2xl bg-[#0b1329] border border-slate-800/90 flex items-center gap-3 shadow-lg">
        <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center shrink-0">
          <Zap className="w-4 h-4 fill-current" />
        </div>
        <div>
          <p className="text-xs text-slate-400">Sisa kredit kamu</p>
          <p className="text-lg font-black text-white">
            {credits.toLocaleString('id-ID')} kredit
          </p>
        </div>
      </div>

      {/* 6 Packages (3 columns x 2 rows, Matches Image 2) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
        {topupPlans.map((plan) => {
          const isSelected = selectedPlan.id === plan.id;
          return (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all relative flex flex-col justify-between space-y-4 shadow-lg ${
                isSelected
                  ? 'bg-[#0e1c40] border-blue-500 ring-2 ring-blue-500/40'
                  : 'bg-[#0b1329] border-slate-800/90 hover:border-slate-700'
              }`}
            >
              {isSelected && (
                <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
              )}

              <div>
                <p className="text-xs font-semibold text-slate-300">
                  {plan.name}
                </p>
                <div className="flex items-baseline gap-1.5 mt-2">
                  <span className="text-2xl font-black text-white">
                    {plan.credits}
                  </span>
                  <span className="text-xs text-slate-400 font-normal">
                    kredit
                  </span>
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

      {/* Metode Pembayaran (Matches Image 2) */}
      <div className="space-y-3 p-5 rounded-2xl bg-[#0b1329] border border-slate-800/90 shadow-lg">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
          Metode Pembayaran
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {paymentMethods.map((m) => {
            const isSelected = selectedMethod === m.id;
            return (
              <button
                type="button"
                key={m.id}
                onClick={() => setSelectedMethod(m.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#0e1d42] border-blue-500 text-white shadow'
                    : 'bg-[#070e20] border-slate-800/80 text-slate-300 hover:border-slate-700'
                }`}
              >
                <span className="text-xs font-bold leading-tight block">
                  {m.name}
                </span>
                <span className="text-[10px] text-slate-400 mt-1 block uppercase font-mono">
                  {m.category}
                </span>
              </button>
            );
          })}
        </div>

        {/* Total bayar & Checkout Button (Matches Image 2) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
          <div>
            <p className="text-xs text-slate-400">Total bayar</p>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-white font-mono">
                Rp {selectedPlan.price.toLocaleString('id-ID')}
              </span>
              <span className="text-[11px] text-slate-400">
                + biaya admin di checkout
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePayNow}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
          >
            <CreditCard className="w-4 h-4" />
            <span>Bayar Sekarang</span>
          </button>
        </div>
      </div>
    </div>
  );
};
