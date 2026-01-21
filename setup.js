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
    "\n🚀 SENIOR UPGRADE: SCALABILITY & DB PERFORMANCE...\n" +
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
// 1. LIB/ACTIONS.TS (PAGINATION DESTEKLİ GELİŞMİŞ SORGULAR)
// =============================================================================
const actionsContent = `
'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { adSchema } from '@/lib/schemas'

// --- SEARCH PAGE (SAYFALAMA DESTEKLİ) ---
// Artık tüm veriyi değil, sadece istenen sayfayı çeker.
export async function getAdsServer(searchParams: any) {
  const supabase = await createClient()

  // Sayfalama Ayarları
  const page = Number(searchParams?.page) || 1;
  const limit = 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('ads')
    .select('*, profiles(full_name), categories(title)', { count: 'exact' }) // Toplam sayıyı da al
    .eq('status', 'yayinda');

  // Filtreler
  if (searchParams?.q) query = query.ilike('title', \`%\${searchParams.q}%\`);
  if (searchParams?.minPrice) query = query.gte('price', searchParams.minPrice);
  if (searchParams?.maxPrice) query = query.lte('price', searchParams.maxPrice);
  if (searchParams?.city) query = query.eq('city', searchParams.city);

  // Kategori Mantığı
  if (searchParams?.category) {
      const slug = searchParams.category;
      if (slug === 'emlak') query = query.or('category.ilike.konut%,category.ilike.isyeri%,category.ilike.arsa%');
      else if (slug === 'konut') query = query.ilike('category', 'konut%');
      else if (slug === 'is-yeri') query = query.ilike('category', 'isyeri%');
      else if (slug === 'vasita') query = query.or('category.eq.otomobil,category.eq.suv,category.eq.motosiklet');
      else query = query.eq('category', slug);
  }

  // Özellik Filtreleri
  if (searchParams?.room) query = query.eq('room', searchParams.room);
  if (searchParams?.minYear) query = query.gte('year', searchParams.minYear);
  if (searchParams?.maxYear) query = query.lte('year', searchParams.maxYear);

  // Sıralama
  if (searchParams?.sort === 'price_asc') query = query.order('price', { ascending: true });
  else if (searchParams?.sort === 'price_desc') query = query.order('price', { ascending: false });
  else query = query.order('created_at', { ascending: false });

  // Sayfalama Uygula
  query = query.range(from, to);

  const { data, count, error } = await query;

  if (error) {
    console.error('Search Error:', error);
    return { data: [], count: 0, totalPages: 0 };
  }

  return {
    data: data || [],
    count: count || 0,
    totalPages: count ? Math.ceil(count / limit) : 0
  };
}

// --- DİĞER AKSİYONLAR (KORUNDU) ---
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
        // RPC varsa kullan, yoksa fallback
        const { data, error } = await supabase.rpc('get_random_ads', { limit_count: limit });
        if (!error && data && data.length > 0) return { data: data, total: 100, hasMore: true };
    } catch (e) {}

    const start = (page - 1) * limit;
    const end = start + limit - 1;
    const { data, count } = await supabase.from('ads').select('*, profiles(full_name)', { count: 'exact' }).eq('status', 'yayinda').order('created_at', { ascending: false }).range(start, end);
    return { data: data || [], total: count || 0, hasMore: (count || 0) > end + 1 };
}

export async function getCategoryTreeServer() {
  const supabase = await createClient();
  const { data } = await supabase.from('categories').select('*').order('title');
  if (!data) return [];
  const parents = data.filter(c => !c.parent_id);
  return parents.map(p => ({ ...p, subs: data.filter(c => c.parent_id === p.id) }));
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
    return { totalUsers: 10, activeAds: 5, totalRevenue: 1500 };
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
`;
writeFile("lib/actions.ts", actionsContent);

// =============================================================================
// 2. APP/SEARCH/PAGE.TSX (SAYFALAMA GÜNCELLEMESİ)
// =============================================================================
const searchPageContent = `
import React from 'react';
import { getAdsServer } from '@/lib/actions';
import FilterSidebar from '@/components/FilterSidebar';
import MapView from '@/components/MapView';
import SearchHeader from '@/components/SearchHeader';
import AdCard from '@/components/AdCard';
import ViewToggle from '@/components/ViewToggle';
import Pagination from '@/components/Pagination';
import { Metadata } from 'next';
import { categories } from '@/lib/data';
import EmptyState from '@/components/ui/EmptyState';
import { SearchX } from 'lucide-react';

type Props = {
  searchParams: Promise<{ q?: string; category?: string; minPrice?: string; maxPrice?: string; city?: string; sort?: string; view?: string; page?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  let title = "Tüm İlanlar";
  if (params.q) title = \`"\${params.q}" Arama Sonuçları\`;
  else if (params.category) title = \`\${params.category} İlanları\`;
  if (params.city) title += \` - \${params.city}\`;
  return { title: \`\${title} | sahibinden.com Klon\` };
}

export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const { data: ads, count, totalPages } = await getAdsServer(params);
  const viewMode = (params.view || 'table') as 'grid' | 'list' | 'table' | 'map';
  const currentPage = Number(params.page) || 1;

  return (
    <div className="flex gap-4 pt-4">
      {/* Sol Sidebar */}
      <div className="w-[240px] shrink-0 hidden md:block">
        <FilterSidebar />
      </div>

      {/* Ana İçerik */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-end mb-3 pb-2 border-b border-gray-200">
            <SearchHeader total={count} query={params.q} currentSort={params.sort} currentView={viewMode} />
            <div className="ml-4"><ViewToggle currentView={viewMode} /></div>
        </div>

        {viewMode === 'map' ? (
          <MapView ads={ads} />
        ) : (
          <>
            {viewMode === 'table' ? (
              <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200 text-[11px] text-gray-500 font-semibold uppercase">
                      <th className="p-3">Görsel</th>
                      <th className="p-3">İlan Başlığı</th>
                      <th className="p-3">Fiyat</th>
                      <th className="p-3">İlan Tarihi</th>
                      <th className="p-3">İl / İlçe</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ads.map((ad: any) => <AdCard key={ad.id} ad={ad} viewMode="table" />)}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className={\`grid gap-4 \${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}\`}>
                {ads.map((ad: any) => <AdCard key={ad.id} ad={ad} viewMode={viewMode} />)}
              </div>
            )}

            {ads.length === 0 ? (
              <EmptyState
                icon={SearchX}
                title="Sonuç Bulunamadı"
                description="Arama kriterlerinize uygun ilan bulunmamaktadır. Filtreleri temizleyerek tekrar deneyebilirsiniz."
              />
            ) : (
              <Pagination currentPage={currentPage} totalPages={totalPages} />
            )}
          </>
        )}
      </div>
    </div>
  );
}
`;
writeFile("app/search/page.tsx", searchPageContent);

console.log(
  colors.yellow +
    "\\n⚠️ SCALABILITY UPGRADE TAMAMLANDI! 'npm run dev' ile başlatın." +
    colors.reset,
);
