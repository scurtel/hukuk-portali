import { getSiteUrl, siteConfig } from "@/lib/site";

import { buildFaqPageSchema, type FaqItem } from "./cerenLawyer";

export { buildFaqPageSchema };
export type { FaqItem };

const siteUrl = getSiteUrl();
export const PLATFORM_ORGANIZATION_ID = `${siteUrl}/#organization`;
export const PLATFORM_EDITORIAL_ID = `${siteUrl}/#editorial-team`;

export const PLATFORM_ABOUT_FAQ: FaqItem[] = [
  {
    question: "Hukukportali.com bir avukatlık bürosu veya reklam sitesi midir?",
    answer:
      "Hayır. Hukukportali.com, hukuk ile yapay zekâyı bir araya getiren bağımsız bir dijital yayın ve teknoloji platformudur. Bir hukuk bürosunun tanıtım veya kişisel avukatlık reklam sitesi değildir."
  },
  {
    question: "Platformda yayımlanan içerikler hukuki danışmanlık yerine geçer mi?",
    answer:
      "Hayır. Sitedeki haber, rehber ve analizler genel bilgilendirme amaçlıdır. Somut uyuşmazlıklar için doğrudan hukuki danışmanlık yerine geçmez; dosyanızın özelliklerine göre uzman değerlendirmesi gerekir."
  },
  {
    question: "Hukukportali.com kimlere yöneliktir?",
    answer:
      "Avukatlar, hukuk büroları ve hukuk alanında çalışan profesyonellere yapay zekâ destekli içerik, analiz, doküman ve dijital dönüşüm konularında bilgi sunar. Aynı zamanda mevzuat, yargı kararları, teknoloji ve hukuk gündemine dair haberler yayımlar."
  },
  {
    question: "Yapay zekâ ve hukuk teknolojileri içeriklerine nereden ulaşabilirim?",
    answer:
      "Ana sayfadaki rehber ve analiz bölümlerinde; özellikle yapay zekâ, dilekçe hazırlığı ve hukuk büroları için dijital dönüşüm başlıklı içeriklerde bu konulara ilişkin güncel makaleler bulunur."
  }
];

export function buildPlatformAboutPageSchemaGraph(): Record<string, unknown>[] {
  return [
    {
      "@type": "Organization",
      "@id": PLATFORM_ORGANIZATION_ID,
      name: siteConfig.name,
      url: siteUrl,
      description: siteConfig.description,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/images/logo.png`
      }
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: siteConfig.name,
      url: siteUrl,
      publisher: { "@id": PLATFORM_ORGANIZATION_ID },
      inLanguage: "tr-TR"
    }
  ];
}
