const fs = require("fs");
const path = require("path");

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  bold: "\x1b[1m",
};

console.log(
  colors.blue +
    colors.bold +
    "\n🚀 BREADCRUMB VE FİLTRELEME SİSTEMİ GÜNCELLENİYOR...\n" +
    colors.reset,
);

const files = [
  // 1. Breadcrumb Bileşeni (Tıklanabilir Link Yapısı)
  {
    path: "components/Breadcrumb.tsx",
    content: `
import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center text-[11px] text-gray-500 mb-4 overflow-x-auto whitespace-nowrap scrollbar-hide">
      <Link href="/" className="hover:underline text-blue-800 transition-colors">Anasayfa</Link>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={10} className="mx-1.5 text-gray-400 shrink-0" />
          {item.href ? (
            <Link href={item.href} className="text-blue-800 hover:underline transition-colors font-medium">
              {item.label}
            </Link>
          ) : (
            <span className="font-bold text-gray-700">
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
`,
  },
  // 2. Backend Arama Fonksiyonu (Marka/Model Filtreleme Desteği)
  {
    path: "lib/actions.ts",
    content: `
'use server'
import { createClient, createStaticClient } from '@/lib/supabase/server'
import { revalidatePath, unstable_cache } from 'next/cache'
import { adSchema } from '@/lib/schemas'
import { logActivity } from '@/lib/logger'
import { AdFormData } from '@/types'
import { analyzeAdContent } from '@/lib/moderation/engine'

// --- RATE LIMIT CHECK ---
async function checkRateLimit(userId: string) {
    const supabase = await createClient();
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { count } = await supabase.from('ads')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .gte('created_at', oneDayAgo);

    if ((count || 0) >= 10) return false;
    return true;
}

// --- CREATE AD ---
export async function createAdAction(formData: Partial<AdFormData>) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Oturum açmanız gerekiyor.' }

  if (!(await checkRateLimit(user.id))) {
      return { error: 'Günlük ilan verme limitine ulaştınız. Lütfen yarın tekrar deneyin.' };
  }

  const validation = adSchema.safeParse(formData);
  if (!validation.success) {
      console.error("Validation Error:", validation.error);
      return { error: validation.error.issues[0].message };
  }

  const analysis = analyzeAdContent(validation.data.title, validation.data.description);

  const { data: profile } = await supabase.from('profiles').select('id').eq('id', user.id).single();
  if (!profile) await supabase.from('profiles').insert([{ id: user.id, email: user.email }]);

  const { data, error } = await supabase.from('ads').insert([{
    ...validation.data,
    user_id: user.id,
    status: 'onay_bekliyor',
    is_vitrin: false,
    is_urgent: false,
    moderation_score: analysis.score,
    moderation_tags: analysis.flags,
    admin_note: analysis.autoReject ? \`OTOMATİK RET: \${analysis.rejectReason}\` : null
  }]).select('id').single()

  if (error) {
      console.error('DB Insert Error:', error);
      return { error: \`Veritabanı Hatası: \${error.message}\` }
  }

  await logActivity(user.id, 'CREATE_AD', { adId: data.id, title: validation.data.title });

  if (analysis.autoReject) return { error: \`Güvenlik politikası gereği ilan reddedildi: \${analysis.rejectReason}\` };

  revalidatePath('/');
  return { success: true, adId: data.id }
}

// --- READ / LIST ACTIONS ---

export async function getAdsServer(searchParams: any) {
  const supabase = await createClient()
  const page = Number(searchParams?.page) || 1;
  const limit = 20;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase.from('ads').select('*, profiles(full_name), categories(title)', { count: 'exact' }).eq('status', 'yayinda');

  // Basit Filtreler
  if (searchParams?.q) query = query.textSearch('fts', searchParams.q, { config: 'turkish', type: 'websearch' });
  if (searchParams?.minPrice) query = query.gte('price', searchParams.minPrice);
  if (searchParams?.maxPrice) query = query.lte('price', searchParams.maxPrice);
  if (searchParams?.city) query = query.eq('city', searchParams.city);

  // Kategori Filtresi
  if (searchParams?.category) {
      const slug = searchParams.category;
      if (slug === 'emlak') query = query.or('category.ilike.konut%,category.ilike.isyeri%,category.ilike.arsa%');
      else if (slug === 'konut') query = query.ilike('category', 'konut%');
      else if (slug === 'vasita') query = query.or('category.eq.otomobil,category.eq.suv,category.eq.motosiklet');
      else query = query.eq('category', slug);
  }

  // Araç Detay Filtreleri (YENİ)
  if (searchParams?.brand) query = query.eq('brand', searchParams.brand);
  if (searchParams?.series) query = query.eq('series', searchParams.series);
  if (searchParams?.model) query = query.eq('model', searchParams.model);
  if (searchParams?.gear) query = query.eq('gear', searchParams.gear);
  if (searchParams?.fuel) query = query.eq('fuel', searchParams.fuel);
  if (searchParams?.year_min) query = query.gte('year', searchParams.year_min);
  if (searchParams?.year_max) query = query.lte('year', searchParams.year_max);

  // Sıralama
  if (searchParams?.sort === 'price_asc') query = query.order('price', { ascending: true });
  else if (searchParams?.sort === 'price_desc') query = query.order('price', { ascending: false });
  else query = query.order('is_vitrin', { ascending: false }).order('created_at', { ascending: false });

  query = query.range(from, to);
  const { data, count, error } = await query;

  if (error) {
      console.error("Get Ads Error:", error);
      return { data: [], count: 0, totalPages: 0 };
  }
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
    const { data, count, error } = await supabase.from('ads')
        .select('*, profiles(full_name)', { count: 'exact' })
        .eq('status', 'yayinda')
        .order('is_vitrin', { ascending: false })
        .order('created_at', { ascending: false })
        .range(start, end);

    if (error) return { data: [], total: 0, hasMore: false };
    return { data: data || [], total: count || 0, hasMore: (count || 0) > end + 1 };
}

export async function getAdDetailServer(id: number) {
  const supabase = await createClient()
  const { data } = await supabase.from('ads').select('*, profiles(*), categories(title)').eq('id', id).single()
  return data
}

// --- UPDATE ACTIONS ---

export async function updateAdAction(id: number, formData: any) {
    const supabase = await createClient();
    const { error } = await supabase.from('ads').update(formData).eq('id', id);
    if (error) return { error: error.message };
    revalidatePath('/bana-ozel/ilanlarim');
    return { success: true };
}

export async function approveAdAction(id: number) {
    const supabase = await createClient();
    const { error } = await supabase.from('ads').update({ status: 'yayinda' }).eq('id', id);
    if (error) return { success: false, error: error.message };
    return { success: true };
}

export async function rejectAdAction(id: number, reason: string) {
    const supabase = await createClient();
    const { error } = await supabase.from('ads').update({ status: 'reddedildi', admin_note: reason }).eq('id', id);
    if (error) return { success: false, error: error.message };
    return { success: true };
}

export async function deleteAdSafeAction(adId: number) {
    const supabase = await createClient();
    await supabase.from('ads').update({ status: 'pasif' }).eq('id', adId);
    revalidatePath('/bana-ozel/ilanlarim');
    return { message: 'Silindi' };
}

// --- USER ACTIONS ---

export async function updateProfileAction(d: any) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, error: 'Auth error' };

    const updates = {
        full_name: d.full_name,
        phone: d.phone,
        avatar_url: d.avatar_url,
        show_phone: d.show_phone
    };

    const { error } = await supabase.from('profiles').update(updates).eq('id', user.id);
    return { success: !error, error: error ? error.message : null };
}

export async function updatePasswordAction(password: string) {
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({ password });
    return { success: !error, error: error?.message };
}

// --- OTHER ACTIONS ---

export async function getAdFavoriteCount(adId: number) {
    const supabase = await createClient();
    const { count } = await supabase.from('favorites').select('*', { count: 'exact', head: true }).eq('ad_id', adId);
    return count || 0;
}

export async function getMyStoreServer() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from('stores').select('*').eq('user_id', user.id).single();
  return data;
}

export async function createStoreAction(formData: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Oturum açmanız gerekiyor.' };
  const { error } = await supabase.from('stores').insert([{ ...formData, user_id: user.id }]);
  if (error) return { error: 'Hata oluştu.' };
  await supabase.from('profiles').update({ role: 'store' }).eq('id', user.id);
  revalidatePath('/bana-ozel/magazam');
  return { success: true };
}

export async function updateStoreAction(formData: any) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Oturum açmanız gerekiyor.' };
  const { error } = await supabase.from('stores').update(formData).eq('user_id', user.id);
  if (error) return { error: 'Güncelleme başarısız.' };
  revalidatePath('/bana-ozel/magazam');
  return { success: true };
}

export async function getStoreBySlugServer(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase.from('stores').select('*').eq('slug', slug).single();
  return data;
}

export async function getStoreAdsServer(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase.from('ads').select('*').eq('user_id', userId).eq('status', 'yayinda');
  return data || [];
}

export async function getSellerReviewsServer(id: string) {
    const supabase = await createClient();
    const { data } = await supabase.from('reviews').select('*').eq('target_user_id', id);
    return data || [];
}

export async function createReviewAction(targetId: string, rating: number, comment: string, adId: number) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Giriş gerekli' };
    await supabase.from('reviews').insert({ target_user_id: targetId, reviewer_id: user.id, rating, comment, ad_id: adId });
    return { success: true };
}

export async function getRelatedAdsServer(cat: string, id: number, price?: number) {
    const supabase = await createClient();
    const { data } = await supabase.from('ads').select('*').eq('category', cat).neq('id', id).limit(4);
    return data || [];
}

export async function incrementViewCountAction(id: number) {
    const supabase = await createClient();
    await supabase.rpc('increment_view_count', { ad_id_input: id });
}

export async function getUserDashboardStats() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];
    const { data } = await supabase.from('ads').select('status, view_count, price').eq('user_id', user.id);
    return data || [];
}

export async function activateDopingAction(id: number, types: string[]) { return { success: true } }
export async function createReportAction(id: number, r: string, d: string) { return { success: true } }

export async function getAuditLogsServer() {
    const supabase = await createClient();
    const { data } = await supabase.from('audit_logs').select('*, profiles(full_name, email)').order('created_at', { ascending: false }).limit(100);
    return data || [];
}

export async function getAdminStatsServer() {
    return { totalUsers: 150, activeAds: 45, totalRevenue: 12500 };
}

export async function getAdsByIds(ids: number[]) {
    if(!ids.length) return [];
    const supabase = await createClient();
    const { data } = await supabase.from('ads').select('*').in('id', ids);
    return data || [];
}

export async function getPageBySlugServer(slug: string) {
    return { title: 'Sayfa Başlığı', content: '<p>İçerik...</p>' };
}

export async function getHelpContentServer() {
    return { categories: [], faqs: [] };
}

export async function getLocationsServer() {
    const supabase = createStaticClient();
    const { data } = await supabase.from('provinces').select('*').order('name');
    if (!data || data.length === 0) {
        return [
            { id: 34, name: 'İstanbul' }, { id: 6, name: 'Ankara' }, { id: 35, name: 'İzmir' },
            { id: 7, name: 'Antalya' }, { id: 16, name: 'Bursa' }
        ];
    }
    return data;
}

export async function getDistrictsServer(cityName: string) {
    const supabase = createStaticClient();
    const { data: province } = await supabase.from('provinces').select('id').eq('name', cityName).single();
    if (!province) return [];
    const { data } = await supabase.from('districts').select('*').eq('province_id', province.id).order('name');
    return data || [];
}

export async function getFacetCountsServer() {
    const supabase = createStaticClient();
    const { data, error } = await supabase.rpc('get_ad_counts_by_city');
    if (error) return [];
    return data as { city_name: string; count: number }[];
}
`,
  },
  // 3. İlan Detay Sayfası (Dinamik Breadcrumb Oluşturma)
  {
    path: "app/ilan/[id]/page.tsx",
    content: `import React from 'react';
import { notFound } from 'next/navigation';
import { getAdDetailServer } from '@/lib/actions';
import Breadcrumb from '@/components/Breadcrumb';
import Gallery from '@/components/Gallery';
import MobileAdActionBar from '@/components/MobileAdActionBar';
import AdActionButtons from '@/components/AdActionButtons';
import StickyAdHeader from '@/components/StickyAdHeader';
import SellerSidebar from '@/components/SellerSidebar';
import Tabs from '@/components/AdDetail/Tabs';
import FeaturesTab from '@/components/AdDetail/FeaturesTab';
import LocationTab from '@/components/AdDetail/LocationTab';
import TechnicalSpecsTab from '@/components/AdDetail/TechnicalSpecsTab';
import LoanCalculator from '@/components/tools/LoanCalculator';
import ViewTracker from '@/components/ViewTracker';
import LiveVisitorCount from '@/components/LiveVisitorCount';
import Badge from '@/components/ui/Badge';
import { Eye, MapPin } from 'lucide-react';

export default async function AdDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ad = await getAdDetailServer(Number(id));
  if (!ad) return notFound();

  const formattedPrice = ad.price?.toLocaleString('tr-TR');
  const location = \`\${ad.city || ''} / \${ad.district || ''}\`;
  const sellerInfo = ad.profiles || { full_name: 'Bilinmiyor', phone: '', email: '', show_phone: false };
  const adImages = ad.images && ad.images.length > 0 ? ad.images : (ad.image ? [ad.image] : []);

  // DINAMIK BREADCRUMB OLUŞTURMA
  const breadcrumbItems = [];

  // Ana Kategori
  if (ad.category.includes('otomobil') || ad.category.includes('vasita') || ad.brand) {
      breadcrumbItems.push({ label: 'Vasıta', href: '/search?category=vasita' });
      breadcrumbItems.push({ label: 'Otomobil', href: '/search?category=otomobil' });

      if (ad.brand) {
          breadcrumbItems.push({ label: ad.brand, href: \`/search?category=otomobil&brand=\${encodeURIComponent(ad.brand)}\` });
      }
      if (ad.series) {
          breadcrumbItems.push({
              label: ad.series,
              href: \`/search?category=otomobil&brand=\${encodeURIComponent(ad.brand)}&series=\${encodeURIComponent(ad.series)}\`
          });
      }
      if (ad.model) {
          breadcrumbItems.push({
              label: ad.model,
              href: \`/search?category=otomobil&brand=\${encodeURIComponent(ad.brand)}&series=\${encodeURIComponent(ad.series)}&model=\${encodeURIComponent(ad.model)}\`
          });
      }
  } else if (ad.category.includes('konut') || ad.category.includes('emlak')) {
      breadcrumbItems.push({ label: 'Emlak', href: '/search?category=emlak' });
      if (ad.category.includes('konut')) {
          breadcrumbItems.push({ label: 'Konut', href: '/search?category=konut' });
      }
  }

  // Son olarak İlan Başlığı (Link yok)
  breadcrumbItems.push({ label: 'İlan Detayı' });


  // Tabs Yapılandırması
  const tabItems = [
     { id: 'desc', label: 'İlan Açıklaması', content: <div className="text-slate-700 leading-relaxed whitespace-pre-wrap text-base p-2">{ad.description}</div> },
     { id: 'features', label: 'Özellikler', content: <FeaturesTab ad={ad} /> },
     { id: 'location', label: 'Konum', content: <LocationTab city={ad.city} district={ad.district} /> }
  ];

  if (ad.technical_specs) {
      tabItems.splice(2, 0, { id: 'tech_specs', label: 'Teknik Veriler', content: <TechnicalSpecsTab specs={ad.technical_specs} /> });
  }

  return (
    <div className="pb-20 relative font-sans bg-gray-50 min-h-screen">
      <ViewTracker adId={ad.id} />
      <StickyAdHeader title={ad.title} price={formattedPrice} currency={ad.currency} />

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* YENİ BREADCRUMB */}
        <Breadcrumb items={breadcrumbItems} />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-slate-900 font-bold text-2xl md:text-3xl leading-tight mb-2">{ad.title}</h1>
            <div className="flex items-center gap-4 text-sm text-slate-500">
               <span className="flex items-center gap-1"><MapPin size={16}/> {location}</span>
               <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
               <span className="text-indigo-600 font-medium">#{ad.id}</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
              {ad.is_urgent && <Badge variant="danger" className="text-sm px-3 py-1">ACİL</Badge>}
              {ad.is_vitrin && <Badge variant="warning" className="text-sm px-3 py-1">VİTRİN</Badge>}
              <LiveVisitorCount adId={ad.id} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden p-1">
               <Gallery mainImage={ad.image} images={adImages} />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex justify-between items-center">
               <div>
                 <p className="text-sm text-slate-500 mb-1">Fiyat</p>
                 <p className="text-3xl font-extrabold text-indigo-700">{formattedPrice} <span className="text-xl text-slate-400 font-normal">{ad.currency}</span></p>
               </div>
               <div className="hidden md:block">
                 <AdActionButtons id={ad.id} title={ad.title} image={ad.image} sellerName={sellerInfo.full_name} />
               </div>
            </div>

            <Tabs items={tabItems} />
          </div>

          <div className="lg:col-span-4 space-y-6">
             <SellerSidebar
                sellerId={ad.user_id}
                sellerName={sellerInfo.full_name || 'Kullanıcı'}
                sellerPhone={sellerInfo.phone || 'Telefon yok'}
                showPhone={sellerInfo.show_phone}
                adId={ad.id}
                adTitle={ad.title}
                adImage={ad.image}
                price={formattedPrice}
                currency={ad.currency}
             />

             <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-bold text-slate-800 mb-4 text-sm uppercase tracking-wider">İlan Künyesi</h3>
                <ul className="space-y-3 text-sm">
                   <li className="flex justify-between border-b border-gray-50 pb-2"><span className="text-slate-500">İlan Tarihi</span><span className="font-medium text-slate-900">{new Date(ad.created_at).toLocaleDateString()}</span></li>
                   {ad.brand && <li className="flex justify-between border-b border-gray-50 pb-2"><span className="text-slate-500">Marka</span><span className="font-medium text-slate-900">{ad.brand}</span></li>}
                   {ad.model && <li className="flex justify-between border-b border-gray-50 pb-2"><span className="text-slate-500">Model</span><span className="font-medium text-slate-900">{ad.model}</span></li>}
                   {ad.year && <li className="flex justify-between border-b border-gray-50 pb-2"><span className="text-slate-500">Yıl</span><span className="font-medium text-slate-900">{ad.year}</span></li>}
                   {ad.km && <li className="flex justify-between border-b border-gray-50 pb-2"><span className="text-slate-500">Kilometre</span><span className="font-medium text-slate-900">{ad.km}</span></li>}
                   {ad.heavy_damage !== null && ad.heavy_damage !== undefined && (
                        <li className="flex justify-between border-b border-gray-50 pb-2">
                            <span className="text-slate-500">Ağır Hasar Kayıtlı</span>
                            <span className={\`font-bold \${ad.heavy_damage ? 'text-red-600' : 'text-green-600'}\`}>{ad.heavy_damage ? 'Evet' : 'Hayır'}</span>
                        </li>
                   )}
                   <li className="flex justify-between pt-1">
                      <span className="text-slate-500">Görüntülenme</span>
                      <span className="font-medium text-slate-900 flex items-center gap-1"><Eye size={14}/> {ad.view_count || 0}</span>
                   </li>
                </ul>
             </div>

             {ad.category.includes('konut') && <LoanCalculator price={ad.price} />}
          </div>

        </div>
      </div>
      <MobileAdActionBar price={\`\${formattedPrice} \${ad.currency}\`} phone={sellerInfo.show_phone ? sellerInfo.phone : undefined} />
    </div>
  );
}
`,
  },
];

files.forEach((file) => {
  try {
    const dir = path.dirname(file.path);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(process.cwd(), file.path), file.content.trim());
    console.log(
      colors.green + "✔ " + file.path + " güncellendi." + colors.reset,
    );
  } catch (error) {
    console.error(
      colors.bold + "✘ Hata: " + file.path + " yazılamadı." + colors.reset,
    );
  }
});

console.log(
  colors.blue +
    colors.bold +
    "\n✅ İŞLEM TAMAMLANDI! BREADCRUMB VE FİLTRELEME SİSTEMİ AKTİF." +
    colors.reset,
);
