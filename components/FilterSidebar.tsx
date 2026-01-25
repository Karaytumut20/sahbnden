"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, Check, RotateCcw, ChevronDown, ChevronUp, Loader2, Search, ArrowRight } from 'lucide-react';
import { getLocationsServer, getFacetCountsServer } from '@/lib/actions';
import { carHierarchy } from '@/lib/hierarchyData';
import {
  fuelTypes, gearTypes, vehicleStatuses, bodyTypes,
  motorPowers, engineCapacities, tractions, colors, sellerTypes, plateTypes
} from '@/lib/constants';

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL'den gelenler
  const currentCategorySlug = searchParams.get('category');
  const currentBrand = searchParams.get('brand');
  const currentSeries = searchParams.get('series');

  const [provinces, setProvinces] = useState<any[]>([]);
  const [facetCounts, setFacetCounts] = useState<Record<string, number>>({});
  const [loadingLoc, setLoadingLoc] = useState(true);

  // Yerel Filtre State'i (Anlık olarak URL'i değiştirmesin, butona basınca değişsin)
  const [filters, setFilters] = useState<any>({});

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
      location: true, vehicle_basic: true, vehicle_tech: false, vehicle_details: false, real_estate: true, computer: true
  });

  useEffect(() => {
    async function initData() {
        try {
            const [locs, counts] = await Promise.all([getLocationsServer(), getFacetCountsServer()]);
            setProvinces(locs);
            const countMap: Record<string, number> = {};
            if (counts) counts.forEach((c: any) => { countMap[c.city_name] = c.count; });
            setFacetCounts(countMap);
        } catch (e) { console.error(e); } finally { setLoadingLoc(false); }
    }
    initData();
  }, []);

  // URL değişince local state'i senkronize et
  useEffect(() => {
    const newFilters: any = {};
    searchParams.forEach((value, key) => { newFilters[key] = value; });
    setFilters(newFilters);
  }, [searchParams]);

  const updateFilter = (key: string, value: string) => {
      setFilters((prev: any) => {
          const next = { ...prev, [key]: value };
          if (!value) delete next[key];
          return next;
      });
  };

  // Bu fonksiyon SADECE yerel state'i günceller, sayfayı yenilemez.
  const handleBrandChangeLocal = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const brand = e.target.value;
      updateFilter('brand', brand);
      updateFilter('series', ''); // Marka değişince seri sıfırlanır
      updateFilter('model', '');
  };

  // SORGULAMA BUTONU (Kritik Nokta)
  const applyFilters = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
        if (value) params.set(key, value as string);
    });

    // "Sonuçları Göster" bayrağı ekle ki SearchPage ilanları getirsin
    params.set('showResults', 'true');

    router.push(`/search?${params.toString()}`);
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    if (currentCategorySlug) params.set('category', currentCategorySlug);
    router.push(`/search?${params.toString()}`);
  };

  const toggleSection = (key: string) => setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));

  // Dinamik Listeler (Yerel State'e göre hesaplanır)
  const selectedBrandLocal = filters.brand || '';
  const selectedSeriesLocal = filters.series || '';

  const brandList = Object.keys(carHierarchy).sort();
  const seriesList = selectedBrandLocal ? Object.keys(carHierarchy[selectedBrandLocal] || {}).sort() : [];
  const modelList = selectedBrandLocal && selectedSeriesLocal ? (carHierarchy[selectedBrandLocal][selectedSeriesLocal] || []).sort() : [];

  const isVehicle = currentCategorySlug?.includes('vasita') || currentCategorySlug?.includes('otomobil') || currentCategorySlug?.includes('suv') || filters.brand; // Marka seçildiyse de araçtır

  const FilterSection = ({ id, title, children }: { id: string, title: string, children: React.ReactNode }) => (
      <div className="border-b border-gray-100 py-4 last:border-0">
          <button onClick={() => toggleSection(id)} className="flex items-center justify-between w-full text-left mb-2 group">
              <span className="text-[12px] font-bold text-gray-700 uppercase tracking-wide group-hover:text-blue-700 transition-colors">{title}</span>
              {expandedSections[id] ? <ChevronUp size={14} className="text-gray-400"/> : <ChevronDown size={14} className="text-gray-400"/>}
          </button>
          {expandedSections[id] && <div className="space-y-3 pt-1 animate-in slide-in-from-top-1 duration-200">{children}</div>}
      </div>
  );

  const SelectInput = ({ label, name, options }: { label: string, name: string, options: string[] }) => (
      <div>
          <label className="text-[10px] font-bold text-gray-500 mb-1 block">{label}</label>
          <select value={filters[name] || ''} onChange={(e) => updateFilter(name, e.target.value)} className="w-full border border-gray-300 rounded-sm text-[11px] h-8 px-2 focus:border-blue-500 outline-none bg-white">
              <option value="">Tümü</option>
              {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
      </div>
  );

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-4 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-thin">

      {/* AKSİYON BUTONU */}
      <div className="mb-6 bg-blue-50 p-3 rounded-lg border border-blue-100">
        <h3 className="font-bold text-blue-900 text-sm mb-2 flex items-center gap-2"><Filter size={16} /> Arama Kriterleri</h3>
        <button onClick={applyFilters} className="w-full bg-blue-600 text-white text-[13px] font-bold py-2.5 rounded hover:bg-blue-700 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 active:scale-95">
            <Search size={16} /> Sonuçları Listele
        </button>
        <button onClick={clearFilters} className="w-full text-center text-[10px] text-gray-500 hover:text-red-600 underline mt-2 flex items-center justify-center gap-1">
            <RotateCcw size={10}/> Tümünü Temizle
        </button>
      </div>

      <FilterSection id="location" title="Konum & Fiyat">
          <div>
            <label className="text-[10px] font-bold text-gray-500 mb-1 block flex justify-between"><span>İL</span> {loadingLoc && <Loader2 size={10} className="animate-spin"/>}</label>
            <select value={filters.city || ''} onChange={(e) => updateFilter('city', e.target.value)} className="w-full border border-gray-300 rounded-sm text-[11px] h-8 px-2 focus:border-blue-500 outline-none bg-white" disabled={loadingLoc}>
                <option value="">Tüm İller</option>
                {provinces.map((c: any) => (<option key={c.id} value={c.name}>{c.name} {facetCounts[c.name] ? `(${facetCounts[c.name]})` : ''}</option>))}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-500 mb-1 block">FİYAT (TL)</label>
            <div className="flex gap-2">
                <input type="number" placeholder="Min" value={filters.minPrice || ''} onChange={(e) => updateFilter('minPrice', e.target.value)} className="w-full border border-gray-300 rounded-sm text-[11px] h-8 px-2 outline-none focus:border-blue-500" />
                <input type="number" placeholder="Max" value={filters.maxPrice || ''} onChange={(e) => updateFilter('maxPrice', e.target.value)} className="w-full border border-gray-300 rounded-sm text-[11px] h-8 px-2 outline-none focus:border-blue-500" />
            </div>
          </div>
      </FilterSection>

      {/* Sadece araç kategorisi seçiliyse veya bir araç markası seçildiyse göster */}
      {isVehicle && (
        <>
          <FilterSection id="vehicle_basic" title="Araç Seçimi">
             <div>
                 <label className="text-[10px] font-bold text-gray-500 mb-1 block">MARKA</label>
                 <select value={selectedBrandLocal} onChange={handleBrandChangeLocal} className="w-full border border-gray-300 rounded-sm text-[11px] h-8 px-2 focus:border-blue-500 outline-none bg-white">
                     <option value="">Seçiniz</option>
                     {brandList.map(b => <option key={b} value={b}>{b}</option>)}
                 </select>
             </div>

             <div>
                 <label className="text-[10px] font-bold text-gray-500 mb-1 block">SERİ</label>
                 <select value={selectedSeriesLocal} onChange={(e) => { updateFilter('series', e.target.value); updateFilter('model', ''); }} disabled={!selectedBrandLocal} className="w-full border border-gray-300 rounded-sm text-[11px] h-8 px-2 focus:border-blue-500 outline-none bg-white disabled:bg-gray-100 disabled:text-gray-400">
                     <option value="">Seçiniz</option>
                     {seriesList.map(s => <option key={s} value={s}>{s}</option>)}
                 </select>
             </div>

             <div>
                 <label className="text-[10px] font-bold text-gray-500 mb-1 block">MODEL</label>
                 <select value={filters.model || ''} onChange={(e) => updateFilter('model', e.target.value)} disabled={!selectedSeriesLocal} className="w-full border border-gray-300 rounded-sm text-[11px] h-8 px-2 focus:border-blue-500 outline-none bg-white disabled:bg-gray-100 disabled:text-gray-400">
                     <option value="">Seçiniz</option>
                     {modelList.map(m => <option key={m} value={m}>{m}</option>)}
                 </select>
             </div>

             <div><label className="text-[10px] font-bold text-gray-500 mb-1 block">YIL</label><div className="flex gap-2"><input type="number" placeholder="Min" value={filters.minYear || ''} onChange={(e) => updateFilter('minYear', e.target.value)} className="w-full border border-gray-300 rounded-sm text-[11px] h-8 px-2 outline-none focus:border-blue-500" /><input type="number" placeholder="Max" value={filters.maxYear || ''} onChange={(e) => updateFilter('maxYear', e.target.value)} className="w-full border border-gray-300 rounded-sm text-[11px] h-8 px-2 outline-none focus:border-blue-500" /></div></div>
          </FilterSection>

          <FilterSection id="vehicle_tech" title="Araç Özellikleri">
              <SelectInput label="YAKIT" name="fuel" options={fuelTypes} />
              <SelectInput label="VİTES" name="gear" options={gearTypes} />
              <SelectInput label="KASA TİPİ" name="body_type" options={bodyTypes} />
              <SelectInput label="RENK" name="color" options={colors} />
              <SelectInput label="KİMDEN" name="seller_type" options={sellerTypes} />
          </FilterSection>
        </>
      )}
    </div>
  );
}