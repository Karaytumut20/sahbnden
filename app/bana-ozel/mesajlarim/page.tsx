"use client";
import React, { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { getConversationsClient, getMessagesClient, sendMessageClient, markMessagesAsReadClient } from '@/lib/services';
import { Send, Search, Phone, ArrowLeft, Loader2 } from 'lucide-react';

export default function MessagesPage() {
  const { user } = useAuth();
  const supabase = createClient();
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConvId, setActiveConvId] = useState<number | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConv = conversations.find(c => c.id === activeConvId);

  useEffect(() => {
    if (user) getConversationsClient(user.id).then(setConversations);
  }, [user]);

  useEffect(() => {
    if (!activeConvId || !user) return;

    getMessagesClient(activeConvId).then(data => {
      setMessages(data || []);
      markMessagesAsReadClient(activeConvId, user.id);
    });

    const channel = supabase.channel('chat_room_' + activeConvId)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `conversation_id=eq.${activeConvId}` }, (payload) => {
          setMessages(current => [...current, payload.new]);
          if (payload.new.sender_id !== user.id) markMessagesAsReadClient(activeConvId, user.id);
      }).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeConvId, user]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user || !activeConvId) return;
    await sendMessageClient(activeConvId, user.id, inputText);
    setInputText('');
  };

  if (!user) return <div className="p-10 text-center">Giriş yapın.</div>;

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm h-[calc(100vh-140px)] min-h-[500px] flex overflow-hidden dark:bg-[#1c1c1c] dark:border-gray-700">
      <div className={`w-full md:w-[320px] border-r border-gray-200 flex flex-col dark:border-gray-700 ${activeConvId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-100 bg-gray-50 dark:bg-[#151515] dark:border-gray-700">
          <h2 className="font-bold text-[#333] mb-3 dark:text-white">Mesajlarım</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations.map(conv => (
            <div key={conv.id} onClick={() => setActiveConvId(conv.id)} className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 ${activeConvId === conv.id ? 'bg-blue-50' : ''}`}>
              <div className="font-bold text-[#333] text-sm">{(conv.buyer_id === user.id ? conv.seller?.full_name : conv.profiles?.full_name) || 'Kullanıcı'}</div>
              <div className="text-[10px] text-gray-500">{conv.ads?.title}</div>
            </div>
          ))}
        </div>
      </div>
      <div className={`flex-1 flex flex-col ${!activeConvId ? 'hidden md:flex' : 'flex'}`}>
        {activeConv ? (
          <>
            <div className="h-[60px] border-b border-gray-200 flex items-center justify-between px-4 bg-gray-50 dark:bg-[#151515] dark:border-gray-700">
               <div className="flex items-center gap-2">
                 <button onClick={() => setActiveConvId(null)} className="md:hidden"><ArrowLeft/></button>
                 <span className="font-bold">{(activeConv.buyer_id === user.id ? activeConv.seller?.full_name : activeConv.profiles?.full_name) || 'Kullanıcı'}</span>
               </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#e5ddd5] bg-opacity-30 dark:bg-[#0b141a]">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-2 rounded-lg text-sm shadow-sm ${msg.sender_id === user.id ? 'bg-[#dcf8c6] dark:bg-[#005c4b] text-black dark:text-white' : 'bg-white dark:bg-[#202c33]'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form onSubmit={handleSend} className="p-3 bg-gray-100 flex gap-2 dark:bg-[#202c33]">
              <input value={inputText} onChange={e => setInputText(e.target.value)} className="flex-1 border rounded-full px-4 py-2 outline-none dark:bg-[#2a3942] dark:text-white" placeholder="Mesaj yaz..." />
              <button type="submit" disabled={!inputText.trim()} className="bg-blue-600 text-white p-2 rounded-full"><Send size={18}/></button>
            </form>
          </>
        ) : <div className="flex-1 flex items-center justify-center text-gray-400">Sohbet seçin.</div>}
      </div>
    </div>
  );
}