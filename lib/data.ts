import { cache } from "react";
import { sanityFetch } from "./sanity/client";
import { pageQuery } from "./sanity/queries";
import type { PageData } from "./sanity/types";

export const getPageData = cache(async (): Promise<PageData> => {
  const data = await sanityFetch<Partial<PageData>>(pageQuery);
  return {
    settings: data?.settings ?? null,
    home: data?.home ?? null,
    labels: data?.labels ?? null,
    cabins: data?.cabins ?? [],
    activities: data?.activities ?? [],
    prices: data?.prices ?? [],
    reviews: data?.reviews ?? [],
  };
});

export function siteUrl(fromSettings?: string) {
  return (process.env.NEXT_PUBLIC_SITE_URL || fromSettings || "http://localhost:3000").replace(/\/$/, "");
}
