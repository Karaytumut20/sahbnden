
"use client";
import React, { useState } from 'react';

export default function Gallery({ mainImage }) {
  const [activeImage, setActiveImage] = useState(mainImage);

  // Dummy thumbnails
  const thumbnails = [
    mainImage,
    'https://picsum.photos/seed/101/800/600',
    'https://picsum.photos/seed/102/800/600',
    'https://picsum.photos/seed/103/800/600',
    'https://picsum.photos/seed/104/800/600',
  ];

  return (
    <div className="w-full">
      <div className="border border-gray-300 p-1 bg-white mb-2 relative aspect-[4/3] sm:aspect-video">
        <img src={activeImage} className="w-full h-full object-contain bg-gray-100" />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {thumbnails.map((img, idx) => (
          <div
            key={idx}
            onMouseEnter={() => setActiveImage(img)}
            className={`w-16 h-12 border cursor-pointer shrink-0 ${activeImage === img ? 'border-blue-600 ring-1 ring-blue-600' : 'border-gray-300'}`}
          >
            <img src={img} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
    </div>
  );
}
