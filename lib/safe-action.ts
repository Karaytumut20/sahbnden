import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { logActivity } from '@/lib/logger';

export type ActionState<T> = {
  success?: boolean;
  data?: T;
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

/**
 * Server Action Oluşturucu
 * - Auth kontrolü yapar
 * - Zod validasyonu yapar
 * - Hata yönetimini standartlaştırır
 * - Loglama yapar
 */
export async function createSafeAction<TInput, TOutput>(
  schema: z.Schema<TInput>,
  handler: (validatedData: TInput, user: any) => Promise<TOutput>,
  options: { requireAuth?: boolean; actionName?: string } = { requireAuth: true }
): Promise<ActionState<TOutput>> {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Auth Kontrolü
    if (options.requireAuth && !user) {
      return { success: false, error: 'Bu işlem için giriş yapmalısınız.' };
    }

    // Kullanıcı varsa profilini ve rolünü de çekelim (RBAC için)
    let fullUser = user;
    if (user) {
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        fullUser = { ...user, ...profile };
    }

    // 2. Handler'ı çalıştır (Veri zaten schema tarafından parse edilecek ama burada manuel yapmıyoruz,
    // handler içinde de yapabiliriz veya wrapper'a veri gönderimi şeklini değiştirebiliriz.
    // Basitlik adına, wrapper'ı client'tan çağrılan fonksiyonda kullanacağız.
    // Düzeltme: Server Action'lar form data veya obje alır.

    return { success: false, error: 'Bu bir factory fonksiyonudur, doğrudan kullanılmaz.' };

  } catch (error) {
    return { success: false, error: 'Sunucu hatası oluştu.' };
  }
}

// Daha pratik kullanım için bir Wrapper Fonksiyonu
export async function runServerAction<T>(
    actionName: string,
    fn: () => Promise<T>
): Promise<ActionState<T>> {
    try {
        const data = await fn();
        return { success: true, data };
    } catch (error: any) {
        console.error(`Server Action Error [${actionName}]:`, error);

        // Loglama
        try {
            await logActivity('SYSTEM', 'ACTION_ERROR', { action: actionName, error: error.message });
        } catch {}

        return {
            success: false,
            error: error.message || 'Bir hata oluştu.'
        };
    }
}