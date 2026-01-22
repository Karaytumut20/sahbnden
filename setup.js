const fs = require("fs");
const path = require("path");

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  bold: "\x1b[1m",
  blue: "\x1b[34m",
};

console.log(
  colors.blue +
    colors.bold +
    "\n🚀 SENIOR UPGRADE V5: LIFECYCLE MANAGEMENT & NOTIFICATIONS...\n" +
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
// 1. SUPABASE/LIFECYCLE.SQL (SÜRE YÖNETİMİ SÜTUNLARI)
// =============================================================================
const lifecycleSqlContent = `
-- BU KODU SUPABASE SQL EDITOR'DE ÇALIŞTIRIN --

-- 1. İlan tablosuna bitiş sürelerini ekleyelim
ALTER TABLE ads
ADD COLUMN IF NOT EXISTS vitrin_expires_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS urgent_expires_at timestamp with time zone,
ADD COLUMN IF NOT EXISTS published_at timestamp with time zone;

-- 2. İndeksler (Cron job sorguları için)
CREATE INDEX IF NOT EXISTS idx_ads_vitrin_expire ON ads(vitrin_expires_at);
CREATE INDEX IF NOT EXISTS idx_ads_urgent_expire ON ads(urgent_expires_at);
`;
writeFile("supabase/lifecycle.sql", lifecycleSqlContent);

// =============================================================================
// 2. LIB/ENV.TS (TİP GÜVENLİ ORTAM DEĞİŞKENLERİ)
// =============================================================================
const envContent = `
import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  CRON_SECRET: z.string().optional(), // Cron job güvenliği için
  NEXT_PUBLIC_SITE_URL: z.string().url().optional().default('http://localhost:3000'),
});

// Build-time validation (Hata varsa build almaz)
const processEnv = {
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  CRON_SECRET: process.env.CRON_SECRET,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
};

// Validasyon sonucunu dışa aktar
// Not: Bu dosyayı uygulamanın giriş noktasında (örn: app/layout.tsx) import ederek kontrolü sağlayabiliriz.
export const env = envSchema.parse(processEnv);
`;
writeFile("lib/env.ts", envContent);

// =============================================================================
// 3. LIB/MAIL.TS (MOCK EMAIL SERVICE)
// =============================================================================
const mailContent = `
import { logActivity } from './logger';

/**
 * E-posta Gönderim Servisi (Simülasyon)
 * Gerçek projede: Resend, SendGrid veya AWS SES kullanılır.
 */
export async function sendEmail(to: string, subject: string, html: string) {
  console.log(\`
  📧 [EMAIL SENT]
  To: \${to}
  Subject: \${subject}
  ---------------------
  \${html.substring(0, 100)}...
  \`);

  // Loglama sistemine de kayıt atalım
  await logActivity('SYSTEM', 'SEND_EMAIL', { to, subject });

  return { success: true };
}

export const EMAIL_TEMPLATES = {
  AD_APPROVED: (userName: string, adTitle: string, adId: number) => ({
    subject: 'İlanınız Yayında! 🎉',
    html: \`<p>Sayın <strong>\${userName}</strong>,</p><p>"\${adTitle}" başlıklı ilanınız onaylanmış ve yayına alınmıştır.</p><a href="/ilan/\${adId}">İlanı Görüntüle</a>\`
  }),
  AD_REJECTED: (userName: string, adTitle: string, reason: string) => ({
    subject: 'İlanınız Onaylanmadı ⚠️',
    html: \`<p>Sayın <strong>\${userName}</strong>,</p><p>"\${adTitle}" başlıklı ilanınız şu nedenle reddedilmiştir:</p><blockquote>\${reason}</blockquote>\`
  }),
  DOPING_ACTIVE: (userName: string, type: string) => ({
    subject: 'Doping Tanımlandı 🚀',
    html: \`<p>Sayın <strong>\${userName}</strong>,</p><p>İlanınıza <strong>\${type}</strong> dopingi başarıyla tanımlanmıştır.</p>\`
  })
};
`;
writeFile("lib/mail.ts", mailContent);

// =============================================================================
// 4. APP/API/CRON/ROUTE.TS (OTOMATİK TEMİZLİK SERVİSİ)
// =============================================================================
const cronRouteContent = `
import { NextResponse } from 'next/server';
import { createStaticClient } from '@/lib/supabase/server';

// Bu endpoint Vercel Cron veya harici bir scheduler tarafından her gün çağrılmalı
export async function GET(request: Request) {
  // Güvenlik Kontrolü (Bearer Token)
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== \`Bearer \${process.env.CRON_SECRET}\`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const supabase = createStaticClient();
  const now = new Date().toISOString();

  // 1. Süresi dolan Vitrin dopinglerini temizle
  const { error: vitrinError, count: vitrinCount } = await supabase
    .from('ads')
    .update({ is_vitrin: false, vitrin_expires_at: null })
    .lt('vitrin_expires_at', now)
    .select('id', { count: 'exact' });

  // 2. Süresi dolan Acil etiketlerini temizle
  const { error: urgentError, count: urgentCount } = await supabase
    .from('ads')
    .update({ is_urgent: false, urgent_expires_at: null })
    .lt('urgent_expires_at', now)
    .select('id', { count: 'exact' });

  if (vitrinError || urgentError) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    message: 'Cron job executed successfully',
    stats: {
      vitrin_removed: vitrinCount,
      urgent_removed: urgentCount
    }
  });
}
`;
writeFile("app/api/cron/route.ts", cronRouteContent);

// =============================================================================
// 5. LIB/ACTIONS.TS (GÜNCELLEME: MAİL & TARİH ENTEGRASYONU)
// =============================================================================
const actionsContent = `
'use server'
import { createClient, createStaticClient } from '@/lib/supabase/server'
import { revalidatePath, unstable_cache } from 'next/cache'
import { adSchema } from '@/lib/schemas'
import { logActivity } from '@/lib/logger'
import { AdFormData } from '@/types'
import { sendEmail, EMAIL_TEMPLATES } from '@/lib/mail' // Mail Servisi

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

// --- CREATE AD ---
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

  const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).single();
  if (!profile) await supabase.from('profiles').insert([{ id: user.id, email: user.email }]);

  const { data, error } = await supabase.from('ads').insert([{
    ...validation.data,
    user_id: user.id,
    status: 'onay_bekliyor',
    is_vitrin: false,
    is_urgent: false
  }]).select('id').single()

  if (error) return { error: 'Veritabanı hatası.' }

  await logActivity(user.id, 'CREATE_AD', { adId: data.id, title: validation.data.title });
  revalidatePath('/');
  return { success: true, adId: data.id }
}

// --- ADMIN ONAYI (SENIOR UPGRADE: EMAİL BİLDİRİMİ) ---
export async function approveAdAction(adId: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // İlan sahibini bul
    const { data: ad } = await supabase.from('ads').select('user_id, title').eq('id', adId).single();
    const { data: adOwner } = await supabase.from('profiles').select('email, full_name').eq('id', ad.user_id).single();

    const { error } = await supabase.from('ads').update({ status: 'yayinda', published_at: new Date().toISOString() }).eq('id', adId);
    if(error) return { error: error.message };

    if (user) await logActivity(user.id, 'ADMIN_APPROVE_AD', { adId });

    // E-posta Gönder
    if (adOwner?.email) {
        const mailData = EMAIL_TEMPLATES.AD_APPROVED(adOwner.full_name || 'Kullanıcı', ad.title, adId);
        await sendEmail(adOwner.email, mailData.subject, mailData.html);
    }

    revalidatePath('/admin/ilanlar');
    return { success: true };
}

// --- ADMIN RED (SENIOR UPGRADE: EMAİL BİLDİRİMİ) ---
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

// --- DOPING AKTİVASYONU (SENIOR UPGRADE: SÜRELİ TANIMLAMA) ---
export async function activateDopingAction(adId: number, dopingTypes: string[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const now = new Date();

  const updates: any = {};

  if (dopingTypes.includes('1')) { // Vitrin (14 Gün)
      updates.is_vitrin = true;
      const vitrinExpiry = new Date();
      vitrinExpiry.setDate(now.getDate() + 14);
      updates.vitrin_expires_at = vitrinExpiry.toISOString();
  }

  if (dopingTypes.includes('2')) { // Acil (7 Gün)
      updates.is_urgent = true;
      const urgentExpiry = new Date();
      urgentExpiry.setDate(now.getDate() + 7);
      updates.urgent_expires_at = urgentExpiry.toISOString();
  }

  const { error } = await supabase.from('ads').update(updates).eq('id', adId);
  if (error) return { error: error.message };

  if (user) {
      await logActivity(user.id, 'ACTIVATE_DOPING', { adId, types: dopingTypes });
      // Burada kullanıcıya ödeme faturası da mail atılabilir
      const { data: profile } = await supabase.from('profiles').select('email, full_name').eq('id', user.id).single();
      if(profile?.email) {
          const mailData = EMAIL_TEMPLATES.DOPING_ACTIVE(profile.full_name || 'Kullanıcı', 'Vitrin/Acil Paket');
          await sendEmail(profile.email, mailData.subject, mailData.html);
      }
  }

  revalidatePath('/');
  return { success: true };
}

// --- DİĞER FONKSİYONLAR (KORUNDU) ---
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
    const { error } = await supabase.from('ads').update({ ...formData, status: 'onay_bekliyor' }).eq('id', id).eq('user_id', user.id)
    if (error) return { error: error.message }
    await logActivity(user.id, 'UPDATE_AD', { adId: id });
    revalidatePath('/bana-ozel/ilanlarim')
    return { success: true }
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

// LOCATION ACTIONS (V4'ten korundu)
import { getProvinces, getDistrictsByProvince, getCityAdCounts } from '@/lib/services/locationService';
export async function getLocationsServer() { return await getProvinces(); }
export async function getDistrictsServer(cityName: string) { return await getDistrictsByProvince(cityName); }
export async function getFacetCountsServer() { return await getCityAdCounts(); }
`;
writeFile("lib/actions.ts", actionsContent);

console.log(
  colors.green +
    "\\n✅ SENIOR UPGRADE V5 TAMAMLANDI! (Lifecycle & Notification)" +
    "\\n⚠️ GÖREVLER:" +
    "\\n1. 'supabase/lifecycle.sql' dosyasını SQL Editor'de çalıştırarak yeni sütunları ekleyin." +
    "\\n2. 'lib/mail.ts' içindeki 'sendEmail' fonksiyonuna gerçek bir SMTP/Resend entegrasyonu yapabilirsiniz." +
    "\\n3. 'app/api/cron/route.ts' yoluna dışarıdan (örn: Vercel Cron) istek atarak otomatik temizliği başlatabilirsiniz." +
    colors.reset,
);
