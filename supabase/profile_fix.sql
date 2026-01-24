-- Bu kodu Supabase SQL Editor'de çalıştırarak veritabanınızı sağlamlaştırabilirsiniz.
-- profiles tablosuna updated_at ekler ve otomatik güncellenmesini sağlar.

-- 1. Kolonu Ekle
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now());

-- 2. Trigger Fonksiyonu Oluştur (Her update işleminde updated_at'i günceller)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 3. Trigger'ı Tabloya Bağla
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();