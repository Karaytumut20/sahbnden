const fs = require("fs");
const path = require("path");

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
};

console.log(
  colors.cyan +
    colors.bold +
    "\n🚑 FINAL CSS REPAIR: MIGRATING TO TAILWIND V4...\n" +
    colors.reset,
);

function writeFile(filePath, content) {
  const absolutePath = path.join(__dirname, filePath);
  const dir = path.dirname(absolutePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(absolutePath, content.trim());
  console.log(`${colors.green}✔ Düzeltildi:${colors.reset} ${filePath}`);
}

// =============================================================================
// 1. APP/GLOBALS.CSS (TAILWIND V4 FORMATI)
// =============================================================================
// Not: v4'te @tailwind direktifleri yerine @import kullanılır.
// Renkler ve fontlar doğrudan CSS içinde @theme bloğunda tanımlanabilir.
const globalCssContent = `
@import "tailwindcss";

@theme {
  /* Renk Paleti (Global Expansion Pack) */
  --color-background: #F8FAFC;
  --color-foreground: #0F172A;

  --color-brand-50: #EEF2FF;
  --color-brand-100: #E0E7FF;
  --color-brand-500: #6366F1;
  --color-brand-600: #4F46E5;
  --color-brand-700: #4338CA;
  --color-brand-900: #312E81;

  --color-accent-500: #f43f5e;
  --color-accent-600: #e11d48;

  --color-surface-50: #F9FAFB;
  --color-surface-100: #F3F4F6;
  --color-surface-200: #E5E7EB;
  --color-surface-white: #FFFFFF;

  /* Fontlar */
  --font-sans: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;

  /* Gölgeler */
  --shadow-soft: 0 10px 40px -10px rgba(0,0,0,0.05);
  --shadow-card: 0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.1);
  --shadow-glow: 0 0 20px rgba(99, 102, 241, 0.3);

  /* Kenarlıklar */
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-3xl: 24px;
}

/* Özel Stiller */
body {
  background-color: var(--color-background);
  color: var(--color-foreground);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}

/* Scrollbar Güzelleştirme */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #CBD5E1;
  border-radius: 10px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94A3B8;
}

/* Animasyonlar */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-in {
  animation: fadeIn 0.3s ease-out;
}
`;
writeFile("app/globals.css", globalCssContent);

// =============================================================================
// 2. POSTCSS.CONFIG.MJS (V4 UYUMLU PLUGIN)
// =============================================================================
const postcssConfigContent = `
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
  },
};
export default config;
`;
writeFile("postcss.config.mjs", postcssConfigContent);

console.log(
  colors.green +
    "\\n✅ CSS MOTORU ONARILDI! (Tailwind v4 Upgrade)" +
    "\\n⚠️ ÖNEMLİ: Değişikliklerin etkili olması için terminalde şu adımları yapmanız gerekebilir:" +
    "\\n   1. Sunucuyu durdurun (Ctrl+C)" +
    "\\n   2. '.next' klasörünü silin (Önbelleği temizlemek için)" +
    "\\n   3. 'npm run dev' komutunu tekrar çalıştırın." +
    colors.reset,
);
