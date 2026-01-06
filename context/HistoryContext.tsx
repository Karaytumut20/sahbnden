
"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

type Ad = {
  id: number;
  title: string;
  image: string;
  price: string;
  currency: string;
};

type HistoryContextType = {
  recentAds: Ad[];
  addToHistory: (ad: Ad) => void;
  clearHistory: () => void;
};

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export function HistoryProvider({ children }: { children: React.ReactNode }) {
  const [recentAds, setRecentAds] = useState<Ad[]>([]);

  // Başlangıçta LocalStorage'dan veriyi çek
  useEffect(() => {
    const stored = localStorage.getItem('sahibinden_history');
    if (stored) {
      setRecentAds(JSON.parse(stored));
    }
  }, []);

  const addToHistory = (ad: Ad) => {
    setRecentAds((prev) => {
      // Önce listede varsa çıkar (en başa eklemek için)
      const filtered = prev.filter((item) => item.id !== ad.id);
      // Yeni ilanı başa ekle, en fazla 5 tane tut
      const updated = [ad, ...filtered].slice(0, 5);

      localStorage.setItem('sahibinden_history', JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    setRecentAds([]);
    localStorage.removeItem('sahibinden_history');
  };

  return (
    <HistoryContext.Provider value={{ recentAds, addToHistory, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);
  if (context === undefined) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
}
