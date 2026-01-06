
// Yardım Merkezi Verileri
export const helpCategories = [
  { id: 'uyelik', title: 'Üyelik İşlemleri', icon: 'User', desc: 'Giriş, kayıt, şifre işlemleri' },
  { id: 'ilan', title: 'İlan Verme & Düzenleme', icon: 'Edit', desc: 'İlan kuralları, fotoğraf yükleme' },
  { id: 'doping', title: 'Doping & Ödemeler', icon: 'Zap', desc: 'Doping çeşitleri, fatura işlemleri' },
  { id: 'guvenlik', title: 'Güvenlik & Şikayet', icon: 'Shield', desc: 'Dolandırıcılık uyarısı, ihbar' },
];

export const faqItems = [
  {
    id: 1,
    category: 'uyelik',
    question: 'Şifremi unuttum, ne yapmalıyım?',
    answer: 'Giriş yap sayfasındaki "Şifremi Unuttum" linkine tıklayarak e-posta adresinize sıfırlama bağlantısı gönderebilirsiniz.'
  },
  {
    id: 2,
    category: 'ilan',
    question: 'İlanım neden onaylanmadı?',
    answer: 'İlanlarınız editörlerimiz tarafından 6 saat içinde incelenir. İlan verme kurallarına uymayan (hatalı kategori, uygunsuz görsel vb.) ilanlar reddedilir.'
  },
  {
    id: 3,
    category: 'doping',
    question: 'Doping ücretleri iade edilir mi?',
    answer: 'Satın alınan doping hizmeti kullanıldıktan sonra iade edilemez. Ancak teknik bir hata durumunda destek ekibimizle iletişime geçebilirsiniz.'
  },
  {
    id: 4,
    category: 'guvenlik',
    question: 'Kapora dolandırıcılığına karşı ne yapmalıyım?',
    answer: 'Görmediğiniz ürün veya emlak için asla kapora göndermeyiniz. sahibinden.com "Güvenli Ödeme" sistemi haricinde yapılan ödemelerden sorumlu değildir.'
  },
];

// Kurumsal Sayfa İçerikleri
export const corporatePages: Record<string, { title: string, content: string }> = {
  'hakkimizda': {
    title: 'Hakkımızda',
    content: `
      <p class="mb-4">sahibinden.com klon projesi, Next.js ve modern web teknolojilerini öğrenmek amacıyla geliştirilmiş, gerçek olmayan bir emlak ve vasıta ilan platformudur.</p>
      <p class="mb-4">2000 yılından beri (aslında 2025'ten beri) kullanıcılarımıza en iyi deneyimi sunmayı hedefliyoruz. İnovasyon ve güvenilirlik temel ilkelerimizdir.</p>
      <h3 class="text-lg font-bold mt-6 mb-2">Vizyonumuz</h3>
      <p>Türkiye'nin en büyük ve en güvenilir ilan platformu simülasyonu olmak.</p>
    `
  },
  'kullanim-kosullari': {
    title: 'Kullanım Koşulları',
    content: `
      <p class="mb-4">Lütfen sitemizi kullanmadan önce bu koşulları dikkatlice okuyunuz.</p>
      <ol class="list-decimal pl-5 space-y-2">
        <li>Bu proje eğitim amaçlıdır, gerçek alışveriş yapılamaz.</li>
        <li>Kullanıcı verileri tarayıcınızın yerel hafızasında (localStorage) tutulur.</li>
        <li>İlanlardaki görseller ve bilgiler temsilidir.</li>
      </ol>
    `
  },
  'gizlilik-politikasi': {
    title: 'Gizlilik Politikası',
    content: `
      <p class="mb-4">Verilerinizin güvenliği bizim için önemlidir (ama aslında verilerinizi sunucuda tutmuyoruz).</p>
      <p>Çerezler sadece site tercihlerinizi (karanlık mod, favoriler vb.) hatırlamak için kullanılır.</p>
    `
  }
};
