import React from 'react';
import { TechnicalSpecs } from '@/lib/carCatalog';

export default function TechnicalSpecsTab({ specs }: { specs: TechnicalSpecs }) {
  if (!specs) return <div className="text-gray-500 py-4">Teknik veri bulunamadı.</div>;

  const renderSection = (title: string, data: Record<string, string>) => (
    <div className="mb-6 last:mb-0">
      <h4 className="font-bold text-gray-800 text-sm uppercase tracking-wider mb-3 border-b border-gray-100 pb-2">{title}</h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
        {Object.entries(data).map(([key, value]) => (
           <div key={key} className="flex justify-between text-xs py-2 border-b border-gray-50 hover:bg-gray-50 transition-colors">
              <span className="text-gray-500 font-medium capitalize">{key.replace(/_/g, ' ')}</span>
              <span className="text-gray-900 font-bold">{value}</span>
           </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
       {renderSection("Genel Bakış", {
           "Üretim Yılı": specs.overview.production_years,
           "Segment": specs.overview.segment,
           "Kasa / Kapı": specs.overview.body_type_detail,
           "Motor Tipi": specs.overview.engine_cylinders,
           "Yakıt (Şehir İçi)": specs.overview.consumption_city,
           "Motor Gücü": specs.overview.power_hp,
           "Şanzıman": specs.overview.transmission_detail,
           "0-100 Hızlanma": specs.overview.acceleration,
           "Azami Sürat": specs.overview.top_speed,
           "MTV": specs.overview.mtv
       })}

       {renderSection("Motor ve Performans", {
           "Motor Hacmi": specs.engine_performance.engine_volume,
           "Maksimum Güç": specs.engine_performance.max_power_detail,
           "Maksimum Tork": specs.engine_performance.max_torque,
           "Hızlanma (0-100)": specs.engine_performance.acceleration,
           "Azami Sürat": specs.engine_performance.top_speed
       })}

       {renderSection("Yakıt Tüketimi", {
           "Yakıt Tipi": specs.fuel_consumption.fuel_type_detail,
           "Şehir İçi": specs.fuel_consumption.city,
           "Şehir Dışı": specs.fuel_consumption.highway,
           "Ortalama": specs.fuel_consumption.average,
           "Depo Hacmi": specs.fuel_consumption.tank_volume
       })}

       {renderSection("Boyutlar", {
           "Koltuk Sayısı": specs.dimensions.seats,
           "Uzunluk": specs.dimensions.length,
           "Genişlik": specs.dimensions.width,
           "Yükseklik": specs.dimensions.height,
           "Net Ağırlık": specs.dimensions.weight,
           "Bagaj Kapasitesi": specs.dimensions.luggage,
           "Lastik Ölçüleri": specs.dimensions.tires
       })}
    </div>
  );
}