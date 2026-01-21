// --- KATEGORİ YAPISI ---
export const categories = [
  {
    id: 'emlak',
    title: 'Emlak',
    icon: 'Home',
    slug: 'emlak',
    subs: [
      {
        id: 'konut',
        title: 'Konut',
        slug: 'konut',
        subs: [
            { id: 'konut-satilik', title: 'Satılık', slug: 'konut-satilik' },
            { id: 'konut-kiralik', title: 'Kiralık', slug: 'konut-kiralik' },
            { id: 'gunluk-kiralik', title: 'Turistik Günlük Kiralık', slug: 'gunluk-kiralik' },
            { id: 'devren-satilik-konut', title: 'Devren Satılık Konut', slug: 'devren-satilik-konut' }
        ]
      },
      {
        id: 'isyeri',
        title: 'İş Yeri',
        slug: 'is-yeri',
        subs: [
            { id: 'isyeri-satilik', title: 'Satılık', slug: 'isyeri-satilik' },
            { id: 'isyeri-kiralik', title: 'Kiralık', slug: 'isyeri-kiralik' },
            { id: 'isyeri-devren-satilik', title: 'Devren Satılık', slug: 'isyeri-devren-satilik' },
            { id: 'isyeri-devren-kiralik', title: 'Devren Kiralık', slug: 'isyeri-devren-kiralik' }
        ]
      },
      {
        id: 'arsa',
        title: 'Arsa',
        slug: 'arsa',
        subs: [
            { id: 'arsa-satilik', title: 'Satılık', slug: 'arsa-satilik' },
            { id: 'arsa-kiralik', title: 'Kiralık', slug: 'arsa-kiralik' }
        ]
      },
      { id: 'bina', title: 'Bina', slug: 'bina', subs: [] },
      { id: 'devremulk', title: 'Devre Mülk', slug: 'devre-mulk', subs: [] },
      { id: 'turistik', title: 'Turistik Tesis', slug: 'turistik-tesis', subs: [] }
    ]
  },
  {
    id: 'vasita',
    title: 'Vasıta',
    icon: 'Car',
    slug: 'vasita',
    subs: [
      { id: 'oto', title: 'Otomobil', slug: 'otomobil' },
      { id: 'suv', title: 'Arazi, SUV & Pickup', slug: 'arazi-suv-pickup' },
      { id: 'moto', title: 'Motosiklet', slug: 'motosiklet' },
      { id: 'minivan', title: 'Minivan & Panelvan', slug: 'minivan-panelvan' },
      { id: 'commercial', title: 'Ticari Araçlar', slug: 'ticari-araclar' }
    ]
  },
  {
    id: 'alisveris',
    title: 'İkinci El ve Sıfır Alışveriş',
    icon: 'ShoppingCart',
    slug: 'alisveris',
    subs: [
      { id: 'pc', title: 'Bilgisayar', slug: 'bilgisayar' },
      { id: 'phone', title: 'Cep Telefonu', slug: 'cep-telefonu-ve-aksesuar' },
      { id: 'home-elec', title: 'Ev Elektroniği', slug: 'ev-elektronigi' }
    ]
  }
];

// --- AKILLI İLAN ÜRETİCİ ---
const generateAds = () => {
  const ads = [];
  let idCounter = 100000;

  const templates = {
    'konut-satilik': { titles: ['Satılık Lüks Daire', 'Sahibinden Kelepir 3+1', 'Merkezi Konumda Fırsat', 'Site İçi Satılık', 'Deniz Manzaralı Daire'], priceBase: 3500000, img: 'house' },
    'konut-kiralik': { titles: ['Kiralık 2+1 Daire', 'Öğrenciye Uygun Eşyalı', 'Metroya Yakın Kiralık', 'Aileye Uygun Kiralık'], priceBase: 25000, img: 'interior' },
    'gunluk-kiralik': { titles: ['Günlük Kiralık Villa', 'Haftasonu İçin Bungalov', 'Havuzlu Günlük Daire', 'Turistik Bölgede Apart'], priceBase: 5000, img: 'villa' },
    'devren-satilik-konut': { titles: ['Devren Satılık Köy Evi', 'Eşyalı Devren Daire'], priceBase: 1500000, img: 'village' },

    'isyeri-satilik': { titles: ['Yatırımlık Dükkan', 'Cadde Üzeri Mağaza', 'Satılık Plaza Katı'], priceBase: 8000000, img: 'office' },
    'isyeri-kiralik': { titles: ['Kiralık Ofis', 'Hazır Ofis Odası', 'Depolu Dükkan'], priceBase: 40000, img: 'office' },
    'isyeri-devren-satilik': { titles: ['Devren Satılık Market', 'İşlek Cadde Cafe', 'Cirolu Restoran'], priceBase: 2000000, img: 'shop' },

    'arsa-satilik': { titles: ['İmarlı Arsa', 'Denize Yakın Tarla', 'Sanayi İmarlı Arsa', 'Yatırımlık Zeytinlik'], priceBase: 4500000, img: 'land' },
    'arsa-kiralik': { titles: ['Kiralık Depo Arazisi', 'Tarıma Uygun Kiralık', 'Kiralık Bahçe'], priceBase: 10000, img: 'land' },

    'otomobil': { titles: ['Sahibinden Temiz Araç', 'Doktordan Satılık', 'Düşük KM Aile Aracı', 'Tramersiz Hatasız'], priceBase: 1200000, img: 'car' },
    'suv': { titles: ['Arazi Canavarı', '4x4 Temiz SUV', 'Aile İçin SUV'], priceBase: 2500000, img: 'suv' },

    'bilgisayar': { titles: ['Gaming Laptop', 'Temiz Macbook', 'Masaüstü Oyuncu PC'], priceBase: 45000, img: 'computer' }
  };

  const cities = ['İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa', 'Kocaeli', 'Adana'];
  const districts = ['Merkez', 'Çankaya', 'Karşıyaka', 'Muratpaşa', 'Nilüfer', 'Gebze', 'Seyhan'];

  // Her kategori için belirli sayıda ilan üret
  Object.keys(templates).forEach(catSlug => {
    const template = templates[catSlug];
    const count = 12; // Kategori başına 12 ilan

    for (let i = 0; i < count; i++) {
        const cityIndex = Math.floor(Math.random() * cities.length);
        const titleRandom = template.titles[Math.floor(Math.random() * template.titles.length)];
        const priceValue = template.priceBase + (Math.random() * template.priceBase * 0.5) - (template.priceBase * 0.1);
        const imgKeyword = template.img;

        ads.push({
            id: idCounter++,
            title: `${titleRandom} - ${i+1}`,
            image: `https://picsum.photos/seed/${imgKeyword}${i}${catSlug}/400/300`,
            price: Math.floor(priceValue).toLocaleString('tr-TR', { maximumFractionDigits: 0 }),
            rawPrice: Math.floor(priceValue),
            currency: 'TL',
            city: cities[cityIndex],
            district: districts[cityIndex],
            location: `${cities[cityIndex]} / ${districts[cityIndex]}`,
            dateRaw: new Date().getTime() - (Math.random() * 1000000000),
            date: 'Bugün',
            category: catSlug,
            description: `${catSlug.replace('-', ' ').toUpperCase()} kategorisindeki bu ilan kaçmaz. Detaylı bilgi için arayınız.`,
            room: ['1+1', '2+1', '3+1', '4+1'][Math.floor(Math.random() * 4)],
            year: 2010 + Math.floor(Math.random() * 14),
            km: 10000 + Math.floor(Math.random() * 200000)
        });
    }
  });

  return ads.sort((a, b) => b.dateRaw - a.dateRaw);
};

export const ads = generateAds();
export const urgentAds = ads.filter((_, i) => i % 15 === 0);
export const interestingAds = ads.filter((_, i) => i % 20 === 0);

export function getAdById(id: any) {
  return ads.find(ad => ad.id === Number(id));
}

export function getSellerById(id: any) { return { id, name: 'Ahmet Yılmaz', avatar: 'AY', rating: 4.5, joined: '2020', lastSeen: 'Bugün', isVerified: true, reviews: [] }; }
export function getAdsBySeller(id: any) { return ads.slice(0, 5); }

// --- ARAMA MOTORU ---
export function searchAds(params: any) {
  let filtered = [...ads];

  // 1. Metin Arama
  if (params.q) {
    const q = params.q.toLowerCase();
    filtered = filtered.filter(ad => ad.title.toLowerCase().includes(q));
  }

  // 2. Akıllı Kategori Filtresi (Hierarchical Logic)
  if (params.category) {
     const targetSlug = params.category;
     filtered = filtered.filter(ad => {
        if (ad.category === targetSlug) return true;

        // Üst kategori mantığı (Slug eşleşmesi)
        if (targetSlug === 'emlak') return ad.category.startsWith('konut') || ad.category.startsWith('isyeri') || ad.category.startsWith('arsa');
        if (targetSlug === 'konut') return ad.category.startsWith('konut') || ad.category === 'gunluk-kiralik' || ad.category.includes('devren-satilik-konut');
        if (targetSlug === 'is-yeri') return ad.category.startsWith('isyeri');
        if (targetSlug === 'arsa') return ad.category.startsWith('arsa');

        if (targetSlug === 'vasita') return ['otomobil', 'suv', 'moto', 'minivan', 'commercial'].includes(ad.category);
        return false;
     });
  }

  // 3. Diğer Filtreler
  if (params.city) filtered = filtered.filter(ad => ad.city === params.city);
  if (params.minPrice) filtered = filtered.filter(ad => ad.rawPrice >= Number(params.minPrice));
  if (params.maxPrice) filtered = filtered.filter(ad => ad.rawPrice <= Number(params.maxPrice));

  if (params.sort) {
    switch (params.sort) {
      case 'price_asc': filtered.sort((a, b) => a.rawPrice - b.rawPrice); break;
      case 'price_desc': filtered.sort((a, b) => b.rawPrice - a.rawPrice); break;
      case 'date_desc': filtered.sort((a, b) => b.dateRaw - a.dateRaw); break;
      case 'date_asc': filtered.sort((a, b) => a.dateRaw - b.dateRaw); break;
    }
  }

  const page = Number(params.page) || 1;
  const limit = 15;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  return {
    data: filtered.slice(startIndex, endIndex),
    meta: {
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit)
    }
  };
}