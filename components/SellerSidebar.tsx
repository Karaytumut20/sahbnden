"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Phone, ShieldCheck, User, MessageCircle, Star, Send } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { startConversationClient } from '@/lib/services';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';
import { getSellerReviewsServer, createReviewAction } from '@/lib/actions';

type SellerSidebarProps = {
  sellerId: string;
  sellerName: string;
  sellerPhone: string;
  adId: number;
  adTitle: string;
  adImage: string | null;
  price: string;
  currency: string;
};

export default function SellerSidebar({ sellerId, sellerName, sellerPhone, adId, adTitle, adImage, price, currency }: SellerSidebarProps) {
  const { user } = useAuth();
  const router = useRouter();
  const { addToast } = useToast();
  const [showPhone, setShowPhone] = useState(false);

  // Rating State
  const [ratingData, setRatingData] = useState({ avg: 0, count: 0 });
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [comment, setComment] = useState('');

  // Verileri çek
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
    if (!user) { router.push('/login'); return; }
    if (user.id === sellerId) { addToast('Kendi ilanınıza mesaj atamazsınız', 'error'); return; }

    const { data, error } = await startConversationClient(adId, user.id, sellerId);
    if(error) {
        addToast('Mesaj başlatılamadı', 'error');
    } else {
        router.push(`/bana-ozel/mesajlarim?convId=${data.id}`);
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await createReviewAction(sellerId, newRating, comment, adId);
    if (res.error) {
        addToast(res.error, 'error');
    } else {
        addToast('Değerlendirmeniz kaydedildi.', 'success');
        setShowReviewForm(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-sm p-4 sticky top-24 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
           <User size={24} className="text-gray-400" />
        </div>
        <div>
           <h3 className="font-bold text-[#333]">{sellerName}</h3>
           <Link href={`/satici/${sellerId}`} className="text-xs text-blue-600 hover:underline">Tüm İlanları</Link>
        </div>
      </div>

      {/* PUANLAMA ALANI (Senior Feature) */}
      <div className="mb-4 bg-gray-50 p-2 rounded-sm text-center">
         <div className="flex justify-center items-center gap-1 text-yellow-500 mb-1">
            {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} size={16} fill={star <= Math.round(ratingData.avg) ? "currentColor" : "none"} />
            ))}
         </div>
         <p className="text-xs text-gray-500 font-bold">{ratingData.avg.toFixed(1)} / 5 ({ratingData.count} Değerlendirme)</p>

         {user && user.id !== sellerId && (
             <button onClick={() => setShowReviewForm(!showReviewForm)} className="text-[10px] text-blue-600 underline mt-1">
                 Satıcıyı Değerlendir
             </button>
         )}
      </div>

      {showReviewForm && (
          <form onSubmit={submitReview} className="mb-4 bg-blue-50 p-3 rounded-sm border border-blue-100 animate-in fade-in zoom-in-95">
              <p className="text-xs font-bold mb-2">Puanınız:</p>
              <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map(s => (
                      <button key={s} type="button" onClick={() => setNewRating(s)}>
                          <Star size={18} className={s <= newRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                      </button>
                  ))}
              </div>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                className="w-full text-xs p-2 border rounded-sm mb-2 h-16 resize-none"
                placeholder="Yorumunuz..."
                required
              />
              <button type="submit" className="w-full bg-blue-600 text-white text-xs py-1.5 rounded-sm font-bold">Gönder</button>
          </form>
      )}

      <div className="space-y-3">
        <div className="border border-gray-200 rounded-sm overflow-hidden">
            {!showPhone ? (
                <button onClick={() => setShowPhone(true)} className="w-full bg-[#f1f1f1] hover:bg-[#e9e9e9] py-3 flex items-center justify-center gap-2 text-[#333] font-bold transition-colors">
                    <Phone size={18} /> Cep 0532 123 ** **
                </button>
            ) : (
                <div className="bg-green-50 py-3 text-center text-green-800 font-bold text-lg select-all">
                    {sellerPhone}
                </div>
            )}
        </div>

        <button onClick={handleSendMessage} className="w-full border border-blue-600 text-blue-600 hover:bg-blue-50 py-3 rounded-sm font-bold flex items-center justify-center gap-2 transition-colors">
            <MessageCircle size={18} /> Mesaj Gönder
        </button>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
         <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
            <ShieldCheck size={14} className="text-green-600"/> <span>Üyelik Tarihi: <strong>Ekim 2020</strong></span>
         </div>
         <p className="text-[10px] text-gray-400 text-center">İlan no: {adId} ile ilgili iletişime geçiniz.</p>
      </div>
    </div>
  );
}