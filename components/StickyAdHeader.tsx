
"use client";
import React, { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';

type Props = {
  title: string;
  price: string;
  currency: string;
};

export default function StickyAdHeader({ title, price, currency }: Props) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // 400px aşağı inince göster
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 w-full bg-white shadow-md z-[80] border-b border-gray-200 animate-in slide-in-from-top duration-300 hidden md:block">
      <div className="container max-w-[1150px] mx-auto px-4 h-[60px] flex items-center justify-between">

        <div className="flex-1 min-w-0 pr-8">
          <h2 className="text-[#333] font-bold text-sm truncate">{title}</h2>
          <p className="text-xs text-gray-500">İlan No: 1029381</p>
        </div>

        <div className="flex items-center gap-6 shrink-0">
          <span className="text-xl font-bold text-blue-900">{price} {currency}</span>

          <button className="bg-blue-700 text-white px-6 py-2 rounded-sm font-bold text-sm hover:bg-blue-800 transition-colors flex items-center gap-2">
            <Phone size={16} /> Satıcıyı Ara
          </button>
        </div>

      </div>
    </div>
  );
}
