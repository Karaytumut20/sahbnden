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
    filter: activeConvId ? `conversation_id=eq.${activeConvId}` : undefined,
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
      <div className={`w-full md:w-[350px] border-r border-gray-200 flex flex-col bg-white ${activeConvId ? "hidden md:flex" : "flex"}`}>

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
                            className={`p-4 border-b border-gray-50 cursor-pointer transition-all hover:bg-gray-50 group ${isActive ? 'bg-indigo-50/60 border-l-4 border-l-indigo-600' : 'border-l-4 border-l-transparent'}`}
                        >
                            <div className="flex justify-between items-start mb-1">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-indigo-600' : 'bg-transparent'}`}></div>
                                    <span className={`font-bold text-sm truncate max-w-[160px] ${isActive ? 'text-indigo-900' : 'text-gray-800'}`}>
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
      <div className={`flex-1 flex flex-col bg-[#e5ddd5] relative ${!activeConvId ? "hidden md:flex" : "flex"}`}>

        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')" }}></div>

        {activeConv ? (
            <>
                <div className="bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm z-20 px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
                        <button onClick={() => setActiveConvId(null)} className="md:hidden text-gray-600 p-1 hover:bg-gray-100 rounded-full"><ArrowLeft size={20}/></button>

                        {activeConv.ads && (
                            <Link href={`/ilan/${activeConv.ads.id}`} target="_blank" className="flex items-center gap-3 group min-w-0">
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
                                href={`/ilan/${activeConv.ads.id}`}
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
                            <div key={msg.id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`
                                        relative max-w-[85%] sm:max-w-[70%] px-3 py-2 rounded-2xl text-sm shadow-sm
                                        ${isMe ? 'bg-[#dcf8c6] text-slate-900 rounded-tr-none' : 'bg-white text-slate-800 rounded-tl-none'}
                                        ${msg.is_pending ? 'opacity-70' : ''}
                                    `}
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
                                        <div className={`absolute top-0 w-3 h-3 ${isMe ? '-right-1.5 bg-[#dcf8c6]' : '-left-1.5 bg-white'} [clip-path:polygon(0_0,100%_0,100%_100%)] transform ${isMe ? '' : 'scale-x-[-1]'}`}></div>
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