
"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/context/ToastContext';

type Message = {
  id: number;
  sender: 'me' | 'them';
  text: string;
  time: string;
};

type Conversation = {
  id: number;
  adId: number;
  adTitle: string;
  adImage: string;
  otherUser: string;
  messages: Message[];
  unread: number;
  lastMessage: string;
  lastMessageTime: string;
};

type MessageContextType = {
  conversations: Conversation[];
  activeConversationId: number | null;
  setActiveConversationId: (id: number | null) => void;
  startConversation: (adId: number, adTitle: string, adImage: string, sellerName: string) => void;
  sendMessage: (text: string) => void;
};

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export function MessageProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { addToast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<number | null>(null);

  // Demo Verisi Yükle
  useEffect(() => {
    const initialData: Conversation[] = [
      {
        id: 1,
        adId: 10000,
        adTitle: 'Sahibinden Satılık 1+1 Fırsat Daire',
        adImage: 'https://picsum.photos/seed/house0/300/200',
        otherUser: 'Ahmet Yılmaz',
        unread: 1,
        lastMessage: 'En son ne kadar olur?',
        lastMessageTime: '14:30',
        messages: [
          { id: 1, sender: 'me', text: 'Merhaba, ilan hala güncel mi?', time: '14:00' },
          { id: 2, sender: 'them', text: 'Evet güncel, buyurun.', time: '14:15' },
          { id: 3, sender: 'me', text: 'En son ne kadar olur?', time: '14:30' },
        ]
      }
    ];
    setConversations(initialData);
  }, []);

  const startConversation = (adId: number, adTitle: string, adImage: string, sellerName: string) => {
    // Zaten bu ilanla ilgili konuşma var mı?
    const existing = conversations.find(c => c.adId === adId);

    if (existing) {
      setActiveConversationId(existing.id);
      router.push('/bana-ozel/mesajlarim');
      return;
    }

    // Yeni konuşma başlat
    const newConv: Conversation = {
      id: Date.now(),
      adId,
      adTitle,
      adImage,
      otherUser: sellerName,
      unread: 0,
      lastMessage: '',
      lastMessageTime: 'Şimdi',
      messages: []
    };

    setConversations([newConv, ...conversations]);
    setActiveConversationId(newConv.id);
    router.push('/bana-ozel/mesajlarim');
    addToast('Sohbet başlatıldı.', 'success');
  };

  const sendMessage = (text: string) => {
    if (!activeConversationId) return;

    const newMessage: Message = {
      id: Date.now(),
      sender: 'me',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Mesajı ekle ve konuşmayı güncelle
    setConversations(prev => prev.map(conv => {
      if (conv.id === activeConversationId) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: text,
          lastMessageTime: newMessage.time
        };
      }
      return conv;
    }));

    // Otomatik Cevap Simülasyonu (3 saniye sonra)
    setTimeout(() => {
      const replyMessage: Message = {
        id: Date.now() + 1,
        sender: 'them',
        text: 'Mesajınız için teşekkürler. Şu an müsait değilim, en kısa sürede döneceğim.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setConversations(prev => prev.map(conv => {
        if (conv.id === activeConversationId) {
          return {
            ...conv,
            messages: [...conv.messages, replyMessage],
            lastMessage: replyMessage.text,
            lastMessageTime: replyMessage.time,
            unread: activeConversationId === conv.id ? 0 : (conv.unread + 1) // Eğer o an açıksa okundu say
          };
        }
        return conv;
      }));
      addToast('Yeni mesajınız var', 'info');
    }, 3000);
  };

  return (
    <MessageContext.Provider value={{ conversations, activeConversationId, setActiveConversationId, startConversation, sendMessage }}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessage() {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
}
