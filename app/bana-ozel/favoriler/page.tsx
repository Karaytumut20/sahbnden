"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getFavoritesClient, toggleFavoriteClient } from '@/lib/services';
import { useToast } from '@/context/ToastContext';
import { Trash2, Loader2, HeartOff, Search } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import AdCard from '@/components/AdCard';

export default function FavoritesPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    if (!user) return;
    setLoading(true);
    const data = await getFavoritesClient(user.id);
    setAds(data);
    setLoading(false);
  };

  useEffect(() => { fetchFavorites(); }, [user]);

  const handleRemove = async (adId: number) => {
    if (!user) return;
    await toggleFavoriteClient(user.id, adId);
    addToast('Favorilerden çıkarıldı.', 'info');
    fetchFavorites(); // Listeyi yenile
  };

  if (!user) return <div className="p-6">Giriş yapmalısınız.</div>;
  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-blue-600"/></div>;

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6 dark:bg-[#1c1c1c] dark:border-gray-700">
      <h1 className="text-xl font-bold text-[#333] mb-6 dark:text-white">Favori İlanlarım</h1>

      {ads.length === 0 ? (
        <EmptyState
            icon={HeartOff}
            title="Favori İlanınız Yok"
            description="Beğendiğiniz ilanları favoriye ekleyerek fiyat takibi yapabilirsiniz."
            actionLabel="İlanlara Göz At"
            actionUrl="/search"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ads.map((ad: any) => (
            <div key={ad.id} className="relative group">
                <button
                    onClick={() => handleRemove(ad.id)}
                    className="absolute top-2 right-2 z-20 bg-white/90 p-1.5 rounded-full text-red-600 opacity-0 group-hover:opacity-100 transition-all shadow-sm hover:scale-110"
                    title="Favorilerden Kaldır"
                >
                    <Trash2 size={16} />
                </button>
                <div className="h-[280px]">
                    <AdCard ad={ad} viewMode="grid" />
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}