import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-gray-200 bg-white text-[11px] text-gray-600">
      <div className="container mx-auto px-4 max-w-[1150px] py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold text-[#333] mb-3 text-[12px]">Kurumsal</h4>
            <ul className="space-y-2">
              <li><Link href="/kurumsal/hakkimizda" className="hover:underline hover:text-blue-700">Hakkımızda</Link></li>
              <li><Link href="#" className="hover:underline hover:text-blue-700">İnsan Kaynakları</Link></li>
              <li><Link href="#" className="hover:underline hover:text-blue-700">Haberler</Link></li>
              <li><Link href="/iletisim" className="hover:underline hover:text-blue-700">İletişim</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#333] mb-3 text-[12px]">Hizmetlerimiz</h4>
            <ul className="space-y-2">
              <li><Link href="/ilan-ver/doping" className="hover:underline hover:text-blue-700">Doping</Link></li>
              <li><Link href="#" className="hover:underline hover:text-blue-700">Güvenli Ödeme</Link></li>
              <li><Link href="#" className="hover:underline hover:text-blue-700">Reklam Verin</Link></li>
              <li><Link href="#" className="hover:underline hover:text-blue-700">Mobil Uygulamalar</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#333] mb-3 text-[12px]">Gizlilik ve Kullanım</h4>
            <ul className="space-y-2">
              <li><Link href="/kurumsal/guvenli-alisveris" className="hover:underline hover:text-blue-700">Güvenli Alışveriş İpuçları</Link></li>
              <li><Link href="/kurumsal/kullanim-kosullari" className="hover:underline hover:text-blue-700">Kullanım Koşulları</Link></li>
              <li><Link href="/kurumsal/gizlilik-politikasi" className="hover:underline hover:text-blue-700">Gizlilik Politikası</Link></li>
              <li><Link href="/yardim" className="hover:underline hover:text-blue-700">Yardım ve İşlem Rehberi</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[#333] mb-3 text-[12px]">Bizi Takip Edin</h4>
            <div className="flex gap-3 mb-4">
              <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-500">FB</div>
              <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-500">TW</div>
              <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-500">IN</div>
              <div className="w-8 h-8 bg-gray-200 rounded flex items-center justify-center text-xs font-bold text-gray-500">YT</div>
            </div>
            <p>7/24 Destek: <span className="font-bold text-[#333]">0 850 222 44 44</span></p>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 bg-[#f6f7f9] py-6 text-center">
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