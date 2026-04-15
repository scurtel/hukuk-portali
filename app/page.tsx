import { AnalysisSection } from "@/components/home/AnalysisSection";
import { FeaturedPosts } from "@/components/home/FeaturedPosts";
import { GuidesSection } from "@/components/home/GuidesSection";
import { HeroSection } from "@/components/home/HeroSection";
import { LatestNews } from "@/components/home/LatestNews";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedPosts />
      <LatestNews />
      <GuidesSection />
      <AnalysisSection />
    </>
  );
}
