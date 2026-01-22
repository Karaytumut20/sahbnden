-- BU KODU SUPABASE SQL EDITOR'DE ÇALIŞTIRIN --
-- Gerçek zamanlı özellikleri aktif etmek için "supa_realtime" yayınına tabloları ekliyoruz.

-- 1. Mesajlaşma için Realtime
alter publication supabase_realtime add table messages;

-- 2. Bildirimler için Realtime
alter publication supabase_realtime add table notifications;

-- 3. İlan durumu değişiklikleri için (Örn: Biri ilanı satın alınca anında 'Satıldı' yazsın)
alter publication supabase_realtime add table ads;

-- 4. Online Kullanıcı Takibi (Presence) için tabloya gerek yok, Supabase Channel kullanacağız.
-- Ancak son görülme bilgisini kalıcı tutmak istersek:
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_seen_at timestamp with time zone;