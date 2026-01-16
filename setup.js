const fs = require("fs");
const path = require("path");

console.log(
  "\x1b[36m%s\x1b[0m",
  "🚀 Dark Mode Tamamen Kazınıyor (Always White Fix)...",
);

// 1. Tailwind Config: "class" stratejisini geri getir
// NEDEN? Eğer bunu silersek Tailwind sistem ayarına bakar.
// "class" yapıp o class'ı hiç vermezsek, sistem ne olursa olsun site BEYAZ kalır.
const tailwindPath = path.join(__dirname, "tailwind.config.ts");
if (fs.existsSync(tailwindPath)) {
  let twContent = fs.readFileSync(tailwindPath, "utf8");

  // Önce varsa eski ayarı temizle
  twContent = twContent.replace(/darkMode:\s*['"][^'"]*['"],?/, "");

  // Config içine darkMode: 'class' ekle
  if (twContent.includes("const config: Config = {")) {
    twContent = twContent.replace(
      "const config: Config = {",
      "const config: Config = {\n  darkMode: 'class', // Sistem ayarini yoksaymak icin kritik ayar",
    );
    fs.writeFileSync(tailwindPath, twContent, "utf8");
    console.log(
      '✅ tailwind.config.ts: "darkMode: class" ayarı eklendi (Otomatik kararma engellendi).',
    );
  }
}

// 2. Globals.css: Medya Sorgularını Temizle
// CSS içinde "@media (prefers-color-scheme: dark)" varsa, Tailwind'den bağımsız karartma yapar. Bunları siliyoruz.
const cssPath = path.join(__dirname, "app", "globals.css");
if (fs.existsSync(cssPath)) {
  let cssContent = fs.readFileSync(cssPath, "utf8");

  // Basit bir yöntemle dark mode bloğunu etkisiz hale getiriyoruz
  // Genellikle :root { ... } @media (prefers-color-scheme: dark) { ... } şeklindedir.

  if (cssContent.includes("@media (prefers-color-scheme: dark)")) {
    // Media query başlangıcını bulup içini boşaltmak zor olabilir,
    // en garantisi bu ifadeyi bozmak.
    cssContent = cssContent.replace(
      /@media \(prefers-color-scheme: dark\)/g,
      "@media (prefers-color-scheme: light)",
    );

    // Ayrıca .dark sınıflarını da temizleyelim
    // cssContent = cssContent.replace(/\.dark/g, '.ignore-dark-mode');

    fs.writeFileSync(cssPath, cssContent, "utf8");
    console.log(
      "✅ app/globals.css: Dark mode medya sorguları etkisiz hale getirildi.",
    );
  } else {
    console.log("ℹ️ app/globals.css temiz görünüyor.");
  }
}

// 3. Providers.tsx: Kesin Light Zorlaması
const providersPath = path.join(__dirname, "components", "Providers.tsx");
if (fs.existsSync(providersPath)) {
  let content = fs.readFileSync(providersPath, "utf8");

  // forcedTheme="light" olduğundan emin olalım
  if (!content.includes('forcedTheme="light"')) {
    const regex = /<ThemeProvider\s+([^>]*)>/;
    const match = content.match(regex);
    if (match) {
      const newTag =
        '<ThemeProvider attribute="class" forcedTheme="light" enableSystem={false} disableTransitionOnChange>';
      content = content.replace(match[0], newTag);
      fs.writeFileSync(providersPath, content, "utf8");
      console.log("✅ components/Providers.tsx: Tema Light olarak kilitlendi.");
    }
  } else {
    console.log("ℹ️ Providers.tsx zaten kilitli.");
  }
}

// 4. ThemeToggle.tsx: Emin olmak için boşalt
const togglePath = path.join(__dirname, "components", "ThemeToggle.tsx");
if (fs.existsSync(togglePath)) {
  const nullComponent = `export default function ThemeToggle() { return null; }`;
  fs.writeFileSync(togglePath, nullComponent, "utf8");
  console.log("✅ components/ThemeToggle.tsx: Buton gizlendi.");
}

console.log("\n-------------------------------------------------------------");
console.log("🎉 İŞLEM TAMAM: Artık site KESİNLİKLE kararmaz.");
console.log("Lütfen şu komutları sırasıyla çalıştır:");
console.log("1. node setup.js");
console.log("2. git add .");
console.log('3. git commit -m "Force permanent white theme"');
console.log("4. git push");
console.log("-------------------------------------------------------------");
