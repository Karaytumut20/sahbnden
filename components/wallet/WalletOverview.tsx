"use client";
import React, { useState } from 'react';
import { Wallet, Plus, CreditCard, Loader2 } from 'lucide-react';
import { useServerAction } from '@/hooks/use-server-action';
import { depositToWalletAction } from '@/lib/actions/wallet-actions';
import { useToast } from '@/context/ToastContext';

export default function WalletOverview({ balance, currency }: { balance: number, currency: string }) {
  const [isAdding, setIsAdding] = useState(false);
  const [amount, setAmount] = useState('100');
  const { addToast } = useToast();

  const { runAction, loading } = useServerAction(depositToWalletAction, (data) => {
      addToast(`${amount} TL başarıyla yüklendi.`, 'success');
      setIsAdding(false);
  });

  const handleDeposit = () => {
      const numAmount = Number(amount);
      if (numAmount < 10) { addToast('En az 10 TL yükleyebilirsiniz.', 'error'); return; }

      // Kart bilgisi mock gönderiliyor
      runAction(numAmount, { number: '1234' });
  };

  return (
    <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-lg p-6 shadow-lg mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>

      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
           <p className="text-blue-200 text-sm font-medium flex items-center gap-2 mb-1">
             <Wallet size={18}/> Mevcut Bakiye
           </p>
           <h2 className="text-4xl font-bold tracking-tight">
             {balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} <span className="text-xl font-normal">{currency}</span>
           </h2>
        </div>

        <div className="flex gap-3">
           {!isAdding ? (
               <button
                 onClick={() => setIsAdding(true)}
                 className="bg-white/20 hover:bg-white/30 border border-white/40 text-white px-6 py-3 rounded-md font-bold transition-all flex items-center gap-2"
               >
                  <Plus size={20}/> Bakiye Yükle
               </button>
           ) : (
               <div className="bg-white p-2 rounded-md flex items-center gap-2 animate-in fade-in zoom-in-95 text-gray-800">
                  <span className="text-xs font-bold text-gray-500 pl-2">Tutar:</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-20 border border-gray-300 rounded px-2 py-1 text-sm outline-none focus:border-blue-500 text-black"
                    autoFocus
                  />
                  <button
                    onClick={handleDeposit}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white p-1.5 rounded disabled:opacity-50"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin"/> : <CreditCard size={16}/>}
                  </button>
                  <button onClick={() => setIsAdding(false)} className="text-red-500 hover:bg-red-50 p-1.5 rounded">İptal</button>
               </div>
           )}
        </div>
      </div>
    </div>
  );
}