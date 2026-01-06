
import React from 'react';
import Link from 'next/link';
import { searchAds } from '@/lib/data';
import FilterSidebar from '@/components/FilterSidebar';
import MapView from '@/components/MapView';
import SearchHeader from '@/components/SearchHeader';
import Pagination from '@/components/Pagination';
import { MapPin } from 'lucide-react';

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; category?: string; minPrice?: string; maxPrice?: string; city?: string; sort?: string; view?: string; page?: string }>
}) {
  const params = await searchParams;
  // Yeni arama fonksiyonu artık { data, meta } dönüyor
  const result = searchAds(params);
  const ads = result.data;
  const meta = result.meta;

  const viewMode = params.view || 'list';

  return (
    <div className="flex gap-4 pt-4">

      {/* SOL FİLTRE */}
      <div className="w-[240px] shrink-0 hidden md:block">
        <FilterSidebar />
      </div>

      {/* SAĞ İÇERİK */}
      <div className="flex-1 min-w-0">

        <SearchHeader total={meta.total} query={params.q} currentSort={params.sort} currentView={viewMode} />

        {/* İÇERİK */}
        {viewMode === 'map' ? (
          <MapView ads={ads} />
        ) : (
          <>
            <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-[11px] text-gray-500 font-semibold">
                    <th className="p-3 w-[120px]">Görsel</th>
                    <th className="p-3">İlan Başlığı</th>
                    <th className="p-3 w-[120px]">Fiyat</th>
                    <th className="p-3 w-[100px]">Tarih</th>
                    <th className="p-3 w-[120px]">İl / İlçe</th>
                  </tr>
                </thead>
                <tbody>
                  {ads.map((ad) => (
                    <tr key={ad.id} className="border-b border-gray-100 hover:bg-[#fff9e1] transition-colors group">
                      <td className="p-2">
                        <Link href={`/ilan/${ad.id}`}>
                          <div className="w-[100px] h-[75px] relative overflow-hidden border border-gray-200">
                            <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
                          </div>
                        </Link>
                      </td>
                      <td className="p-3 align-middle">
                        <Link href={`/ilan/${ad.id}`} className="block h-full">
                          <span className="text-[#333] font-bold text-[13px] group-hover:underline block mb-1 line-clamp-1">
                            {ad.title}
                          </span>
                          <span className="text-gray-400 text-[11px]">#{ad.id}</span>
                        </Link>
                      </td>
                      <td className="p-3 align-middle text-blue-900 font-bold text-[13px]">
                        {ad.price} {ad.currency}
                      </td>
                      <td className="p-3 align-middle text-[#333] text-[12px]">
                        {ad.date}
                      </td>
                      <td className="p-3 align-middle text-[#333] text-[12px]">
                        <div className="flex items-center gap-1">
                          <MapPin size={12} className="text-gray-400" />
                          {ad.city} / {ad.district}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {ads.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-12 text-center text-gray-500">
                        <p className="text-lg mb-2">Sonuç Bulunamadı</p>
                        <p className="text-sm">Filtrelerinizi değiştirerek tekrar deneyebilirsiniz.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Bileşeni */}
            {meta.total > 0 && (
              <Pagination currentPage={meta.page} totalPages={meta.totalPages} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
