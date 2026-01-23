"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Edit, Loader2, Search, Plus, Eye, Filter, MoreHorizontal, Calendar, MapPin, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getUserAdsClient } from '@/lib/services';
import DeleteAdButton from '@/components/DeleteAdButton';
import { formatPrice, formatDate } from '@/lib/utils';
import EmptyState from '@/components/ui/EmptyState';

export default function MyAdsPage() {
  const { user } = useAuth();
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchMyAds = async () => {
    if (!user) return;
    setLoading(true);
    const data = await getUserAdsClient(user.id);
    setAds(data);
    setLoading(false);
  };

  useEffect(() => { fetchMyAds(); }, [user]);

  // Filtreleme Mantığı
  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || ad.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Durum Renkleri
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'yayinda': return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">Yayında</span>;
      case 'onay_bekliyor': return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">Onay Bekliyor</span>;
      case 'pasif': return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">Pasif</span>;
      case 'reddedildi': return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">Reddedildi</span>;
      default: return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-600">{status}</span>;
    }
  };

  if (!user) return <div className="p-10 text-center">Giriş yapmalısınız.</div>;

  return (
    <div className="space-y-6">

      {/* HEADER & ACTIONS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">İlanlarım</h1>
          <p className="text-sm text-gray-500">Tüm ilanlarınızı buradan yönetebilir, düzenleyebilir veya yayından kaldırabilirsiniz.</p>
        </div>
        <Link
          href="/ilan-ver"
          className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-indigo-700 transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2"
        >
          <Plus size={18} /> Yeni İlan Ver
        </Link>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">

        {/* Status Tabs */}
        <div className="flex gap-2 p-1 bg-gray-100/80 rounded-lg overflow-x-auto max-w-full w-full md:w-auto">
          {[
            { id: 'all', label: 'Tümü' },
            { id: 'yayinda', label: 'Yayında' },
            { id: 'onay_bekliyor', label: 'Bekleyen' },
            { id: 'pasif', label: 'Pasif' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all whitespace-nowrap ${
                filterStatus === tab.id
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="İlan başlığında ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
          />
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>

      {/* CONTENT */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden min-h-[400px]">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="animate-spin text-indigo-600" size={32} />
          </div>
        ) : filteredAds.length === 0 ? (
          <div className="p-12">
             <EmptyState
                icon={filterStatus === 'all' ? Plus : Filter}
                title={filterStatus === 'all' ? "Henüz ilanınız yok" : "Bu kriterde ilan bulunamadı"}
                description={filterStatus === 'all' ? "Hemen ücretsiz ilan vererek milyonlarca alıcıya ulaşın." : "Filtreleri değiştirerek tekrar deneyebilirsiniz."}
                actionLabel={filterStatus === 'all' ? "İlan Ver" : undefined}
                actionUrl="/ilan-ver"
             />
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 text-xs text-gray-500 uppercase tracking-wider border-b border-gray-200">
                    <th className="px-6 py-4 font-semibold">İlan Detayı</th>
                    <th className="px-6 py-4 font-semibold">Fiyat</th>
                    <th className="px-6 py-4 font-semibold">Durum</th>
                    <th className="px-6 py-4 font-semibold">Tarih</th>
                    <th className="px-6 py-4 font-semibold text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAds.map((ad) => (
                    <tr key={ad.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-12 bg-gray-200 rounded-md overflow-hidden shrink-0 border border-gray-200 relative">
                            {ad.image ? (
                                <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-[10px]">No IMG</div>
                            )}
                            {ad.is_vitrin && <div className="absolute top-0 right-0 w-2 h-2 bg-yellow-400 rounded-full ring-1 ring-white"></div>}
                          </div>
                          <div>
                            <Link href={`/ilan/${ad.id}`} className="font-bold text-gray-900 text-sm hover:text-indigo-600 transition-colors line-clamp-1 block mb-0.5">
                                {ad.title}
                            </Link>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px] font-mono">#{ad.id}</span>
                                <span className="flex items-center gap-0.5"><MapPin size={10}/> {ad.city}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-indigo-900 bg-indigo-50 px-2 py-1 rounded">
                            {formatPrice(ad.price, ad.currency)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(ad.status)}
                        {ad.status === 'reddedildi' && ad.admin_note && (
                            <div className="text-[10px] text-red-500 mt-1 max-w-[150px] leading-tight flex items-start gap-1">
                                <AlertCircle size={10} className="shrink-0 mt-0.5"/> {ad.admin_note}
                            </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5">
                            <Calendar size={14} className="text-gray-400"/>
                            {formatDate(ad.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            href={`/ilan/${ad.id}`}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                            title="Görüntüle"
                          >
                            <Eye size={18} />
                          </Link>
                          <Link
                            href={`/ilan-duzenle/${ad.id}`}
                            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                            title="Düzenle"
                          >
                            <Edit size={18} />
                          </Link>
                          <DeleteAdButton adId={ad.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* MOBILE LIST (CARD VIEW) */}
            <div className="md:hidden divide-y divide-gray-100">
                {filteredAds.map((ad) => (
                    <div key={ad.id} className="p-4 flex gap-3">
                        <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                            {ad.image && <img src={ad.image} className="w-full h-full object-cover"/>}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-gray-900 text-sm line-clamp-2 leading-snug">{ad.title}</h3>
                                    {/* Mobilde dropdown menü eklenebilir, şimdilik basit tutalım */}
                                </div>
                                <p className="text-xs text-indigo-700 font-bold mb-2">{formatPrice(ad.price, ad.currency)}</p>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {getStatusBadge(ad.status)}
                                    <span className="text-[10px] text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">#{ad.id}</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-center border-t border-gray-50 pt-2 mt-1">
                                <span className="text-[10px] text-gray-400">{formatDate(ad.created_at)}</span>
                                <div className="flex gap-3">
                                    <Link href={`/ilan-duzenle/${ad.id}`} className="text-xs font-bold text-indigo-600">Düzenle</Link>
                                    <DeleteAdButton adId={ad.id} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}