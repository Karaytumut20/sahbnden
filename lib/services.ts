import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

// --- GENEL & UPLOAD ---
export async function uploadImageClient(file: File) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
  const filePath = `ads/${fileName}`

  const { error } = await supabase.storage.from('images').upload(filePath, file)
  if (error) throw error

  const { data } = supabase.storage.from('images').getPublicUrl(filePath)
  return data.publicUrl
}

// Header'daki arama önerileri için
export async function getAdsClient(searchParams?: any) {
  let query = supabase.from('ads').select('id, title, price, currency').eq('status', 'yayinda');
  if (searchParams?.q) query = query.ilike('title', `%${searchParams.q}%`);
  const { data } = await query.limit(5);
  return data || [];
}

// --- KULLANICI İLANLARI & İSTATİSTİKLERİ ---
export async function getUserAdsClient(userId: string) {
  const { data } = await supabase.from('ads').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  return data || []
}

export async function getUserStatsClient(userId: string) {
  const { count } = await supabase.from('ads').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('status', 'yayinda')
  return { adsCount: count || 0 }
}

export async function updateAdStatusClient(id: number, status: string) {
  return await supabase.from('ads').update({ status }).eq('id', id)
}

// --- ADMIN ---
export async function getAdminAdsClient() {
  const { data } = await supabase.from('ads').select('*, profiles(full_name)').order('created_at', { ascending: false })
  return data || []
}

export async function getAllUsersClient() {
  const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
  return data || [];
}

export async function updateUserStatusClient(userId: string, status: string) {
  return await supabase.from('profiles').update({ status }).eq('id', userId);
}

export async function updateUserRoleClient(userId: string, role: string) {
  return await supabase.from('profiles').update({ role }).eq('id', userId);
}

// --- MESAJLAŞMA ---
export async function getConversationsClient(userId: string) {
  return await supabase
    .from('conversations')
    .select('*, ads(title, image), profiles:buyer_id(full_name), seller:seller_id(full_name)')
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order('updated_at', { ascending: false })
}

export async function getMessagesClient(conversationId: number) {
  return await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
}

export async function sendMessageClient(conversationId: number, senderId: string, content: string) {
  return await supabase.from('messages').insert([{ conversation_id: conversationId, sender_id: senderId, content }])
}

export async function startConversationClient(adId: number, buyerId: string, sellerId: string) {
    const { data } = await supabase.from('conversations').select('id').eq('ad_id', adId).eq('buyer_id', buyerId).single()
    if(data) return { data }
    return await supabase.from('conversations').insert([{ ad_id: adId, buyer_id: buyerId, seller_id: sellerId }]).select().single()
}

export async function markMessagesAsReadClient(conversationId: number, userId: string) {
  return await supabase.from('messages').update({ is_read: true }).eq('conversation_id', conversationId).neq('sender_id', userId)
}

// --- FAVORİLER (İyileştirilmiş) ---
export async function toggleFavoriteClient(userId: string, adId: number) {
  const { data } = await supabase.from('favorites').select('id').eq('user_id', userId).eq('ad_id', adId).single()
  if (data) {
    await supabase.from('favorites').delete().eq('id', data.id)
    return false // Çıkarıldı
  } else {
    await supabase.from('favorites').insert([{ user_id: userId, ad_id: adId }])
    return true // Eklendi
  }
}

export async function getFavoritesClient(userId: string) {
    // ads tablosuyla ilişki kur, eğer ilan silindiyse null gelebilir
    const { data } = await supabase.from('favorites').select('ad_id, ads(*)').eq('user_id', userId)

    // Silinmiş ilanları (ads: null) temizle
    if (!data) return [];

    return data
      .filter((item: any) => item.ads !== null)
      .map((f: any) => f.ads);
}

// --- KAYITLI ARAMALAR ---
export async function saveSearchClient(userId: string, name: string, url: string, criteria: string) {
  return await supabase.from('saved_searches').insert([{ user_id: userId, name, url, criteria }])
}

export async function getSavedSearchesClient(userId: string) {
  const { data } = await supabase.from('saved_searches').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  return data || []
}

export async function deleteSavedSearchClient(id: number) {
  return await supabase.from('saved_searches').delete().eq('id', id)
}

// --- PROFİL ---
export async function getProfileClient(userId: string) {
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
  return data
}

export async function updateProfileClient(userId: string, updates: any) {
  return await supabase.from('profiles').update(updates).eq('id', userId)
}

// --- YORUMLAR ---
export async function getReviewsClient(targetId: string) {
  const { data } = await supabase.from('reviews').select('*, reviewer:reviewer_id(full_name, avatar_url)').eq('target_id', targetId).order('created_at', { ascending: false });
  return data || [];
}

export async function addReviewClient(targetId: string, rating: number, comment: string, reviewerId: string) {
  if (targetId === reviewerId) return { error: { message: 'Kendinize yorum yapamazsınız.' } };
  return await supabase.from('reviews').insert([{ target_id: targetId, reviewer_id: reviewerId, rating, comment }]);
}