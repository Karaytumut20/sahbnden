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

// --- 1. ADIM: HISTORY CONTEXT (GEÇMİŞ YÖNETİMİ) ---
const contextHistory = `
"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

type Ad = {
  id: number;
  title: string;
  image: string;
  price: string;
  currency: string;
};

type HistoryContextType = {
  recentAds: Ad[];
  addToHistory: (ad: Ad) => void;
  clearHistory: () => void;
};

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [recentAds, setRecentAds] = useState<Ad[]>([]);

  // Başlangıçta LocalStorage'dan veriyi çek
  useEffect(() => {
    const stored = localStorage.getItem('sahibinden_history');
    if (stored) {
      setRecentAds(JSON.parse(stored));
    }
  }, []);

  const addToHistory = (ad: Ad) => {
    setRecentAds((prev) => {
      // Önce listede varsa çıkar (en başa eklemek için)
      const filtered = prev.filter((item) => item.id !== ad.id);
      // Yeni ilanı başa ekle, en fazla 5 tane tut
      const updated = [ad, ...filtered].slice(0, 5);

      localStorage.setItem('sahibinden_history', JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    setRecentAds([]);
    localStorage.removeItem('sahibinden_history');
  };

  return (
    <HistoryContext.Provider value={{ recentAds, addToHistory, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
}
`;

// --- 2. ADIM: HISTORY TRACKER (İLAN DETAY İÇİN GİZLİ BİLEŞEN) ---
const componentHistoryTracker = `
"use client";
import { useEffect } from 'react';
import { useHistory } from '@/context/HistoryContext';

export default function HistoryTracker({ ad }: { ad: any }) {
  const { addToHistory } = useHistory();

  useEffect(() => {
    if (ad) {
      addToHistory({
        id: ad.id,
        title: ad.title,
        image: ad.image,
        price: ad.price,
        currency: ad.currency
      });
    }
  }, [ad]); // ad değiştiğinde çalışır

  return null; // Görünmez bileşen
}
`;

// --- 3. ADIM: SON GEZİLENLER WIDGET'I (SIDEBAR İÇİN) ---
const componentRecentAdsWidget = `
"use client";
import React from 'react';
import Link from 'next/link';
import { useHistory } from '@/context/HistoryContext';
import { History, Trash2 } from 'lucide-react';

export default function RecentAdsWidget() {
  const { recentAds, clearHistory } = useHistory();

  if (recentAds.length === 0) return null;

  return (
    <div className="mt-4 bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
      <div className="bg-gray-50 p-3 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-xs font-bold text-[#333] flex items-center gap-1">
          <History size={14} className="text-blue-600" />
          Son Gezilenler
        </h3>
        <button onClick={clearHistory} className="text-gray-400 hover:text-red-500" title="Temizle">
          <Trash2 size={12} />
        </button>
      </div>

      <ul>
        {recentAds.map((ad) => (
          <li key={ad.id} className="border-b border-gray-50 last:border-0">
            <Link href={\`/ilan/\${ad.id}\`} className="flex gap-2 p-2 hover:bg-blue-50 transition-colors group">
              <div className="w-12 h-10 bg-gray-200 shrink-0 overflow-hidden rounded-sm border border-gray-200">
                <img src={ad.image} alt={ad.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-[#333] truncate group-hover:text-blue-700">{ad.title}</p>
                <p className="text-[10px] font-bold text-blue-900">{ad.price} {ad.currency}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
`;

// --- 4. ADIM: COOKIE BANNER (ÇEREZ UYARISI) ---
const componentCookieBanner = `
"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Cookie } from 'lucide-react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Daha önce kabul etmediyse göster
    const accepted = localStorage.getItem('cookie_consent');
    if (!accepted) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie_consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#333] text-white p-4 z-[9999] shadow-2xl animate-in slide-in-from-bottom-5 duration-500">
      <div className="container max-w-[1150px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Cookie size={32} className="text-[#ffe800] shrink-0" />
          <div className="text-xs md:text-sm">
            <p className="font-bold mb-1">Çerez Politikası</p>
            <p className="text-gray-300">
              Sizlere daha iyi hizmet sunabilmek adına sitemizde çerezler kullanılmaktadır.
              Devam ederek <Link href="/kurumsal/gizlilik-politikasi" className="text-[#ffe800] underline hover:text-white">Gizlilik Politikamızı</Link> kabul etmiş olursunuz.
            </p>
          </div>
        </div>
        <div className="flex gap-3 shrink-0">
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-white text-xs underline"
          >
            Reddet
          </button>
          <button
            onClick={handleAccept}
            className="bg-[#ffe800] text-black px-6 py-2 rounded-sm font-bold text-xs hover:bg-yellow-400 transition-colors"
          >
            Kabul Et
          </button>
        </div>
      </div>
    </div>
  );
}
`;

// --- 5. ADIM: PROVIDER GÜNCELLEMESİ (HISTORY EKLENDİ) ---
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

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <ModalProvider>
          <FavoritesProvider>
            <CompareProvider>
              <NotificationProvider>
                <HistoryProvider>
                  {children}
                </HistoryProvider>
              </NotificationProvider>
            </CompareProvider>
          </FavoritesProvider>
        </ModalProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
`;

// --- 6. ADIM: SIDEBAR GÜNCELLEMESİ (WIDGET EKLENDİ) ---
const componentsSidebarUpdated = `
import React from 'react';
import Link from 'next/link';
import { Home, Car, Monitor, Briefcase, Shirt, BookOpen, Dog, Hammer, ChevronRight } from 'lucide-react';
import { categories } from '@/lib/data';
import RecentAdsWidget from '@/components/RecentAdsWidget';

const iconMap: any = {
  Home, Car, Monitor, Briefcase, Shirt, BookOpen, Dog, Hammer
};

export default function Sidebar() {
  return (
    <aside className="w-[220px] shrink-0 hidden md:block py-4 relative z-40">
      <ul className="border border-gray-200 bg-white shadow-sm rounded-sm">
        {categories.map((cat, index) => {
          const IconComponent = iconMap[cat.icon] || Home;
          return (
            <li key={cat.id} className="group border-b border-gray-100 last:border-0 relative">
              <Link href={\`/search?category=\${cat.id}\`} className="flex items-center justify-between px-3 py-2.5 text-[13px] text-[#333] hover:bg-blue-50 hover:text-blue-700 transition-colors">
                <span className="flex items-center gap-2.5 font-medium">
                  <IconComponent size={15} className="text-gray-400 group-hover:text-blue-700" />
                  {cat.name}
                </span>
                <ChevronRight size={12} className="text-gray-300 opacity-0 group-hover:opacity-100" />
              </Link>

              {/* MEGA MENÜ */}
              <div className="hidden group-hover:block absolute left-[100%] top-0 w-[600px] min-h-full bg-white border border-gray-200 shadow-lg p-6 z-50 rounded-r-sm -ml-[1px]">
                <h3 className="font-bold text-[#333] text-lg border-b border-gray-200 pb-2 mb-4">{cat.name}</h3>
                <div className="grid grid-cols-3 gap-y-2 gap-x-8">
                  {cat.subs.map((sub: string, idx: number) => (
                    <Link key={idx} href="#" className="text-[13px] text-gray-600 hover:text-blue-700 hover:underline flex items-center gap-1">
                      <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                      {sub}
                    </Link>
                  ))}
                </div>
                <div className="mt-8 pt-4 border-t border-gray-100">
                   <Link href="#" className="text-blue-700 text-sm font-bold hover:underline">
                     Tüm {cat.name} İlanları &rarr;
                   </Link>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-sm text-center">
         <p className="text-[12px] font-bold text-blue-900">Reklam Alanı</p>
         <div className="h-[200px] bg-gray-200 mt-2 flex items-center justify-center text-gray-400 text-[10px]">
            Google Ads
         </div>
      </div>

      {/* SON GEZİLENLER WIDGET */}
      <RecentAdsWidget />
    </aside>
  );
}
`;

// --- 7. ADIM: İLAN DETAY GÜNCELLEMESİ (TRACKER EKLENDİ) ---
const appAdDetailUpdated = `
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAdById } from '@/lib/data';
import Breadcrumb from '@/components/Breadcrumb';
import Gallery from '@/components/Gallery';
import { Phone, User, ShieldCheck, ChevronRight } from 'lucide-react';
import MobileAdActionBar from '@/components/MobileAdActionBar';
import RelatedAds from '@/components/RelatedAds';
import AdActionButtons from '@/components/AdActionButtons';
import HistoryTracker from '@/components/HistoryTracker'; // YENİ

export default async function AdDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ad = getAdById(Number(id));

  if (!ad) return notFound();

  const sellerId = ad.sellerId || 101;
  const sellerName = ad.sellerName || 'Ahmet Yılmaz';

  return (
    <div className="pb-10">
      {/* GEÇMİŞ TAKİPÇİSİ (Client Component) */}
      <HistoryTracker ad={ad} />

      <Breadcrumb path={ad.category} />

      <div className="border-b border-gray-200 pb-2 mb-4">
        <h1 className="text-[#333] font-bold text-lg">{ad.title}</h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mb-20 md:mb-0">

        {/* SOL KOLON */}
        <div className="lg:w-[500px] shrink-0">
          <Gallery mainImage={ad.image} />
          <AdActionButtons id={ad.id} title={ad.title} />
        </div>

        {/* ORTA KOLON */}
        <div className="flex-1 min-w-0">
          <div className="mb-4 hidden md:block">
            <span className="block text-blue-600 font-bold text-xl">{ad.price} {ad.currency}</span>
            <span className="block text-gray-500 text-[12px] mt-1">{ad.location}</span>
          </div>

          <div className="border-t border-gray-200">
            {ad.attributes.map((attr: any, index: number) => (
              <div key={index} className="flex justify-between items-center py-1.5 border-b border-gray-100 text-[13px]">
                <span className="font-bold text-[#333]">{attr.label}</span>
                <span className={attr.label === 'İlan No' ? 'text-red-600' : 'text-[#333]'}>
                  {attr.value}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <h3 className="font-bold text-[#333] text-sm mb-3 border-b border-gray-200 pb-1">İlan Açıklaması</h3>
            <div className="text-[14px] text-[#333] leading-relaxed" dangerouslySetInnerHTML={{ __html: ad.description }} />
          </div>
        </div>

        {/* SAĞ KOLON */}
        <div className="lg:w-[260px] shrink-0 hidden md:block">
           <div className="border border-gray-200 bg-white p-4 rounded-sm shadow-sm sticky top-4">
              <h4 className="font-bold text-md text-[#333] mb-4">İlan Sahibi</h4>

              <Link href={\`/satici/\${sellerId}\`} className="flex items-center gap-3 mb-4 group cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded transition-colors">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                  <User size={20} />
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm text-[#333] group-hover:text-blue-700 flex justify-between items-center">
                    {sellerName} <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </p>
                  <p className="text-[11px] text-gray-500">Tüm İlanları</p>
                </div>
              </Link>

              <div className="space-y-2">
                <button className="w-full bg-[#4682b4] hover:bg-[#315f85] text-white font-bold py-2 rounded-sm text-sm flex items-center justify-center gap-2">
                   <Phone size={16} /> Cep Telini Göster
                </button>
                <button className="w-full border border-gray-300 bg-gray-50 hover:bg-gray-100 text-[#333] font-bold py-2 rounded-sm text-sm">
                   Mesaj Gönder
                </button>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 text-[11px] text-green-700 flex items-center gap-1">
                 <ShieldCheck size={14} />
                 <span>Güvenlik İpuçları</span>
              </div>
           </div>
        </div>

      </div>

      <RelatedAds category={ad.category} currentId={ad.id} />
      <MobileAdActionBar price={\`\${ad.price} \${ad.currency}\`} />
    </div>
  );
}
`;

// --- 8. ADIM: LAYOUT GÜNCELLEMESİ (COOKIE BANNER EKLENDİ) ---
const appLayoutUpdated = `
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Providers } from "@/components/Providers";
import CompareBar from "@/components/CompareBar";
import ModalRoot from "@/components/ModalRoot";
import CookieBanner from "@/components/CookieBanner"; // YENİ

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "sahibinden.com: Satılık, Kiralık, 2.El, Emlak, Oto, Araba",
  description: "Sahibinden.com klon projesi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body
        className={\`\${geistSans.variable} \${geistMono.variable} antialiased bg-[#f6f7f9] min-h-screen flex flex-col font-sans pb-[60px] md:pb-0\`}
      >
        <Providers>
          <Header />
          <div className="flex-1 w-full max-w-[1150px] mx-auto px-4 py-4">
              {children}
          </div>
          <Footer />
          <MobileBottomNav />
          <CompareBar />
          <ModalRoot />
          <CookieBanner />
        </Providers>
      </body>
    </html>
  );
}
`;

// --- DOSYALARI OLUŞTURUYORUZ ---

createFile("context/HistoryContext.tsx", contextHistory);
createFile("components/HistoryTracker.tsx", componentHistoryTracker);
createFile("components/RecentAdsWidget.tsx", componentRecentAdsWidget);
createFile("components/CookieBanner.tsx", componentCookieBanner);
createFile("components/Providers.tsx", componentsProvidersUpdated);
createFile("components/Sidebar.tsx", componentsSidebarUpdated);
createFile("app/ilan/[id]/page.tsx", appAdDetailUpdated);
createFile("app/layout.tsx", appLayoutUpdated);

console.log("---------------------------------------------------------");
console.log("🚀 Level 22 Güncellemesi Tamamlandı! (Geçmiş & Çerezler)");
console.log("---------------------------------------------------------");
console.log("Denenmesi Gerekenler:");
console.log(
  "1. Sayfayı yenileyin, altta siyah 'Çerez Politikası' barını görün ve kabul edin."
);
console.log(
  "2. Ana sayfadan farklı farklı 2-3 ilana tıklayın ve detaylarına girin."
);
console.log(
  "3. Ana sayfaya geri dönün; sol menüde 'Son Gezilenler' listesinin dolduğunu görün."
);
console.log("---------------------------------------------------------");
