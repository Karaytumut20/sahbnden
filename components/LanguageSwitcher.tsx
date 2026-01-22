"use client";
import React from 'react';
import { Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LanguageSwitcher() {
  const router = useRouter();

  const changeLanguage = (locale: string) => {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`;
    router.refresh();
  };

  return (
    <div className="relative group">
      <button className="flex items-center gap-1.5 hover:text-indigo-600 transition-colors p-2 rounded-full hover:bg-gray-100">
        <Globe size={18} className="text-gray-600" />
        <span className="text-xs font-bold uppercase text-gray-700">TR / EN</span>
      </button>

      <div className="absolute right-0 top-full mt-2 w-36 bg-white border border-gray-100 rounded-xl shadow-xl py-2 hidden group-hover:block z-50 overflow-hidden animate-in fade-in zoom-in-95 origin-top-right">
        <button onClick={() => changeLanguage('tr')} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-2 transition-colors">
          <span className="text-lg">🇹🇷</span> Türkçe
        </button>
        <button onClick={() => changeLanguage('en')} className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-2 transition-colors">
          <span className="text-lg">🇬🇧</span> English
        </button>
      </div>
    </div>
  );
}