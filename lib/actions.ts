'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// --- KATEGORİLER ---
export async function getCategoriesServer() {
  const supabase = await createClient()
  // Alt kategorileriyle birlikte çekmek için self-join veya recursive query gerekebilir.
  // Basitlik için tüm kategorileri çekip client tarafında tree yapabiliriz veya
  // burada sadece ana kategorileri çekip altlarını lazy load yapabiliriz.
  // Şimdilik düz liste çekiyoruz.
  const { data } = await supabase.from('categories').select('*').order('title');
  return data || [];
}

export async function getCategoryTreeServer() {
  const supabase = await createClient();
  const { data } = await supabase.from('categories').select('*').order('title');

  if (!data) return [];

  // Parent-Child ilişkisini kur
  const parents = data.filter(c => !c.parent_id);
  return parents.map(p => ({
    ...p,
    subs: data.filter(c => c.parent_id === p.id)
  }));
}

// --- İLANLAR ---
export async function getAdsServer(searchParams?: any) {
  const supabase = await createClient()
  let query = supabase.from('ads').select('*, profiles(full_name), categories(title)').eq('status', 'yayinda')

  // Filtreler
  if (searchParams?.q) query = query.ilike('title', `%${searchParams.q}%`)
  if (searchParams?.minPrice) query = query.gte('price', searchParams.minPrice)
  if (searchParams?.maxPrice) query = query.lte('price', searchParams.maxPrice)
  if (searchParams?.city) query = query.eq('city', searchParams.city)

  // Kategori Filtresi (Slug veya ID ile)
  if (searchParams?.category) {
      // Eğer kategori ID ise direkt, slug ise join ile bakmak lazım.
      // Basitlik için category sütununun slug tuttuğunu varsayalım veya join yapalım.
      // Veritabanı tasarımında ads tablosunda category_slug veya category_id olması gerek.
      // Şimdilik 'category' kolonu slug tutuyor varsayıyoruz.
      query = query.eq('category', searchParams.category)
  }

  // Sıralama
  if (searchParams?.sort === 'price_asc') query = query.order('price', { ascending: true })
  else if (searchParams?.sort === 'price_desc') query = query.order('price', { ascending: false })
  else query = query.order('created_at', { ascending: false })

  const { data } = await query
  return data || []
}

export async function getAdDetailServer(id: number) {
  const supabase = await createClient()
  const { data } = await supabase.from('ads').select('*, profiles(*), categories(title)').eq('id', id).single()
  return data
}

export async function getRelatedAdsServer(category: string, currentId: number) {
    const supabase = await createClient();
    const { data } = await supabase.from('ads')
        .select('*')
        .eq('category', category)
        .eq('status', 'yayinda')
        .neq('id', currentId)
        .limit(5);
    return data || [];
}

export async function getShowcaseAdsServer() {
  const supabase = await createClient()
  const { data } = await supabase.from('ads').select('*').eq('status', 'yayinda').order('is_vitrin', { ascending: false }).limit(20)
  return data || []
}

export async function getAdsByIds(ids: number[]) {
    if (!ids || ids.length === 0) return [];
    const supabase = await createClient();
    const { data } = await supabase.from('ads').select('*, profiles(full_name)').in('id', ids);
    return data || [];
}

// --- İÇERİK (CMS) ---
export async function getPageBySlugServer(slug: string) {
    const supabase = await createClient();
    const { data } = await supabase.from('pages').select('*').eq('slug', slug).single();
    return data;
}

export async function getHelpContentServer() {
    const supabase = await createClient();
    const { data: categories } = await supabase.from('faq_categories').select('*');
    const { data: faqs } = await supabase.from('faqs').select('*');
    return { categories: categories || [], faqs: faqs || [] };
}

// --- ADMIN STATS ---
export async function getAdminStatsServer() {
    const supabase = await createClient();

    // Paralel sorgular
    const [users, ads, payments] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('ads').select('*', { count: 'exact', head: true }).eq('status', 'yayinda'),
        supabase.from('payments').select('amount') // Ciro hesabı için
    ]);

    const totalRevenue = payments.data?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

    return {
        totalUsers: users.count || 0,
        activeAds: ads.count || 0,
        totalRevenue
    };
}

// --- İŞLEMLER ---
export async function createAdAction(formData: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Giriş yapmalısınız' }

  const adData = { ...formData, user_id: user.id, status: 'onay_bekliyor' }
  const { data, error } = await supabase.from('ads').insert([adData]).select('id').single()

  if (error) return { error: error.message }
  revalidatePath('/')
  return { success: true, adId: data.id }
}

export async function activateDopingAction(adId: number, dopingTypes: string[]) {
  const supabase = await createClient();

  // Ödeme kaydı oluştur (Opsiyonel ama iyi olur)
  // const { error: payError } = await supabase.from('payments').insert(...)

  const updates: any = {};
  if (dopingTypes.includes('1')) updates.is_vitrin = true;
  if (dopingTypes.includes('2')) updates.is_urgent = true;
  if (dopingTypes.includes('3')) updates.is_bold = true;

  const { error } = await supabase.from('ads').update(updates).eq('id', adId);
  if (error) return { error: error.message };

  revalidatePath('/');
  return { success: true };
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

// --- MAĞAZA ---
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