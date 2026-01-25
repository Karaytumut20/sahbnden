"use client";
import React, { useState, useEffect } from 'react';
import { Eye, Check, X, Filter, Loader2, AlertCircle } from 'lucide-react';
import { getAdminAdsClient } from '@/lib/services';
import { approveAdAction, rejectAdAction } from '@/lib/actions';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link';

export default function AdminAdsPage() {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [processingId, setProcessingId] = useState<number | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    setLoading(true);
    const data = await getAdminAdsClient();
    setAds(data);
    setLoading(false);
  };

  const handleApprove = async (id: number) => {
    if(!confirm('Bu ilanı yayınlamak istiyor musunuz?')) return;
    setProcessingId(id);

    try {
        const res = await approveAdAction(id);
        if(res.success) {
            addToast('İlan başarıyla onaylandı.', 'success');
            // Listeyi yerel olarak güncelle (Tekrar fetch etmeden)
            setAds(prev => prev.map(ad => ad.id === id ? { ...ad, status: 'yayinda' } : ad));
        } else {
            console.error("Onay Hatası:", res.error);
            addToast(`Hata: ${res.error}`, 'error');
        }
    } catch (e) {
        addToast('Beklenmedik bir hata oluştu.', 'error');
    }

    setProcessingId(null);
  };

  const handleReject = async (id: number) => {
    const reason = prompt('Reddetme sebebini yazınız:');
    if(reason === null) return;

    setProcessingId(id);

    try {
        const res = await rejectAdAction(id, reason);
        if(res.success) {
            addToast('İlan reddedildi.', 'info');
            setAds(prev => prev.map(ad => ad.id === id ? { ...ad, status: 'reddedildi' } : ad));
        } else {
            console.error("Red Hatası:", res.error);
            addToast(`Hata: ${res.error}`, 'error');
        }
    } catch (e) {
        addToast('Beklenmedik bir hata oluştu.', 'error');
    }

    setProcessingId(null);
  };

  const filteredAds = ads.filter(ad => {
    if (filter === 'all') return true;
    return ad.status === filter;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">İlan Yönetimi</h1>
        <div className="flex items-center gap-2 bg-white p-1 rounded-md border border-gray-200">
          <Filter size={16} className="text-gray-500 ml-2" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="p-2 text-sm outline-none bg-transparent"
          >
            <option value="all">Tüm İlanlar</option>
            <option value="onay_bekliyor">Onay Bekleyenler</option>
            <option value="yayinda">Yayındakiler</option>
            <option value="reddedildi">Reddedilenler</option>
            <option value="pasif">Pasif</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
            <div className="p-10 text-center flex flex-col items-center gap-2">
                <Loader2 className="animate-spin text-blue-600" />
                <span className="text-gray-500 text-sm">İlanlar yükleniyor...</span>
            </div>
        ) : filteredAds.length === 0 ? (
            <div className="p-10 text-center text-gray-500">Bu kriterde ilan bulunamadı.</div>
        ) : (
            <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-xs">
                <tr>
                <th className="px-6 py-3">İlan</th>
                <th className="px-6 py-3">Satıcı</th>
                <th className="px-6 py-3">Fiyat</th>
                <th className="px-6 py-3">Durum</th>
                <th className="px-6 py-3 text-right">İşlemler</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {filteredAds.map((ad) => (
                <tr key={ad.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden shrink-0 border border-gray-200">
                            {ad.image ? (
                                <img src={ad.image} className="w-full h-full object-cover" alt="ad" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">Resim Yok</div>
                            )}
                        </div>
                        <div>
                            <div className="font-bold text-gray-900 truncate max-w-[200px]" title={ad.title}>{ad.title}</div>
                            <div className="text-xs text-gray-500">{new Date(ad.created_at).toLocaleDateString()}</div>
                        </div>
                    </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="text-gray-900 font-medium">{ad.profiles?.full_name || 'Bilinmiyor'}</div>
                        <div className="text-xs text-gray-400 font-mono">{ad.user_id.substring(0,8)}...</div>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-700">
                        {ad.price?.toLocaleString()} {ad.currency}
                    </td>
                    <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                        ad.status === 'yayinda' ? 'bg-green-100 text-green-700 border border-green-200' :
                        ad.status === 'onay_bekliyor' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' :
                        'bg-red-100 text-red-700 border border-red-200'
                    }`}>
                        {ad.status === 'yayinda' ? 'Yayında' : ad.status === 'onay_bekliyor' ? 'Bekliyor' : 'Reddedildi'}
                    </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <Link href={`/ilan/${ad.id}`} target="_blank" className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Görüntüle">
                            <Eye size={18} />
                        </Link>
                        {ad.status === 'onay_bekliyor' && (
                            <>
                                <button
                                    onClick={() => handleApprove(ad.id)}
                                    disabled={processingId === ad.id}
                                    className="p-1.5 text-green-600 hover:bg-green-50 rounded disabled:opacity-50 transition-colors"
                                    title="Onayla"
                                >
                                    {processingId === ad.id ? <Loader2 size={18} className="animate-spin"/> : <Check size={18} />}
                                </button>
                                <button
                                    onClick={() => handleReject(ad.id)}
                                    disabled={processingId === ad.id}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded disabled:opacity-50 transition-colors"
                                    title="Reddet"
                                >
                                    <X size={18} />
                                </button>
                            </>
                        )}
                    </div>
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