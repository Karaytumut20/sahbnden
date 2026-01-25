import React from 'react';
import DashboardSidebar from '@/components/DashboardSidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* SOL KOLON: Dashboard Menü (3/12) */}
        {/* MOBİLDE GİZLENDİ (hidden), SADECE BÜYÜK EKRANLARDA GÖRÜNÜR (lg:block) */}
        {/* Bu sayede mobilde hem üst menü hem de bu sidebar üst üste binmez */}
        <aside className="hidden lg:block lg:col-span-3 xl:col-span-3">
          <DashboardSidebar />
        </aside>

        {/* SAĞ KOLON: İçerik (Mobilde Tam Genişlik) */}
        <main className="lg:col-span-9 xl:col-span-9 min-w-0">
          {children}
        </main>

      </div>
    </div>
  );
}
