
import React from 'react';
import Link from 'next/link';
import { getAdById } from '@/lib/data';
import { ArrowLeft, X } from 'lucide-react';

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ ids?: string }> }) {
  const { ids } = await searchParams;
  const adIds = ids ? ids.split(',').map(Number) : [];
  const ads = adIds.map(id => getAdById(id)).filter(Boolean);

  if (ads.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="text-xl font-bold mb-4">Karşılaştırılacak ilan bulunamadı.</h1>
        <Link href="/" className="text-blue-600 underline">Ana Sayfaya Dön</Link>
      </div>
    );
  }

  // Özellikleri dinamik olarak çıkarma
  const allAttributes = Array.from(new Set(ads.flatMap(ad => ad.attributes.map((attr: any) => attr.label))));

  return (
    <div className="py-6">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/" className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-700">
          <ArrowLeft size={16} /> Geri Dön
        </Link>
        <h1 className="text-xl font-bold text-[#333]">İlan Karşılaştırma</h1>
      </div>

      <div className="overflow-x-auto bg-white border border-gray-200 rounded-sm shadow-sm">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr>
              <th className="p-4 border-b border-r border-gray-200 w-[200px] bg-gray-50">Özellikler</th>
              {ads.map(ad => (
                <th key={ad.id} className="p-4 border-b border-r border-gray-200 min-w-[200px] align-top relative">
                  <div className="w-full h-32 bg-gray-100 mb-3 relative overflow-hidden rounded-sm border border-gray-200">
                    <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
                  </div>
                  <Link href={`/ilan/${ad.id}`} className="text-blue-900 font-bold text-sm hover:underline line-clamp-2 mb-2 block">
                    {ad.title}
                  </Link>
                  <p className="text-red-600 font-bold text-lg">{ad.price} {ad.currency}</p>
                  <p className="text-gray-500 text-xs mt-1">{ad.location}</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allAttributes.map((attrLabel, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="p-3 border-b border-r border-gray-200 font-bold text-[#333] text-sm">
                  {attrLabel}
                </td>
                {ads.map(ad => {
                  const val = ad.attributes.find((a: any) => a.label === attrLabel)?.value || '-';
                  return (
                    <td key={ad.id} className="p-3 border-b border-r border-gray-200 text-[#333] text-sm">
                      {val}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
