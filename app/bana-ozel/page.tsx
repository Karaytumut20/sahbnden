import React from 'react';
import Link from 'next/link';

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 p-6 rounded-sm shadow-sm dark:bg-[#1c1c1c] dark:border-gray-700 transition-colors">
        <h1 className="text-xl font-bold text-[#333] mb-4 dark:text-white">Hoş Geldiniz, Ahmet</h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-sm border border-blue-100 text-center dark:bg-blue-900/20 dark:border-blue-900/50">
            <span className="block text-2xl font-bold text-blue-800 dark:text-blue-400">5</span>
            <span className="text-sm text-blue-900 dark:text-blue-300">Yayındaki İlan</span>
          </div>
          <div className="bg-green-50 p-4 rounded-sm border border-green-100 text-center dark:bg-green-900/20 dark:border-green-900/50">
            <span className="block text-2xl font-bold text-green-800 dark:text-green-400">12</span>
            <span className="text-sm text-green-900 dark:text-green-300">Okunmamış Mesaj</span>
          </div>
          <div className="bg-yellow-50 p-4 rounded-sm border border-yellow-100 text-center dark:bg-yellow-900/20 dark:border-yellow-900/50">
            <span className="block text-2xl font-bold text-yellow-800 dark:text-yellow-400">3</span>
            <span className="text-sm text-yellow-900 dark:text-yellow-300">Favori Arama</span>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden dark:bg-[#1c1c1c] dark:border-gray-700 transition-colors">
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center dark:bg-gray-800 dark:border-gray-700">
          <h3 className="font-bold text-[#333] text-sm dark:text-white">Son Mesajlar</h3>
          <Link href="#" className="text-blue-700 text-[12px] hover:underline dark:text-blue-400">Tümünü Gör</Link>
        </div>
        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
          {[1, 2, 3].map((i) => (
            <li key={i} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between cursor-pointer dark:hover:bg-gray-800">
              <div>
                <p className="font-semibold text-sm text-[#333] dark:text-gray-200">Mehmet Demir <span className="font-normal text-gray-500 text-[11px] ml-2 dark:text-gray-400">Honda Civic İlanı Hakkında</span></p>
                <p className="text-[12px] text-gray-600 mt-1 truncate dark:text-gray-400">Merhaba, son fiyat ne olur acaba?</p>
              </div>
              <span className="text-[10px] text-gray-400">14:3{i}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}