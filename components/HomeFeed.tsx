"use client";
import React, { useState } from 'react';
import AdCard from '@/components/AdCard';
import { getInfiniteAdsAction } from '@/lib/actions';
import { Loader2, ArrowDown, SearchX, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function HomeFeed({ initialAds }: { initialAds: any[] }) {
  const [ads, setAds] = useState<any[]>(initialAds || []);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await getInfiniteAdsAction(page);
      if (res.data && res.data.length > 0) {
        setAds(prev => [...prev, ...res.data]);
        setPage(prev => prev + 1);
        setHasMore(res.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // EMPTY STATE (HİÇ İLAN YOKSA)
  if (!ads || ads.length === 0) {
      return (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-100 rounded-xl shadow-sm text-center">
              <div className="bg-blue-50 p-6 rounded-full mb-6 animate-in zoom-in duration-300">
                  <SearchX size={48} className="text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Henüz Yayında İlan Yok</h2>
              <p className="text-gray-500 max-w-md mb-8">
                  Şu anda vitrinde gösterilecek aktif bir ilan bulunmamaktadır. İlk ilanı siz vererek binlerce alıcıya ulaşabilirsiniz!
              </p>
              <Link
                  href="/ilan-ver"
                  className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 flex items-center gap-2"
              >
                  <PlusCircle size={20} /> Hemen Ücretsiz İlan Ver
              </Link>
          </div>
      );
  }

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

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
        {ads.map((ad) => (
          <div key={ad.id} className="h-full animate-in fade-in zoom-in-95 duration-500">
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