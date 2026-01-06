
"use client";
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { List, Map as MapIcon } from 'lucide-react';

export default function SearchHeader({ total, query, currentSort, currentView }: any) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mb-3 border-b border-gray-200 pb-2 gap-3">
      <h1 className="text-[#333] font-bold text-sm">
        {query ? `"${query}" aramanız için` : 'Arama sonuçları:'} <span className="text-blue-900">{total}</span> ilan bulundu
      </h1>

      <div className="flex items-center gap-3">
        {/* Görünüm Modu Toggle */}
        <div className="flex border border-gray-300 rounded-sm overflow-hidden">
          <button
            onClick={() => updateParam('view', 'list')}
            className={`p-1.5 ${currentView !== 'map' ? 'bg-gray-200 text-black' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
            title="Liste Görünümü"
          >
            <List size={16} />
          </button>
          <div className="w-[1px] bg-gray-300"></div>
          <button
            onClick={() => updateParam('view', 'map')}
            className={`p-1.5 ${currentView === 'map' ? 'bg-gray-200 text-black' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
            title="Harita Görünümü"
          >
            <MapIcon size={16} />
          </button>
        </div>

        {/* Sıralama */}
        <select
          value={currentSort || ''}
          onChange={(e) => updateParam('sort', e.target.value)}
          className="border border-gray-300 rounded-sm text-[12px] p-1.5 text-gray-600 outline-none focus:border-blue-500"
        >
          <option value="">Gelişmiş sıralama</option>
          <option value="price_asc">Fiyata göre (En düşük)</option>
          <option value="price_desc">Fiyata göre (En yüksek)</option>
          <option value="date_desc">Tarihe göre (En yeni)</option>
          <option value="date_asc">Tarihe göre (En eski)</option>
        </select>
      </div>
    </div>
  );
}
