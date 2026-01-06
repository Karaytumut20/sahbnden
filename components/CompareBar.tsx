
"use client";
import React from 'react';
import Link from 'next/link';
import { X, ArrowRightLeft } from 'lucide-react';
import { useCompare } from '@/context/CompareContext';
import { getAdById } from '@/lib/data'; // Client componentte kullanmak için data.ts'den import ediyoruz

export default function CompareBar() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t-2 border-blue-600 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] z-[90] pb-[70px] md:pb-0">
      <div className="container max-w-[1150px] mx-auto px-4 py-3 flex items-center justify-between">

        <div className="flex items-center gap-4 overflow-x-auto">
          <div className="text-sm font-bold text-blue-900 whitespace-nowrap hidden md:block">
            Karşılaştırma Listesi ({compareList.length})
          </div>

          <div className="flex gap-3">
            {compareList.map((id) => {
              // Not: Gerçek projede veriyi client-side'a prop olarak geçmek veya API'den çekmek daha doğrudur.
              // Demo için basitçe ID gösteriyoruz veya statik veriden çekiyoruz (eğer erişilebilirse)
              return (
                <div key={id} className="relative group bg-gray-100 border border-gray-300 rounded-sm p-1 w-16 h-12 flex items-center justify-center text-xs text-gray-500">
                  <span>#{id}</span>
                  <button
                    onClick={() => removeFromCompare(id)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-4">
          <button
            onClick={clearCompare}
            className="text-gray-500 text-xs underline hover:text-red-600"
          >
            Listeyi Temizle
          </button>
          <Link
            href={`/karsilastir?ids=${compareList.join(',')}`}
            className="bg-blue-600 text-white px-6 py-2 rounded-sm font-bold text-sm hover:bg-blue-700 flex items-center gap-2 transition-colors"
          >
            <ArrowRightLeft size={16} /> <span className="hidden sm:inline">Karşılaştır</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
