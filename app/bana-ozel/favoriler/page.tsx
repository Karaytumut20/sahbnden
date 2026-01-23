"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getFavoritesClient, toggleFavoriteClient } from '@/lib/services';
import { useToast } from '@/context/ToastContext';
import { Trash2, Loader2, HeartOff, Search, AlertCircle } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import AdCard from '@/components/AdCard';

export default function FavoritesPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Veri Çekme Fonksiyonu (Hata Korumalı)
  const fetchFavorites = async () => {
    if (!user) return;

    try {
        setLoading(true);
        console.log("Favoriler çekiliyor...");

        const data = await getFavoritesClient(user.id);

        console.log("Favoriler geldi:", data);
        setAds(data || []);
    } catch (error) {
        console.error("Favori yükleme hatası:", error);
        addToast('Favoriler yüklenirken bir sorun oluştu.', 'error');
        setAds([]); // Hata olsa bile boş liste göster
    } finally {
        setLoading(false); // Her durumda loading'i kapat
    }
  };

  useEffect(() => {
      if(user) {
          fetchFavorites();
      } else {
          // Kullanıcı yoksa loading kapat
          setLoading(false);
      }
  }, [user]);

  const handleRemove = async (adId: number) => {
    if (!user) return;

    // Optimistic Update (Anında Arayüzden Sil)
    setAds(prev => prev.filter(ad => ad.id !== adId));
    addToast('Favorilerden çıkarıldı.', 'info');

    try {
        await toggleFavoriteClient(user.id, adId);
    } catch (error) {
        console.error("Favori silme hatası", error);
        addToast("İşlem geri alındı.", "error");
        fetchFavorites(); // Hata olursa geri yükle
    }
  };

  if (!user) return <div className="p-10 text-center text-gray-500">Favorilerinizi görmek için giriş yapmalısınız.</div>;

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6 dark:bg-[#1c1c1c] dark:border-gray-700">
      <h1 className="text-xl font-bold text-[#333] mb-6 dark:text-white flex items-center gap-2">
        Favori İlanlarım
        {!loading && <span className="text-sm font-normal text-gray-500">({ads.length})</span>}
      </h1>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
            <Loader2 className="animate-spin text-blue-600" size={32}/>
            <p className="text-sm text-gray-500">Favorileriniz yükleniyor...</p>
        </div>
      ) : ads.length === 0 ? (
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
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemove(ad.id);
                    }}
                    className="absolute top-2 right-2 z-20 bg-white/90 p-2 rounded-full text-red-600 opacity-0 group-hover:opacity-100 transition-all shadow-md hover:scale-110 hover:bg-red-50"
                    title="Favorilerden Kaldır"
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