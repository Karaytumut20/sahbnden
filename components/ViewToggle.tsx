"use client";
import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { LayoutGrid, List, Table } from 'lucide-react';

export default function ViewToggle({ currentView }: { currentView: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleViewChange = (view: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', view);
    router.push(`/search?${params.toString()}`);
  };

  const btnClass = (view: string) => `p-1.5 rounded-sm transition-colors ${currentView === view ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-100'}`;

  return (
    <div className="flex items-center bg-white border border-gray-300 rounded-sm p-0.5">
      <button onClick={() => handleViewChange('table')} className={btnClass('table')} title="Klasik Görünüm">
        <List size={18} />
      </button>
      <div className="w-[1px] h-4 bg-gray-200 mx-0.5"></div>
      <button onClick={() => handleViewChange('list')} className={btnClass('list')} title="Liste Görünümü">
        <LayoutGrid size={18} className="rotate-90" />
      </button>
      <div className="w-[1px] h-4 bg-gray-200 mx-0.5"></div>
      <button onClick={() => handleViewChange('grid')} className={btnClass('grid')} title="Galeri Görünümü">
        <LayoutGrid size={18} />
      </button>
    </div>
  );
}