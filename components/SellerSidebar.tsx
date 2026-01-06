
"use client";
import React from 'react';
import Link from 'next/link';
import { Phone, User, ShieldCheck, ChevronRight } from 'lucide-react';
import { useMessage } from '@/context/MessageContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

type Props = {
  sellerId: number;
  sellerName: string;
  adId: number;
  adTitle: string;
  adImage: string;
};

export default function SellerSidebar({ sellerId, sellerName, adId, adTitle, adImage }: Props) {
  const { startConversation } = useMessage();
  const { user } = useAuth();
  const { addToast } = useToast();

  const handleSendMessage = () => {
    if (!user) {
      addToast('Mesaj göndermek için giriş yapmalısınız.', 'error');
      return;
    }
    startConversation(adId, adTitle, adImage, sellerName);
  };

  return (
    <div className="border border-gray-200 bg-white p-4 rounded-sm shadow-sm sticky top-24">
      <h4 className="font-bold text-md text-[#333] mb-4">İlan Sahibi</h4>

      <Link href={`/satici/${sellerId}`} className="flex items-center gap-3 mb-4 group cursor-pointer hover:bg-gray-50 p-2 -mx-2 rounded transition-colors">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
          <User size={20} />
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm text-[#333] group-hover:text-blue-700 flex justify-between items-center">
            {sellerName} <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </p>
          <p className="text-[11px] text-gray-500">Tüm İlanları</p>
        </div>
      </Link>

      <div className="space-y-2">
        <button className="w-full bg-[#4682b4] hover:bg-[#315f85] text-white font-bold py-2 rounded-sm text-sm flex items-center justify-center gap-2">
            <Phone size={16} /> Cep Telini Göster
        </button>
        <button
          onClick={handleSendMessage}
          className="w-full border border-gray-300 bg-gray-50 hover:bg-gray-100 text-[#333] font-bold py-2 rounded-sm text-sm"
        >
            Mesaj Gönder
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 text-[11px] text-green-700 flex items-center gap-1">
          <ShieldCheck size={14} />
          <span>Güvenlik İpuçları</span>
      </div>
    </div>
  );
}
