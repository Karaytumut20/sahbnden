-- BU KODU SUPABASE SQL EDITOR EKRANINDA ÇALIŞTIRIN --

-- 1. Mevcut "User Update" politikasını koruyoruz, yanına Admin politikasını ekliyoruz.
-- Postgres RLS politikaları "OR" mantığıyla çalışır (Ya sahibi olacak YA DA admin olacak).

CREATE POLICY "Admins can update any ad"
ON ads
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- 2. Garanti olsun diye Adminlerin her şeyi silebilmesi için de politika ekleyelim
CREATE POLICY "Admins can delete any ad"
ON ads
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- 3. Cache Temizliği
NOTIFY pgrst, 'reload schema';