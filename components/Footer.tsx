import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-gray-200 bg-white text-[11px] text-gray-600 dark:bg-[#1a202c] dark:border-gray-700 dark:text-gray-400 transition-colors duration-300">
      <div className="container mx-auto px-4 max-w-[1150px] py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold text-[#333] mb-3 text-[12px] dark:text-gray-200">Kurumsal</h4>
            <ul className="space-y-2">
              <li><Link href="/kurumsal/hakkimizda" className="hover:underline hover:text-blue-700 dark:hover:text-blue-400">Hakkımızda</Link></li>
              <li><Link href="#" className="hover:underline hover:text-blue-700 dark:hover:text-blue-400">İnsan Kaynakları</Link></li>
              <li><Link href="#" className="hover:underline hover:text-blue-700 dark:hover:text-blue-400">Haberler</Link></li>
              <li><Link href="/iletisim" className="hover:underline hover:text-blue-700 dark:hover:text-blue-400">İletişim</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#333] mb-3 text-[12px] dark:text-gray-200">Hizmetlerimiz</h4>
            <ul className="space-y-2">
              <li><Link href="/ilan-ver/doping" className="hover:underline hover:text-blue-700 dark:hover:text-blue-400">Doping</Link></li>
              <li><Link href="#" className="hover:underline hover:text-blue-700 dark:hover:text-blue-400">Güvenli Ödeme</Link></li>
              <li><Link href="#" className="hover:underline hover:text-blue-700 dark:hover:text-blue-400">Reklam Verin</Link></li>
              <li><Link href="#" className="hover:underline hover:text-blue-700 dark:hover:text-blue-400">Mobil Uygulamalar</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#333] mb-3 text-[12px] dark:text-gray-200">Gizlilik ve Kullanım</h4>
            <ul className="space-y-2">
              <li><Link href="/kurumsal/guvenli-alisveris" className="hover:underline hover:text-blue-700 dark:hover:text-blue-400">Güvenli Alışveriş İpuçları</Link></li>
              <li><Link href="/kurumsal/kullanim-kosullari" className="hover:underline hover:text-blue-700 dark:hover:text-blue-400">Kullanım Koşulları</Link></li>
              <li><Link href="/kurumsal/gizlilik-politikasi" className="hover:underline hover:text-blue-700 dark:hover:text-blue-400">Gizlilik Politikası</Link></li>
              <li><Link href="/yardim" className="hover:underline hover:text-blue-700 dark:hover:text-blue-400">Yardım ve İşlem Rehberi</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#333] mb-3 text-[12px] dark:text-gray-200">Bizi Takip Edin</h4>
            <div className="flex gap-3 mb-4">
              <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-500 dark:bg-gray-700 dark:text-gray-300">FB</div>
              <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-500 dark:bg-gray-700 dark:text-gray-300">TW</div>
              <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-500 dark:bg-gray-700 dark:text-gray-300">IN</div>
              <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-500 dark:bg-gray-700 dark:text-gray-300">YT</div>
            </div>
            <p>7/24 Destek: <span className="font-bold text-[#333] dark:text-white">0 850 222 44 44</span></p>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 bg-[#f6f7f9] py-6 text-center dark:bg-[#111827] dark:border-gray-700 transition-colors">
        <div className="container mx-auto px-4 max-w-[1150px]">
          <p className="mb-2">
            Copyright © 2000-2026 sahibinden.com İstanbul Ticaret Odası'na kayıtlıdır.
          </p>
          <p className="text-[10px] text-gray-400">
            Klon proje eğitim amaçlıdır. Gerçek veriler içermez.
          </p>
        </div>
      </div>
    </footer>
  );
}