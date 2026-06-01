import { LatestNewsList } from "@/components/home/LatestNewsList";
import { HomeSidebar } from "@/components/home/HomeSidebar";

export function HomeMainGrid() {
  return (
    <div className="portal-section">
      <div className="mx-auto grid w-full max-w-portal gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-8">
          <LatestNewsList embedded />
        </div>
        <div className="lg:col-span-4">
          <HomeSidebar />
        </div>
      </div>
    </div>
  );
}
