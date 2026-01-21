"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getSavedSearchesClient, saveSearchClient, deleteSavedSearchClient } from '@/lib/services';

type Notification = {
  id: number;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'price' | 'system' | 'message';
};

type SavedSearch = {
  id: number;
  name: string;
  url: string;
  criteria: string;
  date: string;
};

type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  savedSearches: SavedSearch[];
  saveSearch: (url: string, criteria: string) => Promise<void>;
  removeSearch: (id: number) => Promise<void>;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { addToast } = useToast();
  const supabase = createClient();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);

  // GERÇEK ZAMANLI BİLDİRİM DİNLEYİCİSİ (Okunmamış Mesajlar)
  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      // Okunmamış mesajları çek ve bildirime dönüştür
      const { data: messages } = await supabase
        .from('messages')
        .select('*, profiles:sender_id(full_name)')
        .eq('is_read', false)
        .neq('sender_id', user.id) // Kendi mesajlarımızı bildirim olarak alma
        .order('created_at', { ascending: false });

      if (messages) {
        const notifs = messages.map((m: any) => ({
          id: m.id,
          title: 'Yeni Mesaj',
          message: `${m.profiles?.full_name || 'Kullanıcı'}: ${m.content}`,
          date: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          read: false,
          type: 'message'
        }));
        setNotifications(notifs as Notification[]);
      }
    };

    fetchNotifications();
    getSavedSearchesClient(user.id).then(setSavedSearches);

    // Yeni mesaj gelince bildirim at
    const channel = supabase.channel('realtime_notifications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        if (payload.new.sender_id !== user.id) {
          fetchNotifications();
          addToast('Yeni bir mesajınız var!', 'info');
        }
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const unreadCount = notifications.length;

  const markAsRead = async (id: number) => {
    // Local state güncelle
    setNotifications(prev => prev.filter(n => n.id !== id));
    // DB güncelle (Message tablosunda is_read = true)
    await supabase.from('messages').update({ is_read: true }).eq('id', id);
  };

  const markAllAsRead = async () => {
    setNotifications([]);
    // Tüm okunmamış mesajları okundu yap (Bu kullanıcıya gelenler)
    // Not: Bu basit bir implementation, detaylı sorgu gerekebilir
  };

  const saveSearch = async (url: string, criteria: string) => {
    if (!user) { addToast('Giriş yapın.', 'error'); return; }

    // URL içindeki query'den isim üret
    const urlObj = new URL('http://localhost' + url);
    const name = urlObj.searchParams.get('q') || 'Filtrelenmiş Arama';

    const { error } = await saveSearchClient(user.id, name, url, criteria);
    if (error) {
        addToast('Kaydedilemedi.', 'error');
    } else {
        addToast('Arama kaydedildi.', 'success');
        getSavedSearchesClient(user.id).then(setSavedSearches);
    }
  };

  const removeSearch = async (id: number) => {
    await deleteSavedSearchClient(id);
    setSavedSearches(prev => prev.filter(s => s.id !== id));
    addToast('Arama silindi.', 'info');
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, savedSearches, saveSearch, removeSearch }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) throw new Error('useNotifications must be used within a NotificationProvider');
  return context;
}