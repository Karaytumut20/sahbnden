
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Star, Zap, Layout, CheckCircle, ArrowRight } from 'lucide-react';

const dopings = [
  {
    id: 1,
    title: 'Ana Sayfa Vitrini',
    desc: 'İlanınız ana sayfada milyonlarca kişinin göreceği vitrin alanında yayınlansın.',
    price: 350,
    icon: Star,
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
    border: 'border-yellow-200'
  },
  {
    id: 2,
    title: 'Acil Acil',
    desc: 'İlanınız "Acil Acil" kategorisinde listelensin ve kırmızı etiketle dikkat çeksin.',
    price: 150,
    icon: Zap,
    color: 'text-red-600',
    bg: 'bg-red-50',
    border: 'border-red-200'
  },
  {
    id: 3,
    title: 'Kalın Yazı & Renkli Çerçeve',
    desc: 'Arama sonuçlarında ilanınızın başlığı kalın yazılsın ve renkli çerçeve ile ayrılsın.',
    price: 90,
    icon: Layout,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    border: 'border-blue-200'
  },
];

export default function DopingPage() {
  const router = useRouter();
  const [selectedDopings, setSelectedDopings] = useState<number[]>([]);

  const toggleDoping = (id: number) => {
    if (selectedDopings.includes(id)) {
      setSelectedDopings(selectedDopings.filter(d => d !== id));
    } else {
      setSelectedDopings([...selectedDopings, id]);
    }
  };

  const totalPrice = selectedDopings.reduce((acc, id) => {
    const doping = dopings.find(d => d.id === id);
    return acc + (doping ? doping.price : 0);
  }, 0);

  const handleContinue = () => {
    // Seçilen dopingleri URL parametresi veya state ile taşıyabiliriz.
    // Şimdilik demo olduğu için direkt geçiyoruz.
    router.push(`/ilan-ver/odeme?total=${totalPrice}`);
  };

  return (
    <div className="max-w-[900px] mx-auto py-8 px-4">
      <h1 className="text-xl font-bold text-[#333] mb-6 border-b pb-2">Adım 3: İlanınızı Öne Çıkarın (Doping)</h1>

      <div className="flex flex-col md:flex-row gap-6">

        {/* Doping Listesi */}
        <div className="flex-1 space-y-4">
          {dopings.map((doping) => {
            const isSelected = selectedDopings.includes(doping.id);
            return (
              <div
                key={doping.id}
                onClick={() => toggleDoping(doping.id)}
                className={`relative border rounded-md p-4 cursor-pointer transition-all flex items-start gap-4 ${isSelected ? `border-blue-500 ring-1 ring-blue-500 ${doping.bg}` : 'border-gray-200 hover:border-gray-300 bg-white'}`}
              >
                <div className={`p-3 rounded-full ${doping.bg} ${doping.color} border ${doping.border}`}>
                  <doping.icon size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-[#333]">{doping.title}</h3>
                    <span className="font-bold text-[#333]">{doping.price} TL</span>
                  </div>
                  <p className="text-sm text-gray-600">{doping.desc}</p>
                </div>
                {isSelected && (
                  <div className="absolute top-4 right-4 text-blue-600">
                    <CheckCircle size={20} fill="currentColor" className="text-white" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Özet Kartı */}
        <div className="w-full md:w-[300px] shrink-0">
          <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-4 sticky top-4">
            <h3 className="font-bold text-[#333] border-b border-gray-100 pb-2 mb-3">Sipariş Özeti</h3>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-gray-600">
                <span>İlan Ücreti</span>
                <span>Ücretsiz</span>
              </div>
              {selectedDopings.map(id => {
                const d = dopings.find(x => x.id === id);
                return (
                  <div key={id} className="flex justify-between text-sm text-[#333]">
                    <span className="truncate pr-2">{d?.title}</span>
                    <span className="font-bold">{d?.price} TL</span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-gray-200 pt-3 flex justify-between items-center mb-4">
              <span className="font-bold text-[#333]">Toplam Tutar</span>
              <span className="text-xl font-bold text-blue-900">{totalPrice} TL</span>
            </div>

            <button
              onClick={handleContinue}
              className="w-full bg-[#ffe800] text-black font-bold py-3 rounded-sm hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2 text-sm shadow-sm"
            >
              Devam Et <ArrowRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
