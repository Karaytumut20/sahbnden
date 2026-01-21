"use client";
import React from 'react';
import Link from 'next/link';
import { useHistory } from '@/context/HistoryContext';
import { History, Trash2 } from 'lucide-react';

export default function RecentAdsWidget() {
  const { recentAds, clearHistory } = useHistory();

  // Henüz yüklenmediyse veya boşsa gösterme
  if (!recentAds || recentAds.length === 0) return null;

  return (
    <div className="mt-4 bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden dark:bg-gray-800 dark:border-gray-700">
      <div className="bg-gray-50 p-3 border-b border-gray-100 flex justify-between items-center dark:bg-gray-900/50 dark:border-gray-700">
        <h3 className="text-xs font-bold text-[#333] flex items-center gap-1 dark:text-gray-200">
          <History size={14} className="text-blue-600 dark:text-blue-400" />
          Son Gezilenler
        </h3>
        <button onClick={clearHistory} className="text-gray-400 hover:text-red-500" title="Temizle">
          <Trash2 size={12} />
        </button>
      </div>

      <ul>
        {recentAds.map((ad) => (
          <li key={ad.id} className="border-b border-gray-50 last:border-0 dark:border-gray-700">
            <Link href={`/ilan/${ad.id}`} className="flex gap-2 p-2 hover:bg-blue-50 transition-colors group dark:hover:bg-gray-700">
              <div className="w-12 h-10 bg-gray-200 shrink-0 overflow-hidden rounded-sm border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
                <img src={ad.image} alt={ad.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-[#333] truncate group-hover:text-blue-700 dark:text-gray-300 dark:group-hover:text-blue-400">{ad.title}</p>
                <p className="text-[10px] font-bold text-blue-900 dark:text-blue-300">{ad.price} {ad.currency}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}