const fs = require("fs");
const path = require("path");

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  magenta: "\x1b[35m",
  bold: "\x1b[1m",
};

console.log(
  colors.magenta +
    colors.bold +
    "\n🚀 SENIOR UPGRADE V9: REAL-TIME ENGINE (CHAT & PRESENCE)...\n" +
    colors.reset,
);

function writeFile(filePath, content) {
  const absolutePath = path.join(__dirname, filePath);
  const dir = path.dirname(absolutePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(absolutePath, content.trim());
  console.log(
    `${colors.green}✔ Güncellendi/Oluşturuldu:${colors.reset} ${filePath}`,
  );
}

// =============================================================================
// 1. SUPABASE/REALTIME.SQL (REPLİKASYON AYARLARI)
// =============================================================================
const realtimeSqlContent = `
-- BU KODU SUPABASE SQL EDITOR'DE ÇALIŞTIRIN --
-- Gerçek zamanlı özellikleri aktif etmek için "supa_realtime" yayınına tabloları ekliyoruz.

-- 1. Mesajlaşma için Realtime
alter publication supabase_realtime add table messages;

-- 2. Bildirimler için Realtime
alter publication supabase_realtime add table notifications;

-- 3. İlan durumu değişiklikleri için (Örn: Biri ilanı satın alınca anında 'Satıldı' yazsın)
alter publication supabase_realtime add table ads;

-- 4. Online Kullanıcı Takibi (Presence) için tabloya gerek yok, Supabase Channel kullanacağız.
-- Ancak son görülme bilgisini kalıcı tutmak istersek:
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_seen_at timestamp with time zone;
`;
writeFile("supabase/realtime.sql", realtimeSqlContent);

// =============================================================================
// 2. HOOKS/USE-REALTIME.TS (GENERIC REALTIME HOOK)
// =============================================================================
const useRealtimeContent = `
import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

type RealtimeOptions = {
  table: string;
  channelName?: string;
  filter?: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  callback: (payload: any) => void;
};

/**
 * Veritabanı değişikliklerini anlık dinlemek için Custom Hook.
 * Memory leak önlemek için cleanup işlemini otomatik yapar.
 */
export function useRealtimeSubscription({ table, channelName, filter, event = '*', callback }: RealtimeOptions) {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    // Benzersiz bir kanal adı oluştur veya verileni kullan
    const channelId = channelName || \`sub_\${table}_\${Math.random().toString(36).substr(2, 9)}\`;

    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes',
        { event, schema: 'public', table, filter },
        (payload) => {
          // Callback'i tetikle
          callback(payload);
          // Opsiyonel: Veri değiştiğinde Next.js cache'ini tazeleyebiliriz (router.refresh())
          // Ancak bu her durumda istenmeyebilir, o yüzden manuel yönetime bırakıyoruz.
        }
      )
      .subscribe();

    // Cleanup: Bileşen unmount olduğunda dinlemeyi durdur
    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, filter, event, channelName]); // Dependency array önemli
}
`;
writeFile("hooks/use-realtime.ts", useRealtimeContent);

// =============================================================================
// 3. HOOKS/USE-PRESENCE.TS (ONLINE KULLANICI TAKİBİ)
// =============================================================================
const usePresenceContent = `
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';

/**
 * Şu an sayfada olan kullanıcıları takip eder.
 * @param roomId Hangi odadaki kullanıcılar? (Örn: 'ad_123' veya 'global')
 */
export function usePresence(roomId: string) {
  const { user } = useAuth();
  const supabase = createClient();
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;

    const channel = supabase.channel(roomId);

    channel
      .on('presence', { event: 'sync' }, () => {
        // Presence state'i senkronize olduğunda listeyi güncelle
        const newState = channel.presenceState();
        const users = Object.values(newState).flat();
        setOnlineUsers(users);
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          // Kanala bağlandığında kendini "Ben buradayım" diye kaydet
          await channel.track({
            user_id: user.id,
            name: user.name,
            avatar: user.avatar,
            online_at: new Date().toISOString(),
          });
        }
      });

    return () => {
      channel.unsubscribe();
    };
  }, [user, roomId]);

  return { onlineUsers, count: onlineUsers.length };
}
`;
writeFile("hooks/use-presence.ts", usePresenceContent);

// =============================================================================
// 4. COMPONENTS/LIVEVISITORCOUNT.TSX (SOSYAL KANIT BİLEŞENİ)
// =============================================================================
const liveVisitorContent = `
"use client";
import React from 'react';
import { usePresence } from '@/hooks/use-presence';
import { Eye } from 'lucide-react';

export default function LiveVisitorCount({ adId }: { adId: number }) {
  // Her ilan için benzersiz bir oda oluşturuyoruz: 'ad_presence_123'
  const { count } = usePresence(\`ad_presence_\${adId}\`);

  if (count <= 1) return null; // Sadece kendisi varsa gösterme

  return (
    <div className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-sm animate-pulse border border-red-100">
      <Eye size={14} />
      <span>Şu an {count} kişi inceliyor</span>
    </div>
  );
}
`;
writeFile("components/LiveVisitorCount.tsx", liveVisitorContent);

// =============================================================================
// 5. APP/ILAN/[ID]/PAGE.TSX (GÜNCELLEME: CANLI SAYAÇ EKLENMESİ)
// =============================================================================
// Not: Mevcut dosyanın yapısını koruyarak araya LiveVisitorCount'u ekliyoruz.
const adDetailUpdate = `
import React from 'react';
import { notFound } from 'next/navigation';
import { getAdDetailServer, getAdFavoriteCount } from '@/lib/actions';
import Breadcrumb from '@/components/Breadcrumb';
import Gallery from '@/components/Gallery';
import MobileAdActionBar from '@/components/MobileAdActionBar';
import AdActionButtons from '@/components/AdActionButtons';
import StickyAdHeader from '@/components/StickyAdHeader';
import SellerSidebar from '@/components/SellerSidebar';
import Tabs from '@/components/AdDetail/Tabs';
import FeaturesTab from '@/components/AdDetail/FeaturesTab';
import LocationTab from '@/components/AdDetail/LocationTab';
import LoanCalculator from '@/components/tools/LoanCalculator';
import ViewTracker from '@/components/ViewTracker';
import LiveVisitorCount from '@/components/LiveVisitorCount'; // YENİ
import Badge from '@/components/ui/Badge';
import { Eye, MapPin, Heart } from 'lucide-react';
import type { Metadata, ResolvingMetadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }, parent: ResolvingMetadata): Promise<Metadata> {
  const { id } = await params;
  const ad = await getAdDetailServer(Number(id));
  if (!ad) return { title: 'İlan Bulunamadı' };
  return {
    title: \`\${ad.title} - \${ad.price.toLocaleString()} \${ad.currency}\`,
    description: \`\${ad.city}/\${ad.district} bölgesinde \${ad.title} ilanını inceleyin.\`,
    openGraph: { images: [ad.image || ''] },
  };
}

export default async function AdDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ad = await getAdDetailServer(Number(id));
  if (!ad) return notFound();

  const favCount = await getAdFavoriteCount(Number(id));
  const formattedPrice = ad.price?.toLocaleString('tr-TR');
  const location = \`\${ad.city || ''} / \${ad.district || ''}\`;
  const sellerInfo = ad.profiles || { full_name: 'Bilinmiyor', phone: '', email: '' };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: ad.title,
    image: ad.image || [],
    description: ad.description,
    offers: {
      '@type': 'Offer',
      price: ad.price,
      priceCurrency: ad.currency,
      availability: 'https://schema.org/InStock',
      url: \`https://sahibinden-klon.com/ilan/\${ad.id}\`,
    },
  };

  return (
    <div className="pb-20 relative font-sans">
      <ViewTracker adId={ad.id} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <StickyAdHeader title={ad.title} price={formattedPrice} currency={ad.currency} />

      <div className="mb-4">
        <Breadcrumb path={\`\${ad.category === 'emlak' ? 'Emlak' : 'Vasıta'} > \${location} > İlan Detayı\`} />
      </div>

      <div className="border-b border-gray-200 pb-4 mb-6">
        <h1 className="text-[#333] font-bold text-xl mb-2">{ad.title}</h1>
        <div className="flex flex-wrap gap-2 items-center">
            {ad.is_urgent && <Badge variant="danger">Acil Satılık</Badge>}
            {ad.is_vitrin && <Badge variant="warning">Vitrinde</Badge>}
            <LiveVisitorCount adId={ad.id} /> {/* YENİ: SOSYAL KANIT */}
            {favCount > 0 && (
                <span className="text-xs text-red-600 flex items-center gap-1 ml-auto font-bold bg-red-50 px-2 py-1 rounded-sm">
                    <Heart size={12} className="fill-red-600"/> {favCount} favori
                </span>
            )}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-[600px] shrink-0">
          <Gallery mainImage={ad.image || 'https://via.placeholder.com/800x600?text=Resim+Yok'} />
          <div className="mt-4 hidden md:block"><AdActionButtons id={ad.id} title={ad.title} image={ad.image} sellerName={sellerInfo.full_name} /></div>
          <Tabs items={[
             { id: 'desc', label: 'İlan Açıklaması', content: <div className="text-[14px] text-[#333] leading-relaxed whitespace-pre-wrap">{ad.description}</div> },
             { id: 'features', label: 'İlan Özellikleri', content: <FeaturesTab ad={ad} /> },
             { id: 'location', label: 'Konum', content: <LocationTab city={ad.city} district={ad.district} /> }
          ]} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="mb-6">
            <span className="block text-blue-700 font-bold text-2xl">{formattedPrice} {ad.currency}</span>
            <span className="block text-gray-500 text-xs mt-1 flex items-center gap-1"><MapPin size={12}/> {location}</span>
          </div>
          <div className="bg-white border-t border-gray-200">
             <div className="flex justify-between py-2.5 border-b border-gray-100 text-sm hover:bg-gray-50 px-2"><span className="font-bold text-[#333]">İlan No</span><span className="text-red-600 font-bold">{ad.id}</span></div>
             <div className="flex justify-between py-2.5 border-b border-gray-100 text-sm hover:bg-gray-50 px-2"><span className="font-bold text-[#333]">İlan Tarihi</span><span>{new Date(ad.created_at).toLocaleDateString('tr-TR')}</span></div>
             {ad.room && <div className="flex justify-between py-2.5 border-b border-gray-100 text-sm hover:bg-gray-50 px-2"><span className="font-bold text-[#333]">Oda Sayısı</span><span>{ad.room}</span></div>}
             {ad.km && <div className="flex justify-between py-2.5 border-b border-gray-100 text-sm hover:bg-gray-50 px-2"><span className="font-bold text-[#333]">KM</span><span>{ad.km}</span></div>}
             <div className="flex justify-between py-2.5 border-b border-gray-100 text-sm px-2 bg-gray-50">
                <span className="font-bold text-[#333] flex items-center gap-2"><Eye size={14} className="text-gray-400"/> Görüntülenme</span>
                <span>{ad.view_count || 0}</span>
             </div>
          </div>
        </div>

        <div className="lg:w-[280px] shrink-0 hidden md:block">
           <SellerSidebar sellerId={ad.user_id} sellerName={sellerInfo.full_name || 'Kullanıcı'} sellerPhone={sellerInfo.phone || 'Telefon yok'} adId={ad.id} adTitle={ad.title} adImage={ad.image} price={formattedPrice} currency={ad.currency} />
           {ad.category.includes('konut') && <LoanCalculator price={ad.price} />}
        </div>
      </div>
      <MobileAdActionBar price={\`\${formattedPrice} \${ad.currency}\`} />
    </div>
  );
}
`;
writeFile("app/ilan/[id]/page.tsx", adDetailUpdate);

// =============================================================================
// 6. APP/BANA-OZEL/MESAJLARIM/PAGE.TSX (CANLI SOHBET GÜNCELLEMESİ)
// =============================================================================
// Önceki polling mantığını silip yerine useRealtimeSubscription kullanan yapıyı koyuyoruz.
const chatPageUpdate = `
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { getConversationsClient, getMessagesClient, sendMessageClient, markMessagesAsReadClient } from '@/lib/services';
import { Send, ArrowLeft, Loader2, MessageSquareOff, ExternalLink, MapPin } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import Link from 'next/link';
import { useRealtimeSubscription } from '@/hooks/use-realtime';

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

  // 1. Sohbet Listesini Getir
  useEffect(() => {
    if (user) {
      getConversationsClient(user.id)
        .then((data) => {
             if (Array.isArray(data)) setConversations(data);
             else setConversations([]);
        })
        .finally(() => setLoading(false));
    }
  }, [user]);

  // 2. Aktif Sohbetin Mesajlarını Getir
  useEffect(() => {
    if (!activeConvId || !user) return;

    getMessagesClient(activeConvId).then(data => {
      setMessages(data || []);
      markMessagesAsReadClient(activeConvId, user.id);
      scrollToBottom();
    });
  }, [activeConvId, user]);

  // 3. REALTIME LİSTENER (Kanca kullanarak)
  // Sadece aktif sohbet penceresi açıksa o sohbetin mesajlarını dinle
  useRealtimeSubscription({
      table: 'messages',
      filter: activeConvId ? \`conversation_id=eq.\${activeConvId}\` : undefined,
      event: 'INSERT',
      callback: (payload) => {
          // Yeni mesaj geldiğinde listeye ekle (eğer zaten yoksa)
          setMessages(current => {
              if (current.some(m => m.id === payload.new.id)) return current;
              return [...current, payload.new];
          });

          if (user && payload.new.sender_id !== user.id && activeConvId) {
             markMessagesAsReadClient(activeConvId, user.id);
          }
          scrollToBottom();
      }
  });

  const activeConv = Array.isArray(conversations) ? conversations.find(c => c.id === activeConvId) : null;

  const scrollToBottom = () => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user || !activeConvId) return;

    const tempMsg = {
        id: Date.now(),
        conversation_id: activeConvId,
        sender_id: user.id,
        content: inputText,
        created_at: new Date().toISOString(),
        is_pending: true
    };

    setMessages(prev => [...prev, tempMsg]);
    setInputText('');
    scrollToBottom();

    const { error } = await sendMessageClient(activeConvId, user.id, tempMsg.content);
    if(error) addToast('Mesaj gönderilemedi', 'error');
  };

  if (!user) return <div className="p-10 text-center text-gray-500">Giriş yapmalısınız.</div>;

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm h-[calc(100vh-140px)] min-h-[600px] flex overflow-hidden dark:bg-[#1c1c1c] dark:border-gray-700">

      {/* SOL: LİSTE */}
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

      {/* SAĞ: SOHBET */}
      <div className={\`flex-1 flex flex-col bg-[#e5ddd5] dark:bg-[#0b141a] \${!activeConvId ? 'hidden md:flex' : 'flex'}\`}>
        {activeConv ? (
          <>
            <div className="bg-white border-b border-gray-200 shadow-sm z-10 dark:bg-[#1c1c1c] dark:border-gray-700">
                <div className="md:hidden p-2 border-b border-gray-100 flex items-center">
                    <button onClick={() => setActiveConvId(null)} className="flex items-center text-gray-600 font-bold text-sm"><ArrowLeft size={16} className="mr-1"/> Geri</button>
                </div>
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

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {messages.map(msg => (
                <div key={msg.id} className={\`flex \${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}\`}>
                  <div className={\`max-w-[80%] px-3 py-1.5 rounded-lg text-sm shadow-sm relative \${msg.sender_id === user.id ? 'bg-[#dcf8c6] dark:bg-[#005c4b] text-black dark:text-white rounded-tr-none' : 'bg-white dark:bg-[#202c33] text-black dark:text-white rounded-tl-none'}\`}>
                    <p className="break-words">{msg.content}</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-[9px] text-gray-500 dark:text-gray-400">
                            {msg.is_pending ? '...' : new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-3 bg-[#f0f2f5] dark:bg-[#202c33] flex gap-2 items-center">
              <input value={inputText} onChange={e => setInputText(e.target.value)} className="flex-1 border-none rounded-full px-4 py-2.5 outline-none text-sm dark:bg-[#2a3942] dark:text-white placeholder:text-gray-500" placeholder="Mesaj yazın..." autoFocus />
              <button type="submit" disabled={!inputText.trim()} className="bg-[#008a7c] text-white p-2.5 rounded-full hover:bg-[#006e63] transition-colors disabled:opacity-50 transform active:scale-95"><Send size={18}/></button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 p-8 text-center bg-[#f0f2f5] dark:bg-[#111]">
             <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-4 dark:bg-gray-800 opacity-20"><MessageSquareOff size={64}/></div>
             <h3 className="font-bold text-lg mb-2">Sohbet Seçin</h3>
             <p className="text-sm max-w-xs">Sol taraftaki listeden bir sohbet seçerek anlık mesajlaşmaya başlayın.</p>
          </div>
        )}
      </div>
    </div>
  );
}
`;
writeFile("app/bana-ozel/mesajlarim/page.tsx", chatPageUpdate);

console.log(
  colors.green +
    "\\n✅ SENIOR UPGRADE V9 TAMAMLANDI! (Real-Time & Social Proof)" +
    "\\n⚠️ GÖREV: 'supabase/realtime.sql' dosyasını Supabase SQL Editor'de çalıştırarak Realtime özelliğini aktif edin." +
    "\\nArtık kullanıcılar mesajlaştığında sayfa yenilemeye gerek kalmayacak ve ilanlarda 'Şu an X kişi bakıyor' yazacak." +
    colors.reset,
);
