"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toggleFavoriteClient, getFavoritesClient } from '@/lib/services';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext'; // EKLENDİ: Uyarı mesajları için

type FavoritesContextType = {
  favorites: number[]; // Sadece ilan ID'lerini tutar
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
};

const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  toggleFavorite: () => {},
  isFavorite: () => false,
});

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { addToast } = useToast(); // Toast hook'unu çağır
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    let isMounted = true;
    if (user) {
      getFavoritesClient(user.id).then(ads => {
        if (isMounted && ads) {
            // Null olmayan ve geçerli ID'si olan ilanları filtrele
            const validIds = ads
              .filter((ad: any) => ad && typeof ad.id === 'number')
              .map((ad: any) => ad.id);
            setFavorites(validIds);
        }
      });
    } else {
      setFavorites([]);
    }
    return () => { isMounted = false; };
  }, [user]);

  const toggleFavorite = async (id: number) => {
    // 1. KULLANICI KONTROLÜ
    if (!user) {
        addToast('Favorilere eklemek için lütfen giriş yapın.', 'error');
        return;
    }

    // 2. OPTIMISTIC UPDATE (Arayüzde anında tepki)
    const isAlreadyFav = favorites.includes(id);
    if (isAlreadyFav) {
        setFavorites(prev => prev.filter(fid => fid !== id));
        addToast('Favorilerden çıkarıldı.', 'info');
    } else {
        setFavorites(prev => [...prev, id]);
        addToast('Favorilere eklendi.', 'success');
    }

    // 3. BACKEND SENKRONİZASYONU
    try {
      await toggleFavoriteClient(user.id, id);
    } catch (error) {
      console.error("Favori işlemi başarısız:", error);
      addToast('İşlem sırasında bir hata oluştu.', 'error');

      // Hata olursa işlemi geri al (Revert)
      if (isAlreadyFav) setFavorites(prev => [...prev, id]);
      else setFavorites(prev => prev.filter(fid => fid !== id));
    }
  };

  const isFavorite = (id: number) => favorites.includes(id);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}