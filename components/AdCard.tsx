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
  const location = `${ad.city || ''} / ${ad.district || ''}`;
  const dateDisplay = formatDate(ad.created_at);
  const imageUrl = ad.image || 'https://via.placeholder.com/300x200?text=Resim+Yok';

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(ad.id);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openModal('QUICK_VIEW', { ad });
  };

  // --- TABLO GÖRÜNÜMÜ ---
  if (viewMode === 'table') {
    return (
      <tr className="border-b border-gray-100 hover:bg-[#fff9e1] transition-colors group">
        <td className="p-2 w-[120px]">
          <div className="w-[100px] h-[75px] relative overflow-hidden border border-gray-200 rounded-sm cursor-pointer" onClick={handleQuickView}>
            <Image src={imageUrl} alt={ad.title} fill className="object-cover group-hover:scale-105 transition-transform" />
            {ad.is_vitrin && <div className="absolute top-0 left-0 bg-yellow-400 text-black text-[9px] font-bold px-1 z-10">VİTRİN</div>}
            {/* Quick View Button Overlay */}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-xs font-bold bg-black/50 px-2 py-1 rounded">Hızlı Bak</span>
            </div>
          </div>
        </td>
        <td className="p-3 align-middle">
          <Link href={`/ilan/${ad.id}`} className="block relative">
            <span className="text-[#333] text-[13px] font-bold group-hover:underline block mb-1 line-clamp-1 pr-6">
              {ad.title}
            </span>
            <div className="flex gap-2 items-center">
                {ad.is_urgent && <Badge variant="danger" className="text-[9px] py-0">Acil</Badge>}
                <span className="text-gray-400 text-[10px]">#{ad.id}</span>
            </div>
          </Link>
        </td>
        <td className="p-3 align-middle text-blue-900 font-bold text-[13px] whitespace-nowrap">{priceDisplay}</td>
        <td className="p-3 align-middle text-[#333] text-[12px] whitespace-nowrap">{dateDisplay}</td>
        <td className="p-3 align-middle text-[#333] text-[12px] whitespace-nowrap">
          <div className="flex items-center gap-1 text-gray-600"><MapPin size={12} className="text-gray-400" />{location}</div>
        </td>
      </tr>
    );
  }

  // --- LİSTE GÖRÜNÜMÜ ---
  if (viewMode === 'list') {
    return (
      <div className="flex bg-white border border-gray-200 rounded-sm overflow-hidden hover:shadow-md transition-shadow group h-[160px]">
        <div className="w-[220px] shrink-0 relative bg-gray-100 cursor-pointer" onClick={handleQuickView}>
           <Image src={imageUrl} alt={ad.title} fill className="object-cover group-hover:scale-105 transition-transform" />
           {ad.is_urgent && <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm z-10">ACİL</div>}
           <div className="absolute bottom-2 right-2 bg-white/80 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white text-blue-600" title="Hızlı Bakış">
              <Eye size={16} />
           </div>
        </div>
        <div className="flex-1 p-4 flex flex-col justify-between">
           <div>
             <div className="flex justify-between items-start">
                <Link href={`/ilan/${ad.id}`} className="text-[#333] text-base font-bold group-hover:underline line-clamp-1">
                    {ad.title}
                </Link>
                <button onClick={handleFavorite} className="text-gray-300 hover:text-red-500 transition-colors">
                    <Heart size={20} className={cn("transition-colors", liked && "fill-red-500 text-red-500")} />
                </button>
             </div>
             <p className="text-xs text-gray-500 mt-1 line-clamp-2">{ad.description?.substring(0, 150)}...</p>
           </div>
           <div className="flex justify-between items-end">
              <div className="text-gray-500 text-xs flex gap-4">
                  <span className="flex items-center gap-1"><MapPin size={14}/> {location}</span>
                  <span className="flex items-center gap-1"><Calendar size={14}/> {dateDisplay}</span>
              </div>
              <div className="text-lg font-bold text-blue-900">{priceDisplay}</div>
           </div>
        </div>
      </div>
    );
  }

  // --- GRID GÖRÜNÜMÜ (VİTRİN) ---
  return (
    <div className="block group h-full relative">
      <Link href={`/ilan/${ad.id}`} className="block h-full">
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-lg transition-all cursor-pointer h-full flex flex-col relative">
          {/* Etiketler */}
          {ad.is_urgent && <div className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm z-10 shadow-sm">ACİL</div>}
          {ad.is_vitrin && <div className="absolute top-2 right-2 bg-yellow-400 text-black text-[9px] font-bold px-1.5 py-0.5 rounded-sm z-10 shadow-sm">VİTRİN</div>}

          <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 rounded-t-sm">
            <Image src={imageUrl} alt={ad.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />

            {/* Hover Actions */}
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                    onClick={handleQuickView}
                    className="bg-white text-blue-600 p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                    title="Hızlı Bakış"
                >
                    <Eye size={18} />
                </button>
                <button
                    onClick={handleFavorite}
                    className="bg-white text-gray-400 hover:text-red-500 p-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                    title={liked ? "Favorilerden Çıkar" : "Favorilere Ekle"}
                >
                    <Heart size={18} className={cn("transition-colors", liked && "fill-red-500 text-red-500")} />
                </button>
            </div>
          </div>

          <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
            <p className="text-[13px] text-[#333] font-semibold leading-tight group-hover:underline line-clamp-2 h-[2.4em] overflow-hidden">
              {ad.title}
            </p>
            <div className="pt-2 border-t border-gray-50 mt-1">
              <p className="text-[15px] font-bold text-blue-900">{priceDisplay}</p>
              <div className="flex justify-between items-center mt-1">
                  <p className="text-[10px] text-gray-500 truncate max-w-[60%]">{location}</p>
                  <p className="text-[10px] text-gray-400">{dateDisplay}</p>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}