const fs = require("fs");
const path = require("path");

// Dosya oluşturma fonksiyonu
function createFile(filePath, content) {
  const targetPath = path.resolve(process.cwd(), filePath);
  fs.writeFileSync(targetPath, content, "utf8");
  console.log(`✅ Güncellendi: ${filePath}`);
}

// --- 1. ADIM: TAILWIND CONFIG (DARK MODE AYARI) ---
const tailwindConfig = `
import type { Config } from "tailwindcss";

export default {
  darkMode: 'class', // BU SATIR KRİTİK: Class tabanlı karanlık modu açar
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
} satisfies Config;
`;

// --- 2. ADIM: GLOBALS.CSS (TEMEL RENKLER) ---
const globalsCss = `
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #f6f7f9;
  --foreground: #171717;
}

/* Karanlık Mod Değişkenleri */
.dark {
  --background: #111827; /* gray-900 */
  --foreground: #f3f4f6; /* gray-100 */
}

@layer base {
  body {
    @apply bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300;
  }
}

/* Scrollbar Özelleştirme (Opsiyonel ama şık durur) */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  @apply bg-gray-300 rounded dark:bg-gray-600;
}
::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-400 dark:bg-gray-500;
}
`;

// --- 3. ADIM: SIDEBAR GÜNCELLEMESİ (DARK MODE UYUMLU) ---
const componentSidebarDark = `
"use client";
import React from 'react';
import Link from 'next/link';
import { Home, Car, Monitor, Briefcase, Shirt, BookOpen, Dog, Hammer, ChevronRight } from 'lucide-react';
import { categories } from '@/lib/data';
import RecentAdsWidget from '@/components/RecentAdsWidget';

const iconMap: any = {
  Home, Car, Monitor, Briefcase, Shirt, BookOpen, Dog, Hammer
};

export default function Sidebar() {
  return (
    <aside className="w-[220px] shrink-0 hidden md:block py-4 relative z-40">
      {/* KATEGORİ MENÜSÜ */}
      <ul className="border border-gray-200 bg-white shadow-sm rounded-sm dark:bg-gray-800 dark:border-gray-700 transition-colors">
        {categories.map((cat) => {
          const IconComponent = iconMap[cat.icon] || Home;
          return (
            <li key={cat.id} className="group border-b border-gray-100 last:border-0 relative dark:border-gray-700">
              <Link href={\`/search?category=\${cat.id}\`} className="flex items-center justify-between px-3 py-2.5 text-[13px] text-[#333] hover:bg-blue-50 hover:text-blue-700 transition-colors dark:text-gray-200 dark:hover:bg-gray-700 dark:hover:text-blue-400">
                <span className="flex items-center gap-2.5 font-medium">
                  <IconComponent size={15} className="text-gray-400 group-hover:text-blue-700 dark:text-gray-500 dark:group-hover:text-blue-400" />
                  {cat.name}
                </span>
                <ChevronRight size={12} className="text-gray-300 opacity-0 group-hover:opacity-100 dark:text-gray-500" />
              </Link>

              {/* MEGA MENÜ */}
              <div className="hidden group-hover:block absolute left-[100%] top-0 w-[600px] min-h-full bg-white border border-gray-200 shadow-lg p-6 z-50 rounded-r-sm -ml-[1px] dark:bg-gray-800 dark:border-gray-700">
                <h3 className="font-bold text-[#333] text-lg border-b border-gray-200 pb-2 mb-4 dark:text-white dark:border-gray-700">{cat.name}</h3>
                <div className="grid grid-cols-3 gap-y-2 gap-x-8">
                  {cat.subs.map((sub: string, idx: number) => (
                    <Link key={idx} href="#" className="text-[13px] text-gray-600 hover:text-blue-700 hover:underline flex items-center gap-1 dark:text-gray-400 dark:hover:text-blue-400">
                      <span className="w-1 h-1 bg-gray-300 rounded-full dark:bg-gray-600"></span>
                      {sub}
                    </Link>
                  ))}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* REKLAM ALANI */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-sm text-center dark:bg-gray-800 dark:border-gray-700">
         <p className="text-[12px] font-bold text-blue-900 dark:text-blue-400">Reklam Alanı</p>
         <div className="h-[200px] bg-gray-200 mt-2 flex items-center justify-center text-gray-400 text-[10px] dark:bg-gray-700 dark:text-gray-500">
            Google Ads
         </div>
      </div>

      {/* SON GEZİLENLER WIDGET */}
      <RecentAdsWidget />
    </aside>
  );
}
`;

// --- 4. ADIM: SHOWCASE (İLAN KARTLARI) GÜNCELLEMESİ ---
const componentShowcaseDark = `
"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ads, urgentAds, interestingAds } from '@/lib/data';
import { Heart } from 'lucide-react';
import { useFavorites } from '@/context/FavoritesContext';
import { useCompare } from '@/context/CompareContext';
import AdSkeleton from '@/components/AdSkeleton';

export default function Showcase() {
  const [activeTab, setActiveTab] = useState<'vitrin' | 'acil' | 'ilginç'>('vitrin');
  const { isFavorite, toggleFavorite } = useFavorites();
  const { isInCompare, addToCompare, removeFromCompare } = useCompare();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const getActiveAds = () => {
    switch (activeTab) {
      case 'acil': return urgentAds;
      case 'ilginç': return interestingAds;
      default: return ads;
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent, id: number) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(id);
  };

  const handleCompareChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    e.stopPropagation();
    if (e.target.checked) {
      addToCompare(id);
    } else {
      removeFromCompare(id);
    }
  };

  return (
    <div className="flex-1 min-w-0">
      {/* SEKMELER */}
      <div className="flex items-end border-b border-gray-200 mb-4 overflow-x-auto dark:border-gray-700">
        <button
          onClick={() => setActiveTab('vitrin')}
          className={\`px-4 py-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap \${activeTab === 'vitrin' ? 'border-[#ffe800] text-[#333] dark:text-white' : 'border-transparent text-gray-500 hover:text-[#333] dark:text-gray-400 dark:hover:text-white'}\`}
        >
          Vitrindeki İlanlar
        </button>
        <button
          onClick={() => setActiveTab('acil')}
          className={\`px-4 py-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap \${activeTab === 'acil' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500'}\`}
        >
          Acil Acil
        </button>
        <button
          onClick={() => setActiveTab('ilginç')}
          className={\`px-4 py-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap \${activeTab === 'ilginç' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400'}\`}
        >
          Sizin İçin Seçtiklerimiz
        </button>
      </div>

      {/* İLAN GRİDİ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {loading ? (
          Array.from({ length: 10 }).map((_, i) => <AdSkeleton key={i} />)
        ) : (
          getActiveAds().map((ad) => (
            <div key={ad.id} className="block group relative">
              <Link href={\`/ilan/\${ad.id}\`} className="block h-full">
                <div className="bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-md transition-all cursor-pointer h-full flex flex-col relative dark:bg-gray-800 dark:border-gray-700">

                  {/* Favori Butonu */}
                  <button
                    onClick={(e) => handleFavoriteClick(e, ad.id)}
                    className="absolute top-2 right-2 z-20 bg-white/80 p-1.5 rounded-full hover:bg-white transition-colors dark:bg-gray-900/80 dark:hover:bg-gray-900"
                  >
                    <Heart
                      size={16}
                      className={isFavorite(ad.id) ? 'fill-red-600 text-red-600' : 'text-gray-500 dark:text-gray-400'}
                    />
                  </button>

                  {/* Karşılaştırma Checkbox */}
                  <div className="absolute top-2 left-2 z-20" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isInCompare(ad.id)}
                      onChange={(e) => handleCompareChange(e, ad.id)}
                      className="w-4 h-4 cursor-pointer accent-blue-600 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 checked:opacity-100"
                      title="Karşılaştır"
                    />
                  </div>

                  {activeTab === 'acil' && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm z-10">ACİL</div>
                  )}

                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-900">
                    <img
                      src={ad.image}
                      alt={ad.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-2 space-y-1 flex-1 flex flex-col justify-between">
                    <p className="text-[12px] text-[#333] font-semibold leading-tight group-hover:underline line-clamp-2 h-[2.4em] overflow-hidden dark:text-gray-200">
                      {ad.title}
                    </p>
                    <div className="pt-2">
                       <p className={\`text-[13px] font-bold \${activeTab === 'acil' ? 'text-red-600' : 'text-blue-900 dark:text-blue-400'}\`}>
                         {ad.price} {ad.currency}
                       </p>
                       <p className="text-[10px] text-gray-500 truncate dark:text-gray-400">{ad.location ? ad.location.split('/')[0] : 'Şehir Yok'}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
`;

// --- 5. ADIM: SON GEZİLENLER WIDGET (DARK MODE UYUMLU) ---
const componentRecentAdsWidgetDark = `
"use client";
import React from 'react';
import Link from 'next/link';
import { useHistory } from '@/context/HistoryContext';
import { History, Trash2 } from 'lucide-react';

export default function RecentAdsWidget() {
  const { recentAds, clearHistory } = useHistory();

  if (recentAds.length === 0) return null;

  return (
    <div className="mt-4 bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-700">
      <div className="bg-gray-50 p-3 border-b border-gray-100 flex justify-between items-center dark:bg-gray-900/50 dark:border-gray-700">
        <h3 className="text-xs font-bold text-[#333] flex items-center gap-1 dark:text-gray-200">
          <History size={14} className="text-blue-600 dark:text-blue-400" />
          Son Gezilenler
        </h3>
        <button onClick={clearHistory} className="text-gray-400 hover:text-red-500" title="Temizle">
          <Trash2 size={12} />
        </button>
      </div>

      <ul>
        {recentAds.map((ad) => (
          <li key={ad.id} className="border-b border-gray-50 last:border-0 dark:border-gray-700">
            <Link href={\`/ilan/\${ad.id}\`} className="flex gap-2 p-2 hover:bg-blue-50 transition-colors group dark:hover:bg-gray-700">
              <div className="w-12 h-10 bg-gray-200 shrink-0 overflow-hidden rounded-sm border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                <img src={ad.image} alt={ad.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-[#333] truncate group-hover:text-blue-700 dark:text-gray-300 dark:group-hover:text-blue-400">{ad.title}</p>
                <p className="text-[10px] font-bold text-blue-900 dark:text-blue-300">{ad.price} {ad.currency}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
`;

// --- DOSYALARI OLUŞTURUYORUZ ---

createFile("tailwind.config.ts", tailwindConfig);
createFile("app/globals.css", globalsCss);
createFile("components/Sidebar.tsx", componentSidebarDark);
createFile("components/Showcase.tsx", componentShowcaseDark);
createFile("components/RecentAdsWidget.tsx", componentRecentAdsWidgetDark);

console.log("---------------------------------------------------------");
console.log("🚀 Level 29 (Onarım) Tamamlandı! (Karanlık Mod Entegrasyonu)");
console.log("---------------------------------------------------------");
console.log("Artık Header'daki Güneş/Ay ikonuna tıkladığınızda:");
console.log("1. Arka plan koyu lacivert/siyah tonlarına dönmeli.");
console.log("2. İlan kartları ve yan menü koyu gri olmalı.");
console.log("3. Yazılar beyaza dönmeli.");
console.log("---------------------------------------------------------");
