import React from 'react';
import Link from 'next/link';
import { Home, Car, Monitor, ChevronRight, Briefcase, Shirt, BookOpen, Dog, Hammer } from 'lucide-react';
import { getCategoryTreeServer } from '@/lib/actions';

const iconMap: any = { Home, Car, Monitor, Briefcase, Shirt, BookOpen, Dog, Hammer };

export default async function PostAdCategory() {
  const categories = await getCategoryTreeServer();

  return (
    <div className="max-w-[800px] mx-auto py-8">
      <h1 className="text-xl font-bold text-[#333] mb-6 border-b pb-2 dark:text-white dark:border-gray-700">Adım 1: Kategori Seçimi</h1>

      <div className="bg-white border border-gray-200 shadow-sm rounded-sm dark:bg-[#1c1c1c] dark:border-gray-700">
        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
          {categories.map((cat: any) => {
            const Icon = iconMap[cat.icon] || Home;
            return (
              <li key={cat.id} className="group">
                <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-blue-50 transition-colors dark:hover:bg-blue-900/20">
                  <div className="flex items-center gap-3">
                    <Icon size={20} className="text-gray-500 dark:text-gray-400" />
                    <span className="font-bold text-[#333] dark:text-gray-100">{cat.title}</span>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
                </div>

                {cat.subs && cat.subs.length > 0 && (
                    <div className="bg-gray-50 pl-12 pr-4 py-2 hidden group-hover:block border-t border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                        <p className="text-[11px] text-gray-500 mb-2 font-semibold dark:text-gray-400">ALT KATEGORİ SEÇİNİZ:</p>
                        <div className="grid grid-cols-2 gap-2">
                        {cat.subs.map((sub: any) => (
                            <Link
                            key={sub.id}
                            href={`/ilan-ver/detay?cat=${cat.slug}&sub=${sub.slug}`}
                            className="text-[13px] text-blue-800 hover:underline hover:text-blue-900 flex items-center dark:text-blue-400 dark:hover:text-blue-300"
                            >
                            <span className="w-1 h-1 bg-blue-500 rounded-full mr-2"></span>
                            {sub.title}
                            </Link>
                        ))}
                        </div>
                    </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}