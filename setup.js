const fs = require("fs");
const path = require("path");

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
  yellow: "\x1b[33m",
};

console.log(
  colors.cyan +
    colors.bold +
    "\n🚀 SAHİBİNDEN CLONE - SİSTEM DOSYALARI ONARILIYOR...\n" +
    colors.reset,
);

function writeFile(filePath, content) {
  const absolutePath = path.join(__dirname, filePath);
  const dir = path.dirname(absolutePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(absolutePath, content.trim());
  console.log(`${colors.green}✔ Güncellendi:${colors.reset} ${filePath}`);
}

// =============================================================================
// 1. LIB/ACTIONS.TS (Eksik Fonksiyonlar Eklendi: activateDopingAction vb.)
// =============================================================================
const actionsContent = `
'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// --- KATEGORİLER ---
export async function getCategoryTreeServer() {
  const supabase = await createClient();
  const { data } = await supabase.from('categories').select('*').order('title');

  if (!data) return [];
  const parents = data.filter(c => !c.parent_id);
  return parents.map(p => ({
    ...p,
    subs: data.filter(c => c.parent_id === p.id)
  }));
}

// --- İLANLAR ---
export async function getAdsServer(searchParams) {
  const supabase = await createClient()

  let query = supabase.from('ads').select('*, profiles(full_name), categories(title)').eq('status', 'yayinda')

  if (searchParams?.q) query = query.ilike('title', \`%\${searchParams.q}%\`)
  if (searchParams?.minPrice) query = query.gte('price', searchParams.minPrice)
  if (searchParams?.maxPrice) query = query.lte('price', searchParams.maxPrice)
  if (searchParams?.city) query = query.eq('city', searchParams.city)

  if (searchParams?.category) {
      const slug = searchParams.category;
      if (slug === 'emlak') query = query.or('category.ilike.konut%,category.ilike.isyeri%,category.ilike.arsa%');
      else if (slug === 'konut') query = query.ilike('category', 'konut%');
      else if (slug === 'is-yeri') query = query.ilike('category', 'isyeri%');
      else if (slug === 'vasita') query = query.or('category.eq.otomobil,category.eq.suv,category.eq.motosiklet');
      else query = query.eq('category', slug);
  }

  if (searchParams?.room) query = query.eq('room', searchParams.room)
  if (searchParams?.minYear) query = query.gte('year', searchParams.minYear)
  if (searchParams?.maxYear) query = query.lte('year', searchParams.maxYear)

  if (searchParams?.sort === 'price_asc') query = query.order('price', { ascending: true })
  else if (searchParams?.sort === 'price_desc') query = query.order('price', { ascending: false })
  else query = query.order('created_at', { ascending: false })

  const { data } = await query
  return data || []
}

export async function getAdDetailServer(id) {
  const supabase = await createClient()
  const { data } = await supabase.from('ads').select('*, profiles(*), categories(title)').eq('id', id).single()
  return data
}

export async function getShowcaseAdsServer() {
  const supabase = await createClient()
  const { data } = await supabase.from('ads').select('*').eq('status', 'yayinda').eq('is_vitrin', true).limit(20)
  return data || []
}

export async function getRelatedAdsServer(category, currentId) {
    const supabase = await createClient();
    const { data } = await supabase.from('ads')
        .select('*')
        .eq('category', category)
        .eq('status', 'yayinda')
        .neq('id', currentId)
        .limit(5);
    return data || [];
}

export async function getAdsByIds(ids) {
    if (!ids || ids.length === 0) return [];
    const supabase = await createClient();
    const { data } = await supabase.from('ads').select('*, profiles(full_name)').in('id', ids);
    return data || [];
}

// --- İŞLEMLER (CREATE / UPDATE) ---
export async function createAdAction(formData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Giriş yapmalısınız' }

  // Profil kontrolü
  const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).single();
  if (!profile) {
      await supabase.from('profiles').insert([{ id: user.id, email: user.email }]);
  }

  const adData = { ...formData, user_id: user.id, status: 'onay_bekliyor' }
  const { data, error } = await supabase.from('ads').insert([adData]).select('id').single()

  if (error) {
    console.error('SQL Error:', error);
    return { error: error.message }
  }

  revalidatePath('/')
  return { success: true, adId: data.id }
}

export async function updateAdAction(id, formData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Giriş yapmalısınız' }

    const { error } = await supabase.from('ads').update({ ...formData, status: 'onay_bekliyor' }).eq('id', id).eq('user_id', user.id)
    if (error) return { error: error.message }

    revalidatePath('/bana-ozel/ilanlarim')
    return { success: true }
}

// --- DOPING (Eksik olan fonksiyon eklendi) ---
export async function activateDopingAction(adId, dopingTypes) {
  const supabase = await createClient();

  const updates = {};
  if (dopingTypes.includes('1')) updates.is_vitrin = true;
  if (dopingTypes.includes('2')) updates.is_urgent = true;

  const { error } = await supabase.from('ads').update(updates).eq('id', adId);

  if (error) return { error: error.message };

  revalidatePath('/');
  return { success: true };
}

// --- MAĞAZA ---
export async function getStoreBySlugServer(slug) {
    const supabase = await createClient()
    const { data } = await supabase.from('stores').select('*').eq('slug', slug).single()
    return data
}

export async function getStoreAdsServer(userId) {
    const supabase = await createClient()
    const { data } = await supabase.from('ads').select('*').eq('user_id', userId).eq('status', 'yayinda')
    return data || []
}

export async function createStoreAction(formData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Giriş yapmalısınız' }

    const { error } = await supabase.from('stores').insert([{ ...formData, user_id: user.id }])
    if (error) return { error: error.message }

    await supabase.from('profiles').update({ role: 'store' }).eq('id', user.id)
    revalidatePath('/bana-ozel/magazam')
    return { success: true }
}

export async function updateStoreAction(formData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Giriş yapmalısınız' }
    const { error } = await supabase.from('stores').update(formData).eq('user_id', user.id)
    if (error) return { error: error.message }
    revalidatePath('/bana-ozel/magazam')
    return { success: true }
}

export async function getMyStoreServer() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if(!user) return null
    const { data } = await supabase.from('stores').select('*').eq('user_id', user.id).single()
    return data
}

// --- DİĞER ---
export async function getAdminStatsServer() {
    return { totalUsers: 10, activeAds: 5, totalRevenue: 1500 };
}

export async function getPageBySlugServer(slug) {
  const contentMap = {
      'hakkimizda': { title: 'Hakkımızda', content: '<p>Sahibinden klon projesi...</p>' },
      'kullanim-kosullari': { title: 'Kullanım Koşulları', content: '<p>Koşullar...</p>' },
      'gizlilik-politikasi': { title: 'Gizlilik Politikası', content: '<p>Gizlilik...</p>' },
  };
  return contentMap[slug] || null;
}

export async function getHelpContentServer() {
  return {
      categories: [{id: 1, title: 'Üyelik', description: 'Giriş işlemleri'}],
      faqs: [{id: 1, question: 'Şifremi unuttum?', answer: 'Şifremi unuttum linkine tıklayın.'}]
  };
}
`;
writeFile("lib/actions.ts", actionsContent);

// =============================================================================
// 2. LIB/DATA.TS (Statik Veriler)
// =============================================================================
const dataContent = `
import { Home, Car, Monitor, Briefcase, ShoppingCart, Map, Sun } from 'lucide-react';

export const categories = [
  {
    id: 'emlak',
    title: 'Emlak',
    icon: 'Home',
    slug: 'emlak',
    subs: [
      {
        id: 'konut',
        title: 'Konut',
        slug: 'konut',
        subs: [
            { id: 'konut-satilik', title: 'Satılık', slug: 'konut-satilik' },
            { id: 'konut-kiralik', title: 'Kiralık', slug: 'konut-kiralik' },
            { id: 'gunluk-kiralik', title: 'Günlük Kiralık', slug: 'gunluk-kiralik' },
        ]
      },
      {
        id: 'isyeri',
        title: 'İş Yeri',
        slug: 'is-yeri',
        subs: [
            { id: 'isyeri-satilik', title: 'Satılık İş Yeri', slug: 'isyeri-satilik' },
            { id: 'isyeri-kiralik', title: 'Kiralık İş Yeri', slug: 'isyeri-kiralik' },
        ]
      },
      {
        id: 'arsa',
        title: 'Arsa',
        slug: 'arsa',
        subs: [
            { id: 'arsa-satilik', title: 'Satılık Arsa', slug: 'arsa-satilik' },
            { id: 'arsa-kiralik', title: 'Kiralık Arsa', slug: 'arsa-kiralik' },
        ]
      }
    ]
  },
  {
    id: 'vasita',
    title: 'Vasıta',
    icon: 'Car',
    slug: 'vasita',
    subs: [
      { id: 'oto', title: 'Otomobil', slug: 'otomobil' },
      { id: 'suv', title: 'Arazi, SUV & Pickup', slug: 'arazi-suv-pickup' },
      { id: 'moto', title: 'Motosiklet', slug: 'motosiklet' },
    ]
  },
  {
    id: 'alisveris',
    title: 'İkinci El ve Sıfır Alışveriş',
    icon: 'ShoppingCart',
    slug: 'alisveris',
    subs: [
      { id: 'pc', title: 'Bilgisayar', slug: 'bilgisayar' },
      { id: 'phone', title: 'Cep Telefonu', slug: 'cep-telefonu-ve-aksesuar' },
    ]
  }
];

export const cities = ['İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa', 'Adana', 'Konya', 'Gaziantep', 'Şanlıurfa', 'Kocaeli'];
`;
writeFile("lib/data.ts", dataContent);

// =============================================================================
// 3. APP/ILAN-VER/DETAY/PAGE.TSX (İlan Verme Formu)
// =============================================================================
const pageContent = `
"use client";
import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import RealEstateFields from '@/components/form/RealEstateFields';
import VehicleFields from '@/components/form/VehicleFields';
import ImageUploader from '@/components/ui/ImageUploader';
import { createAdAction } from '@/lib/actions';

function PostAdFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  const { user } = useAuth();

  const categorySlug = searchParams.get('cat') || '';
  const categoryPath = searchParams.get('path') || 'Kategori Seçilmedi';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({});

  const isRealEstate = categorySlug.includes('konut') || categorySlug.includes('isyeri') || categorySlug.includes('arsa') || categorySlug.includes('bina');
  const isVehicle = categorySlug.includes('otomobil') || categorySlug.includes('suv') || categorySlug.includes('moto');

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleDynamicChange = (name, value) => setFormData({ ...formData, [name]: value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { router.push('/login'); return; }

    setIsSubmitting(true);

    const finalData = {
        ...formData,
        category: categorySlug,
        image: images[0] || null,
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
        <section>
            <h3 className="font-bold text-sm text-[#333] mb-4 border-b pb-2">İlan Detayları</h3>
            <div className="space-y-4 px-2">
                <div><label className="block text-[11px] font-bold text-gray-600 mb-1">İlan Başlığı</label><input name="title" onChange={handleInputChange} className="w-full border p-2 rounded-sm text-sm" required placeholder="Örn: Sahibinden temiz..." /></div>
                <div><label className="block text-[11px] font-bold text-gray-600 mb-1">Açıklama</label><textarea name="description" onChange={handleInputChange} className="w-full border p-2 rounded-sm text-sm h-32" required></textarea></div>
                <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-[11px] font-bold text-gray-600 mb-1">Fiyat</label><input name="price" type="number" onChange={handleInputChange} className="w-full border p-2 rounded-sm text-sm" required placeholder="0" /></div>
                    <div><label className="block text-[11px] font-bold text-gray-600 mb-1">Para Birimi</label><select name="currency" onChange={handleInputChange} className="w-full border p-2 rounded-sm text-sm"><option>TL</option><option>USD</option><option>EUR</option></select></div>
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
            <div className="px-2"><ImageUploader onImagesChange={setImages} /></div>
        </section>

        <section>
            <h3 className="font-bold text-sm text-[#333] mb-4 border-b pb-2">Adres Bilgileri</h3>
            <div className="px-2 grid grid-cols-2 gap-4">
                <div><label className="block text-[11px] font-bold text-gray-600 mb-1">İl</label><select name="city" onChange={handleInputChange} className="w-full border p-2 rounded-sm text-sm"><option>İstanbul</option><option>Ankara</option><option>İzmir</option></select></div>
                <div><label className="block text-[11px] font-bold text-gray-600 mb-1">İlçe</label><input name="district" onChange={handleInputChange} className="w-full border p-2 rounded-sm text-sm" /></div>
            </div>
        </section>

        <div className="pt-4 flex items-center gap-4">
            <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-gray-300 rounded-sm font-bold text-sm text-gray-600 hover:bg-gray-50 flex items-center gap-2"><ArrowLeft size={16}/> Geri Dön</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 bg-[#ffe800] py-3 font-bold text-sm rounded-sm hover:bg-yellow-400 disabled:opacity-50 flex items-center justify-center gap-2 text-black shadow-sm transition-colors">{isSubmitting ? <><Loader2 className="animate-spin" size={18}/> Kaydediliyor...</> : 'Kaydet ve Devam Et'}</button>
        </div>
      </form>
    </div>
  );
}

export default function PostAdPage() {
    return <Suspense fallback={<div className="p-10 text-center">Yükleniyor...</div>}><PostAdFormContent /></Suspense>
}
`;
writeFile("app/ilan-ver/detay/page.tsx", pageContent);

// -------------------------------------------------------------------------
// 4. LIB/UPLOAD.TS (Yedek - Bucket 'ads' olarak ayarlandı)
// -------------------------------------------------------------------------
const uploadTsContent = `
import { supabase } from './supabase';

export async function uploadImage(file: File) {
  const fileExt = file.name.split('.').pop();
  const cleanFileName = Math.random().toString(36).substring(2, 15);
  const fileName = \`\${Date.now()}-\${cleanFileName}.\${fileExt}\`;

  const { error: uploadError } = await supabase.storage
    .from('ads')
    .upload(fileName, file);

  if (uploadError) {
    console.error('Yükleme hatası:', uploadError);
    throw uploadError;
  }

  const { data } = supabase.storage.from('ads').getPublicUrl(fileName);
  return data.publicUrl;
}
`;

writeFile("lib/upload.ts", uploadTsContent);
console.log(colors.yellow + "\\n⚠️ Setup başarıyla tamamlandı!" + colors.reset);
