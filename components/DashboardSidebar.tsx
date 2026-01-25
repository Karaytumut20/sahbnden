"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, List, MessageSquare, Settings, LogOut, Store, Wallet } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function DashboardSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  // Favoriler kaldırıldı, menü sırası düzenlendi
  const menuItems = [
    { href: '/bana-ozel', label: 'Özet Durum', icon: Home },
    { href: '/bana-ozel/cuzdan', label: 'Cüzdanım', icon: Wallet },
    { href: '/bana-ozel/magazam', label: 'Mağaza Yönetimi', icon: Store },
    { href: '/bana-ozel/ilanlarim', label: 'İlanlarım', icon: List },
    { href: '/bana-ozel/mesajlarim', label: 'Mesajlar', icon: MessageSquare },
    { href: '/bana-ozel/ayarlar', label: 'Ayarlar', icon: Settings },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
      {/* Kullanıcı Kartı */}
      <div className="p-6 border-b border-gray-50 bg-gradient-to-br from-slate-50 to-white">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg border-2 border-white shadow-sm shrink-0">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="overflow-hidden">
            <h3 className="font-bold text-slate-800 truncate">{user?.name || 'Kullanıcı'}</h3>
            <p className="text-xs text-slate-500 font-medium capitalize">{user?.role === 'store' ? 'Kurumsal Mağaza' : 'Bireysel Üye'}</p>
          </div>
        </div>
      </div>

      {/* Menü */}
      <nav className="p-3">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 shadow-sm'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <item.icon size={18} className={isActive ? 'text-indigo-600' : 'text-slate-400'} />
                  {item.label}
                </Link>
              </li>
            );
          })}

          <li className="pt-2 mt-2 border-t border-gray-50">
            <button
              onClick={() => logout()}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left"
            >
              <LogOut size={18} /> Çıkış Yap
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
