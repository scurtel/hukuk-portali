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
      "Anlaşmalı boşanmanın süresi; tarafların boşanma protokolü üzerinde uzlaşmasına, gerekli belgelerin eksiksiz hazırlanmasına, mahkemenin iş yoğunluğuna ve duruşma tarihine göre değişir. Tarafların tüm konularda anlaşmış olması süreci hızlandırabilir. Ancak kesin süre, dosyanın bulunduğu mahkeme ve somut olayın özelliklerine göre değerlendirilmelidir."
  },
  {
    question: "Çekişmeli boşanma davasında hangi deliller önemlidir?",
    answer:
      "Çekişmeli boşanma davalarında tanık beyanları, mesaj kayıtları, sosyal medya içerikleri, banka kayıtları, kolluk tutanakları, sağlık raporları ve tarafların iddialarını destekleyen diğer hukuka uygun deliller önem taşıyabilir. Delillerin hukuka uygun şekilde elde edilmesi ve mahkemeye doğru zamanda sunulması gerekir."
  },
  {
    question: "Mal paylaşımı davasında nelere dikkat edilir?",
    answer:
      "Mal paylaşımı davasında evlilik tarihi, malın edinilme zamanı, tapu kayıtları, ödeme kaynakları, kredi borçları, tarafların katkıları ve uygulanacak mal rejimi dikkate alınır. Eksik belge veya hatalı talep, hak kaybına yol açabileceğinden mal rejimi tasfiyesi sürecinde profesyonel hukuki destek alınması önemlidir."
  },
  {
    question: "İzale-i şuyu davası nasıl açılır?",
    answer:
      "İzale-i şuyu, yani ortaklığın giderilmesi davası; paylı veya elbirliği mülkiyetine konu taşınmazlarda ortaklığın sona erdirilmesi amacıyla açılır. Dava dilekçesi, tapu kayıtları ve ilgili belgelerle görevli ve yetkili mahkemeye başvuru yapılır. Taşınmazın niteliği, pay oranları ve aynen taksimin mümkün olup olmadığı dava sürecinde değerlendirilir."
  },
  {
    question: "Mirasçılık belgesi ne işe yarar?",
    answer:
      "Mirasçılık belgesi, miras bırakanın yasal mirasçılarını ve miras paylarını gösteren resmi belgedir. Tapu işlemleri, banka işlemleri, tereke işlemleri ve miras paylaşımı süreçlerinde mirasçılık sıfatının ispatı için kullanılır."
  },
  {
    question: "Mirasın reddi ne zaman gündeme gelir?",
    answer:
      "Mirasın reddi, miras bırakanın borçlarının mal varlığından fazla olduğu veya mirasçının mirası kabul etmek istemediği durumlarda gündeme gelebilir. Bu işlem belirli süre ve usul kurallarına tabidir. Bu nedenle mirasın reddi konusunda gecikmeden hukuki değerlendirme alınması gerekir."
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
