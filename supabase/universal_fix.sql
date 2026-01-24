-- BU KODU SUPABASE SQL EDITOR'DE ÇALIŞTIRIN --
-- BU KOD TÜM ERİŞİM SORUNLARINI ÇÖZER --

-- 1. ADS (İLANLAR) TABLOSU
-- Herkes her şeyi görebilsin (Filtreleme frontend'de yapılacak)
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public Read" ON ads;
DROP POLICY IF EXISTS "User Insert" ON ads;
DROP POLICY IF EXISTS "User Update" ON ads;
DROP POLICY IF EXISTS "User Delete" ON ads;
-- Eskileri de temizle
DROP POLICY IF EXISTS "Herkes ilanları görebilir" ON ads;
DROP POLICY IF EXISTS "Kullanıcılar ilan ekleyebilir" ON ads;

CREATE POLICY "Public Read" ON ads FOR SELECT USING (true);
CREATE POLICY "User Insert" ON ads FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "User Update" ON ads FOR UPDATE USING (auth.uid() = user_id);
-- Pasife çekme (Soft Delete) yerine gerçek silme izni de verelim (Admin veya Sahibi)
CREATE POLICY "User Delete" ON ads FOR DELETE USING (auth.uid() = user_id);


-- 2. FAVORITES (FAVORİLER) TABLOSU
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Fav Read" ON favorites;
DROP POLICY IF EXISTS "Fav Insert" ON favorites;
DROP POLICY IF EXISTS "Fav Delete" ON favorites;

CREATE POLICY "Fav Read" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Fav Insert" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Fav Delete" ON favorites FOR DELETE USING (auth.uid() = user_id);


-- 3. CONVERSATIONS & MESSAGES (MESAJLAŞMA)
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Conv Read" ON conversations;
DROP POLICY IF EXISTS "Conv Insert" ON conversations;
DROP POLICY IF EXISTS "Msg Read" ON messages;
DROP POLICY IF EXISTS "Msg Insert" ON messages;
DROP POLICY IF EXISTS "Msg Update" ON messages;

-- Sohbetleri katılımcılar görebilir
CREATE POLICY "Conv Read" ON conversations FOR SELECT
USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Sohbeti herkes başlatabilir (kendi adına)
CREATE POLICY "Conv Insert" ON conversations FOR INSERT
WITH CHECK (auth.uid() = buyer_id);

-- Mesajları sohbetin parçası olanlar görebilir
CREATE POLICY "Msg Read" ON messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM conversations c
    WHERE c.id = messages.conversation_id
    AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
  )
);

-- Mesajı herkes atabilir (kendi adına)
CREATE POLICY "Msg Insert" ON messages FOR INSERT
WITH CHECK (auth.uid() = sender_id);

-- Mesajı okundu işaretlemek için update izni
CREATE POLICY "Msg Update" ON messages FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM conversations c
    WHERE c.id = messages.conversation_id
    AND (c.buyer_id = auth.uid() OR c.seller_id = auth.uid())
  )
);

-- 4. CACHE TEMİZLİĞİ
NOTIFY pgrst, 'reload schema';