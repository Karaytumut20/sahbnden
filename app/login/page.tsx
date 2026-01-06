"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('kullanici@ornek.com');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email);
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] bg-[#f6f7f9] dark:bg-transparent">
      <div className="bg-white border border-gray-200 shadow-sm p-8 rounded-sm w-full max-w-[400px] dark:bg-[#1c1c1c] dark:border-gray-700 transition-colors">
        <h2 className="text-[#333] font-bold text-lg mb-6 text-center dark:text-white">Üye Girişi</h2>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[12px] font-bold text-[#333] mb-1 dark:text-gray-300">E-posta Adresi</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-sm h-[34px] px-3 focus:border-blue-500 focus:outline-none transition-colors dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[#333] mb-1 dark:text-gray-300">Şifre</label>
            <input
              type="password"
              defaultValue="123456"
              className="w-full border border-gray-300 rounded-sm h-[34px] px-3 focus:border-blue-500 focus:outline-none transition-colors dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>

          <button type="submit" className="w-full bg-blue-700 text-white font-bold h-[40px] rounded-sm hover:bg-blue-800 transition-colors shadow-sm mt-2 dark:bg-blue-600 dark:hover:bg-blue-700">
            Giriş Yap
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center dark:border-gray-700">
          <p className="text-[12px] text-gray-600 mb-2 dark:text-gray-400">Henüz hesabın yok mu?</p>
          <Link href="/register" className="inline-block border border-yellow-500 text-[#333] font-bold py-2 px-6 rounded-sm bg-yellow-50 hover:bg-yellow-100 transition-colors text-[13px] dark:bg-yellow-500/10 dark:text-yellow-500 dark:hover:bg-yellow-500/20">
            Üye Ol
          </Link>
        </div>
      </div>
    </div>
  );
}