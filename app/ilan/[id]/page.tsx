
import React from 'react';
import { notFound } from 'next/navigation';
import { getAdById } from '@/lib/data';
import Breadcrumb from '@/components/Breadcrumb';
import Gallery from '@/components/Gallery';
import MobileAdActionBar from '@/components/MobileAdActionBar';
import RelatedAds from '@/components/RelatedAds';
import AdActionButtons from '@/components/AdActionButtons';
import HistoryTracker from '@/components/HistoryTracker';
import StickyAdHeader from '@/components/StickyAdHeader';
import SellerSidebar from '@/components/SellerSidebar'; // YENİ

export default async function AdDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ad = getAdById(Number(id));

  if (!ad) return notFound();

  const sellerId = ad.sellerId || 101;
  const sellerName = ad.sellerName || 'Ahmet Yılmaz';

  return (
    <div className="pb-10 relative">
      <HistoryTracker ad={ad} />
      <StickyAdHeader title={ad.title} price={ad.price} currency={ad.currency} />

      <Breadcrumb path={ad.category} />

      <div className="border-b border-gray-200 pb-2 mb-4">
        <h1 className="text-[#333] font-bold text-lg">{ad.title}</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mb-20 md:mb-0">
        <div className="lg:w-[500px] shrink-0">
          <Gallery mainImage={ad.image} />
          {/* AdActionButtons'a seller ve image bilgilerini de geçiyoruz */}
          <AdActionButtons id={ad.id} title={ad.title} image={ad.image} sellerName={sellerName} />
        </div>

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

        {/* SAĞ KOLON (Client Component) */}
        <div className="lg:w-[260px] shrink-0 hidden md:block">
           <SellerSidebar
             sellerId={sellerId}
             sellerName={sellerName}
             adId={ad.id}
             adTitle={ad.title}
             adImage={ad.image}
           />
        </div>
      </div>

      <RelatedAds category={ad.category} currentId={ad.id} />
      <MobileAdActionBar price={`${ad.price} ${ad.currency}`} />
    </div>
  );
}
