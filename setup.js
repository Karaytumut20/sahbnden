const fs = require("fs");
const path = require("path");

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  bold: "\x1b[1m",
  magenta: "\x1b[35m",
};

console.log(
  colors.cyan +
    colors.bold +
    "\n🚀 SAHİBİNDEN CLONE - GELİŞTİRME PAKETİ 7 (TAM DİNAMİK YAPI)\n" +
    colors.reset,
);

function writeFile(filePath, content) {
  const absolutePath = path.join(__dirname, filePath);
  const dir = path.dirname(absolutePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(absolutePath, content.trim());
  console.log(`${colors.green}✔ Güncellendi:${colors.reset} ${filePath}`);
}

// -------------------------------------------------------------------------
// 1. LIB/ACTIONS.TS (Tüm Veri Çekme Fonksiyonları)
// -------------------------------------------------------------------------
const actionsPath = "lib/actions.ts";
const newActionsContent = `
'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// --- KATEGORİLER ---
export async function getCategoriesServer() {
  const supabase = await createClient()
  // Alt kategorileriyle birlikte çekmek için self-join veya recursive query gerekebilir.
  // Basitlik için tüm kategorileri çekip client tarafında tree yapabiliriz veya
  // burada sadece ana kategorileri çekip altlarını lazy load yapabiliriz.
  // Şimdilik düz liste çekiyoruz.
  const { data } = await supabase.from('categories').select('*').order('title');
  return data || [];
}

export async function getCategoryTreeServer() {
  const supabase = await createClient();
  const { data } = await supabase.from('categories').select('*').order('title');

  if (!data) return [];

  // Parent-Child ilişkisini kur
  const parents = data.filter(c => !c.parent_id);
  return parents.map(p => ({
    ...p,
    subs: data.filter(c => c.parent_id === p.id)
  }));
}

// --- İLANLAR ---
export async function getAdsServer(searchParams?: any) {
  const supabase = await createClient()
  let query = supabase.from('ads').select('*, profiles(full_name), categories(title)').eq('status', 'yayinda')

  // Filtreler
  if (searchParams?.q) query = query.ilike('title', \`%\${searchParams.q}%\`)
  if (searchParams?.minPrice) query = query.gte('price', searchParams.minPrice)
  if (searchParams?.maxPrice) query = query.lte('price', searchParams.maxPrice)
  if (searchParams?.city) query = query.eq('city', searchParams.city)

  // Kategori Filtresi (Slug veya ID ile)
  if (searchParams?.category) {
      // Eğer kategori ID ise direkt, slug ise join ile bakmak lazım.
      // Basitlik için category sütununun slug tuttuğunu varsayalım veya join yapalım.
      // Veritabanı tasarımında ads tablosunda category_slug veya category_id olması gerek.
      // Şimdilik 'category' kolonu slug tutuyor varsayıyoruz.
      query = query.eq('category', searchParams.category)
  }

  // Sıralama
  if (searchParams?.sort === 'price_asc') query = query.order('price', { ascending: true })
  else if (searchParams?.sort === 'price_desc') query = query.order('price', { ascending: false })
  else query = query.order('created_at', { ascending: false })

  const { data } = await query
  return data || []
}

export async function getAdDetailServer(id: number) {
  const supabase = await createClient()
  const { data } = await supabase.from('ads').select('*, profiles(*), categories(title)').eq('id', id).single()
  return data
}

export async function getRelatedAdsServer(category: string, currentId: number) {
    const supabase = await createClient();
    const { data } = await supabase.from('ads')
        .select('*')
        .eq('category', category)
        .eq('status', 'yayinda')
        .neq('id', currentId)
        .limit(5);
    return data || [];
}

export async function getShowcaseAdsServer() {
  const supabase = await createClient()
  const { data } = await supabase.from('ads').select('*').eq('status', 'yayinda').order('is_vitrin', { ascending: false }).limit(20)
  return data || []
}

export async function getAdsByIds(ids: number[]) {
    if (!ids || ids.length === 0) return [];
    const supabase = await createClient();
    const { data } = await supabase.from('ads').select('*, profiles(full_name)').in('id', ids);
    return data || [];
}

// --- İÇERİK (CMS) ---
export async function getPageBySlugServer(slug: string) {
    const supabase = await createClient();
    const { data } = await supabase.from('pages').select('*').eq('slug', slug).single();
    return data;
}

export async function getHelpContentServer() {
    const supabase = await createClient();
    const { data: categories } = await supabase.from('faq_categories').select('*');
    const { data: faqs } = await supabase.from('faqs').select('*');
    return { categories: categories || [], faqs: faqs || [] };
}

// --- ADMIN STATS ---
export async function getAdminStatsServer() {
    const supabase = await createClient();

    // Paralel sorgular
    const [users, ads, payments] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('ads').select('*', { count: 'exact', head: true }).eq('status', 'yayinda'),
        supabase.from('payments').select('amount') // Ciro hesabı için
    ]);

    const totalRevenue = payments.data?.reduce((acc, curr) => acc + Number(curr.amount), 0) || 0;

    return {
        totalUsers: users.count || 0,
        activeAds: ads.count || 0,
        totalRevenue
    };
}

// --- İŞLEMLER ---
export async function createAdAction(formData: any) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Giriş yapmalısınız' }

  const adData = { ...formData, user_id: user.id, status: 'onay_bekliyor' }
  const { data, error } = await supabase.from('ads').insert([adData]).select('id').single()

  if (error) return { error: error.message }
  revalidatePath('/')
  return { success: true, adId: data.id }
}

export async function activateDopingAction(adId: number, dopingTypes: string[]) {
  const supabase = await createClient();

  // Ödeme kaydı oluştur (Opsiyonel ama iyi olur)
  // const { error: payError } = await supabase.from('payments').insert(...)

  const updates: any = {};
  if (dopingTypes.includes('1')) updates.is_vitrin = true;
  if (dopingTypes.includes('2')) updates.is_urgent = true;
  if (dopingTypes.includes('3')) updates.is_bold = true;

  const { error } = await supabase.from('ads').update(updates).eq('id', adId);
  if (error) return { error: error.message };

  revalidatePath('/');
  return { success: true };
}

export async function updateAdAction(id: number, formData: any) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Giriş yapmalısınız' }

    const { error } = await supabase.from('ads').update({ ...formData, status: 'onay_bekliyor' }).eq('id', id).eq('user_id', user.id)
    if (error) return { error: error.message }

    revalidatePath('/bana-ozel/ilanlarim')
    return { success: true }
}

// --- MAĞAZA ---
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
    revalidatePath('/bana-ozel/magazam')
    return { success: true }
}
export async function updateStoreAction(formData: any) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Giriş yapmalısınız' }
    const { error } = await supabase.from('stores').update(formData).eq('user_id', user.id)
    if (error) return { error: error.message }
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
`;
writeFile(actionsPath, newActionsContent);

// -------------------------------------------------------------------------
// 2. COMPONENTS/SIDEBAR.TSX (Dinamik Kategori)
// -------------------------------------------------------------------------
const sidebarPath = "components/Sidebar.tsx";
const sidebarContent = `
import React from 'react';
import Link from 'next/link';
import { Home, Car, Monitor, Briefcase, Shirt, BookOpen, Dog, Hammer, ChevronRight } from 'lucide-react';
import RecentAdsWidget from '@/components/RecentAdsWidget';

const iconMap: any = {
  Home, Car, Monitor, Briefcase, Shirt, BookOpen, Dog, Hammer
};

// Sidebar artık bir Server Component olarak kullanılacaksa props alabilir veya içinde fetch yapabilir.
// Ancak Sidebar genelde layout veya page içinde çağrılır. Veriyi prop olarak alması en temizidir.
export default function Sidebar({ categories }: { categories: any[] }) {

  return (
    <aside className="w-[220px] shrink-0 hidden md:block py-4 relative z-40">
      <ul className="border border-gray-200 bg-white shadow-sm rounded-sm dark:bg-[#1c1c1c] dark:border-gray-700 transition-colors">
        {categories.map((cat) => {
          const IconComponent = iconMap[cat.icon] || Home;
          return (
            <li key={cat.id} className="group border-b border-gray-100 last:border-0 relative dark:border-gray-700">
              <Link href={\`/search?category=\${cat.slug}\`} className="flex items-center justify-between px-3 py-2.5 text-[13px] text-[#333] hover:bg-blue-50 hover:text-blue-700 transition-colors dark:text-gray-200 dark:hover:bg-blue-900/30 dark:hover:text-blue-400">
                <span className="flex items-center gap-2.5 font-medium">
                  <IconComponent size={15} className="text-gray-400 group-hover:text-blue-700 dark:text-gray-500 dark:group-hover:text-blue-400" />
                  {cat.title}
                </span>
                <ChevronRight size={12} className="text-gray-300 opacity-0 group-hover:opacity-100 dark:text-gray-500" />
              </Link>
              {/* Alt Kategoriler (Hover Menu) */}
              {cat.subs && cat.subs.length > 0 && (
                <div className="hidden group-hover:block absolute left-[100%] top-0 w-[600px] min-h-full bg-white border border-gray-200 shadow-lg p-6 z-50 rounded-r-sm -ml-[1px] dark:bg-[#1c1c1c] dark:border-gray-700">
                    <h3 className="font-bold text-[#333] text-lg border-b border-gray-200 pb-2 mb-4 dark:text-white dark:border-gray-700">{cat.title}</h3>
                    <div className="grid grid-cols-3 gap-y-2 gap-x-8">
                    {cat.subs.map((sub: any) => (
                        <Link key={sub.id} href={\`/search?category=\${sub.slug}\`} className="text-[13px] text-gray-600 hover:text-blue-700 hover:underline flex items-center gap-1 dark:text-gray-400 dark:hover:text-blue-400">
                        <span className="w-1 h-1 bg-gray-300 rounded-full dark:bg-gray-600"></span>
                        {sub.title}
                        </Link>
                    ))}
                    </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-sm text-center dark:bg-[#111827] dark:border-gray-700">
         <p className="text-[12px] font-bold text-blue-900 dark:text-blue-400">Reklam Alanı</p>
         <div className="h-[200px] bg-gray-200 mt-2 flex items-center justify-center text-gray-400 text-[10px] dark:bg-gray-800 dark:text-gray-500">
            Google Ads
         </div>
      </div>
      <RecentAdsWidget />
    </aside>
  );
}
`;
writeFile(sidebarPath, sidebarContent);

// -------------------------------------------------------------------------
// 3. APP/PAGE.TSX (Ana Sayfa - Verileri Çek ve Dağıt)
// -------------------------------------------------------------------------
const homePagePath = "app/page.tsx";
const homePageContent = `
import Sidebar from "@/components/Sidebar";
import Showcase from "@/components/Showcase";
import { getShowcaseAdsServer, getCategoryTreeServer } from "@/lib/actions";

export const revalidate = 60; // 60 saniyede bir verileri tazele

export default async function Home() {
  // Paralel veri çekme
  const [vitrinAds, categories] = await Promise.all([
    getShowcaseAdsServer(),
    getCategoryTreeServer()
  ]);

  // Acil ilanlar (örnek olarak fiyatı düşük olanları veya is_urgent olanları alabiliriz)
  // Backend'den is_urgent: true olanları ayrı çekmek daha performanslıdır ama şimdilik filter kullanıyoruz.
  const urgentAds = vitrinAds.filter((ad: any) => ad.is_urgent) || [];

  return (
    <div className="flex gap-4">
      {/* Kategorileri Sidebar'a prop olarak geçiyoruz */}
      <Sidebar categories={categories} />
      <Showcase vitrinAds={vitrinAds} urgentAds={urgentAds} />
    </div>
  );
}
`;
writeFile(homePagePath, homePageContent);

// -------------------------------------------------------------------------
// 4. APP/ILAN-VER/PAGE.TSX (Dinamik Kategori Seçimi)
// -------------------------------------------------------------------------
const postAdPagePath = "app/ilan-ver/page.tsx";
const postAdPageContent = `
import React from 'react';
import Link from 'next/link';
import { Home, Car, Monitor, ChevronRight, Briefcase, Shirt, BookOpen, Dog, Hammer } from 'lucide-react';
import { getCategoryTreeServer } from '@/lib/actions';

const iconMap: any = { Home, Car, Monitor, Briefcase, Shirt, BookOpen, Dog, Hammer };

export default async function PostAdCategory() {
  const categories = await getCategoryTreeServer();

  return (
    <div className="max-w-[800px] mx-auto py-8">
      <h1 className="text-xl font-bold text-[#333] mb-6 border-b pb-2 dark:text-white dark:border-gray-700">Adım 1: Kategori Seçimi</h1>

      <div className="bg-white border border-gray-200 shadow-sm rounded-sm dark:bg-[#1c1c1c] dark:border-gray-700">
        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
          {categories.map((cat: any) => {
            const Icon = iconMap[cat.icon] || Home;
            return (
              <li key={cat.id} className="group">
                <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-blue-50 transition-colors dark:hover:bg-blue-900/20">
                  <div className="flex items-center gap-3">
                    <Icon size={20} className="text-gray-500 dark:text-gray-400" />
                    <span className="font-bold text-[#333] dark:text-gray-100">{cat.title}</span>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
                </div>

                {/* Alt Kategori */}
                {cat.subs && cat.subs.length > 0 && (
                    <div className="bg-gray-50 pl-12 pr-4 py-2 hidden group-hover:block border-t border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                        <p className="text-[11px] text-gray-500 mb-2 font-semibold dark:text-gray-400">ALT KATEGORİ SEÇİNİZ:</p>
                        <div className="grid grid-cols-2 gap-2">
                        {cat.subs.map((sub: any) => (
                            <Link
                            key={sub.id}
                            href={\`/ilan-ver/detay?cat=\${cat.slug}&sub=\${sub.slug}\`}
                            className="text-[13px] text-blue-800 hover:underline hover:text-blue-900 flex items-center dark:text-blue-400 dark:hover:text-blue-300"
                            >
                            <span className="w-1 h-1 bg-blue-500 rounded-full mr-2"></span>
                            {sub.title}
                            </Link>
                        ))}
                        </div>
                    </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
`;
writeFile(postAdPagePath, postAdPageContent);

// -------------------------------------------------------------------------
// 5. COMPONENTS/RELATEDADS.TSX (Gerçek Benzer İlanlar)
// -------------------------------------------------------------------------
const relatedAdsPath = "components/RelatedAds.tsx";
const relatedAdsContent = `
import React from 'react';
import Link from 'next/link';
import { getRelatedAdsServer } from '@/lib/actions';

// Server Component olarak çalışacak
export default async function RelatedAds({ category, currentId }: { category: string, currentId: number }) {
  const related = await getRelatedAdsServer(category, currentId);

  if (!related || related.length === 0) return null;

  return (
    <div className="mt-8 border-t border-gray-200 pt-6">
      <h3 className="font-bold text-[#333] text-md mb-4">Benzer İlanlar</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {related.map((ad: any) => (
          <Link href={\`/ilan/\${ad.id}\`} key={ad.id} className="block group">
            <div className="bg-white border border-gray-200 rounded-sm shadow-sm hover:shadow-md transition-all cursor-pointer h-full flex flex-col">
              <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                <img
                  src={ad.image || 'https://via.placeholder.com/300x200'}
                  alt={ad.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-2 space-y-1 flex-1 flex flex-col justify-between">
                <p className="text-[11px] text-[#333] font-semibold leading-tight group-hover:underline line-clamp-2">
                  {ad.title}
                </p>
                <div className="pt-2">
                   <p className="text-[13px] font-bold text-blue-900">
                     {ad.price?.toLocaleString()} {ad.currency}
                   </p>
                   <p className="text-[9px] text-gray-500 truncate">{ad.city} / {ad.district}</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
`;
writeFile(relatedAdsPath, relatedAdsContent);

// -------------------------------------------------------------------------
// 6. APP/KURUMSAL/[SLUG]/PAGE.TSX (Dinamik Sayfa)
// -------------------------------------------------------------------------
const corporatePath = "app/kurumsal/[slug]/page.tsx";
const corporateContent = `
import React from 'react';
import { notFound } from 'next/navigation';
import { getPageBySlugServer } from '@/lib/actions';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export default async function CorporatePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPageBySlugServer(slug);

  if (!page) return notFound();

  return (
    <div className="container max-w-[1000px] mx-auto py-8 px-4 flex flex-col md:flex-row gap-8">

      {/* Sol Menü - İdealde burası da dinamik bir liste olabilir */}
      <div className="w-full md:w-[250px] shrink-0">
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm">
          <div className="p-4 border-b border-gray-100 font-bold text-[#333]">Kurumsal</div>
          <ul>
            {['hakkimizda', 'kullanim-kosullari', 'gizlilik-politikasi'].map(key => (
              <li key={key}>
                <Link
                  href={\`/kurumsal/\${key}\`}
                  className={\`block px-4 py-3 text-sm border-b border-gray-50 last:border-0 hover:bg-gray-50 flex items-center justify-between \${slug === key ? 'text-blue-700 font-bold bg-blue-50' : 'text-gray-600'}\`}
                >
                  {key.replace('-', ' ').toUpperCase()}
                  {slug === key && <ChevronRight size={14} />}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/iletisim" className="block px-4 py-3 text-sm text-gray-600 hover:bg-gray-50">
                İletişim
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="flex-1 bg-white border border-gray-200 rounded-sm shadow-sm p-8">
        <h1 className="text-2xl font-bold text-[#333] mb-6 border-b border-gray-100 pb-4">
          {page.title}
        </h1>
        <div
          className="text-sm text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </div>

    </div>
  );
}
`;
writeFile(corporatePath, corporateContent);

// -------------------------------------------------------------------------
// 7. APP/YARDIM/PAGE.TSX (Dinamik Yardım)
// -------------------------------------------------------------------------
const helpPath = "app/yardim/page.tsx";
const helpContent = `
"use client";
import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, CircleHelp } from 'lucide-react';
import { getHelpContentServer } from '@/lib/actions';

// Client Component olduğu için veriyi useEffect ile çekeceğiz veya server component wrapper kullanacağız.
// Bu örnekte Server Action'ı client'tan çağırıyoruz.

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [data, setData] = useState<{ categories: any[], faqs: any[] }>({ categories: [], faqs: [] });

  useEffect(() => {
    getHelpContentServer().then(setData);
  }, []);

  const filteredFaqs = data.faqs.filter((item: any) =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-[#f6f7f9] min-h-screen pb-10">

      <div className="bg-[#2d405a] text-white py-12 px-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Size nasıl yardımcı olabiliriz?</h1>
        <div className="max-w-[600px] mx-auto relative">
          <input
            type="text"
            placeholder="Sorunuzu buraya yazın (Örn: Şifremi unuttum)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-sm text-black focus:outline-none shadow-lg"
          />
          <Search className="absolute left-4 top-3.5 text-gray-400" />
        </div>
      </div>

      <div className="container max-w-[1000px] mx-auto px-4 -mt-8 relative z-10">

        {/* Kategoriler */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {data.categories.map((cat: any) => (
            <div key={cat.id} className="bg-white p-6 rounded-sm shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-center cursor-pointer">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                 <CircleHelp size={24}/>
              </div>
              <h3 className="font-bold text-[#333] mb-1">{cat.title}</h3>
              <p className="text-xs text-gray-500">{cat.description}</p>
            </div>
          ))}
        </div>

        {/* Sıkça Sorulan Sorular */}
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6">
          <h2 className="text-xl font-bold text-[#333] mb-6 border-b border-gray-100 pb-2">
            {searchTerm ? 'Arama Sonuçları' : 'Sıkça Sorulan Sorular'}
          </h2>

          <div className="space-y-2">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((item: any) => (
                <div key={item.id} className="border border-gray-100 rounded-sm overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === item.id ? null : item.id)}
                    className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 text-left transition-colors"
                  >
                    <span className="font-semibold text-sm text-[#333]">{item.question}</span>
                    {openFaq === item.id ? <ChevronUp size={16} className="text-gray-500" /> : <ChevronDown size={16} className="text-gray-500" />}
                  </button>
                  {openFaq === item.id && (
                    <div className="p-4 bg-white text-sm text-gray-600 border-t border-gray-100 animate-in slide-in-from-top-2">
                      {item.answer}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">Aradığınız kriterlere uygun sonuç bulunamadı.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
`;
writeFile(helpPath, helpContent);

// -------------------------------------------------------------------------
// 8. APP/ADMIN/PAGE.TSX (Dinamik Admin Dashboard)
// -------------------------------------------------------------------------
const adminPath = "app/admin/page.tsx";
const adminContent = `
import React from 'react';
import { Users, FileText, TrendingUp, AlertCircle } from 'lucide-react';
import { getAdminStatsServer } from '@/lib/actions';

export default async function AdminDashboard() {
  const stats = await getAdminStatsServer();

  const statCards = [
    { title: 'Toplam Üye', value: stats.totalUsers, icon: Users, color: 'bg-blue-500' },
    { title: 'Aktif İlanlar', value: stats.activeAds, icon: FileText, color: 'bg-green-500' },
    { title: 'Toplam Ciro', value: \`\${stats.totalRevenue} TL\`, icon: TrendingUp, color: 'bg-purple-500' },
    { title: 'Bekleyen İşler', value: '0', icon: AlertCircle, color: 'bg-orange-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Genel Bakış</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className={\`p-3 rounded-full text-white \${stat.color}\`}>
                <stat.icon size={24} />
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>
      <div className="text-sm text-gray-500">
        * Veriler gerçek zamanlı olarak veritabanından çekilmektedir.
      </div>
    </div>
  );
}
`;
writeFile(adminPath, adminContent);

console.log(
  colors.magenta +
    "\n------------------------------------------------------------------" +
    colors.reset,
);
console.log(
  "ÖNEMLİ: Supabase'de aşağıdaki tabloları ve verileri oluşturmalısınız:",
);
console.log("Bu SQL komutunu SQL Editor'de çalıştırın:");
console.log(
  colors.yellow +
    `
-- 1. Kategoriler Tablosu
create table public.categories (
  id bigint generated by default as identity primary key,
  title text not null,
  slug text not null unique,
  icon text,
  parent_id bigint references public.categories(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. İçerik Sayfaları Tablosu
create table public.pages (
  slug text primary key,
  title text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. SSS Kategorileri
create table public.faq_categories (
  id bigint generated by default as identity primary key,
  title text not null,
  description text,
  icon text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. SSS Maddeleri
create table public.faqs (
  id bigint generated by default as identity primary key,
  category_id bigint references public.faq_categories(id),
  question text not null,
  answer text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Ödemeler Tablosu (Admin Ciro için)
create table public.payments (
  id bigint generated by default as identity primary key,
  user_id uuid references auth.users(id),
  amount decimal not null,
  description text,
  status text default 'success',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Halka Açık Okuma İzinleri (RLS)
alter table public.categories enable row level security;
create policy "Public read categories" on public.categories for select using (true);

alter table public.pages enable row level security;
create policy "Public read pages" on public.pages for select using (true);

alter table public.faq_categories enable row level security;
create policy "Public read faq_categories" on public.faq_categories for select using (true);

alter table public.faqs enable row level security;
create policy "Public read faqs" on public.faqs for select using (true);

-- Örnek Veri (Başlangıç için)
insert into public.categories (title, slug, icon) values
('Emlak', 'emlak', 'Home'),
('Vasıta', 'vasita', 'Car'),
('İkinci El ve Sıfır Alışveriş', 'alisveris', 'Monitor');

insert into public.pages (slug, title, content) values
('hakkimizda', 'Hakkımızda', '<p>Biz Türkiye\\'nin en büyük ilan platformuyuz.</p>');

` +
    colors.reset,
);
console.log(
  colors.magenta +
    "------------------------------------------------------------------" +
    colors.reset,
);

console.log(colors.bold + "\n🎉 TAM DİNAMİK YAPI KURULDU!" + colors.reset);
console.log("1. Terminalde `npm run dev` komutunu çalıştırın.");
console.log("2. Supabase SQL Editor'de yukarıdaki SQL kodunu çalıştırın.");
console.log(
  "3. Artık menüler, yardım sayfaları ve admin paneli veritabanından besleniyor.",
);
