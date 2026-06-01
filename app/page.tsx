import { AiLawyerSection } from "@/components/home/AiLawyerSection";
import { AnalysisSection } from "@/components/home/AnalysisSection";
import { GuidesSection } from "@/components/home/GuidesSection";
import { HeroLead } from "@/components/home/HeroLead";
import { HomeMainGrid } from "@/components/home/HomeMainGrid";
import { HotNewsStrip } from "@/components/home/HotNewsStrip";
import { TechLawSection } from "@/components/home/TechLawSection";

export default function HomePage() {
  return (
    <>
      <HeroLead />
      <HotNewsStrip />
      <HomeMainGrid />
      <AiLawyerSection />
      <TechLawSection />
      <AnalysisSection />
      <GuidesSection />
    </>
  );
}
