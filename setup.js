const fs = require("fs");
const path = require("path");

console.log(
  "\x1b[36m%s\x1b[0m",
  "🚀 Dark Mode Projeden Tamamen Kaldırılıyor...",
);

// 1. Providers.tsx: Temayı "Light" Olarak Kilitle
// "forcedTheme" özelliği sayesinde kullanıcı istese de dark mode'a geçemez.
const providersPath = path.join(__dirname, "components", "Providers.tsx");

if (fs.existsSync(providersPath)) {
  let content = fs.readFileSync(providersPath, "utf8");

  // ThemeProvider'ı bul ve zorunlu light mod ekle
  if (content.includes("ThemeProvider")) {
    const regex = /<ThemeProvider\s+([^>]*)>/;
    const match = content.match(regex);

    if (match) {
      const oldTag = match[0];
      // forcedTheme="light" -> Temayı kilitler
      // enableSystem={false} -> Cihaz ayarını görmezden gelir
      const newTag =
        '<ThemeProvider attribute="class" forcedTheme="light" enableSystem={false} disableTransitionOnChange>';

      content = content.replace(oldTag, newTag);
      fs.writeFileSync(providersPath, content, "utf8");
      console.log(
        '✅ components/Providers.tsx: Tema "Light" moduna kilitlendi.',
      );
    }
  }
} else {
  console.log("⚠️ Providers.tsx bulunamadı.");
}

// 2. ThemeToggle.tsx: Butonu Görünmez Yap (Silme, İçini Boşalt)
// Dosyayı silersek import hatası alırız. O yüzden "null" döndüren boş bir bileşen yapıyoruz.
const togglePath = path.join(__dirname, "components", "ThemeToggle.tsx");

if (fs.existsSync(togglePath)) {
  const nullComponent = `
export default function ThemeToggle() {
  // Dark mode kaldırıldığı için bu buton artık hiçbir şey göstermiyor.
  return null;
}
`;
  fs.writeFileSync(togglePath, nullComponent.trim(), "utf8");
  console.log(
    "✅ components/ThemeToggle.tsx: Tema değiştirme butonu koddan gizlendi.",
  );
} else {
  console.log("ℹ️ ThemeToggle.tsx bulunamadı.");
}

// 3. Tailwind Config: Dark Mode Ayarını Sil
// Artık dark class'ına ihtiyacımız yok.
const tailwindPath = path.join(__dirname, "tailwind.config.ts");
if (fs.existsSync(tailwindPath)) {
  let twContent = fs.readFileSync(tailwindPath, "utf8");

  // "darkMode: 'class'" satırını siliyoruz
  if (twContent.includes("darkMode:")) {
    twContent = twContent.replace(/darkMode:\s*['"][^'"]*['"],?/, "");
    fs.writeFileSync(tailwindPath, twContent, "utf8");
    console.log("✅ tailwind.config.ts: Dark mode ayarı temizlendi.");
  }
}

console.log("\n-------------------------------------------------------------");
console.log("🎉 İŞLEM TAMAM: Dark Mode Kaldırıldı!");
console.log("-------------------------------------------------------------");
console.log("Değişiklikleri uygulamak için sırasıyla şunları yap:");
console.log("1. node setup.js");
console.log("2. git add .");
console.log('3. git commit -m "Remove dark mode completely"');
console.log("4. git push");
console.log("-------------------------------------------------------------");
