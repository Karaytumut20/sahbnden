
import Sidebar from "@/components/Sidebar";
import Showcase from "@/components/Showcase";
import { getShowcaseAds, getUrgentAds } from "@/lib/services";

export const revalidate = 0; // Her istekte veriyi yenile (veya 60 saniye yapabilirsin)

export default async function Home() {
  // Veritabanından verileri çek
  const vitrinAds = await getShowcaseAds(15);
  const urgentAds = await getUrgentAds(10);

  return (
    <div className="flex gap-4">
      <Sidebar />
      <Showcase vitrinAds={vitrinAds} urgentAds={urgentAds} />
    </div>
  );
}
