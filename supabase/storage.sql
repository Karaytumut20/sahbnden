-- BU KODU SUPABASE SQL EDITOR EKRANINDA ÇALIŞTIRIN --

-- 1. 'ads' (İlanlar) Bucket'ını Oluştur
-- Eğer bucket zaten varsa hata vermez, yoksa oluşturur.
-- 'public: true' sayesinde resimler URL üzerinden herkes tarafından görülebilir.
INSERT INTO storage.buckets (id, name, public)
VALUES ('ads', 'ads', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Güvenlik Politikalarını (RLS) Temizle ve Yeniden Oluştur
-- Eski/Hatalı politikaları kaldırıyoruz.
DROP POLICY IF EXISTS "Resimler herkese açık" ON storage.objects;
DROP POLICY IF EXISTS "Kullanıcılar resim yükleyebilir" ON storage.objects;
DROP POLICY IF EXISTS "Kullanıcılar kendi resimlerini silebilir" ON storage.objects;
DROP POLICY IF EXISTS "Kullanıcılar kendi resimlerini güncelleyebilir" ON storage.objects;

-- 3. Yeni Politikalar

-- OKUMA: Herkes resimleri görebilir (Giriş yapmamış olsa bile)
CREATE POLICY "Resimler herkese açık"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'ads' );

-- YÜKLEME: Sadece giriş yapmış (authenticated) kullanıcılar resim yükleyebilir
CREATE POLICY "Kullanıcılar resim yükleyebilir"
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'ads' AND auth.role() = 'authenticated' );

-- SİLME: Kullanıcı sadece kendi yüklediği resmi silebilir
CREATE POLICY "Kullanıcılar kendi resimlerini silebilir"
  ON storage.objects FOR DELETE
  USING ( bucket_id = 'ads' AND auth.uid() = owner );

-- GÜNCELLEME: Kullanıcı sadece kendi yüklediği resmi güncelleyebilir
CREATE POLICY "Kullanıcılar kendi resimlerini güncelleyebilir"
  ON storage.objects FOR UPDATE
  USING ( bucket_id = 'ads' AND auth.uid() = owner );

-- ÖNEMLİ NOT:
-- Supabase Storage kullanabilmek için 'storage' şemasının aktif olduğundan emin olun.
-- Genellikle varsayılan olarak gelir ama gelmezse:
-- create extension if not exists "uuid-ossp";