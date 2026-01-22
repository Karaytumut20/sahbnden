"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, MapPin, Calendar, ArrowRight, User, ShieldCheck } from 'lucide-react';
import { useModal } from '@/context/ModalContext';
import Badge from '@/components/ui/Badge';

export default function QuickViewModal() {
  const { activeModal, closeModal, modalProps } = useModal();
  const { ad } = modalProps;

  if (activeModal !== 'QUICK_VIEW' || !ad) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal}></div>

      {/* Modal Content */}
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl relative z-10 overflow-hidden flex flex-col md:flex-row max-h-[90vh]">

        {/* Kapat Butonu */}
        <button onClick={closeModal} className="absolute top-4 right-4 z-20 bg-white/80 p-2 rounded-full hover:bg-white text-gray-500 hover:text-red-500 transition-colors">
          <X size={20} />
        </button>

        {/* Sol: Büyük Görsel */}
        <div className="w-full md:w-1/2 bg-gray-100 relative min-h-[300px] md:min-h-full group">
           <Image
             src={ad.image || 'https://via.placeholder.com/600x400'}
             alt={ad.title}
             fill
             className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
           />
           {ad.is_vitrin && <div className="absolute top-4 left-4 bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded shadow-sm">VİTRİN</div>}
        </div>

        {/* Sağ: Bilgiler */}
        <div className="w-full md:w-1/2 p-6 flex flex-col overflow-y-auto">
          <div className="mb-4">
             <div className="flex items-center gap-2 mb-2">
                {ad.is_urgent && <Badge variant="danger">Acil Satılık</Badge>}
                <span className="text-xs text-gray-400">#{ad.id}</span>
             </div>
             <h2 className="text-xl font-bold text-[#333] leading-tight mb-2">{ad.title}</h2>
             <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="flex items-center gap-1"><MapPin size={14}/> {ad.city} / {ad.district}</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                <span className="flex items-center gap-1"><Calendar size={14}/> {new Date(ad.created_at).toLocaleDateString()}</span>
             </div>
          </div>

          <div className="text-3xl font-bold text-blue-900 mb-6 border-b border-gray-100 pb-4">
             {ad.price?.toLocaleString()} {ad.currency}
          </div>

          {/* Özellik Özeti */}
          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
             {ad.m2 && (
               <div className="bg-gray-50 p-2 rounded border border-gray-100">
                 <span className="block text-xs text-gray-500">Metrekare</span>
                 <span className="font-bold text-[#333]">{ad.m2} m²</span>
               </div>
             )}
             {ad.room && (
               <div className="bg-gray-50 p-2 rounded border border-gray-100">
                 <span className="block text-xs text-gray-500">Oda Sayısı</span>
                 <span className="font-bold text-[#333]">{ad.room}</span>
               </div>
             )}
             {ad.km && (
               <div className="bg-gray-50 p-2 rounded border border-gray-100">
                 <span className="block text-xs text-gray-500">Kilometre</span>
                 <span className="font-bold text-[#333]">{ad.km}</span>
               </div>
             )}
             {ad.year && (
               <div className="bg-gray-50 p-2 rounded border border-gray-100">
                 <span className="block text-xs text-gray-500">Yıl</span>
                 <span className="font-bold text-[#333]">{ad.year}</span>
               </div>
             )}
          </div>

          {/* Satıcı */}
          <div className="flex items-center gap-3 mb-6 p-3 border border-blue-100 bg-blue-50/30 rounded-lg">
             <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700">
                <User size={20}/>
             </div>
             <div>
                <p className="text-sm font-bold text-[#333]">{ad.profiles?.full_name || 'Satıcı'}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1"><ShieldCheck size={12} className="text-green-600"/> Onaylı Hesap</p>
             </div>
          </div>

          <div className="mt-auto flex gap-3">
             <button onClick={closeModal} className="flex-1 py-3 border border-gray-300 rounded text-gray-600 font-bold hover:bg-gray-50 transition-colors text-sm">
                Kapat
             </button>
             <Link href={`/ilan/${ad.id}`} className="flex-1 bg-[#ffe800] text-black py-3 rounded font-bold hover:bg-yellow-400 transition-colors flex items-center justify-center gap-2 text-sm shadow-sm">
                İlana Git <ArrowRight size={16}/>
             </Link>
          </div>

        </div>
      </div>
    </div>
  );
}