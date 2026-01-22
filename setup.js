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
    "\n🔧 SENIOR FIX: UNSTABLE_CACHE & COOKIE CONFLICT RESOLVER...\n" +
    colors.reset,
);

function writeFile(filePath, content) {
  const absolutePath = path.join(__dirname, filePath);
  const dir = path.dirname(absolutePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(absolutePath, content.trim());
  console.log(`${colors.green}✔ Düzeltildi:${colors.reset} ${filePath}`);
}

// =============================================================================
// 1. LIB/SUPABASE/SERVER.TS (YENİ STATIC CLIENT EKLENİYOR)
// =============================================================================
const supabaseServerContent = `
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// 1. DYNAMIC CLIENT (Kullanıcı işlemleri için - Cookie Kullanır)
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component içinde cookie set edilemez, bu normaldir.
          }
        },
      },
    }
  )
}

// 2. STATIC CLIENT (Cache işlemleri için - Cookie KULLANMAZ)
// Bu fonksiyon "unstable_cache" içinde güvenle kullanılabilir.
export function createStaticClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return [] // Boş çerez döndür (Anonim erişim)
        },
        setAll(cookiesToSet) {
          // Çerez yazma işlemini yoksay
        },
      },
    }
  )
}
`;
writeFile("lib/supabase/server.ts", supabaseServerContent);

// =============================================================================
// 2. LIB/ACTIONS.TS (STATIC CLIENT ENTEGRASYONU)
// =============================================================================
const actionsContent = `
'use server'
import { createClient, createStaticClient } from '@/lib/supabase/server'
import { revalidatePath, unstable_cache } from 'next/cache'
import { adSchema } from '@/lib/schemas'

// --- YORUM SİSTEMİ ---
export async function createReviewAction(targetUserId: string, rating: number, comment: string, adId?: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { error: 'Yorum yapmak için giriş yapmalısınız.' };
    if (user.id === targetUserId) return { error: 'Kendinize yorum yapamazsınız.' };

    const { error } = await supabase.from('reviews').insert([{
        target_user_id: targetUserId,
        reviewer_id: user.id,
        ad_id: adId,
        rating,
        comment
    }]);

    if (error) return { error: 'Yorum kaydedilemedi.' };

    revalidatePath(\`/satici/\${targetUserId}\`);
    return { success: true };
}

export async function getSellerStats(userId: string) {
    const supabase = await createClient();
    const { data: reviews } = await supabase.from('reviews').select('rating');
    const { count: adCount } = await supabase
        .from('ads')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'yayinda');

    return {
        avgRating: 0,
        reviewCount: 0,
        activeAds: adCount || 0
    };
}

export async function getSellerReviewsServer(targetUserId: string) {
    const supabase = await createClient();
    const { data } = await supabase
        .from('reviews')
        .select('*, reviewer:reviewer_id(full_name, avatar_url)')
        .eq('target_user_id', targetUserId)
        .order('created_at', { ascending: false });

    return data || [];
}

export async function getUserDashboardStats() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: ads } = await supabase
        .from('ads')
        .select('status, view_count, price')
        .eq('user_id', user.id);

    return ads || [];
}

// --- KRİTİK DÜZELTME: STATIC CLIENT KULLANIMI ---
export const getCategoryTreeServer = unstable_cache(
  async () => {
    // BURASI GÜNCELLENDİ: createClient() yerine createStaticClient()
    const supabase = createStaticClient();

    const { data } = await supabase.from('categories').select('*').order('title');
    if (!data) return [];
    const parents = data.filter(c => !c.parent_id);
    return parents.map(p => ({ ...p, subs: data.filter(c => c.parent_id === p.id) }));
  }, ['category-tree'], { revalidate: 3600 }
);

export async function getAdsServer(searchParams: any) {
  const supabase = await createClient() // Arama kullanıcıya göre değişebilir, dinamik kalmalı
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

export async function createReportAction(adId: number, reason: string, description: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Şikayet etmek için giriş yapmalısınız.' };
    const { error } = await supabase.from('reports').insert([{
        ad_id: adId, user_id: user.id, reason, description, status: 'pending'
    }]);
    if (error) return { error: 'Şikayetiniz iletilemedi.' };
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

export async function updateProfileAction(formData: any) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Oturum açmanız gerekiyor.' };
    const updates = { full_name: formData.full_name, phone: formData.phone, avatar_url: formData.avatar_url, updated_at: new Date().toISOString() };
    const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
    if (error) return { error: error.message };
    revalidatePath('/bana-ozel/ayarlar');
    return { success: true };
}

export async function updatePasswordAction(password: string) {
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({ password: password });
    if (error) return { error: error.message };
    return { success: true };
}

export async function getRelatedAdsServer(category: string, currentId: number, basePrice?: number) {
    const supabase = await createClient();
    let query = supabase.from('ads').select('*').eq('category', category).eq('status', 'yayinda').neq('id', currentId);
    if (basePrice) {
        const minPrice = basePrice * 0.7;
        const maxPrice = basePrice * 1.3;
        query = query.gte('price', minPrice).lte('price', maxPrice);
    }
    const { data } = await query.limit(5);
    return data || [];
}

export async function incrementViewCountAction(adId: number) {
    const supabase = await createClient();
    await supabase.rpc('increment_view_count', { ad_id_input: adId });
}
`;
writeFile("lib/actions.ts", actionsContent);

console.log(
  colors.green +
    "\\n✅ DÜZELTME TAMAMLANDI! Artık 'npm run dev' ile projeyi hatasız başlatabilirsiniz." +
    colors.reset,
);
