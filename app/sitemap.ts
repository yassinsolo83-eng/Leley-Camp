import type { MetadataRoute } from "next";
import { getPageData, siteUrl } from "@/lib/data";

const PATHS = ["", "/cabins", "/experiences", "/gallery", "/booking", "/about"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { cabins, settings } = await getPageData();
  const base = siteUrl(settings?.siteUrl);
  const paths = [...PATHS, ...cabins.map((c) => `/cabins/${c.slug}`)];
  return paths.flatMap((path) =>
    ["en", "ar"].map((lang) => ({
      url: `${base}/${lang}${path}`,
      lastModified: new Date(),
      alternates: { languages: { en: `${base}/en${path}`, ar: `${base}/ar${path}` } },
    }))
  );
}
