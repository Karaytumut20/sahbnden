"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/context/ToastContext';

type CompareContextType = {
  compareList: number[];
  addToCompare: (id: number) => void;
  removeFromCompare: (id: number) => void;
  clearCompare: () => void;
  isInCompare: (id: number) => boolean;
};

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareList, setCompareList] = useState<number[]>([]);
  const { addToast } = useToast();

  // İlk yüklemede LocalStorage'dan oku
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('compare_list');
      if (stored) {
        try {
          setCompareList(JSON.parse(stored));
        } catch (e) {
          console.error("Karşılaştırma listesi okunamadı", e);
        }
      }
    }
  }, []);

  // State değiştiğinde LocalStorage'a yaz
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('compare_list', JSON.stringify(compareList));
    }
  }, [compareList]);

  const addToCompare = (id: number) => {
    if (compareList.length >= 4) {
      addToast('En fazla 4 ilan karşılaştırabilirsiniz.', 'error');
      return;
    }
    if (!compareList.includes(id)) {
      setCompareList(prev => [...prev, id]);
      addToast('Karşılaştırma listesine eklendi.', 'success');
    }
  };

  const removeFromCompare = (id: number) => {
    setCompareList(prev => prev.filter(itemId => itemId !== id));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const isInCompare = (id: number) => compareList.includes(id);

  return (
    <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, clearCompare, isInCompare }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}