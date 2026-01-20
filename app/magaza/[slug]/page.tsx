
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MapPin, Phone, Globe, Star } from 'lucide-react';
import { getStoreBySlug, getStoreAds } from '@/lib/services';

export default async function StorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  // Mağaza bilgisini veritabanından çek
  const store = await getStoreBySlug(slug);

  if (!store) return notFound();

  // Mağazanın ilanlarını çek
  const storeAds = await getStoreAds(store.user_id);

  return (
    <div className="bg-[#f6f7f9] min-h-screen">
      {/* Banner */}
      <div className="h-[150px] md:h-[200px] w-full bg-gray-300 relative overflow-hidden">
        <img src={store.banner || 'https://picsum.photos/seed/storebanner/1200/300'} alt={store.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      <div className="container max-w-[1150px] mx-auto px-4 -mt-16 relative z-10">

        {/* Mağaza Kartı */}
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6 flex flex-col md:flex-row gap-6 mb-6">
          <div className="w-32 h-32 bg-white p-1 rounded-sm border border-gray-200 shrink-0 mx-auto md:mx-0">
            <img src={store.image || 'https://ui-avatars.com/api/?name=' + store.name} alt="Logo" className="w-full h-full object-contain" />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold text-[#333] mb-1">{store.name}</h1>
            <p className="text-blue-900 text-sm font-semibold mb-4">Kurumsal Üye</p>

            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin size={16} /> {store.location || 'Konum Yok'}
              </div>
              <div className="flex items-center gap-1">
                <Phone size={16} /> {store.phone || '-'}
              </div>
              {store.website && (
                <div className="flex items-center gap-1">
                  <Globe size={16} /> {store.website}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 justify-center min-w-[200px]">
             <div className="bg-green-50 border border-green-200 p-3 rounded-sm flex items-center justify-between">
                <span className="text-sm font-bold text-green-800">Mağaza Puanı</span>
                <span className="flex items-center gap-1 font-bold text-green-700 bg-white px-2 py-0.5 rounded-full border border-green-200">
                   <Star size={12} fill="currentColor" /> 9.8
                </span>
             </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sol: Hakkımızda */}
          <div className="w-full md:w-[280px] shrink-0">
            <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-4 mb-4">
              <h3 className="font-bold text-[#333] border-b border-gray-100 pb-2 mb-3">Hakkımızda</h3>
              <p className="text-[13px] text-gray-600 leading-relaxed">
                {store.description || 'Mağaza açıklaması girilmemiş.'}
              </p>
            </div>
          </div>

          {/* Sağ: Mağaza İlanları */}
          <div className="flex-1">
            <h2 className="font-bold text-[#333] text-lg mb-4 border-b-2 border-[#ffe800] inline-block pb-1">Mağaza İlanları ({storeAds.length})</h2>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {storeAds.map((ad: any) => (
                <Link href={`/ilan/${ad.id}`} key={ad.id} className="block group">
                  <div className="bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-md transition-all cursor-pointer h-full flex flex-col">
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                      <img
                        src={ad.image || 'https://via.placeholder.com/300x200'}
                        alt={ad.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-2 space-y-1 flex-1 flex flex-col justify-between">
                      <p className="text-[12px] text-[#333] font-semibold leading-tight group-hover:underline line-clamp-2">
                        {ad.title}
                      </p>
                      <div className="pt-2">
                        <p className="text-[14px] font-bold text-blue-900">{ad.price.toLocaleString()} {ad.currency}</p>
                        <p className="text-[10px] text-gray-500">{ad.city} / {ad.district}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              {storeAds.length === 0 && <div className="p-4 text-gray-500 text-sm">Bu mağazanın aktif ilanı yok.</div>}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
