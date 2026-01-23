-- BU KODU SUPABASE SQL EDITOR'DE ÇALIŞTIRARAK MEVCUT İLANLARI YAYINLAYIN --

-- 1. Bekleyen ve Reddedilen tüm ilanları 'yayinda' statüsüne çek
UPDATE ads
SET status = 'yayinda'
WHERE status IN ('onay_bekliyor', 'reddedildi');

-- 2. İlan Tarihlerini güncelle (En üstte çıkmaları için)
UPDATE ads
SET created_at = NOW()
WHERE status = 'yayinda';

-- 3. RLS Kontrolü (Garanti olsun diye)
DROP POLICY IF EXISTS "Herkes ilanları görebilir" ON ads;
CREATE POLICY "Herkes ilanları görebilir"
ON ads FOR SELECT
USING (true);