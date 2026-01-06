
// Rastgele ilan üretici
const generateAds = (count, prefix, startPrice) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: i + 1,
    title: `${prefix} - Fırsat İlan ${i + 1} ${i % 2 === 0 ? 'Sahibinden' : 'Emlakçıdan'}`,
    image: `https://picsum.photos/seed/${prefix}${i}/300/200`,
    price: (Math.random() * 5000000 + startPrice).toLocaleString('tr-TR', { maximumFractionDigits: 0 }),
    rawPrice: Math.random() * 5000000 + startPrice,
    currency: 'TL',
    city: i % 3 === 0 ? 'İstanbul' : i % 3 === 1 ? 'Ankara' : 'İzmir',
    district: i % 3 === 0 ? 'Kadıköy' : i % 3 === 1 ? 'Çankaya' : 'Karşıyaka',
    dateRaw: new Date(2025, 0, 24 - (i % 10)).getTime(), // Sıralama için tarih
    date: `${24 - (i % 10)} Ocak 2025`,
    category: 'emlak',
    attributes: [
      { label: 'İlan No', value: `102938${i}` },
      { label: 'Kimden', value: 'Sahibinden' },
    ],
    description: '<p>Detaylı açıklama...</p>'
  }));
};

export const ads = generateAds(50, 'Konut', 1000000); // Daha fazla veri

export function getAdById(id) {
  return ads.find(ad => ad.id === id);
}

export const categories = [
  { id: 'emlak', name: 'Emlak', icon: 'Home', subs: ['Konut', 'İş Yeri', 'Arsa'] },
  { id: 'vasita', name: 'Vasıta', icon: 'Car', subs: ['Otomobil', 'SUV', 'Motosiklet'] },
  // ... diğerleri aynı kalabilir
];

// GELİŞMİŞ ARAMA FONKSİYONU
export function searchAds(params) {
  let filtered = [...ads];

  // 1. Metin Arama
  if (params.q) {
    const q = params.q.toLowerCase();
    filtered = filtered.filter(ad =>
      ad.title.toLowerCase().includes(q) ||
      ad.city.toLowerCase().includes(q) ||
      ad.district.toLowerCase().includes(q)
    );
  }

  // 2. Kategori Filtresi
  if (params.category) {
    // Demo verisi tek kategori olduğu için burayı es geçiyoruz veya genişletebilirsiniz
  }

  // 3. Şehir Filtresi
  if (params.city) {
    filtered = filtered.filter(ad => ad.city === params.city);
  }

  // 4. Fiyat Filtresi
  if (params.minPrice) {
    filtered = filtered.filter(ad => ad.rawPrice >= Number(params.minPrice));
  }
  if (params.maxPrice) {
    filtered = filtered.filter(ad => ad.rawPrice <= Number(params.maxPrice));
  }

  // 5. Sıralama
  if (params.sort) {
    switch (params.sort) {
      case 'price_asc':
        filtered.sort((a, b) => a.rawPrice - b.rawPrice);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.rawPrice - a.rawPrice);
        break;
      case 'date_desc':
        filtered.sort((a, b) => b.dateRaw - a.dateRaw);
        break;
      case 'date_asc':
        filtered.sort((a, b) => a.dateRaw - b.dateRaw);
        break;
    }
  }

  return filtered;
}
