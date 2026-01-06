
"use client";
import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="container max-w-[1000px] mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold text-[#333] mb-6">Bize Ulaşın</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* İletişim Bilgileri */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 p-6 rounded-sm shadow-sm">
            <h2 className="font-bold text-lg mb-4 text-blue-900">Merkez Ofis</h2>
            <div className="space-y-4 text-sm text-gray-600">
              <div className="flex items-start gap-3">
                <MapPin className="text-blue-600 shrink-0" />
                <p>Değirmen Sokak No:18, Nida Kule, Kat:4<br/>Kozyatağı / İstanbul</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-blue-600 shrink-0" />
                <p>0 850 222 44 44</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-blue-600 shrink-0" />
                <p>destek@sahibinden-klon.com</p>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="text-blue-600 shrink-0" />
                <p>Pzt - Cum: 09:00 - 18:00</p>
              </div>
            </div>
          </div>

          {/* Temsili Harita */}
          <div className="bg-gray-200 h-[250px] w-full rounded-sm border border-gray-300 flex items-center justify-center relative overflow-hidden group">
             <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/Istanbul_map.png')] bg-cover opacity-60"></div>
             <div className="bg-white/90 px-4 py-2 rounded shadow text-xs font-bold relative z-10">
               Harita Yükleniyor...
             </div>
          </div>
        </div>

        {/* İletişim Formu */}
        <div className="bg-white border border-gray-200 p-6 rounded-sm shadow-sm">
          <h2 className="font-bold text-lg mb-4 text-[#333]">İletişim Formu</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Adınız</label>
                <input type="text" className="w-full border border-gray-300 rounded-sm h-[38px] px-3 focus:border-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Soyadınız</label>
                <input type="text" className="w-full border border-gray-300 rounded-sm h-[38px] px-3 focus:border-blue-500 outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">E-posta</label>
              <input type="email" className="w-full border border-gray-300 rounded-sm h-[38px] px-3 focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Konu</label>
              <select className="w-full border border-gray-300 rounded-sm h-[38px] px-3 bg-white focus:border-blue-500 outline-none">
                <option>Genel Soru</option>
                <option>İlan İşlemleri</option>
                <option>Şikayet / Öneri</option>
                <option>Reklam</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-600 mb-1">Mesajınız</label>
              <textarea className="w-full border border-gray-300 rounded-sm h-32 p-3 focus:border-blue-500 outline-none resize-none"></textarea>
            </div>
            <button className="w-full bg-blue-700 text-white font-bold py-3 rounded-sm hover:bg-blue-800 transition-colors shadow-sm">
              Gönder
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
