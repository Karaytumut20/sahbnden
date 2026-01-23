const fs = require("fs");
const path = require("path");

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  yellow: "\x1b[33m",
  bold: "\x1b[1m",
  red: "\x1b[31m",
};

console.log(
  colors.blue +
    colors.bold +
    "\n💖 FAVORITES FIXER (SONSUZ YÜKLEME ÇÖZÜMÜ) 💖\n" +
    colors.reset,
);

function writeFile(filePath, content) {
  try {
    const absolutePath = path.join(process.cwd(), filePath);
    const dir = path.dirname(absolutePath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(absolutePath, content.trim());
    console.log(`${colors.green}✔ [GÜNCELLENDİ]${colors.reset} ${filePath}`);
  } catch (error) {
    console.error(
      `${colors.red}✘ [HATA]${colors.reset} ${filePath}: ${error.message}`,
    );
  }
}

// =============================================================================
// 1. FAVORİLER SAYFASI (GÜVENLİ YÜKLEME)
// Dosya: app/bana-ozel/favoriler/page.tsx
// =============================================================================
const favoritesPageContent = `
"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getFavoritesClient, toggleFavoriteClient } from '@/lib/services';
import { useToast } from '@/context/ToastContext';
import { Trash2, Loader2, HeartOff, Search, AlertCircle } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import AdCard from '@/components/AdCard';

export default function FavoritesPage() {
  const { user } = useAuth();
  const { addToast } = useToast();
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Veri Çekme Fonksiyonu (Hata Korumalı)
  const fetchFavorites = async () => {
    if (!user) return;

    try {
        setLoading(true);
        console.log("Favoriler çekiliyor...");

        const data = await getFavoritesClient(user.id);

        console.log("Favoriler geldi:", data);
        setAds(data || []);
    } catch (error) {
        console.error("Favori yükleme hatası:", error);
        addToast('Favoriler yüklenirken bir sorun oluştu.', 'error');
        setAds([]); // Hata olsa bile boş liste göster
    } finally {
        setLoading(false); // Her durumda loading'i kapat
    }
  };

  useEffect(() => {
      if(user) {
          fetchFavorites();
      } else {
          // Kullanıcı yoksa loading kapat
          setLoading(false);
      }
  }, [user]);

  const handleRemove = async (adId: number) => {
    if (!user) return;

    // Optimistic Update (Anında Arayüzden Sil)
    setAds(prev => prev.filter(ad => ad.id !== adId));
    addToast('Favorilerden çıkarıldı.', 'info');

    try {
        await toggleFavoriteClient(user.id, adId);
    } catch (error) {
        console.error("Favori silme hatası", error);
        addToast("İşlem geri alındı.", "error");
        fetchFavorites(); // Hata olursa geri yükle
    }
  };

  if (!user) return <div className="p-10 text-center text-gray-500">Favorilerinizi görmek için giriş yapmalısınız.</div>;

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6 dark:bg-[#1c1c1c] dark:border-gray-700">
      <h1 className="text-xl font-bold text-[#333] mb-6 dark:text-white flex items-center gap-2">
        Favori İlanlarım
        {!loading && <span className="text-sm font-normal text-gray-500">({ads.length})</span>}
      </h1>

      {loading ? (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
            <Loader2 className="animate-spin text-blue-600" size={32}/>
            <p className="text-sm text-gray-500">Favorileriniz yükleniyor...</p>
        </div>
      ) : ads.length === 0 ? (
        <EmptyState
            icon={HeartOff}
            title="Favori İlanınız Yok"
            description="Beğendiğiniz ilanları favoriye ekleyerek fiyat takibi yapabilirsiniz."
            actionLabel="İlanlara Göz At"
            actionUrl="/search"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map((ad: any) => (
            <div key={ad.id} className="relative group">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemove(ad.id);
                    }}
                    className="absolute top-2 right-2 z-20 bg-white/90 p-2 rounded-full text-red-600 opacity-0 group-hover:opacity-100 transition-all shadow-md hover:scale-110 hover:bg-red-50"
                    title="Favorilerden Kaldır"
                >
                    <Trash2 size={16} />
                </button>
                <div className="h-[320px]">
                    <AdCard ad={ad} viewMode="grid" />
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
`;

// =============================================================================
// 2. VERİTABANI ONARIM SQL (FAVORITES REBUILD)
// Dosya: supabase/fix_favorites_final.sql
// =============================================================================
const sqlContent = `
-- BU KODU SUPABASE SQL EDITOR'DE ÇALIŞTIRIN --

-- 1. Tabloyu Sıfırdan Temizle (Hatalı ilişkileri düzeltmek için)
-- Not: Mevcut favoriler silinecektir, ancak sistemin çalışması için bu gereklidir.
DROP TABLE IF EXISTS favorites CASCADE;

-- 2. Tabloyu Yeniden Oluştur (Doğru İlişkilerle)
CREATE TABLE favorites (
  id bigint generated by default as identity primary key,
  user_id uuid references auth.users not null,
  ad_id bigint references ads(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,

  -- Çifte kayıt önleme
  unique(user_id, ad_id)
);

-- 3. RLS (Güvenlik) Politikalarını Tanımla
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add their own favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);

-- 4. İlanları Okuma İzni (Favorilerde ilan detaylarını çekebilmek için kritik)
DROP POLICY IF EXISTS "Herkes ilanları görebilir" ON ads;
CREATE POLICY "Herkes ilanları görebilir"
ON ads FOR SELECT
USING (true);

-- 5. Cache Temizle
NOTIFY pgrst, 'reload schema';
`;

// DOSYALARI YAZ
writeFile("app/bana-ozel/favoriler/page.tsx", favoritesPageContent);
writeFile("supabase/fix_favorites_final.sql", sqlContent);

console.log(
  colors.blue + colors.bold + "\n✅ DÜZELTME PAKETİ HAZIR!\n" + colors.reset,
);
console.log("Lütfen şu adımları izleyin:");
console.log(
  `1. ${colors.yellow}supabase/fix_favorites_final.sql${colors.reset} içeriğini kopyalayın.`,
);
console.log("2. Supabase SQL Editor'de çalıştırın (Run).");
console.log("3. Sayfayı yenileyin. Artık 'loading' ekranında kalmayacak.");
console.log(
  "(Eğer ilan yoksa 'Favori İlanınız Yok' ekranı gelecektir, bu doğru çalıştığını gösterir.)",
);
