"use client";
import React, { useState } from 'react';

type TabItem = {
  id: string;
  label: string;
  content: React.ReactNode;
};

export default function Tabs({ items }: { items: TabItem[] }) {
  const [activeTab, setActiveTab] = useState(items[0].id);

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm mt-4">
      {/* Tab Başlıkları */}
      <div className="flex border-b border-gray-200 bg-gray-50">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`px-6 py-3 text-sm font-bold transition-colors border-r border-gray-200 last:border-r-0 hover:bg-white ${
              activeTab === item.id
                ? 'bg-white text-blue-700 border-t-2 border-t-blue-700 -mt-[1px]'
                : 'text-gray-600 bg-gray-50'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Tab İçeriği */}
      <div className="p-6 min-h-[200px]">
        {items.map((item) => {
          if (item.id !== activeTab) return null;
          return <div key={item.id} className="animate-in fade-in zoom-in-95 duration-200">{item.content}</div>;
        })}
      </div>
    </div>
  );
}