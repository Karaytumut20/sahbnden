"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, ArrowLeft, ArrowRight, Info, MapPin, Camera, Sparkles, Eye, X, Save } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import RealEstateFields from '@/components/form/RealEstateFields';
import VehicleFields from '@/components/form/VehicleFields';
import ImageUploader from '@/components/ui/ImageUploader';
import AdCard from '@/components/AdCard';
import { createAdAction } from '@/lib/actions';
import { adSchema } from '@/lib/schemas';
import { cities, getDistricts } from '@/lib/locations';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

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

  // UX State
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const [formData, setFormData] = useState<any>({
    title: '', description: '', price: '', currency: 'TL', city: '', district: '',
    m2: '', room: '', floor: '', heating: '',
    brand: '', year: '', km: '', gear: '', fuel: ''
  });

  const isRealEstate = categorySlug.includes('konut') || categorySlug.includes('isyeri');
  const isVehicle = categorySlug.includes('otomobil') || categorySlug.includes('suv');

  // 1. AUTO-SAVE & RESTORE (LocalStorage)
  useEffect(() => {
    // Sayfa yüklendiğinde taslağı geri getir
    const savedDraft = localStorage.getItem('ad_draft');
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        // Sadece aynı kategori ise geri yükle
        if (parsed.categorySlug === categorySlug) {
            setFormData(parsed.formData);
            setImages(parsed.images || []);
            addToast('Taslağınız başarıyla geri yüklendi.', 'info');
        }
      } catch (e) { console.error("Draft error", e); }
    }
  }, [categorySlug]); // Sadece ilk yüklemede

  // Form değiştikçe kaydet
  useEffect(() => {
    const timer = setTimeout(() => {
        if (formData.title || formData.price) { // Boşsa kaydetme
            localStorage.setItem('ad_draft', JSON.stringify({ formData, images, categorySlug }));
            setLastSaved(new Date());
        }
    }, 1000); // 1 saniye debounce
    return () => clearTimeout(timer);
  }, [formData, images, categorySlug]);


  useEffect(() => {
    if (formData.city) {
      setDistricts(getDistricts(formData.city));
      // Şehir değişirse ilçeyi sıfırla (eğer eski ilçe listede yoksa)
      // Ancak auto-save'den geldiyse ve ilçe geçerliyse koru
      // Basitlik için: Kullanıcı manuel değiştirirse sıfırlarız, buraya ekstra kontrol eklemiyoruz.
    }
  }, [formData.city]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleDynamicChange = (name: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { router.push('/login'); return; }

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

    const result = adSchema.safeParse(rawData);

    if (!result.success) {
        const fieldErrors: any = {};
        result.error.issues.forEach(issue => { fieldErrors[issue.path[0]] = issue.message; });
        setErrors(fieldErrors);
        addToast('Lütfen hatalı alanları düzeltiniz.', 'error');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    setIsSubmitting(true);
    const res = await createAdAction(rawData);

    if (res.error) {
        addToast(res.error, 'error');
    } else {
        // Başarılı olursa taslağı temizle
        localStorage.removeItem('ad_draft');
        addToast('İlan başarıyla oluşturuldu!', 'success');
        router.push(`/ilan-ver/doping?adId=${res.adId}`);
    }
    setIsSubmitting(false);
  };

  // Preview Card Component (DRY)
  const PreviewCard = () => (
    <div className="pointer-events-none transform scale-[0.85] origin-top">
        <AdCard
            ad={{
                id: 999999,
                title: formData.title || 'İlan Başlığı',
                price: formData.price || 0,
                currency: formData.currency,
                city: formData.city || 'İl',
                district: formData.district || 'İlçe',
                image: images[0] || null,
                created_at: new Date().toISOString(),
                is_vitrin: false,
                is_urgent: false
            }}
            viewMode="grid"
        />
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 relative">

      {/* SOL: FORM ALANI */}
      <div className="flex-1">

        {/* Kategori Bilgisi */}
        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-1">Seçilen Kategori</p>
            <h1 className="text-sm md:text-base font-bold text-indigo-900">{categoryPath}</h1>
          </div>
          <button onClick={() => router.push('/ilan-ver')} className="text-xs font-bold text-slate-500 hover:text-indigo-600 bg-white px-3 py-1.5 rounded-lg border border-indigo-100 hover:border-indigo-300 transition-colors">
            Değiştir
          </button>
        </div>

        {/* Auto-Save Göstergesi */}
        <div className="flex justify-end mb-2">
            {lastSaved && (
                <span className="text-[10px] text-gray-400 flex items-center gap-1 animate-pulse">
                    <Save size={10}/> Taslak kaydedildi: {lastSaved.toLocaleTimeString()}
                </span>
            )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* BÖLÜM 1: TEMEL BİLGİLER */}
          <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Info className="text-indigo-500" size={20}/> Temel Bilgiler
            </h3>

            <div className="space-y-5">
              <Input
                label="İlan Başlığı"
                name="title"
                placeholder="Örn: Sahibinden temiz, masrafsız..."
                value={formData.title}
                onChange={handleInputChange}
                error={errors.title}
                className="font-medium text-base"
              />
              <Textarea
                label="İlan Açıklaması"
                name="description"
                placeholder="Ürününüzü detaylıca anlatın..."
                value={formData.description}
                onChange={handleInputChange}
                className="h-32 leading-relaxed"
                error={errors.description}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="relative">
                   <Input
                    label="Fiyat"
                    name="price"
                    type="number"
                    placeholder="0"
                    value={formData.price}
                    onChange={handleInputChange}
                    error={errors.price}
                    className="font-bold text-lg text-indigo-900"
                   />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Para Birimi</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['TL', 'USD', 'EUR'].map(curr => (
                      <button
                        key={curr}
                        type="button"
                        onClick={() => setFormData({...formData, currency: curr})}
                        className={`h-10 rounded-lg text-sm font-bold border transition-all ${formData.currency === curr ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                      >
                        {curr}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* BÖLÜM 2: ÖZELLİKLER (Dinamik) */}
          {(isRealEstate || isVehicle) && (
            <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Sparkles className="text-orange-500" size={20}/> Teknik Detaylar
              </h3>
              <div className="-mx-4 md:mx-0">
                {isRealEstate && <RealEstateFields data={formData} onChange={handleDynamicChange} />}
                {isVehicle && <VehicleFields data={formData} onChange={handleDynamicChange} />}
              </div>
            </section>
          )}

          {/* BÖLÜM 3: FOTOĞRAFLAR */}
          <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-pink-500"></div>
            <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Camera className="text-pink-500" size={20}/> Fotoğraflar
            </h3>
            <p className="text-sm text-slate-500 mb-6">Vitrin görseli ilk yüklediğiniz fotoğraf olacaktır.</p>
            <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300">
               <ImageUploader onImagesChange={setImages} initialImages={images} />
            </div>
          </section>

          {/* BÖLÜM 4: KONUM */}
          <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <MapPin className="text-green-500" size={20}/> Konum Bilgisi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">İl <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select name="city" onChange={handleInputChange} value={formData.city} className="w-full h-11 pl-3 pr-8 bg-white border border-gray-300 rounded-lg outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 appearance-none text-sm transition-shadow shadow-sm">
                    <option value="">Seçiniz</option>
                    {cities.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                  <div className="absolute right-3 top-3.5 pointer-events-none text-gray-400"><MapPin size={16}/></div>
                </div>
                {errors.city && <p className="text-red-500 text-[10px] mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">İlçe <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className="w-full h-11 pl-3 pr-8 bg-white border border-gray-300 rounded-lg outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 appearance-none text-sm transition-shadow shadow-sm disabled:bg-gray-100 disabled:text-gray-400"
                    disabled={!formData.city}
                  >
                    <option value="">Seçiniz</option>
                    {districts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <div className="absolute right-3 top-3.5 pointer-events-none text-gray-400"><MapPin size={16}/></div>
                </div>
                {errors.district && <p className="text-red-500 text-[10px] mt-1">{errors.district}</p>}
              </div>
            </div>
          </section>

          {/* ACTIONS */}
          <div className="flex items-center justify-between pt-4 pb-20 lg:pb-0">
            <button type="button" onClick={() => router.back()} className="px-6 py-3 rounded-lg font-bold text-sm text-slate-600 hover:bg-slate-100 flex items-center gap-2 transition-colors">
              <ArrowLeft size={18}/> Geri Dön
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold text-base hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20}/> : <>Devam Et <ArrowRight size={20}/></>}
            </button>
          </div>

        </form>
      </div>

      {/* SAĞ: BİLGİ KUTUSU & DESKTOP PREVIEW (Sticky) */}
      <div className="hidden lg:block w-[300px] shrink-0">
        <div className="sticky top-28 space-y-4">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 shadow-sm">
            <h4 className="font-bold text-blue-900 mb-2 text-sm flex items-center gap-2">
              <Info size={16}/> İpucu
            </h4>
            <p className="text-xs text-blue-800 leading-relaxed">
              İlan başlığınızda anahtar kelimeleri (marka, model, özellik) geçirmek arama sonuçlarında daha üstte çıkmanızı sağlar.
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
             <h4 className="font-bold text-slate-800 mb-3 text-sm">Canlı Önizleme</h4>
             {formData.title ? <PreviewCard /> : (
                 <div className="opacity-50 pointer-events-none grayscale">
                   <div className="aspect-[4/3] bg-gray-200 rounded-lg mb-2"></div>
                   <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                   <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                 </div>
             )}
             <p className="text-[10px] text-center text-gray-400 mt-2">
                {formData.title ? 'İlanınız listelerde böyle görünecek' : 'Başlık girdikçe önizleme aktifleşir'}
             </p>
          </div>
        </div>
      </div>

      {/* MOBILE PREVIEW BUTTON & MODAL */}
      <div className="lg:hidden">
        {/* Floating Button */}
        <button
            onClick={() => setShowMobilePreview(true)}
            className="fixed bottom-24 right-4 z-50 bg-indigo-600 text-white p-3 rounded-full shadow-lg shadow-indigo-300 hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-2 pr-5"
        >
            <Eye size={20} /> <span className="font-bold text-sm">Önizle</span>
        </button>

        {/* Modal Overlay */}
        {showMobilePreview && (
            <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl relative">
                    <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                        <h3 className="font-bold text-gray-800">İlan Önizlemesi</h3>
                        <button onClick={() => setShowMobilePreview(false)} className="bg-gray-200 p-1.5 rounded-full hover:bg-gray-300 text-gray-600">
                            <X size={18} />
                        </button>
                    </div>
                    <div className="p-6 bg-gray-100 min-h-[350px] flex items-center justify-center">
                        <div className="w-full">
                            <PreviewCard />
                        </div>
                    </div>
                    <div className="p-4 text-center text-xs text-gray-500 bg-white border-t border-gray-100">
                        Bu sadece bir önizlemedir.
                    </div>
                </div>
            </div>
        )}
      </div>

    </div>
  );
}

export default function PostAdPage() {
    return <Suspense fallback={<div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-indigo-600" size={32}/></div>}><PostAdFormContent /></Suspense>
}