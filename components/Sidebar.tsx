"use client";
import React from 'react';
import Link from 'next/link';
import { Home, Car, Monitor, Briefcase, Shirt, BookOpen, Dog, Hammer, ChevronRight } from 'lucide-react';
import RecentAdsWidget from '@/components/RecentAdsWidget';

const iconMap: any = { Home, Car, Monitor, Briefcase, Shirt, BookOpen, Dog, Hammer };

export default function Sidebar({ categories }: { categories: any[] }) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-50 bg-gray-50/50">
          <h3 className="font-bold text-gray-800 text-sm">Kategoriler</h3>
        </div>
        <ul className="divide-y divide-gray-50">
          {categories.map((cat) => {
            const IconComponent = iconMap[cat.icon] || Home;
            return (
              <li key={cat.id} className="group relative">
                <Link href={`/search?category=${cat.slug}`} className="flex items-center justify-between px-4 py-3 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all duration-200">
                  <span className="flex items-center gap-3 font-medium">
                    <IconComponent size={16} className="text-gray-400 group-hover:text-indigo-500 transition-colors" />
                    {cat.title}
                  </span>
                  <ChevronRight size={14} className="text-gray-300 group-hover:text-indigo-400 opacity-50 group-hover:opacity-100 transition-all" />
                </Link>

                {/* Mega Menu (Hover) */}
                {cat.subs && cat.subs.length > 0 && (
                  <div className="hidden group-hover:block absolute left-[100%] top-0 w-64 bg-white border border-gray-100 shadow-xl rounded-r-xl p-4 z-50 ml-2 animate-in fade-in slide-in-from-left-2 duration-200">
                    <h4 className="font-bold text-gray-800 mb-3 pb-2 border-b border-gray-100">{cat.title}</h4>
                    <div className="flex flex-col gap-1">
                      {cat.subs.map((sub: any) => (
                        <Link key={sub.id} href={`/search?category=${sub.slug}`} className="text-sm text-gray-500 hover:text-indigo-600 hover:bg-gray-50 px-2 py-1.5 rounded-md transition-colors">
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

      <RecentAdsWidget />

      {/* Reklam Alanı - Tasarım Bütünlüğü İçin Styled */}
      <div className="h-[250px] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center border border-gray-200 border-dashed">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Reklam Alanı</span>
      </div>
    </div>
  );
}