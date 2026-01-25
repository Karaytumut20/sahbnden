import React from 'react';
import { Check, X, Minus } from 'lucide-react';

export default function FeaturesTab({ ad }: { ad: any }) {
  // Kategoriyi tespit et (Vasıta mı, Emlak mı?)
  const isVehicle = ad.category?.includes('vasita') || ad.category?.includes('otomobil') || ad.category?.includes('suv') || !!ad.brand;
  const isRealEstate = ad.category?.includes('emlak') || ad.category?.includes('konut') || !!ad.m2;

  // Yardımcı fonksiyon: Satır oluşturur
  const renderRow = (label: string, value: any) => {
    if (value === null || value === undefined || value === '') return null;

    let displayValue = value;
    if (typeof value === 'boolean') {
        displayValue = value ? 'Evet' : 'Hayır';
    }

    return (
       <div className="flex justify-between border-b border-gray-100 py-3 text-sm hover:bg-gray-50 px-2 transition-colors last:border-0">
          <span className="font-semibold text-gray-600 w-1/2">{label}</span>
          <span className="text-gray-900 font-bold w-1/2 text-right">{displayValue}</span>
       </div>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">

       {/* ARAÇ ÖZELLİKLERİ */}
       {isVehicle && (
         <>
           <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-4 border-b pb-2">Araç Bilgileri</h4>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
              {renderRow('Marka', ad.brand)}
              {renderRow('Seri / Model', ad.model)}
              {renderRow('Yıl', ad.year)}
              {renderRow('Yakıt Tipi', ad.fuel)}
              {renderRow('Vites Tipi', ad.gear)}
              {renderRow('Kasa Tipi', ad.body_type)}
              {renderRow('Motor Gücü', ad.motor_power)}
              {renderRow('Motor Hacmi', ad.engine_capacity)}
              {renderRow('Çekiş', ad.traction)}
              {renderRow('Kilometre', typeof ad.km === 'number' ? `${ad.km.toLocaleString()} km` : ad.km)}
              {renderRow('Renk', ad.color)}
              {renderRow('Garanti', ad.warranty)}
              {renderRow('Takas', ad.exchange)}
              {renderRow('Durumu', ad.vehicle_status)}
              {renderRow('Kimden', ad.seller_type)}
              {renderRow('Plaka Uyruğu', ad.plate_type)}
           </div>
         </>
       )}

       {/* EMLAK ÖZELLİKLERİ */}
       {isRealEstate && (
          <>
            <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-4 border-b pb-2">Emlak Bilgileri</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-1">
               {renderRow('Metrekare (Brüt)', `${ad.m2} m²`)}
               {renderRow('Oda Sayısı', ad.room)}
               {renderRow('Bulunduğu Kat', ad.floor)}
               {renderRow('Isıtma', ad.heating)}
               {renderRow('Takas', ad.exchange)}
               {renderRow('Kimden', ad.seller_type)}
            </div>
          </>
       )}

       {/* DİĞER KATEGORİLER İÇİN */}
       {!isVehicle && !isRealEstate && (
          <div className="text-gray-500 text-center py-6">
             <p>Bu kategori için özelleştirilmiş teknik detay tablosu bulunmamaktadır.</p>
             <p className="text-xs mt-1">Lütfen ilan açıklamasını inceleyiniz.</p>
          </div>
       )}
    </div>
  );
}