
"use client";
import React from 'react';
import { Flag, Printer, Share2, MessageSquare } from 'lucide-react';
import { useModal } from '@/context/ModalContext';
import { useMessage } from '@/context/MessageContext'; // YENİ
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function AdActionButtons({ id, title, image, sellerName }: { id: number, title: string, image?: string, sellerName?: string }) {
  const { openModal } = useModal();
  const { startConversation } = useMessage();
  const { user } = useAuth();
  const { addToast } = useToast();

  const handlePrint = () => {
    window.print();
  };

  const handleSendMessage = () => {
    if (!user) {
      addToast('Mesaj göndermek için giriş yapmalısınız.', 'error');
      return;
    }

    // Varsayılan değerler (eğer prop gelmezse)
    const adImage = image || 'https://picsum.photos/300/200';
    const sName = sellerName || 'Satıcı';

    startConversation(id, title, adImage, sName);
  };

  return (
    <div className="mt-2 space-y-2">
      {/* Masaüstü Büyük Mesaj Butonu (Eğer sağ kolonda değilse buraya da eklenebilir ama genelde butonlar sağda olur. Biz alt bara ekliyoruz) */}

      <div className="flex gap-4 text-[11px] text-blue-800">
         <button
          onClick={handleSendMessage}
          className="flex items-center gap-1 hover:underline font-bold text-blue-900 md:hidden" // Sadece mobilde burada görünsün, masaüstünde sağda zaten var
        >
          <MessageSquare size={14}/> Mesaj Gönder
        </button>
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
    </div>
  );
}
