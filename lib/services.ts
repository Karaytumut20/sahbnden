
import { supabase } from './supabase';

export type Ad = {
  id: number;
  user_id: string;
  title: string;
  price: number;
  currency: string;
  city: string;
  district: string;
  image: string;
  category: string;
  description?: string;
  created_at?: string;
  status?: string;
  room?: string;
  km?: number;
  year?: number;
  m2?: number;
  floor?: number;
  heating?: string;
  brand?: string;
  gear?: string;
  fuel?: string;
  status_vehicle?: string;
  show_phone?: boolean;
  profiles?: { full_name: string, phone: string, email: string };
};

// --- İLANLAR ---
export async function getAds(searchParams?: any) {
  let query = supabase.from('ads').select('*, profiles(full_name)').eq('status', 'yayinda');
  if (searchParams?.category) query = query.eq('category', searchParams.category);
  if (searchParams?.q) query = query.ilike('title', `%${searchParams.q}%`);
  if (searchParams?.minPrice) query = query.gte('price', searchParams.minPrice);
  if (searchParams?.maxPrice) query = query.lte('price', searchParams.maxPrice);
  if (searchParams?.city) query = query.eq('city', searchParams.city);

  if (searchParams?.sort === 'price_asc') query = query.order('price', { ascending: true });
  else if (searchParams?.sort === 'price_desc') query = query.order('price', { ascending: false });
  else query = query.order('created_at', { ascending: false });

  const { data, error } = await query;
  return (data || []) as Ad[];
}

export async function getAdDetail(id: number) {
  const { data } = await supabase.from('ads').select('*, profiles(*)').eq('id', id).single();
  return data as Ad;
}

export async function createAd(adData: any) {
  return await supabase.from('ads').insert([adData]).select();
}

export async function getUserAds(userId: string) {
  const { data } = await supabase.from('ads').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  return data || [];
}

export async function getUserStats(userId: string) {
  const { count } = await supabase.from('ads').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('status', 'yayinda');
  return { adsCount: count || 0 };
}

export async function updateAdStatus(id: number, status: string) {
  return await supabase.from('ads').update({ status }).eq('id', id);
}

export async function getAdminAds() {
  const { data } = await supabase.from('ads').select('*, profiles(full_name)').order('created_at', { ascending: false });
  return data || [];
}

// --- MESAJLAŞMA ---
export async function startConversation(adId: number, buyerId: string, sellerId: string) {
  const { data: existing } = await supabase.from('conversations').select('id').eq('ad_id', adId).eq('buyer_id', buyerId).single();
  if (existing) return { data: existing, error: null };
  return await supabase.from('conversations').insert([{ ad_id: adId, buyer_id: buyerId, seller_id: sellerId }]).select().single();
}

export async function sendMessage(conversationId: number, senderId: string, content: string) {
  return await supabase.from('messages').insert([{ conversation_id: conversationId, sender_id: senderId, content }]);
}

export async function getConversations(userId: string) {
  return await supabase
    .from('conversations')
    .select('*, ads(title, image), profiles:buyer_id(full_name), seller:seller_id(full_name)')
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order('updated_at', { ascending: false });
}

export async function getMessages(conversationId: number) {
  return await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
}

export async function markMessagesAsRead(conversationId: number, userId: string) {
  // Gelen mesajları okundu yap (kendi mesajlarımızı değil)
  return await supabase.from('messages')
    .update({ is_read: true })
    .eq('conversation_id', conversationId)
    .neq('sender_id', userId);
}

// --- FAVORİLER ---
export async function toggleFavorite(userId: string, adId: number) {
  // Önce var mı diye bak
  const { data } = await supabase.from('favorites').select('id').eq('user_id', userId).eq('ad_id', adId).single();

  if (data) {
    // Varsa sil
    return await supabase.from('favorites').delete().eq('id', data.id);
  } else {
    // Yoksa ekle
    return await supabase.from('favorites').insert([{ user_id: userId, ad_id: adId }]);
  }
}

export async function getFavorites(userId: string) {
  const { data } = await supabase
    .from('favorites')
    .select('ad_id, ads(*)')
    .eq('user_id', userId);

  // Sadece ads verisini düz dizi olarak döndür
  return data?.map((f: any) => f.ads) || [];
}

export async function checkIsFavorite(userId: string, adId: number) {
  const { data } = await supabase.from('favorites').select('id').eq('user_id', userId).eq('ad_id', adId).single();
  return !!data;
}

// --- KAYITLI ARAMALAR ---
export async function saveSearch(userId: string, name: string, url: string, criteria: string) {
  return await supabase.from('saved_searches').insert([{ user_id: userId, name, url, criteria }]);
}

export async function getSavedSearches(userId: string) {
  const { data } = await supabase.from('saved_searches').select('*').eq('user_id', userId).order('created_at', { ascending: false });
  return data || [];
}

export async function deleteSavedSearch(id: number) {
  return await supabase.from('saved_searches').delete().eq('id', id);
}

// --- VİTRİN VE MAĞAZA ---

// Vitrin İlanlarını Getir (Rastgele veya Tarihe Göre)
export async function getShowcaseAds(limit = 10) {
  const { data } = await supabase
    .from('ads')
    .select('*')
    .eq('status', 'yayinda')
    .limit(limit)
    .order('created_at', { ascending: false }); // En yeniler
  return data || [];
}

// Acil İlanlar
export async function getUrgentAds(limit = 10) {
  // Gerçekte 'is_urgent' gibi bir kolon olur, şimdilik fiyata göre sıralayalım
  const { data } = await supabase
    .from('ads')
    .select('*')
    .eq('status', 'yayinda')
    .order('price', { ascending: true }) // Ucuz olanlar acil gibi dursun
    .limit(limit);
  return data || [];
}

// Mağaza Detayı Getir
export async function getStoreBySlug(slug: string) {
  const { data } = await supabase
    .from('stores')
    .select('*')
    .eq('slug', slug)
    .single();
  return data;
}

// Mağazanın İlanlarını Getir
export async function getStoreAds(userId: string) {
  const { data } = await supabase
    .from('ads')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'yayinda');
  return data || [];
}
