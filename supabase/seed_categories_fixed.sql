-- BU KODU SUPABASE SQL EDITOR EKRANINDA ÇALIŞTIRIN --

INSERT INTO categories (title, slug, icon, parent_id)
VALUES ('İkinci El ve Sıfır Alışveriş', 'alisveris', 'ShoppingCart', NULL)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (title, slug, icon, parent_id)
SELECT c.title, c.slug, c.icon, p.id
FROM (
    VALUES
    ('Bilgisayar', 'bilgisayar', 'Monitor'),
    ('Cep Telefonu & Aksesuar', 'cep-telefonu-ve-aksesuar', 'Smartphone'),
    ('Fotoğraf & Kamera', 'fotograf-ve-kamera', 'Camera'),
    ('Ev Dekorasyon', 'ev-dekorasyon', 'Lamp'),
    ('Ev Elektroniği', 'ev-elektronigi', 'Tv'),
    ('Elektrikli Ev Aletleri', 'elektrikli-ev-aletleri', 'Plug'),
    ('Giyim & Aksesuar', 'giyim-ve-aksesuar', 'Shirt'),
    ('Saat', 'saat', 'Watch'),
    ('Anne & Bebek', 'anne-ve-bebek', 'Baby'),
    ('Kişisel Bakım & Kozmetik', 'kisisel-bakim-ve-kozmetik', 'Sparkles'),
    ('Hobi & Oyuncak', 'hobi-ve-oyuncak', 'Gamepad2'),
    ('Oyunculara Özel', 'oyunculara-ozel', 'Headphones'),
    ('Kitap, Dergi & Film', 'kitap-dergi-ve-film', 'BookOpen'),
    ('Müzik', 'muzik', 'Music'),
    ('Spor', 'spor', 'Dumbbell'),
    ('Takı & Mücevher', 'taki-ve-mucevher', 'Gem'),
    ('Koleksiyon', 'koleksiyon', 'Stamp'),
    ('Antika', 'antika', 'Hourglass'),
    ('Bahçe & Yapı Market', 'bahce-ve-yapi-market', 'Hammer'),
    ('Teknik Elektronik', 'teknik-elektronik', 'Cpu'),
    ('Ofis & Kırtasiye', 'ofis-ve-kirtasiye', 'Briefcase'),
    ('Yiyecek & İçecek', 'yiyecek-ve-icecek', 'Utensils'),
    ('Diğer Her Şey', 'diger-her-sey', 'Package')
) AS c(title, slug, icon)
CROSS JOIN categories p
WHERE p.slug = 'alisveris'
ON CONFLICT (slug) DO NOTHING;