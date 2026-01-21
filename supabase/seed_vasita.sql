-- Vasıta Kategorisi
INSERT INTO categories (title, slug, icon, parent_id)
VALUES ('Vasıta', 'vasita', 'Car', NULL) ON CONFLICT (slug) DO NOTHING;

INSERT INTO categories (title, slug, icon, parent_id)
SELECT c.title, c.slug, c.icon, p.id FROM ( VALUES
    ('Otomobil', 'otomobil', 'Car'),
    ('Arazi, SUV & Pickup', 'arazi-suv-pickup', 'Mountain'),
    ('Elektrikli Araçlar', 'elektrikli-araclar', 'Zap'),
    ('Motosiklet', 'motosiklet', 'Bike'),
    ('Minivan & Panelvan', 'minivan-panelvan', 'Truck'),
    ('Ticari Araçlar', 'ticari-araclar', 'Bus'),
    ('Kiralık Araçlar', 'kiralik-araclar', 'Key'),
    ('Deniz Araçları', 'deniz-araclari', 'Ship'),
    ('Hasarlı Araçlar', 'hasarli-araclar', 'AlertTriangle'),
    ('Karavan', 'karavan', 'Tent'),
    ('Klasik Araçlar', 'klasik-araclar', 'Star'),
    ('Hava Araçları', 'hava-araclari', 'Plane'),
    ('ATV', 'atv', 'Navigation'),
    ('UTV', 'utv', 'Navigation'),
    ('Engelli Plakalı Araçlar', 'engelli-plakali-araclar', 'Accessibility')
) AS c(title, slug, icon) CROSS JOIN categories p WHERE p.slug = 'vasita' ON CONFLICT (slug) DO NOTHING;