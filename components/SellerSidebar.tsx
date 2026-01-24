"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone, ShieldCheck, User, MessageCircle, Star, Send, Loader2, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { startConversationClient } from '@/lib/services';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import { getSellerReviewsServer } from '@/lib/actions';

export default function SellerSidebar({ sellerId, sellerName, sellerPhone, adId, showPhone = false }: any) {
  const { user } = useAuth();
  const router = useRouter();
  const { addToast } = useToast();
  const [isPhoneRevealed, setIsPhoneRevealed] = useState(false);
  const [ratingData, setRatingData] = useState({ avg: 0, count: 0 });
  const [isMsgLoading, setIsMsgLoading] = useState(false);

  useEffect(() => {
    async function fetchReviews() {
        const reviews = await getSellerReviewsServer(sellerId);
        if (reviews.length > 0) {
            const total = reviews.reduce((sum: number, r: any) => sum + r.rating, 0);
            setRatingData({ avg: total / reviews.length, count: reviews.length });
        }
    }
    fetchReviews();
  }, [sellerId]);

  const handleSendMessage = async () => {
    if (!user) {
        addToast('Mesaj göndermek için giriş yapmalısınız.', 'info');
        router.push('/login');
        return;
    }

    if (user.id === sellerId) {
        addToast('Kendi ilanınıza mesaj gönderemezsiniz.', 'warning');
        return;
    }

    setIsMsgLoading(true);
    try {
        const { data, error } = await startConversationClient(adId, user.id, sellerId);

        if(error) {
            console.error(error);
            addToast('Sohbet başlatılamadı. Lütfen tekrar deneyin.', 'error');
        } else if (data) {
            router.push(`/bana-ozel/mesajlarim?convId=${data.id}`);
        }
    } catch (err) {
        addToast('Beklenmedik bir hata oluştu.', 'error');
    } finally {
        setIsMsgLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-card border border-gray-100 p-6">
      {/* Profil Başlığı */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center border-2 border-white shadow-sm text-indigo-600">
           <User size={28} />
        </div>
        <div>
           <h3 className="font-bold text-slate-900 text-lg">{sellerName}</h3>
           <Link href={`/satici/${sellerId}`} className="text-xs text-indigo-600 font-medium hover:underline flex items-center gap-1">
             Satıcının Tüm İlanları
           </Link>
        </div>
      </div>

      {/* Puan */}
      <div className="mb-6 bg-slate-50 p-3 rounded-lg flex justify-between items-center">
         <div className="flex text-yellow-400 gap-0.5">
            {[...Array(5)].map((_,i) => <Star key={i} size={16} fill={i < Math.round(ratingData.avg) ? "currentColor" : "none"} />)}
         </div>
         <span className="text-sm font-bold text-slate-700">{ratingData.avg.toFixed(1)} <span className="text-slate-400 font-normal">({ratingData.count})</span></span>
      </div>

      {/* Aksiyonlar */}
      <div className="space-y-3">

        {/* Telefon Göster / Gizli */}
        <div className="rounded-lg overflow-hidden border border-slate-200">
            {!showPhone ? (
                <div className="bg-gray-50 py-3.5 text-center text-gray-500 font-medium text-sm flex items-center justify-center gap-2 cursor-not-allowed">
                    <EyeOff size={16} /> Numara Gizli
                </div>
            ) : !isPhoneRevealed ? (
                <button onClick={() => setIsPhoneRevealed(true)} className="w-full bg-slate-100 hover:bg-slate-200 py-3.5 flex items-center justify-center gap-2 text-slate-700 font-bold transition-colors">
                    <Phone size={18} /> Telefonu Göster
                </button>
            ) : (
                <div className="bg-green-50 py-3.5 text-center text-green-700 font-bold text-lg select-all border-green-100">
                    {sellerPhone || "Belirtilmemiş"}
                </div>
            )}
        </div>

        <button
            onClick={handleSendMessage}
            disabled={isMsgLoading}
            className="w-full bg-indigo-600 text-white hover:bg-indigo-700 py-3.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-100 disabled:opacity-70"
        >
            {isMsgLoading ? <Loader2 size={18} className="animate-spin" /> : <MessageCircle size={18} />}
            Mesaj Gönder
        </button>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500">
         <ShieldCheck size={14} className="text-green-500"/> Hesap Onaylı
      </div>
    </div>
  );
}