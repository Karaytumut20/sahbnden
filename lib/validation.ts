import { AdFormData } from '@/types';

type ValidationResult = {
  isValid: boolean;
  errors: Record<string, string>;
};

export function validateAdForm(data: AdFormData, categorySlug: string): ValidationResult {
  const errors: Record<string, string> = {};
  const isVehicle = categorySlug.includes('otomobil') || categorySlug.includes('suv') || categorySlug.includes('moto');
  const isRealEstate = categorySlug.includes('konut') || categorySlug.includes('isyeri') || categorySlug.includes('arsa');

  // Temel Kontroller
  if (!data.title || data.title.length < 5) errors.title = "Başlık çok kısa.";
  if (data.title && data.title.length > 100) errors.title = "Başlık çok uzun.";
  if (!data.description || data.description.length < 20) errors.description = "Açıklama yetersiz.";

  // Fiyat Kontrolü (Negatif olamaz)
  if (!data.price || Number(data.price) <= 0) errors.price = "Geçerli bir fiyat giriniz.";

  if (!data.city) errors.city = "Lütfen il seçiniz.";
  if (!data.district) errors.district = "Lütfen ilçe giriniz.";

  // Emlak Mantık Kontrolleri
  if (isRealEstate) {
    if (!data.m2 || Number(data.m2) <= 0) errors.m2 = "Metrekare 0 olamaz.";
    if (!data.room) errors.room = "Oda sayısı seçiniz.";
  }

  // Vasıta Mantık Kontrolleri
  if (isVehicle) {
    const currentYear = new Date().getFullYear();
    const nextYear = currentYear + 1; // Gelecek yıl modelleri olabilir

    if (!data.year || Number(data.year) < 1950 || Number(data.year) > nextYear) {
      errors.year = "Geçerli bir model yılı giriniz.";
    }
    if (data.km === undefined || data.km === null || Number(data.km) < 0) {
      errors.km = "Kilometre negatif olamaz.";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}