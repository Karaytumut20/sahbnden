"use client";
import React, { useState, useEffect } from 'react';
import { Star, User, Send, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getReviewsClient, addReviewClient } from '@/lib/services';

export default function ReviewSection({ targetId }: { targetId: string }) {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [reviews, setReviews] = useState<any[]>([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [targetId]);

  const fetchReviews = async () => {
    const data = await getReviewsClient(targetId);
    setReviews(data);
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { addToast('Yorum yapmak için giriş yapmalısınız.', 'error'); return; }

    setSubmitting(true);
    const { error } = await addReviewClient(targetId, rating, comment, user.id);

    if (error) {
      addToast(error.message, 'error');
    } else {
      addToast('Yorumunuz eklendi!', 'success');
      setComment('');
      fetchReviews();
    }
    setSubmitting(false);
  };

  // Ortalama Puan Hesapla
  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6 mt-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
        <h2 className="text-lg font-bold text-[#333]">Satıcı Değerlendirmeleri</h2>
        <div className="flex items-center gap-2">
           <Star className="fill-yellow-400 text-yellow-400" size={24} />
           <span className="text-2xl font-bold text-[#333]">{averageRating}</span>
           <span className="text-sm text-gray-500">({reviews.length} Yorum)</span>
        </div>
      </div>

      {/* Yorum Yapma Formu */}
      {user && user.id !== targetId && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-sm mb-8 border border-gray-100">
          <h3 className="text-sm font-bold text-[#333] mb-3">Deneyimini Paylaş</h3>
          <div className="flex gap-1 mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <Star size={20} className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Satıcı hakkında düşüncelerin..."
            className="w-full border border-gray-300 rounded-sm p-3 text-sm focus:outline-none focus:border-blue-500 resize-none h-24 mb-2"
            required
          />
          <div className="text-right">
            <button
              disabled={submitting}
              className="bg-blue-600 text-white px-6 py-2 rounded-sm text-sm font-bold hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2 ml-auto"
            >
              {submitting ? <Loader2 className="animate-spin" size={16}/> : <Send size={16}/>} Gönder
            </button>
          </div>
        </form>
      )}

      {/* Yorum Listesi */}
      {loading ? (
        <div className="text-center py-10"><Loader2 className="animate-spin mx-auto text-blue-600"/></div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500 text-sm">Henüz değerlendirme yapılmamış. İlk yorumu sen yap!</div>
      ) : (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                    {review.reviewer?.avatar_url ? <img src={review.reviewer.avatar_url} className="w-full h-full object-cover"/> : <User size={16} className="text-gray-500"/>}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#333]">{review.reviewer?.full_name || 'Kullanıcı'}</p>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10} className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed pl-10">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}