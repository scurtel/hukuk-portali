/** Canonical public profile / site for structured data @id stability */
export const CEREN_OFFICIAL_SITE = "https://cerensumer.av.tr";

export const CEREN_PERSON_ID = `${CEREN_OFFICIAL_SITE}/#person`;
export const CEREN_ATTORNEY_ID = `${CEREN_OFFICIAL_SITE}/#attorney`;

export const CEREN_SAME_AS = [
  CEREN_OFFICIAL_SITE,
  "https://www.facebook.com/cerensumercilli/",
  "https://www.instagram.com/av.cerensumercilli/",
  "https://www.linkedin.com/in/avukat-ceren-s%C3%BCmer-cilli-375873b0/",
  "https://www.google.com/maps/search/?api=1&query=Avukat+Ceren+S%C3%BCmer+Cilli+Adana"
] as const;

export const CEREN_KNOWS_ABOUT = [
  "Anlaşmalı boşanma",
  "Çekişmeli boşanma",
  "Mal paylaşımı",
  "Ortaklığın giderilmesi (izale-i şuyu)",
  "Gayrimenkul hukuku",
  "Miras hukuku"
] as const;

export const PRIMARY_AUTHOR_SLUG = "av-ceren-sumer-cilli";

export function buildCerenAboutPageSchemaGraph() {
  const person = {
    "@type": "Person",
    "@id": CEREN_PERSON_ID,
    name: "Avukat Ceren Sümer Cilli",
    jobTitle: "Avukat",
    url: CEREN_OFFICIAL_SITE,
    sameAs: [...CEREN_SAME_AS],
    knowsAbout: [...CEREN_KNOWS_ABOUT],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Adana",
      addressCountry: "TR"
    }
  };

  const attorney = {
    "@type": "Attorney",
    "@id": CEREN_ATTORNEY_ID,
    name: "Avukat Ceren Sümer Cilli",
    url: CEREN_OFFICIAL_SITE,
    sameAs: [...CEREN_SAME_AS],
    knowsAbout: [...CEREN_KNOWS_ABOUT],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Adana",
      addressCountry: "TR"
    },
    employee: { "@id": CEREN_PERSON_ID }
  };

  return [person, attorney];
}

export type FaqItem = { question: string; answer: string };

export const CEREN_ABOUT_FAQ: FaqItem[] = [
  {
    question: "Anlaşmalı boşanma ne kadar sürer?",
    answer:
      "Anlaşmalı boşanmada süre; protokolün hazırlanması, gerekli belgelerin tamamlanması, mahkeme takvimi ve duruşma planına göre değişir. Tarafların uzlaşması ve evrakların eksiksiz olması süreci hızlandırır. Kesin süre için dosyanın ayrıntılarına göre değerlendirme yapılması gerekir."
  },
  {
    question: "İzale-i şuyu davası nasıl açılır?",
    answer:
      "İzale-i şuyu (ortaklığın giderilmesi) genellikle paylı mülkiyetteki taşınmazın paydaşları arasında, payın satışı veya diğer çözüm yolları üzerinden ortaklığın sona erdirilmesi amacıyla açılır. Usule uygun dilekçe, tapu kayıtları ve dayanak belgelerle yetkili mahkemeye başvuru yapılır. Pay oranları ve kayıt durumu dava yolunu ve talep konusunu doğrudan etkiler."
  },
  {
    question: "Mal paylaşımı davasında nelere dikkat edilir?",
    answer:
      "Edinilmiş mallara katılma rejimi veya seçilmiş başka bir rejim, evlilik süresi, malların kaynağı ve borçlar gibi unsurlar mal rejimi tasfiyesinin omurgasını oluşturur. Belgelerin sistematik biçimde toplanması ve hukuki sürelerin izlenmesi sürecin güvenli yürütülmesi için önemlidir."
  },
  {
    question: "Miras hukukunda mirasçılık belgesi ne işe yarar?",
    answer:
      "Mirasçılık belgesi, miras bırakanın mirasçılarını ve paylarını gösteren resmi bir kayıttır. Birçok işlemde (örneğin tapu ve banka süreçlerinde) yetkinin ve payların ispatında başvurulan temel belgelerden biridir."
  }
];

export function buildFaqPageSchema(faq: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };
}
