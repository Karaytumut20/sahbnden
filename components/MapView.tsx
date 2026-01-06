
import React from 'react';

export default function MapView({ ads }: { ads: any[] }) {
  return (
    <div className="bg-gray-100 border border-gray-200 rounded-sm h-[600px] relative overflow-hidden group">
      {/* Harita Arka Planı (Temsili) */}
      <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/Istanbul_map.png')] bg-cover opacity-50 grayscale group-hover:grayscale-0 transition-all duration-1000"></div>

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <p className="bg-white/90 px-4 py-2 rounded-md shadow-md text-sm font-bold text-gray-700">
          Harita Modu Simülasyonu
        </p>
      </div>

      {/* Pinler */}
      {ads.slice(0, 10).map((ad, i) => (
        <div
          key={ad.id}
          className="absolute bg-blue-900 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg border-2 border-white cursor-pointer hover:scale-110 transition-transform"
          style={{
            top: `${20 + (i * 15) % 60}%`,
            left: `${10 + (i * 23) % 80}%`
          }}
          title={ad.title}
        >
          {ad.price}
        </div>
      ))}
    </div>
  );
}
