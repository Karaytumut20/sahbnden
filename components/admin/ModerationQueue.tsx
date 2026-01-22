import React from 'react';
import { AlertTriangle, Check, X } from 'lucide-react';

export default function ModerationQueue({ ads }: { ads: any[] }) {
  // Bu bileşen, Admin > İlanlar sayfasında "Moderasyon Bekleyenler" sekmesinde kullanılabilir.
  return (
    <div className="space-y-4">
       {ads.map(ad => (
           <div key={ad.id} className="border border-red-200 bg-red-50 p-4 rounded-md">
               <div className="flex justify-between items-start">
                   <div>
                       <h4 className="font-bold text-red-900">{ad.title}</h4>
                       <p className="text-xs text-red-700 mt-1">
                           <span className="font-bold">Risk Skoru:</span> {ad.moderation_score} / 100
                       </p>
                       <div className="flex gap-2 mt-2">
                           {ad.moderation_tags?.map((tag: string) => (
                               <span key={tag} className="text-[10px] bg-red-200 text-red-800 px-2 py-0.5 rounded-full font-bold">{tag}</span>
                           ))}
                       </div>
                   </div>
                   <div className="flex gap-2">
                       <button className="bg-white border border-gray-300 p-1.5 rounded hover:bg-gray-100"><X size={16}/></button>
                       <button className="bg-green-600 text-white p-1.5 rounded hover:bg-green-700"><Check size={16}/></button>
                   </div>
               </div>
           </div>
       ))}
    </div>
  );
}