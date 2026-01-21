const fs = require("fs");
const path = require("path");

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
  magenta: "\x1b[35m",
};

console.log(
  colors.cyan +
    colors.bold +
    "\n🚀 SAHİBİNDEN CLONE - GELİŞTİRME PAKETİ 5 (INTERACTION & DASHBOARD)\n" +
    colors.reset,
);

function writeFile(filePath, content) {
  const absolutePath = path.join(__dirname, filePath);
  const dir = path.dirname(absolutePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(absolutePath, content.trim());
  console.log(
    `${colors.green}✔ Oluşturuldu/Güncellendi:${colors.reset} ${filePath}`,
  );
}

// -------------------------------------------------------------------------
// 1. CONTEXT YAPILARI (Modal & Bildirim & Mesaj)
// -------------------------------------------------------------------------

// Modal Context
const modalContextPath = "context/ModalContext.tsx";
const modalContextContent = `
"use client";
import React, { createContext, useContext, useState } from 'react';

type ModalType = 'SHARE' | 'REPORT' | 'OFFER' | null;
type ModalProps = Record<string, any>;

type ModalContextType = {
  activeModal: ModalType;
  modalProps: ModalProps;
  openModal: (type: ModalType, props?: ModalProps) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [modalProps, setModalProps] = useState<ModalProps>({});

  const openModal = (type: ModalType, props: ModalProps = {}) => {
    setActiveModal(type);
    setModalProps(props);
  };

  const closeModal = () => {
    setActiveModal(null);
    setModalProps({});
  };

  return (
    <ModalContext.Provider value={{ activeModal, modalProps, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
}
`;
writeFile(modalContextPath, modalContextContent);

// Notification Context
const notifContextPath = "context/NotificationContext.tsx";
const notifContextContent = `
"use client";
import React, { createContext, useContext, useState } from 'react';

type Notification = {
  id: number;
  title: string;
  message: string;
  read: boolean;
  date: string;
};

type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (title: string, message: string) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  // Demo Başlangıç Verileri
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, title: 'İlan Onayı', message: 'Satılık Daire ilanınız yayına alındı.', read: false, date: '10 dk önce' },
    { id: 2, title: 'Fiyat Düşüşü', message: 'Favori ilanınızda fiyat düştü!', read: false, date: '1 saat önce' },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (title: string, message: string) => {
    const newNotif = {
      id: Date.now(),
      title,
      message,
      read: false,
      date: 'Şimdi'
    };
    setNotifications([newNotif, ...notifications]);
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
`;
writeFile(notifContextPath, notifContextContent);

// -------------------------------------------------------------------------
// 2. MODAL BİLEŞENLERİ (Share, Report, Offer)
// -------------------------------------------------------------------------

// Share Modal
const shareModalPath = "components/modals/ShareModal.tsx";
const shareModalContent = `
"use client";
import React from 'react';
import { X, Copy, Facebook, Twitter, Linkedin, Mail } from 'lucide-react';
import { useModal } from '@/context/ModalContext';
import { useToast } from '@/context/ToastContext';

export default function ShareModal() {
  const { closeModal, modalProps } = useModal();
  const { addToast } = useToast();
  const { title, url } = modalProps;

  const handleCopy = () => {
    navigator.clipboard.writeText(url || window.location.href);
    addToast('Bağlantı kopyalandı!', 'success');
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal}></div>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm relative z-10 animate-in fade-in zoom-in-95 duration-200">

        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">İlanı Paylaş</h3>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{title}</p>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <button className="flex flex-col items-center gap-2 text-xs text-gray-600 hover:text-blue-600">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <Facebook size={20} />
              </div>
              Facebook
            </button>
            <button className="flex flex-col items-center gap-2 text-xs text-gray-600 hover:text-blue-400">
              <div className="w-10 h-10 bg-sky-100 text-sky-500 rounded-full flex items-center justify-center">
                <Twitter size={20} />
              </div>
              Twitter
            </button>
            <button className="flex flex-col items-center gap-2 text-xs text-gray-600 hover:text-blue-700">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                <Linkedin size={20} />
              </div>
              LinkedIn
            </button>
            <button className="flex flex-col items-center gap-2 text-xs text-gray-600 hover:text-red-600">
              <div className="w-10 h-10 bg-red-100 text-red-500 rounded-full flex items-center justify-center">
                <Mail size={20} />
              </div>
              E-posta
            </button>
          </div>

          <div className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-500">
            <span className="truncate flex-1">{url || 'https://sahibinden-klon.com/ilan/123'}</span>
            <button onClick={handleCopy} className="text-blue-600 hover:text-blue-800 font-bold p-1">
              <Copy size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
`;
writeFile(shareModalPath, shareModalContent);

// Report Modal
const reportModalPath = "components/modals/ReportModal.tsx";
const reportModalContent = `
"use client";
import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { useModal } from '@/context/ModalContext';
import { useToast } from '@/context/ToastContext';

export default function ReportModal() {
  const { closeModal, modalProps } = useModal();
  const { addToast } = useToast();
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      addToast('Lütfen bir neden seçiniz.', 'error');
      return;
    }
    // API Call simülasyonu
    addToast('Şikayetiniz tarafımıza ulaşmıştır. Teşekkürler.', 'success');
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal}></div>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-200">

        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-500" /> İlanı Şikayet Et
          </h3>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            <strong>İlan No:</strong> {modalProps.id} <br/>
            Lütfen şikayet nedeninizi belirtiniz:
          </p>

          <div className="space-y-3 mb-6">
            {['Yanlış Kategori', 'Yanlış Fiyat / Bilgi', 'Uygunsuz İçerik / Görsel', 'Dolandırıcılık Şüphesi', 'Satılmış Ürün'].map((r) => (
              <label key={r} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="reason"
                  value={r}
                  checked={reason === r}
                  onChange={(e) => setReason(e.target.value)}
                  className="accent-red-600"
                />
                {r}
              </label>
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 border border-gray-300 rounded text-sm font-bold text-gray-600 hover:bg-gray-50"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 rounded text-sm font-bold text-white hover:bg-red-700"
            >
              Şikayet Et
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
`;
writeFile(reportModalPath, reportModalContent);

// Offer Modal
const offerModalPath = "components/modals/OfferModal.tsx";
const offerModalContent = `
"use client";
import React, { useState } from 'react';
import { X, Tag, CheckCircle } from 'lucide-react';
import { useModal } from '@/context/ModalContext';
import { useToast } from '@/context/ToastContext';

export default function OfferModal() {
  const { closeModal, modalProps } = useModal();
  const { addToast } = useToast();
  const [offerType, setOfferType] = useState<'percent' | 'custom'>('percent');
  const [percent, setPercent] = useState<number | null>(null);
  const [customPrice, setCustomPrice] = useState('');

  // Fiyatı sayıya çevir (Örn: "1.250.000 TL")
  const currentPriceRaw = parseFloat(modalProps.price.replace(/\\./g, '').replace(',', '.'));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let finalOffer = 0;
    if (offerType === 'percent' && percent) {
      finalOffer = currentPriceRaw - (currentPriceRaw * percent / 100);
    } else if (offerType === 'custom' && customPrice) {
      finalOffer = parseFloat(customPrice);
    } else {
      addToast('Lütfen geçerli bir teklif giriniz.', 'error');
      return;
    }

    // API Simülasyonu
    addToast(\`\${finalOffer.toLocaleString('tr-TR')} TL tutarındaki teklifiniz satıcıya iletildi.\`, 'success');
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal}></div>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-200">

        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <Tag size={18} className="text-blue-600" /> Fiyat Teklifi Ver
          </h3>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-blue-50 p-3 rounded border border-blue-100 mb-6 flex justify-between items-center">
             <span className="text-sm text-blue-800">İlan Fiyatı:</span>
             <span className="font-bold text-blue-900 text-lg">{modalProps.price} {modalProps.currency}</span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex gap-4 mb-4">
              <button
                type="button"
                onClick={() => setOfferType('percent')}
                className={\`flex-1 py-2 text-sm font-bold rounded border transition-colors \${offerType === 'percent' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300'}\`}
              >
                İndirim İste (%)
              </button>
              <button
                type="button"
                onClick={() => setOfferType('custom')}
                className={\`flex-1 py-2 text-sm font-bold rounded border transition-colors \${offerType === 'custom' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-300'}\`}
              >
                Fiyat Öner (TL)
              </button>
            </div>

            {offerType === 'percent' ? (
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[5, 10, 15].map(p => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPercent(p)}
                    className={\`border rounded p-2 text-center hover:bg-gray-50 relative \${percent === p ? 'border-blue-500 ring-1 ring-blue-500 bg-blue-50' : 'border-gray-200'}\`}
                  >
                    <span className="block font-bold text-lg text-[#333]">%{p}</span>
                    <span className="block text-[10px] text-gray-500">İndirim</span>
                    {percent === p && <div className="absolute top-1 right-1 text-blue-600"><CheckCircle size={12} /></div>}
                  </button>
                ))}
              </div>
            ) : (
              <div className="mb-6">
                 <label className="block text-xs font-bold text-gray-600 mb-1">Teklif Ettiğiniz Tutar</label>
                 <input
                   type="number"
                   value={customPrice}
                   onChange={(e) => setCustomPrice(e.target.value)}
                   className="w-full border border-gray-300 rounded h-10 px-3 focus:border-blue-500 outline-none font-bold text-[#333]"
                   placeholder="Örn: 1500000"
                 />
                 {customPrice && (
                   <p className="text-xs text-green-600 mt-1 font-medium">
                     Yaklaşık %{Math.round(100 - (parseFloat(customPrice) / currentPriceRaw * 100))} indirim teklif ediyorsunuz.
                   </p>
                 )}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#ffe800] text-black font-bold py-3 rounded-sm hover:bg-yellow-400 transition-colors shadow-sm"
            >
              Teklifi Gönder
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
`;
writeFile(offerModalPath, offerModalContent);

// Modal Root (Provider içinde render edilecek)
const modalRootPath = "components/ModalRoot.tsx";
const modalRootContent = `
"use client";
import React from 'react';
import { useModal } from '@/context/ModalContext';
import ShareModal from './modals/ShareModal';
import ReportModal from './modals/ReportModal';
import OfferModal from './modals/OfferModal';

export default function ModalRoot() {
  const { activeModal } = useModal();

  if (!activeModal) return null;

  return (
    <>
      {activeModal === 'SHARE' && <ShareModal />}
      {activeModal === 'REPORT' && <ReportModal />}
      {activeModal === 'OFFER' && <OfferModal />}
    </>
  );
}
`;
writeFile(modalRootPath, modalRootContent);

// -------------------------------------------------------------------------
// 3. ENTEGRASYONLAR (Providers & Header Update)
// -------------------------------------------------------------------------

// Providers Update
const providersPath = "components/Providers.tsx";
const providersContent = `
"use client";
import React from 'react';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { AuthProvider } from '@/context/AuthContext';
import { ToastProvider } from '@/context/ToastContext';
import { CompareProvider } from '@/context/CompareContext';
import { HistoryProvider } from '@/context/HistoryContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { ModalProvider } from '@/context/ModalContext';
import { ThemeProvider } from '@/context/ThemeContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <NotificationProvider>
            <ModalProvider>
              <FavoritesProvider>
                <CompareProvider>
                  <HistoryProvider>
                    {children}
                  </HistoryProvider>
                </CompareProvider>
              </FavoritesProvider>
            </ModalProvider>
          </NotificationProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
`;
writeFile(providersPath, providersContent);

// Header Update (Bildirim Entegrasyonu)
const headerPath = "components/Header.tsx";
const headerContent = `
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
      router.push(\`/search?q=\${encodeURIComponent(searchTerm)}\`);
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
                      <Link key={ad.id} href={\`/ilan/\${ad.id}\`} onClick={() => setShowSuggestions(false)} className="flex items-center justify-between px-3 py-2 text-[12px] hover:bg-blue-50 hover:text-blue-700 border-b border-gray-50 last:border-0">
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
                            <div key={notif.id} onClick={() => markAsRead(notif.id)} className={\`p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer \${!notif.read ? 'bg-blue-50/50' : ''}\`}>
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
`;
writeFile(headerPath, headerContent);

// -------------------------------------------------------------------------
// 4. SAYFALAR (Dashboard & Mesajlar)
// -------------------------------------------------------------------------

// Dashboard Home (Bana Özel)
const dashboardPath = "app/bana-ozel/page.tsx";
const dashboardContent = `
"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUserStatsClient } from '@/lib/services';
import { List, Eye, MessageSquare, TrendingUp } from 'lucide-react';

export default function DashboardHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ adsCount: 0 });

  useEffect(() => {
    if (user) {
      getUserStatsClient(user.id).then(setStats);
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 p-6 rounded-sm shadow-sm">
        <h1 className="text-xl font-bold text-[#333] mb-1">Hoş Geldiniz, {user.name}</h1>
        <p className="text-sm text-gray-500 mb-6">Hesap özetiniz ve son aktiviteleriniz aşağıdadır.</p>

        {/* İstatistik Kartları */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-sm border border-blue-100 flex items-center gap-4">
            <div className="bg-blue-200 p-3 rounded-full text-blue-700"><List size={24}/></div>
            <div>
               <span className="block text-2xl font-bold text-blue-800">{stats.adsCount}</span>
               <span className="text-xs text-blue-600 font-bold uppercase">Yayındaki İlan</span>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-sm border border-green-100 flex items-center gap-4">
            <div className="bg-green-200 p-3 rounded-full text-green-700"><MessageSquare size={24}/></div>
            <div>
               <span className="block text-2xl font-bold text-green-800">2</span>
               <span className="text-xs text-green-600 font-bold uppercase">Okunmamış Mesaj</span>
            </div>
          </div>
          <div className="bg-orange-50 p-4 rounded-sm border border-orange-100 flex items-center gap-4">
            <div className="bg-orange-200 p-3 rounded-full text-orange-700"><Eye size={24}/></div>
            <div>
               <span className="block text-2xl font-bold text-orange-800">1.2K</span>
               <span className="text-xs text-orange-600 font-bold uppercase">Toplam Görüntülenme</span>
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-sm border border-purple-100 flex items-center gap-4">
            <div className="bg-purple-200 p-3 rounded-full text-purple-700"><TrendingUp size={24}/></div>
            <div>
               <span className="block text-2xl font-bold text-purple-800">%12</span>
               <span className="text-xs text-purple-600 font-bold uppercase">Etkileşim Artışı</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-white border border-gray-200 p-6 rounded-sm shadow-sm">
            <h3 className="font-bold text-[#333] mb-4 border-b border-gray-100 pb-2">Son Aktiviteler</h3>
            <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex gap-2"><span className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></span> İlanınız "Satılık Daire" yayına alındı.</li>
                <li className="flex gap-2"><span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></span> Yeni bir mesaj aldınız.</li>
                <li className="flex gap-2"><span className="w-2 h-2 bg-gray-400 rounded-full mt-1.5"></span> Şifreniz güncellendi.</li>
            </ul>
         </div>
         <div className="bg-white border border-gray-200 p-6 rounded-sm shadow-sm flex items-center justify-center text-center">
            <div>
                <h3 className="font-bold text-lg mb-2">Mağaza Açarak Daha Fazla Satın!</h3>
                <p className="text-sm text-gray-500 mb-4">Kurumsal mağaza özellikleri ile ilanlarınızı öne çıkarın.</p>
                <button className="bg-[#ffe800] text-black font-bold px-6 py-2 rounded-sm text-sm">Mağaza Paketlerini İncele</button>
            </div>
         </div>
      </div>
    </div>
  );
}
`;
writeFile(dashboardPath, dashboardContent);

// Mesajlaşma (Split View)
const messagesPath = "app/bana-ozel/mesajlar/page.tsx";
const messagesContent = `
"use client";
import React, { useState } from 'react';
import { Search, Send, MoreVertical, Phone } from 'lucide-react';

const mockConversations = [
  { id: 1, name: 'Ahmet Yılmaz', lastMsg: 'Son fiyat ne olur?', time: '14:30', avatar: 'AY', unread: 2 },
  { id: 2, name: 'Mehmet Demir', lastMsg: 'Takas düşünür müsünüz?', time: 'Dün', avatar: 'MD', unread: 0 },
  { id: 3, name: 'Ayşe Kaya', lastMsg: 'Yarın gelip görebilir miyim?', time: 'Pzt', avatar: 'AK', unread: 0 },
];

const mockMessages = [
  { id: 1, sender: 'other', text: 'Merhaba, ilanınızla ilgileniyorum.', time: '14:20' },
  { id: 2, sender: 'me', text: 'Merhaba, buyurun nasıl yardımcı olabilirim?', time: '14:22' },
  { id: 3, sender: 'other', text: 'Son fiyat ne olur? Öğrenciyim de biraz indirim yaparsanız sevinirim.', time: '14:25' },
];

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState(1);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState(mockMessages);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    setMessages([...messages, {
      id: Date.now(),
      sender: 'me',
      text: messageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setMessageInput('');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm h-[calc(100vh-140px)] flex overflow-hidden dark:bg-[#1c1c1c] dark:border-gray-700 transition-colors">

      {/* SOL TARA: KONUŞMA LİSTESİ */}
      <div className="w-[300px] border-r border-gray-200 flex flex-col dark:border-gray-700">
        <div className="p-3 border-b border-gray-200 bg-gray-50 dark:bg-[#151515] dark:border-gray-700">
          <div className="relative">
            <input
              type="text"
              placeholder="Mesajlarda ara..."
              className="w-full border border-gray-300 rounded-full h-8 pl-8 pr-3 text-[12px] focus:outline-none focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
            <Search size={14} className="absolute left-2.5 top-2 text-gray-400" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {mockConversations.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setActiveChat(chat.id)}
              className={\`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 transition-colors dark:border-gray-800 dark:hover:bg-gray-800 \${activeChat === chat.id ? 'bg-blue-50 border-l-4 border-l-blue-600 dark:bg-blue-900/20 dark:border-l-blue-500' : ''}\`}
            >
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm shrink-0 dark:bg-gray-700 dark:text-gray-300">
                {chat.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="text-[13px] font-bold text-[#333] truncate dark:text-gray-200">{chat.name}</h4>
                  <span className="text-[10px] text-gray-400 shrink-0">{chat.time}</span>
                </div>
                <p className="text-[11px] text-gray-500 truncate dark:text-gray-400">{chat.lastMsg}</p>
              </div>
              {chat.unread > 0 && (
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                  {chat.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SAĞ TARAF: SOHBET PENCERESİ */}
      <div className="flex-1 flex flex-col bg-[#efeae2] relative dark:bg-[#0b141a]">
        {/* Sohbet Başlığı */}
        <div className="h-[60px] bg-gray-100 border-b border-gray-200 flex items-center justify-between px-4 shrink-0 dark:bg-[#1c1c1c] dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-sm dark:bg-gray-700 dark:text-gray-300">
              AY
            </div>
            <div>
              <h3 className="font-bold text-[#333] text-sm dark:text-white">Ahmet Yılmaz</h3>
              <p className="text-[11px] text-gray-500 dark:text-gray-400">Çevrimiçi</p>
            </div>
          </div>
          <div className="flex gap-4 text-gray-600 dark:text-gray-400">
            <Phone size={20} className="cursor-pointer hover:text-blue-600" />
            <MoreVertical size={20} className="cursor-pointer hover:text-blue-600" />
          </div>
        </div>

        {/* Mesaj Alanı */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 relative">
          {/* Karanlık Mod Arka Plan Deseni */}
          <div className="absolute inset-0 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat opacity-50 dark:opacity-5 pointer-events-none"></div>

          {messages.map((msg) => (
            <div key={msg.id} className={\`flex relative z-10 \${msg.sender === 'me' ? 'justify-end' : 'justify-start'}\`}>
              <div className={\`max-w-[70%] rounded-md p-2 shadow-sm text-[13px] relative \${msg.sender === 'me' ? 'bg-[#d9fdd3] text-[#111] dark:bg-[#005c4b] dark:text-white' : 'bg-white text-[#111] dark:bg-[#202c33] dark:text-white'}\`}>
                <p>{msg.text}</p>
                <span className="text-[10px] text-gray-500 block text-right mt-1 ml-2 dark:text-gray-400">{msg.time}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Input Alanı */}
        <div className="bg-gray-100 p-3 border-t border-gray-200 dark:bg-[#1c1c1c] dark:border-gray-700">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Bir mesaj yazın..."
              className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
            <button type="submit" className="bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center">
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
`;
writeFile(messagesPath, messagesContent);

// -------------------------------------------------------------------------
// 5. MODAL ROOT ENTEGRASYONU (App Layout)
// -------------------------------------------------------------------------
// Layout dosyasını güncelleyerek ModalRoot'u ekleyelim
const layoutPath = "app/layout.tsx";
const layoutContent = `
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { Providers } from "@/components/Providers";
import CompareBar from "@/components/CompareBar";
import ModalRoot from "@/components/ModalRoot";
import CookieBanner from "@/components/CookieBanner";

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
    <html lang="tr" suppressHydrationWarning>
      <body
        className={\`\${geistSans.variable} \${geistMono.variable} antialiased min-h-screen flex flex-col font-sans pb-[60px] md:pb-0\`}
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
writeFile(layoutPath, layoutContent);

console.log(
  colors.bold + "\n🎉 GELİŞTİRME PAKETİ 5 TAMAMLANDI!" + colors.reset,
);
console.log("1. Global Modal Sistemi ve Bildirim Altyapısı kuruldu.");
console.log(
  "2. Header güncellendi: Bildirimler ve Gelişmiş Kullanıcı Menüsü eklendi.",
);
console.log("3. Bana Özel (Dashboard) anasayfası istatistiklerle donatıldı.");
console.log("4. Mesajlar sayfası profesyonel iki sütunlu yapıya geçti.");
