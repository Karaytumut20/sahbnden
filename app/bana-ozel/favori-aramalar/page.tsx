"use client";
import React from 'react';
import Link from 'next/link';
import { useNotifications } from '@/context/NotificationContext';
import { Search, Trash2, Bell } from 'lucide-react';

export default function SavedSearchesPage() {
  const { savedSearches, removeSearch } = useNotifications();

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6 dark:bg-[#1c1c1c] dark:border-gray-700">
      <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-2 dark:border-gray-700">
        <h1 className="text-xl font-bold text-[#333] dark:text-white">Favori Aramalarım ({savedSearches.length})</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">Bu kriterlerde yeni ilan eklendiğinde bildirim alırsınız.</p>
      </div>

      {savedSearches.length === 0 ? (
        <div className="text-center py-10">
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-blue-400 mx-auto mb-4 dark:bg-blue-900/20">
            <Search size={32} />
          </div>
          <p className="text-gray-500 text-sm dark:text-gray-400">Henüz kayıtlı bir aramanız yok.</p>
          <Link href="/search" className="text-blue-700 font-bold text-sm hover:underline mt-2 inline-block dark:text-blue-400">
            Hemen arama yapın
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-[12px] text-gray-500 border-b border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700">
                <th className="p-3">Arama Adı / Kriterler</th>
                <th className="p-3 w-[150px]">Kayıt Tarihi</th>
                <th className="p-3 w-[100px] text-center">Bildirim</th>
                <th className="p-3 w-[120px] text-center">İşlemler</th>
              </tr>
            </thead>
            <tbody className="text-[13px] text-[#333] dark:text-gray-200">
              {savedSearches.map((search) => (
                <tr key={search.id} className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800/50">
                  <td className="p-3">
                    <Link href={search.url} className="font-bold text-blue-900 hover:underline block mb-1 dark:text-blue-400">
                      {search.name}
                    </Link>
                    <span className="text-gray-500 text-[11px] dark:text-gray-400">{search.criteria}</span>
                  </td>
                  <td className="p-3 text-gray-600 dark:text-gray-400">{search.date}</td>
                  <td className="p-3 text-center">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-[10px] font-bold flex items-center justify-center gap-1 w-fit mx-auto dark:bg-green-900/30 dark:text-green-400">
                      <Bell size={10} /> Açık
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center gap-2">
                      <Link href={search.url} className="p-1.5 border border-gray-300 rounded hover:bg-blue-50 text-blue-600 dark:border-gray-600 dark:text-blue-400 dark:hover:bg-gray-700" title="Aramaya Git">
                        <Search size={14} />
                      </Link>
                      <button
                        onClick={() => removeSearch(search.id)}
                        className="p-1.5 border border-gray-300 rounded hover:bg-red-50 text-red-600 dark:border-gray-600 dark:text-red-400 dark:hover:bg-gray-700"
                        title="Sil"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}