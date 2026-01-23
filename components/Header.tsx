"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, Plus, Heart, LogOut, ChevronDown, Menu, Bell, Settings } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import MobileMenu from '@/components/MobileMenu';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useDebounce } from '@/hooks/useDebounce';

export default function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (searchTerm.trim()) router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
  };

  const handleLogout = async () => { setMenuOpen(false); await logout(); }

  return (
    <>
      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 h-[80px] flex items-center justify-center sticky top-0 z-50 transition-all shadow-sm">
        <div className="container max-w-7xl flex items-center justify-between px-6 h-full">

          <div className="flex items-center gap-8">
            <button className="md:hidden text-gray-700" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>

            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg transition-transform group-hover:scale-105">
                M
              </div>
              <span className="font-bold text-2xl tracking-tight text-slate-800 hidden sm:block">
                Marketplace
              </span>
            </Link>
          </div>

          <div className="flex-1 max-w-[500px] mx-8 relative hidden md:block" ref={searchRef}>
            <form onSubmit={handleSearch} className="relative group">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Ne arıyorsunuz? (Akıllı Arama)"
                className="w-full h-[50px] pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all text-sm text-gray-700 placeholder:text-gray-400 shadow-inner group-hover:shadow-md"
              />
              <Search size={20} className="absolute left-4 top-[15px] text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
            </form>
          </div>

          <div className="flex items-center gap-4">
            <LanguageSwitcher />

            <div className="hidden sm:flex items-center gap-3">
                <Link href="/ilan-ver" className="bg-indigo-600 text-white px-6 py-3 rounded-full text-sm font-bold hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2">
                    <Plus size={18}/> <span className="hidden lg:inline">İlan Ver</span>
                </Link>
            </div>

            {!user ? (
              <div className="flex items-center gap-4 text-sm font-bold">
                <Link href="/login" className="text-gray-600 hover:text-indigo-600 transition-colors">Giriş</Link>
                <Link href="/register" className="text-indigo-600 bg-indigo-50 px-5 py-2.5 rounded-full hover:bg-indigo-100 transition-colors">Kayıt</Link>
              </div>
            ) : (
              <div className="relative" onClick={() => setMenuOpen(!menuOpen)}>
                <button className="flex items-center gap-3 focus:outline-none p-1.5 pr-4 rounded-full hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all">
                  <div className="w-9 h-9 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md ring-2 ring-white">
                      {user.name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex flex-col items-start leading-none hidden sm:flex">
                      <span className="text-sm font-bold text-gray-800 max-w-[80px] truncate">{user.name}</span>
                  </div>
                  <ChevronDown size={14} className="text-gray-400" />
                </button>
                {menuOpen && (
                   <div className="absolute right-0 top-full mt-3 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-2 z-50 overflow-hidden">
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Çıkış Yap</button>
                   </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>
      {mobileMenuOpen && <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />}
    </>
  );
}