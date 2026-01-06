
"use client";
import React from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { BellPlus } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function SaveSearchButton() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { saveSearch } = useNotifications();
  const { user } = useAuth();
  const { addToast } = useToast();

  const handleSave = () => {
    if (!user) {
      addToast('Aramayı kaydetmek için giriş yapmalısınız.', 'error');
      return;
    }

    const paramsString = searchParams.toString();
    if (!paramsString) {
      addToast('Kaydedilecek bir arama kriteri yok.', 'info');
      return;
    }

    // Kriterleri okunabilir metne dönüştür (Basitçe)
    const criteriaList = [];
    if (searchParams.get('q')) criteriaList.push(`Kelime: ${searchParams.get('q')}`);
    if (searchParams.get('city')) criteriaList.push(`Şehir: ${searchParams.get('city')}`);
    if (searchParams.get('category')) criteriaList.push(`Kategori: ${searchParams.get('category')}`);

    const criteriaText = criteriaList.join(', ') || 'Filtrelenmiş Arama';
    const fullUrl = `${pathname}?${paramsString}`;

    saveSearch(fullUrl, criteriaText);
  };

  return (
    <button
      onClick={handleSave}
      className="text-[12px] text-blue-700 flex items-center gap-1 hover:underline hover:text-blue-900 ml-4"
    >
      <BellPlus size={14} /> Aramayı Kaydet
    </button>
  );
}
