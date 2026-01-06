
import Sidebar from "@/components/Sidebar";
import Showcase from "@/components/Showcase";

export default function Home() {
  return (
    <div className="flex gap-4">
      <Sidebar />
      <Showcase />
    </div>
  );
}
