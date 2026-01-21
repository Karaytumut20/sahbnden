import React from 'react';
import { MapPin } from 'lucide-react';

export default function LocationTab({ city, district }: { city: string, district: string }) {
  return (
    <div className="space-y-4">
      <div className="bg-blue-50 p-4 border border-blue-100 rounded-sm flex items-center gap-2 text-sm text-blue-900">
        <MapPin size={18} />
        <strong>Konum:</strong> {city} / {district}
      </div>

      <div className="relative w-full h-[400px] bg-gray-200 rounded-sm border border-gray-300 overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/Istanbul_map.png')] bg-cover opacity-60"></div>
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/90 p-4 rounded-lg shadow-lg text-center backdrop-blur-sm">
                <MapPin size={32} className="text-red-600 mx-auto mb-2 animate-bounce" />
                <p className="font-bold text-gray-800 text-sm">Harita Konumu</p>
                <p className="text-xs text-gray-500 mt-1">{city}, {district}</p>
                <p className="text-[10px] text-gray-400 mt-2">(Temsili Görünüm)</p>
            </div>
        </div>
      </div>
    </div>
  );
}