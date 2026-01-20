
"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getUserStats, getConversations } from '@/lib/services';

export default function DashboardHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ adsCount: 0 });
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      getUserStats(user.id).then(setStats);
      getConversations(user.id).then((data: any) => setMessages(data || []));
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
          <div className="bg-yellow-50 p-4 rounded-sm border border-yellow-100 text-center dark:bg-yellow-900/20">
            <span className="block text-2xl font-bold text-yellow-800 dark:text-yellow-400">0</span>
            <span className="text-sm text-yellow-900 dark:text-yellow-300">Favori Arama</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden dark:bg-[#1c1c1c] dark:border-gray-700">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center dark:bg-gray-800">
          <h3 className="font-bold text-[#333] text-sm dark:text-white">Son Mesajlar</h3>
          <Link href="/bana-ozel/mesajlarim" className="text-blue-700 text-[12px] hover:underline dark:text-blue-400">Tümünü Gör</Link>
        </div>
        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
          {messages.slice(0, 3).map((conv) => (
            <li key={conv.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between cursor-pointer dark:hover:bg-gray-800">
              <div>
                <p className="font-semibold text-sm text-[#333] dark:text-gray-200">
                  {conv.buyer_id === user.id ? conv.seller?.full_name : conv.profiles?.full_name}
                  <span className="font-normal text-gray-500 text-[11px] ml-2 dark:text-gray-400">({conv.ads?.title})</span>
                </p>
                <p className="text-[12px] text-gray-600 mt-1 truncate dark:text-gray-400">Sohbeti görüntülemek için tıklayın.</p>
              </div>
              <span className="text-[10px] text-gray-400">{new Date(conv.updated_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            </li>
          ))}
          {messages.length === 0 && <li className="p-4 text-center text-gray-500 text-sm">Mesajınız yok.</li>}
        </ul>
      </div>
    </div>
  );
}
