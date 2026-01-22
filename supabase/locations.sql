-- BU KODU SUPABASE SQL EDITOR'DE ÇALIŞTIRIN --

-- 1. Şehirler ve İlçeler Tabloları (Hardcoded veriden kurtuluyoruz)
CREATE TABLE IF NOT EXISTS provinces (
  id integer primary key,
  name text not null,
  slug text not null
);

CREATE TABLE IF NOT EXISTS districts (
  id integer primary key,
  province_id integer references provinces(id),
  name text not null,
  slug text not null
);

-- İndeksler (Hız için)
CREATE INDEX IF NOT EXISTS idx_districts_province ON districts(province_id);

-- 2. Faceted Search (Akıllı Sayaçlar) İçin RPC Fonksiyonu
-- Bu fonksiyon, arama yapmadan önce hangi şehirde kaç ilan olduğunu hesaplar.
CREATE OR REPLACE FUNCTION get_ad_counts_by_city()
RETURNS TABLE (city_name text, count bigint)
LANGUAGE sql
AS $$
  SELECT city, COUNT(*)
  FROM ads
  WHERE status = 'yayinda'
  GROUP BY city
  ORDER BY count DESC;
$$;

-- 3. Örnek Veri (Türkiye'nin büyük şehirleri - Gerçekte 81 il olmalı)
INSERT INTO provinces (id, name, slug) VALUES
(34, 'İstanbul', 'istanbul'),
(6, 'Ankara', 'ankara'),
(35, 'İzmir', 'izmir'),
(7, 'Antalya', 'antalya'),
(16, 'Bursa', 'bursa')
ON CONFLICT (id) DO NOTHING;

-- Örnek İlçeler (Sadece İstanbul için örnek)
INSERT INTO districts (id, province_id, name, slug) VALUES
(1, 34, 'Kadıköy', 'kadikoy'),
(2, 34, 'Beşiktaş', 'besiktas'),
(3, 34, 'Üsküdar', 'uskudar'),
(4, 34, 'Şişli', 'sisli'),
(5, 34, 'Maltepe', 'maltepe')
ON CONFLICT (id) DO NOTHING;