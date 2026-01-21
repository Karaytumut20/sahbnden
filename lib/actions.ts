'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// --- İLAN LİSTELEME & FİLTRELEME ---
export async function getAdsServer(searchParams?: any) {
  const supabase = await createClient()
  let query = supabase.from('ads').select('*, profiles(full_name)').eq('status', 'yayinda')

  // Temel Filtreler
  if (searchParams?.category) query = query.eq('category', searchParams.category)
  if (searchParams?.q) query = query.ilike('title', `%${searchParams.q}%`)
  if (searchParams?.minPrice) query = query.gte('price', searchParams.minPrice)
  if (searchParams?.maxPrice) query = query.lte('price', searchParams.maxPrice)
  if (searchParams?.city) query = query.eq('city', searchParams.city)

  // Detaylı Filtreler (JSONB veya Sütun bazlı)
  // Not: Veritabanında bu sütunların olduğunu varsayıyoruz.
  if (searchParams?.room) query = query.eq('room', searchParams.room)
  if (searchParams?.minYear) query = query.gte('year', searchParams.minYear)
  if (searchParams?.maxYear) query = query.lte('year', searchParams.maxYear)
  if (searchParams?.maxKm) query = query.lte('km', searchParams.maxKm)

  // Sıralama
  if (searchParams?.sort === 'price_asc') query = query.order('price', { ascending: true })
  else if (searchParams?.sort === 'price_desc') query = query.order('price', { ascending: false })
  else if (searchParams?.sort === 'date_asc') query = query.order('created_at', { ascending: true })
  else query = query.order('created_at', { ascending: false }) // Varsayılan: En yeni

  const { data } = await query
  return data || []
}

// --- TEKİL İLAN GETİRME ---
export async function getAdDetailServer(id: number) {
  const supabase = await createClient()
  const { data } = await supabase.from('ads').select('*, profiles(*)').eq('id', id).single()
  return data
}

// --- KARŞILAŞTIRMA İÇİN ÇOKLU İLAN GETİRME (YENİ) ---
export async function getAdsByIds(ids: number[]) {
  if (!ids || ids.length === 0) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from('ads')
    .select('*, profiles(full_name)')
    .in('id', ids);
  return data || [];
}

// --- İLAN OLUŞTURMA ---
export async function createAdAction(formData: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Giriş yapmalısınız' }

  const adData = { ...formData, user_id: user.id, status: 'onay_bekliyor' }
  const { data, error } = await supabase.from('ads').insert([adData]).select('id').single()

  if (error) return { error: error.message }
  revalidatePath('/')
  // İlan ID'sini dönüyoruz ki doping sayfasına yönlendirebilelim
  return { success: true, adId: data.id }
}

// --- DOPING AKTİVASYONU (YENİ) ---
export async function activateDopingAction(adId: number, dopingTypes: string[]) {
  const supabase = await createClient();

  // Güvenlik: Sadece kendi ilanı mı kontrol edilebilir (Opsiyonel)

  const updates: any = {};
  if (dopingTypes.includes('1')) updates.is_vitrin = true; // ID: 1 Ana Sayfa Vitrin
  if (dopingTypes.includes('2')) updates.is_urgent = true; // ID: 2 Acil Acil
  if (dopingTypes.includes('3')) updates.is_bold = true;   // ID: 3 Kalın Yazı

  const { error } = await supabase
    .from('ads')
    .update(updates)
    .eq('id', adId);

  if (error) return { error: error.message };

  revalidatePath('/');
  return { success: true };
}

// --- VİTRİN & MAĞAZA ---
export async function getShowcaseAdsServer() {
  const supabase = await createClient()
  // Hem vitrin işaretlileri hem de en yenileri karışık getirebiliriz
  const { data } = await supabase.from('ads').select('*').eq('status', 'yayinda').order('is_vitrin', { ascending: false }).order('created_at', { ascending: false }).limit(20)
  return data || []
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

export async function updateAdAction(id: number, formData: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Giriş yapmalısınız' }

  const { data: existingAd } = await supabase.from('ads').select('user_id').eq('id', id).single()
  if (!existingAd || existingAd.user_id !== user.id) {
    return { error: 'Bu ilanı düzenleme yetkiniz yok.' }
  }

  const updates = {
    ...formData,
    status: 'onay_bekliyor'
  }

  const { error } = await supabase.from('ads').update(updates).eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/ilan/' + id)
  revalidatePath('/bana-ozel/ilanlarim')
  return { success: true }
}

// --- MAĞAZA YÖNETİMİ ---
export async function createStoreAction(formData: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Giriş yapmalısınız' }

  const storeData = { ...formData, user_id: user.id }
  const { error: storeError } = await supabase.from('stores').insert([storeData])

  if (storeError) {
    if (storeError.code === '23505') return { error: 'Bu mağaza adı/linki zaten kullanılıyor.' }
    return { error: storeError.message }
  }
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
  if (!user) return null
  const { data } = await supabase.from('stores').select('*').eq('user_id', user.id).single()
  return data
}