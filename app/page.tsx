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