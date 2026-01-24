"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { createStoreAction, updateStoreAction, getMyStoreServer } from '@/lib/actions';
import { uploadImageClient } from '@/lib/services';
import { Store, Save, Upload, ExternalLink, Loader2, Image as ImageIcon } from 'lucide-react';

export default function MyStorePage() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [store, setStore] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    phone: '',
    location: '',
    website: '',
    image: '',
    banner: ''
  });

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchStore = async () => {
      const data = await getMyStoreServer();
      if (data) {
        setStore(data);
        setFormData({
          name: data.name || '',
          slug: data.slug || '',
          description: data.description || '',
          phone: data.phone || '',
          location: data.location || '',
          website: data.website || '',
          image: data.image || '',
          banner: data.banner || ''
        });
      }
      setLoading(false);
    };
    fetchStore();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'name' && !store) {
      setFormData(prev => ({
        ...prev,
        name: value,
        slug: value.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '')
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'banner') => {
    if (!e.target.files?.length) return;

    setSubmitting(true);
    try {
      const url = await uploadImageClient(e.target.files[0]);
      setFormData(prev => ({ ...prev, [field]: url }));
      addToast(field === 'image' ? 'Logo yüklendi.' : 'Kapak fotoğrafı yüklendi.', 'success');
    } catch {
      addToast('Yükleme başarısız.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    let res;
    if (store) {
      res = await updateStoreAction(formData);
    } else {
      res = await createStoreAction(formData);
    }

    if (res.error) {
      addToast(res.error, 'error');
    } else {
      addToast(store ? 'Mağaza güncellendi.' : 'Mağazanız başarıyla açıldı!', 'success');
      if (!store) window.location.reload();
    }
    setSubmitting(false);
  };

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-blue-600"/></div>;

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6">
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
        <h1 className="text-xl font-bold text-[#333] flex items-center gap-2">
          <Store size={24} className="text-blue-600" />
          {store ? 'Mağaza Yönetimi' : 'Mağaza Aç'}
        </h1>
        {store && (
          <Link href={`/magaza/${store.slug}`} target="_blank" className="flex items-center gap-1 text-sm text-blue-600 hover:underline font-medium">
            Mağazayı Görüntüle <ExternalLink size={14}/>
          </Link>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">

        <div className="space-y-4">
          <div
            className="w-full h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 relative overflow-hidden group"
            onClick={() => bannerInputRef.current?.click()}
          >
            {formData.banner ? (
              <img src={formData.banner} className="w-full h-full object-cover" />
            ) : (
              <div className="text-center text-gray-400">
                <ImageIcon size={24} className="mx-auto mb-1"/>
                <span className="text-xs">Kapak Fotoğrafı Ekle (1200x300)</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold">Değiştir</div>
            <input type="file" ref={bannerInputRef} onChange={(e) => handleImageUpload(e, 'banner')} className="hidden" accept="image/*" />
          </div>

          <div className="flex items-end gap-4 -mt-10 ml-4 relative z-10">
            <div
              className="w-24 h-24 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center cursor-pointer overflow-hidden relative group shadow-md"
              onClick={() => logoInputRef.current?.click()}
            >
              {formData.image ? (
                <img src={formData.image} className="w-full h-full object-cover" />
              ) : (
                <Upload size={20} className="text-gray-400"/>
              )}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px]">Logo</div>
              <input type="file" ref={logoInputRef} onChange={(e) => handleImageUpload(e, 'image')} className="hidden" accept="image/*" />
            </div>
            <div className="pb-2">
               <p className="text-xs text-gray-500">Kurumsal kimliğinizi yansıtan logo ve kapak görseli yükleyin.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Mağaza Adı</label>
            <input name="name" value={formData.name} onChange={handleInputChange} className="w-full border p-2 rounded-sm outline-none" required placeholder="Örn: Güven Emlak" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Mağaza Linki (Slug)</label>
            <input name="slug" value={formData.slug} onChange={handleInputChange} className="w-full border p-2 rounded-sm outline-none bg-gray-50 text-gray-500" required readOnly={!!store} />
            <p className="text-[10px] text-gray-400 mt-1">sahibinden-klon.com/magaza/{formData.slug || '...'}</p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Açıklama / Hakkımızda</label>
          <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full border p-2 rounded-sm outline-none h-24 resize-none" placeholder="Müşterilerinize kendinizden bahsedin..." required></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Telefon</label>
            <input name="phone" value={formData.phone} onChange={handleInputChange} className="w-full border p-2 rounded-sm outline-none" placeholder="0212..." />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Konum (İl / İlçe)</label>
            <input name="location" value={formData.location} onChange={handleInputChange} className="w-full border p-2 rounded-sm outline-none" placeholder="İstanbul / Kadıköy" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Web Sitesi</label>
            <input name="website" value={formData.website} onChange={handleInputChange} className="w-full border p-2 rounded-sm outline-none" placeholder="www.ornek.com" />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-8 py-3 rounded-sm font-bold text-sm hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50">
            {submitting ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>}
            {store ? 'Değişiklikleri Kaydet' : 'Mağazayı Oluştur'}
          </button>
        </div>

      </form>
    </div>
  );
}