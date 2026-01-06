
"use client";
import React, { createContext, useContext, useState } from 'react';
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

  const addToCompare = (id: number) => {
    if (compareList.length >= 4) {
      addToast('En fazla 4 ilan karşılaştırabilirsiniz.', 'error');
      return;
    }
    if (!compareList.includes(id)) {
      setCompareList([...compareList, id]);
    }
  };

  const removeFromCompare = (id: number) => {
    setCompareList(compareList.filter(itemId => itemId !== id));
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
