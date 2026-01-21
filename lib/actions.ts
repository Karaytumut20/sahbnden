'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getAdsServer(searchParams?: any) {
  const supabase = await createClient()
  let query = supabase.from('ads').select('*, profiles(full_name)').eq('status', 'yayinda')

  if (searchParams?.category) query = query.eq('category', searchParams.category)
  if (searchParams?.q) query = query.ilike('title', `%${searchParams.q}%`)
  if (searchParams?.minPrice) query = query.gte('price', searchParams.minPrice)
  if (searchParams?.maxPrice) query = query.lte('price', searchParams.maxPrice)
  if (searchParams?.city) query = query.eq('city', searchParams.city)

  if (searchParams?.sort === 'price_asc') query = query.order('price', { ascending: true })
  else if (searchParams?.sort === 'price_desc') query = query.order('price', { ascending: false })
  else query = query.order('created_at', { ascending: false })

  const { data } = await query
  return data || []
}

export async function getAdDetailServer(id: number) {
  const supabase = await createClient()
  const { data } = await supabase.from('ads').select('*, profiles(*)').eq('id', id).single()
  return data
}

export async function createAdAction(formData: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Giriş yapmalısınız' }

  const adData = { ...formData, user_id: user.id, status: 'onay_bekliyor' }
  const { error } = await supabase.from('ads').insert([adData])

  if (error) return { error: error.message }
  revalidatePath('/')
  return { success: true }
}

export async function getShowcaseAdsServer() {
  const supabase = await createClient()
  const { data } = await supabase.from('ads').select('*').eq('status', 'yayinda').limit(15).order('created_at', { ascending: false })
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

  // 1. Mağazayı oluştur
  const storeData = { ...formData, user_id: user.id }
  const { error: storeError } = await supabase.from('stores').insert([storeData])

  if (storeError) {
    // Unique hatası kontrolü (Slug çakışması)
    if (storeError.code === '23505') return { error: 'Bu mağaza adı/linki zaten kullanılıyor.' }
    return { error: storeError.message }
  }

  // 2. Kullanıcı rolünü güncelle (store yap)
  await supabase.from('profiles').update({ role: 'store' }).eq('id', user.id)

  revalidatePath('/bana-ozel/magazam')
  return { success: true }
}

export async function updateStoreAction(formData: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: 'Giriş yapmalısınız' }

  const { error } = await supabase
    .from('stores')
    .update(formData)
    .eq('user_id', user.id)

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
