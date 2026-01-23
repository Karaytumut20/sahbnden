"use client";
import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Star, Zap, Layout, CheckCircle, ArrowRight, ShieldCheck } from 'lucide-react';

const dopings = [
  {
    id: 1,
    title: 'Ana Sayfa Vitrini',
    desc: 'Milyonlarca ziyaretçinin gördüğü ana sayfada ilanınız döner.',
    price: 350,
    icon: Star,
    color: 'text-yellow-500',
    tag: 'Popüler'
  },
  {
    id: 2,
    title: 'Acil Acil',
    desc: 'Acil satılık kategorisinde kırmızı etiketle listelenir.',
    price: 150,
    icon: Zap,
    color: 'text-red-500',
    tag: 'Hızlı Satış'
  },
  {
    id: 3,
    title: 'Kalın Yazı & Çerçeve',
    desc: 'Liste görünümünde diğer ilanlardan ayrışır ve dikkat çeker.',
    price: 90,
    icon: Layout,
    color: 'text-indigo-500',
    tag: null
  },
];

function DopingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const adId = searchParams.get('adId');
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
    const dopingParam = selectedDopings.length > 0 ? `&doping=${selectedDopings.join(',')}` : '';
    const adIdParam = adId ? `&adId=${adId}` : '';
    router.push(`/ilan-ver/odeme?total=${totalPrice}${dopingParam}${adIdParam}`);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">

      {/* SOL: SEÇENEKLER */}
      <div className="flex-1 w-full">
        <h1 className="text-xl font-bold text-slate-800 mb-2">İlanınızı Öne Çıkarın</h1>
        <p className="text-sm text-slate-500 mb-6">Doping seçenekleri ile ilanınızın görüntülenme sayısını 10 kata kadar artırabilirsiniz.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dopings.map((doping) => {
            const isSelected = selectedDopings.includes(doping.id);
            return (
              <div
                key={doping.id}
                onClick={() => toggleDoping(doping.id)}
                className={`
                  relative cursor-pointer rounded-2xl border-2 p-6 transition-all duration-300 hover:shadow-lg
                  flex flex-col justify-between h-[280px] group
                  ${isSelected ? 'border-indigo-600 bg-indigo-50/50 shadow-md' : 'border-gray-200 bg-white hover:border-indigo-200'}
                `}
              >
                {/* Check Icon */}
                <div className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center transition-colors ${isSelected ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-white group-hover:bg-gray-300'}`}>
                  <CheckCircle size={14} fill="currentColor" className="text-white" strokeWidth={3} />
                </div>

                {/* Tag */}
                {doping.tag && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                    {doping.tag}
                  </span>
                )}

                <div className="text-center pt-6">
                  <doping.icon size={48} className={`mx-auto mb-4 ${doping.color} drop-shadow-sm`} />
                  <h3 className="font-bold text-slate-900 mb-2">{doping.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed px-2">{doping.desc}</p>
                </div>

                <div className="text-center pt-4 border-t border-gray-100/50 mt-4">
                  <span className={`text-2xl font-bold ${isSelected ? 'text-indigo-700' : 'text-slate-800'}`}>
                    {doping.price} <span className="text-sm font-normal text-slate-500">TL</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SAĞ: ÖZET */}
      <div className="w-full lg:w-[320px] shrink-0 sticky top-28">
        <div className="bg-white rounded-2xl shadow-card border border-gray-200 overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-bold text-slate-800 text-sm">Sipariş Özeti</h3>
          </div>

          <div className="p-5 space-y-3">
            <div className="flex justify-between text-sm text-slate-600">
              <span>Standart İlan</span>
              <span className="text-green-600 font-bold">Ücretsiz</span>
            </div>

            {selectedDopings.map(id => {
              const d = dopings.find(x => x.id === id);
              return (
                <div key={id} className="flex justify-between text-sm text-slate-800 animate-in fade-in slide-in-from-left-2">
                  <span>{d?.title}</span>
                  <span className="font-bold">{d?.price} TL</span>
                </div>
              );
            })}

            <div className="border-t border-gray-100 pt-4 mt-2 flex justify-between items-center">
              <span className="font-bold text-slate-900 text-lg">Toplam</span>
              <span className="font-extrabold text-2xl text-indigo-700">{totalPrice} TL</span>
            </div>
          </div>

          <div className="p-5 pt-0 bg-white">
            <button
              onClick={handleContinue}
              className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 flex items-center justify-center gap-2 group"
            >
              Ödemeye Geç <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
            </button>
            <p className="text-[10px] text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
              <ShieldCheck size={12}/> Güvenli Ödeme Altyapısı
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default function DopingPage() {
    return <Suspense fallback={<div className="p-10 text-center"><div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto"></div></div>}><DopingContent /></Suspense>
}