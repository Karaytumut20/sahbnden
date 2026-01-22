"use client";
import React, { useState } from 'react';
import { Maximize2, Camera } from 'lucide-react';
import Lightbox from './Lightbox';

export default function Gallery({ mainImage }: { mainImage: string }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Demo Resimler
  const images = [mainImage, 'https://picsum.photos/seed/101/800/600', 'https://picsum.photos/seed/102/800/600', 'https://picsum.photos/seed/103/800/600'];

  return (
    <div className="space-y-3">
        <div
          className="relative aspect-[4/3] bg-slate-100 rounded-xl overflow-hidden border border-slate-200 cursor-zoom-in group"
          onClick={() => setIsLightboxOpen(true)}
        >
          <img src={images[activeImageIndex]} className="w-full h-full object-contain" />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors"></div>

          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 flex items-center gap-2 shadow-sm">
            <Camera size={14}/> {activeImageIndex + 1} / {images.length}
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {images.map((img, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setActiveImageIndex(idx)}
              onClick={() => setActiveImageIndex(idx)}
              className={`w-20 h-16 rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${activeImageIndex === idx ? 'border-indigo-600 ring-2 ring-indigo-100' : 'border-transparent opacity-70 hover:opacity-100'}`}
            >
              <img src={img} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>

        <Lightbox
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
          images={images}
          currentIndex={activeImageIndex}
          onNext={() => setActiveImageIndex((i) => (i + 1) % images.length)}
          onPrev={() => setActiveImageIndex((i) => (i - 1 + images.length) % images.length)}
          setIndex={setActiveImageIndex}
        />
    </div>
  );
}