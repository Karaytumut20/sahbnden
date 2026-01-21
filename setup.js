const fs = require("fs");
const path = require("path");

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
};

console.log(
  colors.cyan +
    colors.bold +
    "\n🚀 RESİM YÜKLEME VE ÖNİZLEME SİSTEMİ ONARILIYOR...\n" +
    colors.reset,
);

function writeFile(filePath, content) {
  const absolutePath = path.join(__dirname, filePath);
  const dir = path.dirname(absolutePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(absolutePath, content.trim());
  console.log(`${colors.green}✔ Güncellendi:${colors.reset} ${filePath}`);
}

// -------------------------------------------------------------------------
// 1. LIB/SERVICES.TS (Detaylı Hata Loglama Eklendi)
// -------------------------------------------------------------------------
const servicesContent = `
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

// --- RESİM YÜKLEME (Geliştirilmiş Hata Yönetimi) ---
export async function uploadImageClient(file: File) {
  try {
    const fileExt = file.name.split('.').pop();
    // Türkçe karakterleri ve boşlukları temizleyerek dosya adı oluştur
    const cleanFileName = Math.random().toString(36).substring(2, 15);
    const fileName = \`\${Date.now()}-\${cleanFileName}.\${fileExt}\`;

    // 'ads' bucket'ına yükle
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('ads')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error("Supabase Storage Hatası:", uploadError);
      throw uploadError;
    }

    // Public URL al
    const { data: urlData } = supabase.storage
      .from('ads')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  } catch (error) {
    console.error("Resim yükleme servisinde hata:", error);
    throw error;
  }
}

// Header'daki arama önerileri için
export async function getAdsClient(searchParams?: any) {
  let query = supabase.from('ads').select('id, title, price, currency').eq('status', 'yayinda');
  if (searchParams?.q) query = query.ilike('title', \`%\${searchParams.q}%\`);
  const { data } = await query.limit(5);
  return data || [];
}

// --- KULLANICI İLANLARI & İSTATİSTİKLERİ ---
export async function getUserAdsClient(userId: string) {
  const { data } = await supabase.from('ads').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  return data || []
}

export async function getUserStatsClient(userId: string) {
  const { count } = await supabase.from('ads').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('status', 'yayinda')
  return { adsCount: count || 0 }
}

export async function updateAdStatusClient(id: number, status: string) {
  return await supabase.from('ads').update({ status }).eq('id', id)
}

// --- ADMIN ---
export async function getAdminAdsClient() {
  const { data } = await supabase.from('ads').select('*, profiles(full_name)').order('created_at', { ascending: false })
  return data || []
}

export async function getAllUsersClient() {
  const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
  return data || [];
}

export async function updateUserStatusClient(userId: string, status: string) {
  return await supabase.from('profiles').update({ status }).eq('id', userId);
}

export async function updateUserRoleClient(userId: string, role: string) {
  return await supabase.from('profiles').update({ role }).eq('id', userId);
}

// --- MESAJLAŞMA ---
export async function getConversationsClient(userId: string) {
  return await supabase
    .from('conversations')
    .select('*, ads(title, image), profiles:buyer_id(full_name), seller:seller_id(full_name)')
    .or(\`buyer_id.eq.\${userId},seller_id.eq.\${userId}\`)
    .order('updated_at', { ascending: false })
}

export async function getMessagesClient(conversationId: number) {
  return await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
}

export async function sendMessageClient(conversationId: number, senderId: string, content: string) {
  return await supabase.from('messages').insert([{ conversation_id: conversationId, sender_id: senderId, content }])
}

export async function startConversationClient(adId: number, buyerId: string, sellerId: string) {
    const { data } = await supabase.from('conversations').select('id').eq('ad_id', adId).eq('buyer_id', buyerId).single()
    if(data) return { data }
    return await supabase.from('conversations').insert([{ ad_id: adId, buyer_id: buyerId, seller_id: sellerId }]).select().single()
}

export async function markMessagesAsReadClient(conversationId: number, userId: string) {
  return await supabase.from('messages').update({ is_read: true }).eq('conversation_id', conversationId).neq('sender_id', userId)
}

// --- FAVORİLER ---
export async function toggleFavoriteClient(userId: string, adId: number) {
  const { data } = await supabase.from('favorites').select('id').eq('user_id', userId).eq('ad_id', adId).single()
  if (data) {
    await supabase.from('favorites').delete().eq('id', data.id)
    return false
  } else {
    await supabase.from('favorites').insert([{ user_id: userId, ad_id: adId }])
    return true
  }
}

export async function getFavoritesClient(userId: string) {
    const { data } = await supabase.from('favorites').select('ad_id, ads(*)').eq('user_id', userId)
    if (!data) return [];
    return data
      .filter((item: any) => item.ads !== null)
      .map((f: any) => f.ads);
}

// --- KAYITLI ARAMALAR ---
export async function saveSearchClient(userId: string, name: string, url: string, criteria: string) {
  return await supabase.from('saved_searches').insert([{ user_id: userId, name, url, criteria }])
}

export async function getSavedSearchesClient(userId: string) {
  const { data } = await supabase.from('saved_searches').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  return data || []
}

export async function deleteSavedSearchClient(id: number) {
  return await supabase.from('saved_searches').delete().eq('id', id)
}

// --- PROFİL ---
export async function getProfileClient(userId: string) {
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
  return data
}

export async function updateProfileClient(userId: string, updates: any) {
  return await supabase.from('profiles').update(updates).eq('id', userId)
}

// --- YORUMLAR ---
export async function getReviewsClient(targetId: string) {
  const { data } = await supabase.from('reviews').select('*, reviewer:reviewer_id(full_name, avatar_url)').eq('target_id', targetId).order('created_at', { ascending: false });
  return data || [];
}

export async function addReviewClient(targetId: string, rating: number, comment: string, reviewerId: string) {
  if (targetId === reviewerId) return { error: { message: 'Kendinize yorum yapamazsınız.' } };
  return await supabase.from('reviews').insert([{ target_id: targetId, reviewer_id: reviewerId, rating, comment }]);
}
`;

// -------------------------------------------------------------------------
// 2. COMPONENTS/UI/IMAGEUPLOADER.TSX (Anlık Önizleme Özellikli)
// -------------------------------------------------------------------------
const imageUploaderContent = `
"use client";
import React, { useRef, useState } from 'react';
import { Upload, X, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { uploadImageClient } from '@/lib/services';
import { useToast } from '@/context/ToastContext';

type ImageUploaderProps = {
  onImagesChange: (urls: string[]) => void;
  initialImages?: string[];
};

type UploadItem = {
  id: string;
  url: string;        // Local preview veya Remote URL
  file?: File;        // Yükleniyorsa dosya objesi
  status: 'pending' | 'uploading' | 'success' | 'error';
  remoteUrl?: string; // Başarılı yükleme sonrası gelen URL
};

export default function ImageUploader({ onImagesChange, initialImages = [] }: ImageUploaderProps) {
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Başlangıç resimleri
  const [items, setItems] = useState<UploadItem[]>(
    initialImages.map((url, i) => ({
      id: \`init-\${i}\`,
      url: url,
      status: 'success',
      remoteUrl: url
    }))
  );

  const [isGlobalUploading, setIsGlobalUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const files = Array.from(e.target.files);

    // 1. Önce "Yükleniyor" durumunda listeye ekle (ANLIK ÖNİZLEME İÇİN)
    const newItems: UploadItem[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file), // Local blob URL ile hemen göster
      file: file,
      status: 'uploading'
    }));

    setItems(prev => [...prev, ...newItems]);
    setIsGlobalUploading(true);

    // 2. Arka planda tek tek yükle
    for (const item of newItems) {
      if (!item.file) continue;

      try {
        const publicUrl = await uploadImageClient(item.file);

        // Başarılı olursa remoteUrl'i güncelle
        setItems(prev => prev.map(i =>
          i.id === item.id ? { ...i, status: 'success', remoteUrl: publicUrl } : i
        ));
      } catch (error) {
        console.error("Yükleme hatası:", error);
        // Hatalı olursa durumu güncelle
        setItems(prev => prev.map(i =>
          i.id === item.id ? { ...i, status: 'error' } : i
        ));
        addToast(\`\${item.file.name} yüklenemedi.\`, 'error');
      }
    }

    setIsGlobalUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Üst bileşene sadece başarılı URL'leri gönder
  React.useEffect(() => {
    const successUrls = items
      .filter(i => i.status === 'success' && i.remoteUrl)
      .map(i => i.remoteUrl as string);

    onImagesChange(successUrls);
  }, [items, onImagesChange]);

  const removeImage = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">

        {/* Yükleme Butonu */}
        <div
          onClick={() => !isGlobalUploading && fileInputRef.current?.click()}
          className={\`w-28 h-28 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-blue-50 hover:border-blue-400 \${isGlobalUploading ? 'opacity-50 cursor-not-allowed' : ''}\`}
        >
          {isGlobalUploading ? (
            <Loader2 size={24} className="animate-spin text-blue-600" />
          ) : (
            <>
              <Upload size={24} className="text-gray-400 mb-2" />
              <span className="text-xs text-gray-500 font-bold">Fotoğraf Ekle</span>
            </>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
            accept="image/*"
            disabled={isGlobalUploading}
          />
        </div>

        {/* Resim Listesi */}
        {items.map((item, idx) => (
          <div key={item.id} className="relative w-28 h-28 bg-gray-100 rounded-md border border-gray-200 overflow-hidden group">
            <img src={item.url} alt="preview" className="w-full h-full object-cover" />

            {/* Durum İkonları */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {item.status === 'uploading' && (
                <div className="bg-white/80 p-2 rounded-full shadow"><Loader2 size={20} className="animate-spin text-blue-600" /></div>
              )}
              {item.status === 'error' && (
                <div className="bg-red-100 p-2 rounded-full shadow text-red-600"><AlertCircle size={20} /></div>
              )}
            </div>

            {/* Vitrin Etiketi (İlk başarılı resim) */}
            {idx === 0 && item.status === 'success' && (
              <div className="absolute top-0 left-0 bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-br-sm z-10">
                VİTRİN
              </div>
            )}

            {/* Sil Butonu */}
            <button
              onClick={() => removeImage(item.id)}
              className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 z-20 cursor-pointer"
              title="Kaldır"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <p className="text-xs text-gray-400">Henüz fotoğraf yüklenmedi. (İsteğe bağlı)</p>
      )}
    </div>
  );
}
`;

// -------------------------------------------------------------------------
// 3. APP/ILAN-VER/DETAY/PAGE.TSX (Görsel zorunluluğu kaldırıldı)
// -------------------------------------------------------------------------
const pageContent = `
"use client";
import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import RealEstateFields from '@/components/form/RealEstateFields';
import VehicleFields from '@/components/form/VehicleFields';
import ImageUploader from '@/components/ui/ImageUploader';
import { createAdAction } from '@/lib/actions';

function PostAdFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  const { user } = useAuth();

  const categorySlug = searchParams.get('cat') || '';
  const categoryPath = searchParams.get('path') || 'Kategori Seçilmedi';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState<any>({});

  const isRealEstate = categorySlug.includes('konut') || categorySlug.includes('isyeri') || categorySlug.includes('arsa') || categorySlug.includes('bina');
  const isVehicle = categorySlug.includes('otomobil') || categorySlug.includes('suv') || categorySlug.includes('moto');

  const handleInputChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleDynamicChange = (name: string, value: string) => setFormData({ ...formData, [name]: value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { router.push('/login'); return; }

    // GÖRSEL ZORUNLULUĞU KALDIRILDI

    setIsSubmitting(true);

    const finalData = {
        ...formData,
        category: categorySlug,
        image: images[0] || null, // Görsel yoksa null
        price: Number(formData.price),
        year: Number(formData.year),
        km: Number(formData.km),
        m2: Number(formData.m2),
        floor: Number(formData.floor)
    };

    const res = await createAdAction(finalData);

    if (res.error) {
        addToast(res.error, 'error');
    } else {
        addToast('İlan başarıyla oluşturuldu!', 'success');
        router.push(\`/ilan-ver/doping?adId=\${res.adId}\`);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-[800px] mx-auto py-8 px-4">

      <div className="bg-blue-50 border border-blue-100 p-4 rounded-sm mb-6 flex items-center justify-between">
        <div>
            <p className="text-xs text-blue-600 font-bold uppercase mb-1">Seçilen Kategori</p>
            <h1 className="text-lg font-bold text-[#333] flex items-center gap-2">
                {categoryPath} <CheckCircle size={16} className="text-green-500"/>
            </h1>
        </div>
        <button onClick={() => router.push('/ilan-ver')} className="text-xs font-bold text-gray-500 hover:text-blue-700 underline">
            Değiştir
        </button>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-sm border border-gray-200 rounded-sm space-y-8">

        <section>
            <h3 className="font-bold text-sm text-[#333] mb-4 border-b pb-2 flex items-center gap-2">
                <span className="bg-blue-600 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs">1</span>
                İlan Detayları
            </h3>
            <div className="space-y-4 px-2">
                <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">İlan Başlığı <span className="text-red-500">*</span></label>
                    <input name="title" onChange={handleInputChange} className="w-full border border-gray-300 h-10 px-3 rounded-sm outline-none focus:border-blue-500 transition-colors text-sm" required placeholder="Örn: Sahibinden temiz aile evi" />
                </div>
                <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">Açıklama <span className="text-red-500">*</span></label>
                    <textarea name="description" onChange={handleInputChange} className="w-full border border-gray-300 p-3 rounded-sm h-32 resize-none focus:border-blue-500 outline-none text-sm" required placeholder="İlanınızla ilgili tüm detayları buraya yazın..."></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">Fiyat <span className="text-red-500">*</span></label>
                        <input name="price" type="number" onChange={handleInputChange} className="w-full border border-gray-300 h-10 px-3 rounded-sm outline-none focus:border-blue-500 text-sm" required placeholder="0" />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">Para Birimi</label>
                        <select name="currency" onChange={handleInputChange} className="w-full border border-gray-300 h-10 px-3 rounded-sm bg-white outline-none text-sm">
                            <option>TL</option><option>USD</option><option>EUR</option>
                        </select>
                    </div>
                </div>
            </div>
        </section>

        {(isRealEstate || isVehicle) && (
            <section>
                <h3 className="font-bold text-sm text-[#333] mb-4 border-b pb-2 flex items-center gap-2">
                    <span className="bg-blue-600 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs">2</span>
                    Özellikler
                </h3>
                <div className="px-2">
                    {isRealEstate && <RealEstateFields data={formData} onChange={handleDynamicChange} />}
                    {isVehicle && <VehicleFields data={formData} onChange={handleDynamicChange} />}
                </div>
            </section>
        )}

        <section>
            <h3 className="font-bold text-sm text-[#333] mb-4 border-b pb-2 flex items-center gap-2">
                <span className="bg-blue-600 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs">3</span>
                Fotoğraflar (Opsiyonel)
            </h3>
            <div className="px-2">
                <ImageUploader onImagesChange={setImages} />
            </div>
        </section>

        <section>
            <h3 className="font-bold text-sm text-[#333] mb-4 border-b pb-2 flex items-center gap-2">
                <span className="bg-blue-600 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs">4</span>
                Adres Bilgileri
            </h3>
            <div className="px-2 grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">İl <span className="text-red-500">*</span></label>
                    <select name="city" onChange={handleInputChange} className="w-full border border-gray-300 h-10 px-3 rounded-sm bg-white outline-none text-sm" required>
                        <option value="">Seçiniz</option>
                        <option value="İstanbul">İstanbul</option>
                        <option value="Ankara">Ankara</option>
                        <option value="İzmir">İzmir</option>
                        <option value="Antalya">Antalya</option>
                        <option value="Bursa">Bursa</option>
                    </select>
                </div>
                <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">İlçe <span className="text-red-500">*</span></label>
                    <input name="district" onChange={handleInputChange} className="w-full border border-gray-300 h-10 px-3 rounded-sm outline-none text-sm" required placeholder="Örn: Kadıköy"/>
                </div>
            </div>
        </section>

        <div className="pt-4 flex items-center gap-4">
            <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-gray-300 rounded-sm font-bold text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2">
                <ArrowLeft size={16}/> Geri Dön
            </button>
            <button type="submit" disabled={isSubmitting} className="flex-1 bg-[#ffe800] py-3 font-bold text-sm rounded-sm hover:bg-yellow-400 disabled:opacity-50 flex items-center justify-center gap-2 text-black shadow-sm transition-colors">
                {isSubmitting ? <><Loader2 className="animate-spin" size={18}/> Kaydediliyor...</> : 'Kaydet ve Devam Et'}
            </button>
        </div>

      </form>
    </div>
  );
}

export default function PostAdPage() {
    return <Suspense fallback={<div className="p-10 text-center">Yükleniyor...</div>}><PostAdFormContent /></Suspense>
}
`;

// -------------------------------------------------------------------------
// 4. LIB/UPLOAD.TS (Yedek - Bucket 'ads' olarak ayarlandı)
// -------------------------------------------------------------------------
const uploadTsContent = `
import { supabase } from './supabase';

export async function uploadImage(file: File) {
  const fileExt = file.name.split('.').pop();
  const cleanFileName = Math.random().toString(36).substring(2, 15);
  const fileName = \`\${Date.now()}-\${cleanFileName}.\${fileExt}\`;

  const { error: uploadError } = await supabase.storage
    .from('ads')
    .upload(fileName, file);

  if (uploadError) {
    console.error('Yükleme hatası:', uploadError);
    throw uploadError;
  }

  const { data } = supabase.storage.from('ads').getPublicUrl(fileName);
  return data.publicUrl;
}
`;

writeFile("lib/services.ts", servicesContent);
writeFile("components/ui/ImageUploader.tsx", imageUploaderContent);
writeFile("app/ilan-ver/detay/page.tsx", pageContent);
writeFile("lib/upload.ts", uploadTsContent);
