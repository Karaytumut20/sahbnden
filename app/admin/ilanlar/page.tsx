
"use client";
import React, { useState, useEffect } from 'react';
import { Eye, Check, X, Filter, Loader2 } from 'lucide-react';
import { getAdminAds, updateAdStatus } from '@/lib/services';
import { useToast } from '@/context/ToastContext';

export default function AdminAdsPage() {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('onay_bekliyor'); // hepsi, onay_bekliyor, yayinda, reddedildi
  const { addToast } = useToast();

  const fetchAds = async () => {
    setLoading(true);
    const data = await getAdminAds();
    setAds(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleStatusChange = async (id: number, status: string) => {
    const { error } = await updateAdStatus(id, status);
    if (error) {
      addToast('İşlem başarısız.', 'error');
    } else {
      addToast(`İlan durumu güncellendi: ${status}`, 'success');
      fetchAds(); // Listeyi yenile
    }
  };

  const filteredAds = ads.filter(ad => {
    if (filter === 'hepsi') return true;
    return ad.status === filter;
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">İlan Yönetimi</h1>
        <button onClick={fetchAds} className="p-2 bg-gray-100 rounded hover:bg-gray-200"><Filter size={16}/></button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex gap-4 text-sm font-medium text-gray-600 overflow-x-auto">
          {['onay_bekliyor', 'yayinda', 'reddedildi', 'hepsi'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-md capitalize transition-colors ${filter === f ? 'bg-blue-100 text-blue-700 font-bold' : 'hover:bg-gray-200'}`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-blue-600"/></div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white text-xs font-bold text-gray-500 border-b border-gray-100 uppercase tracking-wider">
                <th className="p-4">İlan Bilgisi</th>
                <th className="p-4">Kullanıcı</th>
                <th className="p-4">Fiyat</th>
                <th className="p-4">Durum</th>
                <th className="p-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {filteredAds.map((ad) => (
                <tr key={ad.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-gray-800 line-clamp-1">{ad.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{ad.category} • #{ad.id}</p>
                  </td>
                  <td className="p-4 text-gray-700">{ad.profiles?.full_name || 'Bilinmiyor'}</td>
                  <td className="p-4 font-bold text-gray-900">{ad.price.toLocaleString()} {ad.currency}</td>
                  <td className="p-4">
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      ad.status === 'yayinda' ? 'bg-green-100 text-green-700' :
                      ad.status === 'onay_bekliyor' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {ad.status?.toUpperCase().replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-gray-500 hover:bg-gray-100 rounded tooltip" title="Önizle">
                        <Eye size={18} />
                      </button>
                      {ad.status !== 'yayinda' && (
                        <button
                          onClick={() => handleStatusChange(ad.id, 'yayinda')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded bg-green-50/50 border border-green-200" title="Onayla"
                        >
                          <Check size={18} />
                        </button>
                      )}
                      {ad.status !== 'reddedildi' && (
                        <button
                          onClick={() => handleStatusChange(ad.id, 'reddedildi')}
                          className="p-2 text-red-600 hover:bg-red-50 rounded bg-red-50/50 border border-red-200" title="Reddet"
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredAds.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">Bu filtred eilan bulunamadı.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
