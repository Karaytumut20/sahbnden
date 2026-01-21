import React from 'react';
import Link from 'next/link';
import { MapPin, Calendar, Heart } from 'lucide-react';
import Badge from '@/components/ui/Badge';

type AdCardProps = {
  ad: any;
  viewMode?: 'grid' | 'list' | 'table';
};

export default function AdCard({ ad, viewMode = 'grid' }: AdCardProps) {
  const formattedPrice = ad.price?.toLocaleString('tr-TR') + ' ' + ad.currency;
  const location = `${ad.city || ''} / ${ad.district || ''}`;
  const date = new Date(ad.created_at).toLocaleDateString('tr-TR');

  // --- TABLO GÖRÜNÜMÜ (Klasik) ---
  if (viewMode === 'table') {
    return (
      <tr className="border-b border-gray-100 hover:bg-[#fff9e1] transition-colors group">
        <td className="p-2 w-[120px]">
          <Link href={`/ilan/${ad.id}`}>
            <div className="w-[100px] h-[75px] relative overflow-hidden border border-gray-200 rounded-sm">
              <img src={ad.image || 'https://via.placeholder.com/300x200'} alt={ad.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              {ad.is_vitrin && <div className="absolute top-0 left-0 bg-yellow-400 text-black text-[9px] font-bold px-1">VİTRİN</div>}
            </div>
          </Link>
        </td>
        <td className="p-3 align-middle">
          <Link href={`/ilan/${ad.id}`} className="block">
            <span className={`text-[#333] text-[13px] group-hover:underline block mb-1 line-clamp-1 ${ad.is_bold ? 'font-black' : 'font-bold'}`}>
              {ad.title}
            </span>
            <div className="flex gap-2">
                {ad.is_urgent && <Badge variant="danger" className="text-[9px] py-0">Acil</Badge>}
                <span className="text-gray-400 text-[11px]">#{ad.id}</span>
            </div>
          </Link>
        </td>
        <td className="p-3 align-middle text-blue-900 font-bold text-[13px] whitespace-nowrap">
          {formattedPrice}
        </td>
        <td className="p-3 align-middle text-[#333] text-[12px] whitespace-nowrap">
          {date}
        </td>
        <td className="p-3 align-middle text-[#333] text-[12px] whitespace-nowrap">
          <div className="flex items-center gap-1 text-gray-600">
            <MapPin size={12} className="text-gray-400" />
            {location}
          </div>
        </td>
      </tr>
    );
  }

  // --- LİSTE GÖRÜNÜMÜ (Yatay Kart) ---
  if (viewMode === 'list') {
    return (
      <div className="flex bg-white border border-gray-200 rounded-sm overflow-hidden hover:shadow-md transition-shadow group h-[160px]">
        <Link href={`/ilan/${ad.id}`} className="w-[220px] shrink-0 relative overflow-hidden bg-gray-100">
           <img src={ad.image || 'https://via.placeholder.com/300x200'} alt={ad.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
           {ad.is_urgent && <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">ACİL</div>}
        </Link>
        <div className="flex-1 p-4 flex flex-col justify-between">
           <div>
             <div className="flex justify-between items-start">
                <Link href={`/ilan/${ad.id}`} className={`text-[#333] text-lg group-hover:underline line-clamp-1 ${ad.is_bold ? 'font-black' : 'font-bold'}`}>
                    {ad.title}
                </Link>
                <button className="text-gray-300 hover:text-red-500"><Heart size={20}/></button>
             </div>
             <p className="text-sm text-gray-500 mt-1 line-clamp-2">{ad.description?.substring(0, 150)}...</p>
           </div>
           <div className="flex justify-between items-end">
              <div className="text-gray-500 text-xs flex gap-4">
                  <span className="flex items-center gap-1"><MapPin size={14}/> {location}</span>
                  <span className="flex items-center gap-1"><Calendar size={14}/> {date}</span>
              </div>
              <div className="text-xl font-bold text-blue-900">{formattedPrice}</div>
           </div>
        </div>
      </div>
    );
  }

  // --- GRID GÖRÜNÜMÜ (Vitrin Kartı - Varsayılan) ---
  return (
    <Link href={`/ilan/${ad.id}`} className="block group h-full">
      <div className="bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-lg transition-all cursor-pointer h-full flex flex-col relative">
        {ad.is_urgent && <div className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm z-10">ACİL</div>}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 rounded-t-sm">
          <img src={ad.image || 'https://via.placeholder.com/300x200'} alt={ad.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
        <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
          <p className={`text-[13px] text-[#333] leading-tight group-hover:underline line-clamp-2 h-[2.4em] overflow-hidden ${ad.is_bold ? 'font-black' : 'font-semibold'}`}>
            {ad.title}
          </p>
          <div className="pt-2 border-t border-gray-50 mt-1">
             <p className="text-[14px] font-bold text-blue-900">{formattedPrice}</p>
             <div className="flex justify-between items-center mt-1">
                <p className="text-[10px] text-gray-500 truncate max-w-[60%]">{location}</p>
                <p className="text-[9px] text-gray-400">{date}</p>
             </div>
          </div>
        </div>
      </div>
    </Link>
  );
}