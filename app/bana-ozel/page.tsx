"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getUserStatsClient, getConversationsClient } from '@/lib/services';

export default function DashboardHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ adsCount: 0 });
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      getUserStatsClient(user.id).then(setStats);
      getConversationsClient(user.id).then((data: any) => setMessages(data || []));
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 p-6 rounded-sm shadow-sm dark:bg-[#1c1c1c] dark:border-gray-700">
        <h1 className="text-xl font-bold text-[#333] mb-4 dark:text-white">Hoş Geldiniz, {user.name}</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-sm border border-blue-100 text-center dark:bg-blue-900/20">
            <span className="block text-2xl font-bold text-blue-800 dark:text-blue-400">{stats.adsCount}</span>
            <span className="text-sm text-blue-900 dark:text-blue-300">Yayındaki İlan</span>
          </div>
          <div className="bg-green-50 p-4 rounded-sm border border-green-100 text-center dark:bg-green-900/20">
            <span className="block text-2xl font-bold text-green-800 dark:text-green-400">{messages.length}</span>
            <span className="text-sm text-green-900 dark:text-green-300">Mesajlaşma</span>
          </div>
        </div>
      </div>
    </div>
  );
}