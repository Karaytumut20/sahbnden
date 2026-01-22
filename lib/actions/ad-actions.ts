'use server'
import { createClient } from '@/lib/supabase/server';
import { runServerAction } from '@/lib/safe-action';
import { revalidatePath } from 'next/cache';
import { PERMISSIONS, checkPermission } from '@/lib/permissions';
import { logActivity } from '@/lib/logger';

// İlan Silme (Güvenli & Loglu & Yetki Kontrollü)
export async function deleteAdSafeAction(adId: number) {
    return await runServerAction('DELETE_AD', async () => {
        const supabase = await createClient();

        // 1. Kullanıcıyı al
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Oturum açmanız gerekiyor.');

        // 2. İlanı ve sahibini kontrol et
        const { data: ad } = await supabase.from('ads').select('*').eq('id', adId).single();
        if (!ad) throw new Error('İlan bulunamadı.');

        // 3. Yetki Kontrolü (RBAC)
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        const fullUser = { ...user, ...profile };

        if (!checkPermission(fullUser, PERMISSIONS.CAN_DELETE_AD, ad)) {
            // Güvenlik ihlali logla
            await logActivity(user.id, 'SECURITY_ALERT', { attempt: 'DELETE_AD', adId, reason: 'Unauthorized' });
            throw new Error('Bu işlemi yapmaya yetkiniz yok.');
        }

        // 4. İşlemi Yap (Soft Delete: Pasife al)
        const { error } = await supabase.from('ads').update({ status: 'pasif' }).eq('id', adId);
        if (error) throw new Error(error.message);

        // 5. Logla
        await logActivity(user.id, 'DELETE_AD', { adId });

        revalidatePath('/bana-ozel/ilanlarim');
        return { message: 'İlan başarıyla kaldırıldı.' };
    });
}

// İlanı Vitrine Taşı (Sadece Admin veya Dopingli - Örnek Logic)
export async function bumpAdSafeAction(adId: number) {
    return await runServerAction('BUMP_AD', async () => {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Giriş yapmalısınız.');

        // Basit güncelleme örneği
        const { error } = await supabase.from('ads').update({ created_at: new Date().toISOString() }).eq('id', adId);
        if (error) throw new Error('Güncelleme başarısız.');

        revalidatePath('/');
        return { message: 'İlan güncellendi.' };
    });
}