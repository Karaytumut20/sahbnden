
"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getFavorites, toggleFavorite } from '@/lib/services';
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
    const data = await getFavorites(user.id);
    setAds(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  const handleRemove = async (adId: number) => {
    if (!user) return;
    await toggleFavorite(user.id, adId);
    addToast('Favorilerden çıkarıldı.', 'info');
    fetchFavorites(); // Listeyi yenile
  };

  if (!user) return <div className="p-6">Giriş yapmalısınız.</div>;

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin"/></div>;

  if (ads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-200 rounded-sm shadow-sm text-center dark:bg-[#1c1c1c] dark:border-gray-700">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4 dark:bg-gray-800 dark:text-gray-500">
          <HeartOff size={32} />
        </div>
        <h2 className="text-xl font-bold text-[#333] mb-2 dark:text-white">Favori İlanınız Yok</h2>
        <Link href="/" className="bg-blue-700 text-white px-6 py-2.5 rounded-sm font-bold text-sm hover:bg-blue-800 transition-colors">
          İlanları İncele
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6 dark:bg-[#1c1c1c] dark:border-gray-700">
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-2 dark:border-gray-700">
        <h1 className="text-xl font-bold text-[#333] dark:text-white">Favori İlanlarım ({ads.length})</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ads.map((ad: any) => (
          <div key={ad.id} className="border border-gray-200 rounded-sm hover:shadow-md transition-shadow relative group dark:border-gray-700 dark:bg-[#1c1c1c]">
            <button
              onClick={() => handleRemove(ad.id)}
              className="absolute top-2 right-2 z-10 bg-white/90 p-1.5 rounded-full text-gray-500 hover:text-red-600 shadow-sm opacity-0 group-hover:opacity-100 transition-all dark:bg-gray-800/90 dark:text-gray-400"
              title="Favorilerden Çıkar"
            >
              <Trash2 size={16} />
            </button>

            <Link href={`/ilan/${ad.id}`} className="flex flex-row md:flex-col h-full">
              <div className="w-32 md:w-full h-24 md:h-48 bg-gray-100 shrink-0 relative overflow-hidden dark:bg-gray-800">
                <img src={ad.image || 'https://via.placeholder.com/300x200'} alt={ad.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-3 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-bold text-[#333] text-sm leading-tight line-clamp-2 mb-2 group-hover:text-blue-700 dark:text-gray-200 dark:group-hover:text-blue-400">
                    {ad.title}
                  </h3>
                  <div className="flex items-center gap-1 text-gray-500 text-[11px] mb-2 dark:text-gray-400">
                    <MapPin size={12} /> {ad.city}
                  </div>
                </div>
                <div className="flex justify-between items-end mt-auto">
                  <span className="font-bold text-blue-900 text-md dark:text-blue-400">{ad.price.toLocaleString()} {ad.currency}</span>
                  <span className="text-[10px] text-gray-400">#{ad.id}</span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
