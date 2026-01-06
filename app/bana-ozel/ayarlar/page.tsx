
"use client";
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function SettingsPage() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({ name, email });
    alert('Bilgileriniz güncellendi!');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6 max-w-[600px]">
      <h2 className="text-xl font-bold text-[#333] mb-6 border-b border-gray-100 pb-2">Üyelik Bilgilerim</h2>

      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-[12px] font-bold text-[#333] mb-1">Ad Soyad</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-sm h-[34px] px-3 focus:border-blue-500 focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-[12px] font-bold text-[#333] mb-1">E-posta</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-sm h-[34px] px-3 focus:border-blue-500 focus:outline-none bg-gray-50"
          />
        </div>

        <div className="pt-4 border-t border-gray-100 mt-4">
          <h3 className="text-sm font-bold text-[#333] mb-3">Şifre Değiştir</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">Yeni Şifre</label>
              <input type="password" className="w-full border border-gray-300 rounded-sm h-[34px] px-3 focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">Yeni Şifre (Tekrar)</label>
              <input type="password" className="w-full border border-gray-300 rounded-sm h-[34px] px-3 focus:border-blue-500 focus:outline-none" />
            </div>
          </div>
        </div>

        <button type="submit" className="bg-blue-700 text-white font-bold py-2 px-6 rounded-sm hover:bg-blue-800 text-[13px] mt-4">
          Kaydet ve Güncelle
        </button>
      </form>
    </div>
  );
}
