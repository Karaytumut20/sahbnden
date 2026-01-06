
import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getSellerById, getAdsBySeller } from '@/lib/data';
import StarRating from '@/components/StarRating';
import { ShieldCheck, Phone, MapPin, Calendar, User, MessageSquare } from 'lucide-react';

export default async function SellerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const seller = getSellerById(id);

  if (!seller) return notFound();

  const sellerAds = getAdsBySeller(id);

  return (
    <div className="flex flex-col lg:flex-row gap-6 pt-4">

      {/* SOL KOLON: Satıcı Bilgileri */}
      <div className="w-full lg:w-[300px] shrink-0">
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6 sticky top-24">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold mb-3 border-4 border-white shadow-sm">
              {seller.avatar}
            </div>
            <h1 className="text-xl font-bold text-[#333] flex items-center gap-2">
              {seller.name}
              {seller.isVerified && <ShieldCheck size={18} className="text-green-600" title="Doğrulanmış Hesap" />}
            </h1>
            <div className="mt-2">
              <StarRating rating={seller.rating} />
              <p className="text-xs text-gray-500 mt-1">({seller.reviews.length} Değerlendirme)</p>
            </div>
          </div>

          <div className="space-y-4 border-t border-gray-100 pt-4">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Calendar size={16} className="text-gray-400" />
              <span>Üyelik: <span className="font-semibold text-[#333]">{seller.joined}</span></span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <User size={16} className="text-gray-400" />
              <span>Son Görülme: <span className="font-semibold text-[#333]">{seller.lastSeen}</span></span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <MapPin size={16} className="text-gray-400" />
              <span>Konum: <span className="font-semibold text-[#333]">İstanbul</span></span>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <button className="w-full bg-blue-700 text-white font-bold py-2.5 rounded-sm hover:bg-blue-800 transition-colors flex items-center justify-center gap-2 text-sm">
              <Phone size={16} /> Numarayı Göster
            </button>
            <button className="w-full border border-gray-300 text-[#333] font-bold py-2.5 rounded-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm">
              <MessageSquare size={16} /> Mesaj Gönder
            </button>
          </div>
        </div>
      </div>

      {/* SAĞ KOLON: İlanlar ve Yorumlar */}
      <div className="flex-1">

        {/* İLANLAR */}
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-[#333] mb-4 border-b border-gray-100 pb-2">
            Satıcının İlanları ({sellerAds.length})
          </h2>

          {sellerAds.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {sellerAds.map((ad) => (
                <Link href={`/ilan/${ad.id}`} key={ad.id} className="block group">
                  <div className="border border-gray-200 rounded-sm hover:shadow-md transition-all h-full flex flex-col">
                    <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                      <img src={ad.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-bold text-[#333] line-clamp-2 group-hover:text-blue-700 mb-2 h-[2.4em]">{ad.title}</p>
                      <p className="text-sm font-bold text-blue-900">{ad.price} {ad.currency}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Bu satıcının başka aktif ilanı bulunmamaktadır.</p>
          )}
        </div>

        {/* YORUMLAR */}
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6">
          <h2 className="text-lg font-bold text-[#333] mb-4 border-b border-gray-100 pb-2">
            Satıcı Değerlendirmeleri
          </h2>

          <div className="space-y-4">
            {seller.reviews.map((review) => (
              <div key={review.id} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-sm text-[#333]">{review.user}</span>
                  <span className="text-xs text-gray-400">{review.date}</span>
                </div>
                <div className="mb-2">
                  <StarRating rating={review.rate} />
                </div>
                <p className="text-sm text-gray-600 italic">"{review.comment}"</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
