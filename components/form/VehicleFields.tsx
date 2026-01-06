
import React from 'react';

export default function VehicleFields({ data, onChange }: any) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange(e.target.name, e.target.value);
  };

  return (
    <div className="bg-gray-50 p-4 rounded-sm border border-gray-200 space-y-4 animate-in fade-in">
      <h3 className="font-bold text-[#333] text-sm border-b border-gray-300 pb-2 mb-2">Araç Özellikleri</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-[12px] font-bold text-gray-600 mb-1">Marka</label>
          <select
            name="brand"
            value={data.brand || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-sm h-9 px-2 focus:border-blue-500 outline-none text-sm bg-white"
          >
            <option value="">Seçiniz</option>
            <option value="Renault">Renault</option>
            <option value="Fiat">Fiat</option>
            <option value="Volkswagen">Volkswagen</option>
            <option value="Ford">Ford</option>
            <option value="BMW">BMW</option>
          </select>
        </div>
        <div>
          <label className="block text-[12px] font-bold text-gray-600 mb-1">Yıl</label>
          <select
            name="year"
            value={data.year || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-sm h-9 px-2 focus:border-blue-500 outline-none text-sm bg-white"
          >
            <option value="">Seçiniz</option>
            {Array.from({length: 20}, (_, i) => 2025 - i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[12px] font-bold text-gray-600 mb-1">Kilometre</label>
          <input
            type="number"
            name="km"
            value={data.km || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-sm h-9 px-3 focus:border-blue-500 outline-none text-sm"
            placeholder="Örn: 120000"
          />
        </div>
        <div>
          <label className="block text-[12px] font-bold text-gray-600 mb-1">Vites Tipi</label>
          <select
            name="gear"
            value={data.gear || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-sm h-9 px-2 focus:border-blue-500 outline-none text-sm bg-white"
          >
            <option value="">Seçiniz</option>
            <option value="Manuel">Manuel</option>
            <option value="Otomatik">Otomatik</option>
            <option value="Yarı Otomatik">Yarı Otomatik</option>
          </select>
        </div>
        <div>
          <label className="block text-[12px] font-bold text-gray-600 mb-1">Yakıt Tipi</label>
          <select
            name="fuel"
            value={data.fuel || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-sm h-9 px-2 focus:border-blue-500 outline-none text-sm bg-white"
          >
            <option value="">Seçiniz</option>
            <option value="Benzin">Benzin</option>
            <option value="Dizel">Dizel</option>
            <option value="LPG">Benzin & LPG</option>
            <option value="Elektrik">Elektrik</option>
          </select>
        </div>
        <div>
          <label className="block text-[12px] font-bold text-gray-600 mb-1">Değişen / Boya Durumu</label>
          <select
            name="status"
            value={data.status || ''}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-sm h-9 px-2 focus:border-blue-500 outline-none text-sm bg-white"
          >
            <option value="">Seçiniz</option>
            <option value="Hatasız">Hatasız</option>
            <option value="Boyalı">Boyalı</option>
            <option value="Değişenli">Değişenli</option>
          </select>
        </div>
      </div>
    </div>
  );
}
