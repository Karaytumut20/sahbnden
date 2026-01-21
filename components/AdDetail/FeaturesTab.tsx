import React from 'react';
import { Check, X } from 'lucide-react';

export default function FeaturesTab({ ad }: { ad: any }) {
  // Veritabanından gelen veriye göre özellikleri ayıkla
  // Demo amaçlı statik bir liste üzerinden kontrol ediyoruz
  const featuresList = [
    { cat: 'İç Özellikler', items: ['ADSL', 'Ahşap Parke', 'Alarm', 'Balkon', 'Çelik Kapı', 'Duşakabin', 'Klima'] },
    { cat: 'Dış Özellikler', items: ['Asansör', 'Bahçeli', 'Fitness', 'Güvenlik', 'Isı Yalıtım', 'Otopark', 'Oyun Parkı'] },
    { cat: 'Muhit', items: ['Alışveriş Merkezi', 'Belediye', 'Cami', 'Hastane', 'Market', 'Okul', 'Park', 'Semt Pazarı'] },
  ];

  // Rastgele true/false atayalım (Gerçekte ad.features JSON'ından gelir)
  const isFeatureActive = (feature: string) => {
    // İlan açıklamasında veya başlığında geçiyorsa true varsayalım (Demo mantığı)
    return ad.description?.toLowerCase().includes(feature.toLowerCase()) || Math.random() > 0.5;
  };

  return (
    <div className="space-y-8">
      {featuresList.map((group, idx) => (
        <div key={idx}>
          <h4 className="font-bold text-[#333] border-b border-gray-200 pb-2 mb-4 text-sm uppercase">{group.cat}</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-2 gap-x-4">
            {group.items.map((item) => {
              const active = isFeatureActive(item);
              return (
                <div key={item} className={`flex items-center gap-2 text-xs ${active ? 'text-[#333] font-medium' : 'text-gray-400 decoration-slice'}`}>
                  {active ? <Check size={14} className="text-blue-600" /> : <span className="w-3.5 h-3.5 block"></span>}
                  {item}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}