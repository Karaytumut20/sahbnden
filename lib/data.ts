
// ... (Önceki kodların korunduğunu varsayıyoruz, buraya ekleme yapıyoruz)
// Bu dosya setup_v12'deki verinin üzerine satıcı fonksiyonlarını ekler.

// --- MEVCUT KODLARIN TEKRARI (VERİ TUTARLILIĞI İÇİN) ---
const cities = ['İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa'];

const generateRealEstateAds = (count, startId) => {
  return Array.from({ length: count }).map((_, i) => {
    const city = cities[i % cities.length];
    const price = 2000000 + (i * 150000);
    return {
      id: startId + i,
      title: `Sahibinden Satılık ${i % 4 + 1}+1 Fırsat Daire`,
      image: `https://picsum.photos/seed/house${i}/300/200`,
      price: price.toLocaleString('tr-TR', { maximumFractionDigits: 0 }),
      rawPrice: price,
      currency: 'TL',
      city: city,
      district: 'Merkez',
      location: `${city} / Merkez`,
      date: '25 Ocak 2025',
      dateRaw: new Date().getTime(),
      category: 'emlak',
      sellerId: 101, // Örnek Satıcı ID
      sellerName: 'Ahmet Yılmaz',
      room: (i % 4 + 1) + '+1',
      attributes: [{ label: 'İlan No', value: `100${i}` }],
      description: '<p>Harika konumda daire.</p>'
    };
  });
};

const generateVehicleAds = (count, startId) => {
  return Array.from({ length: count }).map((_, i) => {
    const price = 800000 + (i * 200000);
    return {
      id: startId + i,
      title: `Temiz Aile Aracı ${2015 + (i % 5)} Model`,
      image: `https://picsum.photos/seed/car${i}/300/200`,
      price: price.toLocaleString('tr-TR', { maximumFractionDigits: 0 }),
      rawPrice: price,
      currency: 'TL',
      city: cities[i % cities.length],
      district: 'Oto Galeri',
      location: `${cities[i % cities.length]} / Oto Galeri`,
      date: '24 Ocak 2025',
      dateRaw: new Date().getTime(),
      category: 'vasita',
      sellerId: 102, // Örnek Satıcı ID
      sellerName: 'Mehmet Demir',
      year: 2015 + (i % 5),
      km: 10000 + (i * 15000),
      attributes: [{ label: 'İlan No', value: `200${i}` }],
      description: '<p>Servis bakımlı araç.</p>'
    };
  });
};

export const ads = [...generateRealEstateAds(30, 10000), ...generateVehicleAds(30, 50000)];
export const urgentAds = generateVehicleAds(5, 90000);
export const interestingAds = generateRealEstateAds(5, 95000);

export function getAdById(id) {
  const all = [...ads, ...urgentAds, ...interestingAds];
  return all.find(x => x.id === Number(id));
}

// --- YENİ EKLENEN KISIM: SATICI VERİLERİ ---

const sellers = [
  {
    id: 101,
    name: 'Ahmet Yılmaz',
    joined: 'Ekim 2018',
    lastSeen: 'Bugün',
    phone: '+90 532 123 45 67',
    isVerified: true,
    avatar: 'AY',
    rating: 4.8,
    reviews: [
      { id: 1, user: 'Caner K.', comment: 'Çok ilgili bir satıcı, teşekkürler.', rate: 5, date: '10.01.2025' },
      { id: 2, user: 'Selin B.', comment: 'Ürün anlatıldığı gibiydi.', rate: 5, date: '05.01.2025' },
      { id: 3, user: 'Murat T.', comment: 'Kargo biraz gecikti ama satıcı iyi.', rate: 4, date: '20.12.2024' },
    ]
  },
  {
    id: 102,
    name: 'Mehmet Demir',
    joined: 'Mart 2021',
    lastSeen: 'Dün',
    phone: '+90 555 987 65 43',
    isVerified: false,
    avatar: 'MD',
    rating: 3.5,
    reviews: [
      { id: 1, user: 'Ali V.', comment: 'İletişim kurmak zor oldu.', rate: 3, date: '15.01.2025' },
      { id: 2, user: 'Zeynep A.', comment: 'Fiyatta yardımcı olmadı.', rate: 4, date: '12.01.2025' },
    ]
  }
];

export function getSellerById(id) {
  return sellers.find(s => s.id === Number(id));
}

export function getAdsBySeller(sellerId) {
  const all = [...ads, ...urgentAds, ...interestingAds];
  return all.filter(ad => ad.sellerId === Number(sellerId));
}

export const categories = [
  { id: 'emlak', name: 'Emlak', icon: 'Home', subs: ['Konut', 'İş Yeri', 'Arsa'] },
  { id: 'vasita', name: 'Vasıta', icon: 'Car', subs: ['Otomobil', 'SUV', 'Motosiklet'] },
  { id: 'alisveris', name: 'İkinci El ve Sıfır Alışveriş', icon: 'Monitor', subs: ['Bilgisayar', 'Telefon'] },
];

export function searchAds(params) {
  // Basitleştirilmiş arama (Hata almamak için)
  let filtered = [...ads, ...urgentAds, ...interestingAds];
  if (params.q) filtered = filtered.filter(ad => ad.title.toLowerCase().includes(params.q.toLowerCase()));
  if (params.city) filtered = filtered.filter(ad => ad.city === params.city);
  return filtered;
}
