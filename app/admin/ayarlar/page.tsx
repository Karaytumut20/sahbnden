"use client";
import React from 'react';
import { Save, Globe, Lock, Bell, Mail } from 'lucide-react';

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Site Ayarları</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200">
            <button className="px-6 py-3 text-sm font-bold text-blue-600 border-b-2 border-blue-600 bg-blue-50">Genel</button>
            <button className="px-6 py-3 text-sm font-bold text-gray-500 hover:bg-gray-50">Güvenlik</button>
            <button className="px-6 py-3 text-sm font-bold text-gray-500 hover:bg-gray-50">E-posta & Bildirim</button>
        </div>

        <div className="p-8 max-w-2xl">
            <form className="space-y-6">

                <div className="space-y-4">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2 border-b pb-2 mb-4">
                        <Globe size={18} className="text-gray-500"/> Site Bilgileri
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Site Başlığı</label>
                            <input type="text" defaultValue="sahibinden.com Klon" className="w-full border border-gray-300 rounded-md h-10 px-3 text-sm focus:outline-none focus:border-blue-500"/>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-600 mb-1">Site URL</label>
                            <input type="text" defaultValue="https://sahibinden-klon.com" className="w-full border border-gray-300 rounded-md h-10 px-3 text-sm focus:outline-none focus:border-blue-500"/>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-600 mb-1">Açıklama (Meta Description)</label>
                        <textarea className="w-full border border-gray-300 rounded-md h-24 p-3 text-sm focus:outline-none focus:border-blue-500 resize-none" defaultValue="Türkiye'nin en büyük ilan platformu. Emlak, Vasıta, Alışveriş..."></textarea>
                    </div>
                </div>

                <div className="space-y-4 pt-4">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2 border-b pb-2 mb-4">
                        <Lock size={18} className="text-gray-500"/> Üyelik & İlan
                    </h3>
                    <div className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-600"/>
                        <span className="text-sm text-gray-700">Yeni üyelik alımı açık olsun</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <input type="checkbox" defaultChecked className="w-4 h-4 accent-blue-600"/>
                        <span className="text-sm text-gray-700">İlanlar editör onayı olmadan yayınlanmasın</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 accent-blue-600"/>
                        <span className="text-sm text-gray-700">Bakım modu (Sadece adminler erişebilir)</span>
                    </div>
                </div>

                <div className="pt-6">
                    <button className="bg-blue-600 text-white px-8 py-3 rounded-md font-bold text-sm hover:bg-blue-700 flex items-center gap-2 shadow-sm">
                        <Save size={18}/> Ayarları Kaydet
                    </button>
                </div>

            </form>
        </div>
      </div>
    </div>
  );
}