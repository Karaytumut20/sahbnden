
"use client";
import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

type LightboxProps = {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
  setIndex: (index: number) => void;
};

export default function Lightbox({ isOpen, onClose, images, currentIndex, onNext, onPrev, setIndex }: LightboxProps) {

  // Klavye Kontrolü
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowRight') onNext();
    if (e.key === 'ArrowLeft') onPrev();
  }, [isOpen, onClose, onNext, onPrev]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    // Scrollu kilitle
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-black/95 flex items-center justify-center animate-in fade-in duration-200">

      {/* Kapat Butonu */}
      <button onClick={onClose} className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-50">
        <X size={32} />
      </button>

      {/* Sayaç */}
      <div className="absolute top-4 left-4 text-white/80 font-bold text-sm bg-white/10 px-3 py-1 rounded-full">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Ana Resim */}
      <div className="relative w-full h-full flex items-center justify-center p-4 md:p-20">
        <img
          src={images[currentIndex]}
          alt={`Görsel ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain shadow-2xl rounded-sm select-none"
        />
      </div>

      {/* Yön Butonları */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white hover:bg-white/10 p-3 rounded-full transition-all"
      >
        <ChevronLeft size={48} />
      </button>

      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white hover:bg-white/10 p-3 rounded-full transition-all"
      >
        <ChevronRight size={48} />
      </button>

      {/* Alt Önizleme Şeridi */}
      <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2 overflow-x-auto px-4 pb-2">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setIndex(idx)}
            className={`w-16 h-12 border-2 shrink-0 transition-all opacity-80 hover:opacity-100 ${currentIndex === idx ? 'border-blue-500 scale-110 opacity-100 z-10' : 'border-transparent'}`}
          >
            <img src={img} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
