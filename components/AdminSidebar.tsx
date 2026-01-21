"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, FileText, Users, DollarSign, Settings, LogOut, ExternalLink } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const menuItems = [
  { name: 'Genel Bakış', href: '/admin', icon: LayoutDashboard },
  { name: 'İlan Yönetimi', href: '/admin/ilanlar', icon: FileText },
  { name: 'Kullanıcılar', href: '/admin/kullanicilar', icon: Users },
  { name: 'Ödemeler & Ciro', href: '/admin/odemeler', icon: DollarSign },
  { name: 'Ayarlar', href: '/admin/ayarlar', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <aside className="w-64 bg-[#1a202c] text-white flex flex-col h-screen shrink-0 sticky top-0 overflow-y-auto">
      <div className="p-6 border-b border-gray-700 flex items-center justify-between">
        <span className="font-bold text-xl tracking-tight">Admin<span className="text-[#ffe800]">Panel</span></span>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
            >
              <item.icon size={20} />
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-700 space-y-2">
        <Link href="/" target="_blank" className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-white text-sm">
          <ExternalLink size={16} /> Siteye Git
        </Link>
        <button
          onClick={() => logout()}
          className="w-full flex items-center gap-3 px-4 py-2 text-red-400 hover:text-red-300 text-sm hover:bg-gray-800 rounded"
        >
          <LogOut size={16} /> Çıkış Yap
        </button>
      </div>
    </aside>
  );
}