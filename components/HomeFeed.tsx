"use client";
import React, { useState } from 'react';
import AdCard from '@/components/AdCard';
import { getInfiniteAdsAction } from '@/lib/actions';
import { Loader2, ArrowDown } from 'lucide-react';

export default function HomeFeed({ initialAds }: { initialAds: any[] }) {
  const [ads, setAds] = useState<any[]>(initialAds);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

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
    <div className="space-y-6">
      {/* Vitrin Başlığı */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
          Vitrindeki İlanlar
        </h2>
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{ads.length} İlan</span>
      </div>

      {/* Responsive Grid - UI Ekibi Onaylı */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {ads.map((ad) => (
          <div key={ad.id} className="h-full">
            <AdCard ad={ad} viewMode="grid" />
          </div>
        ))}
      </div>

      {/* Yükle Butonu */}
      {hasMore && (
        <div className="pt-8 text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="group relative inline-flex items-center justify-center px-8 py-3 text-sm font-bold text-indigo-600 transition-all duration-200 bg-white border-2 border-indigo-50 rounded-full hover:bg-indigo-50 hover:border-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin mr-2" size={18}/> : <ArrowDown className="mr-2 group-hover:translate-y-1 transition-transform" size={18}/>}
            {loading ? 'Yükleniyor...' : 'Daha Fazla Göster'}
          </button>
        </div>
      )}
    </div>
  );
}