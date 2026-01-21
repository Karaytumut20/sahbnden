import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwind classlarını birleştirmek için (çakışmaları önler)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Para birimi formatlayıcı (Örn: 1.250.000 TL)
export function formatPrice(price: number | string | null | undefined, currency: string = 'TL') {
  if (price === null || price === undefined) return '0 ' + currency;
  const numPrice = typeof price === 'string' ? parseFloat(price) : price;
  return new Intl.NumberFormat('tr-TR', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(numPrice) + ' ' + currency;
}

// Tarih formatlayıcı (Bugün, Dün, 12.05.2023)
export function formatDate(dateString: string | null | undefined) {
  if (!dateString) return '';

  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Bugün';
  if (diffDays === 1) return 'Dün';
  return date.toLocaleDateString('tr-TR');
}

// Metin kısaltıcı (Lorem ipsum dol...)
export function truncate(str: string, length: number) {
  if (!str) return '';
  return str.length > length ? str.substring(0, length) + '...' : str;
}