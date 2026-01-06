
import React from 'react';

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-gray-200 bg-gray-50 text-center py-8 text-[11px] text-gray-500">
      <div className="container mx-auto px-4 max-w-[1150px]">
        <p className="mb-2">
          Copyright © 2000-2026 sahibinden.com İstanbul Ticaret Odası'na kayıtlıdır.
        </p>
        <div className="flex justify-center gap-4">
          <a href="#" className="hover:underline">Hakkımızda</a>
          <a href="#" className="hover:underline">Yardım</a>
          <a href="#" className="hover:underline">Reklam Verin</a>
        </div>
      </div>
    </footer>
  );
}
