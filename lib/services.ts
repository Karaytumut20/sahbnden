import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

// --- MESAJLAŞMA SİSTEMİ (FIXED) ---

export async function getConversationsClient(userId: string) {
  const { data, error } = await supabase
    .from('conversations')
    .select('*, ads(id, title, image, price, currency, city, district), profiles:buyer_id(full_name, avatar_url), seller:seller_id(full_name, avatar_url)')
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order('updated_at', { ascending: false });
  if (error) {
      console.error("Get Conversations Error:", error);
      return [];
  }
  return data || [];
}

export async function getMessagesClient(conversationId: number) {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) console.error("Get Messages Error:", error);
  return data || [];
}

export async function sendMessageClient(conversationId: number, senderId: string, content: string) {
  // 1. Mesajı kaydet
  const { data, error } = await supabase
    .from('messages')
    .insert([{ conversation_id: conversationId, sender_id: senderId, content }])
    .select()
    .single();

  // 2. Sohbetin 'updated_at' zamanını güncelle (Listede yukarı çıksın diye)
  if (!error) {
      await supabase.from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);
  }

  return { data, error };
}

export async function startConversationClient(adId: number, buyerId: string, sellerId: string) {
    // 1. Önce mevcut sohbet var mı kontrol et
    const { data: existingConv, error: fetchError } = await supabase
        .from('conversations')
        .select('id')
        .eq('ad_id', adId)
        .eq('buyer_id', buyerId)
        .eq('seller_id', sellerId)
        .single();

    if (existingConv) {
        return { data: existingConv, error: null };
    }

    // 2. Yoksa yeni oluştur
    const { data: newConv, error: createError } = await supabase
        .from('conversations')
        .insert([{ ad_id: adId, buyer_id: buyerId, seller_id: sellerId }])
        .select()
        .single();

    return { data: newConv, error: createError };
}

export async function markMessagesAsReadClient(conversationId: number, userId: string) {
  // Sadece karşı tarafın gönderdiği okunmamış mesajları güncelle
  return await supabase
    .from('messages')
    .update({ is_read: true })
    .eq('conversation_id', conversationId)
    .neq('sender_id', userId)
    .eq('is_read', false);
}

// --- DİĞER SERVİSLER (MEVCUT YAPIDAN KORUNDU) ---
// (Bu kısım önceki kodların çalışmaya devam etmesi için gerekli temel servisleri içerir)

export async function getUserAdsClient(userId: string) {
  const { data } = await supabase.from('ads').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  return data || [];
}

export async function updateAdStatusClient(id: number, status: string) {
  return await supabase.from('ads').update({ status }).eq('id', id);
}

export async function toggleFavoriteClient(userId: string, adId: number) {
  const { data } = await supabase.from('favorites').select('id').eq('user_id', userId).eq('ad_id', adId).single()
  if (data) { await supabase.from('favorites').delete().eq('id', data.id); return false; }
  else { await supabase.from('favorites').insert([{ user_id: userId, ad_id: adId }]); return true; }
}

export async function getFavoritesClient(userId: string) {
    const { data } = await supabase.from('favorites').select('ad_id, ads(*)').eq('user_id', userId)
    return data ? data.filter((i: any) => i.ads).map((i: any) => i.ads) : [];
}

export async function getProfileClient(userId: string) {
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
  return data
}

export async function getReviewsClient(targetId: string) {
  const { data } = await supabase.from('reviews').select('*, reviewer:reviewer_id(full_name, avatar_url)').eq('target_id', targetId).order('created_at', { ascending: false });
  return data || [];
}

export async function addReviewClient(targetId: string, rating: number, comment: string, reviewerId: string) {
  if (targetId === reviewerId) return { error: { message: 'Kendinize yorum yapamazsınız.' } };
  return await supabase.from('reviews').insert([{ target_id: targetId, reviewer_id: reviewerId, rating, comment }]);
}

export async function getSavedSearchesClient(userId: string) {
  const { data } = await supabase.from('saved_searches').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  return data || [];
}

export async function deleteSavedSearchClient(id: number) {
  return await supabase.from('saved_searches').delete().eq('id', id);
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

export async function getAdminAdsClient() {
  const { data } = await supabase.from('ads').select('*, profiles(full_name)').order('created_at', { ascending: false });
  return data || [];
}

export async function getAdsClient(searchParams?: any) {
  let query = supabase.from('ads').select('id, title, price, currency').eq('status', 'yayinda');
  if (searchParams?.q) query = query.ilike('title', `%${searchParams.q}%`);
  const { data } = await query.limit(5);
  return data || [];
}

export async function uploadImageClient(file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
  const { data, error } = await supabase.storage.from('ads').upload(fileName, file);
  if (error) throw error;
  return supabase.storage.from('ads').getPublicUrl(fileName).data.publicUrl;
}

export async function getNotificationsClient(userId: string) {
  const { data } = await supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(20);
  return data || [];
}
export async function markNotificationReadClient(id: number) {
  await supabase.from('notifications').update({ is_read: true }).eq('id', id);
}
export async function markAllNotificationsReadClient(userId: string) {
  await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId);
}
export async function createNotificationClient(userId: string, title: string, message: string) {
  await supabase.from('notifications').insert([{ user_id: userId, title, message }]);
}