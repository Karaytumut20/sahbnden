export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'user' | 'store' | 'admin';
  phone: string | null;
  show_phone?: boolean;
  created_at: string;
}

export interface Notification {
  id: number;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
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

  // Emlak
  room?: string;
  m2?: number;
  floor?: number;
  heating?: string;

  // Vasıta Genel
  brand?: string;
  year?: number;
  km?: number;
  gear?: string;
  fuel?: string;

  // Vasıta Detay (YENİ)
  model?: string;
  body_type?: string;
  motor_power?: string;
  engine_capacity?: string;
  traction?: string;
  color?: string;
  warranty?: boolean;
  plate_type?: string;
  exchange?: boolean;
  seller_type?: string;
  vehicle_status?: string;

  profiles?: Profile;
  view_count?: number;
}

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
  model?: string;
  year?: string | number;
  km?: string | number;
  gear?: string;
  fuel?: string;
  body_type?: string;
  motor_power?: string;
  engine_capacity?: string;
  traction?: string;
  color?: string;
  warranty?: string;
  plate_type?: string;
  exchange?: string;
  seller_type?: string;
  vehicle_status?: string;
}