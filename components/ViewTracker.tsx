"use client";
import { useEffect, useRef } from 'react';
import { incrementViewCountAction } from '@/lib/actions';

export default function ViewTracker({ adId }: { adId: number }) {
  const called = useRef(false);

  useEffect(() => {
    // StrictMode'da iki kere çalışmayı önle (Development ortamı için)
    if (called.current) return;
    called.current = true;

    // Sayfa yüklendikten 2 saniye sonra sayacı artır (Botları engellemek için basit bir önlem)
    const timer = setTimeout(() => {
        incrementViewCountAction(adId).catch(err => console.error("View count error", err));
    }, 2000);

    return () => clearTimeout(timer);
  }, [adId]);

  return null; // Görünmez bileşen
}