-- BU KODU MUTLAKA SUPABASE SQL EDITOR EKRANINDA ÇALIŞTIRIN --
-- EĞER DAHA ÖNCE ÇALIŞTIRDIYSANIZ BİLE TEKRAR ÇALIŞTIRMANIZDA SAKINCA YOKTUR (IF NOT EXISTS VAR) --

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS show_phone boolean DEFAULT false;

-- RLS İzinlerini Garantiye Al
-- Kullanıcı kendi profilindeki her alanı güncelleyebilmeli
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

NOTIFY pgrst, 'reload schema';