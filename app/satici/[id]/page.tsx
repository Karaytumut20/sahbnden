import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { User, Phone, MapPin, Calendar, ShieldCheck, Mail } from 'lucide-react';
import ReviewSection from '@/components/ReviewSection';

export default async function SellerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Satıcı Profilini Çek
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (!profile) return notFound();

  // 2. Satıcının İlanlarını Çek
  const { data: ads } = await supabase
    .from('ads')
    .select('*')
    .eq('user_id', id)
    .eq('status', 'yayinda')
    .order('created_at', { ascending: false });

  return (
    <div className="flex flex-col lg:flex-row gap-6 pt-4">

      {/* SOL KOLON: Satıcı Bilgileri */}
      <div className="w-full lg:w-[300px] shrink-0">
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6 sticky top-24">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold mb-3 border-4 border-white shadow-sm overflow-hidden">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
              ) : (
                profile.full_name?.charAt(0).toUpperCase() || 'U'
              )}
            </div>
            <h1 className="text-xl font-bold text-[#333] flex items-center gap-2 justify-center">
              {profile.full_name || 'İsimsiz Kullanıcı'}
              {profile.role === 'store' && <ShieldCheck size={18} className="text-green-600" title="Kurumsal Üye" />}
            </h1>
            <p className="text-xs text-gray-500 mt-1 capitalize">{profile.role === 'store' ? 'Kurumsal Mağaza' : 'Bireysel Üye'}</p>
          </div>

          <div className="space-y-4 border-t border-gray-100 pt-4">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Calendar size={16} className="text-gray-400" />
              <span>Üyelik: <span className="font-semibold text-[#333]">{new Date(profile.created_at).getFullYear()}</span></span>
            </div>
            {profile.phone && (
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Phone size={16} className="text-gray-400" />
                <span>{profile.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Mail size={16} className="text-gray-400" />
              <span className="truncate">{profile.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SAĞ KOLON: İlanlar ve Yorumlar */}
      <div className="flex-1 min-w-0">

        {/* İLANLAR */}
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-[#333] mb-4 border-b border-gray-100 pb-2">
            Satıcının İlanları ({ads?.length || 0})
          </h2>

          {!ads || ads.length === 0 ? (
            <p className="text-sm text-gray-500">Bu satıcının aktif ilanı bulunmamaktadır.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {ads.map((ad: any) => (
                <Link href={`/ilan/${ad.id}`} key={ad.id} className="block group">
                  <div className="border border-gray-200 rounded-sm hover:shadow-md transition-all h-full flex flex-col">
                    <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                      <img src={ad.image || 'https://via.placeholder.com/300x200'} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-bold text-[#333] line-clamp-2 group-hover:text-blue-700 mb-2 h-[2.4em]">{ad.title}</p>
                      <p className="text-sm font-bold text-blue-900">{ad.price?.toLocaleString()} {ad.currency}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* YORUMLAR BİLEŞENİ */}
        <ReviewSection targetId={id} />

      </div>
    </div>
  );
}