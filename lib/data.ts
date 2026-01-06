
// Rastgele ilan üretici (Genişletilmiş Veri Seti - 120 İlan)
const generateAds = (count, prefix, startPrice) => {
  return Array.from({ length: count }).map((_, i) => {
    const cityIndex = i % 5;
    const city = ['İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa'][cityIndex];
    const district = ['Merkez', 'Çankaya', 'Karşıyaka', 'Muratpaşa', 'Nilüfer'][cityIndex];
    const priceValue = startPrice + (i * 12500) + (cityIndex * 5000);

    return {
      id: 100000 + i + (startPrice / 1000),
      title: `${prefix} - Fırsat İlan ${i + 1} ${i % 2 === 0 ? 'Sahibinden' : 'Emlakçıdan'}`,
      image: `https://picsum.photos/seed/${prefix}${i}/300/200`,
      price: priceValue.toLocaleString('tr-TR', { maximumFractionDigits: 0 }),
      rawPrice: priceValue,
      currency: 'TL',
      city: city,
      district: district,
      location: `${city} / ${district}`,
      dateRaw: new Date(2025, 0, 24).getTime() - (i * 3600000), // Her ilanı 1 saat arayla
      date: '25 Ocak 2025',
      category: i < 60 ? 'emlak' : 'vasita', // İlk 60 emlak, kalanı vasıta
      attributes: [
        { label: 'İlan No', value: `102938${i}` },
        { label: 'Kimden', value: 'Sahibinden' },
      ],
      description: '<p>Bu ilan sahibinden.com klon projesi için oluşturulmuş örnek bir veridir.</p>',
      // Emlak/Vasıta filtreleri için dummy datalar
      room: ['1+1', '2+1', '3+1'][i % 3],
      year: 2015 + (i % 10),
      km: 10000 * (i % 20)
    };
  });
};

// Veri Setleri
export const ads = generateAds(120, 'İlan', 1000000); // Ana havuz
export const urgentAds = generateAds(10, 'Acil', 750000);
export const interestingAds = generateAds(10, 'İlginç', 5000000);

export function getAdById(id) {
  const allAds = [...ads, ...urgentAds, ...interestingAds];
  return allAds.find(ad => ad.id === Number(id));
}

export const categories = [
  { id: 'emlak', name: 'Emlak', icon: 'Home', subs: ['Konut', 'İş Yeri', 'Arsa'] },
  { id: 'vasita', name: 'Vasıta', icon: 'Car', subs: ['Otomobil', 'SUV', 'Motosiklet'] },
  { id: 'alisveris', name: 'İkinci El ve Sıfır Alışveriş', icon: 'Monitor', subs: ['Bilgisayar', 'Telefon'] },
];

export function getSellerById(id) { return { id, name: 'Ahmet Yılmaz', avatar: 'AY', rating: 4.5, joined: '2020', lastSeen: 'Bugün', isVerified: true, reviews: [] }; }
export function getAdsBySeller(id) { return ads.slice(0, 5); }

// GELİŞMİŞ ARAMA VE SAYFALAMA
export function searchAds(params) {
  let filtered = [...ads, ...urgentAds, ...interestingAds];

  // Filtreleme Mantığı
  if (params.q) {
    const q = params.q.toLowerCase();
    filtered = filtered.filter(ad => ad.title.toLowerCase().includes(q));
  }
  if (params.category) filtered = filtered.filter(ad => ad.category === params.category);
  if (params.city) filtered = filtered.filter(ad => ad.city === params.city);
  if (params.minPrice) filtered = filtered.filter(ad => ad.rawPrice >= Number(params.minPrice));
  if (params.maxPrice) filtered = filtered.filter(ad => ad.rawPrice <= Number(params.maxPrice));

  // Sıralama
  if (params.sort) {
    switch (params.sort) {
      case 'price_asc': filtered.sort((a, b) => a.rawPrice - b.rawPrice); break;
      case 'price_desc': filtered.sort((a, b) => b.rawPrice - a.rawPrice); break;
      case 'date_desc': filtered.sort((a, b) => b.dateRaw - a.dateRaw); break;
      case 'date_asc': filtered.sort((a, b) => a.dateRaw - b.dateRaw); break;
    }
  }

  // SAYFALAMA (Pagination)
  const page = Number(params.page) || 1;
  const limit = 15; // Sayfa başına 15 ilan
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const paginatedData = filtered.slice(startIndex, endIndex);
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);

  return {
    data: paginatedData,
    meta: {
      total,
      page,
      limit,
      totalPages
    }
  };
}
