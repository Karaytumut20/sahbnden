import React from 'react';
import Link from 'next/link';
import { CheckCircle, Home, Eye, Sparkles } from 'lucide-react';

export default function PostAdSuccess() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      {/* Konfeti Efekti (Basit CSS Animasyonu) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-2 h-2 bg-red-500 rounded-full animate-ping opacity-75 duration-[3s]"></div>
        <div className="absolute top-10 right-1/4 w-3 h-3 bg-blue-500 rounded-full animate-ping opacity-75 delay-700 duration-[2s]"></div>
        <div className="absolute top-20 left-1/2 w-2 h-2 bg-yellow-500 rounded-full animate-ping opacity-75 delay-300 duration-[4s]"></div>
      </div>

      <div className="relative mb-8">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-green-600 animate-in zoom-in duration-500">
          <CheckCircle size={56} strokeWidth={2.5} />
        </div>
        <div className="absolute -top-2 -right-2 bg-white p-2 rounded-full shadow-sm animate-bounce delay-500">
            <Sparkles size={24} className="text-yellow-500 fill-yellow-500" />
        </div>
      </div>

      <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">Tebrikler!</h1>
      <h2 className="text-xl font-medium text-gray-600 mb-6">İlanınız başarıyla oluşturuldu.</h2>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6 max-w-lg mb-10 text-left">
        <h3 className="font-bold text-blue-900 mb-2 text-sm uppercase tracking-wide">Sırada Ne Var?</h3>
        <ul className="space-y-3 text-sm text-blue-800">
            <li className="flex gap-2"><span className="bg-blue-200 text-blue-700 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</span> Editörlerimiz ilanınızı en geç 6 saat içinde inceleyecektir.</li>
            <li className="flex gap-2"><span className="bg-blue-200 text-blue-700 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</span> Onaylandığında veya reddedildiğinde bildirim alacaksınız.</li>
            <li className="flex gap-2"><span className="bg-blue-200 text-blue-700 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</span> İlanınız yayına alındığında "Bana Özel" panelinden yönetebilirsiniz.</li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <Link href="/" className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors">
          <Home size={20} /> Ana Sayfa
        </Link>
        <Link href="/bana-ozel/ilanlarim" className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200">
          <Eye size={20} /> İlanlarımı Yönet
        </Link>
      </div>
    </div>
  );
}