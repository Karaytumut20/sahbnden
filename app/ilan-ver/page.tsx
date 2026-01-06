import React from 'react';
import Link from 'next/link';
import { Home, Car, Monitor, ChevronRight } from 'lucide-react';

const categories = [
  { id: 'emlak', name: 'Emlak', icon: Home, subs: ['Konut', 'İş Yeri', 'Arsa', 'Bina', 'Devremülk'] },
  { id: 'vasita', name: 'Vasıta', icon: Car, subs: ['Otomobil', 'Arazi Aracı', 'Motosiklet', 'Ticari', 'Kiralık'] },
  { id: 'alisveris', name: 'İkinci El ve Sıfır Alışveriş', icon: Monitor, subs: ['Bilgisayar', 'Cep Telefonu', 'Fotoğraf', 'Ev Elektroniği'] },
];

export default function PostAdCategory() {
  return (
    <div className="max-w-[800px] mx-auto py-8">
      <h1 className="text-xl font-bold text-[#333] mb-6 border-b pb-2 dark:text-white dark:border-gray-700">Adım 1: Kategori Seçimi</h1>

      <div className="bg-white border border-gray-200 shadow-sm rounded-sm dark:bg-[#1c1c1c] dark:border-gray-700">
        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
          {categories.map((cat) => (
            <li key={cat.id} className="group">
              <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-blue-50 transition-colors dark:hover:bg-blue-900/20">
                <div className="flex items-center gap-3">
                  <cat.icon size={20} className="text-gray-500 dark:text-gray-400" />
                  <span className="font-bold text-[#333] dark:text-gray-100">{cat.name}</span>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
              </div>

              {/* Alt Kategori */}
              <div className="bg-gray-50 pl-12 pr-4 py-2 hidden group-hover:block border-t border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                <p className="text-[11px] text-gray-500 mb-2 font-semibold dark:text-gray-400">ALT KATEGORİ SEÇİNİZ:</p>
                <div className="grid grid-cols-2 gap-2">
                  {cat.subs.map((sub, idx) => (
                    <Link
                      key={idx}
                      href={`/ilan-ver/detay?cat=${cat.id}&sub=${sub}`}
                      className="text-[13px] text-blue-800 hover:underline hover:text-blue-900 flex items-center dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <span className="w-1 h-1 bg-blue-500 rounded-full mr-2"></span>
                      {sub}
                    </Link>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}