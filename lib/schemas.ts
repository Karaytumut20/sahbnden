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

  // Vasıta
  brand: z.string().optional().nullable(),
  series: z.string().optional().nullable(),
  model: z.string().optional().nullable(),
  year: z.number().optional().nullable(),
  km: z.number().optional().nullable(),
  gear: z.string().optional().nullable(),
  fuel: z.string().optional().nullable(),
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
  heavy_damage: z.boolean().optional().nullable(),

  // Bilgisayar (YENİ)
  processor: z.string().optional().nullable(),
  ram: z.string().optional().nullable(),
  screen_size: z.string().optional().nullable(),
  gpu_capacity: z.string().optional().nullable(),
  resolution: z.string().optional().nullable(),
  ssd_capacity: z.string().optional().nullable(),

  technical_specs: z.any().optional().nullable()

}).superRefine((data, ctx) => {
  if (data.category.includes('konut') || data.category.includes('isyeri')) {
    if (!data.m2) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Metrekare zorunludur", path: ['m2'] });
  }
  if (data.category.includes('otomobil') || data.category.includes('suv')) {
    if (!data.brand) ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Marka zorunludur", path: ['brand'] });
  }
});

export type AdFormValues = z.infer<typeof adSchema>;