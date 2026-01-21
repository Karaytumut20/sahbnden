"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCompare } from '@/context/CompareContext';
import { getAdsByIds } from '@/lib/actions';
import { Check, X, Trash2, ArrowLeft, AlertCircle } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import { Loader2 } from 'lucide-react';

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (compareList.length === 0) {
        setAds([]);
        setLoading(false);
        return;
    }
    setLoading(true);
    getAdsByIds(compareList).then((data) => {
        setAds(data);
        setLoading(false);
    });
  }, [compareList]);

  if (compareList.length === 0) {
    return (
        <div className="p-10 container max-w-[1150px] mx-auto">
            <EmptyState
                icon={AlertCircle}
                title="Karşılaştırma Listeniz Boş"
                description="İlanları karşılaştırmak için detay sayfalarından 'Karşılaştır' butonuna tıklayınız."
                actionLabel="İlanlara Git"
                actionUrl="/search"
            />
        </div>
    );
  }

  if (loading) return <div className="p-20 text-center flex justify-center"><Loader2 className="animate-spin"/></div>;

  // Ortak özellikler
  const features = [
    { label: 'Fiyat', key: 'price', format: (v: any, ad: any) => `${v?.toLocaleString()} ${ad.currency}` },
    { label: 'İl / İlçe', key: 'city', format: (v: any, ad: any) => `${v} / ${ad.district}` },
    { label: 'İlan Tarihi', key: 'created_at', format: (v: any) => new Date(v).toLocaleDateString() },
    { label: 'Kategori', key: 'category' },
    // Dinamik alanlar
    { label: 'Marka', key: 'brand' },
    { label: 'Model', key: 'model' },
    { label: 'Yıl', key: 'year' },
    { label: 'KM', key: 'km', format: (v: any) => v ? `${v} KM` : '-' },
    { label: 'Yakıt', key: 'fuel' },
    { label: 'Vites', key: 'gear' },
    { label: 'm²', key: 'm2' },
    { label: 'Oda', key: 'room' },
    { label: 'Kat', key: 'floor' },
    { label: 'Isıtma', key: 'heating' },
  ];

  return (
    <div className="container max-w-[1150px] mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">İlan Karşılaştırma</h1>
        <div className="flex gap-4">
            <Link href="/" className="text-sm text-blue-600 hover:underline flex items-center gap-1"><ArrowLeft size={16}/> Alışverişe Dön</Link>
            <button onClick={clearCompare} className="text-sm text-red-600 hover:underline flex items-center gap-1"><Trash2 size={16}/> Listeyi Temizle</button>
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-4 border-b border-r border-gray-100 bg-gray-50 w-[200px] min-w-[150px]">Özellikler</th>
              {ads.map(ad => (
                <th key={ad.id} className="p-4 border-b border-r border-gray-100 min-w-[250px] relative group">
                    <button
                        onClick={() => removeFromCompare(ad.id)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Listeden Çıkar"
                    >
                        <X size={18}/>
                    </button>
                    <div className="h-32 w-full bg-gray-100 rounded-md mb-3 overflow-hidden relative">
                        {ad.image ? (
                            <img src={ad.image} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Resim Yok</div>
                        )}
                        {ad.is_vitrin && <span className="absolute top-0 left-0 bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5">VİTRİN</span>}
                    </div>
                    <Link href={`/ilan/${ad.id}`} className="font-bold text-blue-900 hover:underline line-clamp-2 h-10 text-sm">
                        {ad.title}
                    </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((feature, idx) => {
               // Eğer hiçbir ilanda bu özellik yoksa satırı gizle (Smart Table)
               const hasValue = ads.some(ad => ad[feature.key] !== null && ad[feature.key] !== undefined);
               if (!hasValue) return null;

               return (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 border-b border-r border-gray-100 font-bold text-gray-600 text-sm bg-gray-50/50">
                        {feature.label}
                    </td>
                    {ads.map(ad => (
                        <td key={ad.id} className="p-4 border-b border-r border-gray-100 text-sm text-gray-800">
                            {feature.format
                                ? feature.format(ad[feature.key], ad)
                                : (ad[feature.key] || <span className="text-gray-300">-</span>)
                            }
                        </td>
                    ))}
                </tr>
               );
            })}
            <tr>
                <td className="p-4 border-r border-gray-100 bg-gray-50"></td>
                {ads.map(ad => (
                    <td key={ad.id} className="p-4 border-r border-gray-100">
                        <Link href={`/ilan/${ad.id}`} className="block w-full bg-[#ffe800] text-black text-center py-2 rounded-sm font-bold text-sm hover:bg-yellow-400">
                            İlanı İncele
                        </Link>
                    </td>
                ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}