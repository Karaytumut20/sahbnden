import { logActivity } from './logger';

/**
 * E-posta Gönderim Servisi (Simülasyon)
 * Gerçek projede: Resend, SendGrid veya AWS SES kullanılır.
 */
export async function sendEmail(to: string, subject: string, html: string) {
  console.log(`
  📧 [EMAIL SENT]
  To: ${to}
  Subject: ${subject}
  ---------------------
  ${html.substring(0, 100)}...
  `);

  // Loglama sistemine de kayıt atalım
  await logActivity('SYSTEM', 'SEND_EMAIL', { to, subject });

  return { success: true };
}

export const EMAIL_TEMPLATES = {
  AD_APPROVED: (userName: string, adTitle: string, adId: number) => ({
    subject: 'İlanınız Yayında! 🎉',
    html: `<p>Sayın <strong>${userName}</strong>,</p><p>"${adTitle}" başlıklı ilanınız onaylanmış ve yayına alınmıştır.</p><a href="/ilan/${adId}">İlanı Görüntüle</a>`
  }),
  AD_REJECTED: (userName: string, adTitle: string, reason: string) => ({
    subject: 'İlanınız Onaylanmadı ⚠️',
    html: `<p>Sayın <strong>${userName}</strong>,</p><p>"${adTitle}" başlıklı ilanınız şu nedenle reddedilmiştir:</p><blockquote>${reason}</blockquote>`
  }),
  DOPING_ACTIVE: (userName: string, type: string) => ({
    subject: 'Doping Tanımlandı 🚀',
    html: `<p>Sayın <strong>${userName}</strong>,</p><p>İlanınıza <strong>${type}</strong> dopingi başarıyla tanımlanmıştır.</p>`
  })
};