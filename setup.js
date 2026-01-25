const fs = require("fs");
const path = require("path");

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  bold: "\x1b[1m",
};

console.log(
  colors.blue +
    colors.bold +
    "\n🚀 GELİŞMİŞ ARAÇ FİLTRELEME SİSTEMİ KURULUYOR...\n" +
    colors.reset,
);

const files = [
  // 1. FILTER SIDEBAR (Akıllı Hiyerarşik Filtreleme)
  {
    path: "components/FilterSidebar.tsx",
    content: `
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

    router.push(\`/search?\${params.toString()}\`);
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    if (currentCategorySlug) params.set('category', currentCategorySlug);
    router.push(\`/search?\${params.toString()}\`);
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
                    <option key={c.id} value={c.name}>{c.name} {facetCounts[c.name] ? \`(\${facetCounts[c.name]})\` : ''}</option>
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
                    <button key={r} onClick={() => updateFilter('room', filters.room === r ? '' : r)} className={\`text-[10px] border rounded-sm py-1.5 transition-all \${filters.room === r ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}\`}>{r}</button>
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
`,
  },
  // 2. BACKEND QUERY BUILDER (Gelişmiş Filtreleme Mantığı)
  {
    path: "lib/actions.ts",
    content: `
'use server'
import { createClient, createStaticClient } from '@/lib/supabase/server'
import { revalidatePath, unstable_cache } from 'next/cache'
import { adSchema } from '@/lib/schemas'
import { logActivity } from '@/lib/logger'
import { AdFormData } from '@/types'
import { analyzeAdContent } from '@/lib/moderation/engine'

// ... (createAdAction vs. önceki kodlar aynı kalır) ...
async function checkRateLimit(userId: string) {
    const supabase = await createClient();
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count } = await supabase.from('ads').select('*', { count: 'exact', head: true }).eq('user_id', userId).gte('created_at', oneDayAgo);
    return (count || 0) < 10;
}

export async function createAdAction(formData: Partial<AdFormData>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Oturum açmanız gerekiyor.' }

  if (!(await checkRateLimit(user.id))) return { error: 'Günlük ilan limiti dolu.' };

  const validation = adSchema.safeParse(formData);
  if (!validation.success) return { error: validation.error.issues[0].message };

  const analysis = analyzeAdContent(validation.data.title, validation.data.description);
  const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).single();
  if (!profile) await supabase.from('profiles').insert([{ id: user.id, email: user.email }]);

  const { data, error } = await supabase.from('ads').insert([{
    ...validation.data,
    user_id: user.id,
    status: 'onay_bekliyor',
    is_vitrin: false, is_urgent: false,
    moderation_score: analysis.score, moderation_tags: analysis.flags,
    admin_note: analysis.autoReject ? \`OTOMATİK RET: \${analysis.rejectReason}\` : null
  }]).select('id').single()

  if (error) return { error: \`Hata: \${error.message}\` }

  await logActivity(user.id, 'CREATE_AD', { adId: data.id, title: validation.data.title });
  if (analysis.autoReject) return { error: \`İlan reddedildi: \${analysis.rejectReason}\` };

  revalidatePath('/');
  return { success: true, adId: data.id }
}

// --- GELİŞMİŞ ARAMA MOTORU ---
export async function getAdsServer(searchParams: any) {
  const supabase = await createClient()
  const page = Number(searchParams?.page) || 1;
  const limit = 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase.from('ads').select('*, profiles(full_name), categories(title)', { count: 'exact' }).eq('status', 'yayinda');

  // 1. Temel Filtreler
  if (searchParams?.q) query = query.textSearch('fts', searchParams.q, { config: 'turkish', type: 'websearch' });
  if (searchParams?.minPrice) query = query.gte('price', searchParams.minPrice);
  if (searchParams?.maxPrice) query = query.lte('price', searchParams.maxPrice);
  if (searchParams?.city) query = query.eq('city', searchParams.city);

  // 2. Kategori Filtresi
  if (searchParams?.category) {
      const slug = searchParams.category;
      if (slug === 'emlak') query = query.or('category.ilike.konut%,category.ilike.isyeri%,category.ilike.arsa%');
      else if (slug === 'konut') query = query.ilike('category', 'konut%');
      else if (slug === 'vasita') query = query.or('category.eq.otomobil,category.eq.suv,category.eq.motosiklet');
      else query = query.eq('category', slug);
  }

  // 3. Araç Detaylı Filtreleri
  if (searchParams?.brand) query = query.eq('brand', searchParams.brand);
  if (searchParams?.series) query = query.eq('series', searchParams.series);
  if (searchParams?.model) query = query.eq('model', searchParams.model);

  if (searchParams?.minYear) query = query.gte('year', searchParams.minYear);
  if (searchParams?.maxYear) query = query.lte('year', searchParams.maxYear);

  if (searchParams?.minKm) query = query.gte('km', searchParams.minKm);
  if (searchParams?.maxKm) query = query.lte('km', searchParams.maxKm);

  if (searchParams?.gear) query = query.eq('gear', searchParams.gear);
  if (searchParams?.fuel) query = query.eq('fuel', searchParams.fuel);
  if (searchParams?.body_type) query = query.eq('body_type', searchParams.body_type);
  if (searchParams?.motor_power) query = query.eq('motor_power', searchParams.motor_power);
  if (searchParams?.engine_capacity) query = query.eq('engine_capacity', searchParams.engine_capacity);
  if (searchParams?.traction) query = query.eq('traction', searchParams.traction);
  if (searchParams?.color) query = query.eq('color', searchParams.color);
  if (searchParams?.vehicle_status) query = query.eq('vehicle_status', searchParams.vehicle_status);
  if (searchParams?.seller_type) query = query.eq('seller_type', searchParams.seller_type);
  if (searchParams?.plate_type) query = query.eq('plate_type', searchParams.plate_type);

  if (searchParams?.warranty) query = query.eq('warranty', searchParams.warranty === 'true');
  if (searchParams?.exchange) query = query.eq('exchange', searchParams.exchange === 'true');

  // 4. Emlak Detaylı Filtreleri
  if (searchParams?.room) query = query.eq('room', searchParams.room);
  if (searchParams?.minM2) query = query.gte('m2', searchParams.minM2);
  if (searchParams?.maxM2) query = query.lte('m2', searchParams.maxM2);

  // 5. Sıralama
  if (searchParams?.sort === 'price_asc') query = query.order('price', { ascending: true });
  else if (searchParams?.sort === 'price_desc') query = query.order('price', { ascending: false });
  else query = query.order('is_vitrin', { ascending: false }).order('created_at', { ascending: false });

  query = query.range(from, to);
  const { data, count, error } = await query;

  if (error) {
      console.error("Get Ads Error:", error);
      return { data: [], count: 0, totalPages: 0 };
  }
  return { data: data || [], count: count || 0, totalPages: count ? Math.ceil(count / limit) : 0 };
}

// ... (Diğer actionlar aynı kalacak, sadece getAdsServer güncellendi) ...
export const getCategoryTreeServer = unstable_cache(
  async () => {
    const supabase = createStaticClient();
    const { data } = await supabase.from('categories').select('*').order('title');
    if (!data) return [];
    const parents = data.filter(c => !c.parent_id);
    return parents.map(p => ({ ...p, subs: data.filter(c => c.parent_id === p.id) }));
  }, ['category-tree'], { revalidate: 3600 }
);

export async function getInfiniteAdsAction(page = 1, limit = 20) {
    const supabase = await createClient();
    const start = (page - 1) * limit;
    const end = start + limit - 1;
    const { data, count, error } = await supabase.from('ads').select('*, profiles(full_name)', { count: 'exact' }).eq('status', 'yayinda').order('is_vitrin', { ascending: false }).order('created_at', { ascending: false }).range(start, end);
    if (error) return { data: [], total: 0, hasMore: false };
    return { data: data || [], total: count || 0, hasMore: (count || 0) > end + 1 };
}
export async function getAdDetailServer(id: number) {
  const supabase = await createClient()
  const { data } = await supabase.from('ads').select('*, profiles(*), categories(title)').eq('id', id).single()
  return data
}
export async function updateAdAction(id: number, formData: any) {
    const supabase = await createClient();
    const { error } = await supabase.from('ads').update(formData).eq('id', id);
    if (error) return { error: error.message };
    revalidatePath('/bana-ozel/ilanlarim');
    return { success: true };
}
export async function approveAdAction(id: number) {
    const supabase = await createClient();
    const { error } = await supabase.from('ads').update({ status: 'yayinda' }).eq('id', id);
    if (error) return { success: false, error: error.message };
    return { success: true };
}
export async function rejectAdAction(id: number, reason: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('ads').update({ status: 'reddedildi', admin_note: reason }).eq('id', id);
    if (error) return { success: false, error: error.message };
    return { success: true };
}
export async function deleteAdSafeAction(adId: number) {
    const supabase = await createClient();
    await supabase.from('ads').update({ status: 'pasif' }).eq('id', adId);
    revalidatePath('/bana-ozel/ilanlarim');
    return { message: 'Silindi' };
}
export async function updateProfileAction(d: any) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Auth error' };
    const updates = { full_name: d.full_name, phone: d.phone, avatar_url: d.avatar_url, show_phone: d.show_phone };
    const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
    return { success: !error, error: error ? error.message : null };
}
export async function updatePasswordAction(password: string) {
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({ password });
    return { success: !error, error: error?.message };
}
export async function getAdFavoriteCount(adId: number) {
    const supabase = await createClient();
    const { count } = await supabase.from('favorites').select('*', { count: 'exact', head: true }).eq('ad_id', adId);
    return count || 0;
}
export async function getMyStoreServer() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from('stores').select('*').eq('user_id', user.id).single();
  return data;
}
export async function createStoreAction(formData: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Oturum açmanız gerekiyor.' };
  const { error } = await supabase.from('stores').insert([{ ...formData, user_id: user.id }]);
  if (error) return { error: 'Hata oluştu.' };
  await supabase.from('profiles').update({ role: 'store' }).eq('id', user.id);
  revalidatePath('/bana-ozel/magazam');
  return { success: true };
}
export async function updateStoreAction(formData: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Oturum açmanız gerekiyor.' };
  const { error } = await supabase.from('stores').update(formData).eq('user_id', user.id);
  if (error) return { error: 'Güncelleme başarısız.' };
  revalidatePath('/bana-ozel/magazam');
  return { success: true };
}
export async function getStoreBySlugServer(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase.from('stores').select('*').eq('slug', slug).single();
  return data;
}
export async function getStoreAdsServer(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase.from('ads').select('*').eq('user_id', userId).eq('status', 'yayinda');
  return data || [];
}
export async function getSellerReviewsServer(id: string) {
    const supabase = await createClient();
    const { data } = await supabase.from('reviews').select('*').eq('target_user_id', id);
    return data || [];
}
export async function createReviewAction(targetId: string, rating: number, comment: string, adId: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Giriş gerekli' };
    await supabase.from('reviews').insert({ target_user_id: targetId, reviewer_id: user.id, rating, comment, ad_id: adId });
    return { success: true };
}
export async function getRelatedAdsServer(cat: string, id: number, price?: number) {
    const supabase = await createClient();
    const { data } = await supabase.from('ads').select('*').eq('category', cat).neq('id', id).limit(4);
    return data || [];
}
export async function incrementViewCountAction(id: number) {
    const supabase = await createClient();
    await supabase.rpc('increment_view_count', { ad_id_input: id });
}
export async function getUserDashboardStats() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data } = await supabase.from('ads').select('status, view_count, price').eq('user_id', user.id);
    return data || [];
}
export async function activateDopingAction(id: number, types: string[]) { return { success: true } }
export async function createReportAction(id: number, r: string, d: string) { return { success: true } }
export async function getAuditLogsServer() {
    const supabase = await createClient();
    const { data } = await supabase.from('audit_logs').select('*, profiles(full_name, email)').order('created_at', { ascending: false }).limit(100);
    return data || [];
}
export async function getAdminStatsServer() {
    return { totalUsers: 150, activeAds: 45, totalRevenue: 12500 };
}
export async function getAdsByIds(ids: number[]) {
    if(!ids.length) return [];
    const supabase = await createClient();
    const { data } = await supabase.from('ads').select('*').in('id', ids);
    return data || [];
}
export async function getPageBySlugServer(slug: string) {
    return { title: 'Sayfa Başlığı', content: '<p>İçerik...</p>' };
}
export async function getHelpContentServer() {
    return { categories: [], faqs: [] };
}
export async function getLocationsServer() {
    const supabase = createStaticClient();
    const { data } = await supabase.from('provinces').select('*').order('name');
    if (!data || data.length === 0) {
        return [
            { id: 34, name: 'İstanbul' }, { id: 6, name: 'Ankara' }, { id: 35, name: 'İzmir' },
            { id: 7, name: 'Antalya' }, { id: 16, name: 'Bursa' }
        ];
    }
    return data;
}
export async function getDistrictsServer(cityName: string) {
    const supabase = createStaticClient();
    const { data: province } = await supabase.from('provinces').select('id').eq('name', cityName).single();
    if (!province) return [];
    const { data } = await supabase.from('districts').select('*').eq('province_id', province.id).order('name');
    return data || [];
}
export async function getFacetCountsServer() {
    const supabase = createStaticClient();
    const { data, error } = await supabase.rpc('get_ad_counts_by_city');
    if (error) return [];
    return data as { city_name: string; count: number }[];
}
`,
  },
];

files.forEach((file) => {
  try {
    const dir = path.dirname(file.path);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(process.cwd(), file.path), file.content.trim());
    console.log(
      colors.green + "✔ " + file.path + " güncellendi." + colors.reset,
    );
  } catch (error) {
    console.error(
      colors.bold + "✘ Hata: " + file.path + " yazılamadı." + colors.reset,
    );
  }
});

console.log(
  colors.blue +
    colors.bold +
    "\n✅ İŞLEM TAMAMLANDI! ARTIK ARAÇLARI TÜM DETAYLARIYLA FİLTRELEYEBİLİRSİNİZ." +
    colors.reset,
);
