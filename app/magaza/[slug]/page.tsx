import React from 'react';
import { notFound } from 'next/navigation';
import { getStoreBySlugServer, getStoreAdsServer } from '@/lib/actions';
import { MapPin, Phone, Globe, Search, Filter, Mail, Calendar } from 'lucide-react';
import AdCard from '@/components/AdCard';
import Tabs from '@/components/AdDetail/Tabs';

export default async function StorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getStoreBySlugServer(slug);

  if (!store) return notFound();

  const storeAds = await getStoreAdsServer(store.user_id);

  // Tab İçerikleri
  const tabItems = [
    {
      id: 'ilanlar',
      label: `İlanlar (${storeAds.length})`,
      content: (
        <div className="flex gap-6">
            {/* Mağaza İçi Filtreleme Sidebar */}
            <div className="w-[200px] shrink-0 hidden md:block space-y-4">
                <div className="bg-gray-50 border border-gray-200 p-3 rounded-sm">
                    <h4 className="font-bold text-xs text-gray-600 mb-2 flex items-center gap-1"><Search size={12}/> Mağazada Ara</h4>
                    <input className="w-full border text-xs p-1.5 rounded-sm outline-none" placeholder="Kelime ile ara..." />
                </div>
                <div className="bg-gray-50 border border-gray-200 p-3 rounded-sm">
                    <h4 className="font-bold text-xs text-gray-600 mb-2 flex items-center gap-1"><Filter size={12}/> Fiyat Aralığı</h4>
                    <div className="flex gap-1 mb-2">
                        <input className="w-full border text-xs p-1 rounded-sm" placeholder="Min" />
                        <input className="w-full border text-xs p-1 rounded-sm" placeholder="Max" />
                    </div>
                    <button className="w-full bg-blue-600 text-white text-xs font-bold py-1 rounded-sm">Ara</button>
                </div>
            </div>

            {/* İlan Grid */}
            <div className="flex-1">
                {storeAds.length === 0 ? <p>İlan bulunamadı.</p> : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {storeAds.map((ad: any) => (
                            <div key={ad.id} className="h-[260px]">
                                <AdCard ad={ad} viewMode="grid" />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      )
    },
    {
      id: 'hakkimizda',
      label: 'Hakkımızda',
      content: (
        <div className="max-w-3xl">
            <h3 className="font-bold text-lg mb-4">Hakkımızda</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{store.description || 'Mağaza açıklaması girilmemiş.'}</p>
            <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 border rounded-sm">
                    <span className="block text-xs text-gray-500 font-bold uppercase">Yetkili Kişi</span>
                    <span className="text-sm font-bold">{store.name}</span>
                </div>
                <div className="bg-gray-50 p-4 border rounded-sm">
                    <span className="block text-xs text-gray-500 font-bold uppercase">Üyelik Tarihi</span>
                    <span className="text-sm font-bold">{new Date(store.created_at).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
      )
    }
  ];

  return (
    <div className="bg-[#f6f7f9] min-h-screen pb-10">
      {/* Banner */}
      <div className="h-[200px] w-full bg-gray-300 relative overflow-hidden group">
        <img src={store.banner || 'https://via.placeholder.com/1200x300'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      <div className="container max-w-[1150px] mx-auto px-4 -mt-16 relative z-10">

        {/* Mağaza Kartı */}
        <div className="bg-white border rounded-sm shadow-sm p-6 flex flex-col md:flex-row gap-6 mb-6">
          <div className="w-32 h-32 bg-white p-1 rounded-sm border shrink-0 shadow-md relative -top-10 md:top-0">
            <img src={store.image || 'https://via.placeholder.com/150'} className="w-full h-full object-contain"/>
          </div>

          <div className="flex-1 -mt-10 md:mt-0">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-[#333] mb-1">{store.name}</h1>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-bold mb-4">Kurumsal Mağaza</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-sm text-sm font-bold hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Mail size={16}/> Mesaj Gönder
                </button>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                    <MapPin size={16} className="text-blue-600"/> <span>{store.location || 'Konum Yok'}</span>
                </div>
                {store.phone && (
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                        <Phone size={16} className="text-green-600"/> <span className="font-bold text-[#333]">{store.phone}</span>
                    </div>
                )}
                {store.website && (
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                        <Globe size={16} className="text-purple-600"/> <a href={'https://' + store.website} target="_blank" className="hover:text-blue-600 hover:underline">{store.website}</a>
                    </div>
                )}
            </div>
          </div>
        </div>

        {/* İçerik */}
        <Tabs items={tabItems} />

      </div>
    </div>
  );
}