"use client";
import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { uploadImageClient } from '@/lib/services';
import { useToast } from '@/context/ToastContext';

type ImageUploaderProps = {
  onImagesChange: (urls: string[]) => void;
  initialImages?: string[];
};

export default function ImageUploader({ onImagesChange, initialImages = [] }: ImageUploaderProps) {
  const [images, setImages] = useState<string[]>(initialImages);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    setUploading(true);
    const newUrls: string[] = [];

    // Çoklu yükleme döngüsü
    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i];
      try {
        const url = await uploadImageClient(file);
        newUrls.push(url);
      } catch (error) {
        console.error(error);
        addToast(`${file.name} yüklenirken hata oluştu.`, 'error');
      }
    }

    const updatedList = [...images, ...newUrls];
    setImages(updatedList);
    onImagesChange(updatedList);
    setUploading(false);

    // Input'u temizle ki aynı dosyayı tekrar seçebilsin
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (index: number) => {
    const updatedList = images.filter((_, i) => i !== index);
    setImages(updatedList);
    onImagesChange(updatedList);
  };

  return (
    <div className="space-y-4">
      <div
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${uploading ? 'bg-gray-50 cursor-wait' : 'hover:bg-blue-50 hover:border-blue-400'}`}
      >
        {uploading ? (
          <div className="text-center">
            <Loader2 size={32} className="animate-spin text-blue-600 mx-auto mb-2" />
            <p className="text-sm text-gray-500 font-bold">Fotoğraflar Yükleniyor...</p>
          </div>
        ) : (
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Upload size={24} />
            </div>
            <p className="text-sm font-bold text-gray-700">Fotoğraf Yüklemek İçin Tıklayın</p>
            <p className="text-xs text-gray-400 mt-1">veya sürükleyip bırakın (Max 10 Adet)</p>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          multiple
          accept="image/*"
          disabled={uploading}
        />
      </div>

      {/* Önizleme Alanı */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4 animate-in fade-in slide-in-from-bottom-2">
          {images.map((url, idx) => (
            <div key={idx} className="relative group aspect-square bg-gray-100 rounded-md border border-gray-200 overflow-hidden">
              <img src={url} alt={`Yüklenen ${idx}`} className="w-full h-full object-cover" />

              {/* Vitrin Etiketi (İlk Resim) */}
              {idx === 0 && (
                <div className="absolute top-0 left-0 bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-br-sm z-10">
                  VİTRİN
                </div>
              )}

              {/* Sil Butonu */}
              <button
                onClick={() => removeImage(idx)}
                className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                title="Fotoğrafı Kaldır"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}