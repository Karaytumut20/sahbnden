"use client";
import React from 'react';
import Link from 'next/link';
import { ChevronRight, LayoutGrid } from 'lucide-react';
import { categories } from '@/lib/data';

export default function SubCategoryDisplay({ currentSlug, parentParams }: { currentSlug: string, parentParams: any }) {

  // Mevcut kategoriyi ve altlarını bul
  const findCategory = (cats: any[], slug: string): any => {
    for (const cat of cats) {
      if (cat.slug === slug) return cat;
      if (cat.subs) {
        const found = findCategory(cat.subs, slug);
        if (found) return found;
      }
    }
    return null;
  };

  const currentCategory = currentSlug ? findCategory(categories, currentSlug) : null;

  // Eğer kategori bulunamadıysa veya alt kategorisi yoksa null dön
  if (!currentCategory || !currentCategory.subs || currentCategory.subs.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm mb-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <LayoutGrid className="text-indigo-600" size={20} />
        "{currentCategory.title}" Alt Kategorileri
      </h2>
      <p className="text-sm text-gray-500 mb-6">Aradığınız ürüne daha hızlı ulaşmak için lütfen bir alt kategori seçiniz.</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {currentCategory.subs.map((sub: any) => {
          // Mevcut parametreleri koru, sadece kategoriyi değiştir
          const params = new URLSearchParams(parentParams);
          params.set('category', sub.slug);

          return (
            <Link
              key={sub.id}
              href={`/search?${params.toString()}`}
              className="flex flex-col items-center justify-center p-4 border border-gray-100 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 hover:shadow-md transition-all group text-center h-32"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-indigo-100 transition-colors text-indigo-600 font-bold text-lg">
                {sub.title.substring(0, 1)}
              </div>
              <span className="font-bold text-gray-700 text-sm group-hover:text-indigo-700">{sub.title}</span>
              <span className="text-xs text-gray-400 mt-1 flex items-center">
                Gözat <ChevronRight size={12} />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}