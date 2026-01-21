export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'user' | 'store' | 'admin';
  phone: string | null;
  created_at: string;
}

export interface Category {
  id: number;
  title: string;
  slug: string;
  icon: string | null;
  parent_id: number | null;
  subs?: Category[];
}

export interface Ad {
  id: number;
  title: string;
  description: string;
  price: number;
  currency: string;
  city: string;
  district: string;
  category: string;
  image: string | null;
  images?: string[];
  status: 'yayinda' | 'onay_bekliyor' | 'pasif' | 'reddedildi';
  is_vitrin: boolean;
  is_urgent: boolean;
  user_id: string;
  created_at: string;
  // Dinamik Özellikler
  room?: string;
  m2?: number;
  floor?: number;
  heating?: string;
  brand?: string;
  model?: string;
  year?: number;
  km?: number;
  gear?: string;
  fuel?: string;
  // İlişkiler
  profiles?: Profile;
}

// Form Verisi İçin Tip
export interface AdFormData {
  title: string;
  description: string;
  price: string | number;
  currency: string;
  city: string;
  district: string;
  category?: string;
  // Emlak
  m2?: string | number;
  room?: string;
  floor?: string | number;
  heating?: string;
  // Vasıta
  brand?: string;
  year?: string | number;
  km?: string | number;
  gear?: string;
  fuel?: string;
  status_vehicle?: string;
}