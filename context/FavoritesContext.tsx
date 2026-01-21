"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toggleFavoriteClient, getFavoritesClient } from '@/lib/services';
import { useAuth } from '@/context/AuthContext';

type FavoritesContextType = {
  favorites: number[]; // Sadece ilan ID'lerini tutar
  toggleFavorite: (id: number) => void;
  isFavorite: (id: number) => boolean;
};

// Başlangıç değeri güvenli hale getirildi
const FavoritesContext = createContext<FavoritesContextType>({
  favorites: [],
  toggleFavorite: () => {},
  isFavorite: () => false,
});

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
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
    if (!user) return;

    // Optimistic Update (Arayüzde anında tepki)
    const isAlreadyFav = favorites.includes(id);
    if (isAlreadyFav) {
        setFavorites(prev => prev.filter(fid => fid !== id));
    } else {
        setFavorites(prev => [...prev, id]);
    }

    // Backend Senkronizasyonu
    try {
      await toggleFavoriteClient(user.id, id);
    } catch (error) {
      console.error("Favori işlemi başarısız:", error);
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