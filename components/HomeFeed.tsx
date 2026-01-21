"use client";
import React, { useState, useEffect } from 'react';
import AdCard from '@/components/AdCard';
import { getInfiniteAdsAction } from '@/lib/actions';
import { Loader2, ArrowDownCircle } from 'lucide-react';

export default function HomeFeed({ initialAds }: { initialAds: any[] }) {
  const [ads, setAds] = useState<any[]>(initialAds);
  const [page, setPage] = useState(2); // İlk sayfa (20 ürün) zaten yüklendi
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // Client tarafında random hissi vermek için diziyi karıştır
  // Not: Bu sadece sayfa ilk açıldığında veya yeni veri geldiğinde yapılır
  // Ancak pagination ile uyumlu olması için sadece serverdan geleni ekliyoruz.

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    const res = await getInfiniteAdsAction(page);

    if (res.data.length > 0) {
      setAds(prev => [...prev, ...res.data]);
      setPage(prev => prev + 1);
      setHasMore(res.hasMore);
    } else {
      setHasMore(false);
    }

    setLoading(false);
  };

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-3 border-b border-gray-200 mb-4 pb-2">
         <h2 className="text-sm font-bold text-[#333] border-b-2 border-[#ffe800] pb-2 -mb-2.5 px-2">Vitrindeki İlanlar</h2>
         <span className="text-xs text-gray-500 ml-auto">{ads.length} İlan Gösteriliyor</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {ads.map((ad) => (
            <div key={ad.id} className="h-[280px]">
                <AdCard ad={ad} viewMode="grid" />
            </div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-8 text-center">
            <button
                onClick={loadMore}
                disabled={loading}
                className="bg-white border border-gray-300 text-gray-600 px-8 py-3 rounded-full shadow-sm text-sm font-bold hover:bg-gray-50 hover:text-blue-600 transition-all flex items-center gap-2 mx-auto disabled:opacity-70"
            >
                {loading ? <Loader2 className="animate-spin" size={16}/> : <ArrowDownCircle size={18}/>}
                {loading ? 'Yükleniyor...' : 'Daha Fazla İlan Göster'}
            </button>
        </div>
      )}

      {!hasMore && ads.length > 0 && (
         <div className="mt-8 text-center text-xs text-gray-400">Tüm ilanlar görüntülendi.</div>
      )}
    </div>
  );
}