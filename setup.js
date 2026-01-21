const fs = require("fs");
const path = require("path");

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
  magenta: "\x1b[35m",
};

console.log(
  colors.cyan +
    colors.bold +
    "\n🚀 SAHİBİNDEN CLONE - GELİŞTİRME PAKETİ 6 (ADVANCED UX & TOOLS)\n" +
    colors.reset,
);

function writeFile(filePath, content) {
  const absolutePath = path.join(__dirname, filePath);
  const dir = path.dirname(absolutePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(absolutePath, content.trim());
  console.log(
    `${colors.green}✔ Oluşturuldu/Güncellendi:${colors.reset} ${filePath}`,
  );
}

// -------------------------------------------------------------------------
// 1. COMPONENTS/UI/IMAGEUPLOADER.TSX (Yeni Profesyonel Yükleyici)
// -------------------------------------------------------------------------
const imageUploaderPath = "components/ui/ImageUploader.tsx";
const imageUploaderContent = `
"use client";
import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadImageClient } from '@/lib/services';
import { useToast } from '@/context/ToastContext';

type ImageUploaderProps = {
  onImagesChange: (urls: string[]) => void;
  initialImages?: string[];
};

export default function ImageUploader({ onImagesChange, initialImages = [] }: ImageUploaderProps) {
  const [images, setImages] = useState<string[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    setUploading(true);
    const newUrls: string[] = [];

    // Çoklu yükleme döngüsü
    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i];
      try {
        const url = await uploadImageClient(file);
        newUrls.push(url);
      } catch (error) {
        console.error(error);
        addToast(\`\${file.name} yüklenirken hata oluştu.\`, 'error');
      }
    }

    const updatedList = [...images, ...newUrls];
    setImages(updatedList);
    onImagesChange(updatedList);
    setUploading(false);

    // Input'u temizle ki aynı dosyayı tekrar seçebilsin
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    const updatedList = images.filter((_, i) => i !== index);
    setImages(updatedList);
    onImagesChange(updatedList);
  };

  return (
    <div className="space-y-4">
      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={\`border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-colors \${uploading ? 'bg-gray-50 cursor-wait' : 'hover:bg-blue-50 hover:border-blue-400'}\`}
      >
        {uploading ? (
          <div className="text-center">
            <Loader2 size={32} className="animate-spin text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-500 font-bold">Fotoğraflar Yükleniyor...</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Upload size={24} />
            </div>
            <p className="text-sm font-bold text-gray-700">Fotoğraf Yüklemek İçin Tıklayın</p>
            <p className="text-xs text-gray-400 mt-1">veya sürükleyip bırakın (Max 10 Adet)</p>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
          accept="image/*"
          disabled={uploading}
        />
      </div>

      {/* Önizleme Alanı */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 animate-in fade-in slide-in-from-bottom-2">
          {images.map((url, idx) => (
            <div key={idx} className="relative group aspect-square bg-gray-100 rounded-md border border-gray-200 overflow-hidden">
              <img src={url} alt={\`Yüklenen \${idx}\`} className="w-full h-full object-cover" />

              {/* Vitrin Etiketi (İlk Resim) */}
              {idx === 0 && (
                <div className="absolute top-0 left-0 bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-br-sm z-10">
                  VİTRİN
                </div>
              )}

              {/* Sil Butonu */}
              <button
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                title="Fotoğrafı Kaldır"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
`;
writeFile(imageUploaderPath, imageUploaderContent);

// -------------------------------------------------------------------------
// 2. COMPONENTS/TOOLS/LOANCALCULATOR.TSX (Kredi Hesaplama)
// -------------------------------------------------------------------------
const loanCalcPath = "components/tools/LoanCalculator.tsx";
const loanCalcContent = `
"use client";
import React, { useState, useEffect } from 'react';
import { Calculator, ArrowRight } from 'lucide-react';

export default function LoanCalculator({ price }: { price: number }) {
  const [amount, setAmount] = useState(price ? Math.floor(price * 0.8) : 1000000); // Varsayılan %80 kredi
  const [term, setTerm] = useState(120); // 120 Ay
  const [rate, setRate] = useState(3.05); // Faiz Oranı
  const [result, setResult] = useState<{ monthly: number; total: number } | null>(null);

  useEffect(() => {
    calculate();
  }, [amount, term, rate]);

  const calculate = () => {
    const r = rate / 100;
    const monthly = (amount * r * Math.pow(1 + r, term)) / (Math.pow(1 + r, term) - 1);
    const total = monthly * term;
    setResult({ monthly, total });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-5 mt-4">
      <h3 className="font-bold text-[#333] flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
        <Calculator size={18} className="text-blue-600" /> Kredi Hesaplama
      </h3>

      <div className="space-y-3 mb-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">Kredi Tutarı (TL)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-sm p-2 text-sm focus:border-blue-500 outline-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Vade (Ay)</label>
            <select
              value={term}
              onChange={(e) => setTerm(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-sm p-2 text-sm bg-white outline-none"
            >
              {[12, 24, 36, 48, 60, 120, 180, 240].map(m => (
                <option key={m} value={m}>{m} Ay</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Faiz Oranı (%)</label>
            <input
              type="number"
              step="0.01"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-sm p-2 text-sm focus:border-blue-500 outline-none"
            />
          </div>
        </div>
      </div>

      <div className="bg-blue-50 p-3 rounded-sm border border-blue-100">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-blue-800">Aylık Taksit:</span>
          <span className="text-sm font-bold text-blue-900">{result?.monthly.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} TL</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">Toplam Geri Ödeme:</span>
          <span className="text-xs font-bold text-gray-600">{result?.total.toLocaleString('tr-TR', { maximumFractionDigits: 0 })} TL</span>
        </div>
      </div>

      <button className="w-full mt-3 text-xs text-gray-500 hover:text-blue-700 flex items-center justify-center gap-1 font-bold">
        Detaylı Hesaplama <ArrowRight size={12} />
      </button>
    </div>
  );
}
`;
writeFile(loanCalcPath, loanCalcContent);

// -------------------------------------------------------------------------
// 3. CONTEXT/COMPARECONTEXT.TSX (LocalStorage Kalıcılık)
// -------------------------------------------------------------------------
const compareContextPath = "context/CompareContext.tsx";
const compareContextContent = `
"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/context/ToastContext';

type CompareContextType = {
  compareList: number[];
  addToCompare: (id: number) => void;
  removeFromCompare: (id: number) => void;
  clearCompare: () => void;
  isInCompare: (id: number) => boolean;
};

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareList, setCompareList] = useState<number[]>([]);
  const { addToast } = useToast();

  // İlk yüklemede LocalStorage'dan oku
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('compare_list');
      if (stored) {
        try {
          setCompareList(JSON.parse(stored));
        } catch (e) {
          console.error("Karşılaştırma listesi okunamadı", e);
        }
      }
    }
  }, []);

  // State değiştiğinde LocalStorage'a yaz
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('compare_list', JSON.stringify(compareList));
    }
  }, [compareList]);

  const addToCompare = (id: number) => {
    if (compareList.length >= 4) {
      addToast('En fazla 4 ilan karşılaştırabilirsiniz.', 'error');
      return;
    }
    if (!compareList.includes(id)) {
      setCompareList(prev => [...prev, id]);
      addToast('Karşılaştırma listesine eklendi.', 'success');
    }
  };

  const removeFromCompare = (id: number) => {
    setCompareList(prev => prev.filter(itemId => itemId !== id));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const isInCompare = (id: number) => compareList.includes(id);

  return (
    <CompareContext.Provider value={{ compareList, addToCompare, removeFromCompare, clearCompare, isInCompare }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (context === undefined) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
}
`;
writeFile(compareContextPath, compareContextContent);

// -------------------------------------------------------------------------
// 4. APP/ILAN-VER/DETAY/PAGE.TSX (Yeni Uploader Entegrasyonu)
// -------------------------------------------------------------------------
const postAdDetailPath = "app/ilan-ver/detay/page.tsx";
const postAdDetailContent = `
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
        router.push(\`/ilan-ver/doping?adId=\${res.adId}\`);
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
`;
writeFile(postAdDetailPath, postAdDetailContent);

// -------------------------------------------------------------------------
// 5. APP/ILAN/[ID]/PAGE.TSX (Kredi Hesaplama Entegrasyonu)
// -------------------------------------------------------------------------
const adDetailPagePath = "app/ilan/[id]/page.tsx";
const adDetailPageContent = `
import React from 'react';
import { notFound } from 'next/navigation';
import { getAdDetailServer } from '@/lib/actions';
import Breadcrumb from '@/components/Breadcrumb';
import Gallery from '@/components/Gallery';
import MobileAdActionBar from '@/components/MobileAdActionBar';
import AdActionButtons from '@/components/AdActionButtons';
import StickyAdHeader from '@/components/StickyAdHeader';
import SellerSidebar from '@/components/SellerSidebar';
import Tabs from '@/components/AdDetail/Tabs';
import FeaturesTab from '@/components/AdDetail/FeaturesTab';
import LocationTab from '@/components/AdDetail/LocationTab';
import LoanCalculator from '@/components/tools/LoanCalculator'; // YENİ
import Badge from '@/components/ui/Badge';
import { Calendar, Eye, Hash, MapPin } from 'lucide-react';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ad = await getAdDetailServer(Number(id));
  if (!ad) return { title: 'İlan Bulunamadı' };
  return {
    title: \`\${ad.title} - sahibinden.com Klon\`,
    description: \`\${ad.city} / \${ad.district} bölgesindeki bu fırsatı kaçırmayın. Fiyat: \${ad.price} \${ad.currency}\`,
  };
}

export default async function AdDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ad = await getAdDetailServer(Number(id));

  if (!ad) return notFound();

  const formattedPrice = ad.price?.toLocaleString('tr-TR');
  const location = \`\${ad.city || ''} / \${ad.district || ''}\`;
  const sellerInfo = ad.profiles || { full_name: 'Bilinmiyor', phone: '', email: '' };

  const tabItems = [
    {
      id: 'desc',
      label: 'İlan Açıklaması',
      content: (
        <div className="text-[14px] text-[#333] leading-relaxed whitespace-pre-wrap font-sans">
          {ad.description}
        </div>
      )
    },
    {
      id: 'features',
      label: 'İlan Özellikleri',
      content: <FeaturesTab ad={ad} />
    },
    {
      id: 'location',
      label: 'Konum',
      content: <LocationTab city={ad.city} district={ad.district} />
    }
  ];

  const attributes = [
    { label: 'İlan No', value: ad.id, icon: Hash },
    { label: 'İlan Tarihi', value: new Date(ad.created_at).toLocaleDateString('tr-TR'), icon: Calendar },
    { label: 'Konum', value: location, icon: MapPin },
    { label: 'Metrekare', value: ad.m2 ? \`\${ad.m2} m²\` : null },
    { label: 'Oda Sayısı', value: ad.room },
    { label: 'Bina Yaşı', value: ad.year ? \`\${2025 - ad.year} Yaşında\` : null },
    { label: 'Bulunduğu Kat', value: ad.floor ? \`\${ad.floor}. Kat\` : null },
    { label: 'Isıtma', value: ad.heating },
    { label: 'Marka', value: ad.brand },
    { label: 'Yıl', value: ad.year },
    { label: 'KM', value: ad.km ? \`\${ad.km.toLocaleString()} KM\` : null },
    { label: 'Vites', value: ad.gear },
    { label: 'Yakıt', value: ad.fuel },
  ].filter(attr => attr.value);

  return (
    <div className="pb-20 relative font-sans">
      <StickyAdHeader title={ad.title} price={formattedPrice} currency={ad.currency} />

      <div className="mb-4">
        <Breadcrumb path={\`\${ad.category === 'emlak' ? 'Emlak' : 'Vasıta'} > \${location} > İlan Detayı\`} />
      </div>

      <div className="border-b border-gray-200 pb-4 mb-6">
        <h1 className="text-[#333] font-bold text-xl mb-2">{ad.title}</h1>
        <div className="flex gap-2">
            {ad.is_urgent && <Badge variant="danger">Acil Satılık</Badge>}
            {ad.is_vitrin && <Badge variant="warning">Vitrinde</Badge>}
            {ad.price < 2000000 && <Badge variant="success">Fırsat Ürünü</Badge>}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-[600px] shrink-0">
          <Gallery mainImage={ad.image || 'https://via.placeholder.com/800x600?text=Resim+Yok'} />

          <div className="mt-4 hidden md:block">
             <AdActionButtons id={ad.id} title={ad.title} image={ad.image} sellerName={sellerInfo.full_name} />
          </div>

          <Tabs items={tabItems} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="mb-6">
            <span className="block text-blue-700 font-bold text-2xl">{formattedPrice} {ad.currency}</span>
            <span className="block text-gray-500 text-xs mt-1 flex items-center gap-1">
                <MapPin size={12}/> {location}
            </span>
          </div>

          <div className="bg-white border-t border-gray-200">
             {attributes.map((attr, idx) => (
               <div key={idx} className="flex justify-between py-2.5 border-b border-gray-100 text-sm hover:bg-gray-50 px-2 transition-colors">
                 <span className="font-bold text-[#333] flex items-center gap-2">
                    {attr.icon && <attr.icon size={14} className="text-gray-400"/>}
                    {attr.label}
                 </span>
                 <span className={\`\${attr.label === 'İlan No' ? 'text-red-600 font-bold' : 'text-[#333]'}\`}>
                    {attr.value}
                 </span>
               </div>
             ))}
             <div className="flex justify-between py-2.5 border-b border-gray-100 text-sm px-2">
                <span className="font-bold text-[#333] flex items-center gap-2"><Eye size={14} className="text-gray-400"/> Görüntülenme</span>
                <span>1.245</span>
             </div>
          </div>
        </div>

        <div className="lg:w-[280px] shrink-0 hidden md:block">
           <SellerSidebar
             sellerId={ad.user_id}
             sellerName={sellerInfo.full_name || 'Kullanıcı'}
             sellerPhone={sellerInfo.phone || 'Telefon yok'}
             adId={ad.id}
             adTitle={ad.title}
             adImage={ad.image}
             price={formattedPrice}
             currency={ad.currency}
           />

           {/* Kredi Hesaplama Aracı Sadece Emlakta Göster */}
           {ad.category === 'emlak' && <LoanCalculator price={ad.price} />}

           <div className="mt-4 bg-yellow-50 p-4 border border-yellow-200 rounded-sm text-xs text-yellow-800">
              <strong>Güvenlik İpucu:</strong> Tanımadığınız kişilere kesinlikle para göndermeyin, kapora yatırmayın.
           </div>
        </div>
      </div>

      <MobileAdActionBar price={\`\${formattedPrice} \${ad.currency}\`} />
    </div>
  );
}
`;
writeFile(adDetailPagePath, adDetailPageContent);

console.log(
  colors.bold + "\n🎉 GELİŞTİRME PAKETİ 6 TAMAMLANDI!" + colors.reset,
);
console.log(
  "1. 'ImageUploader': Çoklu fotoğraf yükleme, önizleme ve silme özelliği eklendi.",
);
console.log(
  "2. 'LoanCalculator': Emlak ilanları için kredi hesaplama aracı eklendi.",
);
console.log(
  "3. 'CompareContext': Karşılaştırma listesi artık tarayıcı belleğinde saklanıyor.",
);
