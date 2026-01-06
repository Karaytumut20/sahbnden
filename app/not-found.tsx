
import React from 'react';
import Link from 'next/link';
import { Search, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-[100px] font-black text-gray-200 leading-none">404</h1>
      <h2 className="text-2xl font-bold text-[#333] mt-[-20px] mb-4">Aradığınız sayfayı bulamadık</h2>
      <p className="text-gray-500 max-w-md mb-8">
        Gitmek istediğiniz sayfa kaldırılmış, adı değiştirilmiş veya geçici olarak kullanım dışı olabilir.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Link href="/" className="flex-1 bg-blue-700 text-white py-3 rounded-sm font-bold flex items-center justify-center gap-2 hover:bg-blue-800 transition-colors">
          <Home size={18} /> Ana Sayfa
        </Link>
        <Link href="/search" className="flex-1 bg-white border border-gray-300 text-[#333] py-3 rounded-sm font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
          <Search size={18} /> Detaylı Arama
        </Link>
      </div>
    </div>
  );
}
