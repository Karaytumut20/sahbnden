
"use client";
import React from 'react';
import { Flag, Printer, Share2 } from 'lucide-react';
import { useModal } from '@/context/ModalContext';

export default function AdActionButtons({ id, title }: { id: number, title: string }) {
  const { openModal } = useModal();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex gap-4 text-[11px] text-blue-800 mt-2">
      <button
        onClick={() => openModal('REPORT', { id })}
        className="flex items-center gap-1 hover:underline"
      >
        <Flag size={14}/> Şikayet Et
      </button>
      <button
        onClick={handlePrint}
        className="flex items-center gap-1 hover:underline"
      >
        <Printer size={14}/> Yazdır
      </button>
      <button
        onClick={() => openModal('SHARE', { title, url: window.location.href })}
        className="flex items-center gap-1 hover:underline"
      >
        <Share2 size={14}/> Paylaş
      </button>
    </div>
  );
}
