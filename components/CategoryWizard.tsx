"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, ArrowLeft, Home, Car, ShoppingCart, Smartphone, Monitor, Camera, Briefcase, CheckCircle2, ChevronDown, Laptop } from 'lucide-react';
import { categories } from '@/lib/data';
import { carCatalog } from '@/lib/carCatalog';
import { laptopBrands } from '@/lib/computerData';

// İkon Haritası
const iconMap: any = {
  Home: <Home size={28} />,
  Car: <Car size={28} />,
  ShoppingCart: <ShoppingCart size={28} />,
  Smartphone: <Smartphone size={28} />,
  Monitor: <Monitor size={28} />,
  Camera: <Camera size={28} />,
  Briefcase: <Briefcase size={28} />
};

export default function CategoryWizard() {
  const router = useRouter();

  // State
  const [history, setHistory] = useState<any[]>([]);
  const [currentList, setCurrentList] = useState<any[]>(categories);
  const [selectedPath, setSelectedPath] = useState<string[]>([]);

  // Mod Seçimleri
  const [isCarSelection, setIsCarSelection] = useState(false);
  const [carStep, setCarStep] = useState<'brand' | 'series' | 'model' | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedSeries, setSelectedSeries] = useState<string>('');

  // Laptop Seçimi
  const [isLaptopSelection, setIsLaptopSelection] = useState(false);

  const handleSelect = (item: any) => {
    // A. OTOMOBİL SEÇİMİ BAŞLANGICI
    if (item.slug === 'otomobil') {
        setIsCarSelection(true);
        setCarStep('brand');
        setHistory([...history, currentList]);
        setSelectedPath([...selectedPath, item.title]);

        const brandList = Object.keys(carCatalog).map(brand => ({ id: brand, title: brand, slug: brand, type: 'brand' })).sort((a,b) => a.title.localeCompare(b.title));
        setCurrentList(brandList);
        return;
    }

    // B. LAPTOP SEÇİMİ BAŞLANGICI
    if (item.slug === 'laptop') {
        setIsLaptopSelection(true);
        setHistory([...history, currentList]);
        setSelectedPath([...selectedPath, item.title]);

        // Laptop Markalarını Listele
        const brandList = laptopBrands.map(brand => ({ id: brand, title: brand, slug: brand.toLowerCase().replace(/ /g, '-'), type: 'brand' }));
        setCurrentList(brandList);
        return;
    }

    // C. ARAÇ ALT ADIMLARI
    if (isCarSelection) {
        if (carStep === 'brand') {
            const brand = item.title;
            setSelectedBrand(brand);
            const seriesList = Object.keys(carCatalog[brand] || {}).map(series => ({ id: series, title: series, slug: series, type: 'series' }));
            if (seriesList.length > 0) {
                setHistory([...history, currentList]);
                setCurrentList(seriesList);
                setSelectedPath([...selectedPath, brand]);
                setCarStep('series');
            } else { finishSelection(brand, '', ''); }
        } else if (carStep === 'series') {
            const series = item.title;
            setSelectedSeries(series);
            const models = carCatalog[selectedBrand][series] || [];
            const modelList = models.map(model => ({ id: model.id, title: model.name, slug: model.id, type: 'model' }));
            if (modelList.length > 0) {
                setHistory([...history, currentList]);
                setCurrentList(modelList);
                setSelectedPath([...selectedPath, series]);
                setCarStep('model');
            } else { finishSelection(selectedBrand, series, ''); }
        } else if (carStep === 'model') {
            finishSelection(selectedBrand, selectedSeries, item.title);
        }
        return;
    }

    // D. LAPTOP MARKASI SEÇİLDİ
    if (isLaptopSelection) {
        const brand = item.title;
        // URL'e marka parametresi ekleyerek yönlendir
        const finalPath = [...selectedPath, brand].join(' > ');
        router.push(`/ilan-ver/detay?cat=laptop&path=${encodeURIComponent(finalPath)}&brand=${encodeURIComponent(brand)}`);
        return;
    }

    // E. STANDART KATEGORİ GEZİNİMİ
    const newPath = [...selectedPath, item.title];

    if (item.subs && item.subs.length > 0) {
      setHistory([...history, currentList]);
      setCurrentList(item.subs);
      setSelectedPath(newPath);
    } else {
      const categorySlug = item.slug;
      router.push(`/ilan-ver/detay?cat=${categorySlug}&path=${newPath.join(' > ')}`);
    }
  };

  const finishSelection = (brand: string, series: string, model: string) => {
     const finalPath = [...selectedPath, model].filter(Boolean).join(' > ');
     const params = new URLSearchParams();
     params.set('cat', 'otomobil');
     params.set('path', finalPath);
     if(brand) params.set('brand', brand);
     if(series) params.set('series', series);
     if(model) params.set('model', model);
     router.push(`/ilan-ver/detay?${params.toString()}`);
  };

  const handleBack = () => {
    if (history.length === 0) return;
    const prevList = history[history.length - 1];
    setHistory(history.slice(0, -1));
    setCurrentList(prevList);
    setSelectedPath(selectedPath.slice(0, -1));

    if (isCarSelection) {
        if (carStep === 'model') setCarStep('series');
        else if (carStep === 'series') setCarStep('brand');
        else if (carStep === 'brand') { setIsCarSelection(false); setCarStep(null); }
    }
    if (isLaptopSelection) {
        setIsLaptopSelection(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-6">
        {history.length > 0 && (
          <button onClick={handleBack} className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm"><ArrowLeft size={20} /></button>
        )}
        <div>
          <h2 className="text-xl font-bold text-slate-900">{history.length === 0 ? 'İlan Kategorisini Seçin' : selectedPath[selectedPath.length - 1] || 'Seçim Yapınız'}</h2>
          <p className="text-sm text-slate-500">{history.length === 0 ? 'İlanınız için en uygun ana kategoriyi belirleyin.' : selectedPath.join(' > ')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentList.map((item) => {
          const Icon = iconMap[item.icon] || null;
          const isLeaf = (isCarSelection && carStep === 'model') || (isLaptopSelection) ? true : (!item.subs || item.subs.length === 0);

          return (
            <button
              key={item.id || item.title}
              onClick={() => handleSelect(item)}
              className="group relative flex items-center p-5 bg-white border border-gray-200 rounded-xl hover:border-indigo-500 hover:shadow-md transition-all duration-200 text-left"
            >
              <div className={`w-14 h-14 rounded-lg flex items-center justify-center mr-4 transition-colors shrink-0 ${history.length === 0 ? 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-700'}`}>
                {history.length === 0 && Icon ? Icon : (isLeaf ? <CheckCircle2 size={24} className="text-green-600" /> : <div className="text-sm font-bold opacity-50">{item.title.substring(0,2).toUpperCase()}</div>)}
              </div>
              <div className="flex-1 min-w-0">
                <span className="block font-bold text-slate-700 group-hover:text-indigo-900 text-base mb-0.5 truncate">{item.title}</span>
                <span className="text-xs text-slate-400 group-hover:text-indigo-500 font-medium">{isLeaf ? 'Seç ve Devam Et' : 'Alt Kategorileri Gör'}</span>
              </div>
              <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">
                {isLeaf ? <CheckCircle2 size={20} className="text-green-500" /> : <ChevronRight size={20} className="text-indigo-400" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}