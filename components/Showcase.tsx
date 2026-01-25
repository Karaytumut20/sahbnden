"use client";
import React, { useState } from 'react';
import AdCard from '@/components/AdCard';

export default function Showcase({ vitrinAds, urgentAds }: { vitrinAds: any[], urgentAds: any[] }) {
  const [activeTab, setActiveTab] = useState('vitrin');

  const getActiveAds = () => {
    switch (activeTab) {
      case 'acil': return urgentAds;
      case 'vitrin': return vitrinAds;
      default: return vitrinAds;
    }
  };

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-end border-b border-gray-200 mb-4 overflow-x-auto">
        <button onClick={() => setActiveTab('vitrin')} className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'vitrin' ? 'border-[#ffe800] text-[#333]' : 'border-transparent text-gray-500 hover:text-[#333]'}`}>Vitrindeki İlanlar</button>
        <button onClick={() => setActiveTab('acil')} className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'acil' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-red-600'}`}>Acil Acil</button>
      </div>

      {/* Grid yapısı 2'li (grid-cols-2) başlatıldı */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {getActiveAds().length === 0 ? (
          <div className="col-span-2 sm:col-span-3 lg:col-span-5 text-center p-10 text-gray-500">Bu kategoride ilan bulunamadı.</div>
        ) : (
          getActiveAds().map((ad) => (
            <div key={ad.id} className="h-[280px]">
                <AdCard ad={ad} viewMode="grid" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
