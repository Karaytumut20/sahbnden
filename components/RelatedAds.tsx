
"use client";
import React from 'react';
import Link from 'next/link';
import { ads, urgentAds } from '@/lib/data';

export default function RelatedAds({ category, currentId }: { category: string, currentId: number }) {
  // Aynı kategorideki diğer ilanları bul (Mevcut ilan hariç)
  // Demo verisi olduğu için rastgele 5 tanesini alıyoruz
  const related = [...ads, ...urgentAds]
    .filter(ad => ad.category === category && ad.id !== currentId)
    .slice(0, 5);

  if (related.length === 0) return null;

  return (
    <div className="mt-8 border-t border-gray-200 pt-6">
      <h3 className="font-bold text-[#333] text-md mb-4">Benzer İlanlar</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {related.map((ad) => (
          <Link href={`/ilan/${ad.id}`} key={ad.id} className="block group">
            <div className="bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-md transition-all cursor-pointer h-full flex flex-col">
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                  src={ad.image}
                  alt={ad.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-2 space-y-1 flex-1 flex flex-col justify-between">
                <p className="text-[11px] text-[#333] font-semibold leading-tight group-hover:underline line-clamp-2">
                  {ad.title}
                </p>
                <div className="pt-2">
                   <p className="text-[13px] font-bold text-blue-900">
                     {ad.price} {ad.currency}
                   </p>
                   <p className="text-[9px] text-gray-500 truncate">{ad.location}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
