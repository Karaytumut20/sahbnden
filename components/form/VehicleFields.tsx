import React, { useEffect, useState } from 'react';
import {
  fuelTypes, gearTypes, vehicleStatuses, bodyTypes,
  motorPowers, engineCapacities, tractions, colors, sellerTypes, plateTypes
} from '@/lib/constants';
import { carCatalog, TechnicalSpecs } from '@/lib/carCatalog';
import { Info } from 'lucide-react';

export default function VehicleFields({ data, onChange }: any) {
  const [specs, setSpecs] = useState<TechnicalSpecs | null>(null);

  // Marka/Seri/Model değiştiğinde kataloğu kontrol et
  useEffect(() => {
    if (data.brand && data.series && data.model) {
        const brandData = carCatalog[data.brand];
        if (brandData) {
            const seriesData = brandData[data.series];
            if (seriesData) {
                const modelData = seriesData.find(m => m.name === data.model);
                if (modelData && modelData.specs) {
                    setSpecs(modelData.specs);
                    // Teknik verileri parent forma gönder (kaydetmek için)
                    onChange('technical_specs', modelData.specs);
                }
            }
        }
    }
  }, [data.brand, data.series, data.model]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange(e.target.name, e.target.value);
  };

  const renderSelect = (label: string, name: string, options: string[], required = false) => (
    <div>
      <label className="block text-[12px] font-bold text-gray-600 mb-1">{label} {required && <span className="text-red-500">*</span>}</label>
      <select
        name={name}
        value={data[name] || ''}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-sm h-9 px-2 focus:border-blue-500 outline-none text-sm bg-white"
      >
        <option value="">Seçiniz</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );

  const renderReadOnly = (label: string, value: string) => (
      <div className="bg-white p-2 rounded border border-gray-200">
          <label className="block text-[10px] font-bold text-gray-400 uppercase">{label}</label>
          <span className="font-bold text-gray-800 text-sm truncate block">{value || '-'}</span>
      </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in">

      {/* SEÇİLEN ARAÇ BİLGİSİ */}
      <div className="bg-gray-50 p-4 rounded-sm border border-gray-200">
        <h3 className="font-bold text-[#333] text-sm border-b border-gray-300 pb-2 mb-4">Araç Bilgileri</h3>

        {/* URL'den gelen veriler (Read-Only) */}
        {(data.brand || data.series || data.model) && (
            <div className="grid grid-cols-3 gap-2 mb-4">
                {renderReadOnly("Marka", data.brand)}
                {renderReadOnly("Seri", data.series)}
                {renderReadOnly("Model", data.model)}
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

            {/* Kullanıcıya Sorulan Zorunlu Alanlar */}
            <div>
            <label className="block text-[12px] font-bold text-gray-600 mb-1">Yıl <span className="text-red-500">*</span></label>
            <select name="year" value={data.year || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-sm h-9 px-2 focus:border-blue-500 outline-none text-sm bg-white">
                <option value="">Seçiniz</option>
                {Array.from({length: 40}, (_, i) => 2025 - i).map(year => (<option key={year} value={year}>{year}</option>))}
            </select>
            </div>

            <div>
            <label className="block text-[12px] font-bold text-gray-600 mb-1">Kilometre <span className="text-red-500">*</span></label>
            <input type="number" name="km" value={data.km || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-sm h-9 px-3 focus:border-blue-500 outline-none text-sm" placeholder="Örn: 120000" />
            </div>

            {renderSelect("Yakıt", "fuel", fuelTypes, true)}
            {renderSelect("Vites", "gear", gearTypes, true)}
            {renderSelect("Kasa Tipi", "body_type", bodyTypes)}
            {renderSelect("Motor Gücü", "motor_power", motorPowers)}
            {renderSelect("Motor Hacmi", "engine_capacity", engineCapacities)}
            {renderSelect("Çekiş", "traction", tractions)}
            {renderSelect("Renk", "color", colors)}
            {renderSelect("Araç Durumu", "vehicle_status", vehicleStatuses)}
            {renderSelect("Kimden", "seller_type", sellerTypes)}
            {renderSelect("Plaka Uyruğu", "plate_type", plateTypes)}

            <div>
            <label className="block text-[12px] font-bold text-gray-600 mb-1">Garanti</label>
            <select name="warranty" value={data.warranty || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-sm h-9 px-2 focus:border-blue-500 outline-none text-sm bg-white">
                <option value="">Seçiniz</option><option value="true">Evet</option><option value="false">Hayır</option>
            </select>
            </div>

            <div>
            <label className="block text-[12px] font-bold text-gray-600 mb-1">Ağır Hasar Kayıtlı</label>
            <select name="heavy_damage" value={data.heavy_damage || ''} onChange={handleChange} className="w-full border border-red-200 rounded-sm h-9 px-2 focus:border-red-500 outline-none text-sm bg-red-50 text-red-900 font-medium">
                <option value="">Seçiniz</option><option value="true">Evet</option><option value="false">Hayır</option>
            </select>
            </div>

            <div>
            <label className="block text-[12px] font-bold text-gray-600 mb-1">Takas</label>
            <select name="exchange" value={data.exchange || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-sm h-9 px-2 focus:border-blue-500 outline-none text-sm bg-white">
                <option value="">Seçiniz</option><option value="true">Evet</option><option value="false">Hayır</option>
            </select>
            </div>
        </div>
      </div>

      {/* OTOMATİK GELEN KATALOG VERİLERİ (READ ONLY) */}
      {specs && (
        <div className="bg-blue-50 p-5 rounded-lg border border-blue-200 animate-in slide-in-from-top-4">
            <h3 className="font-bold text-blue-900 text-sm mb-4 flex items-center gap-2">
                <Info size={18}/> Otomatik Getirilen Teknik Veriler
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                    <span className="block text-blue-500 font-bold mb-1">Motor Gücü</span>
                    <span className="font-bold text-slate-700">{specs.engine_performance.max_power_detail}</span>
                </div>
                <div>
                    <span className="block text-blue-500 font-bold mb-1">Hızlanma (0-100)</span>
                    <span className="font-bold text-slate-700">{specs.engine_performance.acceleration}</span>
                </div>
                <div>
                    <span className="block text-blue-500 font-bold mb-1">Yakıt (Ort.)</span>
                    <span className="font-bold text-slate-700">{specs.fuel_consumption.average}</span>
                </div>
                 <div>
                    <span className="block text-blue-500 font-bold mb-1">Maks. Hız</span>
                    <span className="font-bold text-slate-700">{specs.engine_performance.top_speed}</span>
                </div>
                 <div>
                    <span className="block text-blue-500 font-bold mb-1">Depo</span>
                    <span className="font-bold text-slate-700">{specs.fuel_consumption.tank_volume}</span>
                </div>
                 <div>
                    <span className="block text-blue-500 font-bold mb-1">Bagaj</span>
                    <span className="font-bold text-slate-700">{specs.dimensions.luggage}</span>
                </div>
            </div>

            <p className="text-[10px] text-blue-400 mt-4 italic">* Bu veriler araç kataloğundan otomatik çekilmiştir ve ilana eklenecektir.</p>
        </div>
      )}
    </div>
  );
}