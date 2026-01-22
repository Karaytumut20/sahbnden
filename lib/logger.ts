import { createClient } from '@/lib/supabase/server';

/**
 * Kritik işlemleri veritabanına kaydeder.
 * @param userId İşlemi yapan kullanıcı
 * @param action İşlem tipi (örn: 'CREATE_AD')
 * @param metadata İşlem detayları
 */
export async function logActivity(userId: string, action: string, metadata: any = {}) {
  try {
    const supabase = await createClient();

    // Loglama işlemi ana akışı bloklamamalı (await kullanmıyoruz veya hata fırlatmıyoruz)
    const { error } = await supabase.from('audit_logs').insert({
      user_id: userId,
      action,
      metadata,
    });

    if (error) console.error('Audit log insert error:', error);
  } catch (error) {
    console.error('Audit log system error:', error);
  }
}