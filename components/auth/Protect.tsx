"use client";
import React from 'react';
import { useAuth } from '@/context/AuthContext'; // Context'te role bilgisi eklenmeli (aşağıda güncelleyeceğiz)

// Şimdilik client-side basit kontrol yapıyoruz.
// İdealde AuthContext içinde rol bilgisi tutulmalıdır.
// Bu örnek için rolü veritabanından çekmek yerine prop olarak alacağız veya AuthContext'i güncelleyeceğiz.

type ProtectProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  role?: 'admin' | 'store' | 'user';
  // İleri seviye: Permission check
};

export default function Protect({ children, fallback = null, role }: ProtectProps) {
  const { user } = useAuth();

  // Not: AuthContext şu an user.role döndürmüyor.
  // Senior bir hamle olarak AuthContext'i güncellememiz gerekir ama
  // şimdilik "user varsa göster" mantığı veya user objesine role eklediğimizi varsayalım.

  if (!user) return <>{fallback}</>;

  // Eğer belirli bir rol isteniyorsa (Bu kısım AuthContext güncellenince çalışır)
  // if (role && user.role !== role) return <>{fallback}</>;

  return <>{children}</>;
}