
"use client";
import React from 'react';

export default function PostAdDetail() {
  return (
    <div className="max-w-[800px] mx-auto py-8">
      <h1 className="text-xl font-bold text-[#333] mb-6 border-b pb-2">Adım 2: İlan Detayları</h1>

      <div className="bg-white border border-gray-200 shadow-sm p-6 rounded-sm">
        <form className="space-y-6">

          {/* Başlık */}
          <div>
            <label className="block text-[13px] font-bold text-[#333] mb-1">İlan Başlığı</label>
            <input type="text" className="w-full border border-gray-300 rounded-sm h-10 px-3 focus:border-blue-500 focus:outline-none" placeholder="Örn: Sahibinden temiz, masrafsız daire" />
            <p className="text-[11px] text-gray-500 mt-1">İlanınızın içeriğini en iyi anlatan başlığı giriniz.</p>
          </div>

          {/* Fiyat */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-bold text-[#333] mb-1">Fiyat</label>
              <input type="number" className="w-full border border-gray-300 rounded-sm h-10 px-3 focus:border-blue-500 focus:outline-none" placeholder="0" />
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#333] mb-1">Para Birimi</label>
              <select className="w-full border border-gray-300 rounded-sm h-10 px-3 bg-white">
                <option>TL</option>
                <option>USD</option>
                <option>EUR</option>
              </select>
            </div>
          </div>

          {/* Açıklama */}
          <div>
            <label className="block text-[13px] font-bold text-[#333] mb-1">Açıklama</label>
            <textarea className="w-full border border-gray-300 rounded-sm h-32 p-3 focus:border-blue-500 focus:outline-none resize-none" placeholder="İlanınızla ilgili detaylı bilgileri buraya yazınız..."></textarea>
          </div>

          {/* İletişim */}
          <div className="bg-gray-50 p-4 border border-gray-200 rounded-sm">
            <h3 className="font-bold text-[#333] text-sm mb-2">İletişim Bilgileri</h3>
            <div className="flex items-center gap-2">
               <input type="checkbox" checked readOnly className="rounded-sm" />
               <span className="text-[13px]">Cep telefonum ilan detayında görünsün.</span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 flex justify-end">
            <button type="button" className="bg-[#ffe800] hover:bg-yellow-400 text-black font-bold py-3 px-8 rounded-sm transition-colors text-sm shadow-sm">
              İlanı Önizle ve Yayınla
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
