"use client";
import React, { useState } from 'react';
import { Phone, User, ShieldCheck, MessageSquare } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { startConversationClient } from '@/lib/services';
import { useRouter } from 'next/navigation';

export default function SellerSidebar({ sellerId, sellerName, sellerPhone, adId }: any) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();
  const [showPhone, setShowPhone] = useState(false);

  const handleSendMessage = async () => {
    if (!user) { addToast('Giriş yapın.', 'error'); router.push('/login'); return; }
    if (user.id === sellerId) { addToast('Kendinize mesaj atamazsınız.', 'info'); return; }

    await startConversationClient(adId, user.id, sellerId);
    router.push('/bana-ozel/mesajlarim');
  };

  return (
    <div className="border border-gray-200 bg-white p-4 rounded-sm shadow-sm sticky top-24">
      <h4 className="font-bold text-md text-[#333] mb-4">İlan Sahibi</h4>
      <div className="flex items-center gap-3 mb-4"><User className="text-gray-400"/> <span className="font-bold">{sellerName}</span></div>
      <button onClick={() => setShowPhone(!showPhone)} className="w-full bg-[#4682b4] text-white font-bold py-2 rounded-sm mb-2 flex items-center justify-center gap-2"><Phone size={16}/> {showPhone ? sellerPhone : 'Numarayı Göster'}</button>
      <button onClick={handleSendMessage} className="w-full border border-gray-300 font-bold py-2 rounded-sm flex items-center justify-center gap-2 hover:bg-gray-50"><MessageSquare size={16}/> Mesaj Gönder</button>
    </div>
  );
}