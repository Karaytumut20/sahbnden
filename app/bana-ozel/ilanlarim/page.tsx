"use client";
import React, { useEffect, useState } from 'react';
import { Eye, Edit, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getUserAdsClient, updateAdStatusClient } from '@/lib/services';
import { useToast } from '@/context/ToastContext';

export default function MyAdsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMyAds = async () => {
    if (!user) return;
    setLoading(true);
    const data = await getUserAdsClient(user.id);
    setAds(data);
    setLoading(false);
  };

  useEffect(() => { fetchMyAds(); }, [user]);

  const handleStatusChange = async (id: number, newStatus: string) => {
    const { error } = await updateAdStatusClient(id, newStatus);
    if (!error) { addToast('İlan durumu güncellendi.', 'success'); fetchMyAds(); }
  };

  if (!user) return <div className="p-6">Giriş yapmalısınız.</div>;

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6 dark:bg-[#1c1c1c] dark:border-gray-700">
      <h2 className="text-xl font-bold text-[#333] mb-6 border-b border-gray-100 pb-2 dark:text-white">İlanlarım</h2>
      {loading ? <div className="flex justify-center p-6"><Loader2 className="animate-spin"/></div> : (
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
              {ads.map((ad) => (
                <tr key={ad.id} className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800">
                  <td className="p-3 font-semibold">{ad.title} <span className="block text-gray-400 text-[10px] font-normal">#{ad.id}</span></td>
                  <td className="p-3 text-blue-900 font-bold dark:text-blue-400">{ad.price.toLocaleString()} {ad.currency}</td>
                  <td className="p-3 text-gray-600 dark:text-gray-400">{new Date(ad.created_at).toLocaleDateString()}</td>
                  <td className="p-3"><span className="px-2 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">{ad.status}</span></td>
                  <td className="p-3 text-center">
                    <button onClick={() => { if(confirm('Silmek istiyor musunuz?')) handleStatusChange(ad.id, 'pasif'); }} className="text-red-600 hover:underline"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}