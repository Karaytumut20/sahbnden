
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
