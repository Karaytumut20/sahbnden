import React from 'react';
import { notFound } from 'next/navigation';
import { getAdDetailServer } from '@/lib/actions';
import Breadcrumb from '@/components/Breadcrumb';
import Gallery from '@/components/Gallery';
import MobileAdActionBar from '@/components/MobileAdActionBar';
import AdActionButtons from '@/components/AdActionButtons';
import StickyAdHeader from '@/components/StickyAdHeader';
import SellerSidebar from '@/components/SellerSidebar';

export default async function AdDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ad = await getAdDetailServer(Number(id));

  if (!ad) return notFound();

  const formattedPrice = ad.price?.toLocaleString('tr-TR');
  const location = `${ad.city || ''} / ${ad.district || ''}`;
  // Seller bilgisi ilişkili tablodan (profiles) geliyor
  const sellerInfo = ad.profiles || { full_name: 'Bilinmiyor', phone: '', email: '' };

  return (
    <div className="pb-10 relative">
      <StickyAdHeader title={ad.title} price={formattedPrice} currency={ad.currency} />
      <Breadcrumb path={`${ad.category} > İlan Detayı`} />

      <div className="border-b border-gray-200 pb-2 mb-4">
        <h1 className="text-[#333] font-bold text-lg">{ad.title}</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mb-20 md:mb-0">
        <div className="lg:w-[500px] shrink-0">
          <Gallery mainImage={ad.image || 'https://via.placeholder.com/800x600?text=Resim+Yok'} />
          <AdActionButtons id={ad.id} title={ad.title} image={ad.image} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="mb-4 hidden md:block">
            <span className="block text-blue-600 font-bold text-xl">{formattedPrice} {ad.currency}</span>
            <span className="block text-gray-500 text-[12px] mt-1">{location}</span>
          </div>

          <div className="border-t border-gray-200">
             <div className="flex justify-between py-2 border-b border-gray-100 text-sm"><span className="font-bold">İlan No</span><span className="text-red-600">{ad.id}</span></div>
             <div className="flex justify-between py-2 border-b border-gray-100 text-sm"><span className="font-bold">Tarih</span><span>{new Date(ad.created_at).toLocaleDateString('tr-TR')}</span></div>
             {ad.room && <div className="flex justify-between py-2 border-b border-gray-100 text-sm"><span className="font-bold">Oda Sayısı</span><span>{ad.room}</span></div>}
             {ad.km && <div className="flex justify-between py-2 border-b border-gray-100 text-sm"><span className="font-bold">KM</span><span>{ad.km}</span></div>}
          </div>

          <div className="mt-8">
            <h3 className="font-bold text-[#333] text-sm mb-3 border-b border-gray-200 pb-1">İlan Açıklaması</h3>
            <div className="text-[14px] text-[#333] leading-relaxed whitespace-pre-wrap">{ad.description}</div>
          </div>
        </div>

        <div className="lg:w-[260px] shrink-0 hidden md:block">
           <SellerSidebar
             sellerId={ad.user_id}
             sellerName={sellerInfo.full_name || 'Kullanıcı'}
             sellerPhone={sellerInfo.phone || 'Telefon yok'}
             adId={ad.id}
             adTitle={ad.title}
             adImage={ad.image}
             price={formattedPrice}
             currency={ad.currency}
           />
        </div>
      </div>
      <MobileAdActionBar price={`${formattedPrice} ${ad.currency}`} />
    </div>
  );
}