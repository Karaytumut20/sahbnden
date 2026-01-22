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
import LiveVisitorCount from '@/components/LiveVisitorCount';
import Badge from '@/components/ui/Badge';
import { Eye, MapPin, Heart, Calendar } from 'lucide-react';

export default async function AdDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ad = await getAdDetailServer(Number(id));
  if (!ad) return notFound();

  const favCount = await getAdFavoriteCount(Number(id));
  const formattedPrice = ad.price?.toLocaleString('tr-TR');
  const location = `${ad.city || ''} / ${ad.district || ''}`;
  const sellerInfo = ad.profiles || { full_name: 'Bilinmiyor', phone: '', email: '' };

  return (
    <div className="pb-20 relative font-sans bg-gray-50 min-h-screen">
      <ViewTracker adId={ad.id} />
      <StickyAdHeader title={ad.title} price={formattedPrice} currency={ad.currency} />

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <Breadcrumb path={`${ad.category === 'emlak' ? 'Emlak' : 'Vasıta'} > ${location} > İlan Detayı`} />

        {/* BAŞLIK VE ETİKETLER */}
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

        {/* 12-COLUMN GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* SOL: GALERİ VE DETAYLAR (8/12) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-1">
               <Gallery mainImage={ad.image || 'https://via.placeholder.com/800x600?text=Resim+Yok'} />
            </div>

            {/* Hızlı Bilgi Şeridi */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex justify-between items-center">
               <div>
                 <p className="text-sm text-slate-500 mb-1">Fiyat</p>
                 <p className="text-3xl font-extrabold text-indigo-700">{formattedPrice} <span className="text-xl text-slate-400 font-normal">{ad.currency}</span></p>
               </div>
               <div className="hidden md:block">
                 <AdActionButtons id={ad.id} title={ad.title} image={ad.image} sellerName={sellerInfo.full_name} />
               </div>
            </div>

            {/* Sekmeler ve İçerik */}
            <Tabs items={[
               { id: 'desc', label: 'İlan Açıklaması', content: <div className="text-slate-700 leading-relaxed whitespace-pre-wrap text-base p-2">{ad.description}</div> },
               { id: 'features', label: 'Özellikler', content: <FeaturesTab ad={ad} /> },
               { id: 'location', label: 'Konum', content: <LocationTab city={ad.city} district={ad.district} /> }
            ]} />
          </div>

          {/* SAĞ: SATICI VE ÖZET (4/12) */}
          <div className="lg:col-span-4 space-y-6">
             <SellerSidebar sellerId={ad.user_id} sellerName={sellerInfo.full_name || 'Kullanıcı'} sellerPhone={sellerInfo.phone || 'Telefon yok'} adId={ad.id} adTitle={ad.title} adImage={ad.image} price={formattedPrice} currency={ad.currency} />

             {/* İlan Künyesi */}
             <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider">İlan Künyesi</h3>
                <ul className="space-y-3 text-sm">
                   <li className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="text-slate-500">İlan Tarihi</span>
                      <span className="font-medium text-slate-900">{new Date(ad.created_at).toLocaleDateString()}</span>
                   </li>
                   {ad.m2 && <li className="flex justify-between border-b border-gray-50 pb-2"><span className="text-slate-500">m² (Brüt)</span><span className="font-medium text-slate-900">{ad.m2}</span></li>}
                   {ad.room && <li className="flex justify-between border-b border-gray-50 pb-2"><span className="text-slate-500">Oda Sayısı</span><span className="font-medium text-slate-900">{ad.room}</span></li>}
                   {ad.km && <li className="flex justify-between border-b border-gray-50 pb-2"><span className="text-slate-500">Kilometre</span><span className="font-medium text-slate-900">{ad.km}</span></li>}
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
      <MobileAdActionBar price={`${formattedPrice} ${ad.currency}`} />
    </div>
  );
}