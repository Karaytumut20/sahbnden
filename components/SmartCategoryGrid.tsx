"use client";
import React from 'react';
import Link from 'next/link';
import { ChevronRight, LayoutGrid, List, Search } from 'lucide-react';
import { categoryTree, carHierarchy, computerBrands } from '@/lib/hierarchyData';

// Yardımcı Fonksiyon: Slug'a göre kategori bulma
function findCategoryBySlug(cats: any[], slug: string): any {
  for (const cat of cats) {
    if (cat.slug === slug) return cat;
    if (cat.subs) {
      const found = findCategoryBySlug(cat.subs, slug);
      if (found) return found;
    }
  }
  return null;
}

export default function SmartCategoryGrid({ searchParams }: { searchParams: any }) {
  const currentSlug = searchParams.category;
  const currentBrand = searchParams.brand;
  const currentSeries = searchParams.series;

  // 1. Hangi seviyedeyiz?
  const categoryNode = currentSlug ? findCategoryBySlug(categoryTree, currentSlug) : null;

  // EĞER KATEGORİ SEÇİLMEDİYSE -> ANA KATEGORİLERİ GÖSTER
  if (!categoryNode) {
    return <GridDisplay items={categoryTree} type="category" parentParams={searchParams} title="Kategoriler" />;
  }

  // 2. Alt kategorileri var mı? (Örn: Emlak -> Konut)
  if (categoryNode.subs && categoryNode.subs.length > 0) {
    return (
        <GridDisplay
            items={categoryNode.subs}
            type="category"
            parentParams={searchParams}
            title={`${categoryNode.title} Alt Kategorileri`}
            listAllLabel={`Tüm ${categoryNode.title} İlanlarını Listele`}
        />
    );
  }

  // 3. Dinamik Araç Kategorisi mi? (Otomobil, SUV vb.)
  if (categoryNode.isDynamic && categoryNode.dynamicType === 'car') {

      // A. MARKA SEÇİMİ (Marka yoksa markaları göster)
      if (!currentBrand) {
          const brands = Object.keys(carHierarchy).sort().map(b => ({ id: b, title: b, slug: b }));
          return (
            <GridDisplay
                items={brands}
                type="brand"
                parentParams={searchParams}
                title="Marka Seçiniz"
                listAllLabel="Tüm İlanları Listele"
            />
          );
      }

      // B. SERİ SEÇİMİ (Marka var, Seri yoksa serileri göster)
      if (currentBrand && !currentSeries) {
          const series = Object.keys(carHierarchy[currentBrand] || {}).sort().map(s => ({ id: s, title: s, slug: s }));

          if (series.length > 0) {
             return (
                <GridDisplay
                    items={series}
                    type="series"
                    parentParams={searchParams}
                    title={`${currentBrand} Modelleri`}
                    listAllLabel={`Tüm ${currentBrand} İlanlarını Listele`}
                />
             );
          }
      }

      // C. MODEL SEÇİMİ (Seri var, Model yoksa modelleri göster)
      if (currentBrand && currentSeries && !searchParams.model) {
          const models = (carHierarchy[currentBrand][currentSeries] || []).sort().map(m => ({ id: m, title: m, slug: m }));

          if (models.length > 0) {
             return (
                <GridDisplay
                    items={models}
                    type="model"
                    parentParams={searchParams}
                    title={`${currentBrand} ${currentSeries} Alt Modeller`}
                    listAllLabel={`Tüm ${currentBrand} ${currentSeries} İlanlarını Listele`}
                />
             );
          }
      }
  }

  // 4. Dinamik Bilgisayar Kategorisi mi?
  if (categoryNode.isDynamic && categoryNode.dynamicType === 'computer') {
      if (!currentBrand) {
          const brands = computerBrands.sort().map(b => ({ id: b, title: b, slug: b.toLowerCase() }));
          return (
            <GridDisplay
                items={brands}
                type="brand"
                parentParams={searchParams}
                title="Marka Seçiniz"
                listAllLabel="Tüm Bilgisayar İlanlarını Listele"
            />
          );
      }
  }

  return null;
}

// --- GRID GÖRÜNÜM BİLEŞENİ ---
function GridDisplay({ items, type, parentParams, title, listAllLabel }: any) {

  // "Hepsini Listele" linki oluşturma
  const listAllParams = new URLSearchParams(parentParams);
  listAllParams.set('showResults', 'true'); // Bu parametre SearchPage'de tetikleyici görevi görür

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <LayoutGrid className="text-indigo-600" size={24} />
          {title}
        </h2>

        {/* HEPSİNİ LİSTELE BUTONU */}
        {listAllLabel && (
            <Link
                href={`/search?${listAllParams.toString()}`}
                className="bg-slate-800 text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-slate-700 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
            >
                <List size={16} className="text-slate-300 group-hover:text-white" />
                {listAllLabel}
            </Link>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {items.map((item: any) => {
          // Link oluşturma mantığı
          const params = new URLSearchParams(parentParams);

          if (type === 'category') params.set('category', item.slug);
          else if (type === 'brand') params.set('brand', item.title);
          else if (type === 'series') params.set('series', item.title);
          else if (type === 'model') params.set('model', item.title);

          return (
            <Link
              key={item.id}
              href={`/search?${params.toString()}`}
              className="flex flex-col items-center justify-center p-4 border border-gray-100 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 hover:shadow-lg transition-all group text-center h-28 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight size={16} className="text-indigo-600" />
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-white group-hover:text-indigo-600 transition-colors text-gray-500 font-bold text-lg shadow-sm">
                {item.title.charAt(0).toUpperCase()}
              </div>
              <span className="font-bold text-gray-700 text-sm group-hover:text-indigo-700 line-clamp-2 leading-tight">
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}