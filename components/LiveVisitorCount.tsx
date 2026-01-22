"use client";
import React from 'react';
import { usePresence } from '@/hooks/use-presence';
import { Eye } from 'lucide-react';

export default function LiveVisitorCount({ adId }: { adId: number }) {
  // Her ilan için benzersiz bir oda oluşturuyoruz: 'ad_presence_123'
  const { count } = usePresence(`ad_presence_${adId}`);

  if (count <= 1) return null; // Sadece kendisi varsa gösterme

  return (
    <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-sm animate-pulse border border-red-100">
      <Eye size={14} />
      <span>Şu an {count} kişi inceliyor</span>
    </div>
  );
}