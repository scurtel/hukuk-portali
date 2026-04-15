import type { Metadata } from "next";

import { siteConfig } from "@/lib/site";

type BuildSeoInput = {
  title: string;
  description?: string;
};

export function buildSeo({ title, description }: BuildSeoInput): Metadata {
  return {
    title: `${title} | ${siteConfig.name}`,
    description: description ?? siteConfig.description
  };
}
