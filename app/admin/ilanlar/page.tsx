"use client";
import React, { useState, useEffect } from 'react';
import { Eye, Check, X, Filter, Loader2 } from 'lucide-react';
import { getAdminAdsClient, updateAdStatusClient } from '@/lib/services';
import { useToast } from '@/context/ToastContext';

export default function AdminAdsPage() {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('onay_bekliyor');
  const { addToast } = useToast();

  const fetchAds = async () => {
    setLoading(true);
    const data = await getAdminAdsClient();
    setAds(data);
    setLoading(false);
  };

  useEffect(() => { fetchAds(); }, []);

  const handleStatusChange = async (id: number, status: string) => {
    await updateAdStatusClient(id, status);
    addToast('Güncellendi.', 'success');
    fetchAds();
  };

  const filteredAds = ads.filter(ad => filter === 'hepsi' ? true : ad.status === filter);

  return (
    <div>
      <div className="flex justify-between mb-4"><h1 className="text-2xl font-bold">İlanlar</h1></div>
      <div className="bg-white border rounded-lg overflow-hidden">
        <div className="flex bg-gray-50 border-b p-2 gap-2">
           {['onay_bekliyor', 'yayinda', 'reddedildi', 'hepsi'].map(f => (
             <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 rounded capitalize ${filter === f ? 'bg-blue-100 text-blue-700 font-bold' : ''}`}>{f.replace('_', ' ')}</button>
           ))}
        </div>
        {loading ? <div className="p-10 text-center">Yükleniyor...</div> : (
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b"><tr><th className="p-3">Başlık</th><th className="p-3">Fiyat</th><th className="p-3">Durum</th><th className="p-3 text-right">İşlem</th></tr></thead>
            <tbody>
              {filteredAds.map(ad => (
                <tr key={ad.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{ad.title}</td>
                  <td className="p-3">{ad.price} {ad.currency}</td>
                  <td className="p-3"><span className="bg-gray-100 px-2 py-1 rounded text-xs">{ad.status}</span></td>
                  <td className="p-3 text-right flex justify-end gap-2">
                    {ad.status !== 'yayinda' && <button onClick={() => handleStatusChange(ad.id, 'yayinda')} className="text-green-600 bg-green-50 p-1 rounded"><Check size={16}/></button>}
                    {ad.status !== 'reddedildi' && <button onClick={() => handleStatusChange(ad.id, 'reddedildi')} className="text-red-600 bg-red-50 p-1 rounded"><X size={16}/></button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}