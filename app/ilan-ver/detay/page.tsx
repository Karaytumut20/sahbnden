"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import RealEstateFields from '@/components/form/RealEstateFields';
import VehicleFields from '@/components/form/VehicleFields';
import ImageUploader from '@/components/ui/ImageUploader';
import { createAdAction } from '@/lib/actions';
import { adSchema } from '@/lib/schemas'; // Zod şeması
import { cities, getDistricts } from '@/lib/locations';

function PostAdFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  const { user } = useAuth();

  const categorySlug = searchParams.get('cat') || '';
  const categoryPath = searchParams.get('path') || 'Kategori Seçilmedi';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [districts, setDistricts] = useState<string[]>([]);

  const [formData, setFormData] = useState<any>({
    title: '', description: '', price: '', currency: 'TL', city: '', district: '',
    m2: '', room: '', floor: '', heating: '',
    brand: '', year: '', km: '', gear: '', fuel: ''
  });

  const isRealEstate = categorySlug.includes('konut') || categorySlug.includes('isyeri') || categorySlug.includes('arsa');
  const isVehicle = categorySlug.includes('otomobil') || categorySlug.includes('suv') || categorySlug.includes('moto');

  useEffect(() => {
    if (formData.city) {
      setDistricts(getDistricts(formData.city));
      setFormData(prev => ({ ...prev, district: '' }));
    }
  }, [formData.city]);

  const handleInputChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
        const newErrors = { ...errors };
        delete newErrors[e.target.name];
        setErrors(newErrors);
    }
  };

  const handleDynamicChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { router.push('/login'); return; }

    // 1. Veri Hazırlığı
    const rawData = {
        ...formData,
        category: categorySlug,
        image: images[0] || null,
        price: Number(formData.price),
        year: isVehicle || isRealEstate ? Number(formData.year) : undefined,
        km: isVehicle ? Number(formData.km) : undefined,
        m2: isRealEstate ? Number(formData.m2) : undefined,
        floor: isRealEstate ? Number(formData.floor) : undefined,
    };

    // 2. Client-Side Validasyon (ZOD)
    const result = adSchema.safeParse(rawData);

    if (!result.success) {
        const fieldErrors: any = {};
        result.error.issues.forEach(issue => {
            fieldErrors[issue.path[0]] = issue.message;
        });
        setErrors(fieldErrors);
        addToast('Lütfen hatalı alanları düzeltiniz.', 'error');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    setIsSubmitting(true);

    // 3. Server Action Çağrısı
    const res = await createAdAction(rawData);

    if (res.error) {
        addToast(res.error, 'error');
    } else {
        addToast('İlan başarıyla oluşturuldu!', 'success');
        router.push(`/ilan-ver/doping?adId=${res.adId}`);
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

        {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-sm text-red-700 text-sm flex items-start gap-2">
                <AlertCircle size={18} className="mt-0.5 shrink-0"/>
                <div>
                    <p className="font-bold">Lütfen aşağıdaki alanları kontrol ediniz:</p>
                    <ul className="list-disc pl-4 mt-1 space-y-1 text-xs">
                        {Object.values(errors).map((err, i) => <li key={i}>{err}</li>)}
                    </ul>
                </div>
            </div>
        )}

        <section>
            <h3 className="font-bold text-sm text-[#333] mb-4 border-b pb-2 flex items-center gap-2">
                <span className="bg-blue-600 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs">1</span> İlan Detayları
            </h3>
            <div className="space-y-4 px-2">
                <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">İlan Başlığı <span className="text-red-500">*</span></label>
                    <input name="title" onChange={handleInputChange} className={`w-full border ${errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'} h-10 px-3 rounded-sm outline-none focus:border-blue-500 text-sm`} placeholder="Örn: Sahibinden temiz aile evi" />
                </div>
                <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">Açıklama <span className="text-red-500">*</span></label>
                    <textarea name="description" onChange={handleInputChange} className={`w-full border ${errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'} p-3 rounded-sm h-32 resize-none focus:border-blue-500 outline-none text-sm`} placeholder="İlan detayları..."></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">Fiyat <span className="text-red-500">*</span></label>
                        <input name="price" type="number" onChange={handleInputChange} className={`w-full border ${errors.price ? 'border-red-500 bg-red-50' : 'border-gray-300'} h-10 px-3 rounded-sm outline-none focus:border-blue-500 text-sm`} placeholder="0" />
                    </div>
                    <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">Para Birimi</label>
                        <select name="currency" onChange={handleInputChange} className="w-full border border-gray-300 h-10 px-3 rounded-sm bg-white outline-none text-sm"><option>TL</option><option>USD</option><option>EUR</option></select>
                    </div>
                </div>
            </div>
        </section>

        {(isRealEstate || isVehicle) && (
            <section>
                <h3 className="font-bold text-sm text-[#333] mb-4 border-b pb-2 flex items-center gap-2">
                    <span className="bg-blue-600 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs">2</span> Özellikler
                </h3>
                <div className="px-2">
                    {isRealEstate && <RealEstateFields data={formData} onChange={handleDynamicChange} />}
                    {isVehicle && <VehicleFields data={formData} onChange={handleDynamicChange} />}
                </div>
            </section>
        )}

        <section>
            <h3 className="font-bold text-sm text-[#333] mb-4 border-b pb-2 flex items-center gap-2">
                <span className="bg-blue-600 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs">3</span> Fotoğraflar
            </h3>
            <div className="px-2"><ImageUploader onImagesChange={setImages} /></div>
        </section>

        <section>
            <h3 className="font-bold text-sm text-[#333] mb-4 border-b pb-2 flex items-center gap-2">
                <span className="bg-blue-600 text-white w-5 h-5 flex items-center justify-center rounded-full text-xs">4</span> Adres Bilgileri
            </h3>
            <div className="px-2 grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">İl <span className="text-red-500">*</span></label>
                    <select name="city" onChange={handleInputChange} className={`w-full border ${errors.city ? 'border-red-500 bg-red-50' : 'border-gray-300'} h-10 px-3 rounded-sm bg-white outline-none text-sm`}>
                        <option value="">Seçiniz</option>
                        {cities.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">İlçe <span className="text-red-500">*</span></label>
                    <select name="district" value={formData.district} onChange={handleInputChange} className={`w-full border ${errors.district ? 'border-red-500 bg-red-50' : 'border-gray-300'} h-10 px-3 rounded-sm bg-white outline-none text-sm`} disabled={!formData.city}>
                        <option value="">Seçiniz</option>
                        {districts.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                </div>
            </div>
        </section>

        <div className="pt-4 flex items-center gap-4">
            <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-gray-300 rounded-sm font-bold text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2"><ArrowLeft size={16}/> Geri Dön</button>
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