const fs = require("fs");
const path = require("path");

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
};

console.log(
  colors.cyan +
    colors.bold +
    "\n🚀 MESAJLAŞMA SİSTEMİ (ANLIK SOHBET & İLAN KARTI) GÜNCELLENİYOR...\n" +
    colors.reset,
);

function writeFile(filePath, content) {
  const absolutePath = path.join(__dirname, filePath);
  const dir = path.dirname(absolutePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(absolutePath, content.trim());
  console.log(`${colors.green}✔ Güncellendi:${colors.reset} ${filePath}`);
}

// =============================================================================
// 1. LIB/SERVICES.TS (Daha fazla ilan detayı çekmek için güncellendi)
// =============================================================================
const servicesContent = `
import { createClient } from '@/lib/supabase/client'

const supabase = createClient()

// --- MESAJLAŞMA ---
export async function getConversationsClient(userId: string) {
  // İlanın fiyat, konum ve id bilgilerini de çekiyoruz
  const { data, error } = await supabase
    .from('conversations')
    .select('*, ads(id, title, image, price, currency, city, district), profiles:buyer_id(full_name, avatar_url), seller:seller_id(full_name, avatar_url)')
    .or(\`buyer_id.eq.\${userId},seller_id.eq.\${userId}\`)
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
    const fileName = \`\${Date.now()}-\${cleanFileName}.\${fileExt}\`;
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
  if (searchParams?.q) query = query.ilike('title', \`%\${searchParams.q}%\`);
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
`;

// =============================================================================
// 2. APP/BANA-OZEL/MESAJLARIM/PAGE.TSX (İlan Kartı ve Realtime Sohbet)
// =============================================================================
const messagesPageContent = `
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { getConversationsClient, getMessagesClient, sendMessageClient, markMessagesAsReadClient } from '@/lib/services';
import { Send, ArrowLeft, Loader2, MessageSquareOff, ExternalLink, MapPin } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link';

export default function MessagesPage() {
  const { user } = useAuth();
  const supabase = createClient();
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConvId, setActiveConvId] = useState<number | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToast();

  // Konuşmaları Çek
  useEffect(() => {
    if (user) {
      getConversationsClient(user.id)
        .then((data) => {
             if (Array.isArray(data)) setConversations(data);
             else setConversations([]);
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const activeConv = Array.isArray(conversations) ? conversations.find(c => c.id === activeConvId) : null;

  // Mesajları Çek ve Dinle
  useEffect(() => {
    if (!activeConvId || !user) return;

    getMessagesClient(activeConvId).then(data => {
      setMessages(data || []);
      markMessagesAsReadClient(activeConvId, user.id);
      scrollToBottom();
    });

    const channel = supabase.channel('chat_room_' + activeConvId)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: \`conversation_id=eq.\${activeConvId}\` }, (payload) => {
          setMessages(current => {
              // Mesaj zaten varsa ekleme (Optimistic update kontrolü)
              if (current.some(m => m.id === payload.new.id)) return current;
              return [...current, payload.new];
          });
          if (payload.new.sender_id !== user.id) markMessagesAsReadClient(activeConvId, user.id);
          scrollToBottom();
      }).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeConvId, user]);

  const scrollToBottom = () => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user || !activeConvId) return;

    const tempMsg = {
        id: Date.now(), // Geçici ID
        conversation_id: activeConvId,
        sender_id: user.id,
        content: inputText,
        created_at: new Date().toISOString(),
        is_pending: true
    };

    // Optimistic Update: Hemen ekrana bas
    setMessages(prev => [...prev, tempMsg]);
    setInputText('');
    scrollToBottom();

    // Sunucuya gönder
    const { error } = await sendMessageClient(activeConvId, user.id, tempMsg.content);
    if(error) {
        addToast('Mesaj gönderilemedi', 'error');
        // Hata varsa mesajı kaldır veya hata göster (Şimdilik basit tutuyoruz)
    }
  };

  if (!user) return <div className="p-10 text-center text-gray-500">Giriş yapmalısınız.</div>;

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm h-[calc(100vh-140px)] min-h-[600px] flex overflow-hidden dark:bg-[#1c1c1c] dark:border-gray-700">

      {/* SOL: Konuşma Listesi */}
      <div className={\`w-full md:w-[320px] border-r border-gray-200 flex flex-col dark:border-gray-700 \${activeConvId ? 'hidden md:flex' : 'flex'}\`}>
        <div className="p-4 border-b border-gray-100 bg-gray-50 dark:bg-[#151515] dark:border-gray-700">
          <h2 className="font-bold text-[#333] dark:text-white">Mesajlarım</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? <div className="flex justify-center p-4"><Loader2 className="animate-spin"/></div> : conversations.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm p-4 text-center">
                <MessageSquareOff size={32} className="mb-2"/> Henüz mesajınız yok.
             </div>
          ) : (
             conversations.map(conv => {
                const otherUser = conv.buyer_id === user.id ? conv.seller : conv.profiles;
                return (
                    <div key={conv.id} onClick={() => setActiveConvId(conv.id)} className={\`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors \${activeConvId === conv.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''}\`}>
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-bold text-[#333] text-sm truncate">{otherUser?.full_name || 'Kullanıcı'}</span>
                            <span className="text-[10px] text-gray-400">{new Date(conv.updated_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                             <div className="w-8 h-8 bg-gray-200 rounded shrink-0 overflow-hidden">
                                 {conv.ads?.image && <img src={conv.ads.image} className="w-full h-full object-cover"/>}
                             </div>
                             <div className="flex-1 min-w-0">
                                 <p className="text-[11px] font-bold text-gray-700 truncate">{conv.ads?.title || 'Silinmiş İlan'}</p>
                                 <p className="text-[10px] text-gray-500 truncate">İlan No: {conv.ads?.id}</p>
                             </div>
                        </div>
                    </div>
                );
             })
          )}
        </div>
      </div>

      {/* SAĞ: Sohbet Alanı */}
      <div className={\`flex-1 flex flex-col bg-[#e5ddd5] dark:bg-[#0b141a] \${!activeConvId ? 'hidden md:flex' : 'flex'}\`}>
        {activeConv ? (
          <>
            {/* ÜST İLAN KARTI */}
            <div className="bg-white border-b border-gray-200 shadow-sm z-10 dark:bg-[#1c1c1c] dark:border-gray-700">
                {/* Mobilde Geri Tuşu */}
                <div className="md:hidden p-2 border-b border-gray-100 flex items-center">
                    <button onClick={() => setActiveConvId(null)} className="flex items-center text-gray-600 font-bold text-sm"><ArrowLeft size={16} className="mr-1"/> Mesajlara Dön</button>
                </div>

                {/* İlan Bilgisi */}
                {activeConv.ads && (
                    <div className="p-3 flex items-center gap-4">
                        <div className="w-16 h-12 bg-gray-200 rounded border border-gray-200 overflow-hidden shrink-0">
                            <img src={activeConv.ads.image || 'https://via.placeholder.com/100'} className="w-full h-full object-cover"/>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-[#333] text-sm truncate dark:text-white">{activeConv.ads.title}</h3>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-blue-900 font-bold text-sm dark:text-blue-400">{activeConv.ads.price?.toLocaleString()} {activeConv.ads.currency}</span>
                                <span className="text-[10px] text-gray-500 flex items-center gap-0.5"><MapPin size={10}/> {activeConv.ads.city}/{activeConv.ads.district}</span>
                            </div>
                        </div>
                        <Link href={\`/ilan/\${activeConv.ads.id}\`} target="_blank" className="hidden sm:flex bg-[#ffe800] text-black text-xs font-bold px-4 py-2 rounded-sm hover:bg-yellow-400 items-center gap-1">
                            İlana Git <ExternalLink size={12}/>
                        </Link>
                    </div>
                )}
            </div>

            {/* MESAJ LİSTESİ */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {messages.map(msg => (
                <div key={msg.id} className={\`flex \${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}\`}>
                  <div className={\`max-w-[80%] px-3 py-1.5 rounded-lg text-sm shadow-sm relative \${msg.sender_id === user.id ? 'bg-[#dcf8c6] dark:bg-[#005c4b] text-black dark:text-white rounded-tr-none' : 'bg-white dark:bg-[#202c33] text-black dark:text-white rounded-tl-none'}\`}>
                    <p className="break-words">{msg.content}</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-[9px] text-gray-500 dark:text-gray-400">
                            {msg.is_pending ? 'Gönderiliyor...' : new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* MESAJ YAZMA ALANI */}
            <form onSubmit={handleSend} className="p-3 bg-[#f0f2f5] dark:bg-[#202c33] flex gap-2 items-center">
              <input
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                className="flex-1 border-none rounded-full px-4 py-2.5 outline-none text-sm dark:bg-[#2a3942] dark:text-white placeholder:text-gray-500"
                placeholder="Bir mesaj yazın..."
                autoFocus
              />
              <button type="submit" disabled={!inputText.trim()} className="bg-[#008a7c] text-white p-2.5 rounded-full hover:bg-[#006e63] transition-colors disabled:opacity-50 disabled:cursor-not-allowed transform active:scale-95">
                  <Send size={18}/>
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-8 text-center bg-[#f0f2f5] dark:bg-[#111]">
             <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-4 dark:bg-gray-800">
                <img src="/window.svg" className="w-16 h-16 opacity-20"/>
             </div>
             <h3 className="font-bold text-lg mb-2">Web'de Mesajlaşın</h3>
             <p className="text-sm max-w-xs">İlan sahipleriyle anlık olarak mesajlaşabilir, fotoğraf ve konum gönderebilirsiniz.</p>
          </div>
        )}
      </div>
    </div>
  );
}
`;

writeFile("lib/services.ts", servicesContent);
writeFile("app/bana-ozel/mesajlarim/page.tsx", messagesPageContent);
