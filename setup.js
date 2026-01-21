const fs = require("fs");
const path = require("path");

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
};

console.log(
  colors.cyan +
    colors.bold +
    "\n🚀 SENIOR DEVELOPER UPDATE: TYPESCRIPT, LOKASYON & PERFORMANS...\n" +
    colors.reset,
);

function writeFile(filePath, content) {
  const absolutePath = path.join(__dirname, filePath);
  const dir = path.dirname(absolutePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(absolutePath, content.trim());
  console.log(
    `${colors.green}✔ Oluşturuldu/Güncellendi:${colors.reset} ${filePath}`,
  );
}

// =============================================================================
// 1. TYPES/INDEX.TS (Merkezi Tip Tanımları - Type Safety)
// =============================================================================
const typesContent = `
export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'user' | 'store' | 'admin';
  phone: string | null;
  created_at: string;
}

export interface Category {
  id: number;
  title: string;
  slug: string;
  icon: string | null;
  parent_id: number | null;
  subs?: Category[];
}

export interface Ad {
  id: number;
  title: string;
  description: string;
  price: number;
  currency: string;
  city: string;
  district: string;
  category: string;
  image: string | null;
  images?: string[];
  status: 'yayinda' | 'onay_bekliyor' | 'pasif' | 'reddedildi';
  is_vitrin: boolean;
  is_urgent: boolean;
  user_id: string;
  created_at: string;
  // Dinamik Özellikler
  room?: string;
  m2?: number;
  floor?: number;
  heating?: string;
  brand?: string;
  model?: string;
  year?: number;
  km?: number;
  gear?: string;
  fuel?: string;
  // İlişkiler
  profiles?: Profile;
}
`;
writeFile("types/index.ts", typesContent);

// =============================================================================
// 2. LIB/LOCATIONS.TS (Türkiye İl-İlçe Verisi)
// =============================================================================
const locationsContent = `
export const cities = [
  { name: 'İstanbul', districts: ['Kadıköy', 'Beşiktaş', 'Üsküdar', 'Şişli', 'Maltepe', 'Kartal', 'Pendik', 'Ümraniye', 'Ataşehir', 'Beylikdüzü', 'Esenyurt'] },
  { name: 'Ankara', districts: ['Çankaya', 'Keçiören', 'Yenimahalle', 'Mamak', 'Etimesgut', 'Sincan', 'Altındağ', 'Pursaklar', 'Gölbaşı'] },
  { name: 'İzmir', districts: ['Karşıyaka', 'Konak', 'Bornova', 'Buca', 'Çiğli', 'Gaziemir', 'Balçova', 'Narlıdere', 'Urla', 'Çeşme'] },
  { name: 'Antalya', districts: ['Muratpaşa', 'Kepez', 'Konyaaltı', 'Alanya', 'Manavgat', 'Serik', 'Kemer', 'Kaş'] },
  { name: 'Bursa', districts: ['Nilüfer', 'Osmangazi', 'Yıldırım', 'Mudanya', 'İnegöl', 'Gemlik'] },
  { name: 'Adana', districts: ['Seyhan', 'Çukurova', 'Yüreğir', 'Sarıçam'] },
  { name: 'Kocaeli', districts: ['İzmit', 'Gebze', 'Darıca', 'Gölcük', 'Körfez', 'Derince', 'Kartepe', 'Başiskele', 'Karamürsel'] },
  { name: 'Konya', districts: ['Selçuklu', 'Meram', 'Karatay'] },
  { name: 'Gaziantep', districts: ['Şahinbey', 'Şehitkamil'] },
  { name: 'Mersin', districts: ['Yenişehir', 'Mezitli', 'Akdeniz', 'Toroslar', 'Erdemli'] },
  { name: 'Eskişehir', districts: ['Odunpazarı', 'Tepebaşı'] },
  { name: 'Samsun', districts: ['Atakum', 'İlkadım', 'Canik'] },
  { name: 'Kayseri', districts: ['Melikgazi', 'Kocasinan', 'Talas'] },
  { name: 'Sakarya', districts: ['Adapazarı', 'Serdivan', 'Erenler'] },
  { name: 'Muğla', districts: ['Bodrum', 'Fethiye', 'Marmaris', 'Menteşe', 'Milas'] },
  { name: 'Trabzon', districts: ['Ortahisar', 'Akçaabat', 'Yomra'] },
  { name: 'Tekirdağ', districts: ['Süleymanpaşa', 'Çorlu', 'Çerkezköy'] },
  { name: 'Hatay', districts: ['Antakya', 'İskenderun', 'Defne'] },
  { name: 'Manisa', districts: ['Yunusemre', 'Şehzadeler', 'Akhisar', 'Turgutlu'] },
  { name: 'Balıkesir', districts: ['Altıeylül', 'Karesi', 'Edremit', 'Bandırma'] },
  { name: 'Diyarbakır', districts: ['Bağlar', 'Kayapınar', 'Yenişehir'] },
  { name: 'Şanlıurfa', districts: ['Haliliye', 'Eyyübiye', 'Karaköprü'] }
].sort((a, b) => a.name.localeCompare(b.name));

export const getDistricts = (cityName: string) => {
  const city = cities.find(c => c.name === cityName);
  return city ? city.districts.sort() : [];
};
`;
writeFile("lib/locations.ts", locationsContent);

// =============================================================================
// 3. NEXT.CONFIG.TS (Image Optimizasyonu İçin Domain İzni)
// =============================================================================
const nextConfigContent = `
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Tüm dış kaynaklara izin ver (Geliştirme için)
      },
    ],
    // Supabase ve Picsum gibi kaynaklar için optimizasyonu açıyoruz
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
`;
writeFile("next.config.ts", nextConfigContent);

// =============================================================================
// 4. COMPONENTS/ADCARD.TSX (Tarih Formatı ve Next Image)
// =============================================================================
const adCardContent = `
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Calendar, Heart } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { Ad } from '@/types';

// Tarih Formatlayıcı (Bugün, Dün, vs.)
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Bugün';
  if (diffDays === 1) return 'Dün';
  return date.toLocaleDateString('tr-TR');
};

type AdCardProps = {
  ad: Ad;
  viewMode?: 'grid' | 'list' | 'table';
};

export default function AdCard({ ad, viewMode = 'grid' }: AdCardProps) {
  const formattedPrice = ad.price != null ? ad.price.toLocaleString('tr-TR') : '0';
  const priceDisplay = \`\${formattedPrice} \${ad.currency || 'TL'}\`;
  const location = \`\${ad.city || ''} / \${ad.district || ''}\`;
  const dateDisplay = formatDate(ad.created_at);
  const imageUrl = ad.image || 'https://via.placeholder.com/300x200?text=Resim+Yok';

  if (viewMode === 'table') {
    return (
      <tr className="border-b border-gray-100 hover:bg-[#fff9e1] transition-colors group">
        <td className="p-2 w-[120px]">
          <Link href={\`/ilan/\${ad.id}\`}>
            <div className="w-[100px] h-[75px] relative overflow-hidden border border-gray-200 rounded-sm">
              <Image src={imageUrl} alt={ad.title} fill className="object-cover group-hover:scale-105 transition-transform" />
              {ad.is_vitrin && <div className="absolute top-0 left-0 bg-yellow-400 text-black text-[9px] font-bold px-1 z-10">VİTRİN</div>}
            </div>
          </Link>
        </td>
        <td className="p-3 align-middle">
          <Link href={\`/ilan/\${ad.id}\`} className="block">
            <span className="text-[#333] text-[13px] font-bold group-hover:underline block mb-1 line-clamp-1">
              {ad.title}
            </span>
            <div className="flex gap-2 items-center">
                {ad.is_urgent && <Badge variant="danger" className="text-[9px] py-0">Acil</Badge>}
                <span className="text-gray-400 text-[10px]">#{ad.id}</span>
            </div>
          </Link>
        </td>
        <td className="p-3 align-middle text-blue-900 font-bold text-[13px] whitespace-nowrap">{priceDisplay}</td>
        <td className="p-3 align-middle text-[#333] text-[12px] whitespace-nowrap">{dateDisplay}</td>
        <td className="p-3 align-middle text-[#333] text-[12px] whitespace-nowrap">
          <div className="flex items-center gap-1 text-gray-600"><MapPin size={12} className="text-gray-400" />{location}</div>
        </td>
      </tr>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="flex bg-white border border-gray-200 rounded-sm overflow-hidden hover:shadow-md transition-shadow group h-[160px]">
        <Link href={\`/ilan/\${ad.id}\`} className="w-[220px] shrink-0 relative bg-gray-100">
           <Image src={imageUrl} alt={ad.title} fill className="object-cover group-hover:scale-105 transition-transform" />
           {ad.is_urgent && <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm z-10">ACİL</div>}
        </Link>
        <div className="flex-1 p-4 flex flex-col justify-between">
           <div>
             <div className="flex justify-between items-start">
                <Link href={\`/ilan/\${ad.id}\`} className="text-[#333] text-base font-bold group-hover:underline line-clamp-1">
                    {ad.title}
                </Link>
             </div>
             <p className="text-xs text-gray-500 mt-1 line-clamp-2">{ad.description?.substring(0, 150)}...</p>
           </div>
           <div className="flex justify-between items-end">
              <div className="text-gray-500 text-xs flex gap-4">
                  <span className="flex items-center gap-1"><MapPin size={14}/> {location}</span>
                  <span className="flex items-center gap-1"><Calendar size={14}/> {dateDisplay}</span>
              </div>
              <div className="text-lg font-bold text-blue-900">{priceDisplay}</div>
           </div>
        </div>
      </div>
    );
  }

  // Grid Görünümü (Varsayılan)
  return (
    <Link href={\`/ilan/\${ad.id}\`} className="block group h-full">
      <div className="bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-lg transition-all cursor-pointer h-full flex flex-col relative">
        {ad.is_urgent && <div className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm z-10 shadow-sm">ACİL</div>}
        {ad.is_vitrin && <div className="absolute top-2 right-2 bg-yellow-400 text-black text-[9px] font-bold px-1.5 py-0.5 rounded-sm z-10 shadow-sm">VİTRİN</div>}

        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 rounded-t-sm">
          <Image src={imageUrl} alt={ad.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
        </div>
        <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
          <p className="text-[13px] text-[#333] font-semibold leading-tight group-hover:underline line-clamp-2 h-[2.4em] overflow-hidden">
            {ad.title}
          </p>
          <div className="pt-2 border-t border-gray-50 mt-1">
             <p className="text-[15px] font-bold text-blue-900">{priceDisplay}</p>
             <div className="flex justify-between items-center mt-1">
                <p className="text-[10px] text-gray-500 truncate max-w-[60%]">{location}</p>
                <p className="text-[10px] text-gray-400">{dateDisplay}</p>
             </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
`;
writeFile("components/AdCard.tsx", adCardContent);

// =============================================================================
// 5. COMPONENTS/FILTERSIDEBAR.TSX (Yeni Şehir Verisi Entegre)
// =============================================================================
const filterSidebarContent = `
"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, Check, RotateCcw, ChevronLeft } from 'lucide-react';
import { categories } from '@/lib/data';
import { cities } from '@/lib/locations'; // Yeni lokasyon dosyasından

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

  const navData = useMemo(() => {
    let activeCat: any = null;
    let parentCat: any = null;
    let listToDisplay = categories;
    let title = "Kategoriler";

    if (!currentCategorySlug) return { list: categories, title, parent: null, active: null };

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
      if (activeCat.subs && activeCat.subs.length > 0) {
        listToDisplay = activeCat.subs;
        title = activeCat.title;
      } else if (parentCat) {
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

  const updateFilter = (key: string, value: string) => setFilters(prev => ({ ...prev, [key]: value }));

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value); else params.delete(key);
    });
    params.delete('page');
    router.push(\`/search?\${params.toString()}\`);
  };

  const handleCategoryClick = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('category', slug);
    params.delete('page');
    router.push(\`/search?\${params.toString()}\`);
  };

  const goUpLevel = () => {
    if (navData.parent) handleCategoryClick(navData.parent.slug);
    else router.push('/search');
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    if (currentCategorySlug) params.set('category', currentCategorySlug);
    router.push(\`/search?\${params.toString()}\`);
  };

  const showEmlak = currentCategorySlug?.includes('konut') || currentCategorySlug?.includes('emlak');
  const showVasita = currentCategorySlug?.includes('vasita') || currentCategorySlug?.includes('oto');

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-4 sticky top-20 dark:bg-[#1c1c1c] dark:border-gray-700 transition-colors">
      <div className="mb-6">
          <h3 className="font-bold text-[#333] text-sm mb-3 border-b border-gray-100 pb-2 dark:text-white dark:border-gray-700 flex justify-between items-center">
            {navData.title}
            {currentCategorySlug && <button onClick={goUpLevel} className="text-blue-600 hover:text-blue-800"><ChevronLeft size={16}/></button>}
          </h3>
          <ul className="space-y-1">
              {navData.list.map((sub: any) => (
                  <li key={sub.id}>
                      <button onClick={() => handleCategoryClick(sub.slug)} className={\`w-full text-left text-[13px] px-2 py-1.5 rounded-sm flex items-center justify-between group transition-colors \${currentCategorySlug === sub.slug ? 'bg-blue-50 text-blue-700 font-bold border-l-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'}\`}>
                          {sub.title}
                          {currentCategorySlug === sub.slug && <Check size={14}/>}
                      </button>
                  </li>
              ))}
          </ul>
      </div>

      <h3 className="font-bold text-[#333] text-sm mb-4 flex items-center gap-2 border-b border-gray-100 pb-2 dark:text-white dark:border-gray-700"><Filter size={16} /> Filtrele</h3>

      <div className="space-y-4">
        <div>
          <label className="text-[11px] font-bold text-gray-500 mb-1 block dark:text-gray-400">İL</label>
          <select value={filters.city} onChange={(e) => updateFilter('city', e.target.value)} className="w-full border border-gray-300 rounded-sm text-[12px] p-2 focus:border-blue-500 outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white">
            <option value="">Tüm İller</option>
            {cities.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
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
                <div className="grid grid-cols-3 gap-1">
                   {['1+1', '2+1', '3+1', '4+1'].map(r => (
                       <button key={r} onClick={() => updateFilter('room', r)} className={\`text-[11px] border rounded-sm py-1 \${filters.room === r ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}\`}>{r}</button>
                   ))}
                </div>
            </div>
        )}

        <button onClick={applyFilters} className="w-full bg-blue-700 text-white text-[13px] font-bold py-2.5 mt-4 rounded-sm hover:bg-blue-800 transition-colors shadow-md flex items-center justify-center gap-2 dark:bg-blue-600 dark:hover:bg-blue-700"><Check size={16} /> Sonuçları Göster</button>
        <button onClick={clearFilters} className="w-full text-center text-[11px] text-gray-500 hover:text-red-600 underline flex items-center justify-center gap-1 mt-2 dark:text-gray-400 dark:hover:text-red-400"><RotateCcw size={12}/> Temizle</button>
      </div>
    </div>
  );
}
`;
writeFile("components/FilterSidebar.tsx", filterSidebarContent);

console.log(
  colors.yellow +
    "\\n⚠️ GÜNCELLEME TAMAMLANDI: 'npm run dev' ile projeyi başlatın." +
    colors.reset,
);
