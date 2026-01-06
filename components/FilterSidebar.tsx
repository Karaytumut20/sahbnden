
"use client";
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter } from 'lucide-react';

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL'deki mevcut değerleri al
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (minPrice) params.set('minPrice', minPrice);
    else params.delete('minPrice');

    if (maxPrice) params.set('maxPrice', maxPrice);
    else params.delete('maxPrice');

    if (city && city !== 'İl Seçiniz') params.set('city', city);
    else params.delete('city');

    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-3 mb-4 sticky top-20">
      <h3 className="font-bold text-[#333] text-sm mb-3 flex items-center gap-2 border-b border-gray-100 pb-2">
        <Filter size={14} /> Detaylı Filtrele
      </h3>

      {/* Adres Filtresi */}
      <div className="mb-4">
        <h4 className="font-semibold text-[12px] text-blue-900 mb-2">Adres</h4>
        <select
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full border border-gray-300 rounded-sm text-[12px] p-1 mb-2 focus:border-blue-500 outline-none"
        >
          <option value="">İl Seçiniz</option>
          <option value="İstanbul">İstanbul</option>
          <option value="Ankara">Ankara</option>
          <option value="İzmir">İzmir</option>
        </select>
      </div>

      {/* Fiyat Filtresi */}
      <div className="mb-4 border-t border-gray-100 pt-3">
        <h4 className="font-semibold text-[12px] text-blue-900 mb-2">Fiyat (TL)</h4>
        <div className="flex gap-2 mb-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full border border-gray-300 rounded-sm text-[11px] p-1 outline-none focus:border-blue-500"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full border border-gray-300 rounded-sm text-[11px] p-1 outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <button
        onClick={applyFilters}
        className="w-full bg-blue-900 text-white text-[12px] font-bold py-1.5 mt-2 rounded-sm hover:bg-blue-800 transition-colors shadow-sm"
      >
        Aramayı Daralt
      </button>

      {/* Temizle Linki */}
      {(minPrice || maxPrice || city) && (
        <button
          onClick={() => router.push('/search')}
          className="w-full text-red-600 text-[11px] mt-2 underline hover:text-red-800"
        >
          Filtreleri Temizle
        </button>
      )}
    </div>
  );
}
