'use server'
import { createClient } from '@/lib/supabase/server';
import { runServerAction } from '@/lib/safe-action';
import { getPaymentProcessor } from '@/lib/payment/adapter';
import { revalidatePath } from 'next/cache';
import { logActivity } from '@/lib/logger';

// Cüzdan Bilgilerini Getir
export async function getWalletServer() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data } = await supabase.from('wallets').select('*').eq('user_id', user.id).single();
    // Eğer cüzdan yoksa oluştur (Fail-safe)
    if (!data) {
        const { data: newWallet } = await supabase.from('wallets').insert([{ user_id: user.id }]).select().single();
        return newWallet;
    }
    return data;
}

// İşlem Geçmişini Getir
export async function getTransactionsServer() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // Önce cüzdan ID'yi bul
    const { data: wallet } = await supabase.from('wallets').select('id').eq('user_id', user.id).single();
    if (!wallet) return [];

    const { data } = await supabase.from('transactions')
        .select('*')
        .eq('wallet_id', wallet.id)
        .order('created_at', { ascending: false });

    return data || [];
}

// Bakiye Yükle (Deposit)
export async function depositToWalletAction(amount: number, cardInfo: any) {
    return await runServerAction('DEPOSIT_WALLET', async () => {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Giriş yapmalısınız.');

        // 1. Ödeme İşlemi (Adapter üzerinden)
        const processor = getPaymentProcessor();
        const paymentResult = await processor.processPayment(amount, cardInfo);

        if (!paymentResult.success) {
            throw new Error(paymentResult.error || 'Ödeme alınamadı.');
        }

        // 2. Cüzdanı Bul
        const { data: wallet } = await supabase.from('wallets').select('*').eq('user_id', user.id).single();
        if (!wallet) throw new Error('Cüzdan bulunamadı.');

        // 3. Bakiyeyi Güncelle (Atomic Increment yerine basit update kullanıyoruz, production'da RPC kullanılmalı)
        // RPC Örneği: await supabase.rpc('increment_balance', { wallet_id: wallet.id, amount: amount });
        // Şimdilik JS ile yapıyoruz:
        const newBalance = Number(wallet.balance) + amount;

        await supabase.from('wallets').update({ balance: newBalance, updated_at: new Date().toISOString() }).eq('id', wallet.id);

        // 4. İşlem Kaydı (Transaction Log)
        await supabase.from('transactions').insert([{
            wallet_id: wallet.id,
            type: 'deposit',
            amount: amount,
            description: 'Kredi Kartı ile Yükleme',
            reference_id: paymentResult.transactionId
        }]);

        await logActivity(user.id, 'WALLET_DEPOSIT', { amount, trxId: paymentResult.transactionId });

        revalidatePath('/bana-ozel/cuzdan');
        return { success: true, newBalance };
    });
}