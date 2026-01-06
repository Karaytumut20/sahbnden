
import React from 'react';
import { Phone, MessageSquare } from 'lucide-react';

export default function MobileAdActionBar({ price, phone }: { price: string, phone?: string }) {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] z-[90] md:hidden flex items-center p-3 gap-3 pb-[20px]">
      <div className="flex-1">
        <p className="text-[10px] text-gray-500">Fiyat</p>
        <p className="text-lg font-bold text-blue-900 leading-none">{price}</p>
      </div>

      <div className="flex gap-2">
        <button className="bg-blue-100 text-blue-700 p-3 rounded-md">
          <MessageSquare size={20} />
        </button>
        <button className="bg-blue-700 text-white px-6 py-2.5 rounded-md font-bold flex items-center gap-2 text-sm shadow-md hover:bg-blue-800">
          <Phone size={18} /> Ara
        </button>
      </div>
    </div>
  );
}
