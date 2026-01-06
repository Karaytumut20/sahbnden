const fs = require("fs");
const path = require("path");

// Klasör yollarını oluşturma fonksiyonu
function ensureDirectoryExistence(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

// Dosya oluşturma fonksiyonu
function createFile(filePath, content) {
  ensureDirectoryExistence(filePath);
  fs.writeFileSync(filePath, content, "utf8");
  console.log(`✅ Oluşturuldu/Güncellendi: ${filePath}`);
}

// --- 1. ADIM: THEME CONTEXT (KARANLIK MOD ALTYAPISI) ---
const contextTheme = `
"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  // Başlangıçta tercihi kontrol et
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme;
    if (storedTheme) {
      setTheme(storedTheme);
      if (storedTheme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);

      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
`;

// --- 2. ADIM: TEMA DEĞİŞTİRME BUTONU ---
const componentThemeToggle = `
"use client";
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/80 hover:text-white"
      title={theme === 'light' ? 'Karanlık Moda Geç' : 'Aydınlık Moda Geç'}
    >
      {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
    </button>
  );
}
`;

// --- 3. ADIM: AYARLAR SAYFASI ---
const appSettingsPage = `
"use client";
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { User, Lock, Bell, Shield, Save } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'notifications'>('profile');
  const [loading, setLoading] = useState(false);

  // Form States
  const [profileData, setProfileData] = useState({ name: user?.name || '', email: user?.email || '', phone: '+90 555 123 45 67' });
  const [securityData, setSecurityData] = useState({ currentPass: '', newPass: '', confirmPass: '', twoFactor: false });
  const [notifData, setNotifData] = useState({ emailAd: true, emailNews: false, smsAd: true, smsSecurity: true });

  const handleSave = () => {
    setLoading(true);
    // API Simülasyonu
    setTimeout(() => {
      setLoading(false);
      addToast('Ayarlarınız başarıyla güncellendi.', 'success');
    }, 1000);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm min-h-[500px] flex flex-col md:flex-row dark:bg-gray-800 dark:border-gray-700">

      {/* SOL MENÜ */}
      <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 p-4">
        <h2 className="font-bold text-[#333] dark:text-white mb-4 px-2">Hesap Ayarları</h2>
        <nav className="space-y-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={\`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors \${activeTab === 'profile' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'}\`}
          >
            <User size={18} /> Profil Bilgileri
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={\`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors \${activeTab === 'security' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'}\`}
          >
            <Lock size={18} /> Şifre ve Güvenlik
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={\`w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors \${activeTab === 'notifications' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'}\`}
          >
            <Bell size={18} /> Bildirim Tercihleri
          </button>
        </nav>
      </div>

      {/* SAĞ İÇERİK */}
      <div className="flex-1 p-6 md:p-8">

        {/* PROFİL SEKMESİ */}
        {activeTab === 'profile' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
            <div>
              <h3 className="text-lg font-bold text-[#333] dark:text-white mb-1">Profil Bilgileri</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Kişisel bilgilerinizi buradan güncelleyebilirsiniz.</p>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-xl font-bold text-blue-600 dark:text-blue-300">
                {user?.avatar || 'U'}
              </div>
              <button className="text-sm text-blue-700 font-bold hover:underline dark:text-blue-400">Fotoğrafı Değiştir</button>
            </div>

            <div className="grid gap-4 max-w-md">
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">Ad Soyad</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-sm h-10 px-3 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">E-posta</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-sm h-10 px-3 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">Cep Telefonu</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-sm h-10 px-3 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* GÜVENLİK SEKMESİ */}
        {activeTab === 'security' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
            <div>
              <h3 className="text-lg font-bold text-[#333] dark:text-white mb-1">Şifre ve Güvenlik</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Hesap güvenliğinizi artırmak için güçlü bir şifre kullanın.</p>
            </div>

            <div className="grid gap-4 max-w-md border-b border-gray-100 dark:border-gray-700 pb-6">
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">Mevcut Şifre</label>
                <input
                  type="password"
                  value={securityData.currentPass}
                  onChange={(e) => setSecurityData({...securityData, currentPass: e.target.value})}
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-sm h-10 px-3 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">Yeni Şifre</label>
                <input
                  type="password"
                  value={securityData.newPass}
                  onChange={(e) => setSecurityData({...securityData, newPass: e.target.value})}
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-sm h-10 px-3 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">Yeni Şifre (Tekrar)</label>
                <input
                  type="password"
                  value={securityData.confirmPass}
                  onChange={(e) => setSecurityData({...securityData, confirmPass: e.target.value})}
                  className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-sm h-10 px-3 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <h4 className="font-bold text-sm text-[#333] dark:text-white mb-3 flex items-center gap-2">
                <Shield size={16} className="text-green-600" /> İki Aşamalı Doğrulama (2FA)
              </h4>
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={securityData.twoFactor}
                    onChange={(e) => setSecurityData({...securityData, twoFactor: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  Giriş yaparken telefonuma SMS kodu gönder.
                </span>
              </label>
            </div>
          </div>
        )}

        {/* BİLDİRİMLER SEKMESİ */}
        {activeTab === 'notifications' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
            <div>
              <h3 className="text-lg font-bold text-[#333] dark:text-white mb-1">Bildirim Tercihleri</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Hangi konularda bildirim almak istediğinizi seçin.</p>
            </div>

            <div className="space-y-4 max-w-lg">
              <div className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-700">
                <div>
                  <p className="font-bold text-sm text-[#333] dark:text-white">İlan Güncellemeleri (E-posta)</p>
                  <p className="text-xs text-gray-500">Favori ilanlarınızın fiyatı düştüğünde.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifData.emailAd}
                  onChange={(e) => setNotifData({...notifData, emailAd: e.target.checked})}
                  className="accent-blue-600 w-4 h-4"
                />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-700">
                <div>
                  <p className="font-bold text-sm text-[#333] dark:text-white">Kampanya ve Haberler (E-posta)</p>
                  <p className="text-xs text-gray-500">Yeni özellikler ve fırsatlar hakkında.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifData.emailNews}
                  onChange={(e) => setNotifData({...notifData, emailNews: e.target.checked})}
                  className="accent-blue-600 w-4 h-4"
                />
              </div>
              <div className="flex items-center justify-between py-3 border-b border-gray-50 dark:border-gray-700">
                <div>
                  <p className="font-bold text-sm text-[#333] dark:text-white">İlan Mesajları (SMS)</p>
                  <p className="text-xs text-gray-500">Biri ilanınıza mesaj attığında.</p>
                </div>
                <input
                  type="checkbox"
                  checked={notifData.smsAd}
                  onChange={(e) => setNotifData({...notifData, smsAd: e.target.checked})}
                  className="accent-blue-600 w-4 h-4"
                />
              </div>
            </div>
          </div>
        )}

        {/* KAYDET BUTONU */}
        <div className="mt-8 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-blue-700 text-white px-8 py-3 rounded-sm font-bold text-sm hover:bg-blue-800 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Kaydediliyor...' : <><Save size={16} /> Değişiklikleri Kaydet</>}
          </button>
        </div>

      </div>
    </div>
  );
}
`;

// --- 4. ADIM: PROVIDER GÜNCELLEMESİ (THEME EKLENDİ) ---
const componentsProvidersUpdated = `
"use client";
import React from 'react';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { CompareProvider } from '@/context/CompareContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { ModalProvider } from '@/context/ModalContext';
import { HistoryProvider } from '@/context/HistoryContext';
import { MessageProvider } from '@/context/MessageContext';
import { ThemeProvider } from '@/context/ThemeContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <ModalProvider>
            <FavoritesProvider>
              <CompareProvider>
                <NotificationProvider>
                  <HistoryProvider>
                    <MessageProvider>
                      {children}
                    </MessageProvider>
                  </HistoryProvider>
                </NotificationProvider>
              </CompareProvider>
            </FavoritesProvider>
          </ModalProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
`;

// --- 5. ADIM: HEADER GÜNCELLEMESİ (TOGGLE VE AYARLAR EKLENDİ) ---
const componentsHeaderV27 = `
"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Plus, User, Heart, LogOut, ChevronDown, Menu, ArrowUpRight, Bell, Settings } from 'lucide-react';
import { useFavorites } from '@/context/FavoritesContext';
import { useAuth } from '@/context/AuthContext';
import { useNotifications } from '@/context/NotificationContext';
import MobileMenu from '@/components/MobileMenu';
import ThemeToggle from '@/components/ThemeToggle'; // YENİ
import { ads, categories } from '@/lib/data';

export default function Header() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<{ads: any[], cats: any[]}>({ ads: [], cats: [] });

  const router = useRouter();
  const { favorites } = useFavorites();
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    if (searchTerm.length >= 2) {
      const q = searchTerm.toLowerCase();
      const matchedAds = ads.filter(ad => ad.title.toLowerCase().includes(q)).slice(0, 3);
      const matchedCats = categories.filter(cat => cat.name.toLowerCase().includes(q)).slice(0, 2);
      setSuggestions({ ads: matchedAds, cats: matchedCats });
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuggestions(false);
    if (searchTerm.trim()) {
      router.push(\`/search?q=\${encodeURIComponent(searchTerm)}\`);
    }
  };

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
            {showSuggestions && (suggestions.ads.length > 0 || suggestions.cats.length > 0) && (
              <div className="absolute top-full left-0 w-full bg-white text-[#333] border border-gray-200 rounded-b-sm shadow-lg mt-1 z-[60] overflow-hidden">
                {suggestions.cats.length > 0 && (
                  <div className="border-b border-gray-100">
                    <p className="px-3 py-2 text-[10px] font-bold text-gray-400 bg-gray-50 uppercase">Kategoriler</p>
                    {suggestions.cats.map(cat => (
                      <Link key={cat.id} href={\`/search?category=\${cat.id}\`} onClick={() => setShowSuggestions(false)} className="block px-3 py-2 text-[12px] hover:bg-blue-50 hover:text-blue-700">
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )}
                {suggestions.ads.length > 0 && (
                  <div>
                    <p className="px-3 py-2 text-[10px] font-bold text-gray-400 bg-gray-50 uppercase">İlanlar</p>
                    {suggestions.ads.map(ad => (
                      <Link key={ad.id} href={\`/ilan/\${ad.id}\`} onClick={() => setShowSuggestions(false)} className="flex items-center justify-between px-3 py-2 text-[12px] hover:bg-blue-50 hover:text-blue-700 border-b border-gray-50 last:border-0">
                        <span className="truncate flex-1">{ad.title}</span>
                        <ArrowUpRight size={12} className="text-gray-400 ml-2" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 text-[12px] font-medium">

            {/* TEMA DEĞİŞTİRİCİ */}
            <ThemeToggle />

            {!user ? (
              <>
                <Link href="/login" className="hover:text-[#ffe800] whitespace-nowrap hidden sm:inline">Giriş Yap</Link>
                <span className="text-gray-500 hidden sm:inline">|</span>
                <Link href="/register" className="hover:text-[#ffe800] whitespace-nowrap hidden sm:inline">Üye Ol</Link>
              </>
            ) : (
              <>
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
                          notifications.map(notif => (
                            <div
                              key={notif.id}
                              onClick={() => markAsRead(notif.id)}
                              className={\`p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer \${!notif.read ? 'bg-blue-50/50' : ''}\`}
                            >
                              <div className="flex justify-between items-start mb-1">
                                <span className={\`text-[12px] font-semibold \${!notif.read ? 'text-blue-800' : 'text-gray-700'}\`}>{notif.title}</span>
                                <span className="text-[10px] text-gray-400">{notif.date}</span>
                              </div>
                              <p className="text-[11px] text-gray-600 leading-snug">{notif.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative hidden sm:block">
                  <button onClick={() => setMenuOpen(!menuOpen)} className="flex items-center gap-2 hover:text-[#ffe800] focus:outline-none">
                    <div className="w-6 h-6 bg-blue-700 rounded-full flex items-center justify-center text-[10px] font-bold">
                      {user.avatar}
                    </div>
                    <span>{user.name}</span>
                    <ChevronDown size={12} />
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white text-[#333] border border-gray-200 rounded-sm shadow-lg py-1 z-50">
                      <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
                        <p className="font-bold text-[13px]">{user.name}</p>
                        <p className="text-[10px] text-gray-500">{user.email}</p>
                      </div>
                      <Link href="/bana-ozel" onClick={() => setMenuOpen(false)} className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-700 text-[13px]">Bana Özel Özet</Link>
                      <Link href="/bana-ozel/ilanlarim" onClick={() => setMenuOpen(false)} className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-700 text-[13px]">İlanlarım</Link>
                      <Link href="/bana-ozel/favori-aramalar" onClick={() => setMenuOpen(false)} className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-700 text-[13px]">Favori Aramalarım</Link>
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
               <Heart size={14} className={favorites.length > 0 ? 'fill-[#ffe800] text-[#ffe800]' : ''} />
               <span className="hidden sm:inline">Favorilerim</span>
               {favorites.length > 0 && <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full">{favorites.length}</span>}
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
`;

// --- DOSYALARI OLUŞTURUYORUZ ---

createFile("context/ThemeContext.tsx", contextTheme);
createFile("components/ThemeToggle.tsx", componentThemeToggle);
createFile("app/bana-ozel/ayarlar/page.tsx", appSettingsPage);
createFile("components/Header.tsx", componentsHeaderV27);
createFile("components/Providers.tsx", componentsProvidersUpdated);

console.log("---------------------------------------------------------");
console.log("🚀 Level 27 Güncellemesi Tamamlandı! (Ayarlar & Dark Mode)");
console.log("---------------------------------------------------------");
console.log("Denenmesi Gerekenler:");
console.log(
  "1. Header'daki Güneş/Ay ikonuna tıklayarak Karanlık Mod'u açın/kapatın."
);
console.log("2. Kullanıcı menüsünden (Sağ üst) 'Ayarlar'a gidin.");
console.log(
  "3. 'Profil', 'Şifre' ve 'Bildirimler' sekmeleri arasında gezinin."
);
console.log(
  "4. Formları doldurup 'Kaydet' butonuna basarak toast mesajını görün."
);
console.log("---------------------------------------------------------");
