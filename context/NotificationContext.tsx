"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

type Notification = {
  id: number;
  title: string;
  message: string;
  read: boolean;
  date: string;
};

type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (title: string, message: string) => void;
  markAsRead: (id: number) => void;
  markAllAsRead: () => void;
  saveSearch: (url: string, name: string) => void; // Placeholder
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Sayfa yüklendiğinde LocalStorage'dan oku
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('notifications');
      if (stored) {
        setNotifications(JSON.parse(stored));
      } else {
        // Demo veri (sadece ilk kez)
        const demoData = [
            { id: 1, title: 'Hoş Geldiniz', message: 'Hesabınız başarıyla oluşturuldu.', read: false, date: new Date().toLocaleDateString() }
        ];
        setNotifications(demoData);
        localStorage.setItem('notifications', JSON.stringify(demoData));
      }
    }
  }, []);

  // Değişiklikleri kaydet
  useEffect(() => {
    if (notifications.length > 0) {
        localStorage.setItem('notifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (title: string, message: string) => {
    const newNotif = {
      id: Date.now(),
      title,
      message,
      read: false,
      date: new Date().toLocaleDateString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const saveSearch = (url: string, name: string) => {
      // Gerçek projede API'ye gider, burada simülasyon
      addNotification('Arama Kaydedildi', `"${name}" aramanız favorilere eklendi.`);
  }

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead, saveSearch }}>
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