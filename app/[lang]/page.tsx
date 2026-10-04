import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, localePath, tr } from "@/lib/i18n";
import { FALLBACK, getContext, pageMetadata, siteUrl } from "@/lib/data";
import { imagePosition, imageUrl } from "@/lib/sanity/image";
import Backdrop from "@/components/Backdrop";
import SectionHeading from "@/components/SectionHeading";
import RugBand from "@/components/RugBand";
import ReviewList from "@/components/ReviewList";
import CtaBand from "@/components/CtaBand";
import { ArrowIcon, WhatsAppIcon } from "@/components/icons";

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  return isLocale(lang) ? pageMetadata(lang, "/") : {};
}

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const ctx = await getContext(lang);
  const { home, pages, settings: s, dict, reviews } = ctx;

  const heroTitle = tr(home?.hero?.title, lang) || ctx.campName;
  const heroSub = tr(home?.hero?.subtitle, lang);
  const badge = tr(home?.hero?.badge, lang);
  const intro = home?.about?.paragraphs?.[0];

  // Three big photos that lead to the main pages. Photo and text come from each page's header in the Studio.
  const doors = [
    { href: "/cabins", label: dict.navCabins, header: pages?.cabins, fallback: "/images/cabin-1.jpg" },
    { href: "/experiences", label: dict.navExperiences, header: pages?.experiences, fallback: "/images/reef.jpg" },
    { href: "/gallery", label: dict.navGallery, header: pages?.gallery, fallback: FALLBACK.hero },
  ];

  const base = siteUrl(s?.siteUrl);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: ctx.campName,
    description: tr(s?.metaDescription, lang) || heroSub,
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

      <section className="hero">
        <Backdrop
          src={imageUrl(home?.hero?.image, FALLBACK.hero)}
          position={imagePosition(home?.hero?.image)}
          mobileSrc={imageUrl(home?.hero?.mobileImage)}
          mobilePosition={imagePosition(home?.hero?.mobileImage)}
          priority
        />
        <div className="container hero-inner">
          {badge && <p className="hero-badge">{badge}</p>}
          <h1 className="display hero-title">{heroTitle}</h1>
          {heroSub && <p className="hero-sub">{heroSub}</p>}
          <div className="hero-actions">
            <Link className="btn btn-red" href={localePath(lang, "/booking")}>{dict.heroCta}</Link>
            {s?.vrTourUrl && (
              <Link className="btn btn-sand btn-tour" href={localePath(lang, "/tour")}>
                <span className="tour-badge" dir="ltr" aria-hidden="true">360°</span> {dict.tourCta}
              </Link>
            )}
            {ctx.waUrl && (
              <a className="btn btn-ghost-light" href={ctx.waUrl} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon size={16} /> {dict.whatsappUs}
              </a>
            )}
          </div>
        </div>
        <RugBand className="rug-bottom" />
      </section>

      <section className="section intro">
        <div className="container intro-grid">
          <div>
            <SectionHeading heading={home?.about?.heading} lang={lang} />
            {intro && <p className="lead">{tr(intro, lang)}</p>}
            <Link className="text-link" href={localePath(lang, "/about")}>{dict.ourStory} <ArrowIcon /></Link>
          </div>
          {!!home?.about?.stats?.length && (
            <dl className="stats">
              {home.about.stats.map((st) => (
                <div key={st._key}>
                  <dt>{tr(st.label, lang)}</dt>
                  <dd dir="ltr">{st.value}</dd>
                </div>
              ))}
              {s?.rating ? (
                <div>
                  <dt>{dict.ratedByGuests}</dt>
                  <dd dir="ltr">{s.rating.toFixed(1)}</dd>
                </div>
              ) : null}
            </dl>
          )}
        </div>
      </section>

      <section className="doors" aria-label={dict.footerExplore}>
        {doors.map((d) => {
          const src = imageUrl(d.header?.image, d.fallback);
          const text = tr(d.header?.intro, lang);
          return (
            <Link key={d.href} className="door" href={localePath(lang, d.href)}>
              <Image src={src} alt="" fill sizes="(max-width: 860px) 100vw, 34vw" style={{ objectPosition: imagePosition(d.header?.image) }} />
              <span className="door-text">
                <span className="display door-title">{d.label}</span>
                {text && <span className="door-sub">{text}</span>}
                <span className="door-go"><ArrowIcon /></span>
              </span>
            </Link>
          );
        })}
      </section>

      {reviews.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHeading heading={home?.reviewsHeading} lang={lang} />
            <ReviewList reviews={reviews.slice(0, 1)} rating={s?.rating} reviewCount={s?.reviewCount} lang={lang} dict={dict} />
            {reviews.length > 1 && (
              <Link className="text-link more-reviews" href={`${localePath(lang, "/about")}#reviews`}>{dict.moreReviews} <ArrowIcon /></Link>
            )}
          </div>
        </section>
      )}

      <CtaBand band={home?.ctaBand} lang={lang} dict={dict} waUrl={ctx.waUrl} />
    </>
  );
}
