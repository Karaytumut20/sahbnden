const fs = require("fs");
const path = require("path");

console.log(
  "\x1b[36m%s\x1b[0m",
  "🚀 Hata Düzeltme (Use Client Fix) Başlatılıyor...",
);

const odemePagePath = path.join(
  __dirname,
  "app",
  "ilan-ver",
  "odeme",
  "page.tsx",
);

if (fs.existsSync(odemePagePath)) {
  let content = fs.readFileSync(odemePagePath, "utf8");

  // Önce dosyadaki satırları ayıralım
  let lines = content.split("\n");

  // Temizlik: Var olan "use client" ve benim eklediğim "Suspense" satırlarını silelim
  // (Bunları temizleyip en başa düzgün sırayla ekleyeceğiz)
  lines = lines.filter(
    (line) =>
      !line.trim().includes('"use client"') &&
      !line.trim().includes("'use client'") &&
      !line.trim().includes("import { Suspense } from 'react';"),
  );

  // Dosya içeriğini tekrar birleştir (başındaki boşlukları alarak)
  let cleanContent = lines.join("\n").trim();

  // KRİTİK ADIM: Next.js kurallarına uygun sıralama
  // 1. "use client" en başta
  // 2. Importlar sonra gelir
  const newHeader = `"use client";
import { Suspense } from 'react';
`;

  const finalContent = newHeader + cleanContent;

  fs.writeFileSync(odemePagePath, finalContent, "utf8");
  console.log('✅ Ödeme sayfası düzeltildi: "use client" en başa taşındı.');
} else {
  console.log("❌ Hata: Dosya bulunamadı!");
}

console.log("\n-------------------------------------------------------------");
console.log("🎉 İŞLEM TAMAM!");
console.log("Lütfen şu komutları sırasıyla çalıştır:");
console.log("1. node setup.js");
console.log("2. git add .");
console.log('3. git commit -m "Fix use client order"');
console.log("4. git push");
console.log("-------------------------------------------------------------");
