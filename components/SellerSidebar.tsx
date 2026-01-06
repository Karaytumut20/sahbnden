"use client";
import React from 'react';
import Link from 'next/link';
import { Phone, User, ShieldCheck, ChevronRight, HandCoins } from 'lucide-react';
import { useMessage } from '@/context/MessageContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useModal } from '@/context/ModalContext';

type Props = {
  sellerId: number;
  sellerName: string;
  adId: number;
  adTitle: string;
  adImage: string;
  price: string;
  currency: string;
};

export default function SellerSidebar({ sellerId, sellerName, adId, adTitle, adImage, price, currency }: Props) {
  const { startConversation } = useMessage();
  const { openModal } = useModal();
  const { user } = useAuth();
  const { addToast } = useToast();

  const handleSendMessage = () => {
    if (!user) {
      addToast('Mesaj göndermek için giriş yapmalısınız.', 'error');
      return;
    }
    startConversation(adId, adTitle, adImage, sellerName);
  };

  const handleOffer = () => {
    if (!user) {
      addToast('Teklif vermek için giriş yapmalısınız.', 'error');
      return;
    }
    openModal('OFFER', { price, currency });
  };

  return (
    <div className="border border-gray-200 bg-white p-4 rounded-sm shadow-sm sticky top-24 dark:bg-[#1c1c1c] dark:border-gray-700 transition-colors">
      <h4 className="font-bold text-md text-[#333] mb-4 dark:text-white">İlan Sahibi</h4>

      <Link href={`/satici/${sellerId}`} className="flex items-center gap-3 mb-4 group cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded transition-colors dark:hover:bg-gray-800">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:group-hover:bg-blue-900/30 dark:group-hover:text-blue-400">
          <User size={20} />
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm text-[#333] group-hover:text-blue-700 flex justify-between items-center dark:text-white dark:group-hover:text-blue-400">
            {sellerName} <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </p>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">Tüm İlanları</p>
        </div>
      </Link>

      <div className="space-y-2">
        <button className="w-full bg-[#4682b4] hover:bg-[#315f85] text-white font-bold py-2 rounded-sm text-sm flex items-center justify-center gap-2 transition-colors">
            <Phone size={16} /> Cep Telini Göster
        </button>
        <button
          onClick={handleSendMessage}
          className="w-full border border-gray-300 bg-gray-50 hover:bg-gray-100 text-[#333] font-bold py-2 rounded-sm text-sm dark:bg-gray-800 dark:border-gray-600 dark:text-white dark:hover:bg-gray-700 transition-colors"
        >
            Mesaj Gönder
        </button>
        <button
          onClick={handleOffer}
          className="w-full border border-gray-300 bg-white hover:bg-green-50 text-green-700 font-bold py-2 rounded-sm text-sm flex items-center justify-center gap-2 dark:bg-[#1c1c1c] dark:border-gray-600 dark:text-green-500 dark:hover:bg-green-900/20 transition-colors"
        >
            <HandCoins size={16} /> Teklif Ver
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 text-[11px] text-green-700 flex items-center gap-1 dark:border-gray-700 dark:text-green-500">
          <ShieldCheck size={14} />
          <span>Güvenlik İpuçları</span>
      </div>
    </div>
  );
}