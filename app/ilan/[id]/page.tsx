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
import Badge from '@/components/ui/Badge';
import { Calendar, Eye, Hash, MapPin } from 'lucide-react';

// Dinamik Metadata
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ad = await getAdDetailServer(Number(id));
  if (!ad) return { title: 'İlan Bulunamadı' };
  return {
    title: `${ad.title} - sahibinden.com Klon`,
    description: `${ad.city} / ${ad.district} bölgesindeki bu fırsatı kaçırmayın. Fiyat: ${ad.price} ${ad.currency}`,
  };
}

export default async function AdDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ad = await getAdDetailServer(Number(id));

  if (!ad) return notFound();

  const formattedPrice = ad.price?.toLocaleString('tr-TR');
  const location = `${ad.city || ''} / ${ad.district || ''}`;
  const sellerInfo = ad.profiles || { full_name: 'Bilinmiyor', phone: '', email: '' };

  // Tab İçerikleri
  const tabItems = [
    {
      id: 'desc',
      label: 'İlan Açıklaması',
      content: (
        <div className="text-[14px] text-[#333] leading-relaxed whitespace-pre-wrap font-sans">
          {ad.description}
        </div>
      )
    },
    {
      id: 'features',
      label: 'İlan Özellikleri',
      content: <FeaturesTab ad={ad} />
    },
    {
      id: 'location',
      label: 'Konum',
      content: <LocationTab city={ad.city} district={ad.district} />
    }
  ];

  // Özellik Listesi (Sidebar İçin)
  const attributes = [
    { label: 'İlan No', value: ad.id, icon: Hash },
    { label: 'İlan Tarihi', value: new Date(ad.created_at).toLocaleDateString('tr-TR'), icon: Calendar },
    { label: 'Konum', value: location, icon: MapPin },
    { label: 'Metrekare', value: ad.m2 ? `${ad.m2} m²` : null },
    { label: 'Oda Sayısı', value: ad.room },
    { label: 'Bina Yaşı', value: ad.year ? `${2025 - ad.year} Yaşında` : null },
    { label: 'Bulunduğu Kat', value: ad.floor ? `${ad.floor}. Kat` : null },
    { label: 'Isıtma', value: ad.heating },
    { label: 'Marka', value: ad.brand }, // Vasıta
    { label: 'Yıl', value: ad.year }, // Vasıta
    { label: 'KM', value: ad.km ? `${ad.km.toLocaleString()} KM` : null }, // Vasıta
    { label: 'Vites', value: ad.gear }, // Vasıta
    { label: 'Yakıt', value: ad.fuel }, // Vasıta
  ].filter(attr => attr.value); // Değeri olmayanları gizle

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
        {/* SOL KOLON: Galeri ve Tablar */}
        <div className="lg:w-[600px] shrink-0">
          <Gallery mainImage={ad.image || 'https://via.placeholder.com/800x600?text=Resim+Yok'} />

          <div className="mt-4 hidden md:block">
             <AdActionButtons id={ad.id} title={ad.title} image={ad.image} sellerName={sellerInfo.full_name} />
          </div>

          <Tabs items={tabItems} />
        </div>

        {/* ORTA KOLON: Özellik Özeti */}
        <div className="flex-1 min-w-0">
          <div className="mb-6">
            <span className="block text-blue-700 font-bold text-2xl">{formattedPrice} {ad.currency}</span>
            <span className="block text-gray-500 text-xs mt-1 flex items-center gap-1">
                <MapPin size={12}/> {location}
            </span>
          </div>

          <div className="bg-white border-t border-gray-200">
             {attributes.map((attr, idx) => (
               <div key={idx} className="flex justify-between py-2.5 border-b border-gray-100 text-sm hover:bg-gray-50 px-2 transition-colors">
                 <span className="font-bold text-[#333] flex items-center gap-2">
                    {attr.icon && <attr.icon size={14} className="text-gray-400"/>}
                    {attr.label}
                 </span>
                 <span className={`${attr.label === 'İlan No' ? 'text-red-600 font-bold' : 'text-[#333]'}`}>
                    {attr.value}
                 </span>
               </div>
             ))}
             <div className="flex justify-between py-2.5 border-b border-gray-100 text-sm px-2">
                <span className="font-bold text-[#333] flex items-center gap-2"><Eye size={14} className="text-gray-400"/> Görüntülenme</span>
                <span>1.245</span>
             </div>
          </div>
        </div>

        {/* SAĞ KOLON: Satıcı Bilgisi */}
        <div className="lg:w-[280px] shrink-0 hidden md:block">
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
           <div className="mt-4 bg-yellow-50 p-4 border border-yellow-200 rounded-sm text-xs text-yellow-800">
              <strong>Güvenlik İpucu:</strong> Tanımadığınız kişilere kesinlikle para göndermeyin, kapora yatırmayın.
           </div>
        </div>
      </div>

      <MobileAdActionBar price={`${formattedPrice} ${ad.currency}`} />
    </div>
  );
}