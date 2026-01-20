
"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { Phone, User, ShieldCheck, MessageSquare } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { startConversation } from '@/lib/services';
import { useRouter } from 'next/navigation';

type Props = {
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  adId: number;
  adTitle: string;
  adImage: string;
  price: string;
  currency: string;
};

export default function SellerSidebar({ sellerId, sellerName, sellerPhone, adId }: Props) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();
  const [showPhone, setShowPhone] = useState(false);

  const handleSendMessage = async () => {
    if (!user) {
      addToast('Mesaj göndermek için giriş yapmalısınız.', 'error');
      router.push('/login');
      return;
    }
    if (user.id === sellerId) {
      addToast('Kendi ilanınıza mesaj atamazsınız.', 'info');
      return;
    }

    const { data, error } = await startConversation(adId, user.id, sellerId);
    if (error) {
      addToast('Hata oluştu.', 'error');
    } else {
      router.push('/bana-ozel/mesajlar');
    }
  };

  return (
    <div className="border border-gray-200 bg-white p-4 rounded-sm shadow-sm sticky top-24">
      <h4 className="font-bold text-md text-[#333] mb-4">İlan Sahibi</h4>
      <div className="flex items-center gap-3 mb-4 p-2 bg-gray-50 rounded">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold">
          {sellerName.charAt(0)}
        </div>
        <div>
          <p className="font-bold text-sm text-[#333]">{sellerName}</p>
          <p className="text-[10px] text-gray-500">Üyelik Tarihi: 2025</p>
        </div>
      </div>

      <div className="space-y-2">
        <button onClick={() => setShowPhone(!showPhone)} className="w-full bg-[#4682b4] hover:bg-[#315f85] text-white font-bold py-2 rounded-sm text-sm flex items-center justify-center gap-2 transition-colors">
            <Phone size={16} /> {showPhone ? sellerPhone : 'Numarayı Göster'}
        </button>
        <button onClick={handleSendMessage} className="w-full border border-gray-300 bg-gray-50 hover:bg-gray-100 text-[#333] font-bold py-2 rounded-sm text-sm transition-colors flex items-center justify-center gap-2">
            <MessageSquare size={16}/> Mesaj Gönder
        </button>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-200 text-[11px] text-green-700 flex items-center gap-1">
          <ShieldCheck size={14} /> <span>Güvenlik İpuçları</span>
      </div>
    </div>
  );
}
