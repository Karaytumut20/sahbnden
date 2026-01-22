// Yasaklı veya Riskli Kelimeler
export const BLACKLIST = [
  'dolandırıcı', 'kumar', 'bahis', 'illegal', 'kaçak', 'silah',
  'hack', 'warez', 'iptv', 'crack'
];

// Rakip Site İsimleri (Platform dışına yönlendirmeyi önlemek için)
export const COMPETITORS = [
  'letgo', 'dolap', 'arabam.com', 'zingat', 'hepsiemlak'
];

// Regex Desenleri
export const PATTERNS = {
  // Telefon numarası yakalama (05XX, 5XX, aralara boşluk/nokta koyma vb.)
  PHONE: /(0?5d{2})[s.-]?d{3}[s.-]?d{2}[s.-]?d{2}/g,

  // Email yakalama
  EMAIL: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}/g,

  // Büyük harf kullanımı (Bağırma tespiti)
  ALL_CAPS: /^[^a-z]*$/
};