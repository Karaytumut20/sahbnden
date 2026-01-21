import React from 'react';
import { notFound } from 'next/navigation';
import { getAdDetailServer } from '@/lib/actions';
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
import Badge from '@/components/ui/Badge';
import { Calendar, Eye, Hash, MapPin } from 'lucide-react';
import type { Metadata, ResolvingMetadata } from 'next';

// DİNAMİK SEO & OPEN GRAPH (WhatsApp/Twitter Önizlemesi İçin)
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }, parent: ResolvingMetadata): Promise<Metadata> {
  const { id } = await params;
  const ad = await getAdDetailServer(Number(id));

  if (!ad) return { title: 'İlan Bulunamadı' };

  const previousImages = (await parent).openGraph?.images || [];
  const adImage = ad.image || 'https://sahibinden-klon.com/og-default.png';

  return {
    title: `${ad.title} - ${ad.price.toLocaleString()} ${ad.currency}`,
    description: `${ad.city}/${ad.district} - ${ad.category} kategorisindeki bu fırsatı inceleyin. Fiyat: ${ad.price} ${ad.currency}`,
    openGraph: {
      title: ad.title,
      description: `${ad.price.toLocaleString()} ${ad.currency} - ${ad.city} / ${ad.district}`,
      url: `https://sahibinden-klon.com/ilan/${id}`,
      siteName: 'sahibinden.com Klon',
      images: [adImage, ...previousImages],
      locale: 'tr_TR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: ad.title,
      description: `${ad.price} ${ad.currency} - ${ad.description.substring(0, 100)}...`,
      images: [adImage],
    },
  };
}

export default async function AdDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ad = await getAdDetailServer(Number(id));

  if (!ad) return notFound();

  const formattedPrice = ad.price?.toLocaleString('tr-TR');
  const location = `${ad.city || ''} / ${ad.district || ''}`;
  const sellerInfo = ad.profiles || { full_name: 'Bilinmiyor', phone: '', email: '' };

  const tabItems = [
    {
      id: 'desc',
      label: 'İlan Açıklaması',
      content: <div className="text-[14px] text-[#333] leading-relaxed whitespace-pre-wrap font-sans">{ad.description}</div>
    },
    { id: 'features', label: 'İlan Özellikleri', content: <FeaturesTab ad={ad} /> },
    { id: 'location', label: 'Konum', content: <LocationTab city={ad.city} district={ad.district} /> }
  ];

  // Özellik Listesi (Dolu olanları göster)
  const attributes = [
    { label: 'İlan No', value: ad.id, icon: Hash },
    { label: 'İlan Tarihi', value: new Date(ad.created_at).toLocaleDateString('tr-TR'), icon: Calendar },
    { label: 'Konum', value: location, icon: MapPin },
    { label: 'Metrekare', value: ad.m2 ? `${ad.m2} m²` : null },
    { label: 'Oda Sayısı', value: ad.room },
    { label: 'Bina Yaşı', value: ad.year && ad.category.includes('konut') ? `${new Date().getFullYear() - ad.year} Yaşında` : null },
    { label: 'Bulunduğu Kat', value: ad.floor ? `${ad.floor}. Kat` : null },
    { label: 'Isıtma', value: ad.heating },
    { label: 'Marka', value: ad.brand },
    { label: 'Model Yılı', value: ad.year && !ad.category.includes('konut') ? ad.year : null },
    { label: 'KM', value: ad.km ? `${ad.km.toLocaleString()} KM` : null },
    { label: 'Vites', value: ad.gear },
    { label: 'Yakıt', value: ad.fuel },
  ].filter(attr => attr.value);

  return (
    <div className="pb-20 relative font-sans">
      <StickyAdHeader title={ad.title} price={formattedPrice} currency={ad.currency} />

      <div className="mb-4">
        <Breadcrumb path={`${ad.category === 'emlak' ? 'Emlak' : 'Vasıta'} > ${location} > İlan Detayı`} />
      </div>

      <div className="border-b border-gray-200 pb-4 mb-6">
        <h1 className="text-[#333] font-bold text-xl mb-2">{ad.title}</h1>
        <div className="flex gap-2">
            {ad.is_urgent && <Badge variant="danger">Acil Satılık</Badge>}
            {ad.is_vitrin && <Badge variant="warning">Vitrinde</Badge>}
            {ad.price < 2000000 && <Badge variant="success">Fırsat Ürünü</Badge>}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-[600px] shrink-0">
          <Gallery mainImage={ad.image || 'https://via.placeholder.com/800x600?text=Resim+Yok'} />
          <div className="mt-4 hidden md:block"><AdActionButtons id={ad.id} title={ad.title} image={ad.image} sellerName={sellerInfo.full_name} /></div>
          <Tabs items={tabItems} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="mb-6">
            <span className="block text-blue-700 font-bold text-2xl">{formattedPrice} {ad.currency}</span>
            <span className="block text-gray-500 text-xs mt-1 flex items-center gap-1"><MapPin size={12}/> {location}</span>
          </div>

          <div className="bg-white border-t border-gray-200">
             {attributes.map((attr, idx) => (
               <div key={idx} className="flex justify-between py-2.5 border-b border-gray-100 text-sm hover:bg-gray-50 px-2 transition-colors">
                 <span className="font-bold text-[#333] flex items-center gap-2">{attr.icon && <attr.icon size={14} className="text-gray-400"/>} {attr.label}</span>
                 <span className={`${attr.label === 'İlan No' ? 'text-red-600 font-bold' : 'text-[#333]'}`}>{attr.value}</span>
               </div>
             ))}
             <div className="flex justify-between py-2.5 border-b border-gray-100 text-sm px-2">
                <span className="font-bold text-[#333] flex items-center gap-2"><Eye size={14} className="text-gray-400"/> Görüntülenme</span>
                <span>1.245</span>
             </div>
          </div>
        </div>

        <div className="lg:w-[280px] shrink-0 hidden md:block">
           <SellerSidebar sellerId={ad.user_id} sellerName={sellerInfo.full_name || 'Kullanıcı'} sellerPhone={sellerInfo.phone || 'Telefon yok'} adId={ad.id} adTitle={ad.title} adImage={ad.image} price={formattedPrice} currency={ad.currency} />
           {ad.category.includes('konut') && <LoanCalculator price={ad.price} />}
           <div className="mt-4 bg-yellow-50 p-4 border border-yellow-200 rounded-sm text-xs text-yellow-800"><strong>Güvenlik İpucu:</strong> Tanımadığınız kişilere kesinlikle para göndermeyin, kapora yatırmayın.</div>
        </div>
      </div>
      <MobileAdActionBar price={`${formattedPrice} ${ad.currency}`} />
    </div>
  );
}