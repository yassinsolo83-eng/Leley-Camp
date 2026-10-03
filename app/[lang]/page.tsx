import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildDictionary, isLocale, otherLocale, tr, whatsappLink } from "@/lib/i18n";
import { getPageData, siteUrl } from "@/lib/data";
import { imageUrl } from "@/lib/sanity/image";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import VrTour from "@/components/VrTour";
import About from "@/components/About";
import Cabins from "@/components/Cabins";
import Prices from "@/components/Prices";
import Activities from "@/components/Activities";
import Reviews from "@/components/Reviews";
import Gallery, { type GalleryItem } from "@/components/Gallery";
import Video from "@/components/Video";
import ReserveForm from "@/components/ReserveForm";
import BookLinks from "@/components/BookLinks";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import SectionHeading from "@/components/SectionHeading";

// Content from the Studio shows up on the site within a minute (or instantly with the webhook).
export const revalidate = 60;

const FALLBACK = { name: "Leley Camp", logo: "/images/logo.jpg", hero: "/images/hero.jpg", about: "/images/camp-exterior.jpg" };

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { settings, home } = await getPageData();
  const base = siteUrl(settings?.siteUrl);
  const name = settings?.campName || FALLBACK.name;
  const title = tr(settings?.metaTitle, lang) || name;
  const description = tr(settings?.metaDescription, lang) || tr(home?.hero?.subtitle, lang);
  const og = imageUrl(settings?.ogImage) || `${base}/images/og-image.jpg`;

  return {
    metadataBase: new URL(base),
    title,
    description,
    alternates: { canonical: `/${lang}`, languages: { en: "/en", ar: "/ar", "x-default": "/en" } },
    manifest: "/manifest.json",
    icons: { icon: "/images/icon-192.png", apple: "/images/icon-192.png" },
    appleWebApp: { capable: true, title: name, statusBarStyle: "black-translucent" },
    openGraph: {
      type: "website",
      title,
      description,
      siteName: name,
      locale: lang === "ar" ? "ar_EG" : "en_US",
      url: `/${lang}`,
      images: [{ url: og, width: 1200, height: 630 }],
    },
    twitter: { card: "summary_large_image", title, description, images: [og] },
  };
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const { settings: s, home, labels, cabins, activities, prices, reviews } = await getPageData();
  const dict = buildDictionary(labels, lang);
  const other = otherLocale(lang);

  const campName = s?.campName || FALLBACK.name;
  const logoUrl = imageUrl(s?.logo, FALLBACK.logo);
  const waUrl = whatsappLink(s?.whatsappNumber, tr(s?.whatsappMessage, lang));
  const switchLabel = labels?.languageName?.[other] || (other === "ar" ? "AR" : "English");

  const gallery: GalleryItem[] = (home?.gallery ?? [])
    .map((g) => ({ key: g._key, src: imageUrl(g.image), alt: tr(g.alt, lang) || campName, wide: Boolean(g.wide) }))
    .filter((g) => g.src);

  const base = siteUrl(s?.siteUrl);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: campName,
    description: tr(s?.metaDescription, lang) || tr(home?.hero?.subtitle, lang),
    url: `${base}/${lang}`,
    telephone: s?.whatsappNumber ? `+${s.whatsappNumber}` : undefined,
    image: imageUrl(home?.hero?.image) || `${base}${FALLBACK.hero}`,
    address: { "@type": "PostalAddress", addressLocality: "Nuweiba", addressRegion: "South Sinai", addressCountry: "EG" },
    geo: { "@type": "GeoCoordinates", latitude: "29.0333", longitude: "34.6667" },
    aggregateRating: s?.rating && s?.reviewCount
      ? { "@type": "AggregateRating", ratingValue: String(s.rating), reviewCount: String(s.reviewCount) }
      : undefined,
    sameAs: [s?.facebookUrl, s?.instagramUrl, s?.bookingUrl].filter(Boolean),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Header
        campName={campName}
        logoUrl={logoUrl}
        whatsappUrl={waUrl}
        switchHref={`/${other}`}
        switchLabel={switchLabel}
        switchLang={other}
        showPrices={prices.length > 0}
        dict={dict}
      />
      <main>
        <Hero
          badge={tr(home?.hero?.badge, lang)}
          title={home?.hero?.title || campName}
          subtitle={tr(home?.hero?.subtitle, lang)}
          imageUrl={imageUrl(home?.hero?.image, FALLBACK.hero)}
          logoUrl={logoUrl}
          whatsappUrl={waUrl}
          dict={dict}
        />
        {s?.vrTourUrl && (
          <VrTour url={s.vrTourUrl} title={tr(home?.vrSection?.title, lang) || dict.vrCard} subtitle={tr(home?.vrSection?.subtitle, lang)} dict={dict} />
        )}
        <About
          about={home?.about}
          imageUrl={imageUrl(home?.about?.image, FALLBACK.about)}
          rating={s?.rating}
          whatsappUrl={waUrl}
          phoneDisplay={s?.phoneDisplay}
          mapsUrl={s?.mapsUrl}
          lang={lang}
          dict={dict}
        />
        <Cabins heading={home?.cabinsHeading} cabins={cabins} lang={lang} />
        <Prices heading={home?.pricesHeading} plans={prices} lang={lang} dict={dict} />
        <Activities heading={home?.activitiesHeading} activities={activities} lang={lang} />
        <Reviews heading={home?.reviewsHeading} reviews={reviews} rating={s?.rating} lang={lang} dict={dict} />
        <Gallery items={gallery} heading={<SectionHeading heading={home?.galleryHeading} lang={lang} />} dict={dict} />
        <Video heading={home?.videoHeading} videoUrl={home?.videoUrl || ""} posterUrl={imageUrl(home?.videoPoster)} lang={lang} />
        <ReserveForm
          heading={<SectionHeading heading={home?.inquiryHeading} lang={lang} />}
          cabins={cabins.map((c) => ({ value: tr(c.name, "en"), label: tr(c.name, lang) })).filter((o) => o.value)}
          plans={prices.map((p) => ({ value: tr(p.name, "en"), label: tr(p.name, lang) })).filter((o) => o.value)}
          whatsappNumber={s?.whatsappNumber}
          lang={lang}
          dict={dict}
        />
        <BookLinks
          heading={<SectionHeading heading={home?.bookHeading} lang={lang} center />}
          bookingUrl={s?.bookingUrl}
          vrTourUrl={s?.vrTourUrl}
          facebookUrl={s?.facebookUrl}
          instagramUrl={s?.instagramUrl}
          instagramHandle={s?.instagramHandle}
          dict={dict}
        />
      </main>
      <Footer
        campName={campName}
        logoUrl={logoUrl}
        footerText={tr(s?.footerText, lang)}
        whatsappUrl={waUrl}
        phoneDisplay={s?.phoneDisplay}
        mapsUrl={s?.mapsUrl}
        bookingUrl={s?.bookingUrl}
        vrTourUrl={s?.vrTourUrl}
        facebookUrl={s?.facebookUrl}
        instagramUrl={s?.instagramUrl}
        showCounter={s?.showVisitorCounter !== false}
        counterOffset={s?.visitorCounterOffset ?? 0}
        lang={lang}
        dict={dict}
      />
      <WhatsAppFloat href={waUrl} label={dict.chatWithUs} />
    </>
  );
}
