"use client";
import React, { useState } from 'react';
import { X, Tag, CheckCircle } from 'lucide-react';
import { useModal } from '@/context/ModalContext';
import { useToast } from '@/context/ToastContext';

export default function OfferModal() {
  const { closeModal, modalProps } = useModal();
  const { addToast } = useToast();
  const [offerType, setOfferType] = useState<'percent' | 'custom'>('percent');
  const [percent, setPercent] = useState<number | null>(null);
  const [customPrice, setCustomPrice] = useState('');

  // Fiyatı sayıya çevir (Örn: "1.250.000 TL")
  const currentPriceRaw = parseFloat(modalProps.price.replace(/\./g, '').replace(',', '.'));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalOffer = 0;
    if (offerType === 'percent' && percent) {
      finalOffer = currentPriceRaw - (currentPriceRaw * percent / 100);
    } else if (offerType === 'custom' && customPrice) {
      finalOffer = parseFloat(customPrice);
    } else {
      addToast('Lütfen geçerli bir teklif giriniz.', 'error');
      return;
    }

    // API Simülasyonu
    addToast(`${finalOffer.toLocaleString('tr-TR')} TL tutarındaki teklifiniz satıcıya iletildi.`, 'success');
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal}></div>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-200">

        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <Tag size={18} className="text-blue-600" /> Fiyat Teklifi Ver
          </h3>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-blue-50 p-3 rounded border border-blue-100 mb-6 flex justify-between items-center">
             <span className="text-sm text-blue-800">İlan Fiyatı:</span>
             <span className="font-bold text-blue-900 text-lg">{modalProps.price} {modalProps.currency}</span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex gap-4 mb-4">
              <button
                type="button"
                onClick={() => setOfferType('percent')}
                className={`flex-1 py-2 text-sm font-bold rounded border transition-colors ${offerType === 'percent' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300'}`}
              >
                İndirim İste (%)
              </button>
              <button
                type="button"
                onClick={() => setOfferType('custom')}
                className={`flex-1 py-2 text-sm font-bold rounded border transition-colors ${offerType === 'custom' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300'}`}
              >
                Fiyat Öner (TL)
              </button>
            </div>

            {offerType === 'percent' ? (
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[5, 10, 15].map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPercent(p)}
                    className={`border rounded p-2 text-center hover:bg-gray-50 relative ${percent === p ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50' : 'border-gray-200'}`}
                  >
                    <span className="block font-bold text-lg text-[#333]">%{p}</span>
                    <span className="block text-[10px] text-gray-500">İndirim</span>
                    {percent === p && <div className="absolute top-1 right-1 text-blue-600"><CheckCircle size={12} /></div>}
                  </button>
                ))}
              </div>
            ) : (
              <div className="mb-6">
                 <label className="block text-xs font-bold text-gray-600 mb-1">Teklif Ettiğiniz Tutar</label>
                 <input
                   type="number"
                   value={customPrice}
                   onChange={(e) => setCustomPrice(e.target.value)}
                   className="w-full border border-gray-300 rounded h-10 px-3 focus:border-blue-500 outline-none font-bold text-[#333]"
                   placeholder="Örn: 1500000"
                 />
                 {customPrice && (
                   <p className="text-xs text-green-600 mt-1 font-medium">
                     Yaklaşık %{Math.round(100 - (parseFloat(customPrice) / currentPriceRaw * 100))} indirim teklif ediyorsunuz.
                   </p>
                 )}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#ffe800] text-black font-bold py-3 rounded-sm hover:bg-yellow-400 transition-colors shadow-sm"
            >
              Teklifi Gönder
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}