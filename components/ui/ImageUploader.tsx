"use client";
import React, { useRef, useState } from 'react';
import { Upload, X, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { uploadImageClient } from '@/lib/services';
import { useToast } from '@/context/ToastContext';

// Basit Canvas Tabanlı Resim Sıkıştırma
const compressImage = async (file: File): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const maxWidth = 1200; // Maksimum genişlik
      const scaleSize = maxWidth / img.width;

      canvas.width = maxWidth;
      canvas.height = img.height * scaleSize;

      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          resolve(compressedFile);
        } else {
          reject(new Error('Compression failed'));
        }
      }, 'image/jpeg', 0.7); // %70 kalite
    };
    img.onerror = (err) => reject(err);
  });
};

type ImageUploaderProps = {
  onImagesChange: (urls: string[]) => void;
  initialImages?: string[];
};

type UploadItem = {
  id: string;
  url: string;
  file?: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  remoteUrl?: string;
};

export default function ImageUploader({ onImagesChange, initialImages = [] }: ImageUploaderProps) {
  const { addToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    // Önizleme Ekle
    const newItems: UploadItem[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      file: file,
      status: 'uploading'
    }));

    setItems(prev => [...prev, ...newItems]);
    setIsGlobalUploading(true);

    // Yükleme İşlemi (Sıkıştırmalı)
    for (const item of newItems) {
      if (!item.file) continue;

      try {
        // Sıkıştır
        const compressedFile = await compressImage(item.file);

        // Yükle
        const publicUrl = await uploadImageClient(compressedFile);

        setItems(prev => prev.map(i =>
          i.id === item.id ? { ...i, status: 'success', remoteUrl: publicUrl } : i
        ));
      } catch (error) {
        console.error("Yükleme hatası:", error);
        setItems(prev => prev.map(i =>
          i.id === item.id ? { ...i, status: 'error' } : i
        ));
        addToast(`${item.file.name} yüklenemedi.`, 'error');
      }
    }

    setIsGlobalUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

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

        {items.map((item, idx) => (
          <div key={item.id} className="relative w-28 h-28 bg-gray-100 rounded-md border border-gray-200 overflow-hidden group">
            <img src={item.url} alt="preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {item.status === 'uploading' && <div className="bg-white/80 p-2 rounded-full shadow"><Loader2 size={20} className="animate-spin text-blue-600" /></div>}
              {item.status === 'error' && <div className="bg-red-100 p-2 rounded-full shadow text-red-600"><AlertCircle size={20} /></div>}
            </div>
            {idx === 0 && item.status === 'success' && (
              <div className="absolute top-0 left-0 bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-br-sm z-10">VİTRİN</div>
            )}
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
        <p className="text-xs text-gray-400">Vitrin görseli için en az 1 adet fotoğraf yüklemeniz önerilir. (Otomatik sıkıştırılır)</p>
      )}
    </div>
  );
}