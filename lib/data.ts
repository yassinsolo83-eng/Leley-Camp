import { cache } from "react";
import { sanityFetch } from "./sanity/client";
import { pageQuery } from "./sanity/queries";
import type { PageData } from "./sanity/types";
import type { Metadata } from "next";
import { buildDictionary, localePath, tr, whatsappLink } from "./i18n";
import { imageUrl } from "./sanity/image";
import type { Locale, PageHeader } from "./sanity/types";

export const getPageData = cache(async (): Promise<PageData> => {
  const data = await sanityFetch<Partial<PageData>>(pageQuery);
  return {
    settings: data?.settings ?? null,
    home: data?.home ?? null,
    pages: data?.pages ?? null,
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

export const FALLBACK = { name: "Leley Camp", logo: "/images/logo.jpg", hero: "/images/hero.jpg", about: "/images/camp-exterior.jpg" };


/** Everything most pages need: content, labels in the right language, and shared links. */
export async function getContext(lang: Locale) {
  const data = await getPageData();
  const s = data.settings;
  return {
    ...data,
    lang,
    dict: buildDictionary(data.labels, lang),
    campName: s?.campName || FALLBACK.name,
    logoUrl: imageUrl(s?.logo, FALLBACK.logo),
    waUrl: whatsappLink(s?.whatsappNumber, tr(s?.whatsappMessage, lang)),
  };
}

export type PageContext = Awaited<ReturnType<typeof getContext>>;

/** Title, description, language alternates and sharing image for one page. */
export async function pageMetadata(lang: Locale, path: string, header?: PageHeader | null, fallbackTitle?: string): Promise<Metadata> {
  const { settings, home } = await getPageData();
  const base = siteUrl(settings?.siteUrl);
  const name = settings?.campName || FALLBACK.name;
  const pageTitle = tr(header?.title, lang) || fallbackTitle;
  const title = pageTitle ? `${pageTitle} | ${name}` : tr(settings?.metaTitle, lang) || name;
  const description = tr(header?.intro, lang) || tr(settings?.metaDescription, lang) || tr(home?.hero?.subtitle, lang);
  const og = imageUrl(header?.image) || imageUrl(settings?.ogImage) || `${base}/images/og-image.jpg`;
  const url = localePath(lang, path);

  return {
    metadataBase: new URL(base),
    title,
    description,
    alternates: {
      canonical: url,
      languages: { en: localePath("en", path), ar: localePath("ar", path), "x-default": localePath("en", path) },
    },
    manifest: "/manifest.json",
    icons: { icon: "/images/icon-192.png", apple: "/images/icon-192.png" },
    appleWebApp: { capable: true, title: name, statusBarStyle: "black-translucent" },
    openGraph: {
      type: "website",
      title,
      description,
      siteName: name,
      locale: lang === "ar" ? "ar_EG" : "en_US",
      url,
      images: [{ url: og, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description, images: [og] },
  };
}
