import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Calendar, Heart } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { Ad } from '@/types';

// Tarih Formatlayıcı (Bugün, Dün, vs.)
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Bugün';
  if (diffDays === 1) return 'Dün';
  return date.toLocaleDateString('tr-TR');
};

type AdCardProps = {
  ad: Ad;
  viewMode?: 'grid' | 'list' | 'table';
};

export default function AdCard({ ad, viewMode = 'grid' }: AdCardProps) {
  const formattedPrice = ad.price != null ? ad.price.toLocaleString('tr-TR') : '0';
  const priceDisplay = `${formattedPrice} ${ad.currency || 'TL'}`;
  const location = `${ad.city || ''} / ${ad.district || ''}`;
  const dateDisplay = formatDate(ad.created_at);
  const imageUrl = ad.image || 'https://via.placeholder.com/300x200?text=Resim+Yok';

  if (viewMode === 'table') {
    return (
      <tr className="border-b border-gray-100 hover:bg-[#fff9e1] transition-colors group">
        <td className="p-2 w-[120px]">
          <Link href={`/ilan/${ad.id}`}>
            <div className="w-[100px] h-[75px] relative overflow-hidden border border-gray-200 rounded-sm">
              <Image src={imageUrl} alt={ad.title} fill className="object-cover group-hover:scale-105 transition-transform" />
              {ad.is_vitrin && <div className="absolute top-0 left-0 bg-yellow-400 text-black text-[9px] font-bold px-1 z-10">VİTRİN</div>}
            </div>
          </Link>
        </td>
        <td className="p-3 align-middle">
          <Link href={`/ilan/${ad.id}`} className="block">
            <span className="text-[#333] text-[13px] font-bold group-hover:underline block mb-1 line-clamp-1">
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

  if (viewMode === 'list') {
    return (
      <div className="flex bg-white border border-gray-200 rounded-sm overflow-hidden hover:shadow-md transition-shadow group h-[160px]">
        <Link href={`/ilan/${ad.id}`} className="w-[220px] shrink-0 relative bg-gray-100">
           <Image src={imageUrl} alt={ad.title} fill className="object-cover group-hover:scale-105 transition-transform" />
           {ad.is_urgent && <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm z-10">ACİL</div>}
        </Link>
        <div className="flex-1 p-4 flex flex-col justify-between">
           <div>
             <div className="flex justify-between items-start">
                <Link href={`/ilan/${ad.id}`} className="text-[#333] text-base font-bold group-hover:underline line-clamp-1">
                    {ad.title}
                </Link>
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

  // Grid Görünümü (Varsayılan)
  return (
    <Link href={`/ilan/${ad.id}`} className="block group h-full">
      <div className="bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-lg transition-all cursor-pointer h-full flex flex-col relative">
        {ad.is_urgent && <div className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm z-10 shadow-sm">ACİL</div>}
        {ad.is_vitrin && <div className="absolute top-2 right-2 bg-yellow-400 text-black text-[9px] font-bold px-1.5 py-0.5 rounded-sm z-10 shadow-sm">VİTRİN</div>}

        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 rounded-t-sm">
          <Image src={imageUrl} alt={ad.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
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
  );
}