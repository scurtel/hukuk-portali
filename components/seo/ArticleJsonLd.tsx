import { buildArticlePageSchema } from "@/lib/seo/articleJsonLd";
import type { Author } from "@/types/author";
import type { Post } from "@/types/post";

type ArticleJsonLdProps = {
  post: Post;
  author: Author | undefined;
};

export function ArticleJsonLd({ post, author }: ArticleJsonLdProps) {
  const json = JSON.stringify(buildArticlePageSchema(post, author));
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
