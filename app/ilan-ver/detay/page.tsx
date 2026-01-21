"use client";
import React, { useState, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Upload, X, ArrowLeft, Loader2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import RealEstateFields from '@/components/form/RealEstateFields';
import VehicleFields from '@/components/form/VehicleFields';
import { createAdAction } from '@/lib/actions'; // Server Action import
import { uploadImageClient } from '@/lib/services'; // Client service

function PostAdFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const category = searchParams.get('cat') || 'genel';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState<any>({});

  const handleInputChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleDynamicChange = (name: string, value: string) => setFormData({ ...formData, [name]: value });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setIsUploading(true);
    try {
        const url = await uploadImageClient(e.target.files[0]);
        setImages([...images, url]);
        addToast('Resim yüklendi', 'success');
    } catch(e) {
        addToast('Resim yükleme hatası', 'error');
    } finally {
        setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { router.push('/login'); return; }

    setIsSubmitting(true);

    // Veriyi hazırla
    const finalData = {
        ...formData,
        category,
        image: images[0] || null,
        price: Number(formData.price),
        year: Number(formData.year),
        km: Number(formData.km),
        m2: Number(formData.m2),
        floor: Number(formData.floor)
    };

    const res = await createAdAction(finalData); // Server Action Çağır

    if (res.error) {
        addToast(res.error, 'error');
    } else {
        addToast('İlan başarıyla oluşturuldu! Onay bekleniyor.', 'success');
        router.push('/bana-ozel/ilanlarim');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-[800px] mx-auto py-8 px-4">
      <h1 className="text-xl font-bold text-[#333] mb-4">İlan Oluştur: {category.toUpperCase()}</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-sm border border-gray-200 rounded-sm space-y-6">

        {/* Temel Alanlar */}
        <div>
            <label className="block text-xs font-bold mb-1">Başlık</label>
            <input name="title" onChange={handleInputChange} className="w-full border p-2 rounded-sm outline-none" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold mb-1">Fiyat</label>
                <input name="price" type="number" onChange={handleInputChange} className="w-full border p-2 rounded-sm outline-none" required />
             </div>
             <div>
                <label className="block text-xs font-bold mb-1">Para Birimi</label>
                <select name="currency" onChange={handleInputChange} className="w-full border p-2 rounded-sm bg-white">
                    <option>TL</option><option>USD</option><option>EUR</option>
                </select>
             </div>
        </div>

        {/* Dinamik Alanlar */}
        {category === 'emlak' && <RealEstateFields data={formData} onChange={handleDynamicChange} />}
        {category === 'vasita' && <VehicleFields data={formData} onChange={handleDynamicChange} />}

        {/* Resim Yükleme */}
        <div className="border-2 border-dashed p-6 text-center cursor-pointer hover:bg-gray-50" onClick={() => fileInputRef.current?.click()}>
            {isUploading ? <Loader2 className="animate-spin mx-auto"/> : <Upload className="mx-auto text-gray-400"/>}
            <span className="text-xs text-gray-500 block mt-2">Fotoğraf Yükle</span>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
        </div>
        {images.length > 0 && (
            <div className="flex gap-2">
                {images.map((img, i) => <img key={i} src={img} className="w-20 h-20 object-cover border rounded"/>)}
            </div>
        )}

        <div>
            <label className="block text-xs font-bold mb-1">Açıklama</label>
            <textarea name="description" onChange={handleInputChange} className="w-full border p-2 rounded-sm h-32 resize-none" required></textarea>
        </div>

        <button disabled={isSubmitting} className="w-full bg-[#ffe800] py-3 font-bold text-sm rounded-sm hover:bg-yellow-400 disabled:opacity-50">
            {isSubmitting ? 'Kaydediliyor...' : 'İlanı Yayınla'}
        </button>

      </form>
    </div>
  );
}

export default function PostAdPage() {
    return <Suspense fallback={<div>Yükleniyor...</div>}><PostAdFormContent /></Suspense>
}