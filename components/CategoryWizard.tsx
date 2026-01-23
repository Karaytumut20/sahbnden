"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, ArrowLeft, Home, Car, ShoppingCart, Smartphone, Monitor, Camera, Briefcase, CheckCircle2 } from 'lucide-react';
import { categories } from '@/lib/data';

// İkon Haritası (Genişletilebilir)
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
  const [history, setHistory] = useState<any[]>([]);
  const [currentList, setCurrentList] = useState<any[]>(categories);
  const [selectedPath, setSelectedPath] = useState<string[]>([]);

  const handleSelect = (item: any) => {
    const newPath = [...selectedPath, item.title];

    if (item.subs && item.subs.length > 0) {
      // Alt kategoriye in
      setHistory([...history, currentList]);
      setCurrentList(item.subs);
      setSelectedPath(newPath);
    } else {
      // Son kategori, yönlendir
      const categorySlug = item.slug;
      router.push(`/ilan-ver/detay?cat=${categorySlug}&path=${newPath.join(' > ')}`);
    }
  };

  const handleBack = () => {
    if (history.length === 0) return;
    const prevList = history[history.length - 1];
    setHistory(history.slice(0, -1));
    setCurrentList(prevList);
    setSelectedPath(selectedPath.slice(0, -1));
  };

  return (
    <div className="w-full">
      {/* Başlık ve Geri Butonu */}
      <div className="flex items-center gap-4 mb-6">
        {history.length > 0 && (
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {history.length === 0 ? 'İlan Kategorisini Seçin' : selectedPath[selectedPath.length - 1]}
          </h2>
          <p className="text-sm text-slate-500">
            {history.length === 0 ? 'İlanınız için en uygun ana kategoriyi belirleyin.' : selectedPath.join(' > ')}
          </p>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentList.map((item) => {
          const Icon = iconMap[item.icon] || <div className="w-2 h-2 bg-indigo-600 rounded-full" />;
          const isLeaf = !item.subs || item.subs.length === 0;

          return (
            <button
              key={item.id}
              onClick={() => handleSelect(item)}
              className="group relative flex items-center p-5 bg-white border border-gray-200 rounded-xl hover:border-indigo-500 hover:shadow-md hover:shadow-indigo-100 transition-all duration-200 text-left"
            >
              {/* İkon Kutusu */}
              <div className={`
                w-14 h-14 rounded-lg flex items-center justify-center mr-4 transition-colors
                ${history.length === 0 ? 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-700'}
              `}>
                {history.length === 0 ? Icon : <ChevronRight size={24} className={isLeaf ? "text-green-500" : ""} />}
              </div>

              <div className="flex-1">
                <span className="block font-bold text-slate-700 group-hover:text-indigo-900 text-base mb-0.5">
                  {item.title}
                </span>
                <span className="text-xs text-slate-400 group-hover:text-indigo-500 font-medium">
                  {isLeaf ? 'Seç ve Devam Et' : 'Alt Kategorileri Gör'}
                </span>
              </div>

              {/* Sağ Ok veya Check */}
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