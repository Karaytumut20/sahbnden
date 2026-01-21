'use client';
import React from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4 font-sans">
          <div className="bg-red-100 p-6 rounded-full mb-6 animate-pulse">
             <AlertTriangle size={48} className="text-red-600"/>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">Kritik Bir Hata Oluştu</h2>
          <p className="text-gray-600 mb-8 max-w-md">
            Sistemde beklenmedik bir durum oluştu. Teknik ekibimiz bilgilendirildi.
          </p>

          <div className="flex gap-4">
            <button
              onClick={() => reset()}
              className="bg-blue-600 text-white px-6 py-3 rounded-md font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <RefreshCcw size={18}/> Tekrar Dene
            </button>
            <Link href="/" className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-md font-bold hover:bg-gray-50 transition-colors">
              Ana Sayfa
            </Link>
          </div>

          <div className="mt-12 text-xs text-gray-400">
             Hata Kodu: {error.digest || 'Unknown'}
          </div>
        </div>
      </body>
    </html>
  );
}