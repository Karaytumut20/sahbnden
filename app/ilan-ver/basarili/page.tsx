
import React from 'react';
import Link from 'next/link';
import { CheckCircle, Home, Eye } from 'lucide-react';

export default function PostAdSuccess() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-6">
        <CheckCircle size={48} />
      </div>

      <h1 className="text-2xl font-bold text-[#333] mb-2">Tebrikler! İlanınız Başarıyla Oluşturuldu.</h1>
      <p className="text-gray-600 max-w-md mb-8">
        İlanınız editörlerimiz tarafından incelendikten sonra en kısa sürede yayına alınacaktır.
      </p>

      <div className="flex gap-4">
        <Link href="/" className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-[#333] font-bold rounded-sm hover:bg-gray-200 transition-colors">
          <Home size={18} /> Ana Sayfaya Dön
        </Link>
        <Link href="/bana-ozel/ilanlarim" className="flex items-center gap-2 px-6 py-3 bg-blue-700 text-white font-bold rounded-sm hover:bg-blue-800 transition-colors">
          <Eye size={18} /> İlanlarımı Görüntüle
        </Link>
      </div>
    </div>
  );
}
