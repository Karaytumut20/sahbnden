
"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, ChevronDown, Check } from 'lucide-react';

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get('category');

  // State
  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    room: searchParams.get('room') || '',
    minYear: searchParams.get('minYear') || '',
    maxYear: searchParams.get('maxYear') || '',
    maxKm: searchParams.get('maxKm') || '',
  });

  // URL değişirse state'i güncelle
  useEffect(() => {
    setFilters({
      city: searchParams.get('city') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      room: searchParams.get('room') || '',
      minYear: searchParams.get('minYear') || '',
      maxYear: searchParams.get('maxYear') || '',
      maxKm: searchParams.get('maxKm') || '',
    });
  }, [searchParams]);

  const handleChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    // Tüm filtreleri URL'e işle veya sil
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });

    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-4 sticky top-20">
      <h3 className="font-bold text-[#333] text-sm mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
        <Filter size={16} /> Detaylı Filtreleme
      </h3>

      <div className="space-y-4">

        {/* Adres */}
        <div>
          <label className="text-[11px] font-bold text-gray-500 mb-1 block">ADRES</label>
          <select
            value={filters.city}
            onChange={(e) => handleChange('city', e.target.value)}
            className="w-full border border-gray-300 rounded-sm text-[12px] p-2 focus:border-blue-500 outline-none"
          >
            <option value="">Tüm İller</option>
            <option value="İstanbul">İstanbul</option>
            <option value="Ankara">Ankara</option>
            <option value="İzmir">İzmir</option>
            <option value="Antalya">Antalya</option>
            <option value="Bursa">Bursa</option>
          </select>
        </div>

        {/* Fiyat */}
        <div className="border-t border-gray-100 pt-3">
          <label className="text-[11px] font-bold text-gray-500 mb-1 block">FİYAT (TL)</label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min TL"
              value={filters.minPrice}
              onChange={(e) => handleChange('minPrice', e.target.value)}
              className="w-full border border-gray-300 rounded-sm text-[12px] p-2 outline-none"
            />
            <input
              type="number"
              placeholder="Max TL"
              value={filters.maxPrice}
              onChange={(e) => handleChange('maxPrice', e.target.value)}
              className="w-full border border-gray-300 rounded-sm text-[12px] p-2 outline-none"
            />
          </div>
        </div>

        {/* --- EMLAK KATEGORİSİNE ÖZEL FİLTRELER --- */}
        {currentCategory === 'emlak' && (
          <div className="border-t border-gray-100 pt-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="text-[11px] font-bold text-gray-500 mb-1 block">ODA SAYISI</label>
            <div className="space-y-1">
              {['1+1', '2+1', '3+1', '4+1'].map(opt => (
                <label key={opt} className="flex items-center gap-2 text-[12px] cursor-pointer">
                  <input
                    type="radio"
                    name="room"
                    value={opt}
                    checked={filters.room === opt}
                    onChange={(e) => handleChange('room', e.target.value)}
                    className="accent-blue-600"
                  />
                  {opt}
                </label>
              ))}
            </div>
          </div>
        )}

        {/* --- VASITA KATEGORİSİNE ÖZEL FİLTRELER --- */}
        {currentCategory === 'vasita' && (
          <div className="border-t border-gray-100 pt-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="mb-3">
              <label className="text-[11px] font-bold text-gray-500 mb-1 block">YIL</label>
              <div className="flex gap-2">
                <input
                  type="number" placeholder="Min"
                  value={filters.minYear} onChange={(e) => handleChange('minYear', e.target.value)}
                  className="w-full border border-gray-300 rounded-sm text-[12px] p-2"
                />
                <input
                  type="number" placeholder="Max"
                  value={filters.maxYear} onChange={(e) => handleChange('maxYear', e.target.value)}
                  className="w-full border border-gray-300 rounded-sm text-[12px] p-2"
                />
              </div>
            </div>
            <div>
              <label className="text-[11px] font-bold text-gray-500 mb-1 block">KİLOMETRE (Maks)</label>
              <input
                type="number" placeholder="Örn: 100000"
                value={filters.maxKm} onChange={(e) => handleChange('maxKm', e.target.value)}
                className="w-full border border-gray-300 rounded-sm text-[12px] p-2"
              />
            </div>
          </div>
        )}

        <button
          onClick={applyFilters}
          className="w-full bg-blue-700 text-white text-[13px] font-bold py-2.5 mt-2 rounded-sm hover:bg-blue-800 transition-colors shadow-md flex items-center justify-center gap-2"
        >
          <Check size={16} /> Sonuçları Göster
        </button>

        {/* Filtreleri Temizle */}
        <button
          onClick={() => {
            setFilters({ city: '', minPrice: '', maxPrice: '', room: '', minYear: '', maxYear: '', maxKm: '' });
            router.push('/search');
          }}
          className="w-full text-center text-[11px] text-gray-500 hover:text-red-600 underline"
        >
          Filtreleri Temizle
        </button>

      </div>
    </div>
  );
}
