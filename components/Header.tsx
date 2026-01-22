"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, Plus, Heart, LogOut, ChevronDown, Menu, Bell, Settings } from 'lucide-react';
import { useFavorites } from '@/context/FavoritesContext';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import MobileMenu from '@/components/MobileMenu';
// ThemeToggle importu kaldırıldı.
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { getAdsClient } from '@/lib/services';
import { useDebounce } from '@/hooks/useDebounce';

export default function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const router = useRouter();
  const { favorites } = useFavorites();
  const { user, logout } = useAuth();
  const { notifications, unreadCount } = useNotifications();

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) setShowSuggestions(false);
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) setNotifOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (debouncedSearchTerm.length >= 2) {
      getAdsClient({ q: debouncedSearchTerm }).then(data => {
        setSuggestions(data.slice(0, 5));
        setShowSuggestions(true);
      });
    } else {
      setShowSuggestions(false);
    }
  }, [debouncedSearchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (searchTerm.trim()) router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  const handleLogout = async () => { setMenuOpen(false); await logout(); }

  return (
    <>
      {/* DESIGN CHANGE:
         - Backdrop blur ve beyaz zemin ile modern "Glass" etkisi.
         - Border yerine hafif shadow.
         - Yükseklik 80px (Ferah).
      */}
      <header className="bg-white/90 backdrop-blur-lg border-b border-gray-100 h-[80px] flex items-center justify-center sticky top-0 z-50 transition-all shadow-soft">
        <div className="container max-w-7xl flex items-center justify-between px-6 h-full">

          <div className="flex items-center gap-8">
            <button className="md:hidden text-gray-700" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>

            {/* LOGO: Basit, tipografik ve güçlü */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-glow transition-transform group-hover:scale-105">
                M
              </div>
              <span className="font-bold text-2xl tracking-tight text-slate-800 hidden sm:block">
                Marketplace
              </span>
            </Link>
          </div>

          {/* ARAMA: Yuvarlak ve gölgeli */}
          <div className="flex-1 max-w-[500px] mx-8 relative hidden md:block" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative group">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => debouncedSearchTerm.length >= 2 && setShowSuggestions(true)}
                placeholder="Ne arıyorsunuz? (Örn: BMW, Villa, iPhone)"
                className="w-full h-[50px] pl-12 pr-4 bg-gray-50 border-transparent rounded-full focus:outline-none focus:bg-white focus:ring-4 focus:ring-indigo-100 focus:border-indigo-300 transition-all text-sm text-gray-700 placeholder:text-gray-400 shadow-inner group-hover:shadow-md"
              />
              <Search size={20} className="absolute left-4 top-[15px] text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
            </form>

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-100 rounded-2xl shadow-xl mt-3 z-[60] overflow-hidden p-2 animate-in fade-in slide-in-from-top-2">
                  <p className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Öneriler</p>
                  {suggestions.map((ad: any) => (
                    <Link key={ad.id} href={`/ilan/${ad.id}`} onClick={() => setShowSuggestions(false)} className="flex items-center justify-between px-3 py-3 rounded-xl hover:bg-indigo-50 hover:text-indigo-700 transition-colors group cursor-pointer">
                      <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-700">{ad.title}</span>
                      <span className="text-xs font-bold bg-white border border-gray-200 px-2 py-1 rounded-md text-gray-600 group-hover:border-indigo-200">{ad.price?.toLocaleString()} {ad.currency}</span>
                    </Link>
                  ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-6">
            <LanguageSwitcher />

            <div className="hidden sm:flex items-center gap-3">
                <Link href="/ilan-ver" className="bg-gray-900 text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-gray-800 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2">
                    <Plus size={18}/> İlan Ver
                </Link>
            </div>

            {!user ? (
              <div className="flex items-center gap-4 text-sm font-bold">
                <Link href="/login" className="text-gray-600 hover:text-indigo-600 transition-colors">Giriş</Link>
                <Link href="/register" className="text-indigo-600 bg-indigo-50 px-5 py-2.5 rounded-full hover:bg-indigo-100 transition-colors">Kayıt Ol</Link>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="relative" ref={notifRef}>
                  <button onClick={() => setNotifOpen(!notifOpen)} className="relative text-gray-500 hover:text-indigo-600 transition-colors p-2 rounded-full hover:bg-gray-50">
                    <Bell size={22} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1.5 right-1.5 bg-red-500 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full border-2 border-white shadow-sm">{unreadCount}</span>
                    )}
                  </button>
                </div>

                <div className="relative hidden sm:block" ref={userMenuRef}>
                  <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-3 focus:outline-none p-1.5 pr-4 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all">
                    <div className="w-9 h-9 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md ring-2 ring-white">
                       {user.avatar ? <Image src={user.avatar} alt="Avatar" fill className="object-cover" /> : (user.name?.charAt(0) || 'U')}
                    </div>
                    <div className="flex flex-col items-start leading-none">
                        <span className="text-sm font-bold text-gray-800 max-w-[80px] truncate">{user.name}</span>
                        <span className="text-[10px] text-gray-400 font-medium">Üye</span>
                    </div>
                    <ChevronDown size={14} className="text-gray-400" />
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 top-full mt-3 w-60 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 overflow-hidden animate-in fade-in zoom-in-95 origin-top-right ring-1 ring-black/5">
                      <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/50">
                        <p className="font-bold text-sm text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <div className="p-2 space-y-1">
                        <Link href="/bana-ozel" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-indigo-50 hover:text-indigo-700 text-sm text-gray-600 transition-colors"><Settings size={18}/> Panelim</Link>
                        <Link href="/bana-ozel/favoriler" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-indigo-50 hover:text-indigo-700 text-sm text-gray-600 transition-colors"><Heart size={18}/> Favorilerim</Link>
                        <div className="h-px bg-gray-100 my-1 mx-2"></div>
                        <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 text-sm text-red-600 transition-colors">
                            <LogOut size={18}/> Çıkış Yap
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {mobileMenuOpen && <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />}
    </>
  );
}