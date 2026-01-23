"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Heart, Eye, Zap } from 'lucide-react';
import { formatPrice, formatDate, cn } from '@/lib/utils';
import { useFavorites } from '@/context/FavoritesContext';
import { useModal } from '@/context/ModalContext';

type AdCardProps = {
  ad: any;
  viewMode?: 'grid' | 'list' | 'table';
};

export default function AdCard({ ad, viewMode = 'grid' }: AdCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { openModal } = useModal();

  // ID'nin number olduğundan emin olalım
  const adId = Number(ad.id);
  const liked = isFavorite(adId);

  const priceDisplay = formatPrice(ad.price, ad.currency);
  const location = `${ad.city || ''} / ${ad.district || ''}`;
  const imageUrl = ad.image || 'https://via.placeholder.com/600x400?text=No+Image';

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openModal('QUICK_VIEW', { ad });
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation(); // Link'e gitmesini engelle
    toggleFavorite(adId);
  };

  // LIST VIEW (Yatay)
  if (viewMode === 'list') {
    return (
      <Link href={`/ilan/${adId}`} className="group block bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-4 p-3">
          <div className="relative w-full sm:w-48 aspect-[4/3] rounded-lg overflow-hidden shrink-0">
            <Image src={imageUrl} alt={ad.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
            {ad.is_vitrin && <span className="absolute top-2 left-2 bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">VİTRİN</span>}
          </div>
          <div className="flex-1 py-1 pr-2 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors line-clamp-1">{ad.title}</h3>
                <button
                  onClick={handleFavoriteClick}
                  className="p-1 rounded-full hover:bg-red-50 transition-colors group/heart"
                >
                  <Heart size={18} className={liked ? "fill-red-500 text-red-500" : "text-gray-400 group-hover/heart:text-red-500"} />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1"><MapPin size={12}/> {location}</p>
            </div>
            <div className="flex justify-between items-end mt-4">
              <span className="text-lg font-bold text-indigo-700">{priceDisplay}</span>
              <span className="text-xs text-gray-400">{formatDate(ad.created_at)}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // GRID VIEW (Dikey - Premium)
  return (
    <Link href={`/ilan/${adId}`} className="group block h-full">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col relative overflow-hidden">

        {/* Görsel Alanı */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
          <Image
            src={imageUrl}
            alt={ad.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />

          {/* Badge'ler */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {ad.is_urgent && <span className="bg-rose-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-lg border border-rose-400/50 flex items-center gap-1"><Zap size={10} fill="currentColor"/> ACİL</span>}
            {ad.is_vitrin && <span className="bg-yellow-400 text-black text-[10px] font-bold px-2.5 py-1 rounded-md shadow-lg border border-yellow-300/50">VİTRİN</span>}
          </div>

          {/* Hover Actions Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
            <button
              onClick={handleQuickView}
              className="bg-white text-gray-800 p-2.5 rounded-full shadow-lg hover:scale-110 hover:text-indigo-600 transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75"
              title="Hızlı Bakış"
            >
              <Eye size={18} />
            </button>
            <button
              onClick={handleFavoriteClick}
              className="bg-white text-gray-800 p-2.5 rounded-full shadow-lg hover:scale-110 hover:text-red-500 transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-100"
              title={liked ? "Favorilerden Kaldır" : "Favoriye Ekle"}
            >
              <Heart size={18} className={liked ? "fill-red-500 text-red-500" : ""} />
            </button>
          </div>
        </div>

        {/* İçerik Alanı */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="mb-2">
            <h3 className="font-bold text-gray-800 text-sm leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
              {ad.title}
            </h3>
          </div>

          <div className="mt-auto pt-3 border-t border-gray-50">
            <div className="text-lg font-bold text-indigo-700 tracking-tight">{priceDisplay}</div>
            <div className="flex justify-between items-center mt-1">
              <span className="text-[11px] text-gray-500 truncate max-w-[60%] flex items-center gap-1">
                <MapPin size={10} className="shrink-0"/> {ad.district}
              </span>
              <span className="text-[10px] text-gray-400 font-medium">{formatDate(ad.created_at)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}