import React from 'react';
import Link from 'next/link';
import { Home, Car, Monitor, Briefcase, Shirt, BookOpen, Dog, Hammer, ChevronRight } from 'lucide-react';
import RecentAdsWidget from '@/components/RecentAdsWidget';

const iconMap: any = {
  Home, Car, Monitor, Briefcase, Shirt, BookOpen, Dog, Hammer
};

export default function Sidebar({ categories }: { categories: any[] }) {

  return (
    <aside className="w-[220px] shrink-0 hidden md:block py-4 relative z-40">
      <ul className="border border-gray-200 bg-white shadow-sm rounded-sm dark:bg-[#1c1c1c] dark:border-gray-700 transition-colors">
        {categories.map((cat) => {
          const IconComponent = iconMap[cat.icon] || Home;
          return (
            <li key={cat.id} className="group border-b border-gray-100 last:border-0 relative dark:border-gray-700">
              <Link href={`/search?category=${cat.slug}`} className="flex items-center justify-between px-3 py-2.5 text-[13px] text-[#333] hover:bg-blue-50 hover:text-blue-700 transition-colors dark:text-gray-200 dark:hover:bg-blue-900/30 dark:hover:text-blue-400">
                <span className="flex items-center gap-2.5 font-medium">
                  <IconComponent size={15} className="text-gray-400 group-hover:text-blue-700 dark:text-gray-500 dark:group-hover:text-blue-400" />
                  {cat.title}
                </span>
                <ChevronRight size={12} className="text-gray-300 opacity-0 group-hover:opacity-100 dark:text-gray-500" />
              </Link>
              {/* Alt Kategoriler (Hover Menu) */}
              {cat.subs && cat.subs.length > 0 && (
                <div className="hidden group-hover:block absolute left-[100%] top-0 w-[600px] min-h-full bg-white border border-gray-200 shadow-lg p-6 z-50 rounded-r-sm -ml-[1px] dark:bg-[#1c1c1c] dark:border-gray-700">
                    <h3 className="font-bold text-[#333] text-lg border-b border-gray-200 pb-2 mb-4 dark:text-white dark:border-gray-700">{cat.title}</h3>
                    <div className="grid grid-cols-3 gap-y-2 gap-x-8">
                    {cat.subs.map((sub: any) => (
                        <Link key={sub.id} href={`/search?category=${sub.slug}`} className="text-[13px] text-gray-600 hover:text-blue-700 hover:underline flex items-center gap-1 dark:text-gray-400 dark:hover:text-blue-400">
                        <span className="w-1 h-1 bg-gray-300 rounded-full dark:bg-gray-600"></span>
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
      <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-sm text-center dark:bg-[#111827] dark:border-gray-700">
         <p className="text-[12px] font-bold text-blue-900 dark:text-blue-400">Reklam Alanı</p>
         <div className="h-[200px] bg-gray-200 mt-2 flex items-center justify-center text-gray-400 text-[10px] dark:bg-gray-800 dark:text-gray-500">
            Google Ads
         </div>
      </div>
      <RecentAdsWidget />
    </aside>
  );
}