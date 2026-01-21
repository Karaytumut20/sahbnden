"use client";
import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, ShieldCheck, Loader2 } from 'lucide-react';
import CreditCardForm from '@/components/CreditCardForm';
import { useToast } from '@/context/ToastContext';
import { activateDopingAction } from '@/lib/actions';

function PaymentPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();

  const total = searchParams.get('total') || '0';
  const adId = searchParams.get('adId');
  const dopingIds = searchParams.get('doping')?.split(',') || [];

  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = async () => {
    setIsProcessing(true);

    await new Promise(resolve => setTimeout(resolve, 1500)); // Ödeme Simülasyonu

    if (adId && dopingIds.length > 0) {
        const res = await activateDopingAction(Number(adId), dopingIds);
        if (res.error) {
            addToast('Ödeme alındı ancak doping aktif edilemedi.', 'error');
        } else {
            addToast('Ödeme başarılı! Dopingler tanımlandı.', 'success');
        }
    } else {
        addToast('Ödeme başarıyla alındı! İlanınız yayına hazırlanıyor.', 'success');
    }

    setIsProcessing(false);
    router.push('/ilan-ver/basarili');
  };

  return (
    <div className="max-w-[900px] mx-auto py-8 px-4">
      <h1 className="text-xl font-bold text-[#333] mb-6 border-b pb-2">Adım 4: Güvenli Ödeme</h1>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <div className="bg-white border border-gray-200 shadow-sm p-6 rounded-sm">
            <h3 className="font-bold text-[#333] mb-4 flex items-center gap-2">
              <Lock size={18} className="text-green-600" /> Kredi / Banka Kartı ile Ödeme
            </h3>
            <CreditCardForm />
          </div>
        </div>
        <div className="w-full md:w-[320px] shrink-0">
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6 sticky top-4">
            <h3 className="font-bold text-[#333] border-b border-gray-100 pb-2 mb-4">Ödenecek Tutar</h3>
            <div className="text-3xl font-bold text-center text-blue-900 mb-2">{total} TL</div>
            <button
              onClick={handlePayment}
              disabled={isProcessing}
              className={`w-full mt-6 py-3 rounded-sm font-bold text-white transition-colors shadow-md flex items-center justify-center gap-2 ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
            >
              {isProcessing ? <><Loader2 className="animate-spin" size={18}/> İşleniyor...</> : 'Ödemeyi Tamamla'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentPage() {
    return <Suspense fallback={<div>Yükleniyor...</div>}><PaymentPageContent /></Suspense>
}