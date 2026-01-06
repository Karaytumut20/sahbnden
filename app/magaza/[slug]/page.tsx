
import React from 'react';
import Link from 'next/link';
import { MapPin, Phone, Globe, Star } from 'lucide-react';
import { ads } from '@/lib/data';

// Demo Mağaza Verisi
const storeData = {
  name: "Güven Emlak & Gayrimenkul",
  slug: "guven-emlak",
  type: "Kurumsal Üyelik",
  logo: "https://ui-avatars.com/api/?name=Guven+Emlak&background=2d405a&color=fff&size=128&font-size=0.4",
  banner: "https://picsum.photos/seed/storebanner/1200/300",
  phone: "+90 212 555 00 00",
  location: "Kadıköy / İstanbul",
  website: "www.guvenemlak.com",
  description: "1998'den beri Kadıköy bölgesinde güvenilir emlak hizmeti sunuyoruz. Satılık, kiralık daire ve iş yeri portföyümüzle hizmetinizdeyiz.",
  stats: {
    totalAds: 45,
    years: 25,
    rating: 9.8
  }
};

export default async function StorePage({ params }: { params: Promise<{ slug: string }> }) {
  // Gerçek projede params.slug ile veritabanından mağaza çekilir
  // Biz demo veriyi kullanacağız
  const { slug } = await params;

  return (
    <div className="bg-[#f6f7f9] min-h-screen">
      {/* Banner */}
      <div className="h-[150px] md:h-[200px] w-full bg-gray-300 relative overflow-hidden">
        <img src={storeData.banner} alt={storeData.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      <div className="container max-w-[1150px] mx-auto px-4 -mt-16 relative z-10">

        {/* Mağaza Kartı */}
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6 flex flex-col md:flex-row gap-6 mb-6">
          <div className="w-32 h-32 bg-white p-1 rounded-sm border border-gray-200 shrink-0 mx-auto md:mx-0">
            <img src={storeData.logo} alt="Logo" className="w-full h-full object-contain" />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-2xl font-bold text-[#333] mb-1">{storeData.name}</h1>
            <p className="text-blue-900 text-sm font-semibold mb-4">{storeData.type}</p>

            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <MapPin size={16} /> {storeData.location}
              </div>
              <div className="flex items-center gap-1">
                <Phone size={16} /> {storeData.phone}
              </div>
              <div className="flex items-center gap-1">
                <Globe size={16} /> {storeData.website}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 justify-center min-w-[200px]">
             <div className="bg-green-50 border border-green-200 p-3 rounded-sm flex items-center justify-between">
                <span className="text-sm font-bold text-green-800">Mağaza Puanı</span>
                <span className="flex items-center gap-1 font-bold text-green-700 bg-white px-2 py-0.5 rounded-full border border-green-200">
                   <Star size={12} fill="currentColor" /> {storeData.stats.rating}
                </span>
             </div>
             <div className="text-center text-xs text-gray-500">
               {storeData.stats.years} Yıllık Üye
             </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sol: Hakkımızda */}
          <div className="w-full md:w-[280px] shrink-0">
            <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-4 mb-4">
              <h3 className="font-bold text-[#333] border-b border-gray-100 pb-2 mb-3">Hakkımızda</h3>
              <p className="text-[13px] text-gray-600 leading-relaxed">
                {storeData.description}
              </p>
            </div>

            <div className="bg-blue-900 text-white p-4 rounded-sm shadow-sm text-center">
              <p className="font-bold text-lg mb-1">İlan Verin</p>
              <p className="text-xs text-blue-200 mb-3">Bu mağazada ilan yayınlamak ister misiniz?</p>
              <button className="bg-[#ffe800] text-black w-full py-2 font-bold text-sm rounded-sm hover:bg-yellow-400 transition-colors">
                İletişime Geç
              </button>
            </div>
          </div>

          {/* Sağ: Mağaza İlanları */}
          <div className="flex-1">
            <h2 className="font-bold text-[#333] text-lg mb-4 border-b-2 border-[#ffe800] inline-block pb-1">Mağaza İlanları ({ads.length})</h2>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {ads.slice(0, 9).map((ad) => (
                <Link href={`/ilan/${ad.id}`} key={ad.id} className="block group">
                  <div className="bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-md transition-all cursor-pointer h-full flex flex-col">
                    <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                      <img
                        src={ad.image}
                        alt={ad.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] py-1 px-2 text-center">
                        {storeData.name}
                      </div>
                    </div>
                    <div className="p-2 space-y-1 flex-1 flex flex-col justify-between">
                      <p className="text-[12px] text-[#333] font-semibold leading-tight group-hover:underline line-clamp-2">
                        {ad.title}
                      </p>
                      <div className="pt-2">
                        <p className="text-[14px] font-bold text-blue-900">{ad.price} {ad.currency}</p>
                        <p className="text-[10px] text-gray-500">{ad.location}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
