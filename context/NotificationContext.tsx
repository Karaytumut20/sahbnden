
"use client";
import React, { createContext, useContext, useState } from 'react';
import { useToast } from '@/context/ToastContext';

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
  saveSearch: (url: string, criteria: string) => void;
  removeSearch: (id: number) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { addToast } = useToast();

  // Demo Bildirimler
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, title: 'Fiyat Düştü', message: 'Favorinizdeki "Sahibinden Satılık Daire" ilanının fiyatı düştü.', date: '10 dk önce', read: false, type: 'price' },
    { id: 2, title: 'İlan Onayı', message: 'Yeni verdiğiniz ilan editörlerimiz tarafından yayına alındı.', date: '1 saat önce', read: false, type: 'system' },
    { id: 3, title: 'Yeni Mesaj', message: 'Ahmet Yılmaz ilanınızla ilgili bir soru sordu.', date: 'Dün', read: true, type: 'message' },
  ]);

  // Demo Kayıtlı Aramalar
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([
    { id: 101, name: 'Kadıköy 2+1 Daireler', url: '/search?category=emlak&city=İstanbul&room=2%2B1', criteria: 'Emlak, İstanbul, 2+1', date: '20.01.2025' },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const saveSearch = (url: string, criteria: string) => {
    // Aynı arama var mı kontrol et (Basitçe URL bazlı)
    if (savedSearches.some(s => s.url === url)) {
      addToast('Bu arama zaten kayıtlı.', 'info');
      return;
    }

    const newSearch: SavedSearch = {
      id: Date.now(),
      name: `Arama - ${new Date().toLocaleDateString()}`,
      url,
      criteria,
      date: new Date().toLocaleDateString()
    };

    setSavedSearches([newSearch, ...savedSearches]);
    addToast('Arama başarıyla favorilere eklendi.', 'success');
  };

  const removeSearch = (id: number) => {
    setSavedSearches(prev => prev.filter(s => s.id !== id));
    addToast('Arama kaydı silindi.', 'info');
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, savedSearches, saveSearch, removeSearch }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
