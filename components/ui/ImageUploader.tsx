"use client";
import React, { useRef, useState } from 'react';
import { Upload, X, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { uploadImageClient } from '@/lib/services';
import { useToast } from '@/context/ToastContext';

type ImageUploaderProps = {
  onImagesChange: (urls: string[]) => void;
  initialImages?: string[];
};

type UploadItem = {
  id: string;
  url: string;        // Local preview veya Remote URL
  file?: File;        // Yükleniyorsa dosya objesi
  status: 'pending' | 'uploading' | 'success' | 'error';
  remoteUrl?: string; // Başarılı yükleme sonrası gelen URL
};

export default function ImageUploader({ onImagesChange, initialImages = [] }: ImageUploaderProps) {
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Başlangıç resimleri
  const [items, setItems] = useState<UploadItem[]>(
    initialImages.map((url, i) => ({
      id: `init-${i}`,
      url: url,
      status: 'success',
      remoteUrl: url
    }))
  );

  const [isGlobalUploading, setIsGlobalUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const files = Array.from(e.target.files);

    // 1. Önce "Yükleniyor" durumunda listeye ekle (ANLIK ÖNİZLEME İÇİN)
    const newItems: UploadItem[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file), // Local blob URL ile hemen göster
      file: file,
      status: 'uploading'
    }));

    setItems(prev => [...prev, ...newItems]);
    setIsGlobalUploading(true);

    // 2. Arka planda tek tek yükle
    for (const item of newItems) {
      if (!item.file) continue;

      try {
        const publicUrl = await uploadImageClient(item.file);

        // Başarılı olursa remoteUrl'i güncelle
        setItems(prev => prev.map(i =>
          i.id === item.id ? { ...i, status: 'success', remoteUrl: publicUrl } : i
        ));
      } catch (error) {
        console.error("Yükleme hatası:", error);
        // Hatalı olursa durumu güncelle
        setItems(prev => prev.map(i =>
          i.id === item.id ? { ...i, status: 'error' } : i
        ));
        addToast(`${item.file.name} yüklenemedi.`, 'error');
      }
    }

    setIsGlobalUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Üst bileşene sadece başarılı URL'leri gönder
  React.useEffect(() => {
    const successUrls = items
      .filter(i => i.status === 'success' && i.remoteUrl)
      .map(i => i.remoteUrl as string);

    onImagesChange(successUrls);
  }, [items, onImagesChange]);

  const removeImage = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">

        {/* Yükleme Butonu */}
        <div
          onClick={() => !isGlobalUploading && fileInputRef.current?.click()}
          className={`w-28 h-28 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer transition-colors hover:bg-blue-50 hover:border-blue-400 ${isGlobalUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isGlobalUploading ? (
            <Loader2 size={24} className="animate-spin text-blue-600" />
          ) : (
            <>
              <Upload size={24} className="text-gray-400 mb-2" />
              <span className="text-xs text-gray-500 font-bold">Fotoğraf Ekle</span>
            </>
          )}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            multiple
            accept="image/*"
            disabled={isGlobalUploading}
          />
        </div>

        {/* Resim Listesi */}
        {items.map((item, idx) => (
          <div key={item.id} className="relative w-28 h-28 bg-gray-100 rounded-md border border-gray-200 overflow-hidden group">
            <img src={item.url} alt="preview" className="w-full h-full object-cover" />

            {/* Durum İkonları */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {item.status === 'uploading' && (
                <div className="bg-white/80 p-2 rounded-full shadow"><Loader2 size={20} className="animate-spin text-blue-600" /></div>
              )}
              {item.status === 'error' && (
                <div className="bg-red-100 p-2 rounded-full shadow text-red-600"><AlertCircle size={20} /></div>
              )}
            </div>

            {/* Vitrin Etiketi (İlk başarılı resim) */}
            {idx === 0 && item.status === 'success' && (
              <div className="absolute top-0 left-0 bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-br-sm z-10">
                VİTRİN
              </div>
            )}

            {/* Sil Butonu */}
            <button
              onClick={() => removeImage(item.id)}
              className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 z-20 cursor-pointer"
              title="Kaldır"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <p className="text-xs text-gray-400">Henüz fotoğraf yüklenmedi. (İsteğe bağlı)</p>
      )}
    </div>
  );
}