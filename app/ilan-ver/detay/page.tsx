"use client";
import React, { useState, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Upload, X, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import RealEstateFields from '@/components/form/RealEstateFields';
import VehicleFields from '@/components/form/VehicleFields';
import { createAd } from '@/lib/services'; // Client service kullanıyoruz (ID döner)
import { uploadImageClient } from '@/lib/services';

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
  const [formData, setFormData] = useState<any>({
    title: '', price: '', currency: 'TL', description: '',
    m2: '', room: '', floor: '', heating: '',
    brand: '', year: '', km: '', gear: '', fuel: '', status: ''
  });

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
    if (!formData.title || !formData.price) { addToast('Zorunlu alanları doldurunuz.', 'error'); return; }

    setIsSubmitting(true);

    const newAdData = {
      user_id: user.id,
      title: formData.title,
      price: parseFloat(formData.price),
      currency: formData.currency,
      description: formData.description,
      category: category,
      image: images[0] || null,
      city: 'İstanbul', district: 'Merkez',
      status: 'odeme_bekliyor', // Önce ödeme bekliyor olsun
      ...formData
    };

    if(newAdData.price) newAdData.price = Number(newAdData.price);
    if(newAdData.year) newAdData.year = Number(newAdData.year);
    if(newAdData.km) newAdData.km = Number(newAdData.km);
    if(newAdData.m2) newAdData.m2 = Number(newAdData.m2);
    if(newAdData.floor) newAdData.floor = Number(newAdData.floor);

    const { data, error } = await createAd(newAdData);

    if (error) {
      addToast('Hata: ' + error.message, 'error');
    } else if (data && data.length > 0) {
      addToast('İlan oluşturuldu, doping seçimine geçiliyor...', 'success');
      // ID ile yönlendir
      router.push(`/ilan-ver/doping?adId=${data[0].id}`);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-[800px] mx-auto py-8 px-4">
      <h1 className="text-xl font-bold text-[#333] mb-4">İlan Detayları</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-sm border border-gray-200 rounded-sm space-y-6">
        <div className="space-y-4">
            <h3 className="font-bold text-[#333] text-sm border-b border-gray-200 pb-2">Temel Bilgiler</h3>
            <div><label className="block text-xs font-bold mb-1">Başlık</label><input name="title" onChange={handleInputChange} className="w-full border p-2 rounded-sm outline-none" required /></div>
            <div className="grid grid-cols-2 gap-4">
                 <div><label className="block text-xs font-bold mb-1">Fiyat</label><input name="price" type="number" onChange={handleInputChange} className="w-full border p-2 rounded-sm outline-none" required /></div>
                 <div><label className="block text-xs font-bold mb-1">Para Birimi</label><select name="currency" onChange={handleInputChange} className="w-full border p-2 rounded-sm bg-white"><option>TL</option><option>USD</option><option>EUR</option></select></div>
            </div>
        </div>
        {category === 'emlak' && <RealEstateFields data={formData} onChange={handleDynamicChange} />}
        {category === 'vasita' && <VehicleFields data={formData} onChange={handleDynamicChange} />}
        <div className="border-2 border-dashed p-6 text-center cursor-pointer hover:bg-gray-50" onClick={() => fileInputRef.current?.click()}>
            {isUploading ? <Loader2 className="animate-spin mx-auto"/> : <Upload className="mx-auto text-gray-400"/>}
            <span className="text-xs text-gray-500 block mt-2">Fotoğraf Yükle</span>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
        </div>
        {images.length > 0 && <div className="flex gap-2">{images.map((img, i) => <img key={i} src={img} className="w-20 h-20 object-cover border rounded"/>)}</div>}
        <div><label className="block text-xs font-bold mb-1">Açıklama</label><textarea name="description" onChange={handleInputChange} className="w-full border p-2 rounded-sm h-32 resize-none" required></textarea></div>
        <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button type="submit" disabled={isSubmitting} className="bg-[#ffe800] text-black font-bold py-3 px-8 rounded-sm text-sm shadow-sm hover:bg-yellow-400 disabled:opacity-50">
              {isSubmitting ? 'Kaydediliyor...' : 'Devam Et'}
            </button>
        </div>
      </form>
    </div>
  );
}

export default function PostAdDetail() {
    return <Suspense fallback={<div>Yükleniyor...</div>}><PostAdFormContent /></Suspense>
}