
import React from 'react';
import Link from 'next/link';
import { Home, Car, Monitor, Briefcase, Shirt, BookOpen, Dog, Hammer, ChevronRight } from 'lucide-react';
import { categories } from '@/lib/data';

// İkon Eşleştirme
const iconMap: any = {
  Home, Car, Monitor, Briefcase, Shirt, BookOpen, Dog, Hammer
};

export default function Sidebar() {
  return (
    <aside className="w-[220px] shrink-0 hidden md:block py-4 relative z-40">
      <ul className="border border-gray-200 bg-white shadow-sm rounded-sm">
        {categories.map((cat, index) => {
          const IconComponent = iconMap[cat.icon] || Home;
          return (
            <li key={cat.id} className="group border-b border-gray-100 last:border-0 relative">
              <Link href={`/search?category=${cat.id}`} className="flex items-center justify-between px-3 py-2.5 text-[13px] text-[#333] hover:bg-blue-50 hover:text-blue-700 transition-colors">
                <span className="flex items-center gap-2.5 font-medium">
                  <IconComponent size={15} className="text-gray-400 group-hover:text-blue-700" />
                  {cat.name}
                </span>
                <ChevronRight size={12} className="text-gray-300 opacity-0 group-hover:opacity-100" />
              </Link>

              {/* MEGA MENÜ (Hover ile açılan) */}
              <div className="hidden group-hover:block absolute left-[100%] top-0 w-[600px] min-h-full bg-white border border-gray-200 shadow-lg p-6 z-50 rounded-r-sm -ml-[1px]">
                <h3 className="font-bold text-[#333] text-lg border-b border-gray-200 pb-2 mb-4">{cat.name}</h3>
                <div className="grid grid-cols-3 gap-y-2 gap-x-8">
                  {cat.subs.map((sub, idx) => (
                    <Link key={idx} href="#" className="text-[13px] text-gray-600 hover:text-blue-700 hover:underline flex items-center gap-1">
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      {sub}
                    </Link>
                  ))}
                </div>
                <div className="mt-8 pt-4 border-t border-gray-100">
                   <Link href="#" className="text-blue-700 text-sm font-bold hover:underline">
                     Tüm {cat.name} İlanları &rarr;
                   </Link>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-sm text-center">
         <p className="text-[12px] font-bold text-blue-900">Reklam Alanı</p>
         <div className="h-[200px] bg-gray-200 mt-2 flex items-center justify-center text-gray-400 text-[10px]">
            Google Ads
         </div>
      </div>
    </aside>
  );
}
