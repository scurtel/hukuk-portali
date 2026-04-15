import type { MetadataRoute } from "next";

import { siteConfig } from "@/lib/site";

function getBaseUrl() {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const configuredUrl = envUrl && envUrl.trim().length > 0 ? envUrl : siteConfig.url;

  return configuredUrl.replace(/\/$/, "");
}

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api"]
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  };
}
