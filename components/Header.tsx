
"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Plus, User, Heart, LogOut, ChevronDown } from 'lucide-react';
import { useFavorites } from '@/context/FavoritesContext';
import { useAuth } from '@/context/AuthContext';

export default function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();
  const { favorites } = useFavorites();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <header className="bg-[#2d405a] text-white h-[50px] flex items-center justify-center text-sm font-sans sticky top-0 z-50 shadow-md">
      <div className="container max-w-[1150px] flex items-center justify-between px-4 h-full">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <Link href="/" className="font-bold text-xl tracking-tighter text-[#ffe800]">
            sahibinden.com
          </Link>
        </div>

        {/* Arama Formu */}
        <form onSubmit={handleSearch} className="flex-1 max-w-[480px] mx-4 relative hidden md:block">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Kelime, ilan no veya mağaza adı ile ara"
            className="w-full h-[34px] px-3 text-black rounded-sm focus:outline-none placeholder:text-gray-500 text-[13px]"
          />
          <button type="submit" className="absolute right-0 top-0 h-[34px] w-[34px] flex items-center justify-center text-gray-500 hover:text-blue-900 bg-white rounded-r-sm">
            <Search size={18} />
          </button>
        </form>

        {/* Sağ Menü */}
        <div className="flex items-center gap-4 text-[12px] font-medium">

          {!user ? (
            // GİRİŞ YAPILMAMIŞSA
            <>
              <Link href="/login" className="hover:text-[#ffe800] whitespace-nowrap hidden sm:inline">Giriş Yap</Link>
              <span className="text-gray-500 hidden sm:inline">|</span>
              <Link href="/register" className="hover:text-[#ffe800] whitespace-nowrap hidden sm:inline">Üye Ol</Link>
            </>
          ) : (
            // GİRİŞ YAPILMIŞSA
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 hover:text-[#ffe800] focus:outline-none"
              >
                <div className="w-6 h-6 bg-blue-700 rounded-full flex items-center justify-center text-[10px] font-bold">
                  {user.avatar}
                </div>
                <span className="hidden sm:inline">{user.name}</span>
                <ChevronDown size={12} />
              </button>

              {/* Dropdown Menü */}
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white text-[#333] border border-gray-200 rounded-sm shadow-lg py-1 z-50">
                  <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
                    <p className="font-bold text-[13px]">{user.name}</p>
                    <p className="text-[10px] text-gray-500">{user.email}</p>
                  </div>
                  <Link href="/bana-ozel" onClick={() => setMenuOpen(false)} className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-700 text-[13px]">Bana Özel Özet</Link>
                  <Link href="/bana-ozel/ilanlarim" onClick={() => setMenuOpen(false)} className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-700 text-[13px]">İlanlarım</Link>
                  <Link href="/bana-ozel/mesajlar" onClick={() => setMenuOpen(false)} className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-700 text-[13px]">Mesajlarım</Link>
                  <button
                    onClick={() => { logout(); setMenuOpen(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 hover:text-red-600 text-[13px] flex items-center gap-2 border-t border-gray-100"
                  >
                    <LogOut size={14} /> Çıkış Yap
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Favorilerim Linki */}
          <Link href="/bana-ozel/favoriler" className="hover:text-[#ffe800] flex items-center gap-1 relative group ml-2">
             <Heart size={14} className={favorites.length > 0 ? 'fill-[#ffe800] text-[#ffe800]' : ''} />
             <span className="hidden sm:inline">Favorilerim</span>
             {favorites.length > 0 && (
               <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full">
                 {favorites.length}
               </span>
             )}
          </Link>

          <Link
            href="/ilan-ver"
            className="bg-[#ffe800] text-black px-4 h-[34px] flex items-center gap-1 rounded-sm font-bold hover:bg-yellow-400 transition-colors ml-2 whitespace-nowrap"
          >
            <Plus size={14} />
            Ücretsiz İlan Ver
          </Link>
        </div>
      </div>
    </header>
  );
}
