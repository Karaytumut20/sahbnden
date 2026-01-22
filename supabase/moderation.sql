-- BU KODU SUPABASE SQL EDITOR'DE ÇALIŞTIRIN --

-- 1. İlan tablosuna moderasyon skorlarını ekleyelim
ALTER TABLE ads
ADD COLUMN IF NOT EXISTS moderation_score integer default 0, -- 0: Temiz, 100: Çok Riskli
ADD COLUMN IF NOT EXISTS moderation_tags text[] default '{}', -- Örn: ['PHONE_DETECTED', 'BAD_WORD']
ADD COLUMN IF NOT EXISTS admin_note text;

-- 2. İndeks (Riskli ilanları bulmak için)
CREATE INDEX IF NOT EXISTS idx_ads_mod_score ON ads(moderation_score);