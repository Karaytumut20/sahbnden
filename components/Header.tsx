"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Search, Plus, ChevronDown, Menu, LogOut,
  LayoutDashboard, List, Heart, MessageSquare,
  Settings, ShieldCheck, Loader2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import MobileMenu from '@/components/MobileMenu';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useDebounce } from '@/hooks/useDebounce';
import { getAdsClient } from '@/lib/services';

export default function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const debouncedSearch = useDebounce(searchTerm, 300);
  const router = useRouter();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedSearch.length < 2) {
        setSuggestions([]);
        return;
      }
      setLoadingSuggestions(true);
      try {
        const results = await getAdsClient({ q: debouncedSearch });
        setSuggestions(results);
        setShowSuggestions(true);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingSuggestions(false);
      }
    };
    fetchSuggestions();
  }, [debouncedSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (searchTerm.trim()) router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
  }

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 h-[80px] flex items-center justify-center sticky top-0 z-50 transition-all shadow-sm">
        <div className="container max-w-7xl flex items-center justify-between px-6 h-full">

          {/* SOL: SADECE LOGO */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg transition-transform group-hover:scale-105">
                M
              </div>
              <span className="font-bold text-2xl tracking-tight text-slate-800 hidden sm:block">
                Marketplace
              </span>
            </Link>
          </div>

          {/* ORTA: ARAMA ÇUBUĞU (Masaüstü) */}
          <div className="flex-1 max-w-[500px] mx-8 relative hidden md:block" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative group">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => { if(suggestions.length > 0) setShowSuggestions(true); }}
                placeholder="Ne arıyorsunuz?"
                className="w-full h-[50px] pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-sm text-gray-700 placeholder:text-gray-400 shadow-inner group-hover:shadow-md"
              />
              {loadingSuggestions ? (
                 <Loader2 size={20} className="absolute left-4 top-[15px] text-indigo-500 animate-spin" />
              ) : (
                 <Search size={20} className="absolute left-4 top-[15px] text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
              )}
            </form>

            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-[55px] left-0 w-full bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden z-[60]">
                    <div className="p-2">
                        {suggestions.map((ad) => (
                            <Link
                                key={ad.id}
                                href={`/ilan/${ad.id}`}
                                onClick={() => { setShowSuggestions(false); setSearchTerm(''); }}
                                className="flex items-center justify-between px-3 py-2.5 hover:bg-indigo-50 rounded-lg group"
                            >
                                <span className="text-sm font-medium text-gray-700 group-hover:text-indigo-700 truncate">{ad.title}</span>
                                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">{ad.price.toLocaleString()} {ad.currency}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
          </div>

          {/* SAĞ: BUTONLAR & MENÜ */}
          <div className="flex items-center gap-2 md:gap-4">

            {/* MASAÜSTÜ İÇERİK (Mobilde tamamen gizli) */}
            <div className="hidden md:flex items-center gap-4">
                <LanguageSwitcher />
                <Link href="/ilan-ver" className="bg-indigo-600 text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-indigo-700 transition-all flex items-center gap-2">
                    <Plus size={18}/> <span>İlan Ver</span>
                </Link>

                {!user ? (
                  <div className="flex items-center gap-4 text-sm font-bold">
                    <Link href="/login" className="text-gray-600 hover:text-indigo-600">Giriş</Link>
                    <Link href="/register" className="text-indigo-600 bg-indigo-50 px-5 py-2.5 rounded-full">Kayıt</Link>
                  </div>
                ) : (
                  <div className="relative" ref={menuRef}>
                    <button
                      onClick={() => setMenuOpen(!menuOpen)}
                      className="flex items-center gap-3 focus:outline-none p-1.5 pr-4 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all"
                    >
                      <div className="w-9 h-9 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md ring-2 ring-white overflow-hidden">
                          {user.avatar ? <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover"/> : (user.name?.charAt(0) || 'U')}
                      </div>
                      <div className="flex flex-col items-start leading-none">
                          <span className="text-sm font-bold text-gray-800 max-w-[100px] truncate">{user.name}</span>
                          <span className="text-[10px] text-gray-500 font-medium capitalize">{user.role === 'store' ? 'Mağaza' : 'Bireysel'}</span>
                      </div>
                      <ChevronDown size={14} className={`text-gray-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {menuOpen && (
                       <div className="absolute right-0 top-full mt-3 w-64 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 overflow-hidden animate-in fade-in zoom-in-95 origin-top-right">
                          <div className="py-1">
                            {user.role === 'admin' && (
                                <Link href="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 bg-slate-800 text-white mx-2 rounded-xl mb-2">
                                    <ShieldCheck size={18} className="text-yellow-400"/>
                                    <span className="font-bold text-sm">Yönetici Paneli</span>
                                </Link>
                            )}
                            <Link href="/bana-ozel" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50">
                               <LayoutDashboard size={18} className="text-gray-400"/> Bana Özel
                            </Link>
                            <Link href="/bana-ozel/ilanlarim" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50">
                               <List size={18} className="text-gray-400"/> İlanlarım
                            </Link>
                            <button onClick={handleLogout} className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                               <LogOut size={18}/> Çıkış Yap
                            </button>
                          </div>
                       </div>
                    )}
                  </div>
                )}
            </div>

            {/* MOBİL: SAĞA ALINMIŞ HAMBURGER İCONU */}
            <button
                className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={28} />
            </button>

          </div>
        </div>
      </header>
      {mobileMenuOpen && <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />}
    </>
  );
}