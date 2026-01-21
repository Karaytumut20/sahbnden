"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, Check, RotateCcw, ChevronLeft } from 'lucide-react';
import { categories } from '@/lib/data';

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategorySlug = searchParams.get('category');

  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    room: searchParams.get('room') || '',
    minYear: searchParams.get('minYear') || '',
    maxYear: searchParams.get('maxYear') || '',
    maxKm: searchParams.get('maxKm') || '',
  });

  // --- KATEGORİ GEZİNTİ MANTIĞI ---
  const navData = useMemo(() => {
    let activeCat: any = null;
    let parentCat: any = null;
    let listToDisplay = categories;
    let title = "Kategoriler";

    if (!currentCategorySlug) {
      return { list: categories, title, parent: null, active: null };
    }

    const findInTree = (list: any[], parent: any | null): boolean => {
      for (const item of list) {
        if (item.slug === currentCategorySlug) {
          activeCat = item;
          parentCat = parent;
          return true;
        }
        if (item.subs && item.subs.length > 0) {
          if (findInTree(item.subs, item)) return true;
        }
      }
      return false;
    };

    findInTree(categories, null);

    if (activeCat) {
      // Altı varsa oraya in
      if (activeCat.subs && activeCat.subs.length > 0) {
        listToDisplay = activeCat.subs;
        title = activeCat.title;
      }
      // En alttaysa kardeşlerini göster
      else if (parentCat) {
        listToDisplay = parentCat.subs;
        title = parentCat.title;
      }
    }

    return { list: listToDisplay, title, parent: parentCat, active: activeCat };
  }, [currentCategorySlug]);

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

  const updateFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    params.delete('page');
    router.push(`/search?${params.toString()}`);
  };

  const handleCategoryClick = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('category', slug);
    params.delete('page');
    router.push(`/search?${params.toString()}`);
  };

  const goUpLevel = () => {
    if (navData.parent) handleCategoryClick(navData.parent.slug);
    else router.push('/search');
  };

  const clearFilters = () => {
    setFilters({ city: '', minPrice: '', maxPrice: '', room: '', minYear: '', maxYear: '', maxKm: '' });
    const params = new URLSearchParams();
    if (currentCategorySlug) params.set('category', currentCategorySlug);
    router.push(`/search?${params.toString()}`);
  };

  // Dinamik Filtre Gösterimi
  const showEmlak = currentCategorySlug?.includes('konut') || currentCategorySlug?.includes('emlak') || currentCategorySlug?.includes('arsa') || currentCategorySlug?.includes('is-yeri');
  const showVasita = currentCategorySlug?.includes('vasita') || currentCategorySlug?.includes('oto') || currentCategorySlug?.includes('motosiklet');

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-4 sticky top-20 dark:bg-[#1c1c1c] dark:border-gray-700 transition-colors">

      <div className="mb-6">
          <h3 className="font-bold text-[#333] text-sm mb-3 border-b border-gray-100 pb-2 dark:text-white dark:border-gray-700">
            {navData.title}
          </h3>

          {currentCategorySlug && (
              <button onClick={goUpLevel} className="flex items-center gap-1 text-xs text-blue-600 font-bold mb-3 hover:underline px-1">
                  <ChevronLeft size={14}/> {navData.parent ? navData.parent.title : 'Tüm Kategoriler'}
              </button>
          )}

          <ul className="space-y-1">
              {navData.list.map((sub: any) => (
                  <li key={sub.id}>
                      <button
                        onClick={() => handleCategoryClick(sub.slug)}
                        className={`w-full text-left text-[13px] px-2 py-1.5 rounded-sm flex items-center justify-between group transition-colors ${currentCategorySlug === sub.slug ? 'bg-blue-50 text-blue-700 font-bold border-l-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'}`}
                      >
                          {sub.title}
                          {currentCategorySlug === sub.slug && <Check size={14}/>}
                      </button>
                  </li>
              ))}
          </ul>
      </div>

      <h3 className="font-bold text-[#333] text-sm mb-4 flex items-center gap-2 border-b border-gray-100 pb-2 dark:text-white dark:border-gray-700">
        <Filter size={16} /> Detaylı Filtreleme
      </h3>

      <div className="space-y-4">
        <div>
          <label className="text-[11px] font-bold text-gray-500 mb-1 block dark:text-gray-400">ADRES</label>
          <select
            value={filters.city}
            onChange={(e) => updateFilter('city', e.target.value)}
            className="w-full border border-gray-300 rounded-sm text-[12px] p-2 focus:border-blue-500 outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          >
            <option value="">Tüm İller</option>
            <option value="İstanbul">İstanbul</option>
            <option value="Ankara">Ankara</option>
            <option value="İzmir">İzmir</option>
            <option value="Antalya">Antalya</option>
            <option value="Bursa">Bursa</option>
          </select>
        </div>

        <div className="border-t border-gray-100 pt-3 dark:border-gray-700">
          <label className="text-[11px] font-bold text-gray-500 mb-1 block dark:text-gray-400">FİYAT (TL)</label>
          <div className="flex gap-2">
            <input type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => updateFilter('minPrice', e.target.value)} className="w-full border border-gray-300 rounded-sm text-[12px] p-2 outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
            <input type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => updateFilter('maxPrice', e.target.value)} className="w-full border border-gray-300 rounded-sm text-[12px] p-2 outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
          </div>
        </div>

        {showEmlak && (
            <div className="border-t border-gray-100 pt-3 dark:border-gray-700 animate-in fade-in">
                <label className="text-[11px] font-bold text-gray-500 mb-1 block dark:text-gray-400">ODA SAYISI</label>
                <select value={filters.room} onChange={(e) => updateFilter('room', e.target.value)} className="w-full border border-gray-300 rounded-sm text-[12px] p-2 focus:border-blue-500 outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white">
                    <option value="">Hepsi</option><option value="1+0">1+0</option><option value="1+1">1+1</option><option value="2+1">2+1</option><option value="3+1">3+1</option><option value="4+1">4+1</option>
                </select>
            </div>
        )}

        {showVasita && (
            <div className="border-t border-gray-100 pt-3 dark:border-gray-700 animate-in fade-in">
                <label className="text-[11px] font-bold text-gray-500 mb-1 block dark:text-gray-400">YIL</label>
                <div className="flex gap-2">
                    <input type="number" placeholder="Min" value={filters.minYear} onChange={(e) => updateFilter('minYear', e.target.value)} className="w-full border border-gray-300 rounded-sm text-[12px] p-2 outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                    <input type="number" placeholder="Max" value={filters.maxYear} onChange={(e) => updateFilter('maxYear', e.target.value)} className="w-full border border-gray-300 rounded-sm text-[12px] p-2 outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
                </div>
            </div>
        )}

        <button onClick={applyFilters} className="w-full bg-blue-700 text-white text-[13px] font-bold py-2.5 mt-4 rounded-sm hover:bg-blue-800 transition-colors shadow-md flex items-center justify-center gap-2 dark:bg-blue-600 dark:hover:bg-blue-700"><Check size={16} /> Sonuçları Göster</button>
        <button onClick={clearFilters} className="w-full text-center text-[11px] text-gray-500 hover:text-red-600 underline flex items-center justify-center gap-1 mt-2 dark:text-gray-400 dark:hover:text-red-400"><RotateCcw size={12}/> Filtreleri Temizle</button>
      </div>
    </div>
  );
}