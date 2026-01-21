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