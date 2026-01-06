"use client";
import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';

export default function MyAdsPage() {
  const myAds = [
    { id: 101, title: 'Sahibinden temiz aile aracı 2018 model', price: '950.000 TL', date: '20 Ocak 2025', status: 'active', views: 124 },
    { id: 102, title: 'Kadıköy merkezde kiralık 2+1 daire', price: '25.000 TL', date: '15 Ocak 2025', status: 'pending', views: 45 },
    { id: 103, title: 'Az kullanılmış oyun bilgisayarı', price: '35.000 TL', date: '10 Aralık 2024', status: 'passive', views: 890 },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6 dark:bg-[#1c1c1c] dark:border-gray-700 transition-colors">
      <h2 className="text-xl font-bold text-[#333] mb-6 border-b border-gray-100 pb-2 dark:text-white dark:border-gray-700">İlanlarım</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50 text-[12px] text-gray-500 border-b border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700">
              <th className="p-3">İlan Başlığı</th>
              <th className="p-3">Fiyat</th>
              <th className="p-3">Tarih</th>
              <th className="p-3">Durum</th>
              <th className="p-3 text-center">İşlemler</th>
            </tr>
          </thead>
          <tbody className="text-[13px] text-[#333] dark:text-gray-200">
            {myAds.map((ad) => (
              <tr key={ad.id} className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50">
                <td className="p-3 font-semibold">
                  {ad.title}
                  <div className="flex items-center gap-1 text-gray-400 text-[10px] mt-1 font-normal">
                    <Eye size={10} /> {ad.views} görüntülenme
                  </div>
                </td>
                <td className="p-3 text-blue-900 font-bold dark:text-blue-400">{ad.price}</td>
                <td className="p-3 text-gray-600 dark:text-gray-400">{ad.date}</td>
                <td className="p-3">
                  {ad.status === 'active' && <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-[10px] font-bold dark:bg-green-900/30 dark:text-green-400">Yayında</span>}
                  {ad.status === 'pending' && <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-[10px] font-bold dark:bg-yellow-900/30 dark:text-yellow-400">Onay Bekliyor</span>}
                  {ad.status === 'passive' && <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-[10px] font-bold dark:bg-gray-700 dark:text-gray-400">Pasif</span>}
                </td>
                <td className="p-3">
                  <div className="flex justify-center gap-2">
                    <button className="p-1.5 border border-gray-300 rounded hover:bg-blue-50 text-blue-600 dark:border-gray-600 dark:text-blue-400 dark:hover:bg-gray-700" title="Düzenle">
                      <Edit size={14} />
                    </button>
                    <button className="p-1.5 border border-gray-300 rounded hover:bg-red-50 text-red-600 dark:border-gray-600 dark:text-red-400 dark:hover:bg-gray-700" title="Sil">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}