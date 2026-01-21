import React from 'react';
import Link from 'next/link';
import { getAdsByIds } from '@/lib/actions';
import { ArrowLeft, X, Check, Minus } from 'lucide-react';

export default async function ComparePage({ searchParams }: { searchParams: Promise<{ ids?: string }> }) {
  const { ids } = await searchParams;
  const adIds = ids ? ids.split(',').map(Number) : [];

  // Server Action ile gerçek veri çekiyoruz
  const ads = await getAdsByIds(adIds);

  if (ads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-4">
        <div className="bg-blue-50 p-6 rounded-full mb-4">
            <ArrowLeft size={32} className="text-blue-600" />
        </div>
        <h1 className="text-xl font-bold mb-2 text-[#333]">Karşılaştırılacak ilan bulunamadı.</h1>
        <p className="text-gray-500 mb-6 text-sm">Lütfen ilan detay sayfalarından veya arama sonuçlarından karşılaştırma listesine ilan ekleyin.</p>
        <Link href="/" className="bg-blue-700 text-white px-6 py-3 rounded-sm font-bold text-sm hover:bg-blue-800 transition-colors">
          Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  // Karşılaştırma Özellikleri
  const compareFields = [
    { label: 'Fiyat', key: 'price', format: (val: any, ad: any) => `${val?.toLocaleString()} ${ad.currency}` },
    { label: 'İl / İlçe', key: 'location', format: (_: any, ad: any) => `${ad.city} / ${ad.district}` },
    { label: 'Oda Sayısı', key: 'room' },
    { label: 'Metrekare', key: 'm2', format: (val: any) => val ? `${val} m²` : '-' },
    { label: 'Model Yılı', key: 'year' },
    { label: 'Kilometre', key: 'km', format: (val: any) => val ? `${val.toLocaleString()} KM` : '-' },
    { label: 'Yakıt', key: 'fuel' },
    { label: 'Vites', key: 'gear' },
    { label: 'Isıtma', key: 'heating' },
    { label: 'Kat', key: 'floor' },
    { label: 'İlan Tarihi', key: 'created_at', format: (val: any) => new Date(val).toLocaleDateString('tr-TR') },
    { label: 'Kimden', key: 'profiles', format: (val: any) => val?.full_name || 'Sahibinden' },
  ];

  return (
    <div className="py-6">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/" className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-700">
          <ArrowLeft size={16} /> Geri Dön
        </Link>
        <h1 className="text-xl font-bold text-[#333]">İlan Karşılaştırma ({ads.length})</h1>
      </div>

      <div className="overflow-x-auto bg-white border border-gray-200 rounded-sm shadow-sm scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pb-2">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr>
              <th className="p-4 border-b border-r border-gray-200 w-[200px] bg-gray-50 sticky left-0 z-10 text-sm font-bold text-gray-600">
                Özellikler
              </th>
              {ads.map(ad => (
                <th key={ad.id} className="p-4 border-b border-r border-gray-200 min-w-[220px] align-top relative bg-white">
                  <div className="w-full h-32 bg-gray-100 mb-3 relative overflow-hidden rounded-sm border border-gray-200 group">
                    <img
                        src={ad.image || 'https://via.placeholder.com/300x200?text=Resim+Yok'}
                        alt={ad.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <Link href={`/ilan/${ad.id}`} className="absolute inset-0 z-10" />
                  </div>
                  <Link href={`/ilan/${ad.id}`} className="text-blue-900 font-bold text-sm hover:underline line-clamp-2 mb-2 block h-[2.5em]">
                    {ad.title}
                  </Link>
                  <p className="text-red-600 font-bold text-lg">{ad.price?.toLocaleString()} {ad.currency}</p>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {compareFields.map((field, idx) => (
              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                <td className="p-3 border-b border-r border-gray-200 font-bold text-[#333] text-sm sticky left-0 bg-inherit z-10">
                  {field.label}
                </td>
                {ads.map(ad => {
                  // Veriye erişim (Nested key support could be added via lodash/get but simple access is usually fine)
                  const rawVal = ad[field.key as keyof typeof ad];
                  const displayVal = field.format ? field.format(rawVal, ad) : (rawVal || <span className="text-gray-300 text-xs"><Minus size={12}/></span>);

                  return (
                    <td key={ad.id} className="p-3 border-b border-r border-gray-200 text-[#333] text-sm text-center">
                      {displayVal}
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