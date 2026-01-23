import React from 'react';
import Sidebar from "@/components/Sidebar";
import HomeFeed from "@/components/HomeFeed";
import { getInfiniteAdsAction, getCategoryTreeServer } from "@/lib/actions";

// Cache'i devre dışı bırak (Development ortamında anlık güncellemeleri görmek için)
export const revalidate = 0;

export default async function Home() {
  const { data: initialAds } = await getInfiniteAdsAction(1, 20);
  const categories = await getCategoryTreeServer();

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* 12-Column Grid Sistemi */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* SOL KOLON: Sidebar (3/12) - Sticky */}
        <aside className="hidden lg:block lg:col-span-3 xl:col-span-2">
          <div className="sticky top-24">
            <Sidebar categories={categories} />
          </div>
        </aside>

        {/* SAĞ KOLON: Feed (9/12) */}
        <main className="lg:col-span-9 xl:col-span-10 min-w-0">
          <HomeFeed initialAds={initialAds} />
        </main>

      </div>
    </div>
  );
}