import React from 'react';
import { getAdsServer } from '@/lib/actions';
import AdCard from '@/components/AdCard';
import FilterSidebar from '@/components/FilterSidebar';
import Pagination from '@/components/Pagination';
import ViewToggle from '@/components/ViewToggle';
import { SearchX } from 'lucide-react';

// Next.js 15+ için searchParams Promise olabilir
export default async function SearchPage(props: { searchParams: Promise<any> }) {
  const searchParams = await props.searchParams;

  // DÜZELTME: Veriyi 'data' olarak çekiyoruz (Destructuring)
  const { data: ads, totalPages, count } = await getAdsServer(searchParams);

  const viewMode = (searchParams.view as 'grid' | 'list' | 'table') || 'list';

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50/50 min-h-screen">
      <div className="flex flex-col lg:flex-row gap-8">

        {/* Sidebar */}
        <aside className="w-full lg:w-[280px] shrink-0 space-y-6">
          <FilterSidebar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
           {/* Header */}
           <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 transition-all hover:shadow-md">
              <div>
                 <h1 className="font-bold text-gray-900 text-xl tracking-tight">Arama Sonuçları</h1>
                 <p className="text-sm text-gray-500 font-medium">{count} ilan bulundu</p>
              </div>
              <div className="flex items-center gap-4">
                 <ViewToggle currentView={viewMode} />
              </div>
           </div>

           {/* Ads Grid/List */}
           {!ads || ads.length === 0 ? (
             <div className="bg-white p-12 rounded-2xl border border-gray-200 text-center flex flex-col items-center justify-center shadow-sm">
               <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-400">
                  <SearchX size={32} />
               </div>
               <h3 className="text-lg font-bold text-gray-900 mb-2">Sonuç Bulunamadı</h3>
               <p className="text-gray-500 max-w-xs mx-auto">Aradığınız kriterlere uygun ilan maalesef mevcut değil. Filtreleri temizleyip tekrar deneyin.</p>
             </div>
           ) : (
             <>
               {viewMode === 'grid' && (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                   {ads.map((ad: any) => <AdCard key={ad.id} ad={ad} viewMode="grid" />)}
                 </div>
               )}
               {viewMode === 'list' && (
                 <div className="space-y-4">
                   {ads.map((ad: any) => <AdCard key={ad.id} ad={ad} viewMode="list" />)}
                 </div>
               )}
               {viewMode === 'table' && (
                 <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                   <table className="w-full text-left">
                     <thead className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        <tr>
                          <th className="p-4">Görsel</th>
                          <th className="p-4">İlan Başlığı</th>
                          <th className="p-4">Fiyat</th>
                          <th className="p-4">Tarih</th>
                          <th className="p-4">Konum</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-gray-100">
                        {ads.map((ad: any) => <AdCard key={ad.id} ad={ad} viewMode="table" />)}
                     </tbody>
                   </table>
                 </div>
               )}
             </>
           )}

           {/* Pagination */}
           <div className="mt-10">
             <Pagination totalPages={totalPages} />
           </div>
        </main>
      </div>
    </div>
  );
}