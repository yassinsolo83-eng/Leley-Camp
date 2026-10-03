import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const languages = { en: `${base}/en`, ar: `${base}/ar` };
  return ["en", "ar"].map((lang) => ({
    url: `${base}/${lang}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: lang === "en" ? 1 : 0.9,
    alternates: { languages },
  }));
}
