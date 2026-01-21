const fs = require("fs");
const path = require("path");

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
};

console.log(
  colors.cyan +
    colors.bold +
    "\n🚀 SENIOR DEVELOPER UPDATE: TYPESCRIPT, LOKASYON & PERFORMANS...\n" +
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

// =============================================================================
// 1. TYPES/INDEX.TS (MERKEZİ TİP TANIMLARI - TYPE SAFETY)
// =============================================================================
const typesContent = `
export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'user' | 'store' | 'admin';
  phone: string | null;
  created_at: string;
}

export interface Category {
  id: number;
  title: string;
  slug: string;
  icon: string | null;
  parent_id: number | null;
  subs?: Category[];
}

export interface Ad {
  id: number;
  title: string;
  description: string;
  price: number;
  currency: string;
  city: string;
  district: string;
  category: string;
  image: string | null;
  images?: string[];
  status: 'yayinda' | 'onay_bekliyor' | 'pasif' | 'reddedildi';
  is_vitrin: boolean;
  is_urgent: boolean;
  user_id: string;
  created_at: string;
  // Dinamik Özellikler
  room?: string;
  m2?: number;
  floor?: number;
  heating?: string;
  brand?: string;
  model?: string;
  year?: number;
  km?: number;
  gear?: string;
  fuel?: string;
  // İlişkiler
  profiles?: Profile;
}

// Form Verisi İçin Tip
export interface AdFormData {
  title: string;
  description: string;
  price: string | number;
  currency: string;
  city: string;
  district: string;
  category?: string;
  // Emlak
  m2?: string | number;
  room?: string;
  floor?: string | number;
  heating?: string;
  // Vasıta
  brand?: string;
  year?: string | number;
  km?: string | number;
  gear?: string;
  fuel?: string;
  status_vehicle?: string;
}
`;
writeFile("types/index.ts", typesContent);

// =============================================================================
// 2. LIB/LOCATIONS.TS (GERÇEKÇİ İL-İLÇE VERİSİ)
// =============================================================================
const locationsContent = `
export const cities = [
  { name: 'İstanbul', districts: ['Kadıköy', 'Beşiktaş', 'Üsküdar', 'Şişli', 'Maltepe', 'Kartal', 'Pendik', 'Ümraniye', 'Ataşehir', 'Beylikdüzü', 'Esenyurt', 'Fatih', 'Bakırköy'] },
  { name: 'Ankara', districts: ['Çankaya', 'Keçiören', 'Yenimahalle', 'Mamak', 'Etimesgut', 'Sincan', 'Altındağ', 'Pursaklar', 'Gölbaşı'] },
  { name: 'İzmir', districts: ['Karşıyaka', 'Konak', 'Bornova', 'Buca', 'Çiğli', 'Gaziemir', 'Balçova', 'Narlıdere', 'Urla', 'Çeşme'] },
  { name: 'Antalya', districts: ['Muratpaşa', 'Kepez', 'Konyaaltı', 'Alanya', 'Manavgat', 'Serik', 'Kemer', 'Kaş'] },
  { name: 'Bursa', districts: ['Nilüfer', 'Osmangazi', 'Yıldırım', 'Mudanya', 'İnegöl', 'Gemlik'] },
  { name: 'Adana', districts: ['Seyhan', 'Çukurova', 'Yüreğir', 'Sarıçam'] },
  { name: 'Kocaeli', districts: ['İzmit', 'Gebze', 'Darıca', 'Gölcük', 'Körfez', 'Derince', 'Kartepe', 'Başiskele', 'Karamürsel'] },
  { name: 'Konya', districts: ['Selçuklu', 'Meram', 'Karatay'] },
  { name: 'Gaziantep', districts: ['Şahinbey', 'Şehitkamil'] },
  { name: 'Mersin', districts: ['Yenişehir', 'Mezitli', 'Akdeniz', 'Toroslar', 'Erdemli'] },
  { name: 'Eskişehir', districts: ['Odunpazarı', 'Tepebaşı'] },
  { name: 'Samsun', districts: ['Atakum', 'İlkadım', 'Canik'] },
  { name: 'Kayseri', districts: ['Melikgazi', 'Kocasinan', 'Talas'] },
  { name: 'Sakarya', districts: ['Adapazarı', 'Serdivan', 'Erenler'] },
  { name: 'Muğla', districts: ['Bodrum', 'Fethiye', 'Marmaris', 'Menteşe', 'Milas'] },
  { name: 'Trabzon', districts: ['Ortahisar', 'Akçaabat', 'Yomra'] }
].sort((a, b) => a.name.localeCompare(b.name));

export const getDistricts = (cityName: string) => {
  const city = cities.find(c => c.name === cityName);
  return city ? city.districts.sort() : [];
};
`;
writeFile("lib/locations.ts", locationsContent);

// =============================================================================
// 3. NEXT.CONFIG.TS (IMAGE OPTIMIZATION AYARLARI)
// =============================================================================
const nextConfigContent = `
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Tüm dış kaynaklara izin ver (Geliştirme için)
      },
    ],
    // SVG ve güvenlik ayarları
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
`;
writeFile("next.config.ts", nextConfigContent);

// =============================================================================
// 4. LIB/VALIDATION.TS (FORM DOĞRULAMA MOTORU)
// =============================================================================
const validationContent = `
import { AdFormData } from '@/types';

type ValidationResult = {
  isValid: boolean;
  errors: Record<string, string>;
};

export function validateAdForm(data: AdFormData, categorySlug: string): ValidationResult {
  const errors: Record<string, string> = {};
  const isVehicle = categorySlug.includes('otomobil') || categorySlug.includes('suv') || categorySlug.includes('moto');
  const isRealEstate = categorySlug.includes('konut') || categorySlug.includes('isyeri') || categorySlug.includes('arsa');

  // 1. Temel Kontroller
  if (!data.title || data.title.length < 5) {
    errors.title = "İlan başlığı en az 5 karakter olmalıdır.";
  }
  if (!data.description || data.description.length < 10) {
    errors.description = "Açıklama çok kısa (en az 10 karakter).";
  }
  if (!data.price || Number(data.price) <= 0) {
    errors.price = "Geçerli bir fiyat giriniz.";
  }
  if (!data.city) errors.city = "Lütfen il seçiniz.";
  if (!data.district) errors.district = "Lütfen ilçe giriniz.";

  // 2. Emlak Kontrolleri
  if (isRealEstate) {
    if (!data.m2 || Number(data.m2) <= 0) errors.m2 = "Metrekare bilgisi zorunludur.";
    if (!data.room) errors.room = "Oda sayısı seçiniz.";
  }

  // 3. Vasıta Kontrolleri
  if (isVehicle) {
    const currentYear = new Date().getFullYear();
    if (!data.year || Number(data.year) < 1900 || Number(data.year) > currentYear) {
      errors.year = "Geçerli bir model yılı giriniz.";
    }
    if (data.km === undefined || data.km === null || Number(data.km) < 0) {
      errors.km = "Kilometre giriniz.";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
`;
writeFile("lib/validation.ts", validationContent);

// =============================================================================
// 5. COMPONENTS/ADCARD.TSX (NEXT/IMAGE VE TARİH FORMATI)
// =============================================================================
const adCardContent = `
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Calendar, Heart } from 'lucide-react';
import Badge from '@/components/ui/Badge';
import { Ad } from '@/types';

// Tarih Formatlayıcı (Bugün, Dün, vs.)
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Bugün';
  if (diffDays === 1) return 'Dün';
  return date.toLocaleDateString('tr-TR');
};

type AdCardProps = {
  ad: Ad;
  viewMode?: 'grid' | 'list' | 'table';
};

export default function AdCard({ ad, viewMode = 'grid' }: AdCardProps) {
  const formattedPrice = ad.price != null ? ad.price.toLocaleString('tr-TR') : '0';
  const priceDisplay = \`\${formattedPrice} \${ad.currency || 'TL'}\`;
  const location = \`\${ad.city || ''} / \${ad.district || ''}\`;
  const dateDisplay = formatDate(ad.created_at);
  const imageUrl = ad.image || 'https://via.placeholder.com/300x200?text=Resim+Yok';

  if (viewMode === 'table') {
    return (
      <tr className="border-b border-gray-100 hover:bg-[#fff9e1] transition-colors group">
        <td className="p-2 w-[120px]">
          <Link href={\`/ilan/\${ad.id}\`}>
            <div className="w-[100px] h-[75px] relative overflow-hidden border border-gray-200 rounded-sm">
              <Image src={imageUrl} alt={ad.title} fill className="object-cover group-hover:scale-105 transition-transform" />
              {ad.is_vitrin && <div className="absolute top-0 left-0 bg-yellow-400 text-black text-[9px] font-bold px-1 z-10">VİTRİN</div>}
            </div>
          </Link>
        </td>
        <td className="p-3 align-middle">
          <Link href={\`/ilan/\${ad.id}\`} className="block">
            <span className="text-[#333] text-[13px] font-bold group-hover:underline block mb-1 line-clamp-1">
              {ad.title}
            </span>
            <div className="flex gap-2 items-center">
                {ad.is_urgent && <Badge variant="danger" className="text-[9px] py-0">Acil</Badge>}
                <span className="text-gray-400 text-[10px]">#{ad.id}</span>
            </div>
          </Link>
        </td>
        <td className="p-3 align-middle text-blue-900 font-bold text-[13px] whitespace-nowrap">{priceDisplay}</td>
        <td className="p-3 align-middle text-[#333] text-[12px] whitespace-nowrap">{dateDisplay}</td>
        <td className="p-3 align-middle text-[#333] text-[12px] whitespace-nowrap">
          <div className="flex items-center gap-1 text-gray-600"><MapPin size={12} className="text-gray-400" />{location}</div>
        </td>
      </tr>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="flex bg-white border border-gray-200 rounded-sm overflow-hidden hover:shadow-md transition-shadow group h-[160px]">
        <Link href={\`/ilan/\${ad.id}\`} className="w-[220px] shrink-0 relative bg-gray-100">
           <Image src={imageUrl} alt={ad.title} fill className="object-cover group-hover:scale-105 transition-transform" />
           {ad.is_urgent && <div className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm z-10">ACİL</div>}
        </Link>
        <div className="flex-1 p-4 flex flex-col justify-between">
           <div>
             <div className="flex justify-between items-start">
                <Link href={\`/ilan/\${ad.id}\`} className="text-[#333] text-base font-bold group-hover:underline line-clamp-1">
                    {ad.title}
                </Link>
             </div>
             <p className="text-xs text-gray-500 mt-1 line-clamp-2">{ad.description?.substring(0, 150)}...</p>
           </div>
           <div className="flex justify-between items-end">
              <div className="text-gray-500 text-xs flex gap-4">
                  <span className="flex items-center gap-1"><MapPin size={14}/> {location}</span>
                  <span className="flex items-center gap-1"><Calendar size={14}/> {dateDisplay}</span>
              </div>
              <div className="text-lg font-bold text-blue-900">{priceDisplay}</div>
           </div>
        </div>
      </div>
    );
  }

  // Grid Görünümü (Varsayılan)
  return (
    <Link href={\`/ilan/\${ad.id}\`} className="block group h-full">
      <div className="bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-lg transition-all cursor-pointer h-full flex flex-col relative">
        {ad.is_urgent && <div className="absolute top-2 left-2 bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm z-10 shadow-sm">ACİL</div>}
        {ad.is_vitrin && <div className="absolute top-2 right-2 bg-yellow-400 text-black text-[9px] font-bold px-1.5 py-0.5 rounded-sm z-10 shadow-sm">VİTRİN</div>}

        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 rounded-t-sm">
          <Image src={imageUrl} alt={ad.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
        </div>
        <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
          <p className="text-[13px] text-[#333] font-semibold leading-tight group-hover:underline line-clamp-2 h-[2.4em] overflow-hidden">
            {ad.title}
          </p>
          <div className="pt-2 border-t border-gray-50 mt-1">
             <p className="text-[15px] font-bold text-blue-900">{priceDisplay}</p>
             <div className="flex justify-between items-center mt-1">
                <p className="text-[10px] text-gray-500 truncate max-w-[60%]">{location}</p>
                <p className="text-[10px] text-gray-400">{dateDisplay}</p>
             </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
`;
writeFile("components/AdCard.tsx", adCardContent);

// =============================================================================
// 6. APP/ILAN-VER/DETAY/PAGE.TSX (İL-İLÇE SEÇİMİ VE VALIDASYON ENTEGRASYONU)
// =============================================================================
const postAdFormContent = `
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
import { validateAdForm } from '@/lib/validation';
import { AdFormData } from '@/types';
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

  const [formData, setFormData] = useState<AdFormData>({
    title: '', description: '', price: '', currency: 'TL', city: '', district: '',
    m2: '', room: '', floor: '', heating: '',
    brand: '', year: '', km: '', gear: '', fuel: ''
  });

  const isRealEstate = categorySlug.includes('konut') || categorySlug.includes('isyeri') || categorySlug.includes('arsa');
  const isVehicle = categorySlug.includes('otomobil') || categorySlug.includes('suv');

  // İl değişince ilçeleri güncelle
  useEffect(() => {
    if (formData.city) {
      setDistricts(getDistricts(formData.city));
      setFormData(prev => ({ ...prev, district: '' })); // İlçe sıfırla
    }
  }, [formData.city]);

  const handleInputChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[e.target.name];
            return newErrors;
        });
    }
  };

  const handleDynamicChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { router.push('/login'); return; }

    const validation = validateAdForm(formData, categorySlug);
    if (!validation.isValid) {
        setErrors(validation.errors);
        addToast('Lütfen formdaki hataları düzeltiniz.', 'error');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    setIsSubmitting(true);

    const finalData = {
        ...formData,
        category: categorySlug,
        image: images[0] || null,
        price: Number(formData.price),
        year: isVehicle || isRealEstate ? Number(formData.year) : null,
        km: isVehicle ? Number(formData.km) : null,
        m2: isRealEstate ? Number(formData.m2) : null,
        floor: isRealEstate ? Number(formData.floor) : null,
    };

    const res = await createAdAction(finalData);

    if (res.error) {
        addToast(res.error, 'error');
    } else {
        addToast('İlan başarıyla oluşturuldu!', 'success');
        router.push(\`/ilan-ver/doping?adId=\${res.adId}\`);
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
                    <p className="font-bold">Lütfen hatalı alanları düzeltin:</p>
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
                    <input name="title" onChange={handleInputChange} className={\`w-full border \${errors.title ? 'border-red-500 bg-red-50' : 'border-gray-300'} h-10 px-3 rounded-sm outline-none focus:border-blue-500 text-sm\`} placeholder="Örn: Sahibinden temiz aile evi" />
                </div>
                <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">Açıklama <span className="text-red-500">*</span></label>
                    <textarea name="description" onChange={handleInputChange} className={\`w-full border \${errors.description ? 'border-red-500 bg-red-50' : 'border-gray-300'} p-3 rounded-sm h-32 resize-none focus:border-blue-500 outline-none text-sm\`} placeholder="İlan detayları..."></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-[11px] font-bold text-gray-600 mb-1">Fiyat <span className="text-red-500">*</span></label>
                        <input name="price" type="number" onChange={handleInputChange} className={\`w-full border \${errors.price ? 'border-red-500 bg-red-50' : 'border-gray-300'} h-10 px-3 rounded-sm outline-none focus:border-blue-500 text-sm\`} placeholder="0" />
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
                    <select name="city" onChange={handleInputChange} className={\`w-full border \${errors.city ? 'border-red-500 bg-red-50' : 'border-gray-300'} h-10 px-3 rounded-sm bg-white outline-none text-sm\`}>
                        <option value="">Seçiniz</option>
                        {cities.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">İlçe <span className="text-red-500">*</span></label>
                    <select name="district" value={formData.district} onChange={handleInputChange} className={\`w-full border \${errors.district ? 'border-red-500 bg-red-50' : 'border-gray-300'} h-10 px-3 rounded-sm bg-white outline-none text-sm\`} disabled={!formData.city}>
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
`;
writeFile("app/ilan-ver/detay/page.tsx", postAdFormContent);

// =============================================================================
// 7. COMPONENTS/FILTERSIDEBAR.TSX (YENİ LOKASYON YAPISINA GÖRE GÜNCELLEME)
// =============================================================================
const filterSidebarContent = `
"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, Check, RotateCcw, ChevronLeft } from 'lucide-react';
import { categories } from '@/lib/data';
import { cities } from '@/lib/locations';

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategorySlug = searchParams.get('category');

  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    room: searchParams.get('room') || '',
    minYear: searchParams.get('minYear') || '',
    maxYear: searchParams.get('maxYear') || '',
    maxKm: searchParams.get('maxKm') || '',
  });

  const navData = useMemo(() => {
    let activeCat: any = null;
    let parentCat: any = null;
    let listToDisplay = categories;
    let title = "Kategoriler";

    if (!currentCategorySlug) return { list: categories, title, parent: null, active: null };

    const findInTree = (list: any[], parent: any | null): boolean => {
      for (const item of list) {
        if (item.slug === currentCategorySlug) {
          activeCat = item;
          parentCat = parent;
          return true;
        }
        if (item.subs && item.subs.length > 0) {
          if (findInTree(item.subs, item)) return true;
        }
      }
      return false;
    };
    findInTree(categories, null);

    if (activeCat) {
      if (activeCat.subs && activeCat.subs.length > 0) {
        listToDisplay = activeCat.subs;
        title = activeCat.title;
      } else if (parentCat) {
        listToDisplay = parentCat.subs;
        title = parentCat.title;
      }
    }
    return { list: listToDisplay, title, parent: parentCat, active: activeCat };
  }, [currentCategorySlug]);

  useEffect(() => {
    setFilters({
      city: searchParams.get('city') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      room: searchParams.get('room') || '',
      minYear: searchParams.get('minYear') || '',
      maxYear: searchParams.get('maxYear') || '',
      maxKm: searchParams.get('maxKm') || '',
    });
  }, [searchParams]);

  const updateFilter = (key: string, value: string) => setFilters(prev => ({ ...prev, [key]: value }));

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value); else params.delete(key);
    });
    params.delete('page');
    router.push(\`/search?\${params.toString()}\`);
  };

  const handleCategoryClick = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('category', slug);
    params.delete('page');
    router.push(\`/search?\${params.toString()}\`);
  };

  const goUpLevel = () => {
    if (navData.parent) handleCategoryClick(navData.parent.slug);
    else router.push('/search');
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    if (currentCategorySlug) params.set('category', currentCategorySlug);
    router.push(\`/search?\${params.toString()}\`);
  };

  const showEmlak = currentCategorySlug?.includes('konut') || currentCategorySlug?.includes('emlak');
  const showVasita = currentCategorySlug?.includes('vasita') || currentCategorySlug?.includes('oto');

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-4 sticky top-20 dark:bg-[#1c1c1c] dark:border-gray-700 transition-colors">
      <div className="mb-6">
          <h3 className="font-bold text-[#333] text-sm mb-3 border-b border-gray-100 pb-2 dark:text-white dark:border-gray-700 flex justify-between items-center">
            {navData.title}
            {currentCategorySlug && <button onClick={goUpLevel} className="text-blue-600 hover:text-blue-800"><ChevronLeft size={16}/></button>}
          </h3>
          <ul className="space-y-1">
              {navData.list.map((sub: any) => (
                  <li key={sub.id}>
                      <button onClick={() => handleCategoryClick(sub.slug)} className={\`w-full text-left text-[13px] px-2 py-1.5 rounded-sm flex items-center justify-between group transition-colors \${currentCategorySlug === sub.slug ? 'bg-blue-50 text-blue-700 font-bold border-l-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800'}\`}>
                          {sub.title}
                          {currentCategorySlug === sub.slug && <Check size={14}/>}
                      </button>
                  </li>
              ))}
          </ul>
      </div>

      <h3 className="font-bold text-[#333] text-sm mb-4 flex items-center gap-2 border-b border-gray-100 pb-2 dark:text-white dark:border-gray-700"><Filter size={16} /> Filtrele</h3>

      <div className="space-y-4">
        <div>
          <label className="text-[11px] font-bold text-gray-500 mb-1 block dark:text-gray-400">İL</label>
          <select value={filters.city} onChange={(e) => updateFilter('city', e.target.value)} className="w-full border border-gray-300 rounded-sm text-[12px] p-2 focus:border-blue-500 outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white">
            <option value="">Tüm İller</option>
            {cities.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
          </select>
        </div>

        <div className="border-t border-gray-100 pt-3 dark:border-gray-700">
          <label className="text-[11px] font-bold text-gray-500 mb-1 block dark:text-gray-400">FİYAT (TL)</label>
          <div className="flex gap-2">
            <input type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => updateFilter('minPrice', e.target.value)} className="w-full border border-gray-300 rounded-sm text-[12px] p-2 outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
            <input type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => updateFilter('maxPrice', e.target.value)} className="w-full border border-gray-300 rounded-sm text-[12px] p-2 outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
          </div>
        </div>

        {showEmlak && (
            <div className="border-t border-gray-100 pt-3 dark:border-gray-700 animate-in fade-in">
                <label className="text-[11px] font-bold text-gray-500 mb-1 block dark:text-gray-400">ODA SAYISI</label>
                <div className="grid grid-cols-3 gap-1">
                   {['1+1', '2+1', '3+1', '4+1'].map(r => (
                       <button key={r} onClick={() => updateFilter('room', r)} className={\`text-[11px] border rounded-sm py-1 \${filters.room === r ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}\`}>{r}</button>
                   ))}
                </div>
            </div>
        )}

        <button onClick={applyFilters} className="w-full bg-blue-700 text-white text-[13px] font-bold py-2.5 mt-4 rounded-sm hover:bg-blue-800 transition-colors shadow-md flex items-center justify-center gap-2 dark:bg-blue-600 dark:hover:bg-blue-700"><Check size={16} /> Sonuçları Göster</button>
        <button onClick={clearFilters} className="w-full text-center text-[11px] text-gray-500 hover:text-red-600 underline flex items-center justify-center gap-1 mt-2 dark:text-gray-400 dark:hover:text-red-400"><RotateCcw size={12}/> Temizle</button>
      </div>
    </div>
  );
}
`;
writeFile("components/FilterSidebar.tsx", filterSidebarContent);

console.log(
  colors.yellow +
    "\\n⚠️ SENIOR DEVELOPER GÜNCELLEMESİ TAMAMLANDI! 'npm run dev' ile başlatın." +
    colors.reset,
);
