
"use client";
import React, { useState } from 'react';
import { Eye, Check, X, Filter } from 'lucide-react';

const mockPendingAds = Array.from({ length: 8 }).map((_, i) => ({
  id: 1000 + i,
  title: i % 2 === 0 ? 'Acil Satılık Deniz Manzaralı Daire' : '2020 Model Düşük KM Araç',
  user: 'Ahmet Yılmaz',
  category: i % 2 === 0 ? 'Emlak' : 'Vasıta',
  price: i % 2 === 0 ? '5.250.000 TL' : '850.000 TL',
  date: '25.01.2025',
  status: 'pending'
}));

export default function AdminAdsPage() {
  const [ads, setAds] = useState(mockPendingAds);

  const handleApprove = (id: number) => {
    // API çağrısı simülasyonu
    setAds(ads.filter(ad => ad.id !== id));
    alert(`İlan #${id} onaylandı ve yayına alındı.`);
  };

  const handleReject = (id: number) => {
    setAds(ads.filter(ad => ad.id !== id));
    alert(`İlan #${id} reddedildi.`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">İlan Yönetimi</h1>
        <div className="flex gap-2">
          <button className="bg-white border border-gray-300 text-gray-600 px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 hover:bg-gray-50">
            <Filter size={16} /> Filtrele
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
            Tümünü Onayla
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex gap-4 text-sm font-medium text-gray-600">
          <button className="text-blue-600 border-b-2 border-blue-600 pb-4 -mb-4 px-2">Onay Bekleyenler ({ads.length})</button>
          <button className="hover:text-gray-900 px-2 pb-4 -mb-4">Yayındakiler</button>
          <button className="hover:text-gray-900 px-2 pb-4 -mb-4">Reddedilenler</button>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="bg-white text-xs font-bold text-gray-500 border-b border-gray-100 uppercase tracking-wider">
              <th className="p-4">İlan Bilgisi</th>
              <th className="p-4">Kullanıcı</th>
              <th className="p-4">Fiyat</th>
              <th className="p-4">Tarih</th>
              <th className="p-4 text-right">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm">
            {ads.map((ad) => (
              <tr key={ad.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-4">
                  <p className="font-bold text-gray-800">{ad.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{ad.category} • #{ad.id}</p>
                </td>
                <td className="p-4 text-gray-700">{ad.user}</td>
                <td className="p-4 font-bold text-gray-900">{ad.price}</td>
                <td className="p-4 text-gray-500">{ad.date}</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded tooltip" title="Önizle">
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleApprove(ad.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded bg-green-50/50 border border-green-200" title="Onayla"
                    >
                      <Check size={18} />
                    </button>
                    <button
                      onClick={() => handleReject(ad.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded bg-red-50/50 border border-red-200" title="Reddet"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {ads.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  Onay bekleyen ilan bulunmamaktadır.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
