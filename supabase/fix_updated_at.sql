-- BU KODU SUPABASE SQL EDITOR EKRANINDA ÇALIŞTIRIN --

-- 1. ADS Tablosuna 'updated_at' kolonunu ekle (Eğer yoksa)
ALTER TABLE ads
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL;

-- 2. Otomatik güncelleme fonksiyonunu oluştur (Eğer yoksa)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 3. Trigger'ı ADS tablosuna bağla (Her güncellemede tarih değişsin)
DROP TRIGGER IF EXISTS update_ads_updated_at ON ads;
CREATE TRIGGER update_ads_updated_at
BEFORE UPDATE ON ads
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- 4. Cache'i temizle
NOTIFY pgrst, 'reload schema';