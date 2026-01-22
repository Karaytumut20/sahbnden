// Adapter Design Pattern: Ödeme sağlayıcılarını soyutlar.
// İleride IyzicoAdapter, StripeAdapter eklenebilir.

export interface PaymentProcessor {
  processPayment(amount: number, cardInfo: any): Promise<{ success: boolean; transactionId?: string; error?: string }>;
}

export class MockPaymentProcessor implements PaymentProcessor {
  async processPayment(amount: number, cardInfo: any): Promise<{ success: boolean; transactionId?: string; error?: string }> {
    // Simülasyon: 1.5 saniye bekle
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Basit Validasyon Simülasyonu
    if (amount <= 0) return { success: false, error: 'Geçersiz tutar.' };

    // Rastgele başarılı/başarısız (Demo için her zaman başarılı yapıyoruz)
    return {
      success: true,
      transactionId: `TRX-${Math.random().toString(36).substring(2, 9).toUpperCase()}`
    };
  }
}

// Factory
export function getPaymentProcessor(): PaymentProcessor {
  // Config'e göre gerçek veya mock işlemci döndürülür
  return new MockPaymentProcessor();
}