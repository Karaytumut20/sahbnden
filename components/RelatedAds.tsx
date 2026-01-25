import React from 'react';
import AdCard from '@/components/AdCard';
import { getRelatedAdsServer } from '@/lib/actions';

export default async function RelatedAds({ category, currentId, price }: { category: string, currentId: number, price?: number }) {
  const relatedAds = await getRelatedAdsServer(category, currentId, price);

  if (relatedAds.length === 0) return null;

  return (
    <div className="mt-8 border-t border-gray-200 pt-6">
      <h3 className="font-bold text-[#333] mb-4 text-lg">Benzer İlanlar</h3>
      {/* Mobilde 2'li grid yapısı */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {relatedAds.map((ad: any) => (
            <div key={ad.id} className="h-[260px]">
                <AdCard ad={ad} viewMode="grid" />
            </div>
        ))}
      </div>
    </div>
  );
}
