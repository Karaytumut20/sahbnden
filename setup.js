const fs = require("fs");
const path = require("path");

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  yellow: "\x1b[33m",
  bold: "\x1b[1m",
};

console.log(
  colors.blue +
    colors.bold +
    "\n➡️ MOBİL MENÜ SAĞA TAŞINIYOR ➡️\n" +
    colors.reset,
);

const mobileMenuContent = `
"use client";
import React from 'react';
import Link from 'next/link';
import { X, ChevronRight, Home, Car, Monitor, Briefcase, Wallet, Store, List, Heart, MessageSquare, Settings, LogOut, User } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { user, logout } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex md:hidden justify-end">
      {/* Karartma Arka Planı */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      {/* Menü İçeriği - SAĞDAN AÇILIR HALE GETİRİLDİ */}
      <div className="relative w-[85%] max-w-[320px] bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

        {/* Üst Kısım: Kullanıcı Bilgisi */}
        <div className="bg-slate-900 text-white p-5 pt-10 flex flex-col gap-3 relative overflow-hidden shrink-0">
          <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-600/20 rounded-full -ml-10 -mt-10 blur-xl"></div>

          <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-20">
            <X size={24} />
          </button>

          {user ? (
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                 <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-lg font-bold border-2 border-white/20 shadow-lg text-white overflow-hidden">
                    {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="avatar"/> : (user.name?.charAt(0) || 'U')}
                 </div>
                 <div className="min-w-0">
                    <p className="font-bold text-lg leading-tight truncate">{user.name}</p>
                    <p className="text-xs text-indigo-300 font-medium truncate">{user.email}</p>
                 </div>
              </div>
              <div className="flex gap-2 mt-3">
                 <button onClick={() => { logout(); onClose(); }} className="flex items-center gap-1 text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors border border-white/10">
                    <LogOut size={12}/> Çıkış Yap
                 </button>
              </div>
            </div>
          ) : (
            <div className="relative z-10">
              <p className="font-bold text-xl mb-1">Hoş Geldiniz</p>
              <p className="text-xs text-slate-400 mb-4">Giriş yapın veya üye olun.</p>
              <div className="flex gap-3">
                <Link href="/login" onClick={onClose} className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg font-bold text-sm text-center shadow-lg shadow-indigo-900/50">Giriş Yap</Link>
                <Link href="/register" onClick={onClose} className="flex-1 bg-white/10 text-white py-2.5 rounded-lg font-bold text-sm text-center border border-white/10">Üye Ol</Link>
              </div>
            </div>
          )}
        </div>

        {/* Menü Linkleri */}
        <div className="flex-1 overflow-y-auto py-2 bg-slate-50">
          {user && (
            <div className="mb-4 bg-white border-b border-slate-100 py-2">
               <p className="px-5 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Bana Özel</p>
               <ul className="text-sm text-slate-700 font-medium">
                  <li><Link href="/bana-ozel" onClick={onClose} className="flex items-center gap-3 px-5 py-3 hover:bg-indigo-50 border-l-4 border-transparent hover:border-indigo-600"><Home size={18} className="text-slate-400"/> Özet Durum</Link></li>
                  <li><Link href="/bana-ozel/ilanlarim" onClick={onClose} className="flex items-center gap-3 px-5 py-3 hover:bg-indigo-50 border-l-4 border-transparent hover:border-indigo-600"><List size={18} className="text-slate-400"/> İlanlarım</Link></li>
                  <li><Link href="/bana-ozel/mesajlarim" onClick={onClose} className="flex items-center gap-3 px-5 py-3 hover:bg-indigo-50 border-l-4 border-transparent hover:border-indigo-600"><MessageSquare size={18} className="text-slate-400"/> Mesajlar</Link></li>
                  <li><Link href="/bana-ozel/ayarlar" onClick={onClose} className="flex items-center gap-3 px-5 py-3 hover:bg-indigo-50 border-l-4 border-transparent hover:border-indigo-600"><Settings size={18} className="text-slate-400"/> Ayarlar</Link></li>
               </ul>
            </div>
          )}

          <div className="bg-white border-b border-slate-100 py-2">
            <p className="px-5 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">Kategoriler</p>
            <ul className="text-sm text-slate-700 font-medium">
              <li><Link href="/search?category=emlak" onClick={onClose} className="flex items-center justify-between px-5 py-3 hover:bg-indigo-50"><span className="flex items-center gap-3"><Home size={18} className="text-indigo-600"/> Emlak</span><ChevronRight size={16}/></Link></li>
              <li><Link href="/search?category=vasita" onClick={onClose} className="flex items-center justify-between px-5 py-3 hover:bg-indigo-50"><span className="flex items-center gap-3"><Car size={18} className="text-indigo-600"/> Vasıta</span><ChevronRight size={16}/></Link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
`;

try {
  const filePath = path.join(process.cwd(), "components/MobileMenu.tsx");
  fs.writeFileSync(filePath, mobileMenuContent.trim());
  console.log(
    "\x1b[32m✔ [BAŞARILI]\x1b[0m components/MobileMenu.tsx güncellendi.",
  );
  console.log("\x1b[33mDeğişiklik Özeti:\x1b[0m");
  console.log("1. Ana konteynere 'justify-end' eklenerek içerik sağa dayandı.");
  console.log("2. Animasyon sınıfı 'slide-in-from-right' olarak değiştirildi.");
} catch (error) {
  console.error("\x1b[31m✘ [HATA]\x1b[0m Dosya yazılamadı: " + error.message);
}

console.log(
  "\n" + colors.green + colors.bold + "İŞLEM TAMAMLANDI!" + colors.reset + "\n",
);
