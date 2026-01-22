-- BU KODU SUPABASE SQL EDITOR'DE ÇALIŞTIRIN --

-- 1. İlan tablosuna bitiş sürelerini ekleyelim
ALTER TABLE ads
ADD COLUMN IF NOT EXISTS vitrin_expires_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS urgent_expires_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS published_at timestamp with time zone;

-- 2. İndeksler (Cron job sorguları için)
CREATE INDEX IF NOT EXISTS idx_ads_vitrin_expire ON ads(vitrin_expires_at);
CREATE INDEX IF NOT EXISTS idx_ads_urgent_expire ON ads(urgent_expires_at);