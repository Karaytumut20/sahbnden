const fs = require("fs");
const path = require("path");

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  bold: "\x1b[1m",
};

console.log(
  colors.blue +
    colors.bold +
    "\n🚀 GELİŞMİŞ ARAÇ KATALOĞU VE TEKNİK VERİ SİSTEMİ KURULUYOR...\n" +
    colors.reset,
);

const files = [
  // 1. YENİ ARAÇ KATALOĞU (Detaylı Teknik Verilerle)
  {
    path: "lib/carCatalog.ts",
    content: `
export interface TechnicalSpecs {
  overview: {
    production_years: string;
    segment: string;
    body_type_detail: string;
    engine_cylinders: string;
    consumption_city: string;
    consumption_highway: string;
    power_hp: string;
    transmission_detail: string;
    acceleration: string;
    top_speed: string;
    mtv: string;
  };
  engine_performance: {
    engine_type: string;
    engine_volume: string;
    max_power_detail: string;
    max_torque: string;
    acceleration: string;
    top_speed: string;
  };
  fuel_consumption: {
    fuel_type_detail: string;
    city: string;
    highway: string;
    average: string;
    tank_volume: string;
  };
  dimensions: {
    seats: string;
    length: string;
    width: string;
    height: string;
    weight: string;
    luggage: string;
    tires: string;
  };
}

export interface CarModel {
  id: string;
  name: string;
  specs?: TechnicalSpecs;
}

// BMW 6 Serisi Örneği ve Diğer Popüler Modeller
export const carCatalog: Record<string, Record<string, CarModel[]>> = {
  "BMW": {
    "6 Serisi": [
      {
        id: "640d_xdrive_cabrio",
        name: "640d xDrive Cabrio",
        specs: {
          overview: {
            production_years: "2011 / 2017",
            segment: "F Segment",
            body_type_detail: "Cabrio / 2 Kapı",
            engine_cylinders: "Dizel / 6 silindir",
            consumption_city: "7.1 lt",
            consumption_highway: "5.1 lt",
            power_hp: "313 hp",
            transmission_detail: "Otomatik / 8 Vites / 4x4",
            acceleration: "5.4 sn",
            top_speed: "250 km/saat",
            mtv: "8.523,00 TL x 2 (2014 model)"
          },
          engine_performance: {
            engine_type: "Dizel / 6 silindir",
            engine_volume: "2993 cc",
            max_power_detail: "313 hp (230 kw) / 4.400 rpm",
            max_torque: "630 Nm / 1.500 rpm",
            acceleration: "5.4 sn",
            top_speed: "250 km/saat"
          },
          fuel_consumption: {
            fuel_type_detail: "Dizel / EURO 6",
            city: "7.1 lt",
            highway: "5.1 lt",
            average: "5.9 lt",
            tank_volume: "70 lt"
          },
          dimensions: {
            seats: "4 Koltuk",
            length: "4894 mm",
            width: "1894 mm",
            height: "1365 mm",
            weight: "2005 kg",
            luggage: "300 lt",
            tires: "245/45 R18"
          }
        }
      },
      { id: "640d_coupe", name: "640d Coupe" },
      { id: "650i_cabrio", name: "650i Cabrio" },
      { id: "630i_cabrio", name: "630i Cabrio" }
    ],
    "3 Serisi": [
      { id: "320d_sedan", name: "320d Sedan" },
      { id: "320i_ed", name: "320i EfficientDynamics" },
      { id: "318i", name: "318i" }
    ],
    "5 Serisi": [
      { id: "520d_sedan", name: "520d Sedan" },
      { id: "520i_sedan", name: "520i Sedan" },
      { id: "525d_xdrive", name: "525d xDrive" }
    ]
  },
  "Mercedes-Benz": {
    "C Serisi": [
      { id: "c200d_amg", name: "C 200 d AMG" },
      { id: "c180_avantgarde", name: "C 180 Avantgarde" }
    ],
    "E Serisi": [
      { id: "e180_exclusive", name: "E 180 Exclusive" },
      { id: "e250_cdi_4matic", name: "E 250 CDI 4MATIC" }
    ]
  },
  "Audi": {
    "A3": [{ id: "a3_sedan_35_tfsi", name: "A3 Sedan 35 TFSI" }],
    "A6": [{ id: "a6_40_tdi_quattro", name: "A6 Sedan 40 TDI quattro" }]
  },
  "Volkswagen": {
    "Passat": [{ id: "passat_15_tsi_elegance", name: "1.5 TSI Elegance" }],
    "Golf": [{ id: "golf_10_etsi_rline", name: "1.0 eTSI R-Line" }]
  },
  "Renault": {
    "Clio": [{ id: "clio_10_tce_joy", name: "1.0 TCe Joy" }],
    "Megane": [{ id: "megane_13_tce_icon", name: "1.3 TCe Icon" }]
  },
  "Fiat": {
    "Egea": [{ id: "egea_14_fire_urban", name: "1.4 Fire Urban" }]
  },
  "Ford": {
    "Focus": [{ id: "focus_15_tdci_titanium", name: "1.5 TDCi Titanium" }]
  },
  "Toyota": {
    "Corolla": [{ id: "corolla_15_dream", name: "1.5 Dream" }]
  }
};
`,
  },
  // 2. KATEGORİ SİHİRBAZI GÜNCELLEMESİ (Yeni Katalogdan Veri Çekme)
  {
    path: "components/CategoryWizard.tsx",
    content: `
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, ArrowLeft, Home, Car, ShoppingCart, Smartphone, Monitor, Camera, Briefcase, CheckCircle2 } from 'lucide-react';
import { categories } from '@/lib/data';
import { carCatalog } from '@/lib/carCatalog';

const iconMap: any = {
  Home: <Home size={28} />,
  Car: <Car size={28} />,
  ShoppingCart: <ShoppingCart size={28} />,
  Smartphone: <Smartphone size={28} />,
  Monitor: <Monitor size={28} />,
  Camera: <Camera size={28} />,
  Briefcase: <Briefcase size={28} />
};

export default function CategoryWizard() {
  const router = useRouter();

  const [history, setHistory] = useState<any[]>([]);
  const [currentList, setCurrentList] = useState<any[]>(categories);
  const [selectedPath, setSelectedPath] = useState<string[]>([]);

  const [isCarSelection, setIsCarSelection] = useState(false);
  const [carStep, setCarStep] = useState<'brand' | 'series' | 'model' | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedSeries, setSelectedSeries] = useState<string>('');

  const handleSelect = (item: any) => {
    // 1. Vasıta -> Otomobil Seçildi mi?
    if (item.slug === 'otomobil') {
        setIsCarSelection(true);
        setCarStep('brand');
        setHistory([...history, currentList]);
        setSelectedPath([...selectedPath, item.title]);

        // Marka Listesini Hazırla
        const brandList = Object.keys(carCatalog).map(brand => ({
            id: brand,
            title: brand,
            slug: brand,
            type: 'brand'
        })).sort((a,b) => a.title.localeCompare(b.title));

        setCurrentList(brandList);
        return;
    }

    // 2. Araç Seçimi Modu
    if (isCarSelection) {
        if (carStep === 'brand') {
            const brand = item.title;
            setSelectedBrand(brand);

            const seriesList = Object.keys(carCatalog[brand] || {}).map(series => ({
                id: series,
                title: series,
                slug: series,
                type: 'series'
            }));

            if (seriesList.length > 0) {
                setHistory([...history, currentList]);
                setCurrentList(seriesList);
                setSelectedPath([...selectedPath, brand]);
                setCarStep('series');
            } else {
                 finishSelection(brand, '', '');
            }

        } else if (carStep === 'series') {
            const series = item.title;
            setSelectedSeries(series);

            const models = carCatalog[selectedBrand][series] || [];
            const modelList = models.map(model => ({
                id: model.id,
                title: model.name,
                slug: model.id,
                type: 'model',
                // Specs verisini de taşıyoruz ama URL'e sığmaz, ID'den bulacağız
            }));

            if (modelList.length > 0) {
                setHistory([...history, currentList]);
                setCurrentList(modelList);
                setSelectedPath([...selectedPath, series]);
                setCarStep('model');
            } else {
                finishSelection(selectedBrand, series, '');
            }

        } else if (carStep === 'model') {
            // Model Seçildi -> Bitir
            finishSelection(selectedBrand, selectedSeries, item.title);
        }
        return;
    }

    // 3. Standart Kategori
    const newPath = [...selectedPath, item.title];

    if (item.subs && item.subs.length > 0) {
      setHistory([...history, currentList]);
      setCurrentList(item.subs);
      setSelectedPath(newPath);
    } else {
      const categorySlug = item.slug;
      router.push(\`/ilan-ver/detay?cat=\${categorySlug}&path=\${newPath.join(' > ')}\`);
    }
  };

  const finishSelection = (brand: string, series: string, model: string) => {
     const finalPath = [...selectedPath, model].filter(Boolean).join(' > ');
     const params = new URLSearchParams();
     params.set('cat', 'otomobil');
     params.set('path', finalPath);
     if(brand) params.set('brand', brand);
     if(series) params.set('series', series);
     if(model) params.set('model', model);

     router.push(\`/ilan-ver/detay?\${params.toString()}\`);
  };

  const handleBack = () => {
    if (history.length === 0) return;

    const prevList = history[history.length - 1];
    setHistory(history.slice(0, -1));
    setCurrentList(prevList);
    setSelectedPath(selectedPath.slice(0, -1));

    if (isCarSelection) {
        if (carStep === 'model') setCarStep('series');
        else if (carStep === 'series') setCarStep('brand');
        else if (carStep === 'brand') {
            setIsCarSelection(false);
            setCarStep(null);
        }
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-4 mb-6">
        {history.length > 0 && (
          <button
            onClick={handleBack}
            className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
        )}
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {history.length === 0 ? 'İlan Kategorisini Seçin' : selectedPath[selectedPath.length - 1] || 'Seçim Yapınız'}
          </h2>
          <p className="text-sm text-slate-500">
            {history.length === 0 ? 'İlanınız için en uygun ana kategoriyi belirleyin.' : selectedPath.join(' > ')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentList.map((item) => {
          const Icon = iconMap[item.icon] || null;
          const isLeaf = isCarSelection ? (carStep === 'model') : (!item.subs || item.subs.length === 0);

          return (
            <button
              key={item.id || item.title}
              onClick={() => handleSelect(item)}
              className="group relative flex items-center p-5 bg-white border border-gray-200 rounded-xl hover:border-indigo-500 hover:shadow-md hover:shadow-indigo-100 transition-all duration-200 text-left"
            >
              <div className={\`
                w-14 h-14 rounded-lg flex items-center justify-center mr-4 transition-colors shrink-0
                \${history.length === 0 ? 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white' : 'bg-gray-100 text-gray-500 group-hover:bg-indigo-100 group-hover:text-indigo-700'}
              \`}>
                {history.length === 0 && Icon ? Icon : (
                   isLeaf ? <CheckCircle2 size={24} className="text-green-600" /> : <div className="text-sm font-bold opacity-50">{item.title.substring(0,2).toUpperCase()}</div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <span className="block font-bold text-slate-700 group-hover:text-indigo-900 text-base mb-0.5 truncate">
                  {item.title}
                </span>
                <span className="text-xs text-slate-400 group-hover:text-indigo-500 font-medium">
                  {isLeaf ? 'Seç ve Devam Et' : 'Alt Kategorileri Gör'}
                </span>
              </div>

              <div className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">
                {isLeaf ? <CheckCircle2 size={20} className="text-green-500" /> : <ChevronRight size={20} className="text-indigo-400" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
`,
  },
  // 3. ARAÇ FORMU GÜNCELLEMESİ (Yeni Alanlar ve Katalog Gösterimi)
  {
    path: "components/form/VehicleFields.tsx",
    content: `import React, { useEffect, useState } from 'react';
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
`,
  },
  // 4. İLAN OLUŞTURMA SAYFASI (Technical Specs Kaydı)
  {
    path: "app/ilan-ver/detay/page.tsx",
    content: `
"use client";
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, ArrowLeft, ArrowRight, Info, MapPin, Camera, Sparkles, Eye, X, Save } from 'lucide-react';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import RealEstateFields from '@/components/form/RealEstateFields';
import VehicleFields from '@/components/form/VehicleFields';
import ImageUploader from '@/components/ui/ImageUploader';
import AdCard from '@/components/AdCard';
import { createAdAction } from '@/lib/actions';
import { adSchema } from '@/lib/schemas';
import { cities, getDistricts } from '@/lib/locations';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';

function PostAdFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToast } = useToast();
  const { user } = useAuth();

  const categorySlug = searchParams.get('cat') || '';
  const categoryPath = searchParams.get('path') || 'Kategori Seçilmedi';

  // URL'den gelen araç bilgileri
  const urlBrand = searchParams.get('brand') || '';
  const urlSeries = searchParams.get('series') || '';
  const urlModel = searchParams.get('model') || '';

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [districts, setDistricts] = useState<string[]>([]);
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const [formData, setFormData] = useState<any>({
    title: '', description: '', price: '', currency: 'TL', city: '', district: '',
    m2: '', room: '', floor: '', heating: '',
    brand: urlBrand,
    series: urlSeries,
    model: urlModel,
    year: '', km: '', gear: '', fuel: '',
    body_type: '', motor_power: '', engine_capacity: '', traction: '', color: '',
    warranty: '', plate_type: '', exchange: '', seller_type: '', vehicle_status: '',
    heavy_damage: '', // YENİ
    technical_specs: null // YENİ
  });

  const isRealEstate = categorySlug.includes('konut') || categorySlug.includes('isyeri');
  const isVehicle = categorySlug.includes('otomobil') || categorySlug.includes('suv');

  useEffect(() => {
    if (urlBrand || urlSeries || urlModel) {
        setFormData(prev => ({
            ...prev,
            brand: urlBrand,
            series: urlSeries,
            model: urlModel
        }));
    }
  }, [urlBrand, urlSeries, urlModel]);

  useEffect(() => {
    const savedDraft = localStorage.getItem('ad_draft');
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.categorySlug === categorySlug) {
            setFormData(prev => ({ ...prev, ...parsed.formData }));
            setImages(parsed.images || []);
            addToast('Taslağınız başarıyla geri yüklendi.', 'info');
        }
      } catch (e) { console.error("Draft error", e); }
    }
  }, [categorySlug]);

  useEffect(() => {
    const timer = setTimeout(() => {
        if (formData.title || formData.price) {
            localStorage.setItem('ad_draft', JSON.stringify({ formData, images, categorySlug }));
            setLastSaved(new Date());
        }
    }, 1000);
    return () => clearTimeout(timer);
  }, [formData, images, categorySlug]);

  useEffect(() => {
    if (formData.city) {
      setDistricts(getDistricts(formData.city));
    }
  }, [formData.city]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  // Child component'ten gelen verileri al (Örn: technical_specs)
  const handleDynamicChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) { router.push('/login'); return; }

    const rawData = {
        ...formData,
        category: categorySlug,
        image: images[0] || null,
        images: images,
        price: Number(formData.price),

        year: isVehicle || isRealEstate ? Number(formData.year) : undefined,
        km: isVehicle ? Number(formData.km) : undefined,
        m2: isRealEstate ? Number(formData.m2) : undefined,
        floor: isRealEstate ? Number(formData.floor) : undefined,

        warranty: formData.warranty === 'true',
        exchange: formData.exchange === 'true',
        heavy_damage: formData.heavy_damage === 'true', // YENİ
    };

    const result = adSchema.safeParse(rawData);

    if (!result.success) {
        const fieldErrors: any = {};
        result.error.issues.forEach(issue => { fieldErrors[issue.path[0]] = issue.message; });
        setErrors(fieldErrors);
        addToast('Lütfen hatalı alanları düzeltiniz.', 'error');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    setIsSubmitting(true);
    const res = await createAdAction(rawData);

    if (res.error) {
        addToast(res.error, 'error');
    } else {
        localStorage.removeItem('ad_draft');
        addToast('İlan başarıyla oluşturuldu!', 'success');
        router.push(\`/ilan-ver/doping?adId=\${res.adId}\`);
    }
    setIsSubmitting(false);
  };

  const PreviewCard = () => (
    <div className="pointer-events-none transform scale-[0.85] origin-top">
        <AdCard
            ad={{
                id: 999999,
                title: formData.title || 'İlan Başlığı',
                price: formData.price || 0,
                currency: formData.currency,
                city: formData.city || 'İl',
                district: formData.district || 'İlçe',
                image: images[0] || null,
                created_at: new Date().toISOString(),
                is_vitrin: false,
                is_urgent: false
            }}
            viewMode="grid"
        />
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row gap-8 relative">
      <div className="flex-1">
        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-indigo-600 uppercase tracking-wide mb-1">Seçilen Kategori</p>
            <h1 className="text-sm md:text-base font-bold text-indigo-900">{categoryPath}</h1>
          </div>
          <button onClick={() => router.push('/ilan-ver')} className="text-xs font-bold text-slate-500 hover:text-indigo-600 bg-white px-3 py-1.5 rounded-lg border border-indigo-100 hover:border-indigo-300 transition-colors">
            Değiştir
          </button>
        </div>

        <div className="flex justify-end mb-2">
            {lastSaved && (
                <span className="text-[10px] text-gray-400 flex items-center gap-1 animate-pulse">
                    <Save size={10}/> Taslak kaydedildi: {lastSaved.toLocaleTimeString()}
                </span>
            )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Info className="text-indigo-500" size={20}/> Temel Bilgiler
            </h3>

            <div className="space-y-5">
              <Input label="İlan Başlığı" name="title" placeholder="Örn: Sahibinden temiz, masrafsız..." value={formData.title} onChange={handleInputChange} error={errors.title} className="font-medium text-base" />
              <Textarea label="İlan Açıklaması" name="description" placeholder="Ürününüzü detaylıca anlatın..." value={formData.description} onChange={handleInputChange} className="h-32 leading-relaxed" error={errors.description} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="relative">
                   <Input label="Fiyat" name="price" type="number" placeholder="0" value={formData.price} onChange={handleInputChange} error={errors.price} className="font-bold text-lg text-indigo-900" />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">Para Birimi</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['TL', 'USD', 'EUR', 'GBP'].map(curr => (
                      <button key={curr} type="button" onClick={() => setFormData({...formData, currency: curr})} className={\`h-10 rounded-lg text-sm font-bold border transition-all \${formData.currency === curr ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}\`}>{curr}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {(isRealEstate || isVehicle) && (
            <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
              <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Sparkles className="text-orange-500" size={20}/> Teknik Detaylar
              </h3>
              <div className="-mx-4 md:mx-0">
                {isRealEstate && <RealEstateFields data={formData} onChange={handleDynamicChange} />}
                {isVehicle && <VehicleFields data={formData} onChange={handleDynamicChange} />}
              </div>
            </section>
          )}

          <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-pink-500"></div>
            <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
              <Camera className="text-pink-500" size={20}/> Fotoğraflar
            </h3>
            <p className="text-sm text-slate-500 mb-6">Vitrin görseli ilk yüklediğiniz fotoğraf olacaktır.</p>
            <div className="bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300">
               <ImageUploader onImagesChange={setImages} initialImages={images} />
            </div>
          </section>

          <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <MapPin className="text-green-500" size={20}/> Konum Bilgisi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">İl <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select name="city" onChange={handleInputChange} value={formData.city} className="w-full h-11 pl-3 pr-8 bg-white border border-gray-300 rounded-lg outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 appearance-none text-sm transition-shadow shadow-sm">
                    <option value="">Seçiniz</option>
                    {cities.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                  <div className="absolute right-3 top-3.5 pointer-events-none text-gray-400"><MapPin size={16}/></div>
                </div>
                {errors.city && <p className="text-red-500 text-[10px] mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 mb-1">İlçe <span className="text-red-500">*</span></label>
                <div className="relative">
                  <select name="district" value={formData.district} onChange={handleInputChange} className="w-full h-11 pl-3 pr-8 bg-white border border-gray-300 rounded-lg outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 appearance-none text-sm transition-shadow shadow-sm disabled:bg-gray-100 disabled:text-gray-400" disabled={!formData.city}>
                    <option value="">Seçiniz</option>
                    {districts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <div className="absolute right-3 top-3.5 pointer-events-none text-gray-400"><MapPin size={16}/></div>
                </div>
                {errors.district && <p className="text-red-500 text-[10px] mt-1">{errors.district}</p>}
              </div>
            </div>
          </section>

          <div className="flex items-center justify-between pt-4 pb-20 lg:pb-0">
            <button type="button" onClick={() => router.back()} className="px-6 py-3 rounded-lg font-bold text-sm text-slate-600 hover:bg-slate-100 flex items-center gap-2 transition-colors">
              <ArrowLeft size={18}/> Geri Dön
            </button>
            <button type="submit" disabled={isSubmitting} className="bg-indigo-600 text-white px-10 py-4 rounded-xl font-bold text-base hover:bg-indigo-700 hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center gap-2">
              {isSubmitting ? <Loader2 className="animate-spin" size={20}/> : <>Devam Et <ArrowRight size={20}/></>}
            </button>
          </div>
        </form>
      </div>

      <div className="hidden lg:block w-[300px] shrink-0">
        <div className="sticky top-28 space-y-4">
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 shadow-sm">
            <h4 className="font-bold text-blue-900 mb-2 text-sm flex items-center gap-2"><Info size={16}/> İpucu</h4>
            <p className="text-xs text-blue-800 leading-relaxed">İlan başlığınızda anahtar kelimeleri (marka, model, özellik) geçirmek arama sonuçlarında daha üstte çıkmanızı sağlar.</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
             <h4 className="font-bold text-slate-800 mb-3 text-sm">Canlı Önizleme</h4>
             {formData.title ? <PreviewCard /> : (
                 <div className="opacity-50 pointer-events-none grayscale">
                   <div className="aspect-[4/3] bg-gray-200 rounded-lg mb-2"></div>
                   <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                   <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                 </div>
             )}
             <p className="text-[10px] text-center text-gray-400 mt-2">{formData.title ? 'İlanınız listelerde böyle görünecek' : 'Başlık girdikçe önizleme aktifleşir'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PostAdPage() {
    return <Suspense fallback={<div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-indigo-600" size={32}/></div>}><PostAdFormContent /></Suspense>
}
`,
  },
  // 5. ŞEMA GÜNCELLEMESİ (Yeni Alanlar)
  {
    path: "lib/schemas.ts",
    content: `import { z } from 'zod';

export const adSchema = z.object({
  title: z.string().min(5, "Başlık en az 5 karakter olmalıdır").max(100, "Başlık çok uzun"),
  description: z.string().min(10, "Açıklama en az 10 karakter olmalıdır"),
  price: z.number({ invalid_type_error: "Geçerli bir fiyat giriniz" }).min(0, "Fiyat 0'dan küçük olamaz"),
  currency: z.enum(['TL', 'USD', 'EUR', 'GBP']),
  city: z.string().min(1, "İl seçimi zorunludur"),
  district: z.string().min(1, "İlçe seçimi zorunludur"),
  category: z.string().min(1, "Kategori seçimi zorunludur"),
  image: z.string().nullable().optional(),
  images: z.array(z.string()).optional(),

  // Emlak
  room: z.string().optional().nullable(),
  m2: z.number().optional().nullable(),
  floor: z.number().optional().nullable(),
  heating: z.string().optional().nullable(),

  // Vasıta (Temel)
  brand: z.string().optional().nullable(),
  series: z.string().optional().nullable(),
  model: z.string().optional().nullable(),
  year: z.number().optional().nullable(),
  km: z.number().optional().nullable(),
  gear: z.string().optional().nullable(),
  fuel: z.string().optional().nullable(),

  // Vasıta (Detay)
  body_type: z.string().optional().nullable(),
  motor_power: z.string().optional().nullable(),
  engine_capacity: z.string().optional().nullable(),
  traction: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  warranty: z.boolean().optional().nullable(),
  exchange: z.boolean().optional().nullable(),
  plate_type: z.string().optional().nullable(),
  seller_type: z.string().optional().nullable(),
  vehicle_status: z.string().optional().nullable(),
  heavy_damage: z.boolean().optional().nullable(), // YENİ

  // Teknik Özellikler (JSONB)
  technical_specs: z.any().optional().nullable()

}).superRefine((data, ctx) => {
  // Emlak Özel Kontrolleri
  if (data.category.includes('konut') || data.category.includes('isyeri')) {
    if (!data.m2) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Metrekare zorunludur", path: ['m2'] });
    if (!data.room && data.category.includes('konut')) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Oda sayısı zorunludur", path: ['room'] });
  }
  // Vasıta Özel Kontrolleri
  if (data.category.includes('otomobil') || data.category.includes('suv')) {
    if (!data.brand) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Marka zorunludur", path: ['brand'] });
    if (!data.km) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Kilometre zorunludur", path: ['km'] });
    if (!data.year) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Yıl zorunludur", path: ['year'] });
    if (!data.fuel) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Yakıt tipi zorunludur", path: ['fuel'] });
    if (!data.gear) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Vites tipi zorunludur", path: ['gear'] });
  }
});

export type AdFormValues = z.infer<typeof adSchema>;
`,
  },
  // 6. TEKNİK ÖZELLİKLER TAB (İlan Detay Sayfası İçin)
  {
    path: "components/AdDetail/TechnicalSpecsTab.tsx",
    content: `import React from 'react';
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
`,
  },
  // 7. AD DETAIL PAGE UPDATE (Yeni Tab'ı Ekle)
  {
    path: "app/ilan/[id]/page.tsx",
    content: `import React from 'react';
import { notFound } from 'next/navigation';
import { getAdDetailServer } from '@/lib/actions';
import Breadcrumb from '@/components/Breadcrumb';
import Gallery from '@/components/Gallery';
import MobileAdActionBar from '@/components/MobileAdActionBar';
import AdActionButtons from '@/components/AdActionButtons';
import StickyAdHeader from '@/components/StickyAdHeader';
import SellerSidebar from '@/components/SellerSidebar';
import Tabs from '@/components/AdDetail/Tabs';
import FeaturesTab from '@/components/AdDetail/FeaturesTab';
import LocationTab from '@/components/AdDetail/LocationTab';
import TechnicalSpecsTab from '@/components/AdDetail/TechnicalSpecsTab'; // YENİ
import LoanCalculator from '@/components/tools/LoanCalculator';
import ViewTracker from '@/components/ViewTracker';
import LiveVisitorCount from '@/components/LiveVisitorCount';
import Badge from '@/components/ui/Badge';
import { Eye, MapPin } from 'lucide-react';

export default async function AdDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ad = await getAdDetailServer(Number(id));
  if (!ad) return notFound();

  const formattedPrice = ad.price?.toLocaleString('tr-TR');
  const location = \`\${ad.city || ''} / \${ad.district || ''}\`;
  const sellerInfo = ad.profiles || { full_name: 'Bilinmiyor', phone: '', email: '', show_phone: false };
  const adImages = ad.images && ad.images.length > 0 ? ad.images : (ad.image ? [ad.image] : []);

  // Tabs Yapılandırması
  const tabItems = [
     { id: 'desc', label: 'İlan Açıklaması', content: <div className="text-slate-700 leading-relaxed whitespace-pre-wrap text-base p-2">{ad.description}</div> },
     { id: 'features', label: 'Özellikler', content: <FeaturesTab ad={ad} /> },
     { id: 'location', label: 'Konum', content: <LocationTab city={ad.city} district={ad.district} /> }
  ];

  // Eğer teknik veri varsa yeni tab ekle
  if (ad.technical_specs) {
      tabItems.splice(2, 0, { id: 'tech_specs', label: 'Teknik Veriler', content: <TechnicalSpecsTab specs={ad.technical_specs} /> });
  }

  return (
    <div className="pb-20 relative font-sans bg-gray-50 min-h-screen">
      <ViewTracker adId={ad.id} />
      <StickyAdHeader title={ad.title} price={formattedPrice} currency={ad.currency} />

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <Breadcrumb path={\`\${ad.category === 'emlak' ? 'Emlak' : 'Vasıta'} > \${location} > İlan Detayı\`} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-slate-900 font-bold text-2xl md:text-3xl leading-tight mb-2">{ad.title}</h1>
            <div className="flex items-center gap-4 text-sm text-slate-500">
               <span className="flex items-center gap-1"><MapPin size={16}/> {location}</span>
               <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
               <span className="text-indigo-600 font-medium">#{ad.id}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
              {ad.is_urgent && <Badge variant="danger" className="text-sm px-3 py-1">ACİL</Badge>}
              {ad.is_vitrin && <Badge variant="warning" className="text-sm px-3 py-1">VİTRİN</Badge>}
              <LiveVisitorCount adId={ad.id} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-1">
               <Gallery mainImage={ad.image} images={adImages} />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex justify-between items-center">
               <div>
                 <p className="text-sm text-slate-500 mb-1">Fiyat</p>
                 <p className="text-3xl font-extrabold text-indigo-700">{formattedPrice} <span className="text-xl text-slate-400 font-normal">{ad.currency}</span></p>
               </div>
               <div className="hidden md:block">
                 <AdActionButtons id={ad.id} title={ad.title} image={ad.image} sellerName={sellerInfo.full_name} />
               </div>
            </div>

            <Tabs items={tabItems} />
          </div>

          <div className="lg:col-span-4 space-y-6">
             <SellerSidebar
                sellerId={ad.user_id}
                sellerName={sellerInfo.full_name || 'Kullanıcı'}
                sellerPhone={sellerInfo.phone || 'Telefon yok'}
                showPhone={sellerInfo.show_phone}
                adId={ad.id}
                adTitle={ad.title}
                adImage={ad.image}
                price={formattedPrice}
                currency={ad.currency}
             />

             <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider">İlan Künyesi</h3>
                <ul className="space-y-3 text-sm">
                   <li className="flex justify-between border-b border-gray-50 pb-2"><span className="text-slate-500">İlan Tarihi</span><span className="font-medium text-slate-900">{new Date(ad.created_at).toLocaleDateString()}</span></li>
                   {ad.brand && <li className="flex justify-between border-b border-gray-50 pb-2"><span className="text-slate-500">Marka</span><span className="font-medium text-slate-900">{ad.brand}</span></li>}
                   {ad.model && <li className="flex justify-between border-b border-gray-50 pb-2"><span className="text-slate-500">Model</span><span className="font-medium text-slate-900">{ad.model}</span></li>}
                   {ad.year && <li className="flex justify-between border-b border-gray-50 pb-2"><span className="text-slate-500">Yıl</span><span className="font-medium text-slate-900">{ad.year}</span></li>}
                   {ad.km && <li className="flex justify-between border-b border-gray-50 pb-2"><span className="text-slate-500">Kilometre</span><span className="font-medium text-slate-900">{ad.km}</span></li>}
                   {ad.heavy_damage !== null && ad.heavy_damage !== undefined && (
                        <li className="flex justify-between border-b border-gray-50 pb-2">
                            <span className="text-slate-500">Ağır Hasar Kayıtlı</span>
                            <span className={\`font-bold \${ad.heavy_damage ? 'text-red-600' : 'text-green-600'}\`}>{ad.heavy_damage ? 'Evet' : 'Hayır'}</span>
                        </li>
                   )}
                   <li className="flex justify-between pt-1">
                      <span className="text-slate-500">Görüntülenme</span>
                      <span className="font-medium text-slate-900 flex items-center gap-1"><Eye size={14}/> {ad.view_count || 0}</span>
                   </li>
                </ul>
             </div>

             {ad.category.includes('konut') && <LoanCalculator price={ad.price} />}
          </div>

        </div>
      </div>
      <MobileAdActionBar price={\`\${formattedPrice} \${ad.currency}\`} phone={sellerInfo.show_phone ? sellerInfo.phone : undefined} />
    </div>
  );
}
`,
  },
];

files.forEach((file) => {
  try {
    const dir = path.dirname(file.path);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(process.cwd(), file.path), file.content.trim());
    console.log(
      colors.green + "✔ " + file.path + " güncellendi." + colors.reset,
    );
  } catch (error) {
    console.error(
      colors.bold + "✘ Hata: " + file.path + " yazılamadı." + colors.reset,
    );
  }
});

console.log(
  colors.blue +
    colors.bold +
    "\n✅ İŞLEM TAMAMLANDI! SQL KODUNU ÇALIŞTIRMAYI UNUTMAYIN." +
    colors.reset,
);
