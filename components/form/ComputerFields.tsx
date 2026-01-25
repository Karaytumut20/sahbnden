import React from 'react';
import { processors, ramOptions, screenSizes, gpuCapacities, resolutions, ssdCapacities } from '@/lib/computerData';
import { laptopBrands } from '@/lib/computerData';

export default function ComputerFields({ data, onChange, categorySlug }: { data: any, onChange: any, categorySlug: string }) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    onChange(e.target.name, e.target.value);
  };

  const isLaptop = categorySlug?.includes('laptop') || categorySlug?.includes('dizustu');
  const isDesktop = categorySlug?.includes('masaustu');
  const isMonitor = categorySlug?.includes('monitor');
  const isComponent = categorySlug?.includes('donanim') || categorySlug?.includes('yedek');

  // Hangi alanların gösterileceğini belirle
  const showProcessor = isLaptop || (isDesktop && !isComponent) || categorySlug?.includes('islemci');
  const showRam = isLaptop || (isDesktop && !isComponent) || categorySlug?.includes('ram');
  const showScreen = isLaptop || isMonitor;
  const showGPU = isLaptop || (isDesktop && !isComponent) || categorySlug?.includes('ekran-karti');
  const showStorage = isLaptop || (isDesktop && !isComponent) || categorySlug?.includes('disk') || categorySlug?.includes('ssd');

  return (
    <div className="bg-gray-50 p-4 rounded-sm border border-gray-200 space-y-4 animate-in fade-in">
      <h3 className="font-bold text-[#333] text-sm border-b border-gray-300 pb-2 mb-2">Teknik Özellikler</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* İşlemci */}
        {showProcessor && (
            <div>
              <label className="block text-[12px] font-bold text-gray-600 mb-1">İşlemci</label>
              <select name="processor" value={data.processor || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-sm h-9 px-2 focus:border-blue-500 outline-none text-sm bg-white">
                <option value="">Seçiniz</option>
                {processors.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
        )}

        {/* RAM */}
        {showRam && (
            <div>
              <label className="block text-[12px] font-bold text-gray-600 mb-1">RAM Bellek</label>
              <select name="ram" value={data.ram || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-sm h-9 px-2 focus:border-blue-500 outline-none text-sm bg-white">
                <option value="">Seçiniz</option>
                {ramOptions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
        )}

        {/* Ekran Boyutu */}
        {showScreen && (
            <div>
              <label className="block text-[12px] font-bold text-gray-600 mb-1">Ekran Boyutu</label>
              <select name="screen_size" value={data.screen_size || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-sm h-9 px-2 focus:border-blue-500 outline-none text-sm bg-white">
                <option value="">Seçiniz</option>
                {screenSizes.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
        )}

        {/* Ekran Kartı */}
        {showGPU && (
            <div>
              <label className="block text-[12px] font-bold text-gray-600 mb-1">Ekran Kartı Hafızası</label>
              <select name="gpu_capacity" value={data.gpu_capacity || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-sm h-9 px-2 focus:border-blue-500 outline-none text-sm bg-white">
                <option value="">Seçiniz</option>
                {gpuCapacities.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
        )}

        {/* Çözünürlük */}
        {showScreen && (
            <div>
              <label className="block text-[12px] font-bold text-gray-600 mb-1">Çözünürlük</label>
              <select name="resolution" value={data.resolution || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-sm h-9 px-2 focus:border-blue-500 outline-none text-sm bg-white">
                <option value="">Seçiniz</option>
                {resolutions.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
        )}

        {/* Depolama */}
        {showStorage && (
            <div>
              <label className="block text-[12px] font-bold text-gray-600 mb-1">SSD Kapasitesi</label>
              <select name="ssd_capacity" value={data.ssd_capacity || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-sm h-9 px-2 focus:border-blue-500 outline-none text-sm bg-white">
                <option value="">Seçiniz</option>
                {ssdCapacities.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
        )}

        {/* Marka (Sadece Laptop ve Monitor için formda sorulur, diğerleri kategori seçiminden gelir) */}
        {(isComponent && !isLaptop) && (
             <div>
                <label className="block text-[12px] font-bold text-gray-600 mb-1">Marka</label>
                <input type="text" name="brand" value={data.brand || ''} onChange={handleChange} className="w-full border border-gray-300 rounded-sm h-9 px-3 focus:border-blue-500 outline-none text-sm" placeholder="Marka giriniz" />
             </div>
        )}
      </div>
    </div>
  );
}