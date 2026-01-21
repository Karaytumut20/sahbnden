"use client";
import React from 'react';
import { X, Copy, Facebook, Twitter, Linkedin, Mail } from 'lucide-react';
import { useModal } from '@/context/ModalContext';
import { useToast } from '@/context/ToastContext';

export default function ShareModal() {
  const { closeModal, modalProps } = useModal();
  const { addToast } = useToast();
  const { title, url } = modalProps;

  const handleCopy = () => {
    navigator.clipboard.writeText(url || window.location.href);
    addToast('Bağlantı kopyalandı!', 'success');
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeModal}></div>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-sm relative z-10 animate-in fade-in zoom-in-95 duration-200">

        <div className="flex justify-between items-center p-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-800">İlanı Paylaş</h3>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">{title}</p>

          <div className="grid grid-cols-4 gap-4 mb-6">
            <button className="flex flex-col items-center gap-2 text-xs text-gray-600 hover:text-blue-600">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                <Facebook size={20} />
              </div>
              Facebook
            </button>
            <button className="flex flex-col items-center gap-2 text-xs text-gray-600 hover:text-blue-400">
              <div className="w-10 h-10 bg-sky-100 text-sky-500 rounded-full flex items-center justify-center">
                <Twitter size={20} />
              </div>
              Twitter
            </button>
            <button className="flex flex-col items-center gap-2 text-xs text-gray-600 hover:text-blue-700">
              <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                <Linkedin size={20} />
              </div>
              LinkedIn
            </button>
            <button className="flex flex-col items-center gap-2 text-xs text-gray-600 hover:text-red-600">
              <div className="w-10 h-10 bg-red-100 text-red-500 rounded-full flex items-center justify-center">
                <Mail size={20} />
              </div>
              E-posta
            </button>
          </div>

          <div className="flex items-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-500">
            <span className="truncate flex-1">{url || 'https://sahibinden-klon.com/ilan/123'}</span>
            <button onClick={handleCopy} className="text-blue-600 hover:text-blue-800 font-bold p-1">
              <Copy size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}