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
import TechnicalSpecsTab from '@/components/AdDetail/TechnicalSpecsTab';
import LoanCalculator from '@/components/tools/LoanCalculator';
import ViewTracker from '@/components/ViewTracker';
import LiveVisitorCount from '@/components/LiveVisitorCount';
import Badge from '@/components/ui/Badge';
import { Eye, MapPin } from 'lucide-react';

export default async function AdDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ad = await getAdDetailServer(Number(id));
  if (!ad) return notFound();

  const formattedPrice = ad.price?.toLocaleString('tr-TR');
  const location = `${ad.city || ''} / ${ad.district || ''}`;
  const sellerInfo = ad.profiles || { full_name: 'Bilinmiyor', phone: '', email: '', show_phone: false };
  const adImages = ad.images && ad.images.length > 0 ? ad.images : (ad.image ? [ad.image] : []);

  // DINAMIK BREADCRUMB OLUŞTURMA
  const breadcrumbItems = [];

  // Ana Kategori
  if (ad.category.includes('otomobil') || ad.category.includes('vasita') || ad.brand) {
      breadcrumbItems.push({ label: 'Vasıta', href: '/search?category=vasita' });
      breadcrumbItems.push({ label: 'Otomobil', href: '/search?category=otomobil' });

      if (ad.brand) {
          breadcrumbItems.push({ label: ad.brand, href: `/search?category=otomobil&brand=${encodeURIComponent(ad.brand)}` });
      }
      if (ad.series) {
          breadcrumbItems.push({
              label: ad.series,
              href: `/search?category=otomobil&brand=${encodeURIComponent(ad.brand)}&series=${encodeURIComponent(ad.series)}`
          });
      }
      if (ad.model) {
          breadcrumbItems.push({
              label: ad.model,
              href: `/search?category=otomobil&brand=${encodeURIComponent(ad.brand)}&series=${encodeURIComponent(ad.series)}&model=${encodeURIComponent(ad.model)}`
          });
      }
  } else if (ad.category.includes('konut') || ad.category.includes('emlak')) {
      breadcrumbItems.push({ label: 'Emlak', href: '/search?category=emlak' });
      if (ad.category.includes('konut')) {
          breadcrumbItems.push({ label: 'Konut', href: '/search?category=konut' });
      }
  }

  // Son olarak İlan Başlığı (Link yok)
  breadcrumbItems.push({ label: 'İlan Detayı' });


  // Tabs Yapılandırması
  const tabItems = [
     { id: 'desc', label: 'İlan Açıklaması', content: <div className="text-slate-700 leading-relaxed whitespace-pre-wrap text-base p-2">{ad.description}</div> },
     { id: 'features', label: 'Özellikler', content: <FeaturesTab ad={ad} /> },
     { id: 'location', label: 'Konum', content: <LocationTab city={ad.city} district={ad.district} /> }
  ];

  if (ad.technical_specs) {
      tabItems.splice(2, 0, { id: 'tech_specs', label: 'Teknik Veriler', content: <TechnicalSpecsTab specs={ad.technical_specs} /> });
  }

  return (
    <div className="pb-20 relative font-sans bg-gray-50 min-h-screen">
      <ViewTracker adId={ad.id} />
      <StickyAdHeader title={ad.title} price={formattedPrice} currency={ad.currency} />

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* YENİ BREADCRUMB */}
        <Breadcrumb items={breadcrumbItems} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-slate-900 font-bold text-2xl md:text-3xl leading-tight mb-2">{ad.title}</h1>
            <div className="flex items-center gap-4 text-sm text-slate-500">
               <span className="flex items-center gap-1"><MapPin size={16}/> {location}</span>
               <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
               <span className="text-indigo-600 font-medium">#{ad.id}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
              {ad.is_urgent && <Badge variant="danger" className="text-sm px-3 py-1">ACİL</Badge>}
              {ad.is_vitrin && <Badge variant="warning" className="text-sm px-3 py-1">VİTRİN</Badge>}
              <LiveVisitorCount adId={ad.id} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-1">
               <Gallery mainImage={ad.image} images={adImages} />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex justify-between items-center">
               <div>
                 <p className="text-sm text-slate-500 mb-1">Fiyat</p>
                 <p className="text-3xl font-extrabold text-indigo-700">{formattedPrice} <span className="text-xl text-slate-400 font-normal">{ad.currency}</span></p>
               </div>
               <div className="hidden md:block">
                 <AdActionButtons id={ad.id} title={ad.title} image={ad.image} sellerName={sellerInfo.full_name} />
               </div>
            </div>

            <Tabs items={tabItems} />
          </div>

          <div className="lg:col-span-4 space-y-6">
             <SellerSidebar
                sellerId={ad.user_id}
                sellerName={sellerInfo.full_name || 'Kullanıcı'}
                sellerPhone={sellerInfo.phone || 'Telefon yok'}
                showPhone={sellerInfo.show_phone}
                adId={ad.id}
                adTitle={ad.title}
                adImage={ad.image}
                price={formattedPrice}
                currency={ad.currency}
             />

             <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider">İlan Künyesi</h3>
                <ul className="space-y-3 text-sm">
                   <li className="flex justify-between border-b border-gray-50 pb-2"><span className="text-slate-500">İlan Tarihi</span><span className="font-medium text-slate-900">{new Date(ad.created_at).toLocaleDateString()}</span></li>
                   {ad.brand && <li className="flex justify-between border-b border-gray-50 pb-2"><span className="text-slate-500">Marka</span><span className="font-medium text-slate-900">{ad.brand}</span></li>}
                   {ad.model && <li className="flex justify-between border-b border-gray-50 pb-2"><span className="text-slate-500">Model</span><span className="font-medium text-slate-900">{ad.model}</span></li>}
                   {ad.year && <li className="flex justify-between border-b border-gray-50 pb-2"><span className="text-slate-500">Yıl</span><span className="font-medium text-slate-900">{ad.year}</span></li>}
                   {ad.km && <li className="flex justify-between border-b border-gray-50 pb-2"><span className="text-slate-500">Kilometre</span><span className="font-medium text-slate-900">{ad.km}</span></li>}
                   {ad.heavy_damage !== null && ad.heavy_damage !== undefined && (
                        <li className="flex justify-between border-b border-gray-50 pb-2">
                            <span className="text-slate-500">Ağır Hasar Kayıtlı</span>
                            <span className={`font-bold ${ad.heavy_damage ? 'text-red-600' : 'text-green-600'}`}>{ad.heavy_damage ? 'Evet' : 'Hayır'}</span>
                        </li>
                   )}
                   <li className="flex justify-between pt-1">
                      <span className="text-slate-500">Görüntülenme</span>
                      <span className="font-medium text-slate-900 flex items-center gap-1"><Eye size={14}/> {ad.view_count || 0}</span>
                   </li>
                </ul>
             </div>

             {ad.category.includes('konut') && <LoanCalculator price={ad.price} />}
          </div>

        </div>
      </div>
      <MobileAdActionBar price={`${formattedPrice} ${ad.currency}`} phone={sellerInfo.show_phone ? sellerInfo.phone : undefined} />
    </div>
  );
}