
import React from 'react';
import { notFound } from 'next/navigation';
import { getAdById } from '@/lib/data';
import Breadcrumb from '@/components/Breadcrumb';
import Gallery from '@/components/Gallery';
import { Phone, User, ShieldCheck, Flag, Printer, Share2 } from 'lucide-react';

export default async function AdDetailPage({ params }) {
  const { id } = await params;
  const ad = getAdById(Number(id));

  if (!ad) return notFound();

  return (
    <div className="pb-10">
      <Breadcrumb path={ad.category} />

      {/* İlan Başlığı ve Üst Bilgi */}
      <div className="border-b border-gray-200 pb-2 mb-4">
        <h1 className="text-[#333] font-bold text-lg">{ad.title}</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">

        {/* SOL KOLON: Galeri */}
        <div className="lg:w-[500px] shrink-0">
          <Gallery mainImage={ad.image} />

          <div className="flex gap-4 text-[11px] text-blue-800 mt-2">
            <button className="flex items-center gap-1 hover:underline"><Flag size={14}/> İlan ile ilgili şikayetim var</button>
            <button className="flex items-center gap-1 hover:underline"><Printer size={14}/> İlanı yazdır</button>
            <button className="flex items-center gap-1 hover:underline"><Share2 size={14}/> Paylaş</button>
          </div>
        </div>

        {/* ORTA KOLON: Fiyat ve Özellikler Tablosu */}
        <div className="flex-1 min-w-0">
          <div className="mb-4">
            <span className="block text-blue-600 font-bold text-xl">{ad.price} {ad.currency}</span>
            <span className="block text-gray-500 text-[12px] mt-1">{ad.location}</span>
          </div>

          <div className="border-t border-gray-200">
            {ad.attributes.map((attr, index) => (
              <div key={index} className="flex justify-between items-center py-1.5 border-b border-gray-100 text-[13px]">
                <span className="font-bold text-[#333]">{attr.label}</span>
                <span className={attr.label === 'İlan No' ? 'text-red-600' : 'text-[#333]'}>
                  {attr.value}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="font-bold text-[#333] text-sm mb-3 border-b border-gray-200 pb-1">İlan Açıklaması</h3>
            <div
              className="text-[14px] text-[#333] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: ad.description }}
            />
          </div>
        </div>

        {/* SAĞ KOLON: Satıcı Bilgileri */}
        <div className="lg:w-[260px] shrink-0">
           <div className="border border-gray-200 bg-white p-4 rounded-sm shadow-sm sticky top-4">
              <h4 className="font-bold text-md text-[#333] mb-4">İlan Sahibi</h4>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                  <User size={20} />
                </div>
                <div>
                  <p className="font-bold text-sm text-[#333]">Ahmet Yılmaz</p>
                  <p className="text-[11px] text-gray-500">Üyelik Tarihi: 2018</p>
                </div>
              </div>

              <div className="space-y-2">
                <button className="w-full bg-[#4682b4] hover:bg-[#315f85] text-white font-bold py-2 rounded-sm text-sm flex items-center justify-center gap-2">
                   <Phone size={16} /> Cep Telini Göster
                </button>
                <button className="w-full border border-gray-300 bg-gray-50 hover:bg-gray-100 text-[#333] font-bold py-2 rounded-sm text-sm">
                   Mesaj Gönder
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 text-[11px] text-green-700 flex items-center gap-1">
                 <ShieldCheck size={14} />
                 <span>Güvenlik İpuçları</span>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
