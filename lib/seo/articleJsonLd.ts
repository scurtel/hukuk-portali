import {
  CEREN_KNOWS_ABOUT,
  CEREN_PERSON_ID,
  CEREN_OFFICIAL_SITE,
  CEREN_SAME_AS,
  PRIMARY_AUTHOR_SLUG
} from "@/lib/seo/cerenLawyer";
import { siteConfig } from "@/lib/site";
import type { Author } from "@/types/author";
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

const publisherId = `${siteConfig.url}/#organization`;

export function buildArticlePageSchema(post: Post, author: Author | undefined): Record<string, unknown> {
  const pageUrl = getPostCanonicalUrl(post);
  const isPrimaryAuthor = post.authorSlug === PRIMARY_AUTHOR_SLUG && Boolean(author?.officialWebsite);

  const articleType = post.type === "haber" ? "NewsArticle" : "Article";

  const organization = {
    "@type": "Organization",
    "@id": publisherId,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: {
      "@type": "ImageObject",
      url: `${siteConfig.url}/images/logo.png`
    }
  };

  const authorRef =
    isPrimaryAuthor && author
      ? { "@id": CEREN_PERSON_ID }
      : {
          "@type": "Person",
          name: author?.name ?? siteConfig.name,
          ...(author ? { url: `${siteConfig.url}/yazar/${author.slug}` } : {})
        };

  const graph: Record<string, unknown>[] = [organization];

  if (isPrimaryAuthor && author) {
    graph.push({
      "@type": "Person",
      "@id": CEREN_PERSON_ID,
      name: author.name,
      url: CEREN_OFFICIAL_SITE,
      jobTitle: author.title,
      sameAs: [...CEREN_SAME_AS],
      knowsAbout: [...CEREN_KNOWS_ABOUT]
    });
  }

  const published = publishedToIso(post.publishedAt);

  graph.push({
    "@type": articleType,
    "@id": `${pageUrl}#article`,
    headline: post.title,
    description: post.seo?.metaDescription ?? post.excerpt,
    datePublished: published,
    dateModified: published,
    author: authorRef,
    publisher: { "@id": publisherId },
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
