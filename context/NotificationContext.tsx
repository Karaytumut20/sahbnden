"use client";
import React, { createContext, useContext, useState } from 'react';

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
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  // Demo Başlangıç Verileri
  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, title: 'İlan Onayı', message: 'Satılık Daire ilanınız yayına alındı.', read: false, date: '10 dk önce' },
    { id: 2, title: 'Fiyat Düşüşü', message: 'Favori ilanınızda fiyat düştü!', read: false, date: '1 saat önce' },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (title: string, message: string) => {
    const newNotif = {
      id: Date.now(),
      title,
      message,
      read: false,
      date: 'Şimdi'
    };
    setNotifications([newNotif, ...notifications]);
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification, markAsRead, markAllAsRead }}>
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