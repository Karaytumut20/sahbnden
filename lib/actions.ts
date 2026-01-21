'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// --- ANASAYFA İÇİN SONSUZ YÜKLEME (Rastgelelik Destekli) ---
export async function getInfiniteAdsAction(page = 1, limit = 20) {
    const supabase = await createClient();

    // Rastgelelik için RPC (Remote Procedure Call) kullanıyoruz.
    // Eğer 'get_random_ads' SQL fonksiyonu oluşturulmadıysa normal sıralama çalışır.

    try {
        const { data, error } = await supabase.rpc('get_random_ads', { limit_count: limit });

        if (!error && data) {
            return {
                data: data || [],
                total: 100, // Sonsuz hissi vermek için
                hasMore: true
            };
        }
    } catch (e) {
        // RPC yoksa fallback
    }

    // Fallback: Standart sıralama
    const start = (page - 1) * limit;
    const end = start + limit - 1;

    const { data, error, count } = await supabase
        .from('ads')
        .select('*, profiles(full_name)', { count: 'exact' })
        .eq('status', 'yayinda')
        .order('created_at', { ascending: false })
        .range(start, end);

    if(error) return { data: [], total: 0, hasMore: false };

    return {
        data: data || [],
        total: count || 0,
        hasMore: (count || 0) > end + 1
    };
}

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

// --- DİĞER FONKSİYONLAR (Aynen) ---
export async function getCategoryTreeServer() {
  const supabase = await createClient();
  const { data } = await supabase.from('categories').select('*').order('title');
  if (!data) return [];
  const parents = data.filter(c => !c.parent_id);
  return parents.map(p => ({ ...p, subs: data.filter(c => c.parent_id === p.id) }));
}

export async function getAdsServer(searchParams) {
  const supabase = await createClient()
  let query = supabase.from('ads').select('*, profiles(full_name), categories(title)').eq('status', 'yayinda')

  if (searchParams?.q) query = query.ilike('title', `%${searchParams.q}%`)
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
    const { data } = await supabase.from('ads').select('*').eq('category', category).eq('status', 'yayinda').neq('id', currentId).limit(5);
    return data || [];
}

export async function getAdsByIds(ids) {
    if (!ids || ids.length === 0) return [];
    const supabase = await createClient();
    const { data } = await supabase.from('ads').select('*, profiles(full_name)').in('id', ids);
    return data || [];
}

export async function createAdAction(formData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Giriş yapmalısınız' }

  const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).single();
  if (!profile) await supabase.from('profiles').insert([{ id: user.id, email: user.email }]);

  const adData = { ...formData, user_id: user.id, status: 'onay_bekliyor' }
  const { data, error } = await supabase.from('ads').insert([adData]).select('id').single()

  if (error) { console.error('SQL Error:', error); return { error: error.message } }

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