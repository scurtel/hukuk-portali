import { PLATFORM_EDITORIAL_ID, PLATFORM_ORGANIZATION_ID } from "@/lib/seo/platform";
import { siteConfig } from "@/lib/site";
import type { Post } from "@/types/post";

/** Kart ve iç linklerle uyumlu kanonik yol (analiz → `/analizler/...`) */
export function getPostCanonicalPath(post: Post): string {
  if (post.type === "analiz") return `/analizler/${post.slug}`;
  return `/${post.type}/${post.slug}`;
}

export function getPostCanonicalUrl(post: Post): string {
  return `${siteConfig.url}${getPostCanonicalPath(post)}`;
}

function publishedToIso(publishedAt: string): string {
  return `${publishedAt}T08:00:00+03:00`;
}

export function buildArticlePageSchema(post: Post): Record<string, unknown> {
  const pageUrl = getPostCanonicalUrl(post);

  const articleType = post.type === "haber" ? "NewsArticle" : "Article";

  const organization = {
    "@type": "Organization",
    "@id": PLATFORM_ORGANIZATION_ID,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      url: `${siteConfig.url}/images/logo.png`
    }
  };

  const editorialTeam = {
    "@type": "Organization",
    "@id": PLATFORM_EDITORIAL_ID,
    name: "Hukukportali Editör Ekibi",
    url: siteConfig.url,
    parentOrganization: { "@id": PLATFORM_ORGANIZATION_ID }
  };

  const graph: Record<string, unknown>[] = [organization, editorialTeam];

  const published = publishedToIso(post.publishedAt);

  graph.push({
    "@type": articleType,
    "@id": `${pageUrl}#article`,
    headline: post.title,
    description: post.seo?.metaDescription ?? post.excerpt,
    datePublished: published,
    dateModified: published,
    author: { "@id": PLATFORM_EDITORIAL_ID },
    publisher: { "@id": PLATFORM_ORGANIZATION_ID },
    mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
    url: pageUrl,
    inLanguage: "tr-TR",
    articleSection: post.categorySlug
  });

  if (post.faq?.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      mainEntity: post.faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer
        }
      }))
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph
  };
}
