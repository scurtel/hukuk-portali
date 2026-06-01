import { Container } from "@/components/layout/Container";

export function TopBar() {
  return (
    <div className="hidden border-b border-white/10 bg-navy lg:block">
      <Container wide className="flex min-h-8 items-center justify-between gap-3 py-1 text-xs text-white/80">
        <p className="font-medium tracking-wide">Hukuk · Yapay Zekâ · LegalTech · Analiz</p>
        <p className="shrink-0 text-white/60">
          {new Date().toLocaleDateString("tr-TR", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
          })}
        </p>
      </Container>
    </div>
  );
}
