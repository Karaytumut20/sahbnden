import { z } from 'zod';

export const adSchema = z.object({
  title: z.string().min(5, "Başlık en az 5 karakter olmalıdır").max(100, "Başlık çok uzun"),
  description: z.string().min(10, "Açıklama en az 10 karakter olmalıdır"),
  price: z.number({ invalid_type_error: "Geçerli bir fiyat giriniz" }).min(0, "Fiyat 0'dan küçük olamaz"),
  currency: z.enum(['TL', 'USD', 'EUR', 'GBP']),
  city: z.string().min(1, "İl seçimi zorunludur"),
  district: z.string().min(1, "İlçe seçimi zorunludur"),
  category: z.string().min(1, "Kategori seçimi zorunludur"),
  image: z.string().nullable().optional(),
  images: z.array(z.string()).optional(),

  // Emlak
  room: z.string().optional().nullable(),
  m2: z.number().optional().nullable(),
  floor: z.number().optional().nullable(),
  heating: z.string().optional().nullable(),

  // Vasıta (Temel)
  brand: z.string().optional().nullable(),
  series: z.string().optional().nullable(),
  model: z.string().optional().nullable(),
  year: z.number().optional().nullable(),
  km: z.number().optional().nullable(),
  gear: z.string().optional().nullable(),
  fuel: z.string().optional().nullable(),

  // Vasıta (Detay)
  body_type: z.string().optional().nullable(),
  motor_power: z.string().optional().nullable(),
  engine_capacity: z.string().optional().nullable(),
  traction: z.string().optional().nullable(),
  color: z.string().optional().nullable(),
  warranty: z.boolean().optional().nullable(),
  exchange: z.boolean().optional().nullable(),
  plate_type: z.string().optional().nullable(),
  seller_type: z.string().optional().nullable(),
  vehicle_status: z.string().optional().nullable(),
  heavy_damage: z.boolean().optional().nullable(), // YENİ

  // Teknik Özellikler (JSONB)
  technical_specs: z.any().optional().nullable()

}).superRefine((data, ctx) => {
  // Emlak Özel Kontrolleri
  if (data.category.includes('konut') || data.category.includes('isyeri')) {
    if (!data.m2) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Metrekare zorunludur", path: ['m2'] });
    if (!data.room && data.category.includes('konut')) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Oda sayısı zorunludur", path: ['room'] });
  }
  // Vasıta Özel Kontrolleri
  if (data.category.includes('otomobil') || data.category.includes('suv')) {
    if (!data.brand) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Marka zorunludur", path: ['brand'] });
    if (!data.km) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Kilometre zorunludur", path: ['km'] });
    if (!data.year) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Yıl zorunludur", path: ['year'] });
    if (!data.fuel) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Yakıt tipi zorunludur", path: ['fuel'] });
    if (!data.gear) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Vites tipi zorunludur", path: ['gear'] });
  }
});

export type AdFormValues = z.infer<typeof adSchema>;