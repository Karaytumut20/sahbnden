
'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Hata loglama servisine gönderilebilir
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="bg-red-50 p-5 rounded-full mb-6 animate-bounce">
        <AlertTriangle className="w-12 h-12 text-red-600" />
      </div>
      <h2 className="text-2xl font-bold text-[#333] mb-3">Bir şeyler ters gitti!</h2>
      <p className="text-gray-600 mb-8 max-w-md text-sm leading-relaxed">
        Şu an bu isteğinizi gerçekleştiremiyoruz. Sunucu tarafında geçici bir sorun oluşmuş olabilir veya internet bağlantınız kesilmiş olabilir.
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => reset()}
          className="flex items-center gap-2 bg-blue-700 text-white px-6 py-3 rounded-sm font-bold hover:bg-blue-800 transition-colors shadow-sm text-sm"
        >
          <RefreshCcw size={18} /> Tekrar Dene
        </button>
        <Link
          href="/"
          className="flex items-center gap-2 bg-white border border-gray-300 text-[#333] px-6 py-3 rounded-sm font-bold hover:bg-gray-50 transition-colors shadow-sm text-sm"
        >
          <Home size={18} /> Ana Sayfa
        </Link>
      </div>
    </div>
  );
}
