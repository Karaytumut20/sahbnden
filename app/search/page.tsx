import React from 'react';
import { getAdsServer } from '@/lib/actions';
import AdCard from '@/components/AdCard';
import FilterSidebar from '@/components/FilterSidebar';
import Pagination from '@/components/Pagination';
import ViewToggle from '@/components/ViewToggle';
import { SearchX } from 'lucide-react';

export default async function SearchPage(props: { searchParams: Promise<any> }) {
  const searchParams = await props.searchParams;
  const { data: ads, totalPages, count } = await getAdsServer(searchParams);
  const viewMode = (searchParams.view as 'grid' | 'list' | 'table') || 'list';

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Sidebar (3/12) */}
        <aside className="hidden lg:block lg:col-span-3">
          <FilterSidebar />
        </aside>

        {/* Main Content (9/12) */}
        <main className="lg:col-span-9 min-w-0">
           <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex justify-between items-center">
              <div>
                 <h1 className="font-bold text-slate-800 text-lg">Arama Sonuçları</h1>
                 <p className="text-sm text-slate-500">{count} ilan bulundu</p>
              </div>
              <ViewToggle currentView={viewMode} />
           </div>

           {(!ads || ads.length === 0) ? (
             <div className="bg-white p-12 rounded-xl border border-gray-100 text-center">
               <SearchX size={48} className="mx-auto text-slate-300 mb-4"/>
               <h3 className="text-lg font-bold text-slate-800">Sonuç Bulunamadı</h3>
               <p className="text-slate-500">Filtreleri değiştirmeyi deneyin.</p>
             </div>
           ) : (
             <div className={viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-4'}>
               {ads.map((ad: any) => <AdCard key={ad.id} ad={ad} viewMode={viewMode} />)}
             </div>
           )}

           <div className="mt-10"><Pagination totalPages={totalPages} currentPage={Number(searchParams.page) || 1} /></div>
        </main>
      </div>
    </div>
  );
}
