export const siteConfig = {
  name: "Hukuk Portalı",
  url: "https://hukukportali.com",
  description:
    "Türkçe hukuk haberleri, rehberler ve analizler sunan profesyonel içerik portalı."
};

export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  let configuredUrl = envUrl && envUrl.length > 0 ? envUrl : siteConfig.url;
  if (!/^https?:\/\//i.test(configuredUrl)) {
    configuredUrl = `https://${configuredUrl}`;
  }
  return configuredUrl.replace(/\/$/, "");
}

export const navItems = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Haberler", href: "/kategori/haber" },
  { label: "Rehberler", href: "/kategori/rehber" },
  { label: "Analizler", href: "/kategori/analiz" },
  { label: "Hakkımızda", href: "/hakkimizda" },
  { label: "İletişim", href: "/iletisim" }
];
