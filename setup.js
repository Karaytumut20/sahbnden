const fs = require("fs");
const path = require("path");

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  yellow: "\x1b[33m",
  bold: "\x1b[1m",
  red: "\x1b[31m",
};

console.log(
  colors.blue +
    colors.bold +
    "\n📞 TELEFON GİRİŞİ & GİZLİLİK AYARLARI EKLENİYOR... 📞\n" +
    colors.reset,
);

function writeFile(filePath, content) {
  try {
    const absolutePath = path.join(process.cwd(), filePath);
    const dir = path.dirname(absolutePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(absolutePath, content.trim());
    console.log(`${colors.green}✔ [GÜNCELLENDİ]${colors.reset} ${filePath}`);
  } catch (error) {
    console.error(
      `${colors.red}✘ [HATA]${colors.reset} ${filePath}: ${error.message}`,
    );
  }
}

// =============================================================================
// 1. DATABASE SQL (Telefona Göster Ayarı İçin Kolon Ekleme)
// =============================================================================
const privacySql = `
-- BU KODU SUPABASE SQL EDITOR'DE ÇALIŞTIRIN --

-- 1. 'profiles' tablosuna telefon görünürlük ayarı ekle
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS show_phone boolean DEFAULT false;

-- 2. Yeni kolon için RLS (Güvenlik) izni (Kullanıcı kendi ayarını güncelleyebilsin)
-- (Mevcut update politikası genellikle tüm kolonları kapsar, ekstra bir şey gerekmeyebilir ama garanti olsun)
-- Zaten "Users can update own profile" politikası varsa sorun yok.

-- 3. Cache Temizliği
NOTIFY pgrst, 'reload schema';
`;

// =============================================================================
// 2. TYPES GÜNCELLEMESİ (show_phone Eklendi)
// Dosya: types/index.ts
// =============================================================================
const typesContent = `
export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'user' | 'store' | 'admin';
  phone: string | null;
  show_phone?: boolean; // YENİ
  created_at: string;
}

export interface Notification {
  id: number;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface Category {
  id: number;
  title: string;
  slug: string;
  icon: string | null;
  parent_id: number | null;
  subs?: Category[];
}

export interface Ad {
  id: number;
  title: string;
  description: string;
  price: number;
  currency: string;
  city: string;
  district: string;
  category: string;
  image: string | null;
  images?: string[];
  status: 'yayinda' | 'onay_bekliyor' | 'pasif' | 'reddedildi';
  is_vitrin: boolean;
  is_urgent: boolean;
  user_id: string;
  created_at: string;
  room?: string;
  m2?: number;
  floor?: number;
  heating?: string;
  brand?: string;
  model?: string;
  year?: number;
  km?: number;
  gear?: string;
  fuel?: string;
  profiles?: Profile;
  view_count?: number; // YENİ: Görüntülenme sayısı için
}

export interface AdFormData {
  title: string;
  description: string;
  price: string | number;
  currency: string;
  city: string;
  district: string;
  category?: string;
  m2?: string | number;
  room?: string;
  floor?: string | number;
  heating?: string;
  brand?: string;
  year?: string | number;
  km?: string | number;
  gear?: string;
  fuel?: string;
  status_vehicle?: string;
}
`;

// =============================================================================
// 3. REGISTER PAGE GÜNCELLEMESİ (Telefon Inputu Eklendi)
// Dosya: app/register/page.tsx
// =============================================================================
const registerPage = `
"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [form, setForm] = useState({ name: '', surname: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Telefon numarası formatlama (Basitçe boşlukları sil)
    const cleanPhone = form.phone.replace(/\\s/g, '');

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: \`\${form.name} \${form.surname}\`,
          phone: cleanPhone, // Meta data olarak gönderiyoruz (Trigger ile profiles'a yazılmalı)
          // Not: Eğer Supabase trigger'ınız meta_data'dan phone'u alıp profiles tablosuna yazmıyorsa,
          // manuel insert gerekebilir. Ancak standart trigger'lar genelde bunu halleder.
        },
      },
    });

    if (error) {
      addToast(error.message, 'error');
    } else {
      // Eğer trigger phone'u yazmıyorsa manuel update (Garanti Yöntem)
      if (data.user) {
          await supabase.from('profiles').update({
              phone: cleanPhone,
              show_phone: false // Varsayılan olarak gizli
          }).eq('id', data.user.id);
      }

      addToast('Kayıt başarılı! Giriş yapabilirsiniz.', 'success');
      router.push('/login');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 bg-[#f6f7f9] px-4">
      <div className="bg-white border border-gray-200 shadow-sm rounded-sm w-full max-w-[500px] overflow-hidden">
        <div className="p-8">
          <h2 className="text-xl font-bold text-[#333] mb-2 text-center">Bireysel Hesap Oluştur</h2>
          <form onSubmit={handleRegister} className="space-y-4 mt-6">

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">Ad</label>
                <input type="text" onChange={e => setForm({...form, name: e.target.value})} className="w-full border border-gray-300 rounded-sm h-[38px] px-3 focus:border-blue-500 outline-none text-sm" required />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">Soyad</label>
                <input type="text" onChange={e => setForm({...form, surname: e.target.value})} className="w-full border border-gray-300 rounded-sm h-[38px] px-3 focus:border-blue-500 outline-none text-sm" required />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">Cep Telefonu</label>
              <input
                type="tel"
                placeholder="05XX XXX XX XX"
                onChange={e => setForm({...form, phone: e.target.value})}
                className="w-full border border-gray-300 rounded-sm h-[38px] px-3 focus:border-blue-500 outline-none text-sm"
                required
              />
              <p className="text-[10px] text-gray-500 mt-1">* İlanlarınızda alıcılarla iletişim için gereklidir.</p>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">E-posta</label>
              <input type="email" onChange={e => setForm({...form, email: e.target.value})} className="w-full border border-gray-300 rounded-sm h-[38px] px-3 focus:border-blue-500 outline-none text-sm" required />
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">Şifre</label>
              <input type="password" onChange={e => setForm({...form, password: e.target.value})} className="w-full border border-gray-300 rounded-sm h-[38px] px-3 focus:border-blue-500 outline-none text-sm" required />
            </div>

            <button disabled={loading} className="w-full bg-blue-700 text-white font-bold h-[44px] rounded-sm hover:bg-blue-800 transition-colors shadow-sm mt-4 text-sm disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Hesap Oluştur'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-[12px] text-gray-500">Zaten üye misin? </span>
            <Link href="/login" className="text-blue-700 font-bold text-[12px] hover:underline">Giriş Yap</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
`;

// =============================================================================
// 4. AYARLAR SAYFASI GÜNCELLEMESİ (Gizlilik Toggle Eklendi)
// Dosya: app/bana-ozel/ayarlar/page.tsx
// =============================================================================
const settingsPage = `
"use client";
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getProfileClient } from '@/lib/services';
import { updateProfileAction, updatePasswordAction } from '@/lib/actions';
import { useToast } from '@/context/ToastContext';
import { Loader2, Save, Lock, User, Phone, Shield } from 'lucide-react';
import { Input } from '@/components/ui/Input';

export default function SettingsPage() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [profile, setProfile] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [passwords, setPasswords] = useState({ new: '', confirm: '' });

  useEffect(() => {
    if (user) {
        getProfileClient(user.id).then((data) => {
            setProfile(data || {});
            setLoading(false);
        });
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    // show_phone boolean olduğu için formdan string gelebilir, kontrol etmeye gerek yok çünkü toggle boolean state kullanıyor.
    const res = await updateProfileAction(profile);
    if (res.success) addToast('Profil bilgileri güncellendi.', 'success');
    else addToast('Güncelleme başarısız.', 'error');
    setSavingProfile(false);
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.new !== passwords.confirm) {
        addToast('Şifreler eşleşmiyor.', 'error');
        return;
    }
    if (passwords.new.length < 6) {
        addToast('Şifre en az 6 karakter olmalı.', 'error');
        return;
    }

    setSavingPassword(true);
    const res = await updatePasswordAction(passwords.new);
    if (res.success) {
        addToast('Şifreniz başarıyla değiştirildi.', 'success');
        setPasswords({ new: '', confirm: '' });
    } else {
        addToast(res.error || 'Şifre değiştirilemedi.', 'error');
    }
    setSavingPassword(false);
  };

  const togglePhoneVisibility = () => {
      setProfile({ ...profile, show_phone: !profile.show_phone });
  };

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-indigo-600"/></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <h1 className="text-2xl font-bold text-gray-800 border-b border-gray-200 pb-4">Hesap Ayarları</h1>

      <div className="grid md:grid-cols-2 gap-8">

        {/* Profil Bilgileri */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
            <h2 className="font-bold text-lg mb-6 flex items-center gap-2 text-indigo-900">
                <User size={20}/> Kişisel Bilgiler
            </h2>

            <form onSubmit={handleProfileUpdate} className="space-y-5">
                {/* Avatar */}
                <div className="flex justify-center mb-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm flex items-center justify-center">
                        {profile.avatar_url ? (
                            <img src={profile.avatar_url} className="w-full h-full object-cover"/>
                        ) : (
                            <span className="text-2xl font-bold text-gray-400">{profile.full_name?.charAt(0)}</span>
                        )}
                    </div>
                </div>

                <Input label="Ad Soyad" value={profile.full_name || ''} onChange={(e) => setProfile({...profile, full_name: e.target.value})} />
                <Input label="Profil Fotoğrafı URL" value={profile.avatar_url || ''} onChange={(e) => setProfile({...profile, avatar_url: e.target.value})} placeholder="https://..." />

                {/* Telefon ve Gizlilik Ayarı */}
                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-100 space-y-3">
                    <Input
                        label="Cep Telefonu"
                        value={profile.phone || ''}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                        placeholder="05XX XXX XX XX"
                        className="bg-white"
                    />

                    <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2 text-sm text-indigo-900 font-medium">
                            <Phone size={16} />
                            <span>İlanlarda numaram görünsün</span>
                        </div>
                        <button
                            type="button"
                            onClick={togglePhoneVisibility}
                            className={\`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 \${profile.show_phone ? 'bg-indigo-600' : 'bg-gray-300'}\`}
                        >
                            <span className={\`inline-block h-4 w-4 transform rounded-full bg-white transition-transform \${profile.show_phone ? 'translate-x-6' : 'translate-x-1'}\`} />
                        </button>
                    </div>
                    <p className="text-[10px] text-gray-500 leading-tight">
                        {profile.show_phone
                            ? 'Şu an numaranız tüm ziyaretçilere görünmektedir.'
                            : 'Numaranız gizli. Alıcılar sadece site üzerinden mesaj atabilir.'}
                    </p>
                </div>

                <div className="pt-2">
                    <button type="submit" disabled={savingProfile} className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-bold hover:bg-indigo-700 disabled:opacity-50 flex justify-center items-center gap-2 transition-colors shadow-md shadow-indigo-100">
                        {savingProfile ? <Loader2 size={18} className="animate-spin"/> : <Save size={18}/>}
                        Değişiklikleri Kaydet
                    </button>
                </div>
            </form>
        </div>

        {/* Şifre Değiştirme */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
            <h2 className="font-bold text-lg mb-6 flex items-center gap-2 text-indigo-900">
                <Lock size={20}/> Şifre Güvenliği
            </h2>
            <form onSubmit={handlePasswordUpdate} className="space-y-5">
                <Input label="Yeni Şifre" type="password" value={passwords.new} onChange={(e) => setPasswords({...passwords, new: e.target.value})} placeholder="••••••" />
                <Input label="Yeni Şifre (Tekrar)" type="password" value={passwords.confirm} onChange={(e) => setPasswords({...passwords, confirm: e.target.value})} placeholder="••••••" />

                <div className="bg-yellow-50 p-4 rounded-lg text-xs text-yellow-800 border border-yellow-200 flex gap-2">
                    <Shield size={16} className="shrink-0 mt-0.5" />
                    <p>Güvenliğiniz için şifrenizi kimseyle paylaşmayınız ve tahmin edilmesi zor bir şifre seçiniz.</p>
                </div>

                <div className="pt-2">
                    <button type="submit" disabled={savingPassword} className="w-full bg-slate-800 text-white py-2.5 rounded-lg font-bold hover:bg-slate-900 disabled:opacity-50 flex justify-center items-center gap-2 transition-colors shadow-md">
                        {savingPassword ? <Loader2 size={18} className="animate-spin"/> : 'Şifreyi Güncelle'}
                    </button>
                </div>
            </form>
        </div>
      </div>
    </div>
  );
}
`;

// =============================================================================
// 5. SATICI SIDEBAR GÜNCELLEMESİ (Gizlilik Kontrolü)
// Dosya: components/SellerSidebar.tsx
// =============================================================================
const sellerSidebar = `
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
            router.push(\`/bana-ozel/mesajlarim?convId=\${data.id}\`);
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
           <Link href={\`/satici/\${sellerId}\`} className="text-xs text-indigo-600 font-medium hover:underline flex items-center gap-1">
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
`;

// =============================================================================
// 6. İLAN DETAY SAYFASI GÜNCELLEMESİ (Prop Geçişi)
// Dosya: app/ilan/[id]/page.tsx
// =============================================================================
const adDetailPage = `
import React from 'react';
import { notFound } from 'next/navigation';
import { getAdDetailServer, getAdFavoriteCount } from '@/lib/actions';
import Breadcrumb from '@/components/Breadcrumb';
import Gallery from '@/components/Gallery';
import MobileAdActionBar from '@/components/MobileAdActionBar';
import AdActionButtons from '@/components/AdActionButtons';
import StickyAdHeader from '@/components/StickyAdHeader';
import SellerSidebar from '@/components/SellerSidebar';
import Tabs from '@/components/AdDetail/Tabs';
import FeaturesTab from '@/components/AdDetail/FeaturesTab';
import LocationTab from '@/components/AdDetail/LocationTab';
import LoanCalculator from '@/components/tools/LoanCalculator';
import ViewTracker from '@/components/ViewTracker';
import LiveVisitorCount from '@/components/LiveVisitorCount';
import Badge from '@/components/ui/Badge';
import { Eye, MapPin } from 'lucide-react';

export default async function AdDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ad = await getAdDetailServer(Number(id));
  if (!ad) return notFound();

  const formattedPrice = ad.price?.toLocaleString('tr-TR');
  const location = \`\${ad.city || ''} / \${ad.district || ''}\`;
  const sellerInfo = ad.profiles || { full_name: 'Bilinmiyor', phone: '', email: '', show_phone: false };

  return (
    <div className="pb-20 relative font-sans bg-gray-50 min-h-screen">
      <ViewTracker adId={ad.id} />
      <StickyAdHeader title={ad.title} price={formattedPrice} currency={ad.currency} />

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <Breadcrumb path={\`\${ad.category === 'emlak' ? 'Emlak' : 'Vasıta'} > \${location} > İlan Detayı\`} />

        {/* BAŞLIK VE ETİKETLER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-slate-900 font-bold text-2xl md:text-3xl leading-tight mb-2">{ad.title}</h1>
            <div className="flex items-center gap-4 text-sm text-slate-500">
               <span className="flex items-center gap-1"><MapPin size={16}/> {location}</span>
               <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
               <span className="text-indigo-600 font-medium">#{ad.id}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
              {ad.is_urgent && <Badge variant="danger" className="text-sm px-3 py-1">ACİL</Badge>}
              {ad.is_vitrin && <Badge variant="warning" className="text-sm px-3 py-1">VİTRİN</Badge>}
              <LiveVisitorCount adId={ad.id} />
          </div>
        </div>

        {/* 12-COLUMN GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* SOL: GALERİ VE DETAYLAR (8/12) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-1">
               <Gallery mainImage={ad.image || 'https://via.placeholder.com/800x600?text=Resim+Yok'} />
            </div>

            {/* Hızlı Bilgi Şeridi */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex justify-between items-center">
               <div>
                 <p className="text-sm text-slate-500 mb-1">Fiyat</p>
                 <p className="text-3xl font-extrabold text-indigo-700">{formattedPrice} <span className="text-xl text-slate-400 font-normal">{ad.currency}</span></p>
               </div>
               <div className="hidden md:block">
                 <AdActionButtons id={ad.id} title={ad.title} image={ad.image} sellerName={sellerInfo.full_name} />
               </div>
            </div>

            {/* Sekmeler ve İçerik */}
            <Tabs items={[
               { id: 'desc', label: 'İlan Açıklaması', content: <div className="text-slate-700 leading-relaxed whitespace-pre-wrap text-base p-2">{ad.description}</div> },
               { id: 'features', label: 'Özellikler', content: <FeaturesTab ad={ad} /> },
               { id: 'location', label: 'Konum', content: <LocationTab city={ad.city} district={ad.district} /> }
            ]} />
          </div>

          {/* SAĞ: SATICI VE ÖZET (4/12) */}
          <div className="lg:col-span-4 space-y-6">
             <SellerSidebar
                sellerId={ad.user_id}
                sellerName={sellerInfo.full_name || 'Kullanıcı'}
                sellerPhone={sellerInfo.phone || 'Telefon yok'}
                showPhone={sellerInfo.show_phone} // GİZLİLİK AYARI BURADA GEÇİLİYOR
                adId={ad.id}
                adTitle={ad.title}
                adImage={ad.image}
                price={formattedPrice}
                currency={ad.currency}
             />

             {/* İlan Künyesi */}
             <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider">İlan Künyesi</h3>
                <ul className="space-y-3 text-sm">
                   <li className="flex justify-between border-b border-gray-50 pb-2">
                      <span className="text-slate-500">İlan Tarihi</span>
                      <span className="font-medium text-slate-900">{new Date(ad.created_at).toLocaleDateString()}</span>
                   </li>
                   {ad.m2 && <li className="flex justify-between border-b border-gray-50 pb-2"><span className="text-slate-500">m² (Brüt)</span><span className="font-medium text-slate-900">{ad.m2}</span></li>}
                   {ad.room && <li className="flex justify-between border-b border-gray-50 pb-2"><span className="text-slate-500">Oda Sayısı</span><span className="font-medium text-slate-900">{ad.room}</span></li>}
                   {ad.km && <li className="flex justify-between border-b border-gray-50 pb-2"><span className="text-slate-500">Kilometre</span><span className="font-medium text-slate-900">{ad.km}</span></li>}
                   <li className="flex justify-between pt-1">
                      <span className="text-slate-500">Görüntülenme</span>
                      <span className="font-medium text-slate-900 flex items-center gap-1"><Eye size={14}/> {ad.view_count || 0}</span>
                   </li>
                </ul>
             </div>

             {ad.category.includes('konut') && <LoanCalculator price={ad.price} />}
          </div>

        </div>
      </div>
      <MobileAdActionBar price={\`\${formattedPrice} \${ad.currency}\`} phone={sellerInfo.show_phone ? sellerInfo.phone : undefined} />
    </div>
  );
}
`;

// DOSYALARI YAZ
writeFile("supabase/privacy.sql", privacySql); // SQL dosyasını manuel çalıştırmalısınız
writeFile("types/index.ts", typesContent);
writeFile("app/register/page.tsx", registerPage);
writeFile("app/bana-ozel/ayarlar/page.tsx", settingsPage);
writeFile("components/SellerSidebar.tsx", sellerSidebar);
writeFile("app/ilan/[id]/page.tsx", adDetailPage);

console.log(
  colors.blue + colors.bold + "\n✅ ÖZELLİKLER EKLENDİ!\n" + colors.reset,
);
console.log(
  colors.yellow +
    "⚠️ ÖNEMLİ: 'supabase/privacy.sql' dosyasındaki SQL kodunu Supabase SQL Editor'de çalıştırmayı unutmayın!" +
    colors.reset,
);
