"use client";
import React, { useState, useEffect } from 'react';
import { Calculator, ArrowRight } from 'lucide-react';

export default function LoanCalculator({ price }: { price: number }) {
  const [amount, setAmount] = useState(price ? Math.floor(price * 0.8) : 1000000); // Varsayılan %80 kredi
  const [term, setTerm] = useState(120); // 120 Ay
  const [rate, setRate] = useState(3.05); // Faiz Oranı
  const [result, setResult] = useState<{ monthly: number; total: number } | null>(null);

  useEffect(() => {
    calculate();
  }, [amount, term, rate]);

  const calculate = () => {
    const r = rate / 100;
    const monthly = (amount * r * Math.pow(1 + r, term)) / (Math.pow(1 + r, term) - 1);
    const total = monthly * term;
    setResult({ monthly, total });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-5 mt-4">
      <h3 className="font-bold text-[#333] flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
        <Calculator size={18} className="text-blue-600" /> Kredi Hesaplama
      </h3>

      <div className="space-y-3 mb-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">Kredi Tutarı (TL)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-sm p-2 text-sm focus:border-blue-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Vade (Ay)</label>
            <select
              value={term}
              onChange={(e) => setTerm(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-sm p-2 text-sm bg-white outline-none"
            >
              {[12, 24, 36, 48, 60, 120, 180, 240].map(m => (
                <option key={m} value={m}>{m} Ay</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Faiz Oranı (%)</label>
            <input
              type="number"
              step="0.01"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-sm p-2 text-sm focus:border-blue-500 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-3 rounded-sm border border-blue-100">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-blue-800">Aylık Taksit:</span>
          <span className="text-sm font-bold text-blue-900">{result?.monthly.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} TL</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Toplam Geri Ödeme:</span>
          <span className="text-xs font-bold text-gray-600">{result?.total.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} TL</span>
        </div>
      </div>

      <button className="w-full mt-3 text-xs text-gray-500 hover:text-blue-700 flex items-center justify-center gap-1 font-bold">
        Detaylı Hesaplama <ArrowRight size={12} />
      </button>
    </div>
  );
}