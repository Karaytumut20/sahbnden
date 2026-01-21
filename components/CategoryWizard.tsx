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
      router.push(`/ilan-ver/detay?cat=${categorySlug}&path=${newPath.join(' > ')}`);
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
                            <span className={`text-sm ${step === 0 ? 'font-bold' : 'font-medium'} text-gray-700 group-hover:text-blue-700`}>{item.title}</span>
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