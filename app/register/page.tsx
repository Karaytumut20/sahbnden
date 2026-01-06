"use client";
import React, { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [type, setType] = useState('bireysel');

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 bg-[#f6f7f9] dark:bg-transparent">
      <div className="bg-white border border-gray-200 shadow-sm rounded-sm w-full max-w-[500px] overflow-hidden dark:bg-[#1c1c1c] dark:border-gray-700">

        {/* Üyelik Tipi Seçimi */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setType('bireysel')}
            className={`flex-1 py-4 text-sm font-bold text-center transition-colors ${type === 'bireysel' ? 'bg-white text-blue-700 border-t-2 border-t-blue-700 dark:bg-[#1c1c1c] dark:text-blue-400 dark:border-t-blue-400' : 'bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}
          >
            Bireysel Üyelik
          </button>
          <button
            onClick={() => setType('kurumsal')}
            className={`flex-1 py-4 text-sm font-bold text-center transition-colors ${type === 'kurumsal' ? 'bg-white text-blue-700 border-t-2 border-t-blue-700 dark:bg-[#1c1c1c] dark:text-blue-400 dark:border-t-blue-400' : 'bg-gray-50 text-gray-500 dark:bg-gray-800 dark:text-gray-400'}`}
          >
            Kurumsal Üyelik
          </button>
        </div>

        <div className="p-8">
          <h2 className="text-xl font-bold text-[#333] mb-2 text-center dark:text-white">
            {type === 'bireysel' ? 'Bireysel Hesap Oluştur' : 'Kurumsal Mağaza Başvurusu'}
          </h2>
          <p className="text-gray-500 text-[12px] text-center mb-6 dark:text-gray-400">
            Hemen üye ol, ilanlarını yayınlamaya başla!
          </p>

          <form className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1 dark:text-gray-300">Ad</label>
                <input type="text" className="w-full border border-gray-300 rounded-sm h-[38px] px-3 focus:border-blue-500 outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1 dark:text-gray-300">Soyad</label>
                <input type="text" className="w-full border border-gray-300 rounded-sm h-[38px] px-3 focus:border-blue-500 outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1 dark:text-gray-300">E-posta Adresi</label>
              <input type="email" className="w-full border border-gray-300 rounded-sm h-[38px] px-3 focus:border-blue-500 outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
            </div>

            {type === 'kurumsal' && (
              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1 dark:text-gray-300">Vergi Numarası / T.C. Kimlik No</label>
                <input type="text" className="w-full border border-gray-300 rounded-sm h-[38px] px-3 focus:border-blue-500 outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
              </div>
            )}

            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1 dark:text-gray-300">Şifre</label>
              <input type="password" className="w-full border border-gray-300 rounded-sm h-[38px] px-3 focus:border-blue-500 outline-none dark:bg-gray-800 dark:border-gray-600 dark:text-white" />
            </div>

            <div className="flex items-start gap-2 pt-2">
              <input type="checkbox" className="mt-1 border-gray-300 rounded-sm" />
              <p className="text-[11px] text-gray-600 leading-snug dark:text-gray-400">
                <a href="#" className="text-blue-700 hover:underline dark:text-blue-400">Üyelik Sözleşmesi</a>'ni ve <a href="#" className="text-blue-700 hover:underline dark:text-blue-400">KVKK Aydınlatma Metni</a>'ni okudum, kabul ediyorum.
              </p>
            </div>

            <button className="w-full bg-blue-700 text-white font-bold h-[44px] rounded-sm hover:bg-blue-800 transition-colors shadow-sm mt-4 text-sm dark:bg-blue-600 dark:hover:bg-blue-700">
              Hesap Oluştur
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-[12px] text-gray-500 dark:text-gray-400">Zaten üye misin? </span>
            <Link href="/login" className="text-blue-700 font-bold text-[12px] hover:underline dark:text-blue-400">Giriş Yap</Link>
          </div>
        </div>
      </div>
    </div>
  );
}