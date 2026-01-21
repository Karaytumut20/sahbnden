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
    "\n🚀 SAHİBİNDEN CLONE - DATA DOSYASI ONARILIYOR...\n" +
    colors.reset,
);

function writeFile(filePath, content) {
  const absolutePath = path.join(__dirname, filePath);
  const dir = path.dirname(absolutePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(absolutePath, content.trim());
  console.log(`${colors.green}✔ Dosya oluşturuldu:${colors.reset} ${filePath}`);
}

// -------------------------------------------------------------------------
// LIB/DATA.TS İÇERİĞİ (Tüm Kategoriler Dahil)
// -------------------------------------------------------------------------
const dataTsContent = `
// Rastgele ilan üretici
const generateAds = (count: number, prefix: string, startPrice: number) => {
  return Array.from({ length: count }).map((_, i) => {
    const cityIndex = i % 5;
    const city = ['İstanbul', 'Ankara', 'İzmir', 'Antalya', 'Bursa'][cityIndex];
    const district = ['Merkez', 'Çankaya', 'Karşıyaka', 'Muratpaşa', 'Nilüfer'][cityIndex];
    const priceValue = startPrice + (i * 12500) + (cityIndex * 5000);

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
      category: i < 60 ? 'emlak' : 'vasita',
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

// --- FULL KATEGORİ YAPISI ---
export const categories = [
  {
    id: 'emlak',
    name: 'Emlak',
    icon: 'Home',
    slug: 'emlak',
    subs: [
      {
        id: 'konut',
        title: 'Konut',
        slug: 'konut',
        // İŞTE BURASI: Konut'un alt seçenekleri
        subs: [
            { id: 'tum-konut', title: 'Tüm Konut İlanları', slug: 'konut' },
            { id: 'satilik', title: 'Satılık', slug: 'konut-satilik' },
            { id: 'kiralik', title: 'Kiralık', slug: 'konut-kiralik' },
            { id: 'gunluk', title: 'Turistik Günlük Kiralık', slug: 'gunluk-kiralik' },
            { id: 'devren', title: 'Devren Satılık Konut', slug: 'devren-satilik-konut' }
        ]
      },
      { id: 'isyeri', title: 'İş Yeri', slug: 'is-yeri', subs: [{id:'tum-is', title:'Tüm İş Yeri İlanları', slug:'is-yeri'}] },
      { id: 'arsa', title: 'Arsa', slug: 'arsa', subs: [{id:'tum-arsa', title:'Tüm Arsa İlanları', slug:'arsa'}] },
      { id: 'bina', title: 'Bina', slug: 'bina' },
      { id: 'devremulk', title: 'Devre Mülk', slug: 'devre-mulk' },
      { id: 'turistik', title: 'Turistik Tesis', slug: 'turistik-tesis' }
    ]
  },
  {
    id: 'vasita',
    name: 'Vasıta',
    icon: 'Car',
    slug: 'vasita',
    subs: [
      { id: 'oto', title: 'Otomobil', slug: 'otomobil' },
      { id: 'suv', title: 'Arazi, SUV & Pickup', slug: 'arazi-suv-pickup' },
      { id: 'electric', title: 'Elektrikli Araçlar', slug: 'elektrikli-araclar' },
      { id: 'moto', title: 'Motosiklet', slug: 'motosiklet' },
      { id: 'minivan', title: 'Minivan & Panelvan', slug: 'minivan-panelvan' },
      { id: 'commercial', title: 'Ticari Araçlar', slug: 'ticari-araclar' },
      { id: 'rental', title: 'Kiralık Araçlar', slug: 'kiralik-araclar' },
      { id: 'marine', title: 'Deniz Araçları', slug: 'deniz-araclari' },
      { id: 'damaged', title: 'Hasarlı Araçlar', slug: 'hasarli-araclar' },
      { id: 'caravan', title: 'Karavan', slug: 'karavan' },
      { id: 'classic', title: 'Klasik Araçlar', slug: 'klasik-araclar' },
      { id: 'air', title: 'Hava Araçları', slug: 'hava-araclari' },
      { id: 'atv', title: 'ATV', slug: 'atv' },
      { id: 'utv', title: 'UTV', slug: 'utv' },
      { id: 'disabled', title: 'Engelli Plakalı Araçlar', slug: 'engelli-plakali-araclar' }
    ]
  },
  {
    id: 'alisveris',
    name: 'İkinci El ve Sıfır Alışveriş',
    icon: 'ShoppingCart',
    slug: 'alisveris',
    subs: [
      { id: 'pc', title: 'Bilgisayar', slug: 'bilgisayar' },
      { id: 'phone', title: 'Cep Telefonu & Aksesuar', slug: 'cep-telefonu-ve-aksesuar' },
      { id: 'camera', title: 'Fotoğraf & Kamera', slug: 'fotograf-ve-kamera' },
      { id: 'home-deco', title: 'Ev Dekorasyon', slug: 'ev-dekorasyon' },
      { id: 'home-elec', title: 'Ev Elektroniği', slug: 'ev-elektronigi' },
      { id: 'elec-app', title: 'Elektrikli Ev Aletleri', slug: 'elektrikli-ev-aletleri' },
      { id: 'clothing', title: 'Giyim & Aksesuar', slug: 'giyim-ve-aksesuar' },
      { id: 'watch', title: 'Saat', slug: 'saat' },
      { id: 'baby', title: 'Anne & Bebek', slug: 'anne-ve-bebek' },
      { id: 'cosmetic', title: 'Kişisel Bakım & Kozmetik', slug: 'kisisel-bakim-ve-kozmetik' },
      { id: 'hobby', title: 'Hobi & Oyuncak', slug: 'hobi-ve-oyuncak' },
      { id: 'gaming', title: 'Oyunculara Özel', slug: 'oyunculara-ozel' },
      { id: 'books', title: 'Kitap, Dergi & Film', slug: 'kitap-dergi-ve-film' },
      { id: 'music', title: 'Müzik', slug: 'muzik' },
      { id: 'sports', title: 'Spor', slug: 'spor' },
      { id: 'jewelry', title: 'Takı & Mücevher', slug: 'taki-ve-mucevher' },
      { id: 'collection', title: 'Koleksiyon', slug: 'koleksiyon' },
      { id: 'antique', title: 'Antika', slug: 'antika' },
      { id: 'garden', title: 'Bahçe & Yapı Market', slug: 'bahce-ve-yapi-market' },
      { id: 'technical', title: 'Teknik Elektronik', slug: 'teknik-elektronik' },
      { id: 'office', title: 'Ofis & Kırtasiye', slug: 'ofis-ve-kirtasiye' },
      { id: 'food', title: 'Yiyecek & İçecek', slug: 'yiyecek-ve-icecek' },
      { id: 'other', title: 'Diğer Her Şey', slug: 'diger-her-sey' }
    ]
  },
  { id: 'is-makineleri', name: 'İş Makineleri & Sanayi', icon: 'Hammer', slug: 'is-makineleri', subs: [] },
  { id: 'usta-hizmet', name: 'Ustalar ve Hizmetler', icon: 'Briefcase', slug: 'ustalar-ve-hizmetler', subs: [] },
  { id: 'ozel-ders', name: 'Özel Ders Verenler', icon: 'BookOpen', slug: 'ozel-ders-verenler', subs: [] },
  { id: 'is-ilanlari', name: 'İş İlanları', icon: 'Briefcase', slug: 'is-ilanlari', subs: [] },
  { id: 'yardimci-arayanlar', name: 'Yardımcı Arayanlar', icon: 'User', slug: 'yardimci-arayanlar', subs: [] },
  { id: 'hayvanlar-alemi', name: 'Hayvanlar Alemi', icon: 'Dog', slug: 'hayvanlar-alemi', subs: [] }
];

export function getSellerById(id: any) { return { id, name: 'Ahmet Yılmaz', avatar: 'AY', rating: 4.5, joined: '2020', lastSeen: 'Bugün', isVerified: true, reviews: [] }; }
export function getAdsBySeller(id: any) { return ads.slice(0, 5); }

export function searchAds(params: any) {
  let filtered = [...ads, ...urgentAds, ...interestingAds];

  if (params.q) {
    const q = params.q.toLowerCase();
    filtered = filtered.filter(ad => ad.title.toLowerCase().includes(q));
  }
  if (params.category) filtered = filtered.filter(ad => ad.category === params.category);
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

console.log(colors.bold + "\\n🎉 DATA GÜNCELLENDİ!" + colors.reset);
