
"use client";
import React from 'react';
import Link from 'next/link';
import { X, ChevronRight, Home, Car, Monitor, Briefcase } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { user } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex md:hidden">
      {/* Karartma Arka Planı */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>

      {/* Menü İçeriği */}
      <div className="relative w-[80%] max-w-[300px] bg-white h-full shadow-xl flex flex-col animate-in slide-in-from-left duration-300">

        {/* Üst Kısım: Kullanıcı Bilgisi */}
        <div className="bg-[#2d405a] text-white p-4 pt-8 flex flex-col gap-2 relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-white/80 hover:text-white">
            <X size={24} />
          </button>

          {user ? (
            <div>
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-lg font-bold mb-2 border-2 border-white">
                {user.avatar}
              </div>
              <p className="font-bold">{user.name}</p>
              <p className="text-xs text-gray-300">{user.email}</p>
            </div>
          ) : (
            <div>
              <p className="font-bold text-lg mb-2">Hoş Geldiniz</p>
              <div className="flex gap-2 text-xs">
                <Link href="/login" onClick={onClose} className="bg-[#ffe800] text-black px-3 py-1.5 rounded-sm font-bold">Giriş Yap</Link>
                <Link href="/register" onClick={onClose} className="border border-white px-3 py-1.5 rounded-sm font-bold">Üye Ol</Link>
              </div>
            </div>
          )}
        </div>

        {/* Kategoriler */}
        <div className="flex-1 overflow-y-auto py-2">
          <p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">Kategoriler</p>
          <ul className="text-sm text-[#333]">
            <li>
              <Link href="/search?category=emlak" onClick={onClose} className="flex items-center justify-between px-4 py-3 border-b border-gray-100 active:bg-gray-50">
                <span className="flex items-center gap-3"><Home size={18} className="text-blue-900"/> Emlak</span>
                <ChevronRight size={16} className="text-gray-400"/>
              </Link>
            </li>
            <li>
              <Link href="/search?category=vasita" onClick={onClose} className="flex items-center justify-between px-4 py-3 border-b border-gray-100 active:bg-gray-50">
                <span className="flex items-center gap-3"><Car size={18} className="text-blue-900"/> Vasıta</span>
                <ChevronRight size={16} className="text-gray-400"/>
              </Link>
            </li>
            <li>
              <Link href="/search?category=alisveris" onClick={onClose} className="flex items-center justify-between px-4 py-3 border-b border-gray-100 active:bg-gray-50">
                <span className="flex items-center gap-3"><Monitor size={18} className="text-blue-900"/> İkinci El ve Sıfır Alışveriş</span>
                <ChevronRight size={16} className="text-gray-400"/>
              </Link>
            </li>
             <li>
              <Link href="/magaza/ornek-emlak" onClick={onClose} className="flex items-center justify-between px-4 py-3 border-b border-gray-100 active:bg-gray-50">
                <span className="flex items-center gap-3"><Briefcase size={18} className="text-blue-900"/> Örnek Emlak Ofisi</span>
                <ChevronRight size={16} className="text-gray-400"/>
              </Link>
            </li>
          </ul>

          <p className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider mt-4">Kurumsal</p>
          <ul className="text-sm text-[#333]">
            <li><Link href="#" className="block px-4 py-2 hover:bg-gray-50">Hakkımızda</Link></li>
            <li><Link href="#" className="block px-4 py-2 hover:bg-gray-50">Yardım ve İşlem Rehberi</Link></li>
            <li><Link href="#" className="block px-4 py-2 hover:bg-gray-50">Reklam Verin</Link></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
