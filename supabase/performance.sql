-- BU KODU SUPABASE SQL EDITOR'DE ÇALIŞTIRIN --
-- Performans iyileştirmeleri ve Full Text Search kurulumu

-- 1. İndeksler (Sorgu Hızlandırma)
-- Kategorilere, fiyatlara ve şehirlere göre filtrelemeler çok sık yapılır.
CREATE INDEX IF NOT EXISTS idx_ads_category ON ads(category);
CREATE INDEX IF NOT EXISTS idx_ads_city ON ads(city);
CREATE INDEX IF NOT EXISTS idx_ads_price ON ads(price);
CREATE INDEX IF NOT EXISTS idx_ads_user_id ON ads(user_id);
CREATE INDEX IF NOT EXISTS idx_ads_status ON ads(status);

-- 2. Full Text Search (Gelişmiş Arama)
-- 'ilike' (LIKE %...%) sorgusu büyük veride çok yavaştır. PostgreSQL'in FTS özelliğini kullanalım.
-- İlan başlığı ve açıklaması üzerinde arama yapmak için bir vektör kolonu oluşturuyoruz.

ALTER TABLE ads ADD COLUMN IF NOT EXISTS fts tsvector GENERATED ALWAYS AS (to_tsvector('turkish', title || ' ' || description)) STORED;

CREATE INDEX IF NOT EXISTS idx_ads_fts ON ads USING GIN (fts);

-- Örnek Arama Sorgusu (Supabase Client ile bu kullanılır):
-- .textSearch('fts', 'araba satılık', { config: 'turkish' })