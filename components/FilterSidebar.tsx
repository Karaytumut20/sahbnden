"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, Check, RotateCcw, ChevronLeft, Car, Home, MapPin, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { categories } from '@/lib/data';
import { getLocationsServer, getFacetCountsServer } from '@/lib/actions';
import { carHierarchy } from '@/lib/carData';
import {
  fuelTypes, gearTypes, vehicleStatuses, bodyTypes,
  motorPowers, engineCapacities, tractions, colors, sellerTypes, plateTypes
} from '@/lib/constants';

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategorySlug = searchParams.get('category');

  const [provinces, setProvinces] = useState<any[]>([]);
  const [facetCounts, setFacetCounts] = useState<Record<string, number>>({});
  const [loadingLoc, setLoadingLoc] = useState(true);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
      location: true,
      price: true,
      vehicle_basic: true,
      vehicle_tech: false,
      vehicle_details: false,
      real_estate: true
  });

  // Filtre State'leri
  const [filters, setFilters] = useState<any>({});

  // Seçili Araç Hiyerarşisi (Dropdownları yönetmek için)
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || '');
  const [selectedSeries, setSelectedSeries] = useState(searchParams.get('series') || '');

  useEffect(() => {
    async function initData() {
        try {
            const [locs, counts] = await Promise.all([
                getLocationsServer(),
                getFacetCountsServer()
            ]);
            setProvinces(locs);
            const countMap: Record<string, number> = {};
            if (counts) {
                counts.forEach((c: any) => { countMap[c.city_name] = c.count; });
            }
            setFacetCounts(countMap);
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingLoc(false);
        }
    }
    initData();
  }, []);

  // URL değiştikçe state'i güncelle
  useEffect(() => {
    const newFilters: any = {};
    searchParams.forEach((value, key) => { newFilters[key] = value; });
    setFilters(newFilters);
    setSelectedBrand(searchParams.get('brand') || '');
    setSelectedSeries(searchParams.get('series') || '');
  }, [searchParams]);

  const updateFilter = (key: string, value: string) => {
      setFilters((prev: any) => {
          const next = { ...prev, [key]: value };
          if (!value) delete next[key];
          return next;
      });
  };

  // Marka değişince Seri ve Model sıfırlanmalı
  const handleBrandChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const brand = e.target.value;
      setSelectedBrand(brand);
      setSelectedSeries('');

      const newFilters = { ...filters, brand, series: '', model: '' };
      if (!brand) delete newFilters.brand;
      delete newFilters.series;
      delete newFilters.model;

      setFilters(newFilters);
  };

  // Seri değişince Model sıfırlanmalı
  const handleSeriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const series = e.target.value;
      setSelectedSeries(series);

      const newFilters = { ...filters, series, model: '' };
      if (!series) delete newFilters.series;
      delete newFilters.model;

      setFilters(newFilters);
  };

  const applyFilters = () => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value as string);
    });
    // Kategori korunmalı
    if (currentCategorySlug) params.set('category', currentCategorySlug);

    router.push(`/search?${params.toString()}`);
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    if (currentCategorySlug) params.set('category', currentCategorySlug);
    router.push(`/search?${params.toString()}`);
  };

  const toggleSection = (key: string) => {
      setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const isRealEstate = currentCategorySlug?.includes('konut') || currentCategorySlug?.includes('emlak');
  const isVehicle = currentCategorySlug?.includes('vasita') || currentCategorySlug?.includes('otomobil') || currentCategorySlug?.includes('suv');

  // Dinamik Araç Listeleri
  const brandList = Object.keys(carHierarchy).sort();
  const seriesList = selectedBrand ? Object.keys(carHierarchy[selectedBrand] || {}).sort() : [];
  const modelList = selectedBrand && selectedSeries ? (carHierarchy[selectedBrand][selectedSeries] || []).sort() : [];

  const FilterSection = ({ id, title, children }: { id: string, title: string, children: React.ReactNode }) => (
      <div className="border-b border-gray-100 py-3 last:border-0">
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
          <select
            value={filters[name] || ''}
            onChange={(e) => updateFilter(name, e.target.value)}
            className="w-full border border-gray-300 rounded-sm text-[11px] h-8 px-2 focus:border-blue-500 outline-none bg-white"
          >
              <option value="">Tümü</option>
              {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
      </div>
  );

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-4 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto scrollbar-thin">

      <h3 className="font-bold text-[#333] text-sm mb-4 flex items-center gap-2 border-b border-gray-200 pb-3">
        <Filter size={16} /> Detaylı Filtreleme
      </h3>

      {/* 1. ADRES & FİYAT */}
      <FilterSection id="location" title="Konum & Fiyat">
          <div>
            <label className="text-[10px] font-bold text-gray-500 mb-1 block flex justify-between">
                <span>İL</span> {loadingLoc && <Loader2 size={10} className="animate-spin"/>}
            </label>
            <select
                value={filters.city || ''}
                onChange={(e) => updateFilter('city', e.target.value)}
                className="w-full border border-gray-300 rounded-sm text-[11px] h-8 px-2 focus:border-blue-500 outline-none bg-white"
                disabled={loadingLoc}
            >
                <option value="">Tüm İller</option>
                {provinces.map((c: any) => (
                    <option key={c.id} value={c.name}>{c.name} {facetCounts[c.name] ? `(${facetCounts[c.name]})` : ''}</option>
                ))}
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

      {/* 2. ARAÇ FİLTRELERİ */}
      {isVehicle && (
        <>
          <FilterSection id="vehicle_basic" title="Araç Bilgileri">
             {/* Marka */}
             <div>
                <label className="text-[10px] font-bold text-gray-500 mb-1 block">MARKA</label>
                <select value={selectedBrand} onChange={handleBrandChange} className="w-full border border-gray-300 rounded-sm text-[11px] h-8 px-2 focus:border-blue-500 outline-none bg-white">
                    <option value="">Tümü</option>
                    {brandList.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
             </div>

             {/* Seri */}
             <div>
                <label className="text-[10px] font-bold text-gray-500 mb-1 block">SERİ</label>
                <select value={selectedSeries} onChange={handleSeriesChange} disabled={!selectedBrand} className="w-full border border-gray-300 rounded-sm text-[11px] h-8 px-2 focus:border-blue-500 outline-none bg-white disabled:bg-gray-100">
                    <option value="">Tümü</option>
                    {seriesList.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
             </div>

             {/* Model */}
             <div>
                <label className="text-[10px] font-bold text-gray-500 mb-1 block">MODEL</label>
                <select value={filters.model || ''} onChange={(e) => updateFilter('model', e.target.value)} disabled={!selectedSeries} className="w-full border border-gray-300 rounded-sm text-[11px] h-8 px-2 focus:border-blue-500 outline-none bg-white disabled:bg-gray-100">
                    <option value="">Tümü</option>
                    {modelList.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
             </div>

             {/* Yıl */}
             <div>
                <label className="text-[10px] font-bold text-gray-500 mb-1 block">YIL</label>
                <div className="flex gap-2">
                    <input type="number" placeholder="Min" value={filters.minYear || ''} onChange={(e) => updateFilter('minYear', e.target.value)} className="w-full border border-gray-300 rounded-sm text-[11px] h-8 px-2 outline-none focus:border-blue-500" />
                    <input type="number" placeholder="Max" value={filters.maxYear || ''} onChange={(e) => updateFilter('maxYear', e.target.value)} className="w-full border border-gray-300 rounded-sm text-[11px] h-8 px-2 outline-none focus:border-blue-500" />
                </div>
             </div>

             {/* KM */}
             <div>
                <label className="text-[10px] font-bold text-gray-500 mb-1 block">KİLOMETRE</label>
                <div className="flex gap-2">
                    <input type="number" placeholder="Min" value={filters.minKm || ''} onChange={(e) => updateFilter('minKm', e.target.value)} className="w-full border border-gray-300 rounded-sm text-[11px] h-8 px-2 outline-none focus:border-blue-500" />
                    <input type="number" placeholder="Max" value={filters.maxKm || ''} onChange={(e) => updateFilter('maxKm', e.target.value)} className="w-full border border-gray-300 rounded-sm text-[11px] h-8 px-2 outline-none focus:border-blue-500" />
                </div>
             </div>
          </FilterSection>

          <FilterSection id="vehicle_tech" title="Teknik Özellikler">
              <SelectInput label="YAKIT" name="fuel" options={fuelTypes} />
              <SelectInput label="VİTES" name="gear" options={gearTypes} />
              <SelectInput label="KASA TİPİ" name="body_type" options={bodyTypes} />
              <SelectInput label="MOTOR GÜCÜ" name="motor_power" options={motorPowers} />
              <SelectInput label="MOTOR HACMİ" name="engine_capacity" options={engineCapacities} />
              <SelectInput label="ÇEKİŞ" name="traction" options={tractions} />
          </FilterSection>

          <FilterSection id="vehicle_details" title="Diğer Özellikler">
              <SelectInput label="RENK" name="color" options={colors} />
              <SelectInput label="DURUMU" name="vehicle_status" options={vehicleStatuses} />
              <SelectInput label="KİMDEN" name="seller_type" options={sellerTypes} />

              <div>
                  <label className="text-[10px] font-bold text-gray-500 mb-1 block">GARANTİ</label>
                  <select value={filters.warranty || ''} onChange={(e) => updateFilter('warranty', e.target.value)} className="w-full border border-gray-300 rounded-sm text-[11px] h-8 px-2 focus:border-blue-500 outline-none bg-white">
                      <option value="">Tümü</option><option value="true">Evet</option><option value="false">Hayır</option>
                  </select>
              </div>
              <div>
                  <label className="text-[10px] font-bold text-gray-500 mb-1 block">TAKAS</label>
                  <select value={filters.exchange || ''} onChange={(e) => updateFilter('exchange', e.target.value)} className="w-full border border-gray-300 rounded-sm text-[11px] h-8 px-2 focus:border-blue-500 outline-none bg-white">
                      <option value="">Tümü</option><option value="true">Evet</option><option value="false">Hayır</option>
                  </select>
              </div>
          </FilterSection>
        </>
      )}

      {/* 3. EMLAK FİLTRELERİ */}
      {isRealEstate && (
        <FilterSection id="real_estate" title="Emlak Bilgileri">
            <div>
                <label className="text-[10px] font-bold text-gray-500 mb-1 block">ODA SAYISI</label>
                <div className="grid grid-cols-3 gap-1">
                {['1+1', '2+1', '3+1', '4+1', 'Villa'].map(r => (
                    <button key={r} onClick={() => updateFilter('room', filters.room === r ? '' : r)} className={`text-[10px] border rounded-sm py-1.5 transition-all ${filters.room === r ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}>{r}</button>
                ))}
                </div>
            </div>
            <div>
                <label className="text-[10px] font-bold text-gray-500 mb-1 block">M² (BRÜT)</label>
                <div className="flex gap-2">
                    <input type="number" placeholder="Min" value={filters.minM2 || ''} onChange={(e) => updateFilter('minM2', e.target.value)} className="w-full border border-gray-300 rounded-sm text-[11px] h-8 px-2 outline-none focus:border-blue-500" />
                    <input type="number" placeholder="Max" value={filters.maxM2 || ''} onChange={(e) => updateFilter('maxM2', e.target.value)} className="w-full border border-gray-300 rounded-sm text-[11px] h-8 px-2 outline-none focus:border-blue-500" />
                </div>
            </div>
        </FilterSection>
      )}

      {/* AKSİYONLAR */}
      <div className="pt-4 mt-4 border-t border-gray-200 sticky bottom-0 bg-white pb-2">
          <button onClick={applyFilters} className="w-full bg-blue-700 text-white text-[13px] font-bold py-2.5 rounded-sm hover:bg-blue-800 transition-colors shadow-md flex items-center justify-center gap-2">
              <Check size={16} /> Sonuçları Göster
          </button>
          <button onClick={clearFilters} className="w-full text-center text-[11px] text-gray-500 hover:text-red-600 underline flex items-center justify-center gap-1 mt-3">
              <RotateCcw size={12}/> Temizle
          </button>
      </div>

    </div>
  );
}