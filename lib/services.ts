import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

// --- MESAJLAŞMA ---
export async function getConversationsClient(userId: string) {
  // İlanın fiyat, konum ve id bilgilerini de çekiyoruz
  const { data, error } = await supabase
    .from('conversations')
    .select('*, ads(id, title, image, price, currency, city, district), profiles:buyer_id(full_name, avatar_url), seller:seller_id(full_name, avatar_url)')
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Mesajlar çekilemedi:', error);
    return [];
  }
  return data || [];
}

export async function getMessagesClient(conversationId: number) {
  const { data } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
  return data || [];
}

export async function sendMessageClient(conversationId: number, senderId: string, content: string) {
  return await supabase.from('messages').insert([{ conversation_id: conversationId, sender_id: senderId, content }]);
}

export async function startConversationClient(adId: number, buyerId: string, sellerId: string) {
    const { data } = await supabase.from('conversations').select('id').eq('ad_id', adId).eq('buyer_id', buyerId).single()
    if(data) return { data }
    return await supabase.from('conversations').insert([{ ad_id: adId, buyer_id: buyerId, seller_id: sellerId }]).select().single()
}

export async function markMessagesAsReadClient(conversationId: number, userId: string) {
  return await supabase.from('messages').update({ is_read: true }).eq('conversation_id', conversationId).neq('sender_id', userId)
}

// --- DİĞER SERVİSLER (Aynen Korundu) ---
export async function uploadImageClient(file: File) {
  try {
    const fileExt = file.name.split('.').pop();
    const cleanFileName = Math.random().toString(36).substring(2, 15);
    const fileName = `${Date.now()}-${cleanFileName}.${fileExt}`;
    const { data: uploadData, error: uploadError } = await supabase.storage.from('ads').upload(fileName, file, { cacheControl: '3600', upsert: false });
    if (uploadError) throw uploadError;
    const { data: urlData } = supabase.storage.from('ads').getPublicUrl(fileName);
    return urlData.publicUrl;
  } catch (error) {
    console.error("Resim yükleme hatası:", error);
    throw error;
  }
}
export async function getAdsClient(searchParams?: any) {
  let query = supabase.from('ads').select('id, title, price, currency').eq('status', 'yayinda');
  if (searchParams?.q) query = query.ilike('title', `%${searchParams.q}%`);
  const { data } = await query.limit(5);
  return data || [];
}
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
export async function toggleFavoriteClient(userId: string, adId: number) {
  const { data } = await supabase.from('favorites').select('id').eq('user_id', userId).eq('ad_id', adId).single()
  if (data) {
    await supabase.from('favorites').delete().eq('id', data.id)
    return false
  } else {
    await supabase.from('favorites').insert([{ user_id: userId, ad_id: adId }])
    return true
  }
}
export async function getFavoritesClient(userId: string) {
    const { data } = await supabase.from('favorites').select('ad_id, ads(*)').eq('user_id', userId)
    if (!data) return [];
    return data.filter((item: any) => item.ads !== null).map((f: any) => f.ads);
}
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
export async function getProfileClient(userId: string) {
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
  return data
}
export async function updateProfileClient(userId: string, updates: any) {
  return await supabase.from('profiles').update(updates).eq('id', userId)
}
export async function getReviewsClient(targetId: string) {
  const { data } = await supabase.from('reviews').select('*, reviewer:reviewer_id(full_name, avatar_url)').eq('target_id', targetId).order('created_at', { ascending: false });
  return data || [];
}
export async function addReviewClient(targetId: string, rating: number, comment: string, reviewerId: string) {
  if (targetId === reviewerId) return { error: { message: 'Kendinize yorum yapamazsınız.' } };
  return await supabase.from('reviews').insert([{ target_id: targetId, reviewer_id: reviewerId, rating, comment }]);
}