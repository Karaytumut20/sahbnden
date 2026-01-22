"use client";
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, MapPin, ArrowRight, User, ShieldCheck } from 'lucide-react';
import { useModal } from '@/context/ModalContext';
import Badge from '@/components/ui/Badge';

export default function QuickViewModal() {
  const { activeModal, closeModal, modalProps } = useModal();
  const { ad } = modalProps;

  if (activeModal !== 'QUICK_VIEW' || !ad) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal}></div>

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl relative z-10 overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        <button onClick={closeModal} className="absolute top-4 right-4 z-20 bg-white/90 p-2 rounded-full hover:bg-white text-gray-500 hover:text-red-500 transition-colors shadow-sm">
          <X size={20} />
        </button>

        <div className="w-full md:w-1/2 bg-gray-50 relative min-h-[300px] md:min-h-full group flex items-center justify-center">
           <Image
             src={ad.image || 'https://via.placeholder.com/600x400'}
             alt={ad.title}
             fill
             className="object-cover group-hover:scale-105 transition-transform duration-500"
           />
           {ad.is_vitrin && <div className="absolute top-4 left-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">Featured</div>}
        </div>

        <div className="w-full md:w-1/2 p-8 flex flex-col overflow-y-auto">
          <div className="mb-4">
             <div className="flex items-center gap-2 mb-3">
                {ad.is_urgent && <Badge variant="danger">Hot Offer</Badge>}
                <span className="text-xs text-gray-400">ID: {ad.id}</span>
             </div>
             <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-3">{ad.title}</h2>
             <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="flex items-center gap-1"><MapPin size={16}/> {ad.city}, {ad.district}</span>
             </div>
          </div>

          <div className="text-4xl font-extrabold text-indigo-700 mb-8 tracking-tight">
             {ad.price?.toLocaleString()} <span className="text-2xl text-gray-500 font-normal">{ad.currency}</span>
          </div>

          <div className="flex items-center gap-4 mb-8 p-4 border border-indigo-50 bg-indigo-50/50 rounded-2xl">
             <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg">
                <User size={24}/>
             </div>
             <div>
                <p className="text-sm font-bold text-gray-900">{ad.profiles?.full_name || 'Satıcı'}</p>
                <p className="text-xs text-gray-500 flex items-center gap-1"><ShieldCheck size={12} className="text-green-500"/> Onaylı Hesap</p>
             </div>
          </div>

          <div className="mt-auto flex gap-4">
             <button onClick={closeModal} className="flex-1 py-3.5 border border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 transition-colors text-sm">
                Kapat
             </button>
             {/* DÜZELTME: Link'e tıklandığında closeModal çalışacak */}
             <Link
                href={`/ilan/${ad.id}`}
                onClick={() => {
                    closeModal();
                    // Ekstra güvenlik: Modal state temizlensin
                    setTimeout(() => closeModal(), 100);
                }}
                className="flex-1 bg-indigo-600 text-white py-3.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 text-sm"
             >
                İlana Git <ArrowRight size={18}/>
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}