import Sidebar from "@/components/Sidebar";
import Showcase from "@/components/Showcase";
import { getShowcaseAdsServer, getCategoryTreeServer } from "@/lib/actions";

export const revalidate = 60; // 60 saniyede bir verileri tazele

export default async function Home() {
  const [vitrinAds, categories] = await Promise.all([
    getShowcaseAdsServer(),
    getCategoryTreeServer()
  ]);

  const urgentAds = vitrinAds.filter((ad: any) => ad.is_urgent) || [];

  return (
    <div className="flex gap-4">
      <Sidebar categories={categories} />
      <Showcase vitrinAds={vitrinAds} urgentAds={urgentAds} />
    </div>
  );
}