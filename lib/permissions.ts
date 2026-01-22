import { User } from '@supabase/supabase-js';

export type Role = 'admin' | 'store' | 'user';

export const PERMISSIONS = {
  // İlan Yetkileri
  CAN_DELETE_AD: (user: any, ad: any) => user?.role === 'admin' || user?.id === ad.user_id,
  CAN_EDIT_AD: (user: any, ad: any) => user?.role === 'admin' || user?.id === ad.user_id,
  CAN_VIEW_ADMIN_PANEL: (user: any) => user?.role === 'admin',

  // Mağaza Yetkileri
  CAN_CREATE_STORE: (user: any) => user?.role === 'user', // Sadece normal üyeler mağaza açabilir (zaten mağazası olmayanlar)
  CAN_MANAGE_STORE: (user: any) => user?.role === 'store',
};

/**
 * Kullanıcı yetkisini kontrol eder.
 * @param user Mevcut kullanıcı (Rolü ile birlikte)
 * @param permission Kontrol edilecek yetki fonksiyonu
 * @param resource (Opsiyonel) Üzerinde işlem yapılacak kaynak (örn: ilan)
 */
export function checkPermission(user: any, permission: (u: any, r?: any) => boolean, resource?: any) {
  if (!user) return false;
  return permission(user, resource);
}