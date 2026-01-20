
"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';

export default function LoginPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      addToast(error.message, 'error');
    } else {
      addToast('Giriş başarılı!', 'success');
      router.push('/');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="bg-white border border-gray-200 shadow-sm p-8 rounded-sm w-full max-w-[400px]">
        <h2 className="text-[#333] font-bold text-lg mb-6 text-center">Üye Girişi</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[12px] font-bold text-[#333] mb-1">E-posta Adresi</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border border-gray-300 rounded-sm h-[34px] px-3 outline-none focus:border-blue-600" />
          </div>
          <div>
            <label className="block text-[12px] font-bold text-[#333] mb-1">Şifre</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border border-gray-300 rounded-sm h-[34px] px-3 outline-none focus:border-blue-600" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-blue-700 text-white font-bold h-[40px] rounded-sm hover:bg-blue-800 disabled:opacity-50">
            {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
          </button>
        </form>
        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-[12px] text-gray-600 mb-2">Henüz hesabın yok mu?</p>
          <Link href="/register" className="inline-block border border-yellow-500 text-[#333] font-bold py-2 px-6 rounded-sm bg-yellow-50 hover:bg-yellow-100 text-[13px]">
            Üye Ol
          </Link>
        </div>
      </div>
    </div>
  );
}
