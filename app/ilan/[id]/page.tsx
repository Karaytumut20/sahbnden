
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAdById } from '@/lib/data';
import Breadcrumb from '@/components/Breadcrumb';
import Gallery from '@/components/Gallery';
import { Phone, User, ShieldCheck, ChevronRight } from 'lucide-react';
import MobileAdActionBar from '@/components/MobileAdActionBar';
import RelatedAds from '@/components/RelatedAds';
import AdActionButtons from '@/components/AdActionButtons';
import HistoryTracker from '@/components/HistoryTracker'; // YENİ

export default async function AdDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ad = getAdById(Number(id));

  if (!ad) return notFound();

  const sellerId = ad.sellerId || 101;
  const sellerName = ad.sellerName || 'Ahmet Yılmaz';

  return (
    <div className="pb-10">
      {/* GEÇMİŞ TAKİPÇİSİ (Client Component) */}
      <HistoryTracker ad={ad} />

      <Breadcrumb path={ad.category} />

      <div className="border-b border-gray-200 pb-2 mb-4">
        <h1 className="text-[#333] font-bold text-lg">{ad.title}</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mb-20 md:mb-0">

        {/* SOL KOLON */}
        <div className="lg:w-[500px] shrink-0">
          <Gallery mainImage={ad.image} />
          <AdActionButtons id={ad.id} title={ad.title} />
        </div>

        {/* ORTA KOLON */}
        <div className="flex-1 min-w-0">
          <div className="mb-4 hidden md:block">
            <span className="block text-blue-600 font-bold text-xl">{ad.price} {ad.currency}</span>
            <span className="block text-gray-500 text-[12px] mt-1">{ad.location}</span>
          </div>

          <div className="border-t border-gray-200">
            {ad.attributes.map((attr: any, index: number) => (
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
            <div className="text-[14px] text-[#333] leading-relaxed" dangerouslySetInnerHTML={{ __html: ad.description }} />
          </div>
        </div>

        {/* SAĞ KOLON */}
        <div className="lg:w-[260px] shrink-0 hidden md:block">
           <div className="border border-gray-200 bg-white p-4 rounded-sm shadow-sm sticky top-4">
              <h4 className="font-bold text-md text-[#333] mb-4">İlan Sahibi</h4>

              <Link href={`/satici/${sellerId}`} className="flex items-center gap-3 mb-4 group cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded transition-colors">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                  <User size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm text-[#333] group-hover:text-blue-700 flex justify-between items-center">
                    {sellerName} <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </p>
                  <p className="text-[11px] text-gray-500">Tüm İlanları</p>
                </div>
              </Link>

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

      <RelatedAds category={ad.category} currentId={ad.id} />
      <MobileAdActionBar price={`${ad.price} ${ad.currency}`} />
    </div>
  );
}
