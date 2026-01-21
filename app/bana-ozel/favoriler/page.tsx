"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getFavoritesClient, toggleFavoriteClient } from '@/lib/services';
import { useToast } from '@/context/ToastContext';
import { Trash2, MapPin, HeartOff, Loader2 } from 'lucide-react';

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
    fetchFavorites();
  };

  if (!user) return <div className="p-6">Giriş yapmalısınız.</div>;
  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin"/></div>;

  if (ads.length === 0) return <div className="text-center p-10">Favori ilanınız yok.</div>;

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6 dark:bg-[#1c1c1c] dark:border-gray-700">
      <h1 className="text-xl font-bold text-[#333] mb-6 dark:text-white">Favori İlanlarım</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ads.map((ad: any) => (
          <div key={ad.id} className="border border-gray-200 rounded-sm hover:shadow-md relative group dark:border-gray-700">
            <button onClick={() => handleRemove(ad.id)} className="absolute top-2 right-2 z-10 bg-white/90 p-1.5 rounded-full text-red-600 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={16} /></button>
            <Link href={`/ilan/${ad.id}`} className="flex flex-col h-full">
              <div className="w-full h-48 bg-gray-100 relative overflow-hidden"><img src={ad.image || 'https://via.placeholder.com/300x200'} className="w-full h-full object-cover" /></div>
              <div className="p-3">
                <h3 className="font-bold text-sm line-clamp-2 mb-2 dark:text-white">{ad.title}</h3>
                <span className="font-bold text-blue-900 text-md dark:text-blue-400">{ad.price.toLocaleString()} {ad.currency}</span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}