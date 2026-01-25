const fs = require("fs");
const path = require("path");

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  bold: "\x1b[1m",
};

console.log(
  colors.blue +
    colors.bold +
    "\n🛠  ADMIN SIDEBAR TASARIM HATALARI DÜZELTİLİYOR...\n" +
    colors.reset,
);

const files = [
  {
    path: "components/AdminSidebar.tsx",
    content: `
"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Users,
  DollarSign,
  Settings,
  LogOut,
  ExternalLink,
  ScrollText,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const menuItems = [
  { name: 'Genel Bakış', href: '/admin', icon: LayoutDashboard },
  { name: 'İlan Yönetimi', href: '/admin/ilanlar', icon: FileText },
  { name: 'Kullanıcılar', href: '/admin/kullanicilar', icon: Users },
  { name: 'Ödemeler & Ciro', href: '/admin/odemeler', icon: DollarSign },
  { name: 'Sistem Logları', href: '/admin/logs', icon: ScrollText },
  { name: 'Ayarlar', href: '/admin/ayarlar', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* MOBIL UST BAR (Hamburger Menü) */}
      <div className="md:hidden bg-[#1a202c] text-white p-4 flex justify-between items-center sticky top-0 z-[60] border-b border-gray-700">
        <span className="font-bold text-lg">Admin<span className="text-[#ffe800]">Panel</span></span>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* KARARTMA KATMANI (Overlay) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-[70] md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR ANA GÖVDE */}
      <aside className={\`
        fixed md:sticky top-0 left-0 z-[80]
        h-screen w-72 bg-[#111827] text-white flex flex-col shrink-0
        transition-transform duration-300 ease-in-out shadow-2xl md:shadow-none
        \${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      \`}>

        {/* SIDEBAR HEADER (Logo & Kapat Butonu) */}
        <div className="p-6 flex items-center justify-between border-b border-gray-800/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold">A</div>
            <span className="font-bold text-xl tracking-tight">Admin<span className="text-[#ffe800]">Panel</span></span>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden p-2 hover:bg-gray-800 rounded-full transition-colors text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* MENÜ LİSTESİ */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={\`
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all group
                  \${isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40 font-semibold'
                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
                \`}
              >
                <item.icon size={20} className={\`transition-colors \${isActive ? 'text-white' : 'text-gray-500 group-hover:text-white'}\`} />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* SIDEBAR ALT KISIM (Aksiyonlar) */}
        <div className="p-4 border-t border-gray-800/50 space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white text-sm transition-colors hover:bg-gray-800/50 rounded-xl"
          >
            <ExternalLink size={18} />
            <span>Siteye Git</span>
          </Link>
          <button
            onClick={() => { logout(); setIsOpen(false); }}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 text-sm hover:bg-red-950/20 rounded-xl transition-colors text-left font-medium"
          >
            <LogOut size={18} />
            <span>Çıkış Yap</span>
          </button>
        </div>
      </aside>
    </>
  );
}
`,
  },
];

files.forEach((file) => {
  try {
    const dir = path.dirname(file.path);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(process.cwd(), file.path), file.content.trim());
    console.log(
      colors.green + "✔ " + file.path + " tasarımı düzeltildi." + colors.reset,
    );
  } catch (error) {
    console.error(
      colors.bold + "✘ Hata: " + file.path + " yazılamadı." + colors.reset,
    );
  }
});

console.log(
  colors.blue +
    colors.bold +
    "\n✅ TASARIM DÜZELTMELERİ TAMAMLANDI! \n" +
    colors.reset,
);
