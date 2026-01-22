import { createStaticClient } from '@/lib/supabase/server';

// Şehirleri Getir (Cache'lenebilir)
export async function getProvinces() {
  const supabase = createStaticClient();
  const { data } = await supabase.from('provinces').select('*').order('name');
  // Eğer veritabanı boşsa (SQL çalıştırılmadıysa) fallback verisi dön
  if (!data || data.length === 0) {
      return [
          { id: 34, name: 'İstanbul' }, { id: 6, name: 'Ankara' }, { id: 35, name: 'İzmir' },
          { id: 7, name: 'Antalya' }, { id: 16, name: 'Bursa' }
      ];
  }
  return data;
}

// İlçeleri Getir
export async function getDistrictsByProvince(provinceName: string) {
  const supabase = createStaticClient();

  // Önce province id'yi bul
  const { data: province } = await supabase.from('provinces').select('id').eq('name', provinceName).single();

  if (!province) return []; // Fallback mekanizması client tarafında locations.ts ile yönetilebilir

  const { data } = await supabase.from('districts').select('*').eq('province_id', province.id).order('name');
  return data || [];
}

// Şehir Bazlı İlan Sayılarını Getir (Faceted Search)
export async function getCityAdCounts() {
  const supabase = createStaticClient();
  const { data, error } = await supabase.rpc('get_ad_counts_by_city');
  if (error) return [];
  return data as { city_name: string; count: number }[];
}