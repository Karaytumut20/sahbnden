
"use client";
import React, { useState } from 'react';
import { Maximize2, Camera } from 'lucide-react';
import Lightbox from './Lightbox';

export default function Gallery({ mainImage }: { mainImage: string }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Demo resimler (Gerçekte mainImage ve diğerleri API'den gelir)
  const images = [
    mainImage,
    'https://picsum.photos/seed/101/800/600',
    'https://picsum.photos/seed/102/800/600',
    'https://picsum.photos/seed/103/800/600',
    'https://picsum.photos/seed/104/800/600',
    'https://picsum.photos/seed/105/800/600',
  ];

  const handleNext = () => setActiveImageIndex((prev) => (prev + 1) % images.length);
  const handlePrev = () => setActiveImageIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <>
      <div className="w-full select-none">

        {/* Büyük Resim */}
        <div
          className="border border-gray-300 p-1 bg-white mb-2 relative aspect-[4/3] sm:aspect-video group cursor-pointer"
          onClick={() => setIsLightboxOpen(true)}
        >
          <img src={images[activeImageIndex]} className="w-full h-full object-contain bg-gray-100" />

          {/* Büyüt İkonu */}
          <div className="absolute top-3 right-3 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <Maximize2 size={20} />
          </div>

          {/* Resim Sayısı */}
          <div className="absolute bottom-3 left-3 bg-black/60 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
            <Camera size={12} />
            {activeImageIndex + 1} / {images.length}
          </div>
        </div>

        {/* Küçük Resimler */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {images.map((img, idx) => (
            <div
              key={idx}
              onMouseEnter={() => setActiveImageIndex(idx)}
              onClick={() => { setActiveImageIndex(idx); setIsLightboxOpen(true); }}
              className={`w-16 h-12 border cursor-pointer shrink-0 transition-all ${activeImageIndex === idx ? 'border-blue-600 ring-2 ring-blue-600 ring-offset-1' : 'border-gray-300 hover:border-gray-400'}`}
            >
              <img src={img} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      <Lightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={images}
        currentIndex={activeImageIndex}
        onNext={handleNext}
        onPrev={handlePrev}
        setIndex={setActiveImageIndex}
      />
    </>
  );
}
