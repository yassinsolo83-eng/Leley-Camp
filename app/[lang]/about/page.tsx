import Image from "next/image";
import { notFound } from "next/navigation";
import { isLocale, tr } from "@/lib/i18n";
import { FALLBACK, getContext, getPageData, pageMetadata } from "@/lib/data";
import { imagePosition, imageUrl } from "@/lib/sanity/image";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import ReviewList from "@/components/ReviewList";
import BookLinks from "@/components/BookLinks";
import CountUp from "@/components/CountUp";
import { PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/icons";

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { pages, labels } = await getPageData();
  return pageMetadata(lang, "/about", pages?.about, tr(labels?.navAbout, lang) || "About");
}

export default async function AboutPage({ params }: PageProps<"/[lang]/about">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const ctx = await getContext(lang);
  const { home, pages, dict, reviews, settings: s } = ctx;
  const about = home?.about;
  const paragraphs = (about?.paragraphs ?? []).map((p) => tr(p, lang)).filter(Boolean);
  const phoneHref = s?.phoneDisplay ? `tel:+${s.phoneDisplay.replace(/\D/g, "")}` : "";

  return (
    <>
      <PageHero header={pages?.about} lang={lang} fallbackTitle={dict.navAbout} fallbackImage={FALLBACK.about} />

      <section className="section">
        <div className="container story">
          <div className="story-text">
            <SectionHeading heading={about?.heading} lang={lang} />
            {paragraphs.map((p, i) => <p key={i} className={i === 0 ? "lead" : undefined}>{p}</p>)}
            {!!about?.stats?.length && (
              <dl className="stats">
                {about.stats.map((st) => (
                  <div key={st._key}><dt>{tr(st.label, lang)}</dt><dd dir="ltr">{st.value ? <CountUp value={st.value} /> : null}</dd></div>
                ))}
              </dl>
            )}
          </div>
          <div className="story-img">
            <Image src={imageUrl(about?.image, FALLBACK.about)} alt="" fill sizes="(max-width: 860px) 100vw, 45vw" style={{ objectPosition: imagePosition(about?.image) }} />
          </div>
        </div>
      </section>

      {reviews.length > 0 && (
        <section className="section section-paper" id="reviews">
          <div className="container">
            <SectionHeading heading={home?.reviewsHeading} lang={lang} />
            <ReviewList reviews={reviews} rating={s?.rating} reviewCount={s?.reviewCount} lang={lang} dict={dict} />
          </div>
        </section>
      )}

      <section className="section" id="contact">
        <div className="container contact-grid">
          <div>
            <SectionHeading heading={pages?.contactHeading} lang={lang} />
            <ul className="contact-list">
              {ctx.waUrl && (
                <li><a href={ctx.waUrl} target="_blank" rel="noopener noreferrer"><WhatsAppIcon size={18} color="#25D366" /> <span>WhatsApp</span></a></li>
              )}
              {s?.phoneDisplay && (
                <li><a href={phoneHref}><PhoneIcon /> <span>{dict.callUs} · <span dir="ltr">{s.phoneDisplay}</span></span></a></li>
              )}
              {s?.mapsUrl && (
                <li><a href={s.mapsUrl} target="_blank" rel="noopener noreferrer"><PinIcon /> <span>{dict.viewOnMaps}</span></a></li>
              )}
            </ul>
          </div>
          <BookLinks
            bookingUrl={s?.bookingUrl}
            vrTourUrl={s?.vrTourUrl}
            facebookUrl={s?.facebookUrl}
            instagramUrl={s?.instagramUrl}
            instagramHandle={s?.instagramHandle}
            dict={dict}
          />
        </div>
      </section>
    </>
  );
}
