const fs = require("fs");
const path = require("path");

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
};

console.log(
  colors.cyan +
    colors.bold +
    "\n🚀 SAHİBİNDEN CLONE - DETAYLI İLAN VERİLERİ OLUŞTURULUYOR...\n" +
    colors.reset,
);

function writeFile(filePath, content) {
  const absolutePath = path.join(__dirname, filePath);
  const dir = path.dirname(absolutePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(absolutePath, content.trim());
  console.log(`${colors.green}✔ Dosya güncellendi:${colors.reset} ${filePath}`);
}

const dataTsContent = `
// --- FULL KATEGORİ YAPISI ---
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
            { id: 'isyeri-kiralik', title: 'Kiralık', slug: 'isyeri-kiralik' }
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
      }
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
      { id: 'moto', title: 'Motosiklet', slug: 'motosiklet' }
    ]
  },
  {
    id: 'alisveris',
    title: 'İkinci El ve Sıfır Alışveriş',
    icon: 'ShoppingCart',
    slug: 'alisveris',
    subs: [
      { id: 'pc', title: 'Bilgisayar', slug: 'bilgisayar' },
      { id: 'phone', title: 'Cep Telefonu', slug: 'cep-telefonu-ve-aksesuar' }
    ]
  }
];

// Rastgele ilan üretici (Artık detaylı kategori atıyor)
const generateAds = (count: number, prefix: string, startPrice: number) => {
  return Array.from({ length: count }).map((_, i) => {
    const cityIndex = i % 5;
    const city = ['İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa'][cityIndex];
    const district = ['Merkez', 'Çankaya', 'Karşıyaka', 'Muratpaşa', 'Nilüfer'][cityIndex];
    const priceValue = startPrice + (i * 12500) + (cityIndex * 5000);

    // Kategorileri dağıt
    let cat = 'emlak';
    if (i % 3 === 0) cat = 'konut-satilik';
    else if (i % 3 === 1) cat = 'konut-kiralik';
    else cat = 'otomobil';

    return {
      id: 100000 + i + (startPrice / 1000),
      title: \`\${prefix} - Fırsat İlan \${i + 1} \${i % 2 === 0 ? 'Sahibinden' : 'Emlakçıdan'}\`,
      image: \`https://picsum.photos/seed/\${prefix}\${i}/300/200\`,
      price: priceValue.toLocaleString('tr-TR', { maximumFractionDigits: 0 }),
      rawPrice: priceValue,
      currency: 'TL',
      city: city,
      district: district,
      location: \`\${city} / \${district}\`,
      dateRaw: new Date(2025, 0, 24).getTime() - (i * 3600000),
      date: '25 Ocak 2025',
      category: cat, // Detaylı kategori atandı
      attributes: [
        { label: 'İlan No', value: \`102938\${i}\` },
        { label: 'Kimden', value: 'Sahibinden' },
      ],
      description: '<p>Bu ilan sahibinden.com klon projesi için oluşturulmuş örnek bir veridir.</p>',
      room: ['1+1', '2+1', '3+1'][i % 3],
      year: 2015 + (i % 10),
      km: 10000 * (i % 20)
    };
  });
};

export const ads = generateAds(120, 'İlan', 1000000);
export const urgentAds = generateAds(10, 'Acil', 750000);
export const interestingAds = generateAds(10, 'İlginç', 5000000);

export function getAdById(id: any) {
  const allAds = [...ads, ...urgentAds, ...interestingAds];
  return allAds.find(ad => ad.id === Number(id));
}

export function getSellerById(id: any) { return { id, name: 'Ahmet Yılmaz', avatar: 'AY', rating: 4.5, joined: '2020', lastSeen: 'Bugün', isVerified: true, reviews: [] }; }
export function getAdsBySeller(id: any) { return ads.slice(0, 5); }

export function searchAds(params: any) {
  let filtered = [...ads, ...urgentAds, ...interestingAds];

  if (params.q) {
    const q = params.q.toLowerCase();
    filtered = filtered.filter(ad => ad.title.toLowerCase().includes(q));
  }

  // Akıllı Kategori Filtresi (Lokal Veri İçin)
  if (params.category) {
     const slug = params.category;
     filtered = filtered.filter(ad => {
        // Tam eşleşme (örn: 'konut-satilik')
        if (ad.category === slug) return true;

        // Üst kategori mantığı (Basitçe slug içeriyorsa veya özel map)
        if (slug === 'emlak') return ad.category.includes('konut') || ad.category.includes('isyeri') || ad.category.includes('arsa');
        if (slug === 'konut') return ad.category.includes('konut');
        if (slug === 'vasita') return ad.category === 'otomobil' || ad.category === 'suv' || ad.category === 'motosiklet';

        return false;
     });
  }

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
`;

writeFile("lib/data.ts", dataTsContent);
console.log(colors.bold + "\\n🎉 VERİ YAPISI GÜNCELLENDİ!" + colors.reset);
