import type { MetadataRoute } from "next";

import { authors } from "@/lib/authors";
import { categories } from "@/lib/categories";
import { posts } from "@/lib/posts";
import { siteConfig } from "@/lib/site";

function getBaseUrl() {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const configuredUrl = envUrl && envUrl.trim().length > 0 ? envUrl : siteConfig.url;

  return configuredUrl.replace(/\/$/, "");
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const now = new Date();

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
    }
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/kategori/${category.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8
  }));

  const authorRoutes: MetadataRoute.Sitemap = authors.map((author) => ({
    url: `${baseUrl}/yazar/${author.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/${post.type}/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.9
  }));

  return [...staticRoutes, ...categoryRoutes, ...authorRoutes, ...postRoutes];
}
