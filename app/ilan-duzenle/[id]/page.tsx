"use client";
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Upload, X, ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import RealEstateFields from '@/components/form/RealEstateFields';
import VehicleFields from '@/components/form/VehicleFields';
import { getAdDetailServer, updateAdAction } from '@/lib/actions';
import { uploadImageClient } from '@/lib/services';

function EditAdFormContent() {
  const router = useRouter();
  const params = useParams();
  const { addToast } = useToast();
  const { user } = useAuth();
  const fileInputRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({});
  const [category, setCategory] = useState('');

  useEffect(() => {
    const fetchAd = async () => {
        if(!params.id) return;

        try {
            const ad = await getAdDetailServer(Number(params.id));
            if (!ad) {
                addToast('İlan bulunamadı.', 'error');
                router.push('/bana-ozel/ilanlarim');
                return;
            }

            if (user && ad.user_id !== user.id) {
                 addToast('Bu ilanı düzenleyemezsiniz.', 'error');
                 router.push('/');
                 return;
            }

            setCategory(ad.category);
            setImages(ad.image ? [ad.image] : []);
            setFormData({
                title: ad.title,
                price: ad.price,
                currency: ad.currency,
                description: ad.description,
                m2: ad.m2,
                room: ad.room,
                floor: ad.floor,
                heating: ad.heating,
                brand: ad.brand,
                year: ad.year,
                km: ad.km,
                gear: ad.gear,
                fuel: ad.fuel,
                status: ad.status_vehicle
            });
        } catch (e) {
            console.error(e);
            addToast('Veri yüklenirken hata oluştu.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    if(user) fetchAd();
  }, [user, params.id]);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleDynamicChange = (name, value) => setFormData({ ...formData, [name]: value });

  const handleFileChange = async (e) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

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

    const res = await updateAdAction(Number(params.id), finalData);

    if (res.error) {
        addToast(res.error, 'error');
    } else {
        addToast('İlan güncellendi ve onaya gönderildi.', 'success');
        router.push('/bana-ozel/ilanlarim');
    }
    setIsSubmitting(false);
  };

  if (isLoading) return <div className="p-20 text-center flex justify-center"><Loader2 className="animate-spin mr-2"/> İlan bilgileri yükleniyor...</div>;

  return (
    <div className="max-w-[800px] mx-auto py-8 px-4">
      <div className="flex items-center gap-2 mb-6 border-b pb-2">
        <button onClick={() => router.back()} className="text-gray-500 hover:text-blue-700"><ArrowLeft size={20} /></button>
        <h1 className="text-xl font-bold text-[#333]">İlanı Düzenle: {formData.title}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 shadow-sm border border-gray-200 rounded-sm space-y-6">

        <div>
            <label className="block text-xs font-bold mb-1">Başlık</label>
            <input name="title" value={formData.title} onChange={handleInputChange} className="w-full border p-2 rounded-sm outline-none" required />
        </div>
        <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold mb-1">Fiyat</label>
                <input name="price" type="number" value={formData.price} onChange={handleInputChange} className="w-full border p-2 rounded-sm outline-none" required />
             </div>
             <div>
                <label className="block text-xs font-bold mb-1">Para Birimi</label>
                <select name="currency" value={formData.currency} onChange={handleInputChange} className="w-full border p-2 rounded-sm bg-white">
                    <option>TL</option><option>USD</option><option>EUR</option>
                </select>
             </div>
        </div>

        {category === 'emlak' && <RealEstateFields data={formData} onChange={handleDynamicChange} />}
        {category === 'vasita' && <VehicleFields data={formData} onChange={handleDynamicChange} />}

        <div>
            <label className="block text-xs font-bold mb-2">Fotoğraflar</label>
            <div className="flex flex-wrap gap-4">
                {images.map((img, i) => (
                    <div key={i} className="relative group w-24 h-24 border rounded overflow-hidden">
                        <img src={img} className="w-full h-full object-cover"/>
                        <button type="button" onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute top-0 right-0 bg-red-500 text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"><X size={12}/></button>
                    </div>
                ))}
                <div className="w-24 h-24 border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 rounded" onClick={() => fileInputRef.current?.click()}>
                    {isUploading ? <Loader2 className="animate-spin text-blue-600"/> : <Upload className="text-gray-400"/>}
                    <span className="text-[10px] text-gray-500 mt-1">Ekle</span>
                </div>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
        </div>

        <div>
            <label className="block text-xs font-bold mb-1">Açıklama</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full border p-2 rounded-sm h-32 resize-none" required></textarea>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-gray-300 rounded-sm text-sm font-bold text-gray-600 hover:bg-gray-50">İptal</button>
            <button type="submit" disabled={isSubmitting} className="px-8 py-3 bg-[#ffe800] rounded-sm text-sm font-bold text-black hover:bg-yellow-400 flex items-center gap-2 disabled:opacity-50">
                {isSubmitting ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>} Güncelle
            </button>
        </div>

      </form>
    </div>
  );
}

export default function EditAdPage() {
    return (
        <Suspense fallback={<div className="p-20 text-center">Yükleniyor...</div>}>
            <EditAdFormContent />
        </Suspense>
    );
}