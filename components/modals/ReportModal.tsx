"use client";
import React, { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { useModal } from '@/context/ModalContext';
import { useToast } from '@/context/ToastContext';

export default function ReportModal() {
  const { closeModal, modalProps } = useModal();
  const { addToast } = useToast();
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      addToast('Lütfen bir neden seçiniz.', 'error');
      return;
    }
    // API Call simülasyonu
    addToast('Şikayetiniz tarafımıza ulaşmıştır. Teşekkürler.', 'success');
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal}></div>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-200">

        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            <AlertTriangle size={18} className="text-red-500" /> İlanı Şikayet Et
          </h3>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <p className="text-sm text-gray-600 mb-4">
            <strong>İlan No:</strong> {modalProps.id} <br/>
            Lütfen şikayet nedeninizi belirtiniz:
          </p>

          <div className="space-y-3 mb-6">
            {['Yanlış Kategori', 'Yanlış Fiyat / Bilgi', 'Uygunsuz İçerik / Görsel', 'Dolandırıcılık Şüphesi', 'Satılmış Ürün'].map((r) => (
              <label key={r} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="reason"
                  value={r}
                  checked={reason === r}
                  onChange={(e) => setReason(e.target.value)}
                  className="accent-red-600"
                />
                {r}
              </label>
            ))}
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 border border-gray-300 rounded text-sm font-bold text-gray-600 hover:bg-gray-50"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 rounded text-sm font-bold text-white hover:bg-red-700"
            >
              Şikayet Et
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}