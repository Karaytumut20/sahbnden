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
    "\n🧹 SAHIBINDEN KLON - DARK MODE TEMİZLİĞİ VE UI DÜZELTMELERİ 🧹\n" +
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

/* ANALİZ SONUÇLARI VE YAPILAN DEĞİŞİKLİKLER:
   1. Providers.tsx: ThemeProvider sarmalayıcısı kaldırıldı.
   2. globals.css: :root içindeki renk tanımları sadeleştirildi, dark mode değişkenleri silindi.
   3. Mesajlar Sayfası: 'dark:bg-[#1c1c1c]', 'dark:text-white' gibi tüm koyu tema sınıfları temizlendi.
   4. Favoriler Sayfası: Koyu arka plan ve kenarlık renkleri kaldırıldı.
   5. Mağazam Sayfası: Form elemanlarındaki koyu mod stilleri temizlendi.
   6. FilterSidebar, Footer, RecentAdsWidget: Bu bileşenlerdeki 'dark:' ön ekli sınıflar temizlendi.
   7. ThemeContext: Dosya silinmedi (import hatası olmaması için) ancak içi boşaltılarak etkisiz hale getirildi.
*/

// =============================================================================
// 1. PROVIDERS (ThemeProvider Kaldırıldı)
// =============================================================================
const providersContent = `
"use client";
import React from "react";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { CompareProvider } from "@/context/CompareContext";
import { HistoryProvider } from "@/context/HistoryContext";
import { NotificationProvider } from "@/context/NotificationContext";
import { ModalProvider } from "@/context/ModalContext";
import { MessageProvider } from "@/context/MessageContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <NotificationProvider>
          <ModalProvider>
            <FavoritesProvider>
              <CompareProvider>
                <HistoryProvider>
                  <MessageProvider>
                    {children}
                  </MessageProvider>
                </HistoryProvider>
              </CompareProvider>
            </FavoritesProvider>
          </ModalProvider>
        </NotificationProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
`;

// =============================================================================
// 2. GLOBAL CSS (Sadeleştirildi)
// =============================================================================
const globalsCss = `
@import "tailwindcss";

@theme {
  /* Modern Slate & Indigo Paleti - Light Mode Only */
  --color-background: #F8FAFC; /* Slate-50 */
  --color-foreground: #0F172A; /* Slate-900 */

  --color-primary: #4F46E5; /* Indigo-600 */
  --color-primary-hover: #4338CA; /* Indigo-700 */

  --color-secondary: #FFD600; /* Canlı Sarı */

  --color-border: #E2E8F0; /* Slate-200 */
  --color-card: #FFFFFF;

  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;

  /* Premium Gölgeler */
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  --shadow-soft: 0 20px 40px -10px rgba(0,0,0,0.08);

  /* Yuvarlaklık Standartları */
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
}

body {
  background-color: var(--color-background);
  color: var(--color-foreground);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}

/* Scrollbar Güzelleştirme */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #CBD5E1; border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: #94A3B8; }

.container-grid {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 1.5rem;
}
`;

// =============================================================================
// 3. MESAJLAR SAYFASI (Tüm 'dark:' classları silindi)
// =============================================================================
const messagesPage = `
"use client";
import React, { useState, useEffect, useRef, Suspense } from "react";
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

  useEffect(() => {
    if (!activeConvId || !user) return;
    getMessagesClient(activeConvId).then((data) => {
      setMessages(data || []);
      markMessagesAsReadClient(activeConvId, user.id);
      setTimeout(() => scrollToBottom(false), 100);
    });
  }, [activeConvId, user]);

  useRealtimeSubscription({
    table: "messages",
    filter: activeConvId ? \`conversation_id=eq.\${activeConvId}\` : undefined,
    event: "INSERT",
    callback: (payload) => {
      setMessages((current) => {
        if (current.some((m) => m.id === payload.new.id)) return current;
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
    <div className="bg-white border border-gray-200 rounded-xl shadow-lg h-[calc(100vh-140px)] min-h-[600px] flex overflow-hidden">

      {/* SOL: SOHBET LİSTESİ */}
      <div className={\`w-full md:w-[350px] border-r border-gray-200 flex flex-col bg-white \${activeConvId ? "hidden md:flex" : "flex"}\`}>

        <div className="p-4 border-b border-gray-100">
            <h2 className="font-bold text-xl text-gray-800 mb-4 px-1">Mesajlar</h2>
            <div className="relative">
                <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                <input
                    type="text"
                    placeholder="Sohbet ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-gray-100 pl-10 pr-4 py-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-gray-700"
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
                            className={\`p-4 border-b border-gray-50 cursor-pointer transition-all hover:bg-gray-50 group \${isActive ? 'bg-indigo-50/60 border-l-4 border-l-indigo-600' : 'border-l-4 border-l-transparent'}\`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <div className="flex items-center gap-2">
                                    <div className={\`w-2 h-2 rounded-full \${isActive ? 'bg-indigo-600' : 'bg-transparent'}\`}></div>
                                    <span className={\`font-bold text-sm truncate max-w-[160px] \${isActive ? 'text-indigo-900' : 'text-gray-800'}\`}>
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
                                    <p className="text-[11px] font-bold text-gray-600 truncate">{conv.ads?.title || 'Silinmiş İlan'}</p>
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
      <div className={\`flex-1 flex flex-col bg-[#e5ddd5] relative \${!activeConvId ? "hidden md:flex" : "flex"}\`}>

        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')" }}></div>

        {activeConv ? (
            <>
                <div className="bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm z-20 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                        <button onClick={() => setActiveConvId(null)} className="md:hidden text-gray-600 p-1 hover:bg-gray-100 rounded-full"><ArrowLeft size={20}/></button>

                        {activeConv.ads && (
                            <Link href={\`/ilan/\${activeConv.ads.id}\`} target="_blank" className="flex items-center gap-3 group min-w-0">
                                <div className="w-12 h-12 bg-gray-100 rounded-md border border-gray-200 overflow-hidden shrink-0 relative group-hover:scale-105 transition-transform">
                                    <img src={activeConv.ads.image || "https://via.placeholder.com/100"} className="w-full h-full object-cover"/>
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-gray-800 text-sm truncate group-hover:text-indigo-600 transition-colors">
                                        {activeConv.ads.title}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <span className="text-indigo-700 font-extrabold text-sm">
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
                                        \${isMe ? 'bg-[#dcf8c6] text-slate-900 rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none'}
                                        \${msg.is_pending ? 'opacity-70' : ''}
                                    \`}
                                >
                                    <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                    <div className="flex items-center justify-end gap-1 mt-1 select-none">
                                        <span className="text-[9px] text-gray-500 font-medium">
                                            {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                        {isMe && (
                                            msg.is_pending ? <Loader2 size={10} className="animate-spin text-gray-500"/> :
                                            msg.is_read ? <CheckCheck size={14} className="text-blue-500"/> : <Check size={14} className="text-gray-400"/>
                                        )}
                                    </div>

                                    {isFirst && (
                                        <div className={\`absolute top-0 w-3 h-3 \${isMe ? '-right-1.5 bg-[#dcf8c6]' : '-left-1.5 bg-white'} [clip-path:polygon(0_0,100%_0,100%_100%)] transform \${isMe ? '' : 'scale-x-[-1]'}\`}></div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <form onSubmit={handleSend} className="bg-white p-3 border-t border-gray-200 z-20 flex items-center gap-2">
                    <button type="button" className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                        <MoreVertical size={20} className="rotate-90"/>
                    </button>
                    <input
                        value={inputText}
                        onChange={e => setInputText(e.target.value)}
                        className="flex-1 bg-gray-100 border-none rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm text-gray-800"
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
                <h3 className="font-bold text-xl text-gray-600 mb-2">Sohbet Başlatın</h3>
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
// 4. MAĞAZA SAYFASI
// =============================================================================
const myStorePage = `
"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { createStoreAction, updateStoreAction, getMyStoreServer } from '@/lib/actions';
import { uploadImageClient } from '@/lib/services';
import { Store, Save, Upload, ExternalLink, Loader2, Image as ImageIcon } from 'lucide-react';

export default function MyStorePage() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [store, setStore] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    phone: '',
    location: '',
    website: '',
    image: '',
    banner: ''
  });

  const logoInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchStore = async () => {
      const data = await getMyStoreServer();
      if (data) {
        setStore(data);
        setFormData({
          name: data.name || '',
          slug: data.slug || '',
          description: data.description || '',
          phone: data.phone || '',
          location: data.location || '',
          website: data.website || '',
          image: data.image || '',
          banner: data.banner || ''
        });
      }
      setLoading(false);
    };
    fetchStore();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'name' && !store) {
      setFormData(prev => ({
        ...prev,
        name: value,
        slug: value.toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '')
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image' | 'banner') => {
    if (!e.target.files?.length) return;

    setSubmitting(true);
    try {
      const url = await uploadImageClient(e.target.files[0]);
      setFormData(prev => ({ ...prev, [field]: url }));
      addToast(field === 'image' ? 'Logo yüklendi.' : 'Kapak fotoğrafı yüklendi.', 'success');
    } catch {
      addToast('Yükleme başarısız.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    let res;
    if (store) {
      res = await updateStoreAction(formData);
    } else {
      res = await createStoreAction(formData);
    }

    if (res.error) {
      addToast(res.error, 'error');
    } else {
      addToast(store ? 'Mağaza güncellendi.' : 'Mağazanız başarıyla açıldı!', 'success');
      if (!store) window.location.reload();
    }
    setSubmitting(false);
  };

  if (loading) return <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-blue-600"/></div>;

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6">
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
        <h1 className="text-xl font-bold text-[#333] flex items-center gap-2">
          <Store size={24} className="text-blue-600" />
          {store ? 'Mağaza Yönetimi' : 'Mağaza Aç'}
        </h1>
        {store && (
          <Link href={\`/magaza/\${store.slug}\`} target="_blank" className="flex items-center gap-1 text-sm text-blue-600 hover:underline font-medium">
            Mağazayı Görüntüle <ExternalLink size={14}/>
          </Link>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">

        <div className="space-y-4">
          <div
            className="w-full h-32 bg-gray-100 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 relative overflow-hidden group"
            onClick={() => bannerInputRef.current?.click()}
          >
            {formData.banner ? (
              <img src={formData.banner} className="w-full h-full object-cover" />
            ) : (
              <div className="text-center text-gray-400">
                <ImageIcon size={24} className="mx-auto mb-1"/>
                <span className="text-xs">Kapak Fotoğrafı Ekle (1200x300)</span>
              </div>
            )}
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold">Değiştir</div>
            <input type="file" ref={bannerInputRef} onChange={(e) => handleImageUpload(e, 'banner')} className="hidden" accept="image/*" />
          </div>

          <div className="flex items-end gap-4 -mt-10 ml-4 relative z-10">
            <div
              className="w-24 h-24 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center cursor-pointer overflow-hidden relative group shadow-md"
              onClick={() => logoInputRef.current?.click()}
            >
              {formData.image ? (
                <img src={formData.image} className="w-full h-full object-cover" />
              ) : (
                <Upload size={20} className="text-gray-400"/>
              )}
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-[10px]">Logo</div>
              <input type="file" ref={logoInputRef} onChange={(e) => handleImageUpload(e, 'image')} className="hidden" accept="image/*" />
            </div>
            <div className="pb-2">
               <p className="text-xs text-gray-500">Kurumsal kimliğinizi yansıtan logo ve kapak görseli yükleyin.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Mağaza Adı</label>
            <input name="name" value={formData.name} onChange={handleInputChange} className="w-full border p-2 rounded-sm outline-none" required placeholder="Örn: Güven Emlak" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Mağaza Linki (Slug)</label>
            <input name="slug" value={formData.slug} onChange={handleInputChange} className="w-full border p-2 rounded-sm outline-none bg-gray-50 text-gray-500" required readOnly={!!store} />
            <p className="text-[10px] text-gray-400 mt-1">sahibinden-klon.com/magaza/{formData.slug || '...'}</p>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-600 mb-1">Açıklama / Hakkımızda</label>
          <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full border p-2 rounded-sm outline-none h-24 resize-none" placeholder="Müşterilerinize kendinizden bahsedin..." required></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Telefon</label>
            <input name="phone" value={formData.phone} onChange={handleInputChange} className="w-full border p-2 rounded-sm outline-none" placeholder="0212..." />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Konum (İl / İlçe)</label>
            <input name="location" value={formData.location} onChange={handleInputChange} className="w-full border p-2 rounded-sm outline-none" placeholder="İstanbul / Kadıköy" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1">Web Sitesi</label>
            <input name="website" value={formData.website} onChange={handleInputChange} className="w-full border p-2 rounded-sm outline-none" placeholder="www.ornek.com" />
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-8 py-3 rounded-sm font-bold text-sm hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50">
            {submitting ? <Loader2 className="animate-spin" size={16}/> : <Save size={16}/>}
            {store ? 'Değişiklikleri Kaydet' : 'Mağazayı Oluştur'}
          </button>
        </div>

      </form>
    </div>
  );
}
`;

// =============================================================================
// 5. FAVORİLER SAYFASI
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
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6">
      <h1 className="text-xl font-bold text-[#333] mb-6 flex items-center gap-2">
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
// 6. DİĞER BİLEŞENLER
// =============================================================================

const filterSidebar = `
"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, Check, RotateCcw, ChevronLeft, Car, Home, MapPin, Loader2 } from 'lucide-react';
import { categories } from '@/lib/data';
import { getLocationsServer, getFacetCountsServer } from '@/lib/actions';

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategorySlug = searchParams.get('category');

  const [provinces, setProvinces] = useState<any[]>([]);
  const [facetCounts, setFacetCounts] = useState<Record<string, number>>({});
  const [loadingLoc, setLoadingLoc] = useState(true);

  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    room: searchParams.get('room') || '',
    minYear: searchParams.get('minYear') || '',
    maxYear: searchParams.get('maxYear') || '',
    maxKm: searchParams.get('maxKm') || '',
    gear: searchParams.get('gear') || '',
    fuel: searchParams.get('fuel') || '',
  });

  useEffect(() => {
    async function initData() {
        try {
            const [locs, counts] = await Promise.all([
                getLocationsServer(),
                getFacetCountsServer()
            ]);
            setProvinces(locs);
            const countMap: Record<string, number> = {};
            if (counts) {
                counts.forEach((c: any) => {
                    countMap[c.city_name] = c.count;
                });
            }
            setFacetCounts(countMap);
        } catch (e) {
            console.error("Filtre verileri çekilemedi", e);
        } finally {
            setLoadingLoc(false);
        }
    }
    initData();
  }, []);

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      city: searchParams.get('city') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
    }));
  }, [searchParams]);

  const navData = useMemo(() => {
    let activeCat: any = null;
    let parentCat: any = null;
    let listToDisplay = categories;
    let title = "Kategoriler";

    if (!currentCategorySlug) return { list: categories, title, parent: null, active: null };

    const findInTree = (list: any[], parent: any | null): boolean => {
      for (const item of list) {
        if (item.slug === currentCategorySlug) {
          activeCat = item;
          parentCat = parent;
          return true;
        }
        if (item.subs && item.subs.length > 0) {
          if (findInTree(item.subs, item)) return true;
        }
      }
      return false;
    };
    findInTree(categories, null);

    if (activeCat) {
      if (activeCat.subs && activeCat.subs.length > 0) {
        listToDisplay = activeCat.subs;
        title = activeCat.title;
      } else if (parentCat) {
        listToDisplay = parentCat.subs;
        title = parentCat.title;
      }
    }
    return { list: listToDisplay, title, parent: parentCat, active: activeCat };
  }, [currentCategorySlug]);

  const updateFilter = (key: string, value: string) => setFilters(prev => ({ ...prev, [key]: value }));

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value); else params.delete(key);
    });
    params.delete('page');
    router.push(\`/search?\${params.toString()}\`);
  };

  const handleCategoryClick = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('category', slug);
    params.delete('page');
    router.push(\`/search?\${params.toString()}\`);
  };

  const goUpLevel = () => {
    if (navData.parent) handleCategoryClick(navData.parent.slug);
    else router.push('/search');
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    if (currentCategorySlug) params.set('category', currentCategorySlug);
    router.push(\`/search?\${params.toString()}\`);
  };

  const isRealEstate = currentCategorySlug?.includes('konut') || currentCategorySlug?.includes('emlak');
  const isVehicle = currentCategorySlug?.includes('vasita') || currentCategorySlug?.includes('oto');

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-4 sticky top-20 max-h-[calc(100vh-100px)] overflow-y-auto scrollbar-thin">

      <div className="mb-6">
          <h3 className="font-bold text-[#333] text-sm mb-3 border-b border-gray-100 pb-2 flex justify-between items-center">
            {navData.title}
            {currentCategorySlug && <button onClick={goUpLevel} className="text-blue-600 hover:text-blue-800 bg-blue-50 p-1 rounded-full"><ChevronLeft size={14}/></button>}
          </h3>
          <ul className="space-y-1">
              {navData.list.map((sub: any) => (
                  <li key={sub.id}>
                      <button onClick={() => handleCategoryClick(sub.slug)} className={\`w-full text-left text-[13px] px-2 py-1.5 rounded-sm flex items-center justify-between group transition-colors \${currentCategorySlug === sub.slug ? 'bg-blue-50 text-blue-700 font-bold border-l-2 border-blue-600' : 'text-gray-600 hover:bg-gray-50'}\`}>
                          {sub.title}
                          {currentCategorySlug === sub.slug && <Check size={14}/>}
                      </button>
                  </li>
              ))}
          </ul>
      </div>

      <h3 className="font-bold text-[#333] text-sm mb-4 flex items-center gap-2 border-b border-gray-100 pb-2"><Filter size={16} /> Filtrele</h3>

      <div className="space-y-5">

        <div>
          <label className="text-[11px] font-bold text-gray-500 mb-1 block flex justify-between">
             <span>İL</span>
             {loadingLoc && <Loader2 size={12} className="animate-spin"/>}
          </label>
          <select
            value={filters.city}
            onChange={(e) => updateFilter('city', e.target.value)}
            className="w-full border border-gray-300 rounded-sm text-[12px] p-2 focus:border-blue-500 outline-none bg-white"
            disabled={loadingLoc}
          >
            <option value="">Tüm İller</option>
            {provinces.map((c: any) => (
                <option key={c.id} value={c.name}>
                    {c.name} {facetCounts[c.name] ? \`(\${facetCounts[c.name]})\` : ''}
                </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[11px] font-bold text-gray-500 mb-1 block">FİYAT (TL)</label>
          <div className="flex gap-2">
            <input type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => updateFilter('minPrice', e.target.value)} className="w-full border border-gray-300 rounded-sm text-[12px] p-2 outline-none focus:border-blue-500" />
            <input type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => updateFilter('maxPrice', e.target.value)} className="w-full border border-gray-300 rounded-sm text-[12px] p-2 outline-none focus:border-blue-500" />
          </div>
        </div>

        {isRealEstate && (
            <div className="space-y-4 border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-800"><Home size={14}/> Emlak Detay</div>
                <div>
                    <label className="text-[11px] font-bold text-gray-500 mb-1 block">ODA SAYISI</label>
                    <div className="grid grid-cols-3 gap-1">
                    {['1+1', '2+1', '3+1', '4+1', 'Villa'].map(r => (
                        <button key={r} onClick={() => updateFilter('room', r)} className={\`text-[10px] border rounded-sm py-1.5 transition-all \${filters.room === r ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}\`}>{r}</button>
                    ))}
                    </div>
                </div>
            </div>
        )}

        {isVehicle && (
            <div className="space-y-4 border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-800"><Car size={14}/> Araç Detay</div>
                <div>
                    <label className="text-[11px] font-bold text-gray-500 mb-1 block">YIL</label>
                    <div className="flex gap-2">
                        <input type="number" placeholder="Min" value={filters.minYear} onChange={(e) => updateFilter('minYear', e.target.value)} className="w-full border border-gray-300 rounded-sm text-[12px] p-2 outline-none focus:border-blue-500" />
                        <input type="number" placeholder="Max" value={filters.maxYear} onChange={(e) => updateFilter('maxYear', e.target.value)} className="w-full border border-gray-300 rounded-sm text-[12px] p-2 outline-none focus:border-blue-500" />
                    </div>
                </div>
            </div>
        )}

        <div className="pt-2 sticky bottom-0 bg-white pb-2 border-t border-gray-100">
            <button onClick={applyFilters} className="w-full bg-blue-700 text-white text-[13px] font-bold py-2.5 rounded-sm hover:bg-blue-800 transition-colors shadow-md flex items-center justify-center gap-2">
                <Check size={16} /> Sonuçları Göster
            </button>
            <button onClick={clearFilters} className="w-full text-center text-[11px] text-gray-500 hover:text-red-600 underline flex items-center justify-center gap-1 mt-3">
                <RotateCcw size={12}/> Temizle
            </button>
        </div>
      </div>
    </div>
  );
}
`;

const footer = `
import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-gray-200 bg-white text-[11px] text-gray-600">
      <div className="container mx-auto px-4 max-w-[1150px] py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold text-[#333] mb-3 text-[12px]">Kurumsal</h4>
            <ul className="space-y-2">
              <li><Link href="/kurumsal/hakkimizda" className="hover:underline hover:text-blue-700">Hakkımızda</Link></li>
              <li><Link href="#" className="hover:underline hover:text-blue-700">İnsan Kaynakları</Link></li>
              <li><Link href="#" className="hover:underline hover:text-blue-700">Haberler</Link></li>
              <li><Link href="/iletisim" className="hover:underline hover:text-blue-700">İletişim</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#333] mb-3 text-[12px]">Hizmetlerimiz</h4>
            <ul className="space-y-2">
              <li><Link href="/ilan-ver/doping" className="hover:underline hover:text-blue-700">Doping</Link></li>
              <li><Link href="#" className="hover:underline hover:text-blue-700">Güvenli Ödeme</Link></li>
              <li><Link href="#" className="hover:underline hover:text-blue-700">Reklam Verin</Link></li>
              <li><Link href="#" className="hover:underline hover:text-blue-700">Mobil Uygulamalar</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#333] mb-3 text-[12px]">Gizlilik ve Kullanım</h4>
            <ul className="space-y-2">
              <li><Link href="/kurumsal/guvenli-alisveris" className="hover:underline hover:text-blue-700">Güvenli Alışveriş İpuçları</Link></li>
              <li><Link href="/kurumsal/kullanim-kosullari" className="hover:underline hover:text-blue-700">Kullanım Koşulları</Link></li>
              <li><Link href="/kurumsal/gizlilik-politikasi" className="hover:underline hover:text-blue-700">Gizlilik Politikası</Link></li>
              <li><Link href="/yardim" className="hover:underline hover:text-blue-700">Yardım ve İşlem Rehberi</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#333] mb-3 text-[12px]">Bizi Takip Edin</h4>
            <div className="flex gap-3 mb-4">
              <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-500">FB</div>
              <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-500">TW</div>
              <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-500">IN</div>
              <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-500">YT</div>
            </div>
            <p>7/24 Destek: <span className="font-bold text-[#333]">0 850 222 44 44</span></p>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 bg-[#f6f7f9] py-6 text-center">
        <div className="container mx-auto px-4 max-w-[1150px]">
          <p className="mb-2">
            Copyright © 2000-2026 sahibinden.com İstanbul Ticaret Odası'na kayıtlıdır.
          </p>
          <p className="text-[10px] text-gray-400">
            Klon proje eğitim amaçlıdır. Gerçek veriler içermez.
          </p>
        </div>
      </div>
    </footer>
  );
}
`;

const recentAdsWidget = `
"use client";
import React from 'react';
import Link from 'next/link';
import { useHistory } from '@/context/HistoryContext';
import { History, Trash2 } from 'lucide-react';

export default function RecentAdsWidget() {
  const { recentAds, clearHistory } = useHistory();

  if (!recentAds || recentAds.length === 0) return null;

  return (
    <div className="mt-4 bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
      <div className="bg-gray-50 p-3 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-xs font-bold text-[#333] flex items-center gap-1">
          <History size={14} className="text-blue-600" />
          Son Gezilenler
        </h3>
        <button onClick={clearHistory} className="text-gray-400 hover:text-red-500" title="Temizle">
          <Trash2 size={12} />
        </button>
      </div>

      <ul>
        {recentAds.map((ad) => (
          <li key={ad.id} className="border-b border-gray-50 last:border-0">
            <Link href={\`/ilan/\${ad.id}\`} className="flex gap-2 p-2 hover:bg-blue-50 transition-colors group">
              <div className="w-12 h-10 bg-gray-200 shrink-0 overflow-hidden rounded-sm border border-gray-200">
                <img src={ad.image} alt={ad.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-[#333] truncate group-hover:text-blue-700">{ad.title}</p>
                <p className="text-[10px] font-bold text-blue-900">{ad.price} {ad.currency}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
`;

// DOSYALARI YAZ
writeFile("app/globals.css", globalsCss);
writeFile("components/Providers.tsx", providersContent);
writeFile("app/bana-ozel/mesajlarim/page.tsx", messagesPage);
writeFile("app/bana-ozel/magazam/page.tsx", myStorePage);
writeFile("app/bana-ozel/favoriler/page.tsx", favoritesPage);
writeFile("components/FilterSidebar.tsx", filterSidebar);
writeFile("components/Footer.tsx", footer);
writeFile("components/RecentAdsWidget.tsx", recentAdsWidget);

// Theme Context'i silmek yerine boşalt (dosya silme işlemi riskli olabilir)
writeFile(
  "context/ThemeContext.tsx",
  "// Deprecated: Dark mode removed\\nexport const ThemeProvider = ({children}) => <>{children}</>;\\nexport const useTheme = () => ({ theme: 'light' });",
);

console.log(
  colors.blue +
    colors.bold +
    "\n✅ DARK MODE TAMAMEN KALDIRILDI!\n" +
    colors.reset,
);
