const fs = require("fs");
const path = require("path");

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  red: "\x1b[31m",
  bold: "\x1b[1m",
  yellow: "\x1b[33m",
};

console.log(
  colors.red +
    colors.bold +
    "\n🚀 SENIOR UPGRADE V7: AUTOMATED MODERATION ENGINE...\n" +
    colors.reset,
);

function writeFile(filePath, content) {
  const absolutePath = path.join(__dirname, filePath);
  const dir = path.dirname(absolutePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(absolutePath, content.trim());
  console.log(
    `${colors.green}✔ Güncellendi/Oluşturuldu:${colors.reset} ${filePath}`,
  );
}

// =============================================================================
// 1. SUPABASE/MODERATION.SQL (VERİTABANI GÜNCELLEMESİ)
// =============================================================================
const moderationSqlContent = `
-- BU KODU SUPABASE SQL EDITOR'DE ÇALIŞTIRIN --

-- 1. İlan tablosuna moderasyon skorlarını ekleyelim
ALTER TABLE ads
ADD COLUMN IF NOT EXISTS moderation_score integer default 0, -- 0: Temiz, 100: Çok Riskli
ADD COLUMN IF NOT EXISTS moderation_tags text[] default '{}', -- Örn: ['PHONE_DETECTED', 'BAD_WORD']
ADD COLUMN IF NOT EXISTS admin_note text;

-- 2. İndeks (Riskli ilanları bulmak için)
CREATE INDEX IF NOT EXISTS idx_ads_mod_score ON ads(moderation_score);
`;
writeFile("supabase/moderation.sql", moderationSqlContent);

// =============================================================================
// 2. LIB/MODERATION/RULES.TS (KURALLAR VE YASAKLI KELİMELER)
// =============================================================================
const rulesContent = `
// Yasaklı veya Riskli Kelimeler
export const BLACKLIST = [
  'dolandırıcı', 'kumar', 'bahis', 'illegal', 'kaçak', 'silah',
  'hack', 'warez', 'iptv', 'crack'
];

// Rakip Site İsimleri (Platform dışına yönlendirmeyi önlemek için)
export const COMPETITORS = [
  'letgo', 'dolap', 'arabam.com', 'zingat', 'hepsiemlak'
];

// Regex Desenleri
export const PATTERNS = {
  // Telefon numarası yakalama (05XX, 5XX, aralara boşluk/nokta koyma vb.)
  PHONE: /(0?5\d{2})[\s\.-]?\d{3}[\s\.-]?\d{2}[\s\.-]?\d{2}/g,

  // Email yakalama
  EMAIL: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,

  // Büyük harf kullanımı (Bağırma tespiti)
  ALL_CAPS: /^[^a-z]*$/
};
`;
writeFile("lib/moderation/rules.ts", rulesContent);

// =============================================================================
// 3. LIB/MODERATION/ENGINE.TS (MODERASYON MOTORU)
// =============================================================================
const engineContent = `
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
    return { score, flags, autoReject: true, rejectReason: \`Yasaklı içerik tespit edildi: \${foundBadWords.join(', ')}\` };
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
`;
writeFile("lib/moderation/engine.ts", engineContent);

// =============================================================================
// 4. LIB/ACTIONS.TS (CREATE AD GÜNCELLEMESİ)
// =============================================================================
// createAdAction fonksiyonunu güncelleyerek moderasyon motorunu entegre ediyoruz.

const actionsContent = `
'use server'
import { createClient, createStaticClient } from '@/lib/supabase/server'
import { revalidatePath, unstable_cache } from 'next/cache'
import { adSchema } from '@/lib/schemas'
import { logActivity } from '@/lib/logger'
import { AdFormData } from '@/types'
import { sendEmail, EMAIL_TEMPLATES } from '@/lib/mail'
import { analyzeAdContent } from '@/lib/moderation/engine' // YENİ MOTOR

// --- YARDIMCI FONKSİYONLAR ---
async function checkRateLimit(userId: string, actionType: 'ad_creation' | 'review') {
    const supabase = await createClient();
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    if (actionType === 'ad_creation') {
        const { count } = await supabase.from('ads')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', userId)
            .gte('created_at', oneDayAgo);
        if ((count || 0) >= 5) return false;
    }
    return true;
}

// --- CREATE AD (SENIOR UPGRADE: AUTO MODERATION) ---
export async function createAdAction(formData: Partial<AdFormData>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Oturum açmanız gerekiyor.' }

  const canCreate = await checkRateLimit(user.id, 'ad_creation');
  if (!canCreate) {
      await logActivity(user.id, 'SPAM_AD_CREATION', { reason: 'Rate limit exceeded' });
      return { error: 'Günlük ilan verme limitine ulaştınız.' };
  }

  const validation = adSchema.safeParse(formData);
  if (!validation.success) return { error: validation.error.issues[0].message };

  // --- MODERASYON MOTORU ÇALIŞIYOR ---
  const analysis = analyzeAdContent(validation.data.title, validation.data.description);

  // Otomatik Ret Durumu
  let initialStatus = 'onay_bekliyor';
  if (analysis.autoReject) {
      initialStatus = 'reddedildi';
      // Kullanıcıya otomatik ret maili atılabilir (Mail servisi entegre ise)
      // Ancak güvenlik gereği bazen sessizce reddetmek daha iyidir (Shadow ban)
  }

  const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).single();
  if (!profile) await supabase.from('profiles').insert([{ id: user.id, email: user.email }]);

  const { data, error } = await supabase.from('ads').insert([{
    ...validation.data,
    user_id: user.id,
    status: initialStatus,
    is_vitrin: false,
    is_urgent: false,
    // Moderasyon Sonuçlarını Kaydet
    moderation_score: analysis.score,
    moderation_tags: analysis.flags,
    admin_note: analysis.autoReject ? \`OTOMATİK RET: \${analysis.rejectReason}\` : null
  }]).select('id').single()

  if (error) return { error: 'Veritabanı hatası.' }

  await logActivity(user.id, 'CREATE_AD', {
      adId: data.id,
      title: validation.data.title,
      moderation: analysis // Loglara da moderasyon sonucunu ekle
  });

  if (analysis.autoReject) {
      return { error: \`İlanınız güvenlik kurallarına uymadığı için otomatik olarak reddedildi: \${analysis.rejectReason}\` };
  }

  revalidatePath('/');
  return { success: true, adId: data.id }
}

// --- MEVCUT SEARCH & GETTERS (KORUNDU) ---
type SearchParams = {
    q?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
    city?: string;
    sort?: string;
    page?: string;
};

export async function getAdsServer(searchParams: SearchParams) {
  const supabase = await createClient()
  const page = Number(searchParams?.page) || 1;
  const limit = 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase.from('ads').select('*, profiles(full_name), categories(title)', { count: 'exact' }).eq('status', 'yayinda');

  if (searchParams?.q) query = query.ilike('title', \`%\${searchParams.q}%\`);
  if (searchParams?.minPrice) query = query.gte('price', searchParams.minPrice);
  if (searchParams?.maxPrice) query = query.lte('price', searchParams.maxPrice);
  if (searchParams?.city) query = query.eq('city', searchParams.city);

  if (searchParams?.category) {
      const slug = searchParams.category;
      if (slug === 'emlak') query = query.or('category.ilike.konut%,category.ilike.isyeri%,category.ilike.arsa%');
      else if (slug === 'konut') query = query.ilike('category', 'konut%');
      else if (slug === 'is-yeri') query = query.ilike('category', 'isyeri%');
      else if (slug === 'vasita') query = query.or('category.eq.otomobil,category.eq.suv,category.eq.motosiklet');
      else query = query.eq('category', slug);
  }

  if (searchParams?.sort === 'price_asc') query = query.order('price', { ascending: true });
  else if (searchParams?.sort === 'price_desc') query = query.order('price', { ascending: false });
  else query = query.order('created_at', { ascending: false });

  query = query.range(from, to);
  const { data, count, error } = await query;

  if (error) return { data: [], count: 0, totalPages: 0 };
  return { data: data || [], count: count || 0, totalPages: count ? Math.ceil(count / limit) : 0 };
}

export const getCategoryTreeServer = unstable_cache(
  async () => {
    const supabase = createStaticClient();
    const { data } = await supabase.from('categories').select('*').order('title');
    if (!data) return [];
    const parents = data.filter(c => !c.parent_id);
    return parents.map(p => ({ ...p, subs: data.filter(c => c.parent_id === p.id) }));
  }, ['category-tree'], { revalidate: 3600 }
);

export async function getInfiniteAdsAction(page = 1, limit = 20) {
    const supabase = await createClient();
    const start = (page - 1) * limit;
    const end = start + limit - 1;
    const { data, count } = await supabase.from('ads').select('*, profiles(full_name)', { count: 'exact' }).eq('status', 'yayinda').order('created_at', { ascending: false }).range(start, end);
    return { data: data || [], total: count || 0, hasMore: (count || 0) > end + 1 };
}

export async function getAdDetailServer(id: number) {
  const supabase = await createClient()
  const { data } = await supabase.from('ads').select('*, profiles(*), categories(title)').eq('id', id).single()
  return data
}

export async function updateAdAction(id: number, formData: any) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Giriş yapmalısınız' }

    // Update işleminde de moderasyon yapılmalı
    const analysis = analyzeAdContent(formData.title, formData.description);

    // Eğer update sırasında illegal içerik girdiyse direkt reddet veya pasife çek
    const status = analysis.autoReject ? 'reddedildi' : 'onay_bekliyor';
    const adminNote = analysis.autoReject ? \`OTOMATİK RET (Update): \${analysis.rejectReason}\` : null;

    const { error } = await supabase.from('ads').update({
        ...formData,
        status,
        moderation_score: analysis.score,
        moderation_tags: analysis.flags,
        admin_note: adminNote
    }).eq('id', id).eq('user_id', user.id)

    if (error) return { error: error.message }
    await logActivity(user.id, 'UPDATE_AD', { adId: id, moderation: analysis });

    if (analysis.autoReject) {
        return { error: 'Düzenleme güvenlik politikalarına takıldı ve ilan reddedildi.' };
    }

    revalidatePath('/bana-ozel/ilanlarim')
    return { success: true }
}

export async function activateDopingAction(adId: number, dopingTypes: string[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const updates: any = {};
  if (dopingTypes.includes('1')) updates.is_vitrin = true;
  if (dopingTypes.includes('2')) updates.is_urgent = true;

  const { error } = await supabase.from('ads').update(updates).eq('id', adId);
  if (error) return { error: error.message };

  if (user) await logActivity(user.id, 'ACTIVATE_DOPING', { adId, types: dopingTypes });

  revalidatePath('/');
  return { success: true };
}

export async function createReportAction(adId: number, reason: string, description: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Giriş yapmalısınız.' };
    const { error } = await supabase.from('reports').insert([{
        ad_id: adId, user_id: user.id, reason, description, status: 'pending'
    }]);
    if (error) return { error: 'İletilemedi.' };
    return { success: true };
}

export async function getStoreBySlugServer(slug: string) {
    const supabase = await createClient()
    const { data } = await supabase.from('stores').select('*').eq('slug', slug).single()
    return data
}

export async function getStoreAdsServer(userId: string) {
    const supabase = await createClient()
    const { data } = await supabase.from('ads').select('*').eq('user_id', userId).eq('status', 'yayinda')
    return data || []
}

export async function createStoreAction(formData: any) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Giriş yapmalısınız' }
    const { error } = await supabase.from('stores').insert([{ ...formData, user_id: user.id }])
    if (error) return { error: error.message }
    await supabase.from('profiles').update({ role: 'store' }).eq('id', user.id)
    await logActivity(user.id, 'CREATE_STORE', { name: formData.name });
    revalidatePath('/bana-ozel/magazam')
    return { success: true }
}

export async function updateStoreAction(formData: any) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Giriş yapmalısınız' }
    const { error } = await supabase.from('stores').update(formData).eq('user_id', user.id)
    if (error) return { error: error.message }
    await logActivity(user.id, 'UPDATE_STORE', { name: formData.name });
    revalidatePath('/bana-ozel/magazam')
    return { success: true }
}

export async function getMyStoreServer() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if(!user) return null
    const { data } = await supabase.from('stores').select('*').eq('user_id', user.id).single()
    return data
}

export async function getAdminStatsServer() {
    const supabase = await createClient();
    const [users, ads, revenue] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('ads').select('*', { count: 'exact', head: true }).eq('status', 'yayinda'),
        supabase.from('ads').select('*', { count: 'exact', head: true }).or('is_vitrin.eq.true,is_urgent.eq.true')
    ]);
    const estimatedRevenue = (revenue.count || 0) * 100;
    return { totalUsers: users.count || 0, activeAds: ads.count || 0, totalRevenue: estimatedRevenue };
}

export async function getPageBySlugServer(slug: string) {
  const contentMap: any = {
      'hakkimizda': { title: 'Hakkımızda', content: '<p>Sahibinden klon projesi...</p>' },
      'kullanim-kosullari': { title: 'Kullanım Koşulları', content: '<p>Koşullar...</p>' },
      'gizlilik-politikasi': { title: 'Gizlilik Politikası', content: '<p>Gizlilik...</p>' },
  };
  return contentMap[slug] || null;
}

export async function getHelpContentServer() {
  return {
      categories: [{id: 1, title: 'Üyelik', description: 'Giriş işlemleri'}],
      faqs: [{id: 1, question: 'Şifremi unuttum?', answer: 'Şifremi unuttum linkine tıklayın.'}]
  };
}

export async function getAdsByIds(ids: number[]) {
    if (!ids || ids.length === 0) return [];
    const supabase = await createClient();
    const { data } = await supabase.from('ads').select('*, profiles(full_name)').in('id', ids);
    return data || [];
}

export async function getShowcaseAdsServer() {
  const supabase = await createClient()
  const { data } = await supabase.from('ads').select('*').eq('status', 'yayinda').eq('is_vitrin', true).limit(20)
  return data || []
}

export async function getAdminAdsClient() {
  const supabase = await createClient();
  const { data } = await supabase.from('ads').select('*, profiles(full_name)').order('created_at', { ascending: false });
  return data || [];
}

export async function approveAdAction(adId: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // İlan sahibini bul
    const { data: ad } = await supabase.from('ads').select('user_id, title').eq('id', adId).single();
    const { data: adOwner } = await supabase.from('profiles').select('email, full_name').eq('id', ad.user_id).single();

    const { error } = await supabase.from('ads').update({ status: 'yayinda', published_at: new Date().toISOString() }).eq('id', adId);
    if(error) return { error: error.message };

    if (user) await logActivity(user.id, 'ADMIN_APPROVE_AD', { adId });

    if (adOwner?.email) {
        const mailData = EMAIL_TEMPLATES.AD_APPROVED(adOwner.full_name || 'Kullanıcı', ad.title, adId);
        await sendEmail(adOwner.email, mailData.subject, mailData.html);
    }

    revalidatePath('/admin/ilanlar');
    return { success: true };
}

export async function rejectAdAction(adId: number, reason: string) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: ad } = await supabase.from('ads').select('user_id, title').eq('id', adId).single();
    const { data: adOwner } = await supabase.from('profiles').select('email, full_name').eq('id', ad.user_id).single();

    const { error } = await supabase.from('ads').update({ status: 'reddedildi' }).eq('id', adId);
    if(error) return { error: error.message };

    if (user) await logActivity(user.id, 'ADMIN_REJECT_AD', { adId, reason });

    if (adOwner?.email) {
        const mailData = EMAIL_TEMPLATES.AD_REJECTED(adOwner.full_name || 'Kullanıcı', ad.title, reason);
        await sendEmail(adOwner.email, mailData.subject, mailData.html);
    }

    revalidatePath('/admin/ilanlar');
    return { success: true };
}

export async function getAdFavoriteCount(adId: number) {
    const supabase = await createClient();
    const { count } = await supabase.from('favorites').select('*', { count: 'exact', head: true }).eq('ad_id', adId);
    return count || 0;
}

export async function updateProfileAction(formData: any) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Oturum açmanız gerekiyor.' };
    const updates = { full_name: formData.full_name, phone: formData.phone, avatar_url: formData.avatar_url, updated_at: new Date().toISOString() };
    const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
    if (error) return { error: error.message };
    await logActivity(user.id, 'UPDATE_PROFILE', {});
    revalidatePath('/bana-ozel/ayarlar');
    return { success: true };
}

export async function updatePasswordAction(password: string) {
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({ password: password });
    if (error) return { error: error.message };
    return { success: true };
}

export async function getRelatedAdsServer(category: string, currentId: number, basePrice?: number) {
    const supabase = await createClient();
    let query = supabase.from('ads').select('*').eq('category', category).eq('status', 'yayinda').neq('id', currentId);
    if (basePrice) {
        const minPrice = basePrice * 0.7;
        const maxPrice = basePrice * 1.3;
        query = query.gte('price', minPrice).lte('price', maxPrice);
    }
    const { data } = await query.limit(5);
    return data || [];
}

export async function incrementViewCountAction(adId: number) {
    const supabase = await createClient();
    await supabase.rpc('increment_view_count', { ad_id_input: adId });
}

export async function getAuditLogsServer() {
    const supabase = await createClient();
    const { data } = await supabase.from('audit_logs').select('*, profiles:user_id(full_name, email)').order('created_at', { ascending: false }).limit(100);
    return data || [];
}

export async function createReviewAction(targetUserId: string, rating: number, comment: string, adId?: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Giriş yapmalısınız.' };
    if (user.id === targetUserId) return { error: 'Kendinize yorum yapamazsınız.' };
    const { error } = await supabase.from('reviews').insert([{ target_user_id: targetUserId, reviewer_id: user.id, ad_id: adId, rating, comment }]);
    if (error) return { error: 'Yorum kaydedilemedi.' };
    await logActivity(user.id, 'CREATE_REVIEW', { targetUserId, rating });
    revalidatePath(\`/satici/\${targetUserId}\`);
    return { success: true };
}

export async function getSellerReviewsServer(targetUserId: string) {
    const supabase = await createClient();
    const { data } = await supabase.from('reviews').select('*, reviewer:reviewer_id(full_name, avatar_url)').eq('target_user_id', targetUserId).order('created_at', { ascending: false });
    return data || [];
}

export async function getUserDashboardStats() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data: ads } = await supabase.from('ads').select('status, view_count, price').eq('user_id', user.id);
    return ads || [];
}

import { getProvinces, getDistrictsByProvince, getCityAdCounts } from '@/lib/services/locationService';
export async function getLocationsServer() { return await getProvinces(); }
export async function getDistrictsServer(cityName: string) { return await getDistrictsByProvince(cityName); }
export async function getFacetCountsServer() { return await getCityAdCounts(); }
`;
writeFile("lib/actions.ts", actionsContent);

// =============================================================================
// 5. COMPONENTS/ADMIN/MODERATIONQUEUE.TSX (ADMIN PANELİ İÇİN)
// =============================================================================
// Admin panelinde moderasyona takılan riskli ilanları gösterecek bir bileşen (Fikir olarak eklendi, opsiyonel)
const moderationQueueContent = `
import React from 'react';
import { AlertTriangle, Check, X } from 'lucide-react';

export default function ModerationQueue({ ads }: { ads: any[] }) {
  // Bu bileşen, Admin > İlanlar sayfasında "Moderasyon Bekleyenler" sekmesinde kullanılabilir.
  return (
    <div className="space-y-4">
       {ads.map(ad => (
           <div key={ad.id} className="border border-red-200 bg-red-50 p-4 rounded-md">
               <div className="flex justify-between items-start">
                   <div>
                       <h4 className="font-bold text-red-900">{ad.title}</h4>
                       <p className="text-xs text-red-700 mt-1">
                           <span className="font-bold">Risk Skoru:</span> {ad.moderation_score} / 100
                       </p>
                       <div className="flex gap-2 mt-2">
                           {ad.moderation_tags?.map((tag: string) => (
                               <span key={tag} className="text-[10px] bg-red-200 text-red-800 px-2 py-0.5 rounded-full font-bold">{tag}</span>
                           ))}
                       </div>
                   </div>
                   <div className="flex gap-2">
                       <button className="bg-white border border-gray-300 p-1.5 rounded hover:bg-gray-100"><X size={16}/></button>
                       <button className="bg-green-600 text-white p-1.5 rounded hover:bg-green-700"><Check size={16}/></button>
                   </div>
               </div>
           </div>
       ))}
    </div>
  );
}
`;
writeFile("components/admin/ModerationQueue.tsx", moderationQueueContent);

console.log(
  colors.green +
    "\\n✅ SENIOR UPGRADE V7 TAMAMLANDI! (Automated Moderation)" +
    "\\n⚠️ GÖREV: 'supabase/moderation.sql' dosyasını Supabase'de çalıştırarak yeni sütunları ekleyin." +
    "\\nBu sistem artık ilanları içeriklerine göre otomatik olarak puanlayacak ve riskli olanları işaretleyecek." +
    colors.reset,
);
