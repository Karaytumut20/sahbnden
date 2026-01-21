"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Plus, User, Heart, LogOut, ChevronDown, Menu, Bell, Settings } from 'lucide-react';
import { useFavorites } from '@/context/FavoritesContext';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import MobileMenu from '@/components/MobileMenu';
import ThemeToggle from '@/components/ThemeToggle';
import { getAdsClient } from '@/lib/services';

export default function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);

  const router = useRouter();
  const { favorites } = useFavorites();
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Dışarı tıklama kontrolü
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Arama önerileri
  useEffect(() => {
    if (searchTerm.length >= 2) {
      getAdsClient({ q: searchTerm }).then(data => {
        setSuggestions(data.slice(0, 5));
        setShowSuggestions(true);
      });
    } else {
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const favCount = favorites?.length || 0;

  return (
    <>
      <header className="bg-[#2d405a] text-white h-[50px] flex items-center justify-center text-sm font-sans sticky top-0 z-50 shadow-md">
        <div className="container max-w-[1150px] flex items-center justify-between px-4 h-full">

          <div className="flex items-center gap-4">
            <button className="md:hidden text-white focus:outline-none" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <Link href="/" className="font-bold text-xl tracking-tighter text-[#ffe800]">
              sahibinden.com
            </Link>
          </div>

          <div className="flex-1 max-w-[480px] mx-4 relative hidden md:block" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => searchTerm.length >= 2 && setShowSuggestions(true)}
                placeholder="Kelime, ilan no veya mağaza adı ile ara"
                className="w-full h-[34px] px-3 text-black rounded-sm focus:outline-none placeholder:text-gray-500 text-[13px]"
              />
              <button type="submit" className="absolute right-0 top-0 h-[34px] w-[34px] flex items-center justify-center text-gray-500 hover:text-blue-900 bg-white rounded-r-sm">
                <Search size={18} />
              </button>
            </form>
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white text-[#333] border border-gray-200 rounded-b-sm shadow-lg mt-1 z-[60] overflow-hidden">
                  <div>
                    <p className="px-3 py-2 text-[10px] font-bold text-gray-400 bg-gray-50 uppercase">Sonuçlar</p>
                    {suggestions.map((ad: any) => (
                      <Link key={ad.id} href={`/ilan/${ad.id}`} onClick={() => setShowSuggestions(false)} className="flex items-center justify-between px-3 py-2 text-[12px] hover:bg-blue-50 hover:text-blue-700 border-b border-gray-50 last:border-0">
                        <span className="truncate flex-1">{ad.title}</span>
                        <span className="text-blue-800 font-bold ml-2">{ad.price.toLocaleString()} {ad.currency}</span>
                      </Link>
                    ))}
                  </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 text-[12px] font-medium">
            <ThemeToggle />

            {!user ? (
              <>
                <Link href="/login" className="hover:text-[#ffe800] whitespace-nowrap hidden sm:inline">Giriş Yap</Link>
                <span className="text-gray-500 hidden sm:inline">|</span>
                <Link href="/register" className="hover:text-[#ffe800] whitespace-nowrap hidden sm:inline">Üye Ol</Link>
              </>
            ) : (
              <>
                {/* Bildirimler */}
                <div className="relative" ref={notifRef}>
                  <button onClick={() => setNotifOpen(!notifOpen)} className="relative hover:text-[#ffe800]">
                    <Bell size={18} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1.5 -right-1 bg-red-600 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full border-2 border-[#2d405a]">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {notifOpen && (
                    <div className="absolute right-0 top-full mt-3 w-72 bg-white text-[#333] border border-gray-200 rounded-sm shadow-xl z-50 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                      <div className="flex justify-between items-center p-3 border-b border-gray-100 bg-gray-50">
                        <span className="font-bold text-[13px]">Bildirimler</span>
                        <button onClick={markAllAsRead} className="text-[10px] text-blue-600 hover:underline">Tümünü Okundu İşaretle</button>
                      </div>
                      <div className="max-h-[300px] overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-4 text-center text-gray-500 text-xs">Bildiriminiz yok.</div>
                        ) : (
                          notifications.map((notif: any) => (
                            <div key={notif.id} onClick={() => markAsRead(notif.id)} className={`p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer ${!notif.read ? 'bg-blue-50/50' : ''}`}>
                              <div className="flex justify-between items-start mb-1">
                                <span className="text-[12px] font-semibold">{notif.title}</span>
                                <span className="text-[10px] text-gray-400">{notif.date}</span>
                              </div>
                              <p className="text-[11px] text-gray-600 leading-snug line-clamp-2">{notif.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Kullanıcı Menüsü */}
                <div className="relative hidden sm:block">
                  <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 hover:text-[#ffe800] focus:outline-none">
                    <div className="w-6 h-6 bg-blue-700 rounded-full flex items-center justify-center text-[10px] font-bold border border-white/20">
                      {user.avatar ? <img src={user.avatar} className="w-full h-full rounded-full object-cover"/> : user.name?.charAt(0)}
                    </div>
                    <span>{user.name}</span>
                    <ChevronDown size={12} />
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white text-[#333] border border-gray-200 rounded-sm shadow-lg py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
                        <p className="font-bold text-[13px]">{user.name}</p>
                        <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link href="/bana-ozel" onClick={() => setMenuOpen(false)} className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-700 text-[13px]">Bana Özel Özet</Link>
                      <Link href="/bana-ozel/ilanlarim" onClick={() => setMenuOpen(false)} className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-700 text-[13px]">İlanlarım</Link>
                      <Link href="/bana-ozel/favoriler" onClick={() => setMenuOpen(false)} className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-700 text-[13px]">Favori İlanlarım</Link>
                      <Link href="/bana-ozel/mesajlar" onClick={() => setMenuOpen(false)} className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-700 text-[13px]">Mesajlarım</Link>
                      <Link href="/bana-ozel/ayarlar" onClick={() => setMenuOpen(false)} className="w-full text-left px-4 py-2 hover:bg-blue-50 hover:text-blue-700 text-[13px] flex items-center gap-2 border-t border-gray-100">
                        <Settings size={14} /> Ayarlar
                      </Link>
                      <button onClick={() => { logout(); setMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-red-50 hover:text-red-600 text-[13px] flex items-center gap-2 border-t border-gray-100">
                        <LogOut size={14} /> Çıkış Yap
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
            <Link href="/bana-ozel/favoriler" className="hover:text-[#ffe800] flex items-center gap-1 relative group ml-2">
               <Heart size={14} className={favCount > 0 ? 'fill-[#ffe800] text-[#ffe800]' : ''} />
               <span className="hidden sm:inline">Favorilerim</span>
               {favCount > 0 && <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full">{favCount}</span>}
            </Link>
            <Link href="/ilan-ver" className="bg-[#ffe800] text-black px-4 h-[34px] flex items-center gap-1 rounded-sm font-bold hover:bg-yellow-400 transition-colors ml-2 whitespace-nowrap hidden sm:flex">
              <Plus size={14} /> Ücretsiz İlan Ver
            </Link>
          </div>
        </div>
      </header>
      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </>
  );
}