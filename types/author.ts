export type Author = {
  id: string;
  slug: string;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  /** Resmî büro sitesi — E-E-A-T kartı ve danışmanlık CTA hedefi */
  officialWebsite?: string;
  /** Uzmanlık etiketleri (makale altı profil) */
  expertise?: string[];
};
