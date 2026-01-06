
"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ads, urgentAds, interestingAds } from '@/lib/data';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/context/FavoritesContext';
import { useCompare } from '@/context/CompareContext';
import AdSkeleton from '@/components/AdSkeleton';

export default function Showcase() {
  const [activeTab, setActiveTab] = useState<'vitrin' | 'acil' | 'ilginç'>('vitrin');
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInCompare, addToCompare, removeFromCompare } = useCompare();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const getActiveAds = () => {
    switch (activeTab) {
      case 'acil': return urgentAds;
      case 'ilginç': return interestingAds;
      default: return ads;
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(id);
  };

  const handleCompareChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    e.stopPropagation(); // Linke gitmeyi engelle
    if (e.target.checked) {
      addToCompare(id);
    } else {
      removeFromCompare(id);
    }
  };

  return (
    <div className="flex-1 min-w-0">
      {/* SEKMELER */}
      <div className="flex items-end border-b border-gray-200 mb-4 overflow-x-auto">
        <button
          onClick={() => setActiveTab('vitrin')}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'vitrin' ? 'border-[#ffe800] text-[#333]' : 'border-transparent text-gray-500 hover:text-[#333]'}`}
        >
          Vitrindeki İlanlar
        </button>
        <button
          onClick={() => setActiveTab('acil')}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'acil' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-red-600'}`}
        >
          Acil Acil
        </button>
        <button
          onClick={() => setActiveTab('ilginç')}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'ilginç' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-blue-600'}`}
        >
          Sizin İçin Seçtiklerimiz
        </button>
      </div>

      {/* İLAN GRİDİ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {loading ? (
          Array.from({ length: 10 }).map((_, i) => <AdSkeleton key={i} />)
        ) : (
          getActiveAds().map((ad) => (
            <div key={ad.id} className="block group relative">
              <Link href={`/ilan/${ad.id}`} className="block h-full">
                <div className="bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-md transition-all cursor-pointer h-full flex flex-col relative">

                  {/* Favori Butonu */}
                  <button
                    onClick={(e) => handleFavoriteClick(e, ad.id)}
                    className="absolute top-2 right-2 z-20 bg-white/80 p-1.5 rounded-full hover:bg-white transition-colors"
                  >
                    <Heart
                      size={16}
                      className={isFavorite(ad.id) ? 'fill-red-600 text-red-600' : 'text-gray-500'}
                    />
                  </button>

                  {/* Karşılaştırma Checkbox */}
                  <div
                    className="absolute top-2 left-2 z-20"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={isInCompare(ad.id)}
                      onChange={(e) => handleCompareChange(e, ad.id)}
                      className="w-4 h-4 cursor-pointer accent-blue-600 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 checked:opacity-100"
                      title="Karşılaştır"
                    />
                  </div>

                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <img
                      src={ad.image}
                      alt={ad.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-2 space-y-1 flex-1 flex flex-col justify-between">
                    <p className="text-[12px] text-[#333] font-semibold leading-tight group-hover:underline line-clamp-2 h-[2.4em] overflow-hidden">
                      {ad.title}
                    </p>
                    <div className="pt-2">
                       <p className={`text-[13px] font-bold ${activeTab === 'acil' ? 'text-red-600' : 'text-blue-900'}`}>
                         {ad.price} {ad.currency}
                       </p>
                       <p className="text-[10px] text-gray-500 truncate">{ad.location ? ad.location.split('/')[0] : 'Şehir Yok'}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
