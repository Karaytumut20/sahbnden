
"use client";
import React, { useState } from 'react';
import { Search, Send, MoreVertical, Phone } from 'lucide-react';

const mockConversations = [
  { id: 1, name: 'Ahmet Yılmaz', lastMsg: 'Son fiyat ne olur?', time: '14:30', avatar: 'AY', unread: 2 },
  { id: 2, name: 'Mehmet Demir', lastMsg: 'Takas düşünür müsünüz?', time: 'Dün', avatar: 'MD', unread: 0 },
  { id: 3, name: 'Ayşe Kaya', lastMsg: 'Yarın gelip görebilir miyim?', time: 'Pzt', avatar: 'AK', unread: 0 },
];

const mockMessages = [
  { id: 1, sender: 'other', text: 'Merhaba, ilanınızla ilgileniyorum.', time: '14:20' },
  { id: 2, sender: 'me', text: 'Merhaba, buyurun nasıl yardımcı olabilirim?', time: '14:22' },
  { id: 3, sender: 'other', text: 'Son fiyat ne olur? Öğrenciyim de biraz indirim yaparsanız sevinirim.', time: '14:25' },
];

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState(1);
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState(mockMessages);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    setMessages([...messages, {
      id: Date.now(),
      sender: 'me',
      text: messageInput,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setMessageInput('');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm h-[calc(100vh-140px)] flex overflow-hidden">

      {/* SOL TARA: KONUŞMA LİSTESİ */}
      <div className="w-[300px] border-r border-gray-200 flex flex-col">
        <div className="p-3 border-b border-gray-200 bg-gray-50">
          <div className="relative">
            <input
              type="text"
              placeholder="Mesajlarda ara..."
              className="w-full border border-gray-300 rounded-full h-8 pl-8 pr-3 text-[12px] focus:outline-none focus:border-blue-500"
            />
            <Search size={14} className="absolute left-2.5 top-2 text-gray-400" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {mockConversations.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setActiveChat(chat.id)}
              className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 transition-colors ${activeChat === chat.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''}`}
            >
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm shrink-0">
                {chat.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className="text-[13px] font-bold text-[#333] truncate">{chat.name}</h4>
                  <span className="text-[10px] text-gray-400 shrink-0">{chat.time}</span>
                </div>
                <p className="text-[11px] text-gray-500 truncate">{chat.lastMsg}</p>
              </div>
              {chat.unread > 0 && (
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                  {chat.unread}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* SAĞ TARAF: SOHBET PENCERESİ */}
      <div className="flex-1 flex flex-col bg-[#efeae2] relative">
        {/* Sohbet Başlığı */}
        <div className="h-[60px] bg-gray-100 border-b border-gray-200 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold text-sm">
              AY
            </div>
            <div>
              <h3 className="font-bold text-[#333] text-sm">Ahmet Yılmaz</h3>
              <p className="text-[11px] text-gray-500">Çevrimiçi</p>
            </div>
          </div>
          <div className="flex gap-4 text-gray-600">
            <Phone size={20} className="cursor-pointer hover:text-blue-600" />
            <MoreVertical size={20} className="cursor-pointer hover:text-blue-600" />
          </div>
        </div>

        {/* Mesaj Alanı */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat opacity-95">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] rounded-md p-2 shadow-sm text-[13px] relative ${msg.sender === 'me' ? 'bg-[#d9fdd3] text-[#111]' : 'bg-white text-[#111]'}`}>
                <p>{msg.text}</p>
                <span className="text-[10px] text-gray-500 block text-right mt-1 ml-2">{msg.time}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Input Alanı */}
        <div className="bg-gray-100 p-3 border-t border-gray-200">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Bir mesaj yazın..."
              className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500 text-sm"
            />
            <button type="submit" className="bg-blue-600 text-white p-2.5 rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center">
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
