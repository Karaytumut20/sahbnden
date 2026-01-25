const fs = require("fs");
const path = require("path");

// Konsol renkleri
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  blue: "\x1b[34m",
  bold: "\x1b[1m",
};

console.log(
  colors.blue +
    colors.bold +
    "\n🚀 KART GRİD YAPISI (2'Lİ GÖRÜNÜM) GÜNCELLENİYOR...\n" +
    colors.reset,
);

const files = [
  {
    path: "app/search/page.tsx",
    content: `import React from 'react';
import { getAdsServer } from '@/lib/actions';
import AdCard from '@/components/AdCard';
import FilterSidebar from '@/components/FilterSidebar';
import Pagination from '@/components/Pagination';
import ViewToggle from '@/components/ViewToggle';
import { SearchX } from 'lucide-react';

export default async function SearchPage(props: { searchParams: Promise<any> }) {
  const searchParams = await props.searchParams;
  const { data: ads, totalPages, count } = await getAdsServer(searchParams);
  const viewMode = (searchParams.view as 'grid' | 'list' | 'table') || 'list';

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Sidebar (3/12) */}
        <aside className="hidden lg:block lg:col-span-3">
          <FilterSidebar />
        </aside>

        {/* Main Content (9/12) */}
        <main className="lg:col-span-9 min-w-0">
           <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6 flex justify-between items-center">
              <div>
                 <h1 className="font-bold text-slate-800 text-lg">Arama Sonuçları</h1>
                 <p className="text-sm text-slate-500">{count} ilan bulundu</p>
              </div>
              <ViewToggle currentView={viewMode} />
           </div>

           {(!ads || ads.length === 0) ? (
             <div className="bg-white p-12 rounded-xl border border-gray-100 text-center">
               <SearchX size={48} className="mx-auto text-slate-300 mb-4"/>
               <h3 className="text-lg font-bold text-slate-800">Sonuç Bulunamadı</h3>
               <p className="text-slate-500">Filtreleri değiştirmeyi deneyin.</p>
             </div>
           ) : (
             <div className={viewMode === 'grid' ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4' : 'space-y-4'}>
               {ads.map((ad: any) => <AdCard key={ad.id} ad={ad} viewMode={viewMode} />)}
             </div>
           )}

           <div className="mt-10"><Pagination totalPages={totalPages} currentPage={Number(searchParams.page) || 1} /></div>
        </main>
      </div>
    </div>
  );
}
`,
  },
  {
    path: "components/Showcase.tsx",
    content: `"use client";
import React, { useState } from 'react';
import AdCard from '@/components/AdCard';

export default function Showcase({ vitrinAds, urgentAds }: { vitrinAds: any[], urgentAds: any[] }) {
  const [activeTab, setActiveTab] = useState('vitrin');

  const getActiveAds = () => {
    switch (activeTab) {
      case 'acil': return urgentAds;
      case 'vitrin': return vitrinAds;
      default: return vitrinAds;
    }
  };

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-end border-b border-gray-200 mb-4 overflow-x-auto">
        <button onClick={() => setActiveTab('vitrin')} className={\`px-4 py-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap \${activeTab === 'vitrin' ? 'border-[#ffe800] text-[#333]' : 'border-transparent text-gray-500 hover:text-[#333]'}\`}>Vitrindeki İlanlar</button>
        <button onClick={() => setActiveTab('acil')} className={\`px-4 py-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap \${activeTab === 'acil' ? 'border-red-600 text-red-600' : 'border-transparent text-gray-500 hover:text-red-600'}\`}>Acil Acil</button>
      </div>

      {/* Grid yapısı 2'li (grid-cols-2) başlatıldı */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {getActiveAds().length === 0 ? (
          <div className="col-span-2 sm:col-span-3 lg:col-span-5 text-center p-10 text-gray-500">Bu kategoride ilan bulunamadı.</div>
        ) : (
          getActiveAds().map((ad) => (
            <div key={ad.id} className="h-[280px]">
                <AdCard ad={ad} viewMode="grid" />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
`,
  },
  {
    path: "components/RelatedAds.tsx",
    content: `import React from 'react';
import AdCard from '@/components/AdCard';
import { getRelatedAdsServer } from '@/lib/actions';

export default async function RelatedAds({ category, currentId, price }: { category: string, currentId: number, price?: number }) {
  const relatedAds = await getRelatedAdsServer(category, currentId, price);

  if (relatedAds.length === 0) return null;

  return (
    <div className="mt-8 border-t border-gray-200 pt-6">
      <h3 className="font-bold text-[#333] mb-4 text-lg">Benzer İlanlar</h3>
      {/* Mobilde 2'li grid yapısı */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {relatedAds.map((ad: any) => (
            <div key={ad.id} className="h-[260px]">
                <AdCard ad={ad} viewMode="grid" />
            </div>
        ))}
      </div>
    </div>
  );
}
`,
  },
  {
    path: "app/satici/[id]/page.tsx",
    content: `import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { User, Phone, MapPin, Calendar, ShieldCheck, Mail } from 'lucide-react';
import ReviewSection from '@/components/ReviewSection';
import AdCard from '@/components/AdCard'; // AdCard eklendi

export default async function SellerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Satıcı Profilini Çek
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (!profile) return notFound();

  // 2. Satıcının İlanlarını Çek
  const { data: ads } = await supabase
    .from('ads')
    .select('*')
    .eq('user_id', id)
    .eq('status', 'yayinda')
    .order('created_at', { ascending: false });

  return (
    <div className="flex flex-col lg:flex-row gap-6 pt-4">

      {/* SOL KOLON: Satıcı Bilgileri */}
      <div className="w-full lg:w-[300px] shrink-0">
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6 sticky top-24">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold mb-3 border-4 border-white shadow-sm overflow-hidden">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
              ) : (
                profile.full_name?.charAt(0).toUpperCase() || 'U'
              )}
            </div>
            <h1 className="text-xl font-bold text-[#333] flex items-center gap-2 justify-center">
              {profile.full_name || 'İsimsiz Kullanıcı'}
              {profile.role === 'store' && <ShieldCheck size={18} className="text-green-600" title="Kurumsal Üye" />}
            </h1>
            <p className="text-xs text-gray-500 mt-1 capitalize">{profile.role === 'store' ? 'Kurumsal Mağaza' : 'Bireysel Üye'}</p>
          </div>

          <div className="space-y-4 border-t border-gray-100 pt-4">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Calendar size={16} className="text-gray-400" />
              <span>Üyelik: <span className="font-semibold text-[#333]">{new Date(profile.created_at).getFullYear()}</span></span>
            </div>
            {profile.phone && (
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Phone size={16} className="text-gray-400" />
                <span>{profile.phone}</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Mail size={16} className="text-gray-400" />
              <span className="truncate">{profile.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* SAĞ KOLON: İlanlar ve Yorumlar */}
      <div className="flex-1 min-w-0">

        {/* İLANLAR */}
        <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-[#333] mb-4 border-b border-gray-100 pb-2">
            Satıcının İlanları ({ads?.length || 0})
          </h2>

          {!ads || ads.length === 0 ? (
            <p className="text-sm text-gray-500">Bu satıcının aktif ilanı bulunmamaktadır.</p>
          ) : (
            // Grid 2'li olarak ayarlandı
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {ads.map((ad: any) => (
                <div key={ad.id} className="h-[260px]">
                    <AdCard ad={ad} viewMode="grid" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* YORUMLAR BİLEŞENİ */}
        <ReviewSection targetId={id} />

      </div>
    </div>
  );
}
`,
  },
  {
    path: "app/bana-ozel/favoriler/page.tsx",
    content: `"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { getFavoritesClient, toggleFavoriteClient } from '@/lib/services';
import { useToast } from '@/context/ToastContext';
import { Trash2, Loader2, HeartOff } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import AdCard from '@/components/AdCard';

export default function FavoritesPage() {
  const { user, loading: authLoading } = useAuth();
  const { addToast } = useToast();
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;

    if (user) {
      setLoading(true);
      getFavoritesClient(user.id)
        .then(data => setAds(data || []))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user, authLoading]);

  const handleRemove = async (adId: number) => {
    if (!user) return;
    setAds(prev => prev.filter(ad => ad.id !== adId));
    addToast('Favorilerden çıkarıldı.', 'info');
    try {
        await toggleFavoriteClient(user.id, adId);
    } catch {
        addToast("Hata oluştu", "error");
    }
  };

  if (authLoading || (loading && user)) {
    return (
        <div className="flex flex-col items-center justify-center p-20 gap-4">
            <Loader2 className="animate-spin text-blue-600" size={32}/>
            <p className="text-sm text-gray-500">Favorileriniz yükleniyor...</p>
        </div>
    );
  }

  if (!user) {
      return (
        <div className="p-10 text-center bg-white border rounded-sm">
            <p className="text-gray-600 mb-4">Favorilerinizi görmek için giriş yapmalısınız.</p>
            <Link href="/login" className="bg-blue-600 text-white px-6 py-2 rounded font-bold">Giriş Yap</Link>
        </div>
      );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm p-6">
      <h1 className="text-xl font-bold text-[#333] mb-6 flex items-center gap-2">
        Favori İlanlarım <span className="text-sm font-normal text-gray-500">({ads.length})</span>
      </h1>

      {ads.length === 0 ? (
        <EmptyState
            icon={HeartOff}
            title="Favori İlanınız Yok"
            description="Beğendiğiniz ilanları favoriye ekleyerek fiyat takibi yapabilirsiniz."
            actionLabel="İlanlara Göz At"
            actionUrl="/search"
        />
      ) : (
        // Mobilde 2'li grid yapısı
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {ads.map((ad: any) => (
            <div key={ad.id} className="relative group">
                <button
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRemove(ad.id); }}
                    className="absolute top-2 right-2 z-20 bg-white/90 p-2 rounded-full text-red-600 opacity-0 group-hover:opacity-100 transition-all shadow-md hover:scale-110"
                    title="Kaldır"
                >
                    <Trash2 size={16} />
                </button>
                <div className="h-[300px]">
                    <AdCard ad={ad} viewMode="grid" />
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
`,
  },
  {
    path: "app/magaza/[slug]/page.tsx",
    content: `import React from 'react';
import { notFound } from 'next/navigation';
import { getStoreBySlugServer, getStoreAdsServer } from '@/lib/actions';
import { MapPin, Phone, Globe, Search, Filter, Mail, Calendar } from 'lucide-react';
import AdCard from '@/components/AdCard';
import Tabs from '@/components/AdDetail/Tabs';

export default async function StorePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await getStoreBySlugServer(slug);

  if (!store) return notFound();

  const storeAds = await getStoreAdsServer(store.user_id);

  // Tab İçerikleri
  const tabItems = [
    {
      id: 'ilanlar',
      label: \`İlanlar (\${storeAds.length})\`,
      content: (
        <div className="flex gap-6">
            {/* Mağaza İçi Filtreleme Sidebar */}
            <div className="w-[200px] shrink-0 hidden md:block space-y-4">
                <div className="bg-gray-50 border border-gray-200 p-3 rounded-sm">
                    <h4 className="font-bold text-xs text-gray-600 mb-2 flex items-center gap-1"><Search size={12}/> Mağazada Ara</h4>
                    <input className="w-full border text-xs p-1.5 rounded-sm outline-none" placeholder="Kelime ile ara..." />
                </div>
                <div className="bg-gray-50 border border-gray-200 p-3 rounded-sm">
                    <h4 className="font-bold text-xs text-gray-600 mb-2 flex items-center gap-1"><Filter size={12}/> Fiyat Aralığı</h4>
                    <div className="flex gap-1 mb-2">
                        <input className="w-full border text-xs p-1 rounded-sm" placeholder="Min" />
                        <input className="w-full border text-xs p-1 rounded-sm" placeholder="Max" />
                    </div>
                    <button className="w-full bg-blue-600 text-white text-xs font-bold py-1 rounded-sm">Ara</button>
                </div>
            </div>

            {/* İlan Grid - Mobilde 2'li */}
            <div className="flex-1">
                {storeAds.length === 0 ? <p>İlan bulunamadı.</p> : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {storeAds.map((ad: any) => (
                            <div key={ad.id} className="h-[260px]">
                                <AdCard ad={ad} viewMode="grid" />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
      )
    },
    {
      id: 'hakkimizda',
      label: 'Hakkımızda',
      content: (
        <div className="max-w-3xl">
            <h3 className="font-bold text-lg mb-4">Hakkımızda</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{store.description || 'Mağaza açıklaması girilmemiş.'}</p>
            <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 border rounded-sm">
                    <span className="block text-xs text-gray-500 font-bold uppercase">Yetkili Kişi</span>
                    <span className="text-sm font-bold">{store.name}</span>
                </div>
                <div className="bg-gray-50 p-4 border rounded-sm">
                    <span className="block text-xs text-gray-500 font-bold uppercase">Üyelik Tarihi</span>
                    <span className="text-sm font-bold">{new Date(store.created_at).toLocaleDateString()}</span>
                </div>
            </div>
        </div>
      )
    }
  ];

  return (
    <div className="bg-[#f6f7f9] min-h-screen pb-10">
      {/* Banner */}
      <div className="h-[200px] w-full bg-gray-300 relative overflow-hidden group">
        <img src={store.banner || 'https://via.placeholder.com/1200x300'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"/>
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      <div className="container max-w-[1150px] mx-auto px-4 -mt-16 relative z-10">

        {/* Mağaza Kartı */}
        <div className="bg-white border rounded-sm shadow-sm p-6 flex flex-col md:flex-row gap-6 mb-6">
          <div className="w-32 h-32 bg-white p-1 rounded-sm border shrink-0 shadow-md relative -top-10 md:top-0">
            <img src={store.image || 'https://via.placeholder.com/150'} className="w-full h-full object-contain"/>
          </div>

          <div className="flex-1 -mt-10 md:mt-0">
            <div className="flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-bold text-[#333] mb-1">{store.name}</h1>
                    <p className="text-xs text-gray-500 uppercase tracking-wide font-bold mb-4">Kurumsal Mağaza</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-sm text-sm font-bold hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Mail size={16}/> Mesaj Gönder
                </button>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-2">
                <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                    <MapPin size={16} className="text-blue-600"/> <span>{store.location || 'Konum Yok'}</span>
                </div>
                {store.phone && (
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                        <Phone size={16} className="text-green-600"/> <span className="font-bold text-[#333]">{store.phone}</span>
                    </div>
                )}
                {store.website && (
                    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                        <Globe size={16} className="text-purple-600"/> <a href={'https://' + store.website} target="_blank" className="hover:text-blue-600 hover:underline">{store.website}</a>
                    </div>
                )}
            </div>
          </div>
        </div>

        {/* İçerik */}
        <Tabs items={tabItems} />

      </div>
    </div>
  );
}
`,
  },
  {
    path: "components/HomeFeed.tsx",
    content: `"use client";
import React, { useState } from 'react';
import AdCard from '@/components/AdCard';
import { getInfiniteAdsAction } from '@/lib/actions';
import { Loader2, ArrowDown, SearchX, PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function HomeFeed({ initialAds }: { initialAds: any[] }) {
  const [ads, setAds] = useState<any[]>(initialAds || []);
  const [page, setPage] = useState(2);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await getInfiniteAdsAction(page);
      if (res.data && res.data.length > 0) {
        setAds(prev => [...prev, ...res.data]);
        setPage(prev => prev + 1);
        setHasMore(res.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // EMPTY STATE (HİÇ İLAN YOKSA)
  if (!ads || ads.length === 0) {
      return (
          <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-100 rounded-xl shadow-sm text-center">
              <div className="bg-blue-50 p-6 rounded-full mb-6 animate-in zoom-in duration-300">
                  <SearchX size={48} className="text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Henüz Yayında İlan Yok</h2>
              <p className="text-gray-500 max-w-md mb-8">
                  Şu anda vitrinde gösterilecek aktif bir ilan bulunmamaktadır. İlk ilanı siz vererek binlerce alıcıya ulaşabilirsiniz!
              </p>
              <Link
                  href="/ilan-ver"
                  className="bg-indigo-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200 flex items-center gap-2"
              >
                  <PlusCircle size={20} /> Hemen Ücretsiz İlan Ver
              </Link>
          </div>
      );
  }

  return (
    <div className="space-y-6">
      {/* Vitrin Başlığı */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
          <span className="w-2 h-8 bg-indigo-600 rounded-full"></span>
          Vitrindeki İlanlar
        </h2>
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{ads.length} İlan</span>
      </div>

      {/* Grid: Mobilde 2 sütun, Tablette 3, Masaüstünde 4-5 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-6">
        {ads.map((ad) => (
          <div key={ad.id} className="h-full animate-in fade-in zoom-in-95 duration-500">
            <AdCard ad={ad} viewMode="grid" />
          </div>
        ))}
      </div>

      {/* Yükle Butonu */}
      {hasMore && (
        <div className="pt-8 text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="group relative inline-flex items-center justify-center px-8 py-3 text-sm font-bold text-indigo-600 transition-all duration-200 bg-white border-2 border-indigo-50 rounded-full hover:bg-indigo-50 hover:border-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin mr-2" size={18}/> : <ArrowDown className="mr-2 group-hover:translate-y-1 transition-transform" size={18}/>}
            {loading ? 'Yükleniyor...' : 'Daha Fazla Göster'}
          </button>
        </div>
      )}
    </div>
  );
}
`,
  },
];

files.forEach((file) => {
  try {
    const dir = path.dirname(file.path);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(path.join(process.cwd(), file.path), file.content);
    console.log(
      colors.green + "✔ " + file.path + " güncellendi." + colors.reset,
    );
  } catch (error) {
    console.error(
      colors.bold + "✘ Hata: " + file.path + " yazılamadı." + colors.reset,
    );
    console.error(error);
  }
});

console.log(
  colors.blue + colors.bold + "\n✅ İŞLEM TAMAMLANDI!" + colors.reset,
);
