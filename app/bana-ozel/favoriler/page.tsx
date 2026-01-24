"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getFavoritesClient, toggleFavoriteClient } from '@/lib/services';
import { useToast } from '@/context/ToastContext';
import { Trash2, Loader2, HeartOff } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import AdCard from '@/components/AdCard';

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth();
  const { addToast } = useToast();
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (user) {
      setLoading(true);
      getFavoritesClient(user.id)
        .then(data => setAds(data || []))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user, authLoading]);

  const handleRemove = async (adId: number) => {
    if (!user) return;
    setAds(prev => prev.filter(ad => ad.id !== adId));
    addToast('Favorilerden çıkarıldı.', 'info');
    try {
        await toggleFavoriteClient(user.id, adId);
    } catch {
        addToast("Hata oluştu", "error");
    }
  };

  if (authLoading || (loading && user)) {
    return (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
            <Loader2 className="animate-spin text-blue-600" size={32}/>
            <p className="text-sm text-gray-500">Favorileriniz yükleniyor...</p>
        </div>
    );
  }

  if (!user) {
      return (
        <div className="p-10 text-center bg-white border rounded-sm">
            <p className="text-gray-600 mb-4">Favorilerinizi görmek için giriş yapmalısınız.</p>
            <Link href="/login" className="bg-blue-600 text-white px-6 py-2 rounded font-bold">Giriş Yap</Link>
        </div>
      );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6 dark:bg-[#1c1c1c] dark:border-gray-700">
      <h1 className="text-xl font-bold text-[#333] mb-6 dark:text-white flex items-center gap-2">
        Favori İlanlarım <span className="text-sm font-normal text-gray-500">({ads.length})</span>
      </h1>

      {ads.length === 0 ? (
        <EmptyState
            icon={HeartOff}
            title="Favori İlanınız Yok"
            description="Beğendiğiniz ilanları favoriye ekleyerek fiyat takibi yapabilirsiniz."
            actionLabel="İlanlara Göz At"
            actionUrl="/search"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map((ad: any) => (
            <div key={ad.id} className="relative group">
                <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRemove(ad.id); }}
                    className="absolute top-2 right-2 z-20 bg-white/90 p-2 rounded-full text-red-600 opacity-0 group-hover:opacity-100 transition-all shadow-md hover:scale-110"
                    title="Kaldır"
                >
                    <Trash2 size={16} />
                </button>
                <div className="h-[320px]">
                    <AdCard ad={ad} viewMode="grid" />
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}