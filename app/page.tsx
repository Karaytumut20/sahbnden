import Sidebar from "@/components/Sidebar";
import Showcase from "@/components/Showcase";
import { getShowcaseAdsServer } from "@/lib/actions";

// Next.js 15 Caching stratejisi
export const revalidate = 60; // 60 saniyede bir yenile

export default async function Home() {
  const vitrinAds = await getShowcaseAdsServer();

  // Urgent için ayrı fonksiyon yazmaya gerek yok, sıralama ile hallediyoruz şimdilik
  const urgentAds = [...vitrinAds].sort((a,b) => a.price - b.price);

  return (
    <div className="flex gap-4">
      <Sidebar />
      <Showcase vitrinAds={vitrinAds} urgentAds={urgentAds} />
    </div>
  );
}