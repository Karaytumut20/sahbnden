import { AdFormData } from '@/types';

type ValidationResult = {
  isValid: boolean;
  errors: Record<string, string>;
};

export function validateAdForm(data: AdFormData, categorySlug: string): ValidationResult {
  const errors: Record<string, string> = {};
  const isVehicle = categorySlug.includes('otomobil') || categorySlug.includes('suv') || categorySlug.includes('moto');
  const isRealEstate = categorySlug.includes('konut') || categorySlug.includes('isyeri') || categorySlug.includes('arsa');

  // 1. Temel Kontroller
  if (!data.title || data.title.length < 5) {
    errors.title = "İlan başlığı en az 5 karakter olmalıdır.";
  }
  if (!data.description || data.description.length < 10) {
    errors.description = "Açıklama çok kısa (en az 10 karakter).";
  }
  if (!data.price || Number(data.price) <= 0) {
    errors.price = "Geçerli bir fiyat giriniz.";
  }
  if (!data.city) errors.city = "Lütfen il seçiniz.";
  if (!data.district) errors.district = "Lütfen ilçe giriniz.";

  // 2. Emlak Kontrolleri
  if (isRealEstate) {
    if (!data.m2 || Number(data.m2) <= 0) errors.m2 = "Metrekare bilgisi zorunludur.";
    if (!data.room) errors.room = "Oda sayısı seçiniz.";
  }

  // 3. Vasıta Kontrolleri
  if (isVehicle) {
    const currentYear = new Date().getFullYear();
    if (!data.year || Number(data.year) < 1900 || Number(data.year) > currentYear) {
      errors.year = "Geçerli bir model yılı giriniz.";
    }
    if (data.km === undefined || data.km === null || Number(data.km) < 0) {
      errors.km = "Kilometre giriniz.";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}