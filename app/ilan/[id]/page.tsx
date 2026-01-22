import React from 'react';
import { notFound } from 'next/navigation';
import { getAdDetailServer, getAdFavoriteCount } from '@/lib/actions';
import Breadcrumb from '@/components/Breadcrumb';
import Gallery from '@/components/Gallery';
import MobileAdActionBar from '@/components/MobileAdActionBar';
import AdActionButtons from '@/components/AdActionButtons';
import StickyAdHeader from '@/components/StickyAdHeader';
import SellerSidebar from '@/components/SellerSidebar';
import Tabs from '@/components/AdDetail/Tabs';
import FeaturesTab from '@/components/AdDetail/FeaturesTab';
import LocationTab from '@/components/AdDetail/LocationTab';
import LoanCalculator from '@/components/tools/LoanCalculator';
import ViewTracker from '@/components/ViewTracker';
import LiveVisitorCount from '@/components/LiveVisitorCount'; // YENİ
import Badge from '@/components/ui/Badge';
import { Eye, MapPin, Heart } from 'lucide-react';
import type { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }, parent: ResolvingMetadata): Promise<Metadata> {
  const { id } = await params;
  const ad = await getAdDetailServer(Number(id));
  if (!ad) return { title: 'İlan Bulunamadı' };
  return {
    title: `${ad.title} - ${ad.price.toLocaleString()} ${ad.currency}`,
    description: `${ad.city}/${ad.district} bölgesinde ${ad.title} ilanını inceleyin.`,
    openGraph: { images: [ad.image || ''] },
  };
}

export default async function AdDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ad = await getAdDetailServer(Number(id));
  if (!ad) return notFound();

  const favCount = await getAdFavoriteCount(Number(id));
  const formattedPrice = ad.price?.toLocaleString('tr-TR');
  const location = `${ad.city || ''} / ${ad.district || ''}`;
  const sellerInfo = ad.profiles || { full_name: 'Bilinmiyor', phone: '', email: '' };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: ad.title,
    image: ad.image || [],
    description: ad.description,
    offers: {
      '@type': 'Offer',
      price: ad.price,
      priceCurrency: ad.currency,
      availability: 'https://schema.org/InStock',
      url: `https://sahibinden-klon.com/ilan/${ad.id}`,
    },
  };

  return (
    <div className="pb-20 relative font-sans">
      <ViewTracker adId={ad.id} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <StickyAdHeader title={ad.title} price={formattedPrice} currency={ad.currency} />

      <div className="mb-4">
        <Breadcrumb path={`${ad.category === 'emlak' ? 'Emlak' : 'Vasıta'} > ${location} > İlan Detayı`} />
      </div>

      <div className="border-b border-gray-200 pb-4 mb-6">
        <h1 className="text-[#333] font-bold text-xl mb-2">{ad.title}</h1>
        <div className="flex flex-wrap gap-2 items-center">
            {ad.is_urgent && <Badge variant="danger">Acil Satılık</Badge>}
            {ad.is_vitrin && <Badge variant="warning">Vitrinde</Badge>}
            <LiveVisitorCount adId={ad.id} /> {/* YENİ: SOSYAL KANIT */}
            {favCount > 0 && (
                <span className="text-xs text-red-600 flex items-center gap-1 ml-auto font-bold bg-red-50 px-2 py-1 rounded-sm">
                    <Heart size={12} className="fill-red-600"/> {favCount} favori
                </span>
            )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-[600px] shrink-0">
          <Gallery mainImage={ad.image || 'https://via.placeholder.com/800x600?text=Resim+Yok'} />
          <div className="mt-4 hidden md:block"><AdActionButtons id={ad.id} title={ad.title} image={ad.image} sellerName={sellerInfo.full_name} /></div>
          <Tabs items={[
             { id: 'desc', label: 'İlan Açıklaması', content: <div className="text-[14px] text-[#333] leading-relaxed whitespace-pre-wrap">{ad.description}</div> },
             { id: 'features', label: 'İlan Özellikleri', content: <FeaturesTab ad={ad} /> },
             { id: 'location', label: 'Konum', content: <LocationTab city={ad.city} district={ad.district} /> }
          ]} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="mb-6">
            <span className="block text-blue-700 font-bold text-2xl">{formattedPrice} {ad.currency}</span>
            <span className="block text-gray-500 text-xs mt-1 flex items-center gap-1"><MapPin size={12}/> {location}</span>
          </div>
          <div className="bg-white border-t border-gray-200">
             <div className="flex justify-between py-2.5 border-b border-gray-100 text-sm hover:bg-gray-50 px-2"><span className="font-bold text-[#333]">İlan No</span><span className="text-red-600 font-bold">{ad.id}</span></div>
             <div className="flex justify-between py-2.5 border-b border-gray-100 text-sm hover:bg-gray-50 px-2"><span className="font-bold text-[#333]">İlan Tarihi</span><span>{new Date(ad.created_at).toLocaleDateString('tr-TR')}</span></div>
             {ad.room && <div className="flex justify-between py-2.5 border-b border-gray-100 text-sm hover:bg-gray-50 px-2"><span className="font-bold text-[#333]">Oda Sayısı</span><span>{ad.room}</span></div>}
             {ad.km && <div className="flex justify-between py-2.5 border-b border-gray-100 text-sm hover:bg-gray-50 px-2"><span className="font-bold text-[#333]">KM</span><span>{ad.km}</span></div>}
             <div className="flex justify-between py-2.5 border-b border-gray-100 text-sm px-2 bg-gray-50">
                <span className="font-bold text-[#333] flex items-center gap-2"><Eye size={14} className="text-gray-400"/> Görüntülenme</span>
                <span>{ad.view_count || 0}</span>
             </div>
          </div>
        </div>

        <div className="lg:w-[280px] shrink-0 hidden md:block">
           <SellerSidebar sellerId={ad.user_id} sellerName={sellerInfo.full_name || 'Kullanıcı'} sellerPhone={sellerInfo.phone || 'Telefon yok'} adId={ad.id} adTitle={ad.title} adImage={ad.image} price={formattedPrice} currency={ad.currency} />
           {ad.category.includes('konut') && <LoanCalculator price={ad.price} />}
        </div>
      </div>
      <MobileAdActionBar price={`${formattedPrice} ${ad.currency}`} />
    </div>
  );
}