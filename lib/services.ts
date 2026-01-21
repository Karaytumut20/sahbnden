import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

export async function uploadImageClient(file) {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const { data, error } = await supabase.storage.from('ads').upload(fileName, file);
    if (error) throw error;
    return supabase.storage.from('ads').getPublicUrl(fileName).data.publicUrl;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}

// SEARCH
export async function getAdsClient(searchParams) {
  let query = supabase.from('ads').select('id, title, price, currency').eq('status', 'yayinda');
  if (searchParams?.q) query = query.ilike('title', `%${searchParams.q}%`);
  const { data } = await query.limit(5);
  return data || [];
}

// USER
export async function getUserAdsClient(userId) {
  const { data } = await supabase.from('ads').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  return data || []
}

export async function getUserStatsClient(userId) {
  const { count } = await supabase.from('ads').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('status', 'yayinda')
  return { adsCount: count || 0 }
}

export async function updateAdStatusClient(id, status) {
  return await supabase.from('ads').update({ status }).eq('id', id)
}

// ADMIN (BU EKSİKTİ, EKLENDİ)
export async function getAdminAdsClient() {
  const { data } = await supabase.from('ads').select('*, profiles(full_name)').order('created_at', { ascending: false })
  return data || []
}

export async function getAllUsersClient() {
  const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
  return data || [];
}

export async function updateUserStatusClient(userId, status) {
  return await supabase.from('profiles').update({ status }).eq('id', userId);
}

export async function updateUserRoleClient(userId, role) {
  return await supabase.from('profiles').update({ role }).eq('id', userId);
}

// MESSAGING
export async function getConversationsClient(userId) {
  const { data, error } = await supabase
    .from('conversations')
    .select('*, ads(id, title, image, price, currency, city, district), profiles:buyer_id(full_name, avatar_url), seller:seller_id(full_name, avatar_url)')
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order('updated_at', { ascending: false });
  if (error) return [];
  return data || [];
}

export async function getMessagesClient(conversationId) {
  const { data } = await supabase.from('messages').select('*').eq('conversation_id', conversationId).order('created_at', { ascending: true });
  return data || [];
}

export async function sendMessageClient(conversationId, senderId, content) {
  return await supabase.from('messages').insert([{ conversation_id: conversationId, sender_id: senderId, content }]);
}

export async function startConversationClient(adId, buyerId, sellerId) {
    const { data } = await supabase.from('conversations').select('id').eq('ad_id', adId).eq('buyer_id', buyerId).single()
    if(data) return { data }
    return await supabase.from('conversations').insert([{ ad_id: adId, buyer_id: buyerId, seller_id: sellerId }]).select().single()
}

export async function markMessagesAsReadClient(conversationId, userId) {
  return await supabase.from('messages').update({ is_read: true }).eq('conversation_id', conversationId).neq('sender_id', userId)
}

// FAVORITES
export async function toggleFavoriteClient(userId, adId) {
  const { data } = await supabase.from('favorites').select('id').eq('user_id', userId).eq('ad_id', adId).single()
  if (data) { await supabase.from('favorites').delete().eq('id', data.id); return false; }
  else { await supabase.from('favorites').insert([{ user_id: userId, ad_id: adId }]); return true; }
}

export async function getFavoritesClient(userId) {
    const { data } = await supabase.from('favorites').select('ad_id, ads(*)').eq('user_id', userId)
    return data ? data.filter(i => i.ads).map(i => i.ads) : [];
}

// SAVED SEARCHES
export async function getSavedSearchesClient(userId) {
  const { data } = await supabase.from('saved_searches').select('*').eq('user_id', userId).order('created_at', { ascending: false })
  return data || []
}

export async function deleteSavedSearchClient(id) {
  return await supabase.from('saved_searches').delete().eq('id', id)
}

export async function saveSearchClient(userId, name, url, criteria) {
  return await supabase.from('saved_searches').insert([{ user_id: userId, name, url, criteria }])
}

// PROFILE & REVIEWS
export async function getProfileClient(userId) {
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
  return data
}

export async function updateProfileClient(userId, updates) {
  return await supabase.from('profiles').update(updates).eq('id', userId)
}

export async function getReviewsClient(targetId) {
  const { data } = await supabase.from('reviews').select('*, reviewer:reviewer_id(full_name, avatar_url)').eq('target_id', targetId).order('created_at', { ascending: false });
  return data || [];
}

export async function addReviewClient(targetId, rating, comment, reviewerId) {
  if (targetId === reviewerId) return { error: { message: 'Kendinize yorum yapamazsınız.' } };
  return await supabase.from('reviews').insert([{ target_id: targetId, reviewer_id: reviewerId, rating, comment }]);
}