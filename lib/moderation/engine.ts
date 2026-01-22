import { BLACKLIST, COMPETITORS, PATTERNS } from './rules';

type ModerationResult = {
  score: number; // 0-100 (100 = En Riskli)
  flags: string[];
  autoReject: boolean;
  rejectReason?: string;
};

export function analyzeAdContent(title: string, description: string): ModerationResult {
  let score = 0;
  const flags: string[] = [];
  const content = (title + ' ' + description).toLowerCase();

  // 1. Yasaklı Kelime Kontrolü (Ağır İhlal)
  const foundBadWords = BLACKLIST.filter(word => content.includes(word));
  if (foundBadWords.length > 0) {
    score += 100;
    flags.push('ILLEGAL_CONTENT');
    return { score, flags, autoReject: true, rejectReason: `Yasaklı içerik tespit edildi: ${foundBadWords.join(', ')}` };
  }

  // 2. Rakip Site Kontrolü
  const foundCompetitors = COMPETITORS.filter(comp => content.includes(comp));
  if (foundCompetitors.length > 0) {
    score += 50;
    flags.push('COMPETITOR_MENTION');
  }

  // 3. İletişim Bilgisi Sızdırma (Komisyon Atlatma)
  if (PATTERNS.PHONE.test(title) || PATTERNS.PHONE.test(description)) {
    score += 40;
    flags.push('PHONE_DETECTED');
  }
  if (PATTERNS.EMAIL.test(title) || PATTERNS.EMAIL.test(description)) {
    score += 30;
    flags.push('EMAIL_DETECTED');
  }

  // 4. Kalite Kontrolü (Hepsi Büyük Harf)
  // Sadece title'a bakıyoruz, description uzun olabilir
  if (title.length > 10 && PATTERNS.ALL_CAPS.test(title)) {
    score += 20;
    flags.push('ALL_CAPS_TITLE');
  }

  // 5. Kısa Açıklama (Spam Belirtisi)
  if (description.length < 20) {
    score += 10;
    flags.push('LOW_QUALITY_DESC');
  }

  // Skor Tavanı
  score = Math.min(score, 100);

  return {
    score,
    flags,
    autoReject: score >= 100, // 100 puan direkt ret
  };
}