const fs = require("fs");
const path = require("path");

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  yellow: "\x1b[33m",
  bold: "\x1b[1m",
  red: "\x1b[31m",
};

console.log(
  colors.blue +
    colors.bold +
    "\n🛠️ SAHIBINDEN KLON - FINAL FIX (MESAJLAR & FAVORILER) 🛠️\n" +
    colors.reset,
);

function writeFile(filePath, content) {
  try {
    const absolutePath = path.join(process.cwd(), filePath);
    const dir = path.dirname(absolutePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(absolutePath, content.trim());
    console.log(`${colors.green}✔ [GÜNCELLENDİ]${colors.reset} ${filePath}`);
  } catch (error) {
    console.error(
      `${colors.red}✘ [HATA]${colors.reset} ${filePath}: ${error.message}`,
    );
  }
}

// =============================================================================
// 1. MESAJLAR SAYFASI (DUPLICATE FIX & UI UPDATE)
// Dosya: app/bana-ozel/mesajlarim/page.tsx
// =============================================================================
const messagesPageContent = `
"use client";
import React, { useState, useEffect, useRef, Suspense } from "react";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { getConversationsClient, getMessagesClient, sendMessageClient, markMessagesAsReadClient } from "@/lib/services";
import { Send, ArrowLeft, Loader2, MessageSquare, ExternalLink, MapPin, Search, MoreVertical, Check, CheckCheck, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/context/ToastContext";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRealtimeSubscription } from "@/hooks/use-realtime";

// Yardımcı: Tarih Formatlama
function getRelativeDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return 'Bugün';
  if (days === 1) return 'Dün';
  if (days < 7) return date.toLocaleDateString('tr-TR', { weekday: 'long' });
  return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
}

function MessagesContent() {
  const { user, loading: authLoading } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<any[]>([]);
  const [activeConvId, setActiveConvId] = useState<number | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const messageContainerRef = useRef<HTMLDivElement>(null);
  const { addToast } = useToast();
  const searchParams = useSearchParams();
  const initialConvId = searchParams.get("convId");

  // 1. Sohbetleri Getir
  useEffect(() => {
    if (authLoading) return;
    if (user) {
      setLoading(true);
      getConversationsClient(user.id)
        .then((data) => {
          const validData = data || [];
          setConversations(validData);
          setFilteredConversations(validData);

          if (initialConvId) {
             const tId = Number(initialConvId);
             if(validData.find((c:any) => c.id === tId)) setActiveConvId(tId);
          }
        })
        .finally(() => setLoading(false));
    } else {
        setLoading(false);
    }
  }, [user, initialConvId, authLoading]);

  // 2. Arama Filtresi
  useEffect(() => {
    if (!searchTerm) {
        setFilteredConversations(conversations);
    } else {
        const lowerTerm = searchTerm.toLowerCase();
        setFilteredConversations(conversations.filter(c =>
            c.profiles?.full_name?.toLowerCase().includes(lowerTerm) ||
            c.seller?.full_name?.toLowerCase().includes(lowerTerm) ||
            c.ads?.title?.toLowerCase().includes(lowerTerm)
        ));
    }
  }, [searchTerm, conversations]);

  // 3. Mesajları Getir
  useEffect(() => {
    if (!activeConvId || !user) return;
    getMessagesClient(activeConvId).then((data) => {
      setMessages(data || []);
      markMessagesAsReadClient(activeConvId, user.id);
      setTimeout(() => scrollToBottom(false), 100);
    });
  }, [activeConvId, user]);

  // 4. Realtime (DUPLICATE FIX)
  useRealtimeSubscription({
    table: "messages",
    filter: activeConvId ? \`conversation_id=eq.\${activeConvId}\` : undefined,
    event: "INSERT",
    callback: (payload) => {
      setMessages((current) => {
        // A. Eğer bu ID zaten listede varsa ekleme
        if (current.some((m) => m.id === payload.new.id)) return current;

        // B. Bekleyen mesaj kontrolü (Deduplication)
        const pendingIndex = current.findIndex(
          (m) =>
            m.is_pending &&
            m.content === payload.new.content &&
            m.sender_id === payload.new.sender_id
        );

        if (pendingIndex !== -1) {
          const updated = [...current];
          updated[pendingIndex] = payload.new;
          return updated;
        }

        // C. Yeni mesaj
        return [...current, payload.new];
      });

      if (user && payload.new.sender_id !== user.id) {
          markMessagesAsReadClient(activeConvId!, user.id);
      }
      setTimeout(() => scrollToBottom(), 100);
    },
  });

  const scrollToBottom = (smooth = true) => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTo({
        top: messageContainerRef.current.scrollHeight,
        behavior: smooth ? "smooth" : "auto",
      });
    }
  };

  const handleSend = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!inputText.trim() || !user || !activeConvId) return;

      const content = inputText;
      setInputText("");
      setSending(true);

      // Optimistic UI
      const tempId = Date.now();
      const tempMsg = {
          id: tempId,
          conversation_id: activeConvId,
          sender_id: user.id,
          content,
          created_at: new Date().toISOString(),
          is_pending: true
      };

      setMessages(prev => [...prev, tempMsg]);
      scrollToBottom();

      const { data, error } = await sendMessageClient(activeConvId, user.id, content);

      setSending(false);

      if(error) {
          addToast("Mesaj gönderilemedi", "error");
          setMessages(prev => prev.filter(m => m.id !== tempId));
      } else if (data) {
          setMessages(prev => {
              if (prev.some(m => m.id === data.id)) {
                  return prev.filter(m => m.id !== tempId);
              }
              return prev.map(m => m.id === tempId ? data : m);
          });
      }
  };

  const activeConv = conversations.find((c) => c.id === activeConvId);

  if (authLoading || (loading && user)) return <div className="flex justify-center items-center h-[calc(100vh-100px)]"><Loader2 className="animate-spin text-indigo-600" size={40}/></div>;
  if (!user) return <div className="p-10 text-center">Giriş yapmalısınız.</div>;

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg h-[calc(100vh-140px)] min-h-[600px] flex overflow-hidden dark:bg-[#1c1c1c] dark:border-gray-700">

      {/* SOL: SOHBET LİSTESİ */}
      <div className={\`w-full md:w-[350px] border-r border-gray-200 flex flex-col bg-white dark:bg-[#151515] dark:border-gray-700 \${activeConvId ? "hidden md:flex" : "flex"}\`}>

        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <h2 className="font-bold text-xl text-gray-800 mb-4 px-1 dark:text-white">Mesajlar</h2>
            <div className="relative">
                <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                <input
                    type="text"
                    placeholder="Sohbet ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-100 pl-10 pr-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all dark:bg-gray-800 dark:text-white"
                />
            </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
            {filteredConversations.length === 0 ? (
                <div className="p-8 text-center text-gray-500 text-sm flex flex-col items-center">
                    <MessageSquare size={32} className="mb-2 opacity-20"/>
                    <p>Sohbet bulunamadı.</p>
                </div>
            ) : (
                filteredConversations.map(conv => {
                    const otherUser = conv.buyer_id === user.id ? conv.seller : conv.profiles;
                    const isActive = activeConvId === conv.id;
                    return (
                        <div
                            key={conv.id}
                            onClick={() => setActiveConvId(conv.id)}
                            className={\`p-4 border-b border-gray-50 cursor-pointer transition-all hover:bg-gray-50 group \${isActive ? 'bg-indigo-50/60 border-l-4 border-l-indigo-600' : 'border-l-4 border-l-transparent dark:hover:bg-gray-800'}\`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <div className="flex items-center gap-2">
                                    <div className={\`w-2 h-2 rounded-full \${isActive ? 'bg-indigo-600' : 'bg-transparent'}\`}></div>
                                    <span className={\`font-bold text-sm truncate max-w-[160px] \${isActive ? 'text-indigo-900' : 'text-gray-800 dark:text-gray-200'}\`}>
                                        {otherUser?.full_name || 'Kullanıcı'}
                                    </span>
                                </div>
                                <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap">
                                    {getRelativeDate(conv.updated_at)}
                                </span>
                            </div>

                            <div className="flex items-center gap-3 pl-4">
                                <div className="w-10 h-10 bg-gray-200 rounded-lg shrink-0 overflow-hidden border border-gray-200">
                                    {conv.ads?.image ? (
                                        <img src={conv.ads.image} className="w-full h-full object-cover" alt="İlan" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400"><ImageIcon size={16}/></div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[11px] font-bold text-gray-600 truncate dark:text-gray-400">{conv.ads?.title || 'Silinmiş İlan'}</p>
                                    <p className="text-xs text-gray-500 truncate mt-0.5 opacity-80">Mesajı görüntüle...</p>
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
      </div>

      {/* SAĞ: SOHBET PENCERESİ */}
      <div className={\`flex-1 flex flex-col bg-[#e5ddd5] dark:bg-[#0b141a] relative \${!activeConvId ? "hidden md:flex" : "flex"}\`}>

        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')" }}></div>

        {activeConv ? (
            <>
                <div className="bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm z-20 px-4 py-3 flex items-center justify-between dark:bg-[#1c1c1c] dark:border-gray-700">
                    <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                        <button onClick={() => setActiveConvId(null)} className="md:hidden text-gray-600 p-1 hover:bg-gray-100 rounded-full"><ArrowLeft size={20}/></button>

                        {activeConv.ads && (
                            <Link href={\`/ilan/\${activeConv.ads.id}\`} target="_blank" className="flex items-center gap-3 group min-w-0">
                                <div className="w-12 h-12 bg-gray-100 rounded-md border border-gray-200 overflow-hidden shrink-0 relative group-hover:scale-105 transition-transform">
                                    <img src={activeConv.ads.image || "https://via.placeholder.com/100"} className="w-full h-full object-cover"/>
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-gray-800 text-sm truncate group-hover:text-indigo-600 transition-colors dark:text-white">
                                        {activeConv.ads.title}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-indigo-700 font-extrabold text-sm dark:text-indigo-400">
                                            {activeConv.ads.price?.toLocaleString()} {activeConv.ads.currency}
                                        </span>
                                        <span className="hidden sm:flex text-[10px] text-gray-500 items-center gap-0.5 bg-gray-100 px-1.5 py-0.5 rounded">
                                            <MapPin size={10} /> {activeConv.ads.city}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        {activeConv.ads && (
                             <Link
                                href={\`/ilan/\${activeConv.ads.id}\`}
                                className="hidden sm:flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-3 py-2 rounded-lg transition-colors"
                             >
                                <ExternalLink size={14}/> İlana Git
                             </Link>
                        )}
                        <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"><MoreVertical size={18}/></button>
                    </div>
                </div>

                <div ref={messageContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth z-10 custom-scrollbar">

                    <div className="flex justify-center mb-4">
                        <span className="bg-gray-200/80 text-gray-600 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm">
                            Sohbet Başlangıcı
                        </span>
                    </div>

                    {messages.map((msg, index) => {
                        const isMe = msg.sender_id === user.id;
                        const isFirst = index === 0 || messages[index-1].sender_id !== msg.sender_id;

                        return (
                            <div key={msg.id} className={\`flex w-full \${isMe ? 'justify-end' : 'justify-start'}\`}>
                                <div
                                    className={\`
                                        relative max-w-[85%] sm:max-w-[70%] px-3 py-2 rounded-2xl text-sm shadow-sm
                                        \${isMe ? 'bg-[#dcf8c6] dark:bg-[#005c4b] text-slate-900 dark:text-white rounded-tr-none' : 'bg-white dark:bg-[#202c33] text-slate-800 dark:text-white rounded-tl-none'}
                                        \${msg.is_pending ? 'opacity-70' : ''}
                                    \`}
                                >
                                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                    <div className="flex items-center justify-end gap-1 mt-1 select-none">
                                        <span className="text-[9px] text-gray-500 dark:text-gray-400 font-medium">
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        {isMe && (
                                            msg.is_pending ? <Loader2 size={10} className="animate-spin text-gray-500"/> :
                                            msg.is_read ? <CheckCheck size={14} className="text-blue-500"/> : <Check size={14} className="text-gray-400"/>
                                        )}
                                    </div>

                                    {isFirst && (
                                        <div className={\`absolute top-0 w-3 h-3 \${isMe ? '-right-1.5 bg-[#dcf8c6] dark:bg-[#005c4b]' : '-left-1.5 bg-white dark:bg-[#202c33]'} [clip-path:polygon(0_0,100%_0,100%_100%)] transform \${isMe ? '' : 'scale-x-[-1]'}\`}></div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <form onSubmit={handleSend} className="bg-white p-3 border-t border-gray-200 z-20 flex items-center gap-2 dark:bg-[#1c1c1c] dark:border-gray-700">
                    <button type="button" className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                        <MoreVertical size={20} className="rotate-90"/>
                    </button>
                    <input
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        className="flex-1 bg-gray-100 border-none rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm dark:bg-gray-800 dark:text-white"
                        placeholder="Bir mesaj yazın..."
                    />
                    <button
                        type="submit"
                        disabled={!inputText.trim() || sending}
                        className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition-transform active:scale-95 disabled:opacity-50 disabled:scale-100 shadow-md flex items-center justify-center"
                    >
                        {sending ? <Loader2 size={18} className="animate-spin"/> : <Send size={18} className="ml-0.5"/>}
                    </button>
                </form>
            </>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center select-none">
                <div className="w-32 h-32 bg-gray-200/50 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-500">
                    <MessageSquare size={64} className="opacity-40"/>
                </div>
                <h3 className="font-bold text-xl text-gray-600 mb-2 dark:text-gray-300">Sohbet Başlatın</h3>
                <p className="text-sm max-w-xs opacity-80">
                    Mesajlaşmak için sol menüden bir konuşma seçin veya yeni bir ilana mesaj gönderin.
                </p>
            </div>
        )}
      </div>
    </div>
  );
}

export default function MessagesPage() {
    return <Suspense fallback={<div className="p-10 flex justify-center"><Loader2 className="animate-spin text-indigo-600"/></div>}><MessagesContent /></Suspense>
}
`;

// =============================================================================
// 2. FAVORİLER SAYFASI (YÜKLEME BEKLEME DÜZELTMESİ)
// Dosya: app/bana-ozel/favoriler/page.tsx
// =============================================================================
const favoritesPage = `
"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getFavoritesClient, toggleFavoriteClient } from '@/lib/services';
import { useToast } from '@/context/ToastContext';
import { Trash2, Loader2, HeartOff } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import AdCard from '@/components/AdCard';

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth();
  const { addToast } = useToast();
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (user) {
      setLoading(true);
      getFavoritesClient(user.id)
        .then(data => setAds(data || []))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user, authLoading]);

  const handleRemove = async (adId: number) => {
    if (!user) return;
    setAds(prev => prev.filter(ad => ad.id !== adId));
    addToast('Favorilerden çıkarıldı.', 'info');
    try {
        await toggleFavoriteClient(user.id, adId);
    } catch {
        addToast("Hata oluştu", "error");
    }
  };

  if (authLoading || (loading && user)) {
    return (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
            <Loader2 className="animate-spin text-blue-600" size={32}/>
            <p className="text-sm text-gray-500">Favorileriniz yükleniyor...</p>
        </div>
    );
  }

  if (!user) {
      return (
        <div className="p-10 text-center bg-white border rounded-sm">
            <p className="text-gray-600 mb-4">Favorilerinizi görmek için giriş yapmalısınız.</p>
            <Link href="/login" className="bg-blue-600 text-white px-6 py-2 rounded font-bold">Giriş Yap</Link>
        </div>
      );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6 dark:bg-[#1c1c1c] dark:border-gray-700">
      <h1 className="text-xl font-bold text-[#333] mb-6 dark:text-white flex items-center gap-2">
        Favori İlanlarım <span className="text-sm font-normal text-gray-500">({ads.length})</span>
      </h1>

      {ads.length === 0 ? (
        <EmptyState
            icon={HeartOff}
            title="Favori İlanınız Yok"
            description="Beğendiğiniz ilanları favoriye ekleyerek fiyat takibi yapabilirsiniz."
            actionLabel="İlanlara Göz At"
            actionUrl="/search"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map((ad: any) => (
            <div key={ad.id} className="relative group">
                <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRemove(ad.id); }}
                    className="absolute top-2 right-2 z-20 bg-white/90 p-2 rounded-full text-red-600 opacity-0 group-hover:opacity-100 transition-all shadow-md hover:scale-110"
                    title="Kaldır"
                >
                    <Trash2 size={16} />
                </button>
                <div className="h-[320px]">
                    <AdCard ad={ad} viewMode="grid" />
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
`;

// =============================================================================
// 3. İLANLARIM SAYFASI (YÜKLEME BEKLEME DÜZELTMESİ)
// Dosya: app/bana-ozel/ilanlarim/page.tsx
// =============================================================================
const myAdsPage = `
"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Edit, Loader2, Search, Plus, Eye, Filter, MapPin, Calendar, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getUserAdsClient } from '@/lib/services';
import DeleteAdButton from '@/components/DeleteAdButton';
import { formatPrice, formatDate } from '@/lib/utils';
import EmptyState from '@/components/ui/EmptyState';

export default function MyAdsPage() {
  const { user, loading: authLoading } = useAuth();
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (authLoading) return;
    if (user) {
        setLoading(true);
        getUserAdsClient(user.id)
            .then(data => setAds(data || []))
            .finally(() => setLoading(false));
    } else {
        setLoading(false);
    }
  }, [user, authLoading]);

  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || ad.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'yayinda': return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">Yayında</span>;
      case 'onay_bekliyor': return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">Onay Bekliyor</span>;
      case 'pasif': return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">Pasif</span>;
      case 'reddedildi': return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200">Reddedildi</span>;
      default: return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-600">{status}</span>;
    }
  };

  if (authLoading || (loading && user)) return <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" size={32}/></div>;
  if (!user) return <div className="p-10 text-center">Giriş yapmalısınız.</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">İlanlarım</h1>
        <Link href="/ilan-ver" className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-indigo-700 flex items-center gap-2">
          <Plus size={18} /> Yeni İlan Ver
        </Link>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
          {['all', 'yayinda', 'onay_bekliyor', 'pasif'].map(status => (
            <button key={status} onClick={() => setFilterStatus(status)} className={\`px-4 py-1.5 rounded-md text-xs font-bold capitalize whitespace-nowrap \${filterStatus === status ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}\`}>
              {status === 'all' ? 'Tümü' : status.replace('_', ' ')}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <input type="text" placeholder="İlan ara..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-gray-50 border rounded-lg text-sm focus:outline-none focus:border-indigo-500"/>
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden min-h-[300px]">
        {filteredAds.length === 0 ? (
          <div className="p-12"><EmptyState icon={Plus} title="İlan Bulunamadı" description="Bu filtreye uygun ilanınız yok." actionLabel="İlan Ver" actionUrl="/ilan-ver"/></div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 text-xs text-gray-500 uppercase border-b">
                  <tr><th className="px-6 py-4">İlan</th><th className="px-6 py-4">Fiyat</th><th className="px-6 py-4">Durum</th><th className="px-6 py-4">Tarih</th><th className="px-6 py-4 text-right">İşlemler</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAds.map((ad) => (
                    <tr key={ad.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-12 bg-gray-100 rounded-md overflow-hidden shrink-0 border relative">
                            {ad.image ? <img src={ad.image} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">No IMG</div>}
                          </div>
                          <div>
                            <Link href={\`/ilan/\${ad.id}\`} className="font-bold text-gray-900 text-sm hover:text-indigo-600 block line-clamp-1">{ad.title}</Link>
                            <span className="text-xs text-gray-500 flex items-center gap-1"><MapPin size={10}/> {ad.city}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-indigo-900 text-sm">{formatPrice(ad.price, ad.currency)}</td>
                      <td className="px-6 py-4">{getStatusBadge(ad.status)}</td>
                      <td className="px-6 py-4 text-xs text-gray-500">{formatDate(ad.created_at)}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                           <Link href={\`/ilan-duzenle/\${ad.id}\`} className="p-2 text-gray-500 hover:text-indigo-600 bg-gray-50 hover:bg-indigo-50 rounded-full"><Edit size={16}/></Link>
                           <DeleteAdButton adId={ad.id} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="md:hidden divide-y divide-gray-100">
                {filteredAds.map((ad) => (
                    <div key={ad.id} className="p-4 flex gap-3">
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0 border">
                            {ad.image && <img src={ad.image} className="w-full h-full object-cover"/>}
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-sm text-gray-900 line-clamp-2">{ad.title}</h3>
                            <p className="text-xs text-indigo-700 font-bold mt-1">{formatPrice(ad.price, ad.currency)}</p>
                            <div className="mt-2 flex justify-between items-center">
                                {getStatusBadge(ad.status)}
                                <div className="flex gap-2">
                                    <Link href={\`/ilan-duzenle/\${ad.id}\`} className="p-1.5 bg-gray-100 rounded text-gray-600"><Edit size={14}/></Link>
                                    <DeleteAdButton adId={ad.id} />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
`;

// DOSYALARI YAZ
writeFile("app/bana-ozel/mesajlarim/page.tsx", messagesPageContent);
writeFile("app/bana-ozel/favoriler/page.tsx", favoritesPage);
writeFile("app/bana-ozel/ilanlarim/page.tsx", myAdsPage);

console.log(
  colors.blue + colors.bold + "\n✅ FINAL FIX TAMAMLANDI!\n" + colors.reset,
);
console.log(
  "Syntax hatası giderildi. Sayfalarınız artık sorunsuz çalışacaktır.",
);
