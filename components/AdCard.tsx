"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Calendar, Heart, Eye } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { Ad } from '@/types';
import { formatPrice, formatDate, cn } from '@/lib/utils';
import { useFavorites } from '@/context/FavoritesContext';
import { useModal } from '@/context/ModalContext';

type AdCardProps = {
  ad: Ad;
  viewMode?: 'grid' | 'list' | 'table';
};

export default function AdCard({ ad, viewMode = 'grid' }: AdCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { openModal } = useModal();
  const liked = isFavorite(ad.id);

  const priceDisplay = formatPrice(ad.price, ad.currency);
  const location = `${ad.city || ''}, ${ad.district || ''}`;
  const dateDisplay = formatDate(ad.created_at);
  const imageUrl = ad.image || 'https://via.placeholder.com/300x200?text=Görsel+Yok';

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    toggleFavorite(ad.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    openModal('QUICK_VIEW', { ad });
  };

  // --- GRID GÖRÜNÜMÜ (ULTRA MODERN) ---
  return (
    <div className="block group h-full relative">
      <Link href={`/ilan/${ad.id}`} className="block h-full">
        {/* Kart Yapısı: Beyaz zemin, yuvarlak köşeler, hover'da yukarı kalkma */}
        <div className="bg-white rounded-3xl shadow-card hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col relative overflow-hidden border border-gray-100">

          {/* Badge'ler (Floating) */}
          <div className="absolute top-4 left-4 flex gap-2 z-10">
             {ad.is_urgent && <span className="bg-rose-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg border border-rose-400">ACİL</span>}
             {ad.is_vitrin && <span className="bg-indigo-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-lg border border-indigo-400">VİTRİN</span>}
          </div>

          {/* Resim Alanı */}
          <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
            <Image
                src={imageUrl}
                alt={ad.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />

            {/* Action Overlay (Yumuşak Geçiş) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4">
               <div className="flex gap-2 w-full justify-end">
                    <button onClick={handleQuickView} className="bg-white/90 hover:bg-white text-gray-800 p-2.5 rounded-full shadow-lg hover:scale-110 transition-transform backdrop-blur-md" title="Hızlı Bakış">
                        <Eye size={18} />
                    </button>
                    <button onClick={handleFavorite} className="bg-white/90 hover:bg-white text-gray-800 p-2.5 rounded-full shadow-lg hover:scale-110 transition-transform backdrop-blur-md">
                        <Heart size={18} className={cn("transition-colors", liked && "fill-red-500 text-red-500")} />
                    </button>
               </div>
            </div>
          </div>

          {/* İçerik Alanı */}
          <div className="p-5 flex-1 flex flex-col">
            <div className="flex justify-between items-start mb-2">
                <h3 className="text-gray-900 font-bold text-[15px] leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">{ad.title}</h3>
            </div>

            <div className="text-xl font-extrabold text-indigo-900 mb-4 tracking-tight">{priceDisplay}</div>

            <div className="mt-auto pt-4 border-t border-gray-50 flex justify-between items-center text-xs font-medium text-gray-500">
                <span className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md"><MapPin size={12} className="text-indigo-400"/> {ad.city}</span>
                <span className="text-gray-400">{dateDisplay}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}