
"use client";
import { useEffect } from 'react';
import { useHistory } from '@/context/HistoryContext';

export default function HistoryTracker({ ad }: { ad: any }) {
  const { addToHistory } = useHistory();

  useEffect(() => {
    if (ad) {
      addToHistory({
        id: ad.id,
        title: ad.title,
        image: ad.image,
        price: ad.price,
        currency: ad.currency
      });
    }
  }, [ad]); // ad değiştiğinde çalışır

  return null; // Görünmez bileşen
}
