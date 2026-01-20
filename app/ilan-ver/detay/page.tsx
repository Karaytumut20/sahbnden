
"use client";
import React, { useState, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Upload, X, ArrowLeft, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import RealEstateFields from '@/components/form/RealEstateFields';
import VehicleFields from '@/components/form/VehicleFields';
import { createAd } from '@/lib/services';
import { uploadImage } from '@/lib/upload';

function PostAdFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  const { user } = useAuth();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const category = searchParams.get('cat') || 'genel';
  const subCategory = searchParams.get('sub') || 'Genel';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const [formData, setFormData] = useState<any>({
    title: '', price: '', currency: 'TL', description: '',
    m2: '', room: '', floor: '', heating: '',
    brand: '', year: '', km: '', gear: '', fuel: '', status: ''
  });

  const handleInputChange = (e: any) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleDynamicChange = (name: string, value: string) => setFormData({ ...formData, [name]: value });

  // Dosya Seçme Tetikleyici
  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Gerçek Resim Yükleme
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;

    setIsUploading(true);
    const file = e.target.files[0];

    try {
      const publicUrl = await uploadImage(file);
      setImages([...images, publicUrl]);
      addToast('Fotoğraf yüklendi.', 'success');
    } catch (error) {
      addToast('Fotoğraf yüklenirken hata oluştu.', 'error');
    } finally {
      setIsUploading(false);
      // Inputu temizle ki aynı dosyayı tekrar seçebilsin
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      addToast('Oturum açmalısınız.', 'error');
      router.push('/login');
      return;
    }
    if (!formData.title || !formData.price) {
      addToast('Zorunlu alanları doldurunuz.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const newAdData = {
        user_id: user.id,
        title: formData.title,
        price: parseFloat(formData.price),
        currency: formData.currency,
        description: formData.description,
        category: category,
        image: images[0] || null, // Kapak resmi
        status: 'onay_bekliyor',
        city: 'İstanbul', district: 'Merkez',
        ...formData
      };

      // Sayısal dönüşümler
      if(newAdData.price) newAdData.price = Number(newAdData.price);
      if(newAdData.year) newAdData.year = Number(newAdData.year);
      if(newAdData.km) newAdData.km = Number(newAdData.km);
      if(newAdData.m2) newAdData.m2 = Number(newAdData.m2);
      if(newAdData.floor) newAdData.floor = Number(newAdData.floor);

      const { error } = await createAd(newAdData);
      if (error) throw error;

      addToast('İlan onaya gönderildi!', 'success');
      router.push('/bana-ozel/ilanlarim');
    } catch (error: any) {
      addToast('Hata: ' + error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-[800px] mx-auto py-8 px-4">
      <button onClick={() => router.back()} className="text-gray-500 text-sm flex items-center gap-1 mb-4 hover:text-blue-700">
        <ArrowLeft size={16} /> Kategori Seçimine Dön
      </button>

      <h1 className="text-xl font-bold text-[#333] mb-2">Adım 2: İlan Detayları</h1>

      <div className="bg-white border border-gray-200 shadow-sm p-6 rounded-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h3 className="font-bold text-[#333] text-sm border-b border-gray-200 pb-2">Temel Bilgiler</h3>
            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">İlan Başlığı</label>
              <input type="text" name="title" onChange={handleInputChange} className="w-full border border-gray-300 rounded-sm h-10 px-3 outline-none" placeholder="Örn: Sahibinden temiz" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">Fiyat</label>
                <input type="number" name="price" onChange={handleInputChange} className="w-full border border-gray-300 rounded-sm h-10 px-3 outline-none" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">Para Birimi</label>
                <select name="currency" onChange={handleInputChange} className="w-full border border-gray-300 rounded-sm h-10 px-3 bg-white">
                  <option>TL</option><option>USD</option><option>EUR</option>
                </select>
              </div>
            </div>
          </div>

          {category === 'emlak' && <RealEstateFields data={formData} onChange={handleDynamicChange} />}
          {category === 'vasita' && <VehicleFields data={formData} onChange={handleDynamicChange} />}

          {/* FOTOĞRAF YÜKLEME ALANI */}
          <div>
            <label className="block text-[13px] font-bold text-[#333] mb-2">Fotoğraflar</label>

            {/* Gizli Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />

            <div
              className={`border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-100 transition-colors ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
              onClick={triggerFileSelect}
            >
              {isUploading ? (
                <Loader2 className="animate-spin text-blue-600 mb-2" size={24} />
              ) : (
                <div className="bg-blue-100 p-3 rounded-full mb-3 text-blue-600"><Upload size={24} /></div>
              )}
              <p className="text-sm font-semibold text-blue-900">
                {isUploading ? 'Yükleniyor...' : 'Fotoğraf Yüklemek İçin Tıklayın'}
              </p>
            </div>

            {/* Önizleme */}
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group aspect-[4/3] border border-gray-200 rounded-md overflow-hidden bg-gray-100">
                    <img src={img} alt="Yüklenen" className="w-full h-full object-cover" />
                    <button type="button" onClick={(e) => { e.stopPropagation(); removeImage(idx); }} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={12} /></button>
                    {idx === 0 && <span className="absolute bottom-0 left-0 bg-blue-600 text-white text-[10px] px-2 py-0.5">Kapak</span>}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-[13px] font-bold text-[#333] mb-1">Açıklama</label>
            <textarea name="description" onChange={handleInputChange} className="w-full border border-gray-300 rounded-sm h-32 p-3 outline-none resize-none"></textarea>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button type="submit" disabled={isSubmitting || isUploading} className="bg-[#ffe800] text-black font-bold py-3 px-8 rounded-sm text-sm shadow-sm hover:bg-yellow-400 disabled:opacity-50">
              {isSubmitting ? 'Kaydediliyor...' : 'İlanı Onaya Gönder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function PostAdDetail() {
  return <Suspense fallback={<div className="p-10 text-center">Yükleniyor...</div>}><PostAdFormContent /></Suspense>;
}
