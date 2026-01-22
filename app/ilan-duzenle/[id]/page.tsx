"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { getAdDetailServer, updateAdAction } from '@/lib/actions';
import ImageUploader from '@/components/ui/ImageUploader';
import RealEstateFields from '@/components/form/RealEstateFields';
import VehicleFields from '@/components/form/VehicleFields';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

function EditAdContent({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { addToast } = useToast();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [images, setImages] = useState<string[]>([]);
  const [adId, setAdId] = useState<number | null>(null);

  useEffect(() => {
    async function loadData() {
        if(!user) return;

        try {
            const { id } = await params;
            const ad = await getAdDetailServer(Number(id));

            if (!ad) {
                addToast('İlan bulunamadı.', 'error');
                router.push('/bana-ozel/ilanlarim');
                return;
            }

            if (ad.user_id !== user.id) {
                addToast('Bu ilanı düzenleme yetkiniz yok.', 'error');
                router.push('/');
                return;
            }

            setFormData(ad);
            setImages(ad.image ? [ad.image] : []); // Tek resim desteği şimdilik
            setAdId(ad.id);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }
    loadData();
  }, [user, params]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleDynamicChange = (name: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adId) return;
    setSaving(true);

    const updateData = {
        ...formData,
        image: images[0] || null,
        price: Number(formData.price),
        year: Number(formData.year) || null,
        km: Number(formData.km) || null,
        m2: Number(formData.m2) || null,
    };

    const res = await updateAdAction(adId, updateData);

    if (res.error) {
        addToast(res.error, 'error');
    } else {
        addToast('İlan güncellendi ve onaya gönderildi.', 'success');
        router.push('/bana-ozel/ilanlarim');
    }
    setSaving(false);
  };

  if (loading) return <div className="p-20 text-center flex justify-center"><Loader2 className="animate-spin text-blue-600"/></div>;

  const isRealEstate = formData.category?.includes('konut') || formData.category?.includes('isyeri');
  const isVehicle = formData.category?.includes('otomobil') || formData.category?.includes('suv');

  return (
    <div className="max-w-[800px] mx-auto py-8 px-4">
        <div className="flex items-center gap-4 mb-6 border-b border-gray-200 pb-4">
            <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700"><ArrowLeft size={20}/></button>
            <h1 className="text-xl font-bold text-gray-800">İlanı Düzenle: {formData.title}</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-6 shadow-sm border border-gray-200 rounded-sm space-y-8">

            <section className="space-y-4">
                <Input label="İlan Başlığı" name="title" value={formData.title} onChange={handleInputChange} required />
                <Textarea label="Açıklama" name="description" value={formData.description} onChange={handleInputChange} className="h-32" required />
                <div className="grid grid-cols-2 gap-4">
                    <Input label="Fiyat" name="price" type="number" value={formData.price} onChange={handleInputChange} required />
                    <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">Para Birimi</label>
                        <select name="currency" value={formData.currency} onChange={handleInputChange} className="w-full border border-gray-300 h-10 px-3 rounded-sm bg-white outline-none text-sm">
                            <option>TL</option><option>USD</option><option>EUR</option>
                        </select>
                    </div>
                </div>
            </section>

            {(isRealEstate || isVehicle) && (
                <section>
                    <h3 className="font-bold text-sm text-[#333] mb-4 border-b pb-2">Özellikler</h3>
                    <div className="px-2">
                        {isRealEstate && <RealEstateFields data={formData} onChange={handleDynamicChange} />}
                        {isVehicle && <VehicleFields data={formData} onChange={handleDynamicChange} />}
                    </div>
                </section>
            )}

            <section>
                <h3 className="font-bold text-sm text-[#333] mb-4 border-b pb-2">Fotoğraflar</h3>
                <div className="px-2"><ImageUploader onImagesChange={setImages} initialImages={images} /></div>
            </section>

            <section>
                <h3 className="font-bold text-sm text-[#333] mb-4 border-b pb-2">Konum</h3>
                <div className="grid grid-cols-2 gap-4 px-2">
                    <Input label="İl" name="city" value={formData.city} onChange={handleInputChange} />
                    <Input label="İlçe" name="district" value={formData.district} onChange={handleInputChange} />
                </div>
            </section>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={saving}
                    className="bg-[#ffe800] text-black px-8 py-3 rounded-sm font-bold hover:bg-yellow-400 disabled:opacity-50 flex items-center gap-2"
                >
                    {saving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
                    Değişiklikleri Kaydet
                </button>
            </div>
        </form>
    </div>
  );
}

export default function EditAdPage({ params }: { params: Promise<{ id: string }> }) {
    return <Suspense fallback={<div>Yükleniyor...</div>}><EditAdContent params={params} /></Suspense>
}