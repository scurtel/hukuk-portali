import type { MetadataRoute } from "next";

import { getAllAuthors } from "@/lib/authors";
import { getAllCategories } from "@/lib/categories";
import { getAllPosts } from "@/lib/posts";
import { getPostHref } from "@/lib/post-urls";
import { siteConfig } from "@/lib/site";

function getBaseUrl() {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const configuredUrl = envUrl && envUrl.trim().length > 0 ? envUrl : siteConfig.url;

  return configuredUrl.replace(/\/$/, "");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();
  const now = new Date();

  let posts: Awaited<ReturnType<typeof getAllPosts>> = [];
  let categories: Awaited<ReturnType<typeof getAllCategories>> = [];
  let authors: Awaited<ReturnType<typeof getAllAuthors>> = [];
  try {
    posts = await getAllPosts();
    categories = await getAllCategories();
    authors = await getAllAuthors();
  } catch {
    // Örn. build ortamında DATABASE_URL henüz Postgres değilse veya DB kapalıysa
    posts = [];
    categories = [];
    authors = [];
  }

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
    url: `${baseUrl}${getPostHref(post)}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "monthly",
    priority: 0.9
  }));

  return [...staticRoutes, ...categoryRoutes, ...authorRoutes, ...postRoutes];
}
