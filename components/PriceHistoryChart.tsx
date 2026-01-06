
"use client";
import React from 'react';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';

export default function PriceHistoryChart({ currentPrice }: { currentPrice: string }) {
  // Demo Verisi: Son 6 ayın fiyatları
  // Gerçekte bu veri API'den gelir
  const history = [
    { date: 'Ağu', price: 2400000 },
    { date: 'Eyl', price: 2400000 },
    { date: 'Eki', price: 2350000 },
    { date: 'Kas', price: 2350000 },
    { date: 'Ara', price: 2200000 },
    { date: 'Oca', price: parseInt(currentPrice.replace(/\./g, '')) || 2200000 },
  ];

  const maxPrice = Math.max(...history.map(h => h.price)) * 1.05;
  const minPrice = Math.min(...history.map(h => h.price)) * 0.95;
  const range = maxPrice - minPrice;

  // Trend Hesabı
  const firstPrice = history[0].price;
  const lastPrice = history[history.length - 1].price;
  const trend = lastPrice < firstPrice ? 'down' : lastPrice > firstPrice ? 'up' : 'stable';

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6 mb-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-[#333] text-md">Fiyat Geçmişi</h3>
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded ${trend === 'down' ? 'bg-green-100 text-green-700' : trend === 'up' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>
          {trend === 'down' && <><TrendingDown size={14} /> Fiyat Düştü</>}
          {trend === 'up' && <><TrendingUp size={14} /> Fiyat Arttı</>}
          {trend === 'stable' && <><Minus size={14} /> Fiyat Sabit</>}
        </div>
      </div>

      <div className="h-[150px] flex items-end gap-2 relative border-b border-gray-200 pb-2">
        {/* Arka Plan Çizgileri */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
           <div className="border-t border-gray-100 w-full h-0"></div>
           <div className="border-t border-gray-100 w-full h-0"></div>
           <div className="border-t border-gray-100 w-full h-0"></div>
        </div>

        {history.map((point, i) => {
          // Basit Yükseklik Hesabı
          const heightPercent = ((point.price - minPrice) / range) * 80 + 10; // %10 ile %90 arası

          return (
            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group relative cursor-pointer">

              {/* Tooltip */}
              <div className="absolute -top-10 bg-black/80 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                {point.price.toLocaleString('tr-TR')} TL
              </div>

              {/* Bar */}
              <div
                className={`w-full max-w-[30px] rounded-t-sm transition-all duration-500 relative ${i === history.length - 1 ? 'bg-blue-600' : 'bg-blue-200 group-hover:bg-blue-400'}`}
                style={{ height: `${heightPercent}%` }}
              >
                {/* Nokta (Sadece sonuncuda) */}
                {i === history.length - 1 && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-2 border-blue-600 rounded-full"></div>
                )}
              </div>

              {/* Tarih */}
              <span className="text-[10px] text-gray-500 mt-2 font-medium">{point.date}</span>
            </div>
          );
        })}
      </div>

      <p className="text-[10px] text-gray-400 mt-3 text-center">
        * Son 6 aydaki fiyat değişim grafiğidir. Veriler sahibinden.com klon altyapısından alınmıştır.
      </p>
    </div>
  );
}
