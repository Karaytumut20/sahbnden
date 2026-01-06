
"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Shield } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Admin girişi simülasyonu
    setTimeout(() => {
      router.push('/admin');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden">
        <div className="bg-[#2d405a] p-6 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Shield size={32} className="text-[#ffe800]" />
          </div>
          <h1 className="text-white text-xl font-bold">Yönetim Paneli Girişi</h1>
          <p className="text-blue-200 text-sm mt-1">Lütfen yetkili hesap bilgilerinizi giriniz.</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Kullanıcı Adı</label>
              <input type="text" defaultValue="admin" className="w-full border border-gray-300 rounded h-10 px-3 focus:border-blue-900 focus:outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Şifre</label>
              <input type="password" defaultValue="admin123" className="w-full border border-gray-300 rounded h-10 px-3 focus:border-blue-900 focus:outline-none" />
            </div>

            <button
              disabled={loading}
              className="w-full bg-[#2d405a] hover:bg-[#1f2d40] text-white font-bold h-11 rounded transition-colors flex items-center justify-center gap-2 mt-4"
            >
              {loading ? 'Giriş Yapılıyor...' : <><Lock size={16} /> Güvenli Giriş</>}
            </button>
          </form>
        </div>
        <div className="bg-gray-50 p-4 text-center text-xs text-gray-500 border-t border-gray-100">
          Bu alan sadece yetkili personel içindir.
        </div>
      </div>
    </div>
  );
}
