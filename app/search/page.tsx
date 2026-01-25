import React from 'react';
import { getAdsServer } from '@/lib/actions';
import AdCard from '@/components/AdCard';
import FilterSidebar from '@/components/FilterSidebar';
import Pagination from '@/components/Pagination';
import ViewToggle from '@/components/ViewToggle';
import SmartCategoryGrid from '@/components/SmartCategoryGrid'; // YENİ
import { SearchX, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function SearchPage(props: { searchParams: Promise<any> }) {
  const searchParams = await props.searchParams;

  // --- KARAR MEKANİZMASI (DECISION ENGINE) ---
  // 1. Kullanıcı "Sonuçları Göster"e bastı mı? (Manual trigger)
  const manualSearch = searchParams.showResults === 'true';

  // 2. Bir arama kelimesi var mı? (Direkt arama)
  const textSearch = !!searchParams.q;

  // 3. Kullanıcı "Model" seviyesine kadar indi mi? (Otomobil için)
  const isDeepLevelCar = !!searchParams.model;

  // 4. İlanları Çekmeli miyiz?
  // Evet eğer: Manuel arama yapıldıysa VEYA kelime arandıysa VEYA en alt detaya inildiyse.
  const shouldFetchAds = manualSearch || textSearch || isDeepLevelCar;

  let ads = [];
  let totalPages = 0;
  let count = 0;

  if (shouldFetchAds) {
    // Sadece gerekli olduğunda DB'ye git
    const res = await getAdsServer(searchParams);
    ads = res.data;
    totalPages = res.totalPages;
    count = res.count;
  }

  const viewMode = (searchParams.view as 'grid' | 'list' | 'table') || 'list';

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Sidebar */}
        <aside className="hidden lg:block lg:col-span-3">
          <FilterSidebar />
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-9 min-w-0">

           {/* Eğer henüz ilanları çekmiyorsak, Kategori/Marka/Model Gridini Göster */}
           {!shouldFetchAds && (
             <SmartCategoryGrid searchParams={searchParams} />
           )}

           {/* İlan Listesi (Sadece shouldFetchAds true ise) */}
           {shouldFetchAds ? (
             <>
               <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex justify-between items-center animate-in fade-in">
                  <div>
                     <h1 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                        Arama Sonuçları
                        {searchParams.brand && <span className="text-indigo-600">/ {searchParams.brand}</span>}
                        {searchParams.series && <span className="text-indigo-600">/ {searchParams.series}</span>}
                     </h1>
                     <p className="text-sm text-slate-500">{count} ilan bulundu</p>
                  </div>
                  <ViewToggle currentView={viewMode} />
               </div>

               {(!ads || ads.length === 0) ? (
                 <div className="bg-white p-16 rounded-xl border border-gray-100 text-center">
                   <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <SearchX size={40} className="text-slate-400"/>
                   </div>
                   <h3 className="text-xl font-bold text-slate-800 mb-2">Sonuç Bulunamadı</h3>
                   <p className="text-slate-500 max-w-md mx-auto">Aradığınız kriterlere uygun ilan maalesef mevcut değil. Filtreleri temizleyerek veya bir üst kategoriye dönerek tekrar deneyebilirsiniz.</p>
                   <Link href="/search" className="mt-6 inline-flex items-center gap-2 text-indigo-600 font-bold hover:underline">
                        <ArrowLeft size={16}/> Tüm Kategorilere Dön
                   </Link>
                 </div>
               ) : (
                 <div className={viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-4'}>
                   {ads.map((ad: any) => <AdCard key={ad.id} ad={ad} viewMode={viewMode} />)}
                 </div>
               )}

               <div className="mt-10"><Pagination totalPages={totalPages} currentPage={Number(searchParams.page) || 1} /></div>
             </>
           ) : (
             // Grid gösteriliyorsa ama henüz seçim bitmediyse ve grid null döndüyse (nadir durum)
             <div className="text-center text-gray-400 text-sm mt-4">
                {/* Genelde SmartCategoryGrid doludur, burası boş kalmaz */}
             </div>
           )}
        </main>
      </div>
    </div>
  );
}