export const siteConfig = {
  name: "Hukuk Portalı",
  url: "https://hukukportali.com",
  tagline: "Hukuk, Yapay Zekâ ve Dijital Dönüşüm Portalı",
  description:
    "Avukatlar ve hukuk büroları için yapay zekâ, dijital dönüşüm ve hukuk haberleri. Mevzuat, yargı kararları ve teknoloji gündemi."
};

export function getSiteUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  let configuredUrl = envUrl && envUrl.length > 0 ? envUrl : siteConfig.url;
  if (!/^https?:\/\//i.test(configuredUrl)) {
    configuredUrl = `https://${configuredUrl}`;
  }
  return configuredUrl.replace(/\/$/, "");
}

export type NavItem = {
  label: string;
  href: string;
};

export const navItems: NavItem[] = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Haberler", href: "/kategori/haber" },
  { label: "Yapay Zekâ", href: "/konu/yapay-zeka" },
  { label: "Hukuk Teknolojileri", href: "/#hukuk-teknolojileri" },
  { label: "Rehberler", href: "/kategori/rehber" },
  { label: "Analizler", href: "/kategori/analiz" },
  { label: "Mevzuat", href: "/konu/mevzuat" },
  { label: "İletişim", href: "/iletisim" }
];

export const footerNavGroups = [
  {
    title: "Kategoriler",
    links: [
      { label: "Haberler", href: "/kategori/haber" },
      { label: "Rehberler", href: "/kategori/rehber" },
      { label: "Analizler", href: "/kategori/analiz" },
      { label: "Yapay Zekâ", href: "/konu/yapay-zeka" },
      { label: "Arama", href: "/arama" }
    ]
  },
  {
    title: "Kurumsal",
    links: [
      { label: "Hakkımızda", href: "/hakkimizda" },
      { label: "İletişim", href: "/iletisim" },
      { label: "Tüm Haberler", href: "/haberler" }
    ]
  }
] as const;
