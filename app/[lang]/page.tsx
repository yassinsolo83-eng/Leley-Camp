import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, localePath, tr } from "@/lib/i18n";
import { FALLBACK, getContext, pageMetadata, siteUrl } from "@/lib/data";
import { imageUrl } from "@/lib/sanity/image";
import SectionHeading from "@/components/SectionHeading";
import RugBand from "@/components/RugBand";
import CabinCard from "@/components/CabinCard";
import ReviewList from "@/components/ReviewList";
import VrTour from "@/components/VrTour";
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
  const { home, settings: s, dict, cabins, activities, reviews } = ctx;

  const heroTitle = tr(home?.hero?.title, lang) || ctx.campName;
  const heroSub = tr(home?.hero?.subtitle, lang);
  const badge = tr(home?.hero?.badge, lang);
  const intro = home?.about?.paragraphs?.[0];
  const photos = (home?.gallery ?? []).slice(0, 6).map((g) => ({ key: g._key, src: imageUrl(g.image), alt: tr(g.alt, lang) })).filter((g) => g.src);

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
        <Image src={imageUrl(home?.hero?.image, FALLBACK.hero)} alt="" fill priority sizes="100vw" className="hero-img" />
        <div className="container hero-inner">
          {badge && <p className="hero-badge">{badge}</p>}
          <h1 className="display hero-title">{heroTitle}</h1>
          {heroSub && <p className="hero-sub">{heroSub}</p>}
          <div className="hero-actions">
            <Link className="btn btn-red" href={localePath(lang, "/booking")}>{dict.heroCta}</Link>
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
          <div className="intro-side">
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
        </div>
      </section>

      {cabins.length > 0 && (
        <section className="section section-paper">
          <div className="container">
            <SectionHeading heading={home?.cabinsHeading} lang={lang}>
              <Link className="text-link" href={localePath(lang, "/cabins")}>{dict.allCabins} <ArrowIcon /></Link>
            </SectionHeading>
            <div className="cabin-grid">
              {cabins.slice(0, 3).map((c) => <CabinCard key={c._id} cabin={c} lang={lang} cta={dict.viewCabin} />)}
            </div>
          </div>
        </section>
      )}

      {activities.length > 0 && (
        <section className="section section-deep">
          <div className="container">
            <SectionHeading heading={home?.activitiesHeading} lang={lang}>
              <Link className="text-link" href={localePath(lang, "/experiences")}>{dict.allExperiences} <ArrowIcon /></Link>
            </SectionHeading>
            <ul className="exp-strip">
              {activities.map((a) => {
                const src = imageUrl(a.image);
                return (
                  <li key={a._id}>
                    <div className="exp-strip-img">{src && <Image src={src} alt="" fill sizes="(max-width: 760px) 100vw, 33vw" />}</div>
                    <h3>{a.icon ? <span aria-hidden="true">{a.icon} </span> : null}{tr(a.name, lang)}</h3>
                    <p>{tr(a.description, lang)}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {reviews.length > 0 && (
        <section className="section">
          <div className="container">
            <SectionHeading heading={home?.reviewsHeading} lang={lang} />
            <ReviewList reviews={reviews} rating={s?.rating} reviewCount={s?.reviewCount} lang={lang} dict={dict} />
          </div>
        </section>
      )}

      {s?.vrTourUrl && (
        <section className="vr-section">
          <VrTour
            url={s.vrTourUrl}
            title={tr(home?.vrSection?.title, lang) || dict.vrCard}
            subtitle={tr(home?.vrSection?.subtitle, lang)}
            posterUrl={imageUrl(home?.about?.image, FALLBACK.about)}
            dict={dict}
          />
        </section>
      )}

      {photos.length > 0 && (
        <section className="section section-paper">
          <div className="container">
            <SectionHeading heading={home?.galleryHeading} lang={lang}>
              <Link className="text-link" href={localePath(lang, "/gallery")}>{dict.seeAllPhotos} <ArrowIcon /></Link>
            </SectionHeading>
            <div className="photo-strip">
              {photos.map((p) => (
                <Link key={p.key} href={localePath(lang, "/gallery")} className="photo-strip-item" aria-label={p.alt || dict.navGallery}>
                  <Image src={p.src} alt={p.alt} fill sizes="(max-width: 760px) 50vw, 17vw" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand band={home?.ctaBand} lang={lang} dict={dict} waUrl={ctx.waUrl} />
    </>
  );
}
