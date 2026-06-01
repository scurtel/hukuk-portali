import type { MetadataRoute } from "next";

import { getAllCategories } from "@/lib/categories";
import { getAllPosts } from "@/lib/posts";
import { TOPICS } from "@/lib/topics";
import { getPostHref } from "@/lib/post-urls";
import { getSiteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const now = new Date();

  const posts = getAllPosts();
  const categories = getAllCategories();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1
    },
    {
      url: `${baseUrl}/hakkimizda`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7
    },
    {
      url: `${baseUrl}/iletisim`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6
    },
    {
      url: `${baseUrl}/haberler`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.85
    },
    {
      url: `${baseUrl}/arama`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5
    }
  ];

  const topicRoutes: MetadataRoute.Sitemap = TOPICS.map((topic) => ({
    url: `${baseUrl}/konu/${topic.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.85
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/kategori/${category.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => {
    const lastModifiedSource = post.updatedAt ?? post.publishedAt;

    return {
      url: `${baseUrl}${getPostHref(post)}`,
      lastModified: new Date(lastModifiedSource),
      changeFrequency: "monthly",
      priority: 0.9
    };
  });

  return [...staticRoutes, ...topicRoutes, ...categoryRoutes, ...postRoutes];
}
