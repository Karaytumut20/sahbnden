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
    "\n🚀 SAHİBİNDEN CLONE - GELİŞTİRME PAKETİ 9 (AKILLI KATEGORİ SİSTEMİ)\n" +
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
// LIB/ACTIONS.TS (Gelişmiş Kategori Sorgusu ile Güncellendi)
// -------------------------------------------------------------------------
const actionsPath = "lib/actions.ts";
const newActionsContent = `
'use server'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// --- KATEGORİLER ---
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

// --- İLANLAR (AKILLI FİLTRELEME EKLENDİ) ---
export async function getAdsServer(searchParams?: any) {
  const supabase = await createClient()

  let query = supabase.from('ads').select('*, profiles(full_name), categories(title)').eq('status', 'yayinda')

  // Filtreler
  if (searchParams?.q) query = query.ilike('title', \`%\${searchParams.q}%\`)
  if (searchParams?.minPrice) query = query.gte('price', searchParams.minPrice)
  if (searchParams?.maxPrice) query = query.lte('price', searchParams.maxPrice)
  if (searchParams?.city) query = query.eq('city', searchParams.city)

  // --- AKILLI KATEGORİ FİLTRESİ ---
  // Seçilen kategori bir "Ana Kategori" ise, altındaki tüm kategorilerin ilanlarını da getirir.
  if (searchParams?.category) {
      // 1. Seçilen kategorinin ID'sini ve Slug'ını bul
      const { data: selectedCat } = await supabase
        .from('categories')
        .select('id, slug')
        .eq('slug', searchParams.category)
        .single();

      if (selectedCat) {
        // 2. Bu kategorinin alt kategorilerini bul (parent_id = selectedCat.id)
        const { data: subCats } = await supabase
          .from('categories')
          .select('slug')
          .eq('parent_id', selectedCat.id);

        // 3. Filtre listesi oluştur: [Seçilen Kategori, ...Alt Kategoriler]
        const categoriesToFilter = [selectedCat.slug];
        if (subCats && subCats.length > 0) {
            subCats.forEach(c => categoriesToFilter.push(c.slug));
        }

        // 4. "IN" operatörü ile bu listedeki herhangi bir kategoriye sahip ilanları getir
        query = query.in('category', categoriesToFilter);
      } else {
        // Kategori veritabanında bulunamadıysa düz mantık devam et (boş döner)
        query = query.eq('category', searchParams.category);
      }
  }

  // Detaylı Filtreler
  if (searchParams?.room) query = query.eq('room', searchParams.room)
  if (searchParams?.minYear) query = query.gte('year', searchParams.minYear)
  if (searchParams?.maxYear) query = query.lte('year', searchParams.maxYear)
  if (searchParams?.maxKm) query = query.lte('km', searchParams.maxKm)

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

    const [users, ads, payments] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('ads').select('*', { count: 'exact', head: true }).eq('status', 'yayinda'),
        supabase.from('payments').select('amount')
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

console.log(colors.bold + "\n🎉 AKILLI FİLTRELEME AKTİF!" + colors.reset);
console.log("1. Terminalde `node setup.js` komutunu çalıştırın.");
console.log("2. Siteyi yenileyin.");
console.log(
  "3. 'İkinci El ve Sıfır Alışveriş' kategorisine tıkladığınızda artık altındaki Bilgisayar, Telefon vb. tüm ilanlar listelenecek.",
);
