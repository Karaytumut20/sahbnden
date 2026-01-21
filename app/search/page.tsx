import React from 'react';
import { getAdsServer } from '@/lib/actions';
import FilterSidebar from '@/components/FilterSidebar';
import MapView from '@/components/MapView';
import SearchHeader from '@/components/SearchHeader';
import AdCard from '@/components/AdCard';
import ViewToggle from '@/components/ViewToggle';

export default async function SearchPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; category?: string; minPrice?: string; maxPrice?: string; city?: string; sort?: string; view?: string }>
}) {
  const params = await searchParams;
  const ads = await getAdsServer(params);
  const viewMode = (params.view || 'table') as 'grid' | 'list' | 'table' | 'map';

  return (
    <div className="flex gap-4 pt-4">
      {/* Sol Sidebar (Filtreler) */}
      <div className="w-[240px] shrink-0 hidden md:block">
        <FilterSidebar />
      </div>

      {/* Ana İçerik */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-end mb-3 pb-2 border-b border-gray-200">
            <SearchHeader total={ads.length} query={params.q} currentSort={params.sort} currentView={viewMode} />
            <div className="ml-4">
                <ViewToggle currentView={viewMode} />
            </div>
        </div>

        {/* Görünüm Modları */}
        {viewMode === 'map' ? (
          <MapView ads={ads} />
        ) : (
          <>
            {viewMode === 'table' ? (
              <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-[11px] text-gray-500 font-semibold uppercase">
                      <th className="p-3">Görsel</th>
                      <th className="p-3">İlan Başlığı</th>
                      <th className="p-3">Fiyat</th>
                      <th className="p-3">İlan Tarihi</th>
                      <th className="p-3">İl / İlçe</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ads.map((ad: any) => <AdCard key={ad.id} ad={ad} viewMode="table" />)}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
                {ads.map((ad: any) => <AdCard key={ad.id} ad={ad} viewMode={viewMode} />)}
              </div>
            )}

            {ads.length === 0 && (
              <div className="bg-white p-12 text-center border border-gray-200 rounded-sm">
                <p className="text-gray-500 text-lg">Aradığınız kriterlere uygun ilan bulunamadı.</p>
                <p className="text-sm text-gray-400 mt-2">Filtreleri değiştirerek tekrar deneyebilirsiniz.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}