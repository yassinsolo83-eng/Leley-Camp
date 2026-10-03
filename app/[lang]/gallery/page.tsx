import { notFound } from "next/navigation";
import { isLocale, tr } from "@/lib/i18n";
import { FALLBACK, getContext, getPageData, pageMetadata } from "@/lib/data";
import { imagePosition, imageUrl } from "@/lib/sanity/image";
import PageHero from "@/components/PageHero";
import SectionHeading from "@/components/SectionHeading";
import GalleryGrid from "@/components/GalleryGrid";
import VrTour from "@/components/VrTour";

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps<"/[lang]/gallery">) {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const { pages, labels } = await getPageData();
  return pageMetadata(lang, "/gallery", pages?.gallery, tr(labels?.navGallery, lang) || "Gallery");
}

export default async function GalleryPage({ params }: PageProps<"/[lang]/gallery">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const ctx = await getContext(lang);
  const { home, pages, dict, settings: s } = ctx;

  const items = (home?.gallery ?? [])
    .map((g) => ({ key: g._key, src: imageUrl(g.image), alt: tr(g.alt, lang) || ctx.campName, wide: Boolean(g.wide), pos: imagePosition(g.image) }))
    .filter((g) => g.src);
  const poster = imageUrl(home?.videoPoster);

  return (
    <>
      <PageHero header={pages?.gallery} lang={lang} fallbackTitle={dict.navGallery} fallbackImage={FALLBACK.hero} />
      <section className="section">
        <div className="container">
          <GalleryGrid items={items} labels={{ close: dict.close, previous: dict.previous, next: dict.next }} />
        </div>
      </section>

      {home?.videoUrl && (
        <section className="section section-deep">
          <div className="container video-wrap">
            <SectionHeading heading={pages?.videoHeading} lang={lang} />
            <video controls playsInline preload="metadata" poster={poster || undefined}>
              <source src={home.videoUrl} type="video/mp4" />
            </video>
          </div>
        </section>
      )}

      {s?.vrTourUrl && (
        <section className="vr-section">
          <VrTour
            url={s.vrTourUrl}
            title={tr(home?.vrSection?.title, lang) || dict.vrCard}
            subtitle={tr(home?.vrSection?.subtitle, lang)}
            posterUrl={imageUrl(home?.vrSection?.image, "") || imageUrl(home?.about?.image, FALLBACK.about)}
            posterPosition={imagePosition(home?.vrSection?.image || home?.about?.image)}
            dict={dict}
          />
        </section>
      )}
    </>
  );
}
