"use client";
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { getUserStatsClient } from '@/lib/services';
import { List, Eye, MessageSquare, TrendingUp } from 'lucide-react';

export default function DashboardHome() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ adsCount: 0 });

  useEffect(() => {
    if (user) {
      getUserStatsClient(user.id).then(setStats);
    }
  }, [user]);

  if (!user) return null;

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 p-6 rounded-sm shadow-sm">
        <h1 className="text-xl font-bold text-[#333] mb-1">Hoş Geldiniz, {user.name}</h1>
        <p className="text-sm text-gray-500 mb-6">Hesap özetiniz ve son aktiviteleriniz aşağıdadır.</p>

        {/* İstatistik Kartları */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-sm border border-blue-100 flex items-center gap-4">
            <div className="bg-blue-200 p-3 rounded-full text-blue-700"><List size={24}/></div>
            <div>
               <span className="block text-2xl font-bold text-blue-800">{stats.adsCount}</span>
               <span className="text-xs text-blue-600 font-bold uppercase">Yayındaki İlan</span>
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-sm border border-green-100 flex items-center gap-4">
            <div className="bg-green-200 p-3 rounded-full text-green-700"><MessageSquare size={24}/></div>
            <div>
               <span className="block text-2xl font-bold text-green-800">2</span>
               <span className="text-xs text-green-600 font-bold uppercase">Okunmamış Mesaj</span>
            </div>
          </div>
          <div className="bg-orange-50 p-4 rounded-sm border border-orange-100 flex items-center gap-4">
            <div className="bg-orange-200 p-3 rounded-full text-orange-700"><Eye size={24}/></div>
            <div>
               <span className="block text-2xl font-bold text-orange-800">1.2K</span>
               <span className="text-xs text-orange-600 font-bold uppercase">Toplam Görüntülenme</span>
            </div>
          </div>
          <div className="bg-purple-50 p-4 rounded-sm border border-purple-100 flex items-center gap-4">
            <div className="bg-purple-200 p-3 rounded-full text-purple-700"><TrendingUp size={24}/></div>
            <div>
               <span className="block text-2xl font-bold text-purple-800">%12</span>
               <span className="text-xs text-purple-600 font-bold uppercase">Etkileşim Artışı</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="bg-white border border-gray-200 p-6 rounded-sm shadow-sm">
            <h3 className="font-bold text-[#333] mb-4 border-b border-gray-100 pb-2">Son Aktiviteler</h3>
            <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex gap-2"><span className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></span> İlanınız "Satılık Daire" yayına alındı.</li>
                <li className="flex gap-2"><span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></span> Yeni bir mesaj aldınız.</li>
                <li className="flex gap-2"><span className="w-2 h-2 bg-gray-400 rounded-full mt-1.5"></span> Şifreniz güncellendi.</li>
            </ul>
         </div>
         <div className="bg-white border border-gray-200 p-6 rounded-sm shadow-sm flex items-center justify-center text-center">
            <div>
                <h3 className="font-bold text-lg mb-2">Mağaza Açarak Daha Fazla Satın!</h3>
                <p className="text-sm text-gray-500 mb-4">Kurumsal mağaza özellikleri ile ilanlarınızı öne çıkarın.</p>
                <button className="bg-[#ffe800] text-black font-bold px-6 py-2 rounded-sm text-sm">Mağaza Paketlerini İncele</button>
            </div>
         </div>
      </div>
    </div>
  );
}