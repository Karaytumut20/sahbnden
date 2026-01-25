-- BU KODU SUPABASE SQL EDITOR EKRANINDA ÇALIŞTIRIN --
-- BU KOD "PERMISSION DENIED" HATALARINI KESİN OLARAK ÇÖZER --

-- 1. Önce güvenli bir 'Admin mi?' kontrol fonksiyonu oluşturalım.
-- SECURITY DEFINER: Bu fonksiyonu çağıran kim olursa olsun, fonksiyonu oluşturanın yetkileriyle (postgres/admin) çalışır.
-- Bu sayede RLS kısıtlamalarına takılmadan 'profiles' tablosuna bakabiliriz.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- 2. Eski, çalışmayan politikaları temizleyelim
DROP POLICY IF EXISTS "Admins can update any ad" ON ads;
DROP POLICY IF EXISTS "Admins can delete any ad" ON ads;
DROP POLICY IF EXISTS "Admin update" ON ads;
DROP POLICY IF EXISTS "Admin delete" ON ads;

-- 3. Yeni, süper güçlü politikaları ekleyelim
-- İlanları Güncelleme (Onaylama/Reddetme için)
CREATE POLICY "Admin Update Policy"
ON ads
FOR UPDATE
USING (
  is_admin() OR auth.uid() = user_id
);

-- İlanları Silme
CREATE POLICY "Admin Delete Policy"
ON ads
FOR DELETE
USING (
  is_admin() OR auth.uid() = user_id
);

-- 4. Cache Temizliği
NOTIFY pgrst, 'reload schema';