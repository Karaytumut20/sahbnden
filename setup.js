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

// --- 1. ADIM: AUTH CONTEXT (OTURUM YÖNETİMİ) ---
const contextAuth = `
"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  name: string;
  email: string;
  avatar?: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Sayfa yenilendiğinde oturumu hatırla (Simülasyon)
  useEffect(() => {
    const storedUser = localStorage.getItem('sahibinden_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string) => {
    // Mock user verisi
    const mockUser = {
      name: 'Ahmet Yılmaz',
      email: email,
      avatar: 'AY'
    };
    setUser(mockUser);
    localStorage.setItem('sahibinden_user', JSON.stringify(mockUser));
    router.push('/bana-ozel'); // Giriş başarılıysa yönlendir
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sahibinden_user');
    router.push('/');
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data };
      setUser(updated);
      localStorage.setItem('sahibinden_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
`;

// --- 2. ADIM: PROVIDER GÜNCELLEMESİ (AUTH + FAVORITES) ---
const componentsProvidersUpdated = `
"use client";
import React from 'react';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { AuthProvider } from '@/context/AuthContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <FavoritesProvider>
        {children}
      </FavoritesProvider>
    </AuthProvider>
  );
}
`;

// --- 3. ADIM: DİNAMİK HEADER (KULLANICI DURUMUNA GÖRE) ---
const componentsHeaderAuth = `
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
      router.push(\`/search?q=\${encodeURIComponent(searchTerm)}\`);
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
`;

// --- 4. ADIM: LOGIN SAYFASI (CONTEXT BAĞLANTISI) ---
const appLoginPageUpdated = `
"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('kullanici@ornek.com');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] bg-[#f6f7f9]">
      <div className="bg-white border border-gray-200 shadow-sm p-8 rounded-sm w-full max-w-[400px]">
        <h2 className="text-[#333] font-bold text-lg mb-6 text-center">Üye Girişi</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[12px] font-bold text-[#333] mb-1">E-posta Adresi</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-sm h-[34px] px-3 focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[#333] mb-1">Şifre</label>
            <input
              type="password"
              defaultValue="123456"
              className="w-full border border-gray-300 rounded-sm h-[34px] px-3 focus:border-blue-500 focus:outline-none transition-colors"
            />
          </div>

          <button type="submit" className="w-full bg-blue-700 text-white font-bold h-[40px] rounded-sm hover:bg-blue-800 transition-colors shadow-sm mt-2">
            Giriş Yap
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-[12px] text-gray-600 mb-2">Henüz hesabın yok mu?</p>
          <Link href="#" className="inline-block border border-yellow-500 text-[#333] font-bold py-2 px-6 rounded-sm bg-yellow-50 hover:bg-yellow-100 transition-colors text-[13px]">
            Üye Ol
          </Link>
        </div>
      </div>
    </div>
  );
}
`;

// --- 5. ADIM: İLANLARIM SAYFASI ---
const appMyAdsPage = `
"use client";
import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';

export default function MyAdsPage() {
  const myAds = [
    { id: 101, title: 'Sahibinden temiz aile aracı 2018 model', price: '950.000 TL', date: '20 Ocak 2025', status: 'active', views: 124 },
    { id: 102, title: 'Kadıköy merkezde kiralık 2+1 daire', price: '25.000 TL', date: '15 Ocak 2025', status: 'pending', views: 45 },
    { id: 103, title: 'Az kullanılmış oyun bilgisayarı', price: '35.000 TL', date: '10 Aralık 2024', status: 'passive', views: 890 },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6">
      <h2 className="text-xl font-bold text-[#333] mb-6 border-b border-gray-100 pb-2">İlanlarım</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-[12px] text-gray-500 border-b border-gray-200">
              <th className="p-3">İlan Başlığı</th>
              <th className="p-3">Fiyat</th>
              <th className="p-3">Tarih</th>
              <th className="p-3">Durum</th>
              <th className="p-3 text-center">İşlemler</th>
            </tr>
          </thead>
          <tbody className="text-[13px] text-[#333]">
            {myAds.map((ad) => (
              <tr key={ad.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-3 font-semibold">
                  {ad.title}
                  <div className="flex items-center gap-1 text-gray-400 text-[10px] mt-1 font-normal">
                    <Eye size={10} /> {ad.views} görüntülenme
                  </div>
                </td>
                <td className="p-3 text-blue-900 font-bold">{ad.price}</td>
                <td className="p-3 text-gray-600">{ad.date}</td>
                <td className="p-3">
                  {ad.status === 'active' && <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-[10px] font-bold">Yayında</span>}
                  {ad.status === 'pending' && <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-[10px] font-bold">Onay Bekliyor</span>}
                  {ad.status === 'passive' && <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-[10px] font-bold">Pasif</span>}
                </td>
                <td className="p-3">
                  <div className="flex justify-center gap-2">
                    <button className="p-1.5 border border-gray-300 rounded hover:bg-blue-50 text-blue-600" title="Düzenle">
                      <Edit size={14} />
                    </button>
                    <button className="p-1.5 border border-gray-300 rounded hover:bg-red-50 text-red-600" title="Sil">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
`;

// --- 6. ADIM: AYARLAR SAYFASI ---
const appSettingsPage = `
"use client";
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name, email });
    alert('Bilgileriniz güncellendi!');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6 max-w-[600px]">
      <h2 className="text-xl font-bold text-[#333] mb-6 border-b border-gray-100 pb-2">Üyelik Bilgilerim</h2>

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-[12px] font-bold text-[#333] mb-1">Ad Soyad</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-sm h-[34px] px-3 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[12px] font-bold text-[#333] mb-1">E-posta</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-sm h-[34px] px-3 focus:border-blue-500 focus:outline-none bg-gray-50"
          />
        </div>

        <div className="pt-4 border-t border-gray-100 mt-4">
          <h3 className="text-sm font-bold text-[#333] mb-3">Şifre Değiştir</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">Yeni Şifre</label>
              <input type="password" className="w-full border border-gray-300 rounded-sm h-[34px] px-3 focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">Yeni Şifre (Tekrar)</label>
              <input type="password" className="w-full border border-gray-300 rounded-sm h-[34px] px-3 focus:border-blue-500 focus:outline-none" />
            </div>
          </div>
        </div>

        <button type="submit" className="bg-blue-700 text-white font-bold py-2 px-6 rounded-sm hover:bg-blue-800 text-[13px] mt-4">
          Kaydet ve Güncelle
        </button>
      </form>
    </div>
  );
}
`;

// --- DOSYALARI OLUŞTURUYORUZ ---

createFile("context/AuthContext.tsx", contextAuth); // Auth Context
createFile("components/Providers.tsx", componentsProvidersUpdated); // Provider Wrapper
createFile("components/Header.tsx", componentsHeaderAuth); // Akıllı Header
createFile("app/login/page.tsx", appLoginPageUpdated); // Login Entegrasyonu
createFile("app/bana-ozel/ilanlarim/page.tsx", appMyAdsPage); // İlanlarım
createFile("app/bana-ozel/ayarlar/page.tsx", appSettingsPage); // Ayarlar

console.log("---------------------------------------------------------");
console.log("🚀 Level 8 Güncellemesi Tamamlandı! (Oturum Yönetimi)");
console.log("---------------------------------------------------------");
console.log("Denenmesi Gerekenler:");
console.log("1. /login sayfasına gidin ve 'Giriş Yap'a basın.");
console.log("2. Header'da artık isminizi görmelisiniz. Tıklayıp menüyü açın.");
console.log("3. Menüden 'İlanlarım' veya 'Ayarlar' sayfalarını gezin.");
console.log(
  "4. 'Çıkış Yap' diyerek oturumu kapatın ve Header'ın eski haline döndüğünü görün."
);
console.log("---------------------------------------------------------");
