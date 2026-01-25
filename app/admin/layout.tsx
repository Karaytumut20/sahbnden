import React from 'react';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 font-sans">
      {/* Sidebar - Masaüstünde sabit, mobilde gizlenebilir/üstte */}
      <AdminSidebar />

      {/* Ana İçerik Alanı */}
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden w-full">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}