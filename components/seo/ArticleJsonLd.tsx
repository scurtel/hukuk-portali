import { buildArticlePageSchema } from "@/lib/seo/articleJsonLd";
import type { Post } from "@/types/post";

type ArticleJsonLdProps = {
  post: Post;
};

export function ArticleJsonLd({ post }: ArticleJsonLdProps) {
  const json = JSON.stringify(buildArticlePageSchema(post));
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
