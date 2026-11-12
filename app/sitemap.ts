import type { MetadataRoute } from "next";
import { getPageData, siteUrl } from "@/lib/data";

const PATHS = ["", "/cabins", "/experiences", "/gallery", "/tour", "/booking", "/about"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { cabins, settings, updatedAt } = await getPageData();
  const base = siteUrl(settings?.siteUrl);
  const entries = [
    ...PATHS.map((path) => ({ path, modified: updatedAt })),
    ...cabins.map((c) => ({ path: `/cabins/${c.slug}`, modified: c._updatedAt ?? updatedAt })),
  ];
  return entries.flatMap(({ path, modified }) =>
    ["en", "ar"].map((lang) => ({
      url: `${base}/${lang}${path}`,
      ...(modified ? { lastModified: new Date(modified) } : {}),
      alternates: { languages: { en: `${base}/en${path}`, ar: `${base}/ar${path}` } },
    }))
  );
}
