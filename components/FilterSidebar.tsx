"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Filter,
  Check,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { categories } from "@/lib/data"; // Kategorileri veriden çekiyoruz

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategorySlug = searchParams.get("category");

  // URL'den gelen değerlerle state'i başlat
  const [filters, setFilters] = useState({
    city: searchParams.get("city") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    room: searchParams.get("room") || "",
    minYear: searchParams.get("minYear") || "",
    maxYear: searchParams.get("maxYear") || "",
    maxKm: searchParams.get("maxKm") || "",
  });

  // Kategori ağacında gezinerek aktif kategoriyi ve üst kategorisini bulma fonksiyonu
  const findCategoryData = (
    cats: any[],
    slug: string | null,
  ): { active: any; parent: any } | null => {
    if (!slug) return null;
    for (const cat of cats) {
      if (cat.slug === slug) return { active: cat, parent: null };
      if (cat.subs) {
        // Alt kategorilerde ara
        for (const sub of cat.subs) {
          if (sub.slug === slug) return { active: sub, parent: cat };
          // Daha derin (3. seviye) ara
          if (sub.subs) {
            const found = findCategoryData(sub.subs, slug);
            if (found && found.active.slug === slug)
              return { active: found.active, parent: sub };
            // Recursive mantık yerine 3 seviye yeterli, daha derin gerekirse recursive yapılabilir.
            // Şimdilik setup.js yapısına uygun 3 seviye kontrolü:
            const deepSearch = sub.subs.find((s: any) => s.slug === slug);
            if (deepSearch) return { active: deepSearch, parent: sub };
          }
        }
      }
    }
    return null;
  };

  const categoryData = findCategoryData(categories, currentCategorySlug);
  const activeCategory = categoryData?.active;
  const parentCategory = categoryData?.parent;

  // Gösterilecek alt kategoriler: Eğer aktif kategorinin altı varsa onu, yoksa (en alttaysak) kardeşlerini veya kendisini göster
  // Strateji:
  // 1. Kategori seçili değilse -> Ana kategorileri göster.
  // 2. Seçili kategorinin alt kategorileri (subs) varsa -> Onları göster.
  // 3. Seçili kategorinin altı yoksa (yaprak) -> Üst kategorinin altlarını (kardeşlerini) göster.

  let displayedSubCategories = categories; // Varsayılan: Ana kategoriler
  let listTitle = "Kategoriler";

  if (currentCategorySlug) {
    if (
      activeCategory &&
      activeCategory.subs &&
      activeCategory.subs.length > 0
    ) {
      displayedSubCategories = activeCategory.subs;
      listTitle = activeCategory.title;
    } else if (parentCategory) {
      displayedSubCategories = parentCategory.subs || [];
      listTitle = parentCategory.title;
    }
  }

  // URL değiştiğinde state'i güncelle
  useEffect(() => {
    setFilters({
      city: searchParams.get("city") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      room: searchParams.get("room") || "",
      minYear: searchParams.get("minYear") || "",
      maxYear: searchParams.get("maxYear") || "",
      maxKm: searchParams.get("maxKm") || "",
    });
  }, [searchParams]);

  const handleChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    params.delete("page");
    router.push(`/search?${params.toString()}`);
  };

  const handleCategoryClick = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("category", slug);
    params.delete("page"); // Sayfayı sıfırla
    router.push(`/search?${params.toString()}`);
  };

  const handleParentClick = () => {
    if (parentCategory) {
      handleCategoryClick(parentCategory.slug);
    } else {
      router.push("/search");
    }
  };

  const clearFilters = () => {
    setFilters({
      city: "",
      minPrice: "",
      maxPrice: "",
      room: "",
      minYear: "",
      maxYear: "",
      maxKm: "",
    });
    const params = new URLSearchParams();
    if (currentCategorySlug) params.set("category", currentCategorySlug);
    router.push(`/search?${params.toString()}`);
  };

  // Dinamik input kontrolü (Sadece ilgili kategorilerde göster)
  const isEmlak =
    currentCategorySlug?.includes("konut") ||
    currentCategorySlug?.includes("emlak") ||
    currentCategorySlug?.includes("arsa") ||
    currentCategorySlug?.includes("is-yeri");
  const isVasita =
    currentCategorySlug?.includes("vasita") ||
    currentCategorySlug?.includes("oto") ||
    currentCategorySlug?.includes("motosiklet");

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-4 sticky top-20 dark:bg-[#1c1c1c] dark:border-gray-700 transition-colors">
      {/* KATEGORİ NAVİGASYONU */}
      <div className="mb-6">
        <h3 className="font-bold text-[#333] text-sm mb-3 border-b border-gray-100 pb-2 dark:text-white dark:border-gray-700">
          {listTitle}
        </h3>

        {/* Üst Kategoriye Dönüş Butonu */}
        {currentCategorySlug && (
          <button
            onClick={handleParentClick}
            className="flex items-center gap-1 text-xs text-blue-600 font-bold mb-2 hover:underline"
          >
            <ChevronLeft size={14} />{" "}
            {parentCategory ? parentCategory.title : "Tüm Kategoriler"}
          </button>
        )}

        <ul className="space-y-1">
          {displayedSubCategories.map((sub: any) => (
            <li key={sub.id}>
              <button
                onClick={() => handleCategoryClick(sub.slug)}
                className={`w-full text-left text-[13px] px-2 py-1.5 rounded-sm flex items-center justify-between group transition-colors ${currentCategorySlug === sub.slug ? "bg-blue-50 text-blue-700 font-bold" : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"}`}
              >
                {sub.title}
                {currentCategorySlug === sub.slug && <Check size={14} />}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* FİLTRELER */}
      <h3 className="font-bold text-[#333] text-sm mb-4 flex items-center gap-2 border-b border-gray-100 pb-2 dark:text-white dark:border-gray-700">
        <Filter size={16} /> Detaylı Filtreleme
      </h3>

      <div className="space-y-4">
        {/* Ortak Alanlar */}
        <div>
          <label className="text-[11px] font-bold text-gray-500 mb-1 block dark:text-gray-400">
            ADRES
          </label>
          <select
            value={filters.city}
            onChange={(e) => handleChange("city", e.target.value)}
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
          <label className="text-[11px] font-bold text-gray-500 mb-1 block dark:text-gray-400">
            FİYAT (TL)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => handleChange("minPrice", e.target.value)}
              className="w-full border border-gray-300 rounded-sm text-[12px] p-2 outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => handleChange("maxPrice", e.target.value)}
              className="w-full border border-gray-300 rounded-sm text-[12px] p-2 outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-500"
            />
          </div>
        </div>

        {/* Emlak Özel Filtreleri */}
        {isEmlak && (
          <div className="border-t border-gray-100 pt-3 dark:border-gray-700 animate-in fade-in">
            <label className="text-[11px] font-bold text-gray-500 mb-1 block dark:text-gray-400">
              ODA SAYISI
            </label>
            <select
              value={filters.room}
              onChange={(e) => handleChange("room", e.target.value)}
              className="w-full border border-gray-300 rounded-sm text-[12px] p-2 focus:border-blue-500 outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            >
              <option value="">Hepsi</option>
              <option value="1+0">1+0</option>
              <option value="1+1">1+1</option>
              <option value="2+1">2+1</option>
              <option value="3+1">3+1</option>
              <option value="4+1">4+1</option>
            </select>
          </div>
        )}

        {/* Vasıta Özel Filtreleri */}
        {isVasita && (
          <>
            <div className="border-t border-gray-100 pt-3 dark:border-gray-700 animate-in fade-in">
              <label className="text-[11px] font-bold text-gray-500 mb-1 block dark:text-gray-400">
                YIL
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minYear}
                  onChange={(e) => handleChange("minYear", e.target.value)}
                  className="w-full border border-gray-300 rounded-sm text-[12px] p-2 outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxYear}
                  onChange={(e) => handleChange("maxYear", e.target.value)}
                  className="w-full border border-gray-300 rounded-sm text-[12px] p-2 outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>
            <div className="border-t border-gray-100 pt-3 dark:border-gray-700 animate-in fade-in">
              <label className="text-[11px] font-bold text-gray-500 mb-1 block dark:text-gray-400">
                KİLOMETRE (MAX)
              </label>
              <input
                type="number"
                placeholder="Örn: 100000"
                value={filters.maxKm}
                onChange={(e) => handleChange("maxKm", e.target.value)}
                className="w-full border border-gray-300 rounded-sm text-[12px] p-2 outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>
          </>
        )}

        <button
          onClick={applyFilters}
          className="w-full bg-blue-700 text-white text-[13px] font-bold py-2.5 mt-4 rounded-sm hover:bg-blue-800 transition-colors shadow-md flex items-center justify-center gap-2 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          <Check size={16} /> Sonuçları Göster
        </button>

        <button
          onClick={clearFilters}
          className="w-full text-center text-[11px] text-gray-500 hover:text-red-600 underline flex items-center justify-center gap-1 mt-2 dark:text-gray-400 dark:hover:text-red-400"
        >
          <RotateCcw size={12} /> Filtreleri Temizle
        </button>
      </div>
    </div>
  );
}
