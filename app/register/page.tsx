"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/context/ToastContext';
import { Loader2 } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { addToast } = useToast();
  const [form, setForm] = useState({ name: '', surname: '', email: '', phone: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Telefon numarası formatlama (Basitçe boşlukları sil)
    const cleanPhone = form.phone.replace(/\s/g, '');

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: `${form.name} ${form.surname}`,
          phone: cleanPhone, // Meta data olarak gönderiyoruz (Trigger ile profiles'a yazılmalı)
          // Not: Eğer Supabase trigger'ınız meta_data'dan phone'u alıp profiles tablosuna yazmıyorsa,
          // manuel insert gerekebilir. Ancak standart trigger'lar genelde bunu halleder.
        },
      },
    });

    if (error) {
      addToast(error.message, 'error');
    } else {
      // Eğer trigger phone'u yazmıyorsa manuel update (Garanti Yöntem)
      if (data.user) {
          await supabase.from('profiles').update({
              phone: cleanPhone,
              show_phone: false // Varsayılan olarak gizli
          }).eq('id', data.user.id);
      }

      addToast('Kayıt başarılı! Giriş yapabilirsiniz.', 'success');
      router.push('/login');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 bg-[#f6f7f9] px-4">
      <div className="bg-white border border-gray-200 shadow-sm rounded-sm w-full max-w-[500px] overflow-hidden">
        <div className="p-8">
          <h2 className="text-xl font-bold text-[#333] mb-2 text-center">Bireysel Hesap Oluştur</h2>
          <form onSubmit={handleRegister} className="space-y-4 mt-6">

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">Ad</label>
                <input type="text" onChange={e => setForm({...form, name: e.target.value})} className="w-full border border-gray-300 rounded-sm h-[38px] px-3 focus:border-blue-500 outline-none text-sm" required />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#333] mb-1">Soyad</label>
                <input type="text" onChange={e => setForm({...form, surname: e.target.value})} className="w-full border border-gray-300 rounded-sm h-[38px] px-3 focus:border-blue-500 outline-none text-sm" required />
              </div>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">Cep Telefonu</label>
              <input
                type="tel"
                placeholder="05XX XXX XX XX"
                onChange={e => setForm({...form, phone: e.target.value})}
                className="w-full border border-gray-300 rounded-sm h-[38px] px-3 focus:border-blue-500 outline-none text-sm"
                required
              />
              <p className="text-[10px] text-gray-500 mt-1">* İlanlarınızda alıcılarla iletişim için gereklidir.</p>
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">E-posta</label>
              <input type="email" onChange={e => setForm({...form, email: e.target.value})} className="w-full border border-gray-300 rounded-sm h-[38px] px-3 focus:border-blue-500 outline-none text-sm" required />
            </div>

            <div>
              <label className="block text-[12px] font-bold text-[#333] mb-1">Şifre</label>
              <input type="password" onChange={e => setForm({...form, password: e.target.value})} className="w-full border border-gray-300 rounded-sm h-[38px] px-3 focus:border-blue-500 outline-none text-sm" required />
            </div>

            <button disabled={loading} className="w-full bg-blue-700 text-white font-bold h-[44px] rounded-sm hover:bg-blue-800 transition-colors shadow-sm mt-4 text-sm disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'Hesap Oluştur'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <span className="text-[12px] text-gray-500">Zaten üye misin? </span>
            <Link href="/login" className="text-blue-700 font-bold text-[12px] hover:underline">Giriş Yap</Link>
          </div>
        </div>
      </div>
    </div>
  );
}