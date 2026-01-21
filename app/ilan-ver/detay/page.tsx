"use client";
import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Save, Loader2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import RealEstateFields from '@/components/form/RealEstateFields';
import VehicleFields from '@/components/form/VehicleFields';
import ImageUploader from '@/components/ui/ImageUploader'; // YENİ
import { createAdAction } from '@/lib/actions';

function PostAdFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  const { user } = useAuth();

  const category = searchParams.get('cat') || 'genel';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState<any>({});

  const handleInputChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleDynamicChange = (name: string, value: string) => setFormData({ ...formData, [name]: value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { router.push('/login'); return; }

    setIsSubmitting(true);

    const finalData = {
        ...formData,
        category,
        image: images[0] || null, // İlk resmi kapak resmi yap
        // İleride 'images' array sütunu eklenebilir veritabanına
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
        addToast('İlan başarıyla oluşturuldu! Doping sayfasına yönlendiriliyorsunuz...', 'success');
        // İlan ID'si ile doping sayfasına git
        router.push(`/ilan-ver/doping?adId=${res.adId}`);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-[800px] mx-auto py-8 px-4">
      <h1 className="text-xl font-bold text-[#333] mb-4">İlan Oluştur: {category.toUpperCase()}</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-sm border border-gray-200 rounded-sm space-y-6">

        {/* 1. Temel Bilgiler */}
        <div>
            <h3 className="font-bold text-sm text-gray-700 mb-3 border-b pb-1">Temel Bilgiler</h3>
            <div className="space-y-4">
                <div>
                    <label className="block text-xs font-bold mb-1">İlan Başlığı</label>
                    <input name="title" onChange={handleInputChange} className="w-full border border-gray-300 p-2 rounded-sm outline-none focus:border-blue-500" required placeholder="Örn: Sahibinden temiz aile aracı" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold mb-1">Fiyat</label>
                        <input name="price" type="number" onChange={handleInputChange} className="w-full border border-gray-300 p-2 rounded-sm outline-none focus:border-blue-500" required />
                    </div>
                    <div>
                        <label className="block text-xs font-bold mb-1">Para Birimi</label>
                        <select name="currency" onChange={handleInputChange} className="w-full border border-gray-300 p-2 rounded-sm bg-white outline-none">
                            <option>TL</option><option>USD</option><option>EUR</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>

        {/* 2. Kategori Özellikleri */}
        {category === 'emlak' && <RealEstateFields data={formData} onChange={handleDynamicChange} />}
        {category === 'vasita' && <VehicleFields data={formData} onChange={handleDynamicChange} />}

        {/* 3. Fotoğraflar (YENİ BİLEŞEN) */}
        <div>
            <h3 className="font-bold text-sm text-gray-700 mb-3 border-b pb-1">Fotoğraflar</h3>
            <ImageUploader onImagesChange={setImages} />
        </div>

        {/* 4. Açıklama ve Adres */}
        <div>
            <h3 className="font-bold text-sm text-gray-700 mb-3 border-b pb-1">Detaylar</h3>
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold mb-1">İl</label>
                        <select name="city" onChange={handleInputChange} className="w-full border border-gray-300 p-2 rounded-sm bg-white outline-none">
                            <option value="">Seçiniz</option>
                            <option value="İstanbul">İstanbul</option>
                            <option value="Ankara">Ankara</option>
                            <option value="İzmir">İzmir</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold mb-1">İlçe</label>
                        <input name="district" onChange={handleInputChange} className="w-full border border-gray-300 p-2 rounded-sm outline-none" placeholder="Örn: Kadıköy"/>
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold mb-1">Açıklama</label>
                    <textarea name="description" onChange={handleInputChange} className="w-full border border-gray-300 p-2 rounded-sm h-32 resize-none focus:border-blue-500 outline-none" required placeholder="İlanınızla ilgili detaylı bilgi verin..."></textarea>
                </div>
            </div>
        </div>

        <button disabled={isSubmitting} className="w-full bg-[#ffe800] py-3 font-bold text-sm rounded-sm hover:bg-yellow-400 disabled:opacity-50 flex items-center justify-center gap-2">
            {isSubmitting ? <><Loader2 className="animate-spin" size={18}/> Kaydediliyor...</> : 'Devam Et'}
        </button>

      </form>
    </div>
  );
}

export default function PostAdPage() {
    return <Suspense fallback={<div className="p-10 text-center">Yükleniyor...</div>}><PostAdFormContent /></Suspense>
}