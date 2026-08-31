import type { MetadataRoute } from "next";
import {
  getAvailableCitySlugs,
  getCityInfoBySlug,
  getAvailableStateSlugs,
} from "@/lib/plumbers-local";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function sitemap(): MetadataRoute.Sitemap {
  const cityUrls = getAvailableCitySlugs()
    .map((slug) => {
      const city = getCityInfoBySlug(slug);

      if (!city) return null;

      return {
        url: `${siteUrl}/plumbers/${slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.7,
      };
    })
    .filter(
      (item): item is NonNullable<typeof item> => item !== null,
    );

  const stateUrls = getAvailableStateSlugs().map((stateSlug) => ({
    url: `${siteUrl}/city/${stateSlug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.75,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/cities`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...stateUrls,
    ...cityUrls,
  ];
}