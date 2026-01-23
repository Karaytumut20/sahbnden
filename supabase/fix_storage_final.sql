-- BU KODU SUPABASE SQL EDITOR'DE ÇALIŞTIRIN --

-- 1. Bucket'ı Garantiye Al (Yoksa oluştur, varsa Public yap)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('ads', 'ads', true, 5242880, ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/png', 'image/jpeg', 'image/gif', 'image/webp'];

-- 2. Eski Politikaları Temizle (Çakışmayı Önle)
DROP POLICY IF EXISTS "Resimler herkese açık" ON storage.objects;
DROP POLICY IF EXISTS "Kullanıcılar resim yükleyebilir" ON storage.objects;
DROP POLICY IF EXISTS "Kullanıcılar kendi resimlerini silebilir" ON storage.objects;
DROP POLICY IF EXISTS "Kullanıcılar kendi resimlerini güncelleyebilir" ON storage.objects;
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;

-- 3. Kesin İzinler (RLS)

-- OKUMA: Herkes (Giriş yapmamışlar dahil)
CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'ads' );

-- YÜKLEME: Sadece giriş yapmış kullanıcılar
-- (owner kontrolü yapmıyoruz, insert anında owner otomatik atanır veya kontrol edilmez, önemli olan auth olması)
CREATE POLICY "Authenticated Upload"
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'ads' AND auth.role() = 'authenticated' );

-- SİLME: Sadece dosyayı yükleyen kişi (owner)
CREATE POLICY "Owner Delete"
  ON storage.objects FOR DELETE
  USING ( bucket_id = 'ads' AND auth.uid() = owner );

-- GÜNCELLEME: Sadece dosyayı yükleyen kişi
CREATE POLICY "Owner Update"
  ON storage.objects FOR UPDATE
  USING ( bucket_id = 'ads' AND auth.uid() = owner );