
"use client";
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { getConversations, getMessages, sendMessage, markMessagesAsRead } from '@/lib/services';
import { Send, Search, MoreVertical, Phone, ArrowLeft, Loader2 } from 'lucide-react';

export default function MessagesPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConvId, setActiveConvId] = useState<number | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activeConv = conversations.find(c => c.id === activeConvId);

  // Sohbet Listesini Çek
  useEffect(() => {
    if (user) {
      getConversations(user.id).then(data => {
        setConversations(data);
        setLoading(false);
      });
    }
  }, [user]);

  // Mesajları Çek ve Realtime Abonelik Başlat
  useEffect(() => {
    if (!activeConvId || !user) return;

    // 1. Önceki mesajları yükle
    getMessages(activeConvId).then(data => {
      setMessages(data || []);
      // Mesajları okundu işaretle
      markMessagesAsRead(activeConvId, user.id);
    });

    // 2. Realtime Abonelik (Yeni mesaj gelince)
    const channel = supabase
      .channel('chat_room_' + activeConvId)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${activeConvId}`
        },
        (payload) => {
          setMessages(current => [...current, payload.new]);
          // Gelen mesajı okundu yap (eğer ben göndermediysem)
          if (payload.new.sender_id !== user.id) {
             markMessagesAsRead(activeConvId, user.id);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeConvId, user]);

  // Otomatik Scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user || !activeConvId) return;

    // Optimistic Update (Hemen ekranda göster)
    const tempId = Date.now();
    /*
    setMessages(prev => [...prev, {
      id: tempId,
      conversation_id: activeConvId,
      sender_id: user.id,
      content: inputText,
      created_at: new Date().toISOString()
    }]);
    */ // Supabase realtime zaten getireceği için optimistic update'i kapatabiliriz veya daha complex yapabiliriz.
       // Şimdilik backend'e atıp realtime'dan gelmesini bekleyelim, çok hızlıdır.

    await sendMessage(activeConvId, user.id, inputText);
    setInputText('');
  };

  if (!user) return <div className="p-10 text-center">Mesajlarınızı görmek için giriş yapın.</div>;

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm h-[calc(100vh-140px)] min-h-[500px] flex overflow-hidden dark:bg-[#1c1c1c] dark:border-gray-700">

      {/* SOL LİSTE */}
      <div className={`w-full md:w-[320px] border-r border-gray-200 flex flex-col dark:border-gray-700 ${activeConvId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-100 bg-gray-50 dark:bg-[#151515] dark:border-gray-700">
          <h2 className="font-bold text-[#333] mb-3 dark:text-white">Mesajlarım</h2>
          <div className="relative">
            <input type="text" placeholder="Ara..." className="w-full bg-white border border-gray-300 rounded-sm h-9 pl-9 pr-3 text-sm outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? <div className="p-4 text-center"><Loader2 className="animate-spin inline"/></div> : conversations.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">Henüz mesajınız yok.</div>
          ) : (
            conversations.map(conv => {
              const otherUser = conv.buyer_id === user.id ? conv.seller : conv.profiles;
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConvId(conv.id)}
                  className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors dark:border-gray-800 dark:hover:bg-gray-800 ${activeConvId === conv.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                >
                  <div className="flex justify-between mb-1">
                    <span className="font-bold text-[#333] text-sm dark:text-gray-200">{otherUser?.full_name || 'Kullanıcı'}</span>
                    <span className="text-xs text-gray-400">{new Date(conv.updated_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-[10px] text-blue-800 mt-1 truncate bg-gray-100 p-1 rounded inline-block dark:bg-gray-800 dark:text-blue-400">
                     İlan: {conv.ads?.title}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* SAĞ SOHBET */}
      <div className={`flex-1 flex flex-col ${!activeConvId ? 'hidden md:flex' : 'flex'}`}>
        {activeConv ? (
          <>
            <div className="h-[60px] border-b border-gray-200 flex items-center justify-between px-4 bg-gray-50 dark:bg-[#151515] dark:border-gray-700">
              <div className="flex items-center gap-3">
                <button onClick={() => setActiveConvId(null)} className="md:hidden text-gray-500 dark:text-gray-300"><ArrowLeft size={20} /></button>
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500 dark:bg-gray-700 dark:text-gray-300">
                  {(activeConv.buyer_id === user.id ? activeConv.seller?.full_name : activeConv.profiles?.full_name)?.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-[#333] text-sm dark:text-white">{activeConv.buyer_id === user.id ? activeConv.seller?.full_name : activeConv.profiles?.full_name}</h3>
                  <p className="text-[10px] text-gray-500 line-clamp-1 dark:text-gray-400">{activeConv.ads?.title}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#e5ddd5] bg-opacity-30 dark:bg-[#0b141a]">
              {/* İlan Bilgisi */}
              <div className="flex justify-center mb-6">
                <div className="bg-white p-2 rounded shadow-sm flex items-center gap-3 max-w-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                  {activeConv.ads?.image && <img src={activeConv.ads.image} className="w-12 h-12 object-cover rounded-sm" />}
                  <div className="flex-1">
                    <p className="text-xs font-bold text-[#333] dark:text-white">{activeConv.ads?.title}</p>
                  </div>
                </div>
              </div>

              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-3 rounded-lg text-sm shadow-sm relative ${msg.sender_id === user.id ? 'bg-[#dcf8c6] text-black rounded-tr-none dark:bg-[#005c4b] dark:text-white' : 'bg-white text-black rounded-tl-none dark:bg-[#202c33] dark:text-white'}`}>
                    <p>{msg.content}</p>
                    <span className="text-[10px] text-gray-500 block text-right mt-1 dark:text-gray-400">
                      {new Date(msg.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="p-3 bg-gray-100 border-t border-gray-200 flex items-center gap-3 dark:bg-[#202c33] dark:border-gray-700">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Bir mesaj yazın..."
                className="flex-1 border border-gray-300 rounded-full h-10 px-4 focus:outline-none focus:border-blue-500 dark:bg-[#2a3942] dark:border-gray-600 dark:text-white"
              />
              <button type="submit" disabled={!inputText.trim()} className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                <Send size={18} className="ml-0.5" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-[#f0f2f5] text-gray-400 dark:bg-[#222e35]">
            <p className="text-lg font-medium">Sohbet seçin.</p>
          </div>
        )}
      </div>
    </div>
  );
}
