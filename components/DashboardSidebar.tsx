import React from 'react';
import Link from 'next/link';
import { Home, List, Heart, MessageSquare, Settings, LogOut, Store } from 'lucide-react';

export default function DashboardSidebar() {
  return (
    <aside className="w-[240px] shrink-0 bg-white border border-gray-200 rounded-sm shadow-sm h-fit dark:bg-[#1c1c1c] dark:border-gray-700 transition-colors">
      <div className="p-4 border-b border-gray-100 dark:border-gray-700">
        <h3 className="font-bold text-[#333] dark:text-white">Ahmet Yılmaz</h3>
        <p className="text-[11px] text-gray-500 dark:text-gray-400">Bireysel Üye</p>
      </div>
      <nav className="p-2">
        <ul className="space-y-1 text-[13px] text-[#333] dark:text-gray-200">
          <li><Link href="/bana-ozel" className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 hover:text-blue-700 rounded-sm dark:hover:bg-blue-900/30 dark:hover:text-blue-400"><Home size={16} /> Bana Özel Özet</Link></li>
<li className="border-b border-gray-100 mb-2 pb-2 dark:border-gray-700"><Link href="/bana-ozel/magazam" className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 hover:text-blue-700 rounded-sm dark:hover:bg-blue-900/30 dark:hover:text-blue-400 font-semibold text-blue-800 dark:text-blue-300"><Store size={16} /> Mağaza Yönetimi</Link></li>
          <li><Link href="/bana-ozel/ilanlarim" className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 hover:text-blue-700 rounded-sm dark:hover:bg-blue-900/30 dark:hover:text-blue-400"><List size={16} /> Yayındaki İlanlarım</Link></li>
          <li><Link href="/bana-ozel/favoriler" className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 hover:text-blue-700 rounded-sm dark:hover:bg-blue-900/30 dark:hover:text-blue-400"><Heart size={16} /> Favori İlanlarım</Link></li>
          <li><Link href="/bana-ozel/mesajlar" className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 hover:text-blue-700 rounded-sm dark:hover:bg-blue-900/30 dark:hover:text-blue-400"><MessageSquare size={16} /> Mesajlarım <span className="ml-auto bg-red-500 text-white text-[10px] px-1.5 rounded-full">2</span></Link></li>
          <li className="border-t border-gray-100 my-2 pt-2 dark:border-gray-700"><Link href="/bana-ozel/ayarlar" className="flex items-center gap-2 px-3 py-2 hover:bg-blue-50 hover:text-blue-700 rounded-sm dark:hover:bg-blue-900/30 dark:hover:text-blue-400"><Settings size={16} /> Üyelik Bilgilerim</Link></li>
          <li><Link href="/" className="flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-sm dark:hover:bg-red-900/20"><LogOut size={16} /> Çıkış Yap</Link></li>
        </ul>
      </nav>
    </aside>
  );
}