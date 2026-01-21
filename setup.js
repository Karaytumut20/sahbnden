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
    "\n🚀 SENIOR UPGRADE: REPORTING SYSTEM, ADVANCED COMPARE & ROBOTS...\n" +
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
// 1. LIB/ACTIONS.TS (REPORT ACTION EKLENDİ)
// =============================================================================
const actionsContent = `
'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath, unstable_cache } from 'next/cache'
import { adSchema } from '@/lib/schemas'

// --- RAPORLAMA SİSTEMİ (YENİ) ---
export async function createReportAction(adId: number, reason: string, description: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Şikayet etmek için giriş yapmalısınız.' };

    const { error } = await supabase.from('reports').insert([{
        ad_id: adId,
        user_id: user.id,
        reason,
        description,
        status: 'pending'
    }]);

    if (error) {
        console.error('Report Error:', error);
        return { error: 'Şikayetiniz iletilemedi.' };
    }

    return { success: true };
}

// --- MEVCUT AKSİYONLAR (KORUNUYOR) ---
export const getCategoryTreeServer = unstable_cache(
  async () => {
    const supabase = await createClient();
    const { data } = await supabase.from('categories').select('*').order('title');
    if (!data) return [];
    const parents = data.filter(c => !c.parent_id);
    return parents.map(p => ({ ...p, subs: data.filter(c => c.parent_id === p.id) }));
  }, ['category-tree'], { revalidate: 3600 }
);

export async function getAdsServer(searchParams: any) {
  const supabase = await createClient()
  const page = Number(searchParams?.page) || 1;
  const limit = 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase.from('ads').select('*, profiles(full_name), categories(title)', { count: 'exact' }).eq('status', 'yayinda');

  if (searchParams?.q) query = query.ilike('title', \`%\${searchParams.q}%\`);
  if (searchParams?.minPrice) query = query.gte('price', searchParams.minPrice);
  if (searchParams?.maxPrice) query = query.lte('price', searchParams.maxPrice);
  if (searchParams?.city) query = query.eq('city', searchParams.city);
  if (searchParams?.category) {
      const slug = searchParams.category;
      if (slug === 'emlak') query = query.or('category.ilike.konut%,category.ilike.isyeri%,category.ilike.arsa%');
      else if (slug === 'konut') query = query.ilike('category', 'konut%');
      else if (slug === 'is-yeri') query = query.ilike('category', 'isyeri%');
      else if (slug === 'vasita') query = query.or('category.eq.otomobil,category.eq.suv,category.eq.motosiklet');
      else query = query.eq('category', slug);
  }
  if (searchParams?.sort === 'price_asc') query = query.order('price', { ascending: true });
  else if (searchParams?.sort === 'price_desc') query = query.order('price', { ascending: false });
  else query = query.order('created_at', { ascending: false });

  query = query.range(from, to);
  const { data, count, error } = await query;

  if (error) return { data: [], count: 0, totalPages: 0 };
  return { data: data || [], count: count || 0, totalPages: count ? Math.ceil(count / limit) : 0 };
}

export async function createAdAction(formData: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Oturum açmanız gerekiyor.' }

  const validation = adSchema.safeParse(formData);
  if (!validation.success) return { error: validation.error.issues[0].message };

  const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).single();
  if (!profile) await supabase.from('profiles').insert([{ id: user.id, email: user.email }]);

  const { data, error } = await supabase.from('ads').insert([{
    ...validation.data,
    user_id: user.id,
    status: 'onay_bekliyor',
    is_vitrin: false,
    is_urgent: false
  }]).select('id').single()

  if (error) return { error: 'Veritabanı hatası.' }
  revalidatePath('/');
  return { success: true, adId: data.id }
}

export async function getInfiniteAdsAction(page = 1, limit = 20) {
    const supabase = await createClient();
    try {
        const { data, error } = await supabase.rpc('get_random_ads', { limit_count: limit });
        if (!error && data && data.length > 0) return { data: data, total: 100, hasMore: true };
    } catch (e) {}
    const start = (page - 1) * limit;
    const end = start + limit - 1;
    const { data, count } = await supabase.from('ads').select('*, profiles(full_name)', { count: 'exact' }).eq('status', 'yayinda').order('created_at', { ascending: false }).range(start, end);
    return { data: data || [], total: count || 0, hasMore: (count || 0) > end + 1 };
}

export async function getAdDetailServer(id: number) {
  const supabase = await createClient()
  const { data } = await supabase.from('ads').select('*, profiles(*), categories(title)').eq('id', id).single()
  return data
}

export async function updateAdAction(id: number, formData: any) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Giriş yapmalısınız' }
    const { error } = await supabase.from('ads').update({ ...formData, status: 'onay_bekliyor' }).eq('id', id).eq('user_id', user.id)
    if (error) return { error: error.message }
    revalidatePath('/bana-ozel/ilanlarim')
    return { success: true }
}

export async function activateDopingAction(adId: number, dopingTypes: string[]) {
  const supabase = await createClient();
  const updates: any = {};
  if (dopingTypes.includes('1')) updates.is_vitrin = true;
  if (dopingTypes.includes('2')) updates.is_urgent = true;
  const { error } = await supabase.from('ads').update(updates).eq('id', adId);
  if (error) return { error: error.message };
  revalidatePath('/');
  return { success: true };
}

export async function getStoreBySlugServer(slug: string) {
    const supabase = await createClient()
    const { data } = await supabase.from('stores').select('*').eq('slug', slug).single()
    return data
}

export async function getStoreAdsServer(userId: string) {
    const supabase = await createClient()
    const { data } = await supabase.from('ads').select('*').eq('user_id', userId).eq('status', 'yayinda')
    return data || []
}

export async function createStoreAction(formData: any) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Giriş yapmalısınız' }
    const { error } = await supabase.from('stores').insert([{ ...formData, user_id: user.id }])
    if (error) return { error: error.message }
    await supabase.from('profiles').update({ role: 'store' }).eq('id', user.id)
    revalidatePath('/bana-ozel/magazam')
    return { success: true }
}

export async function updateStoreAction(formData: any) {
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

export async function getAdminStatsServer() {
    const supabase = await createClient();
    const [users, ads, revenue] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('ads').select('*', { count: 'exact', head: true }).eq('status', 'yayinda'),
        supabase.from('ads').select('*', { count: 'exact', head: true }).or('is_vitrin.eq.true,is_urgent.eq.true')
    ]);
    const estimatedRevenue = (revenue.count || 0) * 100;
    return { totalUsers: users.count || 0, activeAds: ads.count || 0, totalRevenue: estimatedRevenue };
}

export async function getPageBySlugServer(slug: string) {
  const contentMap: any = {
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

export async function getAdsByIds(ids: number[]) {
    if (!ids || ids.length === 0) return [];
    const supabase = await createClient();
    const { data } = await supabase.from('ads').select('*, profiles(full_name)').in('id', ids);
    return data || [];
}

export async function getShowcaseAdsServer() {
  const supabase = await createClient()
  const { data } = await supabase.from('ads').select('*').eq('status', 'yayinda').eq('is_vitrin', true).limit(20)
  return data || []
}

export async function getRelatedAdsServer(category: string, currentId: number) {
    const supabase = await createClient();
    const { data } = await supabase.from('ads').select('*').eq('category', category).eq('status', 'yayinda').neq('id', currentId).limit(5);
    return data || [];
}

export async function getAdminAdsClient() {
  const supabase = await createClient();
  const { data } = await supabase.from('ads').select('*, profiles(full_name)').order('created_at', { ascending: false });
  return data || [];
}

export async function approveAdAction(adId: number) {
    const supabase = await createClient();
    const { error } = await supabase.from('ads').update({ status: 'yayinda' }).eq('id', adId);
    if(error) return { error: error.message };
    revalidatePath('/admin/ilanlar');
    return { success: true };
}

export async function rejectAdAction(adId: number, reason: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('ads').update({ status: 'reddedildi' }).eq('id', adId);
    if(error) return { error: error.message };
    revalidatePath('/admin/ilanlar');
    return { success: true };
}

export async function getAdFavoriteCount(adId: number) {
    const supabase = await createClient();
    const { count } = await supabase.from('favorites').select('*', { count: 'exact', head: true }).eq('ad_id', adId);
    return count || 0;
}
`;
writeFile("lib/actions.ts", actionsContent);

// =============================================================================
// 2. COMPONENTS/MODALS/REPORTMODAL.TSX (SERVER ACTION BAĞLANTISI)
// =============================================================================
const reportModalContent = `
"use client";
import React, { useState } from 'react';
import { useModal } from '@/context/ModalContext';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import { createReportAction } from '@/lib/actions';
import { useToast } from '@/context/ToastContext';

export default function ReportModal() {
  const { isReportOpen, closeReport, reportData } = useModal();
  const { addToast } = useToast();
  const [reason, setReason] = useState('yaniltici');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isReportOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportData?.adId) return;

    setLoading(true);
    const res = await createReportAction(reportData.adId, reason, description);
    setLoading(false);

    if (res.error) {
        addToast(res.error, 'error');
    } else {
        addToast('Şikayetiniz alındı. Teşekkür ederiz.', 'success');
        closeReport();
        setDescription('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-md w-full max-w-md shadow-xl animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <AlertTriangle className="text-red-500" size={20} /> İlanı Şikayet Et
          </h3>
          <button onClick={closeReport} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Şikayet Nedeni</label>
            <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full border border-gray-300 rounded-sm h-10 px-3 text-sm outline-none focus:border-blue-500"
            >
                <option value="yaniltici">Yanıltıcı Bilgi / Fotoğraf</option>
                <option value="dolandiricilik">Dolandırıcılık Şüphesi</option>
                <option value="kufur">Küfür / Hakaret</option>
                <option value="kategori">Yanlış Kategori</option>
                <option value="diger">Diğer</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Açıklama (İsteğe Bağlı)</label>
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-sm p-3 text-sm h-24 resize-none outline-none focus:border-blue-500"
                placeholder="Lütfen detay veriniz..."
            ></textarea>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={closeReport} className="px-4 py-2 text-gray-600 text-sm font-bold hover:bg-gray-100 rounded-sm">Vazgeç</button>
            <button
                type="submit"
                disabled={loading}
                className="bg-red-600 text-white px-6 py-2 rounded-sm text-sm font-bold hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
            >
                {loading && <Loader2 size={16} className="animate-spin" />} Şikayet Et
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
`;
writeFile("components/modals/ReportModal.tsx", reportModalContent);

// =============================================================================
// 3. APP/KARSILASTIR/PAGE.TSX (GELİŞMİŞ KARŞILAŞTIRMA MATRİSİ)
// =============================================================================
const comparePageContent = `
"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCompare } from '@/context/CompareContext';
import { getAdsByIds } from '@/lib/actions';
import { Check, X, Trash2, ArrowLeft, AlertCircle } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import { Loader2 } from 'lucide-react';

export default function ComparePage() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (compareList.length === 0) {
        setAds([]);
        setLoading(false);
        return;
    }
    setLoading(true);
    getAdsByIds(compareList).then((data) => {
        setAds(data);
        setLoading(false);
    });
  }, [compareList]);

  if (compareList.length === 0) {
    return (
        <div className="p-10 container max-w-[1150px] mx-auto">
            <EmptyState
                icon={AlertCircle}
                title="Karşılaştırma Listeniz Boş"
                description="İlanları karşılaştırmak için detay sayfalarından 'Karşılaştır' butonuna tıklayınız."
                actionLabel="İlanlara Git"
                actionUrl="/search"
            />
        </div>
    );
  }

  if (loading) return <div className="p-20 text-center flex justify-center"><Loader2 className="animate-spin"/></div>;

  // Ortak özellikler
  const features = [
    { label: 'Fiyat', key: 'price', format: (v: any, ad: any) => \`\${v?.toLocaleString()} \${ad.currency}\` },
    { label: 'İl / İlçe', key: 'city', format: (v: any, ad: any) => \`\${v} / \${ad.district}\` },
    { label: 'İlan Tarihi', key: 'created_at', format: (v: any) => new Date(v).toLocaleDateString() },
    { label: 'Kategori', key: 'category' },
    // Dinamik alanlar
    { label: 'Marka', key: 'brand' },
    { label: 'Model', key: 'model' },
    { label: 'Yıl', key: 'year' },
    { label: 'KM', key: 'km', format: (v: any) => v ? \`\${v} KM\` : '-' },
    { label: 'Yakıt', key: 'fuel' },
    { label: 'Vites', key: 'gear' },
    { label: 'm²', key: 'm2' },
    { label: 'Oda', key: 'room' },
    { label: 'Kat', key: 'floor' },
    { label: 'Isıtma', key: 'heating' },
  ];

  return (
    <div className="container max-w-[1150px] mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">İlan Karşılaştırma</h1>
        <div className="flex gap-4">
            <Link href="/" className="text-sm text-blue-600 hover:underline flex items-center gap-1"><ArrowLeft size={16}/> Alışverişe Dön</Link>
            <button onClick={clearCompare} className="text-sm text-red-600 hover:underline flex items-center gap-1"><Trash2 size={16}/> Listeyi Temizle</button>
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm bg-white">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-4 border-b border-r border-gray-100 bg-gray-50 w-[200px] min-w-[150px]">Özellikler</th>
              {ads.map(ad => (
                <th key={ad.id} className="p-4 border-b border-r border-gray-100 min-w-[250px] relative group">
                    <button
                        onClick={() => removeFromCompare(ad.id)}
                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Listeden Çıkar"
                    >
                        <X size={18}/>
                    </button>
                    <div className="h-32 w-full bg-gray-100 rounded-md mb-3 overflow-hidden relative">
                        {ad.image ? (
                            <img src={ad.image} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Resim Yok</div>
                        )}
                        {ad.is_vitrin && <span className="absolute top-0 left-0 bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5">VİTRİN</span>}
                    </div>
                    <Link href={\`/ilan/\${ad.id}\`} className="font-bold text-blue-900 hover:underline line-clamp-2 h-10 text-sm">
                        {ad.title}
                    </Link>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {features.map((feature, idx) => {
               // Eğer hiçbir ilanda bu özellik yoksa satırı gizle (Smart Table)
               const hasValue = ads.some(ad => ad[feature.key] !== null && ad[feature.key] !== undefined);
               if (!hasValue) return null;

               return (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 border-b border-r border-gray-100 font-bold text-gray-600 text-sm bg-gray-50/50">
                        {feature.label}
                    </td>
                    {ads.map(ad => (
                        <td key={ad.id} className="p-4 border-b border-r border-gray-100 text-sm text-gray-800">
                            {feature.format
                                ? feature.format(ad[feature.key], ad)
                                : (ad[feature.key] || <span className="text-gray-300">-</span>)
                            }
                        </td>
                    ))}
                </tr>
               );
            })}
            <tr>
                <td className="p-4 border-r border-gray-100 bg-gray-50"></td>
                {ads.map(ad => (
                    <td key={ad.id} className="p-4 border-r border-gray-100">
                        <Link href={\`/ilan/\${ad.id}\`} className="block w-full bg-[#ffe800] text-black text-center py-2 rounded-sm font-bold text-sm hover:bg-yellow-400">
                            İlanı İncele
                        </Link>
                    </td>
                ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
`;
writeFile("app/karsilastir/page.tsx", comparePageContent);

// =============================================================================
// 4. APP/ROBOTS.TS (DİNAMİK ROBOTS.TXT)
// =============================================================================
const robotsContent = `
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/bana-ozel/', '/admin/', '/ilan-ver/'], // Özel sayfaları engelle
    },
    sitemap: \`\${baseUrl}/sitemap.xml\`,
  };
}
`;
writeFile("app/robots.ts", robotsContent);

console.log(
  colors.yellow +
    "\\n⚠️ SENIOR UPGRADE TAMAMLANDI! 'npm run dev' ile projeyi başlatın." +
    colors.reset,
);
