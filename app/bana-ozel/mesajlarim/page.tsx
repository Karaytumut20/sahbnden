"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useMessage } from '@/context/MessageContext';
import { Send, Search, MoreVertical, Phone, ArrowLeft } from 'lucide-react';

export default function MessagesPage() {
  const { conversations, activeConversationId, setActiveConversationId, sendMessage } = useMessage();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);

  const activeConv = conversations.find(c => c.id === activeConversationId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConv?.messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      sendMessage(inputText);
      setInputText('');
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm h-[calc(100vh-140px)] min-h-[500px] flex overflow-hidden dark:bg-[#1c1c1c] dark:border-gray-700">

      {/* SOL TARA (LİSTE) */}
      <div className={`w-full md:w-[320px] border-r border-gray-200 flex flex-col dark:border-gray-700 ${activeConversationId ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-gray-100 bg-gray-50 dark:bg-[#151515] dark:border-gray-700">
          <h2 className="font-bold text-[#333] mb-3 dark:text-white">Mesajlarım</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Mesajlarda ara..."
              className="w-full bg-white border border-gray-300 rounded-sm h-9 pl-9 pr-3 text-sm focus:border-blue-500 outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-gray-400 text-sm">Henüz mesajınız yok.</div>
          ) : (
            conversations.map(conv => (
              <div
                key={conv.id}
                onClick={() => setActiveConversationId(conv.id)}
                className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors dark:border-gray-800 dark:hover:bg-gray-800 ${activeConversationId === conv.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
              >
                <div className="flex justify-between mb-1">
                  <span className="font-bold text-[#333] text-sm dark:text-gray-200">{conv.otherUser}</span>
                  <span className="text-xs text-gray-400">{conv.lastMessageTime}</span>
                </div>
                <div className="flex justify-between items-center">
                   <p className="text-xs text-gray-600 truncate max-w-[180px] dark:text-gray-400">{conv.lastMessage}</p>
                   {conv.unread > 0 && (
                     <span className="bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                       {conv.unread}
                     </span>
                   )}
                </div>
                <p className="text-[10px] text-blue-800 mt-1 truncate bg-gray-100 p-1 rounded inline-block dark:bg-gray-800 dark:text-blue-400">
                   İlan: {conv.adTitle}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* SAĞ TARAF (SOHBET PENCERESİ) */}
      <div className={`flex-1 flex flex-col ${!activeConversationId ? 'hidden md:flex' : 'flex'}`}>
        {activeConv ? (
          <>
            <div className="h-[60px] border-b border-gray-200 flex items-center justify-between px-4 bg-gray-50 dark:bg-[#151515] dark:border-gray-700">
              <div className="flex items-center gap-3">
                <button onClick={() => setActiveConversationId(null)} className="md:hidden text-gray-500 dark:text-gray-300">
                  <ArrowLeft size={20} />
                </button>
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-500 dark:bg-gray-700 dark:text-gray-300">
                  {activeConv.otherUser.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-[#333] text-sm dark:text-white">{activeConv.otherUser}</h3>
                  <p className="text-[10px] text-gray-500 line-clamp-1 dark:text-gray-400">{activeConv.adTitle}</p>
                </div>
              </div>
              <div className="flex gap-4 text-gray-500 dark:text-gray-400">
                <button title="Ara"><Phone size={18} /></button>
                <button title="Seçenekler"><MoreVertical size={18} /></button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#e5ddd5] bg-opacity-30 dark:bg-[#0b141a]">
              {/* İlan Bilgisi Kartı */}
              <div className="flex justify-center mb-6">
                <div className="bg-white p-2 rounded shadow-sm flex items-center gap-3 max-w-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                  <img src={activeConv.adImage} className="w-12 h-12 object-cover rounded-sm" />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-[#333] dark:text-white">{activeConv.adTitle}</p>
                    <p className="text-[10px] text-blue-600 dark:text-blue-400">İlan Detayına Git</p>
                  </div>
                </div>
              </div>

              {activeConv.messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[70%] p-3 rounded-lg text-sm shadow-sm relative ${msg.sender === 'me' ? 'bg-[#dcf8c6] text-black rounded-tr-none dark:bg-[#005c4b] dark:text-white' : 'bg-white text-black rounded-tl-none dark:bg-[#202c33] dark:text-white'}`}
                  >
                    <p>{msg.text}</p>
                    <span className="text-[10px] text-gray-500 block text-right mt-1 dark:text-gray-400">{msg.time}</span>
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
                className="flex-1 border border-gray-300 rounded-full h-10 px-4 focus:outline-none focus:border-blue-500 dark:bg-[#2a3942] dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={18} className="ml-0.5" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-[#f0f2f5] text-gray-400 dark:bg-[#222e35]">
            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center mb-4 dark:bg-gray-700">
              <Send size={48} className="text-gray-400 opacity-50 dark:text-gray-500" />
            </div>
            <p className="text-lg font-medium">Bir sohbet seçin veya yeni mesaj gönderin.</p>
          </div>
        )}
      </div>
    </div>
  );
}