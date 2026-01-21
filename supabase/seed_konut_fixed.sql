-- Konut Alt Kategorileri
INSERT INTO categories (title, slug, icon, parent_id)
SELECT x.title, x.slug, x.icon, c.id
FROM categories c
CROSS JOIN (
    VALUES
        ('Satılık', 'satilik', 'Home'),
        ('Kiralık', 'kiralik', 'Key'),
        ('Turistik Günlük Kiralık', 'turistik-gunluk-kiralik', 'Sun'),
        ('Devren Satılık Konut', 'devren-satilik-konut', 'Briefcase')
) AS x(title, slug, icon)
WHERE c.slug = 'konut'
ON CONFLICT (slug) DO NOTHING;