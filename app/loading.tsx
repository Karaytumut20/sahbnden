import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] w-full">
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={48} className="text-[#ffe800] animate-spin" />
        <span className="text-[#2d405a] font-bold text-lg animate-pulse">Yükleniyor...</span>
      </div>
    </div>
  );
}