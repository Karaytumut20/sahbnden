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
    "\n🚀 FRONTEND GÜNCELLENİYOR (Filtreler, Kategori Sihirbazı, Veri Yapısı)...\n" +
    colors.reset,
);

function writeFile(filePath, content) {
  const absolutePath = path.join(__dirname, filePath);
  const dir = path.dirname(absolutePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(absolutePath, content.trim());
  console.log(`${colors.green}✔ Dosya oluşturuldu:${colors.reset} ${filePath}`);
}

// =============================================================================
// 1. LIB/DATA.TS (Merkezi Veri Yapısı)
// =============================================================================
const dataTsContent = `
import { Home, Car, Monitor, Briefcase, Shirt, BookOpen, Dog, Hammer, MapPin } from 'lucide-react';

// SQL veritabanındaki yapıya birebir uyan statik kategori listesi
// Bu liste Sidebar ve Kategori sihirbazında kullanılır.
export const categories = [
  {
    id: 'emlak',
    title: 'Emlak',
    icon: 'Home',
    slug: 'emlak',
    subs: [
      {
        id: 'konut',
        title: 'Konut',
        slug: 'konut',
        subs: [
            { id: 'konut-satilik', title: 'Satılık', slug: 'konut-satilik' },
            { id: 'konut-kiralik', title: 'Kiralık', slug: 'konut-kiralik' },
            { id: 'gunluk-kiralik', title: 'Günlük Kiralık', slug: 'gunluk-kiralik' },
        ]
      },
      {
        id: 'isyeri',
        title: 'İş Yeri',
        slug: 'is-yeri',
        subs: [
            { id: 'isyeri-satilik', title: 'Satılık İş Yeri', slug: 'isyeri-satilik' },
            { id: 'isyeri-kiralik', title: 'Kiralık İş Yeri', slug: 'isyeri-kiralik' },
        ]
      },
      {
        id: 'arsa',
        title: 'Arsa',
        slug: 'arsa',
        subs: [
            { id: 'arsa-satilik', title: 'Satılık Arsa', slug: 'arsa-satilik' },
        ]
      }
    ]
  },
  {
    id: 'vasita',
    title: 'Vasıta',
    icon: 'Car',
    slug: 'vasita',
    subs: [
      { id: 'oto', title: 'Otomobil', slug: 'otomobil' },
      { id: 'suv', title: 'Arazi, SUV & Pickup', slug: 'arazi-suv-pickup' },
      { id: 'moto', title: 'Motosiklet', slug: 'motosiklet' },
    ]
  },
  {
    id: 'alisveris',
    title: 'İkinci El ve Sıfır Alışveriş',
    icon: 'ShoppingCart',
    slug: 'alisveris',
    subs: [
      { id: 'pc', title: 'Bilgisayar', slug: 'bilgisayar' },
      { id: 'phone', title: 'Cep Telefonu', slug: 'cep-telefonu-ve-aksesuar' },
    ]
  }
];

export const cities = ['İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa', 'Adana', 'Konya', 'Gaziantep', 'Şanlıurfa', 'Kocaeli'];
`;

writeFile("lib/data.ts", dataTsContent);

// =============================================================================
// 2. COMPONENTS/FILTERSIDEBAR.TSX (Akıllı Filtreleme)
// =============================================================================
const filterSidebarContent = `
"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, Check, RotateCcw, ChevronLeft } from 'lucide-react';
import { categories, cities } from '@/lib/data';

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
    setFilters(prev => ({
      ...prev,
      city: searchParams.get('city') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      room: searchParams.get('room') || '',
      minYear: searchParams.get('minYear') || '',
      maxYear: searchParams.get('maxYear') || '',
      maxKm: searchParams.get('maxKm') || '',
    }));
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
            {currentCategorySlug && (
              <button onClick={goUpLevel} className="text-blue-600 hover:text-blue-800" title="Üst Kategori">
                  <ChevronLeft size={16}/>
              </button>
            )}
          </h3>
          <ul className="space-y-1">
              {navData.list.map((sub: any) => (
                  <li key={sub.id}>
                      <button
                        onClick={() => handleCategoryClick(sub.slug)}
                        className={\`w-full text-left text-[13px] px-2 py-1.5 rounded-sm flex items-center justify-between group transition-colors \${currentCategorySlug === sub.slug ? 'bg-blue-50 text-blue-700 font-bold border-l-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'}\`}
                      >
                          {sub.title}
                          {currentCategorySlug === sub.slug && <Check size={14}/>}
                      </button>
                  </li>
              ))}
          </ul>
      </div>

      <h3 className="font-bold text-[#333] text-sm mb-4 flex items-center gap-2 border-b border-gray-100 pb-2 dark:text-white dark:border-gray-700">
        <Filter size={16} /> Filtrele
      </h3>

      <div className="space-y-4">
        <div>
          <label className="text-[11px] font-bold text-gray-500 mb-1 block dark:text-gray-400">İL</label>
          <select value={filters.city} onChange={(e) => updateFilter('city', e.target.value)} className="w-full border border-gray-300 rounded-sm text-[12px] p-2 focus:border-blue-500 outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white">
            <option value="">Tüm İller</option>
            {cities.map(city => <option key={city} value={city}>{city}</option>)}
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

        {showVasita && (
            <div className="border-t border-gray-100 pt-3 dark:border-gray-700 animate-in fade-in">
                <label className="text-[11px] font-bold text-gray-500 mb-1 block dark:text-gray-400">YIL</label>
                <div className="flex gap-2">
                    <input type="number" placeholder="Min" value={filters.minYear} onChange={(e) => updateFilter('minYear', e.target.value)} className="w-full border border-gray-300 rounded-sm text-[12px] p-2 outline-none" />
                    <input type="number" placeholder="Max" value={filters.maxYear} onChange={(e) => updateFilter('maxYear', e.target.value)} className="w-full border border-gray-300 rounded-sm text-[12px] p-2 outline-none" />
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

// =============================================================================
// 3. COMPONENTS/CATEGORYWIZARD.TSX (Adım Adım Kategori Seçimi)
// =============================================================================
const categoryWizardContent = `
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, ArrowLeft, Home, Car, ShoppingCart, CheckCircle } from 'lucide-react';
import { categories } from '@/lib/data';

const iconMap: any = { Home: <Home size={20} />, Car: <Car size={20} />, ShoppingCart: <ShoppingCart size={20} /> };

export default function CategoryWizard() {
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [history, setHistory] = useState<any[]>([]);
  const [currentList, setCurrentList] = useState<any[]>(categories);
  const [selectedPath, setSelectedPath] = useState<string[]>([]);

  const handleSelect = (item: any) => {
    const newPath = [...selectedPath, item.title];
    setSelectedPath(newPath);

    if (item.subs && item.subs.length > 0) {
      setHistory([...history, currentList]);
      setCurrentList(item.subs);
      setStep(step + 1);
    } else {
      const categorySlug = item.slug;
      router.push(\`/ilan-ver/detay?cat=\${categorySlug}&path=\${newPath.join(' > ')}\`);
    }
  };

  const handleBack = () => {
    if (step === 0) return;
    const prevList = history[history.length - 1];
    const newHistory = history.slice(0, -1);
    const newPath = selectedPath.slice(0, -1);

    setCurrentList(prevList);
    setHistory(newHistory);
    setSelectedPath(newPath);
    setStep(step - 1);
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden min-h-[400px] flex flex-col">
      <div className="bg-gray-50 border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
            {step > 0 && (
                <button onClick={handleBack} className="p-1 hover:bg-gray-200 rounded-full transition-colors mr-2">
                    <ArrowLeft size={18} className="text-gray-600"/>
                </button>
            )}
            <div>
                <h2 className="font-bold text-[#333] text-sm">
                    {step === 0 ? 'Kategori Seçimi' : selectedPath[selectedPath.length - 1]}
                </h2>
                <p className="text-[11px] text-gray-500">
                    {selectedPath.length > 0 ? selectedPath.join(' > ') : 'Lütfen ilan vereceğiniz kategoriyi seçin.'}
                </p>
            </div>
        </div>
        <div className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Adım {step + 1}</div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <ul className="divide-y divide-gray-100">
            {currentList.map((item) => (
                <li key={item.id}>
                    <button onClick={() => handleSelect(item)} className="w-full text-left px-6 py-4 hover:bg-blue-50 transition-colors flex items-center justify-between group">
                        <div className="flex items-center gap-3">
                            {step === 0 && <span className="text-gray-400 group-hover:text-blue-600">{iconMap[item.icon] || <CheckCircle size={20}/>}</span>}
                            <span className={\`text-sm \${step === 0 ? 'font-bold' : 'font-medium'} text-gray-700 group-hover:text-blue-700\`}>{item.title}</span>
                        </div>
                        {item.subs && item.subs.length > 0 ? <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-500" /> : <span className="text-[10px] font-bold bg-blue-600 text-white px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">Seç</span>}
                    </button>
                </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
`;

writeFile("components/CategoryWizard.tsx", categoryWizardContent);

// =============================================================================
// 4. APP/ILAN-VER/PAGE.TSX (Sihirbaz Entegrasyonu)
// =============================================================================
const postAdPageContent = `
import React from 'react';
import CategoryWizard from '@/components/CategoryWizard';

export default function PostAdCategoryPage() {
  return (
    <div className="max-w-[800px] mx-auto py-10 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-[#333] mb-2">Ücretsiz İlan Ver</h1>
        <p className="text-gray-500 text-sm">İlanınızın en doğru kitleye ulaşması için kategoriyi adım adım seçiniz.</p>
      </div>
      <CategoryWizard />
    </div>
  );
}
`;

writeFile("app/ilan-ver/page.tsx", postAdPageContent);

// =============================================================================
// 5. APP/ILAN-VER/DETAY/PAGE.TSX (Güncellenmiş İlan Formu)
// =============================================================================
// Not: Daha önceki adımda verilen görsel zorunluluğunu kaldıran form kodunun aynısıdır.
// Tutarlılık için tekrar yazılıyor.
const postAdFormContent = `
"use client";
import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import RealEstateFields from '@/components/form/RealEstateFields';
import VehicleFields from '@/components/form/VehicleFields';
import ImageUploader from '@/components/ui/ImageUploader';
import { createAdAction } from '@/lib/actions';

function PostAdFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  const { user } = useAuth();

  const categorySlug = searchParams.get('cat') || '';
  const categoryPath = searchParams.get('path') || 'Kategori Seçilmedi';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState<any>({});

  const isRealEstate = categorySlug.includes('konut') || categorySlug.includes('isyeri') || categorySlug.includes('arsa') || categorySlug.includes('bina');
  const isVehicle = categorySlug.includes('otomobil') || categorySlug.includes('suv') || categorySlug.includes('moto');

  const handleInputChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleDynamicChange = (name: string, value: string) => setFormData({ ...formData, [name]: value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { router.push('/login'); return; }

    setIsSubmitting(true);

    const finalData = {
        ...formData,
        category: categorySlug,
        image: images[0] || null,
        price: Number(formData.price),
        year: Number(formData.year),
        km: Number(formData.km),
        m2: Number(formData.m2),
        floor: Number(formData.floor)
    };

    const res = await createAdAction(finalData);

    if (res.error) {
        addToast(res.error, 'error');
    } else {
        addToast('İlan başarıyla oluşturuldu!', 'success');
        router.push(\`/ilan-ver/doping?adId=\${res.adId}\`);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-[800px] mx-auto py-8 px-4">
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-sm mb-6 flex items-center justify-between">
        <div>
            <p className="text-xs text-blue-600 font-bold uppercase mb-1">Seçilen Kategori</p>
            <h1 className="text-lg font-bold text-[#333] flex items-center gap-2">
                {categoryPath} <CheckCircle size={16} className="text-green-500"/>
            </h1>
        </div>
        <button onClick={() => router.push('/ilan-ver')} className="text-xs font-bold text-gray-500 hover:text-blue-700 underline">
            Değiştir
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-sm border border-gray-200 rounded-sm space-y-8">
        <section>
            <h3 className="font-bold text-sm text-[#333] mb-4 border-b pb-2 flex items-center gap-2"><span className="bg-blue-600 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs">1</span> İlan Detayları</h3>
            <div className="space-y-4 px-2">
                <div><label className="block text-[11px] font-bold text-gray-600 mb-1">İlan Başlığı *</label><input name="title" onChange={handleInputChange} className="w-full border border-gray-300 h-10 px-3 rounded-sm outline-none focus:border-blue-500 text-sm" required placeholder="Örn: Sahibinden temiz..." /></div>
                <div><label className="block text-[11px] font-bold text-gray-600 mb-1">Açıklama *</label><textarea name="description" onChange={handleInputChange} className="w-full border border-gray-300 p-3 rounded-sm h-32 resize-none focus:border-blue-500 outline-none text-sm" required></textarea></div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-[11px] font-bold text-gray-600 mb-1">Fiyat *</label><input name="price" type="number" onChange={handleInputChange} className="w-full border border-gray-300 h-10 px-3 rounded-sm outline-none focus:border-blue-500 text-sm" required placeholder="0" /></div>
                    <div><label className="block text-[11px] font-bold text-gray-600 mb-1">Para Birimi</label><select name="currency" onChange={handleInputChange} className="w-full border border-gray-300 h-10 px-3 rounded-sm bg-white outline-none text-sm"><option>TL</option><option>USD</option><option>EUR</option></select></div>
                </div>
            </div>
        </section>

        {(isRealEstate || isVehicle) && (
            <section>
                <h3 className="font-bold text-sm text-[#333] mb-4 border-b pb-2 flex items-center gap-2"><span className="bg-blue-600 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs">2</span> Özellikler</h3>
                <div className="px-2">
                    {isRealEstate && <RealEstateFields data={formData} onChange={handleDynamicChange} />}
                    {isVehicle && <VehicleFields data={formData} onChange={handleDynamicChange} />}
                </div>
            </section>
        )}

        <section>
            <h3 className="font-bold text-sm text-[#333] mb-4 border-b pb-2 flex items-center gap-2"><span className="bg-blue-600 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs">3</span> Fotoğraflar</h3>
            <div className="px-2"><ImageUploader onImagesChange={setImages} /></div>
        </section>

        <section>
            <h3 className="font-bold text-sm text-[#333] mb-4 border-b pb-2 flex items-center gap-2"><span className="bg-blue-600 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs">4</span> Adres Bilgileri</h3>
            <div className="px-2 grid grid-cols-2 gap-4">
                <div><label className="block text-[11px] font-bold text-gray-600 mb-1">İl *</label><select name="city" onChange={handleInputChange} className="w-full border border-gray-300 h-10 px-3 rounded-sm bg-white outline-none text-sm" required><option value="">Seçiniz</option><option value="İstanbul">İstanbul</option><option value="Ankara">Ankara</option><option value="İzmir">İzmir</option></select></div>
                <div><label className="block text-[11px] font-bold text-gray-600 mb-1">İlçe *</label><input name="district" onChange={handleInputChange} className="w-full border border-gray-300 h-10 px-3 rounded-sm outline-none text-sm" required placeholder="Örn: Kadıköy"/></div>
            </div>
        </section>

        <div className="pt-4 flex items-center gap-4">
            <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-gray-300 rounded-sm font-bold text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2"><ArrowLeft size={16}/> Geri Dön</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 bg-[#ffe800] py-3 font-bold text-sm rounded-sm hover:bg-yellow-400 disabled:opacity-50 flex items-center justify-center gap-2 text-black shadow-sm transition-colors">{isSubmitting ? <><Loader2 className="animate-spin" size={18}/> Kaydediliyor...</> : 'Kaydet ve Devam Et'}</button>
        </div>
      </form>
    </div>
  );
}

export default function PostAdPage() {
    return <Suspense fallback={<div className="p-10 text-center">Yükleniyor...</div>}><PostAdFormContent /></Suspense>
}
`;

writeFile("app/ilan-ver/detay/page.tsx", postAdFormContent);
