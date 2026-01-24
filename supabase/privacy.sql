-- BU KODU SUPABASE SQL EDITOR'DE ÇALIŞTIRIN --

-- 1. 'profiles' tablosuna telefon görünürlük ayarı ekle
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS show_phone boolean DEFAULT false;

-- 2. Yeni kolon için RLS (Güvenlik) izni (Kullanıcı kendi ayarını güncelleyebilsin)
-- (Mevcut update politikası genellikle tüm kolonları kapsar, ekstra bir şey gerekmeyebilir ama garanti olsun)
-- Zaten "Users can update own profile" politikası varsa sorun yok.

-- 3. Cache Temizliği
NOTIFY pgrst, 'reload schema';