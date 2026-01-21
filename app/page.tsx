import Sidebar from "@/components/Sidebar";
import HomeFeed from "@/components/HomeFeed";
import { getInfiniteAdsAction, getCategoryTreeServer } from "@/lib/actions";

// Her 60 saniyede bir sayfayı statik olarak yeniden oluştur (ISR)
export const revalidate = 60;

export default async function Home() {
  // İlk 20 ilanı sunucuda çek
  const { data: initialAds } = await getInfiniteAdsAction(1, 20);
  const categories = await getCategoryTreeServer();

  return (
    <div className="flex gap-4 pt-4">
      <Sidebar categories={categories} />
      <HomeFeed initialAds={initialAds} />
    </div>
  );
}