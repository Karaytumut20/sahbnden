import React from 'react';
import Link from 'next/link';
import { getRelatedAdsServer } from '@/lib/actions';

// Server Component olarak çalışacak
export default async function RelatedAds({ category, currentId }: { category: string, currentId: number }) {
  const related = await getRelatedAdsServer(category, currentId);

  if (!related || related.length === 0) return null;

  return (
    <div className="mt-8 border-t border-gray-200 pt-6">
      <h3 className="font-bold text-[#333] text-md mb-4">Benzer İlanlar</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {related.map((ad: any) => (
          <Link href={`/ilan/${ad.id}`} key={ad.id} className="block group">
            <div className="bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-md transition-all cursor-pointer h-full flex flex-col">
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                  src={ad.image || 'https://via.placeholder.com/300x200'}
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
                     {ad.price?.toLocaleString()} {ad.currency}
                   </p>
                   <p className="text-[9px] text-gray-500 truncate">{ad.city} / {ad.district}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}