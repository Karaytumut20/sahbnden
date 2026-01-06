
"use client";
import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Upload, X, ArrowLeft, AlertCircle } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import RealEstateFields from '@/components/form/RealEstateFields';
import VehicleFields from '@/components/form/VehicleFields';

// Suspense Wrapper Bileşeni
function PostAdFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();

  const category = searchParams.get('cat') || 'genel';
  const subCategory = searchParams.get('sub') || 'Genel';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  // Form Verileri
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    currency: 'TL',
    description: '',
    // Dinamik Alanlar İçin
    ...((category === 'emlak') ? { m2: '', room: '', floor: '', heating: '' } : {}),
    ...((category === 'vasita') ? { brand: '', year: '', km: '', gear: '', fuel: '', status: '' } : {}),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Alt bileşenlerden gelen değişiklikleri işlemek için
  const handleDynamicChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = () => {
    const newImage = `https://picsum.photos/seed/${Date.now()}/300/200`;
    setImages([...images, newImage]);
    addToast('Fotoğraf eklendi', 'success');
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basit Validasyon
    if (!formData.title || !formData.price || !formData.description) {
      addToast('Lütfen temel alanları (Başlık, Fiyat, Açıklama) doldurunuz.', 'error');
      return;
    }

    if (category === 'emlak' && (!formData.m2 || !formData.room)) {
      addToast('Lütfen zorunlu emlak özelliklerini doldurunuz.', 'error');
      return;
    }

    if (category === 'vasita' && (!formData.brand || !formData.km)) {
      addToast('Lütfen zorunlu araç özelliklerini doldurunuz.', 'error');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      addToast('İlan bilgileri kaydedildi, doping seçimine yönlendiriliyorsunuz...', 'info');
      // Verileri state manager veya URL ile taşıyabiliriz, şimdilik demo
      router.push('/ilan-ver/doping');
    }, 1000);
  };

  return (
    <div className="max-w-[800px] mx-auto py-8 px-4">
      <button onClick={() => router.back()} className="text-gray-500 text-sm flex items-center gap-1 mb-4 hover:text-blue-700">
        <ArrowLeft size={16} /> Kategori Seçimine Dön
      </button>

      <h1 className="text-xl font-bold text-[#333] mb-2">Adım 2: İlan Detayları</h1>
      <p className="text-sm text-gray-500 mb-6 bg-blue-50 p-2 border border-blue-100 rounded flex items-center gap-2">
        <AlertCircle size={16} className="text-blue-600"/>
        Seçilen Kategori: <span className="font-bold text-blue-800">{category.toUpperCase()} &gt; {subCategory}</span>
      </p>

      <div className="bg-white border border-gray-200 shadow-sm p-6 rounded-sm">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* TEMEL BİLGİLER */}
          <div className="space-y-4">
            <h3 className="font-bold text-[#333] text-sm border-b border-gray-200 pb-2">Temel Bilgiler</h3>

            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">İlan Başlığı <span className="text-red-500">*</span></label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-sm h-10 px-3 focus:border-blue-500 focus:outline-none"
                placeholder="Örn: Sahibinden temiz, masrafsız"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">Fiyat <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-sm h-10 px-3 focus:border-blue-500 focus:outline-none"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">Para Birimi</label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-sm h-10 px-3 bg-white"
                >
                  <option>TL</option>
                  <option>USD</option>
                  <option>EUR</option>
                </select>
              </div>
            </div>
          </div>

          {/* DİNAMİK ALANLAR */}
          {category === 'emlak' && (
            <RealEstateFields data={formData} onChange={handleDynamicChange} />
          )}

          {category === 'vasita' && (
            <VehicleFields data={formData} onChange={handleDynamicChange} />
          )}

          {/* FOTOĞRAFLAR */}
          <div>
            <label className="block text-[13px] font-bold text-[#333] mb-2">Fotoğraflar</label>
            <div className="border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-100 transition-colors" onClick={handleImageUpload}>
              <div className="bg-blue-100 p-3 rounded-full mb-3 text-blue-600">
                <Upload size={24} />
              </div>
              <p className="text-sm font-semibold text-blue-900">Fotoğraf Yüklemek İçin Tıklayın</p>
            </div>
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group aspect-[4/3] border border-gray-200 rounded-md overflow-hidden">
                    <img src={img} alt="Yüklenen" className="w-full h-full object-cover" />
                    <button type="button" onClick={(e) => { e.stopPropagation(); removeImage(idx); }} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AÇIKLAMA */}
          <div>
            <label className="block text-[13px] font-bold text-[#333] mb-1">Açıklama <span className="text-red-500">*</span></label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-sm h-32 p-3 focus:border-blue-500 focus:outline-none resize-none"
              placeholder="İlanınızla ilgili detaylı bilgileri buraya yazınız..."
            ></textarea>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`bg-[#ffe800] hover:bg-yellow-400 text-black font-bold py-3 px-8 rounded-sm transition-colors text-sm shadow-sm flex items-center gap-2 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? 'İşleniyor...' : 'Devam Et'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default function PostAdDetail() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Yükleniyor...</div>}>
      <PostAdFormContent />
    </Suspense>
  );
}
