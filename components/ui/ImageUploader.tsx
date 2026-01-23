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

    // Maksimum dosya boyutu kontrolü (5MB)
    const validFiles = files.filter(file => {
        if (file.size > 5 * 1024 * 1024) {
            addToast(`${file.name} çok büyük (Max 5MB).`, 'error');
            return false;
        }
        return true;
    });

    if (validFiles.length === 0) return;

    // Önizleme Ekle
    const newItems: UploadItem[] = validFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      file: file,
      status: 'uploading'
    }));

    setItems(prev => [...prev, ...newItems]);
    setIsGlobalUploading(true);

    // Yükleme İşlemi (Sırayla)
    const updatedItems = [...items, ...newItems]; // Mevcut + Yeniler referansı

    for (const item of newItems) {
      if (!item.file) continue;

      try {
        // Sıkıştırma adımını kaldırdık (Hata kaynağı olabiliyor)
        // Doğrudan yükleme yapıyoruz.

        console.log("Yükleme başlıyor:", item.file.name);
        const publicUrl = await uploadImageClient(item.file);
        console.log("Yükleme başarılı:", publicUrl);

        // State'i güncelle (Başarılı)
        setItems(current => current.map(i =>
          i.id === item.id ? { ...i, status: 'success', remoteUrl: publicUrl } : i
        ));

      } catch (error: any) {
        console.error("Yükleme hatası:", error);

        // State'i güncelle (Hatalı)
        setItems(current => current.map(i =>
          i.id === item.id ? { ...i, status: 'error' } : i
        ));

        addToast(`${item.file?.name} yüklenemedi: ${error.message || 'Hata'}`, 'error');
      }
    }

    setIsGlobalUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // URL listesini üst bileşene bildir
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
            <div className="text-center">
                <Loader2 size={24} className="animate-spin text-blue-600 mx-auto mb-1" />
                <span className="text-[10px] text-gray-500 font-bold">Yükleniyor...</span>
            </div>
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
            accept="image/png, image/jpeg, image/jpg, image/webp"
            disabled={isGlobalUploading}
          />
        </div>

        {/* Resim Listesi */}
        {items.map((item, idx) => (
          <div key={item.id} className="relative w-28 h-28 bg-gray-100 rounded-md border border-gray-200 overflow-hidden group">
            <img src={item.url} alt="preview" className={`w-full h-full object-cover transition-opacity ${item.status === 'error' ? 'opacity-50 grayscale' : ''}`} />

            {/* Durum İkonları */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {item.status === 'uploading' && <div className="bg-white/80 p-2 rounded-full shadow"><Loader2 size={20} className="animate-spin text-blue-600" /></div>}
              {item.status === 'error' && <div className="bg-red-100 p-2 rounded-full shadow text-red-600"><AlertCircle size={20} /></div>}
            </div>

            {/* Vitrin Etiketi (İlk Resim) */}
            {idx === 0 && item.status === 'success' && (
              <div className="absolute top-0 left-0 bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-br-sm z-10 shadow-sm">VİTRİN</div>
            )}

            {/* Silme Butonu */}
            <button
              onClick={() => removeImage(item.id)}
              className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 z-20 cursor-pointer shadow-md"
              title="Kaldır"
            >
              <X size={12} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-start gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded border border-gray-100">
        <AlertCircle size={16} className="text-blue-500 shrink-0 mt-0.5"/>
        <p>İlanınızın daha hızlı satılması için en az 3 fotoğraf yüklemenizi öneririz. Vitrin fotoğrafı olarak ilk yüklediğiniz görsel kullanılacaktır.</p>
      </div>
    </div>
  );
}